import React, { useEffect, useState } from "react";
import { FiPlus, FiEye, FiEdit, FiX, FiTrash2 } from "react-icons/fi";

function DisputeClients() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("add"); // add | view | edit
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);

  // form state
  const initialForm = {
    fullName: "",
    type: "client",
    phone: "",
    whatsapp: "",
    email: "",
    location: "",
    issues: "",
  };

  const [form, setForm] = useState(initialForm);
  const API_BASE = "http://localhost:4000/dispute-clients";

  // Fetch all dispute clients
  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/all`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
      } else {
        console.error("Failed to fetch disputes");
      }
    } catch (error) {
      console.error("Error fetching disputes:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setMode("add");
    setForm(initialForm);
    setCurrent(null);
    setIsModalOpen(true);
  };

  const openView = (item) => {
    setMode("view");
    setForm(item);
    setCurrent(item);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setMode("edit");
    setForm(item);
    setCurrent(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(initialForm);
    setCurrent(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.type.trim()) return "Type is required";
    if (!form.phone.trim()) return "Phone is required";
    if (form.issues.length > 8000) return "Issues must be <= 8000 characters";
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    try {
      if (mode === "add") {
        // Create new
        const res = await fetch(`${API_BASE}/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          setItems((prev) => [data.data, ...prev]);
          closeModal();
          alert("Created successfully");
        } else {
          alert(data.message || "Failed to create");
        }
      } else if (mode === "edit" && current) {
        // Update existing
        const res = await fetch(`${API_BASE}/${current._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          setItems((prev) => prev.map((it) => (it._id === current._id ? data.data : it)));
          closeModal();
          alert("Updated successfully");
        } else {
          alert(data.message || "Failed to update");
        }
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving dispute client: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((it) => it._id !== id));
        alert("Deleted successfully");
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting dispute client");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dispute Management</h1>
            <p className="text-gray-500 mt-1">Manage and track dispute clients</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <FiPlus size={20} /> Add New
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Table Wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm">Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Type</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Phone</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Email</th>
                  <th className="px-6 py-4 text-center font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500 font-medium">Loading records...</p>
                      </div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-gray-400 text-5xl">📋</div>
                        <p className="text-gray-500 font-medium">No records yet</p>
                        <p className="text-gray-400 text-sm">Start by adding a new dispute client</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((it, idx) => (
                    <tr
                      key={it._id}
                      className="hover:bg-blue-50 transition-colors duration-200 border-0"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {it.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">{it.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            it.type === "client"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current"></span>
                          {it.type?.charAt(0).toUpperCase() + it.type?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 font-medium">{it.phone || "-"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm">{it.email || "-"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openView(it)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                            title="View"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() => openEdit(it)}
                            className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors duration-200"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(it._id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Total Records: <span className="font-semibold text-gray-900">{items.length}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-auto max-h-[90vh] animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-blue-50">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {mode === "add" && " Add New Dispute Client"}
                  {mode === "view" && " View Dispute Client"}
                  {mode === "edit" && " Edit Dispute Client"}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                    placeholder="Enter full name"
                    className={`w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 ${
                      mode === "view" ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    disabled={mode === "view"}
                    className={`w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 ${
                      mode === "view" ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                    }`}
                  >
                    <option value="client">Client</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                    placeholder="Enter phone number"
                    className={`w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 ${
                      mode === "view" ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                    placeholder="Enter WhatsApp number"
                    className={`w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 ${
                      mode === "view" ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                    placeholder="Enter email address"
                    className={`w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 ${
                      mode === "view" ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location Address
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                    placeholder="Enter location address"
                    className={`w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 ${
                      mode === "view" ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </div>
              </div>

              {/* Issues Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Issues Details <span className="text-gray-500 font-normal">(Max 8000 characters)</span>
                </label>
                <textarea
                  name="issues"
                  value={form.issues}
                  onChange={handleChange}
                  readOnly={mode === "view"}
                  rows={6}
                  placeholder="Describe the issues in detail..."
                  className={`w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none ${
                    mode === "view" ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                  }`}
                />
                <div className="flex justify-end mt-2">
                  <span
                    className={`text-xs font-medium ${
                      form.issues.length > 8000 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {form.issues.length}/8000 characters
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                {mode !== "view" && (
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {mode === "add" ? "Create" : "Update"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisputeClients;
