import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PreviewOfferLetter from "./PreviewOfferLetter";

const DEFAULT_FORMAT_DATA = {
  workHours: "<p>Standard working hours are 9:30 AM to 6:30 PM, Monday through Friday. However, you may be required to work additional hours as needed for project deadlines.</p>",
  confidentiality: "<p>You agree to maintain strict confidentiality regarding all company trade secrets, client data, and internal processes during and after your employment.</p>",
  atWillEmployment: "<p>Employment with the company is at-will, meaning either you or the company can terminate the relationship at any time with appropriate notice.</p>",
  noticePeriod: "<p>A notice period of 30 days is required from either party for termination of employment.</p>",
  relievingAndFinalSettlement: "<p>Final settlement will be processed within 45 days of your last working day, subject to successful handover of all company assets.</p>",
  confidentialityAndNda: "<p>This offer is subject to the signing of a comprehensive Non-Disclosure Agreement (NDA).</p>",
  paymentInLieuOfNotice: "<p>The company reserves the right to pay salary in lieu of the notice period at its sole discretion.</p>",
  exitInterview: "<p>An exit interview is mandatory for all departing employees to provide feedback and ensure a smooth transition.</p>",
  legalCompliance: "<p>Your employment is subject to all applicable labor laws and company internal policies.</p>",
  postEmploymentBenefits: "<p>Any post-employment benefits will be governed by the company's prevailing policies at the time of separation.</p>",
  annexureA: "<p>Details of your compensation structure are provided in this annexure.</p>",
};

const OfferLetter = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [offerLetters, setOfferLetters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [error, setError] = useState("");
  const [ReactQuill, setReactQuill] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewFormatData, setViewFormatData] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [editingOfferId, setEditingOfferId] = useState(null);

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
  const fetchNextRefNumber = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/offer-letter/get-next-ref`);
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, refNumber: data.refNumber }));
      }
    } catch (err) {
      console.error("Error fetching ref number:", err);
    }
  };

  const [formData, setFormData] = useState({
    // Offer Details
    refNumber: "",
    offerDate: new Date().toISOString().split("T")[0],
    // Candidate Information
    candidateName: "",
    fatherName: "",
    candidateEmail: "",
    candidatePhone: "",
    candidateAddress: "",
    candidateGender: "Male",
    maritalStatus: "Single",
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/offer-letter`);
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/company/all`);
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
    fetchNextRefNumber();
  }, []);

  useEffect(() => {
    if (!activeCompanyId || companies.length === 0) return;
    const company = companies.find((item) => item._id === activeCompanyId);
    if (company) {
      setSelectedCompany(company);
      // Fetch format for this company
      fetch(`${import.meta.env.VITE_API_URL}/offer-letter-format?companyId=${company._id}`)
        .then(res => res.json())
        .then(json => {
          if (json.success && json.data && json.data.length > 0) {
            setSelectedFormat(json.data[0]);
          } else {
            setSelectedFormat(null);
          }
        })
        .catch(err => console.error("Error fetching format:", err));
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
        formatId: selectedFormat?._id || null,
      };

      let res, data;

      if (editingOfferId) {
        res = await fetch(`${import.meta.env.VITE_API_URL}/offer-letter/${editingOfferId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update offer letter");
        setOfferLetters((prev) => prev.map((item) => (item._id === editingOfferId ? data.data : item)));
        setEditingOfferId(null);
      } else {
        res = await fetch(`${import.meta.env.VITE_API_URL}/offer-letter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create offer letter");
        setOfferLetters((prev) => [data.data, ...prev]);
      }

      setFormData({
        refNumber: "",
        offerDate: new Date().toISOString().split("T")[0],
        candidateName: "",
        fatherName: "",
        candidateEmail: "",
        candidatePhone: "",
        candidateAddress: "",
        candidateGender: "Male",
        maritalStatus: "Single",
        jobTitle: "",
        joiningDate: new Date().toISOString().split("T")[0],
        employmentType: "",
        reportingTo: "",
        salary: "",
        benefits: "",
        jobResponsibilities: "",
        status: "Draft",
      });
      fetchNextRefNumber();
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to save offer letter");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer) => {
    setEditingOfferId(offer._id);
    setFormData({
      refNumber: offer.refNumber || "",
      offerDate: offer.offerDate ? new Date(offer.offerDate).toISOString().split("T")[0] : "",
      candidateName: offer.candidateName || "",
      fatherName: offer.fatherName || "",
      candidateEmail: offer.candidateEmail || "",
      candidatePhone: offer.candidatePhone || "",
      candidateAddress: offer.candidateAddress || "",
      candidateGender: offer.candidateGender || "Male",
      maritalStatus: offer.maritalStatus || "Single",
      jobTitle: offer.jobTitle || "",
      joiningDate: offer.joiningDate ? new Date(offer.joiningDate).toISOString().split("T")[0] : "",
      employmentType: offer.employmentType || "",
      reportingTo: offer.reportingTo || "",
      salary: offer.salary || "",
      benefits: offer.benefits || "",
      jobResponsibilities: offer.jobResponsibilities || "",
      status: offer.status || "Draft",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleView = async (offer) => {
    try {
      setLoading(true);
      setError("");
      // 1. Find the format for this offer
      let url = `${import.meta.env.VITE_API_URL}/offer-letter-format`;
      if (offer.formatId) {
        url += `/${offer.formatId?._id || offer.formatId}`;
      } else {
        url += `?companyId=${offer.companyId}`;
      }
      
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load format");

      const format = offer.formatId ? json.data : (json.data && json.data.length > 0 ? json.data[0] : DEFAULT_FORMAT_DATA);

      // 2. Merge offer details into format data for preview
      const mergedData = {
        ...format,
        ...offer, // This will override candidateName, jobTitle, salary, etc.
        offerDate: offer.offerDate ? new Date(offer.offerDate).toLocaleDateString() : "",
        joiningDate: offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : "",
      };

      setViewFormatData(mergedData);
      setSelectedOffer(offer);
      setShowViewModal(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load preview");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer letter?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/offer-letter/${id}`, {
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
    <div className="min-h-[85vh] bg-gradient-to-br from-[#eff3f8] via-[#f8faff] to-[#eef2f6] py-4 sm:py-8 px-0 sm:px-8">
      <div className="mx-auto w-full max-w-8xl sm:rounded-3xl border-0 sm:border border-slate-200 bg-white/95 p-4 sm:p-6 shadow-none sm:shadow-xl backdrop-blur-sm">
        <div className="mb-6 flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-0">
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
                <label className="mb-2 block text-sm font-semibold">Father's/Husband's Name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="e.g. Mukesh Verma"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Gender</label>
                <select
                  name="candidateGender"
                  value={formData.candidateGender || "Male"}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus || "Single"}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
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
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 overflow-x-auto">
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

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Saving..." : editingOfferId ? "Update Offer Letter" : "Create Offer Letter"}
            </button>
            {editingOfferId && (
              <button
                type="button"
                onClick={() => {
                  setEditingOfferId(null);
                  setFormData({
                    refNumber: "",
                    offerDate: new Date().toISOString().split("T")[0],
                    candidateName: "",
                    fatherName: "",
                    candidateEmail: "",
                    candidatePhone: "",
                    candidateAddress: "",
                    candidateGender: "Male",
                    maritalStatus: "Single",
                    jobTitle: "",
                    joiningDate: new Date().toISOString().split("T")[0],
                    employmentType: "",
                    reportingTo: "",
                    salary: "",
                    benefits: "",
                    jobResponsibilities: "",
                    status: "Draft",
                  });
                  fetchNextRefNumber();
                }}
                className="w-full rounded-lg bg-slate-500 px-4 py-3 text-white hover:bg-slate-600"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <div className="md:rounded-2xl md:border md:border-slate-200 md:shadow-sm bg-transparent md:bg-white overflow-hidden px-4 sm:px-0">
        {offerLetters.length === 0 ? (
          <p className="text-center text-gray-500 italic py-6">No offer letters found.</p>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left">Candidate</th>
                    <th className="px-4 py-3 text-left">Job Title</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Joining Date</th>
                    <th className="px-4 py-3 text-left">Salary</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {offerLetters.map((offer) => (
                    <tr key={offer._id} className="transition hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{offer.candidateName}</td>
                      <td className="px-4 py-3 text-slate-600">{offer.jobTitle || "-"}</td>
                      <td className="px-4 py-3 text-slate-600">{offer.candidateEmail || "-"}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold border ${
                          offer.status === "Accepted" ? "bg-green-50 text-green-700 border-green-200" :
                          offer.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" :
                          offer.status === "Sent" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}>
                          {offer.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : "-"}</td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{offer.salary}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleView(offer)} className="rounded-md bg-indigo-50 text-indigo-600 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-100 transition border border-indigo-200" disabled={loading}>View</button>
                          <button onClick={() => handleEdit(offer)} className="rounded-md bg-amber-50 text-amber-600 px-3 py-1.5 text-xs font-semibold hover:bg-amber-100 transition border border-amber-200" disabled={loading}>Edit</button>
                          <button onClick={() => handleDelete(offer._id)} className="rounded-md bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 transition border border-red-200" disabled={loading}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
              {offerLetters.map((offer) => (
                <div key={offer._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3 relative">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-base truncate">{offer.candidateName}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">{offer.jobTitle || "No Title"} • {offer.candidateEmail || "No Email"}</p>
                    </div>
                    <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      offer.status === "Accepted" ? "bg-green-50 text-green-700 border-green-200" :
                      offer.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" :
                      offer.status === "Sent" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}>
                      {offer.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                    <div><span className="text-slate-400 block mb-0.5">Salary</span> <span className="font-medium text-slate-700">{offer.salary}</span></div>
                    <div className="text-slate-300">|</div>
                    <div className="text-right"><span className="text-slate-400 block mb-0.5">Joining Date</span> <span className="font-medium text-slate-700">{offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : "-"}</span></div>
                  </div>

                  <div className="flex gap-2 mt-2 pt-3 border-t border-slate-100">
                    <button onClick={() => handleView(offer)} className="flex-1 flex items-center justify-center bg-indigo-50 text-indigo-700 py-2 rounded-lg font-medium text-xs hover:bg-indigo-100 transition border border-indigo-200">View</button>
                    <button onClick={() => handleEdit(offer)} className="flex-1 flex items-center justify-center bg-amber-50 text-amber-700 py-2 rounded-lg font-medium text-xs hover:bg-amber-100 transition border border-amber-200">Edit</button>
                    <button onClick={() => handleDelete(offer._id)} className="flex-1 flex items-center justify-center bg-red-50 text-red-700 py-2 rounded-lg font-medium text-xs hover:bg-red-100 transition border border-red-200">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {showViewModal && viewFormatData && (
          <PreviewOfferLetter
            formatData={viewFormatData}
            company={companies.find(c => c._id === (selectedOffer?.companyId?._id || selectedOffer?.companyId)) || selectedOffer?.companyId}
            onClose={() => setShowViewModal(false)}
          />
        )}
      </div>
    </div>
  </div>
  );
};

export default OfferLetter;
