import React, { useState, useEffect } from "react";
import { Eye, Move, FileUp, CheckCircle, X, Trash2 } from "lucide-react";

const CreateCustomer = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    groupNo: "",
    email: "",
    address: "",
  });

  const [transferLeads, setTransferLeads] = useState([]);
  const [b2bTransferLeads, setB2bTransferLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("create"); // "create", "transfer", or "b2b-transfer"
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadSource, setLeadSource] = useState(null); // "transfer" or "b2b-transfer"
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [uploadPeople, setUploadPeople] = useState([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [personDocs, setPersonDocs] = useState({});
  const [keptExistingIds, setKeptExistingIds] = useState([]);
  const [viewingFile, setViewingFile] = useState(null);

  // Fetch employee ID from localStorage on mount
  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employeeId");
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
      console.log("Employee ID loaded:", storedEmployeeId);
    }
  }, []);

  // Fetch transfer leads when tab changes or employeeId updates
  useEffect(() => {
    if (activeTab === "transfer") {
      fetchTransferLeads();
    } else if (activeTab === "b2b-transfer") {
      fetchB2bOperationLeads();
    }
  }, [activeTab]);

  const fetchTransferLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all transfer leads
      const response = await fetch(`http://localhost:4000/employeelead/transfer/all`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Transfer leads fetched:", data);
      setTransferLeads(data.data || []);
    } catch (err) {
      console.error("Failed to fetch transfer leads:", err);
      setError(err.message || "Failed to fetch transfer leads");
      setTransferLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchB2bOperationLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all B2B operation leads
      const response = await fetch(`http://localhost:4000/b2b-operation-leads/`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("B2B operation leads fetched:", data);
      setB2bTransferLeads(data.data || data || []);
    } catch (err) {
      console.error("Failed to fetch B2B operation leads:", err);
      setError(err.message || "Failed to fetch B2B operation leads");
      setB2bTransferLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTransferLead = (lead) => {
    setForm({
      name: lead.name || "",
      phone: lead.phone || "",
      groupNo: lead.groupNo || "",
      email: lead.email || "",
      address: lead.destination || "",
    });
    setActiveTab("create");
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

  const handleMoveLead = (lead) => {
    console.log('🎯 handleMoveLead called with lead:', lead);
    // Fetch the full operation lead (including documents) before opening modal
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/employeelead/transfer/all');
        if (!res.ok) {
          console.warn('Could not fetch full transfer leads, opening modal with provided lead');
          setSelectedLead(lead);
          setMoveModalOpen(true);
          return;
        }
        const data = await res.json();
        // console.log(data);
        
        const opLeads = data.data || [];
        const opLead = opLeads.find(l => l._id === lead._id || l._id === lead.id) || lead;
        console.log('🎯 Found operation lead:', opLead);

        // If employee is an id, try to fetch employee details (reuse logic from view)
        if (opLead.employee && typeof opLead.employee === 'string') {
          try {
            const empRes = await fetch(`http://localhost:4000/employee/${opLead.employee}`);
            if (empRes.ok) {
              const empData = await empRes.json();
              opLead.employee = empData.data || empData;
            }
          } catch (e) {
            // ignore employee fetch errors
          }
        }

        console.log('🎯 Setting selectedLead and opening modal:', opLead);
        setSelectedLead(opLead);
        setMoveModalOpen(true);
      } catch (err) {
        console.error('Error fetching operation lead for move modal:', err);
        setSelectedLead(lead);
        setMoveModalOpen(true);
      }
    })();
  };

  // Open edit modal and populate editForm
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
        expectedTravelDate: selectedLead.expectedTravelDate ? new Date(selectedLead.expectedTravelDate).toISOString().slice(0,10) : "",
        
        // Passenger info
        noOfPerson: selectedLead.noOfPerson || "",
        noOfChild: selectedLead.noOfChild || "",
        placesToCoverArray: selectedLead.placesToCover ? selectedLead.placesToCover.split(",").map(p=>p.trim()) : (selectedLead.placesToCoverArray || []),
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

  const handleUploadDocuments = async (lead) => {
    setSelectedLead(lead);
    setUploadPeople([]);
    setNewPersonName("");
    setPersonDocs({});
    setUploadedFiles({});

    try {
      console.log('Fetching existing operation lead documents for lead:', lead._id);
      // Fetch all transfer leads and find this one (no GET by id route available)
      const res = await fetch(`http://localhost:4000/employeelead/transfer/all`);
      if (!res.ok) {
        console.warn('Could not fetch transfer leads, opening empty upload modal');
        setUploadModalOpen(true);
        return;
      }

      const data = await res.json();
      const opLeads = data.data || [];
      const opLead = opLeads.find(l => l._id === lead._id || l._id === lead.id);

      if (!opLead || !opLead.documents || opLead.documents.length === 0) {
        console.log('No pre-stored documents for this lead.');
        setUploadModalOpen(true);
        return;
      }

      // Build people and personDocs from stored documents
      const personsMap = {};
      const personDocsInit = {};
      const existingIds = [];

      opLead.documents.forEach(doc => {
        const pid = doc.personId || `p-${Math.random().toString(36).slice(2,9)}`;
        const dtype = doc.documentType || 'unknown';

        if (!personsMap[pid]) personsMap[pid] = doc.personName || `Person ${pid}`;

        if (!personDocsInit[pid]) {
          personDocsInit[pid] = {
            birthCertificate: null,
            aadhar: null,
            panCard: null,
            passport: null,
            photo: null,
          };
        }

        // Map known docType keys to our UI slots (prefer pan then aadhar)
        const lowered = String(dtype).toLowerCase();
        let mapKey = dtype;
        if (lowered.includes('pan')) mapKey = 'panCard';
        else if (lowered.includes('aadhar')) mapKey = 'aadhar';
        else mapKey = dtype;

        personDocsInit[pid][mapKey] = {
          name: doc.fileName || doc.documentName || `${mapKey}`,
          url: doc.fileUrl || doc.file_url || null,
          type: doc.fileType || 'application/octet-stream',
          fileType: doc.fileType || 'application/octet-stream',
          cloudinaryPublicId: doc.cloudinaryPublicId || doc.publicId || null,
          isExisting: true,
        };
        if (doc.cloudinaryPublicId || doc.publicId) existingIds.push(doc.cloudinaryPublicId || doc.publicId);
      });

      const peopleArray = Object.keys(personsMap).map(id => ({ id, name: personsMap[id] }));
      console.log('Prefilling upload modal with people:', peopleArray, 'personDocs:', personDocsInit, 'existingIds:', existingIds);
      setUploadPeople(peopleArray);
      setPersonDocs(personDocsInit);
      setKeptExistingIds([...new Set(existingIds.filter(Boolean))]);
      setUploadModalOpen(true);
    } catch (err) {
      console.error('Error fetching existing documents:', err);
      setUploadModalOpen(true);
    }
  };

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      const personId = Date.now().toString();
      setUploadPeople([...uploadPeople, { id: personId, name: newPersonName }]);
      setPersonDocs({
        ...personDocs,
        [personId]: {
          birthCertificate: null,
          aadhar: null,
          panCard: null,
          passport: null,
          photo: null,
        },
      });
      setNewPersonName("");
    }
  };

  const handlePersonDocUpload = (personId, docType, file) => {
    setPersonDocs({
      ...personDocs,
      [personId]: {
        ...personDocs[personId],
        [docType]: file,
      },
    });
    
    // Store file with metadata
    const fileKey = `${personId}-${docType}`;
    setUploadedFiles({
      ...uploadedFiles,
      [fileKey]: {
        file,
        docType,
        personId,
        uploadTime: new Date().toLocaleString(),
      },
    });
  };

  const handleRemoveDoc = async (personId, docType) => {
    console.log(`Removing ${docType} for person ${personId}`);

    const existing = personDocs[personId] && personDocs[personId][docType] && personDocs[personId][docType].isExisting;

    if (existing) {
      const docMeta = personDocs[personId][docType];
      const cloudinaryPublicId = docMeta.cloudinaryPublicId;
      const leadId = selectedLead?._id || selectedLead?.id;

      if (!cloudinaryPublicId || !leadId) {
        console.warn('Missing cloudinaryPublicId or leadId; falling back to local removal');
      } else {
        const confirmDel = window.confirm('This will permanently remove the stored document. Continue?');
        if (!confirmDel) return;

        try {
          const res = await fetch('http://localhost:4000/employeelead/document', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadId, cloudinaryPublicId }),
          });

          const resJson = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(resJson.message || `Server returned ${res.status}`);
          }

          console.log('Document deleted on server:', resJson);

          // Remove id from keptExistingIds so submit won't re-add it
          setKeptExistingIds(prev => prev.filter(id => id !== cloudinaryPublicId));
        } catch (err) {
          console.error('Error deleting document on server:', err);
          alert(`Failed to delete stored document: ${err.message}`);
          return;
        }
      }
    }

    // Local removal (for both new and existing files after server delete)
    const updatedPerson = { ...personDocs[personId] };
    delete updatedPerson[docType];

    const newPersonDocs = {
      ...personDocs,
      [personId]: updatedPerson,
    };
    setPersonDocs(newPersonDocs);

    const fileKey = `${personId}-${docType}`;
    const updatedFiles = { ...uploadedFiles };
    delete updatedFiles[fileKey];
    setUploadedFiles(updatedFiles);

    // Clear the file input element if present
    const docTypeMap = {
      'birthCertificate': 'birthCert',
      'aadhar': 'aadhar',
      'panCard': 'pan',
      'passport': 'passport',
      'photo': 'photo',
    };
    const inputId = `${docTypeMap[docType] || docType}-${personId}`;
    setTimeout(() => {
      const fileInput = document.getElementById(inputId);
      if (fileInput) fileInput.value = '';
    }, 0);

    console.log('Removed. Updated personDocs:', newPersonDocs);
  };

  const handleDownloadPDF = async (url, fileName) => {
    try {
      console.log('Starting download from:', url);
      
      // Method 1: Try using fetch with proper headers
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      if (!response.ok) {
        console.error('Fetch failed with status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log('Blob created, size:', blob.size, 'type:', blob.type);
      
      if (blob.size === 0) {
        console.warn('Blob is empty, trying alternative download method...');
        throw new Error('Empty blob');
      }
      
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = fileName || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);
      
      console.log('Download completed successfully');
    } catch (error) {
      console.error('Download failed with fetch, trying XMLHttpRequest:', error);
      
      // Method 2: Fallback using XMLHttpRequest
      try {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        
        xhr.onload = () => {
          if (xhr.status === 200) {
            const blob = xhr.response;
            if (blob.size > 0) {
              const urlBlob = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = urlBlob;
              link.download = fileName || 'document.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(urlBlob);
              console.log('Download completed with XMLHttpRequest');
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
        console.error('XMLHttpRequest also failed, opening in new tab:', xhrError);
        window.open(url, '_blank');
      }
    }
  };

  const handleViewDoc = (file) => {
    if (!file) {
      console.warn('File is null or undefined');
      return;
    }
    console.log('Viewing file:', file);
    setViewingFile(file);
  };

  const handleRemovePerson = async (personId) => {
    // Safely remove a single person and only their related data
    try {
      const docs = personDocs[personId] || {};

      // Collect existing cloudinary public ids for this person (if any)
      const existingIds = Object.values(docs).reduce((acc, d) => {
        if (d && d.isExisting) {
          const idCandidate = d.cloudinaryPublicId || d.publicId || d.public_id || d.cloudinary_public_id || d.id || d._id || null;
          if (idCandidate) acc.push(String(idCandidate));
        }
        return acc;
      }, []);

      if (existingIds.length > 0) {
        const confirmDel = window.confirm('This will permanently remove the stored documents for this person. Continue?');
        if (!confirmDel) return;

        const leadId = selectedLead?._id || selectedLead?.id;
        if (!leadId) {
          alert('No lead selected; cannot delete stored documents.');
          return;
        }

        // Delete each existing document on server (fire in parallel)
        await Promise.all(existingIds.map(id =>
          fetch('http://localhost:4000/employeelead/document', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadId, cloudinaryPublicId: id }),
          })
          .then(async res => {
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.message || `Delete failed with ${res.status}`);
            return json;
          })
        ));

        // Remove these ids from keptExistingIds (string-safe compare)
        setKeptExistingIds(prev => prev.filter(pid => !existingIds.includes(String(pid))));
      }

      // Remove person from uploadPeople by strict string comparison to avoid type mismatch
      setUploadPeople(prev => prev.filter(p => String(p.id) !== String(personId)));

      // Remove only this person's docs from personDocs
      setPersonDocs(prev => {
        const copy = { ...prev };
        delete copy[personId];
        return copy;
      });

      // Clean uploadedFiles entries that belong to this person
      setUploadedFiles(prev => {
        const copy = { ...prev };
        Object.keys(copy).forEach(k => {
          if (k.startsWith(`${personId}-`)) delete copy[k];
        });
        return copy;
      });

      console.log('Removed person', personId, 'existingIds:', existingIds);
    } catch (err) {
      console.error('handleRemovePerson error for', personId, err);
      alert('Failed to remove person. See console for details.');
    }
  };

  const handleMoveLeadConfirm = () => {
    (async () => {
      if (!selectedLead) {
        alert('No lead selected');
        return;
      }

      // Robust lead id detection (some objects may have `id` instead of `_id`)
      const leadId = selectedLead._id || selectedLead.id || selectedLead.originalLeadId;
      console.log('handleMoveLeadConfirm - selectedLead id candidates:', { _id: selectedLead._id, id: selectedLead.id, originalLeadId: selectedLead.originalLeadId });

      if (!leadId) {
        alert('Cannot determine lead id for move operation. See console.');
        console.error('handleMoveLeadConfirm - missing lead id on selectedLead:', selectedLead);
        return;
      }

      // Use AbortController to time out the request and add a retry with a ping check
      const makeMoveRequest = async (signal) => {
        return fetch(`http://localhost:4000/employeelead/move-to-customer/${leadId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal,
        });
      };

      const pingServer = async () => {
        try {
          const r = await fetch('http://localhost:4000/ping', { method: 'GET', mode: 'cors' });
          return r.ok;
        } catch (e) {
          return false;
        }
      };

      try {
        console.log('Sending move-to-customer request for leadId:', leadId);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

        let res;
        try {
          res = await makeMoveRequest(controller.signal);
        } finally {
          clearTimeout(timeout);
        }

        if (!res) throw new Error('No response (request aborted or network error)');

        console.log('Move response status:', res.status);
        const data = await res.json().catch(() => ({}));
        console.log('Move response body:', data);

        if (!res.ok) {
          const msg = data && data.message ? data.message : `Server returned ${res.status}`;
          throw new Error(msg);
        }

        alert('Lead moved to Customer Data successfully');
        setMoveModalOpen(false);
        fetchTransferLeads();
      } catch (err) {
        console.error('Move lead failed:', err);
        console.error('Move lead error name:', err && err.name);
        console.error('Move lead error message:', err && err.message);
        console.error('Move lead error stack:', err && err.stack);

        // If network-level failure, try pinging server to distinguish CORS/connection issues
        if (err.name === 'AbortError' || err.message === 'Failed to fetch' || err.message.includes('No response')) {
          const serverUp = await pingServer();
          if (serverUp) {
            // Server reachable but fetch failed - likely CORS or browser block
            alert('Failed to move lead: network blocked by browser/CORS. Server reachable via /ping. Check browser console and server CORS settings.');
          } else {
            alert('Failed to move lead: server appears unreachable. Please check backend (nodemon) and try again.');
          }
        } else {
          alert(`Failed to move lead: ${err && (err.message || String(err))}`);
        }
      }
    })();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Customer saved:", data);
      alert("Customer saved!");

      // Reset form after successful submission
      setForm({
        name: "",
        phone: "",
        groupNo: "",
        email: "",
        address: "",
      });
    } catch (error) {
      console.error("Failed to save customer:", error);
      alert("Failed to save customer. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-8xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Customer Creation</h2>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 font-medium ${
            activeTab === "create"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Create Customer
        </button>
        <button
          onClick={() => setActiveTab("transfer")}
          className={`px-4 py-2 font-medium ${
            activeTab === "transfer"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Transfer Leads 
          {/* ({transferLeads.length}) */}
        </button>
        <button
          onClick={() => setActiveTab("b2b-transfer")}
          className={`px-4 py-2 font-medium ${
            activeTab === "b2b-transfer"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          B2B Transfer Leads
          {/* ({b2bTransferLeads.length}) */}
        </button>
      </div>

      {/* Create Customer Tab */}
      {activeTab === "create" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ROW 1: Name + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* ROW 2: Group No + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Group No</label>
              <input
                type="text"
                name="groupNo"
                value={form.groupNo}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Enter group number"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* ROW 3: Address Full Width */}
          <div>
            <label className="block mb-1 font-medium">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              className="w-full border p-2 rounded"
              placeholder="Enter full address"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Submit
          </button>
        </form>
      )}

      {/* Transfer Leads Tab */}
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
                          <button
                            onClick={() => { setSelectedLead(lead); setEditModalOpen(true); }}
                            className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition flex items-center justify-center"
                            title="Edit Lead"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6L21 11l-6-6-6 6z" />
                            </svg>
                          </button>

                          {/* Upload Documents Button */}
                          <button
                            onClick={() => handleUploadDocuments(lead)}
                            className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition flex items-center justify-center"
                            title="Upload Documents"
                          >
                            <FileUp size={18} />
                          </button>

                          {/* Move Button */}
                          <button
                            type="button"
                            onClick={() => handleMoveLead(lead)}
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition flex items-center justify-center"
                            title="Move Lead"
                          >
                            <Move size={18} />
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
      )}

      {/* B2B Transfer Leads Tab */}
      {activeTab === "b2b-transfer" && (
        <div>
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading B2B operation leads...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-700">Error: {error}</p>
            </div>
          )}

          {!loading && b2bTransferLeads.length === 0 && !error && (
            <div className="text-center py-8">
              <p className="text-gray-500">No B2B operation leads available</p>
            </div>
          )}

          {!loading && b2bTransferLeads.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Reference ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Company Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Destination</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Passengers</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {b2bTransferLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium text-blue-600">{lead.referenceId}</td>
                      <td className="border border-gray-300 px-4 py-2">{lead.companyName}</td>
                      <td className="border border-gray-300 px-4 py-2">{lead.email}</td>
                      <td className="border border-gray-300 px-4 py-2">{lead.phone}</td>
                      <td className="border border-gray-300 px-4 py-2">{lead.destination}</td>
                      <td className="border border-gray-300 px-4 py-2">{lead.noOfPerson || "-"}</td>
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
                          <button
                            onClick={() => { setSelectedLead(lead); setEditModalOpen(true); }}
                            className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition flex items-center justify-center"
                            title="Edit Lead"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6L21 11l-6-6-6 6z" />
                            </svg>
                          </button>

                          {/* Upload Documents Button */}
                          <button
                            onClick={() => handleUploadDocuments(lead)}
                            className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition flex items-center justify-center"
                            title="Upload Documents"
                          >
                            <FileUp size={18} />
                          </button>

                          {/* Move Button */}
                          <button
                            type="button"
                            onClick={() => handleMoveLead(lead)}
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition flex items-center justify-center"
                            title="Move Lead"
                          >
                            <Move size={18} />
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
      )}

      {/* View Modal (read-only form) */}
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

      {/* Edit Modal */}
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
                      onChange={(e)=>setEditForm(prev=>({...prev, departureCity: e.target.value}))} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Destination</label>
                    <input 
                      type="text" 
                      value={editForm.destination || ''} 
                      onChange={(e)=>setEditForm(prev=>({...prev, destination: e.target.value}))} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Expected Travel Date</label>
                    <input 
                      type="date" 
                      value={editForm.expectedTravelDate || ''} 
                      onChange={(e)=>setEditForm(prev=>({...prev, expectedTravelDate: e.target.value}))} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. of Days</label>
                    <input 
                      type="text" 
                      value={editForm.noOfDays || editForm.customNoOfDays || ''} 
                      onChange={(e)=>setEditForm(prev=>({...prev, noOfDays: e.target.value}))} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Places to Cover (comma separated)</label>
                    <input 
                      type="text" 
                      value={(editForm.placesToCoverArray && editForm.placesToCoverArray.join(', ')) || editForm.placesToCover || ''} 
                      onChange={(e)=>setEditForm(prev=>({...prev, placesToCoverArray: e.target.value.split(',').map(p=>p.trim())}))} 
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
                      onChange={(e)=>setEditForm(prev=>({...prev, noOfPerson: e.target.value}))} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">No. of Children</label>
                    <input 
                      type="number" 
                      value={editForm.noOfChild || ''} 
                      onChange={(e)=>setEditForm(prev=>({...prev, noOfChild: e.target.value}))} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Child Ages (comma separated)</label>
                    <input 
                      type="text" 
                      value={(editForm.childAges && editForm.childAges.join(', ')) || ''} 
                      onChange={(e)=>setEditForm(prev=>({...prev, childAges: e.target.value.split(',').map(v=>v.trim()).filter(Boolean)}))} 
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
                      onChange={(e)=>setEditForm(prev=>({...prev, groupNumber: e.target.value}))} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Status</label>
                    <select 
                      value={editForm.leadStatus || ''} 
                      onChange={(e)=>setEditForm(prev=>({...prev, leadStatus: e.target.value}))} 
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
                      onChange={(e)=>setEditForm(prev=>({...prev, leadSource: e.target.value}))} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Lead Type</label>
                    <input 
                      type="text" 
                      value={editForm.leadType || ''} 
                      onChange={(e)=>setEditForm(prev=>({...prev, leadType: e.target.value}))} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Trip Type</label>
                    <input 
                      type="text" 
                      value={editForm.tripType || ''} 
                      onChange={(e)=>setEditForm(prev=>({...prev, tripType: e.target.value}))} 
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
                    onChange={(e)=>setEditForm(prev=>({...prev, notes: e.target.value}))} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    placeholder="Add any additional notes..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={()=>setEditModalOpen(false)} 
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

      {/* Move Modal: show full lead details (same as view modal) and Confirm/Cancel */}
      {moveModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Move Lead</h3>
              <button onClick={() => setMoveModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {/* Employee Info Banner */}
            {selectedLead.employee ? (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-medium text-gray-700 mb-2">Transferred By:</p>
                <p className="text-sm text-gray-700">
                  <strong>Employee:</strong>{' '}
                  {typeof selectedLead.employee === 'object'
                    ? selectedLead.employee.fullName || selectedLead.employee.name || 'Unknown'
                    : selectedLead.employee}
                </p>
                {typeof selectedLead.employee === 'object' && selectedLead.employee.officialNo && (
                  <p className="text-sm text-gray-700">
                    <strong>Official Number:</strong> {selectedLead.employee.officialNo}
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
                <p className="text-sm text-gray-600">No transferring employee information available</p>
              </div>
            )}

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" value={selectedLead.name || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" value={selectedLead.email || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="text" value={selectedLead.phone || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                  <input type="text" value={selectedLead.whatsAppNo || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination</label>
                  <input type="text" value={selectedLead.destination || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Departure City</label>
                  <input type="text" value={selectedLead.departureCity || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expected Travel Date</label>
                  <input type="text" value={selectedLead.expectedTravelDate ? new Date(selectedLead.expectedTravelDate).toLocaleDateString() : ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">No. of Days</label>
                  <input type="text" value={selectedLead.noOfDays || selectedLead.customNoOfDays || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Places To Cover</label>
                <textarea rows={2} value={(selectedLead.placesToCoverArray && selectedLead.placesToCoverArray.join(", ")) || selectedLead.placesToCover || "-"} readOnly className="w-full border p-2 rounded bg-gray-50" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">No. of Persons</label>
                  <input type="text" value={selectedLead.noOfPerson || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">No. of Children</label>
                  <input type="text" value={selectedLead.noOfChild || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Child Ages</label>
                <input type="text" value={(selectedLead.childAges && selectedLead.childAges.length ? selectedLead.childAges.join(", ") : "-")} readOnly className="w-full border p-2 rounded bg-gray-50" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Group Number</label>
                  <input type="text" value={selectedLead.groupNumber || selectedLead.groupNo || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lead Status</label>
                  <input type="text" value={selectedLead.leadStatus || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lead Source</label>
                  <input type="text" value={selectedLead.leadSource || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lead Type</label>
                  <input type="text" value={selectedLead.leadType || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Trip Type</label>
                <input type="text" value={selectedLead.tripType || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea rows={4} value={selectedLead.notes || ""} readOnly className="w-full border p-2 rounded bg-gray-50" />
              </div>

              {selectedLead.documents && selectedLead.documents.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
                  <div className="space-y-3">
                    {(() => {
                      const grouped = {};
                      selectedLead.documents.forEach(d => {
                        const key = d.personId || d.personName || 'unknown';
                        if (!grouped[key]) grouped[key] = [];
                        grouped[key].push(d);
                      });

                      return Object.keys(grouped).map((key) => (
                        <div key={key} className="bg-gray-50 p-2 rounded border">
                          <div className="text-sm font-semibold mb-2">{grouped[key][0].personName || grouped[key][0].personId || `Person ${key}`}</div>
                          <div className="space-y-2">
                            {grouped[key].map((doc, i) => (
                              <div key={i} className="flex items-center justify-between p-2 bg-white border rounded">
                                <div className="min-w-0">
                                  <div className="text-sm font-medium truncate">{doc.documentType || 'Document'}</div>
                                  <div className="text-xs text-gray-600 truncate">{doc.fileName || doc.fileName}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button type="button" onClick={() => handleViewDoc({ name: doc.fileName, url: doc.fileUrl, fileType: doc.fileType, cloudinaryPublicId: doc.cloudinaryPublicId })} className="text-blue-600 text-sm">View</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button onClick={() => setMoveModalOpen(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">Cancel</button>
                <button onClick={handleMoveLeadConfirm} className="ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Documents Modal */}
      {uploadModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Upload Documents</h3>
            <p className="mb-4 text-gray-700">Upload documents for <strong>{selectedLead.name}</strong></p>

            {/* Add People Section */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add People</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
                  placeholder="Enter person name"
                  className="flex-1 border p-2 rounded text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddPerson}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                >
                  Add Person
                </button>
              </div>
            </div>

            {/* People and Documents */}
            {uploadPeople.length > 0 && (
              <div className="space-y-6">
                {uploadPeople.map((person) => (
                  <div key={person.id} className="p-4 bg-blue-50 border border-blue-200 rounded">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-800">{person.name}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemovePerson(person.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Birth Certificate */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Birth Certificate (Child - Optional)
                      </label>
                      <input
                        type="file"
                        id={`birthCert-${person.id}`}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handlePersonDocUpload(person.id, 'birthCertificate', e.target.files[0]);
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                      />
                      {personDocs[person.id]?.birthCertificate && (
                        <div className="mt-2 p-2 bg-white border border-green-200 rounded flex items-center justify-between">
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle size={16} /> {personDocs[person.id].birthCertificate.name}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewDoc(personDocs[person.id].birthCertificate)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDoc(person.id, 'birthCertificate')}
                              className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Aadhar */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Card</label>
                      <input
                        type="file"
                        id={`aadhar-${person.id}`}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handlePersonDocUpload(person.id, 'aadhar', e.target.files[0]);
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                      />
                      {personDocs[person.id]?.aadhar && (
                        <div className="mt-2 p-2 bg-white border border-green-200 rounded flex items-center justify-between">
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle size={16} /> {personDocs[person.id].aadhar.name}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewDoc(personDocs[person.id].aadhar)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDoc(person.id, 'aadhar')}
                              className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PAN Card */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card</label>
                      <input
                        type="file"
                        id={`pan-${person.id}`}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handlePersonDocUpload(person.id, 'panCard', e.target.files[0]);
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                      />
                      {personDocs[person.id]?.panCard && (
                        <div className="mt-2 p-2 bg-white border border-green-200 rounded flex items-center justify-between">
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle size={16} /> {personDocs[person.id].panCard.name}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewDoc(personDocs[person.id].panCard)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDoc(person.id, 'panCard')}
                              className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Passport */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Passport</label>
                      <input
                        type="file"
                        id={`passport-${person.id}`}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handlePersonDocUpload(person.id, 'passport', e.target.files[0]);
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                      />
                      {personDocs[person.id]?.passport && (
                        <div className="mt-2 p-2 bg-white border border-green-200 rounded flex items-center justify-between">
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle size={16} /> {personDocs[person.id].passport.name}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewDoc(personDocs[person.id].passport)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDoc(person.id, 'passport')}
                              className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Photo */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                      <input
                        type="file"
                        id={`photo-${person.id}`}
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handlePersonDocUpload(person.id, 'photo', e.target.files[0]);
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                      />
                      {personDocs[person.id]?.photo && (
                        <div className="mt-2 p-2 bg-white border border-green-200 rounded flex items-center justify-between">
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle size={16} /> {personDocs[person.id].photo.name}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewDoc(personDocs[person.id].photo)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDoc(person.id, 'photo')}
                              className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (uploadPeople.length === 0) {
                    alert("Please add at least one person");
                    return;
                  }

                  try {
                    console.log('=== SUBMIT DOCUMENTS START ===');
                    console.log('Upload people:', uploadPeople);
                    console.log('Person docs:', personDocs);

                    // Separate new files (need base64 conversion) from existing files (already have URLs)
                    const newFilesData = [];
                    let newFileCount = 0;
                    
                    Object.keys(personDocs).forEach(personId => {
                      const personDocTypes = personDocs[personId];
                      Object.keys(personDocTypes).forEach(docType => {
                        const file = personDocTypes[docType];
                        if (file && !file.isExisting) {
                          // Only collect new File objects, not existing ones
                          newFilesData.push({
                            file,
                            personId,
                            docType,
                            fileName: `${personId}-${docType}-${file.name}`
                          });
                          newFileCount++;
                        }
                      });
                    });

                    if (newFileCount === 0 && keptExistingIds.length === 0) {
                      const confirmNoDocs = window.confirm('No documents are selected or kept. This will remove all documents for this lead. Do you want to continue?');
                      if (!confirmNoDocs) return;
                    }

                    console.log(`Total new files to upload: ${newFileCount}, kept existing: ${keptExistingIds.length}`);

                    // Convert only new files to base64
                    let filesArray = [];
                    if (newFileCount > 0) {
                      const filePromises = newFilesData.map(({ file, personId, docType, fileName }) => {
                        return new Promise((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = () => {
                            console.log(`File read: ${fileName}, size: ${file.size}`);
                            resolve({
                              fileName,
                              personId,
                              docType,
                              fileType: file.type,
                              fileSize: file.size,
                              base64: reader.result.split(',')[1] // Remove data:image/png;base64, prefix
                            });
                          };
                          reader.onerror = () => reject(reader.error);
                          reader.readAsDataURL(file);
                        });
                      });

                      filesArray = await Promise.all(filePromises);
                      console.log(`All new files converted to base64, count: ${filesArray.length}`);
                    }

                    // Create JSON payload
                    const payload = {
                      leadId: selectedLead._id,
                      leadName: selectedLead.name,
                      peopleData: uploadPeople.map(person => ({
                        id: person.id,
                        name: person.name,
                      })),
                      files: filesArray,
                      keptExistingIds: keptExistingIds // inform backend which existing files to keep
                    };

                    console.log('Sending JSON payload to backend');
                    const res = await fetch('http://localhost:4000/employeelead/upload-documents', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(payload),
                    });

                    console.log('Response status:', res.status);
                    const contentType = res.headers.get('content-type');
                    console.log('Response content-type:', contentType);
                    
                    const data = await res.json();

                    if (!res.ok) {
                      throw new Error(`Server error ${res.status}: ${data.message || 'Unknown error'}`);
                    }

                    console.log('Upload successful:', data);
                    alert('Documents submitted successfully!');
                    setUploadModalOpen(false);
                    setUploadPeople([]);
                    setPersonDocs({});
                    setNewPersonName("");
                  } catch (err) {
                    console.error('Upload error:', err);
                    alert(`Upload failed: ${err.message}`);
                  }
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Viewer Modal */}
      {viewingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Document Viewer</h3>
              <button onClick={() => setViewingFile(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">File: <strong>{viewingFile.name || viewingFile.fileName || viewingFile.url || 'file'}</strong></p>

              {/* Support both existing files (with URL) and File objects */}
              {(() => {
                const isExisting = viewingFile && viewingFile.isExisting;
                const fileType = viewingFile.type || viewingFile.fileType || '';
                const isImage = fileType && fileType.startsWith('image/');
                const src = isExisting ? viewingFile.url : (viewingFile instanceof File ? URL.createObjectURL(viewingFile) : viewingFile.url || null);
                const fileName = viewingFile.name || viewingFile.fileName || '';
                
                // Better PDF detection - check fileType, filename, and URL
                const isPdf = (fileType && fileType.toLowerCase().includes('pdf')) || 
                             (fileName && fileName.toLowerCase().endsWith('.pdf')) ||
                             (src && src.toLowerCase().includes('.pdf'));

                if (isImage && src) {
                  return (
                    <div className="border border-gray-300 rounded p-4">
                      <img
                        src={src}
                        alt={viewingFile.name || viewingFile.fileName}
                        className="max-w-full h-auto max-h-[500px] mx-auto"
                      />
                    </div>
                  );
                }

                // PDFs: show viewer inside modal (Google Docs Viewer) with download/open options
                if (isPdf && src) {
                  const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(src)}&embedded=true`;
                  return (
                    <div className="border border-gray-300 rounded p-4">
                      <div className="space-y-4">
                        <iframe
                          src={viewerUrl}
                          width="100%"
                          height="600px"
                          frameBorder="0"
                          className="rounded"
                          title={fileName || 'PDF Document'}
                        />

                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => handleDownloadPDF(src, fileName || 'document.pdf')}
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
                          >
                            ⬇️ Download PDF
                          </button>

                          <a
                            href={viewerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition font-medium"
                          >
                            🔗 Open in new tab
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Other file types: no preview available
                return (
                  <div className="border border-gray-300 rounded p-4 text-center">
                    <p className="text-gray-600">No preview available for this file type.</p>
                    {src && (
                      <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-blue-600 hover:text-blue-800 underline text-sm mt-2"
                      >
                        Download file
                      </a>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setViewingFile(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCustomer;
