import React, { useState, useEffect } from 'react';
import { Plus, Save, Edit2, Trash2, Search, User, MapPin, Building, Briefcase, FileText, Upload, ChevronDown, X, Menu } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_URL}`;

/* ─── Responsive hook ─── */
const useBreakpoint = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return { isMobile: width < 640, isTablet: width >= 640 && width < 1024, isDesktop: width >= 1024 };
};

/* ─── Shared input style helper ─── */
const inputStyle = (focus, accentColor = '#6366f1') => ({
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px 10px 36px',
  border: `1.5px solid ${focus ? accentColor : '#e5e7eb'}`,
  borderRadius: '8px',
  fontSize: '14px',
  color: '#111827',
  outline: 'none',
  backgroundColor: '#fafafa',
  transition: 'border-color 0.15s',
});

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  color: '#6b7280',
  marginBottom: '5px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

/* ─── Field component ─── */
const Field = ({ label, required, icon: Icon, children }) => (
  <div>
    <label style={labelStyle}>{label}{required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}</label>
    <div style={{ position: 'relative' }}>
      {Icon && <Icon size={14} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />}
      {children}
    </div>
  </div>
);

/* ─── Input with focus state ─── */
const TextInput = ({ icon: Icon, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <Field label={props.label} required={props.required} icon={Icon}>
      <input
        {...props}
        label={undefined}
        required={undefined}
        style={inputStyle(focused)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </Field>
  );
};

export default function AddCandidate() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  /* form state */
  const [candidateName, setCandidateName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [experience, setExperience] = useState('');
  const [profile, setProfile] = useState('');
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState('');

  /* data state */
  const [candidates, setCandidates] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  /* mobile: toggle between form / list */
  const [mobileView, setMobileView] = useState('list'); // 'form' | 'list'

  /* focus states */
  const [focusedField, setFocusedField] = useState(null);

  const userId = localStorage.getItem('userId');

  const fetchCandidates = async () => {
    if (!userId) { setError('User not authenticated'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/candidates`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) setCandidates(data.data || []);
      else setError(data.message || 'Failed to fetch candidates');
    } catch { setError('Failed to load candidates.'); }
    finally { setLoading(false); }
  };

  const fetchProfiles = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/profiles`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) setProfiles(data.data || []);
    } catch { setError('Failed to load profiles.'); }
  };

  const handleFileChange = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { setError('Please upload JPG, PDF, or DOC/DOCX'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('File size max 5MB'); return; }
    setResume(file); setResumePreview(file.name); setError('');
  };

  const handleSave = async () => {
    if (!candidateName.trim()) return setError('Candidate name is required');
    if (!state.trim()) return setError('State is required');
    if (!city.trim()) return setError('City is required');
    if (!experience.trim()) return setError('Experience is required');
    if (!profile.trim()) return setError('Profile is required');
    if (!userId) return setError('User not authenticated');

    setSaving(true); setError(''); setSuccess('');
    try {
      const formData = new FormData();
      formData.append('name', candidateName.trim());
      formData.append('state', state.trim());
      formData.append('city', city.trim());
      formData.append('experience', experience.trim());
      formData.append('profile', profile.trim());
      formData.append('createdBy', userId);
      const sel = profiles.find(p => p._id === profile);
      formData.append('profileName', sel ? sel.name : 'unknown-profile');
      formData.append('candidateName', candidateName.trim());
      if (resume) formData.append('resume', resume);

      const url = editingId ? `${API_BASE_URL}/candidates/${editingId}` : `${API_BASE_URL}/candidates`;
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(editingId ? 'Candidate updated!' : 'Candidate added successfully!');
        setCandidateName(''); setState(''); setCity(''); setExperience('');
        setProfile(''); setResume(null); setResumePreview(''); setEditingId(null);
        fetchCandidates();
        if (isMobile) setMobileView('list');
      } else setError(data.message || 'Failed to save candidate');
    } catch { setError('Failed to save candidate.'); }
    finally { setSaving(false); }
  };

  const handleEdit = (c) => {
    setCandidateName(c.name); setState(c.state); setCity(c.city);
    setExperience(c.experience); setProfile(c.profile?._id || c.profile);
    setResumePreview(c.resume ? c.resume.split('/').pop() : '');
    setEditingId(c._id); setError(''); setSuccess('');
    if (isMobile) setMobileView('form');
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this candidate?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/candidates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) { setSuccess('Candidate deleted.'); fetchCandidates(); }
      else setError(data.message || 'Failed to delete');
    } catch { setError('Failed to delete candidate.'); }
  };

  const handleCancel = () => {
    setCandidateName(''); setState(''); setCity(''); setExperience('');
    setProfile(''); setResume(null); setResumePreview(''); setEditingId(null);
    setError(''); setSuccess('');
    if (isMobile) setMobileView('list');
  };

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isFormValid = candidateName.trim() && state.trim() && city.trim() && experience.trim() && profile.trim();

  useEffect(() => { fetchCandidates(); fetchProfiles(); }, []);

  /* avatar color */
  const avatarColor = (name) => {
    const colors = ['#6366f1','#0891b2','#059669','#d97706','#dc2626','#7c3aed','#db2777'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  /* ── Layout config ── */
  const sidebarWidth = isDesktop ? '380px' : '340px';
  const useStackedLayout = isMobile || isTablet;

  /* ── FORM ── */
  const FormPanel = () => (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: isMobile ? '0' : '14px',
      border: isMobile ? 'none' : '1px solid #e5e7eb',
      overflow: 'hidden',
    }}>
      {/* Form header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0,
            backgroundColor: editingId ? '#fef3c7' : '#eef2ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {editingId ? <Edit2 size={15} color="#d97706" /> : <Plus size={15} color="#4f46e5" />}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827', lineHeight: 1.3 }}>
              {editingId ? 'Edit Candidate' : 'Add New Candidate'}
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
              {editingId ? 'Update details below' : 'Fill in candidate information'}
            </div>
          </div>
        </div>
        {editingId && (
          <button onClick={handleCancel} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', flexShrink: 0 }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div style={{ margin: '14px 20px 0', padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', color: '#dc2626', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', flexShrink: 0, marginTop: '5px' }} />
          {error}
        </div>
      )}
      {success && (
        <div style={{ margin: '14px 20px 0', padding: '10px 14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '13px', color: '#16a34a', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0, marginTop: '5px' }} />
          {success}
        </div>
      )}

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Full Name */}
        <div>
          <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <User size={14} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text" value={candidateName} onChange={e => setCandidateName(e.target.value)}
              placeholder="e.g. Ravi Sharma" maxLength={100}
              style={inputStyle(focusedField === 'name')}
              onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
            />
          </div>
        </div>

        {/* State + City */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>State <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <MapPin size={14} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="text" value={state} onChange={e => setState(e.target.value)}
                placeholder="Maharashtra" maxLength={50}
                style={inputStyle(focusedField === 'state')}
                onFocus={() => setFocusedField('state')} onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>City <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <Building size={14} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="text" value={city} onChange={e => setCity(e.target.value)}
                placeholder="Mumbai" maxLength={50}
                style={inputStyle(focusedField === 'city')}
                onFocus={() => setFocusedField('city')} onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>
        </div>

        {/* Experience */}
        <div>
          <label style={labelStyle}>Experience <span style={{ color: '#ef4444' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <Briefcase size={14} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text" value={experience} onChange={e => setExperience(e.target.value)}
              placeholder="e.g. 3 years, Fresher" maxLength={50}
              style={inputStyle(focusedField === 'exp')}
              onFocus={() => setFocusedField('exp')} onBlur={() => setFocusedField(null)}
            />
          </div>
        </div>

        {/* Profile */}
        <div>
          <label style={labelStyle}>Profile <span style={{ color: '#ef4444' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <select
              value={profile} onChange={e => setProfile(e.target.value)}
              style={{
                ...inputStyle(focusedField === 'profile'),
                appearance: 'none', cursor: 'pointer',
                color: profile ? '#111827' : '#9ca3af',
                paddingRight: '32px',
              }}
              onFocus={() => setFocusedField('profile')} onBlur={() => setFocusedField(null)}
            >
              <option value="">Select a profile</option>
              {profiles.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <ChevronDown size={14} color="#9ca3af" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Resume Upload */}
        <div>
          <label style={labelStyle}>Resume / CV</label>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById('resume-upload').click()}
            style={{
              border: `1.5px dashed ${dragOver ? '#6366f1' : resumePreview ? '#22c55e' : '#d1d5db'}`,
              borderRadius: '10px', padding: '16px',
              textAlign: 'center', cursor: 'pointer',
              backgroundColor: dragOver ? '#eef2ff' : resumePreview ? '#f0fdf4' : '#fafafa',
              transition: 'all 0.2s',
            }}
          >
            <input id="resume-upload" type="file" accept=".jpg,.jpeg,.pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => handleFileChange(e.target.files[0])} />
            {resumePreview ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={14} color="#16a34a" />
                </div>
                <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#16a34a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{resumePreview}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Click to replace</div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                  <Upload size={15} color="#6366f1" />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                  {isMobile ? 'Tap to upload' : 'Drop file or click to upload'}
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>JPG, PDF, DOC, DOCX — max 5MB</div>
              </>
            )}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving || !isFormValid}
          style={{
            width: '100%', padding: '12px',
            borderRadius: '10px', border: 'none',
            background: isFormValid && !saving ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : '#e5e7eb',
            color: isFormValid && !saving ? '#fff' : '#9ca3af',
            fontSize: '14px', fontWeight: 600,
            cursor: isFormValid && !saving ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'opacity 0.15s', marginTop: '4px',
          }}
        >
          {saving ? (
            <>
              <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Saving...
            </>
          ) : (
            <><Save size={15} />{editingId ? 'Update Candidate' : 'Add Candidate'}</>
          )}
        </button>
      </div>
    </div>
  );

  /* ── CANDIDATES LIST / TABLE ── */
  const CandidatesList = () => (
    <div style={{ backgroundColor: '#fff', borderRadius: isMobile ? '0' : '14px', border: isMobile ? 'none' : '1px solid #e5e7eb', overflow: 'hidden' }}>
      {/* List header */}
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid #f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText size={14} color="#6b7280" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>All Candidates</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{filteredCandidates.length} of {candidates.length} shown</div>
          </div>
        </div>
        <div style={{ position: 'relative', width: isMobile ? '100%' : '220px' }}>
          <Search size={13} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search candidates..."
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px 8px 30px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', backgroundColor: '#fafafa', color: '#111827' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ padding: '50px 20px', textAlign: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e5e7eb', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 10px' }} />
          <div style={{ fontSize: '13px', color: '#9ca3af' }}>Loading...</div>
        </div>
      )}

      {/* Empty */}
      {!loading && filteredCandidates.length === 0 && (
        <div style={{ padding: '50px 20px', textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <User size={22} color="#d1d5db" />
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
            {searchQuery ? 'No results found' : 'No candidates yet'}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            {searchQuery ? 'Try different keywords' : 'Add your first candidate using the form'}
          </div>
        </div>
      )}

      {/* Mobile: Cards */}
      {!loading && filteredCandidates.length > 0 && isMobile && (
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredCandidates.map(c => (
            <div key={c._id} style={{ border: '1px solid #f3f4f6', borderRadius: '12px', padding: '14px', backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: avatarColor(c.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '15px', flexShrink: 0 }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: '#d1d5db', fontFamily: 'monospace' }}>#{c._id.slice(-6)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleEdit(c)} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid #e5e7eb', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280' }}>
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(c._id)} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid #e5e7eb', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6b7280' }}>
                  <MapPin size={12} color="#9ca3af" />
                  {c.city}, {c.state}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6b7280' }}>
                  <Briefcase size={12} color="#9ca3af" />
                  {c.experience}
                </div>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '5px', backgroundColor: '#eef2ff', color: '#4338ca', fontSize: '11px', fontWeight: 500 }}>
                  {c.profile?.name || 'N/A'}
                </span>
                {c.resume ? (
                  <a
                    href={c.key ? `${API_BASE_URL}/api/media/preview?key=${c.key}` : (c.resume.startsWith('http') ? c.resume : `${API_BASE_URL}/${c.resume}`)}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '5px', backgroundColor: '#f0fdf4', color: '#16a34a', fontSize: '11px', fontWeight: 500, textDecoration: 'none', border: '1px solid #bbf7d0' }}
                  >
                    <FileText size={11} /> View CV
                  </a>
                ) : (
                  <span style={{ fontSize: '11px', color: '#d1d5db' }}>No CV</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tablet / Desktop: Table */}
      {!loading && filteredCandidates.length > 0 && !isMobile && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                {['Candidate', 'Location', 'Profile', 'Experience', 'Resume', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '10px 16px', textAlign: i === 5 ? 'right' : 'left',
                    fontSize: '11px', fontWeight: 600, color: '#9ca3af',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    borderBottom: '1px solid #f3f4f6', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((c, idx) => (
                <tr
                  key={c._id}
                  style={{ borderBottom: idx < filteredCandidates.length - 1 ? '1px solid #f9fafb' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: avatarColor(c.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{c.name}</div>
                        <div style={{ fontSize: '11px', color: '#d1d5db', fontFamily: 'monospace' }}>#{c._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#374151' }}>
                      <MapPin size={12} color="#9ca3af" />
                      <div>
                        <div style={{ fontWeight: 500 }}>{c.city}</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>{c.state}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: '5px', backgroundColor: '#eef2ff', color: '#4338ca', fontSize: '12px', fontWeight: 500 }}>
                      {c.profile?.name || 'N/A'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#374151', fontWeight: 500 }}>
                      <Briefcase size={12} color="#9ca3af" />
                      {c.experience}
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                    {c.resume ? (
                      <a
                        href={c.key ? `${API_BASE_URL}/api/media/preview?key=${c.key}` : (c.resume.startsWith('http') ? c.resume : `${API_BASE_URL}/${c.resume}`)}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 9px', borderRadius: '5px', backgroundColor: '#f0fdf4', color: '#16a34a', fontSize: '12px', fontWeight: 500, textDecoration: 'none', border: '1px solid #bbf7d0' }}
                      >
                        <FileText size={11} /> View
                      </a>
                    ) : <span style={{ fontSize: '12px', color: '#d1d5db' }}>—</span>}
                  </td>
                  <td style={{ padding: '13px 16px', whiteSpace: 'nowrap', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                      {[
                        { icon: Edit2, onClick: () => handleEdit(c), hoverBg: '#eef2ff', hoverBorder: '#c7d2fe', hoverColor: '#4f46e5' },
                        { icon: Trash2, onClick: () => handleDelete(c._id), hoverBg: '#fef2f2', hoverBorder: '#fecaca', hoverColor: '#dc2626' },
                      ].map(({ icon: Icon, onClick, hoverBg, hoverBorder, hoverColor }, bi) => (
                        <button
                          key={bi} onClick={onClick}
                          style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid #e5e7eb', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ca3af', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = hoverBg; e.currentTarget.style.borderColor = hoverBorder; e.currentTarget.style.color = hoverColor; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#9ca3af'; }}
                        >
                          <Icon size={13} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fc', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* ── Navbar ── */}
      <div style={{
        backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb',
        padding: `0 ${isMobile ? '16px' : '24px'}`,
        height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: isMobile ? '14px' : '15px', color: '#111827', lineHeight: 1.2 }}>
              {isMobile ? 'Candidates' : 'Candidate Management'}
            </div>
            {!isMobile && <div style={{ fontSize: '11px', color: '#9ca3af' }}>Recruitment Portal</div>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#4f46e5', lineHeight: 1 }}>{candidates.length}</div>
          </div>
          {/* Mobile: toggle tab */}
          {isMobile && (
            <button
              onClick={() => setMobileView(v => v === 'form' ? 'list' : 'form')}
              style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: mobileView === 'form' ? '#eef2ff' : '#fff', color: mobileView === 'form' ? '#4f46e5' : '#374151', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              {mobileView === 'form' ? <><FileText size={13} /> List</> : <><Plus size={13} /> Add</>}
            </button>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{
        maxWidth: '1320px', margin: '0 auto',
        padding: isMobile ? '0' : isTablet ? '20px 16px' : '28px 24px',
        display: useStackedLayout ? 'block' : 'grid',
        gridTemplateColumns: useStackedLayout ? undefined : `${sidebarWidth} 1fr`,
        gap: '20px', alignItems: 'start',
      }}>

        {/* Desktop: both columns. Tablet: stacked. Mobile: toggled */}

        {/* Form column */}
        {(!isMobile || mobileView === 'form') && (
          <div style={{ position: isDesktop ? 'sticky' : 'static', top: '80px', marginBottom: useStackedLayout ? '16px' : 0 }}>
            {FormPanel()}
          </div>
        )}

        {/* List column */}
        {(!isMobile || mobileView === 'list') && (
          <div>
            {/* On tablet, show form above list (collapsible style) */}
            {isTablet && (
              <div style={{ marginBottom: '16px' }}>
                {FormPanel()}
              </div>
            )}
            {CandidatesList()}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder { color: #c9cdd4; }
        select option { color: #111827; }
        @media (max-width: 640px) {
          table { font-size: 12px; }
        }
      `}</style>
    </div>
  );
}