import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";

const CreateBank = () => {
  const [bankName, setBankName] = useState("");
  const [banks, setBanks] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [editingBankId, setEditingBankId] = useState(null);
  const [editBankName, setEditBankName] = useState("");
  const [viewData, setViewData] = useState(null);

  // ✅ Fetch banks from backend
  const fetchBanks = async () => {
    try {
      const res = await fetch("http://localhost:4000/bank/");
      if (!res.ok) throw new Error("Failed to fetch banks");
      const data = await res.json();
      setBanks(data);
    } catch (error) {
      console.error("Error fetching banks:", error);
      alert("Failed to fetch banks");
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bankName.trim()) {
      alert("Please enter a bank name");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/bank/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankName: bankName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save bank");
      }

      alert("Bank created successfully ✅");
      setBankName("");
      fetchBanks();
    } catch (error) {
      console.error("Error saving bank:", error);
      alert(error.message || "Failed to save bank");
    }
  };

  // ✅ Handle Edit
  const handleEdit = async (bank) => {
    setViewData(null);
    setEditingBankId(bank._id);
    setEditBankName(bank.bankName);
  };

  // ✅ Handle Update
  const handleUpdate = async () => {
    if (!editBankName.trim()) {
      alert("Please enter a bank name");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/bank/${editingBankId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankName: editBankName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update bank");
      }

      alert("Bank updated successfully ✅");
      setEditingBankId(null);
      setEditBankName("");
      fetchBanks();
    } catch (error) {
      console.error("Error updating bank:", error);
      alert(error.message || "Failed to update bank");
    }
  };

  // ✅ Handle Delete
  const handleDelete = async (bankId) => {
    if (!window.confirm("Are you sure you want to delete this bank?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/bank/${bankId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete bank");

      alert("Bank deleted successfully ✅");
      fetchBanks();
    } catch (error) {
      console.error("Error deleting bank:", error);
      alert("Failed to delete bank");
    }
  };

  // ✅ Handle View
  const handleView = (bank) => {
    setViewData(bank);
  };

  // ✅ Cancel edit
  const handleCancelEdit = () => {
    setEditingBankId(null);
    setEditBankName("");
  };

  // ✅ Filter banks
  const filteredBanks = banks.filter((bank) =>
    bank.bankName.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Create Bank</h2>

      {/* ✅ Create/Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Bank Name *
          </label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Enter bank name"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold"
        >
          Save Bank
        </button>
      </form>

      {/* ✅ View Modal */}
      {viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Bank Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Bank Name</label>
                <p className="text-lg text-gray-900">{viewData.bankName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Created Date</label>
                <p className="text-lg text-gray-900">
                  {new Date(viewData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setViewData(null)}
              className="w-full mt-6 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ Edit Modal */}
      {editingBankId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Bank</h3>
            <input
              type="text"
              value={editBankName}
              onChange={(e) => setEditBankName(e.target.value)}
              placeholder="Enter bank name"
              className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Update
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search banks..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ✅ Banks Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b-2 border-gray-400">
              <th className="border border-gray-300 p-3 text-left font-semibold">
                Bank Name
              </th>
              <th className="border border-gray-300 p-3 text-left font-semibold">
                Created Date
              </th>
              <th className="border border-gray-300 p-3 text-center font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBanks.length > 0 ? (
              filteredBanks.map((bank) => (
                <tr key={bank._id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-300 p-3 text-gray-700">
                    {bank.bankName}
                  </td>
                  <td className="border border-gray-300 p-3 text-gray-700">
                    {new Date(bank.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleView(bank)}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(bank)}
                        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(bank._id)}
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border border-gray-300 p-3 text-center text-gray-500">
                  No banks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateBank;
