import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("form");

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
        headers: { "Content-Type": "application/json" },
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
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
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

  const inputClass =
    "w-full px-4 py-2.5 border border-blue-100 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:border-blue-300";

  const labelClass = "block mb-1.5 text-sm font-semibold text-blue-900 tracking-wide";

  return (
    <div className="w-full px-0 sm:px-6 py-0 sm:py-6">
      {/* Header Card */}
      <div className="sm:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 shadow-xl px-4 sm:px-8 py-5 sm:py-7 mb-4 sm:mb-6 flex items-center gap-4 sm:gap-5">
        <div className="bg-white/20 rounded-2xl p-3">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Management</h1>
          <p className="text-blue-100 text-sm mt-0.5">Create and manage administrator accounts</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="md:bg-white md:rounded-3xl md:shadow-xl overflow-hidden md:border border-blue-100">

        {/* Tab Bar */}
        <div className="flex bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeTab === "form"
                ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-200"
                : "text-blue-700 hover:bg-blue-100"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Admin
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeTab === "all"
                ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-200"
                : "text-blue-700 hover:bg-blue-100"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            All Admins
          </button>
        </div>

        {/* Content */}
        <div className="p-3 md:p-8">
          {activeTab === "form" ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Full Name */}
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter full name"
                  required
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>

              {/* Personal Email */}
              <div>
                <label className={labelClass}>Personal Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>

              {/* Official Email */}
              <div>
                <label className={labelClass}>Official Email</label>
                <input
                  type="email"
                  value={formData.officialEmail}
                  onChange={(e) => handleInputChange("officialEmail", e.target.value)}
                  placeholder="Enter official email"
                  required
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Phone number"
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>

              {/* Official Number */}
              <div>
                <label className={labelClass}>Official Number</label>
                <input
                  type="tel"
                  value={formData.officialNo}
                  onChange={(e) => handleInputChange("officialNo", e.target.value)}
                  placeholder="Official contact number"
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>

              {/* Emergency Number */}
              <div>
                <label className={labelClass}>Emergency Number</label>
                <input
                  type="tel"
                  value={formData.emergencyNo}
                  onChange={(e) => handleInputChange("emergencyNo", e.target.value)}
                  placeholder="Emergency contact number"
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>

              {/* Role */}
              <div>
                <label className={labelClass}>Role</label>
                <input
                  type="text"
                  value={formData.role}
                  readOnly
                  disabled
                  className="w-full px-4 py-2.5 border border-blue-100 rounded-xl bg-blue-50 text-blue-400 cursor-not-allowed font-semibold"
                />
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    type={formData.showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter password"
                    required
                    disabled={isSubmitting}
                    className={`${inputClass} pr-20`}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
                  >
                    {formData.showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Account Active Toggle */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl px-5 py-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange("isActive", !formData.isActive)}
                    disabled={isSubmitting}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none flex-shrink-0 ${
                      formData.isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md shadow-blue-200"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                        formData.isActive ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Account Active</p>
                    <p className="text-xs text-blue-400 mt-0.5">
                      {formData.isActive ? "Admin can log in immediately" : "Account will be inactive"}
                    </p>
                  </div>
                  <span
                    className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${
                      formData.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 rounded-2xl text-white font-bold text-base tracking-wide transition-all duration-200 shadow-lg ${
                    isSubmitting
                      ? "bg-blue-300 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Adding Admin...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Admin
                    </span>
                  )}
                </button>
              </div>

            </form>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-blue-900 text-lg">All Administrators</h3>
              </div>
              <UserTable onlyAdmins={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;