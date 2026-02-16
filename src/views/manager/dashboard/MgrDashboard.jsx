import React from 'react';
import LogBoard from '../../dashboard/LogBoard';
import LeaveBoard from '../../dashboard/LeaveBoard';
import TimeLogSection from '../../dashboard/TimeLogSection';

import './MgrDashboard.css';

const DefaultLayout = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="dashboard-container">
      {/* Dashboard content */}
      <div className="dashboard-content">
        {/* Row 1 */}
        <div className="dashboard-row">
          <TimeLogSection />
          <LogBoard />
          <LeaveBoard />
        </div>
        
        {/* Row 2 */}
        {/* <div className="dashboard-row">
          <LeaveBoard />
          <TeamTask />
          <TeamMembers />
        </div> */}

        {/* Row 3 */}
        {/* <div className="dashboard-row">
          <CalendarSection />
          <BirthdayBoard />
        </div> */}
      </div>
    </div>
  );
};

export default DefaultLayout;
