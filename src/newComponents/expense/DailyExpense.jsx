import React, { useState, useEffect } from "react";
import {
    X, Plus, Eye, Calendar, CreditCard, Search,
    FileText, Filter, TrendingUp, ArrowUpRight, FileCheck,
    ReceiptText, Banknote, SlidersHorizontal, Wallet
} from "lucide-react";

const PaymentBadge = ({ method }) => {
    const m = method?.toLowerCase() || "";
    let colorClasses = "bg-gray-100 text-gray-700 border-gray-200";
    let label = method || "Unknown";
    
    if (m === "cash") colorClasses = "bg-green-50 text-green-700 border-green-200";
    else if (m === "upi") colorClasses = "bg-indigo-50 text-indigo-700 border-indigo-200";
    else if (m === "card") colorClasses = "bg-purple-50 text-purple-700 border-purple-200";
    else if (m === "bank transfer") colorClasses = "bg-cyan-50 text-cyan-700 border-cyan-200";

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colorClasses}`}>
            {label}
        </span>
    );
};

const StatCard = ({ colorName, icon: Icon, label, value, sub }) => {
    const colors = {
        blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
        emerald: { bg: "bg-emerald-50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        violet: { bg: "bg-violet-50", text: "text-violet-600", iconBg: "bg-violet-100" },
        amber: { bg: "bg-amber-50", text: "text-amber-600", iconBg: "bg-amber-100" }
    };
    const theme = colors[colorName] || colors.blue;

    return (
        <div className={`relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 transition-all hover:-translate-y-1 hover:shadow-lg shadow-sm group`}>
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-50 transition-transform group-hover:scale-110 ${theme.bg}`}></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.iconBg} ${theme.text}`}>
                    <Icon size={18} strokeWidth={2.5} />
                </div>
            </div>
            
            <div className="relative z-10">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight tracking-tight">{value}</div>
                <div className={`mt-2 flex items-center gap-1.5 text-xs font-bold ${theme.text}`}>
                    <ArrowUpRight size={14} strokeWidth={2.5} />
                    <span>{sub}</span>
                </div>
            </div>
        </div>
    );
};

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
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            if (currentPage <= 2) end = 4;
            if (currentPage >= totalPages - 1) start = totalPages - 3;
            if (start > 2) pages.push("...");
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

    return (
        <div className="max-w-7xl mx-auto my-6 sm:my-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-4 sm:p-8">
                
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">Finance</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">Expense Tracker</h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Manage and monitor all company expenditures</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex justify-center items-center gap-2 whitespace-nowrap text-sm sm:text-base"
                    >
                        <Plus size={20} strokeWidth={3} />
                        Record Expense
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard colorName="blue" icon={TrendingUp} label="Today" value={fmt(todayExpense)} sub="Current day spend" />
                    <StatCard colorName="emerald" icon={Calendar} label="This Month" value={fmt(monthlyExpense)} sub="Monthly total" />
                    <StatCard colorName="violet" icon={Wallet} label="All Time" value={fmt(totalExpense)} sub="Lifetime tracked" />
                    <StatCard colorName="amber" icon={CreditCard} label="Transactions" value={expenses.length.toLocaleString()} sub="Total records" />
                </div>

                {/* Filters */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <SlidersHorizontal size={16} className="text-slate-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Filters</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center">
                        <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
                            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                            <input
                                type="text" placeholder="Search by reason…" value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 text-xs sm:text-sm font-medium text-slate-700 shadow-sm transition-all"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        
                        <div className="relative w-full sm:flex-none sm:w-40">
                            <Filter size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                            <select 
                                value={methodFilter} onChange={e => setMethodFilter(e.target.value)} 
                                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition-all appearance-none cursor-pointer"
                            >
                                <option value="All">All Methods</option>
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Card">Card</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>

                        <div className="flex w-full sm:w-auto gap-3">
                            <div className="relative flex-1 sm:flex-none sm:w-[150px]">
                                <Calendar size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                                <input 
                                    type="date" value={startDate} onChange={e => setStartDate(e.target.value)} 
                                    className="w-full pl-10 pr-3 py-3 border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 text-xs sm:text-sm font-medium text-slate-700 shadow-sm transition-all" 
                                />
                            </div>

                            <div className="relative flex-1 sm:flex-none sm:w-[150px]">
                                <Calendar size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                                <input 
                                    type="date" value={endDate} onChange={e => setEndDate(e.target.value)} 
                                    className="w-full pl-10 pr-3 py-3 border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 text-xs sm:text-sm font-medium text-slate-700 shadow-sm transition-all" 
                                />
                            </div>
                        </div>

                        {(searchQuery || methodFilter !== "All" || startDate || endDate) && (
                            <button
                                onClick={() => { setSearchQuery(""); setMethodFilter("All"); setStartDate(""); setEndDate(""); }}
                                className="w-full sm:w-auto px-4 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl font-bold text-xs sm:text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                            >
                                <X size={16} strokeWidth={3} /> Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Container */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-50 md:bg-white">
                    <div className="p-4 sm:p-5 border-b border-slate-100 bg-white md:bg-slate-50/50 flex items-center gap-3">
                        <span className="font-extrabold text-base sm:text-lg text-slate-800">Transactions</span>
                        {filteredExpenses.length > 0 && (
                            <span className="bg-indigo-100 text-indigo-800 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">
                                {filteredExpenses.length} Records
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="p-16 flex flex-col items-center justify-center bg-white">
                            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                            <p className="text-slate-500 font-bold text-sm">Loading transactions...</p>
                        </div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="p-12 sm:p-16 flex flex-col items-center justify-center bg-white text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <ReceiptText size={32} className="text-slate-300" />
                            </div>
                            <p className="text-slate-800 font-extrabold text-lg sm:text-xl mb-2">No transactions found</p>
                            <p className="text-slate-500 font-medium text-sm">Try adjusting your filters or record a new expense.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-[11px] text-slate-500 uppercase bg-slate-50 font-bold border-b border-slate-200 tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Reason</th>
                                            <th className="px-6 py-4">Method</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4 text-center">Receipt</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {paginatedExpenses.map((exp) => (
                                            <tr key={exp._id} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-slate-600 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-indigo-200" />
                                                        {exp.date ? new Date(exp.date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "—"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-800 max-w-[260px] truncate" title={exp.reason}>
                                                    {exp.reason}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <PaymentBadge method={exp.PaymentMethod} />
                                                </td>
                                                <td className="px-6 py-4 font-extrabold text-emerald-600 text-base">
                                                    {fmt(Number(exp.AmountPaid) || 0)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {exp.bill ? (
                                                        <button 
                                                            onClick={() => {
                                                                const url = typeof exp.bill === "string" ? exp.bill : exp.bill.url;
                                                                const key = typeof exp.bill === "object" ? exp.bill.key : exp.key;
                                                                setViewBillUrl(key ? `${import.meta.env.VITE_API_URL}/api/media/preview?key=${key}` : url);
                                                            }}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold transition-colors"
                                                        >
                                                            <Eye size={14} strokeWidth={2.5} /> View
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-300 font-medium text-xs">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="block md:hidden">
                                <div className="flex flex-col gap-4 p-4">
                                    {paginatedExpenses.map((exp) => (
                                        <div key={exp._id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5 flex items-center gap-1.5">
                                                        <Calendar size={10} />
                                                        {exp.date ? new Date(exp.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                                                    </div>
                                                    <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{exp.reason}</h4>
                                                </div>
                                                <span className="font-extrabold text-emerald-600 text-lg shrink-0">
                                                    {fmt(Number(exp.AmountPaid) || 0)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                                                <PaymentBadge method={exp.PaymentMethod} />
                                                
                                                {exp.bill && (
                                                    <button 
                                                        onClick={() => {
                                                            const url = typeof exp.bill === "string" ? exp.bill : exp.bill.url;
                                                            const key = typeof exp.bill === "object" ? exp.bill.key : exp.key;
                                                            setViewBillUrl(key ? `${import.meta.env.VITE_API_URL}/api/media/preview?key=${key}` : url);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                                                    >
                                                        <Eye size={12} strokeWidth={2.5} /> Receipt
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 border-t border-slate-200 bg-white gap-4">
                                    <span className="text-xs sm:text-sm font-medium text-slate-500">
                                        Showing <span className="font-bold text-slate-800">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, filteredExpenses.length)}</span> of <span className="font-bold text-slate-800">{filteredExpenses.length}</span> entries
                                    </span>
                                    <div className="flex gap-1.5">
                                        <button 
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                            disabled={currentPage === 1}
                                            className="px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-slate-200 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Prev
                                        </button>
                                        
                                        {/* Simplified pagination for mobile */}
                                        <div className="hidden sm:flex gap-1.5">
                                            {renderPageNumbers().map((page, index) => (
                                                page === "..." ? (
                                                    <span key={`dots-${index}`} className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold">...</span>
                                                ) : (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center transition-colors border-2 ${
                                                            currentPage === page 
                                                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200" 
                                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            ))}
                                        </div>

                                        <button 
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-slate-200 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Add Expense Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" onClick={() => !loading && setShowModal(false)}>
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white shrink-0">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <Banknote size={20} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-800">Record Expense</h3>
                                        <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Add Payment Transaction</p>
                                    </div>
                                </div>
                                <button onClick={() => !loading && setShowModal(false)} disabled={loading} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors">
                                    <X size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Amount */}
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Amount (₹)</label>
                                        <input 
                                            type="number" name="amount" value={formData.amount} onChange={handleChange}
                                            placeholder="0.00" required min="1" disabled={loading} 
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-400 font-extrabold text-slate-800 text-lg transition-colors placeholder:text-slate-300 placeholder:font-medium" 
                                        />
                                    </div>

                                    {/* Payment Method */}
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Payment Method</label>
                                        <select 
                                            name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required disabled={loading} 
                                            className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-400 font-bold text-slate-700 text-sm transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="">Select method</option>
                                            <option value="Cash">Cash</option>
                                            <option value="UPI">UPI</option>
                                            <option value="Card">Card</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                        </select>
                                    </div>

                                    {/* Reason */}
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Reason for Payment</label>
                                        <textarea 
                                            name="reason" value={formData.reason} onChange={handleChange}
                                            placeholder="What was this expense for?" required rows={3} disabled={loading}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-400 font-bold text-slate-700 text-sm transition-colors resize-none" 
                                        />
                                    </div>

                                    {/* Date */}
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Date</label>
                                        <input 
                                            type="date" name="date" value={formData.date} onChange={handleChange}
                                            required disabled={loading} 
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-400 font-bold text-slate-700 text-sm transition-colors" 
                                        />
                                    </div>

                                    {/* Receipt */}
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Receipt / Bill</label>
                                        <input type="file" name="bill" id="bill-upload" accept="image/*" onChange={handleChange} disabled={loading} className="hidden" />
                                        <label 
                                            htmlFor="bill-upload" 
                                            className={`flex items-center justify-between w-full border-2 border-dashed rounded-xl px-4 py-3.5 cursor-pointer transition-colors ${
                                                formData.bill ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-slate-400"
                                            }`}
                                        >
                                            <span className="text-sm font-bold overflow-hidden text-ellipsis whitespace-nowrap pr-2">
                                                {formData.bill ? formData.bill.name : "Upload receipt image..."}
                                            </span>
                                            {formData.bill ? <FileCheck size={18} className="shrink-0" /> : <FileText size={18} className="shrink-0" />}
                                        </label>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
                                    <button 
                                        type="button" onClick={() => !loading && setShowModal(false)} disabled={loading}
                                        className="px-5 py-2.5 rounded-xl font-bold text-slate-500 text-sm hover:bg-slate-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" disabled={loading}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl active:scale-95 transition-all text-sm min-w-[140px] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Saving...
                                            </>
                                        ) : "Save Expense"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {viewBillUrl && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setViewBillUrl(null)}>
                    <div className="relative max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <button 
                            onClick={() => setViewBillUrl(null)}
                            className="absolute -top-12 right-0 sm:-right-12 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors border border-white/20 backdrop-blur-md"
                        >
                            <X size={20} strokeWidth={2.5} />
                        </button>
                                                                                                                                                                                               <img 
                            src={viewBillUrl} alt="Receipt" 
                            className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl bg-black/50" 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyExpense;