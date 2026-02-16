// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Check, X } from "lucide-react";
// import { FaEye } from "react-icons/fa";

// export const LeaveSuperAdmin = () => {
//   const [leaves, setLeaves] = useState([]);
//   const [employeeDetails, setEmployeeDetails] = useState({});
//   const [companyDetails, setCompanyDetails] = useState({});
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedCompany, setSelectedCompany] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [selectedLeave, setSelectedLeave] = useState(null);

//   const departments = ["IT", "Sales", "Marketing", "Engineering", "HR", "Finance"];

//   // ✅ Fetch all companies
//   const fetchCompanies = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/company/all");
//       setCompanies(res.data?.companies || res.data);
//     } catch (err) {
//       toast.error("Failed to fetch companies");
//     }
//   };

//   // ✅ Fetch all leaves, employees, and companies
//   const fetchLeaves = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/admin/all-leaves");
//       const leaveData = res.data?.leaves || res.data;
//       setLeaves(leaveData);

//       // 🧠 Fetch employee details
//       const employeePromises = leaveData.map(async (leave) => {
//         const empId = leave.employeeId?._id || leave.employeeId;
//         if (!empId) return null;
//         const empRes = await axios.get(
//           `http://localhost:4000/employee/getEmployee/${empId}`
//         );
//         return { empId, data: empRes.data.employee };
//       });

//       const employeeResults = await Promise.all(employeePromises);
//       const empDataMap = {};
//       const companyIds = new Set();

//       // 🧩 Map employee and extract valid company IDs
//       employeeResults.forEach((item) => {
//         if (item) {
//           empDataMap[item.empId] = item.data;

//           // ✅ FIX: ensure we only add company._id or string ID
//           const companyField = item.data?.company;
//           if (companyField?._id) {
//             companyIds.add(companyField._id);
//           } else if (typeof companyField === "string") {
//             companyIds.add(companyField);
//           }
//         }
//       });

//       // 🏢 Fetch company details using proper ObjectId strings
//       const companyPromises = [...companyIds].map(async (companyId) => {
//         const compRes = await axios.get(`http://localhost:4000/company/${companyId}`);
//         return { companyId, data: compRes.data.company };
//       });

//       const companyResults = await Promise.all(companyPromises);
//       const compDataMap = {};
//       companyResults.forEach((item) => {
//         if (item) compDataMap[item.companyId] = item.data;
//       });

//       setEmployeeDetails(empDataMap);
//       setCompanyDetails(compDataMap);
//     } catch (err) {
//       toast.error("Failed to fetch leave data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompanies();
//     fetchLeaves();
//   }, []);

//   const handleAction = async (leaveId, status) => {
//     try {
//       const adminRemark =
//         status === "Approved" ? "Leave approved by admin" : "Leave rejected by admin";

//       await axios.put(`http://localhost:4000/admin/update-leave/${leaveId}`, {
//         status,
//         adminRemark,
//       });

//       toast.success(`Leave ${status.toLowerCase()} successfully!`);
//       fetchLeaves();
//     } catch (err) {
//       toast.error("Failed to update leave status");
//     }
//   };

//   const handleView = (leave) => {
//     setSelectedLeave(leave);
//     setShowModal(true);
//   };

//   // ✅ Filter by company, department, status
//   const filteredLeaves = leaves.filter((leave) => {
//     const empId = leave.employeeId?._id || leave.employeeId;
//     const emp = employeeDetails[empId];
//     const comp =
//       emp?.company && companyDetails[emp.company?._id || emp.company]
//         ? companyDetails[emp.company?._id || emp.company]
//         : null;

//     // Normalize department: the API may return a string or an object like { _id, dep }
//     const empDept = emp
//       ? typeof emp.department === "string"
//         ? emp.department
//         : emp.department?.dep || emp.department?.name || undefined
//       : undefined;

//     const matchesCompany = !selectedCompany || comp?._id === selectedCompany;
//     const matchesDept = !selectedDepartment || empDept === selectedDepartment;
//     const matchesStatus = !selectedStatus || leave.status === selectedStatus;

//     return matchesCompany && matchesDept && matchesStatus;
//   });

//   if (loading)
//     return <div className="p-6 text-center text-gray-600">Loading leave requests...</div>;

//   return (
//     <div className="max-h-[85vh] overflow-y-auto bg-[#f8f9fa] p-8 relative">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave Management Super Admin</h1>
//         <p className="text-gray-600">
//           Review, approve, or reject leave requests from employees
//         </p>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <select
//           value={selectedCompany}
//           onChange={(e) => setSelectedCompany(e.target.value)}
//           className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
//         >
//           <option value="">All Companies</option>
//           {companies.map((company) => (
//             <option key={company._id} value={company._id}>
//               {company.companyName}
//             </option>
//           ))}
//         </select>

//         <select
//           value={selectedDepartment}
//           onChange={(e) => setSelectedDepartment(e.target.value)}
//           className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
//         >
//           <option value="">All Departments</option>
//           {departments.map((dept) => (
//             <option key={dept} value={dept}>
//               {dept}
//             </option>
//           ))}
//         </select>

//         <select
//           value={selectedStatus}
//           onChange={(e) => setSelectedStatus(e.target.value)}
//           className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
//         >
//           <option value="">All Status</option>
//           <option value="Approved">Approved</option>
//           <option value="Rejected">Rejected</option>
//           <option value="Pending">Pending</option>
//         </select>

//         {(selectedCompany || selectedDepartment || selectedStatus) && (
//           <button
//             onClick={() => {
//               setSelectedCompany("");
//               setSelectedDepartment("");
//               setSelectedStatus("");
//             }}
//             className="text-sm bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300 transition"
//           >
//             Clear Filters
//           </button>
//         )}
//       </div>

//       {/* Leave Table */}
//       <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden relative">
//         {filteredLeaves.length === 0 ? (
//           <p className="p-6 text-center text-gray-500">No leave requests found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead className="bg-gray-100 text-gray-700">
//                 <tr>
//                   <th className="p-3 text-left font-semibold">Employee Name</th>
//                   <th className="p-3 text-left font-semibold">Department</th>
//                   <th className="p-3 text-left font-semibold">Company</th>
//                   <th className="p-3 text-left font-semibold">Leave Type</th>
//                   <th className="p-3 text-left font-semibold">Start Date</th>
//                   <th className="p-3 text-left font-semibold">End Date</th>
//                   <th className="p-3 text-left font-semibold">Status</th>
//                   <th className="p-3 text-center font-semibold">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200">
//                 {filteredLeaves.map((leave) => {
//                   const empId = leave.employeeId?._id || leave.employeeId;
//                   const emp = employeeDetails[empId];
//                   const comp =
//                     emp?.company && companyDetails[emp.company?._id || emp.company]
//                       ? companyDetails[emp.company?._id || emp.company]
//                       : null;

//                   // Normalize department for display (avoid rendering an object)
//                   const empDept = emp
//                     ? typeof emp.department === "string"
//                       ? emp.department
//                       : emp.department?.dep || emp.department?.name || undefined
//                     : undefined;

//                   return (
//                     <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="p-3">{emp?.fullName || "—"}</td>
//                       <td className="p-3">{empDept || "—"}</td>
//                       <td className="p-3 text-gray-700">{comp?.companyName || "—"}</td>
//                       <td className="p-3 font-medium">{leave.leaveType}</td>
//                       <td className="p-3 text-gray-700">
//                         {new Date(leave.startDate).toLocaleDateString()}
//                       </td>
//                       <td className="p-3 text-gray-700">
//                         {new Date(leave.endDate).toLocaleDateString()}
//                       </td>
//                       <td
//                         className={`p-3 font-medium ${
//                           leave.status === "Approved"
//                             ? "text-green-600"
//                             : leave.status === "Rejected"
//                             ? "text-red-600"
//                             : "text-yellow-600"
//                         }`}
//                       >
//                         {leave.status}
//                       </td>
//                       <td className="p-3 text-center space-x-2">
//                         {/* 👁 View Button */}
//                         <button
//                           onClick={() => handleView(leave)}
//                           className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
//                           title="View Reason"
//                         >
//                           <FaEye className="w-4 h-4" />
//                         </button>

//                         {leave.status === "Pending" && (
//                           <>
//                             <button
//                               onClick={() => handleAction(leave._id, "Approved")}
//                               className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
//                               title="Approve"
//                             >
//                               <Check className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => handleAction(leave._id, "Rejected")}
//                               className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
//                               title="Reject"
//                             >
//                               <X className="w-4 h-4" />
//                             </button>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* 🟦 Inline Modal */}
//       {showModal && selectedLeave && (
//         <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg w-[380px] p-5 z-10">
//           <h2 className="text-lg text-center font-semibold mb-5 text-gray-800">
//             Leave Details
//           </h2>
//           <p className="pb-2">
//             <strong className="text-green-600 font-xl font-bold">Type:</strong>{" "}
//             {selectedLeave.leaveType}
//           </p>
//           <p>
//             <strong className="text-red-600 font-xl font-bold">Duration:</strong>{" "}
//             {new Date(selectedLeave.startDate).toLocaleDateString()} →{" "}
//             {new Date(selectedLeave.endDate).toLocaleDateString()}
//           </p>
//           <p className="mt-2">
//             <strong>Reason:</strong> {selectedLeave.reason || "—"}
//           </p>
//           <p className="mt-2">
//             <strong>Status:</strong>{" "}
//             <span
//               className={
//                 selectedLeave.status === "Approved"
//                   ? "text-green-600 font-xl font-bold"
//                   : selectedLeave.status === "Rejected"
//                   ? "text-red-600 font-xl font-bold"
//                   : "text-yellow-600 font-xl font-bold"
//               }
//             >
//               {selectedLeave.status}
//             </span>
//           </p>

//           <div className="mt-7 text-center">
//             <button
//               onClick={() => setShowModal(false)}
//               className="px-4 py-2 bg-red-600 text-white font-semibold font-lg rounded-md hover:bg-red-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Check, X } from "lucide-react";
// import { FaEye } from "react-icons/fa";

// export const LeaveSuperAdmin = () => {
//   const [leaves, setLeaves] = useState([]);
//   const [employeeDetails, setEmployeeDetails] = useState({});
//   const [companyDetails, setCompanyDetails] = useState({});
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedCompany, setSelectedCompany] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [selectedLeave, setSelectedLeave] = useState(null);

//   const departments = ["IT", "Sales", "Marketing", "Engineering", "HR", "Finance"];

//   // ✅ Fetch all companies
//   const fetchCompanies = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/company/all");
//       setCompanies(res.data?.companies || res.data);
//     } catch (err) {
//       toast.error("Failed to fetch companies");
//     }
//   };

//   // ✅ Fetch all leaves, employees, and companies
//   const fetchLeaves = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/admin/all-leaves");
//       const leaveData = res.data?.leaves || res.data;
//       setLeaves(leaveData);

//       // 🧠 Fetch employee details
//       const employeePromises = leaveData.map(async (leave) => {
//         const empId = leave.employeeId?._id || leave.employeeId;
//         if (!empId) return null;
//         const empRes = await axios.get(
//           `http://localhost:4000/employee/getEmployee/${empId}`
//         );
//         return { empId, data: empRes.data.employee };
//       });

//       const employeeResults = await Promise.all(employeePromises);
//       const empDataMap = {};
//       const companyIds = new Set();

//       // 🧩 Map employee and extract valid company IDs
//       employeeResults.forEach((item) => {
//         if (item) {
//           empDataMap[item.empId] = item.data;

//           // ✅ FIX: ensure we only add company._id or string ID
//           const companyField = item.data?.company;
//           if (companyField?._id) {
//             companyIds.add(companyField._id);
//           } else if (typeof companyField === "string") {
//             companyIds.add(companyField);
//           }
//         }
//       });

//       // 🏢 Fetch company details using proper ObjectId strings
//       const companyPromises = [...companyIds].map(async (companyId) => {
//         const compRes = await axios.get(`http://localhost:4000/company/${companyId}`);
//         return { companyId, data: compRes.data.company };
//       });

//       const companyResults = await Promise.all(companyPromises);
//       const compDataMap = {};
//       companyResults.forEach((item) => {
//         if (item) compDataMap[item.companyId] = item.data;
//       });

//       setEmployeeDetails(empDataMap);
//       setCompanyDetails(compDataMap);
//     } catch (err) {
//       toast.error("Failed to fetch leave data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompanies();
//     fetchLeaves();
//   }, []);

//   const handleAction = async (leaveId, status) => {
//     try {
//       const adminRemark =
//         status === "Approved" ? "Leave approved by admin" : "Leave rejected by admin";

//       await axios.put(`http://localhost:4000/admin/update-leave/${leaveId}`, {
//         status,
//         adminRemark,
//       });

//       toast.success(`Leave ${status.toLowerCase()} successfully!`);
//       fetchLeaves();
//     } catch (err) {
//       toast.error("Failed to update leave status");
//     }
//   };

//   const handleView = (leave) => {
//     setSelectedLeave(leave);
//     setShowModal(true);
//   };

//   // ✅ Filter by company, department, status
//   const filteredLeaves = leaves.filter((leave) => {
//     const empId = leave.employeeId?._id || leave.employeeId;
//     const emp = employeeDetails[empId];
//     const comp =
//       emp?.company && companyDetails[emp.company?._id || emp.company]
//         ? companyDetails[emp.company?._id || emp.company]
//         : null;

//     // Normalize department: the API may return a string or an object like { _id, dep }
//     const empDept = emp
//       ? typeof emp.department === "string"
//         ? emp.department
//         : emp.department?.dep || emp.department?.name || undefined
//       : undefined;

//     const matchesCompany = !selectedCompany || comp?._id === selectedCompany;
//     const matchesDept = !selectedDepartment || empDept === selectedDepartment;
//     const matchesStatus = !selectedStatus || leave.status === selectedStatus;

//     return matchesCompany && matchesDept && matchesStatus;
//   });

//   if (loading)
//     return <div className="p-6 text-center text-gray-600">Loading leave requests...</div>;

//   return (
//     <div className="max-h-[85vh] overflow-y-auto bg-[#f8f9fa] p-8 relative">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave Management Super Admin</h1>
//         <p className="text-gray-600">
//           Review, approve, or reject leave requests from employees
//         </p>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mb-6">
//         <select
//           value={selectedCompany}
//           onChange={(e) => setSelectedCompany(e.target.value)}
//           className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
//         >
//           <option value="">All Companies</option>
//           {companies.map((company) => (
//             <option key={company._id} value={company._id}>
//               {company.companyName}
//             </option>
//           ))}
//         </select>

//         <select
//           value={selectedDepartment}
//           onChange={(e) => setSelectedDepartment(e.target.value)}
//           className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
//         >
//           <option value="">All Departments</option>
//           {departments.map((dept) => (
//             <option key={dept} value={dept}>
//               {dept}
//             </option>
//           ))}
//         </select>

//         <select
//           value={selectedStatus}
//           onChange={(e) => setSelectedStatus(e.target.value)}
//           className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
//         >
//           <option value="">All Status</option>
//           <option value="Approved">Approved</option>
//           <option value="Rejected">Rejected</option>
//           <option value="Pending">Pending</option>
//         </select>

//         {(selectedCompany || selectedDepartment || selectedStatus) && (
//           <button
//             onClick={() => {
//               setSelectedCompany("");
//               setSelectedDepartment("");
//               setSelectedStatus("");
//             }}
//             className="text-sm bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300 transition"
//           >
//             Clear Filters
//           </button>
//         )}
//       </div>

//       {/* Leave Table */}
//       <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden relative">
//         {filteredLeaves.length === 0 ? (
//           <p className="p-6 text-center text-gray-500">No leave requests found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead className="bg-gray-100 text-gray-700">
//                 <tr>
//                   <th className="p-3 text-left font-semibold">Employee Name</th>
//                   <th className="p-3 text-left font-semibold">Department</th>
//                   <th className="p-3 text-left font-semibold">Company</th>
//                   <th className="p-3 text-left font-semibold">Leave Type</th>
//                   <th className="p-3 text-left font-semibold">Start Date</th>
//                   <th className="p-3 text-left font-semibold">End Date</th>
//                   <th className="p-3 text-left font-semibold">Status</th>
//                   <th className="p-3 text-center font-semibold">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200">
//                 {filteredLeaves.map((leave) => {
//                   const empId = leave.employeeId?._id || leave.employeeId;
//                   const emp = employeeDetails[empId];
//                   const comp =
//                     emp?.company && companyDetails[emp.company?._id || emp.company]
//                       ? companyDetails[emp.company?._id || emp.company]
//                       : null;

//                   // Normalize department for display (avoid rendering an object)
//                   const empDept = emp
//                     ? typeof emp.department === "string"
//                       ? emp.department
//                       : emp.department?.dep || emp.department?.name || undefined
//                     : undefined;

//                   return (
//                     <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="p-3">{emp?.fullName || "—"}</td>
//                       <td className="p-3">{empDept || "—"}</td>
//                       <td className="p-3 text-gray-700">{comp?.companyName || "—"}</td>
//                       <td className="p-3 font-medium">{leave.leaveType}</td>
//                       <td className="p-3 text-gray-700">
//                         {new Date(leave.startDate).toLocaleDateString()}
//                       </td>
//                       <td className="p-3 text-gray-700">
//                         {new Date(leave.endDate).toLocaleDateString()}
//                       </td>
//                       <td
//                         className={`p-3 font-medium ${
//                           leave.status === "Approved"
//                             ? "text-green-600"
//                             : leave.status === "Rejected"
//                             ? "text-red-600"
//                             : "text-yellow-600"
//                         }`}
//                       >
//                         {leave.status}
//                       </td>
//                       <td className="p-3 text-center space-x-2">
//                         {/* 👁 View Button */}
//                         <button
//                           onClick={() => handleView(leave)}
//                           className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
//                           title="View Reason"
//                         >
//                           <FaEye className="w-4 h-4" />
//                         </button>

//                         {leave.status === "Pending" && (
//                           <>
//                             <button
//                               onClick={() => handleAction(leave._id, "Approved")}
//                               className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
//                               title="Approve"
//                             >
//                               <Check className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => handleAction(leave._id, "Rejected")}
//                               className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
//                               title="Reject"
//                             >
//                               <X className="w-4 h-4" />
//                             </button>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* 🟦 Inline Modal */}
//       {showModal && selectedLeave && (
//         <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg w-[380px] p-5 z-10">
//           <h2 className="text-lg text-center font-semibold mb-5 text-gray-800">
//             Leave Details
//           </h2>
//           <p className="pb-2">
//             <strong className="text-green-600 font-xl font-bold">Type:</strong>{" "}
//             {selectedLeave.leaveType}
//           </p>
//           <p>
//             <strong className="text-red-600 font-xl font-bold">Duration:</strong>{" "}
//             {new Date(selectedLeave.startDate).toLocaleDateString()} →{" "}
//             {new Date(selectedLeave.endDate).toLocaleDateString()}
//           </p>
//           <p className="mt-2">
//             <strong>Reason:</strong> {selectedLeave.reason || "—"}
//           </p>
//           <p className="mt-2">
//             <strong>Status:</strong>{" "}
//             <span
//               className={
//                 selectedLeave.status === "Approved"
//                   ? "text-green-600 font-xl font-bold"
//                   : selectedLeave.status === "Rejected"
//                   ? "text-red-600 font-xl font-bold"
//                   : "text-yellow-600 font-xl font-bold"
//               }
//             >
//               {selectedLeave.status}
//             </span>
//           </p>

//           <div className="mt-7 text-center">
//             <button
//               onClick={() => setShowModal(false)}
//               className="px-4 py-2 bg-red-600 text-white font-semibold font-lg rounded-md hover:bg-red-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Check, X } from "lucide-react";
import { FaEye } from "react-icons/fa";
import { LeavePage } from "../../employee/LeaveSection/LeavePage";

export const LeaveSuperAdmin = () => {
  const [leaves, setLeaves] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [companyDetails, setCompanyDetails] = useState({});
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const departments = ["IT", "Sales", "Marketing", "Engineering", "HR", "Finance"];

  // ✅ Fetch all companies
  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:4000/company/all");
      setCompanies(res.data?.companies || res.data);
    } catch (err) {
      toast.error("Failed to fetch companies");
    }
  };

  // ✅ Fetch all leaves, employees, and companies
  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:4000/admin/all-leaves");
      const leaveData = res.data?.leaves || res.data;
      setLeaves(leaveData);

      // 🧠 Fetch employee/admin details (supports both employee and admin-applied leaves)
      const employeePromises = leaveData.map(async (leave) => {
        const empId = leave.employeeId?._id || leave.employeeId;
        if (!empId) return null;

        try {
          // 🔹 First try to fetch as an Employee
          const empRes = await axios.get(
            `http://localhost:4000/employee/getEmployee/${empId}`
          );
          return { empId, data: empRes.data.employee };
        } catch (error) {
          // 🔹 If not found as Employee, try to fetch as an Admin (for admin-applied leaves)
          try {
            const adminRes = await axios.get(
              `http://localhost:4000/getAdmin/${empId}`
            );
            const admin = adminRes.data?.admin;
            if (!admin) return null;

            // Normalize admin shape so it works with existing rendering logic
            const normalizedAdmin = {
              ...admin,
              // department is already a string on Admin
              department: admin.department || undefined,
              // use first assigned company (if multiple)
              company:
                Array.isArray(admin.company) && admin.company.length > 0
                  ? admin.company[0]
                  : admin.company,
            };

            return { empId, data: normalizedAdmin };
          } catch (error2) {
            // If both lookups fail, skip this record
            return null;
          }
        }
      });

      const employeeResults = await Promise.all(employeePromises);
      const empDataMap = {};
      const companyIds = new Set();

      // 🧩 Map employee/admin and extract valid company IDs
      employeeResults.forEach((item) => {
        if (item) {
          empDataMap[item.empId] = item.data;

          // ✅ FIX: ensure we only add company._id or string ID
          const companyField = item.data?.company;
          if (Array.isArray(companyField)) {
            companyField.forEach((c) => {
              if (c?._id) {
                companyIds.add(c._id);
              } else if (typeof c === "string") {
                companyIds.add(c);
              }
            });
          } else if (companyField?._id) {
            companyIds.add(companyField._id);
          } else if (typeof companyField === "string") {
            companyIds.add(companyField);
          }
        }
      });

      // 🏢 Fetch company details using proper ObjectId strings
      const companyPromises = [...companyIds].map(async (companyId) => {
        const compRes = await axios.get(`http://localhost:4000/company/${companyId}`);
        return { companyId, data: compRes.data.company };
      });

      const companyResults = await Promise.all(companyPromises);
      const compDataMap = {};
      companyResults.forEach((item) => {
        if (item) compDataMap[item.companyId] = item.data;
      });

      setEmployeeDetails(empDataMap);
      setCompanyDetails(compDataMap);
    } catch (err) {
      toast.error("Failed to fetch leave data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchLeaves();
  }, []);

  const handleAction = async (leaveId, status) => {
    try {
      const adminRemark =
        status === "Approved" ? "Leave approved by admin" : "Leave rejected by admin";

      await axios.put(`http://localhost:4000/admin/update-leave/${leaveId}`, {
        status,
        adminRemark,
      });

      toast.success(`Leave ${status.toLowerCase()} successfully!`);
      fetchLeaves();
    } catch (err) {
      toast.error("Failed to update leave status");
    }
  };

  const handleView = (leave) => {
    setSelectedLeave(leave);
    setShowModal(true);
  };

  // ✅ Filter by company, department, status
  const filteredLeaves = leaves.filter((leave) => {
    const empId = leave.employeeId?._id || leave.employeeId;
    const emp = employeeDetails[empId];
    const comp =
      emp?.company && companyDetails[emp.company?._id || emp.company]
        ? companyDetails[emp.company?._id || emp.company]
        : null;

    // Normalize department: the API may return a string or an object like { _id, dep }
    const empDept = emp
      ? typeof emp.department === "string"
        ? emp.department
        : emp.department?.dep || emp.department?.name || undefined
      : undefined;

    const matchesCompany = !selectedCompany || comp?._id === selectedCompany;
    const matchesDept = !selectedDepartment || empDept === selectedDepartment;
    const matchesStatus = !selectedStatus || leave.status === selectedStatus;

    return matchesCompany && matchesDept && matchesStatus;
  });

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading leave requests...</div>;

  return (
    <div className="max-h-[85vh] overflow-y-auto bg-[#f8f9fa] p-8 relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave Management Admin</h1>
        <p className="text-gray-600">
          Review, approve, or reject leave requests from employees
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
        >
          <option value="">All Companies</option>
          {companies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.companyName}
            </option>
          ))}
        </select>

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
        >
          <option value="">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Pending">Pending</option>
        </select>

        {(selectedCompany || selectedDepartment || selectedStatus) && (
          <button
            onClick={() => {
              setSelectedCompany("");
              setSelectedDepartment("");
              setSelectedStatus("");
            }}
            className="text-sm bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Leave Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden relative">
        {filteredLeaves.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No leave requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left font-semibold">Employee Name</th>
                  <th className="p-3 text-left font-semibold">Department</th>
                  <th className="p-3 text-left font-semibold">Company</th>
                  <th className="p-3 text-left font-semibold">Leave Type</th>
                  <th className="p-3 text-left font-semibold">Start Date</th>
                  <th className="p-3 text-left font-semibold">End Date</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                  <th className="p-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredLeaves.map((leave) => {
                  const empId = leave.employeeId?._id || leave.employeeId;
                  const emp = employeeDetails[empId];
                  const comp =
                    emp?.company && companyDetails[emp.company?._id || emp.company]
                      ? companyDetails[emp.company?._id || emp.company]
                      : null;

                  // Normalize department for display (avoid rendering an object)
                  const empDept = emp
                    ? typeof emp.department === "string"
                      ? emp.department
                      : emp.department?.dep || emp.department?.name || undefined
                    : undefined;

                  return (
                    <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3">{emp?.fullName || "—"}</td>
                      <td className="p-3">{empDept || "—"}</td>
                      <td className="p-3 text-gray-700">{comp?.companyName || "—"}</td>
                      <td className="p-3 font-medium">{leave.leaveType}</td>
                      <td className="p-3 text-gray-700">
                        {new Date(leave.startDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-gray-700">
                        {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td
                        className={`p-3 font-medium ${
                          leave.status === "Approved"
                            ? "text-green-600"
                            : leave.status === "Rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {leave.status}
                      </td>
                      <td className="p-3 text-center space-x-2">
                        {/* 👁 View Button */}
                        <button
                          onClick={() => handleView(leave)}
                          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                          title="View Reason"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>

                        {leave.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleAction(leave._id, "Approved")}
                              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction(leave._id, "Rejected")}
                              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🟦 Inline Modal */}
      {showModal && selectedLeave && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg w-[380px] p-5 z-10">
          <h2 className="text-lg text-center font-semibold mb-5 text-gray-800">
            Leave Details
          </h2>
          <p className="pb-2">
            <strong className="text-green-600 font-xl font-bold">Type:</strong>{" "}
            {selectedLeave.leaveType}
          </p>
          <p>
            <strong className="text-red-600 font-xl font-bold">Duration:</strong>{" "}
            {new Date(selectedLeave.startDate).toLocaleDateString()} →{" "}
            {new Date(selectedLeave.endDate).toLocaleDateString()}
          </p>
          <p className="mt-2">
            <strong>Reason:</strong> {selectedLeave.reason || "—"}
          </p>
          <p className="mt-2">
            <strong>Status:</strong>{" "}
            <span
              className={
                selectedLeave.status === "Approved"
                  ? "text-green-600 font-xl font-bold"
                  : selectedLeave.status === "Rejected"
                  ? "text-red-600 font-xl font-bold"
                  : "text-yellow-600 font-xl font-bold"
              }
            >
              {selectedLeave.status}
            </span>
          </p>

          <div className="mt-7 text-center">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-red-600 text-white font-semibold font-lg rounded-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}


    </div>
  );
};