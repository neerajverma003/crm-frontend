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


  // fetch company details on mount
  // useEffect(() => {
  //   const fetchCompanyDetails = async () => {
  //     try {
  //       const res = await fetch(`http://localhost:4000/company/companybyname?name=${activeTab}`);
  //       if (!res.ok) throw new Error("Failed to fetch company details");
  //       const data = await res.json();
  //       setCompany(data.companies || []); // Assuming the response has a 'companies' array
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchCompanyDetails();
  // }, []);

  if (role === "employee") {
    useEffect(() => {
      const fetchEmployeeCompany = async () => {
        try {
          const res = await fetch(`http://localhost:4000/company/${companyId}`);
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
        const res = await fetch("http://localhost:4000/company/all");
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
        const res = await fetch("http://localhost:4000/b2bstate/");
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
          endpoint = `http://localhost:4000/b2bcompany/employee/${employeeId}`;
          if (employeeCompany) endpoint += `?companyName=${encodeURIComponent(employeeCompany)}`;
        }
        else if (activeTab === "All") {
          endpoint = "http://localhost:4000/b2bcompany";
        } else {
          endpoint = `http://localhost:4000/b2bcompany/${activeTab}`;
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
  //       const res = await fetch("http://localhost:4000/b2bcompany");
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
      
      const res = await fetch("http://localhost:4000/b2bcompany", {
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
        const res = await fetch(`http://localhost:4000/b2bcompany/${id}`, {
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
      const res = await fetch("http://localhost:4000/b2bcompany");
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch the latest company list for employees (only their own)
  const fetchCompaniesByEmployee = async () => {
    try {
      let url = `http://localhost:4000/b2bcompany/employee/${employeeId}`;
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
      const res = await fetch(`http://localhost:4000/b2bcompany/${_id}`, {
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
    <div className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-3">
          {role !== "employee" && (
            <button
              onClick={() => {
                setActiveTab("All")
                setFormData({
                  ...formData,
                  company: null, // Clear company selection when "All" is selected
                });
              }}
              className={`px-4 py-2 rounded-full font-semibold shadow-sm transition ${activeTab === "All" ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              All
            </button>
          )
          }
          {company.length > 0 && company.map((comp) => (
            <button
              onClick={() => {
                setActiveTab(comp.companyName)
                setFormData({
                  ...formData,
                  company: comp.companyName, // Set company ID in form data when a company tab is selected
                });
              }}
              key={comp._id}
              className={`px-4 py-2 rounded-full font-semibold shadow-sm transition ${activeTab === comp.companyName ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              {comp.companyName}
            </button>
          ))}
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-6 text-center">B2B Add Company</h2>

      {/* ADD FORM */}
      {!editData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-10">
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              readOnly
              className="w-full border p-2 bg-gray-100 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Person Name</label>
            <input
              type="text"
              name="contactPersonName"
              value={formData.contactPersonName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="number"
              name="contactPersonNumber"
              value={formData.contactPersonNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp</label>
            <input
              type="number"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows="3"
            />
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
            >
              Add Company
            </button>
          </div>
        </div>
      )}

      {/* TABLE LISTING COMPANIES */}
      <div className="max-w-5xl mx-auto overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Company Name</th>
              <th className="border border-gray-300 p-2">WhatsApp Number</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No companies added yet.
                </td>
              </tr>
            ) : (
              companies.map((company, index) => (
                <tr key={company._id || index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{company.companyName}</td>
                  <td className="border border-gray-300 p-2">{company.whatsapp}</td>
                  <td className="border border-gray-300 p-2">{company.contactPersonNumber}</td>
                  <td className="border border-gray-300 p-2">{company.email}</td>
                  <td className="border border-gray-300 p-2 flex space-x-2">
                    <button
                      onClick={() => setViewData(company)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(company, index)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(index, company._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
  );
};

export default B2bAddCompany;
