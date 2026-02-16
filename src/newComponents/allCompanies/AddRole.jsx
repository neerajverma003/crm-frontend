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
      const res = await fetch("http://localhost:4000/role/getrole");
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
      const res = await fetch("http://localhost:4000/employeerole/getemployeerole");
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
        ? "http://localhost:4000/role/role"
        : "http://localhost:4000/employeerole/employeerole";
        
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
          ? `http://localhost:4000/role/deleterole/${roleId}`
          : `http://localhost:4000/employeerole/deleteemployeerole/${roleId}`;
          
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
        ? `http://localhost:4000/role/updaterole/${editingId}`
        : `http://localhost:4000/employeerole/updateemployeerole/${editingId}`;
        
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
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Add Role, Subrole & Points
      </h2>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab("admin");
            setEditingId(null);
            setRole("");
            setSubroles([{ name: "", points: [""] }]);
          }}
          className={`px-6 py-2 font-semibold transition-colors ${
            activeTab === "admin"
              ? "border-b-2 border-black text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Admin Roles
        </button>
        <button
          onClick={() => {
            setActiveTab("employee");
            setEditingId(null);
            setRole("");
            setSubroles([{ name: "", points: [""] }]);
          }}
          className={`px-6 py-2 font-semibold transition-colors ${
            activeTab === "employee"
              ? "border-b-2 border-black text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Employee Roles
        </button>
      </div>

      {/* Role Input Form */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Role Name *</label>
          <input
            type="text"
            placeholder="Enter role name (e.g., HR, Manager)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Subroles Section */}
        <div className="flex flex-col gap-3">
          <label className="font-medium text-gray-700">Subroles</label>

          {subroles.map((sub, subIndex) => (
            <div
              key={subIndex}
              className="border border-gray-200 p-4 rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  placeholder={`Subrole ${subIndex + 1}`}
                  value={sub.name}
                  onChange={(e) => handleSubroleChange(subIndex, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                {subroles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubroleField(subIndex)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Points */}
              <div className="ml-3">
                <label className="text-sm text-gray-600">Points</label>
                {sub.points.map((point, pointIndex) => (
                  <div key={pointIndex} className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      placeholder={`Point ${pointIndex + 1}`}
                      value={point}
                      onChange={(e) =>
                        handlePointChange(subIndex, pointIndex, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    {sub.points.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removePointField(subIndex, pointIndex)
                        }
                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addPointField(subIndex)}
                  className="mt-2 text-sm text-blue-600 font-medium hover:underline"
                >
                  + Add another point
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSubroleField}
            className="text-sm text-blue-600 font-medium hover:underline self-start"
          >
            + Add another subrole
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleAddRole}
          disabled={loading}
          className={`px-6 py-2 rounded-md text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
          } transition-colors`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Roles Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-left">#</th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Role
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Subroles
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Points
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === "admin" ? roles : employeeRoles).length > 0 ? (
              (activeTab === "admin" ? roles : employeeRoles).map((r, index) => (
                <React.Fragment key={r._id}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(index)}
                  >
                    <td className="border border-gray-200 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {editingId === r._id ? (
                        <input
                          type="text"
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      ) : (
                        r.role
                      )}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {r.subRole?.length || 0} subroles
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {r.subRole?.reduce(
                        (acc, s) => acc + (s.points?.length || 0),
                        0
                      )}{" "}
                      points
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <div className="flex gap-2">
                        {editingId === r._id ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateRole();
                              }}
                              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCancel();
                              }}
                              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-xs font-medium"
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
                              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-medium"
                              title="View Details"
                            >
                              View
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditStart(r);
                              }}
                              className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-xs font-medium"
                              title="Edit Role"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRole(r._id);
                              }}
                              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs font-medium"
                              title="Delete Role"
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
                      <td></td>
                      <td
                        colSpan="4"
                        className="border border-gray-200 px-4 py-3 bg-gray-50"
                      >
                        {Array.isArray(r.subRole) && r.subRole.length > 0 ? (
                          <ul className="list-disc pl-5 text-gray-700 space-y-1">
                            {r.subRole.map((sub, i) => (
                              <li key={i}>
                                <span className="font-semibold">
                                  {sub.subRoleName}
                                </span>
                                {sub.points?.length > 0 && (
                                  <ul className="list-circle pl-5 text-gray-600">
                                    {sub.points.map((p, pi) => (
                                      <li key={pi}>{p}</li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">No subroles available</p>
                        )}
                      </td>
                    </tr>
                  )}

                  {/* Edit Mode - Editable Subroles and Points */}
                  {editingId === r._id && (
                    <tr>
                      <td></td>
                      <td
                        colSpan="4"
                        className="border border-gray-200 px-4 py-3 bg-blue-50"
                      >
                        <div className="flex flex-col gap-3">
                          <label className="font-medium text-gray-700">Edit Subroles</label>

                          {editSubroles.map((sub, subIndex) => (
                            <div
                              key={subIndex}
                              className="border border-gray-200 p-3 rounded-lg bg-white"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <input
                                  type="text"
                                  placeholder={`Subrole ${subIndex + 1}`}
                                  value={sub.subRoleName || ""}
                                  onChange={(e) =>
                                    handleEditSubroleChange(subIndex, e.target.value)
                                  }
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {editSubroles.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeEditSubroleField(subIndex)
                                    }
                                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>

                              {/* Edit Points */}
                              <div className="ml-3">
                                <label className="text-sm text-gray-600">Points</label>
                                {sub.points?.map((point, pointIndex) => (
                                  <div
                                    key={pointIndex}
                                    className="flex items-center gap-2 mt-2"
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
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {sub.points.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeEditPointField(subIndex, pointIndex)
                                        }
                                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addEditPointField(subIndex)}
                                  className="mt-2 text-sm text-blue-600 font-medium hover:underline"
                                >
                                  + Add Point
                                </button>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={addEditSubroleField}
                            className="text-sm text-blue-600 font-medium hover:underline self-start"
                          >
                            + Add Subrole
                          </button>
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
                  className="text-center text-gray-500 py-4 border border-gray-200"
                >
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddRole;
