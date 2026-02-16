import React from 'react';
import './LeaveRegister.css';

const LeaveRegister = () => {
  const employees = [
    {
      id: "DEMO0004",
      name: "Demo Emp",
      gender: "Male",
      image: "http://res.cloudinary.com/dv8c2pofx/image/upload/v1742800046/jpjrtn9pv1omzi1wgsn1.png",
      sickLeave: { used: 0, total: 7 },
      maternityLeave: "Not Applicable",
      paternityLeave: { used: 0, total: 10 },
      casualLeave: { used: 2, total: 6 },
      paidLeave: { used: 2, total: 43 }
    },
    {
      id: "DEMO0005",
      name: "Amar kumar",
      gender: "Male",
      image: "http://res.cloudinary.com/dv8c2pofx/image/upload/v1741589839/h1jguizgcalg0qg1jynz.png",
      sickLeave: { used: 0, total: 1 },
      maternityLeave: "Not Applicable",
      paternityLeave: { used: 0, total: 5 },
      casualLeave: { used: 0, total: 5 },
      paidLeave: { used: 0, total: 15 }
    },
    // Add other employees similarly...
  ];

  const renderLeaveCell = (leave) => {
    if (typeof leave === 'string') {
      return <span>{leave}</span>;
    }
    return (
      <div className="rounded-2 d-flex align-items-center justify-content-evenly mx-auto gap-3 bg-white text-dark" 
           style={{boxShadow: "rgba(209, 206, 206, 0.31) 0px 0px 4px 2px inset"}}>
        <span className="p-2 px-3 rounded-2">{leave.used}</span> Out of 
        <span className="p-2 px-3 rounded-2">{leave.total}</span>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      <div className="my-2">
        <div className="my-auto mt-2">
          <div className="d-flex align-items-center gap-2">
            <h5 className="m-0 p-0 text-capitalize" style={{fontWeight: 500, color: "var(--PrimaryColorDark)"}}>
              Leave Register
            </h5>
          </div>
          <p className="m-0" style={{color: "var(--Subtittles)"}}>
            You can see all employee leave records here
          </p>
        </div>
      </div>
      
      <div>
        <div className="scroller mb-2 rounded-2" 
             style={{height: "fit-content", maxHeight: "80vh", overflow: "auto", position: "relative", border: "var(--borderLight)"}}>
          <table className="table mb-0 table-hover">
            <thead>
              <tr>
                <th style={{verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2}}>
                  <p className="d-flex align-items-center gap-2 m-0">
                    <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="fs-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z" fill="currentColor"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z" fill="currentColor"></path>
                    </svg>
                    User Profile
                  </p>
                </th>
                <th style={{verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2}}>
                  <p className="d-flex align-items-center justify-content-center gap-2 m-0">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="fs-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M11.5 1a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-3.45 3.45A4 4 0 0 1 8.5 10.97V13H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V14H6a.5.5 0 0 1 0-1h1.5v-2.03a4 4 0 1 1 3.471-6.648L14.293 1H11.5zm-.997 4.346a3 3 0 1 0-5.006 3.309 3 3 0 0 0 5.006-3.31z"></path>
                    </svg>
                    Gender
                  </p>
                </th>
                <th style={{verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2}}>
                  <p className="d-flex align-items-center justify-content-center gap-2 m-0">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="fs-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M7.32 10.56L8.38 9.5 7.32 8.44l1.06-1.06L10.5 9.5l-2.12 2.12-1.06-1.06zM4.5 9c.03 0 .05.01.08.01A8.002 8.002 0 0112 4c2.19 0 4.16.88 5.61 2.3.15-.6.45-1.29.81-1.96A9.965 9.965 0 0011.99 2c-4.88 0-8.94 3.51-9.81 8.14C2.74 9.44 3.59 9 4.5 9zM21 10.5c-.42 0-.82-.09-1.19-.22.12.55.19 1.13.19 1.72 0 4.42-3.58 8-8 8-3.36 0-6.23-2.07-7.42-5.01-.03 0-.05.01-.08.01-.52 0-1.04-.14-1.5-.4-.32-.18-.59-.42-.82-.7.89 4.61 4.93 8.1 9.8 8.1C17.52 22 22 17.52 22 12c0-.55-.06-1.09-.14-1.62a3.5 3.5 0 01-.86.12z"></path>
                    </svg>
                    Sick Leave
                  </p>
                </th>
                <th style={{verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2}}>
                  <p className="d-flex align-items-center justify-content-center gap-2 m-0">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" className="fs-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M92,144a16,16,0,1,1,16-16A16,16,0,0,1,92,144Zm72-32a16,16,0,1,0,16,16A16,16,0,0,0,164,112Zm-14.4,49.85a41,41,0,0,1-43.2,0,12,12,0,1,0-12.8,20.3,65,65,0,0,0,68.8,0,12,12,0,1,0-12.8-20.3ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84.1,84.1,0,0,0-78.08-83.77c-9.31,14.09-9.89,27-9.92,27.83a4,4,0,0,0,8-.06,12,12,0,0,1,24,0,28,28,0,0,1-56,0c0-.65.1-11.19,5.52-24.92A84,84,0,1,0,212,128Z"></path>
                    </svg>
                    Maternity Leave
                  </p>
                </th>
                <th style={{verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2}}>
                  <p className="d-flex align-items-center justify-content-center gap-2 m-0">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 32 32" className="fs-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 18 4 L 18 13 L 9.6875 13 C 9.457031 12.457031 9.089844 11.730469 8.46875 10.90625 C 7.414063 9.503906 5.605469 8 3 8 L 3 10 C 4.855469 10 6.046875 10.996094 6.875 12.09375 C 7.664063 13.140625 7.96875 14.125 8 14.21875 C 8.082031 17.609375 10.082031 20.539063 12.9375 22 C 11.320313 22.035156 10 23.375 10 25 C 10 26.644531 11.355469 28 13 28 C 14.644531 28 16 26.644531 16 25 C 16 24.113281 15.617188 23.300781 15 22.75 C 15.644531 22.898438 16.3125 23 17 23 L 20 23 C 20.6875 23 21.355469 22.898438 22 22.75 C 21.382813 23.300781 21 24.113281 21 25 C 21 26.644531 22.355469 28 24 28 C 25.644531 28 27 26.644531 27 25 C 27 23.375 25.679688 22.035156 24.0625 22 C 26.695313 20.652344 28.589844 18.054688 28.9375 15 C 28.96875 14.710938 28.996094 14.421875 29 14.125 C 29 14.105469 29 14.082031 29 14.0625 C 29 14.0625 29.007813 13.898438 29 13.625 L 29 13 L 28.9375 13 C 28.863281 12.042969 28.664063 10.59375 27.9375 9.0625 C 26.746094 6.554688 24.046875 4 19 4 Z M 20 6.125 C 23.613281 6.421875 25.292969 8.121094 26.15625 9.9375 C 26.746094 11.183594 26.878906 12.230469 26.9375 13 L 20 13 Z M 10.21875 15 L 26.78125 15 C 26.273438 18.363281 23.5 21 20 21 L 17 21 C 13.5 21 10.726563 18.363281 10.21875 15 Z M 13 24 C 13.5625 24 14 24.4375 14 25 C 14 25.5625 13.5625 26 13 26 C 12.4375 26 12 25.5625 12 25 C 12 24.4375 12.4375 24 13 24 Z M 24 24 C 24.5625 24 25 24.4375 25 25 C 25 25.5625 24.5625 26 24 26 C 23.4375 26 23 25.5625 23 25 C 23 24.4375 23.4375 24 24 24 Z"></path>
                    </svg>
                    Paternity Leave
                  </p>
                </th>
                <th style={{verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2}}>
                  <p className="d-flex align-items-center justify-content-center gap-2 m-0">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" className="fs-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M216,64H147.31l34.35-34.34a8,8,0,1,0-11.32-11.32L128,60.69,85.66,18.34A8,8,0,0,0,74.34,29.66L108.69,64H40A16,16,0,0,0,24,80V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64ZM40,80H144V200H40ZM216,200H160V80h56V200Zm-16-84a12,12,0,1,1-12-12A12,12,0,0,1,200,116Zm0,48a12,12,0,1,1-12-12A12,12,0,0,1,200,164Z"></path>
                    </svg>
                    Casual Leave
                  </p>
                </th>
                <th style={{verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2}}>
                  <p className="d-flex align-items-center justify-content-center gap-2 m-0">
                    <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true" className="fs-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Paid Leave
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={index}>
                  <td style={{verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)"}}>
                    <div className="d-flex align-items-center gap-3" style={{width: "fit-content"}}>
                      <div className="d-flex align-items-center justify-content-center" style={{height: "2.3rem", width: "2.3rem"}}>
                        {employee.image ? (
                          <img className="border" src={employee.image} alt={employee.name} 
                               style={{height: "100%", width: "100%", overflow: "hidden", borderRadius: "50%", objectFit: "cover"}} />
                        ) : (
                          <span className="text-capitalize d-flex border py-1 align-items-center justify-content-center" 
                                style={{height: "100%", width: "100%", overflow: "hidden", borderRadius: "50%", objectFit: "cover", fontWeight: 600, color: "rgba(0, 0, 0, 0.8)", background: "white"}}>
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>
                      <div>
                        <span>{employee.id}</span>
                        <div className="text-capitalize">{employee.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center" style={{verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)"}}>
                    <span className={`badge-${employee.gender === 'Female' ? 'pink' : 'primary'} border py-1`} 
                          style={{background: employee.gender === 'Female' ? '' : "rgb(42, 82, 190)"}}>
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        {employee.gender === 'Female' ? (
                          <path d="M61.6 464c3.6 0 7.1-1.4 9.6-4l44.8-44.8 37 37c2.6 2.6 6 4 9.6 4 3.6 0 7.1-1.4 9.6-4 5.3-5.3 5.3-13.9 0-19.2l-37-37 50-50c30.6 26 69.3 40.3 109.6 40.3 22.8 0 45-4.5 65.8-13.3 20.1-8.5 38.2-20.7 53.8-36.2 15.5-15.5 27.7-33.6 36.2-53.8 8.8-20.9 13.3-43 13.3-65.8s-4.5-45-13.3-65.8c-8.5-20.1-20.7-38.2-36.2-53.8-15.5-15.5-33.6-27.7-53.8-36.2-20.9-8.8-43-13.3-65.8-13.3-22.8 0-45 4.5-65.8 13.3-20.1 8.5-38.2 20.7-53.8 36.2-15.5 15.5-27.7 33.6-36.2 53.8-8.8 20.9-13.3 43-13.3 65.8 0 40.3 14.3 79 40.3 109.6l-50 50-37-37c-2.6-2.6-6-4-9.6-4-3.6 0-7.1 1.4-9.6 4-5.3 5.3-5.3 13.9 0 19.2l37 37L52 440.8c-5.3 5.3-5.3 13.9 0 19.2 2.6 2.6 6 4 9.6 4zm132.9-347.2C221.3 90 257 75.2 294.9 75.2c37.9 0 73.5 14.8 100.3 41.6 26.8 26.8 41.6 62.4 41.6 100.3s-14.8 73.5-41.6 100.3c-26.8 26.8-62.4 41.6-100.3 41.6s-73.5-14.8-100.3-41.6C167.7 290.7 153 255 153 217.1s14.7-73.5 41.5-100.3z"></path>
                        ) : (
                          <path d="M450.4 48H341.5c-7.5 0-13.6 6.1-13.6 13.6s6.1 13.6 13.6 13.6h75.4L326.7 166c-30.6-26-69.3-40.3-109.6-40.3-22.8 0-45 4.5-65.8 13.3-20.1 8.5-38.2 20.7-53.8 36.2C82 190.8 69.8 208.9 61.3 229 52.5 249.9 48 272 48 294.9s4.5 45 13.3 65.8c8.5 20.1 20.7 38.2 36.2 53.8 15.5 15.5 33.6 27.7 53.8 36.2 20.9 8.8 43 13.3 65.8 13.3 22.8 0 45-4.5 65.8-13.3 20.1-8.5 38.2-20.7 53.8-36.2 15.5-15.5 27.7-33.6 36.2-53.8 8.8-20.9 13.3-43 13.3-65.8 0-40.3-14.3-79-40.3-109.6L436.7 95v75.4c0 7.5 6.1 13.6 13.6 13.6s13.6-6.1 13.6-13.6V61.6c.1-7.5-6-13.6-13.5-13.6zM359 294.9c0 37.9-14.8 73.5-41.6 100.3-26.8 26.8-62.4 41.6-100.3 41.6s-73.5-14.8-100.3-41.6C90 368.4 75.2 332.8 75.2 294.9s14.8-73.5 41.6-100.3c26.8-26.8 62.4-41.6 100.3-41.6s73.5 14.8 100.3 41.6C344.3 221.3 359 257 359 294.9z"></path>
                        )}
                      </svg>
                      {employee.gender}
                    </span>
                  </td>
                  <td className="text-center" style={{verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)"}}>
                    {renderLeaveCell(employee.sickLeave)}
                  </td>
                  <td className="text-center" style={{verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)"}}>
                    {renderLeaveCell(employee.maternityLeave)}
                  </td>
                  <td className="text-center" style={{verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)"}}>
                    {renderLeaveCell(employee.paternityLeave)}
                  </td>
                  <td className="text-center" style={{verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)"}}>
                    {renderLeaveCell(employee.casualLeave)}
                  </td>
                  <td className="text-center" style={{verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)"}}>
                    {renderLeaveCell(employee.paidLeave)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRegister;