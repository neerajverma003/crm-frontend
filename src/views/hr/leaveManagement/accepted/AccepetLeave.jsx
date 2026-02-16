import React, { useState } from 'react';
import { FaSearch, FaFilter, FaCalendarCheck, FaFileExport } from 'react-icons/fa';
// import * as XLSX from 'xlsx';

const AcceptedLeave = () => {
  // Sample accepted leave data
  const initialLeaves = [
    {
      id: 1,
      employee: 'John Doe',
      leaveType: 'Sick Leave',
      from: '2023-06-15',
      to: '2023-06-17',
      days: 3,
      status: 'Approved',
      approvedOn: '2023-06-10',
      approvedBy: 'Manager Name',
      reason: 'High fever and doctor advised rest'
    },
    {
      id: 2,
      employee: 'Jane Smith',
      leaveType: 'Casual Leave',
      from: '2023-06-20',
      to: '2023-06-21',
      days: 2,
      status: 'Approved',
      approvedOn: '2023-06-12',
      approvedBy: 'Manager Name',
      reason: 'Family function'
    },
    {
      id: 3,
      employee: 'Robert Johnson',
      leaveType: 'Paid Leave',
      from: '2023-06-25',
      to: '2023-06-30',
      days: 6,
      status: 'Approved',
      approvedOn: '2023-06-15',
      approvedBy: 'HR Manager',
      reason: 'Vacation with family'
    }
  ];

  const [leaves, setLeaves] = useState(initialLeaves);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    approvedBy: ''
  });

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setLeaves(initialLeaves);
    } else {
      const filtered = initialLeaves.filter(leave =>
        leave.employee.toLowerCase().includes(term) ||
        leave.leaveType.toLowerCase().includes(term) ||
        leave.reason.toLowerCase().includes(term) ||
        leave.approvedBy.toLowerCase().includes(term)
      );
      setLeaves(filtered);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...initialLeaves];
    
    if (filters.leaveType) {
      filtered = filtered.filter(leave => leave.leaveType === filters.leaveType);
    }
    
    if (filters.fromDate) {
      filtered = filtered.filter(leave => leave.from >= filters.fromDate);
    }
    
    if (filters.toDate) {
      filtered = filtered.filter(leave => leave.to <= filters.toDate);
    }
    
    if (filters.approvedBy) {
      filtered = filtered.filter(leave => 
        leave.approvedBy.toLowerCase().includes(filters.approvedBy.toLowerCase())
      );
    }
    
    setLeaves(filtered);
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      leaveType: '',
      fromDate: '',
      toDate: '',
      approvedBy: ''
    });
    setLeaves(initialLeaves);
    setShowFilters(false);
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leaves);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AcceptedLeaves");
    XLSX.writeFile(workbook, "AcceptedLeaves.xlsx");
  };

  // Get unique leave types for filter dropdown
  const leaveTypes = [...new Set(initialLeaves.map(leave => leave.leaveType))];

  return (
    <div className="container-fluid p-5 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h4 className="text-xl font-semibold text-gray-800">Accepted Leave Applications</h4>
          <p className="text-sm text-gray-600">View all approved leave requests</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex items-center">
            <FaSearch className="absolute left-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            Filter
          </button>
          <button 
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            onClick={exportToExcel}
          >
            <FaFileExport />
            Export
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                name="leaveType"
                value={filters.leaveType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                {leaveTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded-md"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded-md"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Approved By</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Approver name"
                name="approvedBy"
                value={filters.approvedBy}
                onChange={handleFilterChange}
              />
            </div>
            <div className="md:col-span-2 flex items-end gap-2">
              <button 
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={applyFilters}
              >
                Apply
              </button>
              <button 
                className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.length > 0 ? (
                leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.employee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.leaveType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.from}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.to}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.days}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.approvedOn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.approvedBy}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaCalendarCheck className="mr-1" />
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-sm text-gray-500">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-700">
            Showing 1 to {leaves.length} of {leaves.length} entries
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md">1</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-400 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptedLeave;