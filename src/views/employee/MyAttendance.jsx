import React from 'react';
import { FaClock, FaSignInAlt, FaSignOutAlt, FaHistory } from 'react-icons/fa';
import '../../index.css';

const MyAttendance = () => {
  // Sample data - replace with your actual data
  const attendanceData = [
    { id: 1, date: '2023-06-15', punchIn: '09:00 AM', punchOut: '06:00 PM', status: 'Present', totalHours: '9h 0m' },
    { id: 2, date: '2023-06-14', punchIn: '09:12 AM', punchOut: '05:45 PM', status: 'Present', totalHours: '8h 30m' },
    { id: 3, date: '2023-06-13', punchIn: '--', punchOut: '--', status: 'Absent', totalHours: '0h 0m' },
    { id: 4, date: '2023-06-12', punchIn: '09:05 AM', punchOut: '06:10 PM', status: 'Present', totalHours: '9h 5m' },
    { id: 5, date: '2023-06-11', punchIn: '10:30 AM', punchOut: '05:00 PM', status: 'Late', totalHours: '6h 30m' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaHistory className="text-blue-500" />
          My Attendance Records
        </h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
          Current Month: June 2023
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700 text-sm uppercase tracking-wider">
          <div className="col-span-2">Date</div>
          <div className="col-span-2 flex items-center gap-1">
            <FaSignInAlt /> Punch In
          </div>
          <div className="col-span-2 flex items-center gap-1">
            <FaSignOutAlt /> Punch Out
          </div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 flex items-center gap-1">
            <FaClock /> Total Hours
          </div>
          <div className="col-span-2">Actions</div>
        </div>

        {attendanceData.map((record) => (
          <div key={record.id} className="grid grid-cols-12 p-4 border-b border-gray-200 hover:bg-gray-50">
            <div className="col-span-2 font-medium text-gray-900">{record.date}</div>
            <div className="col-span-2">{record.punchIn}</div>
            <div className="col-span-2">{record.punchOut}</div>
            <div className="col-span-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                record.status === 'Present' ? 'bg-green-100 text-green-800' :
                record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {record.status}
              </span>
            </div>
            <div className="col-span-2">{record.totalHours}</div>
            <div className="col-span-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing 1 to {attendanceData.length} of {attendanceData.length} entries
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;