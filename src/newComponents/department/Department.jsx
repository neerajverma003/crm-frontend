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
      const response = await fetch("http://localhost:4000/company/all");
      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch departments
  const getTable = async () => {
    try {
      const response = await fetch("http://localhost:4000/department/department");
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
      const response = await fetch("http://localhost:4000/department", {
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
      const response = await fetch(`http://localhost:4000/department/${id}`, {
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Department Form</h2>

      {/* Add Department Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <select
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              name="dep"
              value={formData.dep}
              onChange={handleChange}
              placeholder="Enter department"
              className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button type="submit" className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800">
            Add Department
          </button>
        </div>
      </form>

      {/* Dropdown Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex gap-4">
        <select
          name="companyId"
          value={filter.companyId}
          onChange={handleFilterChange}
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Companies</option>
          {companies.map(company => (
            <option key={company._id} value={company._id}>
              {company.companyName}
            </option>
          ))}
        </select>

        <select
          name="dep"
          value={filter.dep}
          onChange={handleFilterChange}
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Departments</option>
          {uniqueDepartments.map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
      </div>

      {/* Department Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Department</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Company Name</th>
              <th className="p-3 text-center text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500">No entries found</td>
              </tr>
            ) : (
              filteredEntries.map((entry, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-800">{entry.dep}</td>
                  <td className="p-3 text-sm text-gray-800">{entry.companyName}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="px-2 py-2 rounded-full bg-red-200 hover:bg-red-300"
                      title="Delete"
                    >
                      <MdDelete className='text-red-500 text-md' />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Department;