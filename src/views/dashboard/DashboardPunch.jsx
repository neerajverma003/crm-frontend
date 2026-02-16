import React, { useState, useEffect } from 'react';

const DashboardPunch = ({ userId, onPunch }) => {
  const [status, setStatus] = useState('checking');
  const [lastPunch, setLastPunch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch this from your API
    const fetchStatus = () => {
      const punches = JSON.parse(localStorage.getItem('punches') || '[]');
      const userPunches = punches.filter(p => p.userId === userId);
      
      if (userPunches.length === 0) {
        setStatus('out');
      } else {
        const last = userPunches[userPunches.length - 1];
        setLastPunch(last);
        setStatus(last.type === 'in' ? 'in' : 'out');
      }
    };

    fetchStatus();
  }, [userId]);

  const handlePunch = () => {
    setIsLoading(true);
    const now = new Date();
    const punchTime = now.toISOString();
    const punchType = status === 'out' ? 'in' : 'out';
    
    // In a real app, you would send this to your API
    setTimeout(() => {
      const punches = JSON.parse(localStorage.getItem('punches') || '[]');
      const newPunch = {
        userId,
        type: punchType,
        time: punchTime,
        date: now.toLocaleDateString('en-GB'),
      };
      
      localStorage.setItem('punches', JSON.stringify([...punches, newPunch]));
      
      setLastPunch(newPunch);
      setStatus(punchType);
      setIsLoading(false);
      
      if (typeof onPunch === 'function') {
        onPunch(newPunch);
      }
    }, 500);
  };

  return (
    <button
      onClick={handlePunch}
      disabled={isLoading}
      className={`w-full py-2 px-4 rounded-md text-white font-medium text-sm transition-colors ${
        status === 'out' 
          ? 'bg-green-600 hover:bg-green-700' 
          : 'bg-red-600 hover:bg-red-700'
      } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        'Processing...'
      ) : status === 'out' ? (
        'Punch In'
      ) : (
        'Punch Out'
      )}
    </button>
  );
};

export default DashboardPunch;