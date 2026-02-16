import React, { useState } from 'react';
import { usePDF } from 'react-to-pdf';
import './RejectedLeave.css';

const RejectedLeave = () => {
  // Sample data
  const [rejectedLeaves, setRejectedLeaves] = useState([
    {
      id: 1,
      employeeId: "DEMO0004",
      employeeName: "Demo Emp",
      avatar: "http://res.cloudinary.com/dv8c2pofx/image/upload/v1742800046/jpjrtn9pv1omzi1wgsn1.png",
      leaveType: "Casual Leave",
      startDate: "2025-03-13",
      endDate: "2025-03-13",
      createdOn: "12th, Mar 2025",
      days: 1,
      status: "Rejected",
      remarks: "To sick",
      rejectedBy: "Demo Manager",
      rejectionRemarks: "gfgfdgfdfdf"
    },
    {
      id: 2,
      employeeId: "DEMO0003",
      employeeName: "Demo Manager",
      avatar: "http://res.cloudinary.com/dv8c2pofx/image/upload/v1741182655/yie0goj65hk9e9egp6tx.png",
      leaveType: "Paid Leave",
      startDate: "2025-03-11",
      endDate: "2025-03-12",
      createdOn: "10th, Mar 2025",
      days: 2,
      status: "Rejected",
      remarks: "jfdtfrdtd",
      rejectedBy: "Hr Manager",
      rejectionRemarks: "jfff"
    },
    // Add more sample data as needed
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // PDF export functionality
  const { toPDF, targetRef } = usePDF({
    filename: 'rejected-leaves-report.pdf',
    page: { margin: 20 }
  });

  // Filter leaves based on search term
  const filteredLeaves = rejectedLeaves.filter(leave => 
    leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.rejectedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column justify-between m-0 mt-2">
        {/* Header section */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="my-auto mt-2">
            <div className="d-flex align-items-center gap-2">
              <h5 className="m-0 p-0 text-capitalize" style={{fontWeight: 500, color: 'var(--PrimaryColorDark)'}}>
                Rejected Leaves
              </h5>
              <p className="my-0 d-flex align-items-center justify-content-center bg-primary text-white rounded-5 px-2" 
                 style={{fontWeight: 400}}>
                {filteredLeaves.length}
              </p>
            </div>
            <p className="m-0" style={{color: 'var(--Subtittles)'}}>
              You can see all rejected leave requests here
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="d-flex gap-2 justify-content-between py-3">
            <button 
              className="btn btn-danger rounded-2 py-0 shadow-sm d-flex justify-center align-items-center gap-2"
              onClick={toPDF}
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="fs-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path>
                <path fillRule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path>
              </svg>
              <p className="my-auto d-none d-md-flex fs-6">PDF</p>
            </button>
            
            <div className="searchholder p-0 d-flex position-relative">
              <input 
                className="form-control ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder" 
                type="text" 
                placeholder="Search by name" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{height: '100%', width: '100%', paddingLeft: '15%'}}
              />
              <svg 
                stroke="currentColor" 
                fill="none" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                height="1em" 
                width="1em" 
                xmlns="http://www.w3.org/2000/svg" 
                style={{color: 'black', position: 'absolute', top: '30%', left: '5%', opacity: 0.4}}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div id="clear-both"></div>
        
        {/* Table section - targetRef added for PDF export */}
        <div ref={targetRef}>
          <div style={{}}>
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
                    <th style={tableHeaderStyle}>User Profile</th>
                    <th style={tableHeaderStyle}>Leave Type</th>
                    <th style={tableHeaderStyle}>Start Date</th>
                    <th style={tableHeaderStyle}>End Date</th>
                    <th style={tableHeaderStyle}>Created On</th>
                    <th style={tableHeaderStyle}>Days</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Remarks</th>
                    <th style={tableHeaderStyle}>Rejected By</th>
                    <th className="text-end" style={tableHeaderStyle}>Rejection Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.length > 0 ? (
                    filteredLeaves.map(leave => (
                      <tr key={leave.id}>
                        <td className="text-capitalize px-0 py-1" style={tableCellStyle}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="mx-1 d-flex align-items-center justify-content-center" style={avatarStyle}>
                              <img src={leave.avatar} alt={leave.employeeName} style={avatarImageStyle} />
                            </div>
                            <div className="d-flex flex-column">
                              <span style={{fontSize: '0.9rem'}}>{leave.employeeId}</span>
                              <span>{leave.employeeName}</span>
                            </div>
                          </div>
                        </td>
                        <td className="text-capitalize" style={tableCellStyle}>{leave.leaveType}</td>
                        <td style={tableCellStyle}>{leave.startDate}</td>
                        <td style={tableCellStyle}>{leave.endDate}</td>
                        <td style={tableCellStyle}>{leave.createdOn}</td>
                        <td style={tableCellStyle}>{leave.days}</td>
                        <td style={tableCellStyle}>
                          <span className="badge-danger border">Rejected</span>
                        </td>
                        <td style={tableCellStyle}>
                          <textarea 
                            readOnly 
                            className="form-control ms-0 ms-md-auto rounded-2 bg-light text-dark" 
                            style={{height: '2rem'}}
                            value={leave.remarks}
                          />
                        </td>
                        <td style={tableCellStyle}>{leave.rejectedBy}</td>
                        <td className="text-end" style={tableCellStyle}>
                          <textarea 
                            readOnly 
                            className="form-control ms-0 ms-md-auto rounded-2 bg-light text-dark" 
                            style={{height: '2rem'}}
                            value={leave.rejectionRemarks}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-4">
                        No rejected leaves found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination */}
          <div className="container-fluid d-flex flex-column-reverse gap-4 py-2 px-2 rounded-2 gap-md-0 flex-md-row w-100 justify-content-between align-items-center my-2" 
               style={{background: 'var(--primaryDashMenuColor)'}}>
            <div className="d-flex flex-column-reverse gap-4 py-1 px-2 rounded-2 gap-md-0 flex-md-row w-100 justify-content-between align-items-center" 
                 style={{background: 'var(--secondaryDashMenuColor)'}}>
              <div className="my-auto" style={{color: 'black'}}>
                Showing 1 to {filteredLeaves.length} of {filteredLeaves.length} results
              </div>
              <div className="d-flex align-items-center gap-1">
                <button className="btn bg-light text-dark rounded-2 border shadow-sm mx-1 d-flex align-items-center gap-2" disabled>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="my-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <polyline fill="none" strokeWidth="2" points="9 6 15 12 9 18" transform="matrix(-1 0 0 1 24 0)"></polyline>
                  </svg>
                  <span className="d-none d-md-flex">Previous</span>
                </button>
                <div className="pagination d-flex flex-nowrap gap-2">
                  <button className="bg-primary text-white border-0 rounded-2" style={paginationButtonStyle}>1</button>
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
  );
};

// Style objects (same as previous example)
const tableHeaderStyle = {
  verticalAlign: 'middle',
  whiteSpace: 'pre',
  background: 'rgb(238, 238, 238)',
  color: 'rgb(83, 88, 98)',
  border: 'none',
  position: 'sticky',
  top: '0rem',
  zIndex: 2
};

const tableCellStyle = {
  verticalAlign: 'middle',
  whiteSpace: 'pre',
  background: 'transparent',
  color: 'var(--secondaryDashColorDark)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
};

const avatarStyle = {
  height: '30px',
  width: '30px',
  borderRadius: '50%',
  backgroundColor: 'rgb(204, 204, 204)',
  color: 'white',
  fontWeight: 'bold',
  overflow: 'hidden',
  objectFit: 'cover'
};

const avatarImageStyle = {
  height: '100%',
  width: '100%',
  borderRadius: '50%',
  objectFit: 'cover'
};

const paginationButtonStyle = {
  border: 'none',
  height: '2.3rem',
  width: '2.3rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

export default RejectedLeave;