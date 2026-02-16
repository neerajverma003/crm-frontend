// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { FaEye } from "react-icons/fa";

// export const LeavePage = () => {
//   const role=localStorage.getItem("role")?.toLowerCase();
//   const [leaveData, setLeaveData] = useState({
//     employeeId: localStorage.getItem("userId"),
//     // companyId: localStorage.getItem("companyId"),
//     companyId :role === "employee"? localStorage.getItem("companyId"): localStorage.getItem("companyId").split(",")[0],
//     leaveType: "",
//     startDate: "",
//     endDate: "",
//     reason: "",
//   });
//   console.log(leaveData);
  
//   const [myLeaves, setMyLeaves] = useState([]);
//   const [selectedLeave, setSelectedLeave] = useState(null); // 👁️ Selected leave for popup
//   // const role = localStorage.getItem("role")?.toLowerCase();

//   // 🔹 Fetch employee's leave history
//   const fetchMyLeaves = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:4000/employee/my-leaves/${leaveData.employeeId}`
//       );
//       const leaves = res.data?.leaves || res.data;
//       setMyLeaves(leaves);
//     } catch (err) {
//       toast.error("Failed to fetch leave records");
//     }
//   };

//   useEffect(() => {
//     fetchMyLeaves();
//   }, []);

//   // 🔹 Handle input changes
//   const handleChange = (e) => {
//     setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
//   };

//   // 🔹 Submit leave form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:4000/employee/apply", leaveData);
//       toast.success("Leave applied successfully!");
//       setLeaveData({
//         ...leaveData,
//         leaveType: "",
//         startDate: "",
//         endDate: "",
//         reason: "",
//       });
//       fetchMyLeaves();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error applying for leave");
//     }
//   };

//   return (
//     <div className="max-h-[85vh] overflow-y-auto bg-[#f8f9fa] p-8 relative">
//       {/* Header */}
//       {role==="employee" &&(
//         <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 mb-2">
//           Leave Management
//         </h1>
//         <p className="text-gray-600">
//           Apply for leave and view your application history
//         </p>
//       </div>
//       )}

//       {/* Leave Apply Form */}
//       <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-200">
//         <h2 className="text-lg font-semibold mb-4 text-gray-800">
//           Apply for Leave
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Leave Type */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Leave Type
//               </label>
//               <select
//                 name="leaveType"
//                 value={leaveData.leaveType}
//                 onChange={handleChange}
//                 className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="Sick Leave">Sick Leave</option>
//                 <option value="Casual Leave">Casual Leave</option>
//                 <option value="Earned Leave">Earned Leave</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {/* Reason (Textarea) */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Reason
//               </label>
//               <textarea
//                 name="reason"
//                 value={leaveData.reason}
//                 onChange={handleChange}
//                 placeholder="Describe reason for leave..."
//                 rows={3}
//                 className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
//                 required
//               />
//             </div>
//           </div>

//           {/* Dates */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={leaveData.startDate}
//                 onChange={handleChange}
//                 className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={leaveData.endDate}
//                 onChange={handleChange}
//                 className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               Apply Leave
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Leave History Table */}
//       <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
//         <h2 className="text-lg font-semibold mb-4 text-gray-800">
//           My Leave History
//         </h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="p-3 text-left font-semibold">Leave Type</th>
//                 <th className="p-3 text-left font-semibold">Start Date</th>
//                 <th className="p-3 text-left font-semibold">End Date</th>
//                 <th className="p-3 text-left font-semibold">Status</th>
//                 <th className="p-3 text-left font-semibold">Admin Remark</th>
//                 <th className="p-3 text-center font-semibold">View</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {myLeaves.length > 0 ? (
//                 myLeaves.map((leave) => (
//                   <tr
//                     key={leave._id}
//                     className="hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="p-3">{leave.leaveType}</td>
//                     <td className="p-3">
//                       {new Date(leave.startDate).toLocaleDateString()}
//                     </td>
//                     <td className="p-3">
//                       {new Date(leave.endDate).toLocaleDateString()}
//                     </td>
//                     <td
//                       className={`p-3 font-medium ${
//                         leave.status === "Approved"
//                           ? "text-green-600"
//                           : leave.status === "Rejected"
//                           ? "text-red-600"
//                           : "text-yellow-600"
//                       }`}
//                     >
//                       {leave.status}
//                     </td>
//                     <td className="p-3 text-gray-700">
//                       {leave.adminRemark || "—"}
//                     </td>
//                     <td className="p-3 text-center">
//                       <button
//                         onClick={() => setSelectedLeave(leave)}
//                         className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
//                         title="View Reason"
//                       >
//                         <FaEye className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="6"
//                     className="p-4 text-center text-gray-500 italic"
//                   >
//                     No leave records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* 👁️ Subtle Reason Popup */}
//     {/* 👁️ Leave Details Popup (clean white modal) */}
// {selectedLeave && (
//   <div className="absolute inset-0 flex items-center justify-center bg-transparent z-50">
//     <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-[90%] sm:w-[420px] animate-scale-in">
//       <h2 className="text-xl font-semibold mb-4 text-gray-900 text-center">
//         Leave Details
//       </h2>

//       <div className="space-y-2 text-gray-800">
//         <p>
//           <strong className="text-green-600">Type:</strong>{" "}
//           {selectedLeave.leaveType}
//         </p>
//         <p>
//           <strong className="text-red-600">Duration:</strong>{" "}
//           {new Date(selectedLeave.startDate).toLocaleDateString()} →{" "}
//           {new Date(selectedLeave.endDate).toLocaleDateString()}
//         </p>
//         <p>
//           <strong className="text-gray-800">Reason:</strong>{" "}
//           {selectedLeave.reason || "—"}
//         </p>
//         <p>
//           <strong>Status:</strong>{" "}
//           <span
//             className={
//               selectedLeave.status === "Approved"
//                 ? "text-green-600 font-semibold"
//                 : selectedLeave.status === "Rejected"
//                 ? "text-red-600 font-semibold"
//                 : "text-yellow-600 font-semibold"
//             }
//           >
//             {selectedLeave.status}
//           </span>
//         </p>
//       </div>

//       <div className="mt-6 flex justify-center">
//         <button
//           onClick={() => setSelectedLeave(null)}
//           className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };





import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";

export const LeavePage = () => {
  const role=localStorage.getItem("role")?.toLowerCase();
  const [leaveData, setLeaveData] = useState({
      // employeeId: localStorage.getItem("userId"),
      employeeId: localStorage.getItem("userId"),
      appliedByModel: role === "employee" ? "Employee" : "Admin",
      // companyId: localStorage.getItem("companyId"),
      companyId: role === "employee" ? localStorage.getItem("companyId") : localStorage.getItem("companyId").split(",")[0],
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
  });
  console.log(leaveData);
  
  const [myLeaves, setMyLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null); // 👁️ Selected leave for popup
  // const role = localStorage.getItem("role")?.toLowerCase();

  // 🔹 Fetch employee's leave history
  const fetchMyLeaves = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/employee/my-leaves/${leaveData.employeeId}`
      );
      const leaves = res.data?.leaves || res.data;
      setMyLeaves(leaves);
    } catch (err) {
      toast.error("Failed to fetch leave records");
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  // 🔹 Submit leave form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/employee/apply", leaveData);
      toast.success("Leave applied successfully!");
      setLeaveData({
        ...leaveData,
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
      fetchMyLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error applying for leave");
    }
  };

  return (
    <div className="max-h-[85vh] overflow-y-auto bg-[#f8f9fa] p-8 relative">
      {/* Header */}
      {role==="employee" &&(
        <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Leave Management
        </h1>
        <p className="text-gray-600">
          Apply for leave and view your application history
        </p>
      </div>
      )}

      {/* Leave Apply Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Apply for Leave
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Leave Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Leave Type
              </label>
              <select
                name="leaveType"
                value={leaveData.leaveType}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Reason (Textarea) */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Reason
              </label>
              <textarea
                name="reason"
                value={leaveData.reason}
                onChange={handleChange}
                placeholder="Describe reason for leave..."
                rows={3}
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={leaveData.startDate}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={leaveData.endDate}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Apply Leave
            </button>
          </div>
        </form>
      </div>

      {/* Leave History Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          My Leave History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left font-semibold">Leave Type</th>
                <th className="p-3 text-left font-semibold">Start Date</th>
                <th className="p-3 text-left font-semibold">End Date</th>
                <th className="p-3 text-left font-semibold">Status</th>
                <th className="p-3 text-left font-semibold">Admin Remark</th>
                <th className="p-3 text-center font-semibold">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {myLeaves.length > 0 ? (
                myLeaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">{leave.leaveType}</td>
                    <td className="p-3">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
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
                    <td className="p-3 text-gray-700">
                      {leave.adminRemark || "—"}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedLeave(leave)}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                        title="View Reason"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-4 text-center text-gray-500 italic"
                  >
                    No leave records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 👁️ Subtle Reason Popup */}
    {/* 👁️ Leave Details Popup (clean white modal) */}
{selectedLeave && (
  <div className="absolute inset-0 flex items-center justify-center bg-transparent z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-[90%] sm:w-[420px] animate-scale-in">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 text-center">
        Leave Details
      </h2>

      <div className="space-y-2 text-gray-800">
        <p>
          <strong className="text-green-600">Type:</strong>{" "}
          {selectedLeave.leaveType}
        </p>
        <p>
          <strong className="text-red-600">Duration:</strong>{" "}
          {new Date(selectedLeave.startDate).toLocaleDateString()} →{" "}
          {new Date(selectedLeave.endDate).toLocaleDateString()}
        </p>
        <p>
          <strong className="text-gray-800">Reason:</strong>{" "}
          {selectedLeave.reason || "—"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={
              selectedLeave.status === "Approved"
                ? "text-green-600 font-semibold"
                : selectedLeave.status === "Rejected"
                ? "text-red-600 font-semibold"
                : "text-yellow-600 font-semibold"
            }
          >
            {selectedLeave.status}
          </span>
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setSelectedLeave(null)}
          className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};