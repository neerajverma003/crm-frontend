import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

function CreateDestinationEmployee() {
  const [destination, setDestination] = useState("");
  const [destinations, setDestinations] = useState([]);

  // GET ALL destinations
  const fetchDestinations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employeedestination/`);
      const data = await res.json();

      if (Array.isArray(data.destinations)) {
        setDestinations(
          data.destinations.map((d) => ({
            id: d._id,
            name: d.destination,
          }))
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // ADD destination
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!destination.trim()) {
      alert("Please enter a destination");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employeedestination/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destination }),
      });

      if (!res.ok) {
        alert("Failed to add destination");
        return;
      }

      setDestination("");
      fetchDestinations(); // refresh table

    } catch (err) {
      console.error("POST error:", err);
    }
  };

  // DELETE destination
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this destination?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/employeedestination/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        // Remove from UI
        setDestinations(destinations.filter((d) => d.id !== id));
      } else {
        alert("Failed to delete");
      }

    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="w-full px-4 py-6 md:px-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Destination</h1>
        <p className="text-gray-500 text-sm mt-1">Add and manage travel destinations for employees.</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        
        {/* Form Section */}
        <div className="p-5 md:p-6 border-b border-gray-100 bg-gray-50/30">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter new destination (e.g., Paris, Tokyo)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm bg-blue-600 hover:bg-blue-700 hover:shadow active:scale-[0.99] whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Destination
            </button>
          </form>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 text-center">#</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Destination Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {destinations.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm">No destinations added yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                destinations.map((d, i) => (
                  <tr key={d.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 text-center font-medium">{i + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium capitalize">{d.name}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete destination"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CreateDestinationEmployee;
