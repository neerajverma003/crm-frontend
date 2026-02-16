
// import React, { useState, useEffect, useCallback } from "react";
// import Modal from "./Modal.jsx";
// import axios from "axios";

// const ROLES = ["Admin", "Employee"];

// const EditUser = ({ user, isOpen, onClose, onSave }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [companies, setCompanies] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [designations, setDesignations] = useState([]);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     officialNo: "",
//     emergencyNo: "",
//     company: "",
//     department: "",
//     designation: "",
//     role: "",
//     password: "",
//     salary: "",
//     isActive: true,
//     showPassword: false,
//   });

//   const handleInputChange = useCallback((field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   }, []);

//   const getCompanies = async () => {
//     try {
//       const response = await axios.get("http://localhost:4000/company/all");
//       setCompanies(response.data.companies || []);
//     } catch (error) {
//       console.error("Failed to fetch companies:", error);
//       alert("Failed to fetch companies.");
//     }
//   };

//   const getDepartments = async (companyId) => {
//     if (!companyId) return;

//     try {
//       const url = `http://localhost:4000/department/department?company=${companyId}`;

//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch departments");
//       const data = await response.json();
//       const finalDepartments = (data.departments || []).map((d) => ({
//         id: d._id,
//         name: d.dep,
//       }));
//       setDepartments(finalDepartments);
//     } catch (err) {
//       console.error(err);
//       setDepartments([]);
//     }
//   };

//   const getDesignations = async (companyId, departmentId) => {
//     if (!companyId || !departmentId) return;

//     try {
//       const url = `http://localhost:4000/designation?company=${companyId}&department=${departmentId}`;

//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch designations");

//       const data = await response.json();
//       const finalDesignations = (data.designations || []).map((d) => ({
//         id: d._id,
//         name: d.designation,
//       }));
//       setDesignations(finalDesignations);
//     } catch (err) {
//       console.error(err);
//       setDesignations([]);
//     }
//   };

//   useEffect(() => {
//     getCompanies();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       const companyId = user.company?._id || user.company || "";
//       const departmentId = user.department?._id || user.department || "";
//       const designationId = user.designation?._id || user.designation || "";

//       setFormData({
//         fullName: user.fullName || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         officialNo: user.officialNo || "",
//         emergencyNo: user.emergencyNo || "",
//         company: companyId,
//         department: departmentId,
//         designation: designationId,
//         role: user.role || "",
//         password: "",
//         salary: user.salary || "",
//         isActive: user.accountActive ?? true,
//         showPassword: false,
//       });

//       // Load departments and designations for existing user
//       if (companyId) {
//         getDepartments(companyId);
//         if (departmentId) {
//           getDesignations(companyId, departmentId);
//         }
//       }
//     }
//   }, [user]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.role) {
//       alert("Please select a role");
//       return;
//     }

//     setIsSubmitting(true);

//     let endpoint = `http://localhost:4000/employee/editEmployee/${user._id}`;

//     if (user.role && String(user.role).toLowerCase() === "admin") {
//       endpoint = `http://localhost:4000/editAdmin/${user._id}`;
//     }

//     try {
//       const payload = {
//         fullName: formData.fullName,
//         email: formData.email,
//         phone: formData.phone,
//         officialNo: formData.officialNo,
//         emergencyNo: formData.emergencyNo,
//         department: formData.department,
//         designation: formData.designation,
//         company: formData.company,
//         salary: formData.salary,
//         accountActive: formData.isActive,
//         role: formData.role,
//       };

//       // Only include password if it's not empty
//       if (formData.password) {
//         payload.password = formData.password;
//       }

//       const response = await axios.put(endpoint, payload);

//       alert(`${formData.role} updated successfully!`);
//       if (onSave) {
//         onSave(response.data.employee || response.data);
//       }
//       handleClose();
//     } catch (error) {
//       console.error("Error updating user:", error);
//       alert(error.response?.data?.msg || "Failed to update user.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleClose = useCallback(() => {
//     onClose();
//     setFormData({
//       fullName: "",
//       email: "",
//       phone: "",
//       officialNo: "",
//       emergencyNo: "",
//       company: "",
//       department: "",
//       designation: "",
//       role: "",
//       password: "",
//       salary: "",
//       isActive: true,
//       showPassword: false,
//     });

//     setDepartments([]);
//     setDesignations([]);
//   }, [onClose]);

//   return (
//     <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-2xl">
//       <div className="p-6">
//         <h2 className="mb-6 text-xl font-semibold text-gray-900">
//           Edit User
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <div>
//               <label className="mb-1 block text-sm font-medium text-gray-700">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 value={formData.fullName}
//                 onChange={(e) =>
//                   handleInputChange("fullName", e.target.value)
//                 }
//                 className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 required
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   handleInputChange("email", e.target.value)
//                 }
//                 className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 required
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium text-gray-700">
//                 Phone
//               </label>
//               <input
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) => handleInputChange("phone", e.target.value)}
//                 className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium text-gray-700">
//                 Official Number
//               </label>
//               <input
//                 type="tel"
//                 value={formData.officialNo}
//                 onChange={(e) =>
//                   handleInputChange("officialNo", e.target.value)
//                 }
//                 className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium text-gray-700">
//                 Emergency Number
//               </label>
//               <input
//                 type="tel"
//                 value={formData.emergencyNo}
//                 onChange={(e) =>
//                   handleInputChange("emergencyNo", e.target.value)
//                 }
//                 className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium text-gray-700">
//                 Salary
//               </label>
//               <input
//                 type="number"
//                 value={formData.salary}
//                 onChange={(e) =>
//                   handleInputChange("salary", e.target.value)
//                 }
//                 placeholder="Enter salary"
//                 className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium text-gray-700">
//                 Company
//               </label>
//               <select
//                 value={formData.company}
//                 onChange={(e) => {
//                   const compId = e.target.value;
//                   handleInputChange("company", compId);

//                   // reset dependent fields
//                   handleInputChange("department", "");
//                   handleInputChange("designation", "");
//                   setDepartments([]);
//                   setDesignations([]);

//                   if (compId) getDepartments(compId);
//                 }}
//                 className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 required
//               >
//                 <option value="">Select company</option>
//                 {companies.map((comp) => (
//                   <option key={comp._id} value={comp._id}>
//                     {comp.companyName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium text-gray-700">
//                 Department
//               </label>

//               <select
//                 value={formData.department}
//                 onChange={(e) => {
//                   const depId = e.target.value;
//                   handleInputChange("department", depId);
//                   handleInputChange("designation", "");
//                   setDesignations([]);

//                   if (depId) getDesignations(formData.company, depId);
//                 }}
//                 className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 required
//               >
//                 <option value="">Select department</option>

//                 {departments.map((dept) => (
//                   <option key={dept.id} value={dept.id}>
//                     {dept.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium text-gray-700">
//                 Designation
//               </label>

//               <select
//                 value={formData.designation}
//                 onChange={(e) =>
//                   handleInputChange("designation", e.target.value)
//                 }
//                 className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 required
//               >
//                 <option value="">Select designation</option>

//                 {designations.map((desig) => (
//                   <option key={desig.id} value={desig.id}>
//                     {desig.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium text-gray-700">
//                 Role
//               </label>
//               <select
//                 value={formData.role}
//                 onChange={(e) => handleInputChange("role", e.target.value)}
//                 className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 required
//               >
//                 <option value="">Select Role</option>
//                 {ROLES.map((role) => (
//                   <option key={role} value={role}>
//                     {role}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="relative">
//               <label className="mb-1 block text-sm font-medium text-gray-700">
//                 Password (leave blank to keep current)
//               </label>
//               <input
//                 type={formData.showPassword ? "text" : "password"}
//                 value={formData.password}
//                 onChange={(e) =>
//                   handleInputChange("password", e.target.value)
//                 }
//                 className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 placeholder="Enter new password (optional)"
//               />

//               <button
//                 type="button"
//                 onClick={() =>
//                   handleInputChange("showPassword", !formData.showPassword)
//                 }
//                 className="absolute right-3 top-9 text-gray-500"
//               >
//                 {formData.showPassword ? "Hide" : "Show"}
//               </button>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={formData.isActive}
//               onChange={(e) =>
//                 handleInputChange("isActive", e.target.checked)
//               }
//               className="rounded border-gray-300 text-blue-600"
//             />
//             <label className="text-sm font-medium text-gray-700">
//               Account Active
//             </label>
//           </div>
//           <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Updating..." : "Update User"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default EditUser;


import React, { useState, useEffect, useCallback } from "react";
import Modal from "./Modal.jsx";
import axios from "axios";

const ROLES = ["Admin", "Employee"];

const EditUser = ({ user, isOpen, onClose, onSave }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [companies, setCompanies] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        officialNo: "",
        emergencyNo: "",
        company: "",
        department: "",
        designation: "",
        role: "",
        password: "",
        salary: "",
        isActive: true,
        showPassword: false,
    });

    const handleInputChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const getCompanies = async () => {
        try {
            const response = await axios.get("http://localhost:4000/company/all");
            setCompanies(response.data.companies || []);
        } catch (error) {
            console.error("Failed to fetch companies:", error);
            alert("Failed to fetch companies.");
        }
    };

    const getDepartments = async (companyId) => {
        if (!companyId) return;

        try {
            const url = `http://localhost:4000/department/department?company=${companyId}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch departments");
            const data = await response.json();
            const finalDepartments = (data.departments || []).map((d) => ({
                id: d._id,
                name: d.dep,
            }));
            setDepartments(finalDepartments);
        } catch (err) {
            console.error(err);
            setDepartments([]);
        }
    };

    const getDesignations = async (companyId, departmentId) => {
        if (!companyId || !departmentId) return;

        try {
            const url = `http://localhost:4000/designation?company=${companyId}&department=${departmentId}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch designations");

            const data = await response.json();
            const finalDesignations = (data.designations || []).map((d) => ({
                id: d._id,
                name: d.designation,
            }));
            setDesignations(finalDesignations);
        } catch (err) {
            console.error(err);
            setDesignations([]);
        }
    };

    useEffect(() => {
        getCompanies();
    }, []);

    useEffect(() => {
        if (user) {
            const companyId = user.company?._id || user.company || "";
            const departmentId = user.department?._id || user.department || "";
            const designationId = user.designation?._id || user.designation || "";

            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
                officialNo: user.officialNo || "",
                emergencyNo: user.emergencyNo || "",
                company: companyId,
                department: departmentId,
                designation: designationId,
                role: user.role || "",
                password: "",
                salary: user.salary || "",
                isActive: user.accountActive ?? true,
                showPassword: false,
            });

            // Load departments and designations for existing user
            if (companyId) {
                getDepartments(companyId);
                if (departmentId) {
                    getDesignations(companyId, departmentId);
                }
            }
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.role) {
            alert("Please select a role");
            return;
        }

        setIsSubmitting(true);

        let endpoint = `http://localhost:4000/employee/editEmployee/${user._id}`;

        if (user.role && String(user.role).toLowerCase() === "admin") {
            endpoint = `http://localhost:4000/editAdmin/${user._id}`;
        }

        try {
            const payload = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                officialNo: formData.officialNo,
                emergencyNo: formData.emergencyNo,
                department: formData.department,
                designation: formData.designation,
                company: formData.company,
                salary: formData.salary,
                accountActive: formData.isActive,
                role: formData.role,
            };

            // Only include password if it's not empty
            if (formData.password) {
                payload.password = formData.password;
            }

            const response = await axios.put(endpoint, payload);

            alert(`${formData.role} updated successfully!`);
            if (onSave) {
                onSave(response.data.employee || response.data);
            }
            handleClose();
        } catch (error) {
            console.error("Error updating user:", error);
            alert(error.response?.data?.msg || "Failed to update user.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = useCallback(() => {
        onClose();
        setFormData({
            fullName: "",
            email: "",
            phone: "",
            officialNo: "",
            emergencyNo: "",
            company: "",
            department: "",
            designation: "",
            role: "",
            password: "",
            salary: "",
            isActive: true,
            showPassword: false,
        });

        setDepartments([]);
        setDesignations([]);
    }, [onClose]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl"
        >
            <div className="flex h-[90vh] max-h-screen w-full flex-col sm:h-[95vh]">
                {/* Header - Sticky */}
                <div className="sticky top-0 z-20 shrink-0 border-b border-gray-200 bg-white/95 p-4 backdrop-blur-md sm:p-6">
                    <div className="mb-2 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl md:text-3xl">Edit User</h2>
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">Update {formData.fullName || "user"} details</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="rounded-full p-2 transition-colors hover:bg-gray-100 sm:hidden"
                            aria-label="Close modal"
                        >
                            <svg
                                className="h-5 w-5 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 md:px-8">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 sm:space-y-5 md:space-y-6"
                    >
                        {/* Responsive Grid - Mobile single column, Desktop 2 columns */}
                        <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
                            {/* Personal Info */}
                            <div className="space-y-2 md:space-y-3">
                                <label className="block text-xs font-semibold text-gray-700 sm:text-sm md:text-base">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-base"
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                <label className="block text-xs font-semibold text-gray-700 sm:text-sm md:text-base">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-base"
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                <label className="block text-xs font-semibold text-gray-700 sm:text-sm md:text-base">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-base"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                <label className="block text-xs font-semibold text-gray-700 sm:text-sm md:text-base">Official Number</label>
                                <input
                                    type="tel"
                                    value={formData.officialNo}
                                    onChange={(e) => handleInputChange("officialNo", e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-base"
                                    placeholder="Official contact"
                                />
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                <label className="block text-xs font-semibold text-gray-700 sm:text-sm md:text-base">Emergency Number</label>
                                <input
                                    type="tel"
                                    value={formData.emergencyNo}
                                    onChange={(e) => handleInputChange("emergencyNo", e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-base"
                                    placeholder="Emergency contact"
                                />
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                <label className="block text-xs font-semibold text-gray-700 sm:text-sm md:text-base">Salary</label>
                                <input
                                    type="number"
                                    value={formData.salary}
                                    onChange={(e) => handleInputChange("salary", e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-sm placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-base"
                                    placeholder="₹50,000"
                                    min="0"
                                    step="100"
                                />
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                <label className="block text-xs font-semibold text-gray-700 sm:text-sm md:text-base">
                                    Company <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.company}
                                    onChange={(e) => {
                                        const compId = e.target.value;
                                        handleInputChange("company", compId);
                                        handleInputChange("department", "");
                                        handleInputChange("designation", "");
                                        setDepartments([]);
                                        setDesignations([]);
                                        if (compId) getDepartments(compId);
                                    }}
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-[right_0.75rem_center/1.25rem_auto] bg-white/80 bg-no-repeat px-4 py-3 text-sm shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:bg-[right_1rem_center/1.5rem_auto] sm:text-base"
                                    required
                                >
                                    <option value="">Select company</option>
                                    {companies.map((comp) => (
                                        <option
                                            key={comp._id}
                                            value={comp._id}
                                        >
                                            {comp.companyName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                <label className="block text-xs font-semibold text-gray-700 sm:text-sm md:text-base">
                                    Department <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => {
                                        const depId = e.target.value;
                                        handleInputChange("department", depId);
                                        handleInputChange("designation", "");
                                        setDesignations([]);
                                        if (depId) getDesignations(formData.company, depId);
                                    }}
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-[right_0.75rem_center/1.25rem_auto] bg-white/80 bg-no-repeat px-4 py-3 text-sm shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:bg-[right_1rem_center/1.5rem_auto] sm:text-base"
                                    required
                                >
                                    <option value="">Select department</option>
                                    {departments.map((dept) => (
                                        <option
                                            key={dept.id}
                                            value={dept.id}
                                        >
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                <label className="block text-xs font-semibold text-gray-700 sm:text-sm md:text-base">
                                    Designation <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.designation}
                                    onChange={(e) => handleInputChange("designation", e.target.value)}
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-[right_0.75rem_center/1.25rem_auto] bg-white/80 bg-no-repeat px-4 py-3 text-sm shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:bg-[right_1rem_center/1.5rem_auto] sm:text-base"
                                    required
                                >
                                    <option value="">Select designation</option>
                                    {designations.map((desig) => (
                                        <option
                                            key={desig.id}
                                            value={desig.id}
                                        >
                                            {desig.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                <label className="block text-xs font-semibold text-gray-700 sm:text-sm md:text-base">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => handleInputChange("role", e.target.value)}
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-[right_0.75rem_center/1.25rem_auto] bg-white/80 bg-no-repeat px-4 py-3 text-sm shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:bg-[right_1rem_center/1.5rem_auto] sm:text-base"
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {ROLES.map((role) => (
                                        <option
                                            key={role}
                                            value={role}
                                        >
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Password Field - Full width on all screens */}
                            <div className="space-y-2 md:col-span-2 md:space-y-3">
                                <label className="block text-xs font-semibold text-gray-700 sm:text-sm md:text-base">
                                    Password (leave blank to keep current)
                                </label>
                                <div className="relative">
                                    <input
                                        type={formData.showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 pr-12 text-sm placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-base"
                                        placeholder="Enter new password (optional)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleInputChange("showPassword", !formData.showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                    >
                                        <svg
                                            className="h-4 w-4 sm:h-5 sm:w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            {formData.showPassword ? (
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            ) : (
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Account Status Toggle */}
                        <div className="flex items-center rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                            <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white/60 p-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                                    className="h-5 w-5 rounded-lg border-2 border-gray-300 text-blue-600 transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="isActive"
                                    className="flex-1 cursor-pointer select-none text-sm font-semibold text-gray-800 sm:text-base"
                                >
                                    {formData.isActive ? "✅ Active Account" : "❌ Inactive Account"}
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-end sm:gap-4 sm:space-y-0 sm:pt-8">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    "Update User"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default EditUser;