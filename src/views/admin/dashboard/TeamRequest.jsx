import React from 'react';
import styles from './TeamRequest.module.css';

const TeamRequest = () => {
  const requests = [
    {
      employee: "Hr Manager",
      email: "demo.hr@munc.in",
      id: "TKT0012",
      date: "10 Mar 2025, 10:45",
      priority: "High",
      status: "Pending"
    },
    {
      employee: "Hr Manager",
      email: "demo.hr@munc.in",
      id: "TKT0018",
      date: "17 Mar 2025, 10:00",
      priority: "Medium",
      status: "Pending"
    },
    {
      employee: "Hr Manager",
      email: "demo.hr@munc.in",
      id: "TKT0020",
      date: "5 days ago",
      priority: "Medium",
      status: "Pending"
    }
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Team Request Board</h2>
      <div className={styles.gridContainer}>
        {/* Header Row */}
        <div className={`${styles.gridHeader} ${styles.employee}`}>Employee</div>
        <div className={`${styles.gridHeader} ${styles.id}`}>ID</div>
        <div className={`${styles.gridHeader} ${styles.priority}`}>Priority</div>
        <div className={`${styles.gridHeader} ${styles.status}`}>Status</div>

        {/* Data Rows */}
        {requests.map((request, index) => (
          <React.Fragment key={index}>
            <div className={styles.employee}>
              <strong>{request.employee}</strong>
              <div>{request.email}</div>
            </div>
            <div className={styles.id}>
              <strong>{request.id}</strong>
              <div>{request.date}</div>
            </div>
            <div className={styles.priority}>
              <div className={`${styles.priorityTag} ${styles[request.priority.toLowerCase()]}`}>
                <strong>{request.priority}</strong>
              </div>
              {request.priority === "High" }
            </div>
            <div className={styles.status}>
              <div><strong>Pending</strong></div>
              
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TeamRequest;