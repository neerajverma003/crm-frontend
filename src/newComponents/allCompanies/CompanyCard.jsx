
// // import { Mail, Phone, Globe, Users, Eye, Edit, Trash2 } from "lucide-react";
// // import axios from "axios";
// // import { useState } from "react";

// // const CompanyCard = ({
// //   _id,
// //   companyName,
// //   industry,
// //   status,
// //   email,
// //   phoneNumber,
// //   website,
// //   logo,
// //   numberOfEmployees,
// //   deals = 0,
// //   value = "$0",
// //   onDelete, // callback to remove from parent
// //   onEdit,
// // }) => {
// //   const displayName = companyName || "N/A";
// //   const displayStatus = status?.toLowerCase() === "active" ? "Active" : "Pending";
// //   const [isOpen, setIsOpen] = useState(false);

// //   const handleDelete = async () => {
// //     console.log(_id);
    
// //     if (!_id) return;
// //     if (!window.confirm(`Are you sure you want to delete ${displayName}?`)) return;

// //     try {
// //       const res = await axios.delete(`http://localhost:4000/company/delete/${_id}`);
// //       if (res.status === 200) {
// //         alert("Company deleted successfully ✅");
// //         if (onDelete) onDelete(_id);
// //       }
// //     } catch (error) {
// //       console.error("Error deleting company:", error);
// //       alert("Failed to delete company ❌");
// //     }
// //   };

// //   const handleView =async (e) => {
// //     e.preventDefault();
// //     setIsOpen(true);
// //   }

// //   return (
// //     <div className="bg-white rounded-xl border border-gray-200 p-6 w-80 hover:shadow-lg transition-shadow duration-200">
// //       {/* Top Row */}
// //       <div className="flex justify-between items-center mb-2">
// //         <div className="flex items-center gap-3">
// //           <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold overflow-hidden">
// //             {/* Show logo if available, otherwise initial letter */}
// //             {logo ? (
// //               <img src={logo} alt={`${displayName} logo`} className="w-full h-full object-cover" />
// //             ) : (
// //               displayName[0] || "?"
// //             )}
// //           </div>
// //           <div>
// //             <h2 className="font-semibold text-gray-900">{displayName}</h2>
// //             <p className="text-sm text-gray-400">{industry || "N/A"}</p>
// //           </div>
// //         </div>
// //         <span
// //           className={`px-3 py-1 rounded-full text-xs font-semibold ${
// //             displayStatus === "Active"
// //               ? "bg-[#00c951] text-white"
// //               : "bg-[#f0b100] text-gray-900"
// //           }`}
// //         >
// //           {displayStatus}
// //         </span>
// //       </div>

// //       {/* Contact Info */}
// //       <div className="my-4 text-gray-600 text-sm space-y-1">
// //         <div className="flex items-center gap-1">
// //           <Mail size={15} /> <span>{email || "N/A"}</span>
// //         </div>
// //         <div className="flex items-center gap-1">
// //           <Phone size={15} /> <span>{phoneNumber || "N/A"}</span>
// //         </div>
// //         <div className="flex items-center gap-1">
// //           <Globe size={15} /> <span>{website || "N/A"}</span>
// //         </div>
// //         <div className="flex items-center gap-1">
// //           <Users size={15} /> <span>{numberOfEmployees || 0} employees</span>
// //         </div>
// //       </div>

// //       <hr className="my-3" />

// //       {/* Deals & Value */}
// //       <div className="flex justify-between items-end">
// //         <div>
// //           <p className="font-semibold text-lg text-gray-700">{deals}</p>
// //           <p className="text-xs text-gray-400">Deals</p>
// //         </div>
// //         <div className="text-center">
// //           <p className="font-semibold text-lg text-green-600">{value}</p>
// //           <p className="text-xs text-gray-400">Value</p>
// //         </div>
// //       </div>

// //       {/* Actions */}
// //       <div className="flex justify-end gap-2 mt-3">
// //         <button
// //         onClick={handleView}
// //          className="text-gray-500 hover:bg-gray-200 p-2 rounded-sm">
// //           <Eye size={15} />
// //         </button>
// //         <button
// //           onClick={() => onEdit && onEdit({ _id, companyName, industry, status, email, phoneNumber, website, numberOfEmployees, deals, value })}
// //           className="text-gray-500 hover:bg-gray-200 p-2 rounded-sm"
// //         >
// //           <Edit size={15} />
// //         </button>
// //         <button
// //           onClick={handleDelete}
// //           className="text-red-500 hover:bg-gray-200 p-2 rounded-sm"
// //         >
// //           <Trash2 size={15} />
// //         </button>
// //       </div>

// //       {isOpen && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-lg p-6 w-96 relative">
// //             <h2 className="text-lg font-semibold mb-4">Company Details</h2>
// //             <p className="mb-2"><strong>Company Name:</strong> {displayName}</p>
// //             <p className="mb-2"><strong>Industry:</strong> {industry || "N/A"}</p>
// //             <p className="mb-2"><strong>Email:</strong> {email || "N/A"}</p>
// //             <p className="mb-2"><strong>Phone Number:</strong> {phoneNumber || "N/A"}</p>
// //             <p className="mb-2"><strong>Website:</strong> {website || "N/A"}</p>
// //             <p className="mb-2"><strong>Number of Employees:</strong> {numberOfEmployees || 0}</p>
// //             <button
// //               onClick={() => setIsOpen(false)}
// //               className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
// //             >
// //               Close
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default CompanyCard;



// import axios from "axios";
// import { useState } from "react";
// import { MdMail, MdPhone, MdLanguage, MdPeople, MdVisibility, MdEdit, MdDelete } from "react-icons/md";

// const CompanyCard = ({
//   _id,
//   companyName,
//   industry,
//   status,
//   email,
//   phoneNumber,
//   website,
//   logo,
//   address,
//   numberOfEmployees,
//   deals = 0,
//   value = "$0",
//   onDelete, // callback to remove from parent
//   onEdit,
// }) => {
//   const displayName = companyName || "N/A";
//   const displayStatus = status?.toLowerCase() === "active" ? "Active" : "Pending";
//   const [isOpen, setIsOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [editData, setEditData] = useState({});
//   const [activeTab, setActiveTab] = useState("overview");
//   const [viewTab, setViewTab] = useState("overview");

//   const handleDelete = async () => {
//     console.log(_id);
    
//     if (!_id) return;
//     if (!window.confirm(`Are you sure you want to delete ${displayName}?`)) return;

//     try {
//       const res = await axios.delete(`http://localhost:4000/company/delete/${_id}`);
//       if (res.status === 200) {
//         alert("Company deleted successfully ✅");
//         if (onDelete) onDelete(_id);
//       }
//     } catch (error) {
//       console.error("Error deleting company:", error);
//       alert("Failed to delete company ❌");
//     }
//   };

//   const handleView =async (e) => {
//     e.preventDefault();
//     setIsOpen(true);
//   }

//   return (
//     <div 
//       className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Top Row with Status Badge */}
//       <div className="p-6 pb-4">
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center font-semibold overflow-hidden border border-blue-200">
//               {/* Show logo if available, otherwise initial letter */}
//               {logo ? (
//                 <img src={logo} alt={`${displayName} logo`} className="w-full h-full object-cover" />
//               ) : (
//                 <span className="text-xl font-bold text-blue-600">{displayName[0] || "?"}</span>
//               )}
//             </div>
//             <div className="flex-1">
//               <h2 className="font-bold text-gray-900 truncate text-sm">{displayName}</h2>
//               <p className="text-xs text-gray-500 mt-1">{industry || "Not specified"}</p>
//             </div>
//           </div>
//           <span
//             className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
//               displayStatus === "Active"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-amber-100 text-amber-700"
//             }`}
//           >
//             {displayStatus}
//           </span>
//         </div>

//         {/* Contact Info */}
//         <div className="space-y-2 mb-4">
//           <div className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors group/link">
//             <MdMail size={14} className="text-gray-400 group-hover/link:text-blue-600" />
//             <span className="truncate">{email || "No email"}</span>
//           </div>
//           <div className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors group/link">
//             <MdPhone size={14} className="text-gray-400 group-hover/link:text-blue-600" />
//             <span className="truncate">{phoneNumber || "No phone"}</span>
//           </div>
//           <div className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors group/link">
//             <MdLanguage size={14} className="text-gray-400 group-hover/link:text-blue-600" />
//             <span className="truncate">{website ? website.replace(/^https?:\/\//, "") : "No website"}</span>
//           </div>
//           <div className="flex items-center gap-2 text-xs text-gray-600">
//             <MdPeople size={14} className="text-gray-400" />
//             <span>{numberOfEmployees || 0} {numberOfEmployees === 1 ? "employee" : "employees"}</span>
//           </div>
//         </div>
//       </div>

//       {/* Divider */}
//       <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

//       {/* Deals & Value Section */}
//       <div className="p-6 pt-4 bg-gradient-to-br from-white to-gray-50">
//         <div className="grid grid-cols-2 gap-3 mb-4">
//           <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
//             <p className="font-bold text-lg text-blue-600">{deals}</p>
//             <p className="text-xs text-blue-600/70 font-medium">Deals</p>
//           </div>
//           <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
//             <p className="font-bold text-lg text-green-600">{value}</p>
//             <p className="text-xs text-green-600/70 font-medium">Value</p>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className={`flex gap-2 transition-all duration-300 ${
//           isHovered ? "opacity-100" : "opacity-80"
//         }`}>
//           <button
//             onClick={handleView}
//             title="View details"
//             className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center group/btn"
//           >
//             <MdVisibility size={16} className="group-hover/btn:scale-110 transition-transform" />
//           </button>
//           <button
//             onClick={() => {
//               setEditData({ _id, companyName, industry, status, email, phoneNumber, website, numberOfEmployees, address, deals, value, logo });
//               setIsEditOpen(true);
//             }}
//             title="Edit company"
//             className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-600 hover:text-amber-700 p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center group/btn"
//           >
//             <MdEdit size={16} className="group-hover/btn:scale-110 transition-transform" />
//           </button>
//           <button
//             onClick={handleDelete}
//             title="Delete company"
//             className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center group/btn"
//           >
//             <MdDelete size={16} className="group-hover/btn:scale-110 transition-transform" />
//           </button>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4">
//           <div className="bg-white w-full h-full max-w-none rounded-none overflow-auto">
//             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
//               <h3 className="text-xl font-bold text-white">Company Details</h3>
//               <button onClick={() => setIsOpen(false)} className="text-white text-2xl">×</button>
//             </div>
//             <div className="p-6">
//               <nav className="sticky top-16 z-30 bg-white flex items-center justify-between mb-4">
//                 <div className="flex gap-3 bg-white/80 backdrop-blur-lg rounded-full px-3 py-2 shadow-sm border border-gray-200">
//                   {[
//                     ["overview", "OVERVIEW"],
//                     ["our-offices", "OUR OFFICES"],
//                     ["statoury", "STATOURY"],
//                     ["admin", "ADMIN"],
//                     ["contact-details", "CONTACT DETAILS"],
//                   ].map(([key, label]) => (
//                     <button
//                       key={key}
//                       onClick={() => setViewTab(key)}
//                       className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${viewTab === key ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
//                     >
//                       {label}
//                       {viewTab === key && <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full" />}
//                     </button>
//                   ))}
//                 </div>
//               </nav>

//               <div>
//                 {viewTab === 'overview' && (
//                   <div className="space-y-6">
//                     {/* Company Header */}
//                     <div className="flex items-center gap-4">
//                       <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center font-bold text-2xl border border-blue-200 overflow-hidden">
//                         {logo ? (
//                           <img src={logo} alt={`${displayName} logo`} className="w-full h-full object-cover" />
//                         ) : (
//                           <span className="text-blue-600">{displayName[0] || "?"}</span>
//                         )}
//                       </div>
//                       <div>
//                         <h3 className="text-xl font-bold text-gray-900">{displayName}</h3>
//                         <p className="text-gray-600">{industry || "Not specified"}</p>
//                         <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${displayStatus === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
//                           {displayStatus}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Details Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                         <p className="text-gray-600 text-sm font-medium mb-2">Company Name</p>
//                         <p className="text-gray-900 font-semibold">{companyName || "N/A"}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                         <p className="text-gray-600 text-sm font-medium mb-2">Industry</p>
//                         <p className="text-gray-900 font-semibold">{industry || "N/A"}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 md:col-span-2">
//                         <p className="text-gray-600 text-sm font-medium mb-2">Address</p>
//                         <p className="text-gray-900 font-semibold">{address || "N/A"}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                         <p className="text-gray-600 text-sm font-medium mb-2">Number of Employees</p>
//                         <p className="text-gray-900 font-semibold">{numberOfEmployees || 0}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                         <p className="text-gray-600 text-sm font-medium mb-2">Status</p>
//                         <p className="text-gray-900 font-semibold">{status || "N/A"}</p>
//                       </div>
//                     </div>

//                     {/* Stats */}
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
//                         <p className="text-blue-600 text-sm font-medium mb-1">Total Deals</p>
//                         <p className="text-3xl font-bold text-blue-700">{deals}</p>
//                       </div>
//                       <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
//                         <p className="text-green-600 text-sm font-medium mb-1">Total Value</p>
//                         <p className="text-3xl font-bold text-green-700">{value}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {viewTab === 'our-offices' && (
//                   <div className="space-y-6">
//                     <div className="grid grid-cols-1 gap-6">
//                       <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 md:col-span-2">
//                         <p className="text-gray-600 text-sm font-medium mb-2">Website</p>
//                         <p className="text-blue-600 font-semibold break-all">{website || "N/A"}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {viewTab === 'statoury' && (
//                   <div className="text-center py-12 text-gray-500">
//                     <p className="text-sm">All company information available in Overview tab</p>
//                   </div>
//                 )}

//                 {viewTab === 'admin' && (
//                   <div className="text-center py-12 text-gray-500">
//                     <p className="text-sm">All company information available in Overview tab</p>
//                   </div>
//                 )}

//                 {viewTab === 'contact-details' && (
//                   <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                         <p className="text-gray-600 text-sm font-medium mb-2">Email Address</p>
//                         <p className="text-gray-900 font-semibold break-all">{email || "N/A"}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                         <p className="text-gray-600 text-sm font-medium mb-2">Phone Number</p>
//                         <p className="text-gray-900 font-semibold">{phoneNumber || "N/A"}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-end gap-3 mt-6">
//                 <button onClick={() => setIsOpen(false)} className="px-6 py-3 bg-gray-200 rounded-lg">Close</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal (Full screen) */}
//       {isEditOpen && (
//         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4">
//           <div className="bg-white w-full h-full max-w-none rounded-none overflow-auto">
//             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
//               <h3 className="text-xl font-bold text-white">Edit Company</h3>
//               <button onClick={() => setIsEditOpen(false)} className="text-white text-2xl">×</button>
//             </div>
//             <div className="p-6">
//               <nav className="sticky top-16 z-30 bg-white flex items-center justify-between mb-4">
//                 <div className="flex gap-3 bg-white/80 backdrop-blur-lg rounded-full px-3 py-2 shadow-sm border border-gray-200">
//                   {[
//                     ["overview", "OVERVIEW"],
//                     ["our-offices", "OUR OFFICES"],
//                     ["statoury", "STATOURY"],
//                     ["admin", "ADMIN"],
//                     ["contact-details", "CONTACT DETAILS"],
//                   ].map(([key, label]) => (
//                     <button
//                       key={key}
//                       onClick={() => setActiveTab(key)}
//                       className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeTab === key ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
//                     >
//                       {label}
//                       {activeTab === key && <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full" />}
//                     </button>
//                   ))}
//                 </div>
//               </nav>

//               <div>
//                 {activeTab === 'overview' && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Company Name */}
//                     <div>
//                       <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
//                       <input
//                         id="companyName"
//                         type="text"
//                         value={editData.companyName || ''}
//                         onChange={(e) => setEditData(d => ({...d, companyName: e.target.value}))}
//                         placeholder="Tech Corp Solutions"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>

//                     {/* Industry */}
//                     <div>
//                       <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">Industry *</label>
//                       <select
//                         id="industry"
//                         value={editData.industry || ''}
//                         onChange={(e) => setEditData(d => ({...d, industry: e.target.value}))}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="">Select industry</option>
//                         {["Technology", "Manufacturing", "Finance", "Healthcare", "Retail", "Consulting"].map((ind, idx) => (
//                           <option key={idx} value={ind}>{ind}</option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Email */}
//                     <div>
//                       <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
//                       <input
//                         id="email"
//                         type="email"
//                         value={editData.email || ''}
//                         onChange={(e) => setEditData(d => ({...d, email: e.target.value}))}
//                         placeholder="contact@company.com"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>

//                     {/* Phone */}
//                     <div>
//                       <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
//                       <input
//                         id="phone"
//                         type="text"
//                         value={editData.phoneNumber || ''}
//                         onChange={(e) => setEditData(d => ({...d, phoneNumber: e.target.value}))}
//                         placeholder="+1 (555) 123-4567"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>

//                     {/* Website (col-span-2) */}
//                     <div className="md:col-span-2">
//                       <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">Website *</label>
//                       <input
//                         id="website"
//                         type="text"
//                         value={editData.website || ''}
//                         onChange={(e) => setEditData(d => ({...d, website: e.target.value}))}
//                         placeholder="www.company.com"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>

//                     {/* Address (col-span-2) */}
//                     <div className="md:col-span-2">
//                       <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
//                       <input
//                         id="address"
//                         type="text"
//                         value={editData.address || ''}
//                         onChange={(e) => setEditData(d => ({...d, address: e.target.value}))}
//                         placeholder="123 Business Street, City, State ZIP"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>

//                     {/* Employees */}
//                     <div>
//                       <label htmlFor="employees" className="block text-sm font-semibold text-gray-700 mb-2">Number of Employees *</label>
//                       <input
//                         id="employees"
//                         type="number"
//                         value={editData.numberOfEmployees || ''}
//                         onChange={(e) => setEditData(d => ({...d, numberOfEmployees: e.target.value}))}
//                         placeholder="100"
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>

//                     {/* Status */}
//                     <div>
//                       <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
//                       <select
//                         id="status"
//                         value={editData.status || ''}
//                         onChange={(e) => setEditData(d => ({...d, status: e.target.value}))}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="">Select status</option>
//                         {["Active", "Pending", "Inactive"].map((s, idx) => (
//                           <option key={idx} value={s}>{s}</option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Logo Upload */}
//                     <div>
//                       <label htmlFor="logo" className="block text-sm font-semibold text-gray-700 mb-2">Company Logo</label>
//                       <input
//                         id="logo"
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => {
//                           const file = e.target.files && e.target.files[0];
//                           if (file) {
//                             const reader = new FileReader();
//                             reader.onload = (evt) => setEditData(d => ({...d, logoPreview: evt.target.result}));
//                             reader.readAsDataURL(file);
//                             setEditData(d => ({...d, logoFile: file}));
//                           }
//                         }}
//                         className="w-full"
//                       />
//                       {(editData.logoPreview || editData.logo) && (
//                         <div className="mt-2">
//                           <img src={editData.logoPreview || editData.logo} alt="logo preview" className="h-20 w-20 object-cover rounded-md" />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {activeTab === 'our-offices' && (
//                   <div className="text-center py-12 text-gray-500">
//                     <p className="text-sm">All company fields are available in the Overview tab</p>
//                   </div>
//                 )}

//                 {activeTab === 'statoury' && (
//                   <div className="text-center py-12 text-gray-500">
//                     <p className="text-sm">All company fields are available in the Overview tab</p>
//                   </div>
//                 )}

//                 {activeTab === 'admin' && (
//                   <div className="text-center py-12 text-gray-500">
//                     <p className="text-sm">All company fields are available in the Overview tab</p>
//                   </div>
//                 )}

//                 {activeTab === 'contact-details' && (
//                   <div className="text-center py-12 text-gray-500">
//                     <p className="text-sm">All company fields are available in the Overview tab</p>
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-end gap-3 mt-6">
//                 <button onClick={() => setIsEditOpen(false)} className="px-6 py-3 bg-gray-200 rounded-lg">Cancel</button>
//                 <button onClick={() => { if(onEdit) onEdit(editData); setIsEditOpen(false); }} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Save</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyCard;


// import { Mail, Phone, Globe, Users, Eye, Edit, Trash2 } from "lucide-react";
// import axios from "axios";
// import { useState } from "react";

// const CompanyCard = ({
//   _id,
//   companyName,
//   industry,
//   status,
//   email,
//   phoneNumber,
//   website,
//   logo,
//   numberOfEmployees,
//   deals = 0,
//   value = "$0",
//   onDelete, // callback to remove from parent
//   onEdit,
// }) => {
//   const displayName = companyName || "N/A";
//   const displayStatus = status?.toLowerCase() === "active" ? "Active" : "Pending";
//   const [isOpen, setIsOpen] = useState(false);

//   const handleDelete = async () => {
//     console.log(_id);
    
//     if (!_id) return;
//     if (!window.confirm(`Are you sure you want to delete ${displayName}?`)) return;

//     try {
//       const res = await axios.delete(`http://localhost:4000/company/delete/${_id}`);
//       if (res.status === 200) {
//         alert("Company deleted successfully ✅");
//         if (onDelete) onDelete(_id);
//       }
//     } catch (error) {
//       console.error("Error deleting company:", error);
//       alert("Failed to delete company ❌");
//     }
//   };

//   const handleView =async (e) => {
//     e.preventDefault();
//     setIsOpen(true);
//   }

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-6 w-80 hover:shadow-lg transition-shadow duration-200">
//       {/* Top Row */}
//       <div className="flex justify-between items-center mb-2">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold overflow-hidden">
//             {/* Show logo if available, otherwise initial letter */}
//             {logo ? (
//               <img src={logo} alt={`${displayName} logo`} className="w-full h-full object-cover" />
//             ) : (
//               displayName[0] || "?"
//             )}
//           </div>
//           <div>
//             <h2 className="font-semibold text-gray-900">{displayName}</h2>
//             <p className="text-sm text-gray-400">{industry || "N/A"}</p>
//           </div>
//         </div>
//         <span
//           className={`px-3 py-1 rounded-full text-xs font-semibold ${
//             displayStatus === "Active"
//               ? "bg-[#00c951] text-white"
//               : "bg-[#f0b100] text-gray-900"
//           }`}
//         >
//           {displayStatus}
//         </span>
//       </div>

//       {/* Contact Info */}
//       <div className="my-4 text-gray-600 text-sm space-y-1">
//         <div className="flex items-center gap-1">
//           <Mail size={15} /> <span>{email || "N/A"}</span>
//         </div>
//         <div className="flex items-center gap-1">
//           <Phone size={15} /> <span>{phoneNumber || "N/A"}</span>
//         </div>
//         <div className="flex items-center gap-1">
//           <Globe size={15} /> <span>{website || "N/A"}</span>
//         </div>
//         <div className="flex items-center gap-1">
//           <Users size={15} /> <span>{numberOfEmployees || 0} employees</span>
//         </div>
//       </div>

//       <hr className="my-3" />

//       {/* Deals & Value */}
//       <div className="flex justify-between items-end">
//         <div>
//           <p className="font-semibold text-lg text-gray-700">{deals}</p>
//           <p className="text-xs text-gray-400">Deals</p>
//         </div>
//         <div className="text-center">
//           <p className="font-semibold text-lg text-green-600">{value}</p>
//           <p className="text-xs text-gray-400">Value</p>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end gap-2 mt-3">
//         <button
//         onClick={handleView}
//          className="text-gray-500 hover:bg-gray-200 p-2 rounded-sm">
//           <Eye size={15} />
//         </button>
//         <button
//           onClick={() => onEdit && onEdit({ _id, companyName, industry, status, email, phoneNumber, website, numberOfEmployees, deals, value })}
//           className="text-gray-500 hover:bg-gray-200 p-2 rounded-sm"
//         >
//           <Edit size={15} />
//         </button>
//         <button
//           onClick={handleDelete}
//           className="text-red-500 hover:bg-gray-200 p-2 rounded-sm"
//         >
//           <Trash2 size={15} />
//         </button>
//       </div>

//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96 relative">
//             <h2 className="text-lg font-semibold mb-4">Company Details</h2>
//             <p className="mb-2"><strong>Company Name:</strong> {displayName}</p>
//             <p className="mb-2"><strong>Industry:</strong> {industry || "N/A"}</p>
//             <p className="mb-2"><strong>Email:</strong> {email || "N/A"}</p>
//             <p className="mb-2"><strong>Phone Number:</strong> {phoneNumber || "N/A"}</p>
//             <p className="mb-2"><strong>Website:</strong> {website || "N/A"}</p>
//             <p className="mb-2"><strong>Number of Employees:</strong> {numberOfEmployees || 0}</p>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyCard;



import axios from "axios";
import { useState, useEffect } from "react";
import { MdMail, MdPhone, MdLanguage, MdPeople, MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import PropTypes from 'prop-types';

const CompanyCard = ({
  _id,
  companyName,
  industry,
  status,
  email,
  phoneNumber,
  website,
  logo,
  address,
  numberOfEmployees,
  deals = 0,
  value = "$0",
  onDelete, // callback to remove from parent
  onEdit,
}) => {
  const displayName = companyName || "N/A";
  const displayStatus = status?.toLowerCase() === "active" ? "Active" : "Pending";
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [viewTab, setViewTab] = useState("overview");
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [adminsError, setAdminsError] = useState(null);

  useEffect(() => {
    const fetchAdminsForCompany = async () => {
      if (viewTab !== "admin") return;
      setLoadingAdmins(true);
      setAdminsError(null);
      try {
        const res = await axios.get("http://localhost:4000/getAdmins");
        const allAdmins = res.data || [];
        const filtered = allAdmins.filter((a) => {
          try {
            // admin.company may be array of ids
            if (Array.isArray(a.company) && a.company.some((c) => String(c) === String(_id))) return true;
            // assignedRoles may contain companyIds
            if (Array.isArray(a.assignedRoles)) {
              return a.assignedRoles.some((ar) => Array.isArray(ar.companyIds) && ar.companyIds.some((cid) => String(cid) === String(_id)));
            }
            return false;
          } catch (e) {
            return false;
          }
        });
        setAdmins(filtered);
      } catch (error) {
        console.error("Error fetching admins:", error);
        setAdminsError(error?.message || "Failed to load admins");
      } finally {
        setLoadingAdmins(false);
      }
    };

    fetchAdminsForCompany();
  }, [viewTab, _id]);

  const handleDelete = async () => {
    console.log(_id);
    
    if (!_id) return;
    if (!window.confirm(`Are you sure you want to delete ${displayName}?`)) return;

    try {
      const res = await axios.delete(`http://localhost:4000/company/delete/${_id}`);
      if (res.status === 200) {
        alert("Company deleted successfully ✅");
        if (onDelete) onDelete(_id);
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      alert("Failed to delete company ❌");
    }
  };

  const handleView =async (e) => {
    e.preventDefault();
    setIsOpen(true);
  }

  return (
    <div 
      className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Row with Status Badge */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center font-semibold overflow-hidden border border-blue-200">
              {/* Show logo if available, otherwise initial letter */}
              {logo ? (
                <img src={logo} alt={`${displayName} logo`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-blue-600">{displayName[0] || "?"}</span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 truncate text-sm">{displayName}</h2>
              <p className="text-xs text-gray-500 mt-1">{industry || "Not specified"}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
              displayStatus === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {displayStatus}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors group/link">
            <MdMail size={14} className="text-gray-400 group-hover/link:text-blue-600" />
            <span className="truncate">{email || "No email"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors group/link">
            <MdPhone size={14} className="text-gray-400 group-hover/link:text-blue-600" />
            <span className="truncate">{phoneNumber || "No phone"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors group/link">
            <MdLanguage size={14} className="text-gray-400 group-hover/link:text-blue-600" />
            <span className="truncate">{website ? website.replace(/^https?:\/\//, "") : "No website"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MdPeople size={14} className="text-gray-400" />
            <span>{numberOfEmployees || 0} {numberOfEmployees === 1 ? "employee" : "employees"}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      {/* Deals & Value Section */}
      <div className="p-6 pt-4 bg-gradient-to-br from-white to-gray-50">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
            <p className="font-bold text-lg text-blue-600">{deals}</p>
            <p className="text-xs text-blue-600/70 font-medium">Deals</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
            <p className="font-bold text-lg text-green-600">{value}</p>
            <p className="text-xs text-green-600/70 font-medium">Value</p>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex gap-2 transition-all duration-300 ${
          isHovered ? "opacity-100" : "opacity-80"
        }`}>
          <button
            onClick={handleView}
            title="View details"
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center group/btn"
          >
            <MdVisibility size={16} className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => {
              setEditData({ _id, companyName, industry, status, email, phoneNumber, website, numberOfEmployees, address, deals, value, logo });
              setIsEditOpen(true);
            }}
            title="Edit company"
            className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-600 hover:text-amber-700 p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center group/btn"
          >
            <MdEdit size={16} className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleDelete}
            title="Delete company"
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center group/btn"
          >
            <MdDelete size={16} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4">
          <div className="bg-white w-full h-full max-w-none rounded-none overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Company Details</h3>
              <button onClick={() => setIsOpen(false)} className="text-white text-2xl">×</button>
            </div>
            <div className="p-6">
              <nav className="sticky top-16 z-30 bg-white flex items-center justify-between mb-4">
                <div className="flex gap-3 bg-white/80 backdrop-blur-lg rounded-full px-3 py-2 shadow-sm border border-gray-200">
                  {[
                    ["overview", "OVERVIEW"],
                    ["our-offices", "OUR OFFICES"],
                    ["statoury", "STATOURY"],
                    ["admin", "ADMIN"],
                    ["contact-details", "CONTACT DETAILS"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setViewTab(key)}
                      className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${viewTab === key ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                    >
                      {label}
                      {viewTab === key && <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full" />}
                    </button>
                  ))}
                </div>
              </nav>

              <div>
                {viewTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Company Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center font-bold text-2xl border border-blue-200 overflow-hidden">
                        {logo ? (
                          <img src={logo} alt={`${displayName} logo`} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-blue-600">{displayName[0] || "?"}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{displayName}</h3>
                        <p className="text-gray-600">{industry || "Not specified"}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${displayStatus === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                          {displayStatus}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600 text-sm font-medium mb-2">Company Name</p>
                        <p className="text-gray-900 font-semibold">{companyName || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600 text-sm font-medium mb-2">Industry</p>
                        <p className="text-gray-900 font-semibold">{industry || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 md:col-span-2">
                        <p className="text-gray-600 text-sm font-medium mb-2">Address</p>
                        <p className="text-gray-900 font-semibold">{address || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600 text-sm font-medium mb-2">Number of Employees</p>
                        <p className="text-gray-900 font-semibold">{numberOfEmployees || 0}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600 text-sm font-medium mb-2">Status</p>
                        <p className="text-gray-900 font-semibold">{status || "N/A"}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
                        <p className="text-blue-600 text-sm font-medium mb-1">Total Deals</p>
                        <p className="text-3xl font-bold text-blue-700">{deals}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                        <p className="text-green-600 text-sm font-medium mb-1">Total Value</p>
                        <p className="text-3xl font-bold text-green-700">{value}</p>
                      </div>
                    </div>
                  </div>
                )}

                {viewTab === 'our-offices' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 md:col-span-2">
                        <p className="text-gray-600 text-sm font-medium mb-2">Website</p>
                        <p className="text-blue-600 font-semibold break-all">{website || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {viewTab === 'statoury' && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">All company information available in Overview tab</p>
                  </div>
                )}

                {viewTab === 'admin' && (
                  <div className="space-y-4">
                    {loadingAdmins ? (
                      <div className="text-sm text-gray-500">Loading admins...</div>
                    ) : adminsError ? (
                      <div className="text-sm text-red-500">Error loading admins</div>
                    ) : admins.length === 0 ? (
                      <div className="text-sm text-gray-500">No admins found for this company.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {admins.map((a) => (
                          <div key={a._id} className="p-3 border rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-800">{a.fullName || '—'}</p>
                                <p className="text-xs text-gray-500">{a.email || '—'}</p>
                                <p className="text-xs text-gray-500">{a.phone || '—'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {viewTab === 'contact-details' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600 text-sm font-medium mb-2">Email Address</p>
                        <p className="text-gray-900 font-semibold break-all">{email || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600 text-sm font-medium mb-2">Phone Number</p>
                        <p className="text-gray-900 font-semibold">{phoneNumber || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIsOpen(false)} className="px-6 py-3 bg-gray-200 rounded-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (Full screen) */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4">
          <div className="bg-white w-full h-full max-w-none rounded-none overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Edit Company</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-white text-2xl">×</button>
            </div>
            <div className="p-6">
              <nav className="sticky top-16 z-30 bg-white flex items-center justify-between mb-4">
                <div className="flex gap-3 bg-white/80 backdrop-blur-lg rounded-full px-3 py-2 shadow-sm border border-gray-200">
                  {[
                    ["overview", "OVERVIEW"],
                    ["our-offices", "OUR OFFICES"],
                    ["statoury", "STATOURY"],
                    ["admin", "ADMIN"],
                    ["contact-details", "CONTACT DETAILS"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeTab === key ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                    >
                      {label}
                      {activeTab === key && <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full" />}
                    </button>
                  ))}
                </div>
              </nav>

              <div>
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                      <input
                        id="companyName"
                        type="text"
                        value={editData.companyName || ''}
                        onChange={(e) => setEditData(d => ({...d, companyName: e.target.value}))}
                        placeholder="Tech Corp Solutions"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Industry */}
                    <div>
                      <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">Industry *</label>
                      <select
                        id="industry"
                        value={editData.industry || ''}
                        onChange={(e) => setEditData(d => ({...d, industry: e.target.value}))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select industry</option>
                        {["Technology", "Manufacturing", "Finance", "Healthcare", "Retail", "Consulting"].map((ind, idx) => (
                          <option key={idx} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input
                        id="email"
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => setEditData(d => ({...d, email: e.target.value}))}
                        placeholder="contact@company.com"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                      <input
                        id="phone"
                        type="text"
                        value={editData.phoneNumber || ''}
                        onChange={(e) => setEditData(d => ({...d, phoneNumber: e.target.value}))}
                        placeholder="+1 (555) 123-4567"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Website (col-span-2) */}
                    <div className="md:col-span-2">
                      <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">Website *</label>
                      <input
                        id="website"
                        type="text"
                        value={editData.website || ''}
                        onChange={(e) => setEditData(d => ({...d, website: e.target.value}))}
                        placeholder="www.company.com"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Address (col-span-2) */}
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                      <input
                        id="address"
                        type="text"
                        value={editData.address || ''}
                        onChange={(e) => setEditData(d => ({...d, address: e.target.value}))}
                        placeholder="123 Business Street, City, State ZIP"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Employees */}
                    <div>
                      <label htmlFor="employees" className="block text-sm font-semibold text-gray-700 mb-2">Number of Employees *</label>
                      <input
                        id="employees"
                        type="number"
                        value={editData.numberOfEmployees || ''}
                        onChange={(e) => setEditData(d => ({...d, numberOfEmployees: e.target.value}))}
                        placeholder="100"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                      <select
                        id="status"
                        value={editData.status || ''}
                        onChange={(e) => setEditData(d => ({...d, status: e.target.value}))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select status</option>
                        {["Active", "Pending", "Inactive"].map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Logo Upload */}
                    <div>
                      <label htmlFor="logo" className="block text-sm font-semibold text-gray-700 mb-2">Company Logo</label>
                      <input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => setEditData(d => ({...d, logoPreview: evt.target.result}));
                            reader.readAsDataURL(file);
                            setEditData(d => ({...d, logoFile: file}));
                          }
                        }}
                        className="w-full"
                      />
                      {(editData.logoPreview || editData.logo) && (
                        <div className="mt-2">
                          <img src={editData.logoPreview || editData.logo} alt="logo preview" className="h-20 w-20 object-cover rounded-md" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'our-offices' && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">All company fields are available in the Overview tab</p>
                  </div>
                )}

                {activeTab === 'statoury' && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">All company fields are available in the Overview tab</p>
                  </div>
                )}

                {activeTab === 'admin' && (
                  <div className="space-y-4">
                    {/* Fetch and display all admins with checkboxes to assign this company */}
                    <AdminAssignSection
                      companyId={_id}
                      editData={editData}
                      setEditData={setEditData}
                    />
                  </div>
                )}

                {activeTab === 'contact-details' && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">All company fields are available in the Overview tab</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIsEditOpen(false)} className="px-6 py-3 bg-gray-200 rounded-lg">Cancel</button>
                <button onClick={() => { if(onEdit) onEdit(editData); setIsEditOpen(false); }} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;

// AdminAssignSection component
function AdminAssignSection({ companyId, editData, setEditData }) {
  const [allAdmins, setAllAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:4000/getAdmins');
        const admins = res.data || [];
        setAllAdmins(admins);
        // preselect admins that already have this company
        const pre = new Set();
        admins.forEach(a => {
          try {
            if (Array.isArray(a.company) && a.company.some(c => String(c) === String(companyId))) pre.add(a._id);
            if (Array.isArray(a.assignedRoles) && a.assignedRoles.some(ar => Array.isArray(ar.companyIds) && ar.companyIds.some(cid => String(cid) === String(companyId)))) pre.add(a._id);
          } catch (e) { }
        });
        setSelected(pre);
      } catch (e) {
        console.error('Failed to load admins', e);
        setError(e.message || 'Failed to load admins');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [companyId]);

  const toggle = (id) => {
    setSelected(s => {
      const copy = new Set(s);
      if (copy.has(id)) copy.delete(id); else copy.add(id);
      return copy;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      // For each admin, if selected add company; if not selected remove it
      const promises = [];
      for (const admin of allAdmins) {
        const shouldHave = selected.has(admin._id);
        const has = Array.isArray(admin.company) && admin.company.some(c => String(c) === String(companyId));
        if (shouldHave && !has) {
          // assign company to admin (post assigns array)
          promises.push(axios.post('http://localhost:4000/assign', { adminId: admin._id, companyIds: [companyId] }));
        }
        if (!shouldHave && has) {
          // remove company: send assign with remaining companyIds
          const remaining = (admin.company || []).filter(c => String(c) !== String(companyId));
          promises.push(axios.post('http://localhost:4000/assign', { adminId: admin._id, companyIds: remaining }));
        }
      }
      await Promise.all(promises);
      // refresh list
      const res = await axios.get('http://localhost:4000/getAdmins');
      const admins = res.data || [];
      setAllAdmins(admins);
      // update editData.company for parent if needed
      setEditData(d => ({ ...d, companyAssignedCount: Array.from(selected).length }));
      alert('Admin assignments updated');
    } catch (e) {
      console.error(e);
      alert('Failed to save assignments');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {loading ? <div className="text-sm text-gray-500">Loading admins...</div> : error ? <div className="text-sm text-red-500">{error}</div> : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {allAdmins.map(a => (
              <label key={a._id} className="flex items-center gap-3 p-2 border rounded-lg">
                <input type="checkbox" checked={selected.has(a._id)} onChange={() => toggle(a._id)} />
                <div>
                  <div className="font-semibold text-sm">{a.fullName}</div>
                  <div className="text-xs text-gray-500">{a.email}</div>
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Saving...' : 'Save Assignments'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

AdminAssignSection.propTypes = {
  companyId: PropTypes.string,
  editData: PropTypes.object,
  setEditData: PropTypes.func,
};