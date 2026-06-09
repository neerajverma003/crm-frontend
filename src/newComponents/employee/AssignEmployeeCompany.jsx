import React, { useEffect, useState } from "react";

const AssignEmployeeCompany = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    selectedEmployee: "",
    assignedCompanies: [],
  });

  const getAllCompany = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/company/all`);
      const result = await response.json();
      setCompanyList(result.companies || []);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  const getAllEmployees = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/employee/allEmployee`);
      const result = await response.json();
      setEmployeeList(result.employees || []);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    getAllCompany();
    getAllEmployees();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (companyId) => {
    setFormData((prev) => {
      const { assignedCompanies } = prev;
      return assignedCompanies.includes(companyId)
        ? { ...prev, assignedCompanies: assignedCompanies.filter((id) => id !== companyId) }
        : { ...prev, assignedCompanies: [...assignedCompanies, companyId] };
    });
  };

  const handleAssign = async () => {
    const { selectedEmployee, assignedCompanies } = formData;
    if (!selectedEmployee) return alert("Please select an employee.");
    if (!assignedCompanies.length) return alert("Please select at least one company.");

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employee/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: selectedEmployee, companyIds: assignedCompanies }),
      });
      const result = await res.json();
      if (res.ok) {
        alert("Companies assigned successfully!");
        setFormData({ selectedEmployee: "", assignedCompanies: [] });
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

  const selectClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer";
  const labelClass = "block mb-1.5 text-sm font-medium text-gray-700";

  return (
    <div className="w-full px-4 py-6 md:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Assign Company to Employee</h1>
        <p className="text-gray-500 text-sm mt-1">Link employees to their respective companies.</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 md:p-6 flex flex-col gap-6">

          {/* Employee Select */}
          <div>
            <label className={labelClass}>Select Employee</label>
            <div className="relative">
              <select
                value={formData.selectedEmployee}
                onChange={(e) => handleInputChange("selectedEmployee", e.target.value)}
                className={selectClass}
              >
                <option value="">— Choose Employee —</option>
                {employeeList.length > 0 ? (
                  employeeList.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.fullName} ({employee.department?.dep || "No Dept"})
                    </option>
                  ))
                ) : (
                  <option disabled>Loading employees...</option>
                )}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Company Checkboxes */}
          <div>
            <label className={labelClass}>Assign Companies</label>
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
              {companyList.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">Loading companies...</p>
              ) : (
                companyList.map((company, idx) => {
                  const isChecked = formData.assignedCompanies.includes(company._id);
                  return (
                    <button
                      key={company._id}
                      type="button"
                      onClick={() => handleCheckboxChange(company._id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 ${
                        idx !== companyList.length - 1 ? "border-b border-gray-100" : ""
                      } hover:bg-gray-50`}
                    >
                      <span
                        className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                          isChecked ? "border-blue-600 bg-blue-600 shadow-sm" : "border-gray-300 bg-white"
                        }`}
                      >
                        {isChecked && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-sm ${isChecked ? "font-medium text-gray-900" : "text-gray-700"}`}>
                        {company.companyName}
                      </span>
                      {isChecked && (
                        <span className="ml-auto text-xs text-blue-700 font-medium">Selected</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Selection Summary */}
            {formData.assignedCompanies.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-md border border-gray-200">
                  {formData.assignedCompanies.length} compan{formData.assignedCompanies.length !== 1 ? "ies" : "y"} selected
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={handleAssign}
              disabled={loading}
              className={`w-full py-2.5 rounded-lg text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                loading
                  ? "bg-blue-400 cursor-not-allowed shadow-none"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow active:scale-[0.99]"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Assigning...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Assign Company
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignEmployeeCompany;