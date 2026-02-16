import React, { useState, useEffect } from "react";

const TodayAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Fetch data from API
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch("http://localhost:4000/attendance/getAllAttendance");
        const data = await res.json();
        console.log("Fetched attendance data:", data);

        // ✅ Check if response is an array or inside a property (common in Express)
        const attendanceData = Array.isArray(data)
          ? data
          : data.attendance || data.data || [];

        setEmployees(attendanceData);
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Get initials from name
  const getInitials = (name) => {
    return name ? name.split(" ").map((part) => part.charAt(0)).join("") : "";
  };

  // Generate a random color based on string
  const getAvatarColor = (str) => {
    const colors = [
      "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e",
      "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
      "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6",
      "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Search filter
  const filteredEmployees = employees.filter((employee) =>
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
        Loading attendance data...
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9f9f9",
        margin: 0,
        padding: "20px",
        color: "#333",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <div>
          <div style={{ fontSize: "26px", fontWeight: "bold", color: "#2c3e50" }}>
            Today's Attendance
          </div>
          <div style={{ fontSize: "14px", color: "#7f8c8d" }}>
            {new Date().toDateString()}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            style={{
              padding: "8px 15px",
              border: "1px solid #ccc",
              borderRadius: "25px",
              marginRight: "10px",
              width: "250px",
              fontSize: "14px",
            }}
            placeholder="Search by employee name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button
            style={{
              backgroundColor: "#27ae60",
              color: "#fff",
              border: "none",
              padding: "8px 15px",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#2ecc71")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#27ae60")
            }
          >
            <span style={{ marginRight: "5px", fontSize: "18px" }}>⊞</span>{" "}
            Export XLSX
          </button>
        </div>
      </div>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr>
            {[
              "Employee",
              "Shift",
              "✓ Mark",
              "↙ Login Time",
              "Logout Time ↗",
              "⟳ Log Count",
              "Gross Login ↗",
              "Total Break",
              "⇕ Net Login",
              "Status ⟳",
              "Break Count",
            ].map((header, i) => (
              <th
                key={i}
                style={{
                  backgroundColor: "#ecf0f1",
                  padding: "12px",
                  textAlign: "left",
                  color: "#2c3e50",
                  fontWeight: "600",
                  borderBottom: "2px solid #ddd",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="11" style={{ textAlign: "center", padding: "20px" }}>
                No attendance records found.
              </td>
            </tr>
          ) : (
            currentItems.map((employee, index) => (
              <tr
                key={employee._id || index}
                style={{
                  borderBottom: "1px solid #eee",
                  ...(index % 2 === 0 ? { backgroundColor: "#f9f9f9" } : {}),
                }}
              >
                <td style={{ padding: "12px", color: "#333", fontSize: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        backgroundColor: getAvatarColor(employee.name || ""),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "10px",
                        color: "white",
                        fontSize: "14px",
                      }}
                    >
                      {getInitials(employee.name || "")}
                    </div>
                    <div>
                      <div style={{ fontWeight: "500", color: "#34495e" }}>
                        {employee.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#7f8c8d" }}>
                        ID: {employee.employeeId || employee.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px", fontSize: "14px" }}>
                  <span
                    style={{
                      backgroundColor:
                        employee.shift === "Afternoon Shift"
                          ? "#e8f4f8"
                          : "#fff9e6",
                      color:
                        employee.shift === "Afternoon Shift"
                          ? "#31708f"
                          : "#8a6d3b",
                      padding: "4px 8px",
                      borderRadius: "15px",
                      fontSize: "12px",
                      display: "inline-block",
                    }}
                  >
                    {employee.shift || "N/A"}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>✓</td>
                <td style={{ padding: "12px" }}>{employee.loginTime || "-"}</td>
                <td style={{ padding: "12px" }}>{employee.logoutTime || "-"}</td>
                <td style={{ padding: "12px" }}>{employee.logCount || "0"}</td>
                <td style={{ padding: "12px" }}>{employee.grossLogin || "0"}</td>
                <td style={{ padding: "12px" }}>{employee.totalBreak || "0"}</td>
                <td style={{ padding: "12px" }}>{employee.netLogin || "0"}</td>
                <td
                  style={{
                    padding: "12px",
                    color:
                      employee.status === "Absent" ? "#e74c3c" : "#f39c12",
                    fontWeight:
                      employee.status === "Absent" ? "600" : "500",
                  }}
                >
                  {employee.status || "Absent"}
                </td>
                <td style={{ padding: "12px", color: "#bdc3c7" }}>
                  {employee.breakCount || "—"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        <div style={{ color: "#7f8c8d", fontSize: "14px" }}>
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, filteredEmployees.length)} of{" "}
          {filteredEmployees.length} results
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            style={{
              border: "1px solid #ddd",
              backgroundColor: "#fff",
              padding: "6px 12px",
              margin: "0 2px",
              cursor: "pointer",
              borderRadius: "25px",
            }}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ❮ Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              style={{
                border: "1px solid #ddd",
                backgroundColor:
                  number === currentPage ? "#3498db" : "#fff",
                color: number === currentPage ? "white" : "inherit",
                padding: "6px 12px",
                margin: "0 2px",
                cursor: "pointer",
                borderRadius: "25px",
              }}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          ))}
          <button
            style={{
              border: "1px solid #ddd",
              backgroundColor: "#fff",
              padding: "6px 12px",
              margin: "0 2px",
              cursor: "pointer",
              borderRadius: "25px",
            }}
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ❯
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodayAttendance;
