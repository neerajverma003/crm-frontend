import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Image, Video, FileText, File, Download, ExternalLink, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

/**
 * TrainingMaterial
 * - Modern, maintainable component with filters, search, and robust preview
 */
const EmployeeTrainingMaterial = () => {
  // data
  const [tutorials, setTutorials] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeeDepartment, setEmployeeDepartment] = useState(null);

  // filters
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // preview state
  const [preview, setPreview] = useState(null); // { type, url, title, isBlob, originalUrl }
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewInfo, setPreviewInfo] = useState("");
  const companyId = localStorage.getItem("companyId");
  const userId = localStorage.getItem("userId");
  // Fetch tutorials
  useEffect(() => {
    const controller = new AbortController();

    const fetchAllTutorials = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch employee data to get assigned department
        const employeeResponse = await fetch(`${API_BASE_URL}/employee/getEmployee/${userId}`);
        const employeeData = await employeeResponse.json();
        
        // Fetch tutorials for this company
        const tutorialResponse = await fetch(`${API_BASE_URL}/tutorials/company/${companyId}`);
        if (!tutorialResponse.ok) throw new Error(`Failed to fetch tutorials: ${tutorialResponse.status}`);
        
        const json = await tutorialResponse.json();
        const list = Array.isArray(json.data) ? json.data.filter(Boolean) : [];
        
        // Store employee's department
        const deptInfo = employeeData?.employee?.department;
        if (deptInfo) {
          setEmployeeDepartment(deptInfo);
          setSelectedDepartment(deptInfo._id || deptInfo.id);
        }
        
        // Set company as selected
        setSelectedCompany(companyId);
        setTutorials(list);

        // derive companies
        const unique = Array.from(new Map(list.filter((t) => t.company).map((t) => [t.company._id || t.company._1d, t.company])).values());
        setCompanies(unique);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError('Failed to load training materials');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllTutorials();

    const onUploaded = () => fetchAllTutorials();
    window.addEventListener('tutorialUploaded', onUploaded);

    return () => {
      controller.abort();
      window.removeEventListener('tutorialUploaded', onUploaded);
    };
  }, []);

  // departments when company changes
  useEffect(() => {
    if (!selectedCompany) return setDepartments([]);
    
    // Derive departments from tutorials for the selected company
    const tutorialsForCompany = tutorials.filter(
      (t) => t.company && (t.company._id || t.company._1d) === selectedCompany
    );
    
    const uniqueDepts = Array.from(
      new Map(
        tutorialsForCompany
          .filter((t) => t.department)
          .map((t) => [t.department._id, t.department])
      ).values()
    );
    
    setDepartments(uniqueDepts);
  }, [selectedCompany, tutorials]);

  // filtered list
  const filtered = useMemo(() => {
    return tutorials
      .filter((t) => (selectedCompany ? (t.company && (t.company._id || t.company._1d) === selectedCompany) : true))
      .filter((t) => (selectedDepartment ? (t.department && String(t.department._id) === String(selectedDepartment)) : true))
      .filter((t) => (fileTypeFilter ? t.fileType === fileTypeFilter : true))
      .filter((t) => (searchQuery ? (t.title || "").toLowerCase().includes(searchQuery.toLowerCase()) : true));
  }, [tutorials, selectedCompany, selectedDepartment, fileTypeFilter, searchQuery]);

  const formatDate = (iso) => {
    if (!iso) return '';
    try { return new Date(iso).toLocaleDateString(); } catch { return ''; }
  };

  const getViewerUrl = (url, type) => {
    if (!url) return url;
    const lower = (type || '').toLowerCase();
    if (lower === 'pdf' || lower === 'ppt') return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    return url;
  };

  const handleDownloadPreview = useCallback(async (url, fileName = 'document.pdf') => {
    if (!url) return window.alert('No file URL to download');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const blob = await res.blob();
      if (blob.size === 0) throw new Error('Downloaded file is empty');
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.warn('Direct download failed, opening in new tab:', err);
      window.open(url, '_blank');
    }
  }, []);

  const closePreview = useCallback(() => {
    if (preview && preview.isBlob) {
      try { URL.revokeObjectURL(preview.url); } catch (e) {}
    }
    setPreview(null);
    setPreviewError('');
    setPreviewInfo('');
    setLoadingPreview(false);
  }, [preview]);

  // open preview
  const openPreview = useCallback(async (tut) => {
    setLoadingPreview(true);
    setPreviewError('');
    setPreviewInfo('');

    const lower = (tut.fileType || '').toLowerCase();

    if (lower === 'pdf' || lower === 'ppt') {
      const previewUrl = `${API_BASE_URL}/tutorials/preview/${tut._id}`;
      const originalUrl = tut.cloudinaryUrl || tut.fileUrl;

      try {
        const res = await fetch(previewUrl);

        if (!res.ok) {
          let parsed = null;
          try { const text = await res.text(); parsed = JSON.parse(text); } catch (e) { parsed = null; }
          const upstreamStatus = (parsed && parsed.status) || res.status;
          const upstreamMsg = (parsed && parsed.message) || 'Preview not available. Use Download/Open instead.';

          const isDirectViewable = originalUrl && /^https?:\/\//i.test(originalUrl) && (lower === 'pdf' || lower === 'ppt');

          if (isDirectViewable) {
            const viewer = getViewerUrl(originalUrl, lower);
            setPreview({ type: tut.fileType, url: viewer, title: tut.title, isBlob: false, originalUrl });
            setPreviewInfo('Loaded via direct viewer (Google Docs Viewer). If this fails the file may require permission.');
          } else {
            if (/auth/i.test(String(upstreamMsg)) || upstreamStatus === 401 || upstreamStatus === 403) {
              setPreviewError(`File requires permission or upstream authentication. (${upstreamStatus})`);
            } else {
              setPreviewError(`${upstreamMsg} (${upstreamStatus})`);
            }
            setPreview({ type: tut.fileType, url: originalUrl, title: tut.title, isBlob: false, originalUrl });
          }
        } else {
          const blob = await res.blob();
          if (!blob || blob.size === 0) {
            setPreviewError('Preview file is empty or could not be loaded.');
            setPreview({ type: tut.fileType, url: originalUrl, title: tut.title, isBlob: false, originalUrl });
          } else {
            if (preview && preview.isBlob) { try { window.URL.revokeObjectURL(preview.url); } catch (e) {} }
            const objectUrl = window.URL.createObjectURL(blob);
            setPreview({ type: tut.fileType, url: objectUrl, title: tut.title, isBlob: true, originalUrl });
          }
        }
      } catch (err) {
        console.warn('Preview fetch failed, falling back to file URL', err);
        setPreview({ type: tut.fileType, url: originalUrl, title: tut.title, isBlob: false, originalUrl });
        setPreviewError('Preview may not be available. Use Download/Open instead.');
      } finally {
        setLoadingPreview(false);
      }
    } else {
      const url = tut.cloudinaryUrl || tut.fileUrl;
      setPreview({ type: tut.fileType, url, title: tut.title, isBlob: false, originalUrl: url });
      setLoadingPreview(false);
    }
  }, [preview]);

  // keyboard close
  useEffect(() => {
    if (!preview) return;
    const onKey = (e) => { if (e.key === 'Escape') closePreview(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview, closePreview]);

  // small components
  const Filters = () => (
    <div className="md:col-span-1 space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Company</label>
        <select className="w-full rounded-md border px-3 py-2" value={selectedCompany} onChange={(e) => { setSelectedCompany(e.target.value); setSelectedDepartment(''); }} aria-label="Filter by company">
          <option value="">All Companies</option>
          {companies.map((c) => (<option key={c._id} value={c._id}>{c.companyName}</option>))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
        <select className="w-full rounded-md border px-3 py-2" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} aria-label="Filter by department">
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d._id} value={d._id}>{d.dep}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
        <div className="flex flex-wrap gap-2">
          {["", "image", "video", "pdf", "ppt"].map((t) => (
            <button key={t} onClick={() => setFileTypeFilter(t)} className={`px-3 py-1 rounded-md text-sm border ${fileTypeFilter === t ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`} aria-pressed={fileTypeFilter === t}>
              {t === '' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-3">{filtered.length} result(s)</div>
    </div>
  );

  const MaterialCard = ({ tut }) => {
    const url = tut.cloudinaryUrl || tut.fileUrl;
    return (
      <article className="bg-white border rounded-lg shadow-sm overflow-hidden" role="article" aria-labelledby={`title-${tut._id}`}>
        <div className="relative h-48 bg-gray-100">
          {tut.fileType === 'image' ? (
            <img src={url} alt={tut.originalName || tut.title} className="w-full h-full object-cover" loading="lazy" />
          ) : tut.fileType === 'video' ? (
            <video src={url} muted className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400"><FileText className="w-12 h-12" /></div>
          )}

          <div className="absolute top-3 right-3 flex gap-2">
            <button onClick={() => openPreview(tut)} title="Preview" className="bg-white/80 hover:bg-white px-2 py-1 rounded-md flex items-center gap-2 text-sm" aria-label={`Preview ${tut.title}`}><ExternalLink className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h4 id={`title-${tut._id}`} className="font-semibold text-sm mb-1">{tut.title}</h4>
              <div className="text-xs text-gray-500">{tut.company?.companyName || 'Unknown'} • {tut.department?.dep || '—'}</div>
            </div>
            <div className="text-xs text-gray-400">{formatDate(tut.createdAt)}</div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {tut.fileType === 'image' && <Image className="w-4 h-4" />}
              {tut.fileType === 'video' && <Video className="w-4 h-4" />}
              {tut.fileType === 'pdf' && <FileText className="w-4 h-4" />}
              {tut.fileType === 'ppt' && <File className="w-4 h-4" />}
              <span>{tut.originalName || 'Material'}</span>
            </div>

            <div className="flex items-center gap-2">
              <a href={(tut.fileType === 'pdf' || tut.fileType === 'ppt') ? `${API_BASE_URL}/tutorials/preview/${tut._id}` : getViewerUrl(url, tut.fileType)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600"><Download className="w-4 h-4" /> Open</a>
            </div>
          </div>
        </div>
      </article>
    );
  };

  const PreviewModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b">
          <h3 className="font-semibold">{preview?.title}</h3>
          <button onClick={closePreview} className="p-1 rounded hover:bg-gray-100" aria-label="Close preview"><X /></button>
        </div>

        <div className="p-4">
          {loadingPreview ? (
            <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" /></div>
          ) : previewError ? (
            <div className="h-[60vh] flex items-center justify-center">
              <div className="text-center text-gray-500 max-w-xl">
                <div className="mb-3 text-lg font-semibold">Preview unavailable</div>
                <div className="mb-3 text-sm">{previewError}</div>
                <div className="flex justify-center gap-3">
                  <a href={preview?.originalUrl || preview?.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Open original</a>
                  <button onClick={() => { const link = preview?.originalUrl || preview?.url; navigator.clipboard && navigator.clipboard.writeText(link); alert('Link copied to clipboard'); }} className="inline-block bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Copy link</button>
                  <button onClick={() => {
                    const link = preview?.originalUrl || preview?.url;
                    const type = preview?.type;
                    if (link && (type === 'pdf' || type === 'ppt')) {
                      setPreview({ type: type, url: getViewerUrl(link, type), title: preview?.title, isBlob: false, originalUrl: preview?.originalUrl || preview?.url });
                      setPreviewError('');
                      setPreviewInfo('Loaded via direct viewer (Google Docs Viewer).');
                    } else if (link) {
                      window.open(link, '_blank');
                    }
                  }} className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Try Viewer</button>
                </div>
                <div className="mt-3 text-xs text-gray-400">If the file is hosted on a service that requires authentication (eg. Google Drive private file), the server proxy will not be able to preview it. Use "Open original" to download or request access.</div>
              </div>
            </div>
          ) : (
            <>
              {preview?.type === 'image' && (<img src={preview.url} alt={preview.title} className="w-full h-[60vh] object-contain" />)}
              {preview?.type === 'video' && (<video src={preview.url} controls className="w-full h-[60vh]" />)}

              {(preview?.type === 'pdf' || preview?.type === 'ppt') && (
                <div className="h-[60vh]">
                  {(() => {
                    const isPublicHttp = preview?.url && !preview?.isBlob && /^https?:\/\//i.test(preview.url);
                    const viewerUrl = (isPublicHttp && (preview?.type === 'pdf' || preview?.type === 'ppt')) ? `https://docs.google.com/gview?url=${encodeURIComponent(preview.url)}&embedded=true` : null;
                    const iframeSrc = viewerUrl || preview?.url;
                    const downloadSrc = preview?.isBlob ? preview?.url : (preview?.originalUrl || preview?.url);
                    const fileName = preview?.title ? `${preview.title}.pdf` : 'document.pdf';

                    return (
                      <>
                        <div className="border rounded mb-3 overflow-hidden h-full">
                          <iframe title={preview?.title} src={iframeSrc} className="w-full h-[60vh]" />
                        </div>

                        <div className="flex gap-3 justify-center">
                          <button onClick={() => handleDownloadPreview(downloadSrc, fileName)} className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium">⬇️ Download</button>
                          <a href={viewerUrl || preview?.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition font-medium">🔗 Open in new tab</a>
                        </div>
                        {previewInfo && <div className="mt-3 text-sm text-gray-500 text-center">{previewInfo}</div>}
                      </>
                    );
                  })()}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Training Materials</h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by title..." className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Search training materials" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Filters />

        <div className="md:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center p-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" /></div>
          ) : error ? (
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-md text-rose-700">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 bg-gray-50 rounded-md text-center text-gray-500">No materials found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((tut) => <MaterialCard key={tut._id} tut={tut} />)}
            </div>
          )}
        </div>
      </div>

      {preview && <PreviewModal />}
    </div>
  );
};

export default EmployeeTrainingMaterial;