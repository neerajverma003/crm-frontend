import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HiOutlineDeviceMobile, HiOutlineUserGroup } from "react-icons/hi";
import { BsSim, BsPersonCheckFill, BsPersonXFill } from "react-icons/bs";
import { FiRefreshCw, FiPlus, FiTrash2, FiEye, FiX, FiClock } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import { MdOutlineAssignmentInd, MdOutlineSimCard } from "react-icons/md";

const phoneRegex = /^\+?\d{7,15}$/;

const ViewModal = ({ item, isOpen, onClose, users, onAssign, onUnassign, assigning }) => {
  const [selectedUser, setSelectedUser] = useState("");

  if (!isOpen || !item) return null;

  const handleAssign = () => {
    if (!selectedUser) {
      toast.warn("Please select a person");
      return;
    }
    const user = users.find((u) => u._id === selectedUser);
    if (user) {
      onAssign(item._id, user._id, user.userType, user.fullName);
      setSelectedUser("");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " +
    new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white p-5 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <BsSim size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">SIM Details</h2>
              <p className="text-blue-100 text-xs">Manage assignment & history</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/25 transition-colors p-2 rounded-xl"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* SIM Info Card */}
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">SIM Number</p>
            <p className="text-3xl font-extrabold tracking-wide relative">{item.number}</p>
            <p className="text-blue-200 text-xs mt-2 relative">Added {formatDate(item.createdAt)}</p>
          </div>

          {/* Current Assignment */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Current Assignment</p>
            {item.assignedToName ? (
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2.5 rounded-xl">
                    <BsPersonCheckFill size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{item.assignedToName}</p>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                      {item.assignedToType}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onUnassign(item._id)}
                  disabled={assigning}
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-60"
                >
                  <BsPersonXFill size={14} />
                  {assigning ? "Wait..." : "Unassign"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-400">
                <div className="bg-gray-100 p-2.5 rounded-xl">
                  <BsPersonXFill size={18} />
                </div>
                <p className="text-sm italic">Not assigned to anyone</p>
              </div>
            )}
          </div>

          {/* Assign Section */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <MdOutlineAssignmentInd size={14} />
              Assign to
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="flex-1 border border-amber-200 bg-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-300 text-gray-700"
              >
                <option value="">— Select Admin or Employee —</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName} ({user.userType})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                disabled={assigning || !selectedUser}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 transition-all whitespace-nowrap shadow-sm"
              >
                <IoSparkles size={14} />
                {assigning ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>

          {/* Assignment History */}
          <div className="border border-gray-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FiClock size={13} />
              Assignment History
            </p>
            {item.assignmentHistory && item.assignmentHistory.length > 0 ? (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {item.assignmentHistory
                  .slice()
                  .reverse()
                  .map((record, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-100 rounded-xl p-3 border-l-4 border-l-blue-500"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm text-gray-900">{record.assignedToName || "Unknown"}</p>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                            {record.assignedToType}
                          </span>
                        </div>
                        {record.unassignedAt && (
                          <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-semibold">
                            Released
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 mt-2">
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold text-emerald-600">↑</span> {formatDate(record.assignedAt)}
                        </p>
                        {record.unassignedAt && (
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold text-rose-400">↓</span> {formatDate(record.unassignedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">
                <FiClock size={24} className="mx-auto mb-1 opacity-40" />
                <p className="text-sm italic">No assignment history yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const SimManagement = () => {
  const [number, setNumber] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [users, setUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [refreshSpin, setRefreshSpin] = useState(false);

  const assigned = list.filter((i) => i.assignedToName).length;
  const unassigned = list.length - assigned;

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const [adminRes, empRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/getAdmins`),
        fetch(`${import.meta.env.VITE_API_URL}/employee/allEmployee`),
      ]);
      let admins = [], employees = [];
      if (adminRes.ok) {
        const data = await adminRes.json();
        admins = (Array.isArray(data) ? data : data.admins || [])
          .filter((a) => a.accountActive)
          .map((a) => ({ ...a, userType: "Admin" }));
      }
      if (empRes.ok) {
        const data = await empRes.json();
        employees = (Array.isArray(data) ? data : data.employees || [])
          .filter((e) => e.accountActive)
          .map((e) => ({ ...e, userType: "Employee" }));
      }
      setUsers([...admins, ...employees]);
    } catch (err) {
      toast.error("Unable to load users");
    } finally {
      setFetchingUsers(false);
    }
  };

  const fetchList = async (spin = false) => {
    if (spin) setRefreshSpin(true);
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/sim`);
      const json = await res.json();
      if (res.ok && json.success) setList(json.data || []);
      else throw new Error(json.message || "Failed to load");
    } catch (err) {
      toast.error("Unable to load SIM numbers");
    } finally {
      setLoading(false);
      if (spin) setTimeout(() => setRefreshSpin(false), 600);
    }
  };

  useEffect(() => {
    fetchList();
    fetchUsers();
  }, []);

  const handleAdd = async () => {
    if (!number.trim()) { toast.warn("Please enter a number"); return; }
    if (!phoneRegex.test(number.trim())) { toast.error("Enter a valid phone number (7–15 digits, optional +)"); return; }
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/sim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: number.trim() }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setList((s) => [json.data, ...s]);
        setNumber("");
        toast.success("SIM number added");
      } else throw new Error(json.message || "Failed to add");
    } catch (err) {
      toast.error(err.message || "Unable to add number");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this SIM number?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/sim/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) { setList((s) => s.filter((it) => it._id !== id)); toast.success("Deleted"); }
      else throw new Error(json.message || "Delete failed");
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAssign = async (simId, userId, userType, userName) => {
    setAssigning(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/sim/${simId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: userId, assignedToType: userType, assignedToName: userName }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setList((s) => s.map((item) => (item._id === simId ? json.data : item)));
        setSelectedItem(json.data);
        toast.success("Assigned successfully");
      } else throw new Error(json.message || "Failed to assign");
    } catch (err) {
      toast.error("Unable to assign");
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async (simId) => {
    setAssigning(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/sim/${simId}/unassign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setList((s) => s.map((item) => (item._id === simId ? json.data : item)));
        setSelectedItem(json.data);
        toast.success("Unassigned successfully");
      } else throw new Error(json.message || "Failed to unassign");
    } catch (err) {
      toast.error("Unable to unassign");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative bg-white text-gray-900 px-6 pt-8 pb-8 overflow-hidden border-b border-gray-200">
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl shadow-sm border border-blue-100">
                <BsSim size={28} />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-0.5">Inventory</p>
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">SIM Management</h1>
                <p className="text-gray-600 text-sm mt-0.5">Add, assign, and track SIM numbers across your team</p>
              </div>
            </div>
            <button
              onClick={() => fetchList(true)}
              className="bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 transition-all p-2.5 rounded-xl shadow-sm"
              title="Refresh"
            >
              <FiRefreshCw size={18} className={refreshSpin ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pb-1">
            {[
              { label: "Total SIMs", value: list.length, icon: <MdOutlineSimCard size={16} />, color: "bg-blue-50 text-blue-700 border-blue-100", iconBg: "bg-white text-blue-600" },
              { label: "Assigned", value: assigned, icon: <BsPersonCheckFill size={14} />, color: "bg-emerald-50 text-emerald-700 border-emerald-100", iconBg: "bg-white text-emerald-600" },
              { label: "Unassigned", value: unassigned, icon: <BsPersonXFill size={14} />, color: "bg-rose-50 text-rose-700 border-rose-100", iconBg: "bg-white text-rose-600" },
              { label: "Users", value: users.length, icon: <HiOutlineUserGroup size={16} />, color: "bg-amber-50 text-amber-700 border-amber-100", iconBg: "bg-white text-amber-600" },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.color} border rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm`}>
                <div className={`${stat.iconBg} p-1.5 rounded-lg shadow-sm`}>{stat.icon}</div>
                <div>
                  <p className="text-2xl font-extrabold leading-none">{stat.value}</p>
                  <p className="opacity-80 text-xs mt-0.5 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-10">
        {/* Add SIM Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-500 rounded-full" />
            <p className="font-bold text-gray-800 text-sm">Add New SIM Number</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <HiOutlineDeviceMobile size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="e.g. +919900112233"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-60 transition-all shadow-sm shadow-blue-200 whitespace-nowrap"
            >
              {saving ? (
                <FiRefreshCw size={15} className="animate-spin" />
              ) : (
                <FiPlus size={16} />
              )}
              {saving ? "Adding..." : "Add Number"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 ml-1">International format · optional + · 7–15 digits</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-500 rounded-full" />
              <p className="font-bold text-gray-800 text-sm">All SIM Numbers</p>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold ml-1">{list.length}</span>
            </div>
          </div>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider w-16">#</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">SIM Number</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned To</th>
                <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider w-44">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400">
                    <FiRefreshCw size={22} className="animate-spin mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Loading SIM numbers...</p>
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400">
                    <BsSim size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium">No SIM numbers found</p>
                    <p className="text-xs mt-1 opacity-70">Add one using the form above</p>
                  </td>
                </tr>
              ) : (
                list.map((item, idx) => (
                  <tr key={item._id || item.id} className="border-t border-gray-50 hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-400 font-bold">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-blue-100 p-1.5 rounded-lg">
                          <BsSim size={14} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-800 font-mono">{item.number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.assignedToName ? (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full text-xs font-bold">
                            {item.assignedToName}
                          </span>
                          <span className="text-xs text-gray-400">{item.assignedToType}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
                          <span className="text-gray-400 italic text-xs">Unassigned</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedItem(item); setViewModal(true); }}
                          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          <FiEye size={12} /> View
                        </button>
                        <button
                          onClick={() => handleDelete(item._id || item.id)}
                          disabled={deletingId === (item._id || item.id)}
                          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                        >
                          <FiTrash2 size={12} />
                          {deletingId === (item._id || item.id) ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-500 rounded-full" />
            <p className="font-bold text-gray-700 text-sm">All SIM Numbers</p>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">{list.length}</span>
          </div>
          {loading ? (
            <div className="bg-white rounded-2xl border border-blue-50 shadow p-10 text-center text-gray-400">
              <FiRefreshCw size={22} className="animate-spin mx-auto mb-2 opacity-50" />
              <p className="text-sm">Loading...</p>
            </div>
          ) : list.length === 0 ? (
            <div className="bg-white rounded-2xl border border-blue-50 shadow p-10 text-center text-gray-400">
              <BsSim size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No SIM numbers yet</p>
            </div>
          ) : (
            list.map((item, idx) => (
              <div
                key={item._id || item.id}
                className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden"
              >
                {/* Top accent bar */}
                <div className={`h-1 w-full ${item.assignedToName ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-gray-200 to-gray-300"}`} />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-blue-100 p-2 rounded-xl">
                        <BsSim size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold">SIM Number</p>
                        <p className="text-sm font-extrabold text-gray-900 font-mono">{item.number}</p>
                      </div>
                    </div>
                    <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-lg">#{idx + 1}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {item.assignedToName ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold px-2.5 py-1 rounded-full">
                          {item.assignedToName}
                        </span>
                        <span className="text-xs text-gray-400">{item.assignedToType}</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-gray-300" />
                        <span className="text-gray-400 text-xs italic">Unassigned</span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedItem(item); setViewModal(true); }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <FiEye size={13} /> View / Assign
                    </button>
                    <button
                      onClick={() => handleDelete(item._id || item.id)}
                      disabled={deletingId === (item._id || item.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      <FiTrash2 size={13} />
                      {deletingId === (item._id || item.id) ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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

export default SimManagement;