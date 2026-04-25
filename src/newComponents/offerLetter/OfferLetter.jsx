import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OfferLetter = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [offerLetters, setOfferLetters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [error, setError] = useState("");
  const [ReactQuill, setReactQuill] = useState(null);

  useEffect(() => {
    let isMounted = true;
    import("react-quill")
      .then((mod) => {
        if (isMounted) {
          const Quill = mod.Quill;
          const Font = Quill.import("formats/font");
          Font.whitelist = ["arial", "times-new-roman", "monospace", "new-roman"];
          Quill.register(Font, true);

          setReactQuill(() => mod.default);
        }
      })
      .catch((err) => {
        console.error("Failed to load ReactQuill:", err);
        setError("Unable to load rich text editor. Refresh the page or try again later.");
      });

    import("react-quill/dist/quill.snow.css").catch((err) => {
      console.error("Failed to load quill styles:", err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const modules = {
    toolbar: [
      [{ font: ["arial", "times-new-roman", "monospace", "new-roman"] }],
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formatsQuill = [
    "font",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "color",
    "background",
  ];
  const [formData, setFormData] = useState({
    // Offer Details
    refNumber: "",
    offerDate: new Date().toISOString().split("T")[0],
    // Candidate Information
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    candidateAddress: "",
    // Employment Terms
    jobTitle: "",
    joiningDate: new Date().toISOString().split("T")[0],
    employmentType: "",
    reportingTo: "",
    salary: "",
    benefits: "",
    // Job Responsibilities
    jobResponsibilities: "",
    // Status
    status: "Draft",
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
    const fetchCompanies = async () => {
      try {
        const res = await fetch("http://localhost:4000/company/all");
        if (!res.ok) throw new Error("Failed to fetch companies");
        const data = await res.json();
        const list = Array.isArray(data.companies) ? data.companies : data.companies || data;
        setCompanies(list || []);
        if (list && list.length > 0) {
          setActiveCompanyId((prev) => prev || list[0]._id);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load companies");
      }
    };

    fetchOfferLetters();
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (!activeCompanyId || companies.length === 0) return;
    const company = companies.find((item) => item._id === activeCompanyId);
    if (company) {
      setSelectedCompany(company);
    }
  }, [activeCompanyId, companies]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInput = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const payload = {
        ...formData,
        companyId: selectedCompany?._id || "",
        companyName: selectedCompany?.companyName || "",
      };
      const res = await fetch("http://localhost:4000/offer-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create offer letter");
      setOfferLetters((prev) => [data.data, ...prev]);
      setFormData({
        refNumber: "",
        offerDate: new Date().toISOString().split("T")[0],
        candidateName: "",
        candidateEmail: "",
        candidatePhone: "",
        candidateAddress: "",
        jobTitle: "",
        joiningDate: new Date().toISOString().split("T")[0],
        employmentType: "",
        reportingTo: "",
        salary: "",
        benefits: "",
        jobResponsibilities: "",
        status: "Draft",
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

        <form onSubmit={handleSubmit} className="mb-8 space-y-6">
          {/* COMPANY SELECTION */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-4 text-lg font-bold text-slate-900">COMPANY</h3>
            <select
              name="company"
              value={activeCompanyId || ""}
              onChange={(e) => setActiveCompanyId(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>
          {/* OFFER DETAILS */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-4 text-lg font-bold text-slate-900">OFFER DETAILS</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Reference Number</label>
                <input
                  type="text"
                  name="refNumber"
                  value={formData.refNumber}
                  onChange={handleChange}
                  placeholder="e.g. 2025_2020077"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Offer Date</label>
                <input
                  type="date"
                  name="offerDate"
                  value={formData.offerDate}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            </div>
          </div>

          {/* CANDIDATE INFORMATION */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-4 text-lg font-bold text-slate-900">CANDIDATE INFORMATION</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Candidate Name</label>
                <input
                  type="text"
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleChange}
                  placeholder="e.g. Neeraj"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Email</label>
                <input
                  type="email"
                  name="candidateEmail"
                  value={formData.candidateEmail}
                  onChange={handleChange}
                  placeholder="candidate@example.com"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Phone</label>
                <input
                  type="tel"
                  name="candidatePhone"
                  value={formData.candidatePhone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold">Address</label>
                <textarea
                  name="candidateAddress"
                  value={formData.candidateAddress}
                  onChange={handleChange}
                  placeholder="e.g. 123 Main St, New Delhi, Delhi"
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* EMPLOYMENT TERMS */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-4 text-lg font-bold text-slate-900">EMPLOYMENT TERMS</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Web Developer"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Date of Joining</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Employment Type</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Reporting To</label>
                <input
                  type="text"
                  name="reportingTo"
                  value={formData.reportingTo}
                  onChange={handleChange}
                  placeholder="e.g. HR Manager"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹30,000 per month"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Benefits</label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="e.g. Medical, Dental, Life Insurance"
                  rows={1}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* JOB RESPONSIBILITIES */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Job Responsibilities</label>
            {ReactQuill ? (
              <ReactQuill
                theme="snow"
                value={formData.jobResponsibilities}
                onChange={(value) => handleInput("jobResponsibilities", value)}
                modules={modules}
                formats={formatsQuill}
                placeholder="Describe job responsibilities..."
                style={{ minHeight: 170, backgroundColor: "#fff" }}
              />
            ) : (
              <textarea
                name="jobResponsibilities"
                value={formData.jobResponsibilities}
                onChange={handleChange}
                placeholder="Enter job responsibilities..."
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            )}
          </div>

          {/* STATUS */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-4 text-lg font-bold text-slate-900">STATUS</h3>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
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
              <th className="px-4 py-2 text-left">Job Title</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Joining Date</th>
              <th className="px-4 py-2 text-left">Salary</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {offerLetters.map((offer) => (
              <tr key={offer._id} className="transition hover:bg-slate-50">
                <td className="px-4 py-2 font-medium text-slate-700">{offer.candidateName}</td>
                <td className="px-4 py-2 text-slate-600">{offer.jobTitle || "-"}</td>
                <td className="px-4 py-2 text-slate-600">{offer.candidateEmail || "-"}</td>
                <td className="px-4 py-2 text-sm">
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-blue-700">
                    {offer.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-600">{offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : "-"}</td>
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
