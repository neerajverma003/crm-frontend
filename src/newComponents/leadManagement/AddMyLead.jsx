
import React, { useState, useEffect, useRef } from "react";
import { Plus, AlertCircle, Eye, Edit2, X, MessageSquare, FileUp, Move } from "lucide-react";
import MyLeadCard from "./MyLeadCard";
import DestinationSearchBox from "../../components/DestinationSearchBox";
import { handleDestinationBasedRouting, fetchLeadsAssignedByDestination, findEmployeeByDestination } from "../../utils/destinationRouting";

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
      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
        }`}
    >
      <option value="">Select {name}</option>
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
    {error && (
      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

// 🧩 Modal Component
const Modal = ({ isOpen, onClose, size = "large", children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className={`bg-white rounded-lg shadow-lg ${size === "large" ? "w-full max-w-4xl" : "w-full max-w-md"} max-h-[95vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// 🧩 Add/Edit Lead Form Component
const LeadForm = ({ initialData, onSubmit, onClose, isEditing = false }) => {
  useEffect(() => {
    console.log("LeadForm mounted/initialData:", initialData);
  }, [initialData]);
  const normalizeDateForInput = (val) => {
    if (!val) return "";
    // If already in YYYY-MM-DD form, return as-is
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
    name: "",
    email: "",
    phone: "",
    whatsAppNo: "",
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
  const [apiError, setApiError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      whatsAppNo: "",
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
    });
  }, [initialData]);

  // Local input for adding places (supports Add button and comma-separated paste)
  const [placeInput, setPlaceInput] = useState("");

  useEffect(() => {
    // reset small place input when initial data changes
    setPlaceInput("");
  }, [initialData]);

  // Validation
  const validate = (data) => {
    const newErrors = {};
    if (!data.phone || data.phone.trim() === "") newErrors.phone = "Phone is required";
    return newErrors;
  };

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Child ages handlers
  const handleChildAgeChange = (index, value) => {
    const ages = [...formData.childAges];
    ages[index] = value;
    setFormData((prev) => ({ ...prev, childAges: ages }));
  };
  const addChildAge = () => setFormData((prev) => ({ ...prev, childAges: [...prev.childAges, ""] }));
  const removeChildAge = (index) => {
    const ages = [...formData.childAges];
    ages.splice(index, 1);
    setFormData((prev) => ({ ...prev, childAges: ages }));
  };

  // Places to cover handlers
  const handleAddPlace = (e) => {
    if (e && e.type === "keydown" && e.key !== "Enter") return;
    if (e && e.preventDefault) e.preventDefault();

    const inputVal = (placeInput || "").trim();
    if (!inputVal) return;

    // allow comma-separated multiple places
    const parts = inputVal.split(",").map(p => p.trim()).filter(Boolean);
    if (parts.length === 0) return;

    setFormData((prev) => {
      const current = prev.placesToCoverArray || [];
      const merged = [...current];
      parts.forEach(p => { if (!merged.includes(p)) merged.push(p); });
      return { ...prev, placesToCoverArray: merged };
    });
    setPlaceInput("");
  };
  const removePlace = (index) => {
    const updatedPlaces = [...(formData.placesToCoverArray || [])];
    updatedPlaces.splice(index, 1);
    setFormData((prev) => ({ ...prev, placesToCoverArray: updatedPlaces }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      ...formData,
      placesToCover: (formData.placesToCoverArray || []).join(", "),
    };

    // Normalize date to ISO if user supplied a YYYY-MM-DD (input[type=date])
    if (payload.expectedTravelDate && /^\d{4}-\d{2}-\d{2}$/.test(payload.expectedTravelDate)) {
      try {
        const iso = new Date(payload.expectedTravelDate);
        if (!isNaN(iso.getTime())) payload.expectedTravelDate = iso.toISOString();
      } catch (err) {
        // ignore conversion error, send as-is
      }
    }

    setIsSubmitting(true);
    setApiError("");
    try {
      await onSubmit(payload);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setApiError(err.message || "Failed to save lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField name="name" value={formData.name} onChange={handleChange} />
        <InputField name="email" type="email" value={formData.email} onChange={handleChange} />
        <InputField name="phone" value={formData.phone} onChange={handleChange} required error={errors.phone} disabled={isEditing} />
        <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
        <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} />
        <DestinationSearchBox
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Search destination..."
          error={errors.destination}
        />
        <InputField name="expectedTravelDate" type="date" value={formData.expectedTravelDate} onChange={handleChange} />
        <SelectField name="noOfDays" options={tripDurations} value={formData.noOfDays} onChange={handleChange} />
        {formData.noOfDays === "Others" && (
          <InputField name="customNoOfDays" placeholder="Enter custom duration" value={formData.customNoOfDays || ""} onChange={handleChange} />
        )}

        {/* Multi-place input */}
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

        {/* Child Ages */}
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
          {isSubmitting ? "Saving..." : "Save Lead"}
        </button>
        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
      {apiError && <p className="text-red-600 mt-2">{apiError}</p>}
      {submitSuccess && <p className="text-green-600 mt-2">Lead saved successfully!</p>}
    </form>
  );
};

// 🧩 Main EmployeeLeads Component
const EmployeeLeads = () => {
  const [leads, setLeads] = useState([]);
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [destinationAssignedLeads, setDestinationAssignedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedLoading, setAssignedLoading] = useState(false);
  const [destAssignedLoading, setDestAssignedLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewLead, setViewLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [editAssignedLead, setEditAssignedLead] = useState(null);
  const [editDestAssignedLead, setEditDestAssignedLead] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my-leads");
  const [transferLeads, setTransferLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const selectAllRef = useRef(null);
  const [allEmployees, setAllEmployees] = useState([]); // 🆕 For superadmin employee dropdown
  const [employeesLoading, setEmployeesLoading] = useState(false); // 🆕
  const [specialLeads, setSpecialLeads] = useState([]); // 🆕 For special leads assigned by superadmin
  const [specialLeadsLoading, setSpecialLeadsLoading] = useState(false); // 🆕

  const [selectedLead, setSelectedLead] = useState(null);
  const [leadSource, setLeadSource] = useState(null); // "transfer" or "b2b-transfer"
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});


  const role = localStorage.getItem("role");

  // UI state: search and filter for My Leads
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [statusSavingId, setStatusSavingId] = useState(null); // Track which lead is saving status
  const [subNavFilter, setSubNavFilter] = useState("all"); // Sub-navbar filter: "all", "follow-up", "interested", etc.
  const [messageModal, setMessageModal] = useState({ isOpen: false, lead: null }); // Track message modal state
  const [messageText, setMessageText] = useState(""); // Message text content
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, lead: null }); // Track details modal state
  const [pendingStatus, setPendingStatus] = useState(null); // { leadId, newStatus } when message required before saving
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
  const [viewingPdfUrl, setViewingPdfUrl] = useState(null); // State for PDF viewer modal
  const [assignEmployeeModal, setAssignEmployeeModal] = useState({ isOpen: false, lead: null }); // 🆕 Modal for assigning to employee
  const [selectedEmployeeForAssign, setSelectedEmployeeForAssign] = useState(""); // 🆕

  // Messages UI state for viewing message history
  const [messages, setMessages] = useState([]);
  const [messagesPage, setMessagesPage] = useState(1);
  const [messagesLimit] = useState(10);
  const [messagesHasMore, setMessagesHasMore] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const employeeId = localStorage.getItem("userId");
  const companyId = localStorage.getItem("companyId");
  const userRole = localStorage.getItem("role");

  // 🆕 Fetch all employees (for superadmin only)
  const fetchAllEmployees = async () => {
    setEmployeesLoading(true);
    try {
      const res = await fetch("http://localhost:4000/employee/allEmployee");
      if (res.ok) {
        const data = await res.json();
        // Use data.employees like AssignLead does
        const empList = data.employees || data.data || [];
        setAllEmployees(empList);
        console.log("📥 Fetched all employees:", empList);
      } else {
        console.error("Failed to fetch employees:", res.status);
        setAllEmployees([]);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setAllEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  };
  useEffect(() => {
    if (editModalOpen && selectedLead) {
      setEditForm({
        // Company/Contact info (supports both Transfer Leads and B2B Operation Leads)
        name: selectedLead.name || selectedLead.companyName || "",
        companyName: selectedLead.companyName || selectedLead.name || "",
        email: selectedLead.email || selectedLead.companyEmail || "",
        companyEmail: selectedLead.companyEmail || selectedLead.email || "",
        phone: selectedLead.phone || selectedLead.companyPhone || "",
        companyPhone: selectedLead.companyPhone || selectedLead.phone || "",
        whatsAppNo: selectedLead.whatsAppNo || selectedLead.companyWhatsApp || "",
        companyWhatsApp: selectedLead.companyWhatsApp || selectedLead.whatsAppNo || "",

        // Travel info
        departureCity: selectedLead.departureCity || "",
        destination: selectedLead.destination || "",
        expectedTravelDate: selectedLead.expectedTravelDate ? new Date(selectedLead.expectedTravelDate).toISOString().slice(0, 10) : "",

        // Passenger info
        noOfPerson: selectedLead.noOfPerson || "",
        noOfChild: selectedLead.noOfChild || "",
        placesToCoverArray: selectedLead.placesToCover ? selectedLead.placesToCover.split(",").map(p => p.trim()) : (selectedLead.placesToCoverArray || []),
        childAges: selectedLead.childAges || [],

        // Lead info
        notes: selectedLead.notes || "",
        noOfDays: selectedLead.noOfDays || selectedLead.customNoOfDays || "",
        groupNumber: selectedLead.groupNumber || selectedLead.groupNo || "",
        groupNo: selectedLead.groupNo || selectedLead.groupNumber || "",
        leadStatus: selectedLead.leadStatus || "",
        leadSource: selectedLead.leadSource || "",
        leadType: selectedLead.leadType || "",
        tripType: selectedLead.tripType || "",
      });
    }
  }, [editModalOpen, selectedLead]);
  // Fetch employee's own leads
  const fetchLeads = async () => {
    setLoading(true);
    setError("");

    const userRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (userRole && userRole.toLowerCase() === "superadmin") {
      // Superadmin fetches from superadminmylead
      try {
        const res = await fetch(`http://localhost:4000/superadminmylead/${userId}`);
        if (!res.ok) throw new Error(`Server Error: ${res.status}`);
        const data = await res.json();
        console.log("📥 Superadmin leads from API:", data.data);
        setLeads((data.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        setError(err.message || "Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    } else {
      // Regular employee logic
      if (!employeeId) {
        setError("Employee ID not found");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:4000/employeelead/employee/${employeeId}`);
        if (!res.ok) throw new Error(`Server Error: ${res.status}`);
        const data = await res.json();
        console.log("📥 All leads from API:", data.leads);
        // Show leads that are: (1) created by this employee OR (2) routed to them AND they've taken action
        const ownLeads = (data.leads || []).filter((lead) => {
          const shouldInclude = !lead.routedFromEmployee || (lead.routedFromEmployee && lead.isActioned);
          console.log(`Lead: ${lead.name}, routedFromEmployee: ${lead.routedFromEmployee}, isActioned: ${lead.isActioned}, shouldInclude: ${shouldInclude}`);
          return shouldInclude;
        });
        console.log("📊 Filtered own leads:", ownLeads);
        setLeads(ownLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        setError(err.message || "Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch assigned leads for this employee
  const fetchAssignedLeads = async () => {
    if (!employeeId) return;
    setAssignedLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/assignlead/${employeeId}`);
      const data = await res.json();
      if (res.ok) {
        setAssignedLeads(data.data || []);
        setCurrentPage(1);
      } else {
        console.error("Failed to fetch assigned leads:", data.message);
        setAssignedLeads([]);
      }
    } catch (err) {
      console.error("Error fetching assigned leads:", err);
      setAssignedLeads([]);
    } finally {
      setAssignedLoading(false);
    }
  };

  // Fetch leads assigned by destination (leads routed to this employee)
  const fetchDestinationAssignedLeads = async () => {
    if (!employeeId) return;
    setDestAssignedLoading(true);
    try {
      const leads = await fetchLeadsAssignedByDestination(employeeId);
      // Show only leads that were routed from another employee AND have NOT been actioned yet
      const routedLeads = leads.filter((lead) =>
        lead.routedFromEmployee &&
        lead.routedFromEmployee !== employeeId &&
        !lead.isActioned
      );
      setDestinationAssignedLeads(routedLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Error fetching destination-assigned leads:", err);
      setDestinationAssignedLeads([]);
    } finally {
      setDestAssignedLoading(false);
    }
  };

  // Fetch transfer-to-operation leads for current employee
  const fetchTransferLeads = async () => {
    if (!employeeId) return;
    try {
      let endpoint = ""
      if (userRole && userRole.toLowerCase() === "superadmin") {
        endpoint = `http://localhost:4000/superadminmylead/transfer/admin`;
      }
      else {
        endpoint = `http://localhost:4000/employeelead/transfer/employee/${employeeId}`;
      }
      const res = await fetch(endpoint);
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setTransferLeads(data.data || []);
      } else {
        console.error("Failed to fetch transfer leads:", data.message);
        setTransferLeads([]);
      }
    } catch (err) {
      console.error("Error fetching transfer leads:", err);
      setTransferLeads([]);
    }
  };

  // 🆕 Fetch special leads - ALL for superadmin, assigned only for employees
  const fetchSpecialLeads = async () => {
    const userRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    setSpecialLeadsLoading(true);
    try {
      let endpoint;
      if (userRole && userRole.toLowerCase() === 'superadmin') {
        // Superadmin sees ALL special leads
        endpoint = `http://localhost:4000/superadminmylead/${userId}`;
      } else {
        // Employees see only leads assigned to them
        if (!employeeId) return;
        endpoint = `http://localhost:4000/superadminmylead/assigned-to/${employeeId}`;
      }

      const res = await fetch(endpoint);
      const data = await res.json();
      if (res.ok) {
        setSpecialLeads(data.data || []);
        console.log(specialLeads);

      } else {
        console.error("Failed to fetch special leads:", data.message);
        setSpecialLeads([]);
      }
    } catch (err) {
      console.error("Error fetching special leads:", err);
      setSpecialLeads([]);
    } finally {
      setSpecialLeadsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    // 🆕 Fetch all employees for superadmin
    if (userRole && userRole.toLowerCase() === "superadmin") {
      fetchAllEmployees();
    }
  }, []);

  // Refetch leads when "my-leads" tab is activated
  useEffect(() => {
    if (activeTab === "my-leads") {
      console.log("📱 'My Leads' tab activated, refetching...");
      fetchLeads();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "assigned") {
      fetchAssignedLeads();
    } else if (activeTab === "destination-assigned") {
      fetchDestinationAssignedLeads();
    } else if (activeTab === "transfer") {
      fetchTransferLeads();
    } else if (activeTab === "special-lead") {
      // Handle special lead tab activation
      console.log("📱 'Special Lead' tab activated");
      fetchSpecialLeads();
    }
  }, [activeTab]);

  // Adjust page if length changes
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((assignedLeads && assignedLeads.length) / pageSize));
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [assignedLeads, currentPage]);

  // Filter assigned leads to exclude those with phone numbers already in My Leads
  const filteredAssignedLeads = (assignedLeads || []).filter((assignedLead) => {
    const assignedPhone = assignedLead.phone;
    return !leads.some((myLead) => myLead.phone === assignedPhone);
  });

  // Compute visible assigned leads
  const visibleAssignedLeads = (filteredAssignedLeads || []).slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Filtered leads for the My Leads tab (search by name, destination, phone and filter by interest status)
  const filteredLeads = (leads || []).filter((l) => {
    const q = (searchQuery || "").toString().trim().toLowerCase();
    const matchesSearch = !q || (
      (l.name || "").toString().toLowerCase().includes(q) ||
      (l.destination || "").toString().toLowerCase().includes(q) ||
      (l.phone || "").toString().toLowerCase().includes(q)
    );
    const matchesFilter = !statusFilter || ((l.leadInterestStatus || "").toString() === statusFilter);

    // Apply sub-navbar filter
    let matchesSubNav = true;
    if (subNavFilter === "follow-up") {
      matchesSubNav = (l.leadInterestStatus || "").toString() === "Follow Up";
    } else if (subNavFilter === "interested") {
      matchesSubNav = (l.leadInterestStatus || "").toString() === "Interested";
    } else if (subNavFilter === "connected") {
      matchesSubNav = (l.leadInterestStatus || "").toString() === "Connected";
    } else if (subNavFilter === "not-interested") {
      matchesSubNav = (l.leadInterestStatus || "").toString() === "Not Interested";
    } else if (subNavFilter === "not-connected") {
      matchesSubNav = (l.leadInterestStatus || "").toString() === "Not Connected";
    }
    // "all" matches everything

    return matchesSearch && matchesFilter && matchesSubNav;
  });

  // Select-all handler
  const handleSelectAllVisible = () => {
    const ids = visibleAssignedLeads.map((l) => String(l._id));
    if (ids.length === 0) return;
    // Could implement selection logic here if needed
  };

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = false;
    }
  }, [visibleAssignedLeads]);

  const handleView = (lead) => {
    setViewLead(lead);
    // load first page of messages for this lead
    fetchMessages(lead._id, 1);
  };

  // Robust PDF open/download helper (mirrors CreateCustomer behavior)
  const handleOpenPdf = async (url) => {
    if (!url) {
      alert('PDF URL not available');
      return;
    }

    try {
      console.log('Attempting to fetch PDF for inline view:', url);
      const res = await fetch(url);
      if (!res.ok) {
        console.warn('Fetch PDF failed, status:', res.status);
        window.open(url, '_blank');
        return;
      }

      const blob = await res.blob();
      if (blob.size > 0) {
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        // revoke after a while
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60 * 1000);
        return;
      }

      console.warn('Fetched blob empty, opening original URL');
      window.open(url, '_blank');
    } catch (error) {
      console.error('Fetch failed, trying XMLHttpRequest fallback:', error);

      try {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';

        xhr.onload = () => {
          if (xhr.status === 200) {
            const blob = xhr.response;
            if (blob.size > 0) {
              const blobUrl = window.URL.createObjectURL(blob);
              window.open(blobUrl, '_blank');
              setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60 * 1000);
              return;
            } else {
              console.error('Downloaded file is empty');
              window.open(url, '_blank');
            }
          } else {
            console.error('XMLHttpRequest failed with status:', xhr.status);
            window.open(url, '_blank');
          }
        };

        xhr.onerror = () => {
          console.error('XMLHttpRequest error');
          window.open(url, '_blank');
        };

        xhr.open('GET', url);
        xhr.send();
      } catch (xhrError) {
        console.error('XMLHttpRequest also failed, opening original URL:', xhrError);
        window.open(url, '_blank');
      }
    }
  };
  const handleEdit = (lead) => setEditLead(lead);
  const handleEditAssigned = (lead) => setEditAssignedLead(lead);

  const handleAddMessage = (lead) => {
    setMessageModal({ isOpen: true, lead });
    setMessageText("");
  };

  const handleAddDetails = async (lead) => {
    // Determine if this is a special lead or regular lead
    const isSpecialLead = specialLeads.some(specialLead => specialLead._id === lead._id);
    const endpoint = isSpecialLead || role === "superAdmin" ? `http://localhost:4000/superadminmylead/lead/${lead._id}` : `http://localhost:4000/employeelead/${lead._id}`;
    console.log(isSpecialLead);
    console.log(endpoint);

    try {
      // Fetch full lead details to get pre-stored data
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`Failed to fetch lead: ${res.status}`);
      }
      const data = await res.json();
      console.log("Fetched data:", data);

      const fullLead = data.data || lead;

      console.log("Fetched lead details:", fullLead);
      console.log("Itinerary:", fullLead.itinerary);

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
    } catch (err) {
      console.error("Error fetching lead details:", err);
      // Fallback to just opening modal with current lead
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
    // Skip if no status selected
    console.log(role);

    if (!newStatus) return;

    // Determine if this is a special lead (from specialLeads array) or regular lead
    const isSpecialLead = specialLeads.some(lead => lead._id === leadId);
    const lead = isSpecialLead ? specialLeads.find(l => l._id === leadId) : leads.find((l) => l._id === leadId);

    // If selecting Follow Up, require message first: open message modal and store pending status
    if (newStatus === "Follow Up") {
      setPendingStatus({ leadId, newStatus, isSpecialLead });
      setMessageModal({ isOpen: true, lead });
      setMessageText("");
      return;
    }

    // For other statuses, save immediately
    setStatusSavingId(leadId);
    try {

      const endpoint = isSpecialLead || role === "superAdmin" ? `http://localhost:4000/superadminmylead/${leadId}` : `http://localhost:4000/employeelead/${leadId}`;
      // const endpoint =`http://localhost:4000/employeelead/${leadId}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadInterestStatus: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      if (isSpecialLead) {
        setSpecialLeads((prev) => prev.map((lead) => (lead._id === leadId ? { ...lead, leadInterestStatus: newStatus } : lead)));
      } else {
        setLeads((prev) => prev.map((lead) => (lead._id === leadId ? { ...lead, leadInterestStatus: newStatus } : lead)));
      }
      console.log(`✅ Lead status updated to: ${newStatus}`);
    } catch (err) {
      console.error("Error updating lead status:", err);
      alert("Failed to update lead status: " + err.message);
    } finally {
      setStatusSavingId(null);
    }
  };

  const handleSendMessage = async (leadId) => {
    if (!messageText.trim()) {
      alert("Please enter a message");
      return;
    }

    // Determine if this is a special lead or regular lead
    const isSpecialLead = specialLeads.some(lead => lead._id === leadId);
    console.log(isSpecialLead);

    // const endpoint = isSpecialLead ? `http://localhost:4000/superadminmylead/${leadId}/message` : `http://localhost:4000/employeelead/${leadId}/message`;
    const endpoint = `http://localhost:4000/employeelead/${leadId}/message`;
    console.log(endpoint);

    try {
      // Save message to backend (assuming there's a message endpoint)
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          sender: employeeId,
          sentAt: new Date().toISOString()
        }),
      });
      console.log("Response:", res);

      if (!res.ok) {
        throw new Error("Failed to save message");
      }

      const resJson = await res.json();
      const updatedLeadFromServer = resJson && (resJson.data || resJson);

      console.log("✅ Message saved successfully", updatedLeadFromServer);
      alert("Message saved successfully!");

      // Update local state with returned lead (contains messages array)
      if (updatedLeadFromServer && updatedLeadFromServer._id) {
        if (isSpecialLead) {
          setSpecialLeads((prev) => prev.map((l) => (l._id === updatedLeadFromServer._id ? updatedLeadFromServer : l)));
        } else {
          setLeads((prev) => prev.map((l) => (l._id === updatedLeadFromServer._id ? updatedLeadFromServer : l)));
        }
      }

      // Refresh messages in view (first page)
      fetchMessages(leadId, 1);
      // If there is a pending status (like Follow Up), save it now
      if (pendingStatus && pendingStatus.leadId === leadId) {
        setStatusSavingId(leadId);
        try {
          const statusEndpoint = isSpecialLead || role === "superAdmin" ? `http://localhost:4000/superadminmylead/${leadId}` : `http://localhost:4000/employeelead/${leadId}`;
          // const statusEndpoint = `http://localhost:4000/superadminmylead/${leadId}` 
          const r2 = await fetch(statusEndpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leadInterestStatus: pendingStatus.newStatus }),
          });
          if (!r2.ok) throw new Error("Failed to update pending status");

          if (isSpecialLead) {
            setSpecialLeads((prev) => prev.map((lead) => (lead._id === leadId ? { ...lead, leadInterestStatus: pendingStatus.newStatus } : lead)));
          } else {
            setLeads((prev) => prev.map((lead) => (lead._id === leadId ? { ...lead, leadInterestStatus: pendingStatus.newStatus } : lead)));
          }
          console.log(`✅ Pending status ${pendingStatus.newStatus} saved for lead ${leadId}`);
        } catch (err) {
          console.error("Error saving pending status:", err);
          alert("Message saved but failed to update status");
        } finally {
          setStatusSavingId(null);
          setPendingStatus(null);
        }
      }
      closeModal();
    } catch (err) {
      console.error("Error saving message:", err);
      // If endpoint doesn't exist yet, just show success for now
      // console.log("Message would be saved:", messageText);
      alert("Message is not sent and saved!");
      // try to save pending status even if message endpoint missing
      if (pendingStatus && pendingStatus.leadId === leadId) {
        try {
          const statusEndpoint = isSpecialLead ? `http://localhost:4000/superadminmylead/${leadId}` : `http://localhost:4000/employeelead/${leadId}`;
          const r2 = await fetch(statusEndpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leadInterestStatus: pendingStatus.newStatus }),
          });
          if (r2.ok) {
            if (isSpecialLead) {
              setSpecialLeads((prev) => prev.map((lead) => (lead._id === leadId ? { ...lead, leadInterestStatus: pendingStatus.newStatus } : lead)));
            } else {
              setLeads((prev) => prev.map((lead) => (lead._id === leadId ? { ...lead, leadInterestStatus: pendingStatus.newStatus } : lead)));
            }
            setPendingStatus(null);
          }
        } catch (err2) {
          console.error("Failed to save pending status after message error:", err2);
        }
      }
      closeModal();
    }
  };

  // Fetch paginated messages for a lead (latest first). If append=true, append to existing list.
  const fetchMessages = async (leadId, page = 1, append = false) => {
    if (!leadId) return;
    setMessagesLoading(true);
    try {
      const endpoint = ``;
      // const res = await fetch(`http://localhost:4000/employeelead/${leadId}/messages?page=${page}&limit=${messagesLimit}`);
      const res = await fetch(`http://localhost:4000/superadminmylead/${leadId}/messages?page=${page}&limit=${messagesLimit}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const json = await res.json();
      const fetched = json.data || [];
      if (append) {
        setMessages((prev) => [...prev, ...fetched]);
      } else {
        setMessages(fetched);
      }
      setMessagesPage(page);
      const total = json.total || 0;
      setMessagesHasMore(page * messagesLimit < total);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const loadMoreMessages = () => {
    if (!viewLead) return;
    const next = messagesPage + 1;
    fetchMessages(viewLead._id, next, true);
  };

  const handleEditDestAssigned = async (lead) => {
    console.log("handleEditDestAssigned called with lead:", lead);
    // Mark lead as actioned when employee takes action on routed lead
    try {
      await fetch(`http://localhost:4000/employeelead/action/${lead._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      console.log("✅ Lead marked as actioned");
    } catch (err) {
      console.error("Error marking lead as actioned:", err);
    }
    setEditDestAssignedLead(lead);
  };

  const closeModal = () => {
    setViewLead(null);
    setEditLead(null);
    setEditAssignedLead(null);
    setEditDestAssignedLead(null);
    setIsAddModalOpen(false);
    setMessageModal({ isOpen: false, lead: null });
    setMessageText("");
    setDetailsModal({ isOpen: false, lead: null });
    setAssignEmployeeModal({ isOpen: false, lead: null }); // 🆕 Close assign modal
    setDetailsForm({
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
    setPendingStatus(null);
    setSelectedEmployeeForAssign(""); // 🆕
    // reset messages view
    setMessages([]);
    setMessagesPage(1);
    setMessagesHasMore(false);
    setMessagesLoading(false);
  };

  // 🆕 Handle assigning lead to employee (superadmin only)
  const handleAssignToEmployee = async () => {
    if (!selectedEmployeeForAssign || !assignEmployeeModal.lead) {
      alert("Please select an employee");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/superadminmylead/assign/${assignEmployeeModal.lead._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: selectedEmployeeForAssign }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to assign lead");
      }

      // Update local state immediately for better UX
      setLeads(prevLeads =>
        prevLeads.map(l =>
          l._id === assignEmployeeModal.lead._id
            ? { ...l, assignedEmployee: selectedEmployeeForAssign }
            : l
        )
      );

      alert("Lead assigned successfully to employee!");
      await fetchLeads(); // Refresh the list to ensure consistency
      closeModal();
    } catch (err) {
      console.error("Error assigning lead:", err);
      alert("Failed to assign lead: " + err.message);
    }
  };

  // Save assigned lead as my lead and remove from assigned
  const handleSaveAssignedLead = async (data) => {
    if (!employeeId) throw new Error("Employee ID missing, please login again");
    const assignedLeadId = data.assignmentId; // Use assignmentId from backend response

    console.log("💾 Saving assigned lead with assignmentId:", assignedLeadId);

    // 1. Check for destination-based routing
    const leadData = { ...data };
    delete leadData._id; // Remove _id so a new one is created

    const routingResult = await handleDestinationBasedRouting(leadData, employeeId);

    if (!routingResult.routed) {
      // Not routed, add to My Leads
      console.log("➡️ Lead not routed, adding to My Leads");
      const payload = { ...leadData, employee: employeeId, employeeId };
      const res = await fetch("http://localhost:4000/employeelead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create lead");
      }
    } else {
      // Lead was routed to another employee
      console.log("✅ Lead routed to:", routingResult.targetEmployeeName);
    }

    // 2. Remove from assigned leads (happens whether routed or not)
    console.log("🗑️ Deleting from assigned leads:", assignedLeadId);
    try {
      const deleteRes = await fetch(`http://localhost:4000/assignlead/${assignedLeadId}`, {
        method: "DELETE",
      });
      if (!deleteRes.ok) {
        console.error("❌ Failed to delete from assigned leads:", deleteRes.status, deleteRes.statusText);
        throw new Error("Failed to remove from assigned leads");
      } else {
        console.log("✅ Successfully deleted from assigned leads");
      }
    } catch (err) {
      console.error("❌ Error removing from assigned leads:", err);
      throw err;
    }

    // 3. Immediately update state to remove from assigned leads list
    console.log("📋 Updating state to remove lead from display");
    setAssignedLeads((prev) => {
      const updated = prev.filter((lead) => lead.assignmentId !== assignedLeadId);
      console.log("Assigned leads count - Before:", prev.length, "After:", updated.length);
      return updated;
    });

    // 4. Reset pagination
    setCurrentPage(1);

    // 5. Refresh My Leads and Destination-Assigned tabs (assignedLeads already updated above)
    console.log("🔄 Refreshing data");
    await Promise.all([fetchLeads(), fetchDestinationAssignedLeads()]);

    // 6. Close modal
    setEditAssignedLead(null);

    console.log("✅ Transfer complete");
  };

  const handleAddLead = async (data) => {
    const userRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (userRole && userRole.toLowerCase() === "superadmin") {
      // Superadmin saves to superadminmylead
      const payload = { ...data };
      const res = await fetch(`http://localhost:4000/superadminmylead/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create lead");
      }
    } else {
      // Regular employee logic
      if (!employeeId) throw new Error("Employee ID missing, please login again");
      if(!companyId) throw new Error("Company ID missing, please login again");

      // Check for destination-based routing
      const routingResult = await handleDestinationBasedRouting(data, employeeId);

      if (routingResult.routed) {
        // Lead was routed to another employee
        console.log("Lead routed:", routingResult.message);
        // No need to add to current employee's leads
      } else {
        // Save to current employee
        const payload = { ...data, employee: employeeId, employeeId ,companyId};
        const res = await fetch("http://localhost:4000/employeelead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to create lead");
        }
      }
    }

    await fetchLeads();
  };

  const handleUpdateLead = async (data) => {
    if (!editLead) return;

    const userRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    // Check if this is a special lead (from specialLeads array)
    const isSpecialLead = specialLeads.some(lead => lead._id === editLead._id);

    if (isSpecialLead) {
      // Special leads are always in superadminmylead collection
      const res = await fetch(`http://localhost:4000/superadminmylead/${editLead._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update lead");
      }
      // Update specialLeads state
      setSpecialLeads((prev) => prev.map((lead) => (lead._id === editLead._id ? { ...lead, ...data } : lead)));
    } else if (userRole && userRole.toLowerCase() === "superadmin") {
      // Superadmin updating regular leads
      const res = await fetch(`http://localhost:4000/superadminmylead/${editLead._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update lead");
      }
    } else {
      // Regular employee logic for regular leads
      // Check for destination-based routing
      const routingResult = await handleDestinationBasedRouting(data, employeeId, editLead._id);

      if (routingResult.routed) {
        // Lead was routed to another employee
        console.log("Lead routed:", routingResult.message);
        // Remove from current employee's list (the routing function already updated it)
        setLeads((prev) => prev.filter((lead) => lead._id !== editLead._id));
      } else {
        // Update current employee's lead
        const payload = { ...data, employee: employeeId, employeeId };
        const res = await fetch(`http://localhost:4000/employeelead/${editLead._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to update lead");
        }
      }
    }

    await fetchLeads();
    // refresh assigned leads as well in case edited data appears there
    await fetchAssignedLeads();
    // refresh special leads if we updated one
    if (isSpecialLead) {
      await fetchSpecialLeads();
    }
    setEditLead(null);
  };

  const handleUpdateDestAssignedLead = async (data) => {
    if (!editDestAssignedLead) return;

    try {
      // Check if destination has changed
      const destinationChanged = editDestAssignedLead.destination !== data.destination;
      console.log("🔍 Checking lead update...");
      console.log("Old destination:", editDestAssignedLead.destination);
      console.log("New destination:", data.destination);
      console.log("Destination changed?:", destinationChanged);

      if (destinationChanged && data.destination) {
        // DESTINATION HAS CHANGED → Check for transfer
        console.log("🔄 Destination changed, checking for routing...");

        // Find employee assigned to the new destination
        const targetEmployee = await findEmployeeByDestination(data.destination, employeeId);

        if (targetEmployee && targetEmployee._id !== employeeId) {
          // New destination assigned to DIFFERENT employee → TRANSFER lead
          console.log("✅ Different employee assigned, transferring to:", targetEmployee.fullName);

          const payload = {
            ...data,
            employee: targetEmployee._id,
            routedFromEmployee: editDestAssignedLead.routedFromEmployee || employeeId,
            isActioned: false,
          };

          const res = await fetch(`http://localhost:4000/employeelead/${editDestAssignedLead._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to transfer lead");
          }

          console.log("✅ Lead transferred successfully");

          // Remove from destination-assigned list
          setDestinationAssignedLeads((prev) =>
            prev.filter((lead) => lead._id !== editDestAssignedLead._id)
          );
          setEditDestAssignedLead(null);
          return;
        } else if (targetEmployee && targetEmployee._id === employeeId) {
          // New destination assigned to SAME employee → MOVE to "My Leads"
          console.log("✅ Same employee assigned to destination, moving to My Leads");

          const payload = {
            ...data,
            employee: employeeId,
            routedFromEmployee: null, // Clear routing since it's now personal lead
            isActioned: false,
          };

          const res = await fetch(`http://localhost:4000/employeelead/${editDestAssignedLead._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to update lead");
          }

          console.log("✅ Lead moved to My Leads");

          // Remove from destination-assigned list
          setDestinationAssignedLeads((prev) =>
            prev.filter((lead) => lead._id !== editDestAssignedLead._id)
          );

          // Refetch "My Leads" to show the newly moved lead
          await fetchLeads();
          setEditDestAssignedLead(null);
          return;
        } else {
          // NO employee assigned to this destination → show error
          console.warn("⚠️ No employee assigned to destination:", data.destination);
          alert(`No employee is assigned to the destination "${data.destination}". Please select a destination with an assigned employee.`);
          return;
        }
      } else {
        // DESTINATION NOT CHANGED → Move to "My Leads" (convert from routed to personal lead)
        console.log("📝 No destination change, moving to My Leads...");

        const payload = {
          ...data,
          employee: employeeId,
          routedFromEmployee: null, // Clear routing metadata
          isActioned: false,
        };

        const res = await fetch(`http://localhost:4000/employeelead/${editDestAssignedLead._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to update lead");
        }

        console.log("✅ Lead moved to My Leads");

        // Remove from destination-assigned list
        setDestinationAssignedLeads((prev) =>
          prev.filter((lead) => lead._id !== editDestAssignedLead._id)
        );

        // Refetch "My Leads" to show the newly moved lead
        await fetchLeads();
        setEditDestAssignedLead(null);
      }
    } catch (err) {
      console.error("Error updating destination-assigned lead:", err);
      throw err;
    }
  };

  // Confirm transfer of a lead from My Leads to "Transfer to Operation"
  const handleSpecialConfirmTransfer = async (lead) => {
    if (!lead || !lead._id) return;
    if (!window.confirm(`Confirm transfer of lead "${lead.name || lead.phone}" to Transfer to Operation?`)) return;

    try {
      // Call backend transfer endpoint which moves the document into Operation collection
      const res = await fetch(`http://localhost:4000/superadminmylead/transfer/${lead._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert("Failed to transfer lead: " + (data.message || res.statusText));
        return;
      }

      // Update local state: remove from My Leads, add to Transfer list (use returned op document)
      setLeads((prev) => prev.filter((l) => l._id !== lead._id));
      setTransferLeads((prev) => [data.data, ...(prev || [])]);
      alert("Lead transferred to Transfer to Operation.");
    } catch (err) {
      console.error("Error transferring lead:", err);
      alert("Error transferring lead. Check console for details.");
    }
  };


  const handleConfirmTransfer = async (lead) => {
    if (!lead || !lead._id) return;
    if (!window.confirm(`Confirm transfer of lead "${lead.name || lead.phone}" to Transfer to Operation?`)) return;
    console.log(lead);

    try {
      // Call backend transfer endpoint which moves the document into Operation collection
      let endpoint = ""
      if (userRole && userRole.toLowerCase() === "superadmin") {
        endpoint = `http://localhost:4000/superadminmylead/transfer/${lead._id}`
      } else {
        endpoint = `http://localhost:4000/employeelead/transfer/${lead._id}`
      }
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: userRole && userRole.toLowerCase() === "superadmin" ? employeeId : null }), // Pass employeeId for regular employees, null for superadmin
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert("Failed to transfer lead: " + (data.message || res.statusText));
        return;
      }
      console.log(data);

      // Update local state: remove from My Leads, add to Transfer list (use returned op document)
      setLeads((prev) => prev.filter((l) => l._id !== lead._id));
      setTransferLeads((prev) => [data.data, ...(prev || [])]);
      alert("Lead transferred to Transfer to Operation.");
    } catch (err) {
      console.error("Error transferring lead:", err);
      alert("Error transferring lead. Check console for details.");
    }
  };

  const handleViewLead = async (lead) => {
    console.log("handleViewLead - lead.employee:", lead.employee, "type:", typeof lead.employee);
    setSelectedLead(lead);
    setLeadSource(activeTab); // Set source based on current tab

    // Fetch employee details if employee is just an ID
    if (lead.employee && typeof lead.employee === 'string') {
      console.log("Fetching employee details for ID:", lead.employee);
      try {
        const res = await fetch(`http://localhost:4000/employee/${lead.employee}`);
        console.log("Employee fetch response:", res.status);
        if (res.ok) {
          const employeeData = await res.json();
          console.log("Employee data received:", employeeData);
          setSelectedLead((prev) => ({
            ...prev,
            employee: employeeData.data || employeeData,
          }));
        } else {
          console.log("Employee fetch failed, trying alternate endpoint");
          // Try alternate endpoint
          const res2 = await fetch(`http://localhost:4000/employees/${lead.employee}`);
          if (res2.ok) {
            const employeeData = await res2.json();
            console.log("Employee data from alternate endpoint:", employeeData);
            setSelectedLead((prev) => ({
              ...prev,
              employee: employeeData.data || employeeData,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch employee details:", err);
      }
    }

    setViewModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  console.log(specialLeads);


  return (
    <div className="p-4">
      {/* Modern Tab Navigation */}
      {/* <nav className="flex items-center justify-between mb-8">
        <div className="sm:flex-row flex-col flex gap-3 sm:bg-white/80 backdrop-blur-lg sm:rounded-full px-3 py-2 shadow-lg border border-gray-200">
          <div className="flex py-2 gap-3">
            <button
              onClick={() => setActiveTab('my-leads')}
              className={`relative sm:px-6 py-2 rounded-full text-base font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeTab === 'my-leads' ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              MY LEADS
              {activeTab === 'my-leads' && <span className="absolute -bottom-2 left-6 right-6 h-1 bg-blue-500 rounded-full" />}
            </button>
            {(userRole && userRole.toLowerCase() === 'superadmin') || (userRole && userRole.toLowerCase() !== 'superadmin') && (
              <button
                onClick={() => setActiveTab('special-lead')}
                className={`relative sm:px-6 py-2 rounded-full text-base font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeTab === 'special-lead' ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
              >
                SPECIAL LEAD
                {activeTab === 'special-lead' && <span className="absolute -bottom-2 left-6 right-6 h-1 bg-blue-500 rounded-full" />}
              </button>
            )}
            <button
              onClick={() => setActiveTab('assigned')}
              className={`relative sm:px-6 py-2 rounded-full text-base font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeTab === 'assigned' ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              MY ASSIGNED LEAD
              {activeTab === 'assigned' && <span className="absolute -bottom-2 left-6 right-6 h-1 bg-blue-500 rounded-full" />}
            </button>
          </div>
          <div className="flex gap-3 py-2">
            <button
              onClick={() => setActiveTab('destination-assigned')}
              className={`relative sm:px-6 py-2 rounded-full text-base font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeTab === 'destination-assigned' ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              ASSIGNED BY DESTINATION
              {activeTab === 'destination-assigned' && <span className="absolute -bottom-2 left-6 right-6 h-1 bg-blue-500 rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`relative sm:px-6 py-2 rounded-full text-base font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeTab === 'transfer' ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              TRANSFER TO OPERATION
              {activeTab === 'transfer' && <span className="absolute -bottom-2 left-6 right-6 h-1 bg-blue-500 rounded-full" />}
            </button>
          </div>
        </div>
        <div className="hidden sm:block text-sm text-gray-400">&nbsp;</div>
      </nav> */}

      <nav className="mb-8">
        <div className="flex items-center justify-between">

          {/* SCROLL WRAPPER FOR MOBILE */}
          <div className="w-full overflow-x-auto sm:overflow-visible scrollbar-hide">
            <div
              className="
          flex flex-col sm:flex-row gap-3
          bg-white/80 backdrop-blur-lg
          sm:rounded-full
          px-2 sm:px-3 py-2
          shadow-lg border border-gray-200
          min-w-max
        "
            >
              {/* ROW 1 */}
              <div className="flex gap-2 sm:gap-3 flex-nowrap">
                <button
                  onClick={() => setActiveTab('my-leads')}
                  className={`relative flex-shrink-0 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 shadow-sm focus:ring-2 focus:ring-blue-400
              ${activeTab === 'my-leads'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
            `}
                >
                  MY LEADS
                  {activeTab === 'my-leads' && (
                    <span className="absolute -bottom-2 left-6 right-6 h-1 bg-blue-500 rounded-full hidden sm:block" />
                  )}
                </button>

                {(userRole &&
                  (userRole.toLowerCase() === 'superadmin' ||
                    userRole.toLowerCase() !== 'superadmin')) && (
                    <button
                      onClick={() => setActiveTab('special-lead')}
                      className={`relative flex-shrink-0 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 shadow-sm focus:ring-2 focus:ring-blue-400
                ${activeTab === 'special-lead'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
              `}
                    >
                      SPECIAL LEAD
                      {activeTab === 'special-lead' && (
                        <span className="absolute -bottom-2 left-6 right-6 h-1 bg-blue-500 rounded-full hidden sm:block" />
                      )}
                    </button>
                  )}

                <button
                  onClick={() => setActiveTab('assigned')}
                  className={`relative flex-shrink-0 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 shadow-sm focus:ring-2 focus:ring-blue-400
              ${activeTab === 'assigned'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
            `}
                >
                  MY ASSIGNED LEAD
                  {activeTab === 'assigned' && (
                    <span className="absolute -bottom-2 left-6 right-6 h-1 bg-blue-500 rounded-full hidden sm:block" />
                  )}
                </button>
              </div>

              {/* ROW 2 */}
              <div className="flex gap-2 sm:gap-3 flex-nowrap">
                <button
                  onClick={() => setActiveTab('destination-assigned')}
                  className={`relative flex-shrink-0 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 shadow-sm focus:ring-2 focus:ring-blue-400
              ${activeTab === 'destination-assigned'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
            `}
                >
                  ASSIGNED BY DESTINATION
                  {activeTab === 'destination-assigned' && (
                    <span className="absolute -bottom-2 left-6 right-6 h-1 bg-blue-500 rounded-full hidden sm:block" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('transfer')}
                  className={`relative flex-shrink-0 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 shadow-sm focus:ring-2 focus:ring-blue-400
              ${activeTab === 'transfer'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
            `}
                >
                  TRANSFER TO OPERATION
                  {activeTab === 'transfer' && (
                    <span className="absolute -bottom-2 left-6 right-6 h-1 bg-blue-500 rounded-full hidden sm:block" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="hidden sm:block text-sm text-gray-400">&nbsp;</div>
        </div>
      </nav>


      {/* My Leads Tab */}
      {/* My Lead Cards Section */}
      <MyLeadCard />

      {activeTab === "my-leads" && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div className="flex items-center gap-3 w-full bg-white/80 rounded-full px-4 py-2 shadow border border-gray-200">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, destination or phone"
                className="w-full sm:w-72 px-4 py-2 rounded-full text-base border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-full text-base bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All Status</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Connected">Connected</option>
                <option value="Not Connected">Not Connected</option>
                <option value="Follow Up">Follow Up</option>
              </select>
              <button onClick={() => { setSearchQuery(""); setStatusFilter(""); }} className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all">Clear</button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-6 py-2 rounded-full font-semibold bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md hover:scale-105 transition-all">
                <Plus className="w-5 h-5" /> Add Lead
              </button>
            </div>
          </div>

          {/* Sub-Navbar for Status Filters */}
          {/* <div className="mt-4 flex gap-3 bg-white/80 backdrop-blur-lg rounded-full px-3 py-2 shadow border border-gray-200 w-fit">
            <button
              onClick={() => setSubNavFilter('all')}
              className={`relative px-4 py-1 rounded-full text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${subNavFilter === 'all' ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              All
              {subNavFilter === 'all' && <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full" />}
            </button>
            <button
              onClick={() => setSubNavFilter('follow-up')}
              className={`relative px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${subNavFilter === 'follow-up' ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              Follow Up
              {subNavFilter === 'follow-up' && <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full" />}
            </button>
            <button
              onClick={() => setSubNavFilter('interested')}
              className={`relative px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${subNavFilter === 'interested' ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              Interested
              {subNavFilter === 'interested' && <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full" />}
            </button>
            <button
              onClick={() => setSubNavFilter('connected')}
              className={`relative px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${subNavFilter === 'connected' ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              Connected
              {subNavFilter === 'connected' && <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full" />}
            </button>
            <button
              onClick={() => setSubNavFilter('not-interested')}
              className={`relative px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${subNavFilter === 'not-interested' ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              Not Interested
              {subNavFilter === 'not-interested' && <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full" />}
            </button>
            <button
              onClick={() => setSubNavFilter('not-connected')}
              className={`relative px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${subNavFilter === 'not-connected' ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
            >
              Not Connected
              {subNavFilter === 'not-connected' && <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full" />}
            </button>
          </div> */}

          <div className="mt-4 min-w-full overflow-x-auto scrollbar-hidde">
            <div
              className="
      flex gap-2 sm:gap-3
      bg-white/80 backdrop-blur-lg
      rounded-full
      px-2 sm:px-3 py-2
      shadow border border-gray-200
      w-max
    "
            >
              {/* ALL */}
              <button
                onClick={() => setSubNavFilter('all')}
                className={`relative flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 focus:ring-2 focus:ring-blue-400
        ${subNavFilter === 'all'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
      `}
              >
                All
                {subNavFilter === 'all' && (
                  <span className="absolute -bottom-2 left-4 right-4 h-1 bg-blue-500 rounded-full hidden sm:block" />
                )}
              </button>

              {/* FOLLOW UP */}
              <button
                onClick={() => setSubNavFilter('follow-up')}
                className={`relative flex-shrink-0 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 focus:ring-2 focus:ring-blue-400
        ${subNavFilter === 'follow-up'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
      `}
              >
                Follow Up
                {subNavFilter === 'follow-up' && (
                  <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full hidden sm:block" />
                )}
              </button>

              {/* INTERESTED */}
              <button
                onClick={() => setSubNavFilter('interested')}
                className={`relative flex-shrink-0 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 focus:ring-2 focus:ring-blue-400
        ${subNavFilter === 'interested'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
      `}
              >
                Interested
                {subNavFilter === 'interested' && (
                  <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full hidden sm:block" />
                )}
              </button>

              {/* CONNECTED */}
              <button
                onClick={() => setSubNavFilter('connected')}
                className={`relative flex-shrink-0 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 focus:ring-2 focus:ring-blue-400
        ${subNavFilter === 'connected'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
      `}
              >
                Connected
                {subNavFilter === 'connected' && (
                  <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full hidden sm:block" />
                )}
              </button>

              {/* NOT INTERESTED */}
              <button
                onClick={() => setSubNavFilter('not-interested')}
                className={`relative flex-shrink-0 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 focus:ring-2 focus:ring-blue-400
        ${subNavFilter === 'not-interested'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
      `}
              >
                Not Interested
                {subNavFilter === 'not-interested' && (
                  <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full hidden sm:block" />
                )}
              </button>

              {/* NOT CONNECTED */}
              <button
                onClick={() => setSubNavFilter('not-connected')}
                className={`relative flex-shrink-0 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 focus:ring-2 focus:ring-blue-400
        ${subNavFilter === 'not-connected'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
      `}
              >
                Not Connected
                {subNavFilter === 'not-connected' && (
                  <span className="absolute -bottom-2 left-5 right-5 h-1 bg-blue-500 rounded-full hidden sm:block" />
                )}
              </button>
            </div>
          </div>


          <div className="mt-4 overflow-x-auto w-full">
            {loading ? <p>Loading leads...</p> :
              error || filteredLeads.length === 0 ? <p className="text-gray-600">Please Enter Leads</p> :
                <div className="rounded-3xl shadow-lg border border-gray-200  bg-white/90">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <tr>
                        {/* <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th> */}
                        <th className="px-6 py-3 text-left whitespace-nowrap text-xs font-bold text-gray-700 uppercase tracking-wider">Contact Information</th>
                        <th className="px-6 py-3 text-left whitespace-nowrap text-xs font-bold text-gray-700 uppercase tracking-wider">Departure</th>
                        <th className="px-6 py-3 text-left whitespace-nowrap text-xs font-bold text-gray-700 uppercase tracking-wider">Destination</th>
                        <th className="px-6 py-3 text-left whitespace-nowrap text-xs font-bold text-gray-700 uppercase tracking-wider">Travel Date</th>
                        <th className="px-6 py-3 text-center whitespace-nowrap text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                        {/* <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Assign to</th> */}
                        {userRole && (userRole.toLowerCase() === "superadmin" || userRole.toLowerCase() === "admin") && (<th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Assign to</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-blue-50 transition-colors group">
                          {/* <td className="px-6 py-3 border-b border-gray-100 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-6 py-3 border-b border-gray-100 text-gray-700">{lead.email}</td> */}
                          <td className="px-6 py-3 border-b border-gray-100 text-gray-700">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-slate-900 text-base leading-tight">{lead.name || "—"}</span>
                              <span className="text-sm text-slate-600">{lead.email || "—"}</span>
                              <span className="text-xs text-slate-400">{lead.phone || "—"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 border-b border-gray-100 text-gray-700">{lead.departureCity}</td>
                          <td className="px-6 py-3 border-b border-gray-100 text-gray-700">{lead.destination}</td>
                          <td className="px-6 py-3 border-b border-gray-100 text-gray-700">{formatDate(lead.expectedTravelDate)}</td>
                          <td className="px-6 py-3 border-b border-gray-100 text-center">
                            <div className="flex justify-center gap-2 flex-col sm:flex-row">
                              <div className="flex flex-col justify-center gap-2">
                                <div className="">
                                  <button onClick={() => handleView(lead)} className="p-2 mx-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm transition-all" title="View Lead"><Eye size={16} /></button>
                                  <button onClick={() => handleEdit(lead)} className="p-2 mx-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 shadow-sm transition-all" title="Edit Lead"><Edit2 size={16} /></button>
                                  <button onClick={() => handleAddMessage(lead)} className="p-2 mx-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 shadow-sm transition-all" title="Add Message"><MessageSquare size={16} /></button>
                                  {lead.leadInterestStatus === "Follow Up" && (
                                    <>
                                      <button onClick={() => handleAddDetails(lead)} className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 shadow-sm transition-all text-xs font-semibold" title="Add Details">Details</button>
                                    </>
                                  )}
                                </div>
                                <div className="flex">
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <select
                                      value={lead.leadInterestStatus || ""}
                                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                      disabled={statusSavingId === lead._id}
                                      className={`px-3 py-2 rounded-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 cursor-pointer transition-all ${statusSavingId === lead._id ? 'bg-blue-50 border-blue-400 text-gray-600 cursor-not-allowed opacity-70' : 'border border-gray-200'} ${lead.leadInterestStatus ? 'font-semibold text-blue-600' : 'text-gray-500'}`}
                                    >
                                      <option value="">Select Status</option>
                                      <option value="Interested">Interested</option>
                                      <option value="Not Interested">Not Interested</option>
                                      <option value="Connected">Connected</option>
                                      <option value="Not Connected">Not Connected</option>
                                      <option value="Follow Up">Follow Up</option>
                                    </select>
                                  </div>
                                  {lead.leadInterestStatus === "Follow Up" && (
                                    <button onClick={() => handleConfirmTransfer(lead)} className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 shadow-sm transition-all text-xs font-semibold" title="Confirm Transfer">Confirm</button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>

                            {userRole && userRole.toLowerCase() === "superadmin" && (
                              <select
                                value={lead.assignedEmployee || ""}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    setAssignEmployeeModal({ isOpen: true, lead });
                                    setSelectedEmployeeForAssign(e.target.value);
                                  }
                                }}
                                className="px-3 py-2 rounded-full text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 cursor-pointer transition-all bg-green-50 border border-gray-200"
                              >
                                <option value="">Assign to Employee</option>
                                {allEmployees.map((emp) => (
                                  <option key={emp._id} value={emp._id}>
                                    {emp.fullName || emp.name || "Unknown"}
                                  </option>
                                ))}
                              </select>
                            )}

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>}
          </div>
        </>
      )}

      {/* Special Lead Tab */}
      {activeTab === "special-lead" && (
        <>
          {specialLeadsLoading ? (
            <p>Loading special leads...</p>
          ) : specialLeads.length === 0 ? (
            <p className="text-gray-600">{userRole && userRole.toLowerCase() === 'superadmin' ? 'No special leads created yet.' : 'No special leads assigned to you yet.'}</p>
          ) : (
            <>
              <div className="mt-4 overflow-x-auto">
                <div className="rounded-3xl shadow-lg border border-gray-200 overflow-hidden bg-white/90">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact Information</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Departure</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Destination</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Travel Date</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                        {userRole && userRole.toLowerCase() === "superadmin" && (<th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Assign to</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {specialLeads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-blue-50 transition-colors group">
                          <td className="px-6 py-3 border-b border-gray-100 text-gray-700">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-slate-900 text-base leading-tight">{lead.name || "—"}</span>
                              <span className="text-sm text-slate-600">{lead.email || "—"}</span>
                              <span className="text-xs text-slate-400">{lead.phone || "—"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 border-b border-gray-100">{lead.departureCity || "—"}</td>
                          <td className="px-6 py-3 border-b border-gray-100">{lead.destination || "—"}</td>
                          <td className="px-6 py-3 border-b border-gray-100">{formatDate(lead.expectedTravelDate)}</td>
                          <td className="px-6 py-3 border-b border-gray-100 text-center">
                            <div className="flex justify-center gap-2 flex-col sm:flex-row">
                              <div className="flex flex-col justify-center gap-2">
                                <div className="">
                                  <button onClick={() => handleView(lead)} className="p-2 mx-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm transition-all" title="View Lead"><Eye size={16} /></button>
                                  <button onClick={() => handleEdit(lead)} className="p-2 mx-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 shadow-sm transition-all" title="Edit Lead"><Edit2 size={16} /></button>
                                  <button onClick={() => handleAddMessage(lead)} className="p-2 mx-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 shadow-sm transition-all" title="Add Message"><MessageSquare size={16} /></button>
                                  {lead.leadInterestStatus === "Follow Up" && (
                                    <>
                                      <button onClick={() => handleAddDetails(lead)} className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 shadow-sm transition-all text-xs font-semibold" title="Add Details">Details</button>
                                    </>
                                  )}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <select
                                    value={lead.leadInterestStatus || ""}
                                    onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                    disabled={statusSavingId === lead._id}
                                    className={`px-3 py-2 rounded-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 cursor-pointer transition-all ${statusSavingId === lead._id ? 'bg-blue-50 border-blue-400 text-gray-600 cursor-not-allowed opacity-70' : 'border border-gray-200'} ${lead.leadInterestStatus ? 'font-semibold text-blue-600' : 'text-gray-500'}`}
                                  >
                                    <option value="">Select Status</option>
                                    <option value="Interested">Interested</option>
                                    <option value="Not Interested">Not Interested</option>
                                    <option value="Connected">Connected</option>
                                    <option value="Not Connected">Not Connected</option>
                                    <option value="Follow Up">Follow Up</option>
                                  </select>
                                  {lead.leadInterestStatus === "Follow Up" && (
                                    <button onClick={() => handleSpecialConfirmTransfer(lead)} className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 shadow-sm transition-all text-xs font-semibold" title="Confirm Transfer">Confirm</button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          {userRole && userRole.toLowerCase() === "superadmin" && (
                            <td className="px-6 py-3 border-b border-gray-100 text-center">
                              <select
                                value={lead.assignedEmployee || ""}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    setAssignEmployeeModal({ isOpen: true, lead });
                                    setSelectedEmployeeForAssign(e.target.value);
                                  }
                                }}
                                className="px-3 py-2 rounded-full text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 cursor-pointer transition-all bg-green-50 border border-gray-200"
                              >
                                <option value="">
                                  {lead.assignedEmployee ? 'Reassign' : 'Assign to Employee'}
                                </option>
                                {allEmployees.map((emp) => (
                                  <option key={emp._id} value={emp._id}>
                                    {emp.fullName || emp.name || "Unknown"}
                                  </option>
                                ))}
                              </select>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* My Assigned Lead Tab */}
      {activeTab === "assigned" && (
        <>
          {assignedLoading ? (
            <p>Loading assigned leads...</p>
          ) : assignedLeads.length === 0 ? (
            <p className="text-gray-600">You have no assigned leads yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border">Name</th>
                      <th className="px-4 py-2 border">Email</th>
                      <th className="px-4 py-2 border">Phone</th>
                      <th className="px-4 py-2 border">Departure</th>
                      <th className="px-4 py-2 border">Destination</th>
                      <th className="px-4 py-2 border">Travel Date</th>
                      <th className="px-4 py-2 border text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleAssignedLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 border">{lead.name}</td>
                        <td className="px-4 py-2 border">{lead.email}</td>
                        <td className="px-4 py-2 border">{lead.phone}</td>
                        <td className="px-4 py-2 border">{lead.departureCity || "-"}</td>
                        <td className="px-4 py-2 border">{lead.destination}</td>
                        <td className="px-4 py-2 border">{formatDate(lead.expectedTravelDate)}</td>
                        <td className="px-4 py-2 border text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleView(lead)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" title="View Lead"><Eye size={16} /></button>
                            <button onClick={() => handleEditAssigned(lead)} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200" title="Edit Lead"><Edit2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Edit Assigned Lead Modal */}
                    {editAssignedLead && (
                      <Modal isOpen={true} onClose={closeModal} size="large">
                        <div className="flex flex-col h-full max-h-[95vh]">
                          <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900">Edit Assigned Lead</h2>
                            <button onClick={closeModal} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
                          </div>
                          <div className="flex-1 overflow-y-auto p-4">
                            <LeadForm
                              initialData={editAssignedLead}
                              onSubmit={handleSaveAssignedLead}
                              onClose={closeModal}
                              isEditing={true}
                            />
                            <div className="text-xs text-gray-500 mt-2">On save, this lead will move to My Leads and be removed from assigned leads.</div>
                          </div>
                        </div>
                      </Modal>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-gray-600">
                  Showing {Math.min((currentPage - 1) * pageSize + 1, filteredAssignedLeads.length || 0)} to {Math.min(currentPage * pageSize, filteredAssignedLeads.length || 0)} of {filteredAssignedLeads.length || 0} leads
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
                  >
                    Previous
                  </button>
                  <div className="text-sm">Page {currentPage} of {Math.max(1, Math.ceil((filteredAssignedLeads.length || 0) / pageSize))}</div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil((filteredAssignedLeads.length || 0) / pageSize)), p + 1))}
                    disabled={currentPage >= Math.ceil((filteredAssignedLeads.length || 0) / pageSize)}
                    className={`px-3 py-1 rounded ${currentPage >= Math.ceil((filteredAssignedLeads.length || 0) / pageSize) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}


      {activeTab === "transfer" && (
        <div>
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading transfer leads...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-700">Error: {error}</p>
            </div>
          )}

          {!loading && transferLeads.length === 0 && !error && (
            <div className="text-center py-8">
              <p className="text-gray-500">No transfer leads available</p>
            </div>
          )}

          {!loading && transferLeads.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Destination</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transferLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{lead.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{lead.email}</td>
                      <td className="border border-gray-300 px-4 py-2">{lead.phone}</td>
                      <td className="border border-gray-300 px-4 py-2">{lead.destination}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {lead.leadStatus || "Pending"}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2 justify-center flex-wrap">
                          {/* View Button */}
                          <button
                            onClick={() => handleViewLead(lead)}
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition flex items-center justify-center"
                            title="View Lead Details"
                          >
                            <Eye size={18} />
                          </button>

                          {/* Edit Button */}
                          {/* <button
                            onClick={() => { setSelectedLead(lead); setEditModalOpen(true); }}
                            className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition flex items-center justify-center"
                            title="Edit Lead"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6L21 11l-6-6-6 6z" />
                            </svg>
                          </button> */}

                          {/* Upload Documents Button */}
                          {/* <button
                            onClick={() => handleUploadDocuments(lead)}
                            className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition flex items-center justify-center"
                            title="Upload Documents"
                          >
                            <FileUp size={18} />
                          </button> */}

                          {/* Move Button */}
                          {/* <button
                            type="button"
                            onClick={() => handleMoveLead(lead)}
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition flex items-center justify-center"
                            title="Move Lead"
                          >
                            <Move size={18} />
                          </button> */}

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Assigned by Destination Tab */}
      {activeTab === "destination-assigned" && (
        <>
          {destAssignedLoading ? (
            <p>Loading destination-assigned leads...</p>
          ) : destinationAssignedLeads.length === 0 ? (
            <p className="text-gray-600">You have no leads assigned by destination yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border">Name</th>
                      <th className="px-4 py-2 border">Email</th>
                      <th className="px-4 py-2 border">Phone</th>
                      <th className="px-4 py-2 border">Departure</th>
                      <th className="px-4 py-2 border">Destination</th>
                      <th className="px-4 py-2 border">Travel Date</th>
                      <th className="px-4 py-2 border text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinationAssignedLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 border">{lead.name}</td>
                        <td className="px-4 py-2 border">{lead.email}</td>
                        <td className="px-4 py-2 border">{lead.phone}</td>
                        <td className="px-4 py-2 border">{lead.departureCity || "-"}</td>
                        <td className="px-4 py-2 border">{lead.destination}</td>
                        <td className="px-4 py-2 border">{formatDate(lead.expectedTravelDate)}</td>
                        <td className="px-4 py-2 border text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleView(lead)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" title="View Lead"><Eye size={16} /></button>
                            <button onClick={() => handleEditDestAssigned(lead)} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200" title="Edit Lead"><Edit2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Edit Destination Assigned Lead Modal */}
                    {editDestAssignedLead && (
                      <Modal isOpen={true} onClose={closeModal} size="large">
                        <div className="flex flex-col h-full max-h-[95vh]">
                          <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900">Edit Lead (Assigned by Destination)</h2>
                            <button onClick={closeModal} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
                          </div>
                          <div className="flex-1 overflow-y-auto p-4">
                            <LeadForm
                              initialData={editDestAssignedLead}
                              onSubmit={handleUpdateDestAssignedLead}
                              onClose={closeModal}
                              isEditing={true}
                            />
                            <div className="text-xs text-gray-500 mt-2">This lead was automatically assigned to you based on destination matching.</div>
                          </div>
                        </div>
                      </Modal>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editLead) && (
        <Modal isOpen={true} onClose={closeModal} size="large">
          <div className="flex flex-col h-full max-h-[95vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">{editLead ? "Edit Lead" : "Add New Lead"}</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <LeadForm
                initialData={editLead || {
                  name: "", email: "", phone: "", whatsAppNo: "", departureCity: "",
                  destination: "", expectedTravelDate: "", noOfDays: "", customNoOfDays: "",
                  placesToCover: "", placesToCoverArray: [], noOfPerson: "", noOfChild: "",
                  childAges: [], groupNumber: "", leadSource: "", leadType: "", tripType: "",
                  leadStatus: "Hot", notes: "", employee: employeeId
                }}
                onSubmit={editLead ? handleUpdateLead : handleAddLead}
                onClose={closeModal}
                isEditing={!!editLead}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* View Lead Modal (read-only form) */}
      {viewLead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X size={20} /></button>
            <h3 className="text-lg font-semibold mb-4 text-center">Lead Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs text-gray-600">Name</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.name || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Email</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.email || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Phone</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.phone || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">WhatsApp</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.whatsAppNo || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Departure City</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.departureCity || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Destination</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.destination || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Expected Travel Date</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={formatDate(viewLead.expectedTravelDate)} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">No. of Days</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.noOfDays || viewLead.customNoOfDays || "-"} readOnly />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600">Places To Cover</label>
                <textarea className="w-full px-3 py-1.5 border rounded bg-gray-50" rows={2} value={(viewLead.placesToCoverArray && viewLead.placesToCoverArray.join(", ")) || viewLead.placesToCover || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">No. of Persons</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.noOfPerson || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">No. of Children</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.noOfChild || "-"} readOnly />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600">Child Ages</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={(viewLead.childAges && viewLead.childAges.length ? viewLead.childAges.join(", ") : "-")} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Group Number</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.groupNumber || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Lead Source</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.leadSource || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Lead Type</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.leadType || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Trip Type</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.tripType || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Lead Status</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.leadStatus || "-"} readOnly />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600">Notes</label>
                <textarea className="w-full px-3 py-1.5 border rounded bg-gray-50" rows={4} value={viewLead.notes || "-"} readOnly />
              </div>

              {/* Message history */}
              <div className="sm:col-span-2 mt-2">
                <label className="block text-xs text-gray-600">Messages</label>
                <div className="border rounded bg-white p-3 max-h-48 overflow-y-auto">
                  {messagesLoading && <p className="text-sm text-gray-500">Loading messages...</p>}
                  {!messagesLoading && messages.length === 0 && <p className="text-sm text-gray-500">No messages yet.</p>}
                  {!messagesLoading && messages.map((m, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{m.senderName ? m.senderName : (m.sender === employeeId ? 'You' : (m.sender || 'Unknown'))}</span>
                        <span className="ml-2">• {new Date(m.sentAt).toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{m.text}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  {messagesHasMore && (
                    <button onClick={loadMoreMessages} className="text-sm text-blue-600 hover:underline">Load more</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Lead Details</h3>
              <button onClick={() => setViewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {/* Employee Info Banner - Only show for B2B Transfer Leads */}
            {leadSource === "b2b-transfer" && selectedLead.employee ? (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">Transferred By:</p>
                <p className="text-sm text-blue-800">
                  <strong>{typeof selectedLead.employee === 'object'
                    ? selectedLead.employee.fullName || selectedLead.employee.name || "Unknown"
                    : selectedLead.employee}</strong>
                  {typeof selectedLead.employee === 'object' && selectedLead.employee.officialNo && (
                    <span className="ml-2 text-blue-700">({selectedLead.employee.officialNo})</span>
                  )}
                </p>
              </div>
            ) : null}

            <form className="space-y-6">
              {/* Reference ID Section (for B2B Transfer Leads) */}
              {selectedLead.referenceId && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    Reference ID
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <input type="text" value={selectedLead.referenceId || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-bold" />
                  </div>
                </div>
              )}

              {/* Contact/Company Information Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  {selectedLead.companyName ? "Company Information" : "Contact Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{selectedLead.companyName ? "Company Name" : "Full Name"}</label>
                    <input type="text" value={selectedLead.companyName || selectedLead.name || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{selectedLead.companyName ? "Company Email" : "Email"}</label>
                    <input type="email" value={selectedLead.email || selectedLead.companyEmail || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{selectedLead.companyName ? "Company Phone" : "Phone"}</label>
                    <input type="text" value={selectedLead.phone || selectedLead.companyPhone || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{selectedLead.companyName ? "Company WhatsApp" : "WhatsApp"}</label>
                    <input type="text" value={selectedLead.whatsAppNo || selectedLead.companyWhatsApp || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
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
                    <input type="text" value={selectedLead.departureCity || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Destination</label>
                    <input type="text" value={selectedLead.destination || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Expected Travel Date</label>
                    <input type="text" value={selectedLead.expectedTravelDate ? new Date(selectedLead.expectedTravelDate).toLocaleDateString() : ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. of Days</label>
                    <input type="text" value={selectedLead.noOfDays || selectedLead.customNoOfDays || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  {(selectedLead.placesToCoverArray?.length > 0 || selectedLead.placesToCover) && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Places to Cover</label>
                      <div className="flex flex-wrap gap-2">
                        {(selectedLead.placesToCoverArray || (selectedLead.placesToCover ? selectedLead.placesToCover.split(",") : [])).map((place, idx) => (
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
                    <input type="text" value={selectedLead.noOfPerson || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. of Children</label>
                    <input type="text" value={selectedLead.noOfChild || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Child Ages</label>
                    <input type="text" value={(selectedLead.childAges && selectedLead.childAges.length ? selectedLead.childAges.join(", ") : "-")} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
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
                    <input type="text" value={selectedLead.groupNumber || selectedLead.groupNo || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Status</label>
                    <input type="text" value={selectedLead.leadStatus || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Source</label>
                    <input type="text" value={selectedLead.leadSource || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Type</label>
                    <input type="text" value={selectedLead.leadType || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Trip Type</label>
                    <input type="text" value={selectedLead.tripType || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {selectedLead.notes && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                    Additional Notes
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <textarea rows={3} value={selectedLead.notes} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                  </div>
                </div>
              )}

              {/* Messages Section */}
              {selectedLead.messages && selectedLead.messages.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    Messages
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 max-h-64 overflow-y-auto">
                    {selectedLead.messages.map((msg, idx) => (
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

              {/* Trip Details Section */}
              {(selectedLead.itinerary || selectedLead.inclusion || selectedLead.exclusion || selectedLead.totalAmount) && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                    Trip Details
                  </h4>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    {/* Itinerary PDF */}
                    {selectedLead.itinerary && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Itinerary</label>
                        <button
                          type="button"
                          onClick={() => handleViewDoc({ name: 'Itinerary', url: selectedLead.itinerary, fileType: 'application/pdf', isExisting: true })}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                        >
                          📄 View Itinerary PDF
                        </button>
                      </div>
                    )}

                    {/* Inclusions */}
                    {selectedLead.inclusion && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Inclusions</label>
                        <textarea rows={3} value={selectedLead.inclusion} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                      </div>
                    )}

                    {/* Special Inclusions */}
                    {selectedLead.specialInclusions && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Special Inclusions</label>
                        <textarea rows={2} value={selectedLead.specialInclusions} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                      </div>
                    )}

                    {/* Exclusions */}
                    {selectedLead.exclusion && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Exclusions</label>
                        <textarea rows={3} value={selectedLead.exclusion} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
                      </div>
                    )}

                    {/* Land Package Calculation */}
                    {selectedLead.totalAmount && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-sm font-semibold text-gray-800 mb-3">Land Package Calculation:</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Total Cost:</span>
                            <span className="font-medium">₹ {selectedLead.totalAmount || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">- Advance:</span>
                            <span className="font-medium">₹ {selectedLead.advanceRequired || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">- Discount:</span>
                            <span className="font-medium">₹ {selectedLead.discount || 0}</span>
                          </div>
                          <div className="border-t border-blue-300 pt-2 flex justify-between">
                            <span className="text-gray-900 font-semibold">Final:</span>
                            <span className="font-bold text-blue-700">₹ {Math.max(0, (parseFloat(selectedLead.totalAmount || 0) - parseFloat(selectedLead.advanceRequired || 0) - parseFloat(selectedLead.discount || 0)).toFixed(2))}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Airfare Calculation */}
                    {selectedLead.totalAirfare && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-sm font-semibold text-gray-800 mb-3">Airfare Calculation:</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Total Cost:</span>
                            <span className="font-medium">₹ {selectedLead.totalAirfare || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">- Advance:</span>
                            <span className="font-medium">₹ {selectedLead.advanceAirfare || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">- Discount:</span>
                            <span className="font-medium">₹ {selectedLead.discountAirfare || 0}</span>
                          </div>
                          <div className="border-t border-green-300 pt-2 flex justify-between">
                            <span className="text-gray-900 font-semibold">Final:</span>
                            <span className="font-bold text-green-700">₹ {Math.max(0, (parseFloat(selectedLead.totalAirfare || 0) - parseFloat(selectedLead.advanceAirfare || 0) - parseFloat(selectedLead.discountAirfare || 0)).toFixed(2))}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Overall Calculation */}
                    {(selectedLead.totalAmount || selectedLead.totalAirfare) && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="text-sm font-semibold text-gray-800 mb-3">Grand Total Calculation:</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Land Package:</span>
                            <span className="font-medium">₹ {parseFloat(selectedLead.totalAmount || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Airfare:</span>
                            <span className="font-medium">₹ {parseFloat(selectedLead.totalAirfare || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold bg-white bg-opacity-50 px-2 py-1 rounded">
                            <span>Combined:</span>
                            <span className="text-purple-700">₹ {(parseFloat(selectedLead.totalAmount || 0) + parseFloat(selectedLead.totalAirfare || 0)).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">- Total Advance:</span>
                            <span className="font-medium">₹ {(parseFloat(selectedLead.advanceRequired || 0) + parseFloat(selectedLead.advanceAirfare || 0)).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">- Total Discount:</span>
                            <span className="font-medium">₹ {(parseFloat(selectedLead.discount || 0) + parseFloat(selectedLead.discountAirfare || 0)).toFixed(2)}</span>
                          </div>
                          <div className="border-t border-purple-300 pt-2 flex justify-between">
                            <span className="text-gray-900 font-semibold">Grand Total (Payable):</span>
                            <span className="font-bold text-purple-700">₹ {(Math.max(0, (parseFloat(selectedLead.totalAmount || 0) + parseFloat(selectedLead.totalAirfare || 0)) - (parseFloat(selectedLead.advanceRequired || 0) + parseFloat(selectedLead.advanceAirfare || 0)) - (parseFloat(selectedLead.discount || 0) + parseFloat(selectedLead.discountAirfare || 0)))).toFixed(2)}</span>
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
                  onClick={() => setViewModalOpen(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {typeof editModalOpen !== 'undefined' && editModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{leadSource === "b2b-transfer" ? "Edit B2B Operation Lead" : "Edit Transfer Lead"}</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const endpoint = leadSource === "b2b-transfer"
                  ? `http://localhost:4000/b2b-operation-leads/${selectedLead._id}`
                  : `http://localhost:4000/employeelead/transfer/${selectedLead._id}`;

                const payload = {
                  ...(leadSource === "b2b-transfer" ? {
                    companyName: editForm.companyName,
                    email: editForm.email || editForm.companyEmail,
                    phone: editForm.phone || editForm.companyPhone,
                    whatsAppNo: editForm.whatsAppNo || editForm.companyWhatsApp,
                  } : {
                    name: editForm.name,
                    email: editForm.email,
                    phone: editForm.phone,
                    whatsAppNo: editForm.whatsAppNo,
                  }),
                  departureCity: editForm.departureCity,
                  destination: editForm.destination,
                  expectedTravelDate: editForm.expectedTravelDate,
                  noOfPerson: editForm.noOfPerson,
                  noOfChild: editForm.noOfChild,
                  placesToCover: (editForm.placesToCoverArray || []).join(", "),
                  childAges: editForm.childAges || [],
                  notes: editForm.notes,
                  noOfDays: editForm.noOfDays,
                  groupNumber: editForm.groupNumber || editForm.groupNo,
                  leadStatus: editForm.leadStatus,
                  leadSource: editForm.leadSource,
                  leadType: editForm.leadType,
                  tripType: editForm.tripType,
                };

                const res = await fetch(endpoint, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error('Failed to update lead');
                alert('Lead updated');
                setEditModalOpen(false);
                if (leadSource === "b2b-transfer") {
                  fetchB2bOperationLeads();
                } else {
                  fetchTransferLeads();
                }
              } catch (err) {
                console.error(err);
                alert('Update failed');
              }
            }} className="space-y-6">
              {/* Contact Information Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  {leadSource === "b2b-transfer" ? "Company Information" : "Contact Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{leadSource === "b2b-transfer" ? "Company Name" : "Full Name"}</label>
                    <input
                      type="text"
                      value={editForm.companyName || editForm.name || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 font-medium cursor-not-allowed opacity-70"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{leadSource === "b2b-transfer" ? "Company Email" : "Email"}</label>
                    <input
                      type="email"
                      value={editForm.email || editForm.companyEmail || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed opacity-70"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{leadSource === "b2b-transfer" ? "Company Phone" : "Phone"}</label>
                    <input
                      type="text"
                      value={editForm.phone || editForm.companyPhone || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed opacity-70"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{leadSource === "b2b-transfer" ? "Company WhatsApp" : "WhatsApp"}</label>
                    <input
                      type="text"
                      value={editForm.whatsAppNo || editForm.companyWhatsApp || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 cursor-not-allowed opacity-70"
                    />
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
                    <input
                      type="text"
                      value={editForm.departureCity || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, departureCity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Destination</label>
                    <input
                      type="text"
                      value={editForm.destination || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, destination: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Expected Travel Date</label>
                    <input
                      type="date"
                      value={editForm.expectedTravelDate || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, expectedTravelDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. of Days</label>
                    <input
                      type="text"
                      value={editForm.noOfDays || editForm.customNoOfDays || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, noOfDays: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Places to Cover (comma separated)</label>
                    <input
                      type="text"
                      value={(editForm.placesToCoverArray && editForm.placesToCoverArray.join(', ')) || editForm.placesToCover || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, placesToCoverArray: e.target.value.split(',').map(p => p.trim()) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
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
                    <input
                      type="number"
                      value={editForm.noOfPerson || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, noOfPerson: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. of Children</label>
                    <input
                      type="number"
                      value={editForm.noOfChild || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, noOfChild: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Child Ages (comma separated)</label>
                    <input
                      type="text"
                      value={(editForm.childAges && editForm.childAges.join(', ')) || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, childAges: e.target.value.split(',').map(v => v.trim()).filter(Boolean) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
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
                    <input
                      type="text"
                      value={editForm.groupNumber || editForm.groupNo || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, groupNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Status</label>
                    <select
                      value={editForm.leadStatus || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, leadStatus: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      <option value="Interested">Interested</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Connected">Connected</option>
                      <option value="Not Connected">Not Connected</option>
                      <option value="Follow Up">Follow Up</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Source</label>
                    <input
                      type="text"
                      value={editForm.leadSource || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, leadSource: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Type</label>
                    <input
                      type="text"
                      value={editForm.leadType || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, leadType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Trip Type</label>
                    <input
                      type="text"
                      value={editForm.tripType || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, tripType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                  Additional Notes
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <textarea
                    rows={3}
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Add any additional notes..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModal.isOpen && messageModal.lead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X size={20} /></button>
            <h3 className="text-lg font-semibold mb-4 text-center">Add Message for {messageModal.lead.name}</h3>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded p-3 text-sm">
                <p className="text-gray-600"><strong>Phone:</strong> {messageModal.lead.phone}</p>
                <p className="text-gray-600"><strong>Destination:</strong> {messageModal.lead.destination || "-"}</p>
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
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {messageText.length}/8000 characters
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium">
                  Cancel
                </button>
                <button onClick={() => handleSendMessage(messageModal.lead._id)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium" disabled={messageText.trim() === ""}>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal.isOpen && detailsModal.lead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X size={20} /></button>
            <h3 className="text-lg font-semibold mb-4 text-center">Add Details for {detailsModal.lead.name}</h3>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded p-3 text-sm">
                <p className="text-gray-600"><strong>Phone:</strong> {detailsModal.lead.phone}</p>
                <p className="text-gray-600"><strong>Destination:</strong> {detailsModal.lead.destination || "-"}</p>
                <p className="text-gray-600"><strong>Travel Date:</strong> {formatDate(detailsModal.lead.expectedTravelDate) || "-"}</p>
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
                          formData.append("leadName", detailsModal.lead.name);
                          console.log(file);
                          console.log(formData);
                          for (let [key, value] of formData.entries()) {
                            console.log(key, value);
                          }

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
                      onClick={() => setViewingPdfUrl(detailsForm.itinerary)}
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

              {/* Special Inclusions (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Inclusions <span className="text-xs text-gray-500">(optional)</span></label>
                <textarea
                  value={detailsForm.specialInclusions}
                  onChange={(e) => setDetailsForm({ ...detailsForm, specialInclusions: e.target.value })}
                  placeholder="Add any special inclusions or premium offerings..."
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
                  placeholder="List what's not included in the package..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Token Amount and Total Amount */}
              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Token Amount (₹)</label>
                  <input
                    type="number"
                    value={detailsForm.tokenAmount}
                    onChange={(e) => setDetailsForm({ ...detailsForm, tokenAmount: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div> */}
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

              {/* Total Calculation - Land Package */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm font-semibold text-gray-800 mb-3">Land Package Calculation:</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Land Package Cost:</span>
                    <span className="font-medium">₹ {detailsForm.totalAmount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">- Advance Required:</span>
                    <span className="font-medium">₹ {detailsForm.advanceRequired || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">- Discount:</span>
                    <span className="font-medium">₹ {detailsForm.discount || 0}</span>
                  </div>
                  <div className="border-t border-blue-300 pt-2 flex justify-between">
                    <span className="text-gray-900 font-semibold">Final Amount:</span>
                    <span className="font-bold text-blue-700">₹ {Math.max(0, (parseFloat(detailsForm.totalAmount || 0) - parseFloat(detailsForm.advanceRequired || 0) - parseFloat(detailsForm.discount || 0)).toFixed(2))}</span>
                  </div>
                </div>
              </div>

              {/* Airfare/Train Fare Fields */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Total Airfare / Train Fare Cost</h4>
              </div>

              {/* Total Airfare */}
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

              {/* Advance Airfare */}
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

              {/* Discount Airfare */}
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

              {/* Total Calculation - Airfare */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm font-semibold text-gray-800 mb-3">Airfare / Train Fare Calculation:</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Airfare / Train Fare Cost:</span>
                    <span className="font-medium">₹ {detailsForm.totalAirfare || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">- Advance Required:</span>
                    <span className="font-medium">₹ {detailsForm.advanceAirfare || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">- Discount:</span>
                    <span className="font-medium">₹ {detailsForm.discountAirfare || 0}</span>
                  </div>
                  <div className="border-t border-green-300 pt-2 flex justify-between">
                    <span className="text-gray-900 font-semibold">Final Amount:</span>
                    <span className="font-bold text-green-700">₹ {Math.max(0, (parseFloat(detailsForm.totalAirfare || 0) - parseFloat(detailsForm.advanceAirfare || 0) - parseFloat(detailsForm.discountAirfare || 0)).toFixed(2))}</span>
                  </div>
                </div>
              </div>

              {/* Overall Calculation - Land + Airfare */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mt-4">
                <div className="text-sm font-semibold text-gray-800 mb-3">Overall Calculation (Discount Applied to Total):</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Land Package Cost:</span>
                    <span className="font-medium">₹ {parseFloat(detailsForm.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Airfare / Train Fare Cost:</span>
                    <span className="font-medium">₹ {parseFloat(detailsForm.totalAirfare || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold bg-white bg-opacity-50 px-2 py-1 rounded">
                    <span className="text-gray-800">Combined Total Cost:</span>
                    <span className="text-purple-700">₹ {(parseFloat(detailsForm.totalAmount || 0) + parseFloat(detailsForm.totalAirfare || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">- Total Advance Collected:</span>
                    <span className="font-medium">₹ {(parseFloat(detailsForm.advanceRequired || 0) + parseFloat(detailsForm.advanceAirfare || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">- Total Discount:</span>
                    <span className="font-medium">₹ {(parseFloat(detailsForm.discount || 0) + parseFloat(detailsForm.discountAirfare || 0)).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-purple-300 pt-2 flex justify-between">
                    <span className="text-gray-900 font-semibold">Grand Total (Payable):</span>
                    <span className="font-bold text-purple-700">₹ {(
                      Math.max(0, (parseFloat(detailsForm.totalAmount || 0) + parseFloat(detailsForm.totalAirfare || 0)) - (parseFloat(detailsForm.advanceRequired || 0) + parseFloat(detailsForm.advanceAirfare || 0)) - (parseFloat(detailsForm.discount || 0) + parseFloat(detailsForm.discountAirfare || 0)))
                    ).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium">
                  Cancel
                </button>
                <button onClick={async () => {
                  // Determine if this is a special lead or regular lead
                  const isSpecialLead = specialLeads.some(lead => lead._id === detailsModal.lead._id);
                  console.log(isSpecialLead);

                  const endpoint = isSpecialLead || role === "superAdmin" ? `http://localhost:4000/superadminmylead/${detailsModal.lead._id}/details` : `http://localhost:4000/employeelead/${detailsModal.lead._id}/details`;
                  console.log(endpoint);
                  console.log(detailsForm);


                  try {
                    const res = await fetch(endpoint, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(detailsForm),
                    });

                    const data = await res.json();
                    console.log(data);
                    if (!res.ok) {
                      alert("Failed to save details: " + (data.message || res.statusText));
                      return;
                    }
                    console.log("Saved lead:", data.lead.inclusion);
                    // Update local state with the updated lead from server
                    if (isSpecialLead) {
                      setSpecialLeads((prev) =>
                        prev.map((l) => (l._id === detailsModal.lead._id ? data.lead : l))
                      );
                    } else {
                      setLeads((prev) =>
                        prev.map((l) => (l._id === detailsModal.lead._id ? data.lead : l))
                      );
                      // Also update destination-assigned leads if it exists
                      setDestinationAssignedLeads((prev) =>
                        prev.map((l) => (l._id === detailsModal.lead._id ? data.lead : l))
                      );
                    }
                    alert("Details saved successfully!");
                    closeModal();
                  } catch (err) {
                    console.error("Error saving details:", err);
                    alert("Error saving details. Check console for details.");
                  }
                }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">
                  Save Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal (Google Docs Viewer - same as CreateCustomer) */}
      {viewingPdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Itinerary PDF</h3>
              <button
                onClick={() => setViewingPdfUrl(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
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
                        <button
                          onClick={() => handleOpenPdf(viewingPdfUrl)}
                          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
                        >
                          ⬇️ Download PDF
                        </button>
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

      {/* 🆕 Assign Employee Modal (Superadmin only) */}
      {assignEmployeeModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Assign Lead to Employee</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Lead:</strong> {assignEmployeeModal.lead?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Phone:</strong> {assignEmployeeModal.lead?.phone || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
                <select
                  value={selectedEmployeeForAssign}
                  onChange={(e) => setSelectedEmployeeForAssign(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">-- Choose Employee --</option>
                  {employeesLoading ? (
                    <option disabled>Loading employees...</option>
                  ) : (
                    allEmployees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.fullName || emp.name || "Unknown"}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignToEmployee}
                  disabled={!selectedEmployeeForAssign}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeads;
