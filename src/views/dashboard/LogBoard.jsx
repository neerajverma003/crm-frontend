import React, { useState, useEffect } from 'react';

const LogBoard = () => {
  const [todayLogs, setTodayLogs] = useState({
    login: '--',
    logout: '--',
    break: '0 h 0 min',
    total: '0 h 0 min'
  });

  useEffect(() => {
    const updateLogs = () => {
      const today = new Date().toLocaleDateString('en-GB');
      const punches = JSON.parse(localStorage.getItem('punches') || '[]');
      const todayPunches = punches.filter(p => p.date === today);
      
      if (todayPunches.length === 0) {
        setTodayLogs({
          login: '--',
          logout: '--',
          break: '0 h 0 min',
          total: '0 h 0 min'
        });
        return;
      }

      // Find first punch in and last punch out
      const firstIn = todayPunches.find(p => p.type === 'in');
      const lastOut = todayPunches.reverse().find(p => p.type === 'out');
      
      // Calculate total time
      let totalMinutes = 0;
      let inTime = null;
      
      todayPunches.forEach(punch => {
        if (punch.type === 'in') {
          inTime = new Date(punch.time);
        } else if (punch.type === 'out' && inTime) {
          const outTime = new Date(punch.time);
          totalMinutes += (outTime - inTime) / (1000 * 60);
          inTime = null;
        }
      });
      
      // Format total time
      const hours = Math.floor(totalMinutes / 60);
      const mins = Math.floor(totalMinutes % 60);
      const totalTime = `${hours} h ${mins} min`;
      
      setTodayLogs({
        login: firstIn ? new Date(firstIn.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--',
        logout: lastOut ? new Date(lastOut.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--',
        break: '0 h 0 min', // You can implement break calculation if needed
        total: totalTime
      });
    };

    // Update initially and then every minute
    updateLogs();
    const interval = setInterval(updateLogs, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-2 px-3 shadow-sm rounded-2 flex flex-col gap-2 h-[250px] w-[425px] bg-[rgb(245,245,246)] text-black border border-[rgba(223,220,220,0.95)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[rgb(60,60,60)] font-semibold text-base">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="1em" width="1em">
            <path d="M248,128a8,8,0,0,1-8,8H223.33A48.08,48.08,0,0,1,176,176H136v24h24a32,32,0,0,1,32,32,8,8,0,0,1-16,0,16,16,0,0,0-16-16H136v16a8,8,0,0,1-16,0V216H96a16,16,0,0,0-16,16,8,8,0,0,1-16,0,32,32,0,0,1,32-32h24V176H80a48.08,48.08,0,0,1-47.33-40H16a8,8,0,0,1,0-16H40a8,8,0,0,1,8,8,32,32,0,0,0,32,32h96a32,32,0,0,0,32-32,8,8,0,0,1,8-8h24A8,8,0,0,1,248,128ZM67.91,138.48a16,16,0,0,1-3.75-12.74l13.72-96A16.08,16.08,0,0,1,93.72,16h68.56a16.08,16.08,0,0,1,15.84,13.74l13.72,96A16,16,0,0,1,176,144H80A16,16,0,0,1,67.91,138.48ZM80,128h96L162.28,32H93.71Z"></path>
          </svg>
          Log Board
        </span>
        <a href="/attendance" className="cursor-pointer no-underline">
          <span className="flex items-center p-1 rounded-full bg-[rgba(0,123,255,0.1)]">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="0.8em" width="0.8em">
              <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
            </svg>
          </span>
        </a>
      </div>

      {/* Stats Grid - Compact 2x2 layout */}
      <div className="row g-2">
        {/* Login Time */}
        <div className="col-6 h-50">
          <div className="h-full p-2 rounded-3 shadow-sm bg-white border border-[rgba(0,0,0,0.05)] flex flex-col justify-between">
            <h4 className="text-center mb-1 font-normal text-[0.95rem]">{todayLogs.login}</h4>
            <div className="flex items-center justify-between">
              <span className="text-[0.8rem]">Today's login</span>
              <div className="h-6 w-6 rounded-full bg-[rgba(171,249,167,0.2)] flex items-center justify-center">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-success" height="0.8em" width="0.8em">
                  <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M192 176v-40a40 40 0 0140-40h160a40 40 0 0140 40v240a40 40 0 01-40 40H240c-22.09 0-48-17.91-48-40v-40"></path>
                  <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M288 336l80-80-80-80M80 256h272"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Time */}
        <div className="col-6 h-50">
          <div className="h-full p-2 rounded-3 shadow-sm bg-white border border-[rgba(0,0,0,0.05)] flex flex-col justify-between">
            <h4 className="text-center mb-1 font-normal text-[0.95rem]">{todayLogs.logout}</h4>
            <div className="flex items-center justify-between">
              <span className="text-[0.8rem]">Today's logout</span>
              <div className="h-6 w-6 rounded-full bg-[rgba(255,142,134,0.2)] flex items-center justify-center">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-danger" height="0.8em" width="0.8em">
                  <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40m64 160l80-80-80-80m-192 80h256"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Break Time */}
        {/* <div className="col-6 h-50">
          <div className="h-full p-2 rounded-3 shadow-sm bg-white border border-[rgba(0,0,0,0.05)] flex flex-col justify-between">
            <h4 className="text-center mb-1 font-normal text-[0.95rem]">{todayLogs.break}</h4>
            <div className="flex items-center justify-between">
              <span className="text-[0.8rem]">Total break</span>
              <div className="h-6 w-6 rounded-full bg-[rgba(251,255,128,0.2)] flex items-center justify-center">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-warning" height="0.8em" width="0.8em">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
            </div>
          </div>
        </div> */}

        {/* Total Login Time */}
        <div className="col-6 h-50">
          <div className="h-full p-2 rounded-3 shadow-sm bg-white border border-[rgba(0,0,0,0.05)] flex flex-col justify-between">
            <h4 className="text-center mb-1 font-normal text-[0.95rem]">{todayLogs.total}</h4>
            <div className="flex items-center justify-between">
              <span className="text-[0.8rem]">Total login</span>
              <div className="h-6 w-6 rounded-full bg-[rgba(222,204,250,0.2)] flex items-center justify-center">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-primary" height="0.8em" width="0.8em">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M4 19V8h16v3.29c.72.22 1.4.54 2 .97V8c0-1.11-.89-2-2-2h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h7.68c-.3-.62-.5-1.29-.6-2H4zm6-15h4v2h-4V4z"></path>
                  <path d="M18 13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm1.65 7.35L17.5 18.2V15h1v2.79l1.85 1.85-.7.71z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogBoard;