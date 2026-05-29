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
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

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
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-slate-200/60 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl shadow-sm">
                <Upload className="w-6 h-6" />
              </span>
              Upload Tutorial Material
            </h1>
            <p className="text-slate-500 mt-2 text-base">Share educational content and resources with your team.</p>
          </div>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div
            className={`mb-8 p-4 rounded-xl flex items-start gap-3 shadow-sm border ${
              message.type === "success"
                ? "bg-green-50/80 border-green-200 text-green-800"
                : "bg-red-50/80 border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-medium">
              {message.text}
            </p>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-8">
          <div className="p-6 md:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-5 space-y-6">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Material Details</h3>
                  <p className="text-sm text-slate-500">Provide title, description, and organizational context.</p>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tutorial Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter tutorial title"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50/30"
                    required
                  />
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a brief description of the material"
                    rows="4"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none bg-slate-50/30"
                  />
                </div>

                {/* Company & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50/30"
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      disabled={!selectedCompany}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:bg-slate-100 disabled:text-slate-400 bg-slate-50/30"
                      required
                    >
                      <option value="">
                        {selectedCompany ? "Select Department" : "Select company"}
                      </option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.dep}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column: File Upload */}
              <div className="lg:col-span-7 space-y-6">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Upload File</h3>
                  <p className="text-sm text-slate-500">Select file type and upload your media. Max size 500 MB.</p>
                </div>

                {/* File Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    File Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["image", "video", "pdf", "ppt"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFileType(type)}
                        className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-semibold ${
                          fileType === type
                            ? "border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50"
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Media File <span className="text-red-500">*</span>
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-10 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[220px] ${
                      dragActive
                        ? "border-indigo-500 bg-indigo-50/50"
                        : "border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      required={!file}
                    />
                    <div className={`p-4 rounded-full mb-4 ${dragActive ? "bg-indigo-100 text-indigo-600" : "bg-white text-slate-400 shadow-sm border border-slate-100"}`}>
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-base font-semibold text-slate-800 mb-1">
                      {dragActive ? "Drop file here" : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-slate-500">
                      Images (JPG, PNG), Videos (MP4), Documents (PDF, PPT)
                    </p>
                  </div>
                </div>

                {/* File Preview */}
                {file && (
                  <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/60 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-indigo-600 shadow-sm">
                        {getFileIcon(fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                           e.stopPropagation();
                           setFile(null);
                           if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors"
                        title="Remove file"
                      >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>

                    {/* File Preview Content */}
                    {fileType === "image" && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 bg-white">
                         <img src={URL.createObjectURL(file)} alt="preview" className="max-h-48 w-full object-contain bg-slate-100" />
                      </div>
                    )}
                    {fileType === "video" && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 bg-black">
                         <video src={URL.createObjectURL(file)} controls className="max-h-48 w-full" />
                      </div>
                    )}
                  </div>
                )}

                {/* Upload Progress */}
                {loading && uploadProgress > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-slate-700">Uploading material...</p>
                      <p className="text-sm font-bold text-indigo-600">{uploadProgress}%</p>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-6 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 px-6 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                      loading 
                        ? "bg-slate-400 cursor-not-allowed" 
                        : "bg-indigo-600 hover:bg-indigo-700 hover:shadow shadow-indigo-200"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing Upload...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Save & Upload Material
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMaterial;