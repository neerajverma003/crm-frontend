import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";

const Designation = () => {
  const [formData, setFormData] = useState({
    designation: "",
    companyId: "",
    departmentId: "",
  });

  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    companyId: "",
    departmentId: "",
  });

  // ✅ Fetch companies
  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/company/all`);
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // ✅ Fetch departments by company
  const fetchDepartments = async (companyId) => {
    if (!companyId) {
      setDepartments([]);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/department/department?company=${companyId}`
      );
      const data = await res.json();
      setDepartments(data.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    }
  };

  // ✅ Fetch all designations
  const fetchDesignations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/designation/`);
      const data = await res.json();

      const list = Array.isArray(data.designations)
        ? data.designations
        : Array.isArray(data)
        ? data
        : [];

      setDesignations(list);
    } catch (error) {
      console.error("Error fetching designations:", error);
      setDesignations([]); // prevent crash
    }
  };

  // ✅ Fetch all departments on initial load for table display
  const fetchAllDepartments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/department/department`);
      const data = await res.json();
      setAllDepartments(data.departments || []);
      setDepartments(data.departments || []);
    } catch (error) {
      console.error("Error fetching all departments:", error);
    }
  };

  // ✅ Initial Load
  useEffect(() => {
    fetchCompanies();
    fetchDesignations();
    fetchAllDepartments();
  }, []);

  // ✅ When company changes, load related departments
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "companyId") {
      fetchDepartments(value); // 🔥 load company-specific departments
      setFormData((prev) => ({ ...prev, departmentId: "" }));
    }
  };

  // ✅ Filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    if (name === "companyId") {
      if (value) {
        // Filter departments by selected company
        const filtered = allDepartments.filter(d => d.company === value);
        setDepartments(filtered);
      } else {
        // Show all departments if no company selected
        setDepartments(allDepartments);
      }
      setFilters((prev) => ({ ...prev, departmentId: "" }));
    }
  };

  // ✅ Add Designation
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.designation || !formData.companyId || !formData.departmentId) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/designation/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designation: formData.designation,
          company: formData.companyId,
          dep: formData.departmentId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add designation");
      }

      alert("Designation added successfully!");
      fetchDesignations();
      setFormData({ designation: "", companyId: "", departmentId: "" });
      setDepartments([]);
    } catch (error) {
      console.error("Add error:", error);
      alert("Failed to add designation: " + error.message);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/designation/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDesignations((prev) => prev.filter((d) => d._id !== id));
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ✅ Apply filters and search
  const filteredDesignations = designations.filter((d) => {
    const searchMatch = d.designation.toLowerCase().includes(searchTerm.toLowerCase());
    
    return (
      searchMatch &&
      (!filters.companyId || d.company === filters.companyId) &&
      (!filters.departmentId || d.dep === filters.departmentId)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8fa] to-[#e9ecef] p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight drop-shadow-sm">Designation Management</h2>
            <p className="mt-1 text-sm font-medium text-slate-600">Create and organize job designations across departments.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/90 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* Company */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company</label>
              <select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.dep}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Sales Manager"
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none placeholder-slate-400"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all">
              Add Designation
            </button>
          </div>
        </form>

        {/* Search Bar and Filters Container */}
        <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-end">
            {/* Search Bar */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Search Designation</label>
              <input
                type="text"
                placeholder="Search by designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Company</label>
                <select
                  name="companyId"
                  value={filters.companyId}
                  onChange={handleFilterChange}
                  className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                >
                  <option value="">All Companies</option>
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Department</label>
                <select
                  name="departmentId"
                  value={filters.departmentId}
                  onChange={handleFilterChange}
                  className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                >
                  <option value="">All Departments</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.dep}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-50">
                {filteredDesignations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-sm text-slate-500 font-medium bg-slate-50/30">
                      No designations found
                    </td>
                  </tr>
                ) : (
                  filteredDesignations.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/10">
                          {d.designation}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                        {companies.find((c) => c._id === d.company)?.companyName || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                        {allDepartments.find((dep) => dep._id === d.dep)?.dep || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDelete(d._id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                          title="Delete Designation"
                        >
                          <MdDelete className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden bg-slate-50/30 p-4 space-y-4">
            {filteredDesignations.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-slate-500 font-medium bg-white rounded-xl border border-slate-100 shadow-sm">
                No designations found
              </div>
            ) : (
              filteredDesignations.map((d) => (
                <div key={d._id} className="bg-white border border-slate-100 rounded-xl shadow-sm p-4 flex flex-col gap-3 relative">
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">Company</p>
                    <p className="text-sm font-bold text-slate-800">
                      {companies.find((c) => c._id === d.company)?.companyName || "—"}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">Department</p>
                    <p className="text-sm font-bold text-slate-700">
                      {allDepartments.find((dep) => dep._id === d.dep)?.dep || "—"}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-50 flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1.5">Designation</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/10">
                        {d.designation}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(d._id)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                      title="Delete Designation"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Designation;
