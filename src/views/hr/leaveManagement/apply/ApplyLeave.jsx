import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import ApplyLeaveForm from './ApplyLeaveForm.jsx';
// import './ApplyLeave.css';

const ApplyLeave = () => {
  // Sample leave data
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      leaveType: 'Sick Leave',
      from: '19th, Apr 2025',
      to: '19th, Apr 2025',
      days: 1,
      dayType: 'Full Day',
      createdAt: '18th, Apr 2025',
      remarks: 'sick',
      status: 'Pending',
      updatedBy: 'Not Updated',
      rejectionReason: 'Not Updated'
    },
    {
      id: 2,
      leaveType: 'Sick Leave',
      from: '18th, Apr 2025',
      to: '19th, Apr 2025',
      days: 2,
      dayType: 'Full Day',
      createdAt: '18th, Apr 2025',
      remarks: 'ufyfhf',
      status: 'Pending',
      updatedBy: 'Not Updated',
      rejectionReason: 'Not Updated'
    },
    {
      id: 3,
      leaveType: 'Paid Leave',
      from: '18th, Apr 2025',
      to: '19th, Apr 2025',
      days: 2,
      dayType: 'Full Day',
      createdAt: '18th, Apr 2025',
      remarks: 'yfyuffyfytff',
      status: 'Pending',
      updatedBy: 'Not Updated',
      rejectionReason: 'Not Updated'
    },
    {
      id: 4,
      leaveType: 'unPaid Leave',
      from: '21st, Apr 2025',
      to: '25th, Apr 2025',
      days: 5,
      dayType: 'Full Day',
      createdAt: '21st, Apr 2025',
      remarks: 'gh',
      status: 'Pending',
      updatedBy: 'Not Updated',
      rejectionReason: 'Not Updated'
    },
    {
      id: 5,
      leaveType: 'Paid Leave',
      from: '22nd, Apr 2025',
      to: '22nd, Apr 2025',
      days: 1,
      dayType: 'Full Day',
      createdAt: '21st, Apr 2025',
      remarks: 'reason',
      status: 'Pending',
      updatedBy: 'Not Updated',
      rejectionReason: 'Not Updated'
    },
    {
      id: 6,
      leaveType: 'Maternity Leave',
      from: '22nd, Apr 2025',
      to: '22nd, Apr 2025',
      days: 0.5,
      dayType: 'Half Day',
      createdAt: '21st, Apr 2025',
      remarks: 'reasonhjjk',
      status: 'Approved',
      updatedBy: 'Admin Admin',
      rejectionReason: 'Approved'
    }
  ]);

  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [newLeave, setNewLeave] = useState({
    leaveType: '',
    from: '',
    to: '',
    dayType: 'Full Day',
    remarks: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeave(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitLeave = (e) => {
    e.preventDefault();
    const days = calculateDays(newLeave.from, newLeave.to, newLeave.dayType);
    
    const leaveToAdd = {
      id: leaves.length + 1,
      leaveType: newLeave.leaveType,
      from: formatDate(newLeave.from),
      to: formatDate(newLeave.to),
      days: days,
      dayType: newLeave.dayType,
      createdAt: formatDate(new Date()),
      remarks: newLeave.remarks,
      status: 'Pending',
      updatedBy: 'Not Updated',
      rejectionReason: 'Not Updated'
    };
    
    setLeaves([leaveToAdd, ...leaves]);
    setNewLeave({
      leaveType: '',
      from: '',
      to: '',
      dayType: 'Full Day',
      remarks: ''
    });
    setShowLeaveForm(false);
  };

  const calculateDays = (from, to, dayType) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return dayType === 'Half Day' ? 0.5 : diffDays;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}${suffix}, ${month} ${year}`;
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between py-2">
        <div className="my-auto mt-2">
          {/* <div className="d-flex align-items-center gap-2">
            <h5 className="m-0 p-0 text-capitalize" style={{ fontWeight: 500, color: 'var(--PrimaryColorDark)' }}>
              Your Leave Application
            </h5>
            <p className="my-0 d-flex align-items-center justify-content-center bg-primary text-white rounded-5 px-2" style={{ fontWeight: 400 }}>
              {leaves.length}
            </p>
          </div> */}
          {/* <p className="m-0" style={{ color: 'var(--Subtittles)' }}>
            You can view your applied leaves here.
          </p> */}
        </div>
        {/* <button 
          className="btn btn-primary my-auto d-flex align-items-center gap-2"
          onClick={() => setShowLeaveForm(true)}
        >
          <FaPlus /> Apply Leave
        </button> */}
      </div>

      <ApplyLeaveForm 
        showLeaveForm={showLeaveForm}
        setShowLeaveForm={setShowLeaveForm}
        newLeave={newLeave}
        handleInputChange={handleInputChange}
        handleSubmitLeave={handleSubmitLeave}
      />

      <div>
        <div className="scroller mb-2 rounded-2" style={{ 
          height: 'fit-content', 
          maxHeight: '75vh', 
          overflow: 'auto', 
          position: 'relative', 
          border: 'var(--borderLight)' 
        }}>
          <table className="table mb-0 table-hover">
            <thead>
              <tr>
                <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>Leave Type</th>
                <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>From</th>
                <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>To</th>
                <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>Days</th>
                <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>Type</th>
                <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>Created At</th>
                <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>Remarks</th>
                <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>Status</th>
                <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>Update By</th>
                <th className="text-end" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>Reason for Rejection</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    {leave.leaveType}
                  </td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    {leave.from}
                  </td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    {leave.to}
                  </td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    {leave.days}
                  </td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    {leave.dayType}
                  </td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    {leave.createdAt}
                  </td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)', width: '300px' }}>
                    <textarea 
                      readOnly 
                      className="form-control ms-0 ms-md-auto rounded-2 bg-light text-dark" 
                      style={{ height: '2rem' }}
                      value={leave.remarks}
                    />
                  </td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    <span className={`status-badge ${leave.status === 'Approved' ? 'status-approved' : leave.status === 'Rejected' ? 'status-rejected' : 'status-pending'}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    {leave.updatedBy}
                  </td>
                  <td className="text-end" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    <textarea 
                      readOnly 
                      className="form-control ms-0 ms-md-auto rounded-2 bg-light text-dark" 
                      style={{ height: '2rem' }}
                      value={leave.rejectionReason}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="cntainer-fluid d-flex flex-column-reverse gap-4 py-2 px-2 rounded-2 gap-md-0 flex-md-row w-100 justify-content-between align-items-center my-2" style={{ background: 'var(--primaryDashMenuColor)' }}>
          <div className="d-flex flex-column-reverse gap-4 py-1 px-2 rounded-2 gap-md-0 flex-md-row w-100 justify-content-between align-items-center" style={{ background: 'var(--secondaryDashMenuColor)' }}>
            <div className="my-auto" style={{ color: 'black' }}>
              Showing 1 to {leaves.length} of {leaves.length} results
            </div>
            <div className="d-flex align-items-center gap-1">
              <button className="btn bg-light text-dark rounded-2 border shadow-sm mx-1 d-flex align-items-center gap-2" disabled>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="my-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <polyline fill="none" strokeWidth="2" points="9 6 15 12 9 18" transform="matrix(-1 0 0 1 24 0)"></polyline>
                </svg>
                <span className="d-none d-md-flex">Previous</span>
              </button>
              <div className="pagination d-flex flex-nowrap gap-2">
                <button className="bg-primary text-white border-0 rounded-2" style={{ border: 'none', height: '2.3rem', width: '2.3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
  );
};

export default ApplyLeave;