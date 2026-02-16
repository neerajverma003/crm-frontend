// import React, { useState, useEffect } from 'react';
// import styles from './Dashboard.module.css';
// import HolidaySection from './HolidaySection';
// import LogBoard from './LogBoard';
// import TeamTask from './TeamTask';
// import NoticeBoard from './NoticeBoard';
// import TeamMembers from './TeamMembers';
// import CalendarSection from './CalendarSection';
// import BirthdayBoard from './BirthdayBoard';
// // import nav from '../../../nav/nav_admin';

// const Dashboard = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <>
//     <div>
//       <nav/>
//     </div>
//     <div className={styles.dashboardGrid}>
//       {/* Header Section */}
//       <header className={styles.header}>
//         <h1 className={styles.time}>
//           {currentTime.toLocaleTimeString('en-US', {
//             hour: '2-digit',
//             minute: '2-digit',
//             second: '2-digit',
//             hour12: true
//           })}
//         </h1>
//         <h2 className={styles.subtitle}>Real time insight AM</h2>
//       </header>

//       {/* Month Log */}
//       <section className={`${styles.monthLog} ${styles.gridItem}`}>
//         <h2>This Month Log</h2>
//         <div className={styles.logDetails}>
//           <p><strong>Gross : 34 Hrs 4 Min</strong></p>
//           <p><strong>Break : 0 Hrs 0 Min</strong></p>
//           <p><strong>Net : 34 Hrs 4 Min</strong></p>
//         </div>
//       </section>

//       {/* Holiday Section */}
//       <div className={`${styles.holidaySection} ${styles.gridItem}`}>
//         <HolidaySection />
//       </div>

//       {/* Log Board */}
//       <div className={`${styles.logBoard} ${styles.gridItem}`}>
//         <LogBoard />
//       </div>

//       {/* Team Task */}
//       <div className={`${styles.teamTask} ${styles.gridItem}`}>
//         <TeamTask />
//       </div>

//       {/* Update Info */}
//       <div className={`${styles.updateInfo} ${styles.gridItem}`}>
//         <p>Last Update : 12 days ago</p>
//         <p>0.00%</p>
//       </div>

//       {/* Notice Board */}
//       <div className={`${styles.noticeBoard} ${styles.gridItem}`}>
//         <NoticeBoard />
//       </div>

//       {/* Team Members */}
//       <div className={`${styles.teamMembers} ${styles.gridItem}`}>
//         <TeamMembers />
//       </div>

//       {/* Calendar Section */}
//       <div className={`${styles.calendarSection} ${styles.gridItem}`}>
//         <CalendarSection />
//       </div>

//       {/* Birthday Board */}
//       <div className={`${styles.birthdayBoard} ${styles.gridItem}`}>
//         <BirthdayBoard />
//       </div>
//     </div>
//     </>
//   );
// };

// export default Dashboard;