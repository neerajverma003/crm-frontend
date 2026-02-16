import React, { useState } from "react";

const MyAttendance = () => {
  // Sample attendance data
  const [attendance, setAttendance] = useState([
    { date: "2025-08-01", status: "Present", checkIn: "09:30 AM", checkOut: "06:00 PM" },
    { date: "2025-08-02", status: "Absent", checkIn: "-", checkOut: "-" },
    { date: "2025-08-03", status: "Present", checkIn: "09:45 AM", checkOut: "06:15 PM" },
    { date: "2025-08-04", status: "Leave", checkIn: "-", checkOut: "-" },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">My Attendance</h2>

      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Check In</th>
              <th className="p-3">Check Out</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((day, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-100 transition-all"
              >
                <td className="p-3">{day.date}</td>
                <td
                  className={`p-3 font-semibold ${
                    day.status === "Present"
                      ? "text-green-600"
                      : day.status === "Absent"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {day.status}
                </td>
                <td className="p-3">{day.checkIn}</td>
                <td className="p-3">{day.checkOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAttendance;
