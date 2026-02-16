import React, { useState } from 'react';
import AddEmpForm from './addEmployeeForm/AddEmpForm';

const Employee = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  const [employees, setEmployees] = useState([
    {
      id: 'DEMO0002',
      name: 'Hr Manager',
      position: 'HR Manager',
      department: 'Human Resource',
      account: 'HR',
      status: 'active',
      email: 'demo.hr@munc.in',
      contact: '1234567890',
      profileImage: 'http://res.cloudinary.com/dv8c2pofx/image/upload/v1741721783/dhc7rhowf682tyfq6l0g.jpg'
    },
  ]);

  const handleAddButtonClick = () => {
    setShowAddForm(true);
    setEditingEmployee(null);
  };
  
  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingEmployee(null);
  };

  const handleFormSubmit = (employeeData) => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id ? { ...emp, ...employeeData } : emp
      ));
    } else {
      const newEmployee = {
        ...employeeData,
        id: `DEMO${Math.floor(1000 + Math.random() * 9000)}`
      };
      setEmployees([...employees, newEmployee]);
    }
    setShowAddForm(false);
    setEditingEmployee(null);
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setShowAddForm(true);
  };

  const handleViewClick = (employee) => {
    alert(`Viewing employee: ${employee.name}\nEmail: ${employee.email}`);
  };

  const handleDeleteClick = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== employeeId));
    }
  };

  return (
    <div className="container-fluid p-4">
      {showAddForm ? (
        <div className="mb-4">
          <AddEmpForm 
            onClose={handleFormClose} 
            onSubmit={handleFormSubmit}
            employee={editingEmployee}
          />
        </div>
      ) : (
        <>
          <div className="sticky top-0 z-10 bg-white py-2 px-1 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="m-0 p-0 font-medium text-gray-800">Employees List</h5>
                  <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-sm">
                    {employees.length}
                  </span>
                </div>
                <p className="m-0 text-gray-500">You can view and manage employee's from here</p>
              </div>
              
              <div className="relative flex-1">
                <input 
                  className="w-full p-2 pl-3 pr-10 rounded border bg-gray-50 text-gray-800" 
                  type="text" 
                  placeholder="Search by name, id, email, contact number" 
                />
                <svg 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              
              <div className="flex-1 flex items-center justify-end gap-2">
                <button className="p-2 rounded border bg-gray-50 text-gray-800 hover:bg-gray-100">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 384 512">
                    <path d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"></path>
                  </svg>
                </button>
                
                <select className="p-2 rounded border bg-gray-50 text-gray-800 w-32">
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                
                <button className="p-2 rounded border bg-gray-50 text-gray-800 hover:bg-gray-100">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 384 512">
                    <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM155.7 250.2L192 302.1l36.3-51.9c7.6-10.9 22.6-13.5 33.4-5.9s13.5 22.6 5.9 33.4L221.3 344l46.4 66.2c7.6 10.9 5 25.8-5.9 33.4s-25.8 5-33.4-5.9L192 385.8l-36.3 51.9c-7.6 10.9-22.6 13.5-33.4 5.9s-13.5-22.6-5.9-33.4L162.7 344l-46.4-66.2c-7.6-10.9-5-25.8 5.9-33.4s25.8-5 33.4 5.9z"></path>
                  </svg>
                </button>
                
                <button className="p-2 rounded border bg-gray-50 text-gray-800 hover:bg-gray-100">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path>
                  </svg>
                </button>
                
                <button className="p-2 rounded border bg-gray-50 text-gray-800 hover:bg-gray-100">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 48 48">
                    <polygon fill="#546E7A" points="38,33 38,5 34,5 34,33 28,33 36,43 44,33"></polygon>
                    <g fill="#2196F3">
                      <path d="M19.2,20H9v-2l4.8-5.1c0.4-0.4,0.7-0.8,0.9-1.1c0.2-0.3,0.5-0.6,0.6-0.9c0.2-0.3,0.3-0.5,0.3-0.8 c0.1-0.2,0.1-0.5,0.1-0.7c0-0.7-0.2-1.2-0.5-1.6c-0.3-0.4-0.8-0.6-1.4-0.6c-0.3,0-0.7,0.1-0.9,0.2c-0.3,0.1-0.5,0.3-0.7,0.5 c-0.2,0.2-0.3,0.5-0.4,0.8s-0.1,0.6-0.1,1h-3c0-0.7,0.1-1.3,0.4-1.9c0.2-0.6,0.6-1.1,1-1.6c0.5-0.4,1-0.8,1.6-1.1 c0.6-0.3,1.4-0.4,2.2-0.4c0.8,0,1.5,0.1,2.1,0.3c0.6,0.2,1.1,0.5,1.5,0.8s0.7,0.8,0.9,1.3c0.2,0.5,0.3,1.1,0.3,1.8 c0,0.5-0.1,1-0.2,1.4s-0.4,0.9-0.7,1.4s-0.6,0.9-1,1.4c-0.4,0.5-0.9,1-1.4,1.5l-2.6,2.8h6.4V20z"></path>
                      <path d="M16.2,43h-3V31.6l-3.5,1.1v-2.4l6.2-2.2h0.3V43z"></path>
                    </g>
                  </svg>
                </button>
                
                <button 
                  className="p-2 rounded border bg-gray-50 text-gray-800 hover:bg-gray-100"
                  title="Add Employee"
                  onClick={handleAddButtonClick}
                >
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 640 512">
                    <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="rounded border overflow-auto max-h-[75vh] relative">
            <table className="w-full table-auto">
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">User Profile</th>
                  <th className="p-3 text-left">Position</th>
                  <th className="p-3 text-left">Department</th>
                  <th className="p-3 text-left">Account</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Contact No</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={employee.id} className="hover:bg-gray-50 border-b">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-300">
                          <img src={employee.profileImage} alt={employee.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">{employee.id}</span>
                          <p className="font-medium">{employee.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{employee.position}</td>
                    <td className="p-3">{employee.department}</td>
                    <td className="p-3">{employee.account}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        employee.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button className="text-gray-500 hover:text-gray-700">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 2H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H9V4h9v12zM3 15v-2h2v2H3zm0-5.5h2v2H3v-2zM10 20h2v2h-2v-2zm-7-1.5v-2h2v2H3zM5 22c-1.1 0-2-.9-2-2h2v2zm3.5 0h-2v-2h2v2zm5 0v-2h2c0 1.1-.9 2-2 2zM5 6v2H3c0-1.1.9-2 2-2z"></path>
                          </svg>
                        </button>
                        {employee.email}
                      </div>
                    </td>
                    <td className="p-3">{employee.contact}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <button 
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => handleViewClick(employee)}
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"></path>
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z"></path>
                          </svg>
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => handleEditClick(employee)}
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 14.252V16.3414C13.3744 16.1203 12.7013 16 12 16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z"></path>
                          </svg>
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteClick(employee.id)}
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-2 bg-gray-50 rounded">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-700">
                Showing 1 to {employees.length} of {employees.length} results
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <button className="p-2 rounded border bg-white text-gray-700 flex items-center gap-1 disabled:opacity-50" disabled>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <polyline fill="none" strokeWidth="2" points="9 6 15 12 9 18" transform="matrix(-1 0 0 1 24 0)"></polyline>
                  </svg>
                  <span className="hidden md:inline">Previous</span>
                </button>
                
                <div className="flex gap-1">
                  <button className="w-9 h-9 rounded bg-blue-500 text-white flex items-center justify-center">1</button>
                  {employees.length > 10 && (
                    <button className="w-9 h-9 rounded border bg-white text-gray-700 flex items-center justify-center">2</button>
                  )}
                </div>
                
                <button className="p-2 rounded border bg-white text-gray-700 flex items-center gap-1 disabled:opacity-50" disabled={employees.length <= 10}>
                  <span className="hidden md:inline">Next</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <polyline fill="none" strokeWidth="2" points="9 6 15 12 9 18"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Employee;