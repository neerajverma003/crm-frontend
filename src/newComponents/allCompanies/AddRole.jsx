import React, { useEffect, useState } from "react";

const AddRole = () => {
  const [activeTab, setActiveTab] = useState("admin"); // "admin" or "employee"
  const [role, setRole] = useState("");
  const [subroles, setSubroles] = useState([{ name: "", points: [""] }]);
  const [roles, setRoles] = useState([]);
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editSubroles, setEditSubroles] = useState([]);

  // ✅ Fetch all roles
  const fetchRoles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/role/getrole`);
      const data = await res.json();
      console.log(data)
      const fetchedRoles = Array.isArray(data.data) ? data.data : [];
      setRoles(fetchedRoles);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  // ✅ Fetch all employee roles
  const fetchEmployeeRoles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employeerole/getemployeerole`);
      const data = await res.json();
      const fetchedRoles = Array.isArray(data.data) ? data.data : [];
      setEmployeeRoles(fetchedRoles);
    } catch (error) {
      console.error("Failed to fetch employee roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchEmployeeRoles();
  }, []);

  // ✅ Subrole handlers
  const handleSubroleChange = (index, value) => {
    const updated = [...subroles];
    updated[index].name = value;
    setSubroles(updated);
  };

  const handlePointChange = (subIndex, pointIndex, value) => {
    const updated = [...subroles];
    updated[subIndex].points[pointIndex] = value;
    setSubroles(updated);
  };

  const addSubroleField = () =>
    setSubroles([...subroles, { name: "", points: [""] }]);

  const removeSubroleField = (index) =>
    setSubroles(subroles.filter((_, i) => i !== index));

  const addPointField = (subIndex) => {
    const updated = [...subroles];
    updated[subIndex].points.push("");
    setSubroles(updated);
  };

  const removePointField = (subIndex, pointIndex) => {
    const updated = [...subroles];
    updated[subIndex].points = updated[subIndex].points.filter(
      (_, i) => i !== pointIndex
    );
    setSubroles(updated);
  };

  // ✅ Submit role
  const handleAddRole = async () => {
    if (!role.trim()) return alert("Please enter a role name.");
        console.log(subroles[0]);

    setLoading(true);
    try {
      const formattedSubRoles = subroles
        .filter((s) => s.name.trim() !== "")
        .map((s) => ({
          subRoleName: s.name.trim(),
          points: s.points.filter((p) => p.trim() !== ""),
        }));
        console.log(formattedSubRoles);
      
      // Determine endpoint based on active tab
      const endpoint = activeTab === "admin" 
        ? `${import.meta.env.VITE_API_URL}/role/role`
        : `${import.meta.env.VITE_API_URL}/employeerole/employeerole`;
        
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, subRole: formattedSubRoles }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`${activeTab === "admin" ? "Admin" : "Employee"} role added successfully ✅`);
        setRole("");
        setSubroles([{ name: "", points: [""] }]);
        activeTab === "admin" ? fetchRoles() : fetchEmployeeRoles();
        
        // 🔹 Dispatch event to refresh sidebars with new role data
        window.dispatchEvent(new Event("refreshAdminRoles"));
        window.dispatchEvent(new Event("refreshEmployeeRoles"));
      } else {
        alert(data.message || "Failed to add role ❌");
      }
    } catch (error) {
      console.error("Add Role Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) =>
    setExpandedRow(expandedRow === index ? null : index);

  // ✅ Delete Role
  const handleDeleteRole = async (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        const endpoint = activeTab === "admin"
          ? `${import.meta.env.VITE_API_URL}/role/deleterole/${roleId}`
          : `${import.meta.env.VITE_API_URL}/employeerole/deleteemployeerole/${roleId}`;
          
        const res = await fetch(endpoint, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("Role deleted successfully ✅");
          activeTab === "admin" ? fetchRoles() : fetchEmployeeRoles();
          
          // 🔹 Dispatch event to refresh sidebars
          window.dispatchEvent(new Event("refreshAdminRoles"));
          window.dispatchEvent(new Event("refreshEmployeeRoles"));
        } else {
          alert("Failed to delete role ❌");
        }
      } catch (error) {
        console.error("Delete Role Error:", error);
        alert("Something went wrong!");
      }
    }
  };

  // ✅ Start Edit
  const handleEditStart = (r) => {
    setEditingId(r._id);
    setEditRole(r.role);
    setEditSubroles(r.subRole || []);
  };

  // ✅ Update Role
  const handleUpdateRole = async () => {
    if (!editRole.trim()) return alert("Please enter a role name.");

    try {
      // Clean and format subroles similar to add flow
      console.log(editSubroles[0]);
      
      const formattedSubRoles = (editSubroles || [])
        .filter((s) => (s.subRoleName || "").trim() !== "")
        .map((s) => ({
          subRoleName: (s.subRoleName || "").trim(),
          points: (s.points || []).filter((p) => (p || "").trim() !== ""),
        }));

      const endpoint = activeTab === "admin"
        ? `${import.meta.env.VITE_API_URL}/role/updaterole/${editingId}`
        : `${import.meta.env.VITE_API_URL}/employeerole/updateemployeerole/${editingId}`;
        
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editRole.trim(), subRole: formattedSubRoles }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("Role updated successfully ✅");
        setEditingId(null);
        setEditRole("");
        setEditSubroles([]);
        activeTab === "admin" ? fetchRoles() : fetchEmployeeRoles();
        
        // 🔹 Dispatch event to refresh sidebars with updated role data
        window.dispatchEvent(new Event("refreshAdminRoles"));
        window.dispatchEvent(new Event("refreshEmployeeRoles"));
      } else {
        console.error("Update Role failed:", data);
        alert(data.message || "Failed to update role ❌");
      }
    } catch (error) {
      console.error("Update Role Error:", error);
      alert("Something went wrong!");
    }
  };

  // ✅ Edit Mode - Subrole handlers
  const handleEditSubroleChange = (index, value) => {
    const updated = [...editSubroles];
    updated[index].subRoleName = value;
    setEditSubroles(updated);
  };

  const handleEditPointChange = (subIndex, pointIndex, value) => {
    const updated = [...editSubroles];
    updated[subIndex].points[pointIndex] = value;
    setEditSubroles(updated);
  };

  const addEditSubroleField = () =>
    setEditSubroles([...editSubroles, { subRoleName: "", points: [""] }]);

  const removeEditSubroleField = (index) =>
    setEditSubroles(editSubroles.filter((_, i) => i !== index));

  const addEditPointField = (subIndex) => {
    const updated = [...editSubroles];
    updated[subIndex].points.push("");
    setEditSubroles(updated);
  };

  const removeEditPointField = (subIndex, pointIndex) => {
    const updated = [...editSubroles];
    updated[subIndex].points = updated[subIndex].points.filter(
      (_, i) => i !== pointIndex
    );
    setEditSubroles(updated);
  };

  // ✅ Cancel Edit
  const handleEditCancel = () => {
    setEditingId(null);
    setEditRole("");
    setEditSubroles([]);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-slate-200/60 pb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Role Management
          </h1>
          <p className="text-slate-500 mt-2">Create and manage roles, subroles, and their associated points.</p>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-8">
          
          {/* Tab Navigation */}
          <div className="flex gap-6 border-b border-slate-200/60 px-4 sm:px-6 pt-4 bg-slate-50/50 overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab("admin");
                setEditingId(null);
                setRole("");
                setSubroles([{ name: "", points: [""] }]);
              }}
              className={`pb-4 font-semibold transition-colors relative ${
                activeTab === "admin"
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Admin Roles
              {activeTab === "admin" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-md" />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("employee");
                setEditingId(null);
                setRole("");
                setSubroles([{ name: "", points: [""] }]);
              }}
              className={`pb-4 font-semibold transition-colors relative ${
                activeTab === "employee"
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Employee Roles
              {activeTab === "employee" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-md" />
              )}
            </button>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            {/* Role Input Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 border-b border-slate-100 pb-10">
              <div className="lg:col-span-1">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Create New Role</h3>
                <p className="text-sm text-slate-500 mb-6">Define a new role and its associated subroles and points structure.</p>
                
                <div className="flex flex-col mb-6">
                  <label className="mb-2 text-sm font-semibold text-slate-700">Role Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g., HR, Manager"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
                
                <button
                  onClick={handleAddRole}
                  disabled={loading}
                  className={`w-full px-6 py-3 rounded-xl text-white font-semibold transition-all ${
                    loading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow shadow-indigo-200"
                  }`}
                >
                  {loading ? "Saving..." : "Save Role"}
                </button>
              </div>

              {/* Subroles Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-slate-700">Subroles & Points</label>
                  <button
                    type="button"
                    onClick={addSubroleField}
                    className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Add Subrole
                  </button>
                </div>

                <div className="space-y-4">
                  {subroles.map((sub, subIndex) => (
                    <div
                      key={subIndex}
                      className="border border-slate-200/60 p-4 sm:p-5 rounded-xl bg-slate-50/30 relative group"
                    >
                      {subroles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubroleField(subIndex)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100"
                          title="Remove Subrole"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                      
                      <div className="flex items-center gap-2 sm:gap-3 mb-4 pr-8 sm:pr-10">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {subIndex + 1}
                        </div>
                        <input
                          type="text"
                          placeholder="Subrole Name (e.g. Recruitment)"
                          value={sub.name}
                          onChange={(e) => handleSubroleChange(subIndex, e.target.value)}
                          className="flex-1 min-w-0 px-3 sm:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-sm sm:text-base"
                        />
                      </div>

                      {/* Points */}
                      <div className="ml-8 sm:ml-11 pl-3 sm:pl-4 border-l-2 border-slate-200 space-y-3">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Points</label>
                        </div>
                        
                        {sub.points.map((point, pointIndex) => (
                          <div key={pointIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder={`Point ${pointIndex + 1}`}
                              value={point}
                              onChange={(e) =>
                                handlePointChange(subIndex, pointIndex, e.target.value)
                              }
                              className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                            />
                            {sub.points.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removePointField(subIndex, pointIndex)
                                }
                                className="text-slate-400 hover:text-red-500 p-1 bg-white rounded shadow-sm border border-slate-100"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            )}
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => addPointField(subIndex)}
                          className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 mt-3 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                          Add Point
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Roles Table */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Existing Roles</h3>
              <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Subroles</th>
                      <th className="px-6 py-4">Points</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(activeTab === "admin" ? roles : employeeRoles).length > 0 ? (
                      (activeTab === "admin" ? roles : employeeRoles).map((r, index) => (
                        <React.Fragment key={r._id}>
                          <tr
                            className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                            onClick={() => toggleExpand(index)}
                          >
                            <td className="px-6 py-4 text-slate-500 font-medium">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-800">
                              {editingId === r._id ? (
                                <input
                                  type="text"
                                  value={editRole}
                                  onChange={(e) => setEditRole(e.target.value)}
                                  className="px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full min-w-0 max-w-[200px]"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                r.role
                              )}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                                {r.subRole?.length || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                                {r.subRole?.reduce(
                                  (acc, s) => acc + (s.points?.length || 0),
                                  0
                                ) || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                {editingId === r._id ? (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateRole();
                                      }}
                                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-semibold shadow-sm transition-colors"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditCancel();
                                      }}
                                      className="px-3 py-1.5 bg-slate-500 text-white rounded-lg hover:bg-slate-600 text-xs font-semibold shadow-sm transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand(index);
                                      }}
                                      className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-xs font-semibold transition-colors"
                                    >
                                      {expandedRow === index ? "Hide" : "View"}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditStart(r);
                                        // expand so they can see subroles while editing
                                        if (expandedRow !== index) toggleExpand(index);
                                      }}
                                      className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 text-xs font-semibold transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteRole(r._id);
                                      }}
                                      className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-semibold transition-colors"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Details or Edit Mode */}
                          {expandedRow === index && editingId !== r._id && (
                            <tr>
                              <td colSpan="5" className="bg-slate-50/50 px-6 py-6 border-b border-slate-100">
                                {Array.isArray(r.subRole) && r.subRole.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {r.subRole.map((sub, i) => (
                                      <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <h4 className="font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">
                                          {sub.subRoleName}
                                        </h4>
                                        {sub.points?.length > 0 ? (
                                          <ul className="space-y-2">
                                            {sub.points.map((p, pi) => (
                                              <li key={pi} className="text-sm text-slate-600 flex items-start gap-2">
                                                <span className="text-indigo-400 mt-0.5">•</span>
                                                <span className="flex-1">{p}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <p className="text-xs text-slate-400 italic">No points assigned</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-6">
                                    <p className="text-slate-500">No subroles available for this role.</p>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}

                          {/* Edit Mode - Editable Subroles and Points */}
                          {editingId === r._id && (
                            <tr>
                              <td colSpan="5" className="bg-indigo-50/30 px-6 py-6 border-b border-indigo-100">
                                <div className="max-w-4xl mx-auto">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-slate-800">Edit Subroles</h4>
                                    <button
                                      type="button"
                                      onClick={addEditSubroleField}
                                      className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 bg-white border border-indigo-100 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                    >
                                      + Add Subrole
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {editSubroles.map((sub, subIndex) => (
                                      <div
                                        key={subIndex}
                                        className="border border-slate-200 p-4 rounded-xl bg-white shadow-sm relative group"
                                      >
                                        <div className="flex items-center gap-2 mb-4">
                                          <input
                                            type="text"
                                            placeholder={`Subrole ${subIndex + 1}`}
                                            value={sub.subRoleName || ""}
                                            onChange={(e) =>
                                              handleEditSubroleChange(subIndex, e.target.value)
                                            }
                                            className="flex-1 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-800"
                                          />
                                          {editSubroles.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                removeEditSubroleField(subIndex)
                                              }
                                              className="text-slate-400 hover:text-red-500 bg-slate-50 rounded p-1.5"
                                            >
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                          )}
                                        </div>

                                        {/* Edit Points */}
                                        <div className="pl-2 border-l-2 border-indigo-100 space-y-2">
                                          <label className="text-xs font-semibold text-slate-500 uppercase">Points</label>
                                          {sub.points?.map((point, pointIndex) => (
                                            <div
                                              key={pointIndex}
                                              className="flex items-center gap-2"
                                            >
                                              <input
                                                type="text"
                                                placeholder={`Point ${pointIndex + 1}`}
                                                value={point || ""}
                                                onChange={(e) =>
                                                  handleEditPointChange(
                                                    subIndex,
                                                    pointIndex,
                                                    e.target.value
                                                  )
                                                }
                                                className="flex-1 min-w-0 px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                              />
                                              {sub.points.length > 1 && (
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    removeEditPointField(subIndex, pointIndex)
                                                  }
                                                  className="text-slate-400 hover:text-red-500"
                                                >
                                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                              )}
                                            </div>
                                          ))}
                                          <button
                                            type="button"
                                            onClick={() => addEditPointField(subIndex)}
                                            className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 mt-2 block"
                                          >
                                            + Add Point
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center text-slate-500 py-12"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            <p>No roles found.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-4">
                {(activeTab === "admin" ? roles : employeeRoles).length > 0 ? (
                  (activeTab === "admin" ? roles : employeeRoles).map((r, index) => (
                    <div key={r._id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <p className="text-xs text-slate-500 font-medium mb-1">Role Name</p>
                          {editingId === r._id ? (
                            <input
                              type="text"
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value)}
                              className="px-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <p className="text-sm font-bold text-slate-800">{r.role}</p>
                          )}
                        </div>
                        <div className="bg-slate-100 text-slate-600 font-bold text-xs px-2 py-1 rounded shrink-0">
                          # {index + 1}
                        </div>
                      </div>

                      <div className="flex gap-4 pt-2 border-t border-slate-50">
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Subroles</p>
                          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                            {r.subRole?.length || 0}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Points</p>
                          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                            {r.subRole?.reduce((acc, s) => acc + (s.points?.length || 0), 0) || 0}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50 mt-1">
                        {editingId === r._id ? (
                          <>
                            <button onClick={() => handleUpdateRole()} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-semibold">Save</button>
                            <button onClick={() => handleEditCancel()} className="flex-1 bg-slate-500 text-white py-2 rounded-lg text-xs font-semibold">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => toggleExpand(index)} className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg text-xs font-semibold">{expandedRow === index ? "Hide" : "View"}</button>
                            <button onClick={() => { handleEditStart(r); if (expandedRow !== index) toggleExpand(index); }} className="flex-1 bg-amber-50 text-amber-600 py-2 rounded-lg text-xs font-semibold">Edit</button>
                            <button onClick={() => handleDeleteRole(r._id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-semibold">Delete</button>
                          </>
                        )}
                      </div>

                      {/* Mobile Expanded Details */}
                      {expandedRow === index && editingId !== r._id && (
                        <div className="pt-4 mt-2 border-t border-slate-100">
                          {Array.isArray(r.subRole) && r.subRole.length > 0 ? (
                            <div className="flex flex-col gap-4">
                              {r.subRole.map((sub, i) => (
                                <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                  <h4 className="font-bold text-slate-800 text-sm mb-2">{sub.subRoleName}</h4>
                                  {sub.points?.length > 0 ? (
                                    <ul className="space-y-1.5">
                                      {sub.points.map((p, pi) => (
                                        <li key={pi} className="text-xs text-slate-600 flex items-start gap-1.5">
                                          <span className="text-indigo-400 mt-0.5">•</span>
                                          <span className="flex-1">{p}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-xs text-slate-400 italic">No points</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-slate-500 text-sm">No subroles.</p>
                          )}
                        </div>
                      )}

                      {/* Mobile Edit Mode Details */}
                      {editingId === r._id && (
                        <div className="pt-4 mt-2 border-t border-indigo-100 bg-indigo-50/20 -mx-4 -mb-4 px-4 pb-4 rounded-b-xl">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-slate-800 text-sm">Edit Subroles</h4>
                            <button onClick={addEditSubroleField} className="text-xs text-indigo-600 font-semibold bg-white border border-indigo-100 px-2 py-1 rounded shadow-sm">
                              + Add Subrole
                            </button>
                          </div>
                          
                          <div className="flex flex-col gap-3">
                            {editSubroles.map((sub, subIndex) => (
                              <div key={subIndex} className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                                <div className="flex gap-2 mb-3">
                                  <input
                                    type="text"
                                    placeholder="Subrole Name"
                                    value={sub.subRoleName || ""}
                                    onChange={(e) => handleEditSubroleChange(subIndex, e.target.value)}
                                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold"
                                  />
                                  {editSubroles.length > 1 && (
                                    <button onClick={() => removeEditSubroleField(subIndex)} className="text-slate-400 hover:text-red-500 px-2">
                                      ✕
                                    </button>
                                  )}
                                </div>
                                <div className="pl-2 border-l-2 border-indigo-100 space-y-2">
                                  {sub.points?.map((point, pointIndex) => (
                                    <div key={pointIndex} className="flex gap-2">
                                      <input
                                        type="text"
                                        placeholder={`Point ${pointIndex + 1}`}
                                        value={point || ""}
                                        onChange={(e) => handleEditPointChange(subIndex, pointIndex, e.target.value)}
                                        className="flex-1 px-2.5 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                      />
                                      {sub.points.length > 1 && (
                                        <button onClick={() => removeEditPointField(subIndex, pointIndex)} className="text-slate-400 hover:text-red-500 px-1 text-xs">✕</button>
                                      )}
                                    </div>
                                  ))}
                                  <button onClick={() => addEditPointField(subIndex)} className="text-xs text-indigo-600 font-semibold mt-1">
                                    + Add Point
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
                    <p>No roles found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRole;
