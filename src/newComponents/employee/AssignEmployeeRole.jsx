import React, { useEffect, useState } from "react";

const AssignEmployeeRole = () => {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    selectedEmployee: "",
    selectedCompany: "",
    selectedRoles: [],
    selectedSubRoles: [],
    selectedPoints: [],
  });

  // ============================================
  // FETCH EMPLOYEES
  // ============================================
  const getAllEmployees = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employee/allEmployee`);
      const data = await res.json();
      if (res.ok) setEmployees(data.employees || []);
    } catch (err) {
      console.error("❌ Error fetching employees:", err);
    }
  };

  // FETCH ROLES (from EmployeeRole instead of admin Role)
  const getAllRoles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employeerole/getemployeerole`);
      const data = await res.json();
      if (res.ok) setRoles(data.data || []);
    } catch (err) {
      console.error("❌ Error fetching roles:", err);
    }
  };

  // FETCH ALL COMPANIES
  const getAllCompanies = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/company/all`);
      const data = await res.json();
      if (res.ok) setCompanies(data.companies || []);
    } catch (err) {
      console.error("❌ Error fetching companies:", err);
    }
  };

  // ============================================
  // FETCH COMPANY BY EMPLOYEE
  // ============================================
  const getCompaniesByEmployee = async (employeeId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employee/getCompanyByEmployeeId/${employeeId}`);
      const data = await res.json();

      console.log("🏢 Employee Companies Data:", data);

      if (data.success) {
        const companiesData = data.assignedCompanies;

        // FIX: Convert object → array
        setCompanies(Array.isArray(companiesData) ? companiesData : [companiesData]);
      } else {
        setCompanies([]);
      }
    } catch (err) {
      console.error("❌ Error fetching employee companies:", err);
      setCompanies([]);
    }
  };

  // Fetch assigned roles for an employee and company by calling existing employee endpoint
  const getAssignedRolesForEmployeeAndCompany = async (employeeId, companyId) => {
    if (!employeeId || !companyId) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employee/getAssignedRoles/${employeeId}`);
      const data = await res.json();
      console.log("👷‍♂️ Employee assigned roles raw:", data);

      if (!data.success) {
        setFormData((prev) => ({ ...prev, selectedRoles: [], selectedSubRoles: [], selectedPoints: [] }));
        return;
      }

      const assigned = Array.isArray(data.assignedRoles) ? data.assignedRoles : [];

      // Filter assignments that include the selected company
      const matched = assigned.filter((ar) => Array.isArray(ar.companyIds) && ar.companyIds.map(String).includes(String(companyId)));

      const roleSet = new Set();
      const subRoleSet = new Set();
      const pointSet = new Set();

      matched.forEach((ar) => {
        (ar.roleId || []).forEach((r) => roleSet.add(String(r)));

        // ar.subRoles items might be ObjectId strings or objects like { _id, subRoleName }
        (ar.subRoles || []).forEach((s) => {
          if (!s) return;
          if (typeof s === "object") {
            const id = s._id ? String(s._id) : String(s);
            subRoleSet.add(id);
          } else {
            subRoleSet.add(String(s));
          }
        });

        (ar.points || []).forEach((p) => pointSet.add(String(p)));
      });

      setFormData((prev) => ({
        ...prev,
        selectedRoles: Array.from(roleSet),
        selectedSubRoles: Array.from(subRoleSet),
        selectedPoints: Array.from(pointSet),
      }));
    } catch (err) {
      console.error("❌ Error fetching assigned roles for employee:", err);
      setFormData((prev) => ({ ...prev, selectedRoles: [], selectedSubRoles: [], selectedPoints: [] }));
    }
  };

  // ============================================
  // USE EFFECTS
  // ============================================
  useEffect(() => {
    getAllEmployees();
    getAllRoles();
  }, []);

  useEffect(() => {
    if (formData.selectedEmployee) {
      getCompaniesByEmployee(formData.selectedEmployee);
    } else {
      setCompanies([]);
    }

    // Clear company + role selections when employee changes
    setFormData((prev) => ({ ...prev, selectedCompany: "", selectedRoles: [], selectedSubRoles: [], selectedPoints: [] }));
  }, [formData.selectedEmployee]);


  // When company is selected, fetch assigned roles/subroles/points for that employee+company
  useEffect(() => {
    if (formData.selectedEmployee && formData.selectedCompany) {
      getAssignedRolesForEmployeeAndCompany(formData.selectedEmployee, formData.selectedCompany);
    } else {
      // clear selections when no company
      setFormData((prev) => ({ ...prev, selectedRoles: [], selectedSubRoles: [], selectedPoints: [] }));
    }
  }, [formData.selectedCompany, formData.selectedEmployee]);

  // ============================================
  // TOGGLE HELPERS
  // ============================================
  const toggleSelection = (array, item) => {
    const s = String(item);
    return array.includes(s) ? array.filter((i) => i !== s) : [...array, s];
  };

  const handleRoleToggle = (roleId) => {
    const id = String(roleId);
    setFormData((prev) => ({
      ...prev,
      selectedRoles: toggleSelection(prev.selectedRoles, id),
    }));
  };

  const handleSubRoleToggle = (subRoleId) => {
    const id = String(subRoleId);
    setFormData((prev) => ({
      ...prev,
      selectedSubRoles: toggleSelection(prev.selectedSubRoles, id),
    }));
  };

  const handlePointToggle = (point) => {
    const p = String(point);
    setFormData((prev) => ({
      ...prev,
      selectedPoints: toggleSelection(prev.selectedPoints, p),
    }));
  };

  // ============================================
  // ASSIGN ROLE
  // ============================================
  const handleAssign = async () => {
    const { selectedEmployee, selectedCompany, selectedRoles, selectedSubRoles, selectedPoints } = formData;

    if (!selectedEmployee) return alert("Please select an employee.");
    if (!selectedCompany) return alert("Please select a company.");
    if (!selectedRoles.length) return alert("Please select at least one role.");

    setLoading(true);
    setMessage("");
    console.log(selectedEmployee, selectedCompany, selectedRoles, selectedSubRoles, selectedPoints);

    try {
      const payload = {
        employeeId: selectedEmployee,
        companyIds: [selectedCompany],
        workRoles: selectedRoles,
        subRoles: selectedSubRoles,
        points: selectedPoints,
      };

      console.log("📤 Sending Payload:", payload);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/employee/assignRole`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("📥 Response:", result);

      if (res.ok) {
        setMessage("✅ Work Role assigned successfully!");

        setFormData({
          selectedEmployee: "",
          selectedCompany: "",
          selectedRoles: [],
          selectedSubRoles: [],
          selectedPoints: [],
        });

        setCompanies([]);
        getAllEmployees();
        getAllRoles();
      } else {
        setMessage(`❌ ${result.message || "Failed to assign role"}`);
      }
    } catch (error) {
      console.error("❌ Error assigning role:", error);
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER UI
  // ============================================
  const selectClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";
  const labelClass = "block mb-1.5 text-sm font-medium text-gray-700";

  return (
    <div className="w-full p-0 sm:p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6 px-4 pt-4 sm:px-0 sm:pt-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Assign Work Role to Employee</h1>
        <p className="text-gray-500 text-sm mt-1">Assign roles & permissions to employees.</p>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${message.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message}
        </div>
      )}

      {/* Card */}
      <div className="bg-white sm:rounded-xl shadow-none sm:shadow-sm border-0 sm:border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-5 md:p-6 flex flex-col gap-5 sm:gap-6">

          {/* Employee Select */}
          <div>
            <label className={labelClass}>Select Employee</label>
            <div className="relative">
              <select
                value={formData.selectedEmployee}
                onChange={(e) => setFormData({ ...formData, selectedEmployee: e.target.value })}
                className={selectClass}
              >
                <option value="">— Choose Employee —</option>
                {employees.filter((emp) => emp.accountActive === true).map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.fullName}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Company Select */}
          <div>
            <label className={labelClass}>Select Company</label>
            <div className="relative">
              <select
                value={formData.selectedCompany}
                onChange={(e) => setFormData({ ...formData, selectedCompany: e.target.value })}
                className={selectClass}
                disabled={!formData.selectedEmployee}
              >
                <option value="">{formData.selectedEmployee ? "— Choose Assigned Company —" : "— Select Employee First —"}</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            {!formData.selectedEmployee && (
              <p className="text-xs text-gray-400 mt-1.5 ml-1">Select an employee first</p>
            )}
          </div>

          {/* Roles, SubRoles, Points */}
          <div>
            <label className={labelClass}>Roles, SubRoles & Points</label>
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
              {roles.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">No roles available</p>
              ) : (
                roles.map((role, roleIdx) => (
                  <div key={role._id} className={`${roleIdx !== roles.length - 1 ? "border-b border-gray-100" : ""}`}>

                    {/* Role Row */}
                    <button
                      type="button"
                      onClick={() => handleRoleToggle(role._id)}
                      className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all duration-150 border-t border-gray-200 ${formData.selectedRoles.includes(String(role._id)) ? "bg-blue-50" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      <span className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-150 ${formData.selectedRoles.includes(String(role._id))
                          ? "border-blue-600 bg-blue-600 shadow-sm"
                          : "border-gray-300 bg-white"
                        }`}>
                        {formData.selectedRoles.includes(String(role._id)) && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-sm sm:text-base tracking-wide uppercase ${formData.selectedRoles.includes(String(role._id)) ? "font-extrabold text-blue-900" : "font-bold text-gray-800"}`}>
                        {role.role}
                      </span>
                      {formData.selectedRoles.includes(String(role._id)) && (
                        <span className="ml-auto text-xs text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-md">Selected</span>
                      )}
                    </button>

                    {/* SubRoles Container */}
                    {Array.isArray(role.subRole) && role.subRole.length > 0 && (
                      <div className="flex flex-col ml-3 sm:ml-6 pl-2 py-1 border-l-2 border-slate-200 my-1">
                        {role.subRole.map((sub) => {
                          const subId = String(sub._id);
                          const subSelected = formData.selectedSubRoles.includes(subId);
                          return (
                            <div key={subId} className="flex flex-col mb-1">
                              {/* SubRole Row */}
                              <button
                                type="button"
                                onClick={() => handleSubRoleToggle(subId)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${subSelected ? "bg-blue-50/50" : "hover:bg-slate-50"}`}
                              >
                                <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${subSelected ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white"}`}>
                                  {subSelected && (
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </span>
                                <span className={`text-sm ${subSelected ? "text-blue-800 font-bold" : "text-slate-600 font-medium"}`}>
                                  {sub.subRoleName}
                                </span>
                              </button>

                              {/* Points Container */}
                              {Array.isArray(sub.points) && sub.points.length > 0 && (
                                <div className="flex flex-col ml-3 sm:ml-5 pl-2 py-1 border-l-2 border-indigo-100 mt-1 mb-2">
                                  {sub.points.map((point, idx) => {
                                    const pointSelected = formData.selectedPoints.includes(String(point));
                                    return (
                                      <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handlePointToggle(point)}
                                        className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-left transition-colors ${pointSelected ? "bg-indigo-50/50" : "hover:bg-slate-50"}`}
                                      >
                                        <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 ${pointSelected ? "border-indigo-500 bg-indigo-500" : "border-gray-300 bg-white"}`}>
                                          {pointSelected && (
                                            <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                          )}
                                        </span>
                                        <span className={`text-xs ${pointSelected ? "text-indigo-800 font-bold" : "text-slate-500 font-medium"}`}>
                                          {point}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>

            {/* Selection Summary */}
            {(formData.selectedRoles.length > 0 || formData.selectedSubRoles.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.selectedRoles.map((r) => (
                  <span key={r} className="text-xs bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-md border border-gray-200">
                    Role ID: {r.slice(-4)}
                  </span>
                ))}
                {formData.selectedSubRoles.length > 0 && (
                  <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-md border border-blue-100">
                    {formData.selectedSubRoles.length} subrole{formData.selectedSubRoles.length !== 1 ? "s" : ""}
                  </span>
                )}
                {formData.selectedPoints.length > 0 && (
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-medium px-2.5 py-1 rounded-md border border-indigo-100">
                    {formData.selectedPoints.length} point{formData.selectedPoints.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={handleAssign}
              disabled={loading}
              className={`w-full py-2.5 rounded-lg text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${loading
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Assign Work Role
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AssignEmployeeRole;
