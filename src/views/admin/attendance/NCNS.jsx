import React, { useState, useEffect } from 'react';

const NCNS = () => {
  const [ncns, setNcns] = useState(false);
  const [sandwich, setSandwich] = useState(false);
  const [manager, setManager] = useState('Hr Manager (DEMO0002)');
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('January');
  const [day, setDay] = useState('1');

  useEffect(() => {
    if (ncns) setSandwich(false);
  }, [ncns]);

  useEffect(() => {
    if (sandwich) setNcns(false);
  }, [sandwich]);

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#eaeced', padding: '20px', minHeight: '100vh' }}>
      <h2 style={{ color: '#0d47a1', marginBottom: '6px', fontWeight: 600 }}>NCNS And Sandwich Controller</h2>
      <p style={{ color: '#666', fontSize: '15px', marginBottom: '20px' }}>
        You can mark NCNS and Sandwich to the employee attendance.
      </p>

      <div style={{ background: '#f8f6f6', padding: '30px', borderRadius: '8px' }}>
        {/* Switches */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, fontSize: '16px', color: '#333' }}>
            NCNS
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '25px' }}>
              <input
                type="checkbox"
                checked={ncns}
                onChange={(e) => setNcns(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: ncns ? '#2196F3' : '#ccc', transition: '.4s', borderRadius: '25px'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: '18px', width: '18px',
                  left: ncns ? '28px' : '4px', bottom: '4px', backgroundColor: 'white',
                  transition: '.4s', borderRadius: '50%'
                }} />
              </span>
            </label>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, fontSize: '16px', color: '#333' }}>
            Sandwich
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '25px' }}>
              <input
                type="checkbox"
                checked={sandwich}
                onChange={(e) => setSandwich(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: sandwich ? '#2196F3' : '#ccc', transition: '.4s', borderRadius: '25px'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: '18px', width: '18px',
                  left: sandwich ? '28px' : '4px', bottom: '4px', backgroundColor: 'white',
                  transition: '.4s', borderRadius: '50%'
                }} />
              </span>
            </label>
          </label>

          <div style={{
            backgroundColor: '#ffffcc',
            padding: '8px 14px',
            fontSize: '14px',
            color: '#555',
            borderRadius: '6px'
          }}>
            You can select only one: Either NCNS or Sandwich Leave.
          </div>
        </div>

        {/* Manager Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="manager">HR Manager:</label>
          <select
            id="manager"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px', border: '1px solid #ccc',
              borderRadius: '8px', fontSize: '15px', marginTop: '6px'
            }}
          >
            <option>Hr Manager (DEMO0002)</option>
            <option>Hr Assistant (DEMO0003)</option>
            <option>Team Lead (DEMO0004)</option>
          </select>
        </div>

        {/* Date Selection */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <select value={year} onChange={(e) => setYear(e.target.value)} style={dropdownStyle}>
            <option>2024</option>
            <option>2025</option>
          </select>
          <select value={month} onChange={(e) => setMonth(e.target.value)} style={dropdownStyle}>
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
          </select>
          <select value={day} onChange={(e) => setDay(e.target.value)} style={dropdownStyle}>
            {[...Array(31).keys()].map((d) => (
              <option key={d + 1}>{d + 1}</option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(45deg, #0066ff, #0047b3)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px',
            boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)',
            transition: '0.3s'
          }}
        >
          Disable NCNS and Sandwich
        </button>
      </div>
    </div>
  );
};

const dropdownStyle = {
  flex: 1,
  padding: '12px 14px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '15px'
};

export default NCNS;
