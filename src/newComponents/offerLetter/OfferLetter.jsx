import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OfferLetter = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [offerLetters, setOfferLetters] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    employee: "",
    candidateName: "",
    designation: "",
    department: "",
    joiningDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    salary: "",
    status: "Draft",
    letterContent: "",
  });

  const fetchOfferLetters = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/offer-letter");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load offer letters");
      setOfferLetters(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to fetch offer letters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferLetters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/offer-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create offer letter");
      setOfferLetters((prev) => [data.data, ...prev]);
      setFormData({
        employee: "",
        candidateName: "",
        designation: "",
        department: "",
        joiningDate: new Date().toISOString().split("T")[0],
        expiryDate: "",
        salary: "",
        status: "Draft",
        letterContent: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to save offer letter");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer letter?")) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/offer-letter/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      setOfferLetters((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-[#eff3f8] via-[#f8faff] to-[#eef2f6] py-8 px-4 sm:px-8">
      <div className="mx-auto w-full max-w-8xl rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur-sm">
        <div className="mb-6 flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Offer Letter Management</h1>
            <p className="text-sm text-slate-500">Add and manage offer letters in HRMS.</p>
          </div>
          <button
            onClick={() => navigate("/offer-letter-format")}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Create Format
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <input
          type="text"
          name="candidateName"
          value={formData.candidateName}
          onChange={handleChange}
          placeholder="Candidate Name"
          className="rounded-md border border-gray-300 px-3 py-2"
          required
        />
        <input
          type="text"
          name="employee"
          value={formData.employee}
          onChange={handleChange}
          placeholder="Employee ID"
          className="rounded-md border border-gray-300 px-3 py-2"
          required
        />
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Designation"
          className="rounded-md border border-gray-300 px-3 py-2"
        />
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Department"
          className="rounded-md border border-gray-300 px-3 py-2"
        />
        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2"
        />
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2"
        />
        <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="rounded-md border border-gray-300 px-3 py-2"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="Draft">Draft</option>
          <option value="Sent">Sent</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>

        <textarea
          name="letterContent"
          value={formData.letterContent}
          onChange={handleChange}
          rows={4}
          placeholder="Offer letter content"
          className="col-span-1 sm:col-span-2 lg:col-span-3 rounded-md border border-gray-300 px-3 py-2"
        />

        <button
          type="submit"
          className="col-span-1 sm:col-span-2 lg:col-span-3 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Create Offer Letter"}
        </button>
      </form>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Candidate</th>
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Joining</th>
              <th className="px-4 py-2 text-left">Expiry</th>
              <th className="px-4 py-2 text-left">Salary</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {offerLetters.map((offer) => (
              <tr key={offer._id} className="transition hover:bg-slate-50">
                <td className="px-4 py-2 font-medium text-slate-700">{offer.candidateName}</td>
                <td className="px-4 py-2 text-slate-600">{offer.employee?.fullName || offer.employee}</td>
                <td className="px-4 py-2 text-sm">
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-blue-700">
                    {offer.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-600">{offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-2 text-slate-600">{offer.expiryDate ? new Date(offer.expiryDate).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-2 text-slate-600">{offer.salary}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(offer._id)}
                    className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

export default OfferLetter;
