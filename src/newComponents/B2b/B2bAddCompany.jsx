import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const B2bAddCompany = () => {
  const [formData, setFormData] = useState({
    country: "India",
    state: "",
    companyName: "",
    company: "",
    contactPersonName: "",
    contactPersonNumber: "",
    email: "",
    whatsapp: "",
    address: "",
  });

  const [companies, setCompanies] = useState([]);
  const [editData, setEditData] = useState(null); // For Edit modal
  const [viewData, setViewData] = useState(null); // For View modal
  const [states, setStates] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [company, setCompany] = useState([]);

  const [employeeCompany, setEmployeeCompany] = useState(null); // For employee's company details

  const companyId = localStorage.getItem("companyId");
  // Try multiple possible keys for employee id (some apps use different keys)
  const employeeId =
    localStorage.getItem("employeeId") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("id") ||
    localStorage.getItem("_id") ||
    null;
  const role = localStorage.getItem("role");
  console.log(companyId);


  if (role === "employee") {
    useEffect(() => {
      const fetchEmployeeCompany = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/company/${companyId}`);
          if (!res.ok) throw new Error("Failed to fetch company details");
          const data = await res.json();
          console.log(data.company.companyName);
          setEmployeeCompany(data.company.companyName);
          // Auto-set company field for employees
          setFormData(prev => ({ ...prev, company: data.company.companyName }));

        } catch (err) {
          console.error(err);
        }
      };
      fetchEmployeeCompany();
    }, [companyId]);
  }
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/company/all`);
        if (!res.ok) throw new Error("Failed to fetch company details");
        const data = await res.json();
        if (role === "superAdmin" || role === "admin") {
          setCompany(data.companies || []);
        }
        else {
          setCompany(data.companies.filter(comp => comp.companyName === employeeCompany) || []);
          setActiveTab(employeeCompany);
        } // Assuming the response has a 'companies' array
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompanyDetails();
  }, [employeeCompany]);

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bstate/`);
        if (!res.ok) throw new Error("Failed to fetch states");
        const data = await res.json();
        setStates(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStates();
  }, []);

  // Fetch companies on mount
  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        let endpoint = "";
        if (role === "employee") {
          endpoint = `${import.meta.env.VITE_API_URL}/b2bcompany/employee/${employeeId}`;
          if (employeeCompany) endpoint += `?companyName=${encodeURIComponent(employeeCompany)}`;
        }
        else if (activeTab === "All") {
          endpoint = `${import.meta.env.VITE_API_URL}/b2bcompany`;
        } else {
          endpoint = `${import.meta.env.VITE_API_URL}/b2bcompany/${activeTab}`;
        }
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch companies");
        const data = await res.json();
        // Normalize response to array
        if (Array.isArray(data)) setCompanies(data);
        else if (data && Array.isArray(data.companies)) setCompanies(data.companies);
        else if (data && data.company) setCompanies([data.company]);
        else setCompanies([]);
      } catch (err) {
        console.error(err);
      }
    };
    if (role === "employee") {
      if (employeeId) fetchCompaniesData();
    } else {
      fetchCompaniesData();
    }
  }, [activeTab, employeeId, role]);
  // useEffect(() => {
  //   const fetchCompanies = async () => {
  //     try {
  //       const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bcompany`);
  //       if (!res.ok) throw new Error("Failed to fetch companies");
  //       const data = await res.json();
  //       setCompanies(data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchCompanies();
  // }, []);

  // Fetch the selected company data when viewData changes
  useEffect(() => {
    if (viewData && viewData.state) {
      const selectedState = states.find((state) => state._id === viewData.state);
      if (selectedState) {
        setViewData((prevData) => ({ ...prevData, state: selectedState.state }));
      }
    }
  }, [viewData, states]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Fields to validate (excluding 'company' as it's auto-filled)
    const requiredFields = ["country", "state", "companyName", "contactPersonName", "contactPersonNumber", "email", "whatsapp", "address"];
    
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill ${field}`);
        return;
      }
    }
    console.log(formData);
    // Set company ID from the first company in the list
    try {
      const submitData = { ...formData };
      if (role === "employee") {
        // attach createdBy if we have an id
        if (employeeId) submitData.createdBy = employeeId;
        else console.warn("No employeeId found in localStorage; createdBy will be empty");
      }
      console.log("[b2b] submitting company:", submitData);
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bcompany`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to add company");
      }

      const newCompany = await res.json();
      setCompanies((prev) => Array.isArray(prev) ? [...prev, newCompany] : [newCompany]);
      alert("Company Added Successfully ✓");

      // After adding the company, fetch the latest companies again
      if (role === "employee") {
        fetchCompaniesByEmployee();
      } else {
        fetchCompanies();
      }

      // Reset the form
      setFormData({
        country: "India",
        state: "",
        companyName: "",
        company: role === "employee" ? employeeCompany : "",
        contactPersonName: "",
        contactPersonNumber: "",
        email: "",
        whatsapp: "",
        address: "",
      });
    } catch (err) {
      alert("Error adding company: " + err.message);
    }
  };

  const handleDelete = async (index, id) => {
    if (window.confirm("Are you sure to delete this company?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bcompany/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || "Failed to delete company");
        }
        const newList = [...companies];
        newList.splice(index, 1);
        setCompanies(newList);
        alert("Company deleted successfully ✓");
        
        // Refresh the list to ensure consistency
        if (role === "employee") {
          await fetchCompaniesByEmployee();
        } else {
          await fetchCompanies();
        }
      } catch (err) {
        alert("Error deleting company: " + err.message);
      }
    }
  };

  const handleEdit = (company, index) => {
    setEditData({ ...company, index });
  };

  const handleEditChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  // Fetch the latest company list for all users
  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bcompany`);
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch the latest company list for employees (only their own)
  const fetchCompaniesByEmployee = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/b2bcompany/employee/${employeeId}`;
      if (employeeCompany) url += `?companyName=${encodeURIComponent(employeeCompany)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) setCompanies(data);
      else if (data && Array.isArray(data.companies)) setCompanies(data.companies);
      else if (data && Array.isArray(data.companies) === false && data.companies) setCompanies(data.companies);
      else if (data && data.company) setCompanies([data.company]);
      else setCompanies([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSave = async () => {
    const { index, _id, ...companyData } = editData;

    if (!_id) {
      alert("Invalid company ID");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/b2bcompany/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to update company");
      }

      // Re-fetch the list after editing based on role
      if (role === "employee") {
        await fetchCompaniesByEmployee();
      } else {
        await fetchCompanies();
      }
      setEditData(null);
      alert("Company updated successfully ✓");
    } catch (err) {
      alert("Error updating company: " + err.message);
    }
  };

  // console.log(company[0].companyName);
  console.log(company);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8fa] to-[#e9ecef] p-4 sm:p-8 lg:p-12">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Header & Tabs */}
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight drop-shadow-sm">B2B Add Company</h2>
              <p className="mt-1 text-sm font-medium text-slate-600">Register and manage B2B partner companies.</p>
            </div>
          </div>

          {/* Mobile View: Select Dropdown instead of tabs */}
          <div className="block sm:hidden">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => {
                  const val = e.target.value;
                  setActiveTab(val);
                  setFormData({ ...formData, company: val === "All" ? null : val });
                }}
                className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-3 px-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                {role !== "employee" && <option value="All">All Companies</option>}
                {company.length > 0 && company.map((comp) => (
                  <option key={comp._id} value={comp.companyName}>
                    {comp.companyName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Desktop View: Horizontal Tabs */}
          <div className="hidden sm:flex items-center gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {role !== "employee" && (
              <button
                onClick={() => {
                  setActiveTab("All")
                  setFormData({ ...formData, company: null });
                }}
                className={`flex-none px-5 py-2.5 rounded-full font-semibold shadow-sm transition-all duration-300 ${activeTab === "All" ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              >
                All
              </button>
            )}
            {company.length > 0 && company.map((comp) => (
              <button
                key={comp._id}
                onClick={() => {
                  setActiveTab(comp.companyName)
                  setFormData({ ...formData, company: comp.companyName });
                }}
                className={`flex-none px-5 py-2.5 rounded-full font-semibold shadow-sm transition-all duration-300 ${activeTab === comp.companyName ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              >
                {comp.companyName}
              </button>
            ))}
          </div>
        </div>

        {/* ADD FORM */}
        {!editData && (
        <div className="md:bg-white/90 p-0 sm:p-8 md:rounded-2xl md:shadow-xl md:border border-slate-100 transition-all mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                readOnly
                className="w-full border border-slate-200 bg-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s._id} value={s._id}>{s.state}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Person Name</label>
              <input
                type="text"
                name="contactPersonName"
                value={formData.contactPersonName}
                onChange={handleChange}
                placeholder="Enter contact person"
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
              <input
                type="number"
                name="contactPersonNumber"
                value={formData.contactPersonNumber}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp</label>
              <input
                type="number"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="WhatsApp number"
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-y min-h-[100px]"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Add Company
            </button>
          </div>
        </div>
      )}

      {/* TABLE LISTING COMPANIES */}
      <div className="sm:bg-white/90 sm:rounded-2xl sm:shadow-xl sm:border border-slate-100 overflow-hidden">
        
        {/* MOBILE VIEW */}
        <div className="block sm:hidden divide-y divide-slate-100">
          {companies.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500 font-medium bg-slate-50/30">
              No companies added yet.
            </div>
          ) : (
            companies.map((company, index) => (
              <div key={company._id || index} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-800 text-lg">{company.companyName}</span>
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <p><span className="font-medium text-slate-500">WhatsApp:</span> {company.whatsapp || "—"}</p>
                  <p><span className="font-medium text-slate-500">Phone:</span> {company.contactPersonNumber || "—"}</p>
                  <p><span className="font-medium text-slate-500">Email:</span> {company.email || "—"}</p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button onClick={() => setViewData(company)} className="flex-1 inline-flex items-center justify-center py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-semibold">
                    <FaEye className="mr-2" /> View
                  </button>
                  <button onClick={() => handleEdit(company, index)} className="flex-1 inline-flex items-center justify-center py-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors text-sm font-semibold">
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button onClick={() => handleDelete(index, company._id)} className="flex-1 inline-flex items-center justify-center py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-semibold">
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-50">
              {companies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500 font-medium bg-slate-50/30">
                    No companies added yet.
                  </td>
                </tr>
              ) : (
                companies.map((company, index) => (
                  <tr key={company._id || index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{company.companyName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{company.whatsapp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{company.contactPersonNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{company.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setViewData(company)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(company, index)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                          title="Edit Company"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(index, company._id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                          title="Delete Company"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setEditData(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl"
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold mb-4">Edit Company</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <select
                  name="state"
                  value={editData.state}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contact Person</label>
                <input
                  type="text"
                  name="contactPersonName"
                  value={editData.contactPersonName}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="number"
                  name="contactPersonNumber"
                  value={editData.contactPersonNumber}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">WhatsApp</label>
                <input
                  type="number"
                  name="whatsapp"
                  value={editData.whatsapp}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  name="address"
                  value={editData.address}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  rows="3"
                />
              </div>

              {/* Save button */}
              <button
                onClick={handleEditSave}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-md font-semibold w-full"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{viewData.companyName}</h3>

            <ul className="space-y-2">
              <li><strong>Country:</strong> {viewData.country}</li>
              <li><strong>State:</strong> {viewData.state?.state}</li>
              <li><strong>Contact Person:</strong> {viewData.contactPersonName}</li>
              <li><strong>Phone:</strong> {viewData.contactPersonNumber}</li>
              <li><strong>Email:</strong> {viewData.email}</li>
              <li><strong>WhatsApp:</strong> {viewData.whatsapp}</li>
              <li><strong>Address:</strong> {viewData.address}</li>
            </ul>

            <button
              onClick={() => setViewData(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
            >
              ✖
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default B2bAddCompany;
