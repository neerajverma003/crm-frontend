import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const Ledger = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", alias: "" });
    const [ledgers, setLedgers] = useState([]);
    const [viewLedger, setViewLedger] = useState(null);
    const [entries, setEntries] = useState([]);
    const [filterStart, setFilterStart] = useState("");
    const [filterEnd, setFilterEnd] = useState("");
    const [entryForm, setEntryForm] = useState({ date: new Date().toISOString().split("T")[0], narration: "", voucherType: "journal", voucherNumber: "", type: "debit", amount: "" });
    const [editingEntry, setEditingEntry] = useState(null);
    const [showAddEntryModal, setShowAddEntryModal] = useState(false);

    // fetch existing ledgers
    const fetchLedgers = async () => {
        try {
            const res = await fetch("http://localhost:4000/ledger/all");
            if (res.ok) {
                const data = await res.json();
                setLedgers(data);
            } else {
                console.error("Failed to load ledgers");
            }
        } catch (err) {
            console.error("Error fetching ledgers", err);
        }
    };

    useEffect(() => {
        fetchLedgers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alert("Please enter ledger name");
            return;
        }
        try {
            const res = await fetch("http://localhost:4000/ledger", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const respData = await res.json();
            if (res.ok) {
                alert("Ledger created");
                setShowModal(false);
                setFormData({ name: "", alias: "" });
                fetchLedgers();
            } else {
                alert(respData.message || "Error creating ledger");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };

    const handleView = (ledger) => {
        setFilterStart("");
        setFilterEnd("");
        setViewLedger(ledger);
    };

    const loadEntries = async () => {
        if (!viewLedger) return;
        try {
            const res = await fetch(`http://localhost:4000/ledger/${viewLedger._id}/entries`);
            if (res.ok) {
                const data = await res.json();
                setEntries(data);
            } else {
                console.error("Failed to load entries");
            }
        } catch (err) {
            console.error("Error loading entries", err);
        }
    };

    // filtered entries by date range
    const filteredEntries = React.useMemo(() => {
        let arr = entries;
        if (filterStart) {
            const start = new Date(filterStart);
            arr = arr.filter(e => new Date(e.date) >= start);
        }
        if (filterEnd) {
            const end = new Date(filterEnd);
            end.setHours(23,59,59,999);
            arr = arr.filter(e => new Date(e.date) <= end);
        }
        return arr;
    }, [entries, filterStart, filterEnd]);

    const openingBalance = React.useMemo(() => {
        if (!entries || entries.length === 0) return 0;
        if (!filterStart) return 0;
        const start = new Date(filterStart);
        // find last entry before start
        const prev = entries
            .filter(e => new Date(e.date) < start)
            .sort((a,b)=> new Date(b.date)-new Date(a.date))[0];
        return prev ? prev.balance : 0;
    }, [entries, filterStart]);

    const totalDebit = React.useMemo(() => filteredEntries.reduce((s,e)=> s + (e.debit||0),0), [filteredEntries]);
    const totalCredit = React.useMemo(() => filteredEntries.reduce((s,e)=> s + (e.credit||0),0), [filteredEntries]);
    const closingBalance = React.useMemo(() => {
        if (filteredEntries.length===0) return openingBalance;
        const last = filteredEntries[filteredEntries.length-1];
        return last.balance || openingBalance;
    }, [filteredEntries, openingBalance]);

    const startEdit = (entry) => {
        setEditingEntry(entry);
        const isDebit = entry.debit > 0;
        const amount = isDebit ? entry.debit : entry.credit;
        setEntryForm({
            date: entry.date ? new Date(entry.date).toISOString().substr(0,10) : "",
            narration: entry.narration,
            voucherType: entry.voucherType || "journal",
            voucherNumber: entry.voucherNumber || "",
            type: isDebit ? "debit" : "credit",
            amount: amount || "",
        });
        setShowAddEntryModal(true);
    };

    const cancelEdit = () => {
        setEditingEntry(null);
        setEntryForm({ date: new Date().toISOString().split("T")[0], narration: "", voucherType: "journal", voucherNumber: "", type: "debit", amount: "" });
        setShowAddEntryModal(false);
    };

    const removeEntry = async (entryId) => {
        if (!window.confirm("Delete this entry?")) return;
        try {
            const res = await fetch(`http://localhost:4000/ledger/${viewLedger._id}/entry/${entryId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                loadEntries();
            } else {
                alert("Could not delete entry");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };

    useEffect(() => {
        if (viewLedger) {
            loadEntries();
        }
    }, [viewLedger]);

    const closeView = () => {
        setViewLedger(null);
        setEntries([]);
        setEntryForm({ date: new Date().toISOString().split("T")[0], narration: "", voucherType: "journal", voucherNumber: "", type: "debit", amount: "" });
        setShowAddEntryModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <style>{`@media print { .print\:hidden { display: none !important; } button { display: none !important; } input, select { border: none !important; } }`}</style>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Ledger</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                    + Add Ledger
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg border bg-white shadow-md">
                <table className="min-w-full border-collapse">
                    <thead className="border-b bg-gray-100">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Name</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Alias</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ledgers.length > 0 ? (
                            ledgers.map((lg) => (
                                <tr key={lg._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 text-sm text-gray-800">{lg.name}</td>
                                    <td className="p-3 text-sm text-gray-800">{lg.alias || "-"}</td>
                                    <td className="p-3 text-sm text-gray-800">
                                        <button
                                            onClick={() => handleView(lg)}
                                            className="underline text-blue-600"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="p-3 text-center text-gray-500">
                                    No ledger entries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* add ledger modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Add Ledger</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Alias (optional)</label>
                                <input
                                    type="text"
                                    name="alias"
                                    value={formData.alias}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* view ledger modal */}
            {viewLedger && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full h-full max-w-full max-h-full rounded-none bg-white p-6 shadow-xl overflow-auto">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Ledger: {viewLedger.name}</h2>
                                <p className="text-sm">Alias: {viewLedger.alias || "-"}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.print()}
                                    className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 print:hidden"
                                >
                                    Print
                                </button>
                                <button
                                    onClick={() => setShowAddEntryModal(true)}
                                    className="flex items-center gap-2 rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 print:hidden"
                                >
                                    + Add Entry
                                </button>
                                <button
                                    onClick={closeView}
                                    className="text-gray-500 hover:text-gray-700 print:hidden"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="mb-2 flex justify-between items-center print:hidden">
                            <div>
                                <p className="text-sm"><strong>Alias:</strong> {viewLedger.alias || "-"}</p>
                            </div>
                            <div className="text-sm">
                                {filterStart || filterEnd ? (
                                    <span>Period: {filterStart || '--'} to {filterEnd || '--'}</span>
                                ) : null}
                            </div>
                        </div>

                        {/* date range controls */}
                        <div className="mb-4 flex gap-2 items-end print:hidden">
                            <div>
                                <label className="block text-xs text-gray-600">From</label>
                                <input
                                    type="date"
                                    value={filterStart}
                                    onChange={e=>setFilterStart(e.target.value)}
                                    className="mt-1 rounded-lg border p-1 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600">To</label>
                                <input
                                    type="date"
                                    value={filterEnd}
                                    onChange={e=>setFilterEnd(e.target.value)}
                                    className="mt-1 rounded-lg border p-1 text-sm"
                                />
                            </div>
                            <button
                                onClick={()=>{setFilterStart('');setFilterEnd('');}}
                                className="text-blue-600 underline text-sm"
                            >Clear</button>
                        </div>

                        {/* balances summary */}
                        <div className="mb-2 text-sm print:hidden">
                            <span className="mr-4">Opening: ₹{openingBalance}</span>
                            <span className="mr-4">Debit: ₹{totalDebit}</span>
                            <span className="mr-4">Credit: ₹{totalCredit}</span>
                            <span className="mr-4">Closing: ₹{closingBalance}</span>
                        </div>
                        {/* entries table */}
                        <div className="overflow-x-auto rounded-lg border bg-white shadow-md mb-4">
                            <table className="min-w-full border-collapse">
                                <thead className="border-b bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left text-sm font-semibold text-gray-600">#</th>
                                        <th className="p-2 text-left text-sm font-semibold text-gray-600">Date</th>
                                        <th className="p-2 text-left text-sm font-semibold text-gray-600">Particulars</th>
                                        <th className="p-2 text-left text-sm font-semibold text-gray-600">Vch Type</th>
                                        <th className="p-2 text-left text-sm font-semibold text-gray-600">Vch No</th>
                                        <th className="p-2 text-right text-sm font-semibold text-gray-600">Debit</th>
                                        <th className="p-2 text-right text-sm font-semibold text-gray-600">Credit</th>
                                        <th className="p-2 text-right text-sm font-semibold text-gray-600">Balance</th>
                                        <th className="p-2 text-left text-sm font-semibold text-gray-600 print:hidden">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEntries.length > 0 ? (
                                        filteredEntries.map((e, idx) => (
                                            <tr key={e._id} className="border-b hover:bg-gray-50">
                                                <td className="p-2 text-sm text-gray-800">{idx + 1}</td>
                                                <td className="p-2 text-sm text-gray-800">{new Date(e.date).toLocaleDateString()}</td>
                                                <td className="p-2 text-sm text-gray-800">{e.narration}</td>
                                                <td className="p-2 text-sm text-gray-800">{e.voucherType || ""}</td>
                                                <td className="p-2 text-sm text-gray-800">{e.voucherNumber || ""}</td>
                                                <td className="p-2 text-sm text-gray-800 text-right">{e.debit || "-"}</td>
                                                <td className="p-2 text-sm text-gray-800 text-right">{e.credit || "-"}</td>
                                                <td className="p-2 text-sm text-gray-800 text-right">{e.balance || "-"}</td>
                                                <td className="p-2 text-sm text-gray-800 print:hidden">
                                                    <button
                                                        onClick={() => startEdit(e)}
                                                        className="text-blue-600 underline mr-2"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => removeEntry(e._id)}
                                                        className="text-red-600 underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="p-3 text-center text-gray-500">
                                                No entries yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t font-semibold">
                                        <td colSpan="5" className="p-2 text-right">Totals:</td>
                                        <td className="p-2 text-right">{totalDebit}</td>
                                        <td className="p-2 text-right">{totalCredit}</td>
                                        <td className="p-2 text-right">{closingBalance}</td>
                                        <td></td>
                                    </tr>
                                    <tr className="font-semibold bg-gray-100">
                                        <td colSpan="8" className="p-2 text-right">Closing Balance:</td>
                                        <td className="p-2 text-right">{closingBalance}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* add entry form */}
                        {showAddEntryModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-xl font-semibold">{editingEntry ? "Edit Entry" : "Add Entry"}</h2>
                                        <button
                                            onClick={() => setShowAddEntryModal(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const amount = Number(entryForm.amount) || 0;
                                        if (amount <= 0) {
                                            alert("Enter a valid amount");
                                            return;
                                        }
                                        const isDebit = entryForm.type === "debit";
                                        const debit = isDebit ? amount : 0;
                                        const credit = !isDebit ? amount : 0;

                                        const isEditing = !!editingEntry;
                                        const method = isEditing ? "PUT" : "POST";
                                        const url = isEditing 
                                            ? `http://localhost:4000/ledger/${viewLedger._id}/entry/${editingEntry._id}`
                                            : `http://localhost:4000/ledger/${viewLedger._id}/entry`;

                                        try {
                                            const res = await fetch(url, {
                                                method,
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    date: entryForm.date,
                                                    narration: entryForm.narration,
                                                    voucherType: entryForm.voucherType,
                                                    voucherNumber: entryForm.voucherNumber,
                                                    debit,
                                                    credit,
                                                }),
                                            });
                                            const data = await res.json();
                                            if (res.ok) {
                                                alert(isEditing ? "Entry updated" : "Entry added");
                                                setEntryForm({ date: new Date().toISOString().split("T")[0], narration: "", voucherType: "journal", voucherNumber: "", type: "debit", amount: "" });
                                                setEditingEntry(null);
                                                setShowAddEntryModal(false);
                                                loadEntries();
                                            } else {
                                                alert(data.message || `Error ${isEditing ? 'updating' : 'adding'} entry`);
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert("Server error");
                                        }
                                    }}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={entryForm.date}
                                                    onChange={(e) => setEntryForm(prev => ({ ...prev, date: e.target.value }))}
                                                    className="mt-1 w-full rounded-lg border p-2"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Narration</label>
                                                <input
                                                    type="text"
                                                    name="narration"
                                                    value={entryForm.narration}
                                                    onChange={(e) => setEntryForm(prev => ({ ...prev, narration: e.target.value }))}
                                                    className="mt-1 w-full rounded-lg border p-2"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Voucher Type</label>
                                                <select
                                                    name="voucherType"
                                                    value={entryForm.voucherType}
                                                    onChange={(e) => setEntryForm(prev => ({ ...prev, voucherType: e.target.value }))}
                                                    className="mt-1 w-full rounded-lg border p-2"
                                                >
                                                    <option value="journal">Journal</option>
                                                    <option value="receipt">Receipt</option>
                                                    <option value="payment">Payment</option>
                                                    <option value="contra">Contra</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Voucher No</label>
                                                <input
                                                    type="text"
                                                    name="voucherNumber"
                                                    value={entryForm.voucherNumber}
                                                    onChange={(e) => setEntryForm(prev => ({ ...prev, voucherNumber: e.target.value }))}
                                                    className="mt-1 w-full rounded-lg border p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                                <select
                                                    name="type"
                                                    value={entryForm.type}
                                                    onChange={(e) => setEntryForm(prev => ({ ...prev, type: e.target.value }))}
                                                    className="mt-1 w-full rounded-lg border p-2"
                                                >
                                                    <option value="debit">Debit</option>
                                                    <option value="credit">Credit</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    value={entryForm.amount}
                                                    onChange={(e) => setEntryForm(prev => ({ ...prev, amount: e.target.value }))}
                                                    className="mt-1 w-full rounded-lg border p-2"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4 gap-2">
                                            {editingEntry && (
                                                <button type="button" onClick={cancelEdit} className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">Cancel</button>
                                            )}
                                            <button type="submit" className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800">{editingEntry ? "Update" : "Add"}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ledger;
