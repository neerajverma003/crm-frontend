import React from 'react';
import styles from './Dashboard.module.css';
import TimeLogSection from '../dashboard/TimeLogSection';
import LogBoard from '../dashboard/LogBoard';
import NoticeBoard from '../dashboard/NoticeBoard';
import CalendarSection from '../dashboard/CalendarSection';
import EmployeeLeave from '../dashboard/EmployeeLeave';
import TaskCompletionRate from '../dashboard/TaskCompletionRate';
import BirthdayBoard from '../dashboard/BirthdayBoard';
import EmployeeStatus from '../dashboard/EmployeeStatus';
import TeamRequest from '../dashboard/TeamRequest';
import Team from '../dashboard/Team'; 

const Dashboard = () => {
  return (
    <div className={styles.dashboardGrid}>
      <div className={`${styles.timeLog} ${styles.gridItem}`}>
        <TimeLogSection />
      </div>

      <div className={`${styles.logBoard} ${styles.gridItem}`}>
        <LogBoard />
      </div>

      <div className={`${styles.noticeBoard} ${styles.gridItem}`}>
        <NoticeBoard />
      </div>

      <div className={`${styles.employeeLeave} ${styles.gridItem}`}>
        <EmployeeLeave />
      </div>

      <div className={`${styles.taskCompletionRate} ${styles.gridItem}`}>
        <TaskCompletionRate />
      </div>

      <div className={`${styles.calendarSection} ${styles.gridItem}`}>
        <CalendarSection />
      </div>

      <div className={`${styles.teamMembers} ${styles.gridItem}`}>
        <EmployeeStatus />
      </div>



      <div className={`${styles.birthdayBoard} ${styles.gridItem}`}>
        <BirthdayBoard />
      </div>



      <div className={`${styles.teamMembers} ${styles.gridItem}`}>
        <TeamRequest />
      </div>

      <div className={`${styles.teamMembers} ${styles.gridItem}`}>
        <Team />
      </div>
    </div>
  );
};

export default Dashboard;
