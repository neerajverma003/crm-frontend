import React, { useEffect, useState } from "react";

function AssignDestination() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [viewMode, setViewMode] = useState("assign"); // 'assign' or 'assigned'
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [modalEmployee, setModalEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employee/allEmployee`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "api_key": localStorage.getItem("api_key") || "test_key",
        },
      });

      const data = await res.json();
      console.log("EMPLOYEES RESPONSE:", data);

      if (Array.isArray(data.employees)) {
        setEmployees(data.employees);
      } else {
        console.error("Employees not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/department/department`);
      const data = await res.json();
      console.log("DEPARTMENTS RESPONSE:", data);

      if (Array.isArray(data.departments)) {
        setDepartments(data.departments);
      } else if (Array.isArray(data)) {
        // fallback if API returns array directly
        setDepartments(data);
      } else {
        console.error("Departments not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch all destinations
  const fetchDestinations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employeedestination`);

      const data = await res.json();
      console.log("DESTINATIONS RESPONSE:", data);

      if (Array.isArray(data.destinations)) {
        setDestinations(
          data.destinations.map((d) => ({
            id: d._id,
            name: d.destination,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDestinations();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (viewMode === "assigned") {
      fetchAssignedEmployees();
    }
  }, [viewMode]);

  // Fetch employees that have assigned destinations (populated)
  const fetchAssignedEmployees = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employee/allEmployee`);
      const data = await res.json();
      const all = Array.isArray(data.employees) ? data.employees : [];

      // Filter those who have destinations (array length > 0)
      const withDest = all.filter((e) => e.destinations && Array.isArray(e.destinations) && e.destinations.length > 0);

      // For each, fetch populated employee (to get destination strings and department)
      const detailed = await Promise.all(
        withDest.map(async (e) => {
          try {
            const r = await fetch(`${import.meta.env.VITE_API_URL}/employee/${e._id}`);
            const jd = await r.json();
            if (jd && jd.employee) return jd.employee;
            return e;
          } catch (err) {
            return e;
          }
        })
      );

      // Final filter: ensure all still have destinations
      const filtered = detailed.filter((e) => e.destinations && Array.isArray(e.destinations) && e.destinations.length > 0);
      setAssignedEmployees(filtered);
    } catch (error) {
      console.error("Error fetching assigned employees:", error);
    }
  };

  // Toggle checkbox
  const toggleDestination = (id) => {
    setSelectedDestinations((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  // Submit assignment
  const handleSubmit = async () => {
    if (!selectedDepartment) {
      alert("Please select a department");
      return;
    }
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }

    if (selectedDestinations.length === 0) {
      alert("Please select at least one destination");
      return;
    }

    try {
      // Call backend assignDestination API
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employeedestination/assign-destination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api_key": localStorage.getItem("api_key") || "test_key",
        },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          destinationIds: selectedDestinations, // sending array of destination IDs
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Destination(s) assigned successfully!");
        setSelectedEmployee("");
        setSelectedDestinations([]);
        setSelectedDepartment("");
      } else {
        alert(result.message || "Assignment failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleView = (emp) => {
    setModalEmployee(emp);
  };

  const handleEdit = (emp) => {
    // Populate assign form with this employee data and switch to assign tab
    const depId = emp.department && (emp.department._id || emp.department);
    const dests = Array.isArray(emp.destinations)
      ? emp.destinations.map((d) => (d && d._id ? d._id : d))
      : [];

    setSelectedDepartment(depId || "");
    setSelectedEmployee(emp._id);
    setSelectedDestinations(dests);
    setViewMode("assign");
  };

  const handleDelete = async (emp) => {
    if (!confirm(`Remove all assigned destinations for ${emp.fullName}?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employeedestination/remove-destinations/${emp._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const jd = await res.json();
      if (res.ok) {
        alert("Assignments removed successfully");
        fetchAssignedEmployees();
      } else {
        alert(jd.message || "Failed to remove assignments");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing assignments");
    }
  };

  console.log(employees);


  return (
    <div className="max-w-7xl mx-auto my-6 sm:my-10 p-4 sm:p-8 bg-white shadow-sm border border-slate-200 rounded-3xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">Assign Destination to Employee</h2>
        
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm w-full lg:w-auto">
          <button
            onClick={() => setViewMode("assign")}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 active:scale-95 ${viewMode === "assign" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20" : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
          >
            Assign Destination
          </button>
          <button
            onClick={() => setViewMode("assigned")}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 active:scale-95 ${viewMode === "assigned" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20" : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
          >
            Assigned Destination
          </button>
        </div>
      </div>

      {viewMode === "assign" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department Dropdown */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Select Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedEmployee("");
                }}
                className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700"
              >
                <option value="">-- Select Department --</option>
                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>
                    {dep.dep || dep.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Dropdown (filtered by department) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Select Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full border-2 border-slate-200 px-4 py-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedDepartment}
              >
                <option value="">-- Select Employee --</option>
                {employees
                  .filter((emp) => {
                    if (!selectedDepartment) return true;
                    // emp.department may be populated object or an id string
                    const empDep = emp.department && (emp.department._id || emp.department);
                    return String(empDep) === String(selectedDepartment);
                  })
                  .map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.fullName || emp.firstName + " " + emp.lastName}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Destination Checkboxes */}
          {selectedEmployee && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Select Destinations</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {destinations.length === 0 ? (
                  <p className="text-slate-500 font-medium col-span-full">No destinations found.</p>
                ) : (
                  destinations.map((d) => (
                    <label key={d.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border-2 ${selectedDestinations.includes(d.id) ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                      <input
                        type="checkbox"
                        checked={selectedDestinations.includes(d.id)}
                        onChange={() => toggleDestination(d.id)}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="font-bold">{d.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 active:scale-95"
            >
              Assign Selected Destinations
            </button>
          </div>
        </div>
      ) : (
        // Assigned Destination view
        <div className="space-y-6">
          {/* Search Box */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 font-medium"
            />
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-xl shadow-sm border border-slate-200">
            <table className="w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Destination</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {assignedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium bg-slate-50/50">
                      No assigned destinations found.
                    </td>
                  </tr>
                ) : (
                  assignedEmployees
                    .filter((emp) => {
                      const nameLower = (emp.fullName || "").toLowerCase();
                      const destLower = (emp.destinations && emp.destinations.length > 0)
                        ? emp.destinations.map((d) => (d && d.destination ? d.destination : d)).join(", ").toLowerCase()
                        : "";
                      const query = searchQuery.toLowerCase();
                      return nameLower.includes(query) || destLower.includes(query);
                    })
                    .map((emp) => (
                    <tr key={emp._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">{emp.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600">{(emp.department && (emp.department.dep || emp.department)) || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {(emp.destinations && emp.destinations.length > 0)
                            ? emp.destinations.map((d, i) => (
                                <span key={i} className="inline-flex px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">{d && d.destination ? d.destination : d}</span>
                              ))
                            : "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleView(emp)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors">View</button>
                          <button onClick={() => handleEdit(emp)} className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold text-xs rounded-lg transition-colors">Edit</button>
                          <button onClick={() => handleDelete(emp)} className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-lg transition-colors">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4">
            {assignedEmployees.length === 0 ? (
              <div className="text-center p-8 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 font-medium">
                No assigned destinations found.
              </div>
            ) : (
              assignedEmployees
                .filter((emp) => {
                  const nameLower = (emp.fullName || "").toLowerCase();
                  const destLower = (emp.destinations && emp.destinations.length > 0)
                    ? emp.destinations.map((d) => (d && d.destination ? d.destination : d)).join(", ").toLowerCase()
                    : "";
                  const query = searchQuery.toLowerCase();
                  return nameLower.includes(query) || destLower.includes(query);
                })
                .map((emp) => (
                <div key={emp._id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-lg">{emp.fullName}</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-0.5">{(emp.department && (emp.department.dep || emp.department)) || "-"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Assigned Destinations</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(emp.destinations && emp.destinations.length > 0)
                        ? emp.destinations.map((d, i) => (
                            <span key={i} className="inline-flex px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">{d && d.destination ? d.destination : d}</span>
                          ))
                        : "-"}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button onClick={() => handleView(emp)} className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors">View</button>
                    <button onClick={() => handleEdit(emp)} className="flex-1 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold text-xs rounded-xl transition-colors">Edit</button>
                    <button onClick={() => handleDelete(emp)} className="flex-1 px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl transition-colors">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal for View */}
          {modalEmployee && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)" }}>
              <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-slate-200 transform transition-all">
                <h2 className="text-2xl font-extrabold mb-6 text-slate-900 tracking-tight">Employee Details</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
                    <p className="text-lg text-slate-800 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl font-bold">{modalEmployee.fullName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Department</label>
                    <p className="text-lg text-slate-800 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl font-bold">{(modalEmployee.department && (modalEmployee.department.dep || modalEmployee.department)) || "-"}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Assigned Destinations</label>
                    <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl max-h-40 overflow-y-auto">
                      {(modalEmployee.destinations && modalEmployee.destinations.length > 0) ? (
                        <div className="flex flex-wrap gap-2">
                          {modalEmployee.destinations.map((d, idx) => (
                            <span key={idx} className="inline-flex px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-sm font-bold border border-blue-200">
                              {d && d.destination ? d.destination : d}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 font-medium text-sm">No destinations assigned</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button 
                    onClick={() => setModalEmployee(null)} 
                    className="w-full px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all duration-300 shadow-md active:scale-95"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AssignDestination;
