import React from "react";
import { X } from "lucide-react";

const ViewEmployeeModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const formatLabel = (value) => {
    return value || "N/A";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between rounded-t-xl">
          <div>
            <h1 className="text-3xl font-bold text-white">Employee Information</h1>
            <p className="text-blue-100 text-sm mt-1">Complete employee profile details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-500 rounded-lg transition-all text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-blue-600 flex items-center">
              <span className="w-1 h-6 bg-blue-600 rounded mr-3"></span>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Employee Name</p>
                <p className="text-base font-semibold text-gray-900">{formatLabel(data.employeeName)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                <p className="text-base font-semibold text-gray-900 break-all">{formatLabel(data.email)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Father's Name</p>
                <p className="text-base font-semibold text-gray-900">{formatLabel(data.fatherName)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Mother's Name</p>
                <p className="text-base font-semibold text-gray-900">{formatLabel(data.motherName)}</p>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-green-600 flex items-center">
              <span className="w-1 h-6 bg-green-600 rounded mr-3"></span>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
                <p className="text-base font-semibold text-gray-900">{formatLabel(data.employeePhoneNumber)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Emergency Phone</p>
                <p className="text-base font-semibold text-gray-900">{formatLabel(data.emergencyPhoneNumber)}</p>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-purple-600 flex items-center">
              <span className="w-1 h-6 bg-purple-600 rounded mr-3"></span>
              Address Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Parent Address</p>
                <p className="text-base font-semibold text-gray-900 leading-relaxed">
                  {formatLabel(data.parentAddress)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Present Address</p>
                <p className="text-base font-semibold text-gray-900 leading-relaxed">
                  {formatLabel(data.presentAddress)}
                </p>
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-orange-600 flex items-center">
              <span className="w-1 h-6 bg-orange-600 rounded mr-3"></span>
              Employment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Company</p>
                <p className="text-base font-bold text-gray-900">{formatLabel(data.company?.companyName)}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Department</p>
                <p className="text-base font-bold text-gray-900">{formatLabel(data.department?.dep)}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Designation</p>
                <p className="text-base font-bold text-gray-900">{formatLabel(data.designation?.designation)}</p>
              </div>
            </div>
          </div>

          {/* Timestamps Section */}
          {(data.createdAt || data.updatedAt) && (
            <div className="border-t pt-6">
              <p className="text-xs text-gray-500 text-center">
                {data.createdAt && (
                  <>Created: {new Date(data.createdAt).toLocaleString()}</>
                )}
                {data.createdAt && data.updatedAt && <> | </>}
                {data.updatedAt && (
                  <>Last Updated: {new Date(data.updatedAt).toLocaleString()}</>
                )}
              </p>
            </div>
          )}

          {/* Documents Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-slate-600 flex items-center">
              <span className="w-1 h-6 bg-slate-600 rounded mr-3"></span>
              Documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Single file fields */}
              {data.documents && (
                <>
                  {data.documents.panCard && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 uppercase mb-1">PAN Card</p>
                      <a href={data.documents.panCard.url} target="_blank" rel="noreferrer" className="text-blue-700 font-semibold text-lg break-words">
                        {data.documents.panCard.filename || "View PAN"}
                      </a>
                      {data.documents.panCard.uploadedAt && (
                        <div className="text-sm text-gray-500">Uploaded: {new Date(data.documents.panCard.uploadedAt).toLocaleString()}</div>
                      )}
                    </div>
                  )}

                  {data.documents.aadharCard && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 uppercase mb-1">Aadhar Card</p>
                      <a href={data.documents.aadharCard.url} target="_blank" rel="noreferrer" className="text-blue-700 font-semibold text-lg break-words">
                        {data.documents.aadharCard.filename || "View Aadhar"}
                      </a>
                      {data.documents.aadharCard.uploadedAt && (
                        <div className="text-sm text-gray-500">Uploaded: {new Date(data.documents.aadharCard.uploadedAt).toLocaleString()}</div>
                      )}
                    </div>
                  )}

                  {data.documents.accountDetails && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 uppercase mb-1">Account Details</p>
                      <a href={data.documents.accountDetails.url} target="_blank" rel="noreferrer" className="text-blue-700 font-semibold text-lg break-words">
                        {data.documents.accountDetails.filename || "View Account Details"}
                      </a>
                      {data.documents.accountDetails.uploadedAt && (
                        <div className="text-sm text-gray-500">Uploaded: {new Date(data.documents.accountDetails.uploadedAt).toLocaleString()}</div>
                      )}
                    </div>
                  )}

                  {data.documents.pcc && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 uppercase mb-1">PCC</p>
                      <a href={data.documents.pcc.url} target="_blank" rel="noreferrer" className="text-blue-700 font-semibold text-lg break-words">
                        {data.documents.pcc.filename || "View PCC"}
                      </a>
                      {data.documents.pcc.uploadedAt && (
                        <div className="text-sm text-gray-500">Uploaded: {new Date(data.documents.pcc.uploadedAt).toLocaleDateString()}</div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Multi-file arrays */}
              {data.documents?.educationQualifications && data.documents.educationQualifications.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 uppercase mb-2">Education Qualifications</p>
                  <ul className="list-disc pl-5 space-y-2">
                    {data.documents.educationQualifications.map((doc, i) => (
                      <li key={i} className="text-base">
                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-700 font-semibold break-words">{doc.filename || `Document ${i+1}`}</a>
                        {doc.uploadedAt && <span className="text-sm text-gray-500 ml-2">({new Date(doc.uploadedAt).toLocaleDateString()})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.documents?.previousCompanyOfferLetters && data.documents.previousCompanyOfferLetters.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 uppercase mb-2">Previous Offer Letters</p>
                  <ul className="list-disc pl-5 space-y-2">
                    {data.documents.previousCompanyOfferLetters.map((doc, i) => (
                      <li key={i} className="text-base">
                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-700 font-semibold break-words">{doc.filename || `Offer ${i+1}`}</a>
                        {doc.uploadedAt && <span className="text-sm text-gray-500 ml-2">({new Date(doc.uploadedAt).toLocaleDateString()})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.documents?.relievingLetters && data.documents.relievingLetters.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 uppercase mb-2">Relieving Letters</p>
                  <ul className="list-disc pl-5 space-y-2">
                    {data.documents.relievingLetters.map((doc, i) => (
                      <li key={i} className="text-base">
                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-700 font-semibold break-words">{doc.filename || `Relieving ${i+1}`}</a>
                        {doc.uploadedAt && <span className="text-sm text-gray-500 ml-2">({new Date(doc.uploadedAt).toLocaleDateString()})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-8 py-4 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeeModal;
