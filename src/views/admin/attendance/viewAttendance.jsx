import React, { useState } from 'react';

const ViewAttendance = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [message, setMessage] = useState(
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <img
        src="https://cdn-icons-png.flaticon.com/512/7486/7486800.png"
        alt="No Data"
        style={{ width: '240px', marginBottom: '20px' }}
      />
      <p style={{ color: '#95a5a6', fontSize: '16px' }}>
        User not selected. To view data, please select a user.
      </p>
    </div>
  );

  const handleFetch = () => {
    if (selectedEmployee === '') {
      setMessage(
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486800.png"
            alt="No Data"
            style={{ width: '240px', marginBottom: '20px' }}
          />
          <p style={{ color: '#95a5a6', fontSize: '16px' }}>
            User not selected. To view data, please select a user.
          </p>
        </div>
      );
    } else {
      setMessage(
        <p style={{ color: '#2980b9', fontSize: '22px', fontWeight: 'bold', textAlign: 'center', marginTop: '80px' }}>
          Attendance data for {selectedEmployee} is being fetched...
        </p>
      );
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        margin: 0,
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        backgroundColor: '#f7f9fc',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <div>
          <h2 style={{ color: '#2588eb', margin: '0 0 5px 0' }}>Employee Wise Attendance</h2>
          <p style={{ color: '#7f8c8d', margin: 0 }}>You can view attendance by employee here.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              marginRight: '10px',
              width: '200px',
              backgroundColor: '#fff',
              fontSize: '14px',
              color: '#34495e',
            }}
          >
            <option value="">-- Select Employee --</option>
            <option value="DEMO0001 ➞ ADMIN ADMIN">DEMO0001 ➞ ADMIN ADMIN</option>
            <option value="DEMO0002 ➞ HR MANAGER">DEMO0002 ➞ HR MANAGER</option>
            <option value="DEMO0003 ➞ DEMO MANAGER">DEMO0003 ➞ DEMO MANAGER</option>
            <option value="DEMO0004 ➞ DEMO EMP">DEMO0004 ➞ DEMO EMP</option>
            <option value="DEMO0005 ➞ AMAR KUMAR">DEMO0005 ➞ AMAR KUMAR</option>
            <option value="DEMO0006 ➞ AMAR DEMO">DEMO0006 ➞ AMAR DEMO</option>
            <option value="DEMO0009 ➞ AKASH SINGH">DEMO0009 ➞ AKASH SINGH</option>
            <option value="DEMO0010 ➞ DEMO EMP2">DEMO0010 ➞ DEMO EMP2</option>
            <option value="DEMO0011 ➞ RAHUL SHARMA">DEMO0011 ➞ RAHUL SHARMA</option>
            <option value="DEMO0012 ➞ DEEPAK KUMAR">DEMO0012 ➞ DEEPAK KUMAR</option>
            <option value="DEMO0013 ➞ FAIZ ALAM">DEMO0013 ➞ FAIZ ALAM</option>
            <option value="DEMO0014 ➞ DEMO EMPLOYEE">DEMO0014 ➞ DEMO EMPLOYEE</option>
          </select>

          <button
            onClick={handleFetch}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#2980b9')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#3498db')}
          >
            Fetch Attendance
          </button>
        </div>
      </div>

      <div style={{ flex: 1 }}>{message}</div>
    </div>
  );
};

export default ViewAttendance;
