import React, { useState, useEffect } from "react";
import {
    X, Plus, Eye, DollarSign, Calendar, CreditCard, Search,
    FileText, Filter, TrendingUp, ArrowUpRight, Loader2, FileCheck,
    ReceiptText, Banknote, ChevronDown, SlidersHorizontal, Wallet
} from "lucide-react";

const styleSheet = `
  .de-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .de-stat-card {
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 20px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: default;
  }
  .de-stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.07);
  }
  .de-stat-card::before {
    content: '';
    position: absolute;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    top: -40px;
    right: -40px;
    opacity: 0.5;
  }
  .de-stat-card.blue::before { background: radial-gradient(circle, #dbeafe, transparent); }
  .de-stat-card.emerald::before { background: radial-gradient(circle, #d1fae5, transparent); }
  .de-stat-card.violet::before { background: radial-gradient(circle, #ede9fe, transparent); }
  .de-stat-card.amber::before { background: radial-gradient(circle, #fef3c7, transparent); }

  .de-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .de-badge.cash { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
  .de-badge.upi  { background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; }
  .de-badge.card { background: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; }
  .de-badge.bank { background: #ecfeff; color: #0e7490; border: 1px solid #a5f3fc; }
  .de-badge.other{ background: #f9fafb; color: #374151; border: 1px solid #e5e7eb; }

  .de-table tbody tr {
    transition: background 0.15s ease;
  }
  .de-table tbody tr:hover {
    background: #fafafa;
  }

  .de-input {
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    background: #fafafa;
    padding: 10px 14px;
    font-size: 14px;
    color: #111827;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  }
  .de-input:focus {
    border-color: #6366f1;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .de-input::placeholder { color: #9ca3af; }

  .de-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #111827;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 11px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.01em;
  }
  .de-btn-primary:hover { background: #1f2937; box-shadow: 0 4px 16px rgba(17,24,39,0.2); transform: translateY(-1px); }
  .de-btn-primary:active { transform: scale(0.98); }

  .de-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    color: #374151;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .de-btn-ghost:hover { background: #f9fafb; border-color: #d1d5db; }

  .de-modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 16px;
    animation: fadeIn 0.2s ease;
  }
  .de-modal {
    background: #fff;
    border-radius: 24px;
    width: 100%;
    max-width: 520px;
    padding: 0;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18);
    animation: slideUp 0.25s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
  }
  .de-modal-header {
    padding: 28px 28px 20px;
    border-bottom: 1px solid #f3f4f6;
    background: linear-gradient(135deg, #f9fafb 0%, #fff 100%);
  }
  .de-modal-body { padding: 24px 28px 28px; }

  .de-lightbox-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; padding: 16px;
    animation: fadeIn 0.2s ease;
  }

  .de-view-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 8px;
    font-size: 12px; font-weight: 500; cursor: pointer;
    background: #eff6ff; color: #2563eb;
    border: 1px solid #bfdbfe;
    transition: all 0.15s ease;
  }
  .de-view-btn:hover { background: #dbeafe; border-color: #93c5fd; }

  .de-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #6b7280;
    margin-bottom: 6px;
  }

  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }

  .de-empty-state { padding: 64px 24px; text-align: center; }

  .de-filter-section {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 18px;
    padding: 20px;
    margin-bottom: 24px;
  }

  .de-file-label {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%;
    border: 1.5px dashed #d1d5db;
    border-radius: 12px;
    background: #fafafa;
    padding: 10px 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    color: #6b7280;
  }
  .de-file-label:hover { border-color: #6366f1; background: #f5f3ff; }
  .de-file-label.has-file { border-style: solid; border-color: #10b981; background: #f0fdf4; color: #047857; }

  .de-amount-display {
    font-weight: 700;
  }
`;

const PaymentBadge = ({ method }) => {
    const m = method?.toLowerCase() || "";
    let cls = "other", label = method || "Unknown";
    if (m === "cash") cls = "cash";
    else if (m === "upi") cls = "upi";
    else if (m === "card") cls = "card";
    else if (m === "bank transfer") cls = "bank";
    return <span className={`de-badge ${cls}`}>{label}</span>;
};

const StatCard = ({ color, icon: Icon, label, value, sub }) => (
    <div className={`de-stat-card ${color}`}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af" }}>{label}</span>
            <div style={{
                width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                background: color === "blue" ? "#eff6ff" : color === "emerald" ? "#f0fdf4" : color === "violet" ? "#f5f3ff" : "#fffbeb",
                color: color === "blue" ? "#3b82f6" : color === "emerald" ? "#10b981" : color === "violet" ? "#8b5cf6" : "#f59e0b"
            }}>
                <Icon size={17} />
            </div>
        </div>
        <div className="de-amount-display" style={{ fontSize: 28, color: "#111827", lineHeight: 1.1 }}>{value}</div>
        <div style={{ marginTop: 10, fontSize: 12, display: "flex", alignItems: "center", gap: 4,
            color: color === "blue" ? "#3b82f6" : color === "emerald" ? "#10b981" : color === "violet" ? "#8b5cf6" : "#f59e0b"
        }}>
            <ArrowUpRight size={13} />
            <span style={{ fontWeight: 500 }}>{sub}</span>
        </div>
    </div>
);

const DailyExpense = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: "", reason: "", paymentMethod: "",
        date: new Date().toISOString().split("T")[0], bill: null,
    });
    const [expenses, setExpenses] = useState([]);
    const [viewBillUrl, setViewBillUrl] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [methodFilter, setMethodFilter] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 40;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, methodFilter, startDate, endDate]);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/expense/all`);
            const data = await response.json();
            if (response.ok) setExpenses(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchExpenses(); }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === "bill" ? files[0] : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append("AmountPaid", formData.amount);
            data.append("reason", formData.reason);
            data.append("PaymentMethod", formData.paymentMethod);
            data.append("date", formData.date);
            if (formData.bill) data.append("bill", formData.bill);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/expense`, { method: "POST", body: data });
            const result = await response.json();
            if (response.ok) {
                setShowModal(false);
                setFormData({ amount: "", reason: "", paymentMethod: "", date: new Date().toISOString().split("T")[0], bill: null });
                fetchExpenses();
            } else alert("Error: " + (result.message || "Failed to submit expense"));
        } catch (e) { alert("An error occurred. Please try again."); }
        finally { setLoading(false); }
    };

    const today = new Date();
    const todayExpense = expenses.reduce((acc, exp) => {
        if (!exp.date) return acc;
        const d = new Date(exp.date);
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
            ? acc + (Number(exp.AmountPaid) || 0) : acc;
    }, 0);
    const monthlyExpense = expenses.reduce((acc, exp) => {
        if (!exp.date) return acc;
        const d = new Date(exp.date);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
            ? acc + (Number(exp.AmountPaid) || 0) : acc;
    }, 0);
    const totalExpense = expenses.reduce((acc, exp) => acc + (Number(exp.AmountPaid) || 0), 0);

    const filteredExpenses = expenses.filter((exp) => {
        const matchesReason = exp.reason?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMethod = methodFilter === "All" || exp.PaymentMethod === methodFilter;
        let matchesDate = true;
        if (exp.date) {
            const ds = exp.date.split("T")[0];
            if (startDate && ds < startDate) matchesDate = false;
            if (endDate && ds > endDate) matchesDate = false;
        } else if (startDate || endDate) matchesDate = false;
        return matchesReason && matchesMethod && matchesDate;
    });

    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
    const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

    const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

    return (
        <div className="de-root" style={{ minHeight: "100vh", background: "#f8f9fb", padding: "32px 24px" }}>
            <style>{styleSheet}</style>

            {/* Header */}
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
                            <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280" }}>Finance</span>
                        </div>
                        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                            Expense Tracker
                        </h1>
                        <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 6, fontWeight: 300 }}>
                            Manage and monitor all company expenditures in one place
                        </p>
                    </div>
                    <button className="de-btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={16} strokeWidth={2.5} />
                        Record Expense
                    </button>
                </div>

                {/* Stats Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
                    <StatCard color="blue" icon={TrendingUp} label="Today" value={fmt(todayExpense)} sub="Current day spend" />
                    <StatCard color="emerald" icon={Calendar} label="This Month" value={fmt(monthlyExpense)} sub="Monthly total" />
                    <StatCard color="violet" icon={Wallet} label="All Time" value={fmt(totalExpense)} sub="Lifetime tracked" />
                    <StatCard color="amber" icon={CreditCard} label="Transactions" value={expenses.length.toLocaleString()} sub="Total records" />
                </div>

                {/* Filters */}
                <div className="de-filter-section">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <SlidersHorizontal size={15} color="#6b7280" />
                        <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af" }}>Filters</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                        <div style={{ position: "relative", flex: "2 1 200px" }}>
                            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                            <input
                                type="text" placeholder="Search by reason…" value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="de-input" style={{ paddingLeft: 36 }}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9ca3af", cursor: "pointer", display: "flex" }}><X size={14} /></button>
                            )}
                        </div>
                        <div style={{ position: "relative", flex: "1 1 140px" }}>
                            <Filter size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                            <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} className="de-input" style={{ paddingLeft: 34, appearance: "none", cursor: "pointer" }}>
                                <option value="All">All Methods</option>
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Card">Card</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>
                        <div style={{ position: "relative", flex: "1 1 140px" }}>
                            <Calendar size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="de-input" style={{ paddingLeft: 34 }} />
                        </div>
                        <div style={{ position: "relative", flex: "1 1 140px" }}>
                            <Calendar size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="de-input" style={{ paddingLeft: 34 }} />
                        </div>
                        {(searchQuery || methodFilter !== "All" || startDate || endDate) && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setMethodFilter("All");
                                    setStartDate("");
                                    setEndDate("");
                                }}
                                className="de-btn-ghost"
                                style={{
                                    height: "42px",
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
                </div>

                {/* Table */}
                <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0", overflow: "hidden" }}>
                    <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Transactions</span>
                        {filteredExpenses.length > 0 && (
                            <span style={{ fontSize: 12, background: "#f3f4f6", color: "#6b7280", padding: "2px 8px", borderRadius: 99, fontWeight: 500 }}>
                                {filteredExpenses.length}
                            </span>
                        )}
                    </div>

                    <div style={{ overflowX: "auto" }}>
                        <table className="de-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                                    {["Date", "Reason", "Method", "Amount", "Receipt"].map((h, i) => (
                                        <th key={h} style={{
                                            padding: "12px 20px",
                                            fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em",
                                            color: "#9ca3af", textAlign: i === 4 ? "center" : "left",
                                            background: "#fafafa", whiteSpace: "nowrap"
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} style={{ padding: "60px 24px", textAlign: "center" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                                            <div style={{ width: 32, height: 32, border: "2.5px solid #e5e7eb", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                                            <span style={{ fontSize: 13, color: "#9ca3af" }}>Loading transactions…</span>
                                        </div>
                                        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                                    </td></tr>
                                ) : filteredExpenses.length > 0 ? paginatedExpenses.map((exp, idx) => {
                                    const formattedDate = exp.date
                                        ? new Date(exp.date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
                                        : "—";
                                    return (
                                        <tr key={exp._id} style={{ borderBottom: idx < paginatedExpenses.length - 1 ? "1px solid #f9fafb" : "none" }}>
                                            {/* Date – indigo */}
                                            <td style={{ padding: "16px 20px", fontSize: 13, color: "#6366f1", fontWeight: 500, whiteSpace: "nowrap" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#c7d2fe", flexShrink: 0 }} />
                                                    {formattedDate}
                                                </div>
                                            </td>
                                            {/* Reason – amber */}
                                            <td style={{ padding: "16px 20px", fontSize: 14, color: "#b45309", fontWeight: 500, maxWidth: 260 }}>
                                                <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{exp.reason}</span>
                                            </td>
                                            {/* Payment Method badge */}
                                            <td style={{ padding: "16px 20px" }}>
                                                <PaymentBadge method={exp.PaymentMethod} />
                                            </td>
                                            {/* Amount – emerald */}
                                            <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                                                <span className="de-amount-display" style={{ fontSize: 15, color: "#059669", fontWeight: 700 }}>
                                                    {fmt(Number(exp.AmountPaid) || 0)}
                                                </span>
                                            </td>
                                            {/* Receipt */}
                                            <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                                {exp.bill ? (
                                                    <button className="de-view-btn" onClick={() => {
                                                        const url = typeof exp.bill === "string" ? exp.bill : exp.bill.url;
                                                        const key = typeof exp.bill === "object" ? exp.bill.key : exp.key;
                                                        setViewBillUrl(key ? `${import.meta.env.VITE_API_URL}/api/media/preview?key=${key}` : url);
                                                    }}>
                                                        <Eye size={12} /> View
                                                    </button>
                                                ) : (
                                                    <span style={{ fontSize: 12, color: "#d1d5db", fontStyle: "italic" }}>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan={5}>
                                        <div className="de-empty-state">
                                            <div style={{ width: 52, height: 52, borderRadius: 16, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                                <ReceiptText size={24} color="#d1d5db" />
                                            </div>
                                            <p style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No transactions found</p>
                                            <p style={{ fontSize: 13, color: "#9ca3af" }}>Try adjusting your filters or record a new expense.</p>
                                        </div>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {filteredExpenses.length > 0 && totalPages > 1 && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderTop: "1px solid #f3f4f6", background: "#fafafa", flexWrap: "wrap", gap: 12 }}>
                            <span style={{ fontSize: 13, color: "#6b7280" }}>
                                Showing <span style={{ fontWeight: 600 }}>{((currentPage - 1) * itemsPerPage) + 1}</span> to <span style={{ fontWeight: 600 }}>{Math.min(currentPage * itemsPerPage, filteredExpenses.length)}</span> of <span style={{ fontWeight: 600 }}>{filteredExpenses.length}</span> transactions
                            </span>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <button 
                                    type="button"
                                    className="de-btn-ghost" 
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
                                            className={currentPage === page ? "de-btn-primary" : "de-btn-ghost"}
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
                                    className="de-btn-ghost" 
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

            {/* Add Expense Modal */}
            {showModal && (
                <div className="de-modal-overlay" onClick={() => !loading && setShowModal(false)}>
                    <div className="de-modal" onClick={e => e.stopPropagation()}>
                        <div className="de-modal-header">
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 10, background: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Banknote size={16} color="#fff" />
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", letterSpacing: "-0.01em" }}>Record Expense</h2>
                                            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>Add a new payment transaction</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => !loading && setShowModal(false)} disabled={loading}
                                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#9ca3af", transition: "all 0.15s" }}
                                    onMouseOver={e => e.currentTarget.style.background = "#f3f4f6"}
                                    onMouseOut={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="de-modal-body">
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label className="de-label">Amount (₹)</label>
                                        <input type="number" name="amount" value={formData.amount} onChange={handleChange}
                                            placeholder="0.00" required min="1" disabled={loading} className="de-input" />
                                    </div>
                                    <div>
                                        <label className="de-label">Payment Method</label>
                                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}
                                            required disabled={loading} className="de-input" style={{ cursor: "pointer" }}>
                                            <option value="">Select method</option>
                                            <option value="Cash">Cash</option>
                                            <option value="UPI">UPI</option>
                                            <option value="Card">Card</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                        </select>
                                    </div>
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <label className="de-label">Reason for Payment</label>
                                        <textarea name="reason" value={formData.reason} onChange={handleChange}
                                            placeholder="What was this expense for?" required rows={3} disabled={loading}
                                            className="de-input" style={{ resize: "none", lineHeight: 1.6 }} />
                                    </div>
                                    <div>
                                        <label className="de-label">Date</label>
                                        <input type="date" name="date" value={formData.date} onChange={handleChange}
                                            required disabled={loading} className="de-input" />
                                    </div>
                                    <div>
                                        <label className="de-label">Receipt / Bill</label>
                                        <input type="file" name="bill" id="bill-upload" accept="image/*" onChange={handleChange} disabled={loading} style={{ display: "none" }} />
                                        <label htmlFor="bill-upload" className={`de-file-label ${formData.bill ? "has-file" : ""}`}>
                                            <span style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                                                {formData.bill ? formData.bill.name : "Choose file…"}
                                            </span>
                                            {formData.bill ? <FileCheck size={16} /> : <FileText size={16} />}
                                        </label>
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginTop: 24, paddingTop: 20, borderTop: "1px solid #f3f4f6" }}>
                                    <button type="button" className="de-btn-ghost" onClick={() => !loading && setShowModal(false)} disabled={loading}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="de-btn-primary" disabled={loading}
                                        style={{ minWidth: 120, justifyContent: "center" }}>
                                        {loading ? (
                                            <>
                                                <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                                                Saving…
                                            </>
                                        ) : "Add Expense"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {viewBillUrl && (
                <div className="de-lightbox-overlay" onClick={() => setViewBillUrl(null)}>
                    <div style={{ position: "relative", maxHeight: "88vh", maxWidth: 640, width: "100%" }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setViewBillUrl(null)}
                            style={{ position: "absolute", top: -14, right: -14, zIndex: 10, width: 32, height: 32, borderRadius: "50%", background: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                            <X size={16} color="#374151" />
                        </button>
                        <img src={viewBillUrl} alt="Receipt" style={{ width: "100%", maxHeight: "85vh", objectFit: "contain", borderRadius: 16, boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyExpense;