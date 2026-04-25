import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const PreviewOfferLetter = ({ formatData, company, onClose }) => {
  const contentRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `${company?.companyName || "Offer Letter"}_Preview`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0 !important;
        padding: 0 !important;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        background-color: white !important;
      }
      html {
        margin: 0 !important;
        padding: 0 !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `,
  });

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);

      // Get HTML content from the contentRef
      const htmlContent = contentRef.current?.innerHTML;
      if (!htmlContent) {
        alert("No content to generate PDF");
        return;
      }

      // Send to backend for PDF generation
      const response = await fetch("http://localhost:4000/offer-letter-format/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent,
          fileName: `${formatData.candidateName || "Offer Letter"}_${new Date().toISOString().split("T")[0]}.pdf`,
          companyName: company?.companyName || "Admire Softech Solutions Pvt Ltd",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Get the PDF as blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${formatData.candidateName || "Offer Letter"}_${new Date().toISOString().split("T")[0]}.pdf`;
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

  const cleanHtmlContent = (html) => {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.innerHTML;
  };

  const PageHeader = () => (
    <div style={{ 
      borderBottom: "2px solid #334155",
      paddingBottom: "12px",
      marginBottom: "12px",
      flexShrink: 0,
      pageBreakInside: "avoid"
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        {/* Company Logo */}
        {company?.logo && (
          <div style={{ width: "70px", height: "70px", flexShrink: 0 }}>
            <img
              src={company.logo}
              alt={company.companyName}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        )}

        {/* Company Info */}
        <div style={{ flex: 1, textAlign: "right" }}>
          <h1 style={{ 
            fontSize: "20px", 
            fontWeight: "bold", 
            color: "#1a202c",
            margin: "0 0 4px 0",
            letterSpacing: "0.5px"
          }}>
            {company?.companyName || "Company Name"}
          </h1>
          <p style={{ fontSize: "12px", color: "#4a5568", margin: "2px 0" }}>
            {company?.email}
          </p>
          <p style={{ fontSize: "12px", color: "#4a5568", margin: "2px 0" }}>
            {company?.phoneNumber}
          </p>
          <p style={{ fontSize: "12px", color: "#4a5568", margin: "2px 0" }}>
            {company?.address}
          </p>
        </div>
      </div>
    </div>
  );

  const PageFooter = ({ pageNumber, totalPages }) => (
    <div style={{
      borderTop: "2px solid #1a202c",
      paddingTop: "10px",
      paddingBottom: "8px",
      textAlign: "center",
      fontSize: "11px",
      color: "#2d3748",
      backgroundColor: "#f8f9fa",
      flexShrink: 0,
      pageBreakInside: "avoid",
      boxSizing: "border-box",
    }}>
      <p style={{ margin: "0", fontSize: "10px", color: "#718096", fontWeight: "500" }}>
        Page {pageNumber} of {totalPages}
      </p>
    </div>
  );

  const Section = ({ pageNumber, totalPages, children }) => (
    <div style={{
      width: "100%",
      height: "297mm",
      padding: "0",
      boxSizing: "border-box",
      backgroundColor: "#fff",
      pageBreakAfter: "always",
      pageBreakInside: "avoid",
      display: "grid",
      gridTemplateRows: "auto 1fr auto",
      gridGap: "0",
      fontFamily: "Arial, sans-serif",
      margin: "0",
    }}>
      {/* Row 1: Fixed Header */}
      <div style={{ gridRow: "1", padding: "15mm 15mm 8px 15mm", paddingBottom: "8px" }}>
        <PageHeader />
      </div>

      {/* Row 2: Content Area - grows to fill available space */}
      <div
        style={{
          gridRow: "2",
          overflow: "visible",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          margin: "0",
        }}
      >
        <div style={{ padding: "4px 15mm", margin: "0" }}>
          {children}
        </div>
      </div>

      {/* Row 3: Fixed Footer at bottom */}
      <div style={{ gridRow: "3", padding: "8px 15mm 15mm 15mm", paddingTop: "8px" }}>
        <PageFooter pageNumber={pageNumber} totalPages={totalPages} />
      </div>
    </div>
  );

  const SectionTitle = ({ title }) => (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h2 style={{ 
        fontSize: "18px", 
        fontWeight: "bold", 
        color: "#1a202c",
        margin: "0 0 6px 0",
        letterSpacing: "0.5px"
      }}>
        {title}
      </h2>
      <p style={{ 
        fontSize: "11px", 
        color: "#4a5568", 
        margin: 0,
        fontStyle: "italic"
      }}>
        Confidential - For Recipient's Use Only
      </p>
    </div>
  );

  const SectionContent = ({ title, content }) => (
    <div style={{ marginBottom: "18px" }}>
      {title && <h3 style={{ 
        fontWeight: "bold", 
        color: "#1a202c", 
        fontSize: "13px",
        margin: "12px 0 6px 0",
        letterSpacing: "0.3px"
      }}>
        {title}
      </h3>}
      <div
        style={{
          color: "#2d3748",
          fontSize: "12px",
          lineHeight: "1.8",
          textAlign: "justify",
        }}
        dangerouslySetInnerHTML={{
          __html: cleanHtmlContent(content),
        }}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 100% !important;
            height: auto !important;
          }
          
          .fixed,
          .relative,
          .w-full,
          .max-w-5xl,
          .max-h-screen,
          .rounded-lg,
          .shadow-2xl,
          .overflow-auto,
          .flex,
          .flex-col,
          .items-center,
          .justify-center,
          .p-4,
          .px-6,
          .py-4,
          .p-6,
          .bg-black,
          .bg-opacity-50,
          .bg-slate-100,
          .border-b,
          .border-slate-200,
          .bg-slate-50 {
            position: static !important;
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            max-height: none !important;
            background: white !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 0 !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
        }
        
        div[dangerouslySetInnerHTML] {
          overflow: visible;
          word-wrap: break-word;
          white-space: normal;
        }
        
        div[dangerouslySetInnerHTML] p {
          font-size: 12px;
          line-height: 1.8;
          color: #2d3748;
          text-align: justify;
          margin: 6px 0;
          font-family: Arial, sans-serif;
        }
        
        div[dangerouslySetInnerHTML] ol,
        div[dangerouslySetInnerHTML] ul {
          font-size: 12px;
          line-height: 1.8;
          color: #2d3748;
          text-align: justify;
          margin: 6px 0 6px 20px;
          padding-left: 20px;
        }
        
        div[dangerouslySetInnerHTML] li {
          font-size: 12px;
          line-height: 1.8;
          color: #2d3748;
          margin: 4px 0;
          padding-left: 8px;
        }
        
        div[dangerouslySetInnerHTML] strong,
        div[dangerouslySetInnerHTML] b {
          font-weight: bold;
          color: #1a202c;
        }
        
        div[dangerouslySetInnerHTML] em,
        div[dangerouslySetInnerHTML] i {
          font-style: italic;
          color: #2d3748;
        }
        
        div[dangerouslySetInnerHTML] u {
          text-decoration: underline;
        }
        
        div[dangerouslySetInnerHTML] blockquote {
          border-left: 3px solid #cbd5e1;
          padding-left: 12px;
          margin: 8px 0;
          font-style: italic;
          color: #4a5568;
        }
        
        div[dangerouslySetInnerHTML] h1,
        div[dangerouslySetInnerHTML] h2,
        div[dangerouslySetInnerHTML] h3,
        div[dangerouslySetInnerHTML] h4 {
          font-weight: bold;
          margin: 12px 0 6px 0;
          color: #1a202c;
        }
        
        div[dangerouslySetInnerHTML] h1 {
          font-size: 14px;
        }
        
        div[dangerouslySetInnerHTML] h2 {
          font-size: 13px;
        }
        
        div[dangerouslySetInnerHTML] h3 {
          font-size: 12px;
        }
        
        div[dangerouslySetInnerHTML] h4 {
          font-size: 11px;
        }
      `}</style>
      <div className="relative w-full max-w-5xl max-h-screen bg-white rounded-lg shadow-2xl overflow-auto flex flex-col">
        {/* Modal Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-900">Offer Letter Preview</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Print Button */}
        <div className="border-b border-slate-200 px-6 py-3 bg-slate-50 flex gap-2">
          <button
            onClick={handlePrint}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Print / Save as PDF
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloading ? "Downloading..." : "Download PDF"}
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-slate-500 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
          >
            Close
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto flex-1 p-6 bg-slate-100">
          <div
            ref={contentRef}
            style={{
              backgroundColor: "#fff",
              fontFamily: "Arial, sans-serif",
              width: "100%",
              margin: "0 auto",
              padding: "0",
            }}
          >
            {/* PAGE 1: OFFER LETTER WITH CANDIDATE INFO */}
            <Section pageNumber={1} totalPages={3}>
              <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#2d3748", width: "100%" }}>
                
                {/* Candidate Information Section */}
                {(formatData.candidateName || formatData.candidateAddress || formatData.candidatePhone || formatData.candidateEmail) && (
                  <div style={{ marginBottom: "18px", pageBreakInside: "avoid" }}>
                    {formatData.candidateName && (
                      <p style={{ margin: "2px 0", fontSize: "11px" }}><strong>Name:</strong> {formatData.candidateName}</p>
                    )}
                    {formatData.candidateAddress && (
                      <p style={{ margin: "2px 0", fontSize: "11px" }}><strong>Address:</strong> {formatData.candidateAddress}</p>
                    )}
                    {formatData.candidatePhone && (
                      <p style={{ margin: "2px 0", fontSize: "11px" }}><strong>Phone:</strong> {formatData.candidatePhone}</p>
                    )}
                    {formatData.candidateEmail && (
                      <p style={{ margin: "2px 0", fontSize: "11px" }}><strong>Email:</strong> {formatData.candidateEmail}</p>
                    )}
                  </div>
                )}

                {/* Offer Letter Title */}
                <div style={{ textAlign: "center", marginBottom: "15px", pageBreakInside: "avoid" }}>
                  <h2 style={{ 
                    fontSize: "16px", 
                    fontWeight: "bold", 
                    color: "#1a202c",
                    margin: "0",
                    textDecoration: "underline",
                    textDecorationThickness: "2px",
                    textUnderlineOffset: "4px"
                  }}>
                    OFFER LETTER
                  </h2>
                </div>

                {/* Greeting */}
                {formatData.candidateName && (
                  <p style={{ marginBottom: "12px", textAlign: "justify", pageBreakInside: "avoid" }}>
                    <strong>Dear Mr {formatData.candidateName},</strong>
                  </p>
                )}

                {/* Introduction */}
                <p style={{ 
                  marginBottom: "12px", 
                  textAlign: "justify", 
                  fontSize: "11px",
                  lineHeight: "1.7",
                  pageBreakInside: "avoid"
                }}>
                  We are pleased to offer you the position of <strong>{formatData.jobTitle || "[Position Title]"}</strong> at <strong>Admire Softech Solutions Pvt Ltd</strong>. We believe your skills and experience will be valuable assets to our organization.
                </p>

                {/* Employment Terms as Numbered List */}
                <p style={{ fontWeight: "bold", marginTop: "12px", marginBottom: "8px", pageBreakInside: "avoid" }}>The terms of your employment are as follows:</p>
                <ol style={{ 
                  marginTop: "8px", 
                  marginBottom: "15px", 
                  paddingLeft: "20px",
                  lineHeight: "1.7",
                  fontSize: "11px",
                  pageBreakInside: "avoid"
                }}>
                  {formatData.jobTitle && (
                    <li style={{ marginBottom: "4px" }}>
                      <strong>Job Title:</strong> {formatData.jobTitle}
                    </li>
                  )}
                  {formatData.joiningDate && (
                    <li style={{ marginBottom: "4px" }}>
                      <strong>Date of Joining:</strong> {formatData.joiningDate}
                    </li>
                  )}
                  {formatData.employmentType && (
                    <li style={{ marginBottom: "4px" }}>
                      <strong>Employment Type:</strong> {formatData.employmentType}
                    </li>
                  )}
                  {formatData.reportingTo && (
                    <li style={{ marginBottom: "4px" }}>
                      <strong>Reporting To:</strong> {formatData.reportingTo}
                    </li>
                  )}
                  {formatData.salary && (
                    <li style={{ marginBottom: "4px" }}>
                      <strong>Salary:</strong> {formatData.salary}
                    </li>
                  )}
                  {formatData.benefits && (
                    <li style={{ marginBottom: "4px" }}>
                      <strong>Benefits:</strong> {formatData.benefits}
                    </li>
                  )}
                </ol>

                {/* Job Responsibilities Section */}
                {formatData.jobResponsibilities && (
                  <div style={{ marginTop: "15px", pageBreakInside: "avoid" }}>
                    <h3 style={{ 
                      fontWeight: "bold", 
                      color: "#1a202c", 
                      fontSize: "12px", 
                      margin: "12px 0 8px 0",
                      pageBreakInside: "avoid"
                    }}>
                      Job Responsibilities:
                    </h3>
                    <div style={{ 
                      color: "#2d3748", 
                      fontSize: "11px", 
                      lineHeight: "1.7",
                      textAlign: "justify",
                      paddingLeft: "8px"
                    }} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.jobResponsibilities) }} />
                  </div>
                )}
              </div>
            </Section>

            {/* PAGE 2: CONTINUED SECTIONS */}
            <Section pageNumber={2} totalPages={3}>
              <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#2d3748", width: "100%" }}>
                
                {/* Work Hours */}
                {formatData.workHours && (
                  <div style={{ marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <h3 style={{ 
                      fontWeight: "bold", 
                      color: "#1a202c", 
                      fontSize: "12px", 
                      margin: "0 0 6px 0",
                      pageBreakInside: "avoid"
                    }}>
                      4. Work Hours:
                    </h3>
                    <div style={{ 
                      color: "#2d3748", 
                      fontSize: "11px", 
                      lineHeight: "1.7",
                      textAlign: "justify",
                      paddingLeft: "8px"
                    }} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.workHours) }} />
                  </div>
                )}

                {/* Confidentiality */}
                {formatData.confidentiality && (
                  <div style={{ marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <h3 style={{ 
                      fontWeight: "bold", 
                      color: "#1a202c", 
                      fontSize: "12px", 
                      margin: "0 0 6px 0",
                      pageBreakInside: "avoid"
                    }}>
                      5. Confidentiality:
                    </h3>
                    <div style={{ 
                      color: "#2d3748", 
                      fontSize: "11px", 
                      lineHeight: "1.7",
                      textAlign: "justify",
                      paddingLeft: "8px"
                    }} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.confidentiality) }} />
                  </div>
                )}

                {/* At-Will Employment */}
                {formatData.atWillEmployment && (
                  <div style={{ marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <h3 style={{ 
                      fontWeight: "bold", 
                      color: "#1a202c", 
                      fontSize: "12px", 
                      margin: "0 0 6px 0",
                      pageBreakInside: "avoid"
                    }}>
                      6. At-Will Employment:
                    </h3>
                    <div style={{ 
                      color: "#2d3748", 
                      fontSize: "11px", 
                      lineHeight: "1.7",
                      textAlign: "justify",
                      paddingLeft: "8px"
                    }} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.atWillEmployment) }} />
                  </div>
                )}

                {/* Notice Period */}
                {formatData.noticePeriod && (
                  <div style={{ marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <h3 style={{ 
                      fontWeight: "bold", 
                      color: "#1a202c", 
                      fontSize: "12px", 
                      margin: "0 0 6px 0",
                      pageBreakInside: "avoid"
                    }}>
                      7. Notice Period:
                    </h3>
                    <div style={{ 
                      color: "#2d3748", 
                      fontSize: "11px", 
                      lineHeight: "1.7",
                      textAlign: "justify",
                      paddingLeft: "8px"
                    }} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.noticePeriod) }} />
                  </div>
                )}

                {/* Relieving and Final Settlement */}
                {formatData.relievingAndFinalSettlement && (
                  <div style={{ marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <h3 style={{ 
                      fontWeight: "bold", 
                      color: "#1a202c", 
                      fontSize: "12px", 
                      margin: "0 0 6px 0",
                      pageBreakInside: "avoid"
                    }}>
                      8. Relieving and Final Settlement Terms & Conditions:
                    </h3>
                    <div style={{ 
                      color: "#2d3748", 
                      fontSize: "11px", 
                      lineHeight: "1.7",
                      textAlign: "justify",
                      paddingLeft: "8px"
                    }} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.relievingAndFinalSettlement) }} />
                  </div>
                )}
              </div>
            </Section>

            {/* PAGE 3: MORE SECTIONS + SIGNATURE */}
            <Section pageNumber={3} totalPages={3}>
              <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#2d3748", width: "100%" }}>
                
                {/* Confidentiality and NDA */}
                {formatData.confidentialityAndNda && (
                  <div style={{ marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <h3 style={{ 
                      fontWeight: "bold", 
                      color: "#1a202c", 
                      fontSize: "12px", 
                      margin: "0 0 6px 0",
                      pageBreakInside: "avoid"
                    }}>
                      9. Confidentiality and Non-Disclosure:
                    </h3>
                    <div style={{ 
                      color: "#2d3748", 
                      fontSize: "11px", 
                      lineHeight: "1.7",
                      textAlign: "justify",
                      paddingLeft: "8px"
                    }} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.confidentialityAndNda) }} />
                  </div>
                )}

                {/* Payment in Lieu of Notice */}
                {formatData.paymentInLieuOfNotice && (
                  <div style={{ marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <h3 style={{ 
                      fontWeight: "bold", 
                      color: "#1a202c", 
                      fontSize: "12px", 
                      margin: "0 0 6px 0",
                      pageBreakInside: "avoid"
                    }}>
                      10. Payment in Lieu of Notice:
                    </h3>
                    <div style={{ 
                      color: "#2d3748", 
                      fontSize: "11px", 
                      lineHeight: "1.7",
                      textAlign: "justify",
                      paddingLeft: "8px"
                    }} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.paymentInLieuOfNotice) }} />
                  </div>
                )}

                {/* Exit Interview */}
                {formatData.exitInterview && (
                  <div style={{ marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <h3 style={{ 
                      fontWeight: "bold", 
                      color: "#1a202c", 
                      fontSize: "12px", 
                      margin: "0 0 6px 0",
                      pageBreakInside: "avoid"
                    }}>
                      11. Exit Interview:
                    </h3>
                    <div style={{ 
                      color: "#2d3748", 
                      fontSize: "11px", 
                      lineHeight: "1.7",
                      textAlign: "justify",
                      paddingLeft: "8px"
                    }} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.exitInterview) }} />
                  </div>
                )}

                {/* Legal Compliance */}
                {formatData.legalCompliance && (
                  <div style={{ marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <h3 style={{ 
                      fontWeight: "bold", 
                      color: "#1a202c", 
                      fontSize: "12px", 
                      margin: "0 0 6px 0",
                      pageBreakInside: "avoid"
                    }}>
                      12. Legal Compliance:
                    </h3>
                    <div style={{ 
                      color: "#2d3748", 
                      fontSize: "11px", 
                      lineHeight: "1.7",
                      textAlign: "justify",
                      paddingLeft: "8px"
                    }} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.legalCompliance) }} />
                  </div>
                )}

                {/* Post-Employment Benefits */}
                {formatData.postEmploymentBenefits && (
                  <div style={{ marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <h3 style={{ 
                      fontWeight: "bold", 
                      color: "#1a202c", 
                      fontSize: "12px", 
                      margin: "0 0 6px 0",
                      pageBreakInside: "avoid"
                    }}>
                      13. Post-Employment Benefits:
                    </h3>
                    <div style={{ 
                      color: "#2d3748", 
                      fontSize: "11px", 
                      lineHeight: "1.7",
                      textAlign: "justify",
                      paddingLeft: "8px"
                    }} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.postEmploymentBenefits) }} />
                  </div>
                )}

                {/* Closing */}
                <p style={{ marginTop: "15px", fontSize: "11px", textAlign: "justify", pageBreakInside: "avoid" }}>
                  Please feel free to contact us if you have any questions.<br />
                  <strong>Sincerely,</strong>
                </p>
                <div style={{ marginTop: "30px", fontSize: "11px", pageBreakInside: "avoid" }}>
                  <p style={{ marginBottom: "2px" }}>Admin Head</p>
                  <p style={{ marginBottom: "2px" }}>Admire Softech Solutions Pvt. Ltd.</p>
                </div>
              </div>
            </Section>

            {/* PAGE 4: ANNEXURE A */}
            {formatData.annexureA && (
              <Section pageNumber={4} totalPages={3}>
                <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#2d3748", width: "100%" }}>
                  <div style={{ textAlign: "center", marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <h2 style={{ 
                      fontSize: "16px", 
                      fontWeight: "bold", 
                      color: "#1a202c",
                      margin: "0",
                      textDecoration: "underline",
                      textDecorationThickness: "2px",
                      textUnderlineOffset: "4px"
                    }}>
                      ANNEXURE A
                    </h2>
                  </div>
                  <div style={{ fontSize: "11px", lineHeight: "1.7", textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.annexureA) }} />
                  
                  {/* Acknowledgment Section */}
                  <div style={{ marginTop: "20px", pageBreakInside: "avoid", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
                    <p style={{ fontWeight: "bold", fontSize: "11px", marginBottom: "10px" }}>ACKNOWLEDGMENT AND ACCEPTANCE</p>
                    <p style={{ fontSize: "11px", marginBottom: "15px" }}>
                      I, {formatData.candidateName || "[Candidate Name]"}, hereby accept the employment offer as Web Developer at Admire Softech Solutions Pvt Ltd, under the terms and conditions stated in this letter.
                    </p>
                    <div style={{ marginTop: "20px", fontSize: "11px" }}>
                      <p style={{ marginBottom: "20px" }}>Signature: ___________________________</p>
                      <p style={{ marginBottom: "5px" }}>Date: ___________________________</p>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* PAGE 5: NON DISCLOSURE AGREEMENT - TITLE & FIRST SECTIONS */}
            {formatData.nonDisclosureAgreement && (
              <Section pageNumber={5} totalPages={3}>
                <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#2d3748", width: "100%" }}>
                  <div style={{ textAlign: "center", marginBottom: "15px", pageBreakInside: "avoid" }}>
                    <h2 style={{ 
                      fontSize: "14px", 
                      fontWeight: "bold", 
                      color: "#1a202c",
                      margin: "0 0 5px 0"
                    }}>
                      Non Disclosure Agreement
                    </h2>
                    <h3 style={{ 
                      fontSize: "13px", 
                      fontWeight: "bold", 
                      color: "#1a202c",
                      margin: "0",
                      textDecoration: "underline"
                    }}>
                      DATA NON-CLOSURE AGREEMENT (NDA)
                    </h3>
                  </div>
                  
                  {/* Main NDA Description */}
                  {formatData.nonDisclosureAgreement && (
                    <div style={{ fontSize: "11px", lineHeight: "1.7", textAlign: "justify", marginBottom: "12px" }} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.nonDisclosureAgreement) }} />
                  )}

                  {/* WHEREAS Section */}
                  {formatData.ndaWhereas && (
                    <div style={{ fontSize: "11px", lineHeight: "1.7", textAlign: "justify", marginBottom: "12px" }}>
                      <p style={{ fontWeight: "bold", marginBottom: "6px" }}>WHEREAS</p>
                      <div dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData.ndaWhereas) }} />
                    </div>
                  )}

                  {/* NDA Section 1-2 */}
                  {[
                    { key: "ndaDefinitionOfConfidential", label: "1. Definition of Confidential Information" },
                    { key: "ndaObligationOfConfidentiality", label: "2. Obligation of Confidentiality" },
                  ].map(({ key, label }) => (
                    formatData[key] && (
                      <div key={key} style={{ fontSize: "11px", lineHeight: "1.7", textAlign: "justify", marginBottom: "12px" }}>
                        <p style={{ fontWeight: "bold", marginBottom: "6px" }}>{label}</p>
                        <div dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData[key]) }} />
                      </div>
                    )
                  ))}
                </div>
              </Section>
            )}

            {/* PAGE 6: NON DISCLOSURE AGREEMENT - MIDDLE SECTIONS */}
            {formatData.nonDisclosureAgreement && (
              <Section pageNumber={6} totalPages={3}>
                <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#2d3748", width: "100%" }}>
                  {/* NDA Section 3-5 */}
                  {[
                    { key: "ndaExclusions", label: "3. Exclusions" },
                    { key: "ndaTerm", label: "4. Term" },
                    { key: "ndaReturnOfMaterials", label: "5. Return of Materials" },
                  ].map(({ key, label }) => (
                    formatData[key] && (
                      <div key={key} style={{ fontSize: "11px", lineHeight: "1.7", textAlign: "justify", marginBottom: "12px" }}>
                        <p style={{ fontWeight: "bold", marginBottom: "6px" }}>{label}</p>
                        <div dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData[key]) }} />
                      </div>
                    )
                  ))}
                </div>
              </Section>
            )}

            {/* PAGE 7: NON DISCLOSURE AGREEMENT - FINAL SECTIONS */}
            {formatData.nonDisclosureAgreement && (
              <Section pageNumber={7} totalPages={3}>
                <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#2d3748", width: "100%" }}>
                  {/* NDA Section 6-8 */}
                  {[
                    { key: "ndaBreachAndRemedies", label: "6. Breach and Remedies" },
                    { key: "ndaGoverningLaw", label: "7. Governing Law and Jurisdiction" },
                    { key: "ndaAdditionalObligations", label: "8. Additional Obligations" },
                  ].map(({ key, label }) => (
                    formatData[key] && (
                      <div key={key} style={{ fontSize: "11px", lineHeight: "1.7", textAlign: "justify", marginBottom: "12px" }}>
                        <p style={{ fontWeight: "bold", marginBottom: "6px" }}>{label}</p>
                        <div dangerouslySetInnerHTML={{ __html: cleanHtmlContent(formatData[key]) }} />
                      </div>
                    )
                  ))}
                  
                  {/* Signature Section */}
                  <div style={{ marginTop: "20px", pageBreakInside: "avoid", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
                    <p style={{ fontWeight: "bold", fontSize: "11px", marginBottom: "10px" }}>ACKNOWLEDGMENT AND ACCEPTANCE</p>
                    <p style={{ fontSize: "11px", marginBottom: "15px" }}>
                      I, {formatData.candidateName || "[Candidate Name]"}, hereby accept the terms and conditions of this Non-Disclosure Agreement as of the date mentioned below.
                    </p>
                    <div style={{ marginTop: "20px", fontSize: "11px" }}>
                      <p style={{ marginBottom: "30px" }}>Signature: ___________________________</p>
                      <p style={{ marginBottom: "5px" }}>Designation: {formatData.jobTitle || "_______________________"}</p>
                      <p style={{ marginBottom: "5px" }}>Employee Signature: ___________________________</p>
                      <p style={{ marginBottom: "5px" }}>Name: {formatData.candidateName || "_______________________"}</p>
                      <p style={{ marginBottom: "5px" }}>Date: ___________________________</p>
                    </div>
                  </div>
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewOfferLetter;
