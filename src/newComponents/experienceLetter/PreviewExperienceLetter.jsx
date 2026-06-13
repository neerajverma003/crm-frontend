import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PreviewExperienceLetter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [letterData, setLetterData] = useState(null);
  const [formatContent, setFormatContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Authorized Signatory");
  
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        if (!userId || !role) return;
        const r = role.toLowerCase();
        let url = "";

        if (r === "superadmin") url = `${import.meta.env.VITE_API_URL}/AddSuperAdmin/super/${userId}`;
        else if (r === "admin") url = `${import.meta.env.VITE_API_URL}/getAdmin/${userId}`;
        else if (r === "employee") url = `${import.meta.env.VITE_API_URL}/employee/getEmployee/${userId}`;

        if (!url) return;

        const res = await fetch(url);
        const data = await res.json();
        
        if (r === "superadmin" && data.SuperAdmin) {
            setAdminName(data.SuperAdmin.fullName || "Authorized Signatory");
        } else if (r === "admin" && data.admin) {
            setAdminName(data.admin.fullName || "Authorized Signatory");
        } else if (r === "employee" && data.employee) {
            setAdminName(data.employee.fullName || "Authorized Signatory");
        }
      } catch (e) {
        console.error("Error fetching admin name:", e);
      }
    };
    fetchAdminName();
  }, [userId, role]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch letter details
      const letterRes = await fetch(`${import.meta.env.VITE_API_URL}/experience-letter/${id}`);
      const letterJson = await letterRes.json();
      if (!letterJson.success) throw new Error("Letter not found");
      const letter = letterJson.data;
      setLetterData(letter);

      // Fetch format for this company
      const companyId = letter.companyId?._id || letter.companyId;
      const formatRes = await fetch(`${import.meta.env.VITE_API_URL}/experience-letter-format?companyId=${companyId}`);
      const formatJson = await formatRes.json();
      if (formatJson.success && formatJson.data) {
        setFormatContent(formatJson.data.bodycontent);
      } else {
        setFormatContent("<p>No format found for this company.</p>");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-semibold">Loading Letter Preview...</div>;
  if (!letterData) return <div className="p-8 text-center text-red-500 font-semibold">Error loading letter data.</div>;

  // Replace placeholders dynamically
  let finalContent = formatContent;
  if (finalContent) {
    finalContent = finalContent.replace(/\[Employee Name\]/gi, letterData.employeeName || "");
    finalContent = finalContent.replace(/\[Company Name\]/gi, letterData.companyId?.companyName || "Company");
    finalContent = finalContent.replace(/\[Designation\]/gi, letterData.designation || "");
    finalContent = finalContent.replace(/\[Joining Date\]/gi, new Date(letterData.joiningDate).toLocaleDateString() || "");
    finalContent = finalContent.replace(/\[Relieving Date\]/gi, new Date(letterData.relievingDate).toLocaleDateString() || "");
  }

  return (
    <div className="min-h-screen bg-neutral-200 py-8 px-4 sm:px-8 print:p-0 print:bg-white">
      <div className="mx-auto flex max-w-4xl justify-between mb-4 print:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="rounded-md bg-slate-800 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition"
        >
          Back
        </button>
        <button 
          onClick={handlePrint}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Print / Save PDF
        </button>
      </div>

      {/* A4 Paper Container */}
      <div className="mx-auto w-[210mm] min-h-[297mm] bg-white shadow-2xl print:shadow-none print:w-full print:min-h-[297mm] print:m-0 font-sans text-black relative overflow-hidden flex flex-col">
        
        {/* Clean Corporate Header */}
        <div className="w-full pt-[15mm] px-[20mm]">
          <div className="flex justify-between items-end pb-3 border-b-2 border-blue-800">
            {/* Left: Logo and Company Name */}
            <div>
              {letterData.companyId?.logo || letterData.companyId?.logoKey ? (
                <div className="h-[20mm] mb-2 flex items-end">
                  <img 
                    src={
                      letterData.companyId.logo && (letterData.companyId.logo.startsWith("http") || letterData.companyId.logo.startsWith("data:") || letterData.companyId.logo.startsWith("blob:")) 
                        ? letterData.companyId.logo 
                        : `${import.meta.env.VITE_API_URL}/api/media/preview?key=${letterData.companyId.logoKey}`
                    } 
                    alt="Company Logo" 
                    className="max-h-full object-contain" 
                  />
                </div>
              ) : (
                <h1 className="text-2xl font-black text-blue-800 uppercase tracking-wider mb-1">
                  {letterData.companyId?.companyName || "Company Name"}
                </h1>
              )}
              <p className="text-[10px] text-gray-600 max-w-[80mm] leading-tight font-medium">
                {letterData.companyId?.address || "Metro Pillar No. 772, First Floor, Plot No. 34, Dwarka Mor, New Delhi, Delhi 110059"}
              </p>
            </div>

            {/* Right: Ref & Date */}
            <div className="text-right text-[13px] font-bold text-gray-600 pb-1 space-y-1">
              <p><span className="text-gray-900">Ref. No:</span> {letterData.refNumber}</p>
              <p><span className="text-gray-900">Date:</span> {new Date(letterData.issueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-[20mm] pt-[10mm] pb-[15mm]">
          
          {/* Dynamic Rich Text Content */}
          <div 
            className="prose prose-sm max-w-none text-black leading-relaxed prose-p:my-4 prose-headings:font-bold prose-strong:font-bold prose-strong:text-black text-justify"
            dangerouslySetInnerHTML={{ __html: finalContent }} 
          />

          {/* Digital Signature Block */}
          <div className="mt-16 text-sm text-black">
            <p className="font-bold mb-4 text-[15px]">
              For <span className="text-blue-600">{letterData.companyId?.companyName}</span>
            </p>
            
            {/* Adobe-style Digital Signature */}
            <div className="relative inline-flex items-center gap-3 mb-2 pr-4 min-w-[200px]">
              {/* Acrobat-like Watermark (Red abstract pen/logo) */}
              <div className="absolute left-10 top-0 bottom-0 opacity-25 flex items-center justify-center pointer-events-none z-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="1.5" className="w-14 h-14 transform -rotate-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>

              <div className="text-2xl font-sans tracking-tight z-10 font-medium leading-tight whitespace-pre-line">
                {adminName.replace(' ', '\n')}
              </div>

              <div className="text-[10px] text-gray-800 font-sans z-10 leading-[1.2]">
                <p>Digitally signed</p>
                <p>by {adminName}</p>
                <p>Date:</p>
                <p>{new Date().toISOString().split('T')[0].replace(/-/g, '.')}</p>
                <p>{new Date().toTimeString().split(' ')[0]} +05'30'</p>
              </div>
            </div>
            
            <p className="font-bold text-[14px] mt-1">{adminName}</p>
            <p className="text-gray-800 text-[13px]">Manager – Human Resources</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreviewExperienceLetter;
