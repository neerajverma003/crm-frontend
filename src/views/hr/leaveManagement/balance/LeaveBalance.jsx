import React, { useState } from 'react';
import './Balance.css'; // We'll create this CSS file next

const LeaveBalanceHR = () => {
  // Sample employee data (replace with API call)
  const [employees] = useState([
    {
      id: 'DEMO0004',
      name: 'Demo Emp',
      gender: 'Male',
      avatar: 'http://res.cloudinary.com/dv8c2pofx/image/upload/v1742800046/jpjrtn9pv1omzi1wgsn1.png',
      leaves: {
        sick: 7,
        paid: 41,
        casual: 4,
        paternity: 10,
        maternity: 8
      }
    },
    {
      id: 'DEMO0005',
      name: 'Amar kumar',
      gender: 'Male',
      avatar: 'http://res.cloudinary.com/dv8c2pofx/image/upload/v1741589839/h1jguizgcalg0qg1jynz.png',
      leaves: {
        sick: 1,
        paid: 15,
        casual: 5,
        paternity: 5,
        maternity: 5
      }
    },
    // Add more employees as needed
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mainbar-grid">
      <div className="pb-4" style={{ overflow: 'auto' }}>
        <div className="container-fluid">
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div className="my-auto mt-2">
              <div className="d-flex align-items-center gap-2">
                <h5 className="m-0 p-0 text-capitalize" style={{ fontWeight: 500, color: 'var(--PrimaryColorDark)' }}>
                  Leaves Balance
                </h5>
              </div>
              <p className="m-0" style={{ color: 'var(--Subtittles)' }}>
                You can view employee's leave balance here
              </p>
            </div>
            
            <div className="searchholder p-0 d-flex position-relative">
              <input 
                className="form-control ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder"
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          </div>
          
          <div id="clear-both"></div>
          
          {/* Table Section */}
          <div className="mt-2">
            <div>
              <div className="scroller mb-2 rounded-2" style={{ 
                height: 'fit-content', 
                maxHeight: '70vh', 
                overflow: 'auto', 
                position: 'relative', 
                border: 'var(--borderLight)' 
              }}>
                <table className="table mb-0 table-hover">
                  <thead>
                    <tr>
                      <th style={{ 
                        verticalAlign: 'middle', 
                        whiteSpace: 'pre', 
                        background: 'rgb(238, 238, 238)', 
                        color: 'rgb(83, 88, 98)', 
                        border: 'none', 
                        position: 'sticky', 
                        top: '0rem', 
                        zIndex: 2 
                      }}>
                        User Profile
                      </th>
                      <th className="text-center" style={{ 
                        verticalAlign: 'middle', 
                        whiteSpace: 'pre', 
                        background: 'rgb(238, 238, 238)', 
                        color: 'rgb(83, 88, 98)', 
                        border: 'none', 
                        position: 'sticky', 
                        top: '0rem', 
                        zIndex: 2 
                      }}>
                        Gender
                      </th>
                      <th className="text-center" style={{ 
                        verticalAlign: 'middle', 
                        whiteSpace: 'pre', 
                        background: 'rgb(238, 238, 238)', 
                        color: 'rgb(83, 88, 98)', 
                        border: 'none', 
                        position: 'sticky', 
                        top: '0rem', 
                        zIndex: 2 
                      }}>
                        Sick Leave
                      </th>
                      <th className="text-center" style={{ 
                        verticalAlign: 'middle', 
                        whiteSpace: 'pre', 
                        background: 'rgb(238, 238, 238)', 
                        color: 'rgb(83, 88, 98)', 
                        border: 'none', 
                        position: 'sticky', 
                        top: '0rem', 
                        zIndex: 2 
                      }}>
                        Paid Leave
                      </th>
                      <th className="text-center" style={{ 
                        verticalAlign: 'middle', 
                        whiteSpace: 'pre', 
                        background: 'rgb(238, 238, 238)', 
                        color: 'rgb(83, 88, 98)', 
                        border: 'none', 
                        position: 'sticky', 
                        top: '0rem', 
                        zIndex: 2 
                      }}>
                        Casual Leave
                      </th>
                      <th className="text-center" style={{ 
                        verticalAlign: 'middle', 
                        whiteSpace: 'pre', 
                        background: 'rgb(238, 238, 238)', 
                        color: 'rgb(83, 88, 98)', 
                        border: 'none', 
                        position: 'sticky', 
                        top: '0rem', 
                        zIndex: 2 
                      }}>
                        Paternity Leave
                      </th>
                      <th className="text-center" style={{ 
                        verticalAlign: 'middle', 
                        whiteSpace: 'pre', 
                        background: 'rgb(238, 238, 238)', 
                        color: 'rgb(83, 88, 98)', 
                        border: 'none', 
                        position: 'sticky', 
                        top: '0rem', 
                        zIndex: 2 
                      }}>
                        Maternity Leave
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp, index) => (
                      <tr key={emp.id}>
                        <td style={{ 
                          verticalAlign: 'middle', 
                          whiteSpace: 'pre', 
                          background: 'transparent', 
                          color: 'var(--secondaryDashColorDark)', 
                          borderBottom: '1px solid rgba(0, 0, 0, 0.08)' 
                        }}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="mx-1 d-flex align-items-center justify-content-center" style={{ 
                              height: '30px', 
                              width: '30px', 
                              borderRadius: '50%', 
                              backgroundColor: '#ccc', 
                              color: 'white', 
                              fontWeight: 'bold', 
                              overflow: 'hidden', 
                              objectFit: 'cover' 
                            }}>
                              {emp.avatar ? (
                                <img 
                                  src={emp.avatar} 
                                  alt="Profile" 
                                  style={{ 
                                    height: '100%', 
                                    width: '100%', 
                                    borderRadius: '50%', 
                                    objectFit: 'cover' 
                                  }} 
                                />
                              ) : (
                                <span>{emp.name.split(' ').map(n => n[0]).join('')}</span>
                              )}
                            </div>
                            <div className="d-flex flex-column text-capitalize">
                              <span style={{ fontSize: '0.9rem' }}>{emp.id}</span>
                              <span>{emp.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="text-center" style={{ 
                          verticalAlign: 'middle', 
                          whiteSpace: 'pre', 
                          background: 'transparent', 
                          color: 'var(--secondaryDashColorDark)', 
                          borderBottom: '1px solid rgba(0, 0, 0, 0.08)' 
                        }}>
                          <span className="badge-primary border py-1" style={{ 
                            background: 'rgb(42, 82, 190)',
                            color: 'white',
                            borderRadius: '4px',
                            padding: '2px 8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                              <path d="M450.4 48H341.5c-7.5 0-13.6 6.1-13.6 13.6s6.1 13.6 13.6 13.6h75.4L326.7 166c-30.6-26-69.3-40.3-109.6-40.3-22.8 0-45 4.5-65.8 13.3-20.1 8.5-38.2 20.7-53.8 36.2C82 190.8 69.8 208.9 61.3 229 52.5 249.9 48 272 48 294.9s4.5 45 13.3 65.8c8.5 20.1 20.7 38.2 36.2 53.8 15.5 15.5 33.6 27.7 53.8 36.2 20.9 8.8 43 13.3 65.8 13.3 22.8 0 45-4.5 65.8-13.3 20.1-8.5 38.2-20.7 53.8-36.2 15.5-15.5 27.7-33.6 36.2-53.8 8.8-20.9 13.3-43 13.3-65.8 0-40.3-14.3-79-40.3-109.6L436.7 95v75.4c0 7.5 6.1 13.6 13.6 13.6s13.6-6.1 13.6-13.6V61.6c.1-7.5-6-13.6-13.5-13.6zM359 294.9c0 37.9-14.8 73.5-41.6 100.3-26.8 26.8-62.4 41.6-100.3 41.6s-73.5-14.8-100.3-41.6C90 368.4 75.2 332.8 75.2 294.9s14.8-73.5 41.6-100.3c26.8-26.8 62.4-41.6 100.3-41.6s73.5 14.8 100.3 41.6C344.3 221.3 359 257 359 294.9z"></path>
                            </svg>
                            {emp.gender}
                          </span>
                        </td>
                        <td className="text-center" style={{ 
                          verticalAlign: 'middle', 
                          whiteSpace: 'pre', 
                          background: 'transparent', 
                          color: 'var(--secondaryDashColorDark)', 
                          borderBottom: '1px solid rgba(0, 0, 0, 0.08)' 
                        }}>
                          {emp.leaves.sick}
                        </td>
                        <td className="text-center" style={{ 
                          verticalAlign: 'middle', 
                          whiteSpace: 'pre', 
                          background: 'transparent', 
                          color: 'var(--secondaryDashColorDark)', 
                          borderBottom: '1px solid rgba(0, 0, 0, 0.08)' 
                        }}>
                          {emp.leaves.paid}
                        </td>
                        <td className="text-center" style={{ 
                          verticalAlign: 'middle', 
                          whiteSpace: 'pre', 
                          background: 'transparent', 
                          color: 'var(--secondaryDashColorDark)', 
                          borderBottom: '1px solid rgba(0, 0, 0, 0.08)' 
                        }}>
                          {emp.leaves.casual}
                        </td>
                        <td className="text-center" style={{ 
                          verticalAlign: 'middle', 
                          whiteSpace: 'pre', 
                          background: 'transparent', 
                          color: 'var(--secondaryDashColorDark)', 
                          borderBottom: '1px solid rgba(0, 0, 0, 0.08)' 
                        }}>
                          {emp.leaves.paternity}
                        </td>
                        <td className="text-center" style={{ 
                          verticalAlign: 'middle', 
                          whiteSpace: 'pre', 
                          background: 'transparent', 
                          color: 'var(--secondaryDashColorDark)', 
                          borderBottom: '1px solid rgba(0, 0, 0, 0.08)' 
                        }}>
                          {emp.leaves.maternity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Pagination Section */}
            <div className="cntainer-fluid d-flex flex-column-reverse gap-4 py-2 px-2 rounded-2 gap-md-0 flex-md-row w-100 justify-content-between align-items-center my-2" style={{ background: 'var(--primaryDashMenuColor)' }}>
              <div className="d-flex flex-column-reverse gap-4 py-1 px-2 rounded-2 gap-md-0 flex-md-row w-100 justify-content-between align-items-center" style={{ background: 'var(--secondaryDashMenuColor)' }}>
                <div className="my-auto" style={{ color: 'black' }}>
                  Showing 1 to {filteredEmployees.length} of {filteredEmployees.length} results
                </div>
                <div className="d-flex align-items-center gap-1">
                  <button className="btn bg-light text-dark rounded-2 border shadow-sm mx-1 d-flex align-items-center gap-2" disabled>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="my-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <polyline fill="none" strokeWidth="2" points="9 6 15 12 9 18" transform="matrix(-1 0 0 1 24 0)"></polyline>
                    </svg>
                    <span className="d-none d-md-flex">Previous</span>
                  </button>
                  <div className="pagination d-flex flex-nowrap gap-2">
                    <button className="bg-primary text-white border-0 rounded-2" style={{ 
                      border: 'none', 
                      height: '2.3rem', 
                      width: '2.3rem', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center' 
                    }}>
                      1
                    </button>
                  </div>
                  <button className="btn bg-light text-dark rounded-2 border shadow-sm mx-1 d-flex align-items-center gap-2" disabled>
                    <span className="d-none d-md-flex">Next</span>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="my-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <polyline fill="none" strokeWidth="2" points="9 6 15 12 9 18"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default LeaveBalanceHR;