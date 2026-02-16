// import React, { useState, useEffect } from "react";

// const UploadMaterial = () => {
//   const [title, setTitle] = useState("");
//   const [file, setFile] = useState(null);
//   const [fileType, setFileType] = useState("");
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState("");
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState("");

//   // Fetch companies
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const res = await fetch("http://localhost:4000/company/all");
//         const data = await res.json();
//         const list = Array.isArray(data.companies)
//           ? data.companies
//           : Array.isArray(data.data)
//           ? data.data
//           : [];
//         setCompanies(list);
//       } catch (err) {
//         console.error("Failed to fetch companies:", err);
//       }
//     };
//     fetchCompanies();
//   }, []);

//   // Fetch departments dynamically based on selected company
//   const getDepartments = async (companyId) => {
//     if (!companyId) {
//       setDepartments([]);
//       return;
//     }

//     try {
//       const url = `http://localhost:4000/department/department?company=${companyId}`;
//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch departments");

//       const data = await response.json();

//       const finalDepartments = (data.departments || []).map((d) => ({
//         _id: d._id,
//         dep: d.dep,
//       }));

//       setDepartments(finalDepartments);
//     } catch (err) {
//       console.error(err);
//       setDepartments([]);
//     }
//   };

//   // Trigger fetching departments when company changes
//   useEffect(() => {
//     getDepartments(selectedCompany);
//     setSelectedDepartment(""); // Reset department selection
//   }, [selectedCompany]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title || !file || !fileType || !selectedCompany || !selectedDepartment) {
//       return alert("Please fill all fields!");
//     }

//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("company", selectedCompany);
//       formData.append("department", selectedDepartment);
//       formData.append("fileType", fileType);
//       formData.append("file", file);

//       const res = await fetch("http://localhost:4000/tutorials", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await res.json();

//       if (res.ok) {
//         alert("Tutorial uploaded successfully!");
//         setTitle("");
//         setFile(null);
//         setFileType("");
//         setSelectedCompany("");
//         setSelectedDepartment("");
//         setDepartments([]);
//       } else {
//         alert(result.message || "Upload failed!");
//       }
//     } catch (err) {
//       console.error("Error uploading tutorial:", err);
//       alert("Upload failed!");
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-center mb-6">Upload Tutorial Material</h2>

//       <form className="space-y-4" onSubmit={handleSubmit}>
//         {/* Title */}
//         <div>
//           <label className="block font-semibold mb-1">Title:</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         {/* Company */}
//         <div>
//           <label className="block font-semibold mb-1">Company:</label>
//           <select
//             value={selectedCompany}
//             onChange={(e) => setSelectedCompany(e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           >
//             <option value="">Select Company</option>
//             {companies.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.companyName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Department */}
//         <div>
//           <label className="block font-semibold mb-1">Department:</label>
//           <select
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           >
//             <option value="">Select Department</option>
//             {departments.map((d) => (
//               <option key={d._id} value={d._id}>
//                 {d.dep}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* File Type */}
//         <div>
//           <label className="block font-semibold mb-1">File Type:</label>
//           <select
//             value={fileType}
//             onChange={(e) => setFileType(e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           >
//             <option value="">Select File Type</option>
//             <option value="image">Image</option>
//             <option value="video">Video</option>
//             <option value="pdf">PDF</option>
//             <option value="ppt">PPT</option>
//           </select>
//         </div>

//         {/* File */}
//         <div>
//           <label className="block font-semibold mb-1">File:</label>
//           <input
//             type="file"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="w-full"
//             required
//           />
//         </div>

//         {/* File Preview */}
//         {file && fileType === "image" && (
//           <img
//             src={URL.createObjectURL(file)}
//             alt="preview"
//             className="mt-2 max-h-48 w-full object-cover rounded-md"
//           />
//         )}
//         {file && fileType === "video" && (
//           <video
//             src={URL.createObjectURL(file)}
//             controls
//             className="mt-2 max-h-48 w-full object-cover rounded-md"
//           />
//         )}

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
//         >
//           Upload
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UploadMaterial;



import React, { useState, useEffect, useRef } from "react";
import { Upload, AlertCircle, CheckCircle, Loader, File, FileText, Image, Video } from "lucide-react";

const UploadMaterial = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Get API URL - static approach
  const API_BASE_URL = "http://localhost:4000";

  console.log("API_BASE_URL:", API_BASE_URL);

  // Fetch companies
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const url = `${API_BASE_URL}/company/all`;
      console.log("Fetching companies from:", url);
      
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Companies data:", data);

      const list = Array.isArray(data.companies)
        ? data.companies
        : Array.isArray(data.data)
        ? data.data
        : [];
      setCompanies(list);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      setMessage({ type: "error", text: `Failed to load companies: ${err.message}` });
    }
  };

  // Fetch departments dynamically based on selected company
  const getDepartments = async (companyId) => {
    if (!companyId) {
      setDepartments([]);
      return;
    }

    try {
      const url = `${API_BASE_URL}/department/department?company=${companyId}`;
      console.log("Fetching departments from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Departments data:", data);

      const finalDepartments = (data.departments || []).map((d) => ({
        _id: d._id,
        dep: d.dep,
      }));

      setDepartments(finalDepartments);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setDepartments([]);
      setMessage({ type: "error", text: `Failed to load departments: ${err.message}` });
    }
  };

  // Trigger fetching departments when company changes
  useEffect(() => {
    getDepartments(selectedCompany);
    setSelectedDepartment("");
  }, [selectedCompany]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      console.log("File selected via drag:", e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      console.log("File selected:", selectedFile.name, selectedFile.size);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      setMessage({ type: "error", text: "Title is required" });
      return false;
    }
    if (!selectedCompany) {
      setMessage({ type: "error", text: "Please select a company" });
      return false;
    }
    if (!selectedDepartment) {
      setMessage({ type: "error", text: "Please select a department" });
      return false;
    }
    if (!fileType) {
      setMessage({ type: "error", text: "Please select a file type" });
      return false;
    }
    if (!file) {
      setMessage({ type: "error", text: "Please select a file" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!validateForm()) return;

    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("company", selectedCompany);
      formData.append("department", selectedDepartment);
      formData.append("fileType", fileType);
      formData.append("file", file);

      // Debug: log FormData contents
      console.log("Form data being sent:");
      console.log("- title:", title);
      console.log("- description:", description);
      console.log("- company:", selectedCompany);
      console.log("- department:", selectedDepartment);
      console.log("- fileType:", fileType);
      console.log("- file:", file ? `${file.name} (${file.size} bytes)` : "none");

      const uploadUrl = `${API_BASE_URL}/tutorials`;
      console.log("Uploading to:", uploadUrl);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
          console.log("Upload progress:", Math.round(percentComplete) + "%");
        }
      });

      // Handle completion
      xhr.addEventListener("load", () => {
        console.log("Upload completed with status:", xhr.status);
        console.log("Response text:", xhr.responseText);

        try {
          const responseData = JSON.parse(xhr.responseText);
          console.log("Response data:", responseData);

          if (xhr.status === 200 || xhr.status === 201) {
            setMessage({
              type: "success",
              text: responseData.message || "Tutorial uploaded successfully!",
            });
            resetForm();
            try { window.dispatchEvent(new CustomEvent('tutorialUploaded', { detail: responseData.data })); } catch(e) { console.warn('Event dispatch failed', e); }
          } else {
            setMessage({
              type: "error",
              text: responseData.message || `Upload failed with status ${xhr.status}`,
            });
          }
        } catch (parseErr) {
          console.error("Failed to parse response:", parseErr);
          setMessage({
            type: xhr.status >= 200 && xhr.status < 300 ? "success" : "error",
            text: xhr.status >= 200 && xhr.status < 300 
              ? "Tutorial uploaded successfully!" 
              : `Upload failed with status ${xhr.status}`,
          });
          if (xhr.status >= 200 && xhr.status < 300) {
            resetForm();
            try { window.dispatchEvent(new CustomEvent('tutorialUploaded', { detail: { /* no data parsed */ } })); } catch(e) { console.warn('Event dispatch failed', e); }
          }
        }

        setLoading(false);
        setUploadProgress(0);
      });

      // Handle errors
      xhr.addEventListener("error", () => {
        console.error("Network error during upload");
        setMessage({ type: "error", text: "Network error! Please check your connection." });
        setLoading(false);
        setUploadProgress(0);
      });

      // Handle abort
      xhr.addEventListener("abort", () => {
        console.error("Upload was aborted");
        setMessage({ type: "error", text: "Upload was cancelled." });
        setLoading(false);
        setUploadProgress(0);
      });

      // Open and send request
      xhr.open("POST", uploadUrl, true);
      // Don't set Content-Type header - let browser set it with correct boundary
      xhr.send(formData);
    } catch (err) {
      console.error("Error during upload preparation:", err);
      setMessage({ type: "error", text: `Error: ${err.message}` });
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setFileType("");
    setSelectedCompany("");
    setSelectedDepartment("");
    setDepartments([]);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <Image className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "ppt":
        return <File className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Tutorial Material</h1>
          <p className="text-gray-600">Share educational content with your team</p>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 animate-slideDown ${
              message.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm ${
                message.type === "success" ? "text-green-800" : "text-red-800"
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tutorial Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter tutorial title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a brief description of the material"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Two Column Grid for Selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  disabled={!selectedCompany}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">
                    {selectedCompany ? "Select Department" : "Select a company first"}
                  </option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.dep}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                File Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["image", "video", "pdf", "ppt"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFileType(type)}
                    className={`p-3 rounded-lg border-2 transition flex items-center justify-center gap-2 font-medium ${
                      fileType === type
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {getFileIcon(type)}
                    <span className="capitalize text-sm">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload - Drag and Drop */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Upload File <span className="text-red-500">*</span>
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 transition flex flex-col items-center justify-center cursor-pointer ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <Upload className={`w-12 h-12 mb-3 ${dragActive ? "text-blue-500" : "text-gray-400"}`} />
                <p className="text-sm font-semibold text-gray-900">Drag and drop your file here</p>
                <p className="text-xs text-gray-500 mt-1">or click to browse</p>
              </div>
            </div>

            {/* File Preview */}
            {file && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Selected File:</p>
                <div className="flex items-center gap-3">
                  {getFileIcon(fileType)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                {/* File Preview Content */}
                {file && fileType === "image" && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="mt-4 max-h-64 w-full object-cover rounded-lg"
                  />
                )}
                {file && fileType === "video" && (
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="mt-4 max-h-64 w-full rounded-lg"
                  />
                )}
              </div>
            )}

            {/* Upload Progress */}
            {loading && uploadProgress > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Uploading...</p>
                  <p className="text-sm font-semibold text-blue-600">{uploadProgress}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Material
                  </>
                )}
              </button>
              {file && !loading && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setMessage({ type: "", text: "" });
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Supported formats: Images (JPG, PNG), Videos (MP4), Documents (PDF, PPT)</p>
          <p>Maximum file size: 500 MB</p>
        </div>
      </div>
    </div>
  );
};

export default UploadMaterial;