import React from 'react'
import styles from './NoticeBoard.module.css' // Assuming you have a CSS module for styles

const NoticeBoard = () => {
  return (
    <section
      className={`${styles.noticeBoard} p-2 px-3 shadow-sm rounded-2 d-flex flex-column gap-2`}
    >
      <div className="d-flex align-items-center justify-content-between">
        <span
          className="d-flex align-items-center gap-2"
          style={{ color: 'rgb(60, 60, 60)', fontWeight: 600, fontSize: '1rem' }}
        >
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="fs-5"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
            ></path>
          </svg>
          Notice Board
        </span>
        <span
          className="d-flex align-items-center justify-content-center"
          style={{
            minHeight: '1.6rem',
            minWidth: '1.6rem',
            borderRadius: '50%',
            background: 'var(--SemiLight)',
          }}
        >
          0
        </span>
      </div>

      <div
        className="d-flex flex-column justify-content-center align-items-center gap-3"
        style={{ height: '100%', width: '100%' }}
      >
        <img
          className="mx-auto"
          src="https://munc.in/static/media/NoticeImg.abe0df26.svg" // Updated image URL
          alt="No Data"
          style={{ height: '100px', width: '100px' }}
        />
        <p className="text-center w-75 mx-auto" style={{ opacity: 0.6, fontSize: '13px' }}>
          No notices available at the moment.
        </p>
      </div>
    </section>
  )
}

export default NoticeBoard
