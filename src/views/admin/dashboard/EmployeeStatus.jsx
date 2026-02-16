import React from 'react';
import styles from './EmployeeStatus.module.css';

const EmployeeStatus = () => {
  const members = [
    { name: 'Demo Emp', role: 'Digital Marketing', image: 'http://res.cloudinary.com/dv8c2pofx/image/upload/v1742800046/jpjrtn9pv1omzi1wgsn1.png', status: 'Absent' },
    { name: 'Amar Kumar', role: 'Digital Marketing', image: 'http://res.cloudinary.com/dv8c2pofx/image/upload/v1741589839/h1jguizgcalg0qg1jynz.png', status: 'Absent' },
    { name: 'AMAR Demo', role: 'Digital Marketing', image: 'http://res.cloudinary.com/dv8c2pofx/image/upload/v1741366551/yr5vavqozjzjfkyxoko2.png', status: 'Absent' },
    { name: 'Akash Singh', role: 'Digital Marketing', image: 'http://res.cloudinary.com/dv8c2pofx/image/upload/v1741366575/wpgjjs0vevihly4ucahr.jpg', status: 'Absent' },
    { name: 'Rahul Sharma', role: 'Employee', image: '', status: 'Absent' },
  ];

  return (
    <section className={styles.teamMembers}>
      <div className="d-flex flex-column gap-3">
        {/* My Team Members Card */}
        <div className={`px-3 shadow-sm rounded-2 d-flex flex-column gap-2 justify-content-between pb-3 pt-2`} style={{ height: '17rem', overflow: 'hidden', color: 'black', background: 'rgb(245, 245, 246)', border: '1px solid rgba(223, 220, 220, 0.95)' }}>
          <div className="d-flex align-items-center justify-content-between mt-1">
            <span className="d-flex align-items-center gap-2" style={{ color: 'rgb(60, 60, 60)', fontWeight: '600', fontSize: '1rem' }}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="fs-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M824.2 699.9a301.55 301.55 0 0 0-86.4-60.4C783.1 602.8 812 546.8 812 484c0-110.8-92.4-201.7-203.2-200-109.1 1.7-197 90.6-197 200 0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 0 0-86.4 60.4C345 754.6 314 826.8 312 903.8a8 8 0 0 0 8 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5A226.62 226.62 0 0 1 612 684c60.9 0 118.2 23.7 161.3 66.8C814.5 792 838 846.3 840 904.3c.1 4.3 3.7 7.7 8 7.7h56a8 8 0 0 0 8-8.2c-2-77-33-149.2-87.8-203.9zM612 612c-34.2 0-66.4-13.3-90.5-37.5a126.86 126.86 0 0 1-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4 0 34.2-13.3 66.3-37.5 90.5A127.3 127.3 0 0 1 612 612zM361.5 510.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 0 1-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.9-1.7-203.3 89.2-203.3 199.9 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 0 0 8 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.9-1 6.5-4.7 6-8.7z"></path>
              </svg>
              Employee Status Board
            </span>
            <span className="d-flex align-items-center justify-content-center" style={{ minHeight: '1.6rem', minWidth: '1.6rem', borderRadius: '50%', background: 'rgb(211, 211, 211)' }}>
              {members.length}
            </span>
          </div>
          <div className="p-1 px-3 rounded-3" style={{ height: '13rem', overflow: 'auto', background: 'rgba(237, 237, 241, 0.957)' }}>
            {members.map((member, index) => (
              <div key={index} className="d-flex align-items-center justify-content-between my-2">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ height: '30px', width: '30px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(204, 204, 204)', fontSize: '14px', fontWeight: 'bold', color: 'rgb(255, 255, 255)' }}>
                    {member.image ? (
                      <img src={member.image} alt={member.name} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{member.name.split(' ').map(n => n[0]).join('')}</span>
                    )}
                  </div>
                  <div className="text-capitalize">
                    <span className="mx-1">{member.name}</span>
                    <br />
                    <span className="text-primary py-1 px-2 rounded-2" style={{ background: 'rgba(41, 132, 218, 0.13)', fontSize: '0.8rem' }}>
                      {member.role}
                    </span>
                  </div>
                </div>
                <div className="ms-auto mr-3">--</div>
                <div className="text-capitalize" style={{ fontSize: '0.8rem' }}>
                  <span className="text-danger py-1 px-2 rounded-2" style={{ background: 'rgba(243, 61, 61, 0.133)' }}>
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Half Day Card */}
        <div className={`px-3 shadow-sm rounded-2 d-flex flex-column gap-2 justify-content-between pb-3 pt-2`} style={{ color: 'black', background: 'rgb(245, 245, 246)', border: '1px solid rgba(223, 220, 220, 0.95)' }}>
          <div className="d-flex align-items-center justify-content-between mt-1">
            <span className="d-flex align-items-center gap-2" style={{ color: 'rgb(60, 60, 60)', fontWeight: '600', fontSize: '1rem' }}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"></path>
              </svg>
              Half Day (0)
            </span>
          </div>
          <div className="p-1 px-3 rounded-3" style={{ background: 'rgba(237, 237, 241, 0.957)' }}>
            <p className="text-muted mb-2">Good! No one is on half day today.</p>
          </div>
        </div>

        {/* Break Card */}
        <div className={`px-3 shadow-sm rounded-2 d-flex flex-column gap-2 justify-content-between pb-3 pt-2`} style={{ color: 'black', background: 'rgb(245, 245, 246)', border: '1px solid rgba(223, 220, 220, 0.95)' }}>
          <div className="d-flex align-items-center justify-content-between mt-1">
            <span className="d-flex align-items-center gap-2" style={{ color: 'rgb(60, 60, 60)', fontWeight: '600', fontSize: '1rem' }}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 7c0 .55.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1zm5 5H7c-.55 0-1 .45-1 1s.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1zm4 0h-1v2h1c.55 0 1-.45 1-1s-.45-1-1-1zm-1-2h1c.55 0 1-.45 1-1s-.45-1-1-1h-1v2z"></path>
              </svg>
              Break (0)
            </span>
          </div>
          <div className="p-1 px-3 rounded-3" style={{ background: 'rgba(237, 237, 241, 0.957)' }}>
            <p className="text-muted mb-2">Nice! No one is on break currently.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployeeStatus;