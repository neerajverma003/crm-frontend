// import React, { useState, useEffect } from 'react';
// import { FaEye } from 'react-icons/fa';

// const AssignedRoles = () => {
//   const [assignedRoles, setAssignedRoles] = useState([]);
//   const [allRoles, setAllRoles] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);

//   useEffect(() => {
//     const fetchAssignedRoles = async () => {
//       try {
//         const response = await fetch('http://localhost:4000/getassignedroles');
//         const data = await response.json();
//         console.log(data)
//         setAssignedRoles(data);
//       } catch (error) {
//         console.error('Error fetching assigned roles:', error);
//       }
//     };

//     const fetchAllRoles = async () => {
//       try {
//         const response = await fetch('http://localhost:4000/roles');
//         const data = await response.json();
//         setAllRoles(data);
//       } catch (error) {
//         console.error('Error fetching all roles:', error);
//       }
//     };

//     fetchAssignedRoles();
//     fetchAllRoles();
//   }, []);

//   const getSubRoleName = (subRole) => {
//     if (!subRole) return 'Unknown Sub-role';

//     if (typeof subRole === 'object' && subRole !== null) {
//       return subRole.subRoleName || 'Unnamed Sub-role';
//     }

//     if (typeof subRole === 'string') {
//       for (const role of allRoles) {
//         if (!role.subRole) continue;
//         const foundSubRole = role.subRole.find(sr => sr._id === subRole);
//         if (foundSubRole) return foundSubRole.subRoleName || 'Unnamed Sub-role';
//       }
//     }

//     return 'Unknown Sub-role';
//   };

//   const handleViewDetails = (admin) => {
//     setSelectedAdmin(admin);
//     setShowModal(true);
//   };

//   const renderModal = () => {
//     if (!showModal || !selectedAdmin) return null;

//     return (
//       <div className="fixed z-10 inset-0 overflow-y-auto">
//         <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//           <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//             <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//           </div>

//           <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

//           <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
//             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//               <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
//                 Assigned Roles for: {selectedAdmin.fullName}
//               </h3>

//               <div className="space-y-4">
//                 {selectedAdmin.assignedRoles?.map((role, index) => (
//                   <div key={index} className="border rounded-lg p-4 bg-gray-50">
//                     <h4 className="font-semibold text-blue-700 mb-2">
//                       Role: {role.roleId?.role || 'Unknown Role'}
//                     </h4>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <strong>Companies:</strong>
//                         <ul className="list-disc ml-6 mt-1">
//                           {role.companyIds?.length > 0 ? (
//                             role.companyIds.map((company) => (
//                               <li key={company._id || company}>
//                                 {company.companyName || company || 'Unknown Company'}
//                               </li>
//                             ))
//                           ) : (
//                             <li>-</li>
//                           )}
//                         </ul>
//                       </div>

//                       <div>
//                         <strong>Sub-Roles:</strong>
//                         <ul className="list-disc ml-6 mt-1">
//                           {role.roleId?.subRole?.length > 0 ? (
//                             role.roleId.subRole.map((subRole) => (
//                               <li key={subRole._id}>
//                                 {subRole.subRoleName || 'Unnamed Sub-role'}
//                               </li>
//                             ))
//                           ) : role.subRoles?.length > 0 ? (
//                             role.subRoles.map((subRole) => (
//                               <li key={typeof subRole === 'string' ? subRole : subRole._id}>
//                                 {getSubRoleName(subRole)}
//                               </li>
//                             ))
//                           ) : (
//                             <li>-</li>
//                           )}
//                         </ul>
//                       </div>
//                     </div>

//                     <div className="mt-2">
//                       <strong>Points:</strong>
//                       <ul className="list-disc ml-6 mt-1">
//                         {role.points?.length > 0 ? (
//                           role.points.map((point, idx) => (
//                             <li key={idx}>{point ?? '-'}</li>
//                           ))
//                         ) : (
//                           <li>-</li>
//                         )}
//                       </ul>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//               <button
//                 type="button"
//                 className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                 onClick={() => setShowModal(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold text-center mb-6">Assigned Roles</h2>

//       <table className="min-w-full table-auto border-collapse border border-gray-200">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-gray-300 px-4 py-2 text-left">Admin</th>
//             <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {assignedRoles.map((admin) => (
//             <tr key={admin._id} className="even:bg-gray-50">
//               <td className="border border-gray-300 px-4 py-2">{admin.fullName || '-'}</td>
//               <td className="border border-gray-300 px-4 py-2 text-center">
//                 <button
//                   onClick={() => handleViewDetails(admin)}
//                   className="text-gray-600 hover:text-gray-900"
//                   title="View Details"
//                 >
//                   <FaEye size={20} />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {renderModal()}
//     </div>
//   );
// };

// export default AssignedRoles;


// import React, { useState, useEffect } from 'react';
// import { FaEye } from 'react-icons/fa';

// const AssignedRoles = () => {
//   const [assignedRoles, setAssignedRoles] = useState([]);
//   const [allRoles, setAllRoles] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);

//   useEffect(() => {
//     const fetchAssignedRoles = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/getassignedroles");
//         const data = await response.json();
//         setAssignedRoles(data.admins || []); // 👈 FIX: use data.admins
//       } catch (error) {
//         console.error("Error fetching assigned roles:", error);
//       }
//     };

//     const fetchAllRoles = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/roles");
//         const data = await response.json();
//         setAllRoles(data);
//       } catch (error) {
//         console.error("Error fetching all roles:", error);
//       }
//     };

//     fetchAssignedRoles();
//     fetchAllRoles();
//   }, []);

//   // Helper function: Get sub-role name if ID
//   const getSubRoleName = (subRole) => {
//     if (!subRole) return "Unknown Sub-role";

//     if (typeof subRole === "object") {
//       return subRole.subRoleName || "Unnamed Sub-role";
//     }

//     if (typeof subRole === "string") {
//       for (const role of allRoles) {
//         if (!role.subRole) continue;
//         const found = role.subRole.find((sr) => sr._id === subRole);
//         if (found) return found.subRoleName || "Unnamed Sub-role";
//       }
//     }

//     return "Unknown Sub-role";
//   };

//   // Open modal
//   const handleViewDetails = (admin) => {
//     setSelectedAdmin(admin);
//     setShowModal(true);
//   };

//   // Modal UI
//   const renderModal = () => {
//     if (!showModal || !selectedAdmin) return null;

//     return (
//       <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">

//         <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl pointer-events-auto relative animate-fadeIn">

//           <button
//             onClick={() => setShowModal(false)}
//             className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
//           >
//             ✕
//           </button>

//           <h3 className="text-xl font-semibold mb-4">
//             Assigned Roles for: {selectedAdmin.fullName}
//           </h3>

//           <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
//             {selectedAdmin.assignedRoles?.map((role, index) => (
//               <div key={index} className="border rounded-lg p-4 bg-gray-50">
//                 <h4 className="font-semibold text-blue-700 mb-2">
//                   Role: {role.roleId?.role || "No Role Assigned"}
//                 </h4>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <strong>Companies:</strong>
//                     <ul className="list-disc ml-6 mt-1">
//                       {role.companyIds?.length ? (
//                         role.companyIds.map((c, i) => (
//                           <li key={i}>{c.companyName || "Unknown Company"}</li>
//                         ))
//                       ) : (
//                         <li>-</li>
//                       )}
//                     </ul>
//                   </div>

//                   <div>
//                     <strong>Sub-Roles:</strong>
//                     <ul className="list-disc ml-6 mt-1">
//                       {role.subRoles?.length ? (
//                         role.subRoles.map((sr, i) => (
//                           <li key={i}>{getSubRoleName(sr)}</li>
//                         ))
//                       ) : (
//                         <li>-</li>
//                       )}
//                     </ul>
//                   </div>
//                 </div>

//                 <div className="mt-2">
//                   <strong>Points:</strong>
//                   <ul className="list-disc ml-6 mt-1">
//                     {role.points?.length ? (
//                       role.points.map((p, i) => <li key={i}>{p}</li>)
//                     ) : (
//                       <li>-</li>
//                     )}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
//               onClick={() => setShowModal(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold text-center mb-6">Assigned Roles</h2>

//       <table className="min-w-full table-auto border-collapse border border-gray-200">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-gray-300 px-4 py-2 text-left">Admin</th>
//             <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {assignedRoles.map((admin) => (
//             <tr key={admin._id} className="even:bg-gray-50">
//               <td className="border border-gray-300 px-4 py-2">
//                 {admin.fullName || "-"}
//               </td>

//               <td className="border border-gray-300 px-4 py-2 text-center">
//                 <button
//                   onClick={() => handleViewDetails(admin)}
//                   className="text-gray-600 hover:text-gray-900"
//                 >
//                   <FaEye size={20} />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {renderModal()}
//     </div>
//   );
// };

// export default AssignedRoles;


// import React, { useState, useEffect } from 'react';
// import { FaEye } from 'react-icons/fa';

// const AssignedRoles = () => {

//   const [assignedRoles, setAssignedRoles] = useState([]);
//   const [allRoles, setAllRoles] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);

//   // -----------------------------
//   // FETCH BASIC LIST OF ADMINS + ASSIGNED ROLES
//   // -----------------------------
//   useEffect(() => {
//     const fetchAssignedRoles = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/getassignedroles");
//         const data = await response.json();
//         setAssignedRoles(data.admins || []); 
//       } catch (error) {
//         console.error("Error fetching assigned roles:", error);
//       }
//     };

//     const fetchAllRoles = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/roles");
//         const data = await response.json();
//         setAllRoles(data);
//       } catch (error) {
//         console.error("Error fetching all roles:", error);
//       }
//     };

//     fetchAssignedRoles();
//     fetchAllRoles();
//   }, []);

//   // --------------------------------
//   // Helper to find sub-role name
//   // --------------------------------
//   const getSubRoleName = (subRole) => {
//     if (!subRole) return "Unknown Sub-role";

//     if (typeof subRole === "object") return subRole.subRoleName;

//     if (typeof subRole === "string") {
//       for (const role of allRoles) {
//         if (!role.subRole) continue;
//         const found = role.subRole.find((sr) => sr._id === subRole);
//         if (found) return found.subRoleName;
//       }
//     }

//     return "Unknown Sub-role";
//   };

//   // --------------------------------
//   // Fetch FULL DETAILS when clicking View
//   // --------------------------------
//   const handleViewDetails = async (admin) => {
//     try {
//       const res = await fetch(`http://localhost:4000/getassignedroles/${admin._id}`);
//       const data = await res.json();
//       console.log(data)
//       if (!res.ok) throw new Error(data.message);

//       setSelectedAdmin(data.admin); // Full data
//       setShowModal(true);
//     } catch (err) {
//       console.error("Error loading admin details:", err);
//       alert("Failed to load admin details");
//     }
//   };

//   // --------------------------------
//   // Modal UI
//   // --------------------------------
//   const renderModal = () => {
//     if (!showModal || !selectedAdmin) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">

//         <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-6 relative">

//           {/* Close Button */}
//           <button
//             onClick={() => setShowModal(false)}
//             className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
//           >
//             ✕
//           </button>

//           {/* Header */}
//           <h3 className="text-2xl font-semibold mb-4">
//             Assigned Roles for: <span className="text-blue-600">{selectedAdmin.fullName}</span>
//           </h3>

//           {/* Content Scroll */}
//           <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-2">

//             {selectedAdmin.assignedRoles?.map((role, index) => (
//               <div key={index} className="border rounded-lg p-4 bg-gray-50">

//                 {/* MAIN ROLE NAME */}
//                 <h4 className="font-semibold text-blue-700 mb-2">
//                   Role: {role.roleId?.role || "No Role Assigned"}
//                 </h4>

//                 <div className="grid grid-cols-2 gap-4">

//                   {/* COMPANIES */}
//                   <div>
//                     <strong>Companies:</strong>
//                     <ul className="list-disc ml-6 mt-1">
//                       {role.companyIds?.length ? (
//                         role.companyIds.map((c, i) => (
//                           <li key={i}>{c.companyName || "Unknown Company"}</li>
//                         ))
//                       ) : (
//                         <li>-</li>
//                       )}
//                     </ul>
//                   </div>

//                   {/* SUB-ROLES */}
//                   <div>
//                     <strong>Sub-Roles:</strong>
//                     <ul className="list-disc ml-6 mt-1">
//                       {role.subRoles?.length ? (
//                         role.subRoles.map((sr, i) => (
//                           <li key={i}>{getSubRoleName(sr)}</li>
//                         ))
//                       ) : (
//                         <li>-</li>
//                       )}
//                     </ul>
//                   </div>
//                 </div>



//               </div>
//             ))}

//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
//               onClick={() => setShowModal(false)}
//             >
//               Close
//             </button>
//           </div>

//         </div>
//       </div>
//     );
//   };

//   // --------------------------------
//   // TABLE LIST UI
//   // --------------------------------
//   return (
//     <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">

//       <h2 className="text-3xl font-semibold text-center mb-6">Assigned Roles</h2>

//       <table className="min-w-full table-auto border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-gray-300 px-4 py-2 text-left">Admin</th>
//             <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {assignedRoles.map((admin) => (
//             <tr key={admin._id} className="even:bg-gray-50">
//               <td className="border border-gray-300 px-4 py-2">
//                 {admin.fullName}
//               </td>

//               <td className="border border-gray-300 px-4 py-2 text-center">
//                 <button
//                   onClick={() => handleViewDetails(admin)}
//                   className="text-gray-700 hover:text-black"
//                 >
//                   <FaEye size={20} />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {renderModal()}
//     </div>
//   );
// };

// export default AssignedRoles;


// import React, { useState, useEffect } from 'react';
// import { FaEye } from 'react-icons/fa';

// const AssignedRoles = () => {

//   const [assignedRoles, setAssignedRoles] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);

//   // -----------------------------
//   // FETCH BASIC LIST OF ADMINS
//   // -----------------------------
//   useEffect(() => {
//     const fetchAssignedRoles = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/getassignedroles");
//         const data = await response.json();
//         setAssignedRoles(data.admins || []); 
//       } catch (error) {
//         console.error("Error fetching assigned roles:", error);
//       }
//     };

//     fetchAssignedRoles();
//   }, []);

//   // --------------------------------
//   // SUB-ROLE NAME FETCHING USING roleId.subRole
//   // --------------------------------
//   const getSubRoleName = (subRoleId, role) => {
//     if (!role?.roleId?.subRole) return "Unknown Sub-role";

//     const found = role.roleId.subRole.find(sr => sr._id === subRoleId);
//     return found ? found.subRoleName : "Unknown Sub-role";
//   };

//   // ----------------------------
//   // Fetch Full Admin Details
//   // ----------------------------
//   const handleViewDetails = async (admin) => {
//     try {
//       const res = await fetch(`http://localhost:4000/getassignedroles/${admin._id}`);
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message);

//       setSelectedAdmin(data.admin);
//       setShowModal(true);
//     } catch (err) {
//       console.error("Error loading admin details:", err);
//       alert("Failed to load admin details");
//     }
//   };

//   // --------------------------------
//   // Modal UI
//   // --------------------------------
//   const renderModal = () => {
//     if (!showModal || !selectedAdmin) return null;

//     return (
// <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-auto">

//         <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-6 relative">

//           <button
//             onClick={() => setShowModal(false)}
//             className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
//           >
//             ✕
//           </button>

//           <h3 className="text-2xl font-semibold mb-4">
//             Assigned Roles for: <span className="text-blue-600">{selectedAdmin.fullName}</span>
//           </h3>

//           <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-2">

//             {selectedAdmin.assignedRoles?.map((role, index) => (
//               <div key={index} className="border rounded-lg p-4 bg-gray-50">

//                 <h4 className="font-semibold text-blue-700 mb-2">
//                   Role: {role.roleId?.role || "No Role Assigned"}
//                 </h4>

//                 <div className="grid grid-cols-2 gap-4">

//                   <div>
//                     <strong>Companies:</strong>
//                     <ul className="list-disc ml-6 mt-1">
//                       {role.companyIds?.length ? (
//                         role.companyIds.map((c, i) => (
//                           <li key={i}>{c.companyName || "Unknown Company"}</li>
//                         ))
//                       ) : (
//                         <li>-</li>
//                       )}
//                     </ul>
//                   </div>

//                   <div>
//                     <strong>Sub-Roles:</strong>
//                     <ul className="list-disc ml-6 mt-1">
//                       {role.subRoles?.length ? (
//                         role.subRoles.map((sr, i) => (
//                           <li key={i}>{getSubRoleName(sr, role)}</li>
//                         ))
//                       ) : (
//                         <li>-</li>
//                       )}
//                     </ul>
//                   </div>

//                 </div>

//               </div>
//             ))}

//           </div>

//           <div className="flex justify-end mt-4">
//             <button
//               className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
//               onClick={() => setShowModal(false)}
//             >
//               Close
//             </button>
//           </div>

//         </div>
//       </div>
//     );
//   };

//   // --------------------------------
//   // TABLE LIST UI
//   // --------------------------------
//   return (
//     <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">

//       <h2 className="text-3xl font-semibold text-center mb-6">Assigned Roles</h2>

//       <table className="min-w-full table-auto border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-gray-300 px-4 py-2 text-left">Admin</th>
//             <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {assignedRoles.map((admin) => (
//             <tr key={admin._id} className="even:bg-gray-50">
//               <td className="border border-gray-300 px-4 py-2">
//                 {admin.fullName}
//               </td>

//               <td className="border border-gray-300 px-4 py-2 text-center">
//                 <button
//                   onClick={() => handleViewDetails(admin)}
//                   className="text-gray-700 hover:text-black"
//                 >
//                   <FaEye size={20} />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {renderModal()}
//     </div>
//   );
// };

// export default AssignedRoles;


import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';

const AssignedRoles = () => {
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedSubRole, setSelectedSubRole] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all admins with assigned roles
  useEffect(() => {
    const fetchAssignedRoles = async () => {
      try {
        const response = await fetch("http://localhost:4000/getassignedroles");
        const data = await response.json();
        setAssignedRoles(data.admins || []);
      } catch (error) {
        console.error("Error fetching assigned roles:", error);
      }
    };

    fetchAssignedRoles();
  }, []);
  // Get sub-role name from role's subRole array
  const getSubRoleName = (subRoleId, role) => {
    console.log("subrolId", subRoleId);
    console.log("role", role);

    if (!role?.roleId?.subRole) return "Unknown Sub-fdfrole";

    const found = role?.subRoles.find(sr => sr._id.toString() == subRoleId._id.toString());
    console.log(found);

    return found ? found.subRoleName : "Unknown Sub-defrole";
  };

  // Fetch full admin details
  const handleViewDetails = async (admin) => {
    try {
      const res = await fetch(`http://localhost:4000/getassignedroles/${admin._id}`);

      if (!res.ok) throw new Error(data.message);
      const data = await res.json();

      setSelectedAdmin(data.admin);
      console.log(data.admin?.assignedRoles);

      setSelectedSubRole(data.admin?.assignedRoles || []);
      setShowModal(true);
    } catch (err) {
      console.error("Error loading admin details:", err);
      alert("Failed to load admin details");
    }
  };
  useEffect(() => {
    if (selectedAdmin) {
      console.log("Selected admin updated:", selectedAdmin);
    }
  }, [selectedAdmin]);

  // Delete entire assigned role
  const handleDeleteRole = async (roleId) => {
    if (!window.confirm("Are you sure you want to delete this entire role assignment?")) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/deleteassignedrole/${selectedAdmin._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Role deleted successfully");
      setSelectedAdmin(prevAdmin => ({
        ...prevAdmin,
        assignedRoles: prevAdmin.assignedRoles.filter(r => r.roleId._id !== roleId),
      }));
      
      // 🔹 Notify AdminSidebar to refresh data
      window.dispatchEvent(new Event("refreshAdminRoles"));
    } catch (err) {
      console.error("Error deleting role:", err);
      alert("Failed to delete role");
    } finally {
      setLoading(false);
    }
  };

  // Delete specific sub-role from assigned role
  const handleDeleteSubRole = async (roleId, subRoleId) => {
    if (!window.confirm("Are you sure you want to delete this sub-role?")) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/deletesubrole/${selectedAdmin._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId, subRoleId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Sub-role deleted successfully");
      setSelectedAdmin(prevAdmin => ({
        ...prevAdmin,
        assignedRoles: prevAdmin.assignedRoles.map(role => {
          if (role.roleId._id === roleId) {
            return {
              ...role,
              roleId: {
                ...role.roleId,
                subRole: role.roleId.subRole.filter(sr => sr._id !== subRoleId)
              }
            };
          }
          return role;
        }),
      }));
      
      // 🔹 Notify AdminSidebar to refresh data
      window.dispatchEvent(new Event("refreshAdminRoles"));
    } catch (err) {
      console.error("Error deleting sub-role:", err);
      alert("Failed to delete sub-role");
    } finally {
      setLoading(false);
    }
  };

  // Delete specific point from sub-role
  const handleDeletePoint = async (roleId, subRoleId, point) => {
    if (!window.confirm("Are you sure you want to delete this point?")) {
      return;
    }

    try {
      setLoading(true);
      // Send adminId in URL so backend removes the point only from this admin's assignedRoles
      const res = await fetch(`http://localhost:4000/deletepoint/${selectedAdmin._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId, subRoleId, point }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Point deleted successfully");
      // Update modal state so UI reflects deletion immediately: remove the point value from assignment-level points
      setSelectedAdmin((prevAdmin) => {
        if (!prevAdmin) return prevAdmin;
        return {
          ...prevAdmin,
          assignedRoles: prevAdmin.assignedRoles.map((assignedRole) => {
            const assignedRoleId = assignedRole.roleId && assignedRole.roleId._id ? assignedRole.roleId._id.toString() : (assignedRole.roleId ? assignedRole.roleId.toString() : null);
            if (assignedRoleId && assignedRoleId === roleId.toString()) {
              return {
                ...assignedRole,
                points: (assignedRole.points || []).filter((p) => p !== point),
              };
            }
            return assignedRole;
          }),
        };
      });

      // Also update selectedSubRole helper state (if used elsewhere)
      setSelectedSubRole((prev) =>
        prev.map((assignedRole) => ({
          ...assignedRole,
          subRoles: assignedRole.subRoles.map((subRole) => {
            if (subRole._id === subRoleId) {
              return {
                ...subRole,
                points: (subRole.points || []).filter((p) => p !== point),
              };
            }
            return subRole;
          }),
        }))
      );

      // Notify AdminSidebar (and other listeners) to refresh their data
      window.dispatchEvent(new Event("refreshAdminRoles"));


      // setSelectedSubRole(prevSubRole => ({
      //   ...prevSubRole,
      //   subRoles: prevSubRole.map(subRole => {
      //     if (subRole === subRoleId._id) {
      //       const newPoints = [...subRole.points];
      //       newPoints.splice(pointIndex, 1);
      //       return {
      //         ...subRole,
      //         points: newPoints,
      //       };
      //     }
      //     return subRole;
      //   }),
      // }));
    } catch (err) {
      console.error("Error deleting point:", err);
      alert("Failed to delete point");
    } finally {
      setLoading(false);
    }
  };

// const handleDeletePoint = async (roleId, subRoleId, pointIndex, companyId) => {
//   if (!window.confirm("Are you sure you want to delete this point?")) return;

//   try {
//     setLoading(true);

//     const res = await fetch(`http://localhost:4000/deletepoint/${selectedAdmin._id}`, {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ 
//         roleId, 
//         subRoleId, 
//         pointIndex, 
//         companyId 
//       }),
//     });

//     const data = await res.json();
    
//     if (!res.ok) throw new Error(data.message);

//     alert("Point deleted successfully");

//     // ✅ UPDATE THE STATE WITH THE REFRESHED ASSIGNED ROLES
//     setSelectedAdmin(prevAdmin => ({
//       ...prevAdmin,
//       assignedRoles: data.assignedRoles || prevAdmin.assignedRoles,
//     }));
    
//     // 🔹 Notify AdminSidebar to refresh data
//     window.dispatchEvent(new Event("refreshAdminRoles"));

//   } catch (err) {
//     console.error("Error deleting point:", err);
//     alert("Failed to delete point");
//   } finally {
//     setLoading(false);
//   }
// };


  // Modal UI
  // const renderModal = () => {
  //   if (!showModal || !selectedAdmin) return null;

  //   return (
  //     <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-auto bg-black bg-opacity-50">
  //       <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">

  //         <button
  //           onClick={() => setShowModal(false)}
  //           className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl z-10"
  //         >
  //           ✕
  //         </button>

  //         <h3 className="text-2xl font-semibold mb-4">
  //           Assigned Roles for: <span className="text-blue-600">{selectedAdmin.fullName}</span>
  //         </h3>

  //         <div className="space-y-6 pr-2">
  //           {selectedAdmin.assignedRoles?.length ? (
  //             selectedAdmin.assignedRoles.map((role, index) => (
  //               <div key={index} className="border rounded-lg p-5 bg-gray-50 hover:bg-gray-100 transition">

  //                 {/* Role Header with Delete Button */}
  //                 <div className="flex justify-between items-center mb-4">
  //                   <h4 className="font-semibold text-lg text-blue-700">
  //                     Role: {role.roleId?.role || "No Role Assigned"}
  //                   </h4>
  //                   <button
  //                     onClick={() => handleDeleteRole(role.roleId._id)}
  //                     disabled={loading}
  //                     className="text-red-500 hover:text-red-700 disabled:opacity-50 transition"
  //                     title="Delete entire role assignment"
  //                   >
  //                     <FaTrash size={18} />
  //                   </button>
  //                 </div>

  //                 {/* Companies Section */}
  //                 <div className="mb-4">
  //                   <strong className="text-gray-700">Companies:</strong>
  //                   <ul className="list-disc ml-6 mt-2 space-y-1">
  //                     {role.companyIds?.length ? (
  //                       role.companyIds.map((c, i) => (
  //                         <li key={i} className="text-gray-600">
  //                           {c.companyName || "Unknown Company"}
  //                         </li>
  //                       ))
  //                     ) : (
  //                       <li className="text-gray-500 italic">-</li>
  //                     )}
  //                   </ul>
  //                 </div>

  //                 {/* Sub-Roles Section */}
  //                 <div className="mb-4">
  //                   <strong className="text-gray-700">Sub-Roles:</strong>
  //                   {role.subRoles?.length ? (
  //                     <div className="mt-2 space-y-2">
  //                       {role.subRoles.map((subRoleId, i) => (
  //                         <div
  //                           key={i}
  //                           className="flex justify-between items-center bg-white p-3 rounded border border-gray-200 hover:border-gray-300"
  //                         >
  //                           <span className="text-gray-700">
  //                             {getSubRoleName(subRoleId, role)}
  //                           </span>
  //                           <button
  //                             onClick={() => handleDeleteSubRole(role.roleId._id, subRoleId)}
  //                             disabled={loading}
  //                             className="text-red-500 hover:text-red-700 disabled:opacity-50 transition"
  //                             title="Delete this sub-role"
  //                           >
  //                             <FaTrash size={16} />
  //                           </button>
  //                         </div>
  //                       ))}
  //                     </div>
  //                   ) : (
  //                     <div className="text-gray-500 italic mt-2">-</div>
  //                   )}
  //                 </div>

  //                 {/* Points Section */}
  //                 <div>
  //                   <strong className="text-gray-700">Points:</strong>
  //                   {/* {role.subRoles?.points?.length ? ( */}
  //                   {role.subRoles?.map(subRole => (
  //                     <div className="mt-2 space-y-2">
  //                       {subRole?.points?.map((point, i) => (
  //                         <div
  //                           key={i}
  //                           className="flex justify-between items-center bg-white p-3 rounded border border-gray-200 hover:border-gray-300"
  //                         >
  //                           <span className="text-gray-700">{point}</span>
  //                           <button
  //                             onClick={() => handleDeletePoint(subRole._id, i)}
  //                             disabled={loading}
  //                             className="text-red-500 hover:text-red-700 disabled:opacity-50 transition"
  //                             title="Delete this point"
  //                           >
  //                             <FaTrash size={16} />
  //                           </button>
  //                         </div>
  //                       ))}
  //                     </div>
  //                   ))}
  //                 </div>

  //               </div>
  //             ))
  //           ) : (
  //             <div className="text-center text-gray-500 py-8">No assigned roles</div>
  //           )}
  //         </div>

  //         <div className="flex justify-end mt-6 gap-3">
  //           <button
  //             className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
  //             onClick={() => setShowModal(false)}
  //             disabled={loading}
  //           >
  //             Close
  //           </button>
  //         </div>

  //       </div>
  //     </div>
  //   );
  // };

  const renderModal = () => {
  if (!showModal || !selectedAdmin) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-auto bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">

        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl z-10"
        >
          ✕
        </button>

        <h3 className="text-2xl font-semibold mb-4">
          Assigned Roles for:{" "}
          <span className="text-blue-600">{selectedAdmin.fullName}</span>
        </h3>

        <div className="space-y-6 pr-2">
          {selectedAdmin.assignedRoles?.length ? (
            selectedAdmin.assignedRoles.map((role, index) => (
              <div
                key={index}
                className="border rounded-lg p-5 bg-gray-50 hover:bg-gray-100 transition"
              >
                {/* Role Header */}
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-lg text-blue-700">
                    Role: {role.roleId?.role || "No Role Assigned"}
                  </h4>

                  <button
                    onClick={() => handleDeleteRole(role.roleId._id)}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    title="Delete entire role assignment"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>

                {/* Companies with Sub-Roles & Points */}
                <div className="mb-4">
                  <strong className="text-gray-700">Companies & Sub-Roles:</strong>
                  
                  {role.companyIds?.length ? (
                    <div className="mt-3 space-y-4">
                      {role.companyIds.map((company) => (
                        <div
                          key={company._id}
                          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                        >
                          {/* Company Name */}
                          <h5 className="font-semibold text-blue-700 mb-3">
                            {company.companyName || "Unknown Company"}
                          </h5>

                          {/* Sub-Roles for this Company */}
                          {
                            // Use the subRoles actually assigned to this admin (role.subRoles)
                            // and show only points that are both defined on the subrole and assigned in role.points
                          }
                          {role.subRoles && role.subRoles.length ? (
                            <div className="space-y-3 ml-2">
                              {role.subRoles.map((assignedSub) => {
                                // assignedSub may be an object or an ID
                                const subObj = typeof assignedSub === "object" && assignedSub !== null
                                  ? assignedSub
                                  : (role.roleId?.subRole || []).find(sr => (sr._id === assignedSub || sr._id?.toString() === (assignedSub?.toString && assignedSub.toString()))) || { _id: assignedSub, subRoleName: "Unknown SubRole", points: [] };

                                const canonicalPoints = subObj.points || [];
                                const assignedPointsForRole = role.points || [];
                                const filteredPoints = canonicalPoints.filter(p => assignedPointsForRole.includes(p));

                                return (
                                  <div key={subObj._id} className="bg-white border rounded-lg p-3">
                                    {/* SubRole Header */}
                                    <div className="flex justify-between items-center mb-2">
                                      <h6 className="font-medium text-gray-700">{subObj.subRoleName}</h6>

                                      <button
                                        onClick={() => handleDeleteSubRole(role.roleId._id, subObj._id)}
                                        disabled={loading}
                                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                        title="Delete this sub-role"
                                      >
                                        <FaTrash size={14} />
                                      </button>
                                    </div>

                                    {/* Points for this SubRole (only assigned ones) */}
                                    {filteredPoints && filteredPoints.length ? (
                                      <div className="space-y-2">
                                        {filteredPoints.map((point, i) => (
                                          <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded border text-sm">
                                            <span className="text-gray-700">{point}</span>
                                            <button
                                              onClick={() => handleDeletePoint(role.roleId._id, subObj._id, point)}
                                              disabled={loading}
                                              className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                              title="Delete this point"
                                            >
                                              <FaTrash size={12} />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-gray-400 italic text-sm">No points</div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-gray-500 italic text-sm">No sub-roles assigned</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic mt-2">
                      No companies assigned
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No assigned roles
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
            onClick={() => setShowModal(false)}
            disabled={loading}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};


  // Main Table UI
  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-center mb-6">Assigned Roles</h2>

      {assignedRoles.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Admin</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {assignedRoles.map((admin) => (
              <tr key={admin._id} className="even:bg-gray-50 hover:bg-blue-50 transition">
                <td className="border border-gray-300 px-4 py-2">
                  {admin.fullName}
                </td>

                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleViewDetails(admin)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="View details"
                  >
                    <FaEye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500 py-8">No admins with assigned roles</div>
      )}

      {renderModal()}
    </div>
  );
};

export default AssignedRoles;
