import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeTasks = () => {
    const navigate = useNavigate();
    const [todayTasks, setTodayTasks] = useState([]);
    const [last7Tasks, setLast7Tasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusModalData, setStatusModalData] = useState({ taskId: null, newStatus: null, reason: "" });
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyModalData, setHistoryModalData] = useState({ taskTitle: "", history: [] });
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [taskNumberEdits, setTaskNumberEdits] = useState({});
    const [savingTaskId, setSavingTaskId] = useState(null);

    const id = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    const taskStatuses = ["Pending", "In Progress", "Completed", "On Hold"];

    // Check if user is employee and has ID
    useEffect(() => {
        if (!id || (role && role.toLowerCase() !== "employee")) {
            navigate("/dashboard");
        }
    }, [id, role, navigate]);

    // 🎨 Helper: Priority Colors
    const getPriorityColor = (priority) => {
        if (!priority) priority = "Medium";
        const p = priority.toLowerCase();
        switch (p) {
            case "low":
                return "bg-blue-100 text-blue-700";
            case "medium":
                return "bg-yellow-100 text-yellow-700";
            case "high":
                return "bg-orange-100 text-orange-700";
            case "critical":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // 📌 Fetch Tasks and compute Present (today) + Last 7 days
    useEffect(() => {
        const fetchTasksForEmployee = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:4000/tasks/tasks/assignee/${id}?limit=1000`);
                const tasks = res.data?.data || [];

                const today = new Date();
                const startDate = new Date();
                startDate.setDate(today.getDate() - 6); // last 7 days (inclusive)
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(today);
                endDate.setHours(23, 59, 59, 999);

                const todays = [];
                const last7 = [];

                tasks.forEach((t) => {
                    if (!t.dueDate) return;

                    const d = new Date(t.dueDate);

                    const isSameDay = d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
                    const inLast7 = d >= startDate && d <= endDate;

                    if (isSameDay) todays.push(t);
                    else if (inLast7) last7.push(t);
                });

                setTodayTasks(todays);
                setLast7Tasks(last7);
            } catch (err) {
                console.error("Error fetching tasks:", err);
                toast.error("Failed to load tasks");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTasksForEmployee();
        }
    }, [id]);

    const toggleExpandedTask = (taskId) => {
        setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
    };

    const getTaskNumberRows = (task) => {
        const baseRows = task.numberData && task.numberData.length > 0
            ? task.numberData
            : Array.from({ length: 5 }, (_, idx) => ({ row: idx + 1, col1: "", col2: "", col3: "", col4: "" }));
        return taskNumberEdits[task._id] || baseRows;
    };

    const getOriginalNumberRows = (task) => {
        if (task.originalNumberData && task.originalNumberData.length > 0) {
            return task.originalNumberData;
        }
        if (task.numberData && task.numberData.length > 0) {
            return task.numberData;
        }
        return Array.from({ length: 5 }, (_, idx) => ({ row: idx + 1, col1: "", col2: "", col3: "", col4: "" }));
    };

    const isCellOriginallyPrefilled = (task, rowIndex, col) => {
        return Boolean(getOriginalNumberRows(task)[rowIndex]?.[col]);
    };

    const handleNumberCellChange = (taskId, rowIndex, column, value) => {
        setTaskNumberEdits((prev) => {
            const existing = prev[taskId] ? [...prev[taskId]] : [];
            let taskRows = existing.length > 0 ? existing : [];

            if (taskRows.length === 0) {
                const foundTask = todayTasks.find((t) => t._id === taskId) || last7Tasks.find((t) => t._id === taskId);
                taskRows = foundTask && foundTask.numberData && foundTask.numberData.length > 0
                    ? foundTask.numberData.map((row) => ({ ...row }))
                    : Array.from({ length: 5 }, (_, idx) => ({ row: idx + 1, col1: "", col2: "", col3: "", col4: "" }));
            }

            const row = taskRows[rowIndex] ? { ...taskRows[rowIndex] } : { row: rowIndex + 1, col1: "", col2: "", col3: "", col4: "" };
            row[column] = value;

            const nextRows = [...taskRows];
            nextRows[rowIndex] = row;

            return {
                ...prev,
                [taskId]: nextRows,
            };
        });
    };

    const saveTaskNumberData = async (task) => {
        const editedRows = getTaskNumberRows(task);
        const payloadRows = editedRows.map((row, index) => ({
            row: row.row || index + 1,
            col1: row.col1 || "",
            col2: row.col2 || "",
            col3: row.col3 || "",
            col4: row.col4 || "",
        }));

        setSavingTaskId(task._id);
        try {
            const res = await axios.put(`http://localhost:4000/tasks/task/${task._id}`, {
                numberData: payloadRows,
            });

            const updatedTask = res.data?.data;
            if (updatedTask) {
                setTodayTasks((prev) => prev.map((t) => (t._id === task._id ? updatedTask : t)));
                setLast7Tasks((prev) => prev.map((t) => (t._id === task._id ? updatedTask : t)));
                setTaskNumberEdits((prev) => {
                    const next = { ...prev };
                    delete next[task._id];
                    return next;
                });
                toast.success("Task table data saved successfully");
            }
        } catch (err) {
            console.error("Error saving task number data:", err);
            toast.error("Failed to save task data");
        } finally {
            setSavingTaskId(null);
        }
    };

    // 🔄 Handle Status Change - Open Modal
    const handleStatusChange = (taskId, newStatus) => {
        setStatusModalData({ taskId, newStatus, reason: "" });
        setShowStatusModal(true);
    };

    // 🔄 Confirm Status Update with Reason
    const confirmStatusUpdate = async () => {
        const { taskId, newStatus, reason } = statusModalData;

        if (!reason.trim()) {
            toast.warning("Please describe why you changed the status");
            return;
        }

        try {
            setUpdatingStatusId(taskId);
            const res = await axios.put(`http://localhost:4000/tasks/task/${taskId}/status`, {
                taskStatus: newStatus,
                statusChangeReason: reason,
            });

            if (res.data?.success) {
                toast.success(`Task status updated to ${newStatus}`);

                // Update local state
                const updateTaskStatus = (tasks) =>
                    tasks.map((t) =>
                        t._id === taskId ? { ...t, taskStatus: newStatus } : t
                    );

                setTodayTasks(updateTaskStatus(todayTasks));
                setLast7Tasks(updateTaskStatus(last7Tasks));
                
                // Close modal
                setShowStatusModal(false);
                setStatusModalData({ taskId: null, newStatus: null, reason: "" });
            }
        } catch (err) {
            console.error("Error updating task status:", err);
            toast.error("Failed to update task status");
        } finally {
            setUpdatingStatusId(null);
        }
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
        <div className="flex-1 bg-[#f8fafc] px-4 md:px-8 py-6">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
                <p className="mt-2 text-gray-600">View and manage all your assigned tasks</p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Loading tasks...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Task Summary - TOP */}
                    {(todayTasks.length > 0 || last7Tasks.length > 0) && (
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Task Summary</h2>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-700">{todayTasks.length}</p>
                                    <p className="text-sm text-gray-600 mt-1">Today</p>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <p className="text-2xl font-bold text-orange-700">{last7Tasks.length}</p>
                                    <p className="text-sm text-gray-600 mt-1">Last 7 Days</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-700">
                                        {todayTasks.concat(last7Tasks).filter(t => t.taskStatus === "Completed").length}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">Completed</p>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <p className="text-2xl font-bold text-red-700">
                                        {todayTasks.concat(last7Tasks).filter(t => t.priority === "Critical").length}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">Critical</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Present (Today) Tasks */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Present (Today)</h2>
                        {todayTasks && todayTasks.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Due Date</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Task Title</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-700">Priority</th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {todayTasks.map((t) => (
                                            <React.Fragment key={t._id}>
                                                <tr className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer" onClick={() => toggleExpandedTask(t._id)}>
                                                    <td className="px-4 py-3 font-bold text-blue-600">{new Date(t.dueDate).toLocaleDateString()}</td>
                                                    <td className="px-4 py-3 font-bold text-gray-900">{t.taskTitle}</td>
                                                    <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{t.description || "—"}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${getPriorityColor(t.priority)}`}>
                                                            {t.priority || "Medium"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <select
                                                            value={t.taskStatus || "Pending"}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(t._id, e.target.value);
                                                            }}
                                                            disabled={updatingStatusId === t._id}
                                                            className="text-xs font-medium px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 cursor-pointer hover:border-gray-400 disabled:opacity-50"
                                                        >
                                                            {taskStatuses.map((status) => (
                                                                <option key={status} value={status}>
                                                                    {status}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleExpandedTask(t._id);
                                                                }}
                                                                className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                                                            >
                                                                {expandedTaskId === t._id ? "Collapse" : "Details"}
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewHistory(t);
                                                                }}
                                                                className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                            >
                                                                History
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {expandedTaskId === t._id && (
                                                    <tr className="bg-slate-50">
                                                        <td colSpan="6" className="px-4 py-4">
                                                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <div>
                                                                        <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
                                                                        <p className="text-sm text-gray-500">
                                                                            {t.contentType === "numbers" ? "Editable number table" : "Full description"}
                                                                        </p>
                                                                    </div>
                                                                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                                                                        {t.contentType === "numbers" ? "Numbers" : "Description"}
                                                                    </span>
                                                                </div>
                                                                {t.contentType !== "numbers" ? (
                                                                    <div className="text-sm text-gray-700 whitespace-pre-line">
                                                                        {t.description || "No description provided."}
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-4">
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
                                                                                    {getTaskNumberRows(t).map((row, rowIndex) => (
                                                                                        <tr key={`${t._id}-row-${rowIndex}`} className="odd:bg-white even:bg-slate-50">
                                                                                            <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700 font-semibold">{row.row || rowIndex + 1}</td>
                                                                                            {['col1','col2','col3','col4'].map((col) => {
                                                                                                const isPrefilled = isCellOriginallyPrefilled(t, rowIndex, col);
                                                                                                return (
                                                                                                    <td key={col} className="border border-gray-200 px-3 py-2 text-sm">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            value={row[col] || ""}
                                                                                                            onChange={(e) => {
                                                                                                                if (!isPrefilled) {
                                                                                                                    handleNumberCellChange(t._id, rowIndex, col, e.target.value);
                                                                                                                }
                                                                                                            }}
                                                                                                            disabled={isPrefilled}
                                                                                                            className={`w-full px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isPrefilled ? 'border border-gray-200 bg-slate-100 text-gray-700' : 'border border-indigo-300 bg-white text-gray-900'}`}
                                                                                                            placeholder={isPrefilled ? "Locked" : "Enter value"}
                                                                                                        />
                                                                                                    </td>
                                                                                                );
                                                                                            })}
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                        <div className="flex flex-wrap items-center gap-3">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    saveTaskNumberData(t);
                                                                                }}
                                                                                disabled={savingTaskId === t._id}
                                                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            >
                                                                                {savingTaskId === t._id ? "Saving..." : "Save Table Data"}
                                                                            </button>
                                                                            <p className="text-sm text-gray-500">Only empty cells are editable. Pre-filled values are locked.</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No tasks for today. Great job! 🎉</p>
                            </div>
                        )}
                    </div>

                    {/* Last 7 Days Tasks */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Last 7 Days</h2>
                        {last7Tasks && last7Tasks.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Due Date</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Task Title</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-700">Priority</th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {last7Tasks.map((t) => (
                                            <React.Fragment key={t._id}>
                                                <tr className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer" onClick={() => toggleExpandedTask(t._id)}>
                                                    <td className="px-4 py-3 font-bold text-blue-600">{new Date(t.dueDate).toLocaleDateString()}</td>
                                                    <td className="px-4 py-3 font-bold text-gray-900">{t.taskTitle}</td>
                                                    <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{t.description || "—"}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${getPriorityColor(t.priority)}`}>
                                                            {t.priority || "Medium"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <select
                                                            value={t.taskStatus || "Pending"}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(t._id, e.target.value);
                                                            }}
                                                            disabled={updatingStatusId === t._id}
                                                            className="text-xs font-medium px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 cursor-pointer hover:border-gray-400 disabled:opacity-50"
                                                        >
                                                            {taskStatuses.map((status) => (
                                                                <option key={status} value={status}>
                                                                    {status}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleExpandedTask(t._id);
                                                                }}
                                                                className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                                                            >
                                                                {expandedTaskId === t._id ? "Collapse" : "Details"}
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewHistory(t);
                                                                }}
                                                                className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                            >
                                                                History
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {expandedTaskId === t._id && (
                                                    <tr className="bg-slate-50">
                                                        <td colSpan="6" className="px-4 py-4">
                                                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <div>
                                                                        <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
                                                                        <p className="text-sm text-gray-500">
                                                                            {t.contentType === "numbers" ? "Editable number table" : "Full description"}
                                                                        </p>
                                                                    </div>
                                                                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                                                                        {t.contentType === "numbers" ? "Numbers" : "Description"}
                                                                    </span>
                                                                </div>
                                                                {t.contentType !== "numbers" ? (
                                                                    <div className="text-sm text-gray-700 whitespace-pre-line">
                                                                        {t.description || "No description provided."}
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-4">
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
                                                                                    {getTaskNumberRows(t).map((row, rowIndex) => (
                                                                                        <tr key={`${t._id}-row-${rowIndex}`} className="odd:bg-white even:bg-slate-50">
                                                                                            <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700 font-semibold">{row.row || rowIndex + 1}</td>
                                                                                            {['col1','col2','col3','col4'].map((col) => {
                                                                                                const isPrefilled = isCellOriginallyPrefilled(t, rowIndex, col);
                                                                                                return (
                                                                                                    <td key={col} className="border border-gray-200 px-3 py-2 text-sm">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            value={row[col] || ""}
                                                                                                            onChange={(e) => {
                                                                                                                if (!isPrefilled) {
                                                                                                                    handleNumberCellChange(t._id, rowIndex, col, e.target.value);
                                                                                                                }
                                                                                                            }}
                                                                                                            disabled={isPrefilled}
                                                                                                            className={`w-full px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isPrefilled ? 'border border-gray-200 bg-slate-100 text-gray-700' : 'border border-indigo-300 bg-white text-gray-900'}`}
                                                                                                            placeholder={isPrefilled ? "Locked" : "Enter value"}
                                                                                                        />
                                                                                                    </td>
                                                                                                );
                                                                                            })}
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                        <div className="flex flex-wrap items-center gap-3">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    saveTaskNumberData(t);
                                                                                }}
                                                                                disabled={savingTaskId === t._id}
                                                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            >
                                                                                {savingTaskId === t._id ? "Saving..." : "Save Table Data"}
                                                                            </button>
                                                                            <p className="text-sm text-gray-500">Only empty cells are editable. Pre-filled values are locked.</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No tasks in the last 7 days.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 🔔 Status Change Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Update Task Status</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Changing status to: <span className="font-semibold text-blue-600">{statusModalData.newStatus}</span>
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Describe why you changed the status: *
                            </label>
                            <textarea
                                value={statusModalData.reason}
                                onChange={(e) =>
                                    setStatusModalData({ ...statusModalData, reason: e.target.value })
                                }
                                placeholder="Enter your reason for this status change..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows="4"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {statusModalData.reason.length}/200 characters
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowStatusModal(false);
                                    setStatusModalData({ taskId: null, newStatus: null, reason: "" });
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmStatusUpdate}
                                disabled={!statusModalData.reason.trim() || updatingStatusId}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updatingStatusId ? "Updating..." : "Update Status"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
    );
};

export default EmployeeTasks;
