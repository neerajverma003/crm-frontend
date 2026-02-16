import React from 'react';
import styles from './EmployeeLeave.module.css';
import { PieChart } from '@mui/x-charts/PieChart';



const EmployeeLeave = () => {
  const handleNextPage = () => {
    window.location.href = '/admin/leaveApplication';
  };

  const totalLeaves = 12;
  const takenLeaves = 6;
  const remainingLeaves = totalLeaves - takenLeaves;

  return (
    <div className={`${styles.leaveBoard} p-3 rounded shadow-sm`}>
      {/* Header */}
      <div className={`${styles.header} d-flex align-items-center justify-content-between`}>
        <span className={`${styles.title} d-flex align-items-center gap-2`}>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg" className={styles.icon}>
            <rect width="416" height="384" x="48" y="80" fill="none" strokeLinejoin="round" strokeWidth="32" rx="48" />
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M128 48v32m256-32v32m80 80H48" />
          </svg>
          Employee's Leave Board
        </span>
        <button className="btn btn-sm btn-icon" onClick={handleNextPage}>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg" className={styles.icon}>
            <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
          </svg>
        </button>
      </div>

      <hr className={styles.divider} />

      {/* Pie Chart Progress */}
      <div className={`${styles.progressCircle}`}>
        <PieChart
          series={[{ data: [{ id: 0, value: takenLeaves }, { id: 1, value: remainingLeaves }], innerRadius: 85, outerRadius: 125 }]}
          width={250}
          height={250}
          sx={{ margin: 'auto' }}
        />
        <div className={styles.pieCenterText}>
          <div className="fw-bold">{takenLeaves}</div>
          <div className="text-muted" style={{ fontSize: '0.85rem' }}>OUT OF {totalLeaves}</div>
        </div>
      </div>

      {/* Bottom row */}
      <div className={`${styles.bottomRow} d-flex align-items-center justify-content-between`}>
        <div className={`${styles.dateRange} d-flex align-items-center`}>
          <span>21st, Apr → 23rd, Apr</span>
        </div>
        <div className={`${styles.empName}`}>Demo Emp</div>
        <div className={`${styles.badges} d-flex align-items-center`}>
          <span className={`${styles.badge} ${styles.badgeSick}`}>Sick</span>
          <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeave;
