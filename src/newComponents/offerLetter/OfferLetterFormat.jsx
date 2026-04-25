import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PreviewOfferLetter from "./PreviewOfferLetter";

const OfferLetterFormat = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formats, setFormats] = useState([]);
  const [selectedFormatId, setSelectedFormatId] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [ReactQuill, setReactQuill] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

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

  const [formatData, setFormatData] = useState({
    title: "Offer Letter Format",
    // Format-specific sections
    workHours: "",
    confidentiality: "",
    atWillEmployment: "",
    noticePeriod: "",
    relievingAndFinalSettlement: "",
    confidentialityAndNda: "",
    paymentInLieuOfNotice: "",
    exitInterview: "",
    legalCompliance: "",
    postEmploymentBenefits: "",
    annexureA: "",
    nonDisclosureAgreement: "",
    ndaWhereas: "",
    ndaDefinitionOfConfidential: "",
    ndaObligationOfConfidentiality: "",
    ndaExclusions: "",
    ndaTerm: "",
    ndaReturnOfMaterials: "",
    ndaBreachAndRemedies: "",
    ndaGoverningLaw: "",
    ndaAdditionalObligations: "",
  });

  const fetchFormats = async (companyId = null) => {
    try {
      setLoading(true);
      let url = "http://localhost:4000/offer-letter-format";
      if (companyId) {
        url += `?companyId=${encodeURIComponent(companyId)}`;
      }

      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Fetch failed");

      const fetched = json.data || [];
      setFormats(fetched);

      if (companyId) {
        const existing = fetched[0] || null;
        if (existing) {
          setSelectedFormatId(existing._id);
          setFormatData((prev) => ({
            ...prev,
            ...existing,
          }));
        } else {
          setSelectedFormatId(null);
          setFormatData((prev) => ({
            ...prev,
            workHours: "",
            confidentiality: "",
            atWillEmployment: "",
            noticePeriod: "",
            relievingAndFinalSettlement: "",
            confidentialityAndNda: "",
            paymentInLieuOfNotice: "",
            exitInterview: "",
            legalCompliance: "",
            postEmploymentBenefits: "",
            annexureA: "",
            nonDisclosureAgreement: "",
            ndaWhereas: "",
            ndaDefinitionOfConfidential: "",
            ndaObligationOfConfidentiality: "",
            ndaExclusions: "",
            ndaTerm: "",
            ndaReturnOfMaterials: "",
            ndaBreachAndRemedies: "",
            ndaGoverningLaw: "",
            ndaAdditionalObligations: "",
          }));
        }
      }
    } catch (err) {
      setError(err.message || "Unable to fetch format");
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
          const first = list[0];
          setActiveCompanyId((prev) => prev || first._id);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load companies");
      }
    };

    fetchCompanies();
    fetchFormats();
  }, []);

  useEffect(() => {
    if (!activeCompanyId || companies.length === 0) return;
    const company = companies.find((item) => item._id === activeCompanyId);
    if (company) {
      setSelectedCompany(company);
      fetchFormats(company._id);
    }
  }, [activeCompanyId, companies]);

  const fields = [
    ["workHours", "Work Hours"],
    ["confidentiality", "Confidentiality"],
    ["atWillEmployment", "At-Will Employment"],
    ["noticePeriod", "Notice Period"],
    ["relievingAndFinalSettlement", "Relieving and Final Settlement Terms & Conditions"],
    ["confidentialityAndNda", "Confidentiality and Non-Disclosure"],
    ["paymentInLieuOfNotice", "Payment in Lieu of Notice"],
    ["exitInterview", "Exit Interview"],
    ["legalCompliance", "Legal Compliance"],
    ["postEmploymentBenefits", "Post-Employment Benefits"],
  ];

  if (!ReactQuill) {
    return (
      <div className="min-h-[85vh] bg-slate-50 py-8 px-4 sm:px-8">
        <div className="mx-auto w-full max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <p className="text-gray-600">Loading editor…</p>
        </div>
      </div>
    );
  }

  const handleInput = (fieldName, value) => {
    setFormatData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormatData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const payload = {
        ...formatData,
        companyId: selectedCompany?._id || null,
        companyName: selectedCompany?.companyName || "",
      };

      let res;
      if (selectedFormatId) {
        res = await fetch(`http://localhost:4000/offer-letter-format/${selectedFormatId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("http://localhost:4000/offer-letter-format", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Save failed");

      setSuccess("Format saved successfully");
      await fetchFormats(selectedCompany?._id || null);
    } catch (err) {
      setError(err.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8 px-4 sm:px-8">
      <style>{`
        .ql-font-arial { font-family: Arial, Helvetica, sans-serif; }
        .ql-font-times-new-roman { font-family: 'Times New Roman', Times, serif; }
        .ql-font-monospace { font-family: 'Courier New', Courier, monospace; }
        .ql-font-new-roman { font-family: 'Times New Roman', Times, serif; }

        /* Force dropdown labels explicitly for Word-like behavior */
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[aria-label="Arial"]::before {
          content: "Arial";
        }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[aria-label="Times New Roman"]::before {
          content: "Times New Roman";
        }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[aria-label="Monospace"]::before {
          content: "Monospace";
        }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="new-roman"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[aria-label="New Roman"]::before {
          content: "New Roman";
        }

        /* Ensure label updates to selected font */
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before {
          content: "Arial";
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before {
          content: "Times New Roman";
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before {
          content: "Monospace";
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="new-roman"]::before {
          content: "New Roman";
        }

        /* Prevent wrapped text in toolbar label and dropdown items */
        .ql-toolbar .ql-formats .ql-picker.ql-font .ql-picker-label,
        .ql-toolbar .ql-formats .ql-picker.ql-font .ql-picker-item {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ql-toolbar .ql-formats .ql-picker.ql-font {
          min-width: 120px;
          max-width: 220px;
        }
        .ql-toolbar .ql-formats .ql-picker.ql-font .ql-picker-label {
          min-width: 110px;
        }
      `}</style>
      <div className="mx-auto w-full max-w-8xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Offer Letter Format Builder</h1>
            <p className="text-sm text-slate-500">Setup reusable format sections for HR offer letters.</p>
          </div>
          <button
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            onClick={() => navigate("/offer-letter")}
          >
            Back to Offer Letters
          </button>
        </div>

        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-red-600">{error}</p>}
        {success && <p className="mb-4 rounded-md bg-emerald-50 p-3 text-emerald-600">{success}</p>}

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Select Company</h2>
          <div className="flex flex-wrap gap-2">
            {companies.length === 0 ? (
              <div className="text-sm text-slate-500">Loading companies...</div>
            ) : (
              companies.map((company) => (
                <button
                  key={company._id}
                  type="button"
                  onClick={() => setActiveCompanyId(company._id)}
                  className={`rounded-full px-3 py-1 text-sm font-medium border ${
                    activeCompanyId === company._id
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {company.companyName}
                </button>
              ))
            )}
          </div>
          {!selectedCompany && companies.length > 0 && <p className="mt-2 text-sm text-gray-600">Please select a company to continue.</p>}
        </div>

        {selectedCompany ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 text-sm text-slate-700">
              Selected company: <span className="font-semibold">{selectedCompany.companyName}</span>
            </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="mb-4 text-xl font-bold">OFFER LETTER SECTIONS</h2>

            <div className="space-y-4">
              {fields.map(([name, label]) => (
                <div key={name} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
                  <ReactQuill
                    theme="snow"
                    value={formatData[name]}
                    onChange={(value) => handleInput(name, value)}
                    modules={modules}
                    formats={formatsQuill}
                    placeholder={`${label}...`}
                    style={{ minHeight: 170, backgroundColor: "#fff" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="mb-2 text-xl font-bold">ANNEXURE A</h2>
            <ReactQuill
              theme="snow"
              value={formatData.annexureA}
              onChange={(value) => handleInput("annexureA", value)}
              modules={modules}
              formats={formatsQuill}
              placeholder="Annexure A details..."
              style={{ minHeight: 170, backgroundColor: "#fff" }}
            />
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="mb-4 text-xl font-bold">Non Disclosure Agreement (NDA)</h2>
            
            {/* Main NDA Description */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold">Data Non-Disclosure Agreement (NDA)</label>
              <ReactQuill
                theme="snow"
                value={formatData.nonDisclosureAgreement}
                onChange={(value) => handleInput("nonDisclosureAgreement", value)}
                modules={modules}
                formats={formatsQuill}
                placeholder="Non disclosure agreement details..."
                style={{ minHeight: 120, backgroundColor: "#fff" }}
              />
            </div>

            {/* WHEREAS Section */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold">WHEREAS</label>
              <ReactQuill
                theme="snow"
                value={formatData.ndaWhereas}
                onChange={(value) => handleInput("ndaWhereas", value)}
                modules={modules}
                formats={formatsQuill}
                placeholder="WHEREAS clause..."
                style={{ minHeight: 100, backgroundColor: "#fff" }}
              />
            </div>

            {/* NDA Sections */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { key: "ndaDefinitionOfConfidential", label: "1. Definition of Confidential Information" },
                { key: "ndaObligationOfConfidentiality", label: "2. Obligation of Confidentiality" },
                { key: "ndaExclusions", label: "3. Exclusions" },
                { key: "ndaTerm", label: "4. Term" },
                { key: "ndaReturnOfMaterials", label: "5. Return of Materials" },
                { key: "ndaBreachAndRemedies", label: "6. Breach and Remedies" },
                { key: "ndaGoverningLaw", label: "7. Governing Law and Jurisdiction" },
                { key: "ndaAdditionalObligations", label: "8. Additional Obligations" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="mb-2 block text-sm font-semibold">{label}</label>
                  <ReactQuill
                    theme="snow"
                    value={formatData[key]}
                    onChange={(value) => handleInput(key, value)}
                    modules={modules}
                    formats={formatsQuill}
                    placeholder={`${label}...`}
                    style={{ minHeight: 100, backgroundColor: "#fff" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 mr-3"
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Format"}
          </button>
        </form>
      ) : (
        <div className="rounded-md border border-dashed border-slate-300 p-4 text-center text-slate-500">
          Select a company tab to continue. Once selected, the template builder fields will appear.
        </div>
      )}

        <div className="mt-8">
          <h3 className="mb-3 text-lg font-semibold">Saved Formats</h3>
          <div className="space-y-3">
            {formats.length === 0 && <p className="text-slate-500">No formats saved yet.</p>}
            {formats.map((item) => (
              <div key={item._id} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-semibold">{item.title || "Offer Letter Format"}</p>
                  <small className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</small>
                </div>
                <p className="text-xs text-slate-500">{item.workHours?.slice(0, 120) || "..."}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPreview && (
        <PreviewOfferLetter
          formatData={formatData}
          company={selectedCompany}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default OfferLetterFormat;
