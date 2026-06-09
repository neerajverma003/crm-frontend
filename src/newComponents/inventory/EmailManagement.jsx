import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ViewModal = ({ item, isOpen, onClose, users, onAssign, onUnassign, assigning }) => {
  const [selectedUser, setSelectedUser] = useState("");

  if (!isOpen || !item) return null;

  const handleAssign = () => {
    if (!selectedUser) {
      toast.warn("Please select a person");
      return;
    }
    const user = users.find(u => u._id === selectedUser);
    if (user) {
      onAssign(item._id, user._id, user.userType, user.fullName);
      setSelectedUser("");
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-4 sm:p-6 flex justify-between items-center rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-bold">Email Details</h2>
          <button onClick={onClose} className="text-2xl font-bold hover:text-blue-100 flex-shrink-0">&times;</button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Email Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Address</h3>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 break-all">{item.email}</p>
            <p className="text-sm text-gray-500 mt-2">Created: {formatDate(item.createdAt)}</p>
          </div>

          {/* Current Assignment */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Assignment</h3>
            {item.assignedToName ? (
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Assigned to:</p>
                  <p className="text-lg font-semibold text-gray-900">{item.assignedToName}</p>
                  <p className="text-sm text-gray-500">Type: {item.assignedToType}</p>
                </div>
                <button
                  onClick={() => onUnassign(item._id)}
                  disabled={assigning}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm disabled:opacity-60"
                >
                  {assigning ? "..." : "Unassign"}
                </button>
              </div>
            ) : (
              <p className="text-gray-500 italic">Not assigned to anyone</p>
            )}
          </div>

          {/* Assign to */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Assign to</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">-- Select Admin or Employee --</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.fullName} ({user.userType})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                disabled={assigning || !selectedUser}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-60 whitespace-nowrap"
              >
                {assigning ? "..." : "Assign"}
              </button>
            </div>
          </div>

          {/* Assignment History */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Assignment History</h3>
            {item.assignmentHistory && item.assignmentHistory.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {item.assignmentHistory.slice().reverse().map((record, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                    <p className="font-semibold text-sm text-gray-900">{record.assignedToName || "Unknown"}</p>
                    <p className="text-xs text-gray-600">Type: {record.assignedToType}</p>
                    <p className="text-xs text-gray-500">
                      Assigned: {formatDate(record.assignedAt)}
                    </p>
                    {record.unassignedAt && (
                      <p className="text-xs text-gray-500">
                        Unassigned: {formatDate(record.unassignedAt)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No assignment history</p>
            )}
          </div>
        </div>

        <div className="border-t p-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EmailManagement = () => {
  const [email, setEmail] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [users, setUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [assigning, setAssigning] = useState(false);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const [adminRes, empRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/getAdmins`),
        fetch(`${import.meta.env.VITE_API_URL}/employee/allEmployee`)
      ]);

      let admins = [];
      let employees = [];

      if (adminRes.ok) {
        const data = await adminRes.json();
        const adminArray = Array.isArray(data) ? data : data.admins || [];
        admins = adminArray.filter(a => a.accountActive);
        admins = admins.map(a => ({ ...a, userType: "Admin" }));
      }

      if (empRes.ok) {
        const data = await empRes.json();
        const employeeArray = Array.isArray(data) ? data : data.employees || [];
        employees = employeeArray.filter(e => e.accountActive);
        employees = employees.map(e => ({ ...e, userType: "Employee" }));
      }

      setUsers([...admins, ...employees]);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Unable to load users");
    } finally {
      setFetchingUsers(false);
    }
  };

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/email`);
      const json = await res.json();
      if (res.ok && json.success) setList(json.data || []);
      else throw new Error(json.message || "Failed to load");
    } catch (err) {
      console.error(err);
      toast.error("Unable to load emails");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    fetchUsers();
  }, []);

  const handleAdd = async (e) => {
    e && e.preventDefault();
    if (!email.trim()) {
      toast.warn("Please enter an email");
      return;
    }
    if (!emailRegex.test(email.trim())) {
      toast.error("Enter a valid email address");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setList((s) => [json.data, ...s]);
        setEmail("");
        toast.success("Email added");
      } else {
        throw new Error(json.message || "Failed to add");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Unable to add email");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this email?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/email/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        setList((s) => s.filter((it) => it._id !== id));
        toast.success("Deleted");
      } else throw new Error(json.message || "Delete failed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAssign = async (emailId, userId, userType, userName) => {
    setAssigning(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/email/${emailId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: userId, assignedToType: userType, assignedToName: userName })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setList(s => s.map(item => item._id === emailId ? json.data : item));
        setSelectedItem(json.data);
        toast.success("Assigned successfully");
      } else throw new Error(json.message || "Failed to assign");
    } catch (err) {
      console.error(err);
      toast.error("Unable to assign");
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async (emailId) => {
    setAssigning(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/email/${emailId}/unassign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setList(s => s.map(item => item._id === emailId ? json.data : item));
        setSelectedItem(json.data);
        toast.success("Unassigned successfully");
      } else throw new Error(json.message || "Failed to unassign");
    } catch (err) {
      console.error(err);
      toast.error("Unable to unassign");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Email Management</h1>
        <p className="text-sm text-gray-600 mt-1">Add and manage emails. The table below lists saved emails with quick actions.</p>
      </div>

      <div className="bg-white border rounded shadow-sm p-4 mb-6">
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-9">
            <label className="block text-xs text-gray-600 mb-1">Email Address</label>
            <input
              aria-label="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            />
            <p className="text-xs text-gray-400 mt-1">Enter a valid email address to store.</p>
          </div>

          <div className="md:col-span-3 flex gap-2 md:justify-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {saving ? "Adding..." : "Add Email"}
            </button>
          </div>
        </form>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border rounded shadow-sm overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 w-20">#</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Assigned To</th>
              <th className="text-left px-6 py-3 w-48">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">Loading...</td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No emails found.</td>
              </tr>
            ) : (
              list.map((item, idx) => (
                <tr key={item._id || item.id} className="border-t">
                  <td className="px-6 py-4 align-top text-sm text-gray-700">{idx + 1}</td>
                  <td className="px-6 py-4 align-top text-sm text-gray-900 font-medium">{item.email}</td>
                  <td className="px-6 py-4 align-top text-sm">
                    {item.assignedToName ? (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                        {item.assignedToName}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setViewModal(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(item._id || item.id)}
                        disabled={deletingId === (item._id || item.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        {deletingId === (item._id || item.id) ? "Deleting..." : "Delete"}
                      </button>
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
        {loading ? (
          <div className="p-6 text-center text-gray-500 bg-white border rounded shadow-sm">Loading...</div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white border rounded shadow-sm">No emails found.</div>
        ) : (
          list.map((item, idx) => (
            <div key={item._id || item.id} className="bg-white border rounded-lg shadow-sm p-4 relative flex flex-col gap-3">
              <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 font-bold text-xs px-2 py-1 rounded">
                # {idx + 1}
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Email Address</p>
                <p className="text-sm font-bold text-blue-900 break-all pr-8">{item.email}</p>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1.5">Assignment Status</p>
                {item.assignedToName ? (
                  <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded text-xs font-semibold inline-block">
                    {item.assignedToName}
                  </span>
                ) : (
                  <span className="text-gray-400 italic text-xs">Unassigned</span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-1">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setViewModal(true);
                  }}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded text-sm font-semibold border border-blue-100"
                >
                  View / Assign
                </button>
                <button
                  onClick={() => handleDelete(item._id || item.id)}
                  disabled={deletingId === (item._id || item.id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded text-sm font-semibold border border-red-100 disabled:opacity-50"
                >
                  {deletingId === (item._id || item.id) ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ViewModal
        item={selectedItem}
        isOpen={viewModal}
        onClose={() => setViewModal(false)}
        users={users}
        onAssign={handleAssign}
        onUnassign={handleUnassign}
        assigning={assigning}
      />
    </div>
  );
};

export default EmailManagement;
