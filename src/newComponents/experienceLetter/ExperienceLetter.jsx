
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

const ExperienceLetter = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [experienceLetters, setExperienceLetters] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [activeCompanyId, setActiveCompanyId] = useState("");
    const [error, setError] = useState("");
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        refNumber: "",
        issueDate: new Date().toISOString().split("T")[0],
        employeeName: "",
        designation: "",
        joiningDate: "",
        relievingDate: "",
        status: "Draft",
    });

    // Fetch initial data on load
    useEffect(() => {
        fetchExperienceLetters();
        fetchCompanies();
        fetchNextRefNumber();
    }, []);

    const fetchExperienceLetters = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/experience-letter`);
            const data = await res.json();
            if (data.success) {
                setExperienceLetters(data.data || []);
            }
        } catch (err) {
            console.error(err);
            setError("Unable to fetch experience letters");
        } finally {
            setLoading(false);
        }
    };

    

    const fetchCompanies = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/company/all`);
            const data = await res.json();
            const list = Array.isArray(data.companies) ? data.companies : data.companies || data;
            setCompanies(list || []);
            if (list && list.length > 0) {
                setActiveCompanyId(list[0]._id);
            }
        } catch (err) {
            console.error(err);
            setError("Unable to load companies");
        }
    };

    const fetchNextRefNumber = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/experience-letter/ref`);
            const data = await res.json();
            if (data.success) {
                setFormData((prev) => ({ ...prev, refNumber: data.refNumber }));
            }
        } catch (err) {
            console.error("Error fetching ref number:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = (letter) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setEditId(letter._id);
        setActiveCompanyId(letter.companyId?._id || letter.companyId);
        setFormData({
            refNumber: letter.refNumber,
            issueDate: new Date(letter.issueDate).toISOString().split("T")[0],
            employeeName: letter.employeeName,
            designation: letter.designation,
            joiningDate: new Date(letter.joiningDate).toISOString().split("T")[0],
            relievingDate: new Date(letter.relievingDate).toISOString().split("T")[0],
            status: letter.status || "Draft",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!activeCompanyId) {
            return setError("Please select a company first.");
        }

        try {
            setLoading(true);
            const payload = {
                ...formData,
                companyId: activeCompanyId,
            };

            const url = editId 
                ? `${import.meta.env.VITE_API_URL}/experience-letter/${editId}`
                : `${import.meta.env.VITE_API_URL}/experience-letter`;

            const res = await fetch(url, {
                method: editId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to save experience letter");

            // Reset form
            setFormData({
                refNumber: "",
                issueDate: new Date().toISOString().split("T")[0],
                employeeName: "",
                designation: "",
                joiningDate: "",
                relievingDate: "",
                status: "Draft",
            });
            setEditId(null);
            fetchExperienceLetters();
            fetchNextRefNumber();
        } catch (err) {
            console.error(err);
            setError(err.message || "Unable to save experience letter");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this experience letter?")) return;
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/experience-letter/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setExperienceLetters((prev) => prev.filter((item) => item._id !== id));
            }
        } catch (err) {
            console.error(err);
            setError("Unable to delete letter");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] bg-gradient-to-br from-[#eff3f8] via-[#f8faff] to-[#eef2f6] py-4 sm:py-8 px-0 sm:px-8">
            <div className="mx-auto w-full max-w-8xl sm:rounded-3xl border-0 sm:border border-slate-200 bg-white/95 p-4 sm:p-6 shadow-none sm:shadow-xl backdrop-blur-sm">

                {/* Header */}
                <div className="mb-6 flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-0">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">Experience Letter Management</h1>
                        <p className="text-sm text-slate-500">Generate and manage experience letters for employees.</p>
                    </div>
                    <button
                        onClick={() => navigate("/experience-letter-format")}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                        Create Format
                    </button>
                </div>

                {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}

                <form onSubmit={handleSubmit} className="mb-8 space-y-6">

                    {/* COMPANY SELECTION */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <h3 className="mb-4 text-lg font-bold text-slate-900">COMPANY</h3>
                        <select
                            name="company"
                            value={activeCompanyId || ""}
                            onChange={(e) => setActiveCompanyId(e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
                        >
                            <option value="">Select Company</option>
                            {companies.map((company) => (
                                <option key={company._id} value={company._id}>
                                    {company.companyName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* LETTER DETAILS */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <h3 className="mb-4 text-lg font-bold text-slate-900">LETTER DETAILS</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold">Reference Number</label>
                                <input
                                    type="text"
                                    name="refNumber"
                                    value={formData.refNumber}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold">Issue Date</label>
                                <input
                                    type="date"
                                    name="issueDate"
                                    value={formData.issueDate}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* EMPLOYEE INFORMATION */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <h3 className="mb-4 text-lg font-bold text-slate-900">EMPLOYEE INFORMATION</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold">Employee Name</label>
                                <input
                                    type="text"
                                    name="employeeName"
                                    value={formData.employeeName}
                                    onChange={handleChange}
                                    placeholder="e.g. Neeraj"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior Web Developer"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold">Joining Date</label>
                                <input
                                    type="date"
                                    name="joiningDate"
                                    value={formData.joiningDate}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold">Relieving Date</label>
                                <input
                                    type="date"
                                    name="relievingDate"
                                    value={formData.relievingDate}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : editId ? "Update Experience Letter" : "Create Experience Letter"}
                    </button>
                </form>

                {/* DATA TABLE */}
                {/* DATA TABLE */}
                <div className="md:rounded-2xl md:border md:border-slate-200 md:shadow-sm bg-transparent md:bg-white overflow-hidden px-4 sm:px-0 mt-8">
                    {experienceLetters.length === 0 ? (
                        <p className="text-center text-gray-500 italic py-6">No experience letters found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                                <thead className="bg-slate-50 text-slate-600 font-semibold">
                                    <tr>
                                        <th className="px-4 py-4 text-left">Ref Number</th>
                                        <th className="px-4 py-4 text-left">Employee Name</th>
                                        <th className="px-4 py-4 text-left">Designation</th>
                                        <th className="px-4 py-4 text-left">Status</th>
                                        <th className="px-4 py-4 text-left">Tenure</th>
                                        <th className="px-4 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {experienceLetters.map((letter) => (
                                        <tr key={letter._id} className="transition hover:bg-slate-50">
                                            <td className="px-4 py-4 text-slate-800 font-medium">{letter.refNumber}</td>
                                            <td className="px-4 py-4 text-slate-800 font-medium">{letter.employeeName}</td>
                                            <td className="px-4 py-4 text-slate-600">{letter.designation}</td>
                                            <td className="px-4 py-4">
                                                <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 border border-yellow-200">
                                                    {letter.status || "Draft"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-slate-600">
                                                {new Date(letter.joiningDate).toLocaleDateString()} - {new Date(letter.relievingDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => navigate(`/preview-experience-letter/${letter._id}`)}
                                                        className="rounded-md bg-indigo-50 text-indigo-600 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-100 transition border border-indigo-200"
                                                    >
                                                        View
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEdit(letter)}
                                                        className="rounded-md bg-yellow-50 text-yellow-600 px-3 py-1.5 text-xs font-semibold hover:bg-yellow-100 transition border border-yellow-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(letter._id)}
                                                        className="rounded-md bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 transition border border-red-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExperienceLetter;
