import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Image, Video, FileText, File, Download, ExternalLink, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_URL}`;

/**
 * TrainingMaterial
 * - Modern, maintainable component with filters, search, and robust preview
 */
const TrainingMaterial = () => {
  // data
  const [tutorials, setTutorials] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);

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
  // Fetch tutorials
  useEffect(() => {
    const controller = new AbortController();

    const fetchAllTutorials = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/tutorials/all`, { signal: controller.signal });
        // const res = await fetch(`${API_BASE_URL}/tutorials/companyId/${companyId}`);
        if (!res.ok) throw new Error(`Failed to fetch tutorials: ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data.filter(Boolean) : [];
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

  const openPreview = useCallback((tut) => {
    const url = `${import.meta.env.VITE_API_URL}/api/media/preview?key=${tut.key}`;
    setPreview({ type: tut.fileType, url, title: tut.title, isBlob: false, originalUrl: url });
    setLoadingPreview(false);
  }, []);

  // keyboard close
  useEffect(() => {
    if (!preview) return;
    const onKey = (e) => { if (e.key === 'Escape') closePreview(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview, closePreview]);

  // small components
  const Filters = () => (
    <div className="md:col-span-1 space-y-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 h-fit md:sticky md:top-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Company</label>
        <select className="w-full border border-slate-300 bg-slate-50/30 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" value={selectedCompany} onChange={(e) => { setSelectedCompany(e.target.value); setSelectedDepartment(''); }} aria-label="Filter by company">
          <option value="">All Companies</option>
          {companies.map((c) => (<option key={c._id} value={c._id}>{c.companyName}</option>))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
        <select className="w-full border border-slate-300 bg-slate-50/30 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} aria-label="Filter by department">
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d._id} value={d._id}>{d.dep}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
        <div className="flex flex-wrap gap-2">
          {["", "image", "video", "pdf", "ppt"].map((t) => (
            <button key={t} onClick={() => setFileTypeFilter(t)} className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${fileTypeFilter === t ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`} aria-pressed={fileTypeFilter === t}>
              {t === '' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="text-sm font-medium text-slate-500">{filtered.length} result(s) found</div>
      </div>
    </div>
  );

  const MaterialCard = ({ tut }) => {
    const url = tut.fileUrl || tut.cloudinaryUrl;
    return (
      <article className="bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden flex flex-col h-full" role="article" aria-labelledby={`title-${tut._id}`}>
        <div className="relative h-48 bg-slate-50 flex-shrink-0 border-b border-slate-100">
          {tut.fileType === 'image' ? (
            <img src={`${import.meta.env.VITE_API_URL}/api/media/preview?key=${tut.key}`} alt={tut.originalName || tut.title} className="w-full h-full object-cover" loading="lazy" />
          ) : tut.fileType === 'video' ? (
            <video src={`${import.meta.env.VITE_API_URL}/api/media/preview?key=${tut.key}`} muted className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300"><FileText className="w-16 h-16" /></div>
          )}

          <div className="absolute top-3 right-3 flex gap-2">
            <button onClick={() => openPreview(tut)} title="Preview" className="bg-white/90 backdrop-blur hover:bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:text-indigo-600" aria-label={`Preview ${tut.title}`}>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h4 id={`title-${tut._id}`} className="font-bold text-slate-900 truncate">{tut.title}</h4>
              <div className="text-xs font-medium text-slate-500 mt-1 truncate">
                {tut.company?.companyName || 'Unknown'} • {tut.department?.dep || '—'}
              </div>
            </div>
            <div className="text-xs font-semibold text-slate-400 whitespace-nowrap">{formatDate(tut.createdAt)}</div>
          </div>

          <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 truncate pr-2 flex-1 min-w-0">
              {tut.fileType === 'image' && <Image className="w-4 h-4 text-indigo-500 flex-shrink-0" />}
              {tut.fileType === 'video' && <Video className="w-4 h-4 text-indigo-500 flex-shrink-0" />}
              {tut.fileType === 'pdf' && <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />}
              {tut.fileType === 'ppt' && <File className="w-4 h-4 text-indigo-500 flex-shrink-0" />}
              <span className="truncate">{tut.originalName || 'Material'}</span>
            </div>

            <div className="flex items-center flex-shrink-0">
              <a href={`${import.meta.env.VITE_API_URL}/api/media/preview?key=${tut.key}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                <Download className="w-4 h-4" /> Open
              </a>
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
                <div className="flex flex-wrap justify-center gap-3">
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

                        <div className="flex flex-wrap gap-3 justify-center">
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
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header section */}
        <div className="mb-8 border-b border-slate-200/60 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl shadow-sm">
                <FileText className="w-6 h-6" />
              </span>
              Training Materials
            </h1>
            <p className="text-slate-500 mt-2 text-base">Access and review all training resources across departments.</p>
          </div>
          <div className="relative w-full md:w-auto mt-2 md:mt-0">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
             <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by title..." className="w-full md:w-80 pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-400 font-medium" aria-label="Search training materials" />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Filters />

          <div className="md:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center p-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600" /></div>
            ) : error ? (
              <div className="p-6 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 shadow-sm">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 bg-white/60 rounded-2xl border border-slate-100 text-center text-slate-500 font-medium shadow-sm">No materials found matching your criteria.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((tut) => <MaterialCard key={tut._id} tut={tut} />)}
              </div>
            )}
          </div>
        </div>

        {preview && <PreviewModal />}
      </div>
    </div>
  );
};

export default TrainingMaterial;