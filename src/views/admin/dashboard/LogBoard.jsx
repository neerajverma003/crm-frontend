import React from "react";
import styles from "./LogBoard.module.css";

const LogBoard = () => {
    return (
        <div className={styles.container}>
            <div className="d-flex align-items-center justify-content-between">
                <span
                    className="d-flex align-items-center gap-2"
                    style={{ color: "rgb(60, 60, 60)", fontWeight: "600", fontSize: "1rem" }}
                >
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 256 256"
                        className="fs-5"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M248,128a8,8,0,0,1-8,8H223.33A48.08,48.08,0,0,1,176,176H136v24h24a32,32,0,0,1,32,32,8,8,0,0,1-16,0,16,16,0,0,0-16-16H136v16a8,8,0,0,1-16,0V216H96a16,16,0,0,0-16,16,8,8,0,0,1-16,0,32,32,0,0,1,32-32h24V176H80a48.08,48.08,0,0,1-47.33-40H16a8,8,0,0,1,0-16H40a8,8,0,0,1,8,8,32,32,0,0,0,32,32h96a32,32,0,0,0,32-32,8,8,0,0,1,8-8h24A8,8,0,0,1,248,128ZM67.91,138.48a16,16,0,0,1-3.75-12.74l13.72-96A16.08,16.08,0,0,1,93.72,16h68.56a16.08,16.08,0,0,1,15.84,13.74l13.72,96A16,16,0,0,1,176,144H80A16,16,0,0,1,67.91,138.48ZM80,128h96L162.28,32H93.71Z"></path>
                    </svg>
                    Log Board
                </span>
                <a
                    href="../employee/attendance/Attendance"
                    style={{ cursor: "pointer" }}
                >
                    <span className="d-flex align-items-center badge-primary py-1">
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 320 512"
                            height="1em"
                            width="1em"
                            style={{ transform: "rotate(360deg)" }} // 👈 Rotate to right
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0
      l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 
      34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 
      24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
                            />
                        </svg>
                    </span>
                </a>
            </div>

            <div
                className="row p-2 px-3"
                style={{ height: "15rem" }}
            >
                <div className="col-6 p-1">
                    <div
                        className="rounded-3 w-100 my-0 p-0 shadow-sm"
                        style={{ background: "rgb(255, 255, 255)", width: "50%" }}
                    >
                        <h4 className="fw-normal my-1 py-1 text-center">--</h4>
                        <div
                            className="rounded-3 my-auto"
                            style={{ border: "1px solid rgba(31, 30, 30, 0.09)" }}
                        >
                            <span className="d-flex align-items-center justify-content-between p-2 py-1">
                                Today's login time
                                <span
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        height: "35px",
                                        width: "35px",
                                        borderRadius: "50%",
                                        background: "rgba(171, 249, 167, 0.157)",
                                    }}
                                >
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth="0"
                                        viewBox="0 0 512 512"
                                        className="text-success fs-5"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="32"
                                            d="M192 176v-40a40 40 0 0140-40h160a40 40 0 0140 40v240a40 40 0 01-40 40H240c-22.09 0-48-17.91-48-40v-40"
                                        ></path>
                                        <path
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="32"
                                            d="M288 336l80-80-80-80M80 256h272"
                                        ></path>
                                    </svg>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-6 p-1">
                    <div
                        className="rounded-3 w-100 my-0 p-0 shadow-sm"
                        style={{ background: "rgb(255, 255, 255)", width: "50%" }}
                    >
                        <h4 className="fw-normal my-1 py-1 text-center">--</h4>
                        <div
                            className="rounded-3 my-auto"
                            style={{ border: "1px solid rgba(31, 30, 30, 0.09)" }}
                        >
                            <span className="d-flex align-items-center justify-content-between p-2 py-1">
                                Today's logout time
                                <span
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        height: "35px",
                                        width: "35px",
                                        borderRadius: "50%",
                                        background: "rgba(255, 142, 134, 0.13)",
                                    }}
                                >
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth="0"
                                        viewBox="0 0 512 512"
                                        className="text-danger fs-5"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="32"
                                            d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40m64 160l80-80-80-80m-192 80h256"
                                        ></path>
                                    </svg>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-6 p-2">
                    <div
                        className="rounded-3 w-100 my-0 p-0 shadow-sm"
                        style={{ background: "rgb(255, 255, 255)", width: "50%" }}
                    >
                        <h4 className="fw-normal my-1 py-1 text-center">0 h 0 min</h4>
                        <div
                            className="rounded-3 my-auto"
                            style={{ border: "1px solid rgba(31, 30, 30, 0.09)" }}
                        >
                            <span className="d-flex align-items-center justify-content-between p-2 py-1">
                                Total break taken
                                <span
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        height: "35px",
                                        width: "35px",
                                        borderRadius: "50%",
                                        background: "rgba(251, 255, 128, 0.13)",
                                    }}
                                >
                                    <svg
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-warning fs-5"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                                        <line
                                            x1="6"
                                            y1="1"
                                            x2="6"
                                            y2="4"
                                        ></line>
                                        <line
                                            x1="10"
                                            y1="1"
                                            x2="10"
                                            y2="4"
                                        ></line>
                                        <line
                                            x1="14"
                                            y1="1"
                                            x2="14"
                                            y2="4"
                                        ></line>
                                    </svg>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-6 p-2">
                    <div
                        className="rounded-3 w-100 my-0 p-0 shadow-sm"
                        style={{ background: "rgb(255, 255, 255)", width: "50%" }}
                    >
                        <h4 className="fw-normal my-1 py-1 text-center">0 h 0 min</h4>
                        <div
                            className="rounded-3 my-auto"
                            style={{ border: "1px solid rgba(31, 30, 30, 0.09)" }}
                        >
                            <span className="d-flex align-items-center justify-content-between p-2 py-1">
                                Total login time
                                <span
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        height: "35px",
                                        width: "35px",
                                        borderRadius: "50%",
                                        background: "rgba(222, 204, 250, 0.17)",
                                    }}
                                >
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth="0"
                                        viewBox="0 0 24 24"
                                        className="text-primary fs-5"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill="none"
                                            d="M0 0h24v24H0z"
                                        ></path>
                                        <path d="M4 19V8h16v3.29c.72.22 1.4.54 2 .97V8c0-1.11-.89-2-2-2h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h7.68c-.3-.62-.5-1.29-.6-2H4zm6-15h4v2h-4V4z"></path>
                                        <path d="M18 13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm1.65 7.35L17.5 18.2V15h1v2.79l1.85 1.85-.7.71z"></path>
                                    </svg>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogBoard;
