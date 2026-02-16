import React, { useState, useEffect, useRef } from "react";
import { Plus, AlertCircle, Eye, Edit2, X, MessageSquare } from "lucide-react";
import DestinationSearchBox from "../../components/DestinationSearchBox";

// 🧩 Dropdown Options
const leadSources = [
  "Cold Call", "Website", "Referral", "LinkedIn", "Trade Show",
  "Email Campaign", "Social Media", "Event", "Organic Search", "Paid Ads",
];
const leadTypes = ["International", "Domestic"];
const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];
const tripDurations = [
  "1n/2d", "2n/3d", "3n/4d", "4n/5d", "5n/6d", "6n/7d", "7n/8d", "8n/9d", "9n/10d",
  "10n/11d", "11n/12d", "12n/13d", "13n/14d", "14n/15d", "Others"
];

const pageSize = 100;

// 🧩 Input Field Component
const InputField = ({ name, type = "text", placeholder, required, value, error, onChange, disabled = false }) => (
  <div className="h-[4.5rem]">
    <label className="block text-xs font-medium text-gray-700 mb-0.5">
      {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${disabled ? "bg-gray-100 cursor-not-allowed border-gray-300 text-gray-500" : ""
        } ${error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
        }`}
      autoComplete="off"
    />
    {error && (
      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

// 🧩 Select Field Component
const SelectField = ({ name, options, required, value, error, onChange }) => (
  <div className="h-[4.5rem]">
    <label className="block text-xs font-medium text-gray-700 mb-0.5">
      {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
        }`}
    >
      <option value="">Select {name}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

// 🧩 Textarea Field Component
const TextareaField = ({ name, placeholder, required, value, error, onChange }) => (
  <div className="h-[4.5rem]">
    <label className="block text-xs font-medium text-gray-700 mb-0.5">
      {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      rows={2}
      className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none ${error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
        }`}
    />
    {error && (
      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

// 🧩 Lead Card Component
const SuperadminMyleadCard = ({ lead, onEdit, onDelete, onView }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-sm">{lead.name}</h3>
        <p className="text-xs text-gray-600">{lead.email}</p>
        <p className="text-xs text-gray-600">{lead.phone}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        lead.leadStatus === 'Hot' ? 'bg-red-100 text-red-800' :
        lead.leadStatus === 'Warm' ? 'bg-yellow-100 text-yellow-800' :
        lead.leadStatus === 'Cold' ? 'bg-blue-100 text-blue-800' :
        lead.leadStatus === 'Converted' ? 'bg-green-100 text-green-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {lead.leadStatus}
      </span>
    </div>

    <div className="space-y-1 mb-3">
      <p className="text-xs text-gray-600"><strong>Destination:</strong> {lead.destination}</p>
      <p className="text-xs text-gray-600"><strong>Source:</strong> {lead.leadSource}</p>
      <p className="text-xs text-gray-600"><strong>Created:</strong> {new Date(lead.createdAt).toLocaleDateString()}</p>
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => onView(lead)}
        className="flex-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-100 transition-colors"
      >
        <Eye className="w-3 h-3 inline mr-1" /> View
      </button>
      <button
        onClick={() => onEdit(lead)}
        className="flex-1 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-yellow-100 transition-colors"
      >
        <Edit2 className="w-3 h-3 inline mr-1" /> Edit
      </button>
      <button
        onClick={() => onDelete(lead._id)}
        className="flex-1 bg-red-50 text-red-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-red-100 transition-colors"
      >
        <X className="w-3 h-3 inline mr-1" /> Delete
      </button>
    </div>
  </div>
);

// 🧩 Main Component
const SuperadminMylead = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const superAdminId = localStorage.getItem("userId"); // Assuming superadmin ID is stored

  // Fetch leads
  const fetchLeads = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        search: searchTerm,
        status: statusFilter,
        destination: destinationFilter,
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/superadminmylead/${superAdminId}?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch leads');

      const data = await response.json();
      if (data.success) {
        setLeads(data.data);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setTotalRecords(data.pagination.totalRecords);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (superAdminId) {
      fetchLeads();
    }
  }, [superAdminId, searchTerm, statusFilter, destinationFilter]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const url = editingLead
        ? `${import.meta.env.VITE_API_URL}/superadminmylead/${editingLead._id}`
        : `${import.meta.env.VITE_API_URL}/superadminmylead/${superAdminId}`;

      const method = editingLead ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save lead');

      const data = await response.json();
      if (data.success) {
        setShowForm(false);
        setEditingLead(null);
        setFormData({});
        fetchLeads(currentPage);
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      setErrors({ submit: error.message });
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/superadminmylead/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete lead');

      fetchLeads(currentPage);
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  // Handle edit
  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData(lead);
    setShowForm(true);
  };

  // Handle view
  const handleView = (lead) => {
    setViewingLead(lead);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setShowForm(false);
    setEditingLead(null);
    setFormData({});
    setErrors({});
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Superadmin My Leads</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Lead
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {leadStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Filter by destination..."
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Leads Grid */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {leads.map(lead => (
              <SuperadminMyleadCard
                key={lead._id}
                lead={lead}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => fetchLeads(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages} ({totalRecords} total)
              </span>
              <button
                onClick={() => fetchLeads(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingLead ? 'Edit Lead' : 'Add New Lead'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="name" required value={formData.name} error={errors.name} onChange={handleChange} />
                <InputField name="email" type="email" value={formData.email} error={errors.email} onChange={handleChange} />
                <InputField name="phone" required value={formData.phone} error={errors.phone} onChange={handleChange} />
                <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
                <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} />
                <DestinationSearchBox
                  value={formData.destination}
                  onChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}
                  error={errors.destination}
                />
                <InputField name="expectedTravelDate" type="date" value={formData.expectedTravelDate} onChange={handleChange} />
                <SelectField name="noOfDays" options={tripDurations} value={formData.noOfDays} onChange={handleChange} />
                <InputField name="noOfPerson" type="number" value={formData.noOfPerson} onChange={handleChange} />
                <InputField name="noOfChild" type="number" value={formData.noOfChild} onChange={handleChange} />
                <SelectField name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} />
                <SelectField name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} />
                <SelectField name="tripType" options={tripTypes} value={formData.tripType} onChange={handleChange} />
                <SelectField name="leadStatus" options={leadStatuses} value={formData.leadStatus} onChange={handleChange} />
              </div>

              <TextareaField name="placesToCover" value={formData.placesToCover} onChange={handleChange} />
              <TextareaField name="notes" value={formData.notes} onChange={handleChange} />

              {errors.submit && (
                <p className="text-red-600 text-sm">{errors.submit}</p>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingLead ? 'Update Lead' : 'Add Lead'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Lead Details</h2>
              <button onClick={() => setViewingLead(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Name:</strong> {viewingLead.name}</div>
                <div><strong>Email:</strong> {viewingLead.email}</div>
                <div><strong>Phone:</strong> {viewingLead.phone}</div>
                <div><strong>WhatsApp:</strong> {viewingLead.whatsAppNo}</div>
                <div><strong>Departure City:</strong> {viewingLead.departureCity}</div>
                <div><strong>Destination:</strong> {viewingLead.destination}</div>
                <div><strong>Travel Date:</strong> {viewingLead.expectedTravelDate ? new Date(viewingLead.expectedTravelDate).toLocaleDateString() : 'N/A'}</div>
                <div><strong>Duration:</strong> {viewingLead.noOfDays}</div>
                <div><strong>Persons:</strong> {viewingLead.noOfPerson}</div>
                <div><strong>Children:</strong> {viewingLead.noOfChild}</div>
                <div><strong>Lead Source:</strong> {viewingLead.leadSource}</div>
                <div><strong>Lead Type:</strong> {viewingLead.leadType}</div>
                <div><strong>Trip Type:</strong> {viewingLead.tripType}</div>
                <div><strong>Status:</strong> {viewingLead.leadStatus}</div>
              </div>
              <div><strong>Places to Cover:</strong> {viewingLead.placesToCover}</div>
              <div><strong>Notes:</strong> {viewingLead.notes}</div>
              <div><strong>Created:</strong> {new Date(viewingLead.createdAt).toLocaleString()}</div>
              <div><strong>Updated:</strong> {new Date(viewingLead.updatedAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperadminMylead;