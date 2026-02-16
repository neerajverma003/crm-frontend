import React, { useState } from "react";

const AttendanceRegister = () => {
  // Dummy data (you can replace this with API later)
  const [attendance, setAttendance] = useState([
    { id: 1, name: "Harshit Tyagi", date: "2025-08-18", status: "Present", checkIn: "09:30 AM", checkOut: "06:00 PM" },
    { id: 2, name: "Anjali Sharma", date: "2025-08-18", status: "Absent", checkIn: "-", checkOut: "-" },
    { id: 3, name: "Rohit Singh", date: "2025-08-18", status: "Leave", checkIn: "-", checkOut: "-" },
    { id: 4, name: "Priya Mehta", date: "2025-08-18", status: "Present", checkIn: "09:45 AM", checkOut: "06:10 PM" },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Attendance Register
      </h1>

      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Check In</th>
              <th className="p-3">Check Out</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr
                key={record.id}
                className="border-b hover:bg-gray-100 transition-all"
              >
                <td className="p-3">{record.id}</td>
                <td className="p-3 font-medium">{record.name}</td>
                <td className="p-3">{record.date}</td>
                <td
                  className={`p-3 font-semibold ${
                    record.status === "Present"
                      ? "text-green-600"
                      : record.status === "Absent"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {record.status}
                </td>
                <td className="p-3">{record.checkIn}</td>
                <td className="p-3">{record.checkOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceRegister;
