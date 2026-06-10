import React, { useState, useEffect, useMemo } from "react";
import {
    X, Edit2, Eye, Plus, Search, Filter, Calendar, SlidersHorizontal,
    CheckCircle2, Clock, XCircle, ArrowLeftRight, Layers, Banknote,
    ArrowUpRight, TrendingUp, CreditCard, Wallet
} from "lucide-react";

const css = `
.ce-root * { box-sizing: border-box; margin: 0; padding: 0; }

.ce-stat-card {
  background: #fff; border: 1px solid #f0f0f0; border-radius: 20px;
  padding: 24px; position: relative; overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: default;
}
.ce-stat-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.07); }
.ce-stat-card::before {
  content: ''; position: absolute; width: 140px; height: 140px;
  border-radius: 50%; top: -40px; right: -40px; opacity: 0.5;
}
.ce-stat-card.blue::before { background: radial-gradient(circle, #dbeafe, transparent); }
.ce-stat-card.emerald::before { background: radial-gradient(circle, #d1fae5, transparent); }
.ce-stat-card.violet::before { background: radial-gradient(circle, #ede9fe, transparent); }
.ce-stat-card.amber::before { background: radial-gradient(circle, #fef3c7, transparent); }

.ce-tab {
  display: flex; flex-direction: column; align-items: flex-start;
  padding: 10px 16px; border-radius: 12px; border: 1.5px solid #f0f0f0;
  background: #fff; cursor: pointer; transition: all 0.18s ease;
  min-width: 100px; gap: 2px;
}
.ce-tab:hover { border-color: #d1d5db; background: #fafafa; }
.ce-tab.active-pending  { background: #fffbeb; border-color: #fcd34d; }
.ce-tab.active-clear    { background: #f0fdf4; border-color: #6ee7b7; }
.ce-tab.active-cancelled{ background: #fef2f2; border-color: #fca5a5; }
.ce-tab.active-shifted  { background: #eff6ff; border-color: #93c5fd; }
.ce-tab.active-all      { background: #111827; border-color: #111827; }

.ce-input {
  width: 100%; border: 1.5px solid #e5e7eb; border-radius: 12px;
  background: #fafafa; padding: 10px 14px; font-size: 14px;
  color: #111827; outline: none;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}
.ce-input:focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.ce-input::placeholder { color: #9ca3af; }
.ce-input:read-only { cursor: not-allowed; background: #f3f4f6; color: #6b7280; }

.ce-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: #111827; color: #fff; border: none; border-radius: 12px;
  padding: 11px 20px; font-size: 14px; font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease; letter-spacing: 0.01em;
}
.ce-btn-primary:hover { background: #1f2937; box-shadow: 0 4px 16px rgba(17,24,39,0.2); transform: translateY(-1px); }
.ce-btn-primary:active { transform: scale(0.98); }
.ce-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

.ce-btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  background: transparent; color: #374151; border: 1.5px solid #e5e7eb;
  border-radius: 10px; padding: 8px 16px; font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.15s ease;
}
.ce-btn-ghost:hover { background: #f9fafb; border-color: #d1d5db; }

.ce-label {
  display: block; font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.07em; color: #6b7280; margin-bottom: 6px;
}

.ce-modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.45); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
  animation: ceFadeIn 0.2s ease;
}
.ce-modal {
  background: #fff; border-radius: 24px; width: 100%; max-width: 560px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.18); animation: ceSlideUp 0.25s cubic-bezier(0.16,1,0.3,1);
  overflow: hidden; max-height: 92vh; overflow-y: auto;
}
.ce-modal-sm { max-width: 440px; }
.ce-modal-header {
  padding: 28px 28px 20px; border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(135deg, #f9fafb 0%, #fff 100%);
  position: sticky; top: 0; z-index: 1;
}
.ce-modal-body { padding: 24px 28px 28px; }

.ce-status-badge {
  display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px;
  border-radius: 99px; font-size: 11px; font-weight: 600;
  letter-spacing: 0.04em; text-transform: capitalize;
}
.ce-status-badge.pending   { background: #fffbeb; color: #92400e; border: 1px solid #fcd34d; }
.ce-status-badge.clear     { background: #f0fdf4; color: #14532d; border: 1px solid #86efac; }
.ce-status-badge.cancelled { background: #fef2f2; color: #7f1d1d; border: 1px solid #fca5a5; }
.ce-status-badge.shifted   { background: #eff6ff; color: #1e3a8a; border: 1px solid #93c5fd; }

.ce-icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 8px; border: none;
  cursor: pointer; transition: all 0.15s ease;
}
.ce-icon-btn.edit  { background: #eff6ff; color: #2563eb; }
.ce-icon-btn.edit:hover  { background: #dbeafe; }
.ce-icon-btn.view  { background: #f3f4f6; color: #374151; }
.ce-icon-btn.view:hover  { background: #e5e7eb; }

.ce-select {
  border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 5px 10px;
  font-size: 12px; font-weight: 500;
  color: #374151; background: #fafafa; outline: none; cursor: pointer;
  transition: border-color 0.15s;
}
.ce-select:focus { border-color: #6366f1; }

.ce-filter-pill {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  background: #fff; border: 1px solid #f0f0f0; border-radius: 14px;
  padding: 8px 14px; min-height: 44px;
}

.ce-date-range-container {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

@media (max-width: 480px) {
  .ce-date-range-container {
    flex-wrap: wrap;
  }
  .ce-date-range-container > div {
    flex: 1 1 100% !important;
    max-width: 100% !important;
  }
  .ce-date-range-container > span {
    display: none;
  }
}

.ce-date-chip {
  padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 500;
  cursor: pointer; transition: all 0.15s ease; border: none;
}
.ce-date-chip.active { background: #111827; color: #fff; }
.ce-date-chip.inactive { background: #f3f4f6; color: #374151; }
.ce-date-chip.inactive:hover { background: #e5e7eb; }

.ce-view-field { margin-bottom: 4px; }
.ce-view-field label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; display: block; margin-bottom: 3px; }
.ce-view-field .val { font-size: 14px; color: #111827; font-weight: 400; }

.ce-table tbody tr { transition: background 0.12s ease; }
.ce-table tbody tr:hover { background: #fafafa; }
.ce-amount-display { font-weight: 700; }

@keyframes ceFadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes ceSlideUp { from { opacity: 0; transform: translateY(16px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
@keyframes spin { to { transform: rotate(360deg) } }
`;

const STATUS_KEYS = ["clear", "shifted", "pending", "cancelled"];
const FILTER_OPTIONS = ["all", ...STATUS_KEYS];

const statusIcon = { pending: Clock, clear: CheckCircle2, cancelled: XCircle, shifted: ArrowLeftRight };
const statusColor = { pending: "amber", clear: "emerald", cancelled: "red", shifted: "blue", all: "dark" };

const StatCard = ({ color, icon: Icon, label, value, sub }) => {
    const colors = {
        blue: { icon: "#3b82f6", bg: "#eff6ff" },
        emerald: { icon: "#10b981", bg: "#f0fdf4" },
        violet: { icon: "#8b5cf6", bg: "#f5f3ff" },
        amber: { icon: "#f59e0b", bg: "#fffbeb" },
    };
    const c = colors[color] || colors.blue;
    return (
        <div className={`ce-stat-card ${color}`}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af" }}>{label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: c.bg, color: c.icon }}>
                    <Icon size={17} />
                </div>
            </div>
            <div className="ce-amount-display" style={{ fontSize: 28, color: "#111827", lineHeight: 1.1 }}>{value}</div>
            {sub && <div style={{ marginTop: 10, fontSize: 12, color: c.icon, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                <ArrowUpRight size={13} />{sub}
            </div>}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const s = (status || "pending").toLowerCase();
    return <span className={`ce-status-badge ${s}`}>{s}</span>;
};

const parseAmount = (amt) => {
    if (amt == null) return 0;
    return Number(amt.toString().replace(/,/g, "").replace(/₹/g, "").trim()) || 0;
};

const formatINR = (val) => `₹${new Intl.NumberFormat("en-IN").format(val)}`;

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function ChequeExpense() {
    const [selectedTab, setSelectedTab] = useState("pending");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [chequePresentFilter, setChequePresentFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cheques, setCheques] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [viewCheque, setViewCheque] = useState(null);
    const [duplicateError, setDuplicateError] = useState("");
    const [statusModal, setStatusModal] = useState({ open: false, type: null, chequeId: null, reason: "", clearDate: "", shiftRemark: "" });
    const [formData, setFormData] = useState({
        issuedDate: "", chequePresentDate: new Date().toISOString().split("T")[0],
        toWhom: "", amount: "", chequeNumber: "", reason: "",
        entryDate: new Date().toISOString().split("T")[0],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 40;

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTab, searchTerm, startDate, endDate, chequePresentFilter]);

    const fetchCheques = async () => {
        try { setLoading(true); const r = await fetch(`${import.meta.env.VITE_API_URL}/cheque/get`); const d = await r.json(); setCheques(d); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    };
    useEffect(() => { fetchCheques(); }, []);
    useEffect(() => { const t = setTimeout(() => setDebouncedSearch(searchTerm.trim().toLowerCase()), 300); return () => clearTimeout(t); }, [searchTerm]);

    const todayStr = new Date().toISOString().split("T")[0];

    const totalsByStatus = useMemo(() => {
        const map = {}; STATUS_KEYS.forEach(s => { map[s] = { count: 0, total: 0 }; });
        cheques.forEach(c => { const s = (c.status || "pending").toLowerCase(); if (!map[s]) map[s] = { count: 0, total: 0 }; map[s].count++; map[s].total += parseAmount(c.chequeAmount); });
        return map;
    }, [cheques]);

    const allTotal = useMemo(() => cheques.reduce((a, c) => a + parseAmount(c.chequeAmount), 0), [cheques]);

    const todayTotal = useMemo(() => cheques.reduce((a, c) => c.entryDate === todayStr ? a + parseAmount(c.chequeAmount) : a, 0), [cheques]);

    const monthlyTotal = useMemo(() => {
        const now = new Date(); const m = now.getMonth(), y = now.getFullYear();
        return cheques.reduce((a, c) => { const d = new Date(c.entryDate); return d.getMonth() === m && d.getFullYear() === y ? a + parseAmount(c.chequeAmount) : a; }, 0);
    }, [cheques]);

    const filtered = useMemo(() => {
        let r = selectedTab === "all" ? cheques : cheques.filter(c => (c.status || "pending").toLowerCase() === selectedTab);
        if (debouncedSearch) r = r.filter(c => (c.receiverName || "").toLowerCase().includes(debouncedSearch) || (c.chequeNumber || "").toLowerCase().includes(debouncedSearch));
        if (startDate || endDate) r = r.filter(c => { try { const d = new Date(c.entryDate); if (startDate && d < new Date(startDate)) return false; if (endDate) { const e = new Date(endDate); e.setHours(23, 59, 59); if (d > e) return false; } return true; } catch { return false; } });
        if (chequePresentFilter && chequePresentFilter !== "all") {
            const base = new Date(); base.setHours(0, 0, 0, 0);
            let start = new Date(base), end = new Date(base);
            if (chequePresentFilter === "tomorrow") { start.setDate(start.getDate() + 1); end.setDate(end.getDate() + 1); }
            else { const days = Number(chequePresentFilter); if (!isNaN(days)) end.setDate(end.getDate() + days - 1); }
            r = r.filter(c => { if (!c.chequePresentDate) return false; try { const d = new Date(c.chequePresentDate); d.setHours(0, 0, 0, 0); return d >= start && d <= end; } catch { return false; } });
        }
        return r;
    }, [cheques, selectedTab, debouncedSearch, startDate, endDate, chequePresentFilter]);

    const filteredTotal = useMemo(() => filtered.reduce((a, c) => a + parseAmount(c.chequeAmount), 0), [filtered]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedCheques = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            if (currentPage <= 2) {
                end = 4;
            }
            if (currentPage >= totalPages - 1) {
                start = totalPages - 3;
            }
            if (start > 2) {
                pages.push("...");
            }
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (end < totalPages - 1) {
                pages.push("...");
            }
            pages.push(totalPages);
        }
        return pages;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
        if (name === "chequeNumber" && value.trim()) {
            const dup = cheques.some(c => c.chequeNumber?.toString().trim().toLowerCase() === value.trim().toLowerCase() && c._id !== editingId);
            setDuplicateError(dup ? "Duplicate cheque number" : "");
        } else if (name === "chequeNumber") setDuplicateError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = { chequeIssuedDate: formData.issuedDate, chequePresentDate: formData.chequePresentDate, receiverName: formData.toWhom, chequeNumber: formData.chequeNumber, chequeAmount: formData.amount, reasonToIssue: formData.reason };
        if (!editingId) body.entryDate = todayStr;
        try {
            const url = editingId ? `${import.meta.env.VITE_API_URL}/cheque/${editingId}` : `${import.meta.env.VITE_API_URL}/cheque`;
            const res = await fetch(url, { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const data = await res.json().catch(() => null);
            if (!res.ok) { if (data?.message?.toLowerCase().includes("duplicate")) return alert(data.message); throw new Error(data?.message); }
            setShowModal(false); setEditingId(null); setDuplicateError("");
            setFormData({ issuedDate: "", chequePresentDate: todayStr, toWhom: "", amount: "", chequeNumber: "", reason: "", entryDate: todayStr });
            fetchCheques();
        } catch (e) { alert("Error saving cheque. Please try again."); }
    };

    const openEditModal = (c) => {
        setEditingId(c._id);
        setFormData({ issuedDate: new Date(c.chequeIssuedDate).toISOString().split("T")[0], chequePresentDate: c.chequePresentDate ? new Date(c.chequePresentDate).toISOString().split("T")[0] : todayStr, toWhom: c.receiverName || "", amount: c.chequeAmount || "", chequeNumber: c.chequeNumber || "", reason: c.reasonToIssue || "", entryDate: c.entryDate || todayStr });
        setShowModal(true);
    };

    const updateStatus = async (id, payload) => {
        try { const res = await fetch(`${import.meta.env.VITE_API_URL}/cheque/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); if (!res.ok) throw new Error(); await fetchCheques(); }
        catch { alert("Unable to update status."); fetchCheques(); }
    };

    const handleStatusSelection = (cheque, newStatus) => {
        const curr = (cheque.status || "pending").toLowerCase();
        if (curr === newStatus) return;
        if (newStatus === "cancelled") setStatusModal({ open: true, type: "cancelled", chequeId: cheque._id, reason: "", clearDate: "", shiftRemark: "" });
        else if (newStatus === "clear") setStatusModal({ open: true, type: "clear", chequeId: cheque._id, reason: "", clearDate: todayStr, shiftRemark: "" });
        else if (newStatus === "shifted") setStatusModal({ open: true, type: "shifted", chequeId: cheque._id, reason: "", clearDate: "", shiftRemark: "" });
        else updateStatus(cheque._id, { status: newStatus });
    };

    const closeStatusModal = async () => { setStatusModal({ open: false, type: null, chequeId: null, reason: "", clearDate: "", shiftRemark: "" }); await fetchCheques(); };

    const confirmStatus = async () => {
        const { chequeId, type, reason, clearDate, shiftRemark } = statusModal;
        if (type === "cancelled") { if (!reason.trim()) return alert("Please provide a cancellation reason."); await updateStatus(chequeId, { status: "cancelled", cancelReason: reason.trim() }); }
        else if (type === "clear") { if (!clearDate) return alert("Please select the cleared date."); await updateStatus(chequeId, { status: "clear", clearedDate: clearDate }); }
        else if (type === "shifted") { if (!shiftRemark?.trim()) return alert("Please provide a shift reason."); await updateStatus(chequeId, { status: "shifted", shiftRemark: shiftRemark.trim() }); }
        closeStatusModal();
    };

    const statusModalDisabled = (statusModal.type === "cancelled" && !statusModal.reason.trim()) || (statusModal.type === "clear" && !statusModal.clearDate) || (statusModal.type === "shifted" && !statusModal.shiftRemark?.trim());

    const quickFilters = [{ key: "all", label: "All" }, { key: "today", label: "Today" }, { key: "tomorrow", label: "Tomorrow" }, { key: "3", label: "3 days" }, { key: "7", label: "7 days" }, { key: "14", label: "14 days" }];

    const tabLabelColor = { all: "#fff", pending: "#92400e", clear: "#14532d", cancelled: "#7f1d1d", shifted: "#1e3a8a" };
    const tabSubColor = { all: "rgba(255,255,255,0.7)", pending: "#b45309", clear: "#166534", cancelled: "#991b1b", shifted: "#1d4ed8" };

    return (
        <div className="ce-root" style={{ minHeight: "100vh", background: "#f8f9fb", padding: "32px 24px" }}>
            <style>{css}</style>

            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
                            <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280" }}>Finance</span>
                        </div>
                        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.15 }}>Cheque Tracker</h1>
                        <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 6, fontWeight: 300 }}>Track, manage and monitor all cheque-based expenditures</p>
                    </div>
                    <button className="ce-btn-primary" onClick={() => { setEditingId(null); setShowModal(true); }}>
                        <Plus size={16} strokeWidth={2.5} />
                        Add Cheque
                    </button>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                    <StatCard color="blue" icon={TrendingUp} label="Today" value={formatINR(todayTotal)} sub="Today's entries" />
                    <StatCard color="emerald" icon={Calendar} label="This Month" value={formatINR(monthlyTotal)} sub="Monthly total" />
                    <StatCard color="violet" icon={Wallet} label="All Time" value={formatINR(allTotal)} sub="Lifetime tracked" />
                    <StatCard color="amber" icon={CreditCard} label="Records" value={cheques.length.toLocaleString()} sub="Total cheques" />
                </div>

                {/* Status Tabs */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                    {FILTER_OPTIONS.map(s => {
                        const isActive = selectedTab === s;
                        const count = s === "all" ? cheques.length : (totalsByStatus[s]?.count || 0);
                        const total = s === "all" ? allTotal : (totalsByStatus[s]?.total || 0);
                        const Icon = statusIcon[s] || Layers;
                        return (
                            <button key={s} className={`ce-tab ${isActive ? `active-${s}` : ""}`} onClick={() => setSelectedTab(s)}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <Icon size={13} color={isActive ? (s === "all" ? "#fff" : tabLabelColor[s]) : "#9ca3af"} />
                                    <span style={{ fontSize: 12, fontWeight: 600, textTransform: "capitalize", color: isActive ? (s === "all" ? "#fff" : tabLabelColor[s]) : "#374151" }}>{s}</span>
                                </div>
                                <span style={{ fontSize: 12, color: isActive ? (s === "all" ? "rgba(255,255,255,0.75)" : tabSubColor[s]) : "#9ca3af", fontWeight: 700 }}>
                                    {count} · {formatINR(total)}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Filters */}
                <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 18, padding: 20, marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <SlidersHorizontal size={15} color="#6b7280" />
                        <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af" }}>Filters</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "stretch" }}>
                        {/* Search */}
                        <div style={{ position: "relative", flex: "1 1 240px" }}>
                            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                            <input type="text" placeholder="Search name or cheque number…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="ce-input" style={{ paddingLeft: 36, height: "44px" }} />
                            {searchTerm && <button onClick={() => setSearchTerm("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9ca3af", cursor: "pointer", display: "flex" }}><X size={14} /></button>}
                        </div>
                        {/* Date range */}
                        <div className="ce-filter-pill" style={{ flex: "1 1 340px", minWidth: "320px" }}>
                            <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af", whiteSpace: "nowrap" }}>Entry Date</span>
                            <div className="ce-date-range-container">
                                <div style={{ position: "relative", flex: "1 1 110px", minWidth: "100px", maxWidth: "140px" }}>
                                    <Calendar size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="ce-input" style={{ paddingLeft: 30, fontSize: 13, height: "30px", paddingTop: 0, paddingBottom: 0 }} />
                                </div>
                                <span style={{ fontSize: 12, color: "#9ca3af" }}>–</span>
                                <div style={{ position: "relative", flex: "1 1 110px", minWidth: "100px", maxWidth: "140px" }}>
                                    <Calendar size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="ce-input" style={{ paddingLeft: 30, fontSize: 13, height: "30px", paddingTop: 0, paddingBottom: 0 }} />
                                </div>
                            </div>
                        </div>
                        {/* Quick present date */}
                        <div className="ce-filter-pill" style={{ flex: "1 1 360px", minWidth: "320px" }}>
                            <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af", whiteSpace: "nowrap" }}>Present Date</span>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1 }}>
                                {quickFilters.map(opt => (
                                    <button key={opt.key} className={`ce-date-chip ${chequePresentFilter === opt.key ? "active" : "inactive"}`} onClick={() => setChequePresentFilter(opt.key)}>{opt.label}</button>
                                ))}
                            </div>
                        </div>
                        {(searchTerm || startDate || endDate || chequePresentFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStartDate("");
                                    setEndDate("");
                                    setChequePresentFilter("all");
                                }}
                                className="ce-btn-ghost"
                                style={{
                                    height: "44px",
                                    padding: "0 16px",
                                    color: "#ef4444",
                                    borderColor: "#fca5a5",
                                    background: "#fef2f2",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6
                                }}
                            >
                                <X size={14} /> Clear Filters
                            </button>
                        )}
                    </div>
                    {filtered.length > 0 && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f3f4f6", display: "flex", gap: 16, fontSize: 13, color: "#6b7280" }}>
                            <span><b style={{ color: "#111827" }}>{filtered.length}</b> records</span>
                            <span><b style={{ color: "#111827" }}>{formatINR(filteredTotal)}</b> total</span>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0", overflow: "hidden" }}>
                    <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Cheques</span>
                        {filtered.length > 0 && <span style={{ fontSize: 12, background: "#f3f4f6", color: "#6b7280", padding: "2px 8px", borderRadius: 99, fontWeight: 500 }}>{filtered.length}</span>}
                    </div>
                    <div className="hidden md:block" style={{ overflowX: "auto" }}>
                        {loading ? (
                            <div style={{ padding: "60px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 32, height: 32, border: "2.5px solid #e5e7eb", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                                <span style={{ fontSize: 13, color: "#9ca3af" }}>Loading cheques…</span>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ padding: "64px 24px", textAlign: "center" }}>
                                <div style={{ width: 52, height: 52, borderRadius: 16, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                    <CreditCard size={24} color="#d1d5db" />
                                </div>
                                <p style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No cheques found</p>
                                <p style={{ fontSize: 13, color: "#9ca3af" }}>Try adjusting your filters or add a new cheque.</p>
                            </div>
                        ) : (
                            <table className="ce-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                                        {["Entry Date", "Cheque No.", "Receiver", "Amount", "Issued", "Present", "Reason", "Shift Note", "Status", "Actions"].map((h, i) => (
                                            <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af", textAlign: "left", background: "#fafafa", whiteSpace: "nowrap" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCheques.map((c, idx) => (
                                        <tr key={c._id} style={{ borderBottom: idx < paginatedCheques.length - 1 ? "1px solid #f9fafb" : "none" }}>
                                            {/* Entry Date – indigo */}
                                            <td style={{ padding: "14px 16px", fontSize: 13, color: "#6366f1", whiteSpace: "nowrap", fontWeight: 500 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#c7d2fe", flexShrink: 0 }} />
                                                    {c.entryDate || "—"}
                                                </div>
                                            </td>
                                            {/* Cheque No – dark bold */}
                                            <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                                                <span style={{ fontWeight: 700, fontSize: 13, color: "#111827", letterSpacing: "0.03em", background: "#f3f4f6", padding: "3px 8px", borderRadius: 6 }}>{c.chequeNumber || "—"}</span>
                                            </td>
                                            {/* Receiver – deep navy */}
                                            <td style={{ padding: "14px 16px", fontSize: 14, color: "#1e3a8a", fontWeight: 600, whiteSpace: "nowrap", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}>{c.receiverName || "—"}</td>
                                            {/* Amount – emerald */}
                                            <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                                                <span className="ce-amount-display" style={{ fontSize: 14, color: "#059669", fontWeight: 700 }}>{formatINR(parseAmount(c.chequeAmount))}</span>
                                            </td>
                                            {/* Issued Date – slate blue */}
                                            <td style={{ padding: "14px 16px", fontSize: 13, color: "#0369a1", fontWeight: 500, whiteSpace: "nowrap" }}>{fmtDate(c.chequeIssuedDate)}</td>
                                            {/* Present Date – violet */}
                                            <td style={{ padding: "14px 16px", fontSize: 13, color: "#7c3aed", fontWeight: 500, whiteSpace: "nowrap" }}>{fmtDate(c.chequePresentDate)}</td>
                                            {/* Reason – amber */}
                                            <td style={{ padding: "14px 16px", fontSize: 13, color: "#b45309", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.reasonToIssue || "—"}</td>
                                            {/* Shift Note – blue-gray */}
                                            <td style={{ padding: "14px 16px", fontSize: 13, color: "#1d4ed8", fontStyle: c.shiftRemark ? "normal" : "italic", whiteSpace: "nowrap" }}>{c.shiftRemark || <span style={{ color: "#d1d5db" }}>—</span>}</td>
                                            <td style={{ padding: "14px 16px" }}><StatusBadge status={c.status} /></td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                    <button className="ce-icon-btn edit" onClick={() => openEditModal(c)} title="Edit"><Edit2 size={14} /></button>
                                                    <button className="ce-icon-btn view" onClick={() => setViewCheque(c)} title="View"><Eye size={14} /></button>
                                                    <select value={c.status || "pending"} onChange={e => handleStatusSelection(c, e.target.value)} className="ce-select">
                                                        {STATUS_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Mobile View */}
                    <div className="block md:hidden">
                        {loading ? (
                            <div style={{ padding: "60px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 32, height: 32, border: "2.5px solid #e5e7eb", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                                <span style={{ fontSize: 13, color: "#9ca3af" }}>Loading cheques…</span>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ padding: "64px 24px", textAlign: "center" }}>
                                <div style={{ width: 52, height: 52, borderRadius: 16, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                    <CreditCard size={24} color="#d1d5db" />
                                </div>
                                <p style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No cheques found</p>
                                <p style={{ fontSize: 13, color: "#9ca3af" }}>Try adjusting your filters or add a new cheque.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16 }}>
                                {paginatedCheques.map((c) => (
                                    <div key={c._id} style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 16, padding: 16, boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                            <div>
                                                <h4 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{c.receiverName || "—"}</h4>
                                                <span style={{ fontWeight: 700, fontSize: 12, color: "#111827", letterSpacing: "0.03em", background: "#f3f4f6", padding: "3px 8px", borderRadius: 6 }}>{c.chequeNumber || "—"}</span>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                                                <span className="ce-amount-display" style={{ fontSize: 16, color: "#059669", fontWeight: 700 }}>{formatINR(parseAmount(c.chequeAmount))}</span>
                                                <StatusBadge status={c.status} />
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12, fontSize: 12 }}>
                                            <div>
                                                <span style={{ color: "#9ca3af", fontWeight: 600, display: "block", marginBottom: 2, fontSize: 10, textTransform: "uppercase" }}>Issued</span>
                                                <span style={{ color: "#374151", fontWeight: 500 }}>{fmtDate(c.chequeIssuedDate)}</span>
                                            </div>
                                            <div>
                                                <span style={{ color: "#9ca3af", fontWeight: 600, display: "block", marginBottom: 2, fontSize: 10, textTransform: "uppercase" }}>Present</span>
                                                <span style={{ color: "#374151", fontWeight: 500 }}>{fmtDate(c.chequePresentDate)}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
                                            <select value={c.status || "pending"} onChange={e => handleStatusSelection(c, e.target.value)} className="ce-select" style={{ padding: "4px 8px", fontSize: 11 }}>
                                                {STATUS_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <button className="ce-icon-btn edit" onClick={() => openEditModal(c)} title="Edit"><Edit2 size={14} /></button>
                                                <button className="ce-icon-btn view" onClick={() => setViewCheque(c)} title="View"><Eye size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {filtered.length > 0 && totalPages > 1 && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderTop: "1px solid #f3f4f6", background: "#fafafa", flexWrap: "wrap", gap: 12 }}>
                            <span style={{ fontSize: 13, color: "#6b7280" }}>
                                Showing <span style={{ fontWeight: 600 }}>{((currentPage - 1) * itemsPerPage) + 1}</span> to <span style={{ fontWeight: 600 }}>{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span style={{ fontWeight: 600 }}>{filtered.length}</span> cheques
                            </span>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <button 
                                    type="button"
                                    className="ce-btn-ghost" 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                    disabled={currentPage === 1}
                                    style={{ padding: "6px 12px", fontSize: 12 }}
                                >
                                    Previous
                                </button>
                                {renderPageNumbers().map((page, index) => {
                                    if (page === "...") {
                                        return <span key={`dots-${index}`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, fontSize: 12, color: "#9ca3af" }}>...</span>;
                                    }
                                    return (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className={currentPage === page ? "ce-btn-primary" : "ce-btn-ghost"}
                                            style={{ 
                                                width: 32, 
                                                height: 32, 
                                                padding: 0, 
                                                justifyContent: "center", 
                                                fontSize: 12,
                                                background: currentPage === page ? "#111827" : "transparent",
                                                color: currentPage === page ? "#fff" : "#374151",
                                                border: currentPage === page ? "1px solid #111827" : "1px solid #e5e7eb"
                                            }}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button 
                                    type="button"
                                    className="ce-btn-ghost" 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                    disabled={currentPage === totalPages}
                                    style={{ padding: "6px 12px", fontSize: 12 }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="ce-modal-overlay" onClick={() => { setShowModal(false); setEditingId(null); }}>
                    <div className="ce-modal" onClick={e => e.stopPropagation()}>
                        <div className="ce-modal-header">
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Banknote size={16} color="#fff" />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>{editingId ? "Edit Cheque" : "Record Cheque"}</h2>
                                        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>{editingId ? "Update cheque details" : "Add a new cheque entry"}</p>
                                    </div>
                                </div>
                                <button onClick={() => { setShowModal(false); setEditingId(null); }} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#9ca3af" }}><X size={18} /></button>
                            </div>
                        </div>
                        <div className="ce-modal-body">
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label className="ce-label">Entry Date</label>
                                        <input type="date" name="entryDate" value={formData.entryDate} readOnly className="ce-input" />
                                    </div>
                                    <div>
                                        <label className="ce-label">Issued Date</label>
                                        <input type="date" name="issuedDate" value={formData.issuedDate} onChange={handleChange} required className="ce-input" />
                                    </div>
                                    <div>
                                        <label className="ce-label">Present Date</label>
                                        <input type="date" name="chequePresentDate" value={formData.chequePresentDate} onChange={handleChange} className="ce-input" />
                                    </div>
                                    <div>
                                        <label className="ce-label">To Whom Issued</label>
                                        <input type="text" name="toWhom" value={formData.toWhom} onChange={handleChange} placeholder="Receiver name" required className="ce-input" />
                                    </div>
                                    <div>
                                        <label className="ce-label">Cheque Number</label>
                                        <input type="text" name="chequeNumber" value={formData.chequeNumber} onChange={handleChange} placeholder="Enter cheque number" required className="ce-input" style={duplicateError ? { borderColor: "#ef4444" } : {}} />
                                        {duplicateError && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{duplicateError}</p>}
                                    </div>
                                    <div>
                                        <label className="ce-label">Amount (₹)</label>
                                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="0" required className="ce-input" />
                                    </div>
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <label className="ce-label">Reason to Issue</label>
                                        <textarea name="reason" value={formData.reason} onChange={handleChange} placeholder="Why is this cheque being issued?" required rows={3} className="ce-input" style={{ resize: "none", lineHeight: 1.6 }} />
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24, paddingTop: 20, borderTop: "1px solid #f3f4f6" }}>
                                    <button type="button" className="ce-btn-ghost" onClick={() => { setShowModal(false); setEditingId(null); setDuplicateError(""); }}>Cancel</button>
                                    <button type="submit" className="ce-btn-primary" disabled={!!duplicateError} style={{ minWidth: 140, justifyContent: "center" }}>
                                        {editingId ? "Update Cheque" : "Add Cheque"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Modal */}
            {statusModal.open && (
                <div className="ce-modal-overlay" onClick={closeStatusModal}>
                    <div className="ce-modal ce-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="ce-modal-header">
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: statusModal.type === "cancelled" ? "#fef2f2" : statusModal.type === "clear" ? "#f0fdf4" : "#eff6ff" }}>
                                        {statusModal.type === "cancelled" ? <XCircle size={16} color="#ef4444" /> : statusModal.type === "clear" ? <CheckCircle2 size={16} color="#10b981" /> : <ArrowLeftRight size={16} color="#3b82f6" />}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>
                                            {statusModal.type === "cancelled" ? "Cancel Cheque" : statusModal.type === "clear" ? "Clear Cheque" : "Shift Cheque"}
                                        </h2>
                                        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>Provide required details to proceed</p>
                                    </div>
                                </div>
                                <button onClick={closeStatusModal} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#9ca3af" }}><X size={18} /></button>
                            </div>
                        </div>
                        <div className="ce-modal-body">
                            {statusModal.type === "cancelled" && (
                                <div>
                                    <label className="ce-label">Cancellation Reason</label>
                                    <textarea rows={4} value={statusModal.reason} onChange={e => setStatusModal(s => ({ ...s, reason: e.target.value }))} className="ce-input" style={{ resize: "none", lineHeight: 1.6 }} placeholder="Why is this cheque being cancelled?" />
                                </div>
                            )}
                            {statusModal.type === "clear" && (
                                <div>
                                    <label className="ce-label">Cleared Date</label>
                                    <input type="date" value={statusModal.clearDate} onChange={e => setStatusModal(s => ({ ...s, clearDate: e.target.value }))} className="ce-input" />
                                </div>
                            )}
                            {statusModal.type === "shifted" && (
                                <div>
                                    <label className="ce-label">Shift Reason</label>
                                    <textarea rows={3} value={statusModal.shiftRemark} onChange={e => setStatusModal(s => ({ ...s, shiftRemark: e.target.value }))} className="ce-input" style={{ resize: "none", lineHeight: 1.6 }} placeholder="Why is this cheque being shifted?" />
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f3f4f6" }}>
                                <button type="button" className="ce-btn-ghost" onClick={closeStatusModal}>Cancel</button>
                                <button type="button" className="ce-btn-primary" disabled={statusModalDisabled} onClick={confirmStatus} style={{ minWidth: 100, justifyContent: "center" }}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {viewCheque && (
                <div className="ce-modal-overlay" onClick={() => setViewCheque(null)}>
                    <div className="ce-modal" onClick={e => e.stopPropagation()}>
                        <div className="ce-modal-header">
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Eye size={16} color="#374151" />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>Cheque Details</h2>
                                        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>Cheque #{viewCheque.chequeNumber || "—"}</p>
                                    </div>
                                </div>
                                <button onClick={() => setViewCheque(null)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#9ca3af" }}><X size={18} /></button>
                            </div>
                        </div>
                        <div className="ce-modal-body">
                            {/* Amount hero */}
                            <div style={{ background: "#f9fafb", borderRadius: 14, padding: "20px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af", marginBottom: 4 }}>Amount</div>
                                    <div className="ce-amount-display" style={{ fontSize: 28, color: "#111827" }}>{formatINR(parseAmount(viewCheque.chequeAmount))}</div>
                                </div>
                                <StatusBadge status={viewCheque.status} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
                                {[
                                    { label: "Entry Date", val: viewCheque.entryDate || "—" },
                                    { label: "Issued Date", val: fmtDate(viewCheque.chequeIssuedDate) },
                                    { label: "Present Date", val: fmtDate(viewCheque.chequePresentDate) },
                                    { label: "Receiver", val: viewCheque.receiverName || "—" },
                                    { label: "Cheque Number", val: viewCheque.chequeNumber || "—" },
                                    ...(viewCheque.clearedDate ? [{ label: "Cleared Date", val: fmtDate(viewCheque.clearedDate) }] : []),
                                ].map(({ label, val }) => (
                                    <div key={label} className="ce-view-field">
                                        <label>{label}</label>
                                        <div className="val">{val}</div>
                                    </div>
                                ))}
                            </div>
                            {viewCheque.reasonToIssue && (
                                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f3f4f6" }}>
                                    <div className="ce-view-field"><label>Reason to Issue</label><div className="val" style={{ lineHeight: 1.6 }}>{viewCheque.reasonToIssue}</div></div>
                                </div>
                            )}
                            {(viewCheque.shiftRemark || viewCheque.cancelReason) && (
                                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f3f4f6", display: "flex", flexDirection: "column", gap: 12 }}>
                                    {viewCheque.shiftRemark && <div className="ce-view-field"><label>Shift Note</label><div className="val">{viewCheque.shiftRemark}</div></div>}
                                    {viewCheque.cancelReason && <div className="ce-view-field"><label>Cancellation Reason</label><div className="val" style={{ color: "#b91c1c" }}>{viewCheque.cancelReason}</div></div>}
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24, paddingTop: 16, borderTop: "1px solid #f3f4f6" }}>
                                <button className="ce-btn-ghost" onClick={() => { setViewCheque(null); openEditModal(viewCheque); }}><Edit2 size={13} /> Edit</button>
                                <button className="ce-btn-primary" onClick={() => setViewCheque(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}