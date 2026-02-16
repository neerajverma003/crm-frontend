import React from 'react';
import styles from './Team.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Team = () => {
  const teams = [
    { name: 'Human Resource', icon: 'fas fa-user-friends', link: 'hr.html' },
    { name: 'Marketing', icon: 'fas fa-chart-line', link: 'marketing.html' },
    { name: 'Software', icon: 'fas fa-code', link: 'software.html' },
  ];

  return (
    <div className={styles.teamsContainer}>
      <div className={styles.teamsTitle}>
        <i className="fas fa-users"></i>
        <span>Teams</span>
      </div>

      <div className={styles.teamList}>
        {teams.map((team, index) => (
          <div
            key={index}
            className={styles.teamItem}
            onClick={() => (window.location.href = team.link)}
          >
            <div className={styles.teamInfo}>
              <div className={styles.teamIcon}>
                <i className={team.icon}></i>
              </div>
              <div className={styles.teamName}>{team.name}</div>
            </div>
            <div className={styles.teamArrow}>
              <i className="fas fa-chevron-right"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
