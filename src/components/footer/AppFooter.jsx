import React, { useEffect, useState } from 'react';
import { CFooter } from '@coreui/react';

const AppFooter = () => {
  const [sidebarWidth, setSidebarWidth] = useState(250); // Default expanded width
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [dateTimeString, setDateTimeString] = useState('');

  // Get formatted date and time
  const getFormattedDateTime = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return now.toLocaleDateString('en-US', options);
  };

  // Update time every second
  useEffect(() => {
    setDateTimeString(getFormattedDateTime());
    const timer = setInterval(() => {
      setDateTimeString(getFormattedDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Detect sidebar state changes
  useEffect(() => {
    const checkSidebarState = () => {
      // Adjust this selector based on your sidebar's minimized class
      const sidebar = document.querySelector('.c-sidebar') || 
                     document.querySelector('.sidebar') || 
                     document.querySelector('.app-sidebar');
      
      if (sidebar) {
        const minimized = sidebar.classList.contains('c-sidebar-minimized') || 
                         sidebar.classList.contains('sidebar-minimized') ||
                         sidebar.classList.contains('minimized');
        
        setIsSidebarMinimized(minimized);
        setSidebarWidth(minimized ? 56 : 250); // 56px is typical minimized width
      }
    };

    // Initial check
    checkSidebarState();

    // Set up MutationObserver to detect class changes
    const observer = new MutationObserver(checkSidebarState);
    const sidebar = document.querySelector('.c-sidebar') || 
                   document.querySelector('.sidebar') || 
                   document.querySelector('.app-sidebar');
    
    if (sidebar) {
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <CFooter 
      className="d-flex justify-content-center align-items-center gap-3 gap-md-5 p-2"
      style={{
        backgroundColor: 'var(--primaryDashMenuColor, #ffffff)',
        color: 'var(--primaryDashColorDark, #333333)',
        height: '60px',
        width: isSidebarMinimized ? '100%' : `calc(100% - ${sidebarWidth}px)`,
        marginLeft: isSidebarMinimized ? '0' : `${sidebarWidth}px`,
        position: 'fixed',
        bottom: 0,
        zIndex: 100,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Rest of your footer content remains the same */}
      <span className="d-none d-md-flex">
        <span className="text-capitalize">{dateTimeString}</span>
      </span>
      <span className="d-flex align-items-center gap-1 gap-md-2">
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" 
             strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" 
             xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
          <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
        <span className="d-none d-md-flex">Connected</span>
      </span>
      <span className="d-flex align-items-center gap-1">
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" 
             height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M131.5 217.5L55.1 100.1c47.6-59.2 119-91.8 192-92.1 42.3-.3 85.5 10.5 124.8 33.2 43.4 25.2 76.4 61.4 97.4 103L264 133.4c-58.1-3.4-113.4 29.3-132.5 84.1zm32.9 38.5c0 46.2 37.4 83.6 83.6 83.6s83.6-37.4 83.6-83.6-37.4-83.6-83.6-83.6-83.6 37.3-83.6 83.6zm314.9-89.2L339.6 174c37.9 44.3 38.5 108.2 6.6 157.2L234.1 503.6c46.5 2.5 94.4-7.7 137.8-32.9 107.4-62 150.9-192 107.4-303.9zM133.7 303.6L40.4 120.1C14.9 159.1 0 205.9 0 256c0 124 90.8 226.7 209.5 244.9l63.7-124.8c-57.6 10.8-113.2-20.8-139.5-72.5z"></path>
        </svg>
        <span className="d-none d-md-flex">Chrome</span>
      </span>
      <span title="IP Address" className="d-flex align-items-center gap-1">
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" 
             strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" 
             xmlns="http://www.w3.org/2000/svg">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M16 2a3 3 0 0 1 2.995 2.824l.005 .176v14a3 3 0 0 1 -2.824 2.995l-.176 .005h-8a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h8zm-4 14a1 1 0 0 0 -.993 .883l-.007 .117l.007 .127a1 1 0 0 0 1.986 0l.007 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm1 -12h-2l-.117 .007a1 1 0 0 0 0 1.986l.117 .007h2l.117 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" 
                strokeWidth="0" fill="currentColor"></path>
        </svg>
        <span className="d-none d-md-flex">122.161.49.167</span>
      </span>
      <div className="d-none d-lg-flex">Unable to retrieve your location.</div>
    </CFooter>
  );
};

export default React.memo(AppFooter);