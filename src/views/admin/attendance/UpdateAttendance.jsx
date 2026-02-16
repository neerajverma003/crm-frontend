import React, { useState } from 'react';
import './UpdateAttendance.css'


const UpdateAttendance = () => {
  const [formData, setFormData] = useState({
    email: '',
    date: '',
    login: '',
    logout: '',
    remark: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, date, login, logout, remark } = formData;

    console.log("Attendance Updated:");
    console.log("Email:", email);
    console.log("Date:", date);
    console.log("Login Time:", login);
    console.log("Logout Time:", logout);
    console.log("Remark:", remark);

    alert("Attendance updated successfully!");
    setFormData({
      email: '',
      date: '',
      login: '',
      logout: '',
      remark: '',
    });
  };

  return (
    <div className="attendance-container">
      <h2>Update Attendance</h2>
      <p className="subtitle">You can update user attendance here.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Select Email:</label>
          <select id="email" value={formData.email} onChange={handleChange} required>
            <option value="">Select an email</option>
            <option value="user1@example.com">user1@example.com</option>
            <option value="user2@example.com">user2@example.com</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="login">Login Time:</label>
          <input type="time" id="login" value={formData.login} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="logout">Logout Time:</label>
          <input type="time" id="logout" value={formData.logout} onChange={handleChange} required />
        </div>

        <div className="form-group full-width">
          <label htmlFor="remark">Remark:</label>
          <textarea
            id="remark"
            rows="3"
            placeholder="Enter any remark..."
            value={formData.remark}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="update-btn">Update Attendance</button>
      </form>
    </div>
  );
};

export default UpdateAttendance;