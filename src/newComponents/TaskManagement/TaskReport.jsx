import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiBarChart2, FiTrendingUp, FiCheckCircle, FiClock, FiAlertCircle, FiFilter, FiRefreshCw } from "react-icons/fi";

const TaskReport = () => {
  const [reportData, setReportData] = useState(null);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPageOverdue, setCurrentPageOverdue] = useState(1);
  const [itemsPerPage] = useState(5);

  const API_BASE_URL = "http://localhost:4000";

  // Fetch report data
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/task-report`);
      setReportData(response.data.data);
    } catch (error) {
      console.error("Error fetching report:", error);
      alert("Error fetching report data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch overdue tasks
  const fetchOverdueTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/overdue-tasks`, {
        params: {
          page: currentPageOverdue,
          limit: itemsPerPage,
        },
      });
      setOverdueTasks(response.data.data);
    } catch (error) {
      console.error("Error fetching overdue tasks:", error);
    }
  };

  useEffect(() => {
    fetchReportData();
    fetchOverdueTasks();
  }, [currentPageOverdue]);

  const refreshData = () => {
    fetchReportData();
    fetchOverdueTasks();
  };

  // Get status count
  const getStatusCount = (status) => {
    if (!reportData?.statusReport) return 0;
    const item = reportData.statusReport.find((s) => s._id === status);
    return item?.count || 0;
  };

  // Get priority count
  const getPriorityCount = (priority) => {
    if (!reportData?.priorityReport) return 0;
    const item = reportData.priorityReport.find((p) => p._id === priority);
    return item?.count || 0;
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "text-blue-600 bg-blue-50",
      "In Progress": "text-purple-600 bg-purple-50",
      Completed: "text-green-600 bg-green-50",
      "On Hold": "text-gray-600 bg-gray-50",
      Cancelled: "text-red-600 bg-red-50",
    };
    return colors[status] || "text-gray-600 bg-gray-50";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "text-green-600 bg-green-50",
      Medium: "text-yellow-600 bg-yellow-50",
      High: "text-orange-600 bg-orange-50",
      Critical: "text-red-600 bg-red-50",
    };
    return colors[priority] || "text-gray-600 bg-gray-50";
  };

  const getAssigneeName = (assignee) => {
    if (typeof assignee === "object" && assignee?.fullName) {
      return assignee.fullName;
    }
    return "Unknown";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Reports</h1>
            <p className="text-gray-600 mt-1">Monitor task performance and analytics</p>
          </div>
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <FiRefreshCw size={20} />
            Refresh
          </button>
        </div>

        {/* Filter (no assignee type) */}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 mt-4">Loading reports...</p>
          </div>
        ) : reportData ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {/* Total Tasks */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Tasks</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {reportData.summary?.totalTasks || 0}
                    </h3>
                  </div>
                  <FiBarChart2 size={40} className="text-blue-500 opacity-20" />
                </div>
              </div>

              {/* Completed Tasks */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Completed</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {reportData.summary?.completedTasks || 0}
                    </h3>
                  </div>
                  <FiCheckCircle size={40} className="text-green-500 opacity-20" />
                </div>
              </div>

              {/* Pending Tasks */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Pending</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {reportData.summary?.pendingTasks || 0}
                    </h3>
                  </div>
                  <FiClock size={40} className="text-yellow-500 opacity-20" />
                </div>
              </div>

              {/* In Progress */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">In Progress</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {reportData.summary?.inProgressTasks || 0}
                    </h3>
                  </div>
                  <FiTrendingUp size={40} className="text-purple-500 opacity-20" />
                </div>
              </div>

              {/* Completion Rate */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Completion Rate</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {reportData.summary?.completionRate || "0%"}
                    </h3>
                  </div>
                  <FiBarChart2 size={40} className="text-indigo-500 opacity-20" />
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Status Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Task Status Distribution</h2>
                <div className="space-y-3">
                  {["Pending", "In Progress", "Completed", "On Hold", "Cancelled"].map((status) => {
                    const count = getStatusCount(status);
                    const total = reportData.summary?.totalTasks || 1;
                    const percentage = ((count / total) * 100).toFixed(1);

                    return (
                      <div key={status}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-semibold text-sm ${getStatusColor(status).replace("bg-", "text-")}`}>
                            {status}
                          </span>
                          <span className="text-gray-900 font-bold">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              {
                                Pending: "bg-blue-500",
                                "In Progress": "bg-purple-500",
                                Completed: "bg-green-500",
                                "On Hold": "bg-gray-500",
                                Cancelled: "bg-red-500",
                              }[status]
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{percentage}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Priority Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Task Priority Distribution</h2>
                <div className="space-y-3">
                  {["Critical", "High", "Medium", "Low"].map((priority) => {
                    const count = getPriorityCount(priority);
                    const total = reportData.summary?.totalTasks || 1;
                    const percentage = ((count / total) * 100).toFixed(1);

                    return (
                      <div key={priority}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-sm">{priority}</span>
                          <span className="text-gray-900 font-bold">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              {
                                Critical: "bg-red-500",
                                High: "bg-orange-500",
                                Medium: "bg-yellow-500",
                                Low: "bg-green-500",
                              }[priority]
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{percentage}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Overdue Tasks */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200 p-6 flex items-center gap-3">
                <FiAlertCircle size={24} className="text-red-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Overdue Tasks</h2>
                  <p className="text-gray-600 text-sm">Tasks that are past their due date and not completed</p>
                </div>
              </div>

              {overdueTasks.length === 0 ? (
                <div className="p-12 text-center">
                  <FiCheckCircle size={48} className="mx-auto text-green-500 mb-4 opacity-20" />
                  <p className="text-gray-600 text-lg">No overdue tasks! Great job!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Task Title</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Assigned To</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Due Date</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Days Overdue</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {overdueTasks.map((task) => {
                        const daysOverdue = Math.floor(
                          (new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24)
                        );

                        return (
                          <tr key={task._id} className="hover:bg-red-50 transition">
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-gray-900">{task.taskTitle}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{getAssigneeName(task.assignedTo)}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-red-600">
                                {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                                {daysOverdue} days
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                  {
                                    Low: "bg-green-100 text-green-800",
                                    Medium: "bg-yellow-100 text-yellow-800",
                                    High: "bg-orange-100 text-orange-800",
                                    Critical: "bg-red-100 text-red-800",
                                  }[task.priority] || "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {task.priority}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskReport;
