import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ExperienceLetterFormat = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [activeCompanyId, setActiveCompanyId] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch companies
    fetch(`${import.meta.env.VITE_API_URL}/company/all`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data.companies) ? data.companies : data.companies || data;
        setCompanies(list || []);
        if (list && list.length > 0) setActiveCompanyId(list[0]._id);
      })
      .catch(err => console.error("Error loading companies:", err));
  }, []);

  // Fetch the existing format whenever the company changes
  useEffect(() => {
    if (activeCompanyId) {
      fetch(`${import.meta.env.VITE_API_URL}/experience-letter-format?companyId=${activeCompanyId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setContent(data.data.bodycontent || ""); // Note: we used 'bodycontent' in the backend model
          } else {
            setContent(""); // Reset if no format exists yet
          }
        })
        .catch(err => console.error("Error loading format:", err));
    }
  }, [activeCompanyId]);

  const handleSave = async () => {
    if (!activeCompanyId) return alert("Please select a company first.");
    if (!content || content === "<p><br></p>") {
      return alert("Aapko pehle kuch text type ya paste karna hoga! Editor khali nahi ho sakta.");
    }
    
    setLoading(true);
    setMessage("");
    
    const companyName = companies.find(c => c._id === activeCompanyId)?.companyName || "Unknown Company";

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/experience-letter-format`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: activeCompanyId,
          companyName,
          bodycontent: content
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage("Format saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Failed to save format.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error saving format.");
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-[#eff3f8] via-[#f8faff] to-[#eef2f6] py-4 sm:py-8 px-0 sm:px-8">
      <div className="mx-auto w-full max-w-8xl sm:rounded-3xl border-0 sm:border border-slate-200 bg-white/95 p-4 sm:p-6 shadow-none sm:shadow-xl backdrop-blur-sm">
        
        <div className="mb-6 flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-0">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Experience Letter Format</h1>
            <p className="text-sm text-slate-500">Design the default template for experience letters.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="rounded-md bg-slate-200 text-slate-700 px-6 py-2 text-sm font-semibold transition hover:bg-slate-300"
            >
              Back
            </button>
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Format"}
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded bg-green-100 p-3 text-green-800 font-medium">
            {message}
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900">SELECT COMPANY</h3>
          <select
            value={activeCompanyId}
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

        {/* RICH TEXT EDITOR */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-[400px]">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="h-96"
          />
        </div>

      </div>
    </div>
  );
};

export default ExperienceLetterFormat;
