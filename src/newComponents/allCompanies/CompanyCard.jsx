import axios from "axios";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MdMail, MdPhone, MdLanguage, MdPeople, MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import PropTypes from 'prop-types';

const CompanyCard = ({
  _id,
  companyName,
  industry,
  status,
  email,
  phoneNumber,
  website,
  logo,
  logoKey,
  address,
  numberOfEmployees,
  deals = 0,
  value = "$0",
  onDelete, // callback to remove from parent
  onEdit,
}) => {
  const displayName = companyName || "N/A";
  const displayStatus = status?.toLowerCase() === "active" ? "Active" : "Pending";
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [viewTab, setViewTab] = useState("overview");
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [adminsError, setAdminsError] = useState(null);

  useEffect(() => {
    const fetchAdminsForCompany = async () => {
      if (viewTab !== "admin") return;
      setLoadingAdmins(true);
      setAdminsError(null);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/getAdmins`);
        const allAdmins = res.data || [];
        const filtered = allAdmins.filter((a) => {
          try {
            // admin.company may be array of ids
            if (Array.isArray(a.company) && a.company.some((c) => String(c) === String(_id))) return true;
            // assignedRoles may contain companyIds
            if (Array.isArray(a.assignedRoles)) {
              return a.assignedRoles.some((ar) => Array.isArray(ar.companyIds) && ar.companyIds.some((cid) => String(cid) === String(_id)));
            }
            return false;
          } catch (e) {
            return false;
          }
        });
        setAdmins(filtered);
      } catch (error) {
        console.error("Error fetching admins:", error);
        setAdminsError(error?.message || "Failed to load admins");
      } finally {
        setLoadingAdmins(false);
      }
    };

    fetchAdminsForCompany();
  }, [viewTab, _id]);

  const handleDelete = async () => {
    console.log(_id);
    
    if (!_id) return;
    if (!window.confirm(`Are you sure you want to delete ${displayName}?`)) return;

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/company/delete/${_id}`);
      if (res.status === 200) {
        alert("Company deleted successfully ✅");
        if (onDelete) onDelete(_id);
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      alert("Failed to delete company ❌");
    }
  };

  const handleView =async (e) => {
    e.preventDefault();
    setIsOpen(true);
  }

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 overflow-hidden flex flex-col h-full -translate-y-0 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-500 ease-out opacity-60 pointer-events-none" />

      {/* Top Row with Status Badge */}
      <div className="relative z-10 p-5 sm:p-6 pb-4 flex-1">
        <div className="flex justify-between items-start mb-5 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-xl text-slate-700 shadow-inner overflow-hidden border border-slate-200/50 group-hover:shadow-md transition-shadow">
              {/* Show logo if available, otherwise initial letter */}
              {logoKey || logo ? (
                <img 
                  src={logoKey ? `${import.meta.env.VITE_API_URL}/api/media/preview?key=${logoKey}` : logo} 
                  alt={`${displayName} logo`} 
                  className="w-full h-full object-contain p-2" 
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-sm">
                  {displayName[0]?.toUpperCase() || "?"}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-slate-800 text-sm sm:text-lg truncate group-hover:text-indigo-600 transition-colors">{displayName}</h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5 truncate">{industry || "Industry Not Set"}</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap flex-shrink-0 ${
            displayStatus === 'Active' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
              : 'bg-amber-50 text-amber-700 border-amber-200/60'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${displayStatus === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {displayStatus}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3.5 text-sm text-slate-600 mb-2">
          {email && (
            <div className="flex items-center gap-3 hover:text-indigo-600 transition-colors group/item min-w-0">
              <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-500 transition-colors flex-shrink-0">
                <MdMail size={16} />
              </div>
              <span className="truncate">{email}</span>
            </div>
          )}
          {phoneNumber && (
            <div className="flex items-center gap-3 hover:text-indigo-600 transition-colors group/item min-w-0">
              <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-500 transition-colors flex-shrink-0">
                <MdPhone size={16} />
              </div>
              <span className="truncate">{phoneNumber}</span>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-3 hover:text-indigo-600 transition-colors group/item min-w-0">
              <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-500 transition-colors flex-shrink-0">
                <MdLanguage size={16} />
              </div>
              <span className="truncate">{website.replace(/^https?:\/\//, "")}</span>
            </div>
          )}
          <div className="flex items-center gap-3 hover:text-indigo-600 transition-colors group/item min-w-0">
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-500 transition-colors flex-shrink-0">
              <MdPeople size={16} />
            </div>
            <span className="truncate">{numberOfEmployees || 0} Employees</span>
          </div>
        </div>
      </div>

      {/* Deals & Value Section */}
      <div className="relative z-10 p-5 pt-0 mt-4 border-t border-slate-100 flex flex-col gap-4 bg-white">
        <div className="grid grid-cols-2 gap-3 pt-4">
          <div className="bg-indigo-50/50 rounded-xl p-3 text-center border border-indigo-100/50">
            <p className="font-bold text-lg text-indigo-700">{deals}</p>
            <p className="text-xs text-indigo-600/70 font-semibold uppercase tracking-wider">Deals</p>
          </div>
          <div className="bg-emerald-50/50 rounded-xl p-3 text-center border border-emerald-100/50">
            <p className="font-bold text-lg text-emerald-700">{value}</p>
            <p className="text-xs text-emerald-600/70 font-semibold uppercase tracking-wider">Value</p>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex gap-2 transition-all duration-300 ${
          isHovered ? "opacity-100" : "opacity-0 sm:opacity-100"
        }`}>
          <button
            onClick={handleView}
            title="View details"
            className="flex-1 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center group/btn shadow-sm"
          >
            <MdVisibility size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => {
              setEditData({ _id, companyName, industry, status, email, phoneNumber, website, numberOfEmployees, address, deals, value, logo, logoKey });
              setIsEditOpen(true);
            }}
            title="Edit company"
            className="flex-1 bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center group/btn shadow-sm"
          >
            <MdEdit size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleDelete}
            title="Delete company"
            className="flex-1 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center group/btn shadow-sm"
          >
            <MdDelete size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4">
          <div className="bg-white w-full h-full max-w-none rounded-none overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Company Details</h3>
              <button onClick={() => setIsOpen(false)} className="text-white text-2xl">×</button>
            </div>
            <div className="p-6">
              <nav className="sticky top-16 z-30 bg-white flex items-center justify-between mb-4">
                <div className="flex gap-3 bg-white/80 backdrop-blur-lg rounded-full px-3 py-2 shadow-sm border border-gray-200">
                  {[
                    ["overview", "OVERVIEW"],
                    ["our-offices", "OUR OFFICES"],
                    ["statoury", "STATOURY"],
                    ["admin", "ADMIN"],
                    ["contact-details", "CONTACT DETAILS"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setViewTab(key)}
                      className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${viewTab === key ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                    >
                      {label}
                      {viewTab === key && <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full" />}
                    </button>
                  ))}
                </div>
              </nav>

              <div>
                {viewTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Company Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center font-bold text-2xl border border-blue-200 overflow-hidden">
                        {logoKey || logo ? (
                          <img 
                            src={logoKey ? `${import.meta.env.VITE_API_URL}/api/media/preview?key=${logoKey}` : logo} 
                            alt={`${displayName} logo`} 
                            className="w-full h-full object-contain p-1" 
                          />
                        ) : (
                          <span className="text-blue-600">{displayName[0] || "?"}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{displayName}</h3>
                        <p className="text-gray-600">{industry || "Not specified"}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${displayStatus === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                          {displayStatus}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600 text-sm font-medium mb-2">Company Name</p>
                        <p className="text-gray-900 font-semibold">{companyName || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600 text-sm font-medium mb-2">Industry</p>
                        <p className="text-gray-900 font-semibold">{industry || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 md:col-span-2">
                        <p className="text-gray-600 text-sm font-medium mb-2">Address</p>
                        <p className="text-gray-900 font-semibold">{address || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600 text-sm font-medium mb-2">Number of Employees</p>
                        <p className="text-gray-900 font-semibold">{numberOfEmployees || 0}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600 text-sm font-medium mb-2">Status</p>
                        <p className="text-gray-900 font-semibold">{status || "N/A"}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
                        <p className="text-blue-600 text-sm font-medium mb-1">Total Deals</p>
                        <p className="text-3xl font-bold text-blue-700">{deals}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                        <p className="text-green-600 text-sm font-medium mb-1">Total Value</p>
                        <p className="text-3xl font-bold text-green-700">{value}</p>
                      </div>
                    </div>
                  </div>
                )}

                {viewTab === 'our-offices' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 md:col-span-2">
                        <p className="text-gray-600 text-sm font-medium mb-2">Website</p>
                        <p className="text-blue-600 font-semibold break-all">{website || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {viewTab === 'statoury' && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">All company information available in Overview tab</p>
                  </div>
                )}

                {viewTab === 'admin' && (
                  <div className="space-y-4">
                    {loadingAdmins ? (
                      <div className="text-sm text-gray-500">Loading admins...</div>
                    ) : adminsError ? (
                      <div className="text-sm text-red-500">Error loading admins</div>
                    ) : admins.length === 0 ? (
                      <div className="text-sm text-gray-500">No admins found for this company.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {admins.map((a) => (
                          <div key={a._id} className="p-3 border rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-800">{a.fullName || '—'}</p>
                                <p className="text-xs text-gray-500">{a.email || '—'}</p>
                                <p className="text-xs text-gray-500">{a.phone || '—'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {viewTab === 'contact-details' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600 text-sm font-medium mb-2">Email Address</p>
                        <p className="text-gray-900 font-semibold break-all">{email || "N/A"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600 text-sm font-medium mb-2">Phone Number</p>
                        <p className="text-gray-900 font-semibold">{phoneNumber || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIsOpen(false)} className="px-6 py-3 bg-gray-200 rounded-lg">Close</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Modal (Full screen) */}
      {isEditOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4">
          <div className="bg-white w-full h-full max-w-none rounded-none overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Edit Company</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-white text-2xl">×</button>
            </div>
            <div className="p-6">
              <nav className="sticky top-16 z-30 bg-white flex items-center justify-between mb-4">
                <div className="flex gap-3 bg-white/80 backdrop-blur-lg rounded-full px-3 py-2 shadow-sm border border-gray-200">
                  {[
                    ["overview", "OVERVIEW"],
                    ["our-offices", "OUR OFFICES"],
                    ["statoury", "STATOURY"],
                    ["admin", "ADMIN"],
                    ["contact-details", "CONTACT DETAILS"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeTab === key ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                    >
                      {label}
                      {activeTab === key && <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full" />}
                    </button>
                  ))}
                </div>
              </nav>

              <div>
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                      <input
                        id="companyName"
                        type="text"
                        value={editData.companyName || ''}
                        onChange={(e) => setEditData(d => ({...d, companyName: e.target.value}))}
                        placeholder="Tech Corp Solutions"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Industry */}
                    <div>
                      <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">Industry *</label>
                      <select
                        id="industry"
                        value={editData.industry || ''}
                        onChange={(e) => setEditData(d => ({...d, industry: e.target.value}))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select industry</option>
                        {["Technology", "Manufacturing", "Finance", "Healthcare", "Retail", "Consulting"].map((ind, idx) => (
                          <option key={idx} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input
                        id="email"
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => setEditData(d => ({...d, email: e.target.value}))}
                        placeholder="contact@company.com"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                      <input
                        id="phone"
                        type="text"
                        value={editData.phoneNumber || ''}
                        onChange={(e) => setEditData(d => ({...d, phoneNumber: e.target.value}))}
                        placeholder="+1 (555) 123-4567"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Website (col-span-2) */}
                    <div className="md:col-span-2">
                      <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">Website *</label>
                      <input
                        id="website"
                        type="text"
                        value={editData.website || ''}
                        onChange={(e) => setEditData(d => ({...d, website: e.target.value}))}
                        placeholder="www.company.com"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Address (col-span-2) */}
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                      <input
                        id="address"
                        type="text"
                        value={editData.address || ''}
                        onChange={(e) => setEditData(d => ({...d, address: e.target.value}))}
                        placeholder="123 Business Street, City, State ZIP"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Employees */}
                    <div>
                      <label htmlFor="employees" className="block text-sm font-semibold text-gray-700 mb-2">Number of Employees *</label>
                      <input
                        id="employees"
                        type="number"
                        value={editData.numberOfEmployees || ''}
                        onChange={(e) => setEditData(d => ({...d, numberOfEmployees: e.target.value}))}
                        placeholder="100"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                      <select
                        id="status"
                        value={editData.status || ''}
                        onChange={(e) => setEditData(d => ({...d, status: e.target.value}))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select status</option>
                        {["Active", "Pending", "Inactive"].map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Logo Upload */}
                    <div>
                      <label htmlFor="logo" className="block text-sm font-semibold text-gray-700 mb-2">Company Logo</label>
                      <input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => setEditData(d => ({...d, logoPreview: evt.target.result}));
                            reader.readAsDataURL(file);
                            setEditData(d => ({...d, logoFile: file}));
                          }
                        }}
                        className="w-full"
                      />
                      {(editData.logoPreview || editData.logo) && (
                        <div className="mt-2">
                          <img src={editData.logoPreview || editData.logo} alt="logo preview" className="h-20 w-20 object-contain rounded-md" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'our-offices' && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">All company fields are available in the Overview tab</p>
                  </div>
                )}

                {activeTab === 'statoury' && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">All company fields are available in the Overview tab</p>
                  </div>
                )}

                {activeTab === 'admin' && (
                  <div className="space-y-4">
                    {/* Fetch and display all admins with checkboxes to assign this company */}
                    <AdminAssignSection
                      companyId={_id}
                      editData={editData}
                      setEditData={setEditData}
                    />
                  </div>
                )}

                {activeTab === 'contact-details' && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">All company fields are available in the Overview tab</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIsEditOpen(false)} className="px-6 py-3 bg-gray-200 rounded-lg">Cancel</button>
                <button onClick={() => { if(onEdit) onEdit(editData); setIsEditOpen(false); }} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Save</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CompanyCard;

// AdminAssignSection component
function AdminAssignSection({ companyId, editData, setEditData }) {
  const [allAdmins, setAllAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/getAdmins`);
        const admins = res.data || [];
        setAllAdmins(admins);
        // preselect admins that already have this company
        const pre = new Set();
        admins.forEach(a => {
          try {
            if (Array.isArray(a.company) && a.company.some(c => String(c) === String(companyId))) pre.add(a._id);
            if (Array.isArray(a.assignedRoles) && a.assignedRoles.some(ar => Array.isArray(ar.companyIds) && ar.companyIds.some(cid => String(cid) === String(companyId)))) pre.add(a._id);
          } catch (e) { }
        });
        setSelected(pre);
      } catch (e) {
        console.error('Failed to load admins', e);
        setError(e.message || 'Failed to load admins');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [companyId]);

  const toggle = (id) => {
    setSelected(s => {
      const copy = new Set(s);
      if (copy.has(id)) copy.delete(id); else copy.add(id);
      return copy;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      // For each admin, if selected add company; if not selected remove it
      const promises = [];
      for (const admin of allAdmins) {
        const shouldHave = selected.has(admin._id);
        const has = Array.isArray(admin.company) && admin.company.some(c => String(c) === String(companyId));
        if (shouldHave && !has) {
          // assign company to admin (post assigns array)
          promises.push(axios.post(`${import.meta.env.VITE_API_URL}/assign`, { adminId: admin._id, companyIds: [companyId] }));
        }
        if (!shouldHave && has) {
          // remove company: send assign with remaining companyIds
          const remaining = (admin.company || []).filter(c => String(c) !== String(companyId));
          promises.push(axios.post(`${import.meta.env.VITE_API_URL}/assign`, { adminId: admin._id, companyIds: remaining }));
        }
      }
      await Promise.all(promises);
      // refresh list
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/getAdmins`);
      const admins = res.data || [];
      setAllAdmins(admins);
      // update editData.company for parent if needed
      setEditData(d => ({ ...d, companyAssignedCount: Array.from(selected).length }));
      alert('Admin assignments updated');
    } catch (e) {
      console.error(e);
      alert('Failed to save assignments');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {loading ? <div className="text-sm text-gray-500">Loading admins...</div> : error ? <div className="text-sm text-red-500">{error}</div> : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {allAdmins.map(a => (
              <label key={a._id} className="flex items-center gap-3 p-2 border rounded-lg">
                <input type="checkbox" checked={selected.has(a._id)} onChange={() => toggle(a._id)} />
                <div>
                  <div className="font-semibold text-sm">{a.fullName}</div>
                  <div className="text-xs text-gray-500">{a.email}</div>
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Saving...' : 'Save Assignments'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

AdminAssignSection.propTypes = {
  companyId: PropTypes.string,
  editData: PropTypes.object,
  setEditData: PropTypes.func,
};