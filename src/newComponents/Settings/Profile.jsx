// import React, { useState, useCallback } from "react";
// import { AlertCircle, Check, Camera } from "lucide-react";

// const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// // Validation rules for profile form
// const validationRules = {
//   firstName: { required: true, minLength: 2, maxLength: 50 },
//   lastName: { required: true, minLength: 2, maxLength: 50 },
//   email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
//   phone: { pattern: /^\+?[0-9\s\-()]{7,15}$/ },
//   department: { required: true },
//   role: { required: true },
//   bio: { maxLength: 200 },
//   photo: {
//     required: false,
//     validate: (file) => {
//       if (!file) return "";
//       if (file.size > MAX_FILE_SIZE) return "File size must be less than 2 MB";
//       if (!file.type.startsWith("image/")) return "Only image files are allowed";
//       return "";
//     },
//   },
// };

// const Profile = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     department: "",
//     role: "",
//     bio: "",
//     photo: null,
//   });

//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   // Validate single field
//   const validateField = useCallback((name, value) => {
//     const rules = validationRules[name];
//     if (!rules) return "";

//     // Special case: photo
//     if (name === "photo") {
//       if (rules.required && !value) return "Photo is required";
//       if (value) {
//         if (value.size > MAX_FILE_SIZE) return "Photo size must be less than 2 MB";
//         if (!value.type.startsWith("image/")) return "Only image files are allowed";
//       }
//       return "";
//     }

//     if (rules.required && !value.trim()) return `${name ? name.charAt(0).toUpperCase() + name.slice(1) : "U"} is required`;
//     if (rules.minLength && value.length < rules.minLength) return `${name} must be at least ${rules.minLength} characters`;
//     if (rules.maxLength && value.length > rules.maxLength) return `${name} must be less than ${rules.maxLength} characters`;
//     if (rules.pattern && !rules.pattern.test(value)) {
//       switch (name) {
//         case "email":
//           return "Please enter a valid email address";
//         case "phone":
//           return "Please enter a valid phone number";
//         default:
//           return `Invalid ${name}`;
//       }
//     }
//     return "";
//   }, []);

//   const handleChange = useCallback(
//     (e) => {
//       const { name, type, value, files } = e.target;
//       const newValue = type === "file" ? (files && files[0] ? files[0] : null) : value;

//       setFormData((prev) => ({ ...prev, [name]: newValue }));

//       if (touched[name]) {
//         const error = validateField(name, newValue);
//         setErrors((prev) => ({ ...prev, [name]: error }));
//       }
//     },
//     [touched, validateField]
//   );

//   const handleBlur = useCallback(
//     (e) => {
//       const { name, value } = e.target;
//       setTouched((prev) => ({ ...prev, [name]: true }));

//       const error = validateField(name, value);
//       setErrors((prev) => ({ ...prev, [name]: error }));
//     },
//     [validateField]
//   );

//   const validateForm = useCallback(() => {
//     const newErrors = {};
//     let isValid = true;

//     Object.keys(formData).forEach((field) => {
//       const error = validateField(field, formData[field]);
//       if (error) {
//         newErrors[field] = error;
//         isValid = false;
//       }
//     });

//     setErrors(newErrors);
//     return isValid;
//   }, [formData, validateField]);

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
//         await new Promise((resolve) => setTimeout(resolve, 1000)); // fake API
//         setSubmitSuccess(true);
//       } catch (err) {
//         console.error("Error saving profile:", err);
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//     [formData, validateForm]
//   );

//   // Compact reusable Input
//   const InputField = React.memo(
//     ({ name, type = "text", placeholder, required = false }) => (
//       <div className="h-[4.5rem]">
//         <label
//           htmlFor={name}
//           className="block text-xs font-medium text-gray-700 mb-0.5"
//         >
//           {(name ? name.charAt(0).toUpperCase() + name.slice(1) : "U")}{" "}
//           {required && <span className="text-red-500">*</span>}
//         </label>
//         <input
//           id={name}
//           name={name}
//           type={type}
//           {...(type !== "file" && { value: formData[name] || "" })}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           placeholder={placeholder}
//           disabled={isSubmitting}
//           aria-invalid={errors[name] ? "true" : "false"}
//           aria-describedby={errors[name] ? `${name}-error` : undefined}
//           className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none
//             focus:ring-1 focus:ring-blue-500
//             ${errors[name] ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"}`}
//         />
//         <div className="h-4 mt-0.5">
//           {errors[name] && (
//             <div
//               id={`${name}-error`}
//               className="flex items-center gap-1 text-xs text-red-600"
//             >
//               <AlertCircle className="w-3 h-3" />
//               <span>{errors[name]}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     )
//   );

//   const SelectField = React.memo(({ name, options, required = false }) => (
//     <div className="h-[4.5rem]">
//       <label
//         htmlFor={name}
//         className="block text-xs font-medium text-gray-700 mb-0.5"
//       >
//         {(name ? name.charAt(0).toUpperCase() + name.slice(1) : "U")}{" "}
//         {required && <span className="text-red-500">*</span>}
//       </label>
//       <select
//         id={name}
//         name={name}
//         value={formData[name] || ""}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         disabled={isSubmitting}
//         aria-invalid={errors[name] ? "true" : "false"}
//         className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none
//           focus:ring-1 focus:ring-blue-500
//           ${errors[name] ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"}`}
//       >
//         <option value="">Select {name}</option>
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>
//       <div className="h-4 mt-0.5">
//         {errors[name] && (
//           <div className="flex items-center gap-1 text-xs text-red-600">
//             <AlertCircle className="w-3 h-3" />
//             <span>{errors[name]}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   ));

//   // Generate initials or fallback "U"
//   const getInitials = () => {
//     const { firstName, lastName } = formData;
//     if (firstName || lastName) {
//       return (
//         (firstName ? firstName[0].toUpperCase() : "") +
//         (lastName ? lastName[0].toUpperCase() : "")
//       );
//     }
//     return "U";
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-full mx-auto p-6 space-y-3 rounded-lg border border-gray-200 bg-white shadow-sm"
//       noValidate
//     >
//       <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>

//       {submitSuccess && (
//         <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-700">
//           <Check className="w-4 h-4" />
//           Profile updated successfully
//         </div>
//       )}

//       {/* Upload Photo */}
//       <div className="flex items-center gap-4 mb-6">
//         <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium text-gray-600">
//           {formData.photo ? (
//             <img
//               src={URL.createObjectURL(formData.photo)}
//               alt="Profile"
//               className="w-16 h-16 rounded-full object-cover"
//             />
//           ) : (
//             getInitials()
//           )}
//         </div>




// <div>
//   <label
//     htmlFor="photo"
//     className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium bg-white hover:bg-gray-50"
//   >
//     <Camera className="w-4 h-4" />
//     Change Photo
//   </label>
//   <input
//     id="photo"
//     name="photo"
//     type="file"
//     accept="image/png, image/jpeg, image/gif"
//     className="hidden"
//     onChange={handleChange}
//   />
//   <p className="text-xs text-gray-500 mt-1">
//     JPG, GIF or PNG. Max size 2MB.
//   </p>
// </div>


//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         <InputField name="firstName" placeholder="John" required />
//         <InputField name="lastName" placeholder="Doe" required />
//         <InputField name="email" type="email" placeholder="john@company.com" required />
//         <InputField name="phone" type="tel" placeholder="+1 (555) 123-4567" />
//         <SelectField name="department" options={["IT", "HR", "Finance"]} required />
//         <SelectField name="role" options={["Admin", "User", "Manager"]} required />
//       </div>

//       <div>
//         <label
//           htmlFor="bio"
//           className="block text-xs font-medium text-gray-700 mb-0.5"
//         >
//           Bio
//         </label>
//         <textarea
//           id="bio"
//           name="bio"
//           rows={3}
//           value={formData.bio}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           maxLength={200}
//           placeholder="Tell us about yourself..."
//           disabled={isSubmitting}
//           className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none
//             focus:ring-1 focus:ring-blue-500
//             ${errors.bio ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"}`}
//         />
//         <div className="h-4 mt-0.5">
//           {errors.bio && (
//             <div className="flex items-center gap-1 text-xs text-red-600">
//               <AlertCircle className="w-3 h-3" />
//               <span>{errors.bio}</span>
//             </div>
//           )}
//         </div>
//       </div>





//  <button
//                 type="submit"
//                 className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
//                 disabled={isSubmitting}
//               >
//                 {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg> */}
//                 {isSubmitting ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   'Save changes'
//                 )}
//               </button>


//     </form>
//   );
// };

// export default Profile;
import { useState, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";

const validationRules = {
  currentPassword: { required: true, minLength: 6 },
  newPassword: { required: true, minLength: 6 },
  confirmPassword: {
    required: true,
    validate: (value, formData) => {
      if (value !== formData.newPassword) return "Passwords do not match";
      return "";
    },
  },
};

export default function SecuritySettings() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";

    if (rules.required && !value.trim()) return `${name} is required`;
    if (rules.minLength && value.length < rules.minLength)
      return `${name} must be at least ${rules.minLength} characters`;
    if (rules.validate) return rules.validate(value, formData);

    return "";
  }, [formData]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!validateForm()) {
        const allTouched = {};
        Object.keys(formData).forEach((key) => (allTouched[key] = true));
        setTouched(allTouched);
        return;
      }

      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        alert("Password updated!");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setErrors({});
        setTouched({});
      }, 1000);
    },
    [formData, validateForm]
  );

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-sm space-y-4"
        aria-labelledby="change-password-heading"
      >
        <h2 id="change-password-heading" className="text-lg font-semibold">
          Change Password
        </h2>

        {/** Password Fields **/}
        {["currentPassword", "newPassword", "confirmPassword"].map((field) => {
          const showField = field === "currentPassword" ? showCurrent : field === "newPassword" ? showNew : showConfirm;
          const toggleShow = field === "currentPassword" ? () => setShowCurrent(!showCurrent)
            : field === "newPassword" ? () => setShowNew(!showNew)
            : () => setShowConfirm(!showConfirm);

          const labelMap = {
            currentPassword: "Current Password",
            newPassword: "New Password",
            confirmPassword: "Confirm Password",
          };

          return (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                {labelMap[field]}
              </label>
              <div className="relative">
                <input
                  id={field}
                  name={field}
                  type={showField ? "text" : "password"}
                  value={formData[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={`Enter ${labelMap[field].toLowerCase()}`}
                  className="w-full px-3 py-2 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={toggleShow}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label={showField ? `Hide ${labelMap[field].toLowerCase()}` : `Show ${labelMap[field].toLowerCase()}`}
                >
                  {showField ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          );
        })}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Update Password"}
        </button>
      </form>

      {/* Two-Factor Authentication */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4" aria-labelledby="two-factor-heading">
        <h2 id="two-factor-heading" className="text-lg font-semibold">
          Two-Factor Authentication
        </h2>

        {/** SMS Authentication **/}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">SMS Authentication</p>
            <p className="text-gray-500 text-sm">Receive codes via SMS</p>
          </div>
          <input
            type="checkbox"
            // checked={smsAuth}
            // onChange={() => setSmsAuth(!smsAuth)}
            className="toggle-checkbox"
            aria-label="Enable or disable SMS Authentication"
          />
        </div>

        {/** Email Authentication **/}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Email Authentication</p>
            <p className="text-gray-500 text-sm">Receive codes via email</p>
          </div>
          <input
            type="checkbox"
            // checked={emailAuth}
            // onChange={() => setEmailAuth(!emailAuth)}
            className="toggle-checkbox"
            aria-label="Enable or disable Email Authentication"
          />
        </div>
      </div>
    </div>
  );
}
