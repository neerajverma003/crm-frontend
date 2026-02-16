import React, { useState, useEffect } from 'react';
import LeaveForm from './leaveForm/LeaveForm.jsx';
import './Leave.css';

const Leave = () => {
  const [showForm, setShowForm] = useState(false);
  const [leaveBalance, setLeaveBalance] = useState({
    'Casual Leave (Paid)': 12,
    'Sick Leave (Paid)': 10,
    'Emergency Leave (Paid)': 5,
    'Unpaid Leave': 0 // Unlimited
  });

  const [history, setHistory] = useState([
    { id: 1, from: '2025-04-10', to: '2025-04-12', type: 'Sick Leave (Paid)', reason: 'Fever', status: 'Approved', appliedOn: '2025-04-08', updatedBy: 'HR Manager' },
    { id: 2, from: '2025-03-28', to: '2025-03-30', type: 'Casual Leave (Paid)', reason: 'Family Function', status: 'Pending', appliedOn: '2025-03-25', updatedBy: '' },
    { id: 3, from: '2025-02-14', to: '2025-02-14', type: 'Emergency Leave (Paid)', reason: 'Urgent work', status: 'Rejected', appliedOn: '2025-02-13', updatedBy: 'HR Manager' },
  ]);

  // Format date to "9th, Mar, 2024" format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    // Add ordinal suffix to day
    const dayWithSuffix = day + (day % 10 === 1 && day !== 11 ? 'st' : 
                          day % 10 === 2 && day !== 12 ? 'nd' : 
                          day % 10 === 3 && day !== 13 ? 'rd' : 'th');
    
    return `${dayWithSuffix}, ${month}, ${year}`;
  };

  const calculateLeaveDays = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate - fromDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Define the leave type mapping
  const leaveTypeMap = {
    'Sick Leave': 'Sick Leave (Paid)',
    'Casual Leave': 'Casual Leave (Paid)',
    'Paid Leave': 'Emergency Leave (Paid)',
    'unPaid Leave': 'Unpaid Leave',
    'Paternity Leave': 'Paternity Leave (Paid)'
  };

  const handleLeaveSubmit = async (formData) => {
    const leaveDays = calculateLeaveDays(formData.startDate, formData.endDate);
    const mappedLeaveType = leaveTypeMap[formData.leaveType];

    try {
      const res = await fetch("http://localhost:5000/apply-leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: "6640fc93530c32158b8e3f4a",
          leaveType: mappedLeaveType,
          from: formData.startDate,
          to: formData.endDate,
          reason: formData.reason
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to apply leave");
      }

      const newEntry = {
        id: Date.now(),
        type: mappedLeaveType,
        from: formData.startDate,
        to: formData.endDate,
        reason: formData.reason,
        days: leaveDays,
        appliedOn: new Date().toISOString().split('T')[0],
        status: 'Pending',
        updatedBy: ''
      };

      setHistory(prev => [newEntry, ...prev]);

      // Update balance only for paid leaves
      if (mappedLeaveType !== 'Unpaid Leave') {
        setLeaveBalance(prev => ({
          ...prev,
          [mappedLeaveType]: prev[mappedLeaveType] - leaveDays
        }));
      }

      alert('✅ Leave applied successfully!');
      setShowForm(false);
      return true;

    } catch (error) {
      console.error('Leave submission error:', error);
      alert(`❌ ${error.message}`);
      return false;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Approved': 'approved',
      'Pending': 'pending',
      'Rejected': 'rejected'
    };
    return <span className={`badge ${statusClasses[status]}`}>{status}</span>;
  };

  return (
    <div className="leave-container">
      <div className="leave-header">
        <h1>Leave Management</h1>
        <button 
          className={`toggle-btn ${showForm ? 'cancel' : 'apply'}`} 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '➕ Apply for Leave'}
        </button>
      </div>

      {showForm && (
        <LeaveForm 
          onSubmit={handleLeaveSubmit} 
          onCancel={() => setShowForm(false)} 
          leaveBalance={leaveBalance}
        />
      )}

      <div className="leave-balance-card">
        <h3>Your Leave Balance</h3>
        <div className="balance-grid">
          {Object.entries(leaveBalance).map(([type, days]) => (
            <div key={type} className="balance-item">
              <div className="balance-type">{type}</div>
              <div className="balance-days">{type === 'Unpaid Leave' ? 'Unlimited' : `${days} days`}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="leave-history-card">
        <div className="history-header">
          <h3>Leave History</h3>
          <div className="history-stats">
            <span>Total: {history.length}</span>
            <span>Approved: {history.filter(h => h.status === 'Approved').length}</span>
            <span>Pending: {history.filter(h => h.status === 'Pending').length}</span>
            <span>Rejected: {history.filter(h => h.status === 'Rejected').length}</span>
          </div>
        </div>
        
        {history.length === 0 ? (
          <div className="no-history">No leave history found</div>
        ) : (
          <div className="table-responsive">
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Applied On</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Updated By</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id} className={`status-${entry.status.toLowerCase()}`}>
                    <td>{formatDate(entry.appliedOn)}</td>
                    <td>{entry.type}</td>
                    <td>{formatDate(entry.from)}</td>
                    <td>{formatDate(entry.to)}</td>
                    <td>{calculateLeaveDays(entry.from, entry.to)}</td>
                    <td className="reason-cell">{entry.reason}</td>
                    <td>{getStatusBadge(entry.status)}</td>
                    <td>{entry.updatedBy || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leave;