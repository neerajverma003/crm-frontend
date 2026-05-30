import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const PreviewOfferLetter = ({ formatData, company, onClose }) => {
  const contentRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // ─── Page count (optimized) ───────────────────────────────────────────────
  const basePages = 2; // main letter now spans 2 pages
  const annexurePages = formatData.annexureA ? 1 : 0;
  const ndaPages = formatData.nonDisclosureAgreement ? 2 : 0; // NDA now spans 2 pages
  const totalPages = basePages + annexurePages + ndaPages;

  // NDA starts right after the letter pages + annexure (if present)
  const ndaStartPage = basePages + annexurePages + 1;

  const getPrefix = () => {
    if (formatData.candidateGender === "Female") {
      return formatData.maritalStatus === "Married" ? "Mrs." : "Ms.";
    }
    return "Mr.";
  };
  
  const getRelationPrefix = () => {
    if (formatData.candidateGender === "Female") {
      return formatData.maritalStatus === "Married" ? "W/o" : "D/o";
    }
    return "S/o";
  };

  // ─── Print handler ────────────────────────────────────────────────────────
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `${company?.companyName || "Offer Letter"}_Preview`,
    pageStyle: `
      @page { size: A4 portrait; margin: 0; }
      html, body { 
        margin: 0 !important; 
        padding: 0 !important; 
        background: white !important; 
        -webkit-print-color-adjust: exact !important; 
        print-color-adjust: exact !important; 
        font-family: Arial, Helvetica, sans-serif !important;
      }
      
      table.report-container { width: 100%; border-collapse: collapse; }
      thead.report-header { display: table-header-group; }
      tfoot.report-footer { display: table-footer-group; }
      tbody.report-body { display: table-row-group; }
      
      .page-number::after { content: counter(page); }
      .page-break { page-break-before: always !important; }
      
      .rich-content { width: 100%; font-family: Arial, Helvetica, sans-serif !important; }
      .rich-content p { font-size: 11px !important; line-height: 1.6 !important; color: #2d3748 !important; margin: 4px 0 !important; text-align: justify !important; }
      .rich-content h1, .rich-content h2, .rich-content h3, .rich-content h4 { 
        font-weight: normal !important; 
        color: #1a202c !important; 
        margin-top: 8px !important; 
        margin-bottom: 4px !important; 
        text-align: justify !important;
        font-family: Arial, Helvetica, sans-serif !important;
      }
      .rich-content h1 { font-size: 12px !important; font-weight: bold !important; }
      .rich-content h2 { font-size: 11px !important; }
      .rich-content h3 { font-size: 11px !important; }
      .rich-content h4 { font-size: 10px !important; }
      .rich-content ul { list-style-type: disc !important; }
      .rich-content ol { list-style-type: decimal !important; }
      .rich-content ul, .rich-content ol { margin-left: 18px !important; margin-bottom: 6px !important; padding-left: 10px !important; font-size: 11px !important; }
      .rich-content li { display: list-item !important; margin-bottom: 3px !important; font-size: 11px !important; line-height: 1.6 !important; text-align: justify !important; }
      
      .fixed-footer {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        background: white !important;
        z-index: 1000 !important;
      }
      tfoot.report-footer td {
        height: 20mm !important;
      }

      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; font-family: Arial, Helvetica, sans-serif !important; }
    `,
  });

  // ─── Download PDF via backend ─────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const htmlContent = contentRef.current?.innerHTML;
      if (!htmlContent) {
        alert("No content to generate PDF");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/offer-letter-format/generate-pdf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            htmlContent,
            fileName: `${formatData.candidateName || "Offer_Letter"}_${
              new Date().toISOString().split("T")[0]
            }.pdf`,
            companyName: company?.companyName || "Company",
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${formatData.candidateName || "Offer_Letter"}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF: " + error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const cleanHtmlContent = (html) => {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.innerHTML;
  };

  // ─── Sub-components ───────────────────────────────────────────────────────
  const PageHeader = () => (
    <div
      style={{
        borderBottom: "1.2px solid #1e40af",
        paddingBottom: "8px",
        marginBottom: "14px",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
          <div
            style={{
              width: "160px",
              height: "60px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              overflow: "hidden",
            }}
          >
            <img
              src={
                company?.logo ||
                "http://res.cloudinary.com/dv8c2pofx/image/upload/v1741721783/dhc7rhowf682tyfq6l0g.jpg"
              }
              alt={company?.companyName || "Company Logo"}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          </div>
          <div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: "900",
                color: "#1e40af",
                margin: "0",
                lineHeight: "1",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {company?.companyName || "Admire Softech"}
            </h1>
          </div>
        </div>

        <div style={{ textAlign: "right", minWidth: "130px", paddingBottom: "2px" }}>
          <p style={{ fontSize: "10px", color: "#1e293b", margin: "1px 0" }}>
            <strong>Ref. No:</strong> {formatData.refNumber || "AD/04-2024/0192"}
          </p>
          <p style={{ fontSize: "10px", color: "#1e293b", margin: "1px 0" }}>
            <strong>Date:</strong> {formatData.offerDate || "22 April 2024"}
          </p>
        </div>
      </div>
    </div>
  );

  const PageFooter = () => (
    <div
      className="fixed-footer"
      style={{
        borderTop: "2px solid #1a202c",
        paddingTop: "10px",
        paddingBottom: "10mm",
        paddingLeft: "12mm",
        paddingRight: "12mm",
        textAlign: "center",
        fontSize: "11px",
        color: "#2d3748",
        backgroundColor: "#fff",
        flexShrink: 0,
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <p style={{ margin: "0", fontSize: "10px", color: "#718096", fontWeight: "500" }}>
        {company?.companyName || "Admire Softech Solutions Pvt. Ltd."}
      </p>
    </div>
  );

  /** Rich-text block rendered from HTML string */
  const RichContent = ({ html }) => (
    <div
      className="rich-content"
      style={{
        color: "#2d3748",
        fontSize: "11px",
        lineHeight: "1.7",
        textAlign: "justify",
        paddingLeft: "8px",
      }}
      dangerouslySetInnerHTML={{ __html: cleanHtmlContent(html) }}
    />
  );

  /** Numbered section heading */
  const TermSection = ({ number, label, html }) =>
    html ? (
      <div style={{ marginBottom: "15px" }}>
        <h3
          style={{
            fontWeight: "bold",
            color: "#111827",
            fontSize: "11px",
            margin: "0 0 6px 0",
          }}
        >
          {number}. {label}:
        </h3>
        <RichContent html={html} />
      </div>
    ) : null;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      {/* Scoped styles using class selectors (not invalid attribute selectors) */}
      <style>{`
        /* ── Print overrides ── */
        @media print {
          .no-print { display: none !important; }
          body { margin: 0 !important; padding: 0 !important; background: white !important; }
          .document-wrapper { width: 100% !important; margin: 0 !important; box-shadow: none !important; }
          .screen-page-divider { display: none !important; }
        }

        /* ── Screen styles ── */
        .rich-content { overflow: visible; word-wrap: break-word; white-space: normal; }
        .rich-content p { font-size: 11px; line-height: 1.7; color: #2d3748; text-align: justify; margin: 4px 0; font-family: Arial, sans-serif; }
        .rich-content ul { list-style-type: disc; }
        .rich-content ol { list-style-type: decimal; }
        .rich-content ol, .rich-content ul { font-size: 11px; line-height: 1.7; color: #2d3748; text-align: justify; margin: 4px 0 4px 18px; padding-left: 10px; }
        .rich-content li { display: list-item; font-size: 11px; line-height: 1.7; color: #2d3748; margin: 3px 0; padding-left: 6px; }
        .rich-content strong, .rich-content b { font-weight: bold; color: #1a202c; }
        .rich-content em, .rich-content i    { font-style: italic; color: #2d3748; }
        .rich-content u { text-decoration: underline; }
        .rich-content blockquote { border-left: 3px solid #cbd5e1; padding-left: 12px; margin: 8px 0; font-style: italic; color: #4a5568; }
        .rich-content h1 { font-size: 13px; font-weight: normal; margin: 12px 0 6px; color: #1a202c; }
        .rich-content h2 { font-size: 12px; font-weight: normal; margin: 10px 0 5px; color: #1e293b; }
        .rich-content h3 { font-size: 11px; font-weight: normal; margin: 8px 0 4px; color: #1e293b; }
        .rich-content h4 { font-size: 10px; font-weight: normal; margin: 6px 0 3px; color: #1a202c; }
      `}</style>

      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">

        {/* Modal Header */}
        <div className="no-print border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50 shrink-0 z-10 relative">
          <h2 className="text-2xl font-bold text-slate-900">Offer Letter Preview</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700" aria-label="Close">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="no-print border-b border-slate-200 px-6 py-3 bg-slate-50 flex gap-2 shrink-0 z-10 relative shadow-sm">
          <button
            onClick={handlePrint}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Print / Save as PDF
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-slate-500 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
          >
            Close
          </button>
        </div>

        {/* Document Area */}
        <div className="overflow-y-auto flex-1 p-6 bg-slate-100 flex justify-center">
          
          <div ref={contentRef} className="document-wrapper" style={{ backgroundColor: "#fff", fontFamily: "Arial, sans-serif", width: "210mm", minHeight: "297mm", margin: "0 auto", padding: "0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <table className="report-container">
              <thead className="report-header">
                <tr>
                  <td>
                    <div style={{ padding: "10mm 12mm 4mm 12mm" }}>
                      <PageHeader />
                    </div>
                  </td>
                </tr>
              </thead>

              <tbody className="report-body">
                <tr>
                  <td>
                    <div style={{ padding: "0 12mm" }}>
                      {/* ── PAGE 1: Candidate info + offer terms + job responsibilities ── */}
              <div style={{ fontSize: "11px", lineHeight: "1.8", color: "#2d3748" }}>

                {/* Candidate Info */}
                {(formatData.candidateName || formatData.candidateAddress || formatData.candidatePhone || formatData.candidateEmail) && (
                  <div style={{ marginBottom: "25px", pageBreakInside: "avoid" }}>
                    {formatData.candidateName   && <p style={{ margin: "4px 0", fontSize: "11px" }}><strong>Name:</strong> {formatData.candidateName}</p>}
                    {formatData.candidateAddress && <p style={{ margin: "4px 0", fontSize: "11px" }}><strong>Address:</strong> {formatData.candidateAddress}</p>}
                    {formatData.candidatePhone   && <p style={{ margin: "4px 0", fontSize: "11px" }}><strong>Phone:</strong> {formatData.candidatePhone}</p>}
                    {formatData.candidateEmail   && <p style={{ margin: "4px 0", fontSize: "11px" }}><strong>Email:</strong> {formatData.candidateEmail}</p>}
                  </div>
                )}

                {/* Title */}
                <div style={{ textAlign: "center", margin: "25px 0" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#111827", margin: "0", textDecoration: "underline", textDecorationThickness: "2px", textUnderlineOffset: "6px", letterSpacing: "2px" }}>
                    OFFER LETTER
                  </h2>
                </div>

                {/* Greeting */}
                {formatData.candidateName && (
                  <p style={{ marginBottom: "12px", textAlign: "justify" }}>
                    <strong>Dear {getPrefix()} {formatData.candidateName},</strong>
                  </p>
                )}

                {/* Legal intro */}
                <p style={{ marginBottom: "15px", textAlign: "justify", fontSize: "11px", lineHeight: "1.7" }}>
                  This Offer Letter is entered into between <strong>{company?.companyName || "the Company"}</strong> and{" "}
                  <strong>{getPrefix()} {formatData.candidateName || "[Name]"}</strong>,{" "}
                  {formatData.fatherName ? `${getRelationPrefix()} ${formatData.fatherName}, ` : ""}
                  residing at {formatData.candidateAddress || "[Address]"} (hereinafter referred to as the "Employee").
                </p>

                <p style={{ marginBottom: "12px", textAlign: "justify", fontSize: "11px", lineHeight: "1.7" }}>
                  We are pleased to offer you the position of{" "}
                  <strong>{formatData.jobTitle || "[Position Title]"}</strong> at{" "}
                  <strong>{company?.companyName || "the Company"}</strong>. We believe your skills and experience will be valuable assets to our organization.
                </p>

                {/* Employment Terms */}
                <p style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px" }}>The terms of your employment are as follows:</p>
                <ol style={{ marginTop: "8px", marginBottom: "15px", paddingLeft: "20px", lineHeight: "1.7", fontSize: "11px" }}>
                  {formatData.jobTitle        && <li style={{ marginBottom: "4px" }}><strong>Job Title:</strong> {formatData.jobTitle}</li>}
                  {formatData.joiningDate     && <li style={{ marginBottom: "4px" }}><strong>Date of Joining:</strong> {formatData.joiningDate}</li>}
                  {formatData.employmentType  && <li style={{ marginBottom: "4px" }}><strong>Employment Type:</strong> {formatData.employmentType}</li>}
                  {formatData.reportingTo     && <li style={{ marginBottom: "4px" }}><strong>Reporting To:</strong> {formatData.reportingTo}</li>}
                  {formatData.salary          && <li style={{ marginBottom: "4px" }}><strong>Salary:</strong> {formatData.salary}</li>}
                  {formatData.benefits        && <li style={{ marginBottom: "4px" }}><strong>Benefits:</strong> {formatData.benefits}</li>}
                </ol>

                {/* Job Responsibilities */}
                {formatData.jobResponsibilities && (
                  <div style={{ marginTop: "15px" }}>
                    <h3 style={{ fontWeight: "bold", color: "#111827", fontSize: "11px", margin: "12px 0 8px 0" }}>Job Responsibilities:</h3>
                    <RichContent html={formatData.jobResponsibilities} />
                  </div>
                )}
              </div>
                      {/* ── All Terms & Conditions (4-13) + Signature ── */}
                      <div style={{ fontSize: "11px", lineHeight: "1.8", color: "#2d3748" }}>
                          <TermSection number="4" label="Work Hours"                          html={formatData.workHours} />
                          <TermSection number="5" label="Confidentiality"                     html={formatData.confidentiality} />
                          <TermSection number="6" label="At-Will Employment"                  html={formatData.atWillEmployment} />
                          <TermSection number="7" label="Notice Period"                       html={formatData.noticePeriod} />
                          <TermSection number="8" label="Relieving and Final Settlement Terms & Conditions" html={formatData.relievingAndFinalSettlement} />
                          <TermSection number="9"  label="Confidentiality and Non-Disclosure" html={formatData.confidentialityAndNda} />
                          <TermSection number="10" label="Payment in Lieu of Notice"          html={formatData.paymentInLieuOfNotice} />
                          <TermSection number="11" label="Exit Interview"                     html={formatData.exitInterview} />
                          <TermSection number="12" label="Legal Compliance"                   html={formatData.legalCompliance} />
                          <TermSection number="13" label="Post-Employment Benefits"           html={formatData.postEmploymentBenefits} />
                        </div>
                    </div>
                  </td>
                </tr>
              </tbody>

              {/* ── PAGE 4 (optional): ANNEXURE A ── */}
              {formatData.annexureA && (
                <tbody className="report-body" style={{ breakBefore: "page", pageBreakBefore: "always" }}>
                  <tr>
                    <td>
                      <div style={{ padding: "0 12mm" }}>
                        <div className="screen-page-divider no-print" style={{ borderTop: "2px dashed #94a3b8", margin: "40px -12mm 40px -12mm", position: "relative" }}>
                          <span style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "#f1f5f9", padding: "0 10px", fontSize: "10px", color: "#64748b", fontWeight: "bold" }}>Page Break (PDF Only)</span>
                        </div>
                        <div style={{ fontSize: "11px", lineHeight: "1.8", color: "#2d3748" }}>
                          <div style={{ textAlign: "center", marginBottom: "15px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#111827", margin: "0", textDecoration: "underline", textDecorationThickness: "2px", textUnderlineOffset: "6px", letterSpacing: "1px" }}>
                              ANNEXURE A
                            </h2>
                          </div>

                          <RichContent html={formatData.annexureA} />

                          {/* Acknowledgment */}
                          <div style={{ marginTop: "20px", pageBreakInside: "avoid", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
                            <p style={{ fontWeight: "bold", fontSize: "11px", marginBottom: "10px" }}>ACKNOWLEDGMENT AND ACCEPTANCE</p>
                            <p style={{ fontSize: "11px", marginBottom: "15px" }}>
                              I, {formatData.candidateName || "[Candidate Name]"}, hereby accept the employment offer as{" "}
                              {formatData.jobTitle || "[Job Title]"} at {company?.companyName || "the Company"}, under the terms and conditions stated in this letter.
                            </p>
                            <div style={{ marginTop: "20px", fontSize: "11px" }}>
                              <p style={{ marginBottom: "20px" }}>Signature: ___________________________</p>
                              <p style={{ marginBottom: "5px" }}>Date: ___________________________</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              )}

              {/* ── NDA pages (only if nonDisclosureAgreement is present) ── */}
              {formatData.nonDisclosureAgreement && (
                <tbody className="report-body" style={{ breakBefore: "page", pageBreakBefore: "always" }}>
                  <tr>
                    <td>
                      <div style={{ padding: "0 12mm" }}>
                        <div className="screen-page-divider no-print" style={{ borderTop: "2px dashed #94a3b8", margin: "40px -12mm 40px -12mm", position: "relative" }}>
                          <span style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "#f1f5f9", padding: "0 10px", fontSize: "10px", color: "#64748b", fontWeight: "bold" }}>Page Break (PDF Only)</span>
                        </div>
                        <div style={{ fontSize: "11px", lineHeight: "1.8", color: "#2d3748" }}>
                          <div style={{ textAlign: "center", marginBottom: "20px" }}>
                            <p style={{ fontSize: "11px", fontWeight: "normal", textDecoration: "underline", marginBottom: "4px" }}>Non Disclosure Agreement</p>
                            <h3 style={{ fontSize: "15px", fontWeight: "normal", color: "#111827", margin: "0" }}>
                              DATA NON-CLOSURE AGREEMENT (NDA)
                            </h3>
                          </div>

                          <div style={{ fontSize: "11px", lineHeight: "1.7", marginBottom: "15px", textAlign: "justify" }}>
                            <p>This Agreement is made on <strong>{formatData.offerDate || new Date().toLocaleDateString()}</strong> by and between:</p>
                            <p style={{ margin: "8px 0" }}>
                              <strong>{company?.companyName || "the Company"}</strong>, a company incorporated under the laws of India and having its registered office at{" "}
                              {company?.address || "_______________________"} (hereinafter referred to as the "Company").
                            </p>
                          </div>

                          <RichContent html={formatData.nonDisclosureAgreement} />

                          {formatData.ndaWhereas && (
                            <div style={{ marginBottom: "12px" }}>
                              <p style={{ fontWeight: "bold", color: "#111827", marginBottom: "6px", fontSize: "11px" }}>WHEREAS:</p>
                              <RichContent html={formatData.ndaWhereas} />
                            </div>
                          )}

                          {[
                            { key: "ndaDefinitionOfConfidential",   label: "1. Definition of Confidential Information" },
                            { key: "ndaObligationOfConfidentiality", label: "2. Obligation of Confidentiality" },
                            { key: "ndaExclusions",                 label: "3. Exclusions" },
                            { key: "ndaTerm",                       label: "4. Term" },
                            { key: "ndaReturnOfMaterials",           label: "5. Return of Materials" },
                            { key: "ndaBreachAndRemedies",    label: "6. Breach and Remedies" },
                            { key: "ndaGoverningLaw",         label: "7. Governing Law and Jurisdiction" },
                            { key: "ndaAdditionalObligations",label: "8. Additional Obligations" },
                          ].map(({ key, label }) =>
                            formatData[key] ? (
                              <div key={key} style={{ marginBottom: "12px" }}>
                                <p style={{ fontWeight: "bold", color: "#111827", marginBottom: "6px", fontSize: "11px" }}>{label}</p>
                                <RichContent html={formatData[key]} />
                              </div>
                            ) : null
                          )}

                          {/* Signature block */}
                          <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px", pageBreakInside: "avoid" }}>
                            <p style={{ fontWeight: "bold", fontSize: "11px", marginBottom: "10px" }}>ACKNOWLEDGMENT AND ACCEPTANCE</p>
                            <p style={{ fontSize: "11px", marginBottom: "15px" }}>
                              I, {formatData.candidateName || "[Candidate Name]"}, hereby accept the terms and conditions of this Non-Disclosure Agreement as of the date mentioned below.
                            </p>
                            <div style={{ marginTop: "30px", fontSize: "11px" }}>
                              <p style={{ fontWeight: "bold", marginBottom: "15px" }}>For {company?.companyName || "Admire Softech Solutions Pvt. Ltd."}</p>
                              <p style={{ marginBottom: "30px" }}>Signature: ___________________________</p>
                              <div style={{ paddingTop: "15px", marginTop: "15px" }}>
                                <p style={{ marginBottom: "10px" }}>Employee Signature: ___________________________</p>
                                <p style={{ marginBottom: "5px" }}>Name: <strong>{getPrefix()} {formatData.candidateName}</strong></p>
                                <p style={{ marginBottom: "5px" }}>Date: {formatData.offerDate || new Date().toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              )}

              <tfoot className="report-footer">
                <tr>
                  <td style={{ padding: 0 }}>
                    {/* The wrapper reserves space, PageFooter gets fixed to bottom in print */}
                    <div style={{ padding: "0 0" }}>
                      <PageFooter />
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewOfferLetter;