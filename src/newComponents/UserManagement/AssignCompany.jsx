import React, { useEffect, useState } from 'react';

const AssignCompany = () => {
  // State for API data
  const [adminList, setAdminList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    selectedAdmin: '',
    assignedCompanies: [],
  });

  // Fetch all companies
  const getAllCompany = async () => {
    try {
      const response = await fetch("http://localhost:4000/company/all");
      const result = await response.json();
      setCompanyList(result.companies || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all admins
  const getAllAdmin = async () => {
    try {
      const response = await fetch("http://localhost:4000/getAdmins");
      const result = await response.json();
      setAdminList(result || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCompany();
    getAllAdmin();
  }, []);

  // Handle dropdown changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle company checkbox toggle
  const handleCheckboxChange = (companyId) => {
    setFormData((prev) => {
      const { assignedCompanies } = prev;
      if (assignedCompanies.includes(companyId)) {
        return {
          ...prev,
          assignedCompanies: assignedCompanies.filter((id) => id !== companyId),
        };
      } else {
        return {
          ...prev,
          assignedCompanies: [...assignedCompanies, companyId],
        };
      }
    });
  };

  // Assign button handler
  const handleAssign = async () => {
    const { selectedAdmin, assignedCompanies } = formData;

    if (!selectedAdmin) return alert("Please select an admin.");
    if (!assignedCompanies.length) return alert("Please select at least one company.");

    // Build the payload for backend - assign companies to admin
    const payload = {
      adminId: selectedAdmin,
      companyIds: assignedCompanies, // array of company IDs
    };

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Companies assigned successfully ✅");
        setFormData({
          selectedAdmin: "",
          assignedCompanies: [],
        });
      } else {
        alert(result.message || "Failed to assign companies.");
      }
    } catch (error) {
      console.error("Error assigning companies:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Assign Company</h2>
      <form className="grid grid-cols-1 gap-4">
        {/* Admin Dropdown */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Select Admin</label>
          <select
            value={formData.selectedAdmin}
            onChange={(e) => handleInputChange('selectedAdmin', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">-- Choose Admin --</option>
            {adminList.length > 0 ? (
              adminList.map((admin) => (
                <option key={admin._id} value={admin._id}>
                  {admin.fullName}
                </option>
              ))
            ) : (
              <option disabled>Loading admins...</option>
            )}
          </select>
        </div>

        {/* Company Checkboxes */}
        <div className="flex flex-col gap-2">
          <label className="mb-1 font-medium text-gray-700">Assign Companies</label>
          {companyList.length > 0 ? (
            companyList.map((company) => (
              <div key={company._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.assignedCompanies.includes(company._id)}
                  onChange={() => handleCheckboxChange(company._id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <label className="font-medium text-gray-700">{company.companyName}</label>
              </div>
            ))
          ) : (
            <p>Loading companies...</p>
          )}
        </div>

        {/* Assign Button */}
        <button
          type="button"
          onClick={handleAssign}
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
          } transition-colors`}
        >
          {loading ? "Assigning..." : "Assign"}
        </button>
      </form>
    </div>
  );
};

export default AssignCompany;
