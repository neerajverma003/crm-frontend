import React, { useState } from "react";
import axios from "axios";
import UserTable from "./UserTable";

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    officialEmail: "",
    phone: "",
    officialNo: "",
    emergencyNo: "",
    password: "",
    isActive: true,
    showPassword: false,
    role: "Admin",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleShowPassword = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:4000/addAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        officialEmail: formData.officialEmail,
        phone: formData.phone,
        officialNo: formData.officialNo,
        emergencyNo: formData.emergencyNo,
        password: formData.password,
        accountActive: formData.isActive,
        role: formData.role,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    alert("Admin added successfully!");
    setFormData({
      fullName: "",
      email: "",
      officialEmail: "",
      phone: "",
      officialNo: "",
      emergencyNo: "",
      password: "",
      isActive: true,
      showPassword: false,
      role: "Admin",
    });
  } catch (error) {
    console.error(error);
    alert("Failed to add admin. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  const [activeTab, setActiveTab] = useState("form");

  return (
    <div className="max-w-7xl mx-auto mt-1 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Add New Admin</h2>

      <div className="flex items-center justify-end gap-3 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("form")}
          className={`px-4 py-2 rounded-md font-medium ${activeTab === "form" ? "bg-black text-white" : "bg-gray-100 text-gray-700"}`}
        >
          Add Admin
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-md font-medium ${activeTab === "all" ? "bg-black text-white" : "bg-gray-100 text-gray-700"}`}
        >
          All Admins
        </button>
      </div>

      {activeTab === "form" ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Full Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter full name"
            required
            disabled={isSubmitting}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter email address"
            required
            disabled={isSubmitting}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Official Email */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Official Email</label>
          <input
            type="email"
            value={formData.officialEmail}
            onChange={(e) => handleInputChange("officialEmail", e.target.value)}
            placeholder="Enter official email"
            required
            disabled={isSubmitting}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Phone number"
            disabled={isSubmitting}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Official Number */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Official Number</label>
          <input
            type="tel"
            value={formData.officialNo}
            onChange={(e) => handleInputChange("officialNo", e.target.value)}
            placeholder="Official contact number"
            disabled={isSubmitting}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Emergency Number */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Emergency Number</label>
          <input
            type="tel"
            value={formData.emergencyNo}
            onChange={(e) => handleInputChange("emergencyNo", e.target.value)}
            placeholder="Emergency contact number"
            disabled={isSubmitting}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Role (Fixed) */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Role</label>
          <input
            type="text"
            value={formData.role}
            readOnly
            disabled
            className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col relative col-span-1 md:col-span-2">
          <label className="mb-1 font-medium text-gray-700">Password</label>
          <input
            type={formData.showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="Enter password"
            required
            disabled={isSubmitting}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black pr-16"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-12 -translate-y-1/2 text-blue-600 font-medium"
          >
            {formData.showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Account Active */}
        <div className="flex items-center col-span-1 md:col-span-2 gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleInputChange("isActive", e.target.checked)}
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label className="font-medium text-gray-700">Account Active</label>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-md text-white font-semibold ${
              isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"
            } transition-colors`}
          >
            {isSubmitting ? "Adding..." : "Add Admin"}
          </button>
        </div>
        </form>
      ) : (
        <div className="bg-white border rounded-md shadow-sm p-4">
          <h3 className="font-semibold mb-3">All Admins</h3>
          <UserTable onlyAdmins={true} />
        </div>
      )}

    </div>
  );
};

export default AddAdmin;




   // <form
    //   onSubmit={handleSubmit}
    //   style={{
    //     maxWidth: "720px",
    //     margin: "40px auto",
    //     padding: "24px",
    //     backgroundColor: "#fff",
    //     borderRadius: "8px",
    //     boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
    //     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    //   }}
    // >
    //   <h2
    //     style={{
    //       marginBottom: "24px",
    //       fontWeight: "600",
    //       fontSize: "1.25rem",
    //       color: "#222",
    //     }}
    //   >
    //     Add New Admin
    //   </h2>

    //   {/* Full Name (full width) */}
    //   <InputField
    //     label="Full Name"
    //     id="fullName"
    //     type="text"
    //     value={formData.fullName}
    //     onChange={(e) => handleInputChange("fullName", e.target.value)}
    //     required
    //     placeholder="Enter full name"
    //   />

    //   {/* Two inputs side by side: Email and Phone */}
    //   <div style={{ display: "flex", gap: "20px" }}>
    //     <InputField
    //       label="Email"
    //       id="email"
    //       type="email"
    //       value={formData.email}
    //       onChange={(e) => handleInputChange("email", e.target.value)}
    //       required
    //       placeholder="Enter email address"
    //     />
    //     <InputField
    //       label="Phone"
    //       id="phone"
    //       type="tel"
    //       value={formData.phone}
    //       onChange={(e) => handleInputChange("phone", e.target.value)}
    //       placeholder="Phone number"
    //     />
    //   </div>

    //   {/* Two inputs side by side: Official Number and Emergency Number */}
    //   <div style={{ display: "flex", gap: "20px" }}>
    //     <InputField
    //       label="Official Number"
    //       id="officialNo"
    //       type="tel"
    //       value={formData.officialNo}
    //       onChange={(e) => handleInputChange("officialNo", e.target.value)}
    //       placeholder="Official contact number"
    //     />
    //     <InputField
    //       label="Emergency Number"
    //       id="emergencyNo"
    //       type="tel"
    //       value={formData.emergencyNo}
    //       onChange={(e) => handleInputChange("emergencyNo", e.target.value)}
    //       placeholder="Emergency contact number"
    //     />
    //   </div>

    //   {/* Password field with show/hide button */}
    //   <div style={{ marginBottom: "24px", position: "relative", maxWidth: "420px" }}>
    //     <label
    //       htmlFor="password"
    //       style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "0.9rem", color: "#333" }}
    //     >
    //       Password
    //     </label>
    //     <input
    //       id="password"
    //       type={formData.showPassword ? "text" : "password"}
    //       value={formData.password}
    //       onChange={(e) => handleInputChange("password", e.target.value)}
    //       required
    //       disabled={isSubmitting}
    //       placeholder="Enter password"
    //       style={{
    //         width: "100%",
    //         padding: "10px 44px 10px 12px",
    //         fontSize: "1rem",
    //         borderRadius: "6px",
    //         border: "1.5px solid #ccc",
    //         transition: "border-color 0.2s",
    //         boxSizing: "border-box",
    //       }}
    //       onFocus={(e) => (e.target.style.borderColor = "#000")}
    //       onBlur={(e) => (e.target.style.borderColor = "#ccc")}
    //     />
    //     <button
    //       type="button"
    //       onClick={toggleShowPassword}
    //       disabled={isSubmitting}
    //       style={{
    //         position: "absolute",
    //         right: "12px",
    //         top: "50%",
    //         transform: "translateY(-50%)",
    //         background: "none",
    //         border: "none",
    //         color: "#007bff",
    //         fontWeight: "600",
    //         cursor: "pointer",
    //         fontSize: "0.9rem",
    //         userSelect: "none",
    //         padding: "0",
    //       }}
    //       tabIndex={-1}
    //       aria-label={formData.showPassword ? "Hide password" : "Show password"}
    //     >
    //       {formData.showPassword ? "Hide" : "Show"}
    //     </button>
    //   </div>

    //   {/* Account active checkbox */}
    //   <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
    //     <input
    //       id="accountActive"
    //       type="checkbox"
    //       checked={formData.isActive}
    //       onChange={(e) => handleInputChange("isActive", e.target.checked)}
    //       disabled={isSubmitting}
    //       style={{ width: "18px", height: "18px", cursor: "pointer" }}
    //     />
    //     <label htmlFor="accountActive" style={{ fontWeight: "600", fontSize: "1rem", cursor: "pointer" }}>
    //       Account Active
    //     </label>
    //   </div>

    //   {/* Submit button */}
    //   <button
    //     type="submit"
    //     disabled={isSubmitting}
    //     style={{
    //       width: "100%",
    //       padding: "12px 0",
    //       fontSize: "1.1rem",
    //       fontWeight: "700",
    //       backgroundColor: isSubmitting ? "#555" : "#000",
    //       color: "#fff",
    //       borderRadius: "6px",
    //       cursor: isSubmitting ? "not-allowed" : "pointer",
    //       transition: "background-color 0.3s",
    //       maxWidth: "420px",
    //     }}
    //   >
    //     {isSubmitting ? "Adding..." : "Add Admin"}
    //   </button>
    // </form>