// import { useState, useEffect, useRef } from "react";
// import { Edit2, Eye, X, AlertCircle } from "lucide-react";
// import DestinationSearchBox from "../../components/DestinationSearchBox";
// import { findEmployeeByDestination } from "../../utils/destinationRouting";

// const tripDurations = [
//   "1n/2d","2n/3d","3n/4d","4n/5d","5n/6d","6n/7d","7n/8d","8n/9d","9n/10d",
//   "10n/11d","11n/12d","12n/13d","13n/14d","14n/15d","Others"
// ];

// const leadSources = [
//   "Cold Call", "Website", "Referral", "LinkedIn", "Trade Show",
//   "Email Campaign", "Social Media", "Event", "Organic Search", "Paid Ads",
// ];
// const leadTypes = ["International", "Domestic"];
// const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
// const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];

// // Modal Component
// const Modal = ({ isOpen, onClose, size = "large", children }) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
//       <div
//         className={`bg-white rounded-lg shadow-lg ${size === "large" ? "w-full max-w-4xl" : "w-full max-w-md"} max-h-[95vh] overflow-hidden`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {children}
//       </div>
//     </div>
//   );
// };

// // Input Field Component
// const InputField = ({ name, type = "text", placeholder, required, value, error, onChange }) => (
//   <div className="h-[4.5rem]">
//     <label className="block text-xs font-medium text-gray-700 mb-0.5">
//       {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value || ""}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
//         error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
//       }`}
//       autoComplete="off"
//     />
//     {error && (
//       <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
//         <AlertCircle className="w-3 h-3" /> {error}
//       </p>
//     )}
//   </div>
// );

// // Select Field Component
// const SelectField = ({ name, options, required, value, error, onChange }) => (
//   <div className="h-[4.5rem]">
//     <label className="block text-xs font-medium text-gray-700 mb-0.5">
//       {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
//     </label>
//     <select
//       name={name}
//       value={value || ""}
//       onChange={onChange}
//       className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
//         error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
//       }`}
//     >
//       <option value="">Select {name}</option>
//       {options.map((opt) => (
//         <option key={opt}>{opt}</option>
//       ))}
//     </select>
//     {error && (
//       <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
//         <AlertCircle className="w-3 h-3" /> {error}
//       </p>
//     )}
//   </div>
// );

// // Edit Lead Form Component
// const EditLeadForm = ({ initialData, onSubmit, onClose }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     whatsAppNo: "",
//     departureCity: "",
//     destination: "",
//     expectedTravelDate: "",
//     noOfDays: "",
//     customNoOfDays: "",
//     placesToCover: "",
//     placesToCoverArray: [],
//     noOfPerson: "",
//     noOfChild: "",
//     childAges: [],
//     groupNumber: "",
//     leadSource: "",
//     leadType: "",
//     tripType: "",
//     leadStatus: "Hot",
//     notes: "",
//     ...initialData,
//     placesToCoverArray: initialData?.placesToCoverArray || (initialData?.placesToCover ? initialData.placesToCover.split(", ").map(p => p.trim()) : []),
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   useEffect(() => {
//     setFormData({
//       name: "",
//       email: "",
//       phone: "",
//       whatsAppNo: "",
//       departureCity: "",
//       destination: "",
//       expectedTravelDate: "",
//       noOfDays: "",
//       customNoOfDays: "",
//       placesToCover: "",
//       placesToCoverArray: initialData?.placesToCoverArray || (initialData?.placesToCover ? initialData.placesToCover.split(", ").map(p => p.trim()) : []),
//       noOfPerson: "",
//       noOfChild: "",
//       childAges: [],
//       groupNumber: "",
//       leadSource: "",
//       leadType: "",
//       tripType: "",
//       leadStatus: "Hot",
//       notes: "",
//       ...initialData,
//     });
//   }, [initialData]);

//   const validate = (data) => {
//     const newErrors = {};
//     if (!data.phone || data.phone.trim() === "") newErrors.phone = "Phone is required";
//     return newErrors;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleChildAgeChange = (index, value) => {
//     const ages = [...formData.childAges];
//     ages[index] = value;
//     setFormData((prev) => ({ ...prev, childAges: ages }));
//   };

//   const addChildAge = () => setFormData((prev) => ({ ...prev, childAges: [...prev.childAges, ""] }));

//   const removeChildAge = (index) => {
//     const ages = [...formData.childAges];
//     ages.splice(index, 1);
//     setFormData((prev) => ({ ...prev, childAges: ages }));
//   };

//   const handleAddPlace = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const place = e.target.value.trim();
//       if (!place) return;

//       const currentPlaces = formData.placesToCoverArray || [];
//       if (!currentPlaces.includes(place)) {
//         setFormData((prev) => ({
//           ...prev,
//           placesToCoverArray: [...currentPlaces, place],
//         }));
//       }
//       e.target.value = "";
//     }
//   };

//   const removePlace = (index) => {
//     const updatedPlaces = [...(formData.placesToCoverArray || [])];
//     updatedPlaces.splice(index, 1);
//     setFormData((prev) => ({ ...prev, placesToCoverArray: updatedPlaces }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = validate(formData);
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;

//     const payload = {
//       ...formData,
//       placesToCover: (formData.placesToCoverArray || []).join(", "),
//     };

//     setIsSubmitting(true);
//     setApiError("");
//     try {
//       await onSubmit(payload);
//       setSubmitSuccess(true);
//       setTimeout(() => {
//         setSubmitSuccess(false);
//         onClose();
//       }, 1500);
//     } catch (err) {
//       setApiError(err.message || "Failed to save lead");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-3">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         <InputField name="name" value={formData.name} onChange={handleChange} />
//         <InputField name="email" type="email" value={formData.email} onChange={handleChange} />
//         <InputField name="phone" value={formData.phone} onChange={handleChange} required error={errors.phone} />
//         <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
//         <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} />
//         <DestinationSearchBox
//           name="destination"
//           value={formData.destination}
//           onChange={handleChange}
//           placeholder="Search destination..."
//           error={errors.destination}
//         />
//         <InputField name="expectedTravelDate" type="date" value={formData.expectedTravelDate} onChange={handleChange} />
//         <SelectField name="noOfDays" options={tripDurations} value={formData.noOfDays} onChange={handleChange} />
//         {formData.noOfDays === "Others" && (
//           <InputField name="customNoOfDays" placeholder="Enter custom duration" value={formData.customNoOfDays || ""} onChange={handleChange} />
//         )}

//         {/* Multi-place input */}
//         <div className="col-span-2">
//           <label className="block text-xs font-medium text-gray-700 mb-0.5">Places to Cover</label>
//           <div className="flex flex-wrap gap-1 mb-1">
//             {(formData.placesToCoverArray || []).map((place, idx) => (
//               <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1 text-sm">
//                 {place}
//                 <button type="button" onClick={() => removePlace(idx)}>x</button>
//               </span>
//             ))}
//           </div>
//           <input
//             type="text"
//             placeholder="Type a place and press Enter"
//             onKeyDown={handleAddPlace}
//             className="w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         <InputField name="noOfPerson" type="number" value={formData.noOfPerson} onChange={handleChange} />
//         <InputField name="noOfChild" type="number" value={formData.noOfChild} onChange={handleChange} />
//         <InputField name="groupNumber" type="text" value={formData.groupNumber} onChange={handleChange} />

//         {/* Child Ages */}
//         <div className="col-span-2">
//           <label className="block text-xs font-medium text-gray-700 mb-0.5">Child Ages</label>
//           {formData.childAges.map((age, idx) => (
//             <div key={idx} className="flex gap-2 mb-1">
//               <input type="number" value={age} onChange={(e) => handleChildAgeChange(idx, e.target.value)} placeholder="Child Age" className="w-full px-3 py-1.5 border rounded-lg text-sm" />
//               <button type="button" onClick={() => removeChildAge(idx)} className="bg-red-100 px-2 rounded hover:bg-red-200">X</button>
//             </div>
//           ))}
//           <button type="button" onClick={addChildAge} className="mt-1 text-blue-600 hover:underline text-sm">+ Add Child Age</button>
//         </div>

//         <SelectField name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} />
//         <SelectField name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} />
//         <SelectField name="tripType" options={tripTypes} value={formData.tripType} onChange={handleChange} />
//         <SelectField name="leadStatus" options={leadStatuses} value={formData.leadStatus} onChange={handleChange} />
//       </div>

//       <div className="mt-2">
//         <label className="block text-xs font-medium text-gray-700 mb-0.5">Notes</label>
//         <textarea
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//           rows="3"
//           placeholder="Add any notes or remarks..."
//           className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
//         ></textarea>
//       </div>

//       <div className="mt-3 flex gap-2">
//         <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
//           {isSubmitting ? "Saving..." : "Save Lead"}
//         </button>
//         <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
//           Cancel
//         </button>
//       </div>
//       {apiError && <p className="text-red-600 mt-2">{apiError}</p>}
//       {submitSuccess && <p className="text-green-600 mt-2">Lead saved successfully!</p>}
//     </form>
//   );
// };

// export default function MyAssignedLeads() {
//   const [assignedLeads, setAssignedLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [viewLead, setViewLead] = useState(null);
//   const [editLead, setEditLead] = useState(null);
//   const pageSize = 100;
//   const selectAllRef = useRef(null);

//   // Get current employee ID from localStorage or session
//   const getCurrentEmployeeId = () => {
//     try {
//       const userData = localStorage.getItem("user");
//       if (userData) {
//         const user = JSON.parse(userData);
//         return user._id || user.id;
//       }
//     } catch (err) {
//       console.error("Error retrieving employee ID:", err);
//     }
//     return null;
//   };

//   const employeeId = getCurrentEmployeeId();

//   // Fetch assigned leads for current employee
//   useEffect(() => {
//     const fetchMyAssignedLeads = async () => {
//       setLoading(true);
//       if (!employeeId) {
//         console.error("No employee ID found");
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(`http://localhost:4000/assignlead/${employeeId}`);
//         const data = await res.json();
//         if (res.ok) {
//           const arr = data.data || [];
//           setAssignedLeads(arr);
//           setCurrentPage(1);
//         } else {
//           console.error("Failed to fetch assigned leads:", data.message);
//           setAssignedLeads([]);
//         }
//       } catch (err) {
//         console.error("Error fetching assigned leads:", err);
//         setAssignedLeads([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMyAssignedLeads();
//   }, []);

//   // Adjust page if length changes and current page becomes out of range
//   useEffect(() => {
//     const totalPages = Math.max(1, Math.ceil((assignedLeads && assignedLeads.length) / pageSize));
//     if (currentPage > totalPages) setCurrentPage(totalPages);
//   }, [assignedLeads, currentPage]);

//   // Handle lead checkbox toggle
//   const handleLeadCheck = (leadId) => {
//     setSelectedLeads((prev) =>
//       prev.includes(leadId)
//         ? prev.filter((id) => id !== leadId)
//         : [...prev, leadId]
//     );
//   };

//   // Compute visible page items
//   const visibleLeads = (assignedLeads || []).slice((currentPage - 1) * pageSize, currentPage * pageSize);

//   // Select-all handler for visible page items
//   const handleSelectAllVisible = () => {
//     const ids = visibleLeads.map((l) => String(l._id));
//     if (ids.length === 0) return;
//     const allSelected = ids.every((id) => selectedLeads.map(String).includes(id));
//     if (allSelected) {
//       setSelectedLeads((prev) => prev.filter((id) => !ids.includes(String(id))));
//     } else {
//       setSelectedLeads((prev) => Array.from(new Set([...(prev || []).map(String), ...ids])));
//     }
//   };

//   // Maintain indeterminate state for header checkbox
//   const allVisibleSelected = visibleLeads.length > 0 && visibleLeads.every((l) => selectedLeads.map(String).includes(String(l._id)));
//   const someVisibleSelected = visibleLeads.some((l) => selectedLeads.map(String).includes(String(l._id)));
//   useEffect(() => {
//     if (selectAllRef.current) {
//       selectAllRef.current.indeterminate = someVisibleSelected && !allVisibleSelected;
//     }
//   }, [someVisibleSelected, allVisibleSelected]);

//   const handleView = (lead) => setViewLead(lead);
//   const handleEdit = (lead) => setEditLead(lead);
//   const closeModal = () => {
//     setViewLead(null);
//     setEditLead(null);
//   };

//   const handleUpdateLead = async (data) => {
//     if (!editLead) return;
    
//     try {
//       // Check if destination has changed
//       const destinationChanged = editLead.destination !== data.destination;
//       console.log("🔍 Checking lead update...");
//       console.log("Old destination:", editLead.destination);
//       console.log("New destination:", data.destination);
//       console.log("Destination changed?:", destinationChanged);
      
//       if (destinationChanged && data.destination) {
//         // DESTINATION HAS CHANGED → Check for transfer to "Assigned by Destination"
//         console.log("🔄 Destination changed, checking for routing...");
//         const targetEmployee = await findEmployeeByDestination(data.destination, employeeId);
        
//         if (targetEmployee && targetEmployee._id !== employeeId) {
//           // Different employee has this destination → Transfer to their "Assigned by Destination"
//           console.log("✅ Different employee assigned to destination, transferring to:", targetEmployee.fullName);
          
//           // Create employee lead with routing info
//           const employeeLeadPayload = {
//             ...data,
//             employee: targetEmployee._id,
//             routedFromEmployee: employeeId,
//             isActioned: false,
//           };
          
//           console.log("📤 Sending employee lead payload:", employeeLeadPayload);
          
//           const res = await fetch("http://localhost:4000/employeelead", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(employeeLeadPayload),
//           });
          
//           if (!res.ok) {
//             const err = await res.json().catch(() => ({}));
//             throw new Error(err.message || "Failed to route lead");
//           }
          
//           const responseData = await res.json();
//           console.log("✅ Lead routed successfully:", responseData);
          
//           // Show success message
//           alert(`✅ Lead successfully transferred to ${targetEmployee.fullName}'s "Assigned by Destination" tab.`);
          
//           // Remove from assigned leads list
//           setAssignedLeads((prev) => prev.filter((lead) => lead._id !== editLead._id));
//           setEditLead(null);
//           return;
//         } else if (targetEmployee && targetEmployee._id === employeeId) {
//           // SAME employee has this destination → Just update normally (don't route)
//           console.log("✅ Same employee assigned to destination, updating normally");
          
//           const payload = { ...data };
//           const res = await fetch(`http://localhost:4000/assignlead/${editLead._id}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//           });
          
//           if (!res.ok) {
//             const err = await res.json().catch(() => ({}));
//             throw new Error(err.message || "Failed to update lead");
//           }
          
//           setAssignedLeads((prev) =>
//             prev.map((lead) => (lead._id === editLead._id ? { ...lead, ...payload } : lead))
//           );
          
//           setEditLead(null);
//           return;
//         } else {
//           // NO employee assigned to this destination → Show error
//           console.warn("⚠️ No employee assigned to destination:", data.destination);
//           alert(`No employee is assigned to the destination "${data.destination}". Please select a destination with an assigned employee.`);
//           return;
//         }
//       } else {
//         // DESTINATION NOT CHANGED → Just update normally
//         console.log("📝 No destination change, updating normally...");
//         const payload = { ...data };
//         const res = await fetch(`http://localhost:4000/assignlead/${editLead._id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
        
//         if (!res.ok) {
//           const err = await res.json().catch(() => ({}));
//           throw new Error(err.message || "Failed to update lead");
//         }

//         // Update the local state
//         setAssignedLeads((prev) =>
//           prev.map((lead) => (lead._id === editLead._id ? { ...lead, ...payload } : lead))
//         );

//         setEditLead(null);
//       }
//     } catch (err) {
//       console.error("Error updating lead:", err);
//       throw err;
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
//   };

//   return (
//     <div className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg">
//       <h2 className="text-2xl font-semibold mb-4">Assigned Leads</h2>

//       {loading ? (
//         <p>Loading assigned leads...</p>
//       ) : assignedLeads.length === 0 ? (
//         <p className="text-gray-600">You have no assigned leads yet.</p>
//       ) : (
//         <>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse border">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border px-3 py-2 text-center">
//                     <input
//                       type="checkbox"
//                       ref={selectAllRef}
//                       checked={visibleLeads.length > 0 && visibleLeads.every((l) => selectedLeads.map(String).includes(String(l._id)))}
//                       onChange={handleSelectAllVisible}
//                     />
//                     <div className="text-xs">All Select</div>
//                   </th>
//                   <th className="border px-3 py-2">Name</th>
//                   <th className="border px-3 py-2">Email</th>
//                   <th className="border px-3 py-2">Phone</th>
//                   <th className="border px-3 py-2">WhatsApp No</th>
//                   <th className="border px-3 py-2">Destination</th>
//                   <th className="border px-3 py-2 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {visibleLeads.map((lead) => (
//                   <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
//                     <td className="border px-3 py-2 text-center">
//                       <input
//                         type="checkbox"
//                         checked={selectedLeads.includes(lead._id)}
//                         onChange={() => handleLeadCheck(lead._id)}
//                       />
//                     </td>
//                     <td className="border px-3 py-2">{lead.name}</td>
//                     <td className="border px-3 py-2">{lead.email}</td>
//                     <td className="border px-3 py-2">{lead.phone}</td>
//                     <td className="border px-3 py-2">{lead.whatsAppNo}</td>
//                     <td className="border px-3 py-2">{lead.destination}</td>
//                     <td className="border px-3 py-2 text-center">
//                       <div className="flex justify-center gap-2">
//                         <button onClick={() => handleView(lead)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" title="View Lead"><Eye size={16} /></button>
//                         <button onClick={() => handleEdit(lead)} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200" title="Edit Lead"><Edit2 size={16} /></button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination controls */}
//           <div className="flex items-center justify-between mt-3">
//             <div className="text-sm text-gray-600">
//               Showing {Math.min((currentPage - 1) * pageSize + 1, assignedLeads.length || 0)} to {Math.min(currentPage * pageSize, assignedLeads.length || 0)} of {assignedLeads.length || 0} leads
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
//               >
//                 Previous
//               </button>
//               <div className="text-sm">Page {currentPage} of {Math.max(1, Math.ceil((assignedLeads.length || 0) / pageSize))}</div>
//               <button
//                 onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil((assignedLeads.length || 0) / pageSize)), p + 1))}
//                 disabled={currentPage >= Math.ceil((assignedLeads.length || 0) / pageSize)}
//                 className={`px-3 py-1 rounded ${currentPage >= Math.ceil((assignedLeads.length || 0) / pageSize) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Edit Lead Modal */}
//       {editLead && (
//         <Modal isOpen={true} onClose={closeModal} size="large">
//           <div className="flex flex-col h-full max-h-[95vh]">
//             <div className="p-4 border-b flex justify-between items-center">
//               <h2 className="text-lg font-bold text-gray-900">Edit Assigned Lead</h2>
//               <button onClick={closeModal} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4">
//               <EditLeadForm
//                 initialData={editLead}
//                 onSubmit={handleUpdateLead}
//                 onClose={closeModal}
//               />
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* View Lead Modal */}
//       {viewLead && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
//             <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X size={20} /></button>
//             <h3 className="text-lg font-semibold mb-3">Lead Details</h3>
//             <div className="space-y-2 text-sm">
//               {Object.entries(viewLead).map(([key, val]) => (
//                 key !== "_id" && key !== "__v" && (
//                   <p key={key}><span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {Array.isArray(val) ? val.join(", ") : val || "-"}</p>
//                 )
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





import { useState, useEffect, useRef } from "react";
import { Edit2, Eye, X, AlertCircle } from "lucide-react";
import DestinationSearchBox from "../../components/DestinationSearchBox";
import { findEmployeeByDestination } from "../../utils/destinationRouting";

const tripDurations = [
  "1n/2d","2n/3d","3n/4d","4n/5d","5n/6d","6n/7d","7n/8d","8n/9d","9n/10d",
  "10n/11d","11n/12d","12n/13d","13n/14d","14n/15d","Others"
];

const leadSources = [
  "Cold Call", "Website", "Referral", "LinkedIn", "Trade Show",
  "Email Campaign", "Social Media", "Event", "Organic Search", "Paid Ads",
];
const leadTypes = ["International", "Domestic"];
const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];

// Modal Component
const Modal = ({ isOpen, onClose, size = "large", children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className={`bg-white rounded-lg shadow-lg ${size === "large" ? "w-full max-w-4xl" : "w-full max-w-md"} max-h-[95vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({ name, type = "text", placeholder, required, value, error, onChange }) => (
  <div className="h-[4.5rem]">
    <label className="block text-xs font-medium text-gray-700 mb-0.5">
      {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
      }`}
      autoComplete="off"
    />
    {error && (
      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

// Select Field Component
const SelectField = ({ name, options, required, value, error, onChange }) => (
  <div className="h-[4.5rem]">
    <label className="block text-xs font-medium text-gray-700 mb-0.5">
      {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <option value="">Select {name}</option>
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
    {error && (
      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

// Edit Lead Form Component
const EditLeadForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsAppNo: "",
    departureCity: "",
    destination: "",
    expectedTravelDate: "",
    noOfDays: "",
    customNoOfDays: "",
    placesToCover: "",
    placesToCoverArray: [],
    noOfPerson: "",
    noOfChild: "",
    childAges: [],
    groupNumber: "",
    leadSource: "",
    leadType: "",
    tripType: "",
    leadStatus: "Hot",
    notes: "",
    ...initialData,
    placesToCoverArray: initialData?.placesToCoverArray || (initialData?.placesToCover ? initialData.placesToCover.split(", ").map(p => p.trim()) : []),
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      whatsAppNo: "",
      departureCity: "",
      destination: "",
      expectedTravelDate: "",
      noOfDays: "",
      customNoOfDays: "",
      placesToCover: "",
      placesToCoverArray: initialData?.placesToCoverArray || (initialData?.placesToCover ? initialData.placesToCover.split(", ").map(p => p.trim()) : []),
      noOfPerson: "",
      noOfChild: "",
      childAges: [],
      groupNumber: "",
      leadSource: "",
      leadType: "",
      tripType: "",
      leadStatus: "Hot",
      notes: "",
      ...initialData,
    });
  }, [initialData]);

  const validate = (data) => {
    const newErrors = {};
    if (!data.phone || data.phone.trim() === "") newErrors.phone = "Phone is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChildAgeChange = (index, value) => {
    const ages = [...formData.childAges];
    ages[index] = value;
    setFormData((prev) => ({ ...prev, childAges: ages }));
  };

  const addChildAge = () => setFormData((prev) => ({ ...prev, childAges: [...prev.childAges, ""] }));

  const removeChildAge = (index) => {
    const ages = [...formData.childAges];
    ages.splice(index, 1);
    setFormData((prev) => ({ ...prev, childAges: ages }));
  };

  const handleAddPlace = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const place = e.target.value.trim();
      if (!place) return;

      const currentPlaces = formData.placesToCoverArray || [];
      if (!currentPlaces.includes(place)) {
        setFormData((prev) => ({
          ...prev,
          placesToCoverArray: [...currentPlaces, place],
        }));
      }
      e.target.value = "";
    }
  };

  const removePlace = (index) => {
    const updatedPlaces = [...(formData.placesToCoverArray || [])];
    updatedPlaces.splice(index, 1);
    setFormData((prev) => ({ ...prev, placesToCoverArray: updatedPlaces }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      ...formData,
      placesToCover: (formData.placesToCoverArray || []).join(", "),
    };

    setIsSubmitting(true);
    setApiError("");
    try {
      await onSubmit(payload);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setApiError(err.message || "Failed to save lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField name="name" value={formData.name} onChange={handleChange} />
        <InputField name="email" type="email" value={formData.email} onChange={handleChange} />
        <InputField name="phone" value={formData.phone} onChange={handleChange} required error={errors.phone} />
        <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
        <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} />
        <DestinationSearchBox
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Search destination..."
          error={errors.destination}
        />
        <InputField name="expectedTravelDate" type="date" value={formData.expectedTravelDate} onChange={handleChange} />
        <SelectField name="noOfDays" options={tripDurations} value={formData.noOfDays} onChange={handleChange} />
        {formData.noOfDays === "Others" && (
          <InputField name="customNoOfDays" placeholder="Enter custom duration" value={formData.customNoOfDays || ""} onChange={handleChange} />
        )}

        {/* Multi-place input */}
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-0.5">Places to Cover</label>
          <div className="flex flex-wrap gap-1 mb-1">
            {(formData.placesToCoverArray || []).map((place, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1 text-sm">
                {place}
                <button type="button" onClick={() => removePlace(idx)}>x</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a place and press Enter"
            onKeyDown={handleAddPlace}
            className="w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <InputField name="noOfPerson" type="number" value={formData.noOfPerson} onChange={handleChange} />
        <InputField name="noOfChild" type="number" value={formData.noOfChild} onChange={handleChange} />
        <InputField name="groupNumber" type="text" value={formData.groupNumber} onChange={handleChange} />

        {/* Child Ages */}
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-0.5">Child Ages</label>
          {formData.childAges.map((age, idx) => (
            <div key={idx} className="flex gap-2 mb-1">
              <input type="number" value={age} onChange={(e) => handleChildAgeChange(idx, e.target.value)} placeholder="Child Age" className="w-full px-3 py-1.5 border rounded-lg text-sm" />
              <button type="button" onClick={() => removeChildAge(idx)} className="bg-red-100 px-2 rounded hover:bg-red-200">X</button>
            </div>
          ))}
          <button type="button" onClick={addChildAge} className="mt-1 text-blue-600 hover:underline text-sm">+ Add Child Age</button>
        </div>

        <SelectField name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} />
        <SelectField name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} />
        <SelectField name="tripType" options={tripTypes} value={formData.tripType} onChange={handleChange} />
        <SelectField name="leadStatus" options={leadStatuses} value={formData.leadStatus} onChange={handleChange} />
      </div>

      <div className="mt-2">
        <label className="block text-xs font-medium text-gray-700 mb-0.5">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Add any notes or remarks..."
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        ></textarea>
      </div>

      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {isSubmitting ? "Saving..." : "Save Lead"}
        </button>
        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
      {apiError && <p className="text-red-600 mt-2">{apiError}</p>}
      {submitSuccess && <p className="text-green-600 mt-2">Lead saved successfully!</p>}
    </form>
  );
};

export default function MyAssignedLeads() {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [viewLead, setViewLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const pageSize = 100;
  const selectAllRef = useRef(null);

  // Get current employee ID from localStorage or session
  const getCurrentEmployeeId = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return user._id || user.id;
      }
    } catch (err) {
      console.error("Error retrieving employee ID:", err);
    }
    return null;
  };

  const employeeId = getCurrentEmployeeId();

  // Fetch assigned leads for current employee
  useEffect(() => {
    const fetchMyAssignedLeads = async () => {
      setLoading(true);
      if (!employeeId) {
        console.error("No employee ID found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:4000/assignlead/${employeeId}`);
        const data = await res.json();
        if (res.ok) {
          const arr = data.data || [];
          setAssignedLeads(arr);
          setCurrentPage(1);
        } else {
          console.error("Failed to fetch assigned leads:", data.message);
          setAssignedLeads([]);
        }
      } catch (err) {
        console.error("Error fetching assigned leads:", err);
        setAssignedLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAssignedLeads();
  }, []);

  // Adjust page if length changes and current page becomes out of range
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((assignedLeads && assignedLeads.length) / pageSize));
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [assignedLeads, currentPage]);

  // Handle lead checkbox toggle
  const handleLeadCheck = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  // Compute visible page items
  const visibleLeads = (assignedLeads || []).slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Select-all handler for visible page items
  const handleSelectAllVisible = () => {
    const ids = visibleLeads.map((l) => String(l._id));
    if (ids.length === 0) return;
    const allSelected = ids.every((id) => selectedLeads.map(String).includes(id));
    if (allSelected) {
      setSelectedLeads((prev) => prev.filter((id) => !ids.includes(String(id))));
    } else {
      setSelectedLeads((prev) => Array.from(new Set([...(prev || []).map(String), ...ids])));
    }
  };

  // Maintain indeterminate state for header checkbox
  const allVisibleSelected = visibleLeads.length > 0 && visibleLeads.every((l) => selectedLeads.map(String).includes(String(l._id)));
  const someVisibleSelected = visibleLeads.some((l) => selectedLeads.map(String).includes(String(l._id)));
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someVisibleSelected && !allVisibleSelected;
    }
  }, [someVisibleSelected, allVisibleSelected]);

  const handleView = (lead) => setViewLead(lead);
  const handleEdit = (lead) => setEditLead(lead);
  const closeModal = () => {
    setViewLead(null);
    setEditLead(null);
  };

  const handleUpdateLead = async (data) => {
    if (!editLead) return;
    
    try {
      // Check if destination has changed
      const destinationChanged = editLead.destination !== data.destination;
      console.log("🔍 Checking lead update...");
      console.log("Old destination:", editLead.destination);
      console.log("New destination:", data.destination);
      console.log("Destination changed?:", destinationChanged);
      
      if (destinationChanged && data.destination) {
        // DESTINATION HAS CHANGED → Check for transfer to "Assigned by Destination"
        console.log("🔄 Destination changed, checking for routing...");
        const targetEmployee = await findEmployeeByDestination(data.destination, employeeId);
        
        if (targetEmployee && targetEmployee._id !== employeeId) {
          // Different employee has this destination → Transfer to their "Assigned by Destination"
          console.log("✅ Different employee assigned to destination, transferring to:", targetEmployee.fullName);
          
          // Create employee lead with routing info
          const employeeLeadPayload = {
            ...data,
            employee: targetEmployee._id,
            routedFromEmployee: employeeId,
            isActioned: false,
          };
          
          console.log("📤 Sending employee lead payload:", employeeLeadPayload);
          
          const res = await fetch("http://localhost:4000/employeelead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeLeadPayload),
          });
          
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to route lead");
          }
          
          const responseData = await res.json();
          console.log("✅ Lead routed successfully:", responseData);
          
          // Show success message
          alert(`✅ Lead successfully transferred to ${targetEmployee.fullName}'s "Assigned by Destination" tab.`);
          
          // Remove from assigned leads list
          setAssignedLeads((prev) => prev.filter((lead) => lead._id !== editLead._id));
          setEditLead(null);
          return;
        } else if (targetEmployee && targetEmployee._id === employeeId) {
          // SAME employee has this destination → Just update normally (don't route)
          console.log("✅ Same employee assigned to destination, updating normally");
          
          const payload = { ...data };
          const res = await fetch(`http://localhost:4000/assignlead/${editLead._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to update lead");
          }
          
          setAssignedLeads((prev) =>
            prev.map((lead) => (lead._id === editLead._id ? { ...lead, ...payload } : lead))
          );
          
          setEditLead(null);
          return;
        } else {
          // NO employee assigned to this destination → Show error
          console.warn("⚠️ No employee assigned to destination:", data.destination);
          alert(`No employee is assigned to the destination "${data.destination}". Please select a destination with an assigned employee.`);
          return;
        }
      } else {
        // DESTINATION NOT CHANGED → Just update normally
        console.log("📝 No destination change, updating normally...");
        const payload = { ...data };
        const res = await fetch(`http://localhost:4000/assignlead/${editLead._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to update lead");
        }

        // Update the local state
        setAssignedLeads((prev) =>
          prev.map((lead) => (lead._id === editLead._id ? { ...lead, ...payload } : lead))
        );

        setEditLead(null);
      }
    } catch (err) {
      console.error("Error updating lead:", err);
      throw err;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Assigned Leads</h2>

      {loading ? (
        <p>Loading assigned leads...</p>
      ) : assignedLeads.length === 0 ? (
        <p className="text-gray-600">You have no assigned leads yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      ref={selectAllRef}
                      checked={visibleLeads.length > 0 && visibleLeads.every((l) => selectedLeads.map(String).includes(String(l._id)))}
                      onChange={handleSelectAllVisible}
                    />
                    <div className="text-xs">All Select</div>
                  </th>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Email</th>
                  <th className="border px-3 py-2">Phone</th>
                  <th className="border px-3 py-2">WhatsApp No</th>
                  <th className="border px-3 py-2">Destination</th>
                  <th className="border px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                    <td className="border px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead._id)}
                        onChange={() => handleLeadCheck(lead._id)}
                      />
                    </td>
                    <td className="border px-3 py-2">{lead.name}</td>
                    <td className="border px-3 py-2">{lead.email}</td>
                    <td className="border px-3 py-2">{lead.phone}</td>
                    <td className="border px-3 py-2">{lead.whatsAppNo}</td>
                    <td className="border px-3 py-2">{lead.destination}</td>
                    <td className="border px-3 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleView(lead)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" title="View Lead"><Eye size={16} /></button>
                        <button onClick={() => handleEdit(lead)} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200" title="Edit Lead"><Edit2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-gray-600">
              Showing {Math.min((currentPage - 1) * pageSize + 1, assignedLeads.length || 0)} to {Math.min(currentPage * pageSize, assignedLeads.length || 0)} of {assignedLeads.length || 0} leads
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
              >
                Previous
              </button>
              <div className="text-sm">Page {currentPage} of {Math.max(1, Math.ceil((assignedLeads.length || 0) / pageSize))}</div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil((assignedLeads.length || 0) / pageSize)), p + 1))}
                disabled={currentPage >= Math.ceil((assignedLeads.length || 0) / pageSize)}
                className={`px-3 py-1 rounded ${currentPage >= Math.ceil((assignedLeads.length || 0) / pageSize) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Lead Modal */}
      {editLead && (
        <Modal isOpen={true} onClose={closeModal} size="large">
          <div className="flex flex-col h-full max-h-[95vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Edit Assigned Lead</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <EditLeadForm
                initialData={editLead}
                onSubmit={handleUpdateLead}
                onClose={closeModal}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* View Lead Modal */}
      {viewLead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X size={20} /></button>
            <h3 className="text-lg font-semibold mb-3">Lead Details</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(viewLead).map(([key, val]) => (
                key !== "_id" && key !== "__v" && (
                  <p key={key}><span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {Array.isArray(val) ? val.join(", ") : val || "-"}</p>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}