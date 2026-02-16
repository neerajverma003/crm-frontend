import React, { useState } from 'react';
import './shiftMangment.css';

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [formData, setFormData] = useState({
    shiftName: '',
    startTime: '',
    endTime: '',
    minHours: '',
    minMinutes: ''
  });

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newShift = {
      ...formData,
      startTime: formatTime(formData.startTime),
      endTime: formatTime(formData.endTime),
      minHours: formData.minHours || '0',
      minMinutes: formData.minMinutes || '0'
    };
    setShifts([...shifts, newShift]);
    setFormData({
      shiftName: '',
      startTime: '',
      endTime: '',
      minHours: '',
      minMinutes: ''
    });
  };

  return (
    <div className="shift-container">
      <h2>Shift Management</h2>
      <p className="subtitle">You can create and view all shifts here.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="shiftName">Shift Name:</label>
          <input
            type="text"
            id="shiftName"
            placeholder="Enter shift name"
            value={formData.shiftName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start Time:</label>
          <input
            type="time"
            id="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time:</label>
          <input
            type="time"
            id="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="minHours">Minimum Login Hours:</label>
          <input
            type="text"
            id="minHours"
            placeholder="Enter minimum login hours"
            value={formData.minHours}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="minMinutes">Minimum Login Minutes:</label>
          <input
            type="text"
            id="minMinutes"
            placeholder="Enter minimum login minutes"
            value={formData.minMinutes}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="create-btn">Create Shift</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Shift Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Min Login Hours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{shift.shiftName}</td>
              <td>{shift.startTime}</td>
              <td>{shift.endTime}</td>
              <td>{shift.minHours} hours {shift.minMinutes} minutes</td>
              <td><span className="action-icon">&#9998;</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftManagement;