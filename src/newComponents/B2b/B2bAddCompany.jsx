import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const B2bAddCompany = () => {
  const [formData, setFormData] = useState({
    country: "India",
    state: "",
    companyName: "",
    company: "",
    contactPersonName: "",
    contactPersonNumber: "",
    email: "",
    whatsapp: "",
    address: "",
  });

  const [companies, setCompanies] = useState([]);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [states, setStates] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [company, setCompany] = useState([]);
  const [employeeCompany, setEmployeeCompany] = useState(null);

  const companyId = localStorage.getItem("companyId");
  const employeeId =
    localStorage.getItem("employeeId") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("id") ||
    localStorage.getItem("_id") ||
    null;
  const role = localStorage.getItem("role");

  if (role === "employee") {
    useEffect(() => {
      const fetchEmployeeCompany = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/company/${companyId}`);
          if (!res.ok) throw new Error("Failed to fetch company details");
          const data = await res.json();
          setEmployeeCompany(data.company.companyName);
          setFormData(prev => ({ ...prev, company: data.company.companyName }));
        } catch (err) {
          console.error(err);
        }
      };
      fetchEmployeeCompany();
    }, [companyId]);
  }

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/company/all`);
        if (!res.ok) throw new Error("Failed to fetch company details");
        const data = await res.json();
        if (role === "superAdmin" || role === "admin") {
          setCompany(data.companies || []);
        } else {
          setCompany(data.companies.filter(comp => comp.companyName === employeeCompany) || []);
          setActiveTab(employeeCompany);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompanyDetails();
  }, [employeeCompany]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bstate/`);
        if (!res.ok) throw new Error("Failed to fetch states");
        const data = await res.json();
        setStates(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        let endpoint = "";
        if (role === "employee") {
          endpoint = `${import.meta.env.VITE_API_URL}/b2bcompany/employee/${employeeId}`;
          if (employeeCompany) endpoint += `?companyName=${encodeURIComponent(employeeCompany)}`;
        } else if (activeTab === "All") {
          endpoint = `${import.meta.env.VITE_API_URL}/b2bcompany`;
        } else {
          endpoint = `${import.meta.env.VITE_API_URL}/b2bcompany/${activeTab}`;
        }
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch companies");
        const data = await res.json();
        if (Array.isArray(data)) setCompanies(data);
        else if (data && Array.isArray(data.companies)) setCompanies(data.companies);
        else if (data && data.company) setCompanies([data.company]);
        else setCompanies([]);
      } catch (err) {
        console.error(err);
      }
    };
    if (role === "employee") {
      if (employeeId) fetchCompaniesData();
    } else {
      fetchCompaniesData();
    }
  }, [activeTab, employeeId, role]);

  useEffect(() => {
    if (viewData && viewData.state) {
      const selectedState = states.find((state) => state._id === viewData.state);
      if (selectedState) {
        setViewData((prevData) => ({ ...prevData, state: selectedState.state }));
      }
    }
  }, [viewData, states]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const requiredFields = ["country", "state", "companyName", "contactPersonName", "contactPersonNumber", "email", "whatsapp", "address"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill ${field}`);
        return;
      }
    }
    try {
      const submitData = { ...formData };
      if (role === "employee") {
        if (employeeId) submitData.createdBy = employeeId;
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bcompany`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to add company");
      }
      const newCompany = await res.json();
      setCompanies((prev) => Array.isArray(prev) ? [...prev, newCompany] : [newCompany]);
      alert("Company Added Successfully ✓");
      if (role === "employee") {
        fetchCompaniesByEmployee();
      } else {
        fetchCompanies();
      }
      setFormData({
        country: "India",
        state: "",
        companyName: "",
        company: role === "employee" ? employeeCompany : "",
        contactPersonName: "",
        contactPersonNumber: "",
        email: "",
        whatsapp: "",
        address: "",
      });
    } catch (err) {
      alert("Error adding company: " + err.message);
    }
  };

  const handleDelete = async (index, id) => {
    if (window.confirm("Are you sure to delete this company?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bcompany/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || "Failed to delete company");
        }
        const newList = [...companies];
        newList.splice(index, 1);
        setCompanies(newList);
        alert("Company deleted successfully ✓");
        if (role === "employee") {
          await fetchCompaniesByEmployee();
        } else {
          await fetchCompanies();
        }
      } catch (err) {
        alert("Error deleting company: " + err.message);
      }
    }
  };

  const handleEdit = (company, index) => {
    setEditData({ ...company, index });
  };

  const handleEditChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bcompany`);
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompaniesByEmployee = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/b2bcompany/employee/${employeeId}`;
      if (employeeCompany) url += `?companyName=${encodeURIComponent(employeeCompany)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) setCompanies(data);
      else if (data && Array.isArray(data.companies)) setCompanies(data.companies);
      else if (data && data.company) setCompanies([data.company]);
      else setCompanies([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSave = async () => {
    const { index, _id, ...companyData } = editData;
    if (!_id) {
      alert("Invalid company ID");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bcompany/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to update company");
      }
      if (role === "employee") {
        await fetchCompaniesByEmployee();
      } else {
        await fetchCompanies();
      }
      setEditData(null);
      alert("Company updated successfully ✓");
    } catch (err) {
      alert("Error updating company: " + err.message);
    }
  };

  /* ─── Field config ─── */
  const inputBase =
    "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 hover:border-slate-300";

  const labelBase = "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5";

  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sans">

      {/* ── Top accent bar ── */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-400" />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">

        {/* ── Page header ── */}
        <div className="mb-8 flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-500">CRM / B2B</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Partner Companies
          </h1>
          <p className="text-sm text-slate-500">Register, view and manage your B2B partner network.</p>
        </div>

        {/* ── Company filter tabs ── */}
        <div className="mb-6">
          {/* Mobile dropdown */}
          <div className="block sm:hidden">
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => {
                  const val = e.target.value;
                  setActiveTab(val);
                  setFormData({ ...formData, company: val === "All" ? null : val });
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-700 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                {role !== "employee" && <option value="All">All Companies</option>}
                {company.map((comp) => (
                  <option key={comp._id} value={comp.companyName}>{comp.companyName}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </span>
            </div>
          </div>

          {/* Desktop tabs */}
          <div className="hidden sm:flex flex-wrap items-center gap-2">
            {role !== "employee" && (
              <button
                onClick={() => { setActiveTab("All"); setFormData({ ...formData, company: null }); }}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                  activeTab === "All"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-600"
                }`}
              >
                All
              </button>
            )}
            {company.map((comp) => (
              <button
                key={comp._id}
                onClick={() => { setActiveTab(comp.companyName); setFormData({ ...formData, company: comp.companyName }); }}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                  activeTab === comp.companyName
                    ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-600"
                }`}
              >
                {comp.companyName}
              </button>
            ))}
          </div>
        </div>

        {/* ── Add Company form ── */}
        {!editData && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Card header */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Add New Company</h2>
                <p className="text-xs text-slate-400">All fields marked are required.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
              {/* Country */}
              <div>
                <label className={labelBase}>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  readOnly
                  className="w-full rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed outline-none"
                />
              </div>

              {/* State */}
              <div>
                <label className={labelBase}>State</label>
                <select name="state" value={formData.state} onChange={handleChange} className={inputBase}>
                  <option value="">Select state…</option>
                  {states.map((s) => (
                    <option key={s._id} value={s._id}>{s.state}</option>
                  ))}
                </select>
              </div>

              {/* Company Name – full width */}
              <div className="md:col-span-2">
                <label className={labelBase}>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Technologies Ltd."
                  className={inputBase}
                />
              </div>

              {/* Contact person */}
              <div>
                <label className={labelBase}>Contact Person</label>
                <input
                  type="text"
                  name="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={handleChange}
                  placeholder="Full name"
                  className={inputBase}
                />
              </div>

              {/* Phone */}
              <div>
                <label className={labelBase}>Phone</label>
                <input
                  type="number"
                  name="contactPersonNumber"
                  value={formData.contactPersonNumber}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  className={inputBase}
                />
              </div>

              {/* Email */}
              <div>
                <label className={labelBase}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@company.com"
                  className={inputBase}
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className={labelBase}>WhatsApp</label>
                <input
                  type="number"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="WhatsApp number"
                  className={inputBase}
                />
              </div>

              {/* Address – full width */}
              <div className="md:col-span-2">
                <label className={labelBase}>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, city, PIN code…"
                  rows={3}
                  className={`${inputBase} resize-y`}
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 px-6 py-4">
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 hover:-translate-y-px active:translate-y-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                Add Company
              </button>
            </div>
          </div>
        )}

        {/* ── Company table ── */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Table header bar */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M4 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Zm3.5 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM4.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-slate-800">Registered Companies</h2>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
              {companies.length} {companies.length === 1 ? "company" : "companies"}
            </span>
          </div>

          {/* ── Mobile cards ── */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {companies.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-14 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-slate-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
                <p className="text-sm font-semibold text-slate-400">No companies yet</p>
                <p className="text-xs text-slate-400">Add a company using the form above.</p>
              </div>
            ) : (
              companies.map((co, index) => (
                <div key={co._id || index} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-slate-800">{co.companyName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{co.email}</p>
                    </div>
                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-600">{co.state?.state || "—"}</span>
                  </div>
                  <div className="flex gap-2 text-xs text-slate-500 mb-3">
                    <span>📞 {co.contactPersonNumber || "—"}</span>
                    <span>•</span>
                    <span>💬 {co.whatsapp || "—"}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setViewData(co)} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-sky-50 py-2 text-xs font-semibold text-sky-600 hover:bg-sky-100 transition-colors">
                      <FaEye className="h-3 w-3" /> View
                    </button>
                    <button onClick={() => handleEdit(co, index)} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors">
                      <FaEdit className="h-3 w-3" /> Edit
                    </button>
                    <button onClick={() => handleDelete(index, co._id)} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-50 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors">
                      <FaTrash className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Desktop table ── */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">#</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Company</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Contact Person</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Phone / WhatsApp</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Email</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-slate-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                        <p className="text-sm font-semibold text-slate-400">No companies yet</p>
                        <p className="text-xs text-slate-400">Use the form above to register your first partner.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  companies.map((co, index) => (
                    <tr key={co._id || index} className="hover:bg-violet-50/30 transition-colors">
                      <td className="px-6 py-4 text-slate-400 text-xs font-mono">{String(index + 1).padStart(2, "0")}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{co.companyName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{co.state?.state || "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{co.contactPersonName || "—"}</td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600">{co.contactPersonNumber || "—"}</p>
                        <p className="text-xs text-slate-400">{co.whatsapp || "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{co.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewData(co)}
                            title="View Details"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-500 transition hover:bg-sky-100 hover:text-sky-700"
                          >
                            <FaEye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(co, index)}
                            title="Edit"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 transition hover:bg-emerald-100 hover:text-emerald-700"
                          >
                            <FaEdit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(index, co._id)}
                            title="Delete"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-400 transition hover:bg-red-100 hover:text-red-600"
                          >
                            <FaTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ════ EDIT MODAL ════ */}
      {editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FaEdit className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Edit Company</h3>
                  <p className="text-xs text-slate-400">{editData.companyName}</p>
                </div>
              </div>
              <button
                onClick={() => setEditData(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-4">
              <div>
                <label className={labelBase}>State</label>
                <select name="state" value={editData.state} onChange={handleEditChange} className={inputBase}>
                  <option value="">Select state…</option>
                  {states.map((s) => (
                    <option key={s._id} value={s._id}>{s.state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelBase}>Contact Person</label>
                <input type="text" name="contactPersonName" value={editData.contactPersonName} onChange={handleEditChange} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Phone</label>
                <input type="number" name="contactPersonNumber" value={editData.contactPersonNumber} onChange={handleEditChange} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Email</label>
                <input type="email" name="email" value={editData.email} onChange={handleEditChange} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>WhatsApp</label>
                <input type="number" name="whatsapp" value={editData.whatsapp} onChange={handleEditChange} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Address</label>
                <textarea name="address" value={editData.address} onChange={handleEditChange} rows={3} className={`${inputBase} resize-y`} />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => setEditData(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ VIEW MODAL ════ */}
      {viewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 px-6 py-6 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 0 1.5H18.75a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5H18.75Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold">{viewData.companyName}</h3>
              <p className="text-sm text-violet-200">{viewData.country} · {viewData.state?.state || viewData.state || "—"}</p>
              <button
                onClick={() => setViewData(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>

            {/* Modal details */}
            <div className="px-6 py-5 space-y-3">
              {[
                { icon: "👤", label: "Contact Person", value: viewData.contactPersonName },
                { icon: "📞", label: "Phone", value: viewData.contactPersonNumber },
                { icon: "✉️", label: "Email", value: viewData.email },
                { icon: "💬", label: "WhatsApp", value: viewData.whatsapp },
                { icon: "📍", label: "Address", value: viewData.address },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="mt-0.5 text-base">{icon}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="text-sm font-medium text-slate-700 mt-0.5">{value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 px-6 py-4 flex justify-end">
              <button
                onClick={() => setViewData(null)}
                className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default B2bAddCompany;