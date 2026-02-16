import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaBell, FaSync, FaInfoCircle } from "react-icons/fa";

const PendingLeave = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPendingCheck, setNextPendingCheck] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  // Simulate fetching pending leaves
  useEffect(() => {
    const fetchPendingLeaves = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data - replace with actual API
        const mockData = []; // Empty for demo

        setPendingLeaves(mockData);
        setLastChecked(new Date());

        const nextCheckDate = new Date();
        nextCheckDate.setHours(nextCheckDate.getHours() + 2);
        setNextPendingCheck(nextCheckDate);
      } catch (error) {
        console.error("Error fetching pending leaves:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingLeaves();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const formatTime = (date) => {
    if (!date) return "N/A";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h4 className="text-2xl font-semibold text-gray-800">
            Pending Leave Applications
          </h4>
          <p className="text-gray-500 text-sm">
            {isLoading
              ? "Checking for pending leaves..."
              : pendingLeaves.length > 0
              ? "Review and approve/reject leave requests"
              : "No pending leave applications currently"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-gray-500 text-sm">
            <FaInfoCircle className="mr-2" />
            <span>
              Last checked: {formatTime(lastChecked)} on{" "}
              {formatDate(lastChecked)}
            </span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className={`flex items-center px-4 py-2 rounded-md border ${
              isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-blue-50 text-blue-600 border-blue-500"
            } transition`}
          >
            <FaSync
              className={`mr-2 ${isLoading ? "animate-spin text-gray-400" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Loader */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600">Checking for pending leaves...</p>
        </div>
      ) : pendingLeaves.length > 0 ? (
        /* Table */
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Leave Type</th>
                  <th className="p-3">From</th>
                  <th className="p-3">To</th>
                  <th className="p-3">Days</th>
                  <th className="p-3">Applied On</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{leave.employee}</td>
                    <td className="p-3">{leave.leaveType}</td>
                    <td className="p-3">{leave.from}</td>
                    <td className="p-3">{leave.to}</td>
                    <td className="p-3">{leave.days}</td>
                    <td className="p-3">{leave.appliedOn}</td>
                    <td className="p-3 max-w-xs truncate">{leave.reason}</td>
                    <td className="p-3 flex gap-2">
                      <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600">
                        Approve
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">
                        Reject
                      </button>
                      <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="flex justify-between items-center px-4 py-3 text-sm text-gray-500 border-t">
            <span>
              Showing 1 to {pendingLeaves.length} of {pendingLeaves.length}{" "}
              entries
            </span>
            <div className="flex gap-1">
              <button className="px-3 py-1 rounded-md border bg-gray-100 cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 rounded-md bg-blue-600 text-white">
                1
              </button>
              <button className="px-3 py-1 rounded-md border bg-gray-100 cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <FaBell className="mx-auto text-gray-400 mb-3" size={48} />
          <h5 className="text-lg text-gray-500 mb-2">
            No Pending Leaves Currently
          </h5>

          {nextPendingCheck && (
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md inline-block mt-3">
              Next expected pending leaves around {formatTime(nextPendingCheck)}
            </div>
          )}

          <div className="mt-6 text-gray-600">
            <p className="mb-2">New leave applications may appear when:</p>
            <ul className="text-left mx-auto max-w-sm list-disc list-inside">
              <li>Employees submit new leave requests</li>
              <li>System processes batch submissions</li>
              <li>Managers delegate approvals to you</li>
              <li>Scheduled leave periods begin</li>
            </ul>
          </div>

          <button
            onClick={handleRefresh}
            className="mt-6 flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaSync className="mr-2" /> Check Again Now
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingLeave;
