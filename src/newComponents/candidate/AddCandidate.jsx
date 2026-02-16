import React, { useState, useEffect } from 'react';
import { Plus, Save, Edit2, Trash2, Search, User, MapPin, Building, Briefcase, FileText, Upload, Calendar } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const AddCandidate = () => {
  // Form state
  const [candidateName, setCandidateName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [experience, setExperience] = useState('');
  const [profile, setProfile] = useState('');
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState('');

  // Data state
  const [candidates, setCandidates] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');

  // Fetch all candidates
  const fetchCandidates = async () => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/candidates`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log(data);
      
      if (data.success) {
        setCandidates(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch candidates');
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to load candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all profiles
  const fetchProfiles = async () => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setProfiles(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch profiles');
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load profiles. Please try again.');
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid file (JPG, PDF, or DOC/DOCX)');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should not exceed 5MB');
        return;
      }

      setResume(file);
      setResumePreview(file.name);
      setError('');
    }
  };

  // Create or update candidate
  const handleSave = async () => {
    if (!candidateName.trim()) {
      setError('Candidate name is required');
      return;
    }

    if (!state.trim()) {
      setError('State is required');
      return;
    }

    if (!city.trim()) {
      setError('City is required');
      return;
    }

    if (!experience.trim()) {
      setError('Experience is required');
      return;
    }

    if (!profile.trim()) {
      setError('Profile is required');
      return;
    }

    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');


    try {
      const formData = new FormData();
      formData.append('name', candidateName.trim());
      formData.append('state', state.trim());
      formData.append('city', city.trim());
      formData.append('experience', experience.trim());
      formData.append('profile', profile.trim());
      formData.append('createdBy', userId);
      // Add profileName for Cloudinary folder structure
      const selectedProfile = profiles.find((p) => p._id === profile);
      formData.append('profileName', selectedProfile ? selectedProfile.name : 'unknown-profile');
      formData.append('candidateName', candidateName.trim());

      if (resume) {
        formData.append('resume', resume);
      }

      const url = editingId
        ? `${API_BASE_URL}/candidates/${editingId}`
        : `${API_BASE_URL}/candidates`;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Don't set Content-Type for FormData
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingId ? 'Candidate updated successfully!' : 'Candidate created successfully!');
        setCandidateName('');
        setState('');
        setCity('');
        setExperience('');
        setProfile('');
        setResume(null);
        setResumePreview('');
        setEditingId(null);
        fetchCandidates(); // Refresh the list
      } else {
        setError(data.message || 'Failed to save candidate');
      }
    } catch (err) {
      console.error('Error saving candidate:', err);
      setError('Failed to save candidate. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Edit candidate
  const handleEdit = (candidate) => {
    setCandidateName(candidate.name);
    setState(candidate.state);
    setCity(candidate.city);
    setExperience(candidate.experience);
    setProfile(candidate.profile?._id || candidate.profile);
    setResumePreview(candidate.resume ? candidate.resume.split('/').pop() : '');
    setEditingId(candidate._id);
    setError('');
    setSuccess('');
  };

  // Delete candidate
  const handleDelete = async (candidateId) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Candidate deleted successfully!');
        fetchCandidates(); // Refresh the list
      } else {
        setError(data.message || 'Failed to delete candidate');
      }
    } catch (err) {
      console.error('Error deleting candidate:', err);
      setError('Failed to delete candidate. Please try again.');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setCandidateName('');
    setState('');
    setCity('');
    setExperience('');
    setProfile('');
    setResume(null);
    setResumePreview('');
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  // Filter candidates based on search
  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Load candidates on component mount
  useEffect(() => {
    fetchCandidates();
    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Candidate Management System</h1>
              <p className="text-gray-600 mt-2 text-lg">Manage and organize candidate information</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Candidates</p>
            <p className="text-3xl font-bold text-blue-600">{candidates.length}</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg text-green-700 shadow-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Add/Edit Candidate Form */}
          <div className="w-full">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                      {editingId ? <Edit2 className="w-8 h-8 text-white" /> : <Plus className="w-8 h-8 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {editingId ? 'Edit Candidate' : 'Add New Candidate'}
                      </h2>
                      <p className="text-indigo-100 mt-1">
                        {editingId ? 'Update candidate information' : 'Enter candidate details to get started'}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-white/80">
                    <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">1</span>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">Personal Info</span>
                    </div>
                    <div className="w-8 h-px bg-gray-300"></div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">2</span>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">Location</span>
                    </div>
                    <div className="w-8 h-px bg-gray-300"></div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">3</span>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">Professional</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Personal Information Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    </div>

                    <div className="grid md:grid-cols-1 gap-6">
                      {/* Candidate Name */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            placeholder="Enter candidate's full name"
                            className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            maxLength={100}
                          />
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors duration-300" />
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          Maximum 100 characters
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location Information Section */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* State */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          State <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="e.g., California"
                            className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            maxLength={50}
                          />
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors duration-300" />
                        </div>
                      </div>

                      {/* City */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g., San Francisco"
                            className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            maxLength={50}
                          />
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 w-5 h-5 transition-colors duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information Section */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Professional Details</h3>
                    </div>

                    <div className="space-y-6">
                      {/* Experience */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Experience <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            placeholder="e.g., 3 years, 2-5 years, Fresher"
                            className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                            maxLength={50}
                          />
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 w-5 h-5 transition-colors duration-300" />
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          Specify years of experience or level
                        </p>
                      </div>

                      {/* Profile */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Profile <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <select
                            value={profile}
                            onChange={(e) => setProfile(e.target.value)}
                            className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 bg-white hover:border-gray-300 appearance-none"
                          >
                            <option value="">Select a profile</option>
                            {profiles.map((prof) => (
                              <option key={prof._id} value={prof._id}>
                                {prof.name}
                              </option>
                            ))}
                          </select>
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 w-5 h-5 transition-colors duration-300" />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          Choose the appropriate profile for this candidate
                        </p>
                      </div>

                      {/* Resume Upload */}
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-800">
                          Resume/CV Upload
                        </label>
                        <div className="relative group">
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                            id="resume-upload"
                          />
                          <label
                            htmlFor="resume-upload"
                            className="w-full px-6 py-5 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-100 transition-all duration-300 cursor-pointer bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-pink-50 group"
                          >
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <div className="p-3 bg-white rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                                <Upload className="w-6 h-6 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors duration-300">
                                  {resumePreview ? (
                                    <span className="flex items-center gap-2">
                                      <FileText className="w-4 h-4" />
                                      {resumePreview}
                                    </span>
                                  ) : (
                                    'Click to upload resume'
                                  )}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  JPG, PDF, DOC, DOCX (max 5MB)
                                </p>
                              </div>
                            </div>
                          </label>
                        </div>
                        {resumePreview && (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            File selected: {resumePreview}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      disabled={saving || !candidateName.trim() || !state.trim() || !city.trim() || !experience.trim() || !profile.trim()}
                      className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:shadow-none"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Saving...
                        </span>
                      ) : editingId ? 'Update Candidate' : 'Add Candidate'}
                    </button>

                    {editingId && (
                      <button
                        onClick={handleCancel}
                        className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Candidates List */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header with Search */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Candidate Directory</h2>
                      <p className="text-sm text-gray-600">Manage all your candidates</p>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search candidates..."
                      className="pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 w-80 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="p-16 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-6"></div>
                  <p className="text-gray-600 text-lg">Loading your candidates...</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredCandidates.length === 0 && (
                <div className="p-16 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {searchQuery ? 'No matching candidates found' : 'Start building your candidate database'}
                  </h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">
                    {searchQuery
                      ? 'Try adjusting your search terms or add a new candidate'
                      : 'Add your first candidate using the form on the left to get started'
                    }
                  </p>
                </div>
              )}

              {/* Candidates Table */}
              {!loading && filteredCandidates.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Candidate Details
                        </th>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Profile
                        </th>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Experience
                        </th>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Resume
                        </th>
                        <th className="px-6 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCandidates.map((candidate) => (
                        <tr key={candidate._id} className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">
                                  {candidate.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {candidate._id.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              <div>
                                <div className="font-medium">{candidate.city}</div>
                                <div className="text-gray-500">{candidate.state}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="w-4 h-4 mr-2 text-gray-400" />
                              {candidate.profile?.name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-600">
                              <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                              {candidate.experience}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            {candidate.resume ? (
                              <a
                                href={candidate.resume.startsWith('http') ? candidate.resume : `${API_BASE_URL}/${candidate.resume}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                View Resume
                              </a>
                            ) : (
                              <span className="text-gray-400 text-sm">No resume</span>
                            )}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => handleEdit(candidate)}
                                className="p-3 text-blue-600 hover:text-white hover:bg-blue-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                title="Edit candidate"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(candidate._id)}
                                className="p-3 text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                title="Delete candidate"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCandidate;