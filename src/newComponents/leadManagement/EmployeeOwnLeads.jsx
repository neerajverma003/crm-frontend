import React, { useEffect, useState, useCallback, useRef } from "react";
import { ChevronDown, Eye, Edit2, MessageSquare, X, AlertCircle } from "lucide-react";
import EmployeeOwnLeadCards from "./EmployeeOwnLeadCards.jsx";
import DestinationSearchBox from "../../components/DestinationSearchBox";

const tripDurations = [
  "1n/2d","2n/3d","3n/4d","4n/5d","5n/6d","6n/7d","7n/8d","8n/9d","9n/10d",
  "10n/11d","11n/12d","12n/13d","13n/14d","14n/15d","Others"
];

const leadSources = [
  "Cold Call", "Website", "Referral", "LinkedIn", "Trade Show",
  "Email Campaign", "Social Media", "Event", "Organic Search", "Paid Ads",
];
const leadTypes = ["International", "Domestic"];
const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];

// Modal Component
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

// Input Field Component
const InputField = ({ name, type = "text", placeholder, required, value, error, onChange }) => (
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
      className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
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

// Select Field Component
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
      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

// Edit Lead Form Component
const EditLeadForm = ({ initialData, onSubmit, onClose }) => {
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
      expectedTravelDate: "",
      noOfDays: "",
      customNoOfDays: "",
      placesToCover: "",
      placesToCoverArray: initialData?.placesToCoverArray || (initialData?.placesToCover ? initialData.placesToCover.split(", ").map(p => p.trim()) : []),
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

  const validate = (data) => {
    const newErrors = {};
    if (!data.phone || data.phone.trim() === "") newErrors.phone = "Phone is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleAddPlace = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const place = e.target.value.trim();
      if (!place) return;

      const currentPlaces = formData.placesToCoverArray || [];
      if (!currentPlaces.includes(place)) {
        setFormData((prev) => ({
          ...prev,
          placesToCoverArray: [...currentPlaces, place],
        }));
      }
      e.target.value = "";
    }
  };

  const removePlace = (index) => {
    const updatedPlaces = [...(formData.placesToCoverArray || [])];
    updatedPlaces.splice(index, 1);
    setFormData((prev) => ({ ...prev, placesToCoverArray: updatedPlaces }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      ...formData,
      placesToCover: (formData.placesToCoverArray || []).join(", "),
    };

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
        <InputField name="name" value={formData.name || formData.leadName} onChange={handleChange} />
        <InputField name="email" type="email" value={formData.email} onChange={handleChange} />
        <InputField name="phone" value={formData.phone || formData.phoneNumber} onChange={handleChange} required error={errors.phone} />
        <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
        <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} />
        <DestinationSearchBox
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Search destination..."
          error={errors.destination}
        />
        <InputField name="expectedTravelDate" type="date" value={formData.expectedTravelDate ? formData.expectedTravelDate.split('T')[0] : ''} onChange={handleChange} />
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
          <input
            type="text"
            placeholder="Type a place and press Enter"
            onKeyDown={handleAddPlace}
            className="w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
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
const EmployeeOwnLeads = ({ onEmployeeSelect, activeTab, selectedEmployeeId }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [stats, setStats] = useState({
    totalLeads: 0,
    convertedLeads: 0,
    inProgressLeads: 0,
    pendingLeads: 0,
  });
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [viewLead, setViewLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [statusSavingId, setStatusSavingId] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [messageModal, setMessageModal] = useState({ isOpen: false, lead: null });
  const [messageText, setMessageText] = useState("");
  const selectAllRef = useRef(null);
  const [assignEmployeeModal, setAssignEmployeeModal] = useState({ isOpen: false, lead: null });
  const [selectedEmployeeForAssign, setSelectedEmployeeForAssign] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEmployees = employees.filter(emp =>
    (emp.fullName || emp.name || "").toLowerCase().includes(employeeSearchQuery.toLowerCase())
  );

  const statuses = ["All", "Follow Up", "Interested", "Connected", "Not Connected"];

  // Fetch all active employees
  const fetchActiveEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/employee/allEmployee`);
      const result = await response.json();

      if (result.success && result.employees) {
        const activeEmployees = result.employees.filter(
          (emp) => emp.accountActive === true && emp.role === "Employee"
        );
        setEmployees(activeEmployees);

        if (activeEmployees.length > 0) {
          // setSelectedEmployee(activeEmployees[0]);
          // fetchEmployeeLeads(activeEmployees[0]._id);
          // if (typeof onEmployeeSelect === "function") onEmployeeSelect(); // Removed to prevent setting undefined
        } else {
          setError("No active employees found");
        }
      } else {
        setError("Failed to fetch employees: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Error fetching active employees: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Compute stats for selected employee leads (locally from leads array)
  const computeEmployeeStats = (leadsArray) => {
    setStats({
      totalLeads: leadsArray.length,
      convertedLeads: leadsArray.filter(l => l.leadStatus === 'Converted').length,
      inProgressLeads: leadsArray.filter(l => l.leadStatus === 'Hot' || l.leadStatus === 'Warm').length,
      pendingLeads: leadsArray.filter(l => !l.leadStatus || l.leadStatus === 'Cold').length,
    });
  };

  // Fetch leads for selected employee
  const fetchEmployeeLeads = async (employeeId) => {
    try {
      setLoadingLeads(true);
      let endpoint = "";
      console.log(employeeId);
      
      if (!employeeId) {
        endpoint = `${import.meta.env.VITE_API_URL}/employeelead/getAllEmployeeLead`;
      }
      else {
        endpoint = `${import.meta.env.VITE_API_URL}/employeelead/employee/${employeeId}`;
      }
      const response = await fetch(endpoint);
      const result = await response.json();

      let leadsData = [];
      if (result.success && result.leads) {
        leadsData = result.leads;
      } else if (result.data && Array.isArray(result.data)) {
        leadsData = result.data;
      } else if (Array.isArray(result)) {
        leadsData = result;
      }

      setLeads(leadsData);
      setSelectedLeads([]);
      setCurrentPage(1);
      computeEmployeeStats(leadsData);
    } catch (error) {
      console.error("Error fetching employee leads:", error);
      setLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  };

  // Filter leads by status and date range, then sort by latest first
  useEffect(() => {
    let filtered = leads;

    // Filter by status
    if (selectedStatus !== "All") {
      filtered = filtered.filter(
        (lead) =>
          lead.status?.toLowerCase() === selectedStatus.toLowerCase() ||
          lead.leadStatus?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Filter by date range
    if (fromDate || toDate) {
      filtered = filtered.filter((lead) => {
        const leadDate = new Date(lead.createdAt);
        if (fromDate && toDate) {
          return leadDate >= new Date(fromDate) && leadDate <= new Date(toDate);
        } else if (fromDate) {
          return leadDate >= new Date(fromDate);
        } else if (toDate) {
          return leadDate <= new Date(toDate);
        }
        return true;
      });
    }

    // Sort by latest first (createdAt descending)
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    setFilteredLeads(filtered);
    setCurrentPage(1);
  }, [selectedStatus, leads, fromDate, toDate]);

  useEffect(() => {
    console.log(selectedEmployee);
    console.log(selectedEmployeeId);
    
      fetchEmployeeLeads(selectedEmployeeId);
  }, [selectedEmployeeId]);

  // Pagination
  const visibleLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const someVisibleSelected = visibleLeads.some((l) =>
    selectedLeads.includes(l._id)
  );
  const allVisibleSelected = visibleLeads.length > 0 && visibleLeads.every((l) =>
    selectedLeads.includes(l._id)
  );

  // Select all checkbox handler
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.checked = allVisibleSelected;
      selectAllRef.current.indeterminate = someVisibleSelected && !allVisibleSelected;
    }
  }, [someVisibleSelected, allVisibleSelected]);

  const handleSelectAllVisible = (e) => {
    const visibleIds = visibleLeads.map((l) => l._id);
    if (e.target.checked) {
      setSelectedLeads((prev) => [
        ...new Set([...prev, ...visibleIds]),
      ]);
    } else {
      setSelectedLeads((prev) =>
        prev.filter((id) => !visibleIds.includes(id))
      );
    }
  };

  const handleLeadCheck = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    const employee = employees.find((emp) => emp._id === employeeId);
    setSelectedEmployee(employee);
    fetchEmployeeLeads(employeeId);
    setSelectedStatus("All");
    if (typeof onEmployeeSelect === "function") onEmployeeSelect(employeeId);
  };

  const handleAddMessage = (lead) => {
    setMessageModal({ isOpen: true, lead });
    setMessageText("");
  };

  const handleStatusChange = async (leadId, newStatus) => {
    if (!newStatus) return;

    // If Follow Up, open message modal first
    if (newStatus === "Follow Up") {
      const lead = leads.find((l) => l._id === leadId);
      setPendingStatus({ leadId, newStatus });
      setMessageModal({ isOpen: true, lead });
      return;
    }

    setStatusSavingId(leadId);
    try {
      const endpoint = `${import.meta.env.VITE_API_URL}/employeelead/${leadId}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadInterestStatus: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setLeads((prev) => prev.map((lead) => (lead._id === leadId ? { ...lead, leadInterestStatus: newStatus } : lead)));
    } catch (err) {
      console.error("Error updating lead status:", err);
      alert("Failed to update lead status: " + err.message);
    } finally {
      setStatusSavingId(null);
    }
  };

  const handleSendMessage = async (leadId) => {
    if (!messageText.trim()) return alert("Please enter a message");
    try {
      const endpoint = `${import.meta.env.VITE_API_URL}/employeelead/${leadId}/message`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      if (!res.ok) throw new Error("Failed to send message");

      // If there was a pending status (Follow Up), save it now
      if (pendingStatus && pendingStatus.leadId === leadId) {
        await fetch(`${import.meta.env.VITE_API_URL}/employeelead/${leadId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadInterestStatus: pendingStatus.newStatus }),
        });
        setLeads((prev) => prev.map((lead) => (lead._id === leadId ? { ...lead, leadInterestStatus: pendingStatus.newStatus } : lead)));
        setPendingStatus(null);
      }

      setMessageModal({ isOpen: false, lead: null });
      setMessageText("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message: " + err.message);
    }
  };

  const handleView = (lead) => setViewLead(lead);
  const handleEdit = (lead) => setEditLead(lead);
  
  const closeModal = () => {
    setViewLead(null);
    setEditLead(null);
  };

  const handleUpdateLead = async (data) => {
    if (!editLead) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employeelead/${editLead._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update lead");
      }
      setLeads((prev) =>
        prev.map((lead) => (lead._id === editLead._id ? { ...lead, ...data } : lead))
      );
      setEditLead(null);
    } catch (err) {
      console.error("Error updating lead:", err);
      throw err;
    }
  };

  // View Lead Modal
  const ViewLeadModal = ({ lead }) => {
    if (!lead) return null;
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Lead Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-semibold">{lead.leadName || lead.name || "-"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-semibold">{lead.email || "-"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="font-semibold">{lead.phoneNumber || lead.phone || "-"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">WhatsApp No</p>
                <p className="font-semibold">{lead.whatsAppNo || "-"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="font-semibold">{lead.status || lead.leadStatus || "-"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Value</p>
                <p className="font-semibold">₹{lead.value || 0}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Destination</p>
                <p className="font-semibold">{lead.destination || "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Notes</p>
                <p className="font-semibold">{lead.notes || "-"}</p>
              </div>
            </div>
            <button onClick={closeModal} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchActiveEmployees();
  }, []);

  return (
    <div className="w-full">
      {/* Employee Selection Dropdown */}
      <section className="px-8 pt-6 pb-6 bg-white/80 border-b border-slate-100 rounded-t-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Employee</h2>
            <p className="text-sm text-gray-600">Choose an employee to view their assigned leads</p>
          </div>

          <div className="w-full sm:w-auto" ref={dropdownRef}>
            <div className="relative inline-block w-full sm:w-80">
              <input
                type="text"
                placeholder={employees.length === 0 ? "No active employees" : "Search employee..."}
                value={employeeSearchQuery}
                onChange={(e) => {
                  setEmployeeSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                disabled={employees.length === 0}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200"
              />
              <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
              
              {showDropdown && employees.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <li
                        key={emp._id}
                        onClick={() => {
                          setEmployeeSearchQuery(emp.fullName || emp.name || "");
                          handleEmployeeChange({ target: { value: emp._id } });
                          setShowDropdown(false);
                        }}
                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${selectedEmployee?._id === emp._id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                      >
                        {emp.fullName || emp.name}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">No employees found</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>

        {selectedEmployee && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">
              Selected: <span className="font-bold">{selectedEmployee.fullName}</span>
              {selectedEmployee.designation && (
                <> • {typeof selectedEmployee.designation === 'object' ? selectedEmployee.designation.title || selectedEmployee.designation.designation || 'Unknown' : selectedEmployee.designation}</>
              )}
            </p>
          </div>
        )}
      </section>

      {error && (
        <div className="mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {/* <section className="px-8 pt-8 pb-4 bg-white/95">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Lead Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <EmployeeOwnLeadCards stats={stats} loading={loadingStats} />
        </div>
      </section> */}

      {/* Status & Date Range Filters */}
      <section className="px-8 pt-4 pb-4 bg-white/95">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
            <label className="text-sm font-medium text-gray-700">Date Range:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="From Date"
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500 hidden sm:inline">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="To Date"
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {(fromDate || toDate) && (
              <button
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
                className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Employee Leads Table */}
      <section className="px-8 pt-4 pb-8 bg-white/95">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Assigned Leads</h3>

        {loadingLeads ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-gray-600 font-medium">No leads found</p>
          </div>
        ) : (
          <>
            <div className="mt-4">
              {/* Desktop Table View */}
              <div className="hidden md:block rounded-3xl shadow-lg border border-gray-200 overflow-x-auto bg-white/90">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact Information</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Departure</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Destination</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Travel Date</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                      {localStorage.getItem("role") && (localStorage.getItem("role").toLowerCase() === "superadmin") && (
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Assign to</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-blue-50 transition-colors group">
                        <td className="px-6 py-3 border-b border-gray-100 text-gray-700">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-900 text-base leading-tight">{lead.leadName || lead.name || "—"}</span>
                            <span className="text-sm text-slate-600">{lead.email || "—"}</span>
                            <span className="text-xs text-slate-400">{lead.phoneNumber || lead.phone || "—"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 border-b border-gray-100 text-gray-700">{lead.departureCity || "—"}</td>
                        <td className="px-6 py-3 border-b border-gray-100 text-gray-700">{lead.destination || "—"}</td>
                        <td className="px-6 py-3 border-b border-gray-100 text-gray-700">{lead.expectedTravelDate ? new Date(lead.expectedTravelDate).toLocaleDateString() : "—"}</td>
                        <td className="px-6 py-3 border-b border-gray-100 text-center">
                          <div className="flex justify-center gap-2 flex-col sm:flex-row">
                            <div className="flex flex-col justify-center gap-2">
                                <div>
                                  <button onClick={() => handleView(lead)} className="p-2 mx-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm transition-all" title="View Lead"><Eye size={16} /></button>
                                  <button onClick={() => handleEdit(lead)} className="p-2 mx-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 shadow-sm transition-all" title="Edit Lead"><Edit2 size={16} /></button>
                                  <button onClick={() => handleAddMessage(lead)} className="p-2 mx-1 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 shadow-sm transition-all" title="Add Message"><MessageSquare size={16} /></button>
                                </div>
                              <div className="flex justify-center">
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <select
                                    value={lead.leadInterestStatus || ""}
                                    onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                    disabled={statusSavingId === lead._id}
                                    className={`px-3 py-1.5 rounded-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 cursor-pointer transition-all ${statusSavingId === lead._id ? 'bg-blue-50 border-blue-400 text-gray-600 cursor-not-allowed opacity-70' : 'border border-gray-200'} ${lead.leadInterestStatus ? 'font-semibold text-blue-600' : 'text-gray-500'}`}
                                  >
                                    <option value="">Select Status</option>
                                    <option value="Interested">Interested</option>
                                    <option value="Not Interested">Not Interested</option>
                                    <option value="Connected">Connected</option>
                                    <option value="Not Connected">Not Connected</option>
                                    <option value="Follow Up">Follow Up</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        {localStorage.getItem("role") && (localStorage.getItem("role").toLowerCase() === "superadmin") && (
                          <td className="px-6 py-3 border-b border-gray-100 text-center">
                            <select
                              value={lead.assignedEmployee || ""}
                              onChange={(e) => {
                                if (e.target.value) {
                                  setAssignEmployeeModal({ isOpen: true, lead });
                                  setSelectedEmployeeForAssign(e.target.value);
                                }
                              }}
                              className="px-3 py-1.5 rounded-full text-sm bg-green-50 border border-gray-200"
                            >
                              <option value="">{lead.assignedEmployee ? 'Reassign' : 'Assign to Employee'}</option>
                              {employees.map((emp) => (
                                <option key={emp._id} value={emp._id}>{emp.fullName || emp.name || 'Unknown'}</option>
                              ))}
                            </select>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden bg-slate-50 p-4 space-y-4 rounded-xl border border-slate-200">
                {visibleLeads.map((lead) => (
                  <div key={lead._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-900 text-base leading-tight">{lead.leadName || lead.name || "—"}</span>
                        <span className="text-xs text-slate-500 font-medium">{lead.email || "—"}</span>
                        <span className="text-xs text-slate-400">{lead.phoneNumber || lead.phone || "—"}</span>
                      </div>
                      <select
                        value={lead.leadInterestStatus || ""}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        disabled={statusSavingId === lead._id}
                        className={`max-w-[130px] px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider focus:ring-2 focus:ring-blue-400 cursor-pointer transition-all ${statusSavingId === lead._id ? 'bg-blue-50 border-blue-400 text-gray-600 cursor-not-allowed opacity-70' : 'border border-gray-200'} ${lead.leadInterestStatus ? 'text-blue-700 bg-blue-50' : 'text-gray-500 bg-gray-50'}`}
                      >
                        <option value="">Status</option>
                        <option value="Interested">Interested</option>
                        <option value="Not Interested">Not Interested</option>
                        <option value="Connected">Connected</option>
                        <option value="Not Connected">Not Connected</option>
                        <option value="Follow Up">Follow Up</option>
                      </select>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Destination</span>
                        <span className="font-medium text-slate-700">{lead.destination || "—"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Departure</span>
                        <span className="font-medium text-slate-700">{lead.departureCity || "—"}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block mb-0.5">Travel Date</span>
                        <span className="font-medium text-slate-800">{lead.expectedTravelDate ? new Date(lead.expectedTravelDate).toLocaleDateString() : "—"}</span>
                      </div>
                    </div>

                    {localStorage.getItem("role") && (localStorage.getItem("role").toLowerCase() === "superadmin") && (
                      <div className="mt-1">
                        <span className="text-xs text-slate-400 block mb-1">Assign Employee</span>
                        <select
                          value={lead.assignedEmployee || ""}
                          onChange={(e) => {
                            if (e.target.value) {
                              setAssignEmployeeModal({ isOpen: true, lead });
                              setSelectedEmployeeForAssign(e.target.value);
                            }
                          }}
                          className="w-full px-3 py-2 rounded-lg text-sm bg-green-50 border border-green-100"
                        >
                          <option value="">{lead.assignedEmployee ? 'Reassign' : 'Assign to Employee'}</option>
                          {employees.map((emp) => (
                            <option key={emp._id} value={emp._id}>{emp.fullName || emp.name || 'Unknown'}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex gap-2 mt-2 pt-3 border-t border-slate-100">
                      <button onClick={() => handleView(lead)} className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 py-2 rounded-lg font-medium text-xs hover:bg-blue-100 transition">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button onClick={() => handleEdit(lead)} className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg font-medium text-xs hover:bg-green-100 transition">
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => handleAddMessage(lead)} className="flex-1 flex items-center justify-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 py-2 rounded-lg font-medium text-xs hover:bg-purple-100 transition">
                        <MessageSquare className="w-3.5 h-3.5" /> MSG
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {Math.min((currentPage - 1) * pageSize + 1, filteredLeads.length || 0)} to{" "}
                {Math.min(currentPage * pageSize, filteredLeads.length || 0)} of {filteredLeads.length || 0} leads
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white border border-gray-300 hover:border-gray-400"
                    }`}
                >
                  Previous
                </button>
                <div className="text-sm">
                  Page {currentPage} of {Math.max(1, Math.ceil((filteredLeads.length || 0) / pageSize))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(
                        Math.max(1, Math.ceil((filteredLeads.length || 0) / pageSize)),
                        p + 1
                      )
                    )
                  }
                  disabled={currentPage >= Math.ceil((filteredLeads.length || 0) / pageSize)}
                  className={`px-3 py-1 rounded ${currentPage >= Math.ceil((filteredLeads.length || 0) / pageSize)
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white border border-gray-300 hover:border-gray-400"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Modals */}
        {viewLead && <ViewLeadModal lead={viewLead} />}
        
        {/* Edit Lead Modal */}
        {editLead && (
          <Modal isOpen={true} onClose={closeModal} size="large">
            <div className="flex flex-col h-full max-h-[95vh]">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Edit Lead</h2>
                <button onClick={closeModal} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <EditLeadForm
                  initialData={editLead}
                  onSubmit={handleUpdateLead}
                  onClose={closeModal}
                />
              </div>
            </div>
          </Modal>
        )}

        {messageModal.isOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setMessageModal({ isOpen: false, lead: null })}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Send Message</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-2">To: <span className="font-semibold">{messageModal.lead?.name || messageModal.lead?.leadName || "-"}</span></p>
                <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={5} className="w-full px-3 py-2 border rounded mb-3" placeholder="Type your message..." />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setMessageModal({ isOpen: false, lead: null })} className="px-4 py-2 rounded bg-gray-100">Cancel</button>
                  <button onClick={() => handleSendMessage(messageModal.lead._id)} className="px-4 py-2 rounded bg-blue-600 text-white">Send</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {assignEmployeeModal.isOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setAssignEmployeeModal({ isOpen: false, lead: null })}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Assign Lead to Employee</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-2">Lead: <span className="font-semibold">{assignEmployeeModal.lead?.name || assignEmployeeModal.lead?.leadName || '-'}</span></p>
                <div className="mb-4">
                  <select value={selectedEmployeeForAssign} onChange={(e) => setSelectedEmployeeForAssign(e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="">Select employee</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.fullName || emp.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setAssignEmployeeModal({ isOpen: false, lead: null })} className="px-4 py-2 rounded bg-gray-100">Cancel</button>
                  <button onClick={async () => {
                    if (!selectedEmployeeForAssign) return alert('Please select an employee');
                    try {
                      const res = await fetch(`${import.meta.env.VITE_API_URL}/employeelead/${assignEmployeeModal.lead._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ employee: selectedEmployeeForAssign }),
                      });
                      if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        throw new Error(err.message || 'Failed to assign lead');
                      }
                      alert('Lead assigned successfully');
                      await fetchEmployeeLeads(selectedEmployee?._id);
                      setAssignEmployeeModal({ isOpen: false, lead: null });
                      setSelectedEmployeeForAssign('');
                    } catch (err) {
                      console.error('Error assigning lead:', err);
                      alert('Failed to assign lead: ' + err.message);
                    }
                  }} className="px-4 py-2 rounded bg-blue-600 text-white">Assign</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default EmployeeOwnLeads;
