import React from 'react'

const attendanceRegister = () => {
  // Sample data for the attendance records
  const attendanceData = [
    {
      id: 1,
      name: "Admin Admin",
      avatar: "http://res.cloudinary.com/dv8c2pofx/image/upload/v1734088853/pln6cmnbiufewjfqlecz.gif",
      days: ["H", "P", "A", "A", "A", "W", "H", "H", "A", "H", "A", "W", "W", "A", "A", "H", "A", "A", "A", "W", "A", "A", "A", "A", "A", "W", "W", "A", "A", "--"],
      totals: {
        totalDays: 30,
        totalAbsent: 18,
        totalPresent: 7,
        totalHoliday: 0,
        totalHalfday: 5,
        totalPaidLeave: 0,
        totalUnpaidLeave: 0,
        ncns: 0,
        sandwhich: 0,
        totalPayableDays: 9.5
      }
    },
    {
      id: 2,
      name: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      days: ["P", "P", "P", "P", "P", "W", "W", "P", "P", "P", "P", "P", "P", "W", "P", "P", "P", "P", "P", "W", "P", "P", "P", "P", "P", "W", "P", "P", "P", "P"],
      totals: {
        totalDays: 30,
        totalAbsent: 0,
        totalPresent: 26,
        totalHoliday: 0,
        totalHalfday: 0,
        totalPaidLeave: 0,
        totalUnpaidLeave: 0,
        ncns: 0,
        sandwhich: 0,
        totalPayableDays: 26
      }
    },
    {
      id: 3,
      name: "Bob Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      days: ["A", "A", "A", "W", "W", "A", "A", "H", "A", "A", "A", "W", "H", "A", "A", "A", "A", "A", "A", "W", "A", "A", "A", "A", "A", "W", "W", "A", "A", "--"],
      totals: {
        totalDays: 30,
        totalAbsent: 22,
        totalPresent: 0,
        totalHoliday: 2,
        totalHalfday: 0,
        totalPaidLeave: 0,
        totalUnpaidLeave: 0,
        ncns: 0,
        sandwhich: 0,
        totalPayableDays: 2
      }
    },
    {
      id: 4,
      name: "Carol Lee",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      days: ["H", "P", "P", "P", "P", "W", "H", "P", "P", "H", "P", "W", "W", "P", "P", "H", "P", "P", "P", "W", "P", "P", "P", "P", "P", "W", "W", "P", "P", "P"],
      totals: {
        totalDays: 30,
        totalAbsent: 0,
        totalPresent: 22,
        totalHoliday: 4,
        totalHalfday: 0,
        totalPaidLeave: 0,
        totalUnpaidLeave: 0,
        ncns: 0,
        sandwhich: 0,
        totalPayableDays: 26
      }
    },
    {
      id: 5,
      name: "David Kim",
      avatar: "https://randomuser.me/api/portraits/men/27.jpg",
      days: ["H", "P", "A", "P", "A", "W", "H", "P", "A", "H", "A", "W", "W", "P", "P", "H", "A", "P", "A", "W", "P", "A", "P", "P", "A", "W", "W", "P", "A", "P"],
      totals: {
        totalDays: 30,
        totalAbsent: 10,
        totalPresent: 14,
        totalHoliday: 4,
        totalHalfday: 0,
        totalPaidLeave: 0,
        totalUnpaidLeave: 2,
        ncns: 0,
        sandwhich: 0,
        totalPayableDays: 18
      }
    },
    {
      id: 6,
      name: "Eva White",
      avatar: "https://randomuser.me/api/portraits/women/52.jpg",
      days: ["H", "H", "H", "H", "H", "W", "H", "H", "H", "H", "H", "W", "W", "H", "H", "H", "H", "H", "H", "W", "H", "H", "H", "H", "H", "W", "W", "H", "H", "H"],
      totals: {
        totalDays: 30,
        totalAbsent: 0,
        totalPresent: 0,
        totalHoliday: 26,
        totalHalfday: 0,
        totalPaidLeave: 0,
        totalUnpaidLeave: 0,
        ncns: 0,
        sandwhich: 0,
        totalPayableDays: 0
      }
    },
    {
      id: 7,
      name: "Frank Moore",
      avatar: "https://randomuser.me/api/portraits/men/60.jpg",
      days: ["P", "H", "A", "P", "P", "W", "P", "P", "H", "P", "H", "W", "W", "A", "A", "H", "P", "P", "P", "W", "P", "P", "A", "P", "P", "W", "W", "A", "P", "P"],
      totals: {
        totalDays: 30,
        totalAbsent: 5,
        totalPresent: 18,
        totalHoliday: 5,
        totalHalfday: 0,
        totalPaidLeave: 0,
        totalUnpaidLeave: 2,
        ncns: 0,
        sandwhich: 0,
        totalPayableDays: 21
      }
    },
    {
      id: 8,
      name: "Grace Chen",
      avatar: "https://randomuser.me/api/portraits/women/81.jpg",
      days: ["P", "P", "P", "P", "H", "W", "P", "P", "P", "P", "P", "W", "W", "P", "P", "P", "P", "P", "P", "W", "P", "P", "P", "P", "P", "W", "W", "P", "P", "P"],
      totals: {
        totalDays: 30,
        totalAbsent: 0,
        totalPresent: 26,
        totalHoliday: 1,
        totalHalfday: 0,
        totalPaidLeave: 0,
        totalUnpaidLeave: 0,
        ncns: 0,
        sandwhich: 0,
        totalPayableDays: 27
      }
    },
    {
      id: 9,
      name: "Henry Black",
      avatar: "https://randomuser.me/api/portraits/men/73.jpg",
      days: ["A", "P", "P", "P", "H", "W", "P", "A", "A", "P", "A", "W", "W", "P", "A", "P", "A", "P", "P", "W", "P", "A", "P", "A", "P", "W", "W", "A", "P", "A"],
      totals: {
        totalDays: 30,
        totalAbsent: 9,
        totalPresent: 16,
        totalHoliday: 1,
        totalHalfday: 0,
        totalPaidLeave: 0,
        totalUnpaidLeave: 4,
        ncns: 0,
        sandwhich: 0,
        totalPayableDays: 17
      }
    },
    {
      id: 10,
      name: "Isabella Fox",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      days: ["H", "P", "P", "A", "P", "W", "H", "P", "P", "H", "A", "W", "W", "P", "A", "H", "P", "P", "P", "W", "P", "P", "P", "P", "P", "W", "W", "P", "P", "P"],
      totals: {
        totalDays: 30,
        totalAbsent: 4,
        totalPresent: 20,
        totalHoliday: 4,
        totalHalfday: 0,
        totalPaidLeave: 1,
        totalUnpaidLeave: 1,
        ncns: 0,
        sandwhich: 0,
        totalPayableDays: 22
      }
    }
  ];
  
 
  // Abbreviations data
  const abbreviations = [
    { name: "Absent", code: "A", color: "rgba(231, 18, 18, 0.93)" },
    { name: "Present", code: "P", color: "rgb(26, 188, 156)" },
    { name: "Late", code: "L", color: "rgb(93, 173, 226)" },
    { name: "Halfday", code: "H", color: "rgb(243, 156, 18)" },
    { name: "Week Off", code: "W", color: "rgb(155, 89, 182)" },
    { name: "Paid Full", code: "VF", color: "rgb(3, 201, 136)" },
    { name: "Paid Half", code: "VH", color: "rgb(133, 169, 71)" },
    { name: "Unpaid Full", code: "UF", color: "rgb(175, 23, 64)" },
    { name: "Unpaid Half", code: "UH", color: "rgb(222, 124, 125)" },
    { name: "Holiday", code: "O", color: "rgb(63, 157, 233)" },
    { name: "Sandwhich", code: "S", color: "rgb(244, 208, 63)" },
    { name: "NCNS", code: "N", color: "rgba(255, 0, 0, 0.99)" }
  ];
 
  // Generate day headers (1-30)
  const dayHeaders = Array.from({ length: 30 }, (_, i) => i + 1);
 
  return (
    <div className="container-fluid pb-5" style={{ height: "93vh", overflow: "auto", position: "relative" }}>
      {/* Header section */}
      <div className="d-flex justify-content-between py-3">
        <div className="d-flex gap-2" style={{ color: "black" }}>
          <div className="my-auto mt-2">
            <div className="d-flex align-items-center gap-2">
              <h5 className="m-0 p-0 text-capitalize" style={{ fontWeight: 500, color: "var(--PrimaryColorDark)" }}>Attendance Summary</h5>
            </div>
            <p className="m-0" style={{ color: "var(--Subtittles)" }}>You can view all employee attendance here.</p>
          </div>
        </div>
        <div className="d-flex gap-3">
          <div className="d-none d-md-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <label className="my-auto">Year</label>
              <select className="form-select ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder">
                <option value="">--Select Year--</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <div className="d-flex align-items-center gap-2">
              <label className="my-auto">Month</label>
              <select className="form-select ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder">
                <option value="">--Select Month--</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
              </select>
            </div>
            <div className="d-flex">
              <input type="text" className="form-control" placeholder="Search by name" value="" />
            </div>
          </div>
          <button className="btn btn-success my-auto d-flex align-items-center">Process Attendance</button>
        </div>
      </div>
 
      {/* Mobile filters */}
      <div className="d-flex d-md-none align-items-center gap-3 my-2">
        <div className="d-flex align-items-center gap-2">
          <label className="my-auto">Year</label>
          <select className="form-select ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder">
            <option value="">--Select Year--</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div className="d-flex align-items-center gap-2">
          <label className="my-auto">Month</label>
          <select className="form-select ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder">
            <option value="">--Select Month--</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
          </select>
        </div>
        <div className="d-flex">
          <input type="text" className="form-control" placeholder="Search by name" value="" />
        </div>
      </div>
 
      {/* Attendance table */}
      <div>
        <div className="mb-2 rounded-2 Scroller_scroller__4F4jf" style={{ height: "fit-content", maxHeight: "75vh", overflow: "auto", position: "relative", border: "var(--borderLight)" }}>
          <table className="table table-striped table-hover" style={{ fontSize: "0.9rem", fontWeight: "normal" }}>
            <thead>
              <tr style={{ position: "sticky", top: "0px", zIndex: 5 }}>
                <th style={{ verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2 }}>S.No</th>
                <th style={{ verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 21, left: "0px" }}>User Profile</th>
                {dayHeaders.map(day => (
                  <th key={day} className="text-center" style={{ verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2 }}>
                    {day.toString().padStart(2, '0')}
                  </th>
                ))}
                <th style={{ verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2 }}>Total Days</th>
                <th style={{ verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2 }}>Total Absent</th>
                <th style={{ verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2 }}>Total Present</th>
                <th style={{ verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2 }}>Total Holiday</th>
                <th style={{ verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2 }}>Total Halfday</th>
                <th style={{ verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2 }}>Total Paid Leave</th>
                <th style={{ verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2 }}>Total Unpaid Leave</th>
                <th style={{ verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2 }}>NCNS</th>
                <th style={{ verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2 }}>Sandwhich</th>
                <th style={{ verticalAlign: "middle", whiteSpace: "pre", background: "rgb(238, 238, 238)", color: "rgb(83, 88, 98)", border: "none", position: "sticky", top: "0rem", zIndex: 2 }}>Total Payable Days</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((employee, index) => (
                <tr key={employee.id}>
                  <td className="text-center border-0" style={{ verticalAlign: "middle", whiteSpace: "pre", background: "white", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
                    {(index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="border-0" style={{ verticalAlign: "middle", whiteSpace: "pre", background: "white", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", position: "sticky", left: "0px", zIndex: 20, top: "2.5rem" }}>
                    <div className="d-flex align-items-center gap-3 mx-2">
                      <div style={{ height: "30px", width: "30px", backgroundColor: "rgb(204, 204, 204)", borderRadius: "50%", fontSize: "1rem", fontWeight: "bold", color: "rgb(255, 255, 255)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={employee.avatar} alt={employee.name} style={{ height: "100%", width: "100%", borderRadius: "50%", objectFit: "cover" }} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className="text-capitalize" style={{ fontSize: "1rem", margin: "0px", color: "black" }}>{employee.name}</span>
                      </div>
                    </div>
                  </td>
                  {employee.days.map((day, dayIndex) => {
                    const abbreviation = abbreviations.find(abbr => abbr.code === day);
                    const bgColor = abbreviation ? abbreviation.color : "rgb(193, 189, 189)";
                    return (
                      <td
                        key={dayIndex}
                        className="px-3"
                        style={{
                          whiteSpace: "pre",
                          backgroundColor: bgColor,
                          textAlign: "center",
                          fontWeight: 600,
                          color: "white",
                          verticalAlign: "middle",
                          border: "1px solid rgba(0, 0, 0, 0.2)",
                          position: "relative"
                        }}
                      >
                        {day}
                      </td>
                    );
                  })}
                  <td className="text-center" style={{ verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
                    {employee.totals.totalDays}
                  </td>
                  <td className="text-center" style={{ verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
                    {employee.totals.totalAbsent}
                  </td>
                  <td className="text-center" style={{ verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
                    {employee.totals.totalPresent}
                  </td>
                  <td className="text-center" style={{ verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
                    {employee.totals.totalHoliday}
                  </td>
                  <td className="text-center" style={{ verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
                    {employee.totals.totalHalfday}
                  </td>
                  <td className="text-center" style={{ verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
                    {employee.totals.totalPaidLeave}
                  </td>
                  <td className="text-center" style={{ verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
                    {employee.totals.totalUnpaidLeave}
                  </td>
                  <td className="text-center" style={{ verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
                    {employee.totals.ncns}
                  </td>
                  <td className="text-center" style={{ verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
                    {employee.totals.sandwhich}
                  </td>
                  <td className="text-center" style={{ verticalAlign: "middle", whiteSpace: "pre", background: "transparent", color: "var(--secondaryDashColorDark)", borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
                    {employee.totals.totalPayableDays}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* Abbreviations section */}
      <div className="pt-3 d-flex flex-column gap-2">
        <h6 className="my-auto" style={{ textAlign: "start", color: "var(--secondaryDashColorDark)", fontWeight: "normal", fontSize: "0.9rem" }}>Abbreviation</h6>
        <div style={{ height: "fit-content", width: "100%", overflow: "auto", padding: "0px", margin: "0px", borderRadius: "0.5rem" }}>
          <table className="table p-0 m-0 table-bordered table-striped" style={{ textAlign: "start", color: "var(--secondaryDashColorDark)", fontWeight: "normal", fontSize: "0.9rem" }}>
            <tr>
              {abbreviations.map(abbr => (
                <td key={abbr.name} className="border" style={{ textAlign: "center", whiteSpace: "pre", backgroundColor: abbr.color, color: "white" }}>
                  {abbr.name}
                </td>
              ))}
            </tr>
            <tr>
              {abbreviations.map(abbr => (
                <td key={abbr.code} className="px-3 border" style={{ backgroundColor: abbr.color, color: "white", textAlign: "center" }}>
                  {abbr.code}
                </td>
              ))}
            </tr>
          </table>
        </div>
      </div>
 
      {/* Notes section */}
      <div className="py-3" style={{ textAlign: "start", color: "var(--secondaryDashColorDark)", fontWeight: "normal", fontSize: "0.9rem" }}>
        <h6>Notes</h6>
        <p className="m-0 p-0" style={{ fontSize: "0.9rem" }}>Weekly off ( W ) is considered part of an employee's present status, meaning it is not deducted from their attendance.</p>
        <p className="m-0 p-0" style={{ fontSize: "0.9rem" }}>Being late mark ( L ) is used to identify whether employees are arriving on time, but it is still counted as part of their present status.</p>
      </div>
    </div>
  );
};

export default attendanceRegister