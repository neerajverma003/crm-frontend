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
      const res = await fetch("http://localhost:4000/company/all");
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
        `http://localhost:4000/department/department?company=${companyId}`
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
      const res = await fetch("http://localhost:4000/designation/");
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
      const res = await fetch("http://localhost:4000/department/department");
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
      const res = await fetch("http://localhost:4000/designation/", {
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
      const res = await fetch(`http://localhost:4000/designation/${id}`, {
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Designation Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-3 gap-4">
          
          {/* Company */}
          <div>
            <label>Company</label>
            <select
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
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
            <label>Department</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
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
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <button className="mt-4 bg-black text-white px-4 py-2 rounded">
          Add Designation
        </button>
      </form>

      {/* Search Bar and Filters Container */}
      <div className="bg-white p-4 rounded shadow mb-4 flex gap-4 items-end">
        {/* Search Bar */}
        <div className="flex-shrink-0">
          <label className="block text-sm font-medium mb-1">Search Designation</label>
          <input
            type="text"
            placeholder="Search by designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Filter by Company</label>
            <select
              name="companyId"
              value={filters.companyId}
              onChange={handleFilterChange}
              className="border p-2 rounded"
            >
              <option value="">All</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Filter by Department</label>
            <select
              name="departmentId"
              value={filters.departmentId}
              onChange={handleFilterChange}
              className="border p-2 rounded"
            >
              <option value="">All</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.dep}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2">Designation</th>
              <th className="p-2">Company</th>
              <th className="p-2">Department</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDesignations.map((d) => (
              <tr key={d._id} className="border-b">
                <td className="p-2">{d.designation}</td>
                <td className="p-2">{companies.find(c => c._id === d.company)?.companyName}</td>
                <td className="p-2">{allDepartments.find(dep => dep._id === d.dep)?.dep}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(d._id)}
                    className="bg-red-300 px-2 py-1 rounded"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}

            {filteredDesignations.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Designation;
