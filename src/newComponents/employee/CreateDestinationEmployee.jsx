import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

function CreateDestinationEmployee() {
  const [destination, setDestination] = useState("");
  const [destinations, setDestinations] = useState([]);

  // GET ALL destinations
  const fetchDestinations = async () => {
    try {
      const res = await fetch("http://localhost:4000/employeedestination/");
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
      const res = await fetch("http://localhost:4000/employeedestination/", {
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
        `http://localhost:4000/employeedestination/${id}`,
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
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create Destination</h2>

      {/* Add Destination Form */}
      <form onSubmit={handleAdd} className="flex gap-3 mb-5">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {/* Destination Table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">#</th>
            <th className="border p-2">Destination</th>
            <th className="border p-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {destinations.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center p-4 text-gray-500">
                No destinations added yet.
              </td>
            </tr>
          ) : (
            destinations.map((d, i) => (
              <tr key={d.id}>
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2 capitalize">{d.name}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CreateDestinationEmployee;
