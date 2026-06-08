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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/addAdmin`, {
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



