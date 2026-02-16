import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

const ApplyLeave = () => {
  // Sample leave balance data
  const leaveBalances = {
    'Sick Leave': { total: 12, taken: 3, remaining: 9 },
    'Casual Leave': { total: 15, taken: 5, remaining: 10 },
    'Paid Leave': { total: 30, taken: 10, remaining: 20 },
    'unPaid Leave': { total: 0, taken: 0, remaining: 0 },
    'Maternity Leave': { total: 180, taken: 0, remaining: 180 }
  };

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    additionalManager: '',
    reason: ''
  });

  const [availableLeave, setAvailableLeave] = useState(null);
  const [calculatedDays, setCalculatedDays] = useState(0);

  // Update available leave when leave type changes
  useEffect(() => {
    if (formData.leaveType && leaveBalances[formData.leaveType]) {
      setAvailableLeave(leaveBalances[formData.leaveType]);
    } else {
      setAvailableLeave(null);
    }
  }, [formData.leaveType]);

  // Calculate days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setCalculatedDays(diffDays);
    } else {
      setCalculatedDays(0);
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Leave application submitted:', formData);
    alert('Leave application submitted successfully!');
    setShowForm(false);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      additionalManager: '',
      reason: ''
    });
    setAvailableLeave(null);
    setCalculatedDays(0);
  };

  return (
    <div className="container-fluid py-2" style={{ color: 'var(--primaryDashColorDark)' }}>
      <div className="d-flex justify-content-between py-2">
        <div className="my-auto mt-2">
          <div className="d-flex align-items-center gap-2">
            <h5 className="m-0 p-0 text-capitalize" style={{ fontWeight: 500, color: 'var(--PrimaryColorDark)' }}>
              Your Leave Applications
            </h5>
          </div>
          <p className="m-0" style={{ color: 'var(--Subtittles)' }}>
            You can view and create leave requests here.
          </p>
        </div>
        
        <button 
          className="btn btn-primary my-auto d-flex align-items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <FaPlus /> Apply Leave
        </button>
      </div>

      {/* Leave Application Form */}
      {showForm && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Apply for Leave</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowForm(false);
                    handleReset();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit} onReset={handleReset}>
                  {/* Leave Type Selection */}
                  <div className="mb-3">
                    <label htmlFor="leaveType" className="form-label">Select Leave Type</label>
                    <select
                      className="form-select rounded-2 bg-light text-dark border dark-placeholder"
                      id="leaveType"
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>-- Select Leave Type --</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Paid Leave">Paid Leave</option>
                      <option value="unPaid Leave">unPaid Leave</option>
                      <option value="Maternity Leave">Maternity Leave</option>
                    </select>
                  </div>

                  {/* Leave Balance Display */}
                  <div className="mb-3">
                    <label className="form-label">Available Leave</label>
                    <div className="rounded-2 p-3" style={{ background: 'rgba(201, 34, 34, 0.118)' }}>
                      {availableLeave ? (
                        <div className="row">
                          <div className="col-md-4">
                            <div className="text-center">
                              <div className="fw-bold">{availableLeave.total}</div>
                              <small className="text-muted">Total</small>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="text-center">
                              <div className="fw-bold">{availableLeave.taken}</div>
                              <small className="text-muted">Taken</small>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="text-center">
                              <div className="fw-bold text-success">{availableLeave.remaining}</div>
                              <small className="text-muted">Remaining</small>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted">Please select a leave type</div>
                      )}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="startDate" className="form-label">Start Date:</label>
                      <input
                        type="date"
                        className="form-control rounded-2 bg-light text-dark border-0"
                        id="startDate"
                        name="startDate"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="endDate" className="form-label">End Date:</label>
                      <input
                        type="date"
                        className="form-control rounded-2 bg-light text-dark border-0"
                        id="endDate"
                        name="endDate"
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        value={formData.endDate}
                        onChange={handleChange}
                        disabled={!formData.startDate}
                      />
                    </div>
                  </div>

                  {/* Days Calculation */}
                  {calculatedDays > 0 && (
                    <div className="mb-3">
                      <div className="alert alert-info py-2">
                        <span className="fw-bold">Leave Duration:</span> {calculatedDays} day(s)
                        {availableLeave && calculatedDays > availableLeave.remaining && (
                          <span className="text-danger ms-2">
                            (Warning: Exceeds your remaining balance)
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Manager and HR Info */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="manager" className="form-label">Reporting Manager:</label>
                      <input
                        className="form-control rounded-2 bg-light text-dark border-0"
                        id="manager"
                        name="manager"
                        disabled
                        placeholder="demo.admin@munc.in"
                        value="demo.admin@munc.in"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="hr" className="form-label">Reporting HR:</label>
                      <input
                        className="form-control rounded-2 bg-light text-dark border-0"
                        id="hr"
                        name="hr"
                        disabled
                        placeholder="hr@munc.in"
                        value="hr@munc.in"
                      />
                    </div>
                  </div>

                  {/* Additional Manager */}
                  <div className="mb-3">
                    <label htmlFor="additionalManager" className="form-label">Additional Manager:</label>
                    <select
                      className="form-select rounded-2 bg-light text-dark border dark-placeholder"
                      id="additionalManager"
                      name="additionalManager"
                      value={formData.additionalManager}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Additional Manager --</option>
                      <option value="demoemp2@munc.in">demoemp2@munc.in</option>
                      <option value="aloke@gmail.com">aloke@gmail.com</option>
                      <option value="sachin12@gmail.com">sachin12@gmail.com</option>
                    </select>
                  </div>

                  {/* Reason */}
                  <div className="mb-3" style={{ position: 'relative' }}>
                    <label htmlFor="reason" className="form-label">Reason:</label>
                    <textarea
                      className="form-control rounded-2 bg-light text-dark border dark-placeholder"
                      id="reason"
                      name="reason"
                      maxLength="100"
                      required
                      placeholder="Please mention the reason for leave"
                      value={formData.reason}
                      onChange={handleChange}
                      rows="3"
                    />
                    <span style={{ position: 'absolute', bottom: '0.2rem', right: '2rem' }}>
                      {100 - formData.reason.length} characters remaining
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <button type="reset" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave History Table (to be implemented) */}
      <div className="mt-4">
        <h6>Your Leave History</h6>
        <div className="alert alert-info">
          Leave history table will be displayed here
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;