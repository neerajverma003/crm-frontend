import React, { useState } from 'react';
import './AssignLeave.css';

const AssignLeave = () => {
  const [formData, setFormData] = useState({
    employees: '',
    sickLeave: '',
    paidLeave: '',
    casualLeave: '',
    paternityLeave: '',
    maternityLeave: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="container-fluid" style={{ color: 'black' }}>
      <div className="mb-3">
        <div className="my-auto mt-2">
          <div className="d-flex align-items-center gap-2">
            <h5 className="m-0 p-0 text-capitalize" style={{ fontWeight: 500, color: 'var(--PrimaryColorDark)' }}>
              Leave Application Form
            </h5>
          </div>
          <p className="m-0" style={{ color: 'var(--Subtittles)' }}>
            You can assign employee leave from here
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="employees" className="form-label">Select Employees</label>
            <select
              className="form-control rounded-2 bg-light text-dark border dark-placeholder"
              id="employees"
              name="employees"
              value={formData.employees}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="emp1">Employee 1</option>
              <option value="emp2">Employee 2</option>
              <option value="emp3">Employee 3</option>
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="sickLeave" className="form-label">Sick Leave</label>
            <input
              type="number"
              className="form-control rounded-2 bg-light text-dark border dark-placeholder"
              id="sickLeave"
              name="sickLeave"
              min="0"
              placeholder="Please Enter Number of Sick Leave"
              value={formData.sickLeave}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="paidLeave" className="form-label">Paid Leave</label>
            <input
              type="number"
              className="form-control rounded-2 bg-light text-dark border dark-placeholder"
              id="paidLeave"
              name="paidLeave"
              min="0"
              placeholder="Please Enter Number of Paid Leave"
              value={formData.paidLeave}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="casualLeave" className="form-label">Casual Leave</label>
            <input
              type="number"
              className="form-control rounded-2 bg-light text-dark border dark-placeholder"
              id="casualLeave"
              name="casualLeave"
              min="0"
              placeholder="Please Enter Number of Casual Leave"
              value={formData.casualLeave}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="paternityLeave" className="form-label">Paternity Leave</label>
            <input
              type="number"
              className="form-control rounded-2 bg-light text-dark border dark-placeholder"
              id="paternityLeave"
              name="paternityLeave"
              min="0"
              placeholder="Please Enter Number of Paternity Leave"
              value={formData.paternityLeave}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="maternityLeave" className="form-label">Maternity Leave</label>
            <input
              type="number"
              className="form-control rounded-2 bg-light text-dark border dark-placeholder"
              id="maternityLeave"
              name="maternityLeave"
              min="0"
              placeholder="Please Enter Number of Maternity Leave"
              value={formData.maternityLeave}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default AssignLeave;