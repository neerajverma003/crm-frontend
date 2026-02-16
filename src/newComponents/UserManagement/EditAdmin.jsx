import React, { useState, useEffect, useCallback } from "react";
import Modal from "./Modal.jsx";
import axios from "axios";

const EditAdmin = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    officialEmail: "",
    phone: "",
    officialNo: "",
    emergencyNo: "",
    salary: "",
    password: "",
    isActive: true,
    showPassword: false,
    role: "Admin",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        officialEmail: user.officialEmail || user.officialEmail || "",
        phone: user.phone || "",
        officialNo: user.officialNo || "",
        emergencyNo: user.emergencyNo || "",
        salary: user.salary || "",
        isActive: user.accountActive ?? true,
        role: user.role || "Admin",
      }));
    }
  }, [user]);

  const handleChange = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user._id) return;
    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        officialEmail: formData.officialEmail,
        phone: formData.phone,
        officialNo: formData.officialNo,
        emergencyNo: formData.emergencyNo,
        salary: formData.salary,
        accountActive: formData.isActive,
        role: formData.role,
      };

      if (formData.password) payload.password = formData.password;

      const res = await axios.put(`http://localhost:4000/editAdmin/${user._id}`, payload);

      alert(res.data?.message || "Admin updated successfully");
      if (onSave) onSave(res.data.admin || res.data);
      onClose();
    } catch (err) {
      console.error("Edit admin failed:", err);
      alert(err.response?.data?.message || "Failed to update admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Edit Admin</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
            <input value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Official Email</label>
            <input type="email" value={formData.officialEmail} onChange={(e) => handleChange("officialEmail", e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Official Number</label>
            <input type="tel" value={formData.officialNo} onChange={(e) => handleChange("officialNo", e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Emergency Number</label>
            <input type="tel" value={formData.emergencyNo} onChange={(e) => handleChange("emergencyNo", e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
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

          <div className="relative md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Password (leave blank to keep)</label>
            <input type={formData.showPassword ? "text" : "password"} value={formData.password} onChange={(e) => handleChange("password", e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="New password (optional)" />
            <button type="button" onClick={() => handleChange("showPassword", !formData.showPassword)} className="absolute right-3 top-9 text-gray-500">{formData.showPassword ? "Hide" : "Show"}</button>
          </div>

          <div className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" checked={formData.isActive} onChange={(e) => handleChange("isActive", e.target.checked)} className="rounded border-gray-300" />
            <label className="text-sm font-medium text-gray-700">Account Active</label>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button type="button" onClick={onClose} className="rounded-md border border-gray-300 px-4 py-2 text-gray-700">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="rounded-md bg-black px-4 py-2 text-white">{isSubmitting ? "Updating..." : "Update Admin"}</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditAdmin;
