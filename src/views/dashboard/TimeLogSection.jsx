import React, { useState, useEffect } from 'react';

const TimeLogSection = () => {
  const [time, setTime] = useState('12:10:05');
  const [date, setDate] = useState('22 April 2025');
  const [logType, setLogType] = useState('monthly');
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [punches, setPunches] = useState([]);
  const [punchStatus, setPunchStatus] = useState('Punch In'); // 'Punch In' or 'Punch Out'
  const [lastPunchTime, setLastPunchTime] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }));
      
      const hours = now.getHours();
      if (hours >= 5 && hours < 8) setTimeOfDay('sunrise');
      else if (hours >= 8 && hours < 17) setTimeOfDay('day');
      else if (hours >= 17 && hours < 20) setTimeOfDay('sunset');
      else setTimeOfDay('night');
    };

    const interval = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(interval);
  }, []);

  const handleLogTypeChange = (e) => {
    setLogType(e.target.value);
  };

  const handlePunch = () => {
    const now = new Date();
    const punchTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const punchDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    const newPunch = {
      type: punchStatus,
      time: punchTime,
      date: punchDate,
      timestamp: now
    };
    
    setPunches(prev => [...prev, newPunch]);
    setLastPunchTime(`${punchTime} - ${punchDate}`);
    
    // Toggle the punch status for next time
    setPunchStatus(punchStatus === 'Punch In' ? 'Punch Out' : 'Punch In');
  };

  const getCelestialIcon = () => {
    const iconStyle = { width: '20px', height: '20px' };
    
    switch (timeOfDay) {
      case 'sunrise':
        return (
          <svg style={{...iconStyle, color: '#f59e0b'}} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        );
      case 'day':
        return (
          <svg style={{...iconStyle, color: '#eab308'}} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        );
      case 'sunset':
        return (
          <svg style={{...iconStyle, color: '#f97316'}} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        );
      case 'night':
        return (
          <svg style={{...iconStyle, color: '#60a5fa'}} fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        );
      default:
        return (
          <svg style={{...iconStyle, color: '#eab308'}} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const containerStyle = {
    height: '320px',
    width: '450px',
    padding: '24px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    color: 'black',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '12px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9'
  };

  const selectStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '16px',
    background: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '12px',
    marginBottom: '16px'
  };

  const statCardStyle = {
    padding: '12px',
    borderRadius: '8px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease'
  };

  const buttonStyle = {
    width: '100%',
    padding: '16px 24px',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    background: punchStatus === 'Punch In' 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
  };

  const lastPunchStyle = {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '12px',
    padding: '8px',
    background: '#f9fafb',
    borderRadius: '8px'
  };

  return (
    <div style={containerStyle}>
      {/* Header with Date/Time */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {getCelestialIcon()}
          <span style={{ fontWeight: '600', color: '#374151' }}>{date}</span>
        </div>
        <div>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{time}</span>
        </div>
      </div>

      {/* Log Type Selector */}
    

      {/* Stats Cards */}
      <div style={statsContainerStyle}>
        

       

       
      </div>

      {/* Last Punch Info */}
      {lastPunchTime && (
        <div style={lastPunchStyle}>
          🕐 Last {punchStatus === 'Punch In' ? 'Punch Out' : 'Punch In'} at <span style={{ fontWeight: '500' }}>{lastPunchTime}</span>
        </div>
      )}

      {/* Punch Button - Made More Prominent */}
      <button 
        onClick={handlePunch}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 12px 25px rgba(0,0,0,0.25)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
        }}
        onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
        onMouseUp={(e) => e.target.style.transform = 'scale(1.05)'}
      >
        {punchStatus === 'Punch In' ? (
          <>
            <svg style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            Punch In
          </>
        ) : (
          <>
            <svg style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 10.828V14a1 1 0 102 0v-3.172l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" />
            </svg>
            Punch Out
          </>
        )}
      </button>
    </div>
  );
};

export default TimeLogSection;