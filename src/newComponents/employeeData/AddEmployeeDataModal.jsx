import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

const AddEmployeeDataModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    employeeName: "",
    fatherName: "",
    motherName: "",
    employeePhoneNumber: "",
    emergencyPhoneNumber: "",
    email: "",
    parentAddress: "",
    presentAddress: "",
    company: "",
    department: "",
    designation: "",
  });

  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      // Extract IDs from nested objects
      const companyId = typeof initialData.company === 'object' ? initialData.company?._id : initialData.company;
      const departmentId = typeof initialData.department === 'object' ? initialData.department?._id : initialData.department;
      const designationId = typeof initialData.designation === 'object' ? initialData.designation?._id : initialData.designation;

      setFormData({
        employeeName: initialData.employeeName || "",
        fatherName: initialData.fatherName || "",
        motherName: initialData.motherName || "",
        employeePhoneNumber: initialData.employeePhoneNumber || "",
        emergencyPhoneNumber: initialData.emergencyPhoneNumber || "",
        email: initialData.email || "",
        parentAddress: initialData.parentAddress || "",
        presentAddress: initialData.presentAddress || "",
        company: companyId || "",
        department: departmentId || "",
        designation: designationId || "",
      });

      // If editing, fetch departments for the company and designations for the department
      if (companyId) {
        getDepartments(companyId);
        if (departmentId) {
          getDesignations(companyId, departmentId);
        }
      }
    }
  }, [initialData]);

  useEffect(() => {
    getCompanies();
  }, []);

  // ✅ Fetch companies
  const getCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:4000/company/all");
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      setError("Failed to fetch companies.");
    }
  };

  // ✅ Fetch departments by company
  const getDepartments = async (companyId) => {
    if (!companyId) {
      setDepartments([]);
      return;
    }

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

  // ✅ Fetch designations by company and department
  const getDesignations = async (companyId, departmentId) => {
    if (!companyId || !departmentId) {
      setDesignations([]);
      return;
    }

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "company") {
      // When company changes, reset department and designation
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        department: "",
        designation: "",
      }));
      setDepartments([]);
      setDesignations([]);
      if (value) getDepartments(value);
    } else if (name === "department") {
      // When department changes, reset designation
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        designation: "",
      }));
      setDesignations([]);
      if (value) getDesignations(formData.company, value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.employeeName ||
      !formData.fatherName ||
      !formData.motherName ||
      !formData.employeePhoneNumber ||
      !formData.emergencyPhoneNumber ||
      !formData.email ||
      !formData.parentAddress ||
      !formData.presentAddress ||
      !formData.company ||
      !formData.department ||
      !formData.designation
    ) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = initialData
        ? `http://localhost:4000/employeedata/${initialData._id}`
        : "http://localhost:4000/employeedata";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        onSave();
      } else {
        setError(result.message || "Failed to save employee data");
      }
    } catch (err) {
      console.error("Error saving employee data:", err);
      setError("Error saving employee data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between rounded-t-xl">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {initialData ? "Edit Employee Information" : "Add New Employee"}
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              {initialData ? "Update employee profile details" : "Create a new employee record"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-500 rounded-lg transition-all text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[calc(100vh-240px)] overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-medium flex items-start gap-3">
              <span className="text-lg leading-none">⚠️</span>
              {error}
            </div>
          )}

          {/* Personal Information Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-blue-600 flex items-center">
              <span className="w-1 h-6 bg-blue-600 rounded mr-3"></span>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Employee Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  required
                />
              </div>

              {/* Father Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Father's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  placeholder="Enter father's name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  required
                />
              </div>

              {/* Mother Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mother's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  placeholder="Enter mother's name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-green-600 flex items-center">
              <span className="w-1 h-6 bg-green-600 rounded mr-3"></span>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Employee Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="employeePhoneNumber"
                  value={formData.employeePhoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  required
                />
              </div>

              {/* Emergency Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Emergency Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="emergencyPhoneNumber"
                  value={formData.emergencyPhoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter emergency phone number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-purple-600 flex items-center">
              <span className="w-1 h-6 bg-purple-600 rounded mr-3"></span>
              Address Information
            </h2>
            <div className="grid grid-cols-1 gap-5">
              {/* Parent Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Parent Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="parentAddress"
                  value={formData.parentAddress}
                  onChange={handleInputChange}
                  placeholder="Enter complete parent address"
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none bg-white"
                  required
                />
              </div>

              {/* Present Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Present Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="presentAddress"
                  value={formData.presentAddress}
                  onChange={handleInputChange}
                  placeholder="Enter complete present address"
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-orange-600 flex items-center">
              <span className="w-1 h-6 bg-orange-600 rounded mr-3"></span>
              Employment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <select
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white cursor-pointer"
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map((comp) => (
                    <option key={comp._id} value={comp._id}>
                      {comp.companyName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white cursor-pointer"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white cursor-pointer"
                  required
                >
                  <option value="">Select Designation</option>
                  {designations.map((des) => (
                    <option key={des.id} value={des.id}>
                      {des.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-8 py-4 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : initialData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeDataModal;
