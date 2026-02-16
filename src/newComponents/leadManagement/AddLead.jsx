// // import React, { useState, useEffect } from "react";
// // import { Plus, AlertCircle } from "lucide-react";
// // import Modal from "../UserManagement/Modal.jsx";

// // // 🧩 Dropdown Options
// // const leadSources = [
// //   "Cold Call", "Website", "Referral", "LinkedIn", "Trade Show",
// //   "Email Campaign", "Social Media", "Event", "Organic Search", "Paid Ads",
// // ];
// // const leadTypes = ["International", "Domestic"];
// // const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
// // const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];

// // // 🧩 Input Component
// // const InputField = ({ name, type = "text", placeholder, required, value, error, onChange }) => (
// //   <div className="h-[4.5rem]">
// //     <label className="block text-xs font-medium text-gray-700 mb-0.5">
// //       {name.charAt(0).toUpperCase() + name.slice(1)}{" "}
// //       {required && <span className="text-red-500">*</span>}
// //     </label>
// //     <input
// //       type={type}
// //       name={name}
// //       value={value || ""}
// //       onChange={onChange}
// //       placeholder={placeholder}
// //       className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
// //         error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
// //       }`}
// //       autoComplete="off"
// //     />
// //     {error && (
// //       <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
// //         <AlertCircle className="w-3 h-3" /> {error}
// //       </p>
// //     )}
// //   </div>
// // );

// // // 🧩 Select Component
// // const SelectField = ({ name, options, required, value, error, onChange }) => (
// //   <div className="h-[4.5rem]">
// //     <label className="block text-xs font-medium text-gray-700 mb-0.5">
// //       {name.charAt(0).toUpperCase() + name.slice(1)}{" "}
// //       {required && <span className="text-red-500">*</span>}
// //     </label>
// //     <select
// //       name={name}
// //       value={value || ""}
// //       onChange={onChange}
// //       className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
// //         error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
// //       }`}
// //     >
// //       <option value="">Select {name}</option>
// //       {options.map((opt) => (
// //         <option key={opt}>{opt}</option>
// //       ))}
// //     </select>
// //     {error && (
// //       <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
// //         <AlertCircle className="w-3 h-3" /> {error}
// //       </p>
// //     )}
// //   </div>
// // );

// // const AddLead = ({ onLeadAdded }) => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [tab, setTab] = useState("manual");
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [apiError, setApiError] = useState("");
// //   const [uploadSummary, setUploadSummary] = useState(null);
// //   const [progress, setProgress] = useState(0);
// //   const [recordProgress, setRecordProgress] = useState({ current: 0, total: 0 });

// //   const [formData, setFormData] = useState({
// //     name: "", email: "", phone: "", whatsAppNo: "",
// //     departureCity: "", destination: "", expectedTravelDate: "",
// //     noOfDays: "", placesToCover: "", noOfPerson: "",
// //     noOfChild: "", childAge: "", leadSource: "",
// //     leadType: "", tripType: "", company: "",
// //     leadStatus: "Hot", value: "", notes: "",
// //   });

// //   const [errors, setErrors] = useState({});
// //   const [file, setFile] = useState(null);

// //   // 🧩 Manual Validation
// //   const validate = (data) => {
// //     const newErrors = {};
// //     if (!data.name) newErrors.name = "Name is required";
// //     if (!data.phone) newErrors.phone = "Phone is required";
// //     if (!data.departureCity) newErrors.departureCity = "Departure City is required";
// //     return newErrors;
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   // 🧩 Manual Submit
// //   const handleManualSubmit = async (e) => {
// //     e.preventDefault();
// //     const newErrors = validate(formData);
// //     setErrors(newErrors);
// //     if (Object.keys(newErrors).length > 0) return;

// //     setIsSubmitting(true);
// //     setApiError("");
// //     try {
// //       const payload = { ...formData, phone: formData.phone.split(",").map((p) => p.trim()) };
// //       const res = await fetch("http://localhost:4000/leads/lead", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });
// //       if (!res.ok) throw new Error("Failed to add lead");
// //       onLeadAdded?.();
// //       setIsOpen(false);
// //     } catch (err) {
// //       setApiError(err.message);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // 🧩 Upload Excel + Progress System
// //   const handleFileUpload = async (e) => {
// //     e.preventDefault();
// //     if (!file) return alert("Please select a file first!");

// //     setIsSubmitting(true);
// //     setApiError("");
// //     setProgress(0);
// //     setRecordProgress({ current: 0, total: 0 });
// //     setUploadSummary(null);

// //     const formDataObj = new FormData();
// //     formDataObj.append("file", file);

// //     // ✅ Upload with progress tracking
// //     const xhr = new XMLHttpRequest();
// //     xhr.open("POST", "http://localhost:4000/leads/upload");

// //     xhr.upload.onprogress = (event) => {
// //       if (event.lengthComputable) {
// //         const percent = Math.round((event.loaded * 100) / event.total);
// //         setProgress(percent);
// //       }
// //     };

// //     xhr.onload = async () => {
// //       if (xhr.status === 200) {
// //         const res = JSON.parse(xhr.responseText);
// //         setUploadSummary(res);
// //         onLeadAdded?.();
// //       } else {
// //         setApiError("Upload failed");
// //       }
// //       setIsSubmitting(false);
// //     };

// //     xhr.onerror = () => {
// //       setApiError("Network error during upload");
// //       setIsSubmitting(false);
// //     };

// //     xhr.send(formDataObj);
// //   };

// //   return (
// //     <>
// //       <button
// //         onClick={() => setIsOpen(true)}
// //         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
// //       >
// //         <Plus className="w-4 h-4" /> Add Lead
// //       </button>

// //       <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="large">
// //         <div className="flex flex-col h-full max-h-[95vh]">
// //           <div className="p-4 border-b flex justify-between items-center">
// //             <h2 className="text-lg font-bold text-gray-900">Add New Lead</h2>
// //             <div className="flex gap-2">
// //               <button
// //                 className={`px-3 py-1 rounded ${tab === "manual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
// //                 onClick={() => setTab("manual")}
// //               >
// //                 Manual
// //               </button>
// //               <button
// //                 className={`px-3 py-1 rounded ${tab === "upload" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
// //                 onClick={() => setTab("upload")}
// //               >
// //                 Upload Excel
// //               </button>
// //             </div>
// //           </div>

// //           <div className="flex-1 overflow-y-auto p-4">
// //             {tab === "manual" ? (
// //               // Manual Form
// //               <form onSubmit={handleManualSubmit} className="space-y-3">
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
// //                   <InputField name="name" value={formData.name} onChange={handleChange} required error={errors.name} />
// //                   <InputField name="phone" value={formData.phone} onChange={handleChange} required error={errors.phone} />
// //                   <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} required error={errors.departureCity} />
// //                   <SelectField name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} />
// //                   <SelectField name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} />
// //                 </div>
// //                 <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
// //                   {isSubmitting ? "Saving..." : "Save Lead"}
// //                 </button>
// //               </form>
// //             ) : (
// //               // Upload Form
// //               <form onSubmit={handleFileUpload} className="space-y-3">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Select Excel File</label>
// //                   <input
// //                     type="file"
// //                     accept=".xlsx,.xls"
// //                     onChange={(e) => setFile(e.target.files[0])}
// //                     className="border p-2 rounded w-full"
// //                   />
// //                 </div>

// //                 {/* ✅ Progress Bar */}
// //                 {isSubmitting && (
// //                   <div className="mt-2">
// //                     <div className="w-full bg-gray-200 rounded-full h-3">
// //                       <div
// //                         className="bg-blue-600 h-3 rounded-full transition-all duration-200"
// //                         style={{ width: `${progress}%` }}
// //                       ></div>
// //                     </div>
// //                     <p className="text-sm text-gray-700 mt-1 text-center">
// //                       Uploading... {progress}% 
// //                     </p>
// //                   </div>
// //                 )}

// //                 <div className="flex gap-2 mt-3">
// //                   <button
// //                     type="submit"
// //                     disabled={isSubmitting}
// //                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
// //                   >
// //                     {isSubmitting ? "Uploading..." : "Upload"}
// //                   </button>
// //                   <button
// //                     type="button"
// //                     onClick={() => setIsOpen(false)}
// //                     className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
// //                   >
// //                     Cancel
// //                   </button>
// //                 </div>

// //                 {uploadSummary && (
// //                   <div className="mt-3 text-sm text-gray-700">
// //                     <p><strong>Total:</strong> {uploadSummary.total}</p>
// //                     <p><strong>Inserted:</strong> {uploadSummary.inserted}</p>
// //                     <p><strong>Skipped:</strong> {uploadSummary.skipped}</p>
// //                     <p>
// //                       <strong>Success Rate:</strong> {uploadSummary.successRate}% |{" "}
// //                       <strong>Failed:</strong> {uploadSummary.failedRate}%
// //                     </p>
// //                   </div>
// //                 )}

// //                 {apiError && <p className="text-red-600 mt-2">{apiError}</p>}
// //               </form>
// //             )}
// //           </div>
// //         </div>
// //       </Modal>
// //     </>
// //   );
// // };

// // export default AddLead;





// import React, { useState } from "react";
// import { Plus, AlertCircle } from "lucide-react";
// import Modal from "../UserManagement/Modal.jsx";

// const leadSources = [
//   "Cold Call", "Website", "Referral", "LinkedIn", "Trade Show",
//   "Email Campaign", "Social Media", "Event", "Organic Search", "Paid Ads",
// ];
// const leadTypes = ["International", "Domestic"];
// const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
// const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];

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
//         <option key={opt} value={opt}>
//           {opt}
//         </option>
//       ))}
//     </select>
//     {error && (
//       <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
//         <AlertCircle className="w-3 h-3" /> {error}
//       </p>
//     )}
//   </div>
// );

// const AddLead = ({ onLeadAdded }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     whatsAppNo: "",
//     departureCity: "",
//     destination: "",
//     expectedTravelDate: "",
//     noOfDays: "",
//     placesToCover: "",
//     noOfPerson: "",
//     noOfChild: "",
//     childAge: "",
//     leadSource: "",
//     leadType: "",
//     tripType: "",
//     company: "",
//     leadStatus: "Hot",
//     value: "",
//     notes: "",
//   });

//   const [errors, setErrors] = useState({});

//   // Validation
//   const validate = (data) => {
//     const newErrors = {};
//     if (!data.name) newErrors.name = "Name is required";
//     if (!data.phone) newErrors.phone = "Phone is required";
//     if (!data.departureCity) newErrors.departureCity = "Departure City is required";
//     return newErrors;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError("");
//     const newErrors = validate(formData);
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length) return;

//     setIsSubmitting(true);

//     try {
//       // Split phone string by commas and trim, convert to array
//       const payload = {
//         ...formData,
//         phone: formData.phone.split(",").map((p) => p.trim()),
//         noOfDays: formData.noOfDays ? Number(formData.noOfDays) : undefined,
//         noOfPerson: formData.noOfPerson ? Number(formData.noOfPerson) : undefined,
//         noOfChild: formData.noOfChild ? Number(formData.noOfChild) : undefined,
//         value: formData.value ? Number(formData.value) : undefined,
//         expectedTravelDate: formData.expectedTravelDate ? new Date(formData.expectedTravelDate) : undefined,
//       };

//       const res = await fetch("http://localhost:4000/leads/lead", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to add lead");
//       }

//       onLeadAdded?.();
//       setIsOpen(false);
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         whatsAppNo: "",
//         departureCity: "",
//         destination: "",
//         expectedTravelDate: "",
//         noOfDays: "",
//         placesToCover: "",
//         noOfPerson: "",
//         noOfChild: "",
//         childAge: "",
//         leadSource: "",
//         leadType: "",
//         tripType: "",
//         company: "",
//         leadStatus: "Hot",
//         value: "",
//         notes: "",
//       });
//       setErrors({});
//     } catch (err) {
//       setApiError(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
//       >
//         <Plus className="w-4 h-4" /> Add Lead
//       </button>

//       <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="large">
//         <div className="flex flex-col h-full max-h-[95vh]">
//           <div className="p-4 border-b flex justify-between items-center">
//             <h2 className="text-lg font-bold text-gray-900">Add New Lead</h2>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="text-gray-500 hover:text-gray-900 font-bold"
//               aria-label="Close modal"
//             >
//               ×
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4">
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <InputField name="name" value={formData.name} onChange={handleChange} required error={errors.name} />
//                 <InputField name="phone" value={formData.phone} onChange={handleChange} required error={errors.phone} placeholder="Comma separated if multiple" />
//                 <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} required error={errors.departureCity} />
//                 <InputField name="email" value={formData.email} onChange={handleChange} type="email" />
//                 <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
//                 <SelectField name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} />
//                 <SelectField name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} />
//                 <SelectField name="tripType" options={tripTypes} value={formData.tripType} onChange={handleChange} />
//                 <InputField name="company" value={formData.company} onChange={handleChange} />
//                 <SelectField name="leadStatus" options={leadStatuses} value={formData.leadStatus} onChange={handleChange} />
//                 <InputField name="noOfDays" value={formData.noOfDays} onChange={handleChange} type="number" />
//                 <InputField name="noOfPerson" value={formData.noOfPerson} onChange={handleChange} type="number" />
//                 <InputField name="noOfChild" value={formData.noOfChild} onChange={handleChange} type="number" />
//                 <InputField name="childAge" value={formData.childAge} onChange={handleChange} />
//                 <InputField name="expectedTravelDate" value={formData.expectedTravelDate} onChange={handleChange} type="date" />
//                 <InputField name="placesToCover" value={formData.placesToCover} onChange={handleChange} />
//                 <InputField name="value" value={formData.value} onChange={handleChange} type="number" />
//                 <InputField name="notes" value={formData.notes} onChange={handleChange} />
//               </div>

//               {apiError && <p className="text-red-600 mt-2 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> {apiError}</p>}

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//               >
//                 {isSubmitting ? "Saving..." : "Save Lead"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default AddLead;



// import React, { useState } from "react";
// import { Plus, AlertCircle, UploadCloud } from "lucide-react";
// import Modal from "../UserManagement/Modal.jsx";

// const leadSources = [
//   "Cold Call", "Website", "Referral", "LinkedIn", "Trade Show",
//   "Email Campaign", "Social Media", "Event", "Organic Search", "Paid Ads",
// ];
// const leadTypes = ["International", "Domestic"];
// const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
// const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];

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
//         <option key={opt} value={opt}>
//           {opt}
//         </option>
//       ))}
//     </select>
//     {error && (
//       <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
//         <AlertCircle className="w-3 h-3" /> {error}
//       </p>
//     )}
//   </div>
// );

// const AddLead = ({ onLeadAdded }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [tab, setTab] = useState("manual"); // "manual" or "upload"
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [uploadError, setUploadError] = useState("");
//   const [uploadSuccess, setUploadSuccess] = useState("");

//   // Form state for manual input
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     whatsAppNo: "",
//     departureCity: "",
//     destination: "",
//     expectedTravelDate: "",
//     noOfDays: "",
//     placesToCover: "",
//     noOfPerson: "",
//     noOfChild: "",
//     childAge: "",
//     leadSource: "",
//     leadType: "",
//     tripType: "",
//     company: "",
//     leadStatus: "Hot",
//     value: "",
//     notes: "",
//   });

//   const [errors, setErrors] = useState({});

//   // File upload state
//   const [file, setFile] = useState(null);

//   // Validation for manual form
//   const validate = (data) => {
//     const newErrors = {};
//     if (!data.name) newErrors.name = "Name is required";
//     if (!data.phone) newErrors.phone = "Phone is required";
//     if (!data.departureCity) newErrors.departureCity = "Departure City is required";
//     return newErrors;
//   };

//   // Handle manual form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Submit manual form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError("");
//     const newErrors = validate(formData);
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length) return;

//     setIsSubmitting(true);

//     try {
//       const payload = {
//         ...formData,
//         phone: formData.phone.trim(),
//         noOfDays: formData.noOfDays ? Number(formData.noOfDays) : undefined,
//         noOfPerson: formData.noOfPerson ? Number(formData.noOfPerson) : undefined,
//         noOfChild: formData.noOfChild ? Number(formData.noOfChild) : undefined,
//         value: formData.value ? Number(formData.value) : undefined,
//         expectedTravelDate: formData.expectedTravelDate ? new Date(formData.expectedTravelDate) : undefined,
//       };

//       const res = await fetch("http://localhost:4000/leads/lead", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to add lead");
//       }

//       onLeadAdded?.();
//       setIsOpen(false);
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         whatsAppNo: "",
//         departureCity: "",
//         destination: "",
//         expectedTravelDate: "",
//         noOfDays: "",
//         placesToCover: "",
//         noOfPerson: "",
//         noOfChild: "",
//         childAge: "",
//         leadSource: "",
//         leadType: "",
//         tripType: "",
//         company: "",
//         leadStatus: "Hot",
//         value: "",
//         notes: "",
//       });
//       setErrors({});
//     } catch (err) {
//       setApiError(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle file input change
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setUploadError("");
//     setUploadSuccess("");
//   };

//   // Upload file handler
//   const handleFileUpload = async () => {
//     if (!file) {
//       setUploadError("Please select a file to upload.");
//       return;
//     }
//     setUploadError("");
//     setUploadSuccess("");
//     setIsSubmitting(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await fetch("http://localhost:4000/leads/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Upload failed");
//       }

//       const result = await res.json();
//       setUploadSuccess(`Successfully uploaded ${result.insertedCount || "some"} leads.`);
//       onLeadAdded?.();
//       setFile(null);
//       // Reset file input value (hacky but works)
//       document.getElementById("file-upload-input").value = "";
//     } catch (err) {
//       setUploadError(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
//       >
//         <Plus className="w-4 h-4" /> Add Lead
//       </button>

//       <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="large">
//         <div className="flex flex-col h-full max-h-[95vh]">
//           <div className="p-4 border-b flex justify-between items-center">
//             <h2 className="text-lg font-bold text-gray-900">Add New Lead</h2>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="text-gray-500 hover:text-gray-900 font-bold"
//               aria-label="Close modal"
//             >
//               ×
//             </button>
//           </div>

//           <div className="p-4 flex space-x-4 border-b">
//             <button
//               onClick={() => setTab("manual")}
//               className={`px-4 py-2 font-medium rounded ${tab === "manual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
//             >
//               Manual Entry
//             </button>
//             <button
//               onClick={() => setTab("upload")}
//               className={`px-4 py-2 font-medium rounded ${tab === "upload" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
//             >
//               Upload Leads
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4">
//             {tab === "manual" && (
//               <form onSubmit={handleSubmit} className="space-y-3">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <InputField name="name" value={formData.name} onChange={handleChange} required error={errors.name} />
//                   <InputField name="phone" value={formData.phone} onChange={handleChange} required error={errors.phone} placeholder="Comma separated if multiple" />
//                   <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} required error={errors.departureCity} />
//                   <InputField name="email" value={formData.email} onChange={handleChange} type="email" />
//                   <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
//                   <SelectField name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} />
//                   <SelectField name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} />
//                   <SelectField name="tripType" options={tripTypes} value={formData.tripType} onChange={handleChange} />
//                   <InputField name="company" value={formData.company} onChange={handleChange} />
//                   <SelectField name="leadStatus" options={leadStatuses} value={formData.leadStatus} onChange={handleChange} />
//                   <InputField name="noOfDays" value={formData.noOfDays} onChange={handleChange} type="number" />
//                   <InputField name="noOfPerson" value={formData.noOfPerson} onChange={handleChange} type="number" />
//                   <InputField name="noOfChild" value={formData.noOfChild} onChange={handleChange} type="number" />
//                   <InputField name="childAge" value={formData.childAge} onChange={handleChange} />
//                   <InputField name="expectedTravelDate" value={formData.expectedTravelDate} onChange={handleChange} type="date" />
//                   <InputField name="placesToCover" value={formData.placesToCover} onChange={handleChange} />
//                   <InputField name="value" value={formData.value} onChange={handleChange} type="number" />
//                   <InputField name="notes" value={formData.notes} onChange={handleChange} />
//                 </div>

//                 {apiError && (
//                   <p className="text-red-600 mt-2 flex items-center gap-2">
//                     <AlertCircle className="w-5 h-5" /> {apiError}
//                   </p>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//                 >
//                   {isSubmitting ? "Saving..." : "Save Lead"}
//                 </button>
//               </form>
//             )}

//             {tab === "upload" && (
//               <div className="flex flex-col space-y-4 max-w-md">
//                 <p className="text-sm text-gray-600">
//                   Upload a CSV file with lead data. The CSV should have columns matching lead fields like: name, email, phone, departureCity, etc.
//                 </p>

//                 <input
//                   type="file"
//                   id="file-upload-input"
//                   accept=".csv"
//                   onChange={handleFileChange}
//                   className="border p-2 rounded"
//                 />

//                 {uploadError && (
//                   <p className="text-red-600 flex items-center gap-2">
//                     <AlertCircle className="w-5 h-5" /> {uploadError}
//                   </p>
//                 )}

//                 {uploadSuccess && (
//                   <p className="text-green-600 flex items-center gap-2">
//                     <UploadCloud className="w-5 h-5" /> {uploadSuccess}
//                   </p>
//                 )}

//                 <button
//                   onClick={handleFileUpload}
//                   disabled={isSubmitting || !file}
//                   className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//                 >
//                   {isSubmitting ? "Uploading..." : "Upload Leads"}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default AddLead;




// import React, { useState } from "react";
// import { Plus, AlertCircle, UploadCloud } from "lucide-react";
// import Modal from "../UserManagement/Modal.jsx";

// const leadSources = [
//   "Cold Call", "Website", "Referral", "LinkedIn", "Trade Show",
//   "Email Campaign", "Social Media", "Event", "Organic Search", "Paid Ads",
// ];
// const leadTypes = ["International", "Domestic"];
// const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
// const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];

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

// const SelectField = ({ name, options, value, onChange }) => (
//   <div className="h-[4.5rem]">
//     <label className="block text-xs font-medium text-gray-700 mb-0.5">
//       {name.charAt(0).toUpperCase() + name.slice(1)}
//     </label>
//     <select
//       name={name}
//       value={value || ""}
//       onChange={onChange}
//       className="w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 border-gray-300 hover:border-gray-400"
//     >
//       <option value="">Select {name}</option>
//       {options.map((opt) => (
//         <option key={opt} value={opt}>{opt}</option>
//       ))}
//     </select>
//   </div>
// );

// const AddLead = ({ onLeadAdded }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [tab, setTab] = useState("manual"); // "manual" or "upload"
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [uploadError, setUploadError] = useState("");
//   const [uploadSuccess, setUploadSuccess] = useState("");

//   // Form state for manual input
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     whatsAppNo: "",
//     departureCity: "",
//     destination: "",
//     expectedTravelDate: "",
//     noOfDays: "",
//     placesToCover: "",
//     noOfPerson: "",
//     noOfChild: "",
//     childAges: [""], // array for multiple ages
//     leadSource: "",
//     leadType: "",
//     tripType: "",
//     leadStatus: "Hot",
//     notes: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [file, setFile] = useState(null);

//   // Only phone validation
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
//     const newAges = [...formData.childAges];
//     newAges[index] = value;
//     setFormData((prev) => ({ ...prev, childAges: newAges }));
//   };

//   const addChildAge = () => {
//     setFormData((prev) => ({ ...prev, childAges: [...prev.childAges, ""] }));
//   };

//   const removeChildAge = (index) => {
//     const newAges = formData.childAges.filter((_, i) => i !== index);
//     setFormData((prev) => ({ ...prev, childAges: newAges }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError("");
//     const newErrors = validate(formData);
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length) return;

//     setIsSubmitting(true);

//     try {
//       const payload = {
//         ...formData,
//         phone: formData.phone.trim(),
//         noOfDays: formData.noOfDays ? Number(formData.noOfDays) : undefined,
//         noOfPerson: formData.noOfPerson ? Number(formData.noOfPerson) : undefined,
//         noOfChild: formData.noOfChild ? Number(formData.noOfChild) : undefined,
//         expectedTravelDate: formData.expectedTravelDate ? new Date(formData.expectedTravelDate) : undefined,
//       };

//       const res = await fetch("http://localhost:4000/leads/lead", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to add lead");
//       }

//       onLeadAdded?.();
//       setIsOpen(false);
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         whatsAppNo: "",
//         departureCity: "",
//         destination: "",
//         expectedTravelDate: "",
//         noOfDays: "",
//         placesToCover: "",
//         noOfPerson: "",
//         noOfChild: "",
//         childAges: [""],
//         leadSource: "",
//         leadType: "",
//         tripType: "",
//         leadStatus: "Hot",
//         notes: "",
//       });
//       setErrors({});
//     } catch (err) {
//       setApiError(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setUploadError("");
//     setUploadSuccess("");
//   };

//   const handleFileUpload = async () => {
//     if (!file) {
//       setUploadError("Please select a file to upload.");
//       return;
//     }
//     setUploadError("");
//     setUploadSuccess("");
//     setIsSubmitting(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await fetch("http://localhost:4000/leads/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Upload failed");
//       }

//       const result = await res.json();
//       setUploadSuccess(`Successfully uploaded ${result.insertedCount || "some"} leads.`);
//       onLeadAdded?.();
//       setFile(null);
//       document.getElementById("file-upload-input").value = "";
//     } catch (err) {
//       setUploadError(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
//       >
//         <Plus className="w-4 h-4" /> Add Lead
//       </button>

//       <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="large">
//         <div className="flex flex-col h-full max-h-[95vh]">
//           <div className="p-4 border-b flex justify-between items-center">
//             <h2 className="text-lg font-bold text-gray-900">Add New Lead</h2>
//             <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-900 font-bold">
//               ×
//             </button>
//           </div>

//           <div className="p-4 flex space-x-4 border-b">
//             <button
//               onClick={() => setTab("manual")}
//               className={`px-4 py-2 font-medium rounded ${tab === "manual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
//             >
//               Manual Entry
//             </button>
//             <button
//               onClick={() => setTab("upload")}
//               className={`px-4 py-2 font-medium rounded ${tab === "upload" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
//             >
//               Upload Leads
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4">
//             {tab === "manual" && (
//               <form onSubmit={handleSubmit} className="space-y-3">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <InputField name="name" value={formData.name} onChange={handleChange} />
//                   <InputField name="phone" value={formData.phone} onChange={handleChange} required error={errors.phone} placeholder="Comma separated if multiple" />
//                   <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} />
//                   <InputField name="email" value={formData.email} onChange={handleChange} type="email" />
//                   <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
//                   <SelectField name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} />
//                   <SelectField name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} />
//                   <SelectField name="tripType" options={tripTypes} value={formData.tripType} onChange={handleChange} />
//                   <SelectField name="leadStatus" options={leadStatuses} value={formData.leadStatus} onChange={handleChange} />
//                   <InputField name="noOfDays" value={formData.noOfDays} onChange={handleChange} type="number" />
//                   <InputField name="noOfPerson" value={formData.noOfPerson} onChange={handleChange} type="number" />
//                   <InputField name="noOfChild" value={formData.noOfChild} onChange={handleChange} type="number" />

//                   {/* Multiple Child Ages */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-0.5">Child Ages</label>
//                     {formData.childAges.map((age, index) => (
//                       <div key={index} className="flex items-center gap-2 mb-1">
//                         <input
//                           type="number"
//                           value={age}
//                           onChange={(e) => handleChildAgeChange(index, e.target.value)}
//                           className="w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="Child age"
//                         />
//                         {formData.childAges.length > 1 && (
//                           <button type="button" onClick={() => removeChildAge(index)} className="text-red-500 font-bold">×</button>
//                         )}
//                       </div>
//                     ))}
//                     <button type="button" onClick={addChildAge} className="text-blue-600 text-sm mt-1">Add Age</button>
//                   </div>

//                   <InputField name="expectedTravelDate" value={formData.expectedTravelDate} onChange={handleChange} type="date" />
//                   <InputField name="placesToCover" value={formData.placesToCover} onChange={handleChange} />
//                   <InputField name="notes" value={formData.notes} onChange={handleChange} />
//                 </div>

//                 {apiError && (
//                   <p className="text-red-600 mt-2 flex items-center gap-2">
//                     <AlertCircle className="w-5 h-5" /> {apiError}
//                   </p>
//                 )}

//                 <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
//                   {isSubmitting ? "Saving..." : "Save Lead"}
//                 </button>
//               </form>
//             )}

//             {tab === "upload" && (
//               <div className="flex flex-col space-y-4 max-w-md">
//                 <p className="text-sm text-gray-600">
//                   Upload a CSV file with lead data. The CSV should have columns matching lead fields like: name, email, phone, departureCity, etc.
//                 </p>

//                 <input
//                   type="file"
//                   id="file-upload-input"
//                   accept=".csv"
//                   onChange={handleFileChange}
//                   className="border p-2 rounded"
//                 />

//                 {uploadError && (
//                   <p className="text-red-600 flex items-center gap-2">
//                     <AlertCircle className="w-5 h-5" /> {uploadError}
//                   </p>
//                 )}

//                 {uploadSuccess && (
//                   <p className="text-green-600 flex items-center gap-2">
//                     <UploadCloud className="w-5 h-5" /> {uploadSuccess}
//                   </p>
//                 )}

//                 <button
//                   onClick={handleFileUpload}
//                   disabled={isSubmitting || !file}
//                   className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//                 >
//                   {isSubmitting ? "Uploading..." : "Upload Leads"}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default AddLead;





import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Plus, AlertCircle, UploadCloud } from "lucide-react";
import Modal from "../UserManagement/Modal.jsx";

const leadSources = [
  "Cold Call", "Website", "Referral", "LinkedIn", "Trade Show",
  "Email Campaign", "Social Media", "Event", "Organic Search", "Paid Ads",
];
const leadTypes = ["International", "Domestic"];
const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];

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

const SelectField = ({ name, options, value, onChange }) => (
  <div className="h-[4.5rem]">
    <label className="block text-xs font-medium text-gray-700 mb-0.5">
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 border-gray-300 hover:border-gray-400"
    >
      <option value="">Select {name}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const AddLead = ({ onLeadAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [file, setFile] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [insertedCount, setInsertedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [uploadErrorsList, setUploadErrorsList] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsAppNo: "",
    departureCity: "",
    destination: "",
    expectedTravelDate: "",
    noOfDays: "",
    placesToCover: "",
    noOfPerson: "",
    noOfChild: "",
    childAges: [""],
    leadSource: "",
    leadType: "",
    tripType: "",
    leadStatus: "Hot",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // Only phone validation
  const validate = (data) => {
    const newErrors = {};
    if (!data.phone || data.phone.trim() === "") newErrors.phone = "Phone is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Child age handlers
  const handleChildAgeChange = (index, value) => {
    const newAges = [...formData.childAges];
    newAges[index] = value;
    setFormData(prev => ({ ...prev, childAges: newAges }));
  };

  const addChildAge = () => {
    setFormData(prev => ({ ...prev, childAges: [...prev.childAges, ""] }));
  };

  const removeChildAge = (index) => {
    const newAges = formData.childAges.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, childAges: newAges }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        phone: formData.phone.trim(),
        noOfDays: formData.noOfDays ? Number(formData.noOfDays) : undefined,
        noOfPerson: formData.noOfPerson ? Number(formData.noOfPerson) : undefined,
        noOfChild: formData.noOfChild ? Number(formData.noOfChild) : undefined,
        expectedTravelDate: formData.expectedTravelDate ? new Date(formData.expectedTravelDate) : undefined,
      };

      const res = await fetch("http://localhost:4000/leads/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add lead");
      }

      onLeadAdded?.();
      setIsOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        whatsAppNo: "",
        departureCity: "",
        destination: "",
        expectedTravelDate: "",
        noOfDays: "",
        placesToCover: "",
        noOfPerson: "",
        noOfChild: "",
        childAges: [""],
        leadSource: "",
        leadType: "",
        tripType: "",
        leadStatus: "Hot",
        notes: "",
      });
      setErrors({});
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadError("");
    setUploadSuccess("");
  };

  const mapRowToPayload = (row) => {
    const normalizeKey = (k) => k?.toString().trim().toLowerCase().replace(/\s+/g, "");
    const getField = (obj, keys) => {
      for (const k of keys) {
        if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
      }
      return undefined;
    };

    // Normalize keys to lower-case compact form
    const normalized = {};
    Object.keys(row || {}).forEach((key) => {
      normalized[normalizeKey(key)] = row[key];
    });

    const phoneVal = getField(normalized, [
      "phone",
      "phoneno",
      "contact",
      "contactnumber",
      "mobile",
      "mobileno",
      "whatsapp",
      "whatsappno",
    ]);

    return {
      phone: phoneVal ? String(phoneVal) : "",
      name: getField(normalized, ["name"]) || "",
      departureCity: getField(normalized, ["departurecity"]) || "",
      email: getField(normalized, ["email"]) || "",
      whatsAppNo: getField(normalized, ["whatsappno", "whatsapp"]) || "",
      destination: getField(normalized, ["destination"]) || "",
      expectedTravelDate: getField(normalized, ["expectedtraveldate"]) || null,
      noOfDays: getField(normalized, ["noofdays"]) || null,
      placesToCover: getField(normalized, ["placestocover"]) || "",
      noOfPerson: getField(normalized, ["noofperson"]) || null,
      noOfChild: getField(normalized, ["noofchild"]) || null,
      childAges: getField(normalized, ["childages", "childage"]) ? [].concat(getField(normalized, ["childages", "childage"])) : [],
      leadSource: getField(normalized, ["leadsource"]) || "",
      leadType: getField(normalized, ["leadtype"]) || "",
      tripType: getField(normalized, ["triptype"]) || "",
      company: getField(normalized, ["company"]) || "",
      leadStatus: getField(normalized, ["leadstatus"]) || "Hot",
      value: getField(normalized, ["value"]) || null,
      groupNumber: getField(normalized, ["groupnumber"]) || "",
      lastContact: getField(normalized, ["lastcontact"]) || null,
      notes: getField(normalized, ["notes"]) || "",
    };
  };

  // Client-side upload: parse excel and send rows one-by-one with realtime counters
  const handleFileUpload = async () => {
    if (!file) {
      setUploadError("Please select a file to upload.");
      return;
    }

    setUploadError("");
    setUploadSuccess("");
    setIsSubmitting(true);
    setTotalRecords(0);
    setProcessedCount(0);
    setInsertedCount(0);
    setSkippedCount(0);
    setUploadErrorsList([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      setTotalRecords(rows.length);

      let localInserted = 0;
      let localSkipped = 0;

      for (let i = 0; i < rows.length; i++) {
        const rawRow = rows[i];
        const payload = mapRowToPayload(rawRow);

        // basic required field check (phone)
        if (!payload.phone) {
          localSkipped++;
          setSkippedCount(localSkipped);
          setUploadErrorsList((arr) => [...arr, `Row ${i + 2}: Missing phone`]);
          setProcessedCount((p) => p + 1);
          continue;
        }

        try {
          const res = await fetch("http://localhost:4000/leads/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            localInserted++;
            setInsertedCount(localInserted);
          } else {
            const errJson = await res.json().catch(() => ({}));
            localSkipped++;
            setSkippedCount(localSkipped);
            setUploadErrorsList((arr) => [...arr, `Row ${i + 2}: ${errJson.message || 'Server error'}`]);
          }
        } catch (err) {
          localSkipped++;
          setSkippedCount(localSkipped);
          setUploadErrorsList((arr) => [...arr, `Row ${i + 2}: ${err.message}`]);
        } finally {
          setProcessedCount((p) => p + 1);
        }
      }

      setUploadSuccess(`Upload finished: ${localInserted} inserted, ${localSkipped} skipped.`);
      onLeadAdded?.();
      setFile(null);
      const el = document.getElementById("file-upload-input");
      if (el) el.value = "";
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
      >
        <Plus className="w-4 h-4" /> Add Lead
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="large">
        <div className="flex flex-col h-full max-h-[95vh]">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Add New Lead</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-900 font-bold">
              ×
            </button>
          </div>

          <div className="p-4 flex space-x-4 border-b">
            <button
              onClick={() => setTab("manual")}
              className={`px-4 py-2 font-medium rounded ${tab === "manual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setTab("upload")}
              className={`px-4 py-2 font-medium rounded ${tab === "upload" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              Upload Leads
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {tab === "manual" && (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputField name="name" value={formData.name} onChange={handleChange} />
                  <InputField name="phone" value={formData.phone} onChange={handleChange} required error={errors.phone} placeholder="Comma separated if multiple" />
                  <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} />
                  <InputField name="email" value={formData.email} onChange={handleChange} type="email" />
                  <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
                  <SelectField name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} />
                  <SelectField name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} />
                  <SelectField name="tripType" options={tripTypes} value={formData.tripType} onChange={handleChange} />
                  <SelectField name="leadStatus" options={leadStatuses} value={formData.leadStatus} onChange={handleChange} />
                  <InputField name="noOfDays" value={formData.noOfDays} onChange={handleChange} type="number" />
                  <InputField name="noOfPerson" value={formData.noOfPerson} onChange={handleChange} type="number" />
                  <InputField name="noOfChild" value={formData.noOfChild} onChange={handleChange} type="number" />

                  {/* Child Ages */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Child Ages</label>
                    {formData.childAges.map((age, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => handleChildAgeChange(index, e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Child age"
                        />
                        {formData.childAges.length > 1 && (
                          <button type="button" onClick={() => removeChildAge(index)} className="text-red-500 font-bold px-2">×</button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addChildAge} className="text-blue-600 text-sm mt-1">Add Age</button>
                  </div>

                  <InputField name="expectedTravelDate" value={formData.expectedTravelDate} onChange={handleChange} type="date" />
                  <InputField name="placesToCover" value={formData.placesToCover} onChange={handleChange} />
                  <InputField name="notes" value={formData.notes} onChange={handleChange} />
                </div>

                {apiError && (
                  <p className="text-red-600 mt-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> {apiError}
                  </p>
                )}

                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Lead"}
                </button>
              </form>
            )}

            {tab === "upload" && (
              <div className="flex flex-col space-y-4 max-w-md">
                <p className="text-sm text-gray-600">
                  Upload a CSV file with lead data. The CSV should have columns matching lead fields like: name, email, phone, departureCity, etc.
                </p>

                <input
                  type="file"
                  id="file-upload-input"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="border p-2 rounded"
                />

                {uploadError && (
                  <p className="text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> {uploadError}
                  </p>
                )}
                {uploadSuccess && (
                  <p className="text-green-600 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5" /> {uploadSuccess}
                  </p>
                )}

                {/* Realtime progress */}
                {(isSubmitting || totalRecords > 0) && (
                  <div className="mt-3 w-full">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${totalRecords ? Math.round((processedCount / totalRecords) * 100) : 0}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-700 mt-2">
                      Processed: {processedCount}/{totalRecords} • Inserted: {insertedCount} • Skipped: {skippedCount}
                    </div>
                    {uploadErrorsList.length > 0 && (
                      <div className="mt-2 text-xs text-red-600 max-h-32 overflow-auto border p-2 rounded bg-red-50">
                        <strong>Errors:</strong>
                        <ul className="list-disc ml-5">
                          {uploadErrorsList.slice(0, 20).map((err, idx) => (
                            <li key={idx}>{err}</li>
                          ))}
                          {uploadErrorsList.length > 20 && <li>and {uploadErrorsList.length - 20} more...</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleFileUpload}
                  disabled={isSubmitting || !file}
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isSubmitting ? "Uploading..." : "Upload Leads"}
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddLead;
