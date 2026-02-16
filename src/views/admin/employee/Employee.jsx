import React, { useState } from 'react'
import {
  FaFilePdf,
  FaFileExcel,
  FaFilter,
  FaSort,
  FaUserPlus,
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle,
} from 'react-icons/fa'

const Employee = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const employeesPerPage = 10

  const employees = [
    // 12 employee objects as provided earlier...
    {
      id: 1,
      code: 'DEMO00001',
      name: 'Admin Admin',
      position: 'Admin',
      department: 'Marketing',
      account: 'Admin',
      status: 'Active',
      email: 'demo.admin@munc.in',
      contact: '0000000000',
    },
    {
      id: 2,
      code: 'DEMO00002',
      name: 'Manager Marketing',
      position: 'Manager',
      department: 'Marketing',
      account: 'Manager',
      status: 'Inactive',
      email: 'manager.marketing@munc.in',
      contact: '1234567890',
    },
    {
      id: 3,
      code: 'DEMO00003',
      name: 'Sales Executive',
      position: 'Sales',
      department: 'Sales',
      account: 'Sales',
      status: 'Active',
      email: 'sales.executive@munc.in',
      contact: '2345678901',
    },
    {
      id: 4,
      code: 'DEMO00004',
      name: 'HR Manager',
      position: 'HR',
      department: 'Human Resources',
      account: 'HR',
      status: 'Active',
      email: 'hr.manager@munc.in',
      contact: '3456789012',
    },
    {
      id: 5,
      code: 'DEMO00005',
      name: 'Developer',
      position: 'Developer',
      department: 'Software',
      account: 'Developer',
      status: 'Active',
      email: 'developer@munc.in',
      contact: '4567890123',
    },
    {
      id: 6,
      code: 'DEMO00006',
      name: 'Tester',
      position: 'QA',
      department: 'Software',
      account: 'QA',
      status: 'Active',
      email: 'tester@munc.in',
      contact: '5678901234',
    },
    {
      id: 7,
      code: 'DEMO00007',
      name: 'Designer',
      position: 'UI/UX',
      department: 'Design',
      account: 'Design',
      status: 'Active',
      email: 'designer@munc.in',
      contact: '6789012345',
    },
    {
      id: 8,
      code: 'DEMO00008',
      name: 'Accountant',
      position: 'Finance',
      department: 'Finance',
      account: 'Finance',
      status: 'Active',
      email: 'accountant@munc.in',
      contact: '7890123456',
    },
    {
      id: 9,
      code: 'DEMO00009',
      name: 'Support',
      position: 'Support',
      department: 'Customer Service',
      account: 'Support',
      status: 'Active',
      email: 'support@munc.in',
      contact: '8901234567',
    },
    {
      id: 10,
      code: 'DEMO00010',
      name: 'Analyst',
      position: 'Data Analyst',
      department: 'Analytics',
      account: 'Analyst',
      status: 'Active',
      email: 'analyst@munc.in',
      contact: '9012345678',
    },
    {
      id: 11,
      code: 'DEMO00011',
      name: 'Recruiter',
      position: 'HR',
      department: 'Human Resources',
      account: 'HR',
      status: 'Active',
      email: 'recruiter@munc.in',
      contact: '0123456789',
    },
    {
      id: 12,
      code: 'DEMO00012',
      name: 'Marketing',
      position: 'Marketing',
      department: 'Marketing',
      account: 'Marketing',
      status: 'Active',
      email: 'marketing@munc.in',
      contact: '1234509876',
    },
  ]

  const startIndex = (currentPage - 1) * employeesPerPage
  const endIndex = Math.min(startIndex + employeesPerPage, employees.length)
  const paginatedEmployees = employees.slice(startIndex, endIndex)

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    } else if (direction === 'next' && endIndex < employees.length) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  return (
    <div
    >
      <div
        style={{
          maxWidth: '1850px',
          margin: '0 auto',
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, color: '#1e3a8a' }}>
              Employees List
              <span
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  padding: '5px 10px',
                  borderRadius: '9999px',
                  fontSize: '20px',
                  marginLeft: '10px',
                }}
              >
                {employees.length}
              </span>
            </h2>
            <p style={{ marginTop: '4px', color: '#6b7280', fontSize: '14px' }}>
              You can view and manage employees from here
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search..."
              style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px' }}
            />
            <button style={iconBtn}>
              <FaFilePdf />
            </button>
            <select style={iconBtn}>
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <button style={iconBtn}>
              <FaFileExcel />
            </button>
            <button style={iconBtn}>
              <FaFilter />
            </button>
            <button style={iconBtn}>
              <FaSort />
            </button>
            <button style={iconBtn}>
              <FaUserPlus />
            </button>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f1f1' }}>
              {[
                '#',
                'User Profile',
                'Position',
                'Department',
                'Account',
                'Status',
                'Email',
                'Contact No',
                'Actions',
              ].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 10px', fontSize: '14px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((emp) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{emp.id}</td>
                <td style={{ ...tdStyle, display: 'flex', alignItems: 'center' }}>
                  <img
                    src="https://via.placeholder.com/35"
                    alt="profile"
                    style={{ borderRadius: '50%', marginRight: '10px' }}
                  />
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#007bff' }}>{emp.code}</p>
                    <p style={{ margin: 0, fontSize: '12px' }}>{emp.name}</p>
                  </div>
                </td>
                <td style={tdStyle}>{emp.position}</td>
                <td style={tdStyle}>{emp.department}</td>
                <td style={tdStyle}>{emp.account}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      backgroundColor: emp.status === 'Active' ? '#ccffcc' : '#ffcccb',
                      color: emp.status === 'Active' ? 'green' : 'red',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  >
                    {emp.status}
                  </span>
                </td>
                <td style={tdStyle}>{emp.email}</td>
                <td style={tdStyle}>{emp.contact}</td>
                <td style={{ ...tdStyle, display: 'flex', gap: '8px' }}>
                  <FaUserCircle style={{ cursor: 'pointer', fontSize: '18px', color: '#555' }} />
                  <FaUserPlus style={{ cursor: 'pointer', fontSize: '18px', color: '#555' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
            backgroundColor: '#e1d7d7',
            padding: '12px 16px',
            borderRadius: '6px',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '14px', color: '#4b5563' }}>
            Showing {startIndex + 1} to {endIndex} of {employees.length} results
          </span>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button style={pageBtn} onClick={() => handlePageChange('prev')}>
              <FaChevronLeft /> Previous
            </button>
            <button style={pageNum(currentPage === 1)} onClick={() => setCurrentPage(1)}>
              1
            </button>
            <button style={pageNum(currentPage === 2)} onClick={() => setCurrentPage(2)}>
              2
            </button>
            <button style={pageBtn} onClick={() => handlePageChange('next')}>
              Next <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Inline Styles ---
const iconBtn = {
  padding: '8px',
  border: 'none',
  background: '#f1f1f1',
  borderRadius: '6px',
  cursor: 'pointer',
}

const tdStyle = {
  padding: '12px 10px',
  fontSize: '14px',
}

const pageBtn = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  backgroundColor: '#fff',
  color: '#374151',
  fontSize: '13px',
  cursor: 'pointer',
}

const pageNum = (active) => ({
  width: '2rem',
  height: '2rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
  backgroundColor: active ? '#3b82f6' : '#fff',
  color: active ? '#fff' : '#374151',
  fontSize: '16px',
  cursor: 'pointer',
})

export default Employee
