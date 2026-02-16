import React, { useState, useEffect, useMemo } from "react";
import { X, Edit2, Eye } from "lucide-react";

const ChequeExpense = () => {
    const [selectedTab, setSelectedTab] = useState("pending");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cheques, setCheques] = useState([]);
    const [editingChequeId, setEditingChequeId] = useState(null);
    const [viewCheque, setViewCheque] = useState(null);
    const [statusModal, setStatusModal] = useState({
        open: false,
        type: null,
        chequeId: null,
        currentStatus: null,
        reason: "",
        clearDate: "",
        shiftRemark: "",
    });

    const [formData, setFormData] = useState({
        issuedDate: "",
        toWhom: "",
        amount: "",
        chequeNumber: "",
        reason: "",
        entryDate: new Date().toISOString().split("T")[0], // today's date auto-filled
    });
    const [duplicateError, setDuplicateError] = useState("");

    // ✅ Handle input changes and check for duplicate cheque number
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Check for duplicate cheque number in real-time
        if (name === "chequeNumber") {
            const trimmedValue = value.trim();
            if (trimmedValue) {
                const isDuplicate = cheques.some(
                    (c) =>
                        c.chequeNumber && c.chequeNumber.toString().trim().toLowerCase() === trimmedValue.toLowerCase() && c._id !== editingChequeId,
                );
                setDuplicateError(isDuplicate ? "Duplicate cheque number" : "");
            } else {
                setDuplicateError("");
            }
        }
    };

    // ✅ Fetch all cheques from backend
    const fetchCheques = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:4000/cheque/get");
            if (!res.ok) throw new Error("Failed to fetch cheques");
            const data = await res.json();
            console.log(data);
            setCheques(data); // Assuming backend sends { cheques: [...] }
        } catch (error) {
            console.error("❌ Error fetching cheques:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Run once when component loads
    useEffect(() => {
        fetchCheques();
    }, []);

    // ✅ Utilities for totals
    const parseAmount = (amt) => {
        if (amt === null || amt === undefined) return 0;
        try {
            const s = amt.toString().replace(/,/g, "").replace(/₹/g, "").trim();
            return Number(s) || 0;
        } catch (e) {
            return 0;
        }
    };

    const todayString = new Date().toISOString().split("T")[0];

    const todayTotal = useMemo(() => {
        if (!cheques || cheques.length === 0) return 0;
        return cheques.reduce((acc, c) => {
            try {
                if (c.entryDate === todayString) return acc + parseAmount(c.chequeAmount);
            } catch (e) {
                return acc;
            }
            return acc;
        }, 0);
    }, [cheques, todayString]);

    const todayTotalFiltered = useMemo(() => {
        if (!cheques || cheques.length === 0) return 0;
        if (selectedTab === "all") return todayTotal;
        return cheques.reduce((acc, c) => {
            try {
                if ((c.status || "pending").toLowerCase() === selectedTab && c.entryDate === todayString) return acc + parseAmount(c.chequeAmount);
            } catch (e) {
                return acc;
            }
            return acc;
        }, 0);
    }, [cheques, todayString, selectedTab]);

    const monthlyTotal = useMemo(() => {
        if (!cheques || cheques.length === 0) return 0;
        const now = new Date();
        const curMonth = now.getMonth();
        const curYear = now.getFullYear();
        return cheques.reduce((acc, c) => {
            try {
                const dateObj = new Date(c.entryDate);
                if (dateObj.getMonth() === curMonth && dateObj.getFullYear() === curYear) {
                    return acc + parseAmount(c.chequeAmount);
                }
            } catch (e) {
                return acc;
            }
            return acc;
        }, 0);
    }, [cheques]);

    const monthlyTotalFiltered = useMemo(() => {
        if (!cheques || cheques.length === 0) return 0;
        if (selectedTab === "all") return monthlyTotal;
        const now = new Date();
        const curMonth = now.getMonth();
        const curYear = now.getFullYear();
        return cheques.reduce((acc, c) => {
            try {
                const dateObj = new Date(c.entryDate);
                if ((c.status || "pending").toLowerCase() === selectedTab && dateObj.getMonth() === curMonth && dateObj.getFullYear() === curYear) {
                    return acc + parseAmount(c.chequeAmount);
                }
            } catch (e) {
                return acc;
            }
            return acc;
        }, 0);
    }, [cheques, selectedTab]);

    const formatINR = (value) => {
        try {
            return new Intl.NumberFormat("en-IN").format(value);
        } catch (e) {
            return value;
        }
    };

    const STATUSES = ["all", "clear", "shifted", "pending", "cancelled"];
    const FILTER_OPTIONS = STATUSES;
    const STATUS_KEYS = ["clear", "shifted", "pending", "cancelled"];
    const statusBadgeStyles = {
        pending: "bg-yellow-200 text-yellow-900",
        clear: "bg-green-200 text-green-800",
        cancelled: "bg-red-200 text-red-800",
        shifted: "bg-blue-200 text-blue-800",
    };

    const totalsByStatus = useMemo(() => {
        const map = {};
        STATUS_KEYS.forEach((s) => {
            map[s] = { count: 0, total: 0 };
        });
        cheques.forEach((c) => {
            const st = (c.status || "pending").toLowerCase();
            const amt = parseAmount(c.chequeAmount);
            if (!map[st]) map[st] = { count: 0, total: 0 };
            map[st].count += 1;
            map[st].total += amt;
        });
        return map;
    }, [cheques]);

    const filteredCheques = useMemo(() => {
        if (!cheques) return [];
        if (selectedTab === "all") return cheques;
        return cheques.filter((c) => (c.status || "pending").toLowerCase() === selectedTab);
    }, [cheques, selectedTab]);

    // Debounce the search term for performance, so the UI won't filter on every keystroke
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm.trim().toLowerCase()), 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Apply search filter over already filteredCheques
    const finalFilteredCheques = useMemo(() => {
        let result = filteredCheques;
        // apply search term
        if (debouncedSearchTerm) {
            const term = debouncedSearchTerm;
            result = result.filter((c) => {
                const name = (c.receiverName || "").toString().toLowerCase();
                const num = (c.chequeNumber || "").toString().toLowerCase();
                return name.includes(term) || num.includes(term);
            });
        }
        // apply date range (on entryDate)
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            result = result.filter((c) => {
                try {
                    const d = new Date(c.entryDate);
                    if (start && d < start) return false;
                    if (end) {
                        // compare end day inclusive: set time of end to 23:59:59
                        const endWithTime = new Date(end);
                        endWithTime.setHours(23, 59, 59, 999);
                        if (d > endWithTime) return false;
                    }
                    return true;
                } catch (e) {
                    return false;
                }
            });
        }
        return result;
    }, [filteredCheques, debouncedSearchTerm, startDate, endDate]);

    const finalFilteredTotal = useMemo(() => {
        if (!finalFilteredCheques || finalFilteredCheques.length === 0) return 0;
        return finalFilteredCheques.reduce((acc, c) => acc + parseAmount(c.chequeAmount), 0);
    }, [finalFilteredCheques]);

    const updateStatus = async (id, payload = {}) => {
        try {
            // Call API to update status and any additional data supplied
            const res = await fetch(`http://localhost:4000/cheque/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to update status");
            // refresh list to ensure server-side updates are reflected
            await fetchCheques();
            alert("Status updated successfully");
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Unable to update status, try again.");
            // refresh list to show current state
            fetchCheques();
        }
    };

    // Wrapper to handle special statuses that require additional input
    const handleStatusSelection = (cheque, newStatus) => {
        const currentStatus = (cheque.status || "pending").toLowerCase();
        if (currentStatus === newStatus) return;

        if (newStatus === "cancelled") {
            setStatusModal({ open: true, type: "cancelled", chequeId: cheque._id, currentStatus, reason: "", clearDate: "" });
        } else if (newStatus === "clear" || newStatus === "cleared") {
            // accept 'clear' or 'cleared' keys
            setStatusModal({
                open: true,
                type: "clear",
                chequeId: cheque._id,
                currentStatus,
                reason: "",
                clearDate: new Date().toISOString().split("T")[0],
            });
        } else if (newStatus === "shifted") {
            setStatusModal({ open: true, type: "shifted", chequeId: cheque._id, currentStatus, reason: "", clearDate: "", shiftRemark: "" });
        } else {
            updateStatus(cheque._id, { status: newStatus });
        }
    };

    const handleCloseStatusModal = async () => {
        setStatusModal({ open: false, type: null, chequeId: null, currentStatus: null, reason: "", clearDate: "" });
        // Refresh cheques to reset select element to server state (in case user cancelled)
        await fetchCheques();
    };

    const confirmStatusChange = async () => {
        const { chequeId, type, reason, clearDate } = statusModal;
        const { shiftRemark } = statusModal;
        if (!chequeId) return;

        if (type === "cancelled") {
            if (!reason || !reason.trim()) {
                return alert("Please provide a reason for cancellation.");
            }
            await updateStatus(chequeId, { status: "cancelled", cancelReason: reason.trim() });
            handleCloseStatusModal();
            return;
        }

        if (type === "clear") {
            if (!clearDate) {
                return alert("Please select the cleared date.");
            }
            await updateStatus(chequeId, { status: "clear", clearedDate: clearDate });
            handleCloseStatusModal();
            return;
        }
        if (type === "shifted") {
            if (!shiftRemark || !shiftRemark.trim()) {
                return alert("Please provide a reason for shifting the cheque.");
            }
            await updateStatus(chequeId, { status: "shifted", shiftRemark: shiftRemark?.trim() || undefined });
            handleCloseStatusModal();
            return;
        }
    };

    // ✅ Handle form submission (POST)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const expenseEntry = {
            chequeIssuedDate: formData.issuedDate,
            receiverName: formData.toWhom,
            chequeNumber: formData.chequeNumber,
            chequeAmount: formData.amount,
            reasonToIssue: formData.reason,
        };
        if (!editingChequeId) {
            expenseEntry.entryDate = new Date().toISOString().split("T")[0];
        }

        try {
            const url = editingChequeId ? `http://localhost:4000/cheque/${editingChequeId}` : "http://localhost:4000/cheque";
            const method = editingChequeId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expenseEntry),
            });

            const data = await res.json().catch(() => null);
            // Surface duplicate error message from server to user
            if (!res.ok) {
                if (data && data.message && data.message.toLowerCase().includes("duplicate")) {
                    return alert(data.message);
                }
                throw new Error(data?.message || "Failed to save cheque expense");
            }

            console.log(" Cheque Expense Saved:", data);

            alert(editingChequeId ? "Cheque expense updated successfully!" : "Cheque expense added successfully!");
            setShowModal(false);
            setEditingChequeId(null);
            setDuplicateError("");
            fetchCheques(); // ✅ Refresh list after adding/ editing cheque

            // Reset form
            setFormData({
                issuedDate: "",
                toWhom: "",
                amount: "",
                chequeNumber: "",
                reason: "",
                entryDate: new Date().toISOString().split("T")[0],
            });
        } catch (error) {
            console.error(" Error saving cheque expense:", error);
            alert("Error saving cheque expense. Please try again.");
        }
    };
    // Open modal with cheque data for editing
    const openEditModal = (cheque) => {
        setEditingChequeId(cheque._id);
        setFormData({
            issuedDate: new Date(cheque.chequeIssuedDate).toISOString().split("T")[0],
            toWhom: cheque.receiverName || "",
            amount: cheque.chequeAmount || "",
            chequeNumber: cheque.chequeNumber || "",
            reason: cheque.reasonToIssue || "",
            entryDate: cheque.entryDate || new Date().toISOString().split("T")[0],
        });
        setShowModal(true);
    };
    if (cheques)
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Status buttons - show at very top for quick access before summary cards */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    {FILTER_OPTIONS.map((s) => (
                        <button
                            key={`top-${s}`}
                            onClick={() => setSelectedTab(s)}
                            className={`rounded-md border px-3 py-1 text-left transition ${
                                selectedTab === s ? statusBadgeStyles[s] || "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                            aria-pressed={selectedTab === s}
                        >
                            <div className="text-sm font-medium capitalize">{s}</div>
                            <div className="text-xs">
                                {s === "all" ? cheques.length : totalsByStatus[s]?.count || 0} • ₹
                                {s === "all"
                                    ? formatINR(cheques.reduce((acc, c) => acc + parseAmount(c.chequeAmount), 0))
                                    : formatINR(totalsByStatus[s]?.total || 0)}
                            </div>
                        </button>
                    ))}
                </div>
                {/*  Summary Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-md border border-gray-300 bg-white p-4">
                        <div className="mb-1 text-lg font-semibold text-gray-800">Today Cheque Expense</div>
                        <div className="text-2xl font-bold text-black">₹{formatINR(todayTotal)}</div>
                        <div className="mt-1 text-sm text-gray-500">
                            Showing <span className="capitalize">{selectedTab}</span>: ₹{formatINR(todayTotalFiltered)}
                        </div>
                    </div>
                    <div className="rounded-md border border-gray-300 bg-white p-4">
                        <div className="mb-1 text-lg font-semibold text-gray-800">Monthly Cheque Expense</div>
                        <div className="text-2xl font-bold text-black">₹{formatINR(monthlyTotal)}</div>
                        <div className="mt-1 text-sm text-gray-500">
                            Showing <span className="capitalize">{selectedTab}</span>: ₹{formatINR(monthlyTotalFiltered)}
                        </div>
                    </div>
                </div>

                {/*  Header + Add Button and Tabs */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold">Cheque Expenses</h2>
                        <div className="ml-2 flex items-center gap-2">
                            <label className="text-sm text-gray-600">From</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-44 rounded-lg border px-3 py-1.5"
                            />
                            <label className="text-sm text-gray-600">To</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-44 rounded-lg border px-3 py-1.5"
                            />
                            <button
                                onClick={() => {
                                    setStartDate("");
                                    setEndDate("");
                                }}
                                className="flex items-center gap-2 text-nowrap rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 sm:px-4 sm:py-2 sm:text-base"
                            >
                                Clear Dates
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search name or cheque number"
                                className="w-64 rounded-lg border px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-1 top-1.5 text-gray-500 hover:text-gray-800"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        {/* <div className="ml-4 text-right">
            <div className="text-sm text-gray-600">Filtered Records: <span className="font-medium">{finalFilteredCheques.length}</span></div>
            <div className="text-sm text-gray-600">Filtered Total: <span className="font-medium">₹{formatINR(finalFilteredTotal)}</span></div>
          </div> */}
                    </div>
                    <button
                        onClick={() => {
                            setEditingChequeId(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 text-nowrap rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 sm:px-4 sm:py-2 sm:text-base"
                    >
                        + Add Cheque
                    </button>
                </div>

                {/* Tabs for statuses */}
                {/* <div className="flex gap-2 items-center mb-4">
        {FILTER_OPTIONS.map((s) => (
          <button
            key={`bottom-${s}`}
            onClick={() => setSelectedTab(s)}
            className={`px-3 py-1 rounded-md border ${selectedTab === s ? 'bg-black text-white' : 'bg-white text-black'}`}
            aria-pressed={selectedTab === s}
          >
            <div className="text-sm font-medium capitalize">{s}</div>
            <div className="text-xs">{s === 'all' ? cheques.length : (totalsByStatus[s]?.count || 0)} • ₹{s === 'all' ? formatINR(cheques.reduce((acc, c) => acc + parseAmount(c.chequeAmount), 0)) : formatINR(totalsByStatus[s]?.total || 0)}</div>
          </button>
        ))}
      </div> */}

                {/* ✅ Cheque Table */}
                <div className="overflow-x-auto rounded-lg border bg-white shadow-md">
                    {loading ? (
                        <p className="p-4 text-center text-gray-600">Loading cheques...</p>
                    ) : cheques.length === 0 ? (
                        <p className="p-4 text-center text-gray-600">No cheque records found.</p>
                    ) : finalFilteredCheques.length === 0 ? (
                        <p className="p-4 text-center text-gray-600">
                            {debouncedSearchTerm
                                ? `No results for "${debouncedSearchTerm}" in ${selectedTab} status`
                                : `No records for ${selectedTab} status`}
                            {(startDate || endDate) && <span>{` between ${startDate || "..."} and ${endDate || "..."}`}</span>}.
                        </p>
                    ) : (
                        <table className="min-w-full border-collapse">
                            <thead className="border-b bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Entry Date</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Cheque Number</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">To Whom</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Issued Date</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Reason</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Shifted Reason</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
                                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {finalFilteredCheques.map((cheque) => (
                                    <tr
                                        key={cheque._id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-3 text-sm text-gray-800">{cheque.entryDate}</td>
                                        <td className="p-3 text-sm text-gray-800">{cheque.chequeNumber}</td>
                                        <td className="p-3 text-sm text-gray-800">{cheque.receiverName}</td>
                                        <td className="p-3 text-sm text-gray-800">₹{cheque.chequeAmount}</td>
                                        <td className="p-3 text-sm font-semibold text-gray-800">
                                            {new Date(cheque.chequeIssuedDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 text-sm text-gray-800">{cheque.reasonToIssue}</td>
                                        <td className="p-3 text-sm text-gray-800">{cheque.shiftRemark || "-"}</td>
                                        <td className="p-3 text-sm">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${statusBadgeStyles[(cheque.status || "pending").toLowerCase()] || "bg-gray-100 text-gray-700"}`}
                                            >
                                                {cheque.status || "pending"}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-800">
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => openEditModal(cheque)}
                                                    className="rounded-md border border-blue-600 bg-blue-600 p-1.5 text-white hover:bg-blue-700"
                                                    title="Edit cheque"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setViewCheque(cheque)}
                                                    className="rounded-md border border-gray-700 bg-gray-700 p-1.5 text-white hover:bg-gray-900"
                                                    title="View cheque details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <select
                                                    value={cheque.status || "pending"}
                                                    onChange={(e) => handleStatusSelection(cheque, e.target.value)}
                                                    className="rounded-md border px-2 py-1"
                                                >
                                                    {STATUSES.filter((st) => st.toLowerCase() !== "all").map((st) => (
                                                        <option
                                                            value={st}
                                                            key={st}
                                                        >
                                                            {st}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* ✅ Add Cheque Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">{editingChequeId ? "Edit Cheque Expense" : "Add Cheque Expense"}</h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingChequeId(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Entry Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Entry Date</label>
                                        <input
                                            type="date"
                                            name="entryDate"
                                            value={formData.entryDate}
                                            readOnly
                                            className="mt-1 w-full cursor-not-allowed rounded-lg border bg-gray-100 p-2 text-gray-600"
                                        />
                                    </div>

                                    {/* Issued Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cheque Issued Date</label>
                                        <input
                                            type="date"
                                            name="issuedDate"
                                            value={formData.issuedDate}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* To Whom */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">To Whom Issued</label>
                                        <input
                                            type="text"
                                            name="toWhom"
                                            value={formData.toWhom}
                                            onChange={handleChange}
                                            placeholder="Enter receiver name"
                                            required
                                            className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Validity removed: field omitted by design */}

                                    {/* Cheque Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cheque Number</label>
                                        <input
                                            type="text"
                                            name="chequeNumber"
                                            value={formData.chequeNumber}
                                            onChange={handleChange}
                                            placeholder="Enter cheque number"
                                            required
                                            className={`mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 ${
                                                duplicateError ? "border-red-500" : "border-gray-300"
                                            }`}
                                        />
                                        {duplicateError && <p className="mt-1 text-sm text-red-500">{duplicateError}</p>}
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cheque Amount</label>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            placeholder="Enter amount"
                                            required
                                            className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Reason */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Reason to Issue</label>
                                        <textarea
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleChange}
                                            placeholder="Enter reason for issuing cheque"
                                            required
                                            rows="2"
                                            className="mt-1 w-full resize-none rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingChequeId(null);
                                            setDuplicateError("");
                                        }}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!!duplicateError}
                                        className={`rounded-lg px-4 py-2 text-white ${
                                            duplicateError ? "cursor-not-allowed bg-gray-400" : "bg-black hover:bg-gray-800"
                                        }`}
                                    >
                                        {editingChequeId ? "Update Cheque Expense" : "Add Cheque Expense"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {statusModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">{statusModal.type === "cancelled" ? "Cancel Cheque" : "Clear Cheque"}</h2>
                                <button
                                    onClick={() => handleCloseStatusModal()}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {statusModal.type === "cancelled" ? (
                                <div className="mb-4">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Reason for Cancellation</label>
                                    <textarea
                                        rows={4}
                                        value={statusModal.reason}
                                        onChange={(e) => setStatusModal((s) => ({ ...s, reason: e.target.value }))}
                                        className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Please describe why this cheque is cancelled"
                                    />
                                </div>
                            ) : statusModal.type === "shifted" ? (
                                <div className="mb-4">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Shifted Reason</label>
                                    <textarea
                                        rows={3}
                                        value={statusModal.shiftRemark}
                                        onChange={(e) => setStatusModal((s) => ({ ...s, shiftRemark: e.target.value }))}
                                        className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Please describe why this cheque is shifted"
                                    />
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Cheque Cleared Date</label>
                                    <input
                                        type="date"
                                        value={statusModal.clearDate}
                                        onChange={(e) => setStatusModal((s) => ({ ...s, clearDate: e.target.value }))}
                                        className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleCloseStatusModal()}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => confirmStatusChange()}
                                    disabled={
                                        (statusModal.type === "cancelled" && !statusModal.reason.trim()) ||
                                        (statusModal.type === "clear" && !statusModal.clearDate) ||
                                        (statusModal.type === "shifted" && (!statusModal.shiftRemark || !statusModal.shiftRemark.trim()))
                                    }
                                    className={`rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 ${(statusModal.type === "cancelled" && !statusModal.reason.trim()) || (statusModal.type === "clear" && !statusModal.clearDate) || (statusModal.type === "shifted" && !statusModal.shiftRemark.trim()) ? "cursor-not-allowed opacity-40" : ""}`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {viewCheque && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Cheque Details</h2>
                                <button
                                    onClick={() => setViewCheque(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Entry Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Entry Date</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={viewCheque.entryDate || "-"}
                                            className="mt-1 w-full rounded-lg border bg-gray-50 p-2 text-gray-700"
                                        />
                                    </div>

                                    {/* Cheque Issued Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cheque Issued Date</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={viewCheque.chequeIssuedDate ? new Date(viewCheque.chequeIssuedDate).toLocaleDateString() : "-"}
                                            className="mt-1 w-full rounded-lg border bg-gray-50 p-2 text-gray-700"
                                        />
                                    </div>

                                    {/* To Whom */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">To Whom Issued</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={viewCheque.receiverName || "-"}
                                            className="mt-1 w-full rounded-lg border bg-gray-50 p-2 text-gray-700"
                                        />
                                    </div>

                                    {/* Cheque Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cheque Number</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={viewCheque.chequeNumber || "-"}
                                            className="mt-1 w-full rounded-lg border bg-gray-50 p-2 text-gray-700"
                                        />
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cheque Amount</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={viewCheque.chequeAmount ? `₹${viewCheque.chequeAmount}` : "-"}
                                            className="mt-1 w-full rounded-lg border bg-gray-50 p-2 text-gray-700"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={(viewCheque.status || "pending").toString()}
                                            className="mt-1 w-full rounded-lg border bg-gray-50 p-2 capitalize text-gray-700"
                                        />
                                    </div>

                                    {/* Cleared Date (if any) */}
                                    {viewCheque.clearedDate && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cleared Date</label>
                                            <input
                                                type="text"
                                                readOnly
                                                value={new Date(viewCheque.clearedDate).toLocaleDateString()}
                                                className="mt-1 w-full rounded-lg border bg-gray-50 p-2 text-gray-700"
                                            />
                                        </div>
                                    )}

                                    {/* Shifted Reason (if any) */}
                                    {viewCheque.shiftRemark && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Shifted Reason</label>
                                            <input
                                                type="text"
                                                readOnly
                                                value={viewCheque.shiftRemark}
                                                className="mt-1 w-full rounded-lg border bg-gray-50 p-2 text-gray-700"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Reason to Issue */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Reason to Issue</label>
                                    <textarea
                                        readOnly
                                        rows={3}
                                        value={viewCheque.reasonToIssue || "-"}
                                        className="mt-1 w-full resize-none rounded-lg border bg-gray-50 p-2 text-gray-700"
                                    />
                                </div>

                                {/* Cancel Reason (if any) */}
                                {viewCheque.cancelReason && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cancel Reason</label>
                                        <textarea
                                            readOnly
                                            rows={3}
                                            value={viewCheque.cancelReason}
                                            className="mt-1 w-full resize-none rounded-lg border bg-gray-50 p-2 text-gray-700"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setViewCheque(null)}
                                    className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
};

export default ChequeExpense;
