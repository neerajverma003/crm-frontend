import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const B2bDestination = () => {
    const [formData, setFormData] = useState({
        countryName: "India",
        state: "",
    });

    const [b2bStates, setB2bStates] = useState([]);

    // -------------------------------------------------------------------
    //  Fetch B2B States
    // -------------------------------------------------------------------
    const fetchB2bStates = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bstate`);
            const data = await res.json();
            setB2bStates(data);
        } catch (error) {
            console.error("Error fetching B2B states:", error);
        }
    };

    useEffect(() => {
        fetchB2bStates();
    }, []);

    // -------------------------------------------------------------------
    // Input change handler
    // -------------------------------------------------------------------
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // -------------------------------------------------------------------
    // Save B2B State
    // -------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.state) {
            alert("State is required");
            return;
        }

        const payload = {
            country: "India",
            state: formData.state,
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bstate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save B2B state");

            alert("B2B State saved successfully ✓");

            fetchB2bStates();

            // Reset
            setFormData({
                countryName: "India",
                state: "",
            });
        } catch (error) {
            console.error(error);
            alert("Failed to save B2B state");
        }
    };

    // -------------------------------------------------------------------
    // Delete B2B State
    // -------------------------------------------------------------------
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this state?")) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bstate/${id}`, {
                    method: "DELETE",
                });

                if (!res.ok) throw new Error("Failed to delete B2B state");

                alert("B2B State deleted successfully ✓");
                fetchB2bStates();
            } catch (error) {
                console.error(error);
                alert("Failed to delete B2B state");
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto my-4 sm:my-10 px-4 sm:px-6 lg:px-8">
            <div className="md:bg-white md:shadow-sm md:border md:border-slate-200 md:rounded-3xl p-0 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6 sm:mb-8">
                    <div>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">B2B State Management</h2>
                        <p className="text-xs sm:text-base text-slate-500 font-medium mt-1">Manage destination states for your B2B network</p>
                    </div>
                </div>

                <div className="space-y-6 sm:space-y-10">
                    {/* FORM SECTION */}
                    <div>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
                            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-5 flex items-center gap-2">
                                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Add New State
                            </h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end">
                                {/* COUNTRY */}
                                <div className="w-full">
                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 sm:mb-2">Country</label>
                                    <input
                                        type="text"
                                        value="India"
                                        readOnly
                                        className="w-full border-2 border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-100 text-slate-500 font-bold cursor-not-allowed text-xs sm:text-base"
                                    />
                                </div>

                                {/* STATE */}
                                <div className="w-full">
                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 sm:mb-2">State Name</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full border-2 border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800 text-xs sm:text-base"
                                        placeholder="e.g. Maharashtra"
                                        required
                                    />
                                </div>

                                <div className="w-full mt-2 sm:mt-0">
                                    <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-bold py-2.5 sm:py-3.5 rounded-xl shadow-md shadow-blue-500/20 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-base">
                                        <span>Save Destination</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* LIST SECTION */}
                    <div>
                        <div className="md:bg-white md:border md:border-slate-200 md:rounded-2xl overflow-hidden md:shadow-sm">
                            <div className="p-3 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <h3 className="text-sm sm:text-base font-bold text-slate-800">Active Destinations</h3>
                                <span className="bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    {b2bStates.length} Total
                                </span>
                            </div>

                        {b2bStates.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 font-medium bg-slate-50/50 text-xs sm:text-sm">
                                No B2B states configured yet. Add one from the form.
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 font-bold border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4 w-16">#</th>
                                                <th className="px-6 py-4">Country</th>
                                                <th className="px-6 py-4">State</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {b2bStates.map((s, index) => (
                                                <tr key={s._id} className="hover:bg-blue-50/30 transition-colors">
                                                    <td className="px-6 py-4 font-semibold text-slate-400">{index + 1}</td>
                                                    <td className="px-6 py-4 font-bold text-slate-800">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs border border-slate-200">
                                                            🇮🇳 {s.country}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-blue-900 text-base">{s.state}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleDelete(s._id)}
                                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="block md:hidden divide-y divide-slate-100">
                                    {b2bStates.map((s, index) => (
                                        <div key={s._id} className="p-3 sm:p-4 flex items-center justify-between hover:bg-slate-50 transition-colors gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-wide">#{index + 1} • {s.country}</div>
                                                <div className="text-xs sm:text-sm font-extrabold text-slate-800 truncate" title={s.state}>{s.state}</div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(s._id)}
                                                className="flex items-center justify-center px-2.5 py-1 sm:py-1.5 rounded-lg bg-rose-50 text-rose-600 font-bold text-[10px] sm:text-xs hover:bg-rose-100 active:scale-95 transition-all whitespace-nowrap shrink-0"
                                            >
                                                <FaTrash size={12} className="mr-1.5" /> Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default B2bDestination;
