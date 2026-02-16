import React, { useState, useEffect } from "react";

const FileCard = ({ title, description, multiple = false, name, files, onChange, onRemove }) => {
  return (
    <div className="border rounded p-3 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          {description && <div className="text-xs text-gray-500">{description}</div>}
        </div>
        <div className="text-right">
          <label className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded cursor-pointer border border-blue-100 text-sm">
            Choose {multiple ? "files" : "file"}
            <input
              type="file"
              name={name}
              accept="application/pdf"
              multiple={multiple}
              onChange={onChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="mt-3">
        {files && files.length > 0 ? (
          <ul className="space-y-1">
            {Array.from(files).map((f, i) => (
              <li key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                <div className="text-sm truncate max-w-xs">{f.name}</div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500">{(f.size / 1024).toFixed(1)} KB</div>
                  <button type="button" onClick={() => onRemove(name, i)} className="text-red-600 text-xs">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-gray-400">No file chosen</div>
        )}
      </div>
    </div>
  );
};

const UploadDocumentsModal = ({ isOpen, onClose, employeeId, onUploaded }) => {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [errors, setErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles({});
      setErrors([]);
      setIsUploading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onFileChange = (e) => {
    const name = e.target.name;
    const files = e.target.files;
    // Validate PDF types
    const invalid = Array.from(files).filter((f) => f.type !== "application/pdf");
    if (invalid.length > 0) {
      setErrors((prev) => [...prev, `${name}: only PDF files are allowed.`]);
      return;
    }
    setSelectedFiles((prev) => ({ ...prev, [name]: files }));
    setErrors([]);
  };

  const removeSelected = (fieldName, index) => {
    const arr = Array.from(selectedFiles[fieldName] || []);
    arr.splice(index, 1);
    if (arr.length === 0) {
      const copy = { ...selectedFiles };
      delete copy[fieldName];
      setSelectedFiles(copy);
    } else {
      setSelectedFiles((prev) => ({ ...prev, [fieldName]: arr }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) return setErrors(["Employee ID is missing"]);
    if (Object.keys(selectedFiles).length === 0) return setErrors(["Please select at least one file to upload."]);

    const formData = new FormData();
    Object.entries(selectedFiles).forEach(([key, fList]) => {
      for (let i = 0; i < fList.length; i++) formData.append(key, fList[i]);
    });

    try {
      setIsUploading(true);
      const res = await fetch(`http://localhost:4000/employeedata/${employeeId}/upload`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        onUploaded && onUploaded(json.data);
        onClose();
      } else {
        setErrors([json.message || "Upload failed"]);
      }
    } catch (err) {
      console.error(err);
      setErrors(["Network or server error during upload"]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Upload Employee Documents</h3>
              <p className="text-sm text-gray-500">Upload PAN, Aadhar, education, offer & relieving letters and other documents (PDF only).</p>
            </div>
            <div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Close</button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
              <ul className="list-disc pl-5 text-sm">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileCard
              title="PAN Card"
              description="Government issued PAN (PDF)"
              name="panCard"
              files={selectedFiles["panCard"]}
              onChange={onFileChange}
              onRemove={removeSelected}
            />
            <FileCard
              title="Aadhar Card"
              description="Aadhar or UID (PDF)"
              name="aadharCard"
              files={selectedFiles["aadharCard"]}
              onChange={onFileChange}
              onRemove={removeSelected}
            />
            <FileCard
              title="Account / Bank Details"
              description="Bank statement or cancelled cheque (PDF)"
              name="accountDetails"
              files={selectedFiles["accountDetails"]}
              onChange={onFileChange}
              onRemove={removeSelected}
            />
            <FileCard
              title="PCC"
              description="Police Clearance Certificate (PDF)"
              name="pcc"
              files={selectedFiles["pcc"]}
              onChange={onFileChange}
              onRemove={removeSelected}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileCard
              title="Education Qualifications"
              description="Upload degree/certificate PDFs (multiple)"
              multiple={true}
              name="educationQualifications"
              files={selectedFiles["educationQualifications"]}
              onChange={onFileChange}
              onRemove={removeSelected}
            />
            <div className="space-y-4">
              <FileCard
                title="Previous Offer Letters"
                description="Offer letters from previous employers (multiple)"
                multiple={true}
                name="offerLetters"
                files={selectedFiles["offerLetters"]}
                onChange={onFileChange}
                onRemove={removeSelected}
              />
              <FileCard
                title="Relieving Letters"
                description="Relieving letters from previous employers (multiple)"
                multiple={true}
                name="relievingLetters"
                files={selectedFiles["relievingLetters"]}
                onChange={onFileChange}
                onRemove={removeSelected}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
            <button type="submit" disabled={isUploading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {isUploading ? "Uploading..." : "Upload Documents"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentsModal;
