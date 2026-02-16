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
      const res = await fetch("http://localhost:4000/employee/allEmployee", {
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
      const res = await fetch("http://localhost:4000/department/department");
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
      const res = await fetch("http://localhost:4000/employeedestination");

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
      const res = await fetch("http://localhost:4000/employee/allEmployee");
      const data = await res.json();
      const all = Array.isArray(data.employees) ? data.employees : [];

      // Filter those who have destinations (array length > 0)
      const withDest = all.filter((e) => e.destinations && Array.isArray(e.destinations) && e.destinations.length > 0);

      // For each, fetch populated employee (to get destination strings and department)
      const detailed = await Promise.all(
        withDest.map(async (e) => {
          try {
            const r = await fetch(`http://localhost:4000/employee/${e._id}`);
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
      const res = await fetch("http://localhost:4000/employeedestination/assign-destination", {
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
      const res = await fetch(`http://localhost:4000/employeedestination/remove-destinations/${emp._id}`, {
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
    <div className="max-w-7xl mx-5 mt-10 p-6 bg-white shadow rounded ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Assign Destination to Employee</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("assign")}
            className={`px-4 py-2 rounded-full ${viewMode === "assign" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "bg-gray-100"}`}
          >
            Assign Destination
          </button>
          <button
            onClick={() => setViewMode("assigned")}
            className={`px-4 py-2 rounded-full ${viewMode === "assigned" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : "bg-gray-100"}`}
          >
            Assigned Destination
          </button>
        </div>
      </div>

      {viewMode === "assign" ? (
        <>
          {/* Department Dropdown */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Select Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setSelectedEmployee("");
              }}
              className="w-full border px-3 py-2 rounded-full"
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
          <div className="mb-4">
            <label className="block font-semibold mb-1">Select Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full border px-3 py-2 rounded-full"
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

          {/* Destination Checkboxes */}
          {selectedEmployee && (
            <div className="mb-4">
              <label className="block font-semibold mb-2">Select Destinations</label>
              <div className="space-y-2 border p-3 rounded bg-gray-50">
                {destinations.length === 0 ? (
                  <p className="text-gray-500">No destinations found.</p>
                ) : (
                  destinations.map((d) => (
                    <label key={d.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedDestinations.includes(d.id)}
                        onChange={() => toggleDestination(d.id)}
                      />
                      {d.name}
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:bg-blue-700 text-white py-2 rounded-full"
          >
            Assign
          </button>
        </>
      ) : (
        // Assigned Destination view
        <div>
          {/* Search Box */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-1/4 border px-4 py-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Department</th>
                  <th className="px-4 py-2 border">Assigned Destination</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
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
                    <tr key={emp._id} className="border-t">
                      <td className="px-4 py-2">{emp.fullName}</td>
                      <td className="px-4 py-2">{(emp.department && (emp.department.dep || emp.department)) || "-"}</td>
                      <td className="px-4 py-2">
                        {(emp.destinations && emp.destinations.length > 0)
                          ? emp.destinations.map((d) => (d && d.destination ? d.destination : d)).join(", ")
                          : "-"}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button onClick={() => handleView(emp)} className="px-2 py-1 bg-gray-200 rounded">View</button>
                          <button onClick={() => handleEdit(emp)} className="px-2 py-1 bg-yellow-200 rounded">Edit</button>
                          <button onClick={() => handleDelete(emp)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal for View */}
          {modalEmployee && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
              <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Employee Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                    <p className="text-lg text-gray-800 bg-gray-50 px-4 py-2 rounded">{modalEmployee.fullName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Department</label>
                    <p className="text-lg text-gray-800 bg-gray-50 px-4 py-2 rounded">{(modalEmployee.department && (modalEmployee.department.dep || modalEmployee.department)) || "-"}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Assigned Destinations</label>
                    <div className="bg-gray-50 px-4 py-2 rounded">
                      {(modalEmployee.destinations && modalEmployee.destinations.length > 0) ? (
                        <ul className="list-disc list-inside space-y-1">
                          {modalEmployee.destinations.map((d, idx) => (
                            <li key={idx} className="text-gray-800">
                              {d && d.destination ? d.destination : d}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No destinations assigned</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    onClick={() => setModalEmployee(null)} 
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
                  >
                    Close
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
