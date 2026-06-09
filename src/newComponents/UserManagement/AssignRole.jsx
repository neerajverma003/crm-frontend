import React, { useEffect, useState } from "react";

const AssignRoleToAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    selectedAdmin: "",
    selectedCompany: "",
    selectedRoles: [],
    selectedSubRoles: [],
    selectedPoints: [],
  });

  const getAllAdmins = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getAdmins`);
      const data = await res.json();
      setAdmins(data || []);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    }
  };

  const getAssignedRolesByAdminAndCompany = async (adminId, companyId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getAssignedRoles/${adminId}/${companyId}`);
      const data = await res.json();
      if (res.ok && data.assignedRoles && Array.isArray(data.assignedRoles)) {
        const roles = [], subRoles = [], points = [];
        data.assignedRoles.forEach((assignment) => {
          if (assignment.roleName) roles.push(assignment.roleName);
          if (Array.isArray(assignment.subRoles))
            assignment.subRoles.forEach((sub) => { if (sub._id) subRoles.push(String(sub._id)); });
          if (Array.isArray(assignment.points)) points.push(...assignment.points);
        });
        setFormData((prev) => ({ ...prev, selectedRoles: roles, selectedSubRoles: subRoles, selectedPoints: points }));
      } else {
        setFormData((prev) => ({ ...prev, selectedRoles: [], selectedSubRoles: [], selectedPoints: [] }));
      }
    } catch (err) {
      console.error("Failed to fetch assigned roles:", err);
      setFormData((prev) => ({ ...prev, selectedRoles: [], selectedSubRoles: [], selectedPoints: [] }));
    }
  };

  const getAllRoles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/role/getrole`);
      const data = await res.json();
      setRoles(data.data || []);
    } catch (err) { console.error("Failed to fetch roles:", err); }
  };

  const getAllCompanies = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/company/all`);
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (err) { console.error("Failed to fetch companies:", err); }
  };

  const getCompaniesByAdmin = async (adminId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getCompanyByAdminId/${adminId}`);
      const data = await res.json();
      if (res.ok && data.success) setCompanies(data.assignedCompanies || []);
      else getAllCompanies();
    } catch (err) { getAllCompanies(); }
  };

  useEffect(() => { getAllAdmins(); getAllRoles(); getAllCompanies(); }, []);

  useEffect(() => {
    if (formData.selectedAdmin) {
      getCompaniesByAdmin(formData.selectedAdmin);
      setFormData((prev) => ({ ...prev, selectedRoles: [], selectedSubRoles: [], selectedPoints: [] }));
    } else {
      setCompanies([]);
    }
  }, [formData.selectedAdmin]);

  useEffect(() => {
    if (formData.selectedAdmin && formData.selectedCompany)
      getAssignedRolesByAdminAndCompany(formData.selectedAdmin, formData.selectedCompany);
  }, [formData.selectedAdmin, formData.selectedCompany]);

  const toggleSelection = (array, item) =>
    array.includes(item) ? array.filter((i) => i !== item) : [...array, item];

  const handleRoleToggle = (role) =>
    setFormData((prev) => ({ ...prev, selectedRoles: toggleSelection(prev.selectedRoles, role) }));

  const handleSubRoleToggle = (subRoleId) => {
    const id = String(subRoleId);
    setFormData((prev) => ({ ...prev, selectedSubRoles: toggleSelection(prev.selectedSubRoles, id) }));
  };

  const handlePointToggle = (point) =>
    setFormData((prev) => ({ ...prev, selectedPoints: toggleSelection(prev.selectedPoints, point) }));

  const handleAssign = async () => {
    const { selectedAdmin, selectedCompany, selectedRoles, selectedSubRoles, selectedPoints } = formData;
    if (!selectedAdmin) return alert("Please select an admin.");
    if (!selectedCompany) return alert("Please select a company.");
    if (!selectedRoles.length) return alert("Please select at least one role.");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/assignrole`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: selectedAdmin, companyIds: [selectedCompany], workRoles: selectedRoles, subRoles: selectedSubRoles, points: selectedPoints }),
      });
      const result = await res.json();
      if (res.ok) {
        alert("Work role assigned successfully!");
        setFormData({ selectedAdmin: "", selectedCompany: "", selectedRoles: [], selectedSubRoles: [], selectedPoints: [] });
        setCompanies([]);
      } else {
        alert(result.message || "Failed to assign work role.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedAdminObj = admins.find((admin) => admin._id === formData.selectedAdmin);
  const filteredCompanies = selectedAdminObj
    ? companies.filter((comp) => selectedAdminObj.company.includes(comp._id))
    : companies;

  const selectClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer";
  const labelClass = "block mb-1.5 text-sm font-medium text-gray-700";

  return (
    <div className="w-full px-4 py-6 md:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Assign Work Role</h1>
        <p className="text-gray-500 text-sm mt-1">Assign roles & permissions to admins.</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 md:p-6 flex flex-col gap-6">

          {/* Admin Select */}
          <div>
            <label className={labelClass}>Select Admin</label>
            <div className="relative">
              <select
                value={formData.selectedAdmin}
                onChange={(e) => setFormData((prev) => ({ ...prev, selectedAdmin: e.target.value }))}
                className={selectClass}
              >
                <option value="">— Choose Admin —</option>
                {admins.filter((a) => a.accountActive).map((admin) => (
                  <option key={admin._id} value={admin._id}>{admin.fullName}</option>
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
                onChange={(e) => setFormData((prev) => ({ ...prev, selectedCompany: e.target.value }))}
                className={selectClass}
                disabled={!formData.selectedAdmin}
              >
                <option value="">— Choose Company —</option>
                {filteredCompanies.map((company) => (
                  <option key={company._id} value={company._id}>{company.companyName}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            {!formData.selectedAdmin && (
              <p className="text-xs text-gray-400 mt-1.5 ml-1">Select an admin first</p>
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
                      onClick={() => handleRoleToggle(role.role)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-150 ${formData.selectedRoles.includes(role.role) ? "bg-blue-50/50" : "bg-slate-50 hover:bg-slate-100"}`}
                    >
                      <span className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-150 ${formData.selectedRoles.includes(role.role)
                          ? "border-blue-600 bg-blue-600 shadow-sm"
                          : "border-gray-300 bg-white"
                        }`}>
                        {formData.selectedRoles.includes(role.role) && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-sm ${formData.selectedRoles.includes(role.role) ? "font-bold text-blue-900" : "font-semibold text-slate-700"}`}>
                        {role.role}
                      </span>
                      {formData.selectedRoles.includes(role.role) && (
                        <span className="ml-auto text-xs text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-md">Selected</span>
                      )}
                    </button>

                    {/* SubRoles Container */}
                    {Array.isArray(role.subRole) && role.subRole.length > 0 && (
                      <div className="flex flex-col ml-6 pl-2 py-1 border-l-2 border-slate-200 my-1">
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
                                <div className="flex flex-col ml-5 pl-2 py-1 border-l-2 border-indigo-100 mt-1 mb-2">
                                  {sub.points.map((point, idx) => {
                                    const pointSelected = formData.selectedPoints.includes(point);
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
                  <span key={r} className="text-xs bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-md border border-gray-200">{r}</span>
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

export default AssignRoleToAdmin;