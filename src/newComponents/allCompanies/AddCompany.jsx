// import { useState, useCallback } from "react";
// import Modal from "../UserManagement/Modal";

// const statusOptions = ["Active", "Pending", "Inactive"];
// const industryOptions = [
//   "Technology",
//   "Manufacturing",
//   "Finance",
//   "Healthcare",
//   "Retail",
//   "Consulting",
// ];

// const initialFormData = {
//   companyName: "",
//   industry: "",
//   email: "",
//   phone: "",
//   website: "",
//   address: "",
//   employees: "",
//   status: "",
// };

// const AddCompany = () => {
//   const [open, setOpen] = useState(false);
//   const [formData, setFormData] = useState(initialFormData);
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Field validation
//   const validateField = useCallback((name, value) => {
//     if (!value || value.toString().trim() === "") {
//       return `${name.replace(/([A-Z])/g, " $1")} is required`;
//     }

//     if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//       return "Please enter a valid email address";
//     }

//     if (name === "employees" && (isNaN(value) || Number(value) <= 0)) {
//       return "Enter a valid number of employees";
//     }

//     return "";
//   }, []);

//   // Handle input change
//   const handleInputChange = useCallback(
//     (field, value) => {
//       setFormData((prev) => ({ ...prev, [field]: value }));

//       if (errors[field]) {
//         setErrors((prev) => ({ ...prev, [field]: "" }));
//       }
//     },
//     [errors]
//   );

//   // Handle blur event
//   const handleBlur = useCallback(
//     (e) => {
//       const { name, value } = e.target;
//       setTouched((prev) => ({ ...prev, [name]: true }));

//       const error = validateField(name, value);
//       setErrors((prev) => ({ ...prev, [name]: error }));
//     },
//     [validateField]
//   );

//   // Validate entire form
//   const validateForm = useCallback(() => {
//     const newErrors = {};
//     Object.keys(formData).forEach((field) => {
//       const error = validateField(field, formData[field]);
//       if (error) newErrors[field] = error;
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [formData, validateField]);

//   // Handle form submit
//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();

//       if (!validateForm()) {
//         const allTouched = {};
//         Object.keys(formData).forEach((key) => (allTouched[key] = true));
//         setTouched(allTouched);
//         return;
//       }

//       setIsSubmitting(true);

//       try {
//         // Send JSON instead of FormData
//         const dataToSend = {
//           companyName: formData.companyName,
//           industry: formData.industry,
//           email: formData.email,
//           phoneNumber: formData.phone,
//           website: formData.website,
//           address: formData.address,
//           numberOfEmployees: formData.employees,
//           status: formData.status,
//         };

//         const response = await fetch("http://localhost:4000/company", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(dataToSend),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || "Failed to add company");
//         }

//         const data = await response.json();
//         console.log("Company added:", data);
//         alert("Company added successfully!");

//         setFormData(initialFormData);
//         setOpen(false);
//         setErrors({});
//         setTouched({});
//       } catch (err) {
//         console.error("Error adding company:", err);
//         alert(err.message || "Failed to add company. Please try again.");
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//     [formData, validateForm]
//   );

//   const handleOpen = useCallback(() => setOpen(true), []);
//   const handleClose = useCallback(() => {
//     setOpen(false);
//     setFormData(initialFormData);
//     setErrors({});
//     setTouched({});
//   }, []);

//   return (
//     <div>
//       {/* Open Modal Button */}
//       <button
//         onClick={handleOpen}
//         aria-haspopup="dialog"
//         aria-expanded={open}
//         aria-controls="add-company-modal"
//         className="bg-black w-fit px-3 py-2 flex gap-2 rounded-md text-white"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="lucide lucide-plus"
//           aria-hidden="true"
//         >
//           <path d="M5 12h14" />
//           <path d="M12 5v14" />
//         </svg>
//         Add Company
//       </button>

//       {/* Modal */}
//       <Modal
//         id="add-company-modal"
//         isOpen={open}
//         onClose={handleClose}
//         aria-label="Add new company form"
//       >
//         <div className="p-6">
//           <h2 className="text-xl font-semibold mb-6" id="add-company-title">
//             Add New Company
//           </h2>

//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-2 gap-6"
//             aria-labelledby="add-company-title"
//           >
//             {/* Company Name */}
//             <div>
//               <label htmlFor="companyName" className="block text-sm mb-1">
//                 Company Name *
//               </label>
//               <input
//                 id="companyName"
//                 name="companyName"
//                 type="text"
//                 value={formData.companyName}
//                 onChange={(e) =>
//                   handleInputChange("companyName", e.target.value)
//                 }
//                 onBlur={handleBlur}
//                 placeholder="Tech Corp Solutions"
//                 className={`w-full border rounded-md px-3 py-2 ${
//                   errors.companyName
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 bg-white"
//                 }`}
//                 disabled={isSubmitting}
//               />
//               {errors.companyName && (
//                 <p className="text-red-500 text-xs mt-1" role="alert">
//                   {errors.companyName}
//                 </p>
//               )}
//             </div>

//             {/* Industry */}
//             <div>
//               <label htmlFor="industry" className="block text-sm mb-1">
//                 Industry *
//               </label>
//               <select
//                 id="industry"
//                 name="industry"
//                 value={formData.industry}
//                 onChange={(e) => handleInputChange("industry", e.target.value)}
//                 onBlur={handleBlur}
//                 className={`w-full border rounded-md px-3 py-2 ${
//                   errors.industry
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 bg-white"
//                 }`}
//                 disabled={isSubmitting}
//               >
//                 <option value="">Select industry</option>
//                 {industryOptions.map((ind, idx) => (
//                   <option key={idx} value={ind}>
//                     {ind}
//                   </option>
//                 ))}
//               </select>
//               {errors.industry && (
//                 <p className="text-red-500 text-xs mt-1" role="alert">
//                   {errors.industry}
//                 </p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-sm mb-1">
//                 Email *
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleInputChange("email", e.target.value)}
//                 onBlur={handleBlur}
//                 placeholder="contact@company.com"
//                 className={`w-full border rounded-md px-3 py-2 ${
//                   errors.email
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 bg-white"
//                 }`}
//                 disabled={isSubmitting}
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-xs mt-1" role="alert">
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             {/* Phone */}
//             <div>
//               <label htmlFor="phone" className="block text-sm mb-1">
//                 Phone *
//               </label>
//               <input
//                 id="phone"
//                 name="phone"
//                 type="text"
//                 value={formData.phone}
//                 onChange={(e) => handleInputChange("phone", e.target.value)}
//                 onBlur={handleBlur}
//                 placeholder="+1 (555) 123-4567"
//                 className={`w-full border rounded-md px-3 py-2 ${
//                   errors.phone
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 bg-white"
//                 }`}
//                 disabled={isSubmitting}
//               />
//               {errors.phone && (
//                 <p className="text-red-500 text-xs mt-1" role="alert">
//                   {errors.phone}
//                 </p>
//               )}
//             </div>

//             {/* Website */}
//             <div className="col-span-2">
//               <label htmlFor="website" className="block text-sm mb-1">
//                 Website *
//               </label>
//               <input
//                 id="website"
//                 name="website"
//                 type="text"
//                 value={formData.website}
//                 onChange={(e) => handleInputChange("website", e.target.value)}
//                 onBlur={handleBlur}
//                 placeholder="www.company.com"
//                 className={`w-full border rounded-md px-3 py-2 ${
//                   errors.website
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 bg-white"
//                 }`}
//                 disabled={isSubmitting}
//               />
//               {errors.website && (
//                 <p className="text-red-500 text-xs mt-1" role="alert">
//                   {errors.website}
//                 </p>
//               )}
//             </div>

//             {/* Address */}
//             <div className="col-span-2">
//               <label htmlFor="address" className="block text-sm mb-1">
//                 Address *
//               </label>
//               <input
//                 id="address"
//                 name="address"
//                 type="text"
//                 value={formData.address}
//                 onChange={(e) => handleInputChange("address", e.target.value)}
//                 onBlur={handleBlur}
//                 placeholder="123 Business Street, City, State ZIP"
//                 className={`w-full border rounded-md px-3 py-2 ${
//                   errors.address
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 bg-white"
//                 }`}
//                 disabled={isSubmitting}
//               />
//               {errors.address && (
//                 <p className="text-red-500 text-xs mt-1" role="alert">
//                   {errors.address}
//                 </p>
//               )}
//             </div>

//             {/* Employees */}
//             <div>
//               <label htmlFor="employees" className="block text-sm mb-1">
//                 Number of Employees *
//               </label>
//               <input
//                 id="employees"
//                 name="employees"
//                 type="number"
//                 value={formData.employees}
//                 onChange={(e) => handleInputChange("employees", e.target.value)}
//                 onBlur={handleBlur}
//                 placeholder="100"
//                 className={`w-full border rounded-md px-3 py-2 ${
//                   errors.employees
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 bg-white"
//                 }`}
//                 disabled={isSubmitting}
//               />
//               {errors.employees && (
//                 <p className="text-red-500 text-xs mt-1" role="alert">
//                   {errors.employees}
//                 </p>
//               )}
//             </div>

//             {/* Status */}
//             <div>
//               <label htmlFor="status" className="block text-sm mb-1">
//                 Status *
//               </label>
//               <select
//                 id="status"
//                 name="status"
//                 value={formData.status}
//                 onChange={(e) => handleInputChange("status", e.target.value)}
//                 onBlur={handleBlur}
//                 className={`w-full border rounded-md px-3 py-2 ${
//                   errors.status
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 bg-white"
//                 }`}
//                 disabled={isSubmitting}
//               >
//                 <option value="">Select status</option>
//                 {statusOptions.map((s, idx) => (
//                   <option key={idx} value={s}>
//                     {s}
//                   </option>
//                 ))}
//               </select>
//               {errors.status && (
//                 <p className="text-red-500 text-xs mt-1" role="alert">
//                   {errors.status}
//                 </p>
//               )}
//             </div>

//             {/* Footer Buttons */}
//             <div className="flex justify-start gap-2 mt-6 col-span-2">
//               <button
//                 type="button"
//                 onClick={handleClose}
//                 className="px-4 py-2 border rounded-md"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="bg-black px-3 py-2 rounded-md text-white flex items-center gap-2"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Adding..." : "Add Company"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default AddCompany;



import { useState, useCallback, useEffect } from "react";
import Modal from "../UserManagement/Modal";

const statusOptions = ["Active", "Pending", "Inactive"];
const industryOptions = [
  "Technology",
  "Manufacturing",
  "Finance",
  "Healthcare",
  "Retail",
  "Consulting",
];

const initialFormData = {
  companyName: "",
  industry: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  employees: "",
  status: "",
};

const AddCompany = ({ isOpen: controlledOpen, onClose: controlledOnClose, initialData = null, onSaved }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const isControlled = controlledOpen !== undefined;
  const isModalOpen = isControlled ? controlledOpen : open;

  // Field validation
  const validateField = useCallback((name, value) => {
    if (!value || value.toString().trim() === "") {
      return `${name.replace(/([A-Z])/g, " $1")} is required`;
    }

    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }

    if (name === "employees" && (isNaN(value) || Number(value) <= 0)) {
      return "Enter a valid number of employees";
    }

    return "";
  }, []);

  // Handle input change
  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  // Handle blur event
  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // Handle form submit
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        const allTouched = {};
        Object.keys(formData).forEach((key) => (allTouched[key] = true));
        setTouched(allTouched);
        return;
      }

      setIsSubmitting(true);

      try {
        // If a logo file was selected, upload it first and get URL
        let logoUrl = initialData && initialData.logo ? initialData.logo : "";
        if (logoFile) {
          const fd = new FormData();
          fd.append("logo", logoFile);
          const uploadRes = await fetch("http://localhost:4000/company/upload-logo", {
            method: "POST",
            body: fd,
          });
          if (!uploadRes.ok) {
            const errData = await uploadRes.json().catch(() => ({}));
            throw new Error(errData.message || "Logo upload failed");
          }
          const uploadData = await uploadRes.json();
          logoUrl = uploadData.url || (uploadData.result && uploadData.result.secure_url) || "";
        }

        // Normalize website: backend expects scheme (http:// or https://)
        let websiteValue = formData.website ? formData.website.toString().trim() : "";
        if (websiteValue && !/^https?:\/\//i.test(websiteValue)) {
          websiteValue = `http://${websiteValue}`;
        }

        // Send JSON instead of FormData
        const dataToSend = {
          companyName: formData.companyName,
          industry: formData.industry,
          email: formData.email,
          phoneNumber: formData.phone,
          website: websiteValue,
          address: formData.address,
          numberOfEmployees: formData.employees,
          status: formData.status,
          logo: logoUrl,
        };

        let response;
        if (initialData && initialData._id) {
          response = await fetch(`http://localhost:4000/company/${initialData._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend),
          });
        } else {
          response = await fetch("http://localhost:4000/company", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend),
          });
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add company");
        }

        const data = await response.json();
        const message = initialData && initialData._id ? "Company updated successfully!" : "Company added successfully!";
        alert(message);

        setFormData(initialFormData);
        setErrors({});
        setTouched({});
        setLogoFile(null);
        setLogoPreview("");
        if (isControlled) {
          controlledOnClose && controlledOnClose();
        } else {
          setOpen(false);
        }

        onSaved && onSaved(data.company || data);
      } catch (err) {
        console.error("Error adding company:", err);
        alert(err.message || "Failed to add company. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, logoFile, initialData, isControlled, controlledOnClose, onSaved]
  );

  const handleOpen = useCallback(() => {
    if (!isControlled) setOpen(true);
  }, [isControlled]);

  const handleClose = useCallback(() => {
    if (isControlled) {
      controlledOnClose && controlledOnClose();
    } else {
      setOpen(false);
    }
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setLogoFile(null);
    setLogoPreview("");
  }, [isControlled, controlledOnClose]);

  useEffect(() => {
    if (initialData && isModalOpen) {
      setFormData({
        companyName: initialData.companyName || "",
        industry: initialData.industry || "",
        email: initialData.email || "",
        phone: initialData.phoneNumber || initialData.phone || "",
        website: initialData.website || "",
        address: initialData.address || "",
        employees: initialData.numberOfEmployees || "",
        status: initialData.status || "",
      });
      // set existing logo preview if available
      if (initialData.logo) {
        setLogoPreview(initialData.logo);
      } else {
        setLogoPreview("");
      }
    }
  }, [initialData, isModalOpen]);

  // handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* Open Modal Button */}
      {!isControlled && (
        <button
          onClick={handleOpen}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="add-company-modal"
          className="bg-black w-fit px-3 py-2 flex gap-2 rounded-md text-white"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-plus"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Add Company
        </button>
      )}

      {/* Modal */}
      <Modal id="add-company-modal" isOpen={isModalOpen} onClose={handleClose} aria-label="Add new company form">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6" id="add-company-title">
            {initialData && initialData._id ? "Edit Company" : "Add New Company"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-6"
            aria-labelledby="add-company-title"
          >
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm mb-1">
                Company Name *
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                onBlur={handleBlur}
                placeholder="Tech Corp Solutions"
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.companyName
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                disabled={isSubmitting}
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs mt-1" role="alert">
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="block text-sm mb-1">
                Industry *
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                onBlur={handleBlur}
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.industry
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select industry</option>
                {industryOptions.map((ind, idx) => (
                  <option key={idx} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <p className="text-red-500 text-xs mt-1" role="alert">
                  {errors.industry}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={handleBlur}
                placeholder="contact@company.com"
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm mb-1">
                Phone *
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                onBlur={handleBlur}
                placeholder="+1 (555) 123-4567"
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.phone
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Website */}
            <div className="col-span-2">
              <label htmlFor="website" className="block text-sm mb-1">
                Website *
              </label>
              <input
                id="website"
                name="website"
                type="text"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                onBlur={handleBlur}
                placeholder="www.company.com"
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.website
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                disabled={isSubmitting}
              />
              {errors.website && (
                <p className="text-red-500 text-xs mt-1" role="alert">
                  {errors.website}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label htmlFor="address" className="block text-sm mb-1">
                Address *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                onBlur={handleBlur}
                placeholder="123 Business Street, City, State ZIP"
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.address
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                disabled={isSubmitting}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1" role="alert">
                  {errors.address}
                </p>
              )}
            </div>

            {/* Employees */}
            <div>
              <label htmlFor="employees" className="block text-sm mb-1">
                Number of Employees *
              </label>
              <input
                id="employees"
                name="employees"
                type="number"
                value={formData.employees}
                onChange={(e) => handleInputChange("employees", e.target.value)}
                onBlur={handleBlur}
                placeholder="100"
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.employees
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                disabled={isSubmitting}
              />
              {errors.employees && (
                <p className="text-red-500 text-xs mt-1" role="alert">
                  {errors.employees}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                onBlur={handleBlur}
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.status
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select status</option>
                {statusOptions.map((s, idx) => (
                  <option key={idx} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-500 text-xs mt-1" role="alert">
                  {errors.status}
                </p>
              )}
            </div>

            {/* Logo Upload */}
            <div>
              <label htmlFor="logo" className="block text-sm mb-1">
                Company Logo
              </label>
              <input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                disabled={isSubmitting}
                className="w-full"
              />
              {logoPreview && (
                <div className="mt-2">
                  <img src={logoPreview} alt="logo preview" className="h-20 w-20 object-cover rounded-md" />
                </div>
              )}
            </div>

            {/* Footer Buttons */}
              <div className="flex justify-start gap-2 mt-6 col-span-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border rounded-md"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-black px-3 py-2 rounded-md text-white flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (initialData && initialData._id ? "Saving..." : "Adding...") : (initialData && initialData._id ? "Save Changes" : "Add Company")}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddCompany;