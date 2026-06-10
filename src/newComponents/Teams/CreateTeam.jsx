import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateTeam = () => {
  const [companies, setCompanies] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLeader, setSelectedLeader] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [assignedEmployees, setAssignedEmployees] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [empRes, compRes, teamsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/employee/allEmployee`),
          axios.get(`${import.meta.env.VITE_API_URL}/company/all`),
          axios.get(`${import.meta.env.VITE_API_URL}/teams/`),
        ]);
        const compData = compRes.data;
        setCompanies(Array.isArray(compData) ? compData : compData?.companies || compData?.data || []);
        if (empRes.data?.success && Array.isArray(empRes.data.employees)) {
          setAllEmployees(empRes.data.employees);
        } else {
          setError("No employees found.");
        }

        const teamsData = teamsRes.data || [];
        const assignedIds = new Set();
        teamsData.forEach(team => {
          if (team.teamLeader?._id) assignedIds.add(team.teamLeader._id);
          if (Array.isArray(team.members)) {
            team.members.forEach(m => {
              if (m._id) assignedIds.add(m._id);
            });
          }
        });
        setAssignedEmployees(assignedIds);
      } catch {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const companyEmployees = allEmployees.filter(
    (emp) => selectedCompany && emp.company?._id === selectedCompany && emp.accountActive === true && !assignedEmployees.has(emp._id)
  );
  const teamLeaders = companyEmployees;
  const teamMembers = companyEmployees.filter((emp) => emp._id !== selectedLeader);

  useEffect(() => { setSelectedLeader(""); setSelectedEmployees([]); }, [selectedCompany]);
  useEffect(() => {
    if (selectedLeader && selectedEmployees.includes(selectedLeader))
      setSelectedEmployees((prev) => prev.filter((id) => id !== selectedLeader));
  }, [selectedLeader]);

  const handleEmployeeCheck = (id) =>
    setSelectedEmployees((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);

  const handleSelectAll = () =>
    setSelectedEmployees(selectedEmployees.length === teamMembers.length ? [] : teamMembers.map((e) => e._id));

  const handleCreateTeam = async () => {
    if (!selectedCompany) return alert("Please select a company.");
    if (!selectedLeader) return alert("Please select a team leader.");
    if (!selectedEmployees.length) return alert("Please select at least one member.");
    try {
      setSubmitting(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/teams/`, {
        teamLeaderId: selectedLeader,
        memberIds: selectedEmployees,
        companyId: selectedCompany,
      });
      if (res.status === 200 || res.status === 201) {
        alert("Team created successfully!");
        setSelectedCompany(""); setSelectedLeader(""); setSelectedEmployees([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create team.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentStep = !selectedCompany ? 1 : !selectedLeader ? 2 : 3;
  const leaderData = teamLeaders.find((e) => e._id === selectedLeader);
  const getInitials = (name = "") => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const avatarColors = [
    { bg: "#E6F1FB", text: "#185FA5" },
    { bg: "#E1F5EE", text: "#0F6E56" },
    { bg: "#FAEEDA", text: "#854F0B" },
    { bg: "#FBEAF0", text: "#993556" },
    { bg: "#EEEDFE", text: "#534AB7" },
  ];
  const getAvatarColor = (id) => avatarColors[(id?.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <div style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px", fontFamily: "inherit" }}>
      <div style={{
        background: "#ffffff",
        border: "0.5px solid #e2e8f0",
        borderRadius: 16,
        overflow: "hidden",
      }}>

        {/* ── Header ── */}
        <div style={{ padding: "28px 32px 24px", borderBottom: "0.5px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12,
              background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 500, color: "#0f172a" }}>Create a new team</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                Pick a company, assign a leader, then add members.
              </div>
            </div>
          </div>

          {/* Step progress */}
          <div style={{ display: "flex", gap: 0, marginTop: 24, position: "relative" }}>
            {["Company", "Leader", "Members"].map((label, i) => {
              const n = i + 1;
              const done = currentStep > n;
              const active = currentStep === n;
              return (
                <div key={n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  {i < 2 && (
                    <div style={{
                      position: "absolute", top: 13, left: "50%", width: "100%", height: 1,
                      background: done || (active && n < currentStep) ? "#378ADD" : "#e2e8f0",
                    }} />
                  )}
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", zIndex: 1, position: "relative",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 500,
                    background: done ? "#185FA5" : active ? "#E6F1FB" : "#ffffff",
                    border: `1.5px solid ${done ? "#185FA5" : active ? "#378ADD" : "#cbd5e1"}`,
                    color: done ? "#fff" : active ? "#185FA5" : "#94a3b8",
                  }}>
                    {done ? "✓" : n}
                  </div>
                  <div style={{ fontSize: 11, color: done || active ? "#185FA5" : "#94a3b8", marginTop: 5 }}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "28px 32px" }}>

          {/* Summary chips */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {[
              { val: selectedCompany ? (companies.find(c => c._id === selectedCompany)?.companyName || "—") : "—", lbl: "Company" },
              { val: selectedLeader ? "1" : "0", lbl: "Leader" },
              { val: selectedEmployees.length, lbl: "Members" },
            ].map(({ val, lbl }) => (
              <div key={lbl} style={{
                flex: 1, background: "#f8fafc",
                borderRadius: 10, padding: "12px 14px",
                border: "0.5px solid #e2e8f0",
              }}>
                <div style={{ fontSize: 18, fontWeight: 500, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* ── 1. Company ── */}
          <div style={{ marginBottom: 20 }}>
            <Label icon="🏢" text="Select company" />
            <SelectWrap disabled={loading || submitting}>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                disabled={loading || submitting}
                style={selectStyle}
              >
                <option value="">— Choose company —</option>
                {loading ? <option disabled>Loading…</option>
                  : error ? <option disabled>{error}</option>
                  : companies.map((c) => <option key={c._id} value={c._id}>{c.companyName}</option>)}
              </select>
              <Chevron />
            </SelectWrap>
          </div>

          {/* ── 2. Leader ── */}
          <div style={{ marginBottom: 20, opacity: selectedCompany ? 1 : 0.45, transition: "opacity .2s" }}>
            <Label icon="🛡" text="Team leader" />
            {leaderData && (
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", marginBottom: 10,
                border: "0.5px solid #378ADD", borderRadius: 10,
                background: "#E6F1FB18",
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                  background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 500, color: "#fff",
                }}>
                  {getInitials(leaderData.fullName)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#0f172a" }}>{leaderData.fullName}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{leaderData.designation?.designation || "Employee"}</div>
                </div>
                <span style={{
                  marginLeft: "auto", background: "#E6F1FB", color: "#185FA5",
                  fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500,
                }}>Leader</span>
              </div>
            )}
            <SelectWrap disabled={!selectedCompany || loading || submitting}>
              <select
                value={selectedLeader}
                onChange={(e) => setSelectedLeader(e.target.value)}
                disabled={!selectedCompany || loading || submitting}
                style={selectStyle}
              >
                <option value="">— Choose leader —</option>
                {teamLeaders.map((e) => (
                  <option key={e._id} value={e._id}>{e.fullName} — {e.designation?.designation || "Employee"}</option>
                ))}
                {selectedCompany && teamLeaders.length === 0 && <option disabled>No employees found</option>}
              </select>
              <Chevron />
            </SelectWrap>
          </div>

          {/* ── 3. Members ── */}
          <div style={{ marginBottom: 24, opacity: selectedLeader ? 1 : 0.45, transition: "opacity .2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Label icon="👥" text="Team members" />
              {selectedLeader && teamMembers.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  style={{ fontSize: 12, color: "#185FA5", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
                >
                  {selectedEmployees.length === teamMembers.length ? "Deselect all" : "Select all"}
                </button>
              )}
            </div>

            <div style={{ border: "0.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
              {/* members list header */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 14px", background: "#f8fafc",
                borderBottom: "0.5px solid #e2e8f0",
              }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  {!selectedLeader ? "Select a leader first" : `${teamMembers.length} available`}
                </span>
                {selectedEmployees.length > 0 && (
                  <span style={{ background: "#E6F1FB", color: "#185FA5", fontSize: 11, fontWeight: 500, padding: "2px 9px", borderRadius: 20 }}>
                    {selectedEmployees.length} selected
                  </span>
                )}
              </div>

              <div style={{ maxHeight: 280, overflowY: "auto" }}>
                {!selectedCompany ? (
                  <Empty text="Select a company first." />
                ) : !selectedLeader ? (
                  <Empty text="Select a team leader first." />
                ) : teamMembers.length === 0 ? (
                  <Empty text="No other employees in this company." />
                ) : teamMembers.map((emp, idx) => {
                  const isChecked = selectedEmployees.includes(emp._id);
                  const ac = getAvatarColor(emp._id);
                  return (
                    <div
                      key={emp._id}
                      onClick={() => !submitting && handleEmployeeCheck(emp._id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 14px", cursor: "pointer",
                        borderBottom: idx < teamMembers.length - 1 ? "0.5px solid #e2e8f0" : "none",
                        background: isChecked ? "#E6F1FB14" : "transparent",
                        transition: "background .15s",
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: ac.bg, color: ac.text,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 500,
                      }}>
                        {getInitials(emp.fullName)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#0f172a" }}>{emp.fullName}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{emp.designation?.designation || "Employee"}</div>
                      </div>
                      <div style={{
                        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                        border: `1.5px solid ${isChecked ? "#185FA5" : "#cbd5e1"}`,
                        background: isChecked ? "#185FA5" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all .15s",
                      }}>
                        {isChecked && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Create button ── */}
          <button
            onClick={handleCreateTeam}
            disabled={submitting || loading || !selectedLeader || selectedEmployees.length === 0}
            style={{
              width: "100%", padding: "12px 0",
              borderRadius: 10, border: "none",
              background: (!selectedLeader || !selectedEmployees.length) ? "#f8fafc" : "#185FA5",
              color: (!selectedLeader || !selectedEmployees.length) ? "#94a3b8" : "#fff",
              fontSize: 14, fontWeight: 500, cursor: (!selectedLeader || !selectedEmployees.length) ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "background .2s, color .2s",
            }}
          >
            {submitting ? "Creating team…" : "Finalize & create team"}
          </button>

        </div>
      </div>
    </div>
  );
};

// ── Small helpers ──────────────────────────────────────────────

const selectStyle = {
  width: "100%", padding: "10px 36px 10px 14px",
  border: "0.5px solid #cbd5e1",
  borderRadius: 10, background: "#ffffff",
  color: "#0f172a", fontSize: 14,
  fontFamily: "inherit", appearance: "none", cursor: "pointer", outline: "none",
};

const SelectWrap = ({ children, disabled }) => (
  <div style={{ position: "relative", opacity: disabled ? 0.5 : 1 }}>{children}</div>
);

const Chevron = () => (
  <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
    width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const Label = ({ icon, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
    <span style={{ fontSize: 14 }}>{icon}</span>
    <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>
      {text}
    </span>
  </div>
);

const Empty = ({ text }) => (
  <div style={{ padding: "28px 0", textAlign: "center", fontSize: 13, color: "#94a3b8" }}>{text}</div>
);

export default CreateTeam;