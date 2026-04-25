
// import React, { useState, useEffect, useCallback } from "react";
// import Modal from "./Modal.jsx";
// import axios from "axios";
// const ROLES = ["Admin", "Employee"];
// const AddUser = () => {
//   const [isOpen, setIsOpen] = useState(false);
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
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.role) {
//       alert("Please select a role");
//       return;
//     }
//     setIsSubmitting(true);
//     const endpoint =
//       formData.role === "Admin"
//         ? "http://localhost:4000/addAdmin"
//         : "http://localhost:4000/employee/addEmployee";

//     try {
//       await axios.post(endpoint, {
//         fullName: formData.fullName,
//         email: formData.email,
//         phone: formData.phone,
//         officialNo: formData.officialNo,
//         emergencyNo: formData.emergencyNo,
//         department: formData.department, // departmentId
//         designation: formData.designation, // designationId
//         company: formData.company, // companyId
//         password: formData.password,
//         salary: formData.salary,
//         accountActive: formData.isActive,
//         role: formData.role,
//       });
//       alert(`${formData.role} added successfully!`);
//       handleClose();
//     } catch (error) {
//       console.error("Error adding user:", error);
//       alert("Failed to add user.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   const handleClose = useCallback(() => {
//     setIsOpen(false);
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
//   }, []);
//   return (
//       <>
//           <button
//               onClick={() => setIsOpen(true)}
//               className="flex items-center gap-2 rounded-full sm:px-4 py-2 h-14 w-[12rem] bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
//           >
//               Add User
//           </button>

//           <Modal
//               isOpen={isOpen}
//               onClose={handleClose}
//               maxWidth="max-w-2xl"
//           >
//               <div className="p-6">
//                   <h2 className="mb-6 text-xl font-semibold text-gray-900">Add New User</h2>
//                   <form
//                       onSubmit={handleSubmit}
//                       className="space-y-6"
//                   >
//                       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                           <div>
//                               <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
//                               <input
//                                   type="text"
//                                   value={formData.fullName}
//                                   onChange={(e) => handleInputChange("fullName", e.target.value)}
//                                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                                   required
//                               />
//                           </div>
//                           <div>
//                               <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
//                               <input
//                                   type="email"
//                                   value={formData.email}
//                                   onChange={(e) => handleInputChange("email", e.target.value)}
//                                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                                   required
//                               />
//                           </div>
//                           <div>
//                               <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
//                               <input
//                                   type="tel"
//                                   value={formData.phone}
//                                   onChange={(e) => handleInputChange("phone", e.target.value)}
//                                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                               />
//                           </div>
//                           <div>
//                               <label className="mb-1 block text-sm font-medium text-gray-700">Official Number</label>
//                               <input
//                                   type="tel"
//                                   value={formData.officialNo}
//                                   onChange={(e) => handleInputChange("officialNo", e.target.value)}
//                                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                               />
//                           </div>
//                           <div>
//                               <label className="mb-1 block text-sm font-medium text-gray-700">Emergency Number</label>
//                               <input
//                                   type="tel"
//                                   value={formData.emergencyNo}
//                                   onChange={(e) => handleInputChange("emergencyNo", e.target.value)}
//                                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                               />
//                           </div>
//                           <div>
//                               <label className="mb-1 block text-sm font-medium text-gray-700">Salary</label>
//                               <input
//                                   type="number"
//                                   value={formData.salary}
//                                   onChange={(e) => handleInputChange("salary", e.target.value)}
//                                   placeholder="Enter salary"
//                                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                               />
//                           </div>
//                           <div>
//                               <label className="mb-1 block text-sm font-medium text-gray-700">Company</label>
//                               <select
//                                   value={formData.company}
//                                   onChange={(e) => {
//                                       const compId = e.target.value;
//                                       handleInputChange("company", compId);

//                                       // reset dependent fields
//                                       handleInputChange("department", "");
//                                       handleInputChange("designation", "");
//                                       setDepartments([]);
//                                       setDesignations([]);

//                                       if (compId) getDepartments(compId);
//                                   }}
//                                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                                   required
//                               >
//                                   <option value="">Select company</option>
//                                   {companies.map((comp) => (
//                                       <option
//                                           key={comp._id}
//                                           value={comp._id}
//                                       >
//                                           {comp.companyName}
//                                       </option>
//                                   ))}
//                               </select>
//                           </div>
//                           <div>
//                               <label className="mb-1 block text-sm font-medium text-gray-700">Department</label>

//                               <select
//                                   value={formData.department}
//                                   onChange={(e) => {
//                                       const depId = e.target.value;
//                                       handleInputChange("department", depId);
//                                       handleInputChange("designation", "");
//                                       setDesignations([]);

//                                       if (depId) getDesignations(formData.company, depId);
//                                   }}
//                                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                                   required
//                               >
//                                   <option value="">Select department</option>

//                                   {departments.map((dept) => (
//                                       <option
//                                           key={dept.id}
//                                           value={dept.id}
//                                       >
//                                           {dept.name}
//                                       </option>
//                                   ))}
//                               </select>
//                           </div>
//                           <div>
//                               <label className="mb-1 block text-sm font-medium text-gray-700">Designation</label>

//                               <select
//                                   value={formData.designation}
//                                   onChange={(e) => handleInputChange("designation", e.target.value)}
//                                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                                   required
//                               >
//                                   <option value="">Select designation</option>

//                                   {designations.map((desig) => (
//                                       <option
//                                           key={desig.id}
//                                           value={desig.id}
//                                       >
//                                           {desig.name}
//                                       </option>
//                                   ))}
//                               </select>
//                           </div>
//                           <div>
//                               <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
//                               <select
//                                   value={formData.role}
//                                   onChange={(e) => handleInputChange("role", e.target.value)}
//                                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                                   required
//                               >
//                                   <option value="">Select Role</option>
//                                   {ROLES.map((role) => (
//                                       <option
//                                           key={role}
//                                           value={role}
//                                       >
//                                           {role}
//                                       </option>
//                                   ))}
//                               </select>
//                           </div>
//                           <div className="relative">
//                               <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
//                               <input
//                                   type={formData.showPassword ? "text" : "password"}
//                                   value={formData.password}
//                                   onChange={(e) => handleInputChange("password", e.target.value)}
//                                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                                   required
//                               />

//                               <button
//                                   type="button"
//                                   onClick={() => handleInputChange("showPassword", !formData.showPassword)}
//                                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                               >
//                                   {formData.showPassword ? "Hide" : "Show"}
//                               </button>
//                           </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                           <input
//                               type="checkbox"
//                               checked={formData.isActive}
//                               onChange={(e) => handleInputChange("isActive", e.target.checked)}
//                               className="rounded border-gray-300 text-blue-600"
//                           />
//                           <label className="text-sm font-medium text-gray-700">Account Active</label>
//                       </div>
//                       <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
//                           <button
//                               type="button"
//                               onClick={handleClose}
//                               className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
//                               disabled={isSubmitting}
//                           >
//                               Cancel
//                           </button>
//                           <button
//                               type="submit"
//                               className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
//                               disabled={isSubmitting}
//                           >
//                               {isSubmitting ? "Adding..." : "Add User"}
//                           </button>
//                       </div>
//                   </form>
//               </div>
//           </Modal>
//       </>
//   );
// };
// export default AddUser;

import React, { useState, useEffect, useCallback } from "react";
import Modal from "./Modal.jsx";
import axios from "axios";

const ROLES = ["Admin", "Employee"];

const AddUser = () => {
    const [isOpen, setIsOpen] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.role) {
            alert("Please select a role");
            return;
        }
        setIsSubmitting(true);
        const endpoint = formData.role === "Admin" ? "http://localhost:4000/addAdmin" : "http://localhost:4000/employee/addEmployee";

        try {
            await axios.post(endpoint, {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                officialNo: formData.officialNo,
                emergencyNo: formData.emergencyNo,
                department: formData.department, // departmentId
                designation: formData.designation, // designationId
                company: formData.company, // companyId
                password: formData.password,
                salary: formData.salary,
                accountActive: formData.isActive,
                role: formData.role,
            });
            alert(`${formData.role} added successfully!`);
            handleClose();
        } catch (error) {
            console.error("Error adding user:", error);
            const errorMessage = error.response?.data?.message || "Failed to add user.";
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = useCallback(() => {
        setIsOpen(false);
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
    }, []);

    return (
        <>
            {/* Responsive Add Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98] sm:h-12 sm:px-6 sm:text-base md:h-14 md:w-[12rem] md:w-auto"
                aria-label="Add new user"
            >
                Add User
            </button>

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                maxWidth="max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl"
            >
                <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-h-[90vh] overflow-y-auto p-4 sm:max-h-[95vh] sm:p-6 md:p-8">
                    <h2 className="mb-6 text-lg font-semibold text-gray-900 sm:text-xl md:text-2xl">Add New User</h2>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 sm:space-y-6"
                    >
                        {/* Responsive Grid - 1 col mobile, 2 col tablet+ */}
                        <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:gap-4 md:gap-6">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm md:text-base">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:py-3 md:text-base"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm md:text-base">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:py-3 md:text-base"
                                    placeholder="user@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm md:text-base">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:py-3 md:text-base"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm md:text-base">Official Number</label>
                                <input
                                    type="tel"
                                    value={formData.officialNo}
                                    onChange={(e) => handleInputChange("officialNo", e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:py-3 md:text-base"
                                    placeholder="Official contact number"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm md:text-base">Emergency Number</label>
                                <input
                                    type="tel"
                                    value={formData.emergencyNo}
                                    onChange={(e) => handleInputChange("emergencyNo", e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:py-3 md:text-base"
                                    placeholder="Emergency contact"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm md:text-base">Salary</label>
                                <input
                                    type="number"
                                    value={formData.salary}
                                    onChange={(e) => handleInputChange("salary", e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:py-3 md:text-base"
                                    placeholder="Enter salary amount"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm md:text-base">
                                    Company <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.company}
                                    onChange={(e) => {
                                        const compId = e.target.value;
                                        handleInputChange("company", compId);
                                        // reset dependent fields
                                        handleInputChange("department", "");
                                        handleInputChange("designation", "");
                                        setDepartments([]);
                                        setDesignations([]);
                                        if (compId) getDepartments(compId);
                                    }}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:py-3 md:text-base"
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
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm md:text-base">
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
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:py-3 md:text-base"
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
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm md:text-base">
                                    Designation <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.designation}
                                    onChange={(e) => handleInputChange("designation", e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:py-3 md:text-base"
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
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm md:text-base">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => handleInputChange("role", e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:py-3 md:text-base"
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
                            {/* Password Field - Full width on mobile */}
                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm md:text-base">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={formData.showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 pr-12 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:py-3 md:text-base"
                                        placeholder="Enter secure password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleInputChange("showPassword", !formData.showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-gray-500 hover:text-gray-700 sm:text-sm md:px-3"
                                    >
                                        {formData.showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Account Active Toggle */}
                        <div className="flex items-center gap-3 p-1 sm:gap-4">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => handleInputChange("isActive", e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:h-5 sm:w-5"
                            />
                            <label
                                htmlFor="isActive"
                                className="text-sm font-medium text-gray-700 sm:text-base"
                            >
                                Account Active
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-end sm:gap-4 sm:pt-8">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto sm:flex-none sm:px-8 sm:py-3 md:text-base"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 rounded-lg bg-gradient-to-r from-black to-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:from-gray-900 hover:to-black hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:flex-none sm:px-8 sm:py-3 md:text-base"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Adding..." : "Add User"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default AddUser;