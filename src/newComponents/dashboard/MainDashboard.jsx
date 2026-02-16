// import { BarChart3, Clock4, UserCheck, Users, TrendingUp, TrendingDown, UserPlus } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const MainDashboard = () => {
//     const navigate = useNavigate();
//     const [userName, setUserName] = useState("Loading...");
//     const [roleName, setRoleName] = useState("");

//     const [lead, setLead] = useState([]);
//     const [loadingLeads, setLoadingLeads] = useState(true);

//     const [attendanceData, setAttendanceData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [loadingAttendance, setLoadingAttendance] = useState(true);

//     const [companies, setCompanies] = useState([]);
//     const [loadingCompanies, setLoadingCompanies] = useState(true);
//     const [errorCompanies, setErrorCompanies] = useState("");

//     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    
//     const [loadingClock, setLoadingClock] = useState(false);
//     const [todayRecord, setTodayRecord] = useState(null);

//     const role = localStorage.getItem("role"); // Super admin | admin | employee
//     const id = localStorage.getItem("userId");

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 if (!id || !role) return;

//                 const r = role.toLowerCase();
//                 let url = "";

//                 if (r === "superadmin") url = `http://localhost:4000/AddSuperAdmin/super/${id}`;
//                 else if (r === "admin") url = `http://localhost:4000/getAdmin/${id}`;
//                 else if (r === "employee") url = `http://localhost:4000/employee/getEmployee/${id}`;

//                 const res = await fetch(url);
//                 const data = await res.json();

//                 if (r === "superadmin" && data.SuperAdmin) {
//                     setUserName(data.SuperAdmin.fullName);
//                     setRoleName("Super Admin");
//                 } else if (r === "admin" && data.admin) {
//                     setUserName(data.admin.fullName);
//                     setRoleName("Admin");
//                 } else if (r === "employee" && data.employee) {
//                     setUserName(data.employee.fullName);
//                     setRoleName(data.employee.role);
//                 }
//             } catch {
//                 setUserName("User");
//                 setRoleName(role);
//             }
//         };
//         fetchUser();
//     }, [id, role]);

//     const handleLogout = () => {
//         localStorage.clear();
//         navigate("/");
//     };

//     // 🕒 Check Token Expiry
//     const checkTokenExpiry = () => {
//         const token = localStorage.getItem("token");
//         const expiry = localStorage.getItem("tokenExpiry");

//         if (!token || !expiry) return false;

//         if (new Date().getTime() > Number(expiry)) {
//             // Remove expired session data
//             localStorage.removeItem("token");
//             localStorage.removeItem("tokenExpiry");
//             localStorage.removeItem("userId");
//             localStorage.removeItem("userName");
//             localStorage.removeItem("role");
//             localStorage.removeItem("companyId");
//             return false;
//         }
//         return true;
//     };

//     // 🧩 Session Timeout Watcher
//     useEffect(() => {
//         if (!checkTokenExpiry()) {
//             alert("Session expired. Please login again.");
//             navigate("/");
//         }

//         const interval = setInterval(() => {
//             if (!checkTokenExpiry()) {
//                 alert("Session expired. Please login again.");
//                 navigate("/");
//             }
//         }, 5000);

//         return () => clearInterval(interval);
//     }, [navigate]);

//     // 📊 Fetch Attendance
//     useEffect(() => {
//         const fetchAttendance = async () => {
//             try {
//                 const res = await fetch("http://localhost:4000/attendance/getAllAttendance");
//                 const data = await res.json();
//                 // console.log("Fetched attendance data:", data);

//                 const attendance = Array.isArray(data) ? data : data.data || [];
//                 const userId = localStorage.getItem("userId");

//                 // Filter by logged-in user
//                 const userAttendance = attendance.filter((item) => item.employee?._id === userId);

//                 setAttendanceData(userAttendance);
//             } catch (err) {
//                 console.error("Error fetching attendance:", err);
//             } finally {
//                 setLoadingAttendance(false);
//             }
//         };

//         fetchAttendance();
//     }, []);

//     // 📈 Fetch Leads
//     useEffect(() => {
//         const fetchLeads = async () => {
//             try {
//                 const res = await fetch("http://localhost:4000/leads/");
//                 const data = await res.json();
//                 const leadData = Array.isArray(data) ? data : data.data || [];
//                 setLead(leadData);
//             } catch (err) {
//                 console.error("Error fetching leads:", err);
//             } finally {
//                 setLoadingLeads(false);
//             }
//         };
//         fetchLeads();
//     }, []);

//     // 🏢 Fetch Companies
//     useEffect(() => {
//         const fetchCompanies = async () => {
//             try {
//                 const response = await axios.get("http://localhost:4000/company/all");
//                 let allCompanies = response.data?.companies || [];

//                 // Filter by admin role
//                 if (role === "admin") {
//                     const userId = localStorage.getItem("userId");
//                     allCompanies = allCompanies.filter((company) => company.adminId === userId);
//                 }

//                 setCompanies(allCompanies);
//             } catch (err) {
//                 console.error("Error fetching companies:", err);
//                 setErrorCompanies("Failed to load companies");
//             } finally {
//                 setLoadingCompanies(false);
//             }
//         };
//         fetchCompanies();
//     }, [role]);

//     // 🏢 Fetch Assigned Company for Admin
//     useEffect(() => {
//         const fetchAdminCompany = async () => {
//             if (role === "admin") {
//                 try {
//                     const adminId = localStorage.getItem("userId");
//                     if (!adminId) return;

//                     const res = await axios.get(`http://localhost:4000/getCompanyByAdminId/${adminId}`);
//                     const data = res.data;
//                     console.log(data);
//                     if (data?.assignedCompanies?.length > 0) {
//                         setCompanies(data.assignedCompanies);
//                     } else {
//                         setCompanies([]);
//                     }
//                 } catch (err) {
//                     console.error("Error fetching admin company:", err);
//                     setErrorCompanies("Failed to load assigned company");
//                 } finally {
//                     setLoadingCompanies(false);
//                 }
//             }
//         };

//         fetchAdminCompany();
//     }, [role]);

//     // 📅 Filter Attendance by Selected Date
//     useEffect(() => {
//         const target = new Date(selectedDate);
//         const filtered = attendanceData.filter((item) => {
//             if (!item.date) return false;
//             const itemDate = new Date(item.date);
//             return (
//                 itemDate.getFullYear() === target.getFullYear() &&
//                 itemDate.getMonth() === target.getMonth() &&
//                 itemDate.getDate() === target.getDate()
//             );
//         });
//         setFilteredData(filtered);
//     }, [selectedDate, attendanceData]);

//     // 📅 Fetch Today's Attendance for Clock In/Out
//     useEffect(() => {
//         if (!id || !role) return;

//         const today = new Date();
//         const fetchTodayAttendance = async () => {
//             try {
//                 const freshRole = role?.toLowerCase();
//                 const url = freshRole === "admin" ? `http://localhost:4000/adminAttendance/${id}` : `http://localhost:4000/attendance/${id}`;

//                 const res = await fetch(url);
//                 if (!res.ok) throw new Error("Failed to fetch attendance");

//                 const data = await res.json();
//                 const records = data?.data || data;

//                 const todayRec = Array.isArray(records)
//                     ? records.find((record) => {
//                           const d = new Date(record.date);
//                           return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
//                       })
//                     : null;

//                 setTodayRecord(todayRec || null);
//             } catch (err) {
//                 console.error("Error fetching today's attendance:", err);
//             }
//         };

//         fetchTodayAttendance();
//     }, [id, role]);

//     // 🎨 Helper: Status Colors
//     const getStatusColor = (status) => {
//         if (!status) return "bg-gray-400";
//         switch (status.toLowerCase()) {
//             case "present":
//             case "active":
//                 return "bg-green-500 hover:bg-green-600";
//             case "absent":
//                 return "bg-red-500 hover:bg-red-600";
//             case "late":
//             case "warm":
//                 return "bg-yellow-500 hover:bg-yellow-600";
//             case "hot":
//                 return "bg-red-500 hover:bg-red-600";
//             case "cold":
//             case "inactive":
//                 return "bg-gray-500 hover:bg-gray-600";
//             default:
//                 return "bg-gray-500 hover:bg-gray-600";
//         }
//     };

//     // 🕒 Helper: Format Time
//     const formatTime = (isoString) => {
//         if (!isoString) return "—";
//         const date = new Date(isoString);
//         return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     };

//     // ✅ Handle Clock In / Clock Out
//     const handleClockAction = async (type) => {
//         if (loadingClock) return;

//         // Get fresh values from localStorage in case they changed
//         const freshUserId = id || localStorage.getItem("userId");
//         const freshCompanyId = localStorage.getItem("companyId");
//         const freshRole = role || localStorage.getItem("role")?.toLowerCase();

//         // Enhanced validation with detailed error messages
//         if (!freshUserId) return toast.error("User ID not found. Please login again.");
//         if (!freshCompanyId) return toast.error("Company ID not found. Please login again.");
//         if (!freshRole) return toast.error("User role not found. Please login again.");

//         const isAdmin = freshRole === "admin";
//         const endpoint =
//             type === "in"
//                 ? isAdmin
//                     ? "adminAttendance/clockin"
//                     : "attendance/clockin"
//                 : isAdmin
//                   ? "adminAttendance/clockout"
//                   : "attendance/clockout";

//         // prevent duplicate actions
//         if (type === "in" && todayRecord?.clockIn) return toast.warning("You have already clocked in today.");
//         if (type === "out") {
//             if (!todayRecord?.clockIn) return toast.warning("Clock in before clocking out.");
//             if (todayRecord?.clockOut) return toast.warning("You have already clocked out today.");
//         }

//         try {
//             setLoadingClock(true);
//             const body = isAdmin ? { adminId: freshUserId, companyId: freshCompanyId } : { employeeId: freshUserId, companyId: freshCompanyId };

//             // Debug logging for mobile issues
//             console.log("📱 Clock Action Request:", {
//                 type,
//                 userId: freshUserId,
//                 companyId: freshCompanyId,
//                 isAdmin,
//                 body,
//                 endpoint,
//                 timestamp: new Date().toISOString(),
//             });

//             const res = await fetch(`http://localhost:4000/${endpoint}`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(body),
//             });

//             const data = await res.json();

//             // Debug response
//             console.log("📨 Clock Action Response:", {
//                 status: res.status,
//                 ok: res.ok,
//                 data,
//             });

//             if (!res.ok) {
//                 if (data.message?.includes("Sunday")) return toast.info("Today is Sunday — holiday, no attendance needed.");
//                 if (data.message?.includes("Already clocked")) return toast.warning("Already clocked for today.");
//                 if (data.message?.includes("not allowed before")) return toast.warning("Too early to clock in.");
//                 if (data.message?.includes("not allowed after")) return toast.error("Clock-in not allowed after.");

//                 return toast.error(data.message || "Clock action failed.");
//             }

//             toast.success(data.message || `Clock ${type === "in" ? "In" : "Out"} successful!`);

//             const newRecord = data.record || data.attendance;
//             setTodayRecord((prev) => ({
//                 ...prev,
//                 ...newRecord,
//                 [type === "in" ? "clockIn" : "clockOut"]: newRecord?.[type === "in" ? "clockIn" : "clockOut"] || new Date().toISOString(),
//             }));
//         } catch (err) {
//             console.error("❌ Clock Action Error:", err);
//             toast.error("Server error. Please try again.");
//         } finally {
//             setLoadingClock(false);
//         }
//     };

//     const [time, setTime] = useState("05:42:19");
//     const [elapsedTime, setElapsedTime] = useState("00:00:00");

//     // ⏱ Fake session timer (UI only)
//     useEffect(() => {
//         const interval = setInterval(() => {
//             const now = new Date();
//             setTime(
//                 now.toLocaleTimeString("en-GB", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                 }),
//             );
//         }, 1000);

//         return () => clearInterval(interval);
//     }, []);

//     // ⏱ Elapsed Time Timer (from Clock In until Clock Out or Current Time)
//     useEffect(() => {
//         if (!todayRecord?.clockIn) {
//             setElapsedTime("00:00:00");
//             return;
//         }

//         const interval = setInterval(() => {
//             const clockInTime = new Date(todayRecord.clockIn).getTime();
//             // If clocked out, calculate until clock out time, otherwise calculate until now
//             const endTime = todayRecord?.clockOut ? new Date(todayRecord.clockOut).getTime() : new Date().getTime();
//             const elapsed = Math.max(0, endTime - clockInTime);

//             const hours = String(Math.floor(elapsed / 3600000)).padStart(2, "0");
//             const minutes = String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, "0");
//             const seconds = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, "0");

//             setElapsedTime(`${hours}:${minutes}:${seconds}`);
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [todayRecord?.clockIn, todayRecord?.clockOut]);
//     return (
//         <div className="flex-1 bg-[#f8fafc] px-4 md:px-8">
//             <ToastContainer
//                 position="top-right"
//                 autoClose={3000}
//             />
//             {/* Dashboard Overview */}
//             {/* <div className="sticky top-0 z-50 mb-6 flex flex-wrap items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
//                 <div className="flex items-center gap-4">
//                     <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-xl font-bold text-white">
//                         {userName[0]}
//                     </div>

//                     <div>
//                         <h2 className="text-lg font-semibold text-gray-900">{userName}</h2>
//                         <p className="text-sm text-gray-500">{role}</p>
//                         <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
//                             <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">Active Now</span>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="mt-4 flex gap-3 sm:mt-0">
//                     <button className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">Edit Profile</button>
//                     <button
//                         onClick={handleLogout}
//                         className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
//                     >
//                         Logout
//                     </button>
//                 </div>
//             </div> */}

//             {/* Main Content */}
//             {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-3"> */}
//             {/* Recent Leads */}
//             <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//                 <StatCard
//                     title="Conversion Rate"
//                     value="12.5%"
//                     sub="+8.5% yesterday"
//                     icon={<TrendingUp className="h-8 w-8 bg-green-200 text-green-600" />}
//                     positive
//                 />
//                 <StatCard
//                     title="Team Size"
//                     value="24"
//                     sub="20 Active"
//                     icon={<Users className="h-6 w-6 text-blue-600" />}
//                 />
//                 <StatCard
//                     title="Monthly Growth"
//                     value="8.2%"
//                     sub="+4.3% yesterday"
//                     icon={<TrendingUp className="h-8 w-8 bg-green-200 text-green-600" />}
//                     positive
//                 />
//                 <div className="rounded-2xl bg-white p-4 shadow-sm">
//                     <div className="flex">
//                         <h4 className="mb-2 text-sm font-semibold text-gray-700">Attendance</h4>
//                         {/* <Clock4 className="h-8 w-8 text-orange-500 sm:ml-32" /> */}
//                         {/* <input
//                             type="date"
//                             value={selectedDate}
//                             onChange={(e) => setSelectedDate(e.target.value)}
//                             className="ml-5 rounded-md border px-2 py-1 text-sm "
//                         /> */}
//                     </div>
//                     <p className="mb-3 text-xs text-gray-400">Current Session</p>
//                     <div className="mb-2 flex flex-col gap-1">
//                         <p className="text-xs font-medium text-gray-600">Time</p>
//                         <p className="text-2xl font-bold text-gray-900">{time}</p>
//                     </div>
//                     <div className="mb-4 flex flex-col gap-1">
//                         <p className="text-xs font-medium text-gray-600">Elapsed Time</p>
//                         <p className="text-lg font-bold text-blue-600">{elapsedTime}</p>
//                     </div>

//                     {/* Clock In/Out Times Display */}
//                     <div className="mb-4 flex flex-col gap-2">
//                         <div className="flex items-center gap-2 text-xs">
//                             <span
//                                 className={`rounded px-2 py-1 font-medium ${
//                                     !todayRecord?.clockIn ? "bg-gray-50 text-gray-600" : "bg-blue-50 text-blue-700"
//                                 }`}
//                             >
//                                 IN: {formatTime(todayRecord?.clockIn)}
//                             </span>
//                             <span
//                                 className={`rounded px-2 py-1 font-medium ${
//                                     !todayRecord?.clockOut ? "bg-gray-50 text-gray-600" : "bg-amber-50 text-amber-700"
//                                 }`}
//                             >
//                                 OUT: {formatTime(todayRecord?.clockOut)}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="flex gap-2">
//                         <button 
//                             onClick={() => handleClockAction("in")}
//                             disabled={loadingClock}
//                             className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-semibold hover:bg-gray-200 disabled:opacity-50"
//                         >
//                             Clock In
//                         </button>
//                         <button 
//                             onClick={() => handleClockAction("out")}
//                             disabled={loadingClock}
//                             className="flex-1 rounded-lg bg-red-400 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
//                         >
//                             Clock Out
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Attendance */}
//             {/* <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
//                 <div className="flex items-center justify-between border-b px-6 py-4">
//                     <div>
//                         <h3 className="flex items-center gap-2 font-semibold text-gray-900">
//                             <UserCheck className="h-4 w-4 text-green-600" />
//                             Attendance
//                         </h3>
//                         <p className="text-xs text-gray-500">Record for {selectedDate}</p>
//                     </div>
//                     <input
//                         type="date"
//                         value={selectedDate}
//                         onChange={(e) => setSelectedDate(e.target.value)}
//                         className="rounded-md border px-2 py-1 text-sm"
//                     />
//                 </div>

//                 <div className="flex flex-col items-center p-6">
//                     <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-green-100">
//                         <UserCheck className="h-10 w-10 text-green-600" />
//                     </div>

//                     <span className="mb-6 rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">PRESENT</span>

//                     {filteredData.length > 0 && (
//                         <div className="flex gap-6">
//                             <div className="text-center">
//                                 <p className="text-xs text-gray-500">TIME IN</p>
//                                 <p className="font-semibold text-gray-900">{formatTime(filteredData[0]?.clockIn)}</p>
//                             </div>
//                             <div className="text-center">
//                                 <p className="text-xs text-gray-500">TIME OUT</p>
//                                 <p className="font-semibold text-gray-900">{formatTime(filteredData[0]?.clockOut)}</p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div> */}
//             {/* </div> */}

//             <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//                 {/* PERFORMANCE */}
//                 <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
//                     <div className="mb-4 flex items-center justify-between">
//                         <div>
//                             <h3 className="font-semibold text-gray-900">Performance Report</h3>
//                             <p className="text-xs text-gray-500">Efficiency trends (last 7 days)</p>
//                         </div>
//                         <p className="text-sm font-semibold text-green-600">94% Above Average</p>
//                     </div>

//                     {/* Chart placeholder */}
//                     <div className="relative h-52 w-full rounded-xl bg-blue-50">
//                         <div className="absolute left-6 top-6 rounded-lg bg-white px-4 py-2 text-sm shadow">
//                             <strong>176</strong> <br />
//                             additional text
//                         </div>
//                     </div>
//                 </div>

//                 {/* TODAY TASKS */}
//                 <div className="rounded-2xl bg-white p-6 shadow-sm">
//                     <h3 className="mb-4 font-semibold text-gray-900">Today’s Tasks</h3>

//                     <Task
//                         title="Task Section 1"
//                         percent={70}
//                         color="red"
//                     />
//                     <Task
//                         title="Task Section 2"
//                         percent={45}
//                         color="blue"
//                     />
//                     <Task
//                         title="Task Section 3"
//                         percent={90}
//                         color="green"
//                     />
//                 </div>
//             </div>

//             {/* ================= BOTTOM GRID ================= */}
//             <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
//                 {/* NEWS */}
//                 <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
//                     <h3 className="mb-4 font-semibold text-gray-900">News & Announcements</h3>

//                     {[1, 2, 3, 4].map((i) => (
//                         <div
//                             key={i}
//                             className="flex items-start gap-4 border-b py-3 last:border-none"
//                         >
//                             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
//                                 <BarChart3 className="text-yellow-600" />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-semibold">Quarterly Team Retreat</p>
//                                 <p className="text-xs text-gray-500">Offering features like dark/light modes, charts, customizable layouts.</p>
//                             </div>
//                             <span className="ml-auto text-xs text-gray-400">2 Hours</span>
//                         </div>
//                     ))}
//                 </div>

//                 {/* LEAD SUMMARY */}
//                 <div className="rounded-2xl bg-white p-6 shadow-sm">
//                     <h3 className="mb-4 font-semibold text-gray-900">Lead Summary</h3>

//                     <LeadBar
//                         title="Follow up"
//                         percent={75}
//                         color="red"
//                     />
//                     <LeadBar
//                         title="Interested"
//                         percent={45}
//                         color="blue"
//                     />
//                     <LeadBar
//                         title="Connected"
//                         percent={90}
//                         color="green"
//                     />
//                 </div>
//             </div>
//             {/* Quick Actions */}
//             <div className="my-10">
//                 <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">⚡ Quick Actions</h3>

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                     {/* <button
//                         onClick={() => navigate("/lead-management")}
//                         className="flex h-24 flex-col items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow transition hover:scale-105"
//                     >
//                         <UserPlus className="mb-2" />
//                         Add New Lead
//                     </button> */}
//                     {/* Clock In/Out */}
//                     <button
//                         onClick={() => navigate("/attendance")}
//                         className="flex h-24 transform flex-col items-center justify-center rounded-lg border-2 border-gray-200 transition-all duration-200 hover:scale-105 hover:border-green-300 hover:bg-green-50"
//                     >
//                         <Clock4 className="mb-2 h-6 w-6 text-gray-600" />
//                         <span className="font-semibold text-gray-700">Clock In/Out</span>
//                     </button>

//                     {/* Add User (Admin Only) */}
//                     {(role === "admin" || role === "superAdmin") && (
//                         <button
//                             onClick={() => navigate("/user-management")}
//                             className="flex h-24 transform flex-col items-center justify-center rounded-lg border-2 border-gray-200 transition-all duration-200 hover:scale-105 hover:border-indigo-300 hover:bg-indigo-50"
//                         >
//                             <UserPlus className="mb-2 h-6 w-6 text-gray-600" />
//                             <span className="font-semibold text-gray-700">Add User</span>
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MainDashboard;

// /* ================= REUSABLE COMPONENTS ================= */

// const StatCard = ({ title, value, sub, icon, positive, negative }) => (
//     <div className="rounded-2xl bg-white p-4 shadow-sm">
//         <div className="mb-2 flex items-center justify-between">
//             <p className="text-sm font-semibold text-gray-600">{title}</p>
//             <div className="rounded-lg bg-gray-100 p-2 text-gray-600">{icon}</div>
//         </div>
//         <p className="text-2xl font-bold text-gray-900">{value}</p>
//         <p className={`text-xs ${positive ? "text-green-600" : negative ? "text-red-600" : "text-gray-500"}`}>{sub}</p>
//     </div>
// );

// const Task = ({ title, percent, color }) => (
//     <div className="mb-4">
//         <div className="mb-1 flex justify-between text-sm">
//             <span>{title}</span>
//             <span>{percent}%</span>
//         </div>
//         <div className="h-2 w-full rounded bg-gray-200">
//             <div
//                 className={`h-2 rounded bg-${color}-500`}
//                 style={{ width: `${percent}%` }}
//             />
//         </div>
//     </div>
// );

// const LeadBar = ({ title, percent, color }) => (
//     <div className="mb-4">
//         <div className="mb-1 flex justify-between text-sm">
//             <span>{title}</span>
//             <span>{percent}%</span>
//         </div>
//         <div className="h-2 w-full rounded bg-gray-200">
//             <div
//                 className={`h-2 rounded bg-${color}-500`}
//                 style={{ width: `${percent}%` }}
//             />
//         </div>
//     </div>
// );


import { BarChart3, Clock4, UserCheck, Users, TrendingUp, TrendingDown, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainDashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("Loading...");
    const [roleName, setRoleName] = useState("");

    const [lead, setLead] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(true);

    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loadingAttendance, setLoadingAttendance] = useState(true);

    const [companies, setCompanies] = useState([]);
    const [adminData, setAdminData] = useState(null);
    const [companyRolesMap, setCompanyRolesMap] = useState({});
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [errorCompanies, setErrorCompanies] = useState("");

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    
    const [loadingClock, setLoadingClock] = useState(false);
    const [todayRecord, setTodayRecord] = useState(null);

    const role = localStorage.getItem("role"); // Super admin | admin | employee
    const id = localStorage.getItem("userId");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!id || !role) return;

                const r = role.toLowerCase();
                let url = "";

                if (r === "superadmin") url = `http://localhost:4000/AddSuperAdmin/super/${id}`;
                else if (r === "admin") url = `http://localhost:4000/getAdmin/${id}`;
                else if (r === "employee") url = `http://localhost:4000/employee/getEmployee/${id}`;

                const res = await fetch(url);
                const data = await res.json();

                if (r === "superadmin" && data.SuperAdmin) {
                    setUserName(data.SuperAdmin.fullName);
                    setRoleName("Super Admin");
                } else if (r === "admin" && data.admin) {
                    setUserName(data.admin.fullName);
                    setRoleName("Admin");
                } else if (r === "employee" && data.employee) {
                    setUserName(data.employee.fullName);
                    setRoleName(data.employee.role);
                }
            } catch {
                setUserName("User");
                setRoleName(role);
            }
        };
        fetchUser();
    }, [id, role]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // 🕒 Check Token Expiry
    const checkTokenExpiry = () => {
        const token = localStorage.getItem("token");
        const expiry = localStorage.getItem("tokenExpiry");

        if (!token || !expiry) return false;

        if (new Date().getTime() > Number(expiry)) {
            // Remove expired session data
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiry");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("role");
            localStorage.removeItem("companyId");
            return false;
        }
        return true;
    };

    // 🧩 Session Timeout Watcher
    useEffect(() => {
        if (!checkTokenExpiry()) {
            alert("Session expired. Please login again.");
            navigate("/");
        }

        const interval = setInterval(() => {
            if (!checkTokenExpiry()) {
                alert("Session expired. Please login again.");
                navigate("/");
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [navigate]);

    // 📊 Fetch Attendance
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await fetch("http://localhost:4000/attendance/getAllAttendance");
                const data = await res.json();
                // console.log("Fetched attendance data:", data);

                const attendance = Array.isArray(data) ? data : data.data || [];
                const userId = localStorage.getItem("userId");

                // Filter by logged-in user
                const userAttendance = attendance.filter((item) => item.employee?._id === userId);

                setAttendanceData(userAttendance);
            } catch (err) {
                console.error("Error fetching attendance:", err);
            } finally {
                setLoadingAttendance(false);
            }
        };

        fetchAttendance();
    }, []);

    // 📈 Fetch Leads
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await fetch("http://localhost:4000/leads/");
                const data = await res.json();
                const leadData = Array.isArray(data) ? data : data.data || [];
                setLead(leadData);
            } catch (err) {
                console.error("Error fetching leads:", err);
            } finally {
                setLoadingLeads(false);
            }
        };
        fetchLeads();
    }, []);

    // 🏢 Fetch Companies
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get("http://localhost:4000/company/all");
                let allCompanies = response.data?.companies || [];

                // Filter by admin role
                if (role === "admin") {
                    const userId = localStorage.getItem("userId");
                    allCompanies = allCompanies.filter((company) => company.adminId === userId);
                }

                setCompanies(allCompanies);
            } catch (err) {
                console.error("Error fetching companies:", err);
                setErrorCompanies("Failed to load companies");
            } finally {
                setLoadingCompanies(false);
            }
        };
        fetchCompanies();
    }, [role]);

    // 🏢 Fetch Assigned Companies with Roles for Admin
    useEffect(() => {
        const fetchAdminCompaniesAndRoles = async () => {
            if (role === "admin") {
                try {
                    const adminId = localStorage.getItem("userId");
                    if (!adminId) return;

                    const res = await axios.get(`http://localhost:4000/getassignedroles/${adminId}`);
                    const data = res.data;
                    console.log("Admin data with roles:", data);
                    
                    if (data?.admin) {
                        setAdminData(data.admin);
                        
                        // Build company list and role mapping
                        const companyMap = {};
                        const rolesMap = {};
                        
                        if (data.admin.assignedRoles && Array.isArray(data.admin.assignedRoles)) {
                            data.admin.assignedRoles.forEach((roleAssignment) => {
                                if (roleAssignment.companyIds && Array.isArray(roleAssignment.companyIds)) {
                                    roleAssignment.companyIds.forEach((company) => {
                                        const companyId = company._id || company;
                                        const companyName = company.companyName || "Unknown Company";
                                        
                                        if (!companyMap[companyId]) {
                                            companyMap[companyId] = {
                                                _id: companyId,
                                                companyName: companyName
                                            };
                                            rolesMap[companyId] = [];
                                        }
                                        
                                        // Add role
                                        if (roleAssignment.roleId) {
                                            const roleLabel = roleAssignment.roleId.role || "Unknown Role";
                                            rolesMap[companyId].push({
                                                type: "role",
                                                name: roleLabel,
                                                id: roleAssignment.roleId._id
                                            });
                                        }
                                        
                                        // Add sub-roles
                                        if (roleAssignment.subRoles && Array.isArray(roleAssignment.subRoles)) {
                                            roleAssignment.subRoles.forEach((subRole) => {
                                                const subRoleName = subRole.subRoleName || "Unknown SubRole";
                                                rolesMap[companyId].push({
                                                    type: "subrole",
                                                    name: subRoleName,
                                                    id: subRole._id
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        
                        setCompanies(Object.values(companyMap));
                        setCompanyRolesMap(rolesMap);
                    } else {
                        setCompanies([]);
                    }
                } catch (err) {
                    console.error("Error fetching admin companies and roles:", err);
                    setErrorCompanies("Failed to load assigned companies and roles");
                } finally {
                    setLoadingCompanies(false);
                }
            }
        };

        fetchAdminCompaniesAndRoles();
    }, [role]);

    // 📅 Filter Attendance by Selected Date
    useEffect(() => {
        const target = new Date(selectedDate);
        const filtered = attendanceData.filter((item) => {
            if (!item.date) return false;
            const itemDate = new Date(item.date);
            return (
                itemDate.getFullYear() === target.getFullYear() &&
                itemDate.getMonth() === target.getMonth() &&
                itemDate.getDate() === target.getDate()
            );
        });
        setFilteredData(filtered);
    }, [selectedDate, attendanceData]);

    // 📅 Fetch Today's Attendance for Clock In/Out
    useEffect(() => {
        if (!id || !role) return;

        const today = new Date();
        const fetchTodayAttendance = async () => {
            try {
                const freshRole = role?.toLowerCase();
                const url = freshRole === "admin" ? `http://localhost:4000/adminAttendance/${id}` : `http://localhost:4000/attendance/${id}`;

                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch attendance");

                const data = await res.json();
                const records = data?.data || data;

                const todayRec = Array.isArray(records)
                    ? records.find((record) => {
                          const d = new Date(record.date);
                          return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
                      })
                    : null;

                setTodayRecord(todayRec || null);
            } catch (err) {
                console.error("Error fetching today's attendance:", err);
            }
        };

        fetchTodayAttendance();
    }, [id, role]);

    // 🎨 Helper: Status Colors
    const getStatusColor = (status) => {
        if (!status) return "bg-gray-400";
        switch (status.toLowerCase()) {
            case "present":
            case "active":
                return "bg-green-500 hover:bg-green-600";
            case "absent":
                return "bg-red-500 hover:bg-red-600";
            case "late":
            case "warm":
                return "bg-yellow-500 hover:bg-yellow-600";
            case "hot":
                return "bg-red-500 hover:bg-red-600";
            case "cold":
            case "inactive":
                return "bg-gray-500 hover:bg-gray-600";
            default:
                return "bg-gray-500 hover:bg-gray-600";
        }
    };

    // 🕒 Helper: Format Time
    const formatTime = (isoString) => {
        if (!isoString) return "—";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // ✅ Handle Clock In / Clock Out
    const handleClockAction = async (type) => {
        if (loadingClock) return;

        // Get fresh values from localStorage in case they changed
        const freshUserId = id || localStorage.getItem("userId");
        const freshCompanyId = localStorage.getItem("companyId");
        const freshRole = role || localStorage.getItem("role")?.toLowerCase();

        // Enhanced validation with detailed error messages
        if (!freshUserId) return toast.error("User ID not found. Please login again.");
        if (!freshCompanyId) return toast.error("Company ID not found. Please login again.");
        if (!freshRole) return toast.error("User role not found. Please login again.");

        const isAdmin = freshRole === "admin";
        const endpoint =
            type === "in"
                ? isAdmin
                    ? "adminAttendance/clockin"
                    : "attendance/clockin"
                : isAdmin
                  ? "adminAttendance/clockout"
                  : "attendance/clockout";

        // prevent duplicate actions
        if (type === "in" && todayRecord?.clockIn) return toast.warning("You have already clocked in today.");
        if (type === "out") {
            if (!todayRecord?.clockIn) return toast.warning("Clock in before clocking out.");
            if (todayRecord?.clockOut) return toast.warning("You have already clocked out today.");
        }

        try {
            setLoadingClock(true);
            const body = isAdmin ? { adminId: freshUserId, companyId: freshCompanyId } : { employeeId: freshUserId, companyId: freshCompanyId };

            // Debug logging for mobile issues
            console.log("📱 Clock Action Request:", {
                type,
                userId: freshUserId,
                companyId: freshCompanyId,
                isAdmin,
                body,
                endpoint,
                timestamp: new Date().toISOString(),
            });

            const res = await fetch(`http://localhost:4000/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            // Debug response
            console.log("📨 Clock Action Response:", {
                status: res.status,
                ok: res.ok,
                data,
            });

            if (!res.ok) {
                if (data.message?.includes("Sunday")) return toast.info("Today is Sunday — holiday, no attendance needed.");
                if (data.message?.includes("Already clocked")) return toast.warning("Already clocked for today.");
                if (data.message?.includes("not allowed before")) return toast.warning("Too early to clock in.");
                if (data.message?.includes("not allowed after")) return toast.error("Clock-in not allowed after.");

                return toast.error(data.message || "Clock action failed.");
            }

            toast.success(data.message || `Clock ${type === "in" ? "In" : "Out"} successful!`);

            const newRecord = data.record || data.attendance;
            setTodayRecord((prev) => ({
                ...prev,
                ...newRecord,
                [type === "in" ? "clockIn" : "clockOut"]: newRecord?.[type === "in" ? "clockIn" : "clockOut"] || new Date().toISOString(),
            }));
        } catch (err) {
            console.error("❌ Clock Action Error:", err);
            toast.error("Server error. Please try again.");
        } finally {
            setLoadingClock(false);
        }
    };

    const [time, setTime] = useState("05:42:19");
    const [elapsedTime, setElapsedTime] = useState("00:00:00");

    // ⏱ Fake session timer (UI only)
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }),
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // ⏱ Elapsed Time Timer (from Clock In until Clock Out or Current Time)
    useEffect(() => {
        if (!todayRecord?.clockIn) {
            setElapsedTime("00:00:00");
            return;
        }

        const interval = setInterval(() => {
            const clockInTime = new Date(todayRecord.clockIn).getTime();
            // If clocked out, calculate until clock out time, otherwise calculate until now
            const endTime = todayRecord?.clockOut ? new Date(todayRecord.clockOut).getTime() : new Date().getTime();
            const elapsed = Math.max(0, endTime - clockInTime);

            const hours = String(Math.floor(elapsed / 3600000)).padStart(2, "0");
            const minutes = String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, "0");
            const seconds = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, "0");

            setElapsedTime(`${hours}:${minutes}:${seconds}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [todayRecord?.clockIn, todayRecord?.clockOut]);
    return (
        <div className="flex-1 bg-[#f8fafc] px-4 md:px-8">
            <ToastContainer
                position="top-right"
                autoClose={3000}
            />
            {/* Dashboard Overview */}
            {/* <div className="sticky top-0 z-50 mb-6 flex flex-wrap items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-xl font-bold text-white">
                        {userName[0]}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{userName}</h2>
                        <p className="text-sm text-gray-500">{role}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">Active Now</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex gap-3 sm:mt-0">
                    <button className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">Edit Profile</button>
                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
            </div> */}

            {/* Main Content */}
            {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-3"> */}
            {/* Recent Leads */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Conversion Rate"
                    value="12.5%"
                    sub="+8.5% yesterday"
                    icon={<TrendingUp className="h-8 w-8 bg-green-200 text-green-600" />}
                    positive
                />
                <StatCard
                    title="Team Size"
                    value="24"
                    sub="20 Active"
                    icon={<Users className="h-6 w-6 text-blue-600" />}
                />
                <StatCard
                    title="Monthly Growth"
                    value="8.2%"
                    sub="+4.3% yesterday"
                    icon={<TrendingUp className="h-8 w-8 bg-green-200 text-green-600" />}
                    positive
                />
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex">
                        <h4 className="mb-2 text-sm font-semibold text-gray-700">Attendance</h4>
                        {/* <Clock4 className="h-8 w-8 text-orange-500 sm:ml-32" /> */}
                        {/* <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="ml-5 rounded-md border px-2 py-1 text-sm "
                        /> */}
                    </div>
                    <p className="mb-3 text-xs text-gray-400">Current Session</p>
                    <div className="mb-2 flex flex-col gap-1">
                        <p className="text-xs font-medium text-gray-600">Time</p>
                        <p className="text-2xl font-bold text-gray-900">{time}</p>
                    </div>
                    <div className="mb-4 flex flex-col gap-1">
                        <p className="text-xs font-medium text-gray-600">Elapsed Time</p>
                        <p className="text-lg font-bold text-blue-600">{elapsedTime}</p>
                    </div>

                    {/* Clock In/Out Times Display */}
                    <div className="mb-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs">
                            <span
                                className={`rounded px-2 py-1 font-medium ${
                                    !todayRecord?.clockIn ? "bg-gray-50 text-gray-600" : "bg-blue-50 text-blue-700"
                                }`}
                            >
                                IN: {formatTime(todayRecord?.clockIn)}
                            </span>
                            <span
                                className={`rounded px-2 py-1 font-medium ${
                                    !todayRecord?.clockOut ? "bg-gray-50 text-gray-600" : "bg-amber-50 text-amber-700"
                                }`}
                            >
                                OUT: {formatTime(todayRecord?.clockOut)}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleClockAction("in")}
                            disabled={loadingClock}
                            className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-semibold hover:bg-gray-200 disabled:opacity-50"
                        >
                            Clock In
                        </button>
                        <button 
                            onClick={() => handleClockAction("out")}
                            disabled={loadingClock}
                            className="flex-1 rounded-lg bg-red-400 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                        >
                            Clock Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Attendance */}
            {/* <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                            <UserCheck className="h-4 w-4 text-green-600" />
                            Attendance
                        </h3>
                        <p className="text-xs text-gray-500">Record for {selectedDate}</p>
                    </div>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="rounded-md border px-2 py-1 text-sm"
                    />
                </div>

                <div className="flex flex-col items-center p-6">
                    <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-green-100">
                        <UserCheck className="h-10 w-10 text-green-600" />
                    </div>

                    <span className="mb-6 rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">PRESENT</span>

                    {filteredData.length > 0 && (
                        <div className="flex gap-6">
                            <div className="text-center">
                                <p className="text-xs text-gray-500">TIME IN</p>
                                <p className="font-semibold text-gray-900">{formatTime(filteredData[0]?.clockIn)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500">TIME OUT</p>
                                <p className="font-semibold text-gray-900">{formatTime(filteredData[0]?.clockOut)}</p>
                            </div>
                        </div>
            )}]
                </div>
            </div> */}
            {/* </div> */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* PERFORMANCE */}
                <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900">Performance Report</h3>
                            <p className="text-xs text-gray-500">Efficiency trends (last 7 days)</p>
                        </div>
                        <p className="text-sm font-semibold text-green-600">94% Above Average</p>
                    </div>

                    {/* Chart placeholder */}
                    <div className="relative h-52 w-full rounded-xl bg-blue-50">
                        <div className="absolute left-6 top-6 rounded-lg bg-white px-4 py-2 text-sm shadow">
                            <strong>176</strong> <br />
                            additional text
                        </div>
                    </div>
                </div>

                {/* TODAY TASKS */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 font-semibold text-gray-900">Today’s Tasks</h3>

                    <Task
                        title="Task Section 1"
                        percent={70}
                        color="red"
                    />
                    <Task
                        title="Task Section 2"
                        percent={45}
                        color="blue"
                    />
                    <Task
                        title="Task Section 3"
                        percent={90}
                        color="green"
                    />
                </div>
            </div>

            {/* ================= BOTTOM GRID ================= */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* NEWS */}
                <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
                    <h3 className="mb-4 font-semibold text-gray-900">News & Announcements</h3>

                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex items-start gap-4 border-b py-3 last:border-none"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                                <BarChart3 className="text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Quarterly Team Retreat</p>
                                <p className="text-xs text-gray-500">Offering features like dark/light modes, charts, customizable layouts.</p>
                            </div>
                            <span className="ml-auto text-xs text-gray-400">2 Hours</span>
                        </div>
                    ))}
                </div>

                {/* LEAD SUMMARY */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 font-semibold text-gray-900">Lead Summary</h3>

                    <LeadBar
                        title="Follow up"
                        percent={75}
                        color="red"
                    />
                    <LeadBar
                        title="Interested"
                        percent={45}
                        color="blue"
                    />
                    <LeadBar
                        title="Connected"
                        percent={90}
                        color="green"
                    />
                </div>
            </div>
            {/* Quick Actions */}
            <div className="my-10">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">⚡ Quick Actions</h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* <button
                        onClick={() => navigate("/lead-management")}
                        className="flex h-24 flex-col items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow transition hover:scale-105"
                    >
                        <UserPlus className="mb-2" />
                        Add New Lead
                    </button> */}
                    {/* Clock In/Out */}
                    <button
                        onClick={() => navigate("/attendance")}
                        className="flex h-24 transform flex-col items-center justify-center rounded-lg border-2 border-gray-200 transition-all duration-200 hover:scale-105 hover:border-green-300 hover:bg-green-50"
                    >
                        <Clock4 className="mb-2 h-6 w-6 text-gray-600" />
                        <span className="font-semibold text-gray-700">Clock In/Out</span>
                    </button>

                    {/* Add User (Admin Only) */}
                    {(role === "admin" || role === "superAdmin") && (
                        <button
                            onClick={() => navigate("/user-management")}
                            className="flex h-24 transform flex-col items-center justify-center rounded-lg border-2 border-gray-200 transition-all duration-200 hover:scale-105 hover:border-indigo-300 hover:bg-indigo-50"
                        >
                            <UserPlus className="mb-2 h-6 w-6 text-gray-600" />
                            <span className="font-semibold text-gray-700">Add User</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;

/* ================= REUSABLE COMPONENTS ================= */

const StatCard = ({ title, value, sub, icon, positive, negative }) => (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-600">{title}</p>
            <div className="rounded-lg bg-gray-100 p-2 text-gray-600">{icon}</div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className={`text-xs ${positive ? "text-green-600" : negative ? "text-red-600" : "text-gray-500"}`}>{sub}</p>
    </div>
);

const Task = ({ title, percent, color }) => (
    <div className="mb-4">
        <div className="mb-1 flex justify-between text-sm">
            <span>{title}</span>
            <span>{percent}%</span>
        </div>
        <div className="h-2 w-full rounded bg-gray-200">
            <div
                className={`h-2 rounded bg-${color}-500`}
                style={{ width: `${percent}%` }}
            />
        </div>
    </div>
);

const LeadBar = ({ title, percent, color }) => (
    <div className="mb-4">
        <div className="mb-1 flex justify-between text-sm">
            <span>{title}</span>
            <span>{percent}%</span>
        </div>
        <div className="h-2 w-full rounded bg-gray-200">
            <div
                className={`h-2 rounded bg-${color}-500`}
                style={{ width: `${percent}%` }}
            />
        </div>
    </div>
);