import React, { useState, useEffect } from 'react';
import { MdDelete } from "react-icons/md";

const Department = () => {
  const [formData, setFormData] = useState({
    dep: '',
    companyId: '',
  });

  const [entries, setEntries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filter, setFilter] = useState({
    dep: '',
    companyId: '',
  });

  // Fetch companies
  const getData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/company/all`);
      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch departments
  const getTable = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/department/department`);
      const result = await response.json();

      const departmentsArray = result.departments || result;

      const mappedData = departmentsArray.map(dep => {
        const companyObj = companies.find(c => c._id === dep.company);
        return {
          ...dep,
          companyName: companyObj?.companyName || dep.company,
        };
      });

      setEntries(mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (companies.length > 0) getTable();
  }, [companies]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dep || !formData.companyId) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/department`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dep: formData.dep,
          company: formData.companyId,
        }),
      });

      if (!response.ok) throw new Error("Failed to add department");

      // Refresh the table to show the new department
      await getTable();
      setFormData({ dep: '', companyId: '' });
      alert("Department added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add department");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/department/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete department");

      setEntries(entries.filter(entry => entry._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete department");
    }
  };

  // Filtered entries by dropdowns
  const filteredEntries = entries.filter(entry => {
    const depMatch = filter.dep ? entry.dep === filter.dep : true;
    const companyMatch = filter.companyId ? entry.company === filter.companyId : true;
    return depMatch && companyMatch;
  });

  // Get unique departments for dropdown
  const uniqueDepartments = [...new Set(entries.map(e => e.dep))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8fa] to-[#e9ecef] p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight drop-shadow-sm">Department Form</h2>
            <p className="mt-1 text-sm font-medium text-slate-600">Create and manage departments for all companies.</p>
          </div>
        </div>

        {/* Add Department Form */}
        <form onSubmit={handleSubmit} className="bg-white/90 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
              <select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              >
                <option value="">Select a company</option>
                {companies.map(company => (
                  <option key={company._id} value={company._id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Department Name</label>
              <input
                type="text"
                name="dep"
                value={formData.dep}
                onChange={handleChange}
                placeholder="e.g. Sales, Marketing"
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none placeholder-slate-400"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all">
              Add Department
            </button>
          </div>
        </form>

        {/* Filters and Table Section */}
        <div className="bg-white/90 rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Filters */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-[200px]">
              <select
                name="companyId"
                value={filter.companyId}
                onChange={handleFilterChange}
                className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              >
                <option value="">All Companies</option>
                {companies.map(company => (
                  <option key={company._id} value={company._id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <select
                name="dep"
                value={filter.dep}
                onChange={handleFilterChange}
                className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-50">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-sm text-slate-500 font-medium bg-slate-50/30">
                      No departments found
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/10">
                          {entry.dep}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                        {entry.companyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                          title="Delete Department"
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
        </div>
      </div>
    </div>
  );
};

export default Department;