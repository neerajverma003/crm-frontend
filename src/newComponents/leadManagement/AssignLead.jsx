import { useState, useEffect, useRef } from "react";

export default function AssignLeads() {
  const [employees, setEmployees] = useState([]);
  const [leads, setLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100; // number of leads per page
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedTargetEmployee, setSelectedTargetEmployee] = useState(""); // for reassigning
  const [selectedAssignedLeads, setSelectedAssignedLeads] = useState([]); // ids selected in Assigned tab
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [activeTab, setActiveTab] = useState("assign"); // 'assign' or 'assigned'
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [assignedIds, setAssignedIds] = useState([]); // ids already assigned to selected employee
  const [assignedCurrentPage, setAssignedCurrentPage] = useState(1);
  const selectAllRef = useRef(null);
  const selectAllAssignedRef = useRef(null);

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:4000/employee/allEmployee");
        const data = await res.json();
        if (data.employees) {
          setEmployees(data.employees);
        } else {
          setEmployees([]);
          console.error("Failed to fetch employees:", data.message);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch all leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch("http://localhost:4000/leads/");
        const data = await res.json();
        if (data.data) {
          setLeads(data.data);
          // reset to first page when leads change
          setCurrentPage(1);
        } else {
          setLeads([]);
          console.error("Failed to fetch leads:", data.message);
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
        setLeads([]);
      } finally {
        setLoadingLeads(false);
      }
    };
    fetchLeads();
  }, []);

  // adjust current page if leads length changes and current page becomes out of range
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((leads && leads.length) / pageSize));
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [leads, currentPage]);

  // Handle lead checkbox toggle
  const handleLeadCheck = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  // Assign leads to employee
  const assignLeads = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee.");
      return;
    }
    if (selectedLeads.length === 0) {
      alert("Please select at least one lead.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/assignlead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          leadIds: selectedLeads,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Assigned ${selectedLeads.length} lead(s) successfully!`);
        setSelectedLeads([]);
        // switch to Assigned tab and refresh assigned leads for the selected employee
        setActiveTab("assigned");
        fetchAssignedLeads(selectedEmployee);
        // remove assigned leads from the local leads list to show only unassigned data
        setLeads((prev) => prev.filter((l) => !selectedLeads.includes(String(l._id))));
        // update assignedIds cache so UI reflects assignment immediately (normalize to strings)
        setAssignedIds((prev) => Array.from(new Set([...(prev || []).map(String), ...selectedLeads.map(String)])));
      } else {
        alert("Failed to assign leads: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error assigning leads:", err);
      alert("Error assigning leads. Check console for details.");
    }
  };

  // Fetch assigned leads for an employee
  const fetchAssignedLeads = async (employeeId) => {
    if (!employeeId) {
      setAssignedLeads([]);
      return;
    }
    setLoadingAssigned(true);
    try {
      const res = await fetch(`http://localhost:4000/assignlead/${employeeId}`);
      const data = await res.json();
      if (res.ok) {
        const arr = data.data || [];
        setAssignedLeads(arr);
        // reset assigned leads pagination to first page
        setAssignedCurrentPage(1);
        // normalize ids to strings for consistent comparisons
        setAssignedIds(arr.map((x) => String(x._id)));
      } else {
        console.error('Failed to fetch assigned leads:', data.message);
        setAssignedLeads([]);
      }
    } catch (err) {
      console.error('Error fetching assigned leads:', err);
      setAssignedLeads([]);
    } finally {
      setLoadingAssigned(false);
    }
  };

  // adjust assigned leads page if length changes and current page becomes out of range
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((assignedLeads && assignedLeads.length) / pageSize));
    if (assignedCurrentPage > totalPages) setAssignedCurrentPage(totalPages);
  }, [assignedLeads, assignedCurrentPage]);

  // compute visible items for current pages
  const visibleLeads = (leads || [])
    .filter((l) => !assignedIds.includes(String(l._id)))
    .slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const visibleAssignedLeads = (assignedLeads || []).slice((assignedCurrentPage - 1) * pageSize, assignedCurrentPage * pageSize);

  // Select-all handlers for visible page items
  const handleSelectAllVisible = () => {
    const ids = visibleLeads.map((l) => String(l._id));
    if (ids.length === 0) return;
    const allSelected = ids.every((id) => selectedLeads.map(String).includes(id));
    if (allSelected) {
      // deselect visible
      setSelectedLeads((prev) => prev.filter((id) => !ids.includes(String(id))));
    } else {
      // select visible (keep existing selections)
      setSelectedLeads((prev) => Array.from(new Set([...(prev || []).map(String), ...ids])));
    }
  };

  const handleSelectAllAssignedVisible = () => {
    const ids = visibleAssignedLeads.map((l) => String(l.assignmentId));
    if (ids.length === 0) return;
    const allSelected = ids.every((id) => selectedAssignedLeads.map(String).includes(id));
    if (allSelected) {
      setSelectedAssignedLeads((prev) => prev.filter((id) => !ids.includes(String(id))));
    } else {
      setSelectedAssignedLeads((prev) => Array.from(new Set([...(prev || []).map(String), ...ids])));
    }
  };

  // maintain indeterminate state for header checkboxes
  const allVisibleSelected = visibleLeads.length > 0 && visibleLeads.every((l) => selectedLeads.map(String).includes(String(l._id)));
  const someVisibleSelected = visibleLeads.some((l) => selectedLeads.map(String).includes(String(l._id)));
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someVisibleSelected && !allVisibleSelected;
    }
  }, [someVisibleSelected, allVisibleSelected]);

  const allAssignedVisibleSelected = visibleAssignedLeads.length > 0 && visibleAssignedLeads.every((l) => selectedAssignedLeads.map(String).includes(String(l._id)));
  const someAssignedVisibleSelected = visibleAssignedLeads.some((l) => selectedAssignedLeads.map(String).includes(String(l._id)));
  useEffect(() => {
    if (selectAllAssignedRef.current) {
      selectAllAssignedRef.current.indeterminate = someAssignedVisibleSelected && !allAssignedVisibleSelected;
    }
  }, [someAssignedVisibleSelected, allAssignedVisibleSelected]);

  // Toggle checkbox in Assigned Leads table
  const handleAssignedLeadCheck = (assignmentId) => {
    setSelectedAssignedLeads((prev) =>
      prev.includes(assignmentId)
        ? prev.filter((id) => id !== assignmentId)
        : [...prev, assignmentId]
    );
  };

  // Reassign selected assigned leads from one employee to another
  const reassignSelectedLeads = async () => {
    if (!selectedEmployee) {
      alert("Please select a source employee in 'Select Employee'.");
      return;
    }
    if (!selectedTargetEmployee) {
      alert("Please select a target employee in 'To this Employee'.");
      return;
    }
    if (selectedEmployee === selectedTargetEmployee) {
      alert("Source and target employee must be different.");
      return;
    }
    if (selectedAssignedLeads.length === 0) {
      alert("Please select at least one assigned lead to reassign.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/assignlead/reassign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromEmployeeId: selectedEmployee,
          toEmployeeId: selectedTargetEmployee,
          leadIds: selectedAssignedLeads,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Reassigned ${selectedAssignedLeads.length} lead(s) successfully!`);
        setSelectedAssignedLeads([]);
        // refresh the assigned leads list for the currently selected employee
        fetchAssignedLeads(selectedEmployee);
      } else {
        alert("Failed to reassign leads: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error reassigning leads:", err);
      alert("Error reassigning leads. Check console for details.");
    }
  };

  // Bulk delete selected leads from "Assign Leads to Employee" tab
  const bulkDeleteLeads = async () => {
    if (selectedLeads.length === 0) {
      alert("Please select at least one lead to delete.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedLeads.length} selected lead(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/leads/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadIds: selectedLeads,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Deleted ${selectedLeads.length} lead(s) successfully!`);
        setSelectedLeads([]);
        // Refresh leads list
        setLeads((prev) => prev.filter((l) => !selectedLeads.includes(String(l._id))));
      } else {
        alert("Failed to delete leads: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error deleting leads:", err);
      alert("Error deleting leads. Check console for details.");
    }
  };

  // Bulk delete selected assigned leads from "Assigned Lead" tab
  const bulkDeleteAssignedLeads = async () => {
    if (selectedAssignedLeads.length === 0) {
      alert("Please select at least one assigned lead to delete.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedAssignedLeads.length} selected assigned lead(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log("Sending delete request with IDs:", selectedAssignedLeads);
      const res = await fetch("http://localhost:4000/assignlead/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadIds: selectedAssignedLeads,
        }),
      });
      const data = await res.json();
      console.log("Response status:", res.status);
      console.log("Response data:", data);
      if (res.ok) {
        alert(`Deleted ${selectedAssignedLeads.length} assigned lead(s) successfully!`);
        setSelectedAssignedLeads([]);
        // Refresh assigned leads list
        fetchAssignedLeads(selectedEmployee);
      } else {
        alert("Failed to delete assigned leads: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error deleting assigned leads:", err);
      alert("Error deleting assigned leads. Check console for details.");
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Top nav: Assigned Lead first as requested */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setActiveTab("assigned")}
          className={`px-4 py-2 rounded ${activeTab === 'assigned' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
        >
          Assigned Lead
        </button>
        <button
          onClick={() => setActiveTab("assign")}
          className={`px-4 py-2 rounded ${activeTab === 'assign' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
        >
          Assign Leads to Employee
        </button>
      </div>

      {activeTab === 'assign' ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Assign Leads to Employee</h2>

          <label className="block mb-2 font-medium">Select Employee</label>
          {loadingEmployees ? (
            <p>Loading employees...</p>
          ) : (
            <select
              className="w-full border px-3 py-2 rounded mb-5"
              value={selectedEmployee}
              onChange={(e) => {
                const empId = e.target.value;
                setSelectedEmployee(empId);
                // when an employee is selected in Assign tab, fetch their already-assigned leads
                if (empId) fetchAssignedLeads(empId);
              }}
            >
              <option value="">-- Select an Employee --</option>
              {employees?.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.fullName}
                </option>
              ))}
            </select>
          )}

          <h3 className="font-medium mb-2">Select Leads</h3>
          {loadingLeads ? (
            <p>Loading leads...</p>
          ) : (
            <div>
              {selectedLeads.length > 0 && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded flex items-center justify-between">
                  <span className="text-red-700 font-medium">{selectedLeads.length} lead(s) selected</span>
                  <button
                    onClick={bulkDeleteLeads}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Bulk Lead Delete
                  </button>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          ref={selectAllRef}
                          checked={visibleLeads.length > 0 && visibleLeads.every((l) => selectedLeads.map(String).includes(String(l._id)))}
                          onChange={handleSelectAllVisible}
                        />
                        <div className="text-xs">All Select</div>
                      </th>
                      <th className="border px-3 py-2">Name</th>
                      <th className="border px-3 py-2">Email</th>
                      <th className="border px-3 py-2">Phone</th>
                      <th className="border px-3 py-2">WhatsApp No</th>
                      <th className="border px-3 py-2">Destination</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      // client-side pagination: show only current page items and exclude already-assigned leads
                      (leads || []).filter((l) => !assignedIds.includes(String(l._id)))
                    )
                      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                      .map((lead) => (
                        <tr key={lead._id}>
                          <td className="border px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={selectedLeads.includes(lead._id)}
                              onChange={() => handleLeadCheck(lead._id)}
                            />
                          </td>
                          <td className="border px-3 py-2">{lead.name}</td>
                          <td className="border px-3 py-2">{lead.email}</td>
                          <td className="border px-3 py-2">{lead.phone}</td>
                          <td className="border px-3 py-2">{lead.whatsAppNo}</td>
                          <td className="border px-3 py-2">{lead.destination}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-gray-600">
                  Showing {Math.min((currentPage - 1) * pageSize + 1, leads.length || 0)} to {Math.min(currentPage * pageSize, leads.length || 0)} of {leads.length || 0} leads
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
                  >
                    Previous
                  </button>
                  <div className="text-sm">Page {currentPage} of {Math.max(1, Math.ceil((leads.length || 0) / pageSize))}</div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil((leads.length || 0) / pageSize)), p + 1))}
                    disabled={currentPage >= Math.ceil((leads.length || 0) / pageSize)}
                    className={`px-3 py-1 rounded ${currentPage >= Math.ceil((leads.length || 0) / pageSize) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={assignLeads}
            className="mt-5 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Assign Selected Leads
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Assigned Leads</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block mb-2 font-medium">Select Employee</label>
              {loadingEmployees ? (
                <p>Loading employees...</p>
              ) : (
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={selectedEmployee}
                  onChange={(e) => {
                    const empId = e.target.value;
                    setSelectedEmployee(empId);
                    setSelectedAssignedLeads([]); // clear any previous selection
                    // clear any previously chosen target when source changes
                    setSelectedTargetEmployee("");
                    fetchAssignedLeads(empId);
                  }}
                >
                  <option value="">-- Select an Employee --</option>
                  {employees?.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.fullName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">To this Employee</label>
              {loadingEmployees ? (
                <p>Loading employees...</p>
              ) : (
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={selectedTargetEmployee}
                  onChange={(e) => setSelectedTargetEmployee(e.target.value)}
                >
                  <option value="">-- Select Target Employee --</option>
                  {employees
                    ?.filter((emp) => String(emp._id) !== String(selectedEmployee))
                    .map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.fullName}
                      </option>
                    ))}
                </select>
              )}
            </div>
          </div>

          {loadingAssigned ? (
            <p>Loading assigned leads...</p>
          ) : (
            <div>
              {assignedLeads.length === 0 ? (
                <p>No assigned leads for the selected employee.</p>
              ) : (
                <>
                  {selectedAssignedLeads.length > 0 && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center justify-between">
                      <span className="font-semibold">{selectedAssignedLeads.length} assigned lead(s) selected</span>
                      <button
                        onClick={bulkDeleteAssignedLeads}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-4"
                      >
                        Bulk Lead Delete
                      </button>
                    </div>
                  )}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-3 py-2 text-center">
                              <input
                                type="checkbox"
                                ref={selectAllAssignedRef}
                                checked={visibleAssignedLeads.length > 0 && visibleAssignedLeads.every((l) => selectedAssignedLeads.map(String).includes(String(l.assignmentId)))}
                                onChange={handleSelectAllAssignedVisible}
                              />
                              <div className="text-xs">All Select</div>
                            </th>
                          <th className="border px-3 py-2">Name</th>
                          <th className="border px-3 py-2">Email</th>
                          <th className="border px-3 py-2">Phone</th>
                          <th className="border px-3 py-2">WhatsApp No</th>
                          <th className="border px-3 py-2">Destination</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(
                          (assignedLeads || [])
                            .slice((assignedCurrentPage - 1) * pageSize, assignedCurrentPage * pageSize)
                        ).map((lead) => (
                          <tr key={lead._id}>
                            <td className="border px-3 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={selectedAssignedLeads.includes(lead.assignmentId)}
                                onChange={() => handleAssignedLeadCheck(lead.assignmentId)}
                              />
                            </td>
                            <td className="border px-3 py-2">{lead.name}</td>
                            <td className="border px-3 py-2">{lead.email}</td>
                            <td className="border px-3 py-2">{lead.phone}</td>
                            <td className="border px-3 py-2">{lead.whatsAppNo}</td>
                            <td className="border px-3 py-2">{lead.destination}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                    {/* Pagination controls for Assigned Leads */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-sm text-gray-600">
                        Showing {Math.min((assignedCurrentPage - 1) * pageSize + 1, assignedLeads.length || 0)} to {Math.min(assignedCurrentPage * pageSize, assignedLeads.length || 0)} of {assignedLeads.length || 0} leads
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAssignedCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={assignedCurrentPage === 1}
                          className={`px-3 py-1 rounded ${assignedCurrentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
                        >
                          Previous
                        </button>
                        <div className="text-sm">Page {assignedCurrentPage} of {Math.max(1, Math.ceil((assignedLeads.length || 0) / pageSize))}</div>
                        <button
                          onClick={() => setAssignedCurrentPage((p) => Math.min(Math.max(1, Math.ceil((assignedLeads.length || 0) / pageSize)), p + 1))}
                          disabled={assignedCurrentPage >= Math.ceil((assignedLeads.length || 0) / pageSize)}
                          className={`px-3 py-1 rounded ${assignedCurrentPage >= Math.ceil((assignedLeads.length || 0) / pageSize) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
                        >
                          Next
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={reassignSelectedLeads}
                      className="mt-5 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                    >
                      Reassign Selected Leads
                    </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
