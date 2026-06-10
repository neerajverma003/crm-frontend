import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

// ── Toast ──────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors =
    type === "success"
      ? "bg-blue-600 text-white"
      : "bg-red-500 text-white";

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-3 ${colors}`}
    >
      {type === "success" ? (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition">✕</button>
    </div>
  );
};

// ── Delete Confirm Modal ───────────────────────────────────────────────────
const DeleteConfirm = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 border border-blue-100">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-800 text-center mb-1">Delete Team?</h3>
      <p className="text-sm text-gray-500 text-center mb-6">This action cannot be undone.</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition text-sm font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ── Helpers ────────────────────────────────────────────────────────────────
const getInitials = (name) => {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

const Avatar = ({ name, size = "md" }) => {
  const sizes = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-lg",
    lg: "w-20 h-20 text-2xl",
  };
  return (
    <div className={`${sizes[size]} bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold rounded-xl flex items-center justify-center shrink-0 shadow-md`}>
      {getInitials(name)}
    </div>
  );
};

const StatBox = ({ label, value, accent = false }) => (
  <div className={`rounded-xl p-4 border ${accent ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-blue-100 text-gray-800"}`}>
    <p className={`text-xs font-medium mb-1 ${accent ? "text-blue-200" : "text-gray-500"}`}>{label}</p>
    <p className={`text-2xl font-bold ${accent ? "text-white" : "text-blue-700"}`}>{value}</p>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const AllTeam = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingTeam, setEditingTeam] = useState(null);
  const [editLeader, setEditLeader] = useState("");
  const [editMembers, setEditMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // UI state
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, empRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/teams/`),
          axios.get(`${import.meta.env.VITE_API_URL}/employee/allEmployee`),
        ]);
        setTeams(teamsRes.data);
        if (empRes.data?.success && Array.isArray(empRes.data.employees)) {
          setEmployees(empRes.data.employees);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        showToast("Failed to load teams", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Selectable employees derived from editing team's company
  const selectableEmployees = useMemo(() => {
    if (!editingTeam) return [];

    // Resolve company from currently selected leader OR fallback to original leader
    const leaderEmp = employees.find((e) => e._id === (editLeader || editingTeam.teamLeader?._id));
    const companyId = leaderEmp?.company?._id || leaderEmp?.company;
    if (!companyId) return [];

    const companyActive = employees.filter(
      (e) => (e.company?._id === companyId || e.company === companyId) && e.accountActive === true
    );

    const otherTeamsAssigned = new Set();
    teams.forEach((t) => {
      if (t._id !== editingTeam._id) {
        if (t.teamLeader?._id) otherTeamsAssigned.add(t.teamLeader._id);
        t.members?.forEach((m) => m._id && otherTeamsAssigned.add(m._id));
      }
    });

    return companyActive.filter((e) => !otherTeamsAssigned.has(e._id));
  }, [editingTeam, editLeader, employees, teams]);

  const handleEdit = (team) => {
    setEditingTeam(team);
    setEditLeader(team.teamLeader?._id || "");
    setEditMembers(team.members?.map((m) => m._id) || []);
    setSearchTerm("");
  };

  const handleSaveEdit = async () => {
    if (!editLeader) return showToast("Please select a team leader.", "error");
    if (!editMembers.length) return showToast("Please add at least one member.", "error");

    try {
      setSubmitting(true);
      await axios.put(`${import.meta.env.VITE_API_URL}/teams/${editingTeam._id}/members`, {
        teamLeaderId: editLeader,
        memberIds: editMembers,
      });

      const teamsRes = await axios.get(`${import.meta.env.VITE_API_URL}/teams/`);
      const updatedTeams = teamsRes.data;
      setTeams(updatedTeams);

      // Keep selectedTeam in sync
      if (selectedTeam?._id === editingTeam._id) {
        setSelectedTeam(updatedTeams.find((t) => t._id === editingTeam._id) || null);
      }

      setEditingTeam(null);
      showToast("Team updated successfully!");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update team.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    const teamId = deleteTarget;
    setDeleteTarget(null);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/teams/${teamId}`);
      setTeams((prev) => prev.filter((t) => t._id !== teamId));
      if (selectedTeam?._id === teamId) setSelectedTeam(null);
      showToast("Team deleted.");
    } catch (err) {
      showToast("Failed to delete team.", "error");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-700 font-medium">Loading teams…</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 p-6">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Confirm */}
      {deleteTarget && (
        <DeleteConfirm onConfirm={handleDeleteConfirmed} onCancel={() => setDeleteTarget(null)} />
      )}

      {/* Page Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          {selectedTeam && (
            <button
              onClick={() => setSelectedTeam(null)}
              className="p-2 rounded-xl bg-white border border-blue-100 text-blue-600 hover:bg-blue-50 transition shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
              {selectedTeam ? selectedTeam.teamLeader?.fullName + "'s Team" : "All Teams"}
            </h1>
            <p className="text-sm text-blue-400 mt-0.5">
              {selectedTeam ? `${selectedTeam.members?.length || 0} members` : `${teams.length} teams`}
            </p>
          </div>
        </div>

        {/* ── TEAM LIST ── */}
        {!selectedTeam && (
          <div className="space-y-3">
            {teams.map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-blue-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4 p-5">
                  {/* Click area */}
                  <button
                    onClick={() => setSelectedTeam(team)}
                    className="flex items-center gap-4 flex-1 text-left min-w-0"
                  >
                    <Avatar name={team.teamLeader?.fullName} size="md" />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-lg leading-tight truncate">
                        {team.teamLeader?.fullName || "Unassigned"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{team.teamLeader?.email}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-4 pr-2 shrink-0">
                      <div className="text-center hidden sm:block">
                        <p className="text-xs text-gray-400">Members</p>
                        <p className="text-lg font-bold text-blue-700">{team.members?.length || 0}</p>
                      </div>
                      <svg
                        className="w-5 h-5 text-blue-300 group-hover:text-blue-600 transition"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 pl-3 border-l border-blue-50">
                    <button
                      onClick={() => handleEdit(team)}
                      className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition"
                      title="Edit team"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(team._id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition"
                      title="Delete team"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {teams.length === 0 && (
              <div className="text-center py-16 text-blue-300">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="font-medium">No teams yet</p>
              </div>
            )}
          </div>
        )}

        {/* ── TEAM DETAIL ── */}
        {selectedTeam && (
          <div className="space-y-6">
            {/* Leader card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-3xl font-extrabold text-white shrink-0 shadow-inner">
                  {getInitials(selectedTeam.teamLeader?.fullName)}
                </div>
                <div>
                  <p className="text-2xl font-extrabold">{selectedTeam.teamLeader?.fullName}</p>
                  <p className="text-blue-200 text-sm">{selectedTeam.teamLeader?.email}</p>
                  <span className="inline-block mt-2 px-3 py-0.5 bg-white/20 rounded-full text-xs font-semibold">Team Leader</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "My Leads", value: 49 },
                  { label: "My Closed", value: 7 },
                  { label: "My Rate", value: "14.3%" },
                  { label: "Team Size", value: selectedTeam.members?.length || 0 },
                  { label: "Team Rate", value: "32.9%" },
                ].map((box, i) => (
                  <div key={i} className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                    <p className="text-blue-200 text-xs mb-1">{box.label}</p>
                    <p className="text-xl font-bold">{box.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Members */}
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-4">Team Members</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTeam.members?.map((member) => (
                  <MemberCard key={member._id} member={member} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── EDIT MODAL ── */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-blue-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-blue-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-blue-900">Edit Team</h3>
                <p className="text-xs text-blue-400 mt-0.5">Update leader and members</p>
              </div>
              <button onClick={() => setEditingTeam(null)} className="text-gray-400 hover:text-gray-600 transition p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Leader */}
              <div>
                <label className="block text-sm font-semibold text-blue-800 mb-1.5">Team Leader</label>
                <select
                  value={editLeader}
                  onChange={(e) => {
                    setEditLeader(e.target.value);
                    setEditMembers((prev) => prev.filter((id) => id !== e.target.value));
                  }}
                  className="w-full px-4 py-2.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 bg-blue-50/40"
                >
                  <option value="">Select leader…</option>
                  {selectableEmployees.map((emp) => (
                    <option key={emp._id} value={emp._id}>{emp.fullName}</option>
                  ))}
                </select>
              </div>

              {/* Members */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-blue-800">Members</label>
                  <button
                    onClick={() => {
                      const pool = selectableEmployees.filter((e) => e._id !== editLeader);
                      setEditMembers(editMembers.length === pool.length ? [] : pool.map((e) => e._id));
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition"
                  >
                    {editMembers.length === selectableEmployees.filter((e) => e._id !== editLeader).length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>

                <div className="relative mb-2">
                  <svg className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search employees…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-blue-50/40"
                  />
                </div>

                <div className="border border-blue-100 rounded-xl max-h-48 overflow-y-auto bg-blue-50/30 p-2 space-y-1">
                  {selectableEmployees
                    .filter((e) => e._id !== editLeader)
                    .filter((e) => e.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((emp) => {
                      const checked = editMembers.includes(emp._id);
                      return (
                        <label
                          key={emp._id}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition select-none ${
                            checked ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-blue-50 border border-blue-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setEditMembers((prev) =>
                                checked ? prev.filter((id) => id !== emp._id) : [...prev, emp._id]
                              )
                            }
                            className="w-4 h-4 accent-blue-600 shrink-0"
                          />
                          <span className="text-sm font-medium">{emp.fullName}</span>
                        </label>
                      );
                    })}
                  {selectableEmployees.filter((e) => e._id !== editLeader).length === 0 && (
                    <p className="text-center text-xs text-blue-300 py-4">No employees available</p>
                  )}
                </div>

                <p className="text-xs text-blue-400 mt-1.5">{editMembers.length} member{editMembers.length !== 1 ? "s" : ""} selected</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-blue-50 flex items-center justify-end gap-3 bg-blue-50/40">
              <button
                onClick={() => setEditingTeam(null)}
                className="px-4 py-2 border border-blue-200 text-blue-700 bg-white rounded-xl hover:bg-blue-50 transition text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={submitting}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {submitting ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Member Card (memoized to avoid random stat flicker) ───────────────────
const MemberCard = React.memo(({ member }) => {
  const leads = useMemo(() => Math.floor(Math.random() * 50), [member._id]);
  const closed = useMemo(() => Math.floor(Math.random() * 20), [member._id]);
  const rate = leads ? ((closed / leads) * 100).toFixed(1) : "0";

  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm hover:shadow-blue-100 hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={member.fullName} size="sm" />
        <div className="min-w-0">
          <p className="font-bold text-gray-800 truncate">{member.fullName}</p>
          <p className="text-xs text-gray-500 truncate">{member.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatBox label="Leads" value={leads} />
        <StatBox label="Closed" value={closed} />
        <StatBox label="Rate" value={`${rate}%`} />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
        <span className="text-xs text-blue-400 block mb-0.5">Current Assignment</span>
        <span className="text-gray-500 text-xs">No assignment yet</span>
      </div>
    </div>
  );
});

export default AllTeam;