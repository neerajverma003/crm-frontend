import React, { useState, useEffect } from "react";
import { X, Search, FolderPlus, Trash, Edit, Plus, ChevronRight, ChevronDown, BookOpen, BarChart2, Folder, FileText, FolderOpen } from "lucide-react";

const Ledger = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", alias: "", groupId: "" });
    const [ledgers, setLedgers] = useState([]);
    const [viewLedger, setViewLedger] = useState(null);
    const [entries, setEntries] = useState([]);
    const [filterStart, setFilterStart] = useState("");
    const [filterEnd, setFilterEnd] = useState("");
    const [entryForm, setEntryForm] = useState({ date: new Date().toISOString().split("T")[0], narration: "", voucherType: "journal", voucherNumber: "", type: "debit", amount: "" });
    const [editingEntry, setEditingEntry] = useState(null);
    const [showAddEntryModal, setShowAddEntryModal] = useState(false);

    // New states for Ledger Groups
    const [activeTab, setActiveTab] = useState("groups");
    const [searchGroupQuery, setSearchGroupQuery] = useState("");
    const [searchLedgerQuery, setSearchLedgerQuery] = useState("");
    const [groups, setGroups] = useState([]);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [groupFormData, setGroupFormData] = useState({ name: "", members: [] });
    const [memberSearch, setMemberSearch] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);

    // fetch existing ledgers
    const fetchLedgers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/ledger/all`);
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

    // fetch all ledger groups
    const fetchGroups = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/ledger/group/all`);
            if (res.ok) {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await res.json();
                    setGroups(data);
                } else {
                    console.error("Non-json response received for groups");
                }
            } else {
                console.error("Failed to load groups (Status: " + res.status + ")");
            }
        } catch (err) {
            console.error("Error fetching groups:", err);
        }
    };

    useEffect(() => {
        fetchLedgers();
        fetchGroups();
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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/ledger`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    alias: formData.alias,
                    groupId: formData.groupId || undefined
                }),
            });
            const respData = await res.json();
            if (res.ok) {
                alert("Ledger created" + (formData.groupId ? " and added to selected group" : ""));
                setShowModal(false);
                setFormData({ name: "", alias: "", groupId: "" });
                fetchLedgers();
                fetchGroups(); // refresh groups so the new member shows up
            } else {
                alert(respData.message || "Error creating ledger");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };


    // Handle group creation / edit submission
    const handleGroupSubmit = async (e) => {
        e.preventDefault();
        if (!groupFormData.name.trim()) {
            alert("Please enter a group name");
            return;
        }
        
        const isEditing = !!editingGroup;
        const method = isEditing ? "PUT" : "POST";
        const url = isEditing 
            ? `${import.meta.env.VITE_API_URL}/ledger/group/${editingGroup._id}`
            : `${import.meta.env.VITE_API_URL}/ledger/group`;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: groupFormData.name.trim(),
                    members: groupFormData.members
                })
            });

            let data = {};
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            }

            if (res.ok) {
                alert(isEditing ? "Group updated successfully" : "Group created successfully");
                setShowGroupModal(false);
                setGroupFormData({ name: "", members: [] });
                setEditingGroup(null);
                fetchGroups();
            } else {
                alert(data.message || `Failed to save group (Status: ${res.status})`);
            }
        } catch (err) {
            console.error("Error saving group:", err);
            alert("Server error: " + err.message);
        }
    };

    // Delete a ledger group
    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/ledger/group/${groupId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                alert("Group deleted successfully");
                fetchGroups();
                if (selectedGroup?._id === groupId) setSelectedGroup(null);
            } else {
                alert("Failed to delete group");
            }
        } catch (err) {
            console.error("Error deleting group:", err);
            alert("Server error");
        }
    };

    // Toggle ledger inclusion when creating or editing group
    const handleToggleMember = (ledger) => {
        setGroupFormData(prev => {
            const exists = prev.members.some(m => m.id === ledger._id);
            if (exists) {
                return {
                    ...prev,
                    members: prev.members.filter(m => m.id !== ledger._id)
                };
            } else {
                return {
                    ...prev,
                    members: [...prev.members, { id: ledger._id, name: ledger.name, alias: ledger.alias }]
                };
            }
        });
    };

    const handleView = (ledger) => {
        setFilterStart("");
        setFilterEnd("");
        setViewLedger(ledger);
    };

    const loadEntries = async () => {
        if (!viewLedger) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/ledger/${viewLedger._id}/entries`);
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

    // Filter groups by group name or member ledger name/alias
    const filteredGroups = React.useMemo(() => {
        if (!searchGroupQuery.trim()) return groups;
        const q = searchGroupQuery.toLowerCase();
        return groups.filter(g => 
            g.name.toLowerCase().includes(q) ||
            g.members.some(m => 
                m.name.toLowerCase().includes(q) || 
                (m.alias && m.alias.toLowerCase().includes(q))
            )
        );
    }, [groups, searchGroupQuery]);

    // Filter standard ledgers list
    const filteredLedgersList = React.useMemo(() => {
        if (!searchLedgerQuery.trim()) return ledgers;
        const q = searchLedgerQuery.toLowerCase();
        return ledgers.filter(l => 
            l.name.toLowerCase().includes(q) ||
            (l.alias && l.alias.toLowerCase().includes(q))
        );
    }, [ledgers, searchLedgerQuery]);

    // Filter ledgers for selection within Group Modal
    const filteredLedgersForSelection = React.useMemo(() => {
        if (!memberSearch.trim()) return ledgers;
        const q = memberSearch.toLowerCase();
        return ledgers.filter(l => 
            l.name.toLowerCase().includes(q) || 
            (l.alias && l.alias.toLowerCase().includes(q))
        );
    }, [ledgers, memberSearch]);

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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/ledger/${viewLedger._id}/entry/${entryId}`, {
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
            
            <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart2 className="text-blue-600" size={28} /> Accounts Ledger Management
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">Organize accounts, create groups, associate ledgers, and track transactions.</p>
                </div>
            </div>

            {/* TAB SELECTION BAR */}
            <div className="flex gap-4 border-b border-gray-200 pb-3 mb-6">
                <button
                    onClick={() => setActiveTab("groups")}
                    className={`px-5 py-2.5 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${
                        activeTab === "groups"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 border hover:bg-gray-100"
                    }`}
                >
                    <Folder size={16} /> Ledger Groups
                </button>
                <button
                    onClick={() => setActiveTab("ledgers")}
                    className={`px-5 py-2.5 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${
                        activeTab === "ledgers"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 border hover:bg-gray-100"
                    }`}
                >
                    <FileText size={16} /> All Ledgers
                </button>
            </div>

            {/* LEDGER GROUPS TAB */}
            {activeTab === "groups" && (
                <div className="space-y-6">
                    {/* Search & Actions Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
                        <div className="relative w-full sm:max-w-md">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Search groups or ledger names..."
                                value={searchGroupQuery}
                                onChange={(e) => setSearchGroupQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50/50"
                            />
                            {searchGroupQuery && (
                                <button
                                    onClick={() => setSearchGroupQuery("")}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setEditingGroup(null);
                                setGroupFormData({ name: "", members: [] });
                                setShowGroupModal(true);
                            }}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-md w-full sm:w-auto justify-center transition-all"
                        >
                            <FolderPlus size={18} />
                            Create Ledger Group
                        </button>
                    </div>

                    {/* Group Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => {
                                const isExpanded = selectedGroup?._id === group._id;
                                return (
                                    <div
                                        key={group._id}
                                        className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                                            isExpanded ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200"
                                        }`}
                                    >
                                        {/* Card Header */}
                                        <div className="p-5 flex items-start justify-between bg-gradient-to-br from-gray-50 to-white border-b">
                                            <div className="space-y-1 cursor-pointer flex-1" onClick={() => setSelectedGroup(isExpanded ? null : group)}>
                                                <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                                                    <Folder className="text-blue-500" size={18} /> {group.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-semibold">
                                                    Total Ledgers: <span className="text-blue-600 font-bold">{group.members?.length || 0}</span>
                                                </p>
                                            </div>
                                            <div className="flex gap-1.5 ml-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingGroup(group);
                                                        setGroupFormData({ name: group.name, members: group.members || [] });
                                                        setShowGroupModal(true);
                                                    }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Edit Group"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGroup(group._id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Group"
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card Quick Preview */}
                                        <div className="p-5 space-y-3">
                                            {group.members && group.members.length > 0 ? (
                                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                                    {group.members.slice(0, 3).map((member) => (
                                                        <div key={member.id} className="flex justify-between items-center text-xs border-b border-dashed border-gray-100 pb-1.5 last:border-0 last:pb-0">
                                                            <div className="min-w-0 flex-1 pr-2">
                                                                <span className="font-semibold text-gray-700 block truncate">{member.name}</span>
                                                                {member.alias && (
                                                                    <span className="text-gray-400 block text-[10px] truncate">{member.alias}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {group.members.length > 3 && (
                                                        <button
                                                            onClick={() => setSelectedGroup(isExpanded ? null : group)}
                                                            className="text-blue-600 text-xs font-bold hover:underline block text-center w-full pt-1.5"
                                                        >
                                                            + {group.members.length - 3} more ledgers
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400 text-center py-4">No ledgers added to this group yet.</p>
                                            )}
                                        </div>

                                        {/* Expand Toggle */}
                                        <button
                                            onClick={() => setSelectedGroup(isExpanded ? null : group)}
                                            className="w-full py-3 bg-gray-50 hover:bg-gray-100 border-t text-xs font-bold text-gray-600 flex items-center justify-center gap-1.5 transition-all"
                                        >
                                            {isExpanded ? "Hide Group Details" : "View Group Details"}
                                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full bg-white border rounded-xl p-12 flex flex-col items-center justify-center text-gray-400 shadow-sm font-medium gap-3">
                                <FolderOpen size={32} className="text-gray-300" />
                                No ledger groups found. Create a group and add ledgers to track them!
                            </div>
                        )}
                    </div>

                    {/* Selected Group Detailed Ledgers Table */}
                    {selectedGroup && (
                        <div className="bg-white rounded-2xl border border-blue-200 shadow-lg p-6 space-y-4 animate-fadeIn">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                        <FolderOpen className="text-blue-600" size={20} /> Group Ledgers: {selectedGroup.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Showing all {selectedGroup.members?.length || 0} ledgers in this group.</p>
                                </div>
                                <button
                                    onClick={() => setSelectedGroup(null)}
                                    className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-gray-150">
                                <table className="min-w-full border-collapse text-left">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="p-3.5 text-xs font-bold text-gray-600 uppercase tracking-wider">Ledger Name</th>
                                            <th className="p-3.5 text-xs font-bold text-gray-600 uppercase tracking-wider">Alias</th>
                                            <th className="p-3.5 text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedGroup.members && selectedGroup.members.length > 0 ? (
                                            selectedGroup.members.map((member) => (
                                                <tr key={member.id} className="hover:bg-gray-50/50 transition-all">
                                                    <td className="p-3.5 text-sm font-semibold text-gray-800">{member.name}</td>
                                                    <td className="p-3.5 text-sm text-gray-600">{member.alias || "-"}</td>
                                                    <td className="p-3.5 text-sm">
                                                        <button
                                                            onClick={() => {
                                                                const target = ledgers.find(l => l._id === member.id);
                                                                if (target) {
                                                                    handleView(target);
                                                                } else {
                                                                    handleView({ _id: member.id, name: member.name, alias: member.alias });
                                                                }
                                                            }}
                                                            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm transition-all"
                                                        >
                                                            View Ledger
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="p-8 text-center text-gray-400 text-sm font-medium">
                                                    No ledgers in this group yet. Edit this group to add ledgers.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ALL LEDGERS TAB */}
            {activeTab === "ledgers" && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
                        <div className="relative w-full sm:max-w-md">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Search ledger name or alias..."
                                value={searchLedgerQuery}
                                onChange={(e) => setSearchLedgerQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50/50"
                            />
                            {searchLedgerQuery && (
                                <button
                                    onClick={() => setSearchLedgerQuery("")}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 shadow-sm justify-center w-full sm:w-auto"
                        >
                            + Add Ledger
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
                        <table className="min-w-full border-collapse">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="p-4 text-left text-sm font-bold text-gray-600">Ledger Name</th>
                                    <th className="p-4 text-left text-sm font-bold text-gray-600">Alias</th>
                                    <th className="p-4 text-left text-sm font-bold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLedgersList.length > 0 ? (
                                    filteredLedgersList.map((lg) => (
                                        <tr key={lg._id} className="border-b hover:bg-gray-50">
                                            <td className="p-4 text-sm font-medium text-gray-800">{lg.name}</td>
                                            <td className="p-4 text-sm text-gray-500">{lg.alias || "-"}</td>
                                            <td className="p-4 text-sm">
                                                <button
                                                    onClick={() => handleView(lg)}
                                                    className="underline font-semibold text-blue-600 hover:text-blue-800"
                                                >
                                                    View Transactions
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-8 text-center text-gray-400 text-sm font-medium">
                                            No matching ledgers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* CREATE / EDIT GROUP MODAL */}
            {showGroupModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border animate-scaleIn">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <FolderPlus size={20} /> {editingGroup ? "Edit Ledger Group" : "Create Ledger Group"}
                            </h2>
                            <button
                                onClick={() => setShowGroupModal(false)}
                                className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleGroupSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Group Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Employee Accounts, Branch Ledgers"
                                    value={groupFormData.name}
                                    onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                                    required
                                    className="w-full rounded-lg border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                />
                            </div>

                            {/* Select ledgers checklist */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    Select Ledgers to Add ({groupFormData.members.length} selected)
                                </label>
                                
                                {/* Inner Search Input */}
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                        <Search size={14} />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search ledger name or alias..."
                                        value={memberSearch}
                                        onChange={(e) => setMemberSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-gray-50"
                                    />
                                    {memberSearch && (
                                        <button
                                            type="button"
                                            onClick={() => setMemberSearch("")}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>

                                <div className="border rounded-lg max-h-56 overflow-y-auto divide-y divide-gray-100 bg-gray-50/50">
                                    {filteredLedgersForSelection.length > 0 ? (
                                        filteredLedgersForSelection.map((ledger) => {
                                            const isChecked = groupFormData.members.some(m => m.id === ledger._id);
                                            return (
                                                <div
                                                    key={ledger._id}
                                                    onClick={() => handleToggleMember(ledger)}
                                                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-white cursor-pointer transition-all select-none"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => {}} // toggled by parent div click
                                                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 shrink-0"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-bold text-gray-800 truncate">{ledger.name}</p>
                                                        <p className="text-[10px] text-gray-500 truncate">{ledger.alias || "-"}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-gray-400 text-center py-6">No matching ledgers found.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowGroupModal(false)}
                                    className="px-4 py-2 border rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-md transition-all"
                                >
                                    {editingGroup ? "Save Changes" : "Create Group"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* add ledger modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Add Ledger</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-lg border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Alias (optional)</label>
                                <input
                                    type="text"
                                    name="alias"
                                    value={formData.alias}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Add to Group <span className="text-gray-400 font-normal text-xs">(optional)</span>
                                </label>
                                <select
                                    name="groupId"
                                    value={formData.groupId}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                                >
                                    <option value="">-- Select a Group (optional) --</option>
                                    {groups.map(g => (
                                        <option key={g._id} value={g._id}>{g.name}</option>
                                    ))}
                                </select>
                                {groups.length === 0 && (
                                    <p className="text-xs text-gray-400 mt-1">No groups created yet. Create a group first from the Ledger Groups tab.</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 shadow-sm"
                                >
                                    Save Ledger
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* view ledger modal */}
            {viewLedger && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full h-full max-w-full max-h-full rounded-none bg-white p-6 shadow-xl overflow-auto animate-scaleIn">
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
                                            ? `${import.meta.env.VITE_API_URL}/ledger/${viewLedger._id}/entry/${editingEntry._id}`
                                            : `${import.meta.env.VITE_API_URL}/ledger/${viewLedger._id}/entry`;

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
