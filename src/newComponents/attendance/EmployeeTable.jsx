// import React, { useEffect, useState, useRef } from "react";
// import { Eye, Edit2, Trash2, X, Users, CheckCircle, XCircle, Mail, Phone, Printer } from "lucide-react";
// import axios from "axios";

// const AdminAttendance = ({ isEmployeeView = false }) => {
//     const userId = localStorage.getItem("userId");
//     const [data, setData] = useState({ active: [], inactive: [] });
//     const [activeTab, setActiveTab] = useState("active");
//     const [loading, setLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [filterRole, setFilterRole] = useState("All");
//     const [viewModal, setViewModal] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [attendanceMap, setAttendanceMap] = useState({});
//     const [monthlyAttendance, setMonthlyAttendance] = useState([]);
//     const [currentMonth, setCurrentMonth] = useState(new Date());
//     const printRef = useRef(null);
//     const [selectedDateForEdit, setSelectedDateForEdit] = useState(null);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const token = localStorage.getItem("token");
//     // const role = localStorage.getItem("role");
//     const globalRole = localStorage.getItem("role");
//     // console.log(globalRole);

//     const getDesignationName = (employee) => {
//         // console.log(employee);

//         if (typeof employee?.designation === "string") {
//             return employee.designation;
//         }
//         // Handle object with 'designation' property (from MongoDB population)
//         if (employee?.designation && typeof employee.designation === "object") {
//             return employee.designation.designation || employee.designation.title || "Employee";
//         }
//         return "Employee";
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 📦 Fetch Employee & Admin Data (User Details, Not Attendance) */
//     /* -------------------------------------------------------------------------- */
//     const fetchAllData = async () => {
//         try {
//             setLoading(true);

//             // If in employee view, only fetch current employee's data
//             if (isEmployeeView && userId) {
//                 try {
//                     const employeeRes = await axios.get(`http://localhost:4000/employee/getEmployee/${userId}`);
//                     const currentEmployee = employeeRes?.data?.employee || {};

//                     const enrichedEmployee = {
//                         ...currentEmployee,
//                         userType: "Employee",
//                         role: currentEmployee?.designation?.designation || "Employee",
//                         accountActive: true,
//                     };

//                     setData({
//                         active: [enrichedEmployee],
//                         inactive: [],
//                     });

//                     fetchTodayAttendance([enrichedEmployee]);
//                     setLoading(false);
//                     return;
//                 } catch (error) {
//                     console.error("Error fetching employee data:", error);
//                     setLoading(false);
//                     return;
//                 }
//             }

//             const [adminRes, employeeRes] = await Promise.all([
//                 axios.get("http://localhost:4000/getAdmins"),
//                 axios.get("http://localhost:4000/employee/allEmployee"),
//             ]);

//             const adminData = adminRes?.data?.admins || adminRes?.data || [];
//             const employeeData = employeeRes?.data?.employees || employeeRes?.data || [];

//             // Enrich with type for easy identification
//             const enrichedAdmins = adminData.map((admin) => ({
//                 ...admin,
//                 userType: "Admin",
//                 role: "Admin",
//             }));

//             const enrichedEmployees = employeeData.map((emp) => ({
//                 ...emp,
//                 userType: "Employee",
//                 role: emp?.designation || "Employee",
//             }));

//             // Combine all users
//             const allUsers = [...enrichedAdmins, ...enrichedEmployees];

//             // Separate active and inactive based on accountActive field
//             const activeUsers = allUsers.filter((user) => user?.accountActive === true || user?.accountActive === "true");

//             const inactiveUsers = allUsers.filter((user) => user?.accountActive === false || user?.accountActive === "false" || !user?.accountActive);

//             setData({
//                 active: activeUsers,
//                 inactive: inactiveUsers,
//             });

//             // Fetch today's attendance data for all users
//             fetchTodayAttendance(allUsers);
//         } catch (error) {
//             console.error("⚠️ Error fetching data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 📦 Fetch Today's Attendance Data */
//     /* -------------------------------------------------------------------------- */
//     const fetchTodayAttendance = async (allUsers) => {
//         try {
//             // Format today's date to pass as query parameter for optimization
//             const today = new Date().toISOString().split("T")[0];

//             const [adminAttendanceRes, employeeAttendanceRes] = await Promise.all([
//                 axios.get(`http://localhost:4000/adminAttendance/getAllAttendance?date=${today}`),
//                 axios.get(`http://localhost:4000/attendance/getAllAttendance?date=${today}`),
//             ]);

//             // Both endpoints return arrays directly
//             const adminAttendance = Array.isArray(adminAttendanceRes?.data) ? adminAttendanceRes.data : [];
//             const employeeAttendance = Array.isArray(employeeAttendanceRes?.data) ? employeeAttendanceRes.data : [];

//             // Create a map of user attendance
//             const attendanceById = {};

//             // Process admin attendance
//             adminAttendance.forEach((record) => {
//                 try {
//                     // admin field is populated object with _id
//                     const adminId = record?.admin?._id;
//                     if (adminId) {
//                         attendanceById[`admin_${adminId}`] = {
//                             clockIn: record?.clockIn,
//                             clockOut: record?.clockOut,
//                         };
//                     }
//                 } catch (e) {
//                     console.warn("Error processing admin attendance record:", e);
//                 }
//             });

//             // Process employee attendance
//             employeeAttendance.forEach((record) => {
//                 try {
//                     // employee field is populated object with _id
//                     const employeeId = record?.employee?._id;
//                     if (employeeId) {
//                         attendanceById[`employee_${employeeId}`] = {
//                             clockIn: record?.clockIn,
//                             clockOut: record?.clockOut,
//                         };
//                     }
//                 } catch (e) {
//                     console.warn("Error processing employee attendance record:", e);
//                 }
//             });

//             setAttendanceMap(attendanceById);
//         } catch (error) {
//             console.error("⚠️ Error fetching attendance data:", error);
//         }
//     };

//     useEffect(() => {
//         fetchAllData();
//     }, [isEmployeeView, userId]);

//     /* -------------------------------------------------------------------------- */
//     /* 📅 Refetch monthly attendance when month changes */
//     /* -------------------------------------------------------------------------- */
//     useEffect(() => {
//         if (selectedUser && currentMonth) {
//             fetchMonthlyAttendance(selectedUser, currentMonth);
//         }
//     }, [currentMonth, selectedUser?._id]);

//     /* -------------------------------------------------------------------------- */
//     /* 🔍 Filter & Search Data */
//     /* -------------------------------------------------------------------------- */
//     const getFilteredData = () => {
//         const dataToFilter = activeTab === "active" ? data.active : data.inactive;

//         return dataToFilter
//             .filter((user) => {
//                 const name = user?.fullName?.toLowerCase() || "";
//                 const email = user?.email?.toLowerCase() || "";
//                 const phone = user?.phone?.toLowerCase() || "";
//                 const q = searchQuery.toLowerCase();
//                 return name.includes(q) || email.includes(q) || phone.includes(q);
//             })
//             .filter((user) => filterRole === "All" || user?.userType === filterRole || user?.role === filterRole);
//     };

//     const filteredData = getFilteredData();
//     // console.log(filteredData);

//     const totalActive = data.active.length;
//     const totalInactive = data.inactive.length;

//     /* -------------------------------------------------------------------------- */
//     /* 👁️ View User Details Modal */
//     /* -------------------------------------------------------------------------- */
//     const handleViewClick = async (user) => {
//         setSelectedUser(user);
//         setViewModal(true);
//         const newMonth = new Date();
//         setCurrentMonth(newMonth);
//         // Fetch monthly attendance for this user with the current month
//         await fetchMonthlyAttendance(user, newMonth);
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 📊 Fetch Monthly Attendance Data */
//     /* -------------------------------------------------------------------------- */
//     const fetchMonthlyAttendance = async (user, monthToFetch = null) => {
//         try {
//             // Use provided month or fall back to currentMonth
//             const month = monthToFetch || currentMonth;

//             // Get the current month's start and end dates
//             const year = month.getFullYear();
//             const monthNum = month.getMonth();
//             const firstDay = new Date(year, monthNum, 1).toISOString().split("T")[0];
//             const lastDay = new Date(year, monthNum + 1, 0).toISOString().split("T")[0];

//             let attendanceData = [];

//             if (user.userType === "Admin") {
//                 // Fetch only this admin's attendance for the current month
//                 const res = await axios.get(
//                     `http://localhost:4000/adminAttendance/getAllAttendance?adminId=${user._id}&startDate=${firstDay}&endDate=${lastDay}`
//                 );
//                 attendanceData = Array.isArray(res?.data) ? res.data : [];
//             } else {
//                 // Fetch only this employee's attendance for the current month
//                 const res = await axios.get(
//                     `http://localhost:4000/attendance/getAllAttendance?employeeId=${user._id}&startDate=${firstDay}&endDate=${lastDay}`
//                 );
//                 attendanceData = Array.isArray(res?.data) ? res.data : [];
//             }

//             setMonthlyAttendance(attendanceData);
//         } catch (error) {
//             console.error("⚠️ Error fetching monthly attendance:", error);
//             setMonthlyAttendance([]);
//         }
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 📅 Handle Date Card Double Click */
//     /* -------------------------------------------------------------------------- */
//     const handleDateCardDoubleClick = (date, dayRecords) => {
//         setSelectedDateForEdit({
//             date,
//             records: dayRecords || [],
//         });
//         setIsEditModalOpen(true);
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 💾 Save Date Attendance */
//     /* -------------------------------------------------------------------------- */
//     const handleSaveDateAttendance = async (updatedData) => {
//         if (!selectedDateForEdit) return;

//         try {
//             if (selectedDateForEdit.records && selectedDateForEdit.records.length > 0) {
//                 // Update existing record
//                 const attendance = selectedDateForEdit.records[0];
//                 const res = await fetch(`http://localhost:4000/attendance/${attendance._id}`, {
//                     method: "PATCH",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                     body: JSON.stringify(updatedData),
//                 });

//                 if (!res.ok) throw new Error("Failed to update");
//                 const result = await res.json();

//                 // Refresh attendance data
//                 if (selectedUser?._id) {
//                     fetchMonthlyAttendance(selectedUser);
//                 }
//             } else {
//                 // Create new record
//                 const res = await fetch(`http://localhost:4000/attendance`, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                     body: JSON.stringify({
//                         employee: selectedUser._id,
//                         date: new Date(selectedDateForEdit.date),
//                         ...updatedData,
//                     }),
//                 });

//                 if (!res.ok) throw new Error("Failed to create attendance");

//                 // Refresh attendance data
//                 if (selectedUser?._id) {
//                     fetchMonthlyAttendance(selectedUser);
//                 }
//             }

//             setIsEditModalOpen(false);
//             setSelectedDateForEdit(null);
//         } catch (err) {
//             console.error("Error saving attendance:", err);
//             alert("Error saving attendance: " + err.message);
//         }
//     };

//     const getDepartmentName = (user) => {
//         if (typeof user?.department === "string") {
//             return user.department;
//         }
//         // Handle object with various possible property names
//         // Note: Backend populates department with "dep" field
//         return user?.department?.dep || user?.department?.departmentName || user?.department?.name || user?.department?.department || "N/A";
//     };

//     const getCompanyName = (user) => {
//         if (typeof user?.company === "string") {
//             return user.company;
//         }
//         return user?.company?.companyName || "N/A";
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 📊 Calculate Attendance Statistics by Month */
//     /* -------------------------------------------------------------------------- */
//     const calculateAttendanceStats = (attendanceData, month) => {
//         const stats = {
//             present: 0,
//             gracePresent: 0,
//             late: 0,
//             absent: 0,
//             total: 0,
//         };

//         if (!Array.isArray(attendanceData)) return stats;

//         const monthNum = month.getMonth();
//         const yearNum = month.getFullYear();

//         // Filter data for the selected month
//         const monthData = attendanceData.filter((record) => {
//             if (!record?.date) return false;
//             const recordDate = new Date(record.date);
//             return recordDate.getMonth() === monthNum && recordDate.getFullYear() === yearNum;
//         });

//         monthData.forEach((record) => {
//             const status = record?.status || "Absent";

//             if (status === "Present") stats.present++;
//             else if (status === "Grace Present" || status === "Grace") stats.gracePresent++;
//             else if (status === "Late") stats.late++;
//             else if (status === "Absent") stats.absent++;

//             stats.total++;
//         });

//         return stats;
//     };

//     /* -------------------------------------------------------------------------- */
//     /* ✏️ Edit Attendance Modal */
//     /* -------------------------------------------------------------------------- */
//     // Removed old edit modal code - users are now displayed with view-only modal

//     /* -------------------------------------------------------------------------- */
//     /* 💾 Save Attendance Changes */
//     /* -------------------------------------------------------------------------- */
//     // Removed old save edit code

//     /* -------------------------------------------------------------------------- */
//     /* 📅 Date Attendance Edit Modal Component */
//     /* -------------------------------------------------------------------------- */
//     const DateAttendanceEditModal = ({ date, dayRecords, onClose, onSave }) => {
//         const statusOptions = ["Present", "Absent", "Late", "Grace Present", "Half Day", "Sunday", "Holiday"];

//         const formatLocalDateTime = (dateString) => {
//             if (!dateString) return "";
//             const date = new Date(dateString);
//             const offset = date.getTimezoneOffset();
//             const local = new Date(date.getTime() - offset * 60 * 1000);
//             return local.toISOString().slice(0, 16);
//         };

//         const [clockIn, setClockIn] = useState(
//             dayRecords && dayRecords.length > 0 ? formatLocalDateTime(dayRecords[0]?.clockIn) : ""
//         );
//         const [clockOut, setClockOut] = useState(
//             dayRecords && dayRecords.length > 0 ? formatLocalDateTime(dayRecords[0]?.clockOut) : ""
//         );
//         const [status, setStatus] = useState(dayRecords && dayRecords.length > 0 ? dayRecords[0]?.status : "Present");

//         const handleSubmit = () => {
//             const toServerFormat = (localString) => {
//                 if (!localString) return null;
//                 return new Date(localString);
//             };

//             const updatedData = {
//                 clockIn: toServerFormat(clockIn),
//                 clockOut: clockOut ? toServerFormat(clockOut) : null,
//                 status,
//             };

//             onSave(updatedData);
//         };

//         const dateStr = new Date(date).toLocaleDateString("en-IN", {
//             weekday: "long",
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//         });

//         return (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
//                 {/* Modal Card */}
//                 <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
//                     <h2 className="mb-2 text-center text-lg font-semibold">Edit Attendance</h2>
//                     <p className="mb-4 text-center text-sm text-gray-600">{dateStr}</p>

//                     <div className="space-y-4">
//                         {/* Clock In */}
//                         <div>
//                             <label className="mb-1 block text-sm font-medium text-gray-700">Clock In Time</label>
//                             <input
//                                 type="datetime-local"
//                                 className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 value={clockIn}
//                                 onChange={(e) => setClockIn(e.target.value)}
//                             />
//                         </div>

//                         {/* Clock Out */}
//                         <div>
//                             <label className="mb-1 block text-sm font-medium text-gray-700">Clock Out Time</label>
//                             <input
//                                 type="datetime-local"
//                                 className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 value={clockOut}
//                                 onChange={(e) => setClockOut(e.target.value)}
//                             />
//                         </div>

//                         {/* Status */}
//                         <div>
//                             <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
//                             <select
//                                 className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 value={status}
//                                 onChange={(e) => setStatus(e.target.value)}
//                             >
//                                 {statusOptions.map((s) => (
//                                     <option key={s} value={s}>
//                                         {s}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     <div className="mt-6 flex justify-end gap-3">
//                         <button
//                             onClick={onClose}
//                             className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={handleSubmit}
//                             className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
//                         >
//                             Save
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 🧾 Table Row Component */
//     /* -------------------------------------------------------------------------- */
//     const TableRow = ({ user, index }) => {
//         const name = user?.fullName || "N/A";
//         const email = user?.email || "-";
//         const phone = user?.phone || "-";
//         const role = user?.userType || "Unknown";
//         const department = getDepartmentName(user);
//         const company = getCompanyName(user);
//         // console.log(user);

//         // console.log(globalRole,"jnjfn");

//         // Get today's attendance data
//         const attendanceKey = `${user.userType === "Admin" ? "admin" : "employee"}_${user._id}`;
//         const todayAttendance = attendanceMap[attendanceKey];

//         const formatTime = (isoString) => {
//             if (!isoString) return "--:--";
//             const date = new Date(isoString);
//             const hours = String(date.getHours()).padStart(2, "0");
//             const minutes = String(date.getMinutes()).padStart(2, "0");
//             return `${hours}:${minutes}`;
//         };

//         const clockInTime = formatTime(todayAttendance?.clockIn);
//         const clockOutTime = formatTime(todayAttendance?.clockOut);

//         const roleColor = role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-cyan-100 text-cyan-700";

//         const statusColor = activeTab === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

//         return (
//             <tr
//                 key={user._id || index}
//                 className="border-b border-gray-200 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent"
//             >
//                 <td className="px-4 py-3 font-medium text-gray-600">{index + 1}</td>

//                 {/* User Avatar + Name */}
//                 <td className="px-4 py-3">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-sm font-semibold text-white">
//                             {name.charAt(0).toUpperCase()}
//                         </div>
//                         <div>
//                             <p className="text-sm font-semibold text-gray-800">{name}</p>
//                             <p className="text-xs text-gray-500">{email}</p>
//                         </div>
//                     </div>
//                 </td>

//                 {/* Role Badge */}
//                 <td className="px-4 py-3">
//                     <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleColor}`}>{role}</span>
//                 </td>

//                 {/* Designation */}
//                 {/* <td className="px-4 py-3 text-sm text-gray-700 ">
//                     {user.userType === "Admin"
//                         ? typeof user?.designation === "object"
//                             ? user?.designation?.designation || "Admin"
//                             : user?.designation || "Admin"
//                         : typeof user?.designation === "object"
//                           ? user?.designation?.designation || "N/A"
//                           : user?.designation || "N/A"}
//                 </td> */}

//                 <td className="px-4 py-3">
//                     <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{getDesignationName(user)}</span>
//                 </td>

//                 {/* Department */}
//                 <td className="px-4 py-3 text-sm text-gray-700">{department}</td>

//                 {/* Company */}
//                 <td className="px-4 py-3 text-sm font-medium text-gray-700">{company}</td>

//                 {/* Today's Date - Clock In/Out */}
//                 <td className="px-4 py-3">
//                     <div className="flex flex-col gap-1">
//                         <p className="text-xs font-medium text-gray-600">{new Date().toLocaleDateString("en-IN")}</p>
//                         <div className="flex items-center gap-2 text-xs">
//                             <span
//                                 className={`rounded px-2 py-1 font-medium ${clockInTime === "--:--" ? "bg-gray-50 text-gray-600" : "bg-blue-50 text-blue-700"}`}
//                             >
//                                 IN: {clockInTime}
//                             </span>
//                             <span
//                                 className={`rounded px-2 py-1 font-medium ${clockOutTime === "--:--" ? "bg-gray-50 text-gray-600" : "bg-amber-50 text-amber-700"}`}
//                             >
//                                 OUT: {clockOutTime}
//                             </span>
//                         </div>
//                     </div>
//                 </td>

//                 {/* Actions */}
//                 <td className="flex gap-2 px-4 py-3">
//                     <button
//                         onClick={() => handleViewClick(user)}
//                         className="rounded-full bg-blue-100 p-2 text-blue-600 shadow-sm"
//                         title="View Details"
//                     >
//                         <Eye size={16} />
//                     </button>
//                     {/* <button
//                         className="rounded-full bg-gray-100 p-2 text-gray-600 shadow-sm  hover:bg-gray-200 hover:shadow-md"
//                         title="Edit"
//                     >
//                         <Edit2 size={16} />
//                     </button> */}
//                     {/* {globalRole === "admin" && role === "Employee" && (
//                         <button
//                             className="rounded-full bg-gray-100 p-2 text-gray-600 shadow-sm transition-colors duration-200 hover:bg-gray-200 hover:shadow-md"
//                             title="Edit"
//                         >
//                             <Edit2 size={16} />
//                         </button>
//                     )} */}
//                 </td>
//             </tr>
//         );
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 📅 Monthly Attendance Grid Component */
//     /* -------------------------------------------------------------------------- */
//     const MonthlyAttendanceGrid = ({ attendanceData, month }) => {
//         // Get all days in the month
//         const year = month.getFullYear();
//         const monthNum = month.getMonth();
//         const firstDay = new Date(year, monthNum, 1);
//         const lastDay = new Date(year, monthNum + 1, 0);
//         const daysInMonth = lastDay.getDate();

//         // Create a map of attendance by date
//         const attendanceMap = {};
//         attendanceData.forEach((record) => {
//             if (record?.date) {
//                 const date = new Date(record.date);
//                 const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

//                 if (!attendanceMap[dateKey]) {
//                     attendanceMap[dateKey] = [];
//                 }
//                 attendanceMap[dateKey].push(record);
//             }
//         });

//         // Format time from ISO string
//         const formatTime = (isoString) => {
//             if (!isoString) return "--:--";
//             const date = new Date(isoString);
//             const hours = String(date.getHours()).padStart(2, "0");
//             const minutes = String(date.getMinutes()).padStart(2, "0");
//             return `${hours}:${minutes}`;
//         };

//         // Get status from attendance records
//         const getAttendanceStatus = (dayRecords) => {
//             if (!dayRecords || dayRecords.length === 0) return null;
//             const record = dayRecords[0];
//             return record?.status || "Present";
//         };

//         // Get status color styles with gradients
//         const getStatusColor = (status) => {
//             switch (status?.toLowerCase()) {
//                 case "present":
//                     return "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300 shadow-emerald-100";
//                 case "grace present":
//                 case "grace":
//                     return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-blue-100";
//                 case "late":
//                     return "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 shadow-orange-100";
//                 case "half day":
//                     return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-yellow-100";
//                 case "holiday":
//                 case "holidays":
//                     return "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 shadow-purple-100";
//                 case "sunday":
//                     return "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300 shadow-pink-100";
//                 case "absent":
//                     return "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-300 shadow-rose-100";
//                 default:
//                     return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 shadow-gray-100";
//             }
//         };

//         const getStatusBadgeColor = (status) => {
//             switch (status?.toLowerCase()) {
//                 case "present":
//                     return "bg-emerald-500 text-white";
//                 case "grace present":
//                 case "grace":
//                     return "bg-blue-500 text-white";
//                 case "late":
//                     return "bg-orange-500 text-white";
//                 case "half day":
//                     return "bg-yellow-500 text-white";
//                 case "holiday":
//                 case "holidays":
//                     return "bg-purple-500 text-white";
//                 case "sunday":
//                     return "bg-pink-500 text-white";
//                 case "absent":
//                     return "bg-rose-500 text-white";
//                 default:
//                     return "bg-gray-500 text-white";
//             }
//         };

//         const days = [];
//         for (let i = 1; i <= daysInMonth; i++) {
//             const dateKey = `${year}-${monthNum}-${i}`;
//             const dayRecords = attendanceMap[dateKey];
//             const status = getAttendanceStatus(dayRecords);

//             const clockInTime = dayRecords && dayRecords.length > 0 ? formatTime(dayRecords[0]?.clockIn) : "--:--";
//             const clockOutTime = dayRecords && dayRecords.length > 0 ? formatTime(dayRecords[0]?.clockOut) : "--:--";
//             const date = new Date(year, monthNum, i);
//             days.push(
//                 <div
//                     key={i}
//                     className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg ${getStatusColor(status)}`}
//                     onDoubleClick={() => handleDateCardDoubleClick(date, dayRecords)}
//                     title="Double-click to edit"
//                 >
//                     <div className="space-y-3">
//                         {/* Date Number */}
//                         <div className="flex items-center justify-center">
//                             <p className="text-2xl font-bold text-gray-900">{i}</p>
//                         </div>

//                         {dayRecords && dayRecords.length > 0 ? (
//                             <div className="space-y-2">
//                                 {/* Clock In/Out Times */}
//                                 <div className="space-y-1">
//                                     <div className="flex items-center justify-between text-xs">
//                                         <span className="font-semibold text-gray-700">IN:</span>
//                                         <span className={`font-bold ${clockInTime === "--:--" ? "text-gray-400" : "text-emerald-600"}`}>
//                                             {clockInTime}
//                                         </span>
//                                     </div>
//                                     <div className="flex items-center justify-between text-xs">
//                                         <span className="font-semibold text-gray-700">OUT:</span>
//                                         <span className={`font-bold ${clockOutTime === "--:--" ? "text-gray-400" : "text-rose-600"}`}>
//                                             {clockOutTime}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* Status Badge */}
//                                 <div className="flex justify-center border-t border-gray-300 border-opacity-40 pt-2">
//                                     <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeColor(status)}`}>
//                                         {status || "No Status"}
//                                     </span>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="py-2 text-center">
//                                 <span className="inline-block rounded-full bg-gray-300 px-2 py-1 text-xs font-semibold text-gray-700">No Data</span>
//                             </div>
//                         )}
//                     </div>
//                 </div>,
//             );
//         }

//         return (
//             <div className="grid grid-cols-7 gap-3">
//                 {/* Day headers */}
//                 {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//                     <div
//                         key={day}
//                         className="rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 py-2 text-center text-sm font-bold text-gray-700"
//                     >
//                         {day}
//                     </div>
//                 ))}

//                 {/* Empty cells for days before month starts */}
//                 {Array.from({ length: firstDay.getDay() }).map((_, i) => (
//                     <div key={`empty-${i}`}></div>
//                 ))}

//                 {/* Day cells */}
//                 {days}
//             </div>
//         );
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 🖨️ Print Function */
//     /* -------------------------------------------------------------------------- */
//     const handlePrint = () => {
//         if (!printRef.current) return;

//         const printContent = printRef.current.innerHTML;
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(printContent, "text/html");

//         // Extract employee details section
//         const employeeDetails = doc.querySelector(".mb-8");
//         const employeeDetailsHtml = employeeDetails ? employeeDetails.outerHTML : "";

//         // Extract calendar section (col-span-3)
//         const calendarSection = doc.querySelector(".col-span-3");
//         const calendarHtml = calendarSection ? calendarSection.outerHTML : "";

//         // Extract summaries section (col-span-1)
//         const summariesSection = doc.querySelector(".col-span-1");
//         const summariesHtml = summariesSection ? summariesSection.outerHTML : "";

//         const printWindow = window.open("", "_blank");

//         printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Attendance Report - ${selectedUser?.fullName || "Employee"}</title>
//           <script src="https://cdn.tailwindcss.com"></script>
//           <style>
//             @page {
//               size: A4;
//               margin: 10mm;
//             }
//             body {
//               margin: 0;
//               padding: 8px;
//               background: white;
//               font-family: system-ui, -apple-system, sans-serif;
//             }
//             .page-1 {
//               page-break-inside: avoid;
//               page-break-after: always;
//               padding: 16px;
//             }
//             .page-2 {
//               page-break-before: always;
//               padding: 16px;
//               page-break-inside: avoid;
//             }
//             @media print {
//               body {
//                 margin: 0;
//                 padding: 0;
//               }
//               .no-print {
//                 display: none !important;
//               }
//             }
//             * {
//               -webkit-print-color-adjust: exact !important;
//               print-color-adjust: exact !important;
//               color-adjust: exact !important;
//             }
//           </style>
//         </head>
//         <body>
//           <!-- PAGE 1: Employee Details + Monthly Calendar -->
//           <div class="page-1">
//             <div style="margin-bottom: 20px;">
//               ${employeeDetailsHtml}
//             </div>
//             <div>
//               ${calendarHtml}
//             </div>
//           </div>

//           <!-- PAGE 2: Summaries -->
//           <div class="page-2">
//             <div style="display: flex; flex-direction: column; gap: 24px;">
//               ${summariesHtml}
//             </div>
//           </div>
//         </body>
//       </html>
//     `);

//         printWindow.document.close();

//         setTimeout(() => {
//             printWindow.print();
//         }, 250);
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 🧾 Render */
//     /* -------------------------------------------------------------------------- */
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
//             {/* Header Section */}
//             <div className="mb-8">
//                 <div className="mb-2 flex items-center gap-3">
//                     <Users
//                         size={32}
//                         className="text-blue-600"
//                     />
//                     <h1 className="text-3xl font-bold text-gray-900">Employee & Admin Management</h1>
//                 </div>
//                 <p className="text-sm text-gray-600">Monitor active and inactive employees and administrators</p>
//             </div>

//             {/* Search & Filter Bar */}
//             {globalRole == "employee" ? (
//                 <div></div>
//             ) : (
//                 <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-md">
//                     <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//                         <div className="w-full flex-1 sm:w-auto">
//                             <input
//                                 type="search"
//                                 placeholder="Search by name, email, or phone..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                         <div className="flex w-full gap-2 sm:w-auto">
//                             <select
//                                 value={filterRole}
//                                 onChange={(e) => setFilterRole(e.target.value)}
//                                 className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             >
//                                 <option value="All">All Roles</option>
//                                 <option value="Admin">Admins</option>
//                                 <option value="Employee">Employees</option>
//                             </select>
//                             <button
//                                 onClick={() => {
//                                     setSearchQuery("");
//                                     setFilterRole("All");
//                                 }}
//                                 className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800"
//                             >
//                                 Clear
//                             </button>
//                         </div>
//                     </div>
//                     {/* Modern Tab Navigation */}
//                     <div className="mb-6 mt-6 flex flex-wrap gap-3">
//                         <button
//                             onClick={() => setActiveTab("active")}
//                             className={`relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
//                                 activeTab === "active"
//                                     ? "bg-emerald-50 text-emerald-600 shadow-md"
//                                     : "bg-white text-gray-600 hover:bg-gray-50 hover:shadow-sm"
//                             }`}
//                         >
//                             <CheckCircle size={18} />
//                             Active ({totalActive})
//                             {activeTab === "active" && (
//                                 <span className="absolute -bottom-2 left-4 right-4 h-1 animate-pulse rounded-full bg-emerald-600" />
//                             )}
//                         </button>

//                         <button
//                             onClick={() => setActiveTab("inactive")}
//                             className={`relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
//                                 activeTab === "inactive"
//                                     ? "bg-rose-50 text-rose-600 shadow-md"
//                                     : "bg-white text-gray-600 hover:bg-gray-50 hover:shadow-sm"
//                             }`}
//                         >
//                             <XCircle size={18} />
//                             Inactive ({totalInactive})
//                             {activeTab === "inactive" && (
//                                 <span className="absolute -bottom-2 left-4 right-4 h-1 animate-pulse rounded-full bg-rose-600" />
//                             )}
//                         </button>
//                     </div>
//                     {/* Statistics Card */}
//                     <div className="mb-6">
//                         {activeTab === "active" ? (
//                             <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 shadow-sm">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm font-medium text-emerald-700">Total Active</p>
//                                         <p className="text-3xl font-bold text-emerald-600">{totalActive}</p>
//                                     </div>
//                                     <CheckCircle
//                                         size={40}
//                                         className="text-emerald-600 opacity-20"
//                                     />
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="rounded-lg border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 p-4 shadow-sm">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm font-medium text-rose-700">Total Inactive</p>
//                                         <p className="text-3xl font-bold text-rose-600">{totalInactive}</p>
//                                     </div>
//                                     <XCircle
//                                         size={40}
//                                         className="text-rose-600 opacity-20"
//                                     />
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Data Table */}
//             {loading ? (
//                 <div className="flex items-center justify-center py-16">
//                     <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
//                 </div>
//             ) : filteredData.length === 0 ? (
//                 <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-md">
//                     <p className="text-lg text-gray-600">
//                         No {activeTab} {filterRole !== "All" ? filterRole.toLowerCase() : ""} records found.
//                     </p>
//                 </div>
//             ) : (
//                 <div className="animate-in fade-in slide-in-from-bottom-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg duration-500">
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-sm text-gray-700">
//                             <thead className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
//                                 <tr>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">#</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">User</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">Role</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">Designation</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">Department</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">Company</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">Today's Attendance</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {filteredData.map((user, index) => (
//                                     <TableRow
//                                         key={user._id || index}
//                                         user={user}
//                                         index={index + 1}
//                                     />
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}

//             {/* View Details Modal */}
//             {viewModal && selectedUser && (
//                 <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md duration-300">
//                     <div className="animate-in zoom-in relative flex h-screen w-screen flex-col overflow-y-auto rounded-none border-0 bg-white shadow-2xl duration-300">
//                         <div className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white p-6">
//                             <h2 className="text-3xl font-bold text-gray-900">Attendance Details</h2>
//                             <div className="flex items-center gap-4">
//                                 <button
//                                     onClick={handlePrint}
//                                     className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg"
//                                     title="Print attendance details"
//                                 >
//                                     <Printer size={20} />
//                                     Print
//                                 </button>
//                                 <button
//                                     className="text-gray-400 transition-colors hover:text-gray-600"
//                                     onClick={() => setViewModal(false)}
//                                 >
//                                     <X size={32} />
//                                 </button>
//                             </div>
//                         </div>

//                         <div
//                             className="flex-1 overflow-y-auto p-8"
//                             ref={printRef}
//                         >
//                             {/* HEADER SECTION - Employee Details */}
//                             <div className="mb-8">
//                                 {/* Employee Header */}
//                                 <div className="mb-6">
//                                     <div className="flex items-start gap-4">
//                                         <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-2xl font-bold text-white">
//                                             {selectedUser?.fullName?.charAt(0).toUpperCase()}
//                                         </div>
//                                         <div>
//                                             <h3 className="text-2xl font-bold text-gray-900">{selectedUser?.fullName}</h3>
//                                             <p className="mt-1 text-sm text-gray-600">{selectedUser?.userType}</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Employee Info Grid (2 columns) */}
//                                 <div className="grid grid-cols-2 gap-6 rounded-lg bg-gray-50 p-6">
//                                     {/* Contact Information */}
//                                     <div>
//                                         <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">Contact Information</h3>
//                                         <div className="space-y-2">
//                                             <div>
//                                                 <p className="text-xs font-medium text-gray-500">Email</p>
//                                                 <p className="text-sm text-gray-800">{selectedUser?.email || "N/A"}</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-xs font-medium text-gray-500">Phone</p>
//                                                 <p className="text-sm text-gray-800">{selectedUser?.phone || "N/A"}</p>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Work Information */}
//                                     <div>
//                                         <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">Work Information</h3>
//                                         <div className="space-y-2">
//                                             <div>
//                                                 <p className="text-xs font-medium text-gray-500">Department</p>
//                                                 <p className="text-sm text-gray-800">{getDepartmentName(selectedUser)}</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-xs font-medium text-gray-500">Company</p>
//                                                 <p className="text-sm text-gray-800">{getCompanyName(selectedUser)}</p>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Status Information */}
//                                     <div>
//                                         <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">Status</h3>
//                                         <div className="space-y-2">
//                                             <div>
//                                                 <p className="text-xs font-medium text-gray-500">Account Status</p>
//                                                 <div className="mt-1">
//                                                     {selectedUser?.accountActive ? (
//                                                         <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
//                                                             <CheckCircle size={14} />
//                                                             Active
//                                                         </span>
//                                                     ) : (
//                                                         <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
//                                                             <XCircle size={14} />
//                                                             Inactive
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Dates */}
//                                     <div>
//                                         <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">Dates</h3>
//                                         <div className="space-y-2">
//                                             <div>
//                                                 <p className="text-xs font-medium text-gray-500">Join Date</p>
//                                                 <p className="text-sm text-gray-800">
//                                                     {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString("en-IN") : "N/A"}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* BOTTOM SECTION - Calendar & Attendance Summary Side by Side */}
//                             <div className="border-t border-gray-200 pt-8">
//                                 <div className="grid grid-cols-4 gap-8">
//                                     {/* LEFT - Monthly Attendance Calendar (takes 2.5 columns) */}
//                                     <div className="col-span-3">
//                                         {/* Month & Year Selection */}
//                                         <div className="mb-8">
//                                             <div className="mb-6 flex flex-col items-center gap-4">
//                                                 <h3 className="text-center text-4xl font-bold text-gray-900">
//                                                     {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
//                                                 </h3>

//                                                 <div className="flex items-center gap-4">
//                                                     {/* Month Selector */}
//                                                     <select
//                                                         value={currentMonth.getMonth()}
//                                                         onChange={(e) =>
//                                                             setCurrentMonth(new Date(currentMonth.getFullYear(), parseInt(e.target.value)))
//                                                         }
//                                                         className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                                     >
//                                                         <option value="0">January</option>
//                                                         <option value="1">February</option>
//                                                         <option value="2">March</option>
//                                                         <option value="3">April</option>
//                                                         <option value="4">May</option>
//                                                         <option value="5">June</option>
//                                                         <option value="6">July</option>
//                                                         <option value="7">August</option>
//                                                         <option value="8">September</option>
//                                                         <option value="9">October</option>
//                                                         <option value="10">November</option>
//                                                         <option value="11">December</option>
//                                                     </select>

//                                                     {/* Year Selector */}
//                                                     <select
//                                                         value={currentMonth.getFullYear()}
//                                                         onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth()))}
//                                                         className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                                     >
//                                                         {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
//                                                             <option
//                                                                 key={year}
//                                                                 value={year}
//                                                             >
//                                                                 {year}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             </div>

//                                             {/* Navigation Buttons */}
//                                             <div className="flex justify-center gap-2">
//                                                 <button
//                                                     onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
//                                                     className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
//                                                 >
//                                                     ← Prev Month
//                                                 </button>
//                                                 <button
//                                                     onClick={() => setCurrentMonth(new Date())}
//                                                     className="rounded-lg bg-blue-100 px-4 py-2 font-medium text-blue-700 transition-colors hover:bg-blue-200"
//                                                 >
//                                                     Today
//                                                 </button>
//                                                 <button
//                                                     onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
//                                                     className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
//                                                 >
//                                                     Next Month →
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         {/* Monthly Attendance Grid */}
//                                         <MonthlyAttendanceGrid
//                                             attendanceData={monthlyAttendance}
//                                             month={currentMonth}
//                                         />
//                                     </div>

//                                     {/* RIGHT - Attendance & Salary Summary (Stacked) */}
//                                     <div className="sticky top-8 col-span-1 flex h-fit flex-col gap-6">
//                                         {/* Attendance Summary */}
//                                         <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
//                                             <h3 className="mb-2 text-lg font-bold text-gray-900">Attendance Summary</h3>
//                                             <p className="mb-6 text-xs font-medium text-gray-600">
//                                                 {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
//                                             </p>

//                                             {(() => {
//                                                 const stats = calculateAttendanceStats(monthlyAttendance, currentMonth);
//                                                 const summaryData = [
//                                                     {
//                                                         label: "Present",
//                                                         value: stats.present,
//                                                         color: "bg-emerald-100 text-emerald-700",
//                                                         bgColor: "bg-emerald-50",
//                                                     },
//                                                     {
//                                                         label: "Grace Present",
//                                                         value: stats.gracePresent,
//                                                         color: "bg-blue-100 text-blue-700",
//                                                         bgColor: "bg-blue-50",
//                                                     },
//                                                     {
//                                                         label: "Late",
//                                                         value: stats.late,
//                                                         color: "bg-orange-100 text-orange-700",
//                                                         bgColor: "bg-orange-50",
//                                                     },
//                                                     {
//                                                         label: "Absent",
//                                                         value: stats.absent,
//                                                         color: "bg-rose-100 text-rose-700",
//                                                         bgColor: "bg-rose-50",
//                                                     },
//                                                 ];

//                                                 return (
//                                                     <div className="space-y-3">
//                                                         {summaryData.map((item, idx) => (
//                                                             <div
//                                                                 key={idx}
//                                                                 className={`${item.bgColor} rounded-lg border-l-4 border-current p-3 text-sm`}
//                                                             >
//                                                                 <div className="flex items-center justify-between">
//                                                                     <span className="font-semibold text-gray-700">{item.label}</span>
//                                                                     <span className={`text-xl font-bold ${item.color.split(" ")[1]}`}>
//                                                                         {item.value}
//                                                                     </span>
//                                                                 </div>
//                                                                 <p className="mt-1 text-xs text-gray-500">
//                                                                     {stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%
//                                                                 </p>
//                                                             </div>
//                                                         ))}

//                                                         {/* Total */}
//                                                         <div className="mt-4 border-t border-blue-200 pt-3">
//                                                             <div className="flex items-center justify-between">
//                                                                 <span className="text-sm font-bold text-gray-800">Total Days</span>
//                                                                 <span className="text-xl font-bold text-blue-700">{stats.total}</span>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 );
//                                             })()}
//                                         </div>

//                                         {/* Salary Summary */}
//                                         <div className="rounded-lg border border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
//                                             <h3 className="mb-2 text-lg font-bold text-gray-900">Salary Summary</h3>
//                                             <p className="mb-6 text-xs font-medium text-gray-600">
//                                                 {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
//                                             </p>

//                                             {(() => {
//                                                 const stats = calculateAttendanceStats(monthlyAttendance, currentMonth);
//                                                 const monthlyBaseSalary = 30000; // Static monthly salary
//                                                 const perDaySalary = monthlyBaseSalary / 30; // Assuming 30 working days per month
//                                                 const presentDays = stats.present + stats.gracePresent; // Count present and grace present as working days
//                                                 const totalEarned = perDaySalary * presentDays;

//                                                 return (
//                                                     <div className="space-y-3 text-sm">
//                                                         {/* Base Salary */}
//                                                         <div className="rounded-lg border border-green-200 bg-white p-3">
//                                                             <div className="flex items-center justify-between">
//                                                                 <span className="font-semibold text-gray-700">Base Salary</span>
//                                                                 <span className="font-bold text-gray-800">
//                                                                     ₹{monthlyBaseSalary.toLocaleString("en-IN")}
//                                                                 </span>
//                                                             </div>
//                                                         </div>

//                                                         {/* Per Day Salary */}
//                                                         <div className="rounded-lg border border-green-200 bg-white p-3">
//                                                             <div className="flex items-center justify-between">
//                                                                 <span className="font-semibold text-gray-700">Per Day</span>
//                                                                 <span className="font-bold text-gray-800">₹{perDaySalary.toFixed(0)}</span>
//                                                             </div>
//                                                         </div>

//                                                         {/* Working Days */}
//                                                         <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-3">
//                                                             <div className="flex items-center justify-between">
//                                                                 <span className="font-semibold text-gray-700">Working Days</span>
//                                                                 <span className="text-xl font-bold text-emerald-600">{presentDays}</span>
//                                                             </div>
//                                                         </div>

//                                                         {/* Earned Salary */}
//                                                         <div className="rounded-lg border-l-4 border-green-600 bg-gradient-to-r from-green-100 to-emerald-100 p-3">
//                                                             <div className="flex items-center justify-between">
//                                                                 <span className="font-bold text-gray-800">Earned</span>
//                                                                 <span className="text-lg font-bold text-green-700">
//                                                                     ₹{totalEarned.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
//                                                                 </span>
//                                                             </div>
//                                                         </div>

//                                                         {/* Final Payable */}
//                                                         <div className="rounded-lg border-2 border-emerald-700 bg-gradient-to-r from-emerald-500 to-green-600 p-3 text-white">
//                                                             <div className="flex items-center justify-between">
//                                                                 <span className="text-sm font-bold">Payable</span>
//                                                                 <span className="text-lg font-bold">
//                                                                     ₹{totalEarned.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
//                                                                 </span>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 );
//                                             })()}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-white p-6">
//                             <button
//                                 onClick={() => setViewModal(false)}
//                                 className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* 📅 Date Attendance Edit Modal */}
//             {isEditModalOpen && selectedDateForEdit && (
//                 <DateAttendanceEditModal
//                     date={selectedDateForEdit.date}
//                     dayRecords={selectedDateForEdit.records}
//                     onClose={() => {
//                         setIsEditModalOpen(false);
//                         setSelectedDateForEdit(null);
//                     }}
//                     onSave={handleSaveDateAttendance}
//                 />
//             )}

//             {/* Add Tailwind animations if not already present */}
//             <style>{`
//         @keyframes slideInFromBottom {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-in {
//           animation: slideInFromBottom 0.5s ease-out;
//         }

//         .fade-in {
//           animation: fadeIn 0.3s ease-in;
//         }

//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         .slide-in-from-bottom-4 {
//           animation: slideInFromBottom 0.5s ease-out;
//         }

//         .zoom-in {
//           animation: zoomIn 0.3s ease-out;
//         }

//         @keyframes zoomIn {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//       `}</style>
//         </div>
//     );
// };

// export default AdminAttendance;

// import React, { useEffect, useState, useRef } from "react";
// import { Eye, Edit2, Trash2, X, Users, CheckCircle, XCircle, Mail, Phone, Printer } from "lucide-react";
// import axios from "axios";

// const AdminAttendance = ({ searchText, isEmployeeView = false }) => {
//     console.log("EmployeeTable rendered");
//     const userId = localStorage.getItem("userId");
//     const [data, setData] = useState({ active: [], inactive: [] });
//     const [activeTab, setActiveTab] = useState("active");
//     const [loading, setLoading] = useState(true);
//     const [currentUser, setCurrentUser] = useState(null);

//     const [searchQuery, setSearchQuery] = useState("");
//     const [filterRole, setFilterRole] = useState("All");
//     const [viewModal, setViewModal] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [attendanceMap, setAttendanceMap] = useState({});
//     const [monthlyAttendance, setMonthlyAttendance] = useState([]);
//     const [currentMonth, setCurrentMonth] = useState(new Date());
//     const printRef = useRef(null);
//     const [selectedDateForEdit, setSelectedDateForEdit] = useState(null);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const token = localStorage.getItem("token");
//     // const role = localStorage.getItem("role");
//     const globalRole = localStorage.getItem("role");
//     // console.log(globalRole);

//     const getDesignationName = (employee) => {
//         // console.log(employee);

//         if (typeof employee?.designation === "string") {
//             return employee.designation;
//         }
//         // Handle object with 'designation' property (from MongoDB population)
//         if (employee?.designation && typeof employee.designation === "object") {
//             return employee.designation.designation || employee.designation.title || "Employee";
//         }
//         return "Employee";
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 📦 Fetch Employee & Admin Data (User Details, Not Attendance) */
//     /* -------------------------------------------------------------------------- */
//     const fetchAllData = async () => {
//         try {
//             setLoading(true);
//             // console.log("abz");

//             // If in employee view, only fetch current employee's data
//             if (isEmployeeView && userId) {
//                 try {
//                     const employeeRes = await axios.get(`http://localhost:4000/employee/getEmployee/${userId}`);
//                     const currentEmployee = employeeRes?.data?.employee || {};

//                     const enrichedEmployee = {
//                         ...currentEmployee,
//                         userType: "Employee",
//                         role: currentEmployee?.designation?.designation || "Employee",
//                         accountActive: true,
//                     };

//                     setData({
//                         active: [enrichedEmployee],
//                         inactive: [],
//                     });

//                     fetchTodayAttendance([enrichedEmployee]);
//                     setLoading(false);
//                     return;
//                 } catch (error) {
//                     console.error("Error fetching employee data:", error);
//                     setLoading(false);
//                     return;
//                 }
//             }

//             const [adminRes, employeeRes] = await Promise.all([
//                 axios.get("http://localhost:4000/getAdmins"),
//                 axios.get("http://localhost:4000/employee/allEmployee"),
//             ]);

//             const adminData = adminRes?.data?.admins || adminRes?.data || [];
//             const employeeData = employeeRes?.data?.employees || employeeRes?.data || [];

//             // Enrich with type for easy identification
//             const enrichedAdmins = adminData.map((admin) => ({
//                 ...admin,
//                 userType: "Admin",
//                 role: "Admin",
//             }));

//             const enrichedEmployees = employeeData.map((emp) => ({
//                 ...emp,
//                 userType: "Employee",
//                 role: emp?.designation || "Employee",
//             }));

//             // Combine all users
//             const allUsers = [...enrichedAdmins, ...enrichedEmployees];

//             // Separate active and inactive based on accountActive field
//             const activeUsers = allUsers.filter((user) => user?.accountActive === true || user?.accountActive === "true");

//             const inactiveUsers = allUsers.filter((user) => user?.accountActive === false || user?.accountActive === "false" || !user?.accountActive);

//             setData({
//                 active: activeUsers,
//                 inactive: inactiveUsers,
//             });

//             // Fetch today's attendance data for all users
//             fetchTodayAttendance(allUsers);
//         } catch (error) {
//             console.error("⚠️ Error fetching data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 📦 Fetch Today's Attendance Data */
//     /* -------------------------------------------------------------------------- */
//     const fetchTodayAttendance = async (allUsers) => {
//         try {
//             // Format today's date to pass as query parameter for optimization
//             const today = new Date().toISOString().split("T")[0];

//             const [adminAttendanceRes, employeeAttendanceRes] = await Promise.all([
//                 axios.get(`http://localhost:4000/adminAttendance/getAllAttendance?date=${today}`),
//                 axios.get(`http://localhost:4000/attendance/getAllAttendance?date=${today}`),
//             ]);

//             // Both endpoints return arrays directly
//             const adminAttendance = Array.isArray(adminAttendanceRes?.data) ? adminAttendanceRes.data : [];
//             const employeeAttendance = Array.isArray(employeeAttendanceRes?.data) ? employeeAttendanceRes.data : [];

//             // Create a map of user attendance
//             const attendanceById = {};

//             // Process admin attendance
//             adminAttendance.forEach((record) => {
//                 try {
//                     // admin field is populated object with _id
//                     const adminId = record?.admin?._id;
//                     if (adminId) {
//                         attendanceById[`admin_${adminId}`] = {
//                             clockIn: record?.clockIn,
//                             clockOut: record?.clockOut,
//                         };
//                     }
//                 } catch (e) {
//                     console.warn("Error processing admin attendance record:", e);
//                 }
//             });

//             // Process employee attendance
//             employeeAttendance.forEach((record) => {
//                 try {
//                     // employee field is populated object with _id
//                     const employeeId = record?.employee?._id;
//                     if (employeeId) {
//                         attendanceById[`employee_${employeeId}`] = {
//                             clockIn: record?.clockIn,
//                             clockOut: record?.clockOut,
//                         };
//                     }
//                 } catch (e) {
//                     console.warn("Error processing employee attendance record:", e);
//                 }
//             });

//             setAttendanceMap(attendanceById);
//         } catch (error) {
//             console.error("⚠️ Error fetching attendance data:", error);
//         }
//     };

//     // useEffect(() => {
//     //     fetchAllData();
//     // }, [isEmployeeView, userId]);

//     useEffect(() => {
//         fetchAllData();
//     }, []);

//     /* -------------------------------------------------------------------------- */
//     /* 📅 Refetch monthly attendance when month changes */
//     /* -------------------------------------------------------------------------- */
//     // useEffect(() => {
//     //     if (selectedUser && currentMonth) {
//     //         fetchMonthlyAttendance(selectedUser, currentMonth);
//     //     }
//     // }, [currentMonth, selectedUser]);

//     useEffect(() => {
//         if (selectedUser && viewModal) {
//             fetchMonthlyAttendance(selectedUser);
//         }
//     }, [currentMonth, selectedUser, viewModal]);

//     /* -------------------------------------------------------------------------- */
//     /* 🔍 Filter & Search Data */
//     /* -------------------------------------------------------------------------- */
//     const getFilteredData = () => {
//         const dataToFilter = activeTab === "active" ? data.active : data.inactive;

//         return dataToFilter
//             .filter((user) => {
//                 const name = user?.fullName?.toLowerCase() || "";
//                 const email = user?.email?.toLowerCase() || "";
//                 const phone = user?.phone?.toLowerCase() || "";
//                 const q = searchQuery.toLowerCase();
//                 return name.includes(q) || email.includes(q) || phone.includes(q);
//             })
//             .filter((user) => filterRole === "All" || user?.userType === filterRole || user?.role === filterRole);
//     };

//     const filteredData = getFilteredData();
//     // console.log(filteredData);

//     const totalActive = data.active.length;
//     const totalInactive = data.inactive.length;

//     /* -------------------------------------------------------------------------- */
//     /* 👁️ View User Details Modal */
//     /* -------------------------------------------------------------------------- */
//     // const handleViewClick = async (user) => {
//     //     setSelectedUser(user);
//     //     const newMonth = new Date();
//     //     setCurrentMonth(newMonth);
//     //     // Fetch monthly attendance for this user with the current month
//     //     setViewModal(true);
//     //     // await fetchMonthlyAttendance(user, newMonth);
//     // };

//     const handleViewClick = async (user) => {
//         setSelectedUser(user);
//         setViewModal(true);
//         setCurrentMonth(new Date());
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 📊 Fetch Monthly Attendance Data */
//     /* -------------------------------------------------------------------------- */
//     const fetchMonthlyAttendance = async (user, monthToFetch = null) => {
//         try {
//             // Use provided month or fall back to currentMonth
//             const month = monthToFetch || currentMonth;

//             // Get the current month's start and end dates
//             const year = month.getFullYear();
//             const monthNum = month.getMonth();
//             const firstDay = new Date(year, monthNum, 1).toISOString().split("T")[0];
//             const lastDay = new Date(year, monthNum + 1, 0).toISOString().split("T")[0];

//             let attendanceData = [];
//             setCurrentUser(user)
//             console.log(user);
            

//             if (user.userType === "Admin") {
//                 // Fetch only this admin's attendance for the current month
//                 const res = await axios.get(
//                     `http://localhost:4000/adminAttendance/getAllAttendance?adminId=${user._id}&startDate=${firstDay}&endDate=${lastDay}`,
//                 );
//                 attendanceData = Array.isArray(res?.data) ? res.data : [];
//             } else {
//                 // Fetch only this employee's attendance for the current month
//                 const res = await axios.get(
//                     `http://localhost:4000/attendance/getAllAttendance?employeeId=${user._id}&startDate=${firstDay}&endDate=${lastDay}`,
//                 );
//                 attendanceData = Array.isArray(res?.data) ? res.data : [];
//             }

//             setMonthlyAttendance(attendanceData);
            
//         } catch (error) {
//             console.error("⚠️ Error fetching monthly attendance:", error);
//             setMonthlyAttendance([]);
//         }
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 📅 Handle Date Card Double Click */
//     /* -------------------------------------------------------------------------- */
//     const handleDateCardDoubleClick = (date, dayRecords) => {
//         setSelectedDateForEdit({
//             date,
//             records: dayRecords || [],
//         });
//         setIsEditModalOpen(true);
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 💾 Save Date Attendance */
//     /* -------------------------------------------------------------------------- */
//     const handleSaveDateAttendance = async (updatedData) => {
//         if (!selectedDateForEdit) return;

//         try {
//             if (selectedDateForEdit.records && selectedDateForEdit.records.length > 0) {
//                 // Update existing record
//                 const attendance = selectedDateForEdit.records[0];
//                 const res = await fetch(`http://localhost:4000/attendance/${attendance._id}`, {
//                     method: "PATCH",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                     body: JSON.stringify(updatedData),
//                 });

//                 if (!res.ok) throw new Error("Failed to update");
//                 const result = await res.json();

//                 // Refresh attendance data
//                 if (selectedUser?._id) {
//                     fetchMonthlyAttendance(selectedUser);
//                 }
//             } else {
//                 // Create new record
//                 const res = await fetch(`http://localhost:4000/attendance`, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                     body: JSON.stringify({
//                         employee: selectedUser._id,
//                         date: new Date(selectedDateForEdit.date),
//                         ...updatedData,
//                     }),
//                 });

//                 if (!res.ok) throw new Error("Failed to create attendance");

//                 // Refresh attendance data
//                 if (selectedUser?._id) {
//                     fetchMonthlyAttendance(selectedUser);
//                 }
//             }

//             setIsEditModalOpen(false);
//             setSelectedDateForEdit(null);
//         } catch (err) {
//             console.error("Error saving attendance:", err);
//             alert("Error saving attendance: " + err.message);
//         }
//     };

//     const getDepartmentName = (user) => {
//         if (typeof user?.department === "string") {
//             return user.department;
//         }
//         // Handle object with various possible property names
//         // Note: Backend populates department with "dep" field
//         return user?.department?.dep || user?.department?.departmentName || user?.department?.name || user?.department?.department || "N/A";
//     };

//     const getCompanyName = (user) => {
//         if (typeof user?.company === "string") {
//             return user.company;
//         }
//         return user?.company?.companyName || "N/A";
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 📊 Calculate Attendance Statistics by Month */
//     /* -------------------------------------------------------------------------- */
//     const calculateAttendanceStats = (attendanceData, month) => {
//         const stats = {
//             present: 0,
//             gracePresent: 0,
//             late: 0,
//             absent: 0,
//             total: 0,
//         };

//         if (!Array.isArray(attendanceData)) return stats;

//         const monthNum = month.getMonth();
//         const yearNum = month.getFullYear();

//         // Filter data for the selected month
//         const monthData = attendanceData.filter((record) => {
//             if (!record?.date) return false;
//             const recordDate = new Date(record.date);
//             return recordDate.getMonth() === monthNum && recordDate.getFullYear() === yearNum;
//         });

//         monthData.forEach((record) => {
//             const status = record?.status || "Absent";

//             if (status === "Present") stats.present++;
//             else if (status === "Grace Present" || status === "Grace") stats.gracePresent++;
//             else if (status === "Late") stats.late++;
//             else if (status === "Absent") stats.absent++;

//             stats.total++;
//         });

//         return stats;
//     };

//     /* -------------------------------------------------------------------------- */
//     /* ✏️ Edit Attendance Modal */
//     /* -------------------------------------------------------------------------- */
//     // Removed old edit modal code - users are now displayed with view-only modal

//     /* -------------------------------------------------------------------------- */
//     /* 💾 Save Attendance Changes */
//     /* -------------------------------------------------------------------------- */
//     // Removed old save edit code

//     /* -------------------------------------------------------------------------- */
//     /* 📅 Date Attendance Edit Modal Component */
//     /* -------------------------------------------------------------------------- */
//     const DateAttendanceEditModal = ({ date, dayRecords, onClose, onSave }) => {
//         const statusOptions = ["Present", "Absent", "Late", "Grace Present", "Half Day", "Sunday", "Holiday"];

//         const formatLocalDateTime = (dateString) => {
//             if (!dateString) return "";
//             const date = new Date(dateString);
//             const offset = date.getTimezoneOffset();
//             const local = new Date(date.getTime() - offset * 60 * 1000);
//             return local.toISOString().slice(0, 16);
//         };

//         const [clockIn, setClockIn] = useState(dayRecords && dayRecords.length > 0 ? formatLocalDateTime(dayRecords[0]?.clockIn) : "");
//         const [clockOut, setClockOut] = useState(dayRecords && dayRecords.length > 0 ? formatLocalDateTime(dayRecords[0]?.clockOut) : "");
//         const [status, setStatus] = useState(dayRecords && dayRecords.length > 0 ? dayRecords[0]?.status : "Present");

//         const handleSubmit = () => {
//             const toServerFormat = (localString) => {
//                 if (!localString) return null;
//                 return new Date(localString);
//             };

//             const updatedData = {
//                 clockIn: toServerFormat(clockIn),
//                 clockOut: clockOut ? toServerFormat(clockOut) : null,
//                 status,
//             };

//             onSave(updatedData);
//         };

//         const dateStr = new Date(date).toLocaleDateString("en-IN", {
//             weekday: "long",
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//         });

//         return (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
//                 {/* Modal Card */}
//                 <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
//                     <h2 className="mb-2 text-center text-lg font-semibold">Edit Attendance</h2>
//                     <p className="mb-4 text-center text-sm text-gray-600">{dateStr}</p>

//                     <div className="space-y-4">
//                         {/* Clock In */}
//                         <div>
//                             <label className="mb-1 block text-sm font-medium text-gray-700">Clock In Time</label>
//                             <input
//                                 type="datetime-local"
//                                 className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 value={clockIn}
//                                 onChange={(e) => setClockIn(e.target.value)}
//                             />
//                         </div>

//                         {/* Clock Out */}
//                         <div>
//                             <label className="mb-1 block text-sm font-medium text-gray-700">Clock Out Time</label>
//                             <input
//                                 type="datetime-local"
//                                 className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 value={clockOut}
//                                 onChange={(e) => setClockOut(e.target.value)}
//                             />
//                         </div>

//                         {/* Status */}
//                         <div>
//                             <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
//                             <select
//                                 className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 value={status}
//                                 onChange={(e) => setStatus(e.target.value)}
//                             >
//                                 {statusOptions.map((s) => (
//                                     <option
//                                         key={s}
//                                         value={s}
//                                     >
//                                         {s}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     <div className="mt-6 flex justify-end gap-3">
//                         <button
//                             onClick={onClose}
//                             className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={handleSubmit}
//                             className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
//                         >
//                             Save
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 🧾 Table Row Component */
//     /* -------------------------------------------------------------------------- */
//     const TableRow = ({ user, index }) => {
//         const name = user?.fullName || "N/A";
//         const email = user?.email || "-";
//         const phone = user?.phone || "-";
//         const role = user?.userType || "Unknown";
//         const department = getDepartmentName(user);
//         const company = getCompanyName(user);
//         // console.log(user);

//         // console.log(globalRole,"jnjfn");

//         // Get today's attendance data
//         const attendanceKey = `${user.userType === "Admin" ? "admin" : "employee"}_${user._id}`;
//         const todayAttendance = attendanceMap[attendanceKey];

//         const formatTime = (isoString) => {
//             if (!isoString) return "--:--";
//             const date = new Date(isoString);
//             const hours = String(date.getHours()).padStart(2, "0");
//             const minutes = String(date.getMinutes()).padStart(2, "0");
//             return `${hours}:${minutes}`;
//         };

//         const clockInTime = formatTime(todayAttendance?.clockIn);
//         const clockOutTime = formatTime(todayAttendance?.clockOut);

//         const roleColor = role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-cyan-100 text-cyan-700";

//         const statusColor = activeTab === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

//         return (
//             <>
//                 <tr
//                     key={user._id || index}
//                     className="border-b border-gray-200 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent"
//                 >
//                     <td className="px-4 py-3 font-medium text-gray-600">{index + 1}</td>

//                     {/* User Avatar + Name */}
//                     <td className="px-4 py-3">
//                         <div className="flex items-center gap-3">
//                             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-sm font-semibold text-white">
//                                 {name.charAt(0).toUpperCase()}
//                             </div>
//                             <div>
//                                 <p className="text-sm font-semibold text-gray-800">{name}</p>
//                                 <p className="text-xs text-gray-500">{email}</p>
//                             </div>
//                         </div>
//                     </td>

//                     {/* Role Badge */}
//                     <td className="px-4 py-3">
//                         <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleColor}`}>{role}</span>
//                     </td>

//                     {/* Designation */}
//                     {/* <td className="px-4 py-3 text-sm text-gray-700 ">
//                     {user.userType === "Admin"
//                         ? typeof user?.designation === "object"
//                             ? user?.designation?.designation || "Admin"
//                             : user?.designation || "Admin"
//                         : typeof user?.designation === "object"
//                           ? user?.designation?.designation || "N/A"
//                           : user?.designation || "N/A"}
//                 </td> */}

//                     <td className="px-4 py-3">
//                         <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{getDesignationName(user)}</span>
//                     </td>

//                     {/* Department */}
//                     <td className="px-4 py-3 text-sm text-gray-700">{department}</td>

//                     {/* Company */}
//                     <td className="px-4 py-3 text-sm font-medium text-gray-700">{company}</td>

//                     {/* Today's Date - Clock In/Out */}
//                     <td className="px-4 py-3">
//                         <div className="flex flex-col gap-1">
//                             <p className="text-xs font-medium text-gray-600">{new Date().toLocaleDateString("en-IN")}</p>
//                             <div className="flex items-center gap-2 text-xs">
//                                 <span
//                                     className={`rounded px-2 py-1 font-medium ${clockInTime === "--:--" ? "bg-gray-50 text-gray-600" : "bg-blue-50 text-blue-700"}`}
//                                 >
//                                     IN: {clockInTime}
//                                 </span>
//                                 <span
//                                     className={`rounded px-2 py-1 font-medium ${clockOutTime === "--:--" ? "bg-gray-50 text-gray-600" : "bg-amber-50 text-amber-700"}`}
//                                 >
//                                     OUT: {clockOutTime}
//                                 </span>
//                             </div>
//                         </div>
//                     </td>

//                     {/* Actions */}
//                     <td className="flex gap-2 px-4 py-3">
//                         <button
//                             disabled={viewModal}
//                             onClick={() => handleViewClick(user)}
//                             className="rounded-full bg-blue-100 p-2 text-blue-600 shadow-sm"
//                             title="View Details"
//                         >
//                             <Eye size={16} />
//                         </button>
//                         {/* <button
//                         className="rounded-full bg-gray-100 p-2 text-gray-600 shadow-sm  hover:bg-gray-200 hover:shadow-md"
//                         title="Edit"
//                     >
//                         <Edit2 size={16} />
//                     </button> */}
//                         {/* {globalRole === "admin" && role === "Employee" && (
//                         <button
//                             className="rounded-full bg-gray-100 p-2 text-gray-600 shadow-sm transition-colors duration-200 hover:bg-gray-200 hover:shadow-md"
//                             title="Edit"
//                         >
//                             <Edit2 size={16} />
//                         </button>
//                     )} */}
//                     </td>
//                 </tr>
//             </>
//         );
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 📅 Monthly Attendance Grid Component */
//     /* -------------------------------------------------------------------------- */
//     const MonthlyAttendanceGrid = ({ attendanceData, month }) => {
//             // console.log(currentUser?.userType);

//         // Get all days in the month
//         const year = month.getFullYear();
//         const monthNum = month.getMonth();
//         const firstDay = new Date(year, monthNum, 1);
//         const lastDay = new Date(year, monthNum + 1, 0);
//         const daysInMonth = lastDay.getDate();

//         // Create a map of attendance by date
//         const attendanceMap = {};
//         attendanceData.forEach((record) => {
//             if (record?.date) {
//                 const date = new Date(record.date);
//                 const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

//                 if (!attendanceMap[dateKey]) {
//                     attendanceMap[dateKey] = [];
//                 }
//                 attendanceMap[dateKey].push(record);
//             }
//         });

//         // Format time from ISO string
//         const formatTime = (isoString) => {
//             if (!isoString) return "--:--";
//             const date = new Date(isoString);
//             const hours = String(date.getHours()).padStart(2, "0");
//             const minutes = String(date.getMinutes()).padStart(2, "0");
//             return `${hours}:${minutes}`;
//         };

//         // Get status from attendance records
//         const getAttendanceStatus = (dayRecords) => {
//             if (!dayRecords || dayRecords.length === 0) return null;
//             const record = dayRecords[0];
//             return record?.status || "Present";
//         };

//         // Get status color styles with gradients
//         const getStatusColor = (status) => {
//             switch (status?.toLowerCase()) {
//                 case "present":
//                     return "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300 shadow-emerald-100";
//                 case "grace present":
//                 case "grace":
//                     return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-blue-100";
//                 case "late":
//                     return "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 shadow-orange-100";
//                 case "half day":
//                     return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-yellow-100";
//                 case "holiday":
//                 case "holidays":
//                     return "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 shadow-purple-100";
//                 case "sunday":
//                     return "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300 shadow-pink-100";
//                 case "absent":
//                     return "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-300 shadow-rose-100";
//                 default:
//                     return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 shadow-gray-100";
//             }
//         };

//         const getStatusBadgeColor = (status) => {
//             switch (status?.toLowerCase()) {
//                 case "present":
//                     return "bg-emerald-500 text-white";
//                 case "grace present":
//                 case "grace":
//                     return "bg-blue-500 text-white";
//                 case "late":
//                     return "bg-orange-500 text-white";
//                 case "half day":
//                     return "bg-yellow-500 text-white";
//                 case "holiday":
//                 case "holidays":
//                     return "bg-purple-500 text-white";
//                 case "sunday":
//                     return "bg-pink-500 text-white";
//                 case "absent":
//                     return "bg-rose-500 text-white";
//                 default:
//                     return "bg-gray-500 text-white";
//             }
//         };

//         const days = [];
//         for (let i = 1; i <= daysInMonth; i++) {
//             const dateKey = `${year}-${monthNum}-${i}`;
//             const dayRecords = attendanceMap[dateKey];
//             const status = getAttendanceStatus(dayRecords);

//             const clockInTime = dayRecords && dayRecords.length > 0 ? formatTime(dayRecords[0]?.clockIn) : "--:--";
//             const clockOutTime = dayRecords && dayRecords.length > 0 ? formatTime(dayRecords[0]?.clockOut) : "--:--";
//             const date = new Date(year, monthNum, i);
//             days.push(
//                 <div
//                     key={i}
//                     className={`cursor-pointer rounded-xl border-2 p-4 hover:shadow-lg ${getStatusColor(status)}`}
//                     // onDoubleClick={() => handleDateCardDoubleClick(date, dayRecords)}
//                     onDoubleClick={globalRole === "admin" && currentUser?.userType=="Employee" ? () => handleDateCardDoubleClick(date, dayRecords) : undefined}
//                     title="Double-click to edit"
//                 >
//                     <div className="space-y-3">
//                         {/* Date Number */}
//                         <div className="flex items-center justify-center">
//                             <p className="text-2xl font-bold text-gray-900">{i}</p>
//                         </div>

//                         {dayRecords && dayRecords.length > 0 ? (
//                             <div className="space-y-2">
//                                 {/* Clock In/Out Times */}
//                                 <div className="space-y-1">
//                                     <div className="flex items-center justify-between text-xs">
//                                         <span className="font-semibold text-gray-700">IN:</span>
//                                         <span className={`font-bold ${clockInTime === "--:--" ? "text-gray-400" : "text-emerald-600"}`}>
//                                             {clockInTime}
//                                         </span>
//                                     </div>
//                                     <div className="flex items-center justify-between text-xs">
//                                         <span className="font-semibold text-gray-700">OUT:</span>
//                                         <span className={`font-bold ${clockOutTime === "--:--" ? "text-gray-400" : "text-rose-600"}`}>
//                                             {clockOutTime}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* Status Badge */}
//                                 <div className="flex justify-center border-t border-gray-300 border-opacity-40 pt-2">
//                                     <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeColor(status)}`}>
//                                         {status || "No Status"}
//                                     </span>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="py-2 text-center">
//                                 <span className="inline-block rounded-full bg-gray-300 px-2 py-1 text-xs font-semibold text-gray-700">No Data</span>
//                             </div>
//                         )}
//                     </div>
//                 </div>,
//             );
//         }

//         return (
//             <div className="grid grid-cols-7 gap-3">
//                 {/* Day headers */}
//                 {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//                     <div
//                         key={day}
//                         className="rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 py-2 text-center text-sm font-bold text-gray-700"
//                     >
//                         {day}
//                     </div>
//                 ))}

//                 {/* Empty cells for days before month starts */}
//                 {Array.from({ length: firstDay.getDay() }).map((_, i) => (
//                     <div key={`empty-${i}`}></div>
//                 ))}

//                 {/* Day cells */}
//                 {days}
//             </div>
//         );
//     };

//     /* -------------------------------------------------------------------------- */
//     /* 🖨️ Print Function */
//     /* -------------------------------------------------------------------------- */
//     // const handlePrint = () => {
//     //     // if (!printRef.current) return;
//     //     if (!printRef.current || modalLoading) return;
//     //     console.log(printRef.current);

//     //     const printContent = printRef.current.innerHTML;
//     //     const parser = new DOMParser();
//     //     const doc = parser.parseFromString(printContent, "text/html");

//     //     // Extract employee details section
//     //     const employeeDetails = doc.querySelector(".mb-8");
//     //     const employeeDetailsHtml = employeeDetails ? employeeDetails.outerHTML : "";
//     //     // Extract calendar section (col-span-3)
//     //     const calendarSection = doc.querySelector(".col-span-3");
//     //     const calendarHtml = calendarSection ? calendarSection.outerHTML : "";

//     //     // Extract summaries section (col-span-1)
//     //     const summariesSection = doc.querySelector(".col-span-1");
//     //     const summariesHtml = summariesSection ? summariesSection.outerHTML : "";

//     //     const printWindow = window.open("", "_blank");

//     //     printWindow.document.write(`
//     //   <!DOCTYPE html>
//     //   <html>
//     //     <head>
//     //       <meta charset="UTF-8">
//     //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     //       <title>Attendance Report - ${selectedUser?.fullName || "Employee"}</title>
//     //       <script src="https://cdn.tailwindcss.com"></script>
//     //       <style>
//     //         @page {
//     //           size: A4;
//     //           margin: 10mm;
//     //         }
//     //         body {
//     //           margin: 0;
//     //           padding: 8px;
//     //           background: white;
//     //           font-family: system-ui, -apple-system, sans-serif;
//     //         }
//     //         .page-1 {
//     //           page-break-inside: avoid;
//     //           page-break-after: always;
//     //           padding: 16px;
//     //         }
//     //         .page-2 {
//     //           page-break-before: always;
//     //           padding: 16px;
//     //           page-break-inside: avoid;
//     //         }
//     //         @media print {
//     //           body {
//     //             margin: 0;
//     //             padding: 0;
//     //           }
//     //           .no-print {
//     //             display: none !important;
//     //           }
//     //         }
//     //         * {
//     //           -webkit-print-color-adjust: exact !important;
//     //           print-color-adjust: exact !important;
//     //           color-adjust: exact !important;
//     //         }
//     //       </style>
//     //     </head>
//     //     <body>
//     //       <!-- PAGE 1: Employee Details + Monthly Calendar -->
//     //       <div class="page-1">
//     //         <div style="margin-bottom: 20px;">
//     //           ${employeeDetailsHtml}
//     //         </div>
//     //         <div>
//     //           ${calendarHtml}
//     //         </div>
//     //       </div>

//     //       <!-- PAGE 2: Summaries -->
//     //       <div class="page-2">
//     //         <div style="display: flex; flex-direction: column; gap: 24px;">
//     //           ${summariesHtml}
//     //         </div>
//     //       </div>
//     //     </body>
//     //   </html>
//     // `);

//     //     printWindow.document.close();

//     //     setTimeout(() => {
//     //         printWindow.print();
//     //     }, 250);
//     // };

//     /* -------------------------------------------------------------------------- */
//     /* 🧾 Render */
//     /* -------------------------------------------------------------------------- */
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
//             {/* Header Section */}
//             <div className="mb-8">
//                 <div className="mb-2 flex items-center gap-3">
//                     <Users
//                         size={32}
//                         className="text-blue-600"
//                     />
//                     <h1 className="text-3xl font-bold text-gray-900">Employee & Admin Management</h1>
//                 </div>
//                 <p className="text-sm text-gray-600">Monitor active and inactive employees and administrators</p>
//             </div>

//             {/* Search & Filter Bar */}
//             {globalRole == "employee" ? (
//                 <div></div>
//             ) : (
//                 <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-md">
//                     <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//                         <div className="w-full flex-1 sm:w-auto">
//                             <input
//                                 type="search"
//                                 placeholder="Search by name, email, or phone..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                         <div className="flex w-full gap-2 sm:w-auto">
//                             <select
//                                 value={filterRole}
//                                 onChange={(e) => setFilterRole(e.target.value)}
//                                 className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             >
//                                 <option value="All">All Roles</option>
//                                 <option value="Admin">Admins</option>
//                                 <option value="Employee">Employees</option>
//                             </select>
//                             <button
//                                 onClick={() => {
//                                     setSearchQuery("");
//                                     setFilterRole("All");
//                                 }}
//                                 className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800"
//                             >
//                                 Clear
//                             </button>
//                         </div>
//                     </div>
//                     {/* Modern Tab Navigation */}
//                     <div className="mb-6 mt-6 flex flex-wrap gap-3">
//                         <button
//                             onClick={() => setActiveTab("active")}
//                             className={`relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
//                                 activeTab === "active"
//                                     ? "bg-emerald-50 text-emerald-600 shadow-md"
//                                     : "bg-white text-gray-600 hover:bg-gray-50 hover:shadow-sm"
//                             }`}
//                         >
//                             <CheckCircle size={18} />
//                             Active ({totalActive})
//                             {activeTab === "active" && (
//                                 <span className="absolute -bottom-2 left-4 right-4 h-1 animate-pulse rounded-full bg-emerald-600" />
//                             )}
//                         </button>

//                         <button
//                             onClick={() => setActiveTab("inactive")}
//                             className={`relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
//                                 activeTab === "inactive"
//                                     ? "bg-rose-50 text-rose-600 shadow-md"
//                                     : "bg-white text-gray-600 hover:bg-gray-50 hover:shadow-sm"
//                             }`}
//                         >
//                             <XCircle size={18} />
//                             Inactive ({totalInactive})
//                             {activeTab === "inactive" && (
//                                 <span className="absolute -bottom-2 left-4 right-4 h-1 animate-pulse rounded-full bg-rose-600" />
//                             )}
//                         </button>
//                     </div>
//                     {/* Statistics Card */}
//                     <div className="mb-6">
//                         {activeTab === "active" ? (
//                             <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 shadow-sm">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm font-medium text-emerald-700">Total Active</p>
//                                         <p className="text-3xl font-bold text-emerald-600">{totalActive}</p>
//                                     </div>
//                                     <CheckCircle
//                                         size={40}
//                                         className="text-emerald-600 opacity-20"
//                                     />
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="rounded-lg border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 p-4 shadow-sm">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm font-medium text-rose-700">Total Inactive</p>
//                                         <p className="text-3xl font-bold text-rose-600">{totalInactive}</p>
//                                     </div>
//                                     <XCircle
//                                         size={40}
//                                         className="text-rose-600 opacity-20"
//                                     />
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Data Table */}
//             {loading ? (
//                 <div className="flex items-center justify-center py-16">
//                     <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
//                 </div>
//             ) : filteredData.length === 0 ? (
//                 <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-md">
//                     <p className="text-lg text-gray-600">
//                         No {activeTab} {filterRole !== "All" ? filterRole.toLowerCase() : ""} records found.
//                     </p>
//                 </div>
//             ) : (
//                 <div className="animate-in fade-in slide-in-from-bottom-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg duration-500">
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-sm text-gray-700">
//                             <thead className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
//                                 <tr>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">#</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">User</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">Role</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">Designation</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">Department</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">Company</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">Today's Attendance</th>
//                                     <th className="px-4 py-4 text-left font-semibold text-gray-700">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {filteredData.map((user, index) => (
//                                     <TableRow
//                                         key={user._id || index}
//                                         user={user}
//                                         index={index + 1}
//                                     />
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}

//             {/* View Details Modal */}
//             {viewModal && selectedUser && (
//                 <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md duration-300">
//                     <div className="animate-in zoom-in relative flex h-screen w-screen flex-col overflow-y-auto rounded-none border-0 bg-white shadow-2xl duration-300">
//                         <div className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white p-6">
//                             <h2 className="text-3xl font-bold text-gray-900">Attendance Details</h2>
//                             <div className="flex items-center gap-4">
//                                 {/* <button
//                                     onClick={handlePrint}
//                                     className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg"
//                                     title="Print attendance details"
//                                 >
//                                     <Printer size={20} />
//                                     Print
//                                 </button> */}
//                                 <button
//                                     className="text-gray-400 transition-colors hover:text-gray-600"
//                                     onClick={() => setViewModal(false)}
//                                 >
//                                     <X size={32} />
//                                 </button>
//                             </div>
//                         </div>

//                         <div
//                             className="flex-1 overflow-y-auto p-8"
//                             ref={printRef}
//                         >
//                             {/* HEADER SECTION - Employee Details */}
//                             <div className="mb-8">
//                                 {/* Employee Header */}
//                                 <div className="mb-6">
//                                     <div className="flex items-start gap-4">
//                                         <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-2xl font-bold text-white">
//                                             {selectedUser?.fullName?.charAt(0).toUpperCase()}
//                                         </div>
//                                         <div>
//                                             <h3 className="text-2xl font-bold text-gray-900">{selectedUser?.fullName}</h3>
//                                             <p className="mt-1 text-sm text-gray-600">{selectedUser?.userType}</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Employee Info Grid (2 columns) */}
//                                 <div className="grid grid-cols-2 gap-6 rounded-lg bg-gray-50 p-6">
//                                     {/* Contact Information */}
//                                     <div>
//                                         <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">Contact Information</h3>
//                                         <div className="space-y-2">
//                                             <div>
//                                                 <p className="text-xs font-medium text-gray-500">Email</p>
//                                                 <p className="text-sm text-gray-800">{selectedUser?.email || "N/A"}</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-xs font-medium text-gray-500">Phone</p>
//                                                 <p className="text-sm text-gray-800">{selectedUser?.phone || "N/A"}</p>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Work Information */}
//                                     <div>
//                                         <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">Work Information</h3>
//                                         <div className="space-y-2">
//                                             <div>
//                                                 <p className="text-xs font-medium text-gray-500">Department</p>
//                                                 <p className="text-sm text-gray-800">{getDepartmentName(selectedUser)}</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-xs font-medium text-gray-500">Company</p>
//                                                 <p className="text-sm text-gray-800">{getCompanyName(selectedUser)}</p>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Status Information */}
//                                     <div>
//                                         <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">Status</h3>
//                                         <div className="space-y-2">
//                                             <div>
//                                                 <p className="text-xs font-medium text-gray-500">Account Status</p>
//                                                 <div className="mt-1">
//                                                     {selectedUser?.accountActive ? (
//                                                         <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
//                                                             <CheckCircle size={14} />
//                                                             Active
//                                                         </span>
//                                                     ) : (
//                                                         <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
//                                                             <XCircle size={14} />
//                                                             Inactive
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Dates */}
//                                     <div>
//                                         <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">Dates</h3>
//                                         <div className="space-y-2">
//                                             <div>
//                                                 <p className="text-xs font-medium text-gray-500">Join Date</p>
//                                                 <p className="text-sm text-gray-800">
//                                                     {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString("en-IN") : "N/A"}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* BOTTOM SECTION - Calendar & Attendance Summary Side by Side */}
//                             <div className="border-t border-gray-200 pt-8">
//                                 <div className="grid grid-cols-4 gap-8">
//                                     {/* LEFT - Monthly Attendance Calendar (takes 2.5 columns) */}
//                                     <div className="col-span-3">
//                                         {/* Month & Year Selection */}
//                                         <div className="mb-8">
//                                             <div className="mb-6 flex flex-col items-center gap-4">
//                                                 <h3 className="text-center text-4xl font-bold text-gray-900">
//                                                     {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
//                                                 </h3>

//                                                 <div className="flex items-center gap-4">
//                                                     {/* Month Selector */}
//                                                     <select
//                                                         value={currentMonth.getMonth()}
//                                                         onChange={(e) =>
//                                                             setCurrentMonth(new Date(currentMonth.getFullYear(), parseInt(e.target.value)))
//                                                         }
//                                                         className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                                     >
//                                                         <option value="0">January</option>
//                                                         <option value="1">February</option>
//                                                         <option value="2">March</option>
//                                                         <option value="3">April</option>
//                                                         <option value="4">May</option>
//                                                         <option value="5">June</option>
//                                                         <option value="6">July</option>
//                                                         <option value="7">August</option>
//                                                         <option value="8">September</option>
//                                                         <option value="9">October</option>
//                                                         <option value="10">November</option>
//                                                         <option value="11">December</option>
//                                                     </select>

//                                                     {/* Year Selector */}
//                                                     <select
//                                                         value={currentMonth.getFullYear()}
//                                                         onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth()))}
//                                                         className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                                     >
//                                                         {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
//                                                             <option
//                                                                 key={year}
//                                                                 value={year}
//                                                             >
//                                                                 {year}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             </div>

//                                             {/* Navigation Buttons */}
//                                             <div className="flex justify-center gap-2">
//                                                 <button
//                                                     onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
//                                                     className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
//                                                 >
//                                                     ← Prev Month
//                                                 </button>
//                                                 <button
//                                                     onClick={() => setCurrentMonth(new Date())}
//                                                     className="rounded-lg bg-blue-100 px-4 py-2 font-medium text-blue-700 transition-colors hover:bg-blue-200"
//                                                 >
//                                                     Today
//                                                 </button>
//                                                 <button
//                                                     onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
//                                                     className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
//                                                 >
//                                                     Next Month →
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         {/* Monthly Attendance Grid */}
//                                         <MonthlyAttendanceGrid
//                                             attendanceData={monthlyAttendance}
//                                             month={currentMonth}
//                                         />
//                                     </div>

//                                     {/* RIGHT - Attendance & Salary Summary (Stacked) */}
//                                     <div className="sticky top-8 col-span-1 flex h-fit flex-col gap-6">
//                                         {/* Attendance Summary */}
//                                         <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
//                                             <h3 className="mb-2 text-lg font-bold text-gray-900">Attendance Summary</h3>
//                                             <p className="mb-6 text-xs font-medium text-gray-600">
//                                                 {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
//                                             </p>

//                                             {(() => {
//                                                 const stats = calculateAttendanceStats(monthlyAttendance, currentMonth);
//                                                 const summaryData = [
//                                                     {
//                                                         label: "Present",
//                                                         value: stats.present,
//                                                         color: "bg-emerald-100 text-emerald-700",
//                                                         bgColor: "bg-emerald-50",
//                                                     },
//                                                     {
//                                                         label: "Grace Present",
//                                                         value: stats.gracePresent,
//                                                         color: "bg-blue-100 text-blue-700",
//                                                         bgColor: "bg-blue-50",
//                                                     },
//                                                     {
//                                                         label: "Late",
//                                                         value: stats.late,
//                                                         color: "bg-orange-100 text-orange-700",
//                                                         bgColor: "bg-orange-50",
//                                                     },
//                                                     {
//                                                         label: "Absent",
//                                                         value: stats.absent,
//                                                         color: "bg-rose-100 text-rose-700",
//                                                         bgColor: "bg-rose-50",
//                                                     },
//                                                 ];

//                                                 return (
//                                                     <div className="space-y-3">
//                                                         {summaryData.map((item, idx) => (
//                                                             <div
//                                                                 key={idx}
//                                                                 className={`${item.bgColor} rounded-lg border-l-4 border-current p-3 text-sm`}
//                                                             >
//                                                                 <div className="flex items-center justify-between">
//                                                                     <span className="font-semibold text-gray-700">{item.label}</span>
//                                                                     <span className={`text-xl font-bold ${item.color.split(" ")[1]}`}>
//                                                                         {item.value}
//                                                                     </span>
//                                                                 </div>
//                                                                 <p className="mt-1 text-xs text-gray-500">
//                                                                     {stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%
//                                                                 </p>
//                                                             </div>
//                                                         ))}

//                                                         {/* Total */}
//                                                         <div className="mt-4 border-t border-blue-200 pt-3">
//                                                             <div className="flex items-center justify-between">
//                                                                 <span className="text-sm font-bold text-gray-800">Total Days</span>
//                                                                 <span className="text-xl font-bold text-blue-700">{stats.total}</span>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 );
//                                             })()}
//                                         </div>

//                                         {/* Salary Summary */}
//                                         <div className="rounded-lg border border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
//                                             <h3 className="mb-2 text-lg font-bold text-gray-900">Salary Summary</h3>
//                                             <p className="mb-6 text-xs font-medium text-gray-600">
//                                                 {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
//                                             </p>

//                                             {(() => {
//                                                 const stats = calculateAttendanceStats(monthlyAttendance, currentMonth);
//                                                 const monthlyBaseSalary = 30000; // Static monthly salary
//                                                 const perDaySalary = monthlyBaseSalary / 30; // Assuming 30 working days per month
//                                                 const presentDays = stats.present + stats.gracePresent; // Count present and grace present as working days
//                                                 const totalEarned = perDaySalary * presentDays;

//                                                 return (
//                                                     <div className="space-y-3 text-sm">
//                                                         {/* Base Salary */}
//                                                         <div className="rounded-lg border border-green-200 bg-white p-3">
//                                                             <div className="flex items-center justify-between">
//                                                                 <span className="font-semibold text-gray-700">Base Salary</span>
//                                                                 <span className="font-bold text-gray-800">
//                                                                     ₹{monthlyBaseSalary.toLocaleString("en-IN")}
//                                                                 </span>
//                                                             </div>
//                                                         </div>

//                                                         {/* Per Day Salary */}
//                                                         <div className="rounded-lg border border-green-200 bg-white p-3">
//                                                             <div className="flex items-center justify-between">
//                                                                 <span className="font-semibold text-gray-700">Per Day</span>
//                                                                 <span className="font-bold text-gray-800">₹{perDaySalary.toFixed(0)}</span>
//                                                             </div>
//                                                         </div>

//                                                         {/* Working Days */}
//                                                         <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-3">
//                                                             <div className="flex items-center justify-between">
//                                                                 <span className="font-semibold text-gray-700">Working Days</span>
//                                                                 <span className="text-xl font-bold text-emerald-600">{presentDays}</span>
//                                                             </div>
//                                                         </div>

//                                                         {/* Earned Salary */}
//                                                         <div className="rounded-lg border-l-4 border-green-600 bg-gradient-to-r from-green-100 to-emerald-100 p-3">
//                                                             <div className="flex items-center justify-between">
//                                                                 <span className="font-bold text-gray-800">Earned</span>
//                                                                 <span className="text-lg font-bold text-green-700">
//                                                                     ₹{totalEarned.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
//                                                                 </span>
//                                                             </div>
//                                                         </div>

//                                                         {/* Final Payable */}
//                                                         <div className="rounded-lg border-2 border-emerald-700 bg-gradient-to-r from-emerald-500 to-green-600 p-3 text-white">
//                                                             <div className="flex items-center justify-between">
//                                                                 <span className="text-sm font-bold">Payable</span>
//                                                                 <span className="text-lg font-bold">
//                                                                     ₹{totalEarned.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
//                                                                 </span>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 );
//                                             })()}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-white p-6">
//                             <button
//                                 onClick={() => setViewModal(false)}
//                                 className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* 📅 Date Attendance Edit Modal */}
//             {isEditModalOpen && selectedDateForEdit && (
//                 <DateAttendanceEditModal
//                     date={selectedDateForEdit.date}
//                     dayRecords={selectedDateForEdit.records}
//                     onClose={() => {
//                         setIsEditModalOpen(false);
//                         setSelectedDateForEdit(null);
//                     }}
//                     onSave={handleSaveDateAttendance}
//                 />
//             )}

//             {/* Add Tailwind animations if not already present */}
//             <style>{`
//         @keyframes slideInFromBottom {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-in {
//           animation: slideInFromBottom 0.5s ease-out;
//         }
        
//         .fade-in {
//           animation: fadeIn 0.3s ease-in;
//         }
        
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }
        
//         .slide-in-from-bottom-4 {
//           animation: slideInFromBottom 0.5s ease-out;
//         }
        
//         .zoom-in {
//           animation: zoomIn 0.3s ease-out;
//         }
        
//         @keyframes zoomIn {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//       `}</style>
//         </div>
//     );
// };

// export default React.memo(AdminAttendance);




import React, { useEffect, useState, useRef } from "react";
import { Eye, Edit2, Trash2, X, Users, CheckCircle, XCircle, Mail, Phone, Printer } from "lucide-react";
import axios from "axios";

// CSS Class Helper Functions
const STYLES = {
    // Responsive padding
    p: {
        responsive: "p-3 sm:p-4 md:p-6",
        small: "p-2 sm:p-2.5 md:p-3",
    },
    // Responsive text sizes
    text: {
        lg: "text-lg sm:text-xl md:text-2xl",
        base: "text-base sm:text-sm md:text-base",
        sm: "text-xs sm:text-xs md:text-sm",
        xs: "text-xs",
        title: "text-lg sm:text-xl md:text-2xl",
    },
    // Responsive gaps
    gap: {
        responsive: "gap-2 sm:gap-3 md:gap-4",
        small: "gap-1 sm:gap-2 md:gap-3",
    },
    // Responsive input/button
    input: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-base transition-all focus:outline-none focus:ring-2 focus:ring-blue-500",
    button: "rounded-lg px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-3 md:text-base font-medium transition-all",
    buttonPrimary: "rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg",
    buttonSecondary: "rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800",
    // Badge styles
    badgeActive: "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 sm:px-3 sm:py-1 md:px-3 md:py-1 text-xs font-semibold text-emerald-700",
    badgeInactive: "inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 sm:px-3 sm:py-1 md:px-3 md:py-1 text-xs font-semibold text-rose-700",
    // Status cards
    cardContainer: "rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden",
    cardHeader: "border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 sm:px-4 sm:py-3 md:px-4 md:py-3 flex items-center justify-between",
    cardBody: "p-3 sm:p-4 md:p-4 space-y-2 sm:space-y-2.5 md:space-y-3 text-xs sm:text-xs md:text-sm",
    // Modal styles
    modalOverlay: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md duration-300",
    modalContent: "relative flex h-full w-full flex-col overflow-y-auto rounded-lg border-0 bg-white shadow-2xl duration-300 md:h-screen md:w-screen md:rounded-none",
    // Responsive grid
    gridResponsive: "grid grid-cols-1 gap-3 sm:gap-4 md:gap-6",
    // Responsive flex
    flexResponsive: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 md:gap-6",
};

// Format time helper
const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
};

const AdminAttendance = ({ searchText, isEmployeeView = false }) => {
    console.log("EmployeeTable rendered");
    const userId = localStorage.getItem("userId");
    const [data, setData] = useState({ active: [], inactive: [] });
    const [activeTab, setActiveTab] = useState("active");
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("All");
    const [viewModal, setViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [monthlyAttendance, setMonthlyAttendance] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const printRef = useRef(null);
    const [selectedDateForEdit, setSelectedDateForEdit] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const token = localStorage.getItem("token");
    const globalRole = localStorage.getItem("role");

    const getDesignationName = (employee) => {
        // console.log(employee);

        if (typeof employee?.designation === "string") {
            return employee.designation;
        }
        // Handle object with 'designation' property (from MongoDB population)
        if (employee?.designation && typeof employee.designation === "object") {
            return employee.designation.designation || employee.designation.title || "Employee";
        }
        return "Employee";
    };

    /* -------------------------------------------------------------------------- */
    /* 📦 Fetch Employee & Admin Data (User Details, Not Attendance) */
    /* -------------------------------------------------------------------------- */
    const fetchAllData = async () => {
        try {
            setLoading(true);
            // console.log("abz");

            // If in employee view, only fetch current employee's data
            if (isEmployeeView && userId) {
                try {
                    const employeeRes = await axios.get(`http://localhost:4000/employee/getEmployee/${userId}`);
                    const currentEmployee = employeeRes?.data?.employee || {};

                    const enrichedEmployee = {
                        ...currentEmployee,
                        userType: "Employee",
                        role: currentEmployee?.designation?.designation || "Employee",
                        accountActive: true,
                    };

                    setData({
                        active: [enrichedEmployee],
                        inactive: [],
                    });

                    fetchTodayAttendance([enrichedEmployee]);
                    setLoading(false);
                    return;
                } catch (error) {
                    console.error("Error fetching employee data:", error);
                    setLoading(false);
                    return;
                }
            }

            const [adminRes, employeeRes] = await Promise.all([
                axios.get("http://localhost:4000/getAdmins"),
                axios.get("http://localhost:4000/employee/allEmployee"),
            ]);

            const adminData = adminRes?.data?.admins || adminRes?.data || [];
            const employeeData = employeeRes?.data?.employees || employeeRes?.data || [];

            // Enrich with type for easy identification
            const enrichedAdmins = adminData.map((admin) => ({
                ...admin,
                userType: "Admin",
                role: "Admin",
            }));

            const enrichedEmployees = employeeData.map((emp) => ({
                ...emp,
                userType: "Employee",
                role: emp?.designation || "Employee",
            }));

            // Combine all users
            const allUsers = [...enrichedAdmins, ...enrichedEmployees];

            // Separate active and inactive based on accountActive field
            const activeUsers = allUsers.filter((user) => user?.accountActive === true || user?.accountActive === "true");

            const inactiveUsers = allUsers.filter((user) => user?.accountActive === false || user?.accountActive === "false" || !user?.accountActive);

            setData({
                active: activeUsers,
                inactive: inactiveUsers,
            });

            // Fetch today's attendance data for all users
            fetchTodayAttendance(allUsers);
        } catch (error) {
            console.error("⚠️ Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    /* -------------------------------------------------------------------------- */
    /* 📦 Fetch Today's Attendance Data */
    /* -------------------------------------------------------------------------- */
    const fetchTodayAttendance = async (allUsers) => {
        try {
            // Format today's date to pass as query parameter for optimization
            const today = new Date().toISOString().split("T")[0];

            const [adminAttendanceRes, employeeAttendanceRes] = await Promise.all([
                axios.get(`http://localhost:4000/adminAttendance/getAllAttendance?date=${today}`),
                axios.get(`http://localhost:4000/attendance/getAllAttendance?date=${today}`),
            ]);

            // Both endpoints return arrays directly
            const adminAttendance = Array.isArray(adminAttendanceRes?.data) ? adminAttendanceRes.data : [];
            const employeeAttendance = Array.isArray(employeeAttendanceRes?.data) ? employeeAttendanceRes.data : [];

            // Create a map of user attendance
            const attendanceById = {};

            // Process admin attendance
            adminAttendance.forEach((record) => {
                try {
                    // admin field is populated object with _id
                    const adminId = record?.admin?._id;
                    if (adminId) {
                        attendanceById[`admin_${adminId}`] = {
                            clockIn: record?.clockIn,
                            clockOut: record?.clockOut,
                        };
                    }
                } catch (e) {
                    console.warn("Error processing admin attendance record:", e);
                }
            });

            // Process employee attendance
            employeeAttendance.forEach((record) => {
                try {
                    // employee field is populated object with _id
                    const employeeId = record?.employee?._id;
                    if (employeeId) {
                        attendanceById[`employee_${employeeId}`] = {
                            clockIn: record?.clockIn,
                            clockOut: record?.clockOut,
                        };
                    }
                } catch (e) {
                    console.warn("Error processing employee attendance record:", e);
                }
            });

            setAttendanceMap(attendanceById);
        } catch (error) {
            console.error("⚠️ Error fetching attendance data:", error);
        }
    };

    // useEffect(() => {
    //     fetchAllData();
    // }, [isEmployeeView, userId]);

    useEffect(() => {
        fetchAllData();
    }, []);

    /* -------------------------------------------------------------------------- */
    /* 📅 Refetch monthly attendance when month changes */
    /* -------------------------------------------------------------------------- */
    // useEffect(() => {
    //     if (selectedUser && currentMonth) {
    //         fetchMonthlyAttendance(selectedUser, currentMonth);
    //     }
    // }, [currentMonth, selectedUser]);

    useEffect(() => {
        if (selectedUser && viewModal) {
            fetchMonthlyAttendance(selectedUser);
        }
    }, [currentMonth, selectedUser, viewModal]);

    /* -------------------------------------------------------------------------- */
    /* 🔍 Filter & Search Data */
    /* -------------------------------------------------------------------------- */
    const getFilteredData = () => {
        const dataToFilter = activeTab === "active" ? data.active : data.inactive;

        return dataToFilter
            .filter((user) => {
                const name = user?.fullName?.toLowerCase() || "";
                const email = user?.email?.toLowerCase() || "";
                const phone = user?.phone?.toLowerCase() || "";
                const q = searchQuery.toLowerCase();
                return name.includes(q) || email.includes(q) || phone.includes(q);
            })
            .filter((user) => filterRole === "All" || user?.userType === filterRole || user?.role === filterRole);
    };

    const filteredData = getFilteredData();
    // console.log(filteredData);

    const totalActive = data.active.length;
    const totalInactive = data.inactive.length;

    /* -------------------------------------------------------------------------- */
    /* 👁️ View User Details Modal */
    /* -------------------------------------------------------------------------- */
    // const handleViewClick = async (user) => {
    //     setSelectedUser(user);
    //     const newMonth = new Date();
    //     setCurrentMonth(newMonth);
    //     // Fetch monthly attendance for this user with the current month
    //     setViewModal(true);
    //     // await fetchMonthlyAttendance(user, newMonth);
    // };

    const handleViewClick = async (user) => {
        setSelectedUser(user);
        setViewModal(true);
        setCurrentMonth(new Date());
    };

    /* -------------------------------------------------------------------------- */
    /* 📊 Fetch Monthly Attendance Data */
    /* -------------------------------------------------------------------------- */
    const fetchMonthlyAttendance = async (user, monthToFetch = null) => {
        try {
            // Use provided month or fall back to currentMonth
            const month = monthToFetch || currentMonth;

            // Get the current month's start and end dates
            const year = month.getFullYear();
            const monthNum = month.getMonth();
            const firstDay = new Date(year, monthNum, 1).toISOString().split("T")[0];
            const lastDay = new Date(year, monthNum + 1, 0).toISOString().split("T")[0];

            let attendanceData = [];
            setCurrentUser(user);
            console.log(user);

            if (user.userType === "Admin") {
                // Fetch only this admin's attendance for the current month
                const res = await axios.get(
                    `http://localhost:4000/adminAttendance/getAllAttendance?adminId=${user._id}&startDate=${firstDay}&endDate=${lastDay}`,
                );
                attendanceData = Array.isArray(res?.data) ? res.data : [];
            } else {
                // Fetch only this employee's attendance for the current month
                const res = await axios.get(
                    `http://localhost:4000/attendance/getAllAttendance?employeeId=${user._id}&startDate=${firstDay}&endDate=${lastDay}`,
                );
                attendanceData = Array.isArray(res?.data) ? res.data : [];
            }

            setMonthlyAttendance(attendanceData);
        } catch (error) {
            console.error("⚠️ Error fetching monthly attendance:", error);
            setMonthlyAttendance([]);
        }
    };

    /* -------------------------------------------------------------------------- */
    /* 📅 Handle Date Card Double Click */
    /* -------------------------------------------------------------------------- */
    const handleDateCardDoubleClick = (date, dayRecords) => {
        setSelectedDateForEdit({
            date,
            records: dayRecords || [],
        });
        setIsEditModalOpen(true);
    };

    /* -------------------------------------------------------------------------- */
    /* 💾 Save Date Attendance */
    /* -------------------------------------------------------------------------- */
    const handleSaveDateAttendance = async (updatedData) => {
        if (!selectedDateForEdit) return;

        try {
            if (selectedDateForEdit.records && selectedDateForEdit.records.length > 0) {
                // Update existing record
                const attendance = selectedDateForEdit.records[0];
                const res = await fetch(`http://localhost:4000/attendance/${attendance._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedData),
                });

                if (!res.ok) throw new Error("Failed to update");
                const result = await res.json();

                // Refresh attendance data
                if (selectedUser?._id) {
                    fetchMonthlyAttendance(selectedUser);
                }
            } else {
                // Create new record
                const res = await fetch(`http://localhost:4000/attendance`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        employee: selectedUser._id,
                        date: new Date(selectedDateForEdit.date),
                        ...updatedData,
                    }),
                });

                if (!res.ok) throw new Error("Failed to create attendance");

                // Refresh attendance data
                if (selectedUser?._id) {
                    fetchMonthlyAttendance(selectedUser);
                }
            }

            setIsEditModalOpen(false);
            setSelectedDateForEdit(null);
        } catch (err) {
            console.error("Error saving attendance:", err);
            alert("Error saving attendance: " + err.message);
        }
    };

    const getDepartmentName = (user) => {
        if (typeof user?.department === "string") {
            return user.department;
        }
        // Handle object with various possible property names
        // Note: Backend populates department with "dep" field
        return user?.department?.dep || user?.department?.departmentName || user?.department?.name || user?.department?.department || "N/A";
    };

    const getCompanyName = (user) => {
        if (typeof user?.company === "string") {
            return user.company;
        }
        return user?.company?.companyName || "N/A";
    };

    /* -------------------------------------------------------------------------- */
    /* 📊 Calculate Attendance Statistics by Month */
    /* -------------------------------------------------------------------------- */
    const calculateAttendanceStats = (attendanceData, month) => {
        const stats = {
            present: 0,
            gracePresent: 0,
            late: 0,
            absent: 0,
            total: 0,
        };

        if (!Array.isArray(attendanceData)) return stats;

        const monthNum = month.getMonth();
        const yearNum = month.getFullYear();

        // Filter data for the selected month
        const monthData = attendanceData.filter((record) => {
            if (!record?.date) return false;
            const recordDate = new Date(record.date);
            return recordDate.getMonth() === monthNum && recordDate.getFullYear() === yearNum;
        });

        monthData.forEach((record) => {
            const status = record?.status || "Absent";

            if (status === "Present") stats.present++;
            else if (status === "Grace Present" || status === "Grace") stats.gracePresent++;
            else if (status === "Late") stats.late++;
            else if (status === "Absent") stats.absent++;

            stats.total++;
        });

        return stats;
    };

    /* -------------------------------------------------------------------------- */
    /* ✏️ Edit Attendance Modal */
    /* -------------------------------------------------------------------------- */
    // Removed old edit modal code - users are now displayed with view-only modal

    /* -------------------------------------------------------------------------- */
    /* 💾 Save Attendance Changes */
    /* -------------------------------------------------------------------------- */
    // Removed old save edit code

    /* -------------------------------------------------------------------------- */
    /* 📅 Date Attendance Edit Modal Component */
    /* -------------------------------------------------------------------------- */
    const DateAttendanceEditModal = ({ date, dayRecords, onClose, onSave }) => {
        const statusOptions = ["Present", "Absent", "Late", "Grace Present", "Half Day", "Sunday", "Holiday"];

        const formatLocalDateTime = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            const offset = date.getTimezoneOffset();
            const local = new Date(date.getTime() - offset * 60 * 1000);
            return local.toISOString().slice(0, 16);
        };

        const [clockIn, setClockIn] = useState(dayRecords && dayRecords.length > 0 ? formatLocalDateTime(dayRecords[0]?.clockIn) : "");
        const [clockOut, setClockOut] = useState(dayRecords && dayRecords.length > 0 ? formatLocalDateTime(dayRecords[0]?.clockOut) : "");
        const [status, setStatus] = useState(dayRecords && dayRecords.length > 0 ? dayRecords[0]?.status : "Present");

        const handleSubmit = () => {
            const toServerFormat = (localString) => {
                if (!localString) return null;
                return new Date(localString);
            };

            const updatedData = {
                clockIn: toServerFormat(clockIn),
                clockOut: clockOut ? toServerFormat(clockOut) : null,
                status,
            };

            onSave(updatedData);
        };

        const dateStr = new Date(date).toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                {/* Modal Card */}
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                    <h2 className="mb-2 text-center text-lg font-semibold">Edit Attendance</h2>
                    <p className="mb-4 text-center text-sm text-gray-600">{dateStr}</p>

                    <div className="space-y-4">
                        {/* Clock In */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Clock In Time</label>
                            <input
                                type="datetime-local"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={clockIn}
                                onChange={(e) => setClockIn(e.target.value)}
                            />
                        </div>

                        {/* Clock Out */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Clock Out Time</label>
                            <input
                                type="datetime-local"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={clockOut}
                                onChange={(e) => setClockOut(e.target.value)}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                {statusOptions.map((s) => (
                                    <option
                                        key={s}
                                        value={s}
                                    >
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    /* -------------------------------------------------------------------------- */
    /* 🧾 Table Row Component */
    /* -------------------------------------------------------------------------- */
    const TableRow = ({ user, index }) => {
        const name = user?.fullName || "N/A";
        const email = user?.email || "-";
        const phone = user?.phone || "-";
        const role = user?.userType || "Unknown";
        const department = getDepartmentName(user);
        const company = getCompanyName(user);
        // console.log(user);

        // console.log(globalRole,"jnjfn");

        // Get today's attendance data
        const attendanceKey = `${user.userType === "Admin" ? "admin" : "employee"}_${user._id}`;
        const todayAttendance = attendanceMap[attendanceKey];

        const formatTime = (isoString) => {
            if (!isoString) return "--:--";
            const date = new Date(isoString);
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${hours}:${minutes}`;
        };

        const clockInTime = formatTime(todayAttendance?.clockIn);
        const clockOutTime = formatTime(todayAttendance?.clockOut);

        const roleColor = role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-cyan-100 text-cyan-700";

        const statusColor = activeTab === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

        return (
            <>
                <tr
                    key={user._id || index}
                    className="border-b border-gray-200 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent"
                >
                    <td className="px-4 py-3 font-medium text-gray-600">{index + 1}</td>

                    {/* User Avatar + Name */}
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-sm font-semibold text-white">
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{name}</p>
                                <p className="text-xs text-gray-500">{email}</p>
                            </div>
                        </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleColor}`}>{role}</span>
                    </td>

                    {/* Designation */}
                    {/* <td className="px-4 py-3 text-sm text-gray-700 ">
                    {user.userType === "Admin"
                        ? typeof user?.designation === "object"
                            ? user?.designation?.designation || "Admin"
                            : user?.designation || "Admin"
                        : typeof user?.designation === "object"
                          ? user?.designation?.designation || "N/A"
                          : user?.designation || "N/A"}
                </td> */}

                    <td className="px-4 py-3">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{getDesignationName(user)}</span>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3 text-sm text-gray-700">{department}</td>

                    {/* Company */}
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{company}</td>

                    {/* Today's Date - Clock In/Out */}
                    <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-medium text-gray-600">{new Date().toLocaleDateString("en-IN")}</p>
                            <div className="flex items-center gap-2 text-xs">
                                <span
                                    className={`rounded px-2 py-1 font-medium ${clockInTime === "--:--" ? "bg-gray-50 text-gray-600" : "bg-blue-50 text-blue-700"}`}
                                >
                                    IN: {clockInTime}
                                </span>
                                <span
                                    className={`rounded px-2 py-1 font-medium ${clockOutTime === "--:--" ? "bg-gray-50 text-gray-600" : "bg-amber-50 text-amber-700"}`}
                                >
                                    OUT: {clockOutTime}
                                </span>
                            </div>
                        </div>
                    </td>

                    {/* Actions */}
                    <td className="flex gap-2 px-4 py-3">
                        <button
                            disabled={viewModal}
                            onClick={() => handleViewClick(user)}
                            className="rounded-full bg-blue-100 p-2 text-blue-600 shadow-sm"
                            title="View Details"
                        >
                            <Eye size={16} />
                        </button>
                        {/* <button
                        className="rounded-full bg-gray-100 p-2 text-gray-600 shadow-sm  hover:bg-gray-200 hover:shadow-md"
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button> */}
                        {/* {globalRole === "admin" && role === "Employee" && (
                        <button
                            className="rounded-full bg-gray-100 p-2 text-gray-600 shadow-sm transition-colors duration-200 hover:bg-gray-200 hover:shadow-md"
                            title="Edit"
                        >
                            <Edit2 size={16} />
                        </button>
                    )} */}
                    </td>
                </tr>
            </>
        );
    };

    /* -------------------------------------------------------------------------- */
    /* 📅 Monthly Attendance Grid Component */
    /* -------------------------------------------------------------------------- */
    const MonthlyAttendanceGrid = ({ attendanceData, month }) => {
        // console.log(currentUser?.userType);

        // Get all days in the month
        const year = month.getFullYear();
        const monthNum = month.getMonth();
        const firstDay = new Date(year, monthNum, 1);
        const lastDay = new Date(year, monthNum + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Create a map of attendance by date
        const attendanceMap = {};
        attendanceData.forEach((record) => {
            if (record?.date) {
                const date = new Date(record.date);
                const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

                if (!attendanceMap[dateKey]) {
                    attendanceMap[dateKey] = [];
                }
                attendanceMap[dateKey].push(record);
            }
        });

        // Track last tap time for mobile double-tap detection
        const lastTapRef = useRef(0);
        const tapTimerRef = useRef(null);

        // Format time from ISO string
        const formatTime = (isoString) => {
            if (!isoString) return "--:--";
            const date = new Date(isoString);
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${hours}:${minutes}`;
        };

        // Handle mobile double-tap or click on date card
        const handleDateCardInteraction = (date, dayRecords) => {
            if (globalRole !== "admin" || currentUser?.userType !== "Employee") {
                return;
            }

            const currentTime = new Date().getTime();
            const timeBetweenTaps = currentTime - lastTapRef.current;

            // Check if this is a double-tap (within 300ms)
            if (timeBetweenTaps < 300 && timeBetweenTaps > 0) {
                // Double-tap detected
                clearTimeout(tapTimerRef.current);
                lastTapRef.current = 0;
                handleDateCardDoubleClick(date, dayRecords);
            } else {
                // Single tap - start timer for potential double-tap
                lastTapRef.current = currentTime;
                tapTimerRef.current = setTimeout(() => {
                    lastTapRef.current = 0;
                }, 300);
            }
        };

        // Get status from attendance records
        const getAttendanceStatus = (dayRecords) => {
            if (!dayRecords || dayRecords.length === 0) return null;
            const record = dayRecords[0];
            return record?.status || "Present";
        };

        // Get status color styles with gradients
        const getStatusColor = (status) => {
            switch (status?.toLowerCase()) {
                case "present":
                    return "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300 shadow-emerald-100";
                case "grace present":
                case "grace":
                    return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-blue-100";
                case "late":
                    return "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 shadow-orange-100";
                case "half day":
                    return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-yellow-100";
                case "holiday":
                case "holidays":
                    return "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 shadow-purple-100";
                case "sunday":
                    return "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300 shadow-pink-100";
                case "absent":
                    return "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-300 shadow-rose-100";
                default:
                    return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 shadow-gray-100";
            }
        };

        const getStatusBadgeColor = (status) => {
            switch (status?.toLowerCase()) {
                case "present":
                    return "bg-emerald-500 text-white";
                case "grace present":
                case "grace":
                    return "bg-blue-500 text-white";
                case "late":
                    return "bg-orange-500 text-white";
                case "half day":
                    return "bg-yellow-500 text-white";
                case "holiday":
                case "holidays":
                    return "bg-purple-500 text-white";
                case "sunday":
                    return "bg-pink-500 text-white";
                case "absent":
                    return "bg-rose-500 text-white";
                default:
                    return "bg-gray-500 text-white";
            }
        };

        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const dateKey = `${year}-${monthNum}-${i}`;
            const dayRecords = attendanceMap[dateKey];
            const status = getAttendanceStatus(dayRecords);

            const clockInTime = dayRecords && dayRecords.length > 0 ? formatTime(dayRecords[0]?.clockIn) : "--:--";
            const clockOutTime = dayRecords && dayRecords.length > 0 ? formatTime(dayRecords[0]?.clockOut) : "--:--";
            const date = new Date(year, monthNum, i);
            days.push(
                <div
                    key={i}
                    className={`cursor-pointer rounded-lg border-2 p-6 text-lg transition-transform hover:shadow-lg active:scale-95 ${getStatusColor(status)}`}
                    onDoubleClick={() => handleDateCardInteraction(date, dayRecords)}
                    onClick={() => handleDateCardInteraction(date, dayRecords)}
                    title="Double-click or double-tap to edit"
                >
                    <div className="space-y-4">
                        {/* Date Number */}
                        <div className="flex items-center justify-center">
                            <p className="text-3xl font-bold text-gray-900">{i}</p>
                        </div>

                        {dayRecords && dayRecords.length > 0 ? (
                            <div className="space-y-3">
                                {/* Clock In/Out Times */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold text-gray-700">IN:</span>
                                        <span className={`truncate font-bold ${clockInTime === "--:--" ? "text-gray-400" : "text-emerald-600"}`}>
                                            {clockInTime}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold text-gray-700">OUT:</span>
                                        <span className={`truncate font-bold ${clockOutTime === "--:--" ? "text-gray-400" : "text-rose-600"}`}>
                                            {clockOutTime}
                                        </span>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="flex justify-center border-t border-gray-300 border-opacity-40 pt-3">
                                    <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${getStatusBadgeColor(status)}`}>
                                        {status || "No Status"}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="py-3 text-center">
                                <span className="inline-block rounded-full bg-gray-300 px-4 py-1.5 text-sm font-semibold text-gray-700">No Data</span>
                            </div>
                        )}
                    </div>
                </div>,
            );
        }

        return (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-7">
                {/* Day headers - show only on desktop */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                        key={day}
                        className="hidden rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 py-2 text-center text-sm font-bold text-gray-700 md:block"
                    >
                        {day}
                    </div>
                ))}

                {/* Empty cells for days before month starts - hide on mobile */}
                {Array.from({ length: firstDay.getDay() }).map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        className="hidden md:block"
                    ></div>
                ))}

                {/* Day cells */}
                {days}
            </div>
        );
    };

    /* -------------------------------------------------------------------------- */
    /* 🖨️ Print Function */
    /* -------------------------------------------------------------------------- */
    // const handlePrint = () => {
    //     // if (!printRef.current) return;
    //     if (!printRef.current || modalLoading) return;
    //     console.log(printRef.current);

    //     const printContent = printRef.current.innerHTML;
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(printContent, "text/html");

    //     // Extract employee details section
    //     const employeeDetails = doc.querySelector(".mb-8");
    //     const employeeDetailsHtml = employeeDetails ? employeeDetails.outerHTML : "";
    //     // Extract calendar section (col-span-3)
    //     const calendarSection = doc.querySelector(".col-span-3");
    //     const calendarHtml = calendarSection ? calendarSection.outerHTML : "";

    //     // Extract summaries section (col-span-1)
    //     const summariesSection = doc.querySelector(".col-span-1");
    //     const summariesHtml = summariesSection ? summariesSection.outerHTML : "";

    //     const printWindow = window.open("", "_blank");

    //     printWindow.document.write(`
    //   <!DOCTYPE html>
    //   <html>
    //     <head>
    //       <meta charset="UTF-8">
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //       <title>Attendance Report - ${selectedUser?.fullName || "Employee"}</title>
    //       <script src="https://cdn.tailwindcss.com"></script>
    //       <style>
    //         @page {
    //           size: A4;
    //           margin: 10mm;
    //         }
    //         body {
    //           margin: 0;
    //           padding: 8px;
    //           background: white;
    //           font-family: system-ui, -apple-system, sans-serif;
    //         }
    //         .page-1 {
    //           page-break-inside: avoid;
    //           page-break-after: always;
    //           padding: 16px;
    //         }
    //         .page-2 {
    //           page-break-before: always;
    //           padding: 16px;
    //           page-break-inside: avoid;
    //         }
    //         @media print {
    //           body {
    //             margin: 0;
    //             padding: 0;
    //           }
    //           .no-print {
    //             display: none !important;
    //           }
    //         }
    //         * {
    //           -webkit-print-color-adjust: exact !important;
    //           print-color-adjust: exact !important;
    //           color-adjust: exact !important;
    //         }
    //       </style>
    //     </head>
    //     <body>
    //       <!-- PAGE 1: Employee Details + Monthly Calendar -->
    //       <div class="page-1">
    //         <div style="margin-bottom: 20px;">
    //           ${employeeDetailsHtml}
    //         </div>
    //         <div>
    //           ${calendarHtml}
    //         </div>
    //       </div>

    //       <!-- PAGE 2: Summaries -->
    //       <div class="page-2">
    //         <div style="display: flex; flex-direction: column; gap: 24px;">
    //           ${summariesHtml}
    //         </div>
    //       </div>
    //     </body>
    //   </html>
    // `);

    //     printWindow.document.close();

    //     setTimeout(() => {
    //         printWindow.print();
    //     }, 250);
    // };

    /* -------------------------------------------------------------------------- */
    /* 🧾 Render */
    /* -------------------------------------------------------------------------- */
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
            {/* Header Section */}
            <div className="mb-8">
                <div className="mb-2 flex items-center gap-3">
                    <Users
                        size={32}
                        className="text-blue-600"
                    />
                    <h1 className="text-3xl font-bold text-gray-900">Employee & Admin Management</h1>
                </div>
                <p className="text-sm text-gray-600">Monitor active and inactive employees and administrators</p>
            </div>

            {/* Search & Filter Bar */}
            {globalRole == "employee" ? (
                <div></div>
            ) : (
                <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-md">
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="w-full flex-1 sm:w-auto">
                            <input
                                type="search"
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={STYLES.input}
                            />
                        </div>
                        <div className="flex w-full gap-2 sm:w-auto">
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className={STYLES.input}
                            >
                                <option value="All">All Roles</option>
                                <option value="Admin">Admins</option>
                                <option value="Employee">Employees</option>
                            </select>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setFilterRole("All");
                                }}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                    {/* Modern Tab Navigation */}
                    <div className="mb-6 mt-6 flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab("active")}
                            className={`relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                                activeTab === "active"
                                    ? "bg-emerald-50 text-emerald-600 shadow-md"
                                    : "bg-white text-gray-600 hover:bg-gray-50 hover:shadow-sm"
                            }`}
                        >
                            <CheckCircle size={18} />
                            Active ({totalActive})
                            {activeTab === "active" && (
                                <span className="absolute -bottom-2 left-4 right-4 h-1 animate-pulse rounded-full bg-emerald-600" />
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab("inactive")}
                            className={`relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                                activeTab === "inactive"
                                    ? "bg-rose-50 text-rose-600 shadow-md"
                                    : "bg-white text-gray-600 hover:bg-gray-50 hover:shadow-sm"
                            }`}
                        >
                            <XCircle size={18} />
                            Inactive ({totalInactive})
                            {activeTab === "inactive" && (
                                <span className="absolute -bottom-2 left-4 right-4 h-1 animate-pulse rounded-full bg-rose-600" />
                            )}
                        </button>
                    </div>
                    {/* Statistics Card */}
                    <div className="mb-6">
                        {activeTab === "active" ? (
                            <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-emerald-700">Total Active</p>
                                        <p className="text-3xl font-bold text-emerald-600">{totalActive}</p>
                                    </div>
                                    <CheckCircle
                                        size={40}
                                        className="text-emerald-600 opacity-20"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-rose-700">Total Inactive</p>
                                        <p className="text-3xl font-bold text-rose-600">{totalInactive}</p>
                                    </div>
                                    <XCircle
                                        size={40}
                                        className="text-rose-600 opacity-20"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Data Table */}
            {/* {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-md">
                    <p className="text-lg text-gray-600">
                        No {activeTab} {filterRole !== "All" ? filterRole.toLowerCase() : ""} records found.
                    </p>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-700">
                            <thead className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <tr>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-700">#</th>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-700">User</th>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-700">Role</th>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-700">Designation</th>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-700">Department</th>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-700">Company</th>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-700">Today's Attendance</th>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((user, index) => (
                                    <TableRow
                                        key={user._id || index}
                                        user={user}
                                        index={index + 1}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )} */}

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-md sm:p-12">
                    <p className="text-sm text-gray-600 sm:text-lg">
                        No {activeTab} {filterRole !== "All" ? filterRole.toLowerCase() : ""} records found.
                    </p>
                </div>
            ) : (
                <>{/* Desktop Table View */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 hidden overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg duration-500 md:block">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-gray-700">
                                <thead className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <tr>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">#</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">User</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">Role</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">Designation</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">Department</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">Company</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">Today's Attendance</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((user, index) => (
                                        <TableRow
                                            key={user._id || index}
                                            user={user}
                                            index={index + 1}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-3 duration-500 md:hidden">
                        {filteredData.map((user, index) => {
                            const name = user?.fullName || "N/A";
                            const role = user?.userType || "Unknown";
                            const designation = getDesignationName(user);
                            const department = getDepartmentName(user);
                            const company = getCompanyName(user);
                            const attendanceKey = `${user.userType === "Admin" ? "admin" : "employee"}_${user._id}`;
                            const attendance = attendanceMap[attendanceKey];
                            const isPresent = !!attendance?.clockIn;

                            return (
                                <div
                                    key={user._id || index}
                                    className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                                    onDoubleClick={
                                        globalRole === "admin" && currentUser?.userType == "Employee" ? () => handleViewClick(user) : undefined
                                    }
                                    title={globalRole === "admin" && currentUser?.userType == "Employee" ? "Double-click to edit" : ""}
                                >
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2">
                                        <div className="flex min-w-0 flex-1 items-center gap-2">
                                            <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                {index + 1}
                                            </span>
                                            <p className="truncate text-xs font-semibold text-gray-900">{name}</p>
                                        </div>
                                        <button
                                            onClick={() => handleViewClick(user)}
                                            className="flex-shrink-0 rounded-full bg-blue-100 p-1 text-blue-600 transition-colors hover:bg-blue-200"
                                        >
                                            <Eye size={14} />
                                        </button>
                                    </div>

                                    {/* Card Body */}
                                    <div className="space-y-2 p-3 text-xs">
                                        {/* Email & Role */}
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                            <span className="truncate text-gray-600">{user?.email?.split("@")[0] || "-"}</span>
                                            <span className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                                {role}
                                            </span>
                                        </div>

                                        {/* Today's Attendance */}
                                        {attendance ? (
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                                                    <span className="font-medium text-gray-600">Clock In</span>
                                                    <span className="font-mono font-semibold text-emerald-600">
                                                        {attendance?.clockIn
                                                            ? new Date(attendance.clockIn).toLocaleTimeString("en-IN", {
                                                                  hour: "2-digit",
                                                                  minute: "2-digit",
                                                              })
                                                            : "--:--"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                                                    <span className="font-medium text-gray-600">Clock Out</span>
                                                    <span className="font-mono font-semibold text-rose-600">
                                                        {attendance?.clockOut
                                                            ? new Date(attendance.clockOut).toLocaleTimeString("en-IN", {
                                                                  hour: "2-digit",
                                                                  minute: "2-digit",
                                                              })
                                                            : "--:--"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-gray-600">Status</span>
                                                    {isPresent ? (
                                                        <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                            <CheckCircle size={12} />
                                                            Present
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                                                            <XCircle size={12} />
                                                            Absent
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-600">Today's Attendance</span>
                                                <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                                                    <XCircle size={12} />
                                                    Absent
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* View Details Modal */}
            {viewModal && selectedUser && (
                <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md duration-300">
                    <div className="animate-in zoom-in relative flex h-full w-full flex-col overflow-y-auto rounded-lg border-0 bg-white shadow-2xl duration-300 md:h-screen md:w-screen md:rounded-none">
                        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white p-3 sm:p-4 md:p-6">
                            <h2 className="text-lg font-bold text-gray-900 sm:text-2xl md:text-3xl">Attendance Details</h2>
                            <div className="flex items-center gap-4">
                                <button
                                    className="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600"
                                    onClick={() => setViewModal(false)}
                                >
                                    <X
                                        size={32}
                                        className="h-6 w-6 sm:h-6 sm:w-6 md:h-8 md:w-8"
                                    />
                                </button>
                            </div>
                        </div>

                        <div
                            className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8"
                            ref={printRef}
                        >
                            {/* HEADER SECTION - Employee Details */}
                            <div className="mb-6 sm:mb-7 md:mb-8">
                                {/* Employee Header */}
                                <div className="mb-4 sm:mb-5 md:mb-6">
                                    <div className="flex items-start gap-3 sm:gap-3 md:gap-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-lg font-bold text-white sm:h-12 sm:w-12 sm:text-lg md:h-16 md:w-16 md:text-2xl">
                                            {selectedUser?.fullName?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                                                {selectedUser?.fullName}
                                            </h3>
                                            <p className="mt-1 text-xs text-gray-600 sm:text-sm">{selectedUser?.userType}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Employee Info Grid (2 columns) */}
                                <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-3 sm:grid-cols-1 sm:gap-4 sm:p-4 md:grid-cols-2 md:gap-6 md:p-6">
                                    {/* Contact Information */}
                                    <div>
                                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 sm:mb-2 sm:text-xs md:mb-3 md:text-sm">
                                            Contact Information
                                        </h3>
                                        <div className="space-y-2 sm:space-y-1 md:space-y-2">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Email</p>
                                                <p className="truncate text-sm text-gray-800 sm:text-xs md:text-sm">{selectedUser?.email || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Phone</p>
                                                <p className="truncate text-sm text-gray-800 sm:text-xs md:text-sm">{selectedUser?.phone || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Work Information */}
                                    <div>
                                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 sm:mb-2 sm:text-xs md:mb-3 md:text-sm">
                                            Work Information
                                        </h3>
                                        <div className="space-y-2 sm:space-y-1 md:space-y-2">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Department</p>
                                                <p className="truncate text-sm text-gray-800 sm:text-xs md:text-sm">
                                                    {getDepartmentName(selectedUser)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Company</p>
                                                <p className="truncate text-sm text-gray-800 sm:text-xs md:text-sm">{getCompanyName(selectedUser)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Information */}
                                    <div>
                                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 sm:mb-2 sm:text-xs md:mb-3 md:text-sm">
                                            Status
                                        </h3>
                                        <div className="space-y-2 sm:space-y-1 md:space-y-2">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Account Status</p>
                                                <div className="mt-1">
                                                    {selectedUser?.accountActive ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 sm:px-2 md:px-3">
                                                            <CheckCircle
                                                                size={14}
                                                                className="sm:h-3 sm:w-3 md:h-3.5 md:w-3.5"
                                                            />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 sm:px-2 md:px-3">
                                                            <XCircle
                                                                size={14}
                                                                className="sm:h-3 sm:w-3 md:h-3.5 md:w-3.5"
                                                            />
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div>
                                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 sm:mb-2 sm:text-xs md:mb-3 md:text-sm">
                                            Dates
                                        </h3>
                                        <div className="space-y-2 sm:space-y-1 md:space-y-2">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Join Date</p>
                                                <p className="text-sm text-gray-800 sm:text-xs md:text-sm">
                                                    {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString("en-IN") : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM SECTION - Calendar & Attendance Summary Side by Side */}
                            <div className="border-t border-gray-200 pt-4 sm:pt-6 md:pt-8">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-8">
                                    {/* LEFT - Monthly Attendance Calendar (takes 2.5 columns) */}
                                    <div className="md:col-span-3">
                                        {/* Month & Year Selection */}
                                        <div className="mb-6 sm:mb-7 md:mb-8">
                                            <div className="mb-4 flex flex-col items-center gap-3 sm:mb-5 sm:gap-3 md:mb-6 md:gap-4">
                                                <h3 className="text-center text-xl font-bold text-gray-900 sm:text-2xl md:text-4xl">
                                                    {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                                                </h3>

                                                <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
                                                    {/* Month Selector */}
                                                    <select
                                                        value={currentMonth.getMonth()}
                                                        onChange={(e) =>
                                                            setCurrentMonth(new Date(currentMonth.getFullYear(), parseInt(e.target.value)))
                                                        }
                                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm md:w-auto md:px-4 md:py-2 md:text-base"
                                                    >
                                                        <option value="0">January</option>
                                                        <option value="1">February</option>
                                                        <option value="2">March</option>
                                                        <option value="3">April</option>
                                                        <option value="4">May</option>
                                                        <option value="5">June</option>
                                                        <option value="6">July</option>
                                                        <option value="7">August</option>
                                                        <option value="8">September</option>
                                                        <option value="9">October</option>
                                                        <option value="10">November</option>
                                                        <option value="11">December</option>
                                                    </select>

                                                    {/* Year Selector */}
                                                    <select
                                                        value={currentMonth.getFullYear()}
                                                        onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth()))}
                                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm md:w-auto md:px-4 md:py-2 md:text-base"
                                                    >
                                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                                                            <option
                                                                key={year}
                                                                value={year}
                                                            >
                                                                {year}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Navigation Buttons */}
                                            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                                                <button
                                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                                    className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 md:px-4 md:py-2 md:text-sm"
                                                >
                                                    ← Prev
                                                </button>
                                                <button
                                                    onClick={() => setCurrentMonth(new Date())}
                                                    className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200 md:px-4 md:py-2 md:text-sm"
                                                >
                                                    Today
                                                </button>
                                                <button
                                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                                    className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 md:px-4 md:py-2 md:text-sm"
                                                >
                                                    Next →
                                                </button>
                                            </div>
                                        </div>

                                        {/* Monthly Attendance Grid */}
                                        <MonthlyAttendanceGrid
                                            attendanceData={monthlyAttendance}
                                            month={currentMonth}
                                        />
                                    </div>

                                    {/* RIGHT - Attendance & Salary Summary (Stacked) */}
                                    <div className="col-span-1 flex h-fit flex-col gap-4 sm:gap-5 md:sticky md:top-8 md:gap-6">
                                        {/* Attendance Summary */}
                                        <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6">
                                            <h3 className="mb-2 text-sm font-bold text-gray-900 sm:text-base md:text-lg">
                                                Attendance Summary
                                            </h3>
                                            <p className="mb-4 text-xs font-medium text-gray-600 sm:mb-5 md:mb-6">
                                                {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                                            </p>

                                            {(() => {
                                                const stats = calculateAttendanceStats(monthlyAttendance, currentMonth);
                                                const summaryData = [
                                                    {
                                                        label: "Present",
                                                        value: stats.present,
                                                        color: "bg-emerald-100 text-emerald-700",
                                                        bgColor: "bg-emerald-50",
                                                    },
                                                    {
                                                        label: "Grace Present",
                                                        value: stats.gracePresent,
                                                        color: "bg-blue-100 text-blue-700",
                                                        bgColor: "bg-blue-50",
                                                    },
                                                    {
                                                        label: "Late",
                                                        value: stats.late,
                                                        color: "bg-orange-100 text-orange-700",
                                                        bgColor: "bg-orange-50",
                                                    },
                                                    {
                                                        label: "Absent",
                                                        value: stats.absent,
                                                        color: "bg-rose-100 text-rose-700",
                                                        bgColor: "bg-rose-50",
                                                    },
                                                ];

                                                return (
                                                    <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                                                        {summaryData.map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={`${item.bgColor} rounded-lg border-l-4 border-current p-2 text-sm sm:p-2.5 sm:text-xs md:p-3 md:text-sm`}
                                                            >
                                                                <div className="flex items-center justify-between gap-2 sm:gap-2 md:gap-2">
                                                                    <span className="text-sm font-semibold text-gray-700 sm:text-xs md:text-sm">
                                                                        {item.label}
                                                                    </span>
                                                                    <span
                                                                        className={`text-lg font-bold sm:text-lg md:text-xl ${item.color.split(" ")[1]}`}
                                                                    >
                                                                        {item.value}
                                                                    </span>
                                                                </div>
                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    {stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%
                                                                </p>
                                                            </div>
                                                        ))}

                                                        {/* Total */}
                                                        <div className="mt-3 border-t border-blue-200 pt-2 sm:mt-3.5 sm:pt-2.5 md:mt-4 md:pt-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-sm font-bold text-gray-800 sm:text-sm md:text-sm">
                                                                    Total Days
                                                                </span>
                                                                <span className="text-xl font-bold text-blue-700 sm:text-lg md:text-xl">
                                                                    {stats.total}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        {/* Salary Summary */}
                                        <div className="rounded-lg border border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-3 sm:p-4 md:p-6">
                                            <h3 className="mb-2 text-sm font-bold text-gray-900 sm:text-base md:text-lg">Salary Summary</h3>
                                            <p className="mb-4 text-xs font-medium text-gray-600 sm:mb-5 md:mb-6">
                                                {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                                            </p>

                                            {(() => {
                                                const stats = calculateAttendanceStats(monthlyAttendance, currentMonth);
                                                const monthlyBaseSalary = 30000; // Static monthly salary
                                                const perDaySalary = monthlyBaseSalary / 30; // Assuming 30 working days per month
                                                const presentDays = stats.present + stats.gracePresent; // Count present and grace present as working days
                                                const totalEarned = perDaySalary * presentDays;

                                                return (
                                                    <div className="space-y-2 text-sm sm:space-y-2.5 md:space-y-3">
                                                        {/* Base Salary */}
                                                        <div className="rounded-lg border border-green-200 bg-white p-2 sm:p-2.5 md:p-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-sm font-semibold text-gray-700 sm:text-sm md:text-sm">
                                                                    Base Salary
                                                                </span>
                                                                <span className="text-sm font-bold text-gray-800 sm:text-sm md:text-sm">
                                                                    ₹{monthlyBaseSalary.toLocaleString("en-IN")}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Per Day Salary */}
                                                        <div className="rounded-lg border border-green-200 bg-white p-2 sm:p-2.5 md:p-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-sm font-semibold text-gray-700 sm:text-sm md:text-sm">
                                                                    Per Day
                                                                </span>
                                                                <span className="text-sm font-bold text-gray-800 sm:text-sm md:text-sm">
                                                                    ₹{perDaySalary.toFixed(0)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Working Days */}
                                                        <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-2 sm:p-2.5 md:p-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-sm font-semibold text-gray-700 sm:text-sm md:text-sm">
                                                                    Working Days
                                                                </span>
                                                                <span className="text-xl font-bold text-emerald-600 sm:text-lg md:text-xl">
                                                                    {presentDays}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Earned Salary */}
                                                        <div className="rounded-lg border-l-4 border-green-600 bg-gradient-to-r from-green-100 to-emerald-100 p-2 sm:p-2.5 md:p-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-sm font-bold text-gray-800 sm:text-sm md:text-sm">Earned</span>
                                                                <span className="text-lg font-bold text-green-700 sm:text-base md:text-lg">
                                                                    ₹{totalEarned.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Final Payable */}
                                                        <div className="rounded-lg border-2 border-emerald-700 bg-gradient-to-r from-emerald-500 to-green-600 p-2 text-white sm:p-2.5 md:p-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-sm font-bold sm:text-sm md:text-sm">Payable</span>
                                                                <span className="text-lg font-bold sm:text-base md:text-lg">
                                                                    ₹{totalEarned.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-white p-3 sm:gap-3 sm:p-4 md:gap-3 md:p-6">
                            <button
                                onClick={() => setViewModal(false)}
                                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-3 md:text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 📅 Date Attendance Edit Modal */}
            {isEditModalOpen && selectedDateForEdit && (
                <DateAttendanceEditModal
                    date={selectedDateForEdit.date}
                    dayRecords={selectedDateForEdit.records}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedDateForEdit(null);
                    }}
                    onSave={handleSaveDateAttendance}
                />
            )}

            {/* Add Tailwind animations if not already present */}
            <style>{`
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: slideInFromBottom 0.5s ease-out;
        }
        
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .slide-in-from-bottom-4 {
          animation: slideInFromBottom 0.5s ease-out;
        }
        
        .zoom-in {
          animation: zoomIn 0.3s ease-out;
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
};

export default React.memo(AdminAttendance);