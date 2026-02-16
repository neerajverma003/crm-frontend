import React from 'react';
import { Link } from 'react-router-dom';

const LeaveBoard = () => {
  return (
    <div className="p-2 px-3 shadow-sm rounded-2 d-flex flex-column gap-2" 
         style={{ 
           marginTop: '0px',
           height: '320px', // Reduced container height
           width: '450px',  // Slightly increased width
           overflow: 'hidden', 
           color: 'black', 
           background: 'rgb(245, 245, 246)', 
           border: '1px solid rgba(223, 220, 220, 0.95)' 
         }}>
      <span className="d-flex align-items-center gap-2" 
            style={{ 
              color: 'rgb(60, 60, 60)', 
              fontWeight: '600', 
              fontSize: '1rem' 
            }}>
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="fs-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M7.32 10.56L8.38 9.5 7.32 8.44l1.06-1.06L10.5 9.5l-2.12 2.12-1.06-1.06zM4.5 9c.03 0 .05.01.08.01A8.002 8.002 0 0112 4c2.19 0 4.16.88 5.61 2.3.15-.6.45-1.29.81-1.96A9.965 9.965 0 0011.99 2c-4.88 0-8.94 3.51-9.81 8.14C2.74 9.44 3.59 9 4.5 9zM21 10.5c-.42 0-.82-.09-1.19-.22.12.55.19 1.13.19 1.72 0 4.42-3.58 8-8 8-3.36 0-6.23-2.07-7.42-5.01-.03 0-.05.01-.08.01-.52 0-1.04-.14-1.5-.4-.32-.18-.59-.42-.82-.7.89 4.61 4.93 8.1 9.8 8.1C17.52 22 22 17.52 22 12c0-.55-.06-1.09-.14-1.62a3.5 3.5 0 01-.86.12zM21 3s-2 2.9-2 4 .9 2 2 2 2-.9 2-2-2-4-2-4zm-5.38 4.38L13.5 9.5l2.12 2.12 1.06-1.06-1.06-1.06 1.06-1.06-1.06-1.06zM8.56 17c.69-1.19 1.97-2 3.44-2s2.75.81 3.44 2h1.68c-.8-2.05-2.79-3.5-5.12-3.5-.87 0-1.7.2-2.43.57L5.99 12c0-.52-.26-1.02-.74-1.29-.72-.41-1.63-.17-2.05.55-.41.72-.17 1.63.55 2.05.48.28 1.05.25 1.49 0l2.97 1.72c-.57.53-1.03 1.21-1.33 1.97h1.68z"></path>
        </svg> 
        Leave Board
      </span>
      
      <div className="row m-0 g-2 py-1"> {/* Reduced padding */}
        {/* Sick Leave Card */}
        <div className="col-12 col-md-6">
          <div className="py-1 px-2 shadow-sm rounded-2 h-100" style={{ 
            background: 'white', 
            color: 'black', 
            minHeight: '4.5rem', // Reduced height
            width: '100%' // Ensure full width
          }}>
            <h6 className="d-flex align-items-center text-capitalize gap-2 mb-1"> {/* Reduced margin */}
              sick 
              <span>
                <span className="d-flex align-items-center justify-content-center" style={{ height: '1.0rem', width: '1.3rem', borderRadius: '50%', background: 'rgba(243, 191, 93, 0.2)', color: 'rgb(179, 124, 22)' }}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 32 32" height="em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 8.5 5 C 5.467 5 3 7.468 3 10.5 L 3 21.5 C 3 24.532 5.467 27 8.5 27 C 11.533 27 14 24.532 14 21.5 L 14 16.404297 L 20.054688 24.736328 C 21.129687 26.216328 22.808719 27.003906 24.511719 27.003906 C 25.632719 27.003906 26.763281 26.662078 27.738281 25.955078 L 27.738281 25.953125 C 30.191281 24.170125 30.735125 20.724484 28.953125 18.271484 L 22.488281 9.3710938 C 20.703281 6.9170937 17.260641 6.37225 14.806641 8.15625 C 14.426847 8.4323091 14.099303 8.751721 13.8125 9.0976562 C 13.190056 6.7436087 11.047517 5 8.5 5 z M 8.5 7 C 10.43 7 12 8.57 12 10.5 L 12 15 L 5 15 L 5 10.5 C 5 8.57 6.57 7 8.5 7 z M 18.035156 9.1054688 C 19.118156 9.1054688 20.186094 9.605875 20.871094 10.546875 L 23.515625 14.185547 L 17.853516 18.302734 L 15.207031 14.662109 C 14.072031 13.100109 14.421422 10.908437 15.982422 9.7734375 C 16.602422 9.3234375 17.322156 9.1054688 18.035156 9.1054688 z M 24.691406 15.802734 L 27.337891 19.445312 C 28.471891 21.007313 28.1235 23.200937 26.5625 24.335938 C 25.0015 25.470937 22.807828 25.122547 21.673828 23.560547 L 19.029297 19.919922 L 24.691406 15.802734 z M 5 17 L 12 17 L 12 21.5 C 12 23.43 10.43 25 8.5 25 C 6.57 25 5 23.43 5 21.5 L 5 17 z"></path>
                  </svg>
                </span>
              </span>
            </h6>
            <div className="d-flex align-items-center justify-content-between gap-2">
              <div>Balance: <span className="text-primary mx-2 text-success fw-bold">5</span></div>
              <span style={{ color: 'rgb(218, 218, 218)' }}>|</span>
              <div>Taken: <span className="text-primary mx-2 text-danger fw-bold">3</span></div>
            </div>
          </div>
        </div>
        
        {/* Paid Leave Card */}
        <div className="col-12 col-md-6">
          <div className="py-1 px-2 shadow-sm rounded-2 h-100" style={{ 
            background: 'white', 
            color: 'black', 
            minHeight: '4.5rem', // Reduced height
            width: '100%' // Ensure full width
          }}>
            <h6 className="d-flex align-items-center text-capitalize gap-2 mb-1"> {/* Reduced margin */}
              paid 
              <span>
                <span className="d-flex align-items-center justify-content-center" style={{ height: '1.0rem', width: '1.3rem', borderRadius: '50%', background: 'rgba(143, 241, 128, 0.192)', color: 'rgb(58, 185, 39)' }}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="fs-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"></path>
                  </svg>
                </span>
              </span>
            </h6>
            <div className="d-flex align-items-center justify-content-between gap-2">
              <div>Balance: <span className="text-primary mx-2 text-success fw-bold">25</span></div>
              <span style={{ color: 'rgb(218, 218, 218)' }}>|</span>
              <div>Taken: <span className="text-primary mx-2 text-danger fw-bold">2</span></div>
            </div>
          </div>
        </div>
        
        {/* Casual Leave Card */}
        <div className="col-12 col-md-6">
          <div className="py-1 px-2 shadow-sm rounded-2 h-100" style={{ 
            background: 'white', 
            color: 'black', 
            minHeight: '4.5rem', // Reduced height
            width: '100%' // Ensure full width
          }}>
            <h6 className="d-flex align-items-center text-capitalize gap-2 mb-1"> {/* Reduced margin */}
              casual 
              <span>
                <span className="d-flex align-items-center justify-content-center" style={{ height: '1.0rem', width: '1.3rem', borderRadius: '50%', background: 'rgba(255, 95, 63, 0.184)', color: 'rgb(255, 95, 63)' }}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="fs-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M112.91 128A191.85 191.85 0 0064 254c-1.18 106.35 85.65 193.8 192 194 106.2.2 192-85.83 192-192 0-104.54-83.55-189.61-187.5-192a4.36 4.36 0 00-4.5 4.37V152"></path>
                    <path d="M233.38 278.63l-79-113a8.13 8.13 0 0111.32-11.32l113 79a32.5 32.5 0 01-37.25 53.26 33.21 33.21 0 01-8.07-7.94z"></path>
                  </svg>
                </span>
              </span>
            </h6>
            <div className="d-flex align-items-center justify-content-between gap-2">
              <div>Balance: <span className="text-primary mx-2 text-success fw-bold">8</span></div>
              <span style={{ color: 'rgb(218, 218, 218)' }}>|</span>
              <div>Taken: <span className="text-primary mx-2 text-danger fw-bold">0</span></div>
            </div>
          </div>
        </div>
        
        {/* Apply Leave Button */}
        <div className="col-12 col-md-6">
          <Link 
            to="/leave" 
            className="btn d-flex align-items-center justify-content-center bg-primary rounded-2 h-100 text-white" 
            style={{ 
              minHeight: '4.5rem', // Reduced height
              width: '100%' // Ensure full width
            }}
          >
            Apply Leave
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaveBoard;