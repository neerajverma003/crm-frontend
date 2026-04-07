import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiFilter, FiChevronDown } from "react-icons/fi";

const TaskAssign = () => {
  const [tasks, setTasks] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyModalData, setHistoryModalData] = useState({ taskTitle: "", history: [] });

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    company: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: today,
    taskTitle: "",
    description: "",
  });

  const [contentType, setContentType] = useState("description");
  const [numberData, setNumberData] = useState([
    { row: 1, col1: "", col2: "", col3: "", col4: "" },
    { row: 2, col1: "", col2: "", col3: "", col4: "" },
    { row: 3, col1: "", col2: "", col3: "", col4: "" },
    { row: 4, col1: "", col2: "", col3: "", col4: "" },
    { row: 5, col1: "", col2: "", col3: "", col4: "" },
  ]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const API_BASE_URL = "http://localhost:4000";
  const superAdminId = localStorage.getItem("userId");

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchTerm) params.search = searchTerm;
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;

      const response = await axios.get(`${API_BASE_URL}/tasks/tasks`, { params });
      setTasks(response.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getallAdmin`);
      setAdmins(response.data.data || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employee/allEmployee`);
      let emps = response.data.employees || [];
      // Keep only active employees
      emps = emps.filter((emp) => emp?.accountActive === true || emp?.accountActive === "true");
      // If a company is selected, filter employees belonging to that company
      if (formData.company) {
        emps = emps.filter((emp) => {
          if (!emp.company) return false;
          const companyId = typeof emp.company === "object" ? emp.company._id || emp.company : emp.company;
          return String(companyId) === String(formData.company);
        });
      }
      setEmployees(emps);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company/all`);
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchAdmins();
    fetchEmployees();
    fetchCompanies();
  }, [currentPage, searchTerm, filterStatus, filterPriority]);

  // When selected company changes, refetch and filter employees
  useEffect(() => {
    fetchEmployees();
  }, [formData.company]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleExpandedTask = (taskId) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  // Handle number table cell change
  const handleNumberCellChange = (rowIndex, colName, value) => {
    setNumberData((prev) => {
      const newData = [...prev];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [colName]: value,
      };
      return newData;
    });
  };

  // Add new row to number table
  const addNumberRow = () => {
    setNumberData((prev) => [
      ...prev,
      { row: prev.length + 1, col1: "", col2: "", col3: "", col4: "" },
    ]);
  };

  // Remove row from number table
  const removeNumberRow = (rowIndex) => {
    setNumberData((prev) => prev.filter((_, index) => index !== rowIndex));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.taskTitle || !formData.assignedTo || !formData.dueDate) {
      alert("Please fill in required fields");
      return;
    }

    try {
      const payload = {
        ...formData,
        assignedBy: superAdminId,
        contentType: contentType,
        numberData: contentType === "numbers" ? numberData : [],
      };

      if (editingTask) {
        // Update task
        await axios.put(`${API_BASE_URL}/tasks/task/${editingTask._id}`, payload);
        alert("Task updated successfully");
        setEditingTask(null);
      } else {
        // Create new task
        await axios.post(`${API_BASE_URL}/tasks/task`, payload);
        alert("Task created successfully");
      }

      // Reset form
      setFormData({
        company: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: today,
        taskTitle: "",
        description: "",
      });
      setContentType("description");
      setNumberData([
        { row: 1, col1: "", col2: "", col3: "", col4: "" },
        { row: 2, col1: "", col2: "", col3: "", col4: "" },
        { row: 3, col1: "", col2: "", col3: "", col4: "" },
        { row: 4, col1: "", col2: "", col3: "", col4: "" },
        { row: 5, col1: "", col2: "", col3: "", col4: "" },
      ]);
      setShowForm(false);

      // Refresh tasks
      fetchTasks();
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("Error submitting task: " + error.response?.data?.message || error.message);
    }
  };

  // Handle edit
  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      company: task.company?._id || task.company || "",
      assignedTo: task.assignedTo._id || task.assignedTo,
      priority: task.priority,
      dueDate: task.dueDate.split("T")[0], // Format date
      taskTitle: task.taskTitle,
      description: task.description,
    });
    setContentType(task.contentType || "description");
    if (task.numberData) {
      setNumberData(task.numberData);
    } else {
      setNumberData([
        { row: 1, col1: "", col2: "", col3: "", col4: "" },
        { row: 2, col1: "", col2: "", col3: "", col4: "" },
        { row: 3, col1: "", col2: "", col3: "", col4: "" },
        { row: 4, col1: "", col2: "", col3: "", col4: "" },
        { row: 5, col1: "", col2: "", col3: "", col4: "" },
      ]);
    }
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${API_BASE_URL}/tasks/task/${taskId}`);
        alert("Task deleted successfully");
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Error deleting task");
      }
    }
  };

  // Handle status update
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/tasks/task/${taskId}/status`, {
        taskStatus: newStatus,
      });
      alert("Task status updated successfully");
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    }
  };

  // Get name from assignee object or ID
  const getAssigneeName = (assignee) => {
    if (typeof assignee === "object" && assignee?.fullName) {
      return assignee.fullName;
    }
    return "Unknown";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      High: "bg-orange-100 text-orange-800",
      Critical: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-blue-100 text-blue-800",
      "In Progress": "bg-purple-100 text-purple-800",
      Completed: "bg-green-100 text-green-800",
      "On Hold": "bg-gray-100 text-gray-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // 📋 View Status Change History
  const handleViewHistory = (task) => {
    const history = task.statusChangeHistory || [];
    setHistoryModalData({
      taskTitle: task.taskTitle,
      history: history,
    });
    setShowHistoryModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Assignment</h1>
            <p className="text-gray-600 mt-1">Manage and assign tasks to team members</p>
          </div>
          <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingTask(null);
                if (!showForm) {
                  setFormData({
                    company: "",
                    assignedTo: "",
                    priority: "Medium",
                    dueDate: today,
                    taskTitle: "",
                    description: "",
                  });
                  setContentType("description");
                  setNumberData([
                    { row: 1, col1: "", col2: "", col3: "", col4: "" },
                    { row: 2, col1: "", col2: "", col3: "", col4: "" },
                    { row: 3, col1: "", col2: "", col3: "", col4: "" },
                    { row: 4, col1: "", col2: "", col3: "", col4: "" },
                    { row: 5, col1: "", col2: "", col3: "", col4: "" },
                  ]);
                }
              }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <FiPlus size={20} />
            {showForm ? "Close" : "Create Task"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-indigo-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTask ? "Edit Task" : "Create New Task"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Company
                  </label>
                  <select
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Company (Optional)</option>
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assign To Employee */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Assign To Employee *
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((person) => (
                      <option key={person._id} value={person._id}>
                        {person.fullName || person.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Task Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="taskTitle"
                    value={formData.taskTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter task title"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="description">Description</option>
                  <option value="numbers">Numbers</option>
                </select>
              </div>

              {/* Conditional Content Area */}
              {contentType === "description" ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Add task description"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Number Table (Excel-like)
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-indigo-100">
                            <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 w-12">
                              Row
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 min-w-32">
                              Column 1
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 min-w-32">
                              Column 2
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 min-w-32">
                              Column 3
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 min-w-32">
                              Column 4
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-700 w-16">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {numberData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2 bg-gray-100 text-center font-semibold text-sm">
                                {rowIndex + 1}
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                <input
                                  type="text"
                                  value={row.col1}
                                  onChange={(e) =>
                                    handleNumberCellChange(rowIndex, "col1", e.target.value)
                                  }
                                  className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-indigo-500 rounded"
                                  placeholder="Enter value"
                                />
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                <input
                                  type="text"
                                  value={row.col2}
                                  onChange={(e) =>
                                    handleNumberCellChange(rowIndex, "col2", e.target.value)
                                  }
                                  className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-indigo-500 rounded"
                                  placeholder="Enter value"
                                />
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                <input
                                  type="text"
                                  value={row.col3}
                                  onChange={(e) =>
                                    handleNumberCellChange(rowIndex, "col3", e.target.value)
                                  }
                                  className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-indigo-500 rounded"
                                  placeholder="Enter value"
                                />
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                <input
                                  type="text"
                                  value={row.col4}
                                  onChange={(e) =>
                                    handleNumberCellChange(rowIndex, "col4", e.target.value)
                                  }
                                  className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-indigo-500 rounded"
                                  placeholder="Enter value"
                                />
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeNumberRow(rowIndex)}
                                  className="text-red-600 hover:text-red-800 font-semibold"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addNumberRow}
                    className="mt-3 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition font-semibold text-sm"
                  >
                    + Add Row
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setContentType("description");
                    setNumberData([
                      { row: 1, col1: "", col2: "", col3: "", col4: "" },
                      { row: 2, col1: "", col2: "", col3: "", col4: "" },
                      { row: 3, col1: "", col2: "", col3: "", col4: "" },
                      { row: 4, col1: "", col2: "", col3: "", col4: "" },
                      { row: 5, col1: "", col2: "", col3: "", col4: "" },
                    ]);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600 mt-4">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No tasks found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Task Title</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Assigned To</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Priority</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Due Date</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <>
                      <tr
                        key={task._id}
                        className="hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => toggleExpandedTask(task._id)}
                      >
                        <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <FiChevronDown
                            className={`mt-1 text-gray-500 transition-transform ${expandedTaskId === task._id ? "rotate-180" : "rotate-0"}`}
                          />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{task.taskTitle}</div>
                            <div className="text-xs text-gray-600 mt-1">{task.description?.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {getAssigneeName(task.assignedTo)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={task.taskStatus}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className={`px-3 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer ${getStatusColor(task.taskStatus)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-semibold">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewHistory(task);
                            }}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                            title="View History"
                          >
                            <FiSearch size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(task);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                            title="Edit Task"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(task._id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                            title="Delete Task"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedTaskId === task._id && (
                      <tr className="bg-slate-50 transition-all duration-300">
                        <td colSpan="6" className="px-6 py-4">
                          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
                                <p className="text-sm text-gray-500">
                                  {task.contentType === "numbers" ? "Numbers table" : "Full description"}
                                </p>
                              </div>
                              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                                {task.contentType === "numbers" ? "Numbers" : "Description"}
                              </span>
                            </div>
                            {task.contentType !== "numbers" ? (
                              <div className="text-sm text-gray-700 whitespace-pre-line">
                                {task.description || "No description provided."}
                              </div>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                  <thead>
                                    <tr className="bg-indigo-50">
                                      <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Row</th>
                                      <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Column 1</th>
                                      <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Column 2</th>
                                      <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Column 3</th>
                                      <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Column 4</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(
                                      task.numberData && task.numberData.length > 0
                                        ? task.numberData
                                        : Array.from({ length: 5 }, (_, idx) => ({ row: idx + 1, col1: "", col2: "", col3: "", col4: "" }))
                                    ).map((row, index) => (
                                      <tr key={`${task._id}-detail-${index}`} className="odd:bg-white even:bg-slate-50">
                                        <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700 font-semibold">{row.row || index + 1}</td>
                                        <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700">{row.col1 || ""}</td>
                                        <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700">{row.col2 || ""}</td>
                                        <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700">{row.col3 || ""}</td>
                                        <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700">{row.col4 || ""}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 📋 Status Change History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Status Change History</h2>
              <p className="text-sm text-gray-600 mb-6">Task: <span className="font-semibold text-blue-600">{historyModalData.taskTitle}</span></p>

              {historyModalData.history && historyModalData.history.length > 0 ? (
                <div className="space-y-4">
                  {historyModalData.history.map((entry, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-block px-3 py-1 bg-gray-700 text-white text-xs font-semibold rounded-full">
                          Change #{historyModalData.history.length - index}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.changedAt).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                          {entry.oldStatus}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          {entry.newStatus}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Reason:</p>
                        <p className="text-sm text-gray-600">{entry.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No status changes yet. This task is still pending its first status update.</p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAssign;
