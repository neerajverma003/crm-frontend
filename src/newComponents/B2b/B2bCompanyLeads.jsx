import React, { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiMessageCircle, FiX } from "react-icons/fi";
import DestinationSearchBox from "../../components/DestinationSearchBox";
import CompanySearchBox from "../../components/CompanySearchBox";

// Dropdown options reused from AddMyLead
const leadSources = [
  "Cold Call",
  "Website",
  "Referral",
  "LinkedIn",
  "Trade Show",
  "Email Campaign",
  "Social Media", 
  "Event",
  "Organic Search",
  "Paid Ads",
];
const leadTypes = ["International", "Domestic"];
const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];
const tripDurations = [
  "1n/2d","2n/3d","3n/4d","4n/5d","5n/6d","6n/7d","7n/8d","8n/9d","9n/10d",
  "10n/11d","11n/12d","12n/13d","13n/14d","14n/15d","Others"
];

// Small form building blocks
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
      className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
        disabled ? "bg-gray-100 cursor-not-allowed border-gray-300 text-gray-500" : ""
      } ${
        error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
      }`}
      autoComplete="off"
    />
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
);

const SelectField = ({ name, options, required, value, error, onChange }) => (
  <div className="h-[4.5rem]">
    <label className="block text-xs font-medium text-gray-700 mb-0.5">
      {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <option value="">Select {name}</option>
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
);

// Modal component
const Modal = ({ isOpen, onClose, size = "large", children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className={`bg-white rounded-lg shadow-lg ${size === "large" ? "w-full max-w-4xl" : "w-full max-w-md"} max-h-[95vh] overflow-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// LeadForm copied/adapted from AddMyLead (contains all fields)
const LeadForm = ({ initialData = {}, onSubmit, onClose, isEditing = false }) => {
  const normalizeDateForInput = (val) => {
    if (!val) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return "";
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch (e) {
      return "";
    }
  };

  const [formData, setFormData] = useState({
    companyName: "",
    referenceId: "",
    companyEmail: "",
    companyPhone: "",
    companyWhatsApp: "",
    departureCity: "",
    destination: "",
    expectedTravelDate: "",
    noOfDays: "",
    customNoOfDays: "",
    placesToCover: "",
    placesToCoverArray: [],
    noOfPerson: "",
    noOfChild: "",
    childAges: [],
    groupNumber: "",
    leadSource: "",
    leadType: "",
    tripType: "",
    leadStatus: "Hot",
    notes: "",
    ...initialData,
    placesToCoverArray: initialData?.placesToCoverArray || (initialData?.placesToCover ? initialData.placesToCover.split(", ").map(p => p.trim()) : []),
    expectedTravelDate: normalizeDateForInput(initialData?.expectedTravelDate),
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placeInput, setPlaceInput] = useState("");

  useEffect(() => {
    setFormData(prev => ({
      referenceId: initialData?.referenceId || "",
      companyName: "",
      companyEmail: "",
      companyPhone: "",
      companyWhatsApp: "",
      departureCity: "",
      destination: "",
      expectedTravelDate: normalizeDateForInput(initialData?.expectedTravelDate),
      noOfDays: "",
      customNoOfDays: "",
      placesToCover: "",
      placesToCoverArray: initialData?.placesToCoverArray || (initialData?.placesToCover ? initialData.placesToCover.split(",").map(p => p.trim()).filter(Boolean) : []),
      noOfPerson: "",
      noOfChild: "",
      childAges: [],
      groupNumber: "",
      leadSource: "",
      leadType: "",
      tripType: "",
      leadStatus: "Hot",
      notes: "",
      ...initialData,
    }));
  }, [initialData]);

  const validate = (data) => {
    const newErrors = {};
    if (!data.companyName || data.companyName.trim() === "") newErrors.companyName = "Company name is required";
    if (!data.companyEmail || data.companyEmail.trim() === "") newErrors.companyEmail = "Company email is required";
    if (!data.referenceId || !/^[A-Z0-9]{8}$/.test(data.referenceId)) newErrors.referenceId = "Invalid Reference ID";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, id, companyEmail, companyPhone, companyWhatsApp } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(id ? { companyId: id } : {}),
      ...(companyEmail ? { companyEmail } : {}),
      ...(companyPhone ? { companyPhone } : {}),
      ...(companyWhatsApp ? { companyWhatsApp } : {}),
    }));
  };

  const handleAddPlace = (e) => {
    if (e && e.type === "keydown" && e.key !== "Enter") return;
    if (e && e.preventDefault) e.preventDefault();
    const inputVal = (placeInput || "").trim();
    if (!inputVal) return;
    const parts = inputVal.split(",").map(p => p.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, placesToCoverArray: [...(prev.placesToCoverArray||[]), ...parts.filter(p=>!prev.placesToCoverArray?.includes(p))] }));
    setPlaceInput("");
  };
  const removePlace = (index) => {
    const updatedPlaces = [...(formData.placesToCoverArray || [])];
    updatedPlaces.splice(index, 1);
    setFormData((prev) => ({ ...prev, placesToCoverArray: updatedPlaces }));
  };

  const handleChildAgeChange = (index, value) => {
    const ages = [...formData.childAges];
    ages[index] = value;
    setFormData((prev) => ({ ...prev, childAges: ages }));
  };
  const addChildAge = () => setFormData((prev) => ({ ...prev, childAges: [...prev.childAges, ""] }));
  const removeChildAge = (index) => {
    const ages = [...(formData.childAges || [])];
    ages.splice(index, 1);
    setFormData((prev) => ({ ...prev, childAges: ages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    const payload = { ...formData, placesToCover: (formData.placesToCoverArray||[]).join(", ") };
    setIsSubmitting(true);
    try {
      await onSubmit(payload);
      setTimeout(() => onClose(), 500);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to save lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField name="referenceId" value={formData.referenceId} onChange={handleChange} disabled={true} />
        <CompanySearchBox name="companyName" value={formData.companyName} onChange={handleChange} required error={errors.companyName} />
        <InputField name="companyEmail" type="email" value={formData.companyEmail} onChange={handleChange} required error={errors.companyEmail} />
        <InputField name="companyPhone" value={formData.companyPhone} onChange={handleChange} />
        <InputField name="companyWhatsApp" value={formData.companyWhatsApp} onChange={handleChange} />
        <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} />
        <DestinationSearchBox
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Search destination..."
        />
        <InputField name="expectedTravelDate" type="date" value={formData.expectedTravelDate} onChange={handleChange} />
        <SelectField name="noOfDays" options={tripDurations} value={formData.noOfDays} onChange={handleChange} />
        {formData.noOfDays === "Others" && (
          <InputField name="customNoOfDays" placeholder="Enter custom duration" value={formData.customNoOfDays || ""} onChange={handleChange} />
        )}

        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-0.5">Places to Cover</label>
          <div className="flex flex-wrap gap-1 mb-1">
            {(formData.placesToCoverArray || []).map((place, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1 text-sm">
                {place}
                <button type="button" onClick={() => removePlace(idx)}>x</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a place, press Enter or click Add"
              value={placeInput}
              onChange={(e) => setPlaceInput(e.target.value)}
              onKeyDown={(e) => handleAddPlace(e)}
              className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button type="button" onClick={handleAddPlace} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
          </div>
        </div>

        <InputField name="noOfPerson" type="number" value={formData.noOfPerson} onChange={handleChange} />
        <InputField name="noOfChild" type="number" value={formData.noOfChild} onChange={handleChange} />
        <InputField name="groupNumber" type="text" value={formData.groupNumber} onChange={handleChange} />

        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-0.5">Child Ages</label>
          {formData.childAges.map((age, idx) => (
            <div key={idx} className="flex gap-2 mb-1">
              <input type="number" value={age} onChange={(e) => handleChildAgeChange(idx, e.target.value)} placeholder="Child Age" className="w-full px-3 py-1.5 border rounded-lg text-sm" />
              <button type="button" onClick={() => removeChildAge(idx)} className="bg-red-100 px-2 rounded hover:bg-red-200">X</button>
            </div>
          ))}
          <button type="button" onClick={addChildAge} className="mt-1 text-blue-600 hover:underline text-sm">+ Add Child Age</button>
        </div>

        <SelectField name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} />
        <SelectField name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} />
        <SelectField name="tripType" options={tripTypes} value={formData.tripType} onChange={handleChange} />
        <SelectField name="leadStatus" options={leadStatuses} value={formData.leadStatus} onChange={handleChange} />
      </div>

      <div className="mt-2">
        <label className="block text-xs font-medium text-gray-700 mb-0.5">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Add any notes or remarks..."
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        ></textarea>
      </div>

      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {isSubmitting ? "Saving..." : (isEditing ? "Update Lead" : "Save Lead")}
        </button>
        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
};

const B2bCompanyLeads = () => {
  const [leads, setLeads] = useState([]);
  const [operationLeads, setOperationLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTableTab, setActiveTableTab] = useState("all"); // 'all' | 'transfer'
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingLead, setViewingLead] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [statusSavingId, setStatusSavingId] = useState(null);
  const [messageModal, setMessageModal] = useState({ isOpen: false, lead: null });
  const [messageText, setMessageText] = useState("");
  const [pendingStatus, setPendingStatus] = useState(null); // { leadId, newStatus }
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, lead: null });
  const [viewingPdfUrl, setViewingPdfUrl] = useState(null); // State for PDF viewer modal
  const [detailsForm, setDetailsForm] = useState({
    itinerary: "",
    inclusion: "",
    specialInclusions: "",
    exclusion: "",
    tokenAmount: "",
    totalAmount: "",
    advanceRequired: "",
    discount: "",
    totalAirfare: "",
    advanceAirfare: "",
    discountAirfare: ""
  });
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    status: "active",
  });

  // Fetch company leads and operation leads
  useEffect(() => {
    fetchLeads();
    fetchOperationLeads();
  }, []);

  // Filter leads based on search term and active tab
  useEffect(() => {
    if (activeTableTab === "transfer") {
      // Show operation leads for Transfer Lead tab
      const baseFiltered = operationLeads.filter(
        (lead) =>
          lead.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLeads(baseFiltered);
    } else {
      // Show company leads for All Leads tab
      const baseFiltered = leads.filter(
        (lead) =>
          lead.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLeads(baseFiltered);
    }
  }, [searchTerm, leads, operationLeads, activeTableTab]);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:4000/b2b-leads/");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      } else {
        console.error("Failed to fetch company leads");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch operation leads from b2b-operation-leads collection
  const fetchOperationLeads = async () => {
    try {
      const res = await fetch("http://localhost:4000/b2b-operation-leads/");
      if (res.ok) {
        const data = await res.json();
        setOperationLeads(data);
      } else {
        console.error("Failed to fetch operation leads");
      }
    } catch (error) {
      console.error("Error fetching operation leads:", error);
    }
  };

  // Fetch a new unique referenceId from backend
  const fetchNewReferenceId = async () => {
    try {
      const res = await fetch("http://localhost:4000/b2b-leads/generate-ref");
      if (!res.ok) throw new Error("Failed to generate referenceId");
      const data = await res.json();
      return data.referenceId;
    } catch (err) {
      console.error("Error generating referenceId:", err);
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName || !formData.email) {
      alert("Please fill in required fields");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:4000/b2b-leads/${editingId}`
        : "http://localhost:4000/b2b-leads";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(editingId ? "Lead updated successfully" : "Lead added successfully");
        setFormData({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          status: "active",
        });
        setShowForm(false);
        setEditingId(null);
        fetchLeads();
      } else {
        alert("Failed to save lead");
      }
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Error saving lead");
    }
  };

  const handleEdit = (lead) => {
    setFormData(lead);
    setEditingId(lead._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        const res = await fetch(`http://localhost:4000/b2b-leads/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("Lead deleted successfully");
          fetchLeads();
        } else {
          alert("Failed to delete lead");
        }
      } catch (error) {
        console.error("Error deleting lead:", error);
        alert("Error deleting lead");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      companyName: "",
      companyEmail: "",
      companyPhone: "",
      companyWhatsApp: "",
      status: "active",
    });
  };

  const handleViewLead = (lead) => {
    setViewingLead(lead);
    setShowViewModal(true);
  };

  const handleConfirmTransfer = async (lead) => {
    if (!lead) return;
    if (!window.confirm(`Move ${lead.companyName || lead.referenceId} to Transfer Lead?`)) return;
    try {
      setStatusSavingId(lead._id);
      
      // Step 1: Create operation lead in b2b-operation-leads collection
      // Map companyEmail to email since B2bOperationLeadModel expects 'email' field
      const operationLeadData = {
        ...lead,
        email: lead.companyEmail || lead.email,
        phone: lead.companyPhone || lead.phone,
        whatsAppNo: lead.companyWhatsApp || lead.whatsAppNo,
        originalLeadId: lead._id,
      };
      
      const operationLeadRes = await fetch("http://localhost:4000/b2b-operation-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(operationLeadData),
      });
      
      if (!operationLeadRes.ok) {
        const err = await operationLeadRes.json().catch(() => ({}));
        alert("Failed to create operation lead: " + (err.message || operationLeadRes.statusText));
        setStatusSavingId(null);
        return;
      }

      // Step 2: Delete from b2b-leads collection
      const deleteRes = await fetch(`http://localhost:4000/b2b-leads/${lead._id}`, {
        method: "DELETE",
      });

      if (!deleteRes.ok) {
        const err = await deleteRes.json().catch(() => ({}));
        alert("Failed to delete from company leads: " + (err.message || deleteRes.statusText));
        setStatusSavingId(null);
        return;
      }

      // Step 3: Update local state - remove lead from leads array and add to operation leads
      setLeads((prev) => prev.filter((l) => l._id !== lead._id));
      const operationLead = await operationLeadRes.json();
      setOperationLeads((prev) => [...prev, operationLead]);
      
      alert("Lead successfully moved to Transfer Leads!");
      setStatusSavingId(null);
    } catch (err) {
      console.error("Error confirming transfer:", err);
      alert("Error confirming transfer");
      setStatusSavingId(null);
    }
  };

  const handleOpenPdf = async (url) => {
    if (!url) {
      alert('PDF URL not available');
      return;
    }
    setViewingPdfUrl(url);
  };

  const handleAddMessage = (lead) => {
    if (!lead) return;
    setMessageText("");
    setMessageModal({ isOpen: true, lead });
  };

  const handleSendMessage = async (leadId) => {
    if (!messageText || messageText.trim() === "") {
      alert("Please enter a message");
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/b2b-leads/${leadId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      if (!res.ok) throw new Error("Failed to save message");
      // If there is a pending status (e.g., Follow Up), save it now
      if (pendingStatus && pendingStatus.leadId === leadId) {
        try {
          const r2 = await fetch(`http://localhost:4000/b2b-leads/${leadId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leadStatus: pendingStatus.newStatus }),
          });
          if (r2.ok) {
            setLeads((prev) => prev.map((l) => (l._id === leadId ? { ...l, leadStatus: pendingStatus.newStatus } : l)));
          }
        } catch (e) {
          console.error("Failed to save pending status after message:", e);
        } finally {
          setPendingStatus(null);
        }
      }
      alert("Message saved");
      setMessageModal({ isOpen: false, lead: null });
      setMessageText("");
    } catch (err) {
      console.error(err);
      alert("Failed to save message (endpoint may not exist)");
    }
  };

  const handleAddDetails = async (lead) => {
    if (!lead) return;
    try {
      // Fetch full lead details if available
      const res = await fetch(`http://localhost:4000/b2b-leads/${lead._id}`);
      if (res.ok) {
        const data = await res.json();
        const fullLead = data;
        setDetailsModal({ isOpen: true, lead: fullLead });
        setDetailsForm({
          itinerary: fullLead.itinerary || "",
          inclusion: fullLead.inclusion || "",
          specialInclusions: fullLead.specialInclusions || "",
          exclusion: fullLead.exclusion || "",
          tokenAmount: fullLead.tokenAmount || "",
          totalAmount: fullLead.totalAmount || "",
          advanceRequired: fullLead.advanceRequired || "",
          discount: fullLead.discount || "",
          totalAirfare: fullLead.totalAirfare || "",
          advanceAirfare: fullLead.advanceAirfare || "",
          discountAirfare: fullLead.discountAirfare || ""
        });
      } else {
        throw new Error("Failed to fetch lead");
      }
    } catch (err) {
      console.error(err);
      // Fallback: open modal with current lead
      setDetailsModal({ isOpen: true, lead });
      setDetailsForm({
        itinerary: lead.itinerary || "",
        inclusion: lead.inclusion || "",
        specialInclusions: lead.specialInclusions || "",
        exclusion: lead.exclusion || "",
        tokenAmount: lead.tokenAmount || "",
        totalAmount: lead.totalAmount || "",
        advanceRequired: lead.advanceRequired || "",
        discount: lead.discount || "",
        totalAirfare: lead.totalAirfare || "",
        advanceAirfare: lead.advanceAirfare || "",
        discountAirfare: lead.discountAirfare || ""
      });
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    if (!newStatus) return;
    // If selecting Follow Up, require message first
    if (newStatus === "Follow Up") {
      const lead = leads.find((l) => l._id === leadId);
      setPendingStatus({ leadId, newStatus });
      setMessageText("");
      setMessageModal({ isOpen: true, lead });
      return;
    }

    setStatusSavingId(leadId);
    try {
      const res = await fetch(`http://localhost:4000/b2b-leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadStatus: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      // update local state
      setLeads((prev) => prev.map((l) => (l._id === leadId ? { ...l, leadStatus: newStatus } : l)));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setStatusSavingId(null);
    }
  };

  // Map existing b2b lead to the LeadForm shape
  const mapLeadToForm = (lead = {}) => ({
    referenceId: lead.referenceId || lead.referenceID || "",
    companyName: lead.companyName || lead.name || "",
    companyId: lead.companyId || lead.company || lead._id || "",
    companyEmail: lead.email || lead.companyEmail || "",
    companyPhone: lead.phone || lead.companyPhone || "",
    companyWhatsApp: lead.whatsAppNo || lead.companyWhatsApp || lead.contactPerson || "",
    departureCity: lead.departureCity || "",
    destination: lead.destination || "",
    expectedTravelDate: lead.expectedTravelDate || "",
    noOfDays: lead.noOfDays || "",
    customNoOfDays: lead.customNoOfDays || "",
    placesToCoverArray: lead.placesToCoverArray || (lead.placesToCover ? lead.placesToCover.split(",").map(s=>s.trim()) : []),
    noOfPerson: lead.noOfPerson || "",
    noOfChild: lead.noOfChild || "",
    childAges: lead.childAges || [],
    groupNumber: lead.groupNumber || "",
    leadSource: lead.leadSource || "",
    leadType: lead.leadType || "",
    tripType: lead.tripType || "",
    leadStatus: lead.status || lead.leadStatus || "Hot",
    notes: lead.notes || "",
  });

  // Submit LeadForm payload to b2b-leads endpoint
  const submitLead = async (payload) => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `http://localhost:4000/b2b-leads/${editingId}` : "http://localhost:4000/b2b-leads";
      // ensure legacy fields exist for backend compatibility
      const body = {
        ...payload,
        referenceId: payload.referenceId,
        companyName: payload.companyName,
        email: payload.companyEmail,
        phone: payload.companyPhone,
        whatsAppNo: payload.companyWhatsApp,
        companyId: payload.companyId || payload.companyId === 0 ? payload.companyId : undefined,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save lead");
      alert(editingId ? "Lead updated successfully" : "Lead added successfully");
      setShowForm(false);
      setEditingId(null);
      fetchLeads();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Company Leads</h1>
          <p className="text-gray-600">Manage B2B company leads and opportunities</p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 mr-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by company name, contact person, or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={async () => {
              setEditingId(null);
              try {
                const res = await fetch("http://localhost:4000/b2b-leads/generate-ref");
                if (res.ok) {
                  const data = await res.json();
                  setFormData({ referenceId: data.referenceId });
                } else {
                  setFormData({});
                }
              } catch (err) {
                console.error("Failed to fetch referenceId", err);
                setFormData({});
              }
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus size={20} />
            Add Lead
          </button>

        </div>

        {/* Table Tabs */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTableTab("all")}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${activeTableTab === 'all' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              All Leads
            </button>
            <button
              onClick={() => setActiveTableTab("transfer")}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${activeTableTab === 'transfer' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Transfer Leads
            </button>
          </div>
        </div>

        {/* View Lead Modal */}
        {showViewModal && viewingLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Lead Details</h3>
                <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FiTrash2 size={24} />
                </button>
              </div>

              <form className="space-y-6">
                {/* Reference ID Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    Reference ID
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <input type="text" value={viewingLead.referenceId || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-bold" />
                  </div>
                </div>

                {/* Company Information Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    Company Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Company Name</label>
                      <input type="text" value={viewingLead.companyName || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Company Email</label>
                      <input type="email" value={viewingLead.email || viewingLead.companyEmail || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Company Phone</label>
                      <input type="text" value={viewingLead.phone || viewingLead.companyPhone || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Company WhatsApp</label>
                      <input type="text" value={viewingLead.whatsAppNo || viewingLead.companyWhatsApp || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                    </div>
                  </div>
                </div>

                {/* Travel Information Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                    Travel Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Departure City</label>
                      <input type="text" value={viewingLead.departureCity || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Destination</label>
                      <input type="text" value={viewingLead.destination || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Expected Travel Date</label>
                      <input type="text" value={viewingLead.expectedTravelDate ? new Date(viewingLead.expectedTravelDate).toLocaleDateString() : ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. of Days</label>
                      <input type="text" value={viewingLead.noOfDays || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                    </div>
                    {(viewingLead.placesToCoverArray?.length > 0 || viewingLead.placesToCover) && (
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Places to Cover</label>
                        <div className="flex flex-wrap gap-2">
                          {(viewingLead.placesToCoverArray || (viewingLead.placesToCover ? viewingLead.placesToCover.split(",") : [])).map((place, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium">
                              {place?.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Passengers Information Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                    Passengers Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. of Persons</label>
                      <input type="text" value={viewingLead.noOfPerson || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. of Children</label>
                      <input type="text" value={viewingLead.noOfChild || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Child Ages</label>
                      <input type="text" value={viewingLead.childAges?.length ? viewingLead.childAges.join(", ") : "-"} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                    </div>
                  </div>
                </div>

                {/* Lead Management Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                    Lead Management
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Group Number</label>
                      <input type="text" value={viewingLead.groupNumber || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Source</label>
                      <input type="text" value={viewingLead.leadSource || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Type</label>
                      <input type="text" value={viewingLead.leadType || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Trip Type</label>
                      <input type="text" value={viewingLead.tripType || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Status</label>
                      <input type="text" value={viewingLead.leadStatus || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-semibold" />
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                {viewingLead.notes && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                      Additional Notes
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <textarea rows={3} value={viewingLead.notes} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                    </div>
                  </div>
                )}

                {/* Messages Section */}
                {viewingLead.messages && viewingLead.messages.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                      Messages
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 max-h-64 overflow-y-auto">
                      {viewingLead.messages.map((msg, idx) => (
                        <div key={idx} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
                          <div className="text-xs text-gray-500 mb-1">
                            {msg.sentAt ? new Date(msg.sentAt).toLocaleString() : "No date"}
                          </div>
                          <div className="text-sm text-gray-800 whitespace-pre-wrap">{msg.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details Section */}
                {(viewingLead.itinerary || viewingLead.inclusion || viewingLead.exclusion || viewingLead.totalAmount) && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                      Trip Details
                    </h4>
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      {/* Itinerary PDF */}
                      {viewingLead.itinerary && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Itinerary</label>
                          <button
                            type="button"
                            onClick={() => handleOpenPdf(viewingLead.itinerary)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                          >
                            📄 View Itinerary PDF
                          </button>
                        </div>
                      )}

                      {/* Inclusions */}
                      {viewingLead.inclusion && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Inclusions</label>
                          <textarea rows={3} value={viewingLead.inclusion} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                        </div>
                      )}

                      {/* Special Inclusions */}
                      {viewingLead.specialInclusions && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Special Inclusions</label>
                          <textarea rows={2} value={viewingLead.specialInclusions} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                        </div>
                      )}

                      {/* Exclusions */}
                      {viewingLead.exclusion && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Exclusions</label>
                          <textarea rows={3} value={viewingLead.exclusion} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                        </div>
                      )}

                      {/* Land Package Calculation */}
                      {viewingLead.totalAmount && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="text-sm font-semibold text-gray-800 mb-3">Land Package Calculation:</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-700">Total Cost:</span>
                              <span className="font-medium">₹ {viewingLead.totalAmount || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">- Advance:</span>
                              <span className="font-medium">₹ {viewingLead.advanceRequired || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">- Discount:</span>
                              <span className="font-medium">₹ {viewingLead.discount || 0}</span>
                            </div>
                            <div className="border-t border-blue-300 pt-2 flex justify-between">
                              <span className="text-gray-900 font-semibold">Final:</span>
                              <span className="font-bold text-blue-700">₹ {Math.max(0, (parseFloat(viewingLead.totalAmount || 0) - parseFloat(viewingLead.advanceRequired || 0) - parseFloat(viewingLead.discount || 0)).toFixed(2))}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Airfare Calculation */}
                      {viewingLead.totalAirfare && (
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="text-sm font-semibold text-gray-800 mb-3">Airfare Calculation:</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-700">Total Cost:</span>
                              <span className="font-medium">₹ {viewingLead.totalAirfare || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">- Advance:</span>
                              <span className="font-medium">₹ {viewingLead.advanceAirfare || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">- Discount:</span>
                              <span className="font-medium">₹ {viewingLead.discountAirfare || 0}</span>
                            </div>
                            <div className="border-t border-green-300 pt-2 flex justify-between">
                              <span className="text-gray-900 font-semibold">Final:</span>
                              <span className="font-bold text-green-700">₹ {Math.max(0, (parseFloat(viewingLead.totalAirfare || 0) - parseFloat(viewingLead.advanceAirfare || 0) - parseFloat(viewingLead.discountAirfare || 0)).toFixed(2))}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Overall Calculation */}
                      {(viewingLead.totalAmount || viewingLead.totalAirfare) && (
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <div className="text-sm font-semibold text-gray-800 mb-3">Grand Total Calculation:</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-700">Land Package:</span>
                              <span className="font-medium">₹ {parseFloat(viewingLead.totalAmount || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Airfare:</span>
                              <span className="font-medium">₹ {parseFloat(viewingLead.totalAirfare || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold bg-white bg-opacity-50 px-2 py-1 rounded">
                              <span>Combined:</span>
                              <span className="text-purple-700">₹ {(parseFloat(viewingLead.totalAmount || 0) + parseFloat(viewingLead.totalAirfare || 0)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">- Total Advance:</span>
                              <span className="font-medium">₹ {(parseFloat(viewingLead.advanceRequired || 0) + parseFloat(viewingLead.advanceAirfare || 0)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">- Total Discount:</span>
                              <span className="font-medium">₹ {(parseFloat(viewingLead.discount || 0) + parseFloat(viewingLead.discountAirfare || 0)).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-purple-300 pt-2 flex justify-between">
                              <span className="text-gray-900 font-semibold">Grand Total (Payable):</span>
                              <span className="font-bold text-purple-700">₹ {(Math.max(0, (parseFloat(viewingLead.totalAmount || 0) + parseFloat(viewingLead.totalAirfare || 0)) - (parseFloat(viewingLead.advanceRequired || 0) + parseFloat(viewingLead.advanceAirfare || 0)) - (parseFloat(viewingLead.discount || 0) + parseFloat(viewingLead.discountAirfare || 0)))).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowViewModal(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal form (full AddMyLead fields) */}
        {showForm && (
          <Modal isOpen={showForm} onClose={handleCancel} size="large">
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-4">{editingId ? "Edit Lead" : "Add New Lead"}</h2>
              <LeadForm
                initialData={editingId ? mapLeadToForm(formData) : formData}
                isEditing={!!editingId}
                onClose={handleCancel}
                onSubmit={async (payload) => await submitLead(payload)}
              />
            </div>
          </Modal>
        )}

        {/* Message Modal (used by status 'Follow Up' and Add Message) */}
        {messageModal.isOpen && messageModal.lead && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setMessageModal({ isOpen: false, lead: null })}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setMessageModal({ isOpen: false, lead: null })} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">Close</button>
              <h3 className="text-lg font-semibold mb-4 text-center">Add Message for {messageModal.lead.companyName || messageModal.lead.referenceId}</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="text-gray-600"><strong>Reference:</strong> {messageModal.lead.referenceId}</p>
                  <p className="text-gray-600"><strong>Company:</strong> {messageModal.lead.companyName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value.slice(0, 8000))}
                    placeholder="Type your message here... (max 8000 characters)"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="mt-1 text-xs text-gray-500 text-right">{messageText.length}/8000</div>
                </div>

                <div className="flex gap-2 justify-end mt-4">
                  <button onClick={() => setMessageModal({ isOpen: false, lead: null })} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium">Cancel</button>
                  <button onClick={() => handleSendMessage(messageModal.lead._id)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium" disabled={messageText.trim() === ""}>Send Message</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {detailsModal.isOpen && detailsModal.lead && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto" onClick={() => setDetailsModal({ isOpen: false, lead: null })}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setDetailsModal({ isOpen: false, lead: null })} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
              <h3 className="text-lg font-semibold mb-4 text-center">Add Details for {detailsModal.lead.companyName}</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="text-gray-600"><strong>Reference:</strong> {detailsModal.lead.referenceId}</p>
                  <p className="text-gray-600"><strong>Destination:</strong> {detailsModal.lead.destination || "-"}</p>
                </div>

                {/* Upload Itinerary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Itinerary (PDF)</label>
                  {!detailsForm.itinerary ? (
                    <input
                      type="file"
                      accept=".pdf"
                      key={`pdf-${detailsForm.itinerary || 'empty'}`}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("leadName", detailsModal.lead.companyName);
                            
                            const res = await fetch("http://localhost:4000/upload", {
                              method: "POST",
                              body: formData,
                            });
                            const data = await res.json();
                            console.log("Upload response:", data);
                            if (res.ok && data.fileUrl) {
                              console.log("Setting itinerary to:", data.fileUrl);
                              setDetailsForm((prev) => ({
                                ...prev,
                                itinerary: data.fileUrl,
                              }));
                            } else {
                              alert("Failed to upload PDF: " + (data.message || res.statusText));
                            }
                          } catch (err) {
                            console.error("Upload error:", err);
                            alert("Error uploading PDF. Check console.");
                          }
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex gap-2 items-center bg-green-50 border border-green-300 rounded-lg p-3">
                      <span className="text-sm text-gray-800 font-medium flex-1 truncate">✓ PDF Uploaded</span>
                      <button
                        type="button"
                        onClick={() => handleOpenPdf(detailsForm.itinerary)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDetailsForm({ ...detailsForm, itinerary: "" });
                        }}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Inclusion */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions</label>
                  <textarea
                    value={detailsForm.inclusion}
                    onChange={(e) => setDetailsForm({ ...detailsForm, inclusion: e.target.value })}
                    placeholder="List what's included in the package..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Special Inclusions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Inclusions <span className="text-xs text-gray-500">(optional)</span></label>
                  <textarea
                    value={detailsForm.specialInclusions}
                    onChange={(e) => setDetailsForm({ ...detailsForm, specialInclusions: e.target.value })}
                    placeholder="Add any special inclusions..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Exclusion */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exclusions</label>
                  <textarea
                    value={detailsForm.exclusion}
                    onChange={(e) => setDetailsForm({ ...detailsForm, exclusion: e.target.value })}
                    placeholder="List what's not included..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Total Land Package */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Land Package Cost (₹)</label>
                  <input
                    type="number"
                    value={detailsForm.totalAmount}
                    onChange={(e) => setDetailsForm({ ...detailsForm, totalAmount: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Advance Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advance Required (₹)</label>
                  <input
                    type="number"
                    value={detailsForm.advanceRequired}
                    onChange={(e) => setDetailsForm({ ...detailsForm, advanceRequired: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount (₹)</label>
                  <input
                    type="number"
                    value={detailsForm.discount}
                    onChange={(e) => setDetailsForm({ ...detailsForm, discount: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Land Package Calculation */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm font-semibold text-gray-800 mb-3">Land Package Calculation:</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Cost:</span>
                      <span className="font-medium">₹ {detailsForm.totalAmount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">- Advance:</span>
                      <span className="font-medium">₹ {detailsForm.advanceRequired || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">- Discount:</span>
                      <span className="font-medium">₹ {detailsForm.discount || 0}</span>
                    </div>
                    <div className="border-t border-blue-300 pt-2 flex justify-between">
                      <span className="text-gray-900 font-semibold">Final:</span>
                      <span className="font-bold text-blue-700">₹ {Math.max(0, (parseFloat(detailsForm.totalAmount || 0) - parseFloat(detailsForm.advanceRequired || 0) - parseFloat(detailsForm.discount || 0)).toFixed(2))}</span>
                    </div>
                  </div>
                </div>

                {/* Airfare Section */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Airfare / Train Fare Cost</h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Airfare / Train Fare Cost (₹)</label>
                  <input
                    type="number"
                    value={detailsForm.totalAirfare}
                    onChange={(e) => setDetailsForm({ ...detailsForm, totalAirfare: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advance Required (₹)</label>
                  <input
                    type="number"
                    value={detailsForm.advanceAirfare}
                    onChange={(e) => setDetailsForm({ ...detailsForm, advanceAirfare: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount (₹)</label>
                  <input
                    type="number"
                    value={detailsForm.discountAirfare}
                    onChange={(e) => setDetailsForm({ ...detailsForm, discountAirfare: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Airfare Calculation */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-sm font-semibold text-gray-800 mb-3">Airfare Calculation:</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Cost:</span>
                      <span className="font-medium">₹ {detailsForm.totalAirfare || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">- Advance:</span>
                      <span className="font-medium">₹ {detailsForm.advanceAirfare || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">- Discount:</span>
                      <span className="font-medium">₹ {detailsForm.discountAirfare || 0}</span>
                    </div>
                    <div className="border-t border-green-300 pt-2 flex justify-between">
                      <span className="text-gray-900 font-semibold">Final:</span>
                      <span className="font-bold text-green-700">₹ {Math.max(0, (parseFloat(detailsForm.totalAirfare || 0) - parseFloat(detailsForm.advanceAirfare || 0) - parseFloat(detailsForm.discountAirfare || 0)).toFixed(2))}</span>
                    </div>
                  </div>
                </div>

                {/* Overall Calculation */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm font-semibold text-gray-800 mb-3">Grand Total Calculation:</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Land Package:</span>
                      <span className="font-medium">₹ {parseFloat(detailsForm.totalAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Airfare:</span>
                      <span className="font-medium">₹ {parseFloat(detailsForm.totalAirfare || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold bg-white bg-opacity-50 px-2 py-1 rounded">
                      <span>Combined:</span>
                      <span className="text-purple-700">₹ {(parseFloat(detailsForm.totalAmount || 0) + parseFloat(detailsForm.totalAirfare || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">- Total Advance:</span>
                      <span className="font-medium">₹ {(parseFloat(detailsForm.advanceRequired || 0) + parseFloat(detailsForm.advanceAirfare || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">- Total Discount:</span>
                      <span className="font-medium">₹ {(parseFloat(detailsForm.discount || 0) + parseFloat(detailsForm.discountAirfare || 0)).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-purple-300 pt-2 flex justify-between">
                      <span className="text-gray-900 font-semibold">Grand Total (Payable):</span>
                      <span className="font-bold text-purple-700">₹ {(Math.max(0, (parseFloat(detailsForm.totalAmount || 0) + parseFloat(detailsForm.totalAirfare || 0)) - (parseFloat(detailsForm.advanceRequired || 0) + parseFloat(detailsForm.advanceAirfare || 0)) - (parseFloat(detailsForm.discount || 0) + parseFloat(detailsForm.discountAirfare || 0)))).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end mt-4">
                  <button onClick={() => setDetailsModal({ isOpen: false, lead: null })} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium">Cancel</button>
                  <button onClick={async () => {
                    try {
                      const res = await fetch(`http://localhost:4000/b2b-leads/${detailsModal.lead._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(detailsForm),
                      });
                      if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        alert("Failed to save details: " + (err.message || res.statusText));
                        return;
                      }
                      const data = await res.json();
                      setLeads((prev) => prev.map((l) => (l._id === detailsModal.lead._id ? data : l)));
                      alert("Details saved successfully!");
                      setDetailsModal({ isOpen: false, lead: null });
                    } catch (err) {
                      console.error("Error saving details:", err);
                      alert("Error saving details");
                    }
                  }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">Save Details</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {leads.length === 0 ? "No leads added yet" : "No leads match your search"}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Reference ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Company Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => (
                  <tr
                    key={lead._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } border-b hover:bg-gray-100 transition`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {lead.referenceId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {lead.companyName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex justify-center gap-2 flex-col sm:flex-row">
                        <div className="flex justify-center gap-2 flex-wrap">
                          {/* 1. View Button (always show) */}
                          <button
                            onClick={() => handleViewLead(lead)}
                            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                            title="View"
                          >
                            <FiEye size={16} />
                          </button>

                          {/* All other buttons only show in All Leads tab (not in Transfer Leads) */}
                          {activeTableTab !== "transfer" && (
                            <>
                              {/* 2. Edit Button */}
                              <button
                                onClick={() => handleEdit(lead)}
                                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                                title="Edit"
                              >
                                <FiEdit2 size={16} />
                              </button>

                              {/* 3. Dropdown */}
                              <select
                                value={lead.leadStatus || ""}
                                onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                disabled={statusSavingId === lead._id}
                                className={`px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition ${
                                  statusSavingId === lead._id ? 'bg-blue-50 border-blue-400 text-gray-600 cursor-not-allowed opacity-70' : 'border-gray-300'
                                } ${
                                  lead.leadStatus ? 'font-semibold text-blue-600' : 'text-gray-500'
                                }`}
                              >
                                <option value="">Select Status</option>
                                <option value="Interested">Interested</option>
                                <option value="Not Interested">Not Interested</option>
                                <option value="Connected">Connected</option>
                                <option value="Not Connected">Not Connected</option>
                                <option value="Follow Up">Follow Up</option>
                              </select>

                              {/* 4. Msg Button (only if Follow Up) */}
                              {lead.leadStatus === "Follow Up" && (
                                <button onClick={() => handleAddMessage(lead)} className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200" title="Add Message">
                                  <FiMessageCircle size={16} />
                                </button>
                              )}

                              {/* 5. Details Button (only if Follow Up) */}
                              {lead.leadStatus === "Follow Up" && (
                                <button onClick={() => handleAddDetails(lead)} className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-sm font-medium" title="Add Details">Details</button>
                              )}

                              {/* 6. Confirm Button (only if Follow Up) */}
                              {lead.leadStatus === "Follow Up" && (
                                <button onClick={() => handleConfirmTransfer(lead)} className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-sm font-medium" title="Confirm">Confirm</button>
                              )}

                              {/* 7. Delete Button */}
                              <button
                                onClick={() => handleDelete(lead._id)}
                                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                                title="Delete"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal (similar to AddMyLead) */}
      {viewingPdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Itinerary PDF</h3>
              <button 
                onClick={() => setViewingPdfUrl(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="mb-4">
              {(() => {
                const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(viewingPdfUrl)}&embedded=true`;
                return (
                  <div className="border border-gray-300 rounded p-4">
                    <div className="space-y-4">
                      <iframe
                        src={googleViewerUrl}
                        width="100%"
                        height="600px"
                        frameBorder="0"
                        className="rounded"
                        title="PDF Document"
                      />
                      <div className="flex gap-3 justify-center">
                        <a
                          href={viewingPdfUrl}
                          download
                          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
                        >
                          ⬇️ Download PDF
                        </a>
                        <a
                          href={viewingPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition font-medium"
                        >
                          🔗 Open in New Tab
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default B2bCompanyLeads;
