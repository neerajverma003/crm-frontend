


// import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import { Eye, Edit2, Trash2, ArrowUpDown, X, Loader } from "lucide-react";

// const LeadTable = ({ searchText = "", selectedStatus = "All Status", refreshTrigger }) => {
//     const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//     const [selectedLeads, setSelectedLeads] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(50); // Fetch larger chunks from API

//     // Optimized lead state - store all pages' data with cache
//     const [leads, setLeads] = useState([]);
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [totalPages, setTotalPages] = useState(0);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // Cache for API calls - avoid redundant requests
//     const cacheRef = useRef({
//         normal: {},
//         employee: {},
//     });
//     const lastFetchRef = useRef({
//         search: "",
//         status: "",
//         page: 1,
//     });

//     // Employee list filter
//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All Employees");

//     // Modal states
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//     const [currentLead, setCurrentLead] = useState(null);

//     // ================================================
//     // FETCH ALL EMPLOYEE NAMES FROM ENTIRE DATASET
//     // ================================================
//     const fetchAllEmployees = useCallback(async () => {
//         try {
//             // Fetch all employee leads to extract unique employee names
//             const response = await fetch("http://localhost:4000/employeelead/all");
//             const result = await response.json();

//             console.log("Employee leads response:", result);

//             if (result.success && result.leads && Array.isArray(result.leads)) {
//                 // Extract unique employee names from all leads
//                 const empNames = result.leads
//                     .map((lead) => lead.employee?.fullName || lead.employee?.name)
//                     .filter((name) => name && name.trim() !== "");

//                 const uniqueEmployees = [...new Set(empNames)];
//                 const sortedEmployees = uniqueEmployees.sort();

//                 console.log("Extracted employees:", sortedEmployees);
//                 setEmployeeList(sortedEmployees);
//             } else {
//                 console.warn("Unexpected response structure:", result);
//             }
//         } catch (error) {
//             console.error("Error fetching all employees:", error);
//         }
//     }, []);

//     // ================================================
//     // OPTIMIZED FETCH - Uses pagination & caching
//     // ================================================
//     const fetchLeadData = useCallback(
//         async (pageNum = 1) => {
//             try {
//                 setIsLoading(true);
//                 setError(null);

//                 // Build query strings with filters
//                 const normalParams = new URLSearchParams({
//                     page: pageNum,
//                     limit: itemsPerPage,
//                     ...(searchText && { search: searchText }),
//                     ...(selectedStatus !== "All Status" && { status: selectedStatus }),
//                 });

//                 const empParams = new URLSearchParams({
//                     page: pageNum,
//                     limit: itemsPerPage,
//                     ...(searchText && { search: searchText }),
//                     ...(selectedStatus !== "All Status" && { status: selectedStatus }),
//                 });

//                 // Fetch both normal and employee leads in parallel
//                 const [normalRes, empRes] = await Promise.all([
//                     fetch(`http://localhost:4000/leads?${normalParams.toString()}`),
//                     fetch(`http://localhost:4000/employeelead/all?${empParams.toString()}`),
//                 ]);

//                 const normalJson = await normalRes.json();
//                 const empJson = await empRes.json();

//                 // Process normal leads
//                 const normalData = normalJson.success ? normalJson.data : [];
//                 const normalPagination = normalJson.pagination || {};

//                 // Process employee leads
//                 const empData = empJson.success ? empJson.leads : [];
//                 const empPagination = empJson.pagination || {};

//                 // Combine leads with type indicator
//                 const combinedLeads = [...normalData.map((l) => ({ ...l, type: "normal" })), ...empData.map((l) => ({ ...l, type: "employee" }))];

//                 // Sort by creation date
//                 combinedLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//                 setLeads(combinedLeads);

//                 // Use total from API - add both normal and employee lead totals
//                 const normalTotal = normalPagination.totalRecords || 0;
//                 const empTotal = empPagination.totalRecords || 0;
//                 const totalFromApi = normalTotal + empTotal;

//                 setTotalRecords(totalFromApi);
//                 setTotalPages(Math.ceil(totalFromApi / itemsPerPage));

//                 lastFetchRef.current = {
//                     search: searchText,
//                     status: selectedStatus,
//                     page: pageNum,
//                 };
//             } catch (error) {
//                 console.error("Error fetching leads:", error);
//                 setError(error.message);
//                 setLeads([]);
//             } finally {
//                 setIsLoading(false);
//             }
//         },
//         [searchText, selectedStatus, itemsPerPage],
//     );

//     // Trigger fetch when search, status, or refresh changes
//     useEffect(() => {
//         setCurrentPage(1);
//         fetchLeadData(1);
//     }, [searchText, selectedStatus, refreshTrigger, fetchLeadData]);

//     // Fetch all employees once on mount
//     useEffect(() => {
//         fetchAllEmployees();
//     }, [fetchAllEmployees]);

//     // Fetch new page when pagination changes
//     useEffect(() => {
//         if (currentPage !== lastFetchRef.current.page) {
//             fetchLeadData(currentPage);
//         }
//     }, [currentPage, fetchLeadData]);

//     // Filter leads by employee (client-side, after API provides data)
//     const filteredLeads = useMemo(() => {
//         return leads.filter((lead) => {
//             const employeeMatch =
//                 selectedEmployee === "All Employees" ||
//                 (lead.type === "employee" && lead.employee?.fullName === selectedEmployee) ||
//                 (lead.type === "normal" && selectedEmployee === "All Employees");
//             return employeeMatch;
//         });
//     }, [leads, selectedEmployee]);

//     // Sorting
//     const sortedLeads = useMemo(() => {
//         if (!sortConfig.key) return filteredLeads;

//         return [...filteredLeads].sort((a, b) => {
//             let aValue = a[sortConfig.key];
//             let bValue = b[sortConfig.key];

//             if (sortConfig.key === "value") {
//                 aValue = parseFloat(aValue?.replace(/[$,]/g, "") || 0);
//                 bValue = parseFloat(bValue?.replace(/[$,]/g, "") || 0);
//             }

//             if (sortConfig.key === "lastContact" || sortConfig.key === "createdAt") {
//                 aValue = new Date(aValue);
//                 bValue = new Date(bValue);
//             }

//             if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//             if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//             return 0;
//         });
//     }, [filteredLeads, sortConfig]);

//     // Use API paginated data directly
//     const paginatedLeads = sortedLeads;
//     // Use the actual totalPages from API response, not calculated from current page data
//     const displayTotalPages = totalPages || 1;

//     // ================================
//     // Handlers
//     // ================================
//     const handleSort = (key) => {
//         setSortConfig((current) => ({
//             key,
//             direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
//         }));
//     };

//     const handleSelectLead = (leadId) => {
//         setSelectedLeads((current) => (current.includes(leadId) ? current.filter((id) => id !== leadId) : [...current, leadId]));
//     };

//     const handleSelectAll = () => {
//         setSelectedLeads(selectedLeads.length === paginatedLeads.length ? [] : paginatedLeads.map((lead) => lead._id));
//     };

//     const handleView = (lead) => {
//         setCurrentLead(lead);
//         setIsViewModalOpen(true);
//     };

//     const handleEdit = (lead) => {
//         setCurrentLead(lead);
//         setIsEditModalOpen(true);
//     };

//     const handleDelete = async (lead) => {
//         if (!window.confirm(`Delete lead ${lead.name}?`)) return;
//         try {
//             await fetch(`http://localhost:4000/leads/${lead._id}`, { method: "DELETE" });
//             setLeads((prev) => prev.filter((l) => l._id !== lead._id));
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     const handleUpdateLead = async (updatedLead) => {
//         try {
//             const isEmployeeLead = updatedLead?.type === "employee" || currentLead?.type === "employee";
//             const url = isEmployeeLead ? `http://localhost:4000/employeelead/${updatedLead._id}` : `http://localhost:4000/leads/${updatedLead._id}`;
//             const method = isEmployeeLead ? "PUT" : "PATCH";

//             const response = await fetch(url, {
//                 method,
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(updatedLead),
//             });

//             const result = await response.json();
//             if (result?.success) {
//                 const next = result.data ?? updatedLead;
//                 setLeads((prev) => prev.map((l) => (l._id === next._id ? { ...l, ...next } : l)));
//                 setIsEditModalOpen(false);
//             }
//         } catch (e) {
//             console.error("Update error:", e);
//         }
//     };

//     // ================================================
//     // EMPLOYEE FILTER
//     // ================================================
//     const EmployeeFilter = () => {
//         console.log("EmployeeList in dropdown:", employeeList);
//         return (
//             <div className="mb-3">
//                 <label className="mr-2 px-2 text-sm font-medium">Filter by Employee:</label>
//                 <select
//                     value={selectedEmployee}
//                     onChange={(e) => setSelectedEmployee(e.target.value)}
//                     className="rounded border px-3 py-2"
//                 >
//                     <option value="All Employees">All Employees</option>
//                     {employeeList && employeeList.length > 0 ? (
//                         employeeList.map((emp, i) => (
//                             <option
//                                 key={i}
//                                 value={emp}
//                             >
//                                 {emp}
//                             </option>
//                         ))
//                     ) : (
//                         <option disabled>No employees found</option>
//                     )}
//                 </select>
//             </div>
//         );
//     };

//     // ==================================================
//     // EDIT MODAL (unchanged)
//     // ==================================================
//     // *** keeping your full edit modal exactly as you posted ***
//     const EditModal = ({ lead, onClose, onSave }) => {
//         const [formData, setFormData] = useState({
//             ...lead,
//             placesToCoverArray: lead.placesToCover?.split(",").map((p) => p.trim()) || [],
//             childAges: lead.childAges || [],
//             customNoOfDays: "",
//         });

//         const [placeInput, setPlaceInput] = useState("");
//         const [childAgeInput, setChildAgeInput] = useState("");

//         const handleAddPlace = (e) => {
//             if (e.key === "Enter" && placeInput.trim()) {
//                 setFormData((p) => ({
//                     ...p,
//                     placesToCoverArray: [...p.placesToCoverArray, placeInput.trim()],
//                 }));
//                 setPlaceInput("");
//             }
//         };

//         const handleRemovePlace = (idx) => {
//             setFormData((p) => ({
//                 ...p,
//                 placesToCoverArray: p.placesToCoverArray.filter((_, i) => i !== idx),
//             }));
//         };

//         const handleAddChildAge = (e) => {
//             if (e.key === "Enter" && childAgeInput.trim()) {
//                 setFormData((p) => ({
//                     ...p,
//                     childAges: [...p.childAges, childAgeInput.trim()],
//                 }));
//                 setChildAgeInput("");
//             }
//         };

//         const handleRemoveChildAge = (idx) => {
//             setFormData((p) => ({
//                 ...p,
//                 childAges: p.childAges.filter((_, i) => i !== idx),
//             }));
//         };

//         const handleSubmit = (e) => {
//             e.preventDefault();
//             const isEmployeeLead = lead?.type === "employee";

//             const normalized = { ...formData };

//             normalized.placesToCover = formData.placesToCoverArray.join(", ");

//             if (formData.expectedTravelDate) {
//                 const dt = new Date(formData.expectedTravelDate);
//                 normalized.expectedTravelDate = Number.isNaN(dt.getTime()) ? undefined : dt;
//             }

//             const toNum = (v) => (v === "" || v === null || v === undefined ? undefined : Number(v));
//             normalized.noOfPerson = toNum(formData.noOfPerson);
//             normalized.noOfChild = toNum(formData.noOfChild);

//             const ages = Array.isArray(formData.childAges) ? formData.childAges.map((a) => Number(a)).filter((n) => !Number.isNaN(n)) : [];
//             normalized.childAges = ages;

//             if (isEmployeeLead) {
//                 normalized.noOfDays = formData.noOfDays === "Others" ? formData.customNoOfDays : formData.noOfDays;
//             } else {
//                 const nd = formData.noOfDays === "Others" ? formData.customNoOfDays : formData.noOfDays;
//                 normalized.noOfDays = nd ? Number(nd) : undefined;
//             }

//             onSave(normalized);
//         };

//         if (!lead) return null;

//         const leadSources = [
//             "Cold Call",
//             "Website",
//             "Referral",
//             "LinkedIn",
//             "Trade Show",
//             "Email Campaign",
//             "Social Media",
//             "Event",
//             "Organic Search",
//             "Paid Ads",
//         ];
//         const leadTypes = ["International", "Domestic"];
//         const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
//         const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];
//         const tripDurations = [
//             "1n/2d",
//             "2n/3d",
//             "3n/4d",
//             "4n/5d",
//             "5n/6d",
//             "6n/7d",
//             "7n/8d",
//             "8n/9d",
//             "9n/10d",
//             "10n/11d",
//             "11n/12d",
//             "12n/13d",
//             "13n/14d",
//             "14n/15d",
//             "Others",
//         ];

//         const toDateInputValue = (d) => {
//             try {
//                 const dt = d ? new Date(d) : null;
//                 if (!dt || Number.isNaN(dt.getTime())) return "";
//                 const y = dt.getFullYear();
//                 const m = String(dt.getMonth() + 1).padStart(2, "0");
//                 const day = String(dt.getDate()).padStart(2, "0");
//                 return `${y}-${m}-${day}`;
//             } catch {
//                 return "";
//             }
//         };

//         return (
//             <div
//                 className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
//                 onClick={onClose}
//             >
//                 <div
//                     className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-lg"
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     <div className="flex items-center justify-between border-b p-4">
//                         <h2 className="text-lg font-bold text-gray-900">Edit Lead</h2>
//                         <button
//                             onClick={onClose}
//                             className="font-bold text-gray-500 hover:text-gray-900"
//                         >
//                             ×
//                         </button>
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-4">
//                         <form
//                             onSubmit={handleSubmit}
//                             className="grid grid-cols-1 gap-4 sm:grid-cols-2"
//                         >
//                             {[
//                                 { key: "name", type: "text" },
//                                 { key: "email", type: "email" },
//                                 { key: "phone", type: "text" },
//                                 { key: "whatsAppNo", type: "text" },
//                                 { key: "company", type: "text" },
//                                 { key: "value", type: "text" },
//                                 { key: "departureCity", type: "text" },
//                                 { key: "destination", type: "text" },
//                             ].map(({ key, type }) => (
//                                 <div
//                                     key={key}
//                                     className="h-[4.5rem]"
//                                 >
//                                     <label className="mb-0.5 block text-xs font-medium text-gray-700">{key.replace(/([A-Z])/g, " $1")}</label>
//                                     <input
//                                         type={type}
//                                         name={key}
//                                         value={formData[key] || ""}
//                                         onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
//                                         className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                     />
//                                 </div>
//                             ))}

//                             <div className="h-[4.5rem]">
//                                 <label className="mb-0.5 block text-xs font-medium text-gray-700">Expected Travel Date</label>
//                                 <input
//                                     type="date"
//                                     name="expectedTravelDate"
//                                     value={toDateInputValue(formData.expectedTravelDate)}
//                                     onChange={(e) => setFormData({ ...formData, expectedTravelDate: e.target.value })}
//                                     className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                 />
//                             </div>

//                             <div className="h-[4.5rem]">
//                                 <label className="mb-0.5 block text-xs font-medium text-gray-700">No. of Days</label>
//                                 <select
//                                     name="noOfDays"
//                                     value={formData.noOfDays || ""}
//                                     onChange={(e) => setFormData({ ...formData, noOfDays: e.target.value })}
//                                     className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                 >
//                                     <option value="">Select No. of Days</option>
//                                     {tripDurations.map((opt) => (
//                                         <option
//                                             key={opt}
//                                             value={opt}
//                                         >
//                                             {opt}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {formData.noOfDays === "Others" && (
//                                 <div className="h-[4.5rem]">
//                                     <label className="mb-0.5 block text-xs font-medium text-gray-700">Custom Days</label>
//                                     <input
//                                         name="customNoOfDays"
//                                         value={formData.customNoOfDays || ""}
//                                         onChange={(e) => setFormData({ ...formData, customNoOfDays: e.target.value })}
//                                         className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                     />
//                                 </div>
//                             )}

//                             <div className="sm:col-span-2">
//                                 <label className="mb-0.5 block text-xs font-medium text-gray-700">Places to Cover</label>
//                                 <input
//                                     value={placeInput}
//                                     onChange={(e) => setPlaceInput(e.target.value)}
//                                     onKeyDown={handleAddPlace}
//                                     placeholder="Type and press Enter"
//                                     className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                 />
//                                 <div className="mt-2 flex flex-wrap gap-2">
//                                     {formData.placesToCoverArray.map((p, i) => (
//                                         <span
//                                             key={`${p}-${i}`}
//                                             className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700"
//                                         >
//                                             {p}
//                                             <button
//                                                 type="button"
//                                                 onClick={() => handleRemovePlace(i)}
//                                             >
//                                                 x
//                                             </button>
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>

//                             {[{ key: "noOfPerson" }, { key: "noOfChild" }].map(({ key }) => (
//                                 <div
//                                     key={key}
//                                     className="h-[4.5rem]"
//                                 >
//                                     <label className="mb-0.5 block text-xs font-medium text-gray-700">{key.replace(/([A-Z])/g, " $1")}</label>
//                                     <input
//                                         name={key}
//                                         value={formData[key] || ""}
//                                         onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
//                                         className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                     />
//                                 </div>
//                             ))}

//                             <div className="sm:col-span-2">
//                                 <label className="mb-0.5 block text-xs font-medium text-gray-700">Child Ages</label>
//                                 <input
//                                     value={childAgeInput}
//                                     onChange={(e) => setChildAgeInput(e.target.value)}
//                                     onKeyDown={handleAddChildAge}
//                                     placeholder="Enter age and press Enter"
//                                     className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                 />
//                                 <div className="mt-2 flex flex-wrap gap-2">
//                                     {formData.childAges.map((age, i) => (
//                                         <span
//                                             key={`${age}-${i}`}
//                                             className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-sm text-green-700"
//                                         >
//                                             {age}
//                                             <button
//                                                 type="button"
//                                                 onClick={() => handleRemoveChildAge(i)}
//                                             >
//                                                 x
//                                             </button>
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="h-[4.5rem]">
//                                 <label className="mb-0.5 block text-xs font-medium text-gray-700">Lead Source</label>
//                                 <select
//                                     name="leadSource"
//                                     value={formData.leadSource || ""}
//                                     onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
//                                     className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                 >
//                                     <option value="">Select Lead Source</option>
//                                     {leadSources.map((opt) => (
//                                         <option
//                                             key={opt}
//                                             value={opt}
//                                         >
//                                             {opt}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="h-[4.5rem]">
//                                 <label className="mb-0.5 block text-xs font-medium text-gray-700">Lead Type</label>
//                                 <select
//                                     name="leadType"
//                                     value={formData.leadType || ""}
//                                     onChange={(e) => setFormData({ ...formData, leadType: e.target.value })}
//                                     className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                 >
//                                     <option value="">Select Lead Type</option>
//                                     {leadTypes.map((opt) => (
//                                         <option
//                                             key={opt}
//                                             value={opt}
//                                         >
//                                             {opt}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="h-[4.5rem]">
//                                 <label className="mb-0.5 block text-xs font-medium text-gray-700">Trip Type</label>
//                                 <select
//                                     name="tripType"
//                                     value={formData.tripType || ""}
//                                     onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
//                                     className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                 >
//                                     <option value="">Select Trip Type</option>
//                                     {tripTypes.map((opt) => (
//                                         <option
//                                             key={opt}
//                                             value={opt}
//                                         >
//                                             {opt}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="h-[4.5rem]">
//                                 <label className="mb-0.5 block text-xs font-medium text-gray-700">Lead Status</label>
//                                 <select
//                                     name="leadStatus"
//                                     value={formData.leadStatus || "Cold"}
//                                     onChange={(e) => setFormData({ ...formData, leadStatus: e.target.value })}
//                                     className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                 >
//                                     {leadStatuses.map((opt) => (
//                                         <option
//                                             key={opt}
//                                             value={opt}
//                                         >
//                                             {opt}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="h-[4.5rem]">
//                                 <label className="mb-0.5 block text-xs font-medium text-gray-700">Group Number</label>
//                                 <input
//                                     name="groupNumber"
//                                     value={formData.groupNumber || ""}
//                                     onChange={(e) => setFormData({ ...formData, groupNumber: e.target.value })}
//                                     className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                 />
//                             </div>

//                             <div className="sm:col-span-2">
//                                 <label className="mb-0.5 block text-xs font-medium text-gray-700">Notes</label>
//                                 <textarea
//                                     name="notes"
//                                     value={formData.notes || ""}
//                                     onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                                     className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                 />
//                             </div>

//                             <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
//                                 <button
//                                     type="button"
//                                     onClick={onClose}
//                                     className="rounded bg-gray-200 px-4 py-2"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="rounded bg-blue-600 px-4 py-2 text-white"
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     // =========================================================
//     // UPDATED VIEW MODAL (individual fields – no JSON)
//     // =========================================================
//     const ViewModal = ({ lead, onClose }) => {
//         if (!lead) return null;

//         const fields = [
//             { label: "Name", value: lead.name },
//             { label: "Email", value: lead.email },
//             { label: "Phone", value: lead.phone },
//             { label: "WhatsApp No", value: lead.whatsAppNo },
//             { label: "Departure City", value: lead.departureCity },
//             { label: "Destination", value: lead.destination },
//             { label: "Expected Travel Date", value: lead.expectedTravelDate },
//             { label: "No. of Days", value: lead.noOfDays },
//             {
//                 label: "Places to Cover",
//                 value: Array.isArray(lead.placesToCover) ? lead.placesToCover.join(", ") : lead.placesToCover,
//             },
//             { label: "No. of Person", value: lead.noOfPerson },
//             { label: "No. of Child", value: lead.noOfChild },
//             {
//                 label: "Child Ages",
//                 value: Array.isArray(lead.childAges) ? lead.childAges.join(", ") : lead.childAges,
//             },
//             { label: "Lead Source", value: lead.leadSource },
//             { label: "Lead Type", value: lead.leadType },
//             { label: "Trip Type", value: lead.tripType },
//             { label: "Lead Status", value: lead.leadStatus },
//             { label: "Group Number", value: lead.groupNumber },
//             { label: "Last Contact", value: lead.lastContact },
//             { label: "Notes", value: lead.notes },
//             { label: "Created At", value: lead.createdAt },
//             { label: "Updated At", value: lead.updatedAt },
//             { label: "Type", value: lead.type },
//             { label: "Employee", value: lead.employee?.fullName || "—" },
//         ];

//         return (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//                 <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
//                     <h2 className="mb-4 text-center text-lg font-bold">Lead Details</h2>

//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         {fields.map((field, index) => (
//                             <div
//                                 key={index}
//                                 className="rounded border p-3"
//                             >
//                                 <p className="text-xs font-bold uppercase text-gray-500">{field.label}</p>
//                                 <p className="mt-1 text-sm text-gray-800">{field.value || "—"}</p>
//                             </div>
//                         ))}
//                     </div>

//                     <button
//                         onClick={onClose}
//                         className="mt-6 w-full rounded bg-red-500 px-4 py-2 text-white"
//                     >
//                         Close
//                     </button>
//                 </div>
//             </div>
//         );
//     };

//     // ========================================================
//     // TABLE UI (updated with loading states)
//     // ========================================================

//     const SortableHeader = ({ column, children }) => (
//         <th
//             className="cursor-pointer px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 sm:px-6"
//             onClick={() => handleSort(column)}
//         >
//             <div className="flex items-center gap-2">
//                 {children}
//                 <ArrowUpDown className="h-4 w-4" />
//             </div>
//         </th>
//     );

//     if (isLoading && leads.length === 0) {
//         return (
//             <div className="py-12 text-center">
//                 <Loader className="mx-auto mb-3 h-8 w-8 animate-spin text-blue-600" />
//                 <h3 className="text-lg font-medium">Loading leads...</h3>
//                 <p className="mt-2 text-sm text-gray-500">Fetching data from server</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="py-12 text-center">
//                 <h3 className="text-lg font-medium text-red-600">Error loading leads</h3>
//                 <p className="mt-2 text-sm text-gray-500">{error}</p>
//             </div>
//         );
//     }

//     if (filteredLeads.length === 0 && !isLoading) {
//         return (
//             <div className="py-12 text-center">
//                 <h3 className="text-lg font-medium">No leads found</h3>
//                 <p className="mt-2 text-sm text-gray-500">Try adjusting your filters</p>
//             </div>
//         );
//     }

//     return (
//         <div className="w-full px-2 sm:px-4">
//             <EmployeeFilter />

//             {isLoading && (
//                 <div className="mb-3 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
//                     <Loader className="h-4 w-4 animate-spin" />
//                     Loading leads...
//                 </div>
//             )}

//             {/* Desktop View */}
//             <div className="relative hidden overflow-x-auto md:block">
//                 {isLoading && <div className="absolute inset-0 z-10 rounded-lg bg-white/30" />}
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-3 py-4">
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
//                                     onChange={handleSelectAll}
//                                     disabled={isLoading}
//                                 />
//                             </th>

//                             <SortableHeader column="name">Name</SortableHeader>
//                             <SortableHeader column="email">Email</SortableHeader>
//                             <SortableHeader column="phone">Phone</SortableHeader>
//                             <SortableHeader column="groupNumber">Group No</SortableHeader>
//                             <SortableHeader column="destination">Destination</SortableHeader>
//                             <SortableHeader column="leadSource">Source</SortableHeader>
//                             <SortableHeader column="employee">Employee</SortableHeader>

//                             <th className="px-3 py-4 text-xs">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody className="divide-y divide-gray-200 bg-white">
//                         {paginatedLeads.map((lead) => (
//                             <tr key={lead._id}>
//                                 <td className="px-3 py-4">
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedLeads.includes(lead._id)}
//                                         onChange={() => handleSelectLead(lead._id)}
//                                     />
//                                 </td>

//                                 <td className="px-3 py-4 font-medium text-gray-900">{lead.name}</td>
//                                 <td className="px-3 py-4 text-sm text-gray-600">{lead.email}</td>
//                                 <td className="px-3 py-4 text-sm text-gray-600">{lead.phone}</td>
//                                 <td className="px-3 py-4 text-sm text-gray-600">{lead.groupNumber || "—"}</td>
//                                 <td className="px-3 py-4 text-sm text-gray-600">{lead.destination}</td>
//                                 <td className="px-3 py-4 text-sm text-gray-600">{lead.leadSource}</td>
//                                 <td className="px-3 py-4 text-sm text-gray-600">{lead.type === "employee" ? lead.employee?.fullName : "—"}</td>

//                                 <td className="flex gap-3 px-3 py-4">
//                                     <button
//                                         className="text-blue-600 hover:text-blue-800"
//                                         onClick={() => handleView(lead)}
//                                         title="View"
//                                     >
//                                         <Eye size={18} />
//                                     </button>
//                                     <button
//                                         className="text-green-600 hover:text-green-800"
//                                         onClick={() => handleEdit(lead)}
//                                         title="Edit"
//                                     >
//                                         <Edit2 size={18} />
//                                     </button>
//                                     <button
//                                         className="text-red-600 hover:text-red-800"
//                                         onClick={() => handleDelete(lead)}
//                                         title="Delete"
//                                     >
//                                         <Trash2 size={18} />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Mobile View - Card Layout */}
//             <div className="space-y-3 md:hidden">
//                 {paginatedLeads.map((lead) => (
//                     <div
//                         key={lead._id}
//                         className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
//                     >
//                         <div className="mb-3 flex items-start justify-between gap-2">
//                             <div className="flex-1">
//                                 <h3 className="text-sm font-bold text-gray-900 sm:text-base">{lead.name}</h3>
//                                 <p className="mt-1 text-xs text-gray-500">{lead.email}</p>
//                             </div>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedLeads.includes(lead._id)}
//                                 onChange={() => handleSelectLead(lead._id)}
//                                 className="mt-1"
//                             />
//                         </div>

//                         <div className="mb-4 space-y-2 text-xs sm:text-sm">
//                             <div className="flex justify-between">
//                                 <span className="font-medium text-gray-600">Phone:</span>
//                                 <span className="font-medium text-gray-900">{lead.phone}</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="font-medium text-gray-600">Employee:</span>
//                                 <span className="text-gray-900">{lead.type === "employee" ? lead.employee?.fullName : "—"}</span>
//                             </div>
//                         </div>

//                         <div className="flex justify-end gap-2 border-t pt-3">
//                             <button
//                                 className="flex items-center gap-1 rounded bg-blue-50 px-3 py-2 text-sm text-blue-600 transition hover:bg-blue-100"
//                                 onClick={() => handleView(lead)}
//                                 title="View"
//                             >
//                                 <Eye size={16} />
//                                 <span className="hidden sm:inline">View</span>
//                             </button>
//                             <button
//                                 className="flex items-center gap-1 rounded bg-green-50 px-3 py-2 text-sm text-green-600 transition hover:bg-green-100"
//                                 onClick={() => handleEdit(lead)}
//                                 title="Edit"
//                             >
//                                 <Edit2 size={16} />
//                                 <span className="hidden sm:inline">Edit</span>
//                             </button>
//                             <button
//                                 className="flex items-center gap-1 rounded bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100"
//                                 onClick={() => handleDelete(lead)}
//                                 title="Delete"
//                             >
//                                 <Trash2 size={16} />
//                                 <span className="hidden sm:inline">Delete</span>
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Pagination */}
//             <div className="mt-6 flex flex-col items-center justify-between gap-3 px-2 sm:flex-row sm:px-0">
//                 <button
//                     onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                     disabled={currentPage === 1 || isLoading}
//                     className="w-full rounded bg-blue-600 px-3 py-2 text-sm text-white transition disabled:bg-gray-300 sm:w-auto sm:px-4 sm:py-2"
//                 >
//                     ← Previous
//                 </button>

//                 <div className="w-full text-center text-xs text-gray-600 sm:w-auto sm:text-sm">
//                     <div>
//                         Page <strong>{currentPage}</strong> of <strong>{displayTotalPages}</strong>
//                     </div>
//                     <div className="mt-1 text-xs">
//                         Total: <strong>{totalRecords}</strong> leads
//                     </div>
//                 </div>

//                 <button
//                     onClick={() => setCurrentPage((p) => Math.min(p + 1, displayTotalPages))}
//                     disabled={currentPage >= displayTotalPages || isLoading}
//                     className="w-full rounded bg-blue-600 px-3 py-2 text-sm text-white transition disabled:bg-gray-300 sm:w-auto sm:px-4 sm:py-2"
//                 >
//                     Next →
//                 </button>
//             </div>

//             {isEditModalOpen && (
//                 <EditModal
//                     lead={currentLead}
//                     onClose={() => setIsEditModalOpen(false)}
//                     onSave={handleUpdateLead}
//                 />
//             )}

//             {isViewModalOpen && (
//                 <ViewModal
//                     lead={currentLead}
//                     onClose={() => setIsViewModalOpen(false)}
//                 />
//             )}
//         </div>
//     );
// };

// export default LeadTable;





import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Eye, Edit2, Trash2, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const LeadTable = ({ searchText = "", searchType = "name", selectedStatus = "All Status", refreshTrigger, fromDate = "", toDate = "" }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  const [leads, setLeads] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("Select Employee");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);



  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = 2 * Math.min(currentPage * itemsPerPage, totalRecords);

  // Fetch all employees
  const fetchAllEmployees = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:4000/employeelead/all");
      const result = await response.json();

      if (result.success && result.leads && Array.isArray(result.leads)) {
        const empNames = result.leads
          .map((lead) => lead.employee?.fullName || lead.employee?.name)
          .filter((name) => name && name.trim() !== "");

        const uniqueEmployees = [...new Set(empNames)];
        const sortedEmployees = uniqueEmployees.sort();

        setEmployeeList(sortedEmployees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }, []);

  // Fetch lead data
  const fetchLeadData = useCallback(
    async (pageNum = 1) => {
      try {
        setIsLoading(true);
        setError(null);

        const normalParams = new URLSearchParams({
          page: pageNum,
          limit: itemsPerPage,
          ...(searchText && { search: searchText, searchField: searchType }),
          ...(selectedStatus !== "All Status" && { status: selectedStatus }),
        });

        const empParams = new URLSearchParams({
          page: pageNum,
          limit: itemsPerPage,
          ...(searchText && { search: searchText, searchField: searchType }),
          ...(selectedStatus !== "All Status" && { status: selectedStatus }),
        });

        console.log("Search Type:", searchType);
        console.log("Search Text:", searchText);
        console.log("Normal Params:", normalParams.toString());

        const [normalRes, empRes] = await Promise.all([
          fetch(`http://localhost:4000/leads/recentleads?${normalParams.toString()}`),
          fetch(`http://localhost:4000/employeelead/all?${empParams.toString()}`),
        ]);

        const normalJson = await normalRes.json();
        const empJson = await empRes.json();

        const normalData = normalJson.success ? normalJson.data : [];
        const empData = empJson.success ? empJson.leads : [];

        const combinedLeads = [
          ...normalData.map((l) => ({ ...l, type: "normal" })),
          ...empData.map((l) => ({ ...l, type: "employee" })),
        ];

        combinedLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setLeads(combinedLeads);

        const normalTotal = normalJson.pagination?.totalRecords || 0;
        const empTotal = empJson.pagination?.totalRecords || 0;
        const totalFromApi = normalTotal + empTotal;

        setTotalRecords(totalFromApi);
        setTotalPages(Math.ceil(totalFromApi / (2 * itemsPerPage)));
      } catch (error) {
        console.error("Error fetching leads:", error);
        setError(error.message);
        setLeads([]);
      } finally {
        setIsLoading(false);
      }
    },
    [searchText, searchType, selectedStatus, itemsPerPage, fromDate, toDate]
  );

  useEffect(() => {
    setCurrentPage(1);
    fetchLeadData(1);
  }, [searchText, searchType, selectedStatus, refreshTrigger, fetchLeadData, fromDate, toDate]);

  useEffect(() => {
    fetchLeadData(currentPage);
  }, [currentPage, fetchLeadData]);

  useEffect(() => {
    fetchAllEmployees();
  }, [fetchAllEmployees]);

  // Filter by employee and date range
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const employeeMatch =
        selectedEmployee === "Select Employee" ||
        selectedEmployee === "All Employees" ||
        (lead.type === "employee" && lead.employee?.fullName === selectedEmployee);

      // Filter by date range
      let dateMatch = true;
      if (fromDate || toDate) {
        try {
          // Get lead date in YYYY-MM-DD format for easier comparison
          const leadDateStr = new Date(lead.createdAt).toISOString().split('T')[0];

          if (fromDate && toDate) {
            // Between range
            dateMatch = leadDateStr >= fromDate && leadDateStr <= toDate;
          } else if (fromDate) {
            // From date onwards
            dateMatch = leadDateStr >= fromDate;
          } else if (toDate) {
            // Up to toDate
            dateMatch = leadDateStr <= toDate;
          }
        } catch (e) {
          console.error("Date parsing error:", e);
          dateMatch = true;
        }
      }

      return employeeMatch && dateMatch;
    });
  }, [leads, selectedEmployee, fromDate, toDate]);

  // Handlers
  const handleView = (lead) => {
    setCurrentLead(lead);
    setIsViewModalOpen(true);
  };

  const handleEdit = (lead) => {
    setCurrentLead(lead);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (lead) => {
    if (!window.confirm(`Delete lead ${lead.name}?`)) return;
    try {
      const isEmployeeLead = lead?.type === "employee";
      const url = isEmployeeLead
        ? `http://localhost:4000/employeelead/${lead._id}`
        : `http://localhost:4000/leads/${lead._id}`;

      const response = await fetch(url, { method: "DELETE" });
      const result = await response.json();

      if (result?.success || response.ok) {
        setLeads((prev) => prev.filter((l) => l._id !== lead._id));
        // Optional: Show success message
        console.log(`Lead "${lead.name}" deleted successfully`);
      } else {
        console.error("Delete failed:", result?.message || "Unknown error");
        alert(`Failed to delete lead: ${result?.message || "Please try again"}`);
      }
    } catch (e) {
      console.error("Delete error:", e);
      alert("Error deleting lead. Please try again.");
    }
  };

  const handleUpdateLead = async (updatedLead) => {
    try {
      const isEmployeeLead = updatedLead?.type === "employee" || currentLead?.type === "employee";
      const url = isEmployeeLead
        ? `http://localhost:4000/employeelead/${updatedLead._id}`
        : `http://localhost:4000/leads/${updatedLead._id}`;
      const method = isEmployeeLead ? "PUT" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLead),
      });

      const result = await response.json();
      if (result?.success) {
        const next = result.data ?? updatedLead;
        setLeads((prev) => prev.map((l) => (l._id === next._id ? { ...l, ...next } : l)));
        setIsEditModalOpen(false);
      }
    } catch (e) {
      console.error("Update error:", e);
    }
  };

  // Get source badge color
  const getSourceBadgeColor = (source) => {
    const colors = {
      "LINKEDIN": "bg-blue-100 text-blue-700",
      "REFERRAL": "bg-green-100 text-green-700",
      "DIRECT SEARCH": "bg-purple-100 text-purple-700",
      "Website": "bg-indigo-100 text-indigo-700",
      "Cold Call": "bg-gray-100 text-gray-700",
      "Email Campaign": "bg-pink-100 text-pink-700",
    };
    return colors[source] || "bg-gray-100 text-gray-700";
  };

  // Get employee badge color
  const getEmployeeBadgeColor = (name) => {
    if (!name) return "bg-gray-100 text-gray-700";
    const colors = ["bg-blue-100 text-blue-700", "bg-green-100 text-green-700", "bg-cyan-100 text-cyan-700"];
    const index = name.length % colors.length;
    return colors[index];
  };

  if (isLoading && leads.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        <p className="mt-4 text-sm text-gray-500">Loading leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (filteredLeads.length === 0 && !isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-gray-500">No leads found</p>
      </div>
    );
  }

  return (
    <div className="w-full ">
      {/* Employee Filter and Date Range */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by Employee:</label>
            <div className="relative">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm text-gray-700 shadow-sm transition-all hover:border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="Select Employee">Select Employee</option>
                <option value="All Employees">All Employees</option>
                {employeeList.map((emp, i) => (
                  <option key={i} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2 sm:ml-auto">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Date:</label>
            {fromDate || toDate ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm text-blue-700 font-medium">
                  {fromDate && toDate
                    ? `${fromDate} to ${toDate}`
                    : fromDate
                      ? `From ${fromDate}`
                      : `Until ${toDate}`}
                </span>
                <span className="text-xs text-blue-600 font-bold">✓</span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">No date filter</span>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col gap-4 mt-6">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 bg-gradient-to-r from-blue-50/60 to-slate-50/60 rounded-xl">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Contact Information</div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Group</div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Destination</div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Source</div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Employee</div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 text-center">Actions</div>
        </div>
        {/* Table Rows as Cards */}
        {filteredLeads.map((lead) => (
          <div key={lead._id} className="grid grid-cols-1 w-[98%] mx-auto md:grid-cols-6 gap-4 items-center bg-white rounded-2xl shadow border border-slate-100 px-6 py-4 hover:shadow-lg transition-all">
            {/* Contact Info */}
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-slate-900 text-base leading-tight">{lead.name || "—"}</span>
              <span className="text-sm text-slate-600">{lead.email || "—"}</span>
              <span className="text-xs text-slate-400">{lead.phone || "—"}</span>
            </div>
            {/* Group */}
            <div>
              <span className="text-sm font-medium text-slate-800">{lead.groupNumber || "—"}</span>
            </div>
            {/* Destination */}
            <div>
              <span className="text-sm text-slate-700">{lead.destination || "—"}</span>
            </div>
            {/* Source */}
            <div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getSourceBadgeColor(lead.leadSource)}`}>{lead.leadSource || "—"}</span>
            </div>
            {/* Employee */}
            <div>
              {lead.type === "employee" && lead.employee?.fullName ? (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getEmployeeBadgeColor(lead.employee.fullName)}`}>{lead.employee.fullName}</span>
              ) : (
                <span className="text-sm text-slate-400">—</span>
              )}
            </div>
            {/* Actions */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleView(lead)}
                className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-slate-100 hover:text-slate-700"
                title="View"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleEdit(lead)}
                className="rounded-lg p-2 text-green-600 transition-colors hover:bg-slate-100 hover:text-slate-700"
                title="Edit"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(lead)}
                className="rounded-lg p-2  transition-colors hover:bg-slate-100 text-red-600"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
        <div className="text-sm text-gray-700">
          {/* SHOWING <span className="font-medium">1-10</span> OF{" "} */}
          SHOWING <span>{start}-{end}</span> OF {totalRecords}
          <span className="font-medium">{totalRecords.toLocaleString()}</span> LEADS
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))} */}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(
              Math.max(0, currentPage - 2),
              Math.min(totalPages, currentPage + 1)
            )
            .map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-10 w-10 rounded-lg text-sm font-medium ${currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}


          <span className="px-2 text-gray-500">...</span>

          <button className="h-10 w-10 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
            {totalPages}
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Modals */}
      {isViewModalOpen && <ViewModal lead={currentLead} onClose={() => setIsViewModalOpen(false)} />}
      {isEditModalOpen && (
        <EditModal lead={currentLead} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateLead} />
      )}
    </div>
  );
};

// View Modal Component
const ViewModal = ({ lead, onClose }) => {
  if (!lead) return null;

  const fields = [
    { label: "Name", value: lead.name },
    { label: "Email", value: lead.email },
    { label: "Phone", value: lead.phone },
    { label: "WhatsApp No", value: lead.whatsAppNo },
    { label: "Departure City", value: lead.departureCity },
    { label: "Destination", value: lead.destination },
    { label: "Expected Travel Date", value: lead.expectedTravelDate },
    { label: "No. of Days", value: lead.noOfDays },
    { label: "Places to Cover", value: Array.isArray(lead.placesToCover) ? lead.placesToCover.join(", ") : lead.placesToCover },
    { label: "No. of Person", value: lead.noOfPerson },
    { label: "No. of Child", value: lead.noOfChild },
    { label: "Child Ages", value: Array.isArray(lead.childAges) ? lead.childAges.join(", ") : lead.childAges },
    { label: "Lead Source", value: lead.leadSource },
    { label: "Lead Type", value: lead.leadType },
    { label: "Trip Type", value: lead.tripType },
    { label: "Lead Status", value: lead.leadStatus },
    { label: "Group Number", value: lead.groupNumber },
    { label: "Notes", value: lead.notes },
    { label: "Employee", value: lead.employee?.fullName || "—" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Lead Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          {fields.map((field, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">{field.label}</p>
              <p className="mt-1 text-sm text-gray-900">{field.value || "—"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Input Field Component (MOVED OUTSIDE to prevent re-renders)
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
      className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
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

// Select Field Component (MOVED OUTSIDE to prevent re-renders)
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

// Edit Modal Component
const EditModal = ({ lead, onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinationList, setDestinationList] = useState([]);
  const fetchDestinations = async () => {
    try {
      const response = await fetch("http://localhost:4000/employeedestination");
      const result = await response.json();
      console.log(result.destinations);
      let destinations = [];
      if (Array.isArray(result.destinations)) {
        result.destinations.map(d => destinations = [...destinations, d.destination]);

      }
      setDestinationList(destinations);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };
  useEffect(() => {

    fetchDestinations();
  }, []);

  const [formData, setFormData] = useState({
    ...lead,
    placesToCoverArray: lead.placesToCover?.split(",").map((p) => p.trim()) || [],
    childAges: lead.childAges || [],
    customNoOfDays: "",
  });

  const [placeInput, setPlaceInput] = useState("");
  const [childAgeInput, setChildAgeInput] = useState("");

  // const handleAddPlace = (e) => {
  //   if (e.key === "Enter" && placeInput.trim()) {
  //     e.preventDefault();
  //     setFormData((p) => ({
  //       ...p,
  //       placesToCoverArray: [...p.placesToCoverArray, placeInput.trim()],
  //     }));
  //     setPlaceInput("");
  //   }
  // };

  // const handleRemovePlace = (idx) => {
  //   setFormData((p) => ({
  //     ...p,
  //     placesToCoverArray: p.placesToCoverArray.filter((_, i) => i !== idx),
  //   }));
  // };

  const handleAddPlace = (e) => {
    if (e && e.type === "keydown" && e.key !== "Enter") return;
    if (e && e.preventDefault) e.preventDefault();

    const inputVal = (placeInput || "").trim();
    if (!inputVal) return;

    // allow comma-separated multiple places
    const parts = inputVal.split(",").map(p => p.trim()).filter(Boolean);
    if (parts.length === 0) return;

    setFormData((prev) => {
      const current = prev.placesToCoverArray || [];
      const merged = [...current];
      parts.forEach(p => { if (!merged.includes(p)) merged.push(p); });
      return { ...prev, placesToCoverArray: merged };
    });
    setPlaceInput("");
  };

  const removePlace = (index) => {
    const updatedPlaces = [...(formData.placesToCoverArray || [])];
    updatedPlaces.splice(index, 1);
    setFormData((prev) => ({ ...prev, placesToCoverArray: updatedPlaces }));
  };

  const handleAddChildAge = (e) => {
    if (e.key === "Enter" && childAgeInput.trim()) {
      e.preventDefault();
      setFormData((p) => ({
        ...p,
        childAges: [...p.childAges, childAgeInput.trim()],
      }));
      setChildAgeInput("");
    }
  };

  // const handleRemoveChildAge = (idx) => {
  //   setFormData((p) => ({
  //     ...p,
  //     childAges: p.childAges.filter((_, i) => i !== idx),
  //   }));
  // };

  const removeChildAge = (index) => {
    const ages = [...formData.childAges];
    ages.splice(index, 1);
    setFormData((prev) => ({ ...prev, childAges: ages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalized = { ...formData };
    normalized.placesToCover = formData.placesToCoverArray.join(", ");

    if (formData.expectedTravelDate) {
      const dt = new Date(formData.expectedTravelDate);
      normalized.expectedTravelDate = Number.isNaN(dt.getTime()) ? undefined : dt;
    }

    const toNum = (v) => (v === "" || v === null || v === undefined ? undefined : Number(v));
    normalized.noOfPerson = toNum(formData.noOfPerson);
    normalized.noOfChild = toNum(formData.noOfChild);

    const ages = Array.isArray(formData.childAges)
      ? formData.childAges.map((a) => Number(a)).filter((n) => !Number.isNaN(n))
      : [];
    normalized.childAges = ages;

    normalized.noOfDays = formData.noOfDays === "Others" ? formData.customNoOfDays : formData.noOfDays;

    onSave(normalized);
  };

  const toDateInputValue = (d) => {
    try {
      const dt = d ? new Date(d) : null;
      if (!dt || Number.isNaN(dt.getTime())) return "";
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, "0");
      const day = String(dt.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    } catch {
      return "";
    }
  };

  const leadSources = ["Cold Call", "Website", "Referral", "LinkedIn", "Trade Show", "Email Campaign", "Social Media"];
  const leadTypes = ["International", "Domestic"];
  const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
  const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];
  const tripDurations = [
    "1n/2d", "2n/3d", "3n/4d", "4n/5d", "5n/6d", "6n/7d", "7n/8d", "8n/9d", "9n/10d",
    "10n/11d", "11n/12d", "12n/13d", "13n/14d", "14n/15d", "Others"
  ];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addChildAge = () => {
    setFormData(prev => ({ ...prev, childAges: [...prev.childAges, ""] }));
  };

  const handleChildAgeChange = (index, value) => {
    const ages = [...formData.childAges];
    ages[index] = value;
    setFormData((prev) => ({ ...prev, childAges: ages }));
  };

  // console.log(destinationList);


  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    //   <div className="max-h-[90vh] w-full max-w-4xl    rounded-xl bg-white shadow-2xl">
    //     <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
    //       <h2 className="text-lg font-semibold text-gray-900">Edit Lead</h2>
    //       <button
    //         onClick={onClose}
    //         className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
    //       >
    //         ×
    //       </button>
    //     </div>

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl rounded-xl bg-white shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Lead</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            ×
          </button>
        </div>

        {/* <form onSubmit={handleSubmit} className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 80px)" }}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {["name", "email", "phone", "whatsAppNo", "departureCity", "destination","noOfDays","placesToCover","noOfPerson","noOfChild","groupNumber","childAges","leadSource","leadType","tripType","expectedTravelDate",].map((key) => (
              <div key={key}>
                <label className="mb-1 block text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  value={formData[key] || ""}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Expected Travel Date</label>
              <input
                type="date"
                value={toDateInputValue(formData.expectedTravelDate)}
                onChange={(e) => setFormData({ ...formData, expectedTravelDate: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Lead Status</label>
              <select
                value={formData.leadStatus || "Cold"}
                onChange={(e) => setFormData({ ...formData, leadStatus: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {leadStatuses.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form> */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField name="name" value={formData.name} onChange={handleChange} />
            <InputField name="email" value={formData.email} onChange={handleChange} type="email" />
            <InputField name="phone" value={formData.phone} onChange={handleChange} required placeholder="Comma separated if multiple" />
            <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
            <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} />
            <SelectField name="destination" options={destinationList} placeholder="search destination..." value={formData.destination} onChange={handleChange} />
            <InputField name="expectedTravelDate" value={formData.expectedTravelDate} onChange={handleChange} type="date" />
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
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a place, press Enter or click Add"
                  value={placeInput}
                  onChange={(e) => setPlaceInput(e.target.value)}
                  onKeyDown={(e) => handleAddPlace(e)}
                  className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <button type="button" onClick={handleAddPlace} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
              </div>
            </div>
            <InputField name="noOfPerson" value={formData.noOfPerson} onChange={handleChange} type="number" />
            <InputField name="noOfChild" value={formData.noOfChild} onChange={handleChange} type="number" />
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

            {/* Child Ages
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
            </div> */}

            

            {/* <InputField name="placesToCover" value={formData.placesToCover} onChange={handleChange} /> */}
            {/* <InputField name="notes" value={formData.notes} onChange={handleChange} /> */}

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
          </div>

          {/* {apiError && (
                          <p className="text-red-600 mt-2 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> {apiError}
                          </p>
                        )} */}

          <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {isSubmitting ? "Saving..." : "Save Lead"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadTable;