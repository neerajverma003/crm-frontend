import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const B2bDestination = () => {
  const [formData, setFormData] = useState({ countryName: "India", state: "" });
  const [b2bStates, setB2bStates] = useState([]);

  const fetchB2bStates = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bstate`);
      const data = await res.json();
      setB2bStates(data);
    } catch (error) {
      console.error("Error fetching B2B states:", error);
    }
  };

  useEffect(() => { fetchB2bStates(); }, []);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.state) { alert("State is required"); return; }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bstate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: "India", state: formData.state }),
      });
      if (!res.ok) throw new Error("Failed to save B2B state");
      alert("B2B State saved successfully ✓");
      fetchB2bStates();
      setFormData({ countryName: "India", state: "" });
    } catch (error) {
      alert("Failed to save B2B state");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this state?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bstate/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        alert("B2B State deleted successfully ✓");
        fetchB2bStates();
      } catch (error) {
        alert("Failed to delete B2B state");
      }
    }
  };

  const inputBase =
    "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 hover:border-slate-300";

  const labelBase = "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5";

  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sans">

      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-400" />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">

        {/* Page header */}
        <div className="mb-8 flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-500">CRM / B2B</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Destination States
          </h1>
          <p className="text-sm text-slate-500">Configure destination states for your B2B partner network.</p>
        </div>

        {/* Add form card */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Card header */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Add New State</h2>
              <p className="text-xs text-slate-400">Enter a state name to register it as a B2B destination.</p>
            </div>
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-3 sm:items-end">
            {/* Country – read only */}
            <div>
              <label className={labelBase}>Country</label>
              <input
                type="text"
                value="India"
                readOnly
                className="w-full rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed outline-none"
              />
            </div>

            {/* State name */}
            <div>
              <label className={labelBase}>State Name</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="e.g. Maharashtra"
                required
                className={inputBase}
              />
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 hover:-translate-y-px active:translate-y-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                Save Destination
              </button>
            </div>
          </form>
        </div>

        {/* List card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 15.227 17 12.786 17 9A7 7 0 1 0 3 9c0 3.786 1.698 6.227 3.355 7.584.829.799 1.654 1.381 2.273 1.765.31.193.571.337.757.433a5.741 5.741 0 0 0 .281.14l.018.008.006.003ZM10 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-slate-800">Active Destinations</h2>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
              {b2bStates.length} {b2bStates.length === 1 ? "state" : "states"}
            </span>
          </div>

          {b2bStates.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-slate-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <p className="text-sm font-semibold text-slate-400">No destinations yet</p>
              <p className="text-xs text-slate-400">Add a state above to get started.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 w-14">#</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Country</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">State</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {b2bStates.map((s, index) => (
                      <tr key={s._id} className="hover:bg-violet-50/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">{String(index + 1).padStart(2, "0")}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            🇮🇳 {s.country}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-800">{s.state}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(s._id)}
                            title="Delete"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-400 transition hover:bg-red-100 hover:text-red-600"
                          >
                            <FaTrash className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="block md:hidden divide-y divide-slate-100">
                {b2bStates.map((s, index) => (
                  <div key={s._id} className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs text-slate-400 shrink-0">{String(index + 1).padStart(2, "0")}</span>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">🇮🇳 {s.country}</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{s.state}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors shrink-0"
                    >
                      <FaTrash className="h-3 w-3" /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default B2bDestination;