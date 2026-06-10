import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUserFriends, FaBriefcase, FaCalendarCheck, FaTasks, FaPlus,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaPaperPlane,
  FaCheckCircle, FaClock, FaExclamationTriangle, FaTrash, FaEye, FaCommentAlt,
  FaChartLine, FaFire, FaLink, FaSnowflake, FaSearch, FaTimes, FaChevronRight
} from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { BsPersonCheckFill, BsPersonXFill } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { FiRefreshCw } from "react-icons/fi";
import { TbCalendarStats } from "react-icons/tb";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";

const MyTeamDashboard = () => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Team Leader";

  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const [activeTab, setActiveTab] = useState("leads");

  const [selectedMember, setSelectedMember] = useState(null);

  const [leadsList, setLeadsList] = useState([]);
  const [specialLeadsList, setSpecialLeadsList] = useState([]);
  const [assignedLeadsList, setAssignedLeadsList] = useState([]);
  const [destinationLeadsList, setDestinationLeadsList] = useState([]);
  const [transferLeadsList, setTransferLeadsList] = useState([]);
  const [leadSubTab, setLeadSubTab] = useState("my-leads");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [subNavFilter, setSubNavFilter] = useState("all");

  const [leadsLoading, setLeadsLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetailsModal, setShowLeadDetailsModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const [attendanceList, setAttendanceList] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthsList = [
    { value: 0, label: "January" }, { value: 1, label: "February" },
    { value: 2, label: "March" }, { value: 3, label: "April" },
    { value: 4, label: "May" }, { value: 5, label: "June" },
    { value: 6, label: "July" }, { value: 7, label: "August" },
    { value: 8, label: "September" }, { value: 9, label: "October" },
    { value: 10, label: "November" }, { value: 11, label: "December" },
  ];

  const [tasksList, setTasksList] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);

  const [taskNumberEdits, setTaskNumberEdits] = useState({});
  const [savingTaskId, setSavingTaskId] = useState(null);

  const getTaskNumberRows = (task) => {
    const baseRows = task.numberData && task.numberData.length > 0
        ? task.numberData
        : Array.from({ length: 5 }, (_, idx) => ({ row: idx + 1, col1: "", col2: "", col3: "", col4: "", callStatus: "" }));
    return taskNumberEdits[task._id] || baseRows;
  };

  const getOriginalNumberRows = (task) => {
    if (task.originalNumberData && task.originalNumberData.length > 0) {
        return task.originalNumberData;
    }
    if (task.numberData && task.numberData.length > 0) {
        return task.numberData;
    }
    return Array.from({ length: 5 }, (_, idx) => ({ row: idx + 1, col1: "", col2: "", col3: "", col4: "", callStatus: "" }));
  };

  const isCellOriginallyPrefilled = (task, rowIndex, col) => {
    return Boolean(getOriginalNumberRows(task)[rowIndex]?.[col]);
  };

  const handleNumberCellChange = (taskId, rowIndex, column, value) => {
    setTaskNumberEdits((prev) => {
        const existing = prev[taskId] ? [...prev[taskId]] : [];
        let taskRows = existing.length > 0 ? existing : [];

        if (taskRows.length === 0) {
            const foundTask = tasksList.find((t) => t._id === taskId);
            taskRows = foundTask && foundTask.numberData && foundTask.numberData.length > 0
                ? foundTask.numberData.map((row) => ({ ...row }))
                : Array.from({ length: 5 }, (_, idx) => ({ row: idx + 1, col1: "", col2: "", col3: "", col4: "", callStatus: "" }));
        }

        const row = taskRows[rowIndex] ? { ...taskRows[rowIndex] } : { row: rowIndex + 1, col1: "", col2: "", col3: "", col4: "", callStatus: "" };
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
        callStatus: row.callStatus || "",
    }));

    setSavingTaskId(task._id);
    try {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/tasks/task/${task._id}`, {
            numberData: payloadRows,
        });

        const updatedTask = res.data?.data;
        if (updatedTask) {
            setTasksList((prev) => prev.map((t) => (t._id === task._id ? updatedTask : t)));
            setTaskNumberEdits((prev) => {
                const next = { ...prev };
                delete next[task._id];
                return next;
            });
        }
    } catch (err) {
        console.error("Error saving task number data:", err);
    } finally {
        setSavingTaskId(null);
    }
  };

  const [taskForm, setTaskForm] = useState({
    taskTitle: "", description: "", assignedTo: "", priority: "Medium", dueDate: "",
  });
  const [submittingTask, setSubmittingTask] = useState(false);
  const [refreshSpin, setRefreshSpin] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");

  useEffect(() => {
    if (!userId) return;
    const fetchTeamData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/teams`);
        const foundTeam = res.data.find(t => t.teamLeader?._id === userId);
        if (foundTeam) setTeam(foundTeam);
      } catch (err) {
        console.error("Error fetching team data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamData();
  }, [userId]);

  useEffect(() => {
    if (selectedMember) setTaskForm(prev => ({ ...prev, assignedTo: selectedMember._id }));
  }, [selectedMember]);

  useEffect(() => {
    if (!selectedMember) return;
    const fetchAllLeads = async () => {
      setLeadsLoading(true);
      try {
        const empLeadsRes = await axios.get(`${import.meta.env.VITE_API_URL}/employeelead/employee/${selectedMember._id}`);
        const allEmpLeads = empLeadsRes.data.leads || empLeadsRes.data || [];
        const ownLeads = allEmpLeads.filter(lead => !lead.routedFromEmployee || (lead.routedFromEmployee && lead.isActioned));
        setLeadsList(ownLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        const routedLeads = allEmpLeads.filter(lead => lead.routedFromEmployee && lead.routedFromEmployee !== selectedMember._id && !lead.isActioned);
        setDestinationLeadsList(routedLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        const specialRes = await axios.get(`${import.meta.env.VITE_API_URL}/superadminmylead/assigned-to/${selectedMember._id}`);
        setSpecialLeadsList((specialRes.data.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        const assignedRes = await axios.get(`${import.meta.env.VITE_API_URL}/assignlead/${selectedMember._id}`);
        const assigned = assignedRes.data.data || [];
        setAssignedLeadsList(assigned.filter(al => !ownLeads.some(ol => ol.phone === al.phone)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        const transferRes = await axios.get(`${import.meta.env.VITE_API_URL}/employeelead/transfer/employee/${selectedMember._id}`);
        setTransferLeadsList((transferRes.data.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        setLeadsList([]); setSpecialLeadsList([]); setAssignedLeadsList([]);
        setDestinationLeadsList([]); setTransferLeadsList([]);
      } finally {
        setLeadsLoading(false);
      }
    };
    fetchAllLeads();
  }, [selectedMember]);

  useEffect(() => {
    if (!selectedMember || activeTab !== "attendance") return;
    const fetchAttendance = async () => {
      setAttendanceLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/attendance/${selectedMember._id}`);
        setAttendanceList(res.data.data || (Array.isArray(res.data) ? res.data : []));
      } catch (err) {
        setAttendanceList([]);
      } finally {
        setAttendanceLoading(false);
      }
    };
    fetchAttendance();
  }, [selectedMember, activeTab]);

  const fetchTasks = async () => {
    if (!selectedMember) return;
    setTasksLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tasks/tasks/assignee/${selectedMember._id}?limit=1000`);
      setTasksList((res.data.data || []).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
    } catch (err) {
      setTasksList([]);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "tasks") fetchTasks();
  }, [selectedMember, activeTab]);

  const handleRefresh = () => {
    setRefreshSpin(true);
    setTimeout(() => setRefreshSpin(false), 800);
    if (activeTab === "tasks") fetchTasks();
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!taskForm.taskTitle || !taskForm.assignedTo || !taskForm.dueDate) {
      alert("Please fill all required fields."); return;
    }
    setSubmittingTask(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/tasks/task`, { ...taskForm, assignedBy: userId, contentType: "description" });
      alert("Task assigned successfully!");
      setShowAssignTaskModal(false);
      setTaskForm({ taskTitle: "", description: "", assignedTo: selectedMember?._id || "", priority: "Medium", dueDate: "" });
      if (activeTab === "tasks") fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign task.");
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedLead) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/employeelead/${selectedLead._id}/message`, { message: newMessage, sender: userName });
      const updatedMessages = [...(selectedLead.messages || []), { text: newMessage, sentAt: new Date(), sender: userName }];
      const updatedLead = { ...selectedLead, messages: updatedMessages };
      setSelectedLead(updatedLead);
      setNewMessage("");
      const updater = prev => prev.map(l => l._id === selectedLead._id ? updatedLead : l);
      setLeadsList(updater); setSpecialLeadsList(updater); setAssignedLeadsList(updater);
      setDestinationLeadsList(updater); setTransferLeadsList(updater);
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/task/${taskId}`);
      setTasksList(prev => prev.filter(t => t._id !== taskId));
    } catch (err) {
      alert("Failed to delete task.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto shadow-lg"></div>
          <p className="mt-5 text-blue-700 font-semibold text-sm tracking-wide">Loading Team Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center mt-16">
        <div className="bg-white rounded-3xl border border-blue-50 shadow-xl p-12">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-blue-300">
            <HiUsers size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Team Found</h3>
          <p className="text-slate-500 mt-2 text-sm">You are not designated as a leader of any active team.</p>
        </div>
      </div>
    );
  }

  const todayRecord = attendanceList.find(r => {
    if (!r.date) return false;
    const d = new Date(r.date), today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });

  const getActiveLeadsList = () => {
    switch (leadSubTab) {
      case "my-leads": return leadsList;
      case "special-lead": return specialLeadsList;
      case "assigned": return assignedLeadsList;
      case "destination-assigned": return destinationLeadsList;
      case "transfer": return transferLeadsList;
      default: return leadsList;
    }
  };

  const activeLeads = getActiveLeadsList();
  const countAll = activeLeads.length;
  const countFollowUp = activeLeads.filter(l => (l.leadInterestStatus || l.leadStatus) === "Follow Up").length;
  const countInterested = activeLeads.filter(l => (l.leadInterestStatus || l.leadStatus) === "Interested").length;
  const countConnected = activeLeads.filter(l => (l.leadInterestStatus || l.leadStatus) === "Connected").length;
  const countNotConnected = activeLeads.filter(l => (l.leadInterestStatus || l.leadStatus) === "Not Connected").length;

  const filteredLeads = activeLeads.filter(l => {
    const q = searchQuery.trim().toLowerCase();
    const name = l.name || l.companyName || "", email = l.email || l.companyEmail || "";
    const phone = l.phone || l.companyPhone || "", dest = l.destination || "";
    const matchesSearch = !q || [name, email, phone, dest].some(v => v.toLowerCase().includes(q));
    const leadStatusVal = l.leadInterestStatus || l.leadStatus || "";
    const matchesStatus = !statusFilter || leadStatusVal === statusFilter;
    let matchesSubNav = true;
    if (subNavFilter === "follow-up") matchesSubNav = leadStatusVal === "Follow Up";
    else if (subNavFilter === "interested") matchesSubNav = leadStatusVal === "Interested";
    else if (subNavFilter === "connected") matchesSubNav = leadStatusVal === "Connected";
    else if (subNavFilter === "not-interested") matchesSubNav = leadStatusVal === "Not Interested";
    else if (subNavFilter === "not-connected") matchesSubNav = leadStatusVal === "Not Connected";
    return matchesSearch && matchesStatus && matchesSubNav;
  });

  const getStatusBadge = (status) => {
    const map = {
      "Hot": "bg-red-100 text-red-700 border-red-200",
      "Warm": "bg-orange-100 text-orange-700 border-orange-200",
      "Cold": "bg-sky-100 text-sky-700 border-sky-200",
      "Follow Up": "bg-amber-100 text-amber-700 border-amber-200",
      "Interested": "bg-emerald-100 text-emerald-700 border-emerald-200",
      "Connected": "bg-blue-100 text-blue-700 border-blue-200",
      "Not Interested": "bg-rose-100 text-rose-700 border-rose-200",
      "Not Connected": "bg-slate-100 text-slate-600 border-slate-200",
    };
    return map[status] || "bg-slate-100 text-slate-600 border-slate-200";
  };

  const taskPriorityBadge = (p) => {
    if (p === "Critical") return "bg-red-100 text-red-700 border border-red-200";
    if (p === "High") return "bg-orange-100 text-orange-700 border border-orange-200";
    if (p === "Medium") return "bg-blue-100 text-blue-700 border border-blue-200";
    return "bg-slate-100 text-slate-600 border border-slate-200";
  };

  const initials = (name) => name?.slice(0, 2).toUpperCase() || "??";

  const MEMBER_COLORS = [
    "from-blue-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-sky-600",
  ];

  return (
    <div className="min-h-screen bg-[#f0f4ff]">

      {/* ── HERO HEADER ── */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-4 right-1/3 w-32 h-32 bg-blue-300/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 border border-white/20 rounded-full text-[11px] font-bold tracking-widest text-blue-100 uppercase mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Team Leader Panel
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Welcome, <span className="text-blue-200">{userName}</span>
              </h1>
              <p className="text-blue-200/80 mt-1.5 text-sm max-w-md">
                Select a team member to view leads, attendance & assign tasks.
              </p>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto mt-6 md:mt-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 flex items-center gap-3 w-full">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-extrabold text-lg">
                  {team.members?.length || 0}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-blue-200 font-bold">Members</div>
                  <div className="text-sm font-semibold text-white">Active Team</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 flex items-center gap-3 w-full">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <IoSparkles className="text-yellow-300" size={20} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-blue-200 font-bold">Total Leads</div>
                  <div className="text-sm font-semibold text-white">
                    {leadsList.length + specialLeadsList.length + assignedLeadsList.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── ROW 1: Team Members Selection ── */}
        <div className="bg-white rounded-2xl border border-blue-50 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <HiUsers className="text-blue-600 animate-pulse" size={20} />
                <span>Select a Team Member</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Click a member's card to load their leads, attendance, and task records</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-60">
                <FaSearch className="absolute left-3.5 top-3 text-slate-400" size={11} />
                <input
                  type="text"
                  placeholder="Search team members…"
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 w-full bg-slate-50 text-slate-700 placeholder-slate-400"
                />
              </div>
              
              <div className="text-xs font-bold text-blue-600 bg-blue-50/60 px-3 py-2.5 rounded-xl border border-blue-100 text-center w-full sm:w-auto">
                {team.members?.length || 0} Active Members
              </div>
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 scrollbar-thin scrollbar-thumb-slate-200">
            {(() => {
              const filteredList = team.members.filter(member => {
                const q = memberSearchQuery.trim().toLowerCase();
                return !q || (member.fullName || "").toLowerCase().includes(q) || (member.email || "").toLowerCase().includes(q);
              });

              if (filteredList.length === 0) {
                return (
                  <div className="col-span-full py-8 text-center text-slate-400 text-xs font-semibold">
                    No matching team members found.
                  </div>
                );
              }

              return filteredList.map((member, idx) => {
                const isActive = selectedMember?._id === member._id;
                const colorClass = MEMBER_COLORS[idx % MEMBER_COLORS.length];
                return (
                  <div
                    key={member._id}
                    onClick={() => setSelectedMember(member)}
                    className={`flex items-center gap-3.5 p-4 rounded-2xl cursor-pointer border transition-all duration-300 transform hover:scale-[1.02] ${
                      isActive
                        ? "bg-blue-50 border-blue-400 text-slate-800 shadow-md shadow-blue-100/50 border-2"
                        : "bg-white hover:bg-blue-50/30 border-slate-100 hover:border-blue-200"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 transition-colors ${
                      isActive 
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-200" 
                        : `bg-gradient-to-br ${colorClass} text-white`
                    }`}>
                      {initials(member.fullName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-bold text-sm truncate ${isActive ? "text-blue-900" : "text-slate-800"}`}>
                        {member.fullName}
                      </div>
                      <div className={`text-[11px] truncate mt-0.5 ${isActive ? "text-blue-600/80" : "text-slate-400"}`}>
                        {member.email}
                      </div>
                    </div>
                    {isActive && <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping shrink-0" />}
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* ── ROW 2: Selected Member Data ── */}
        <div className="w-full">
          {selectedMember ? (
            <div className="space-y-6">

              {/* Selected Member Header Card */}
              <div className="bg-white rounded-2xl border border-blue-50 shadow-sm">
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-base shadow-md shadow-blue-100">
                        {initials(selectedMember.fullName)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">{selectedMember.fullName}</h2>
                        <p className="text-xs text-slate-400">{selectedMember.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                      {/* Refresh button & Tabs Container */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={handleRefresh}
                          className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shrink-0"
                        >
                          <FiRefreshCw size={14} className={refreshSpin ? "animate-spin" : ""} />
                        </button>

                        {/* Tabs */}
                        <div className="bg-slate-100 p-1 rounded-xl grid grid-cols-3 gap-1 w-full sm:flex sm:w-auto">
                          {[
                            { id: "leads", label: "Leads", icon: FaBriefcase },
                            { id: "attendance", label: "Attendance", icon: TbCalendarStats },
                            { id: "tasks", label: "Tasks", icon: FaTasks },
                          ].map(tab => {
                            const Icon = tab.icon;
                            const active = activeTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-1.5 px-1 py-2 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-200 ${
                                  active
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-200"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                <Icon size={12} className="shrink-0" />
                                <span className="truncate">{tab.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── LEADS TAB ── */}
                {activeTab === "leads" && (
                  <div className="space-y-5">

                    {/* Lead Category Sub-Tabs */}
                    <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-2 grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-1.5">
                      {[
                        { id: "my-leads", label: "My Leads", count: leadsList.length },
                        { id: "special-lead", label: "Special", count: specialLeadsList.length },
                        { id: "assigned", label: "Assigned", count: assignedLeadsList.length },
                        { id: "destination-assigned", label: "Destination", count: destinationLeadsList.length },
                        { id: "transfer", label: "Transfer", count: transferLeadsList.length },
                      ].map((tab, idx) => {
                        const active = leadSubTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => { setLeadSubTab(tab.id); setSubNavFilter("all"); }}
                            className={`flex items-center justify-between md:justify-start gap-1.5 px-2.5 py-2 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200 w-full md:w-auto ${
                              idx === 4 ? "col-span-2 sm:col-span-1" : ""
                            } ${
                              active
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                                : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                          >
                            <span className="truncate">{tab.label}</span>
                            <span className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold shrink-0 ${
                              active ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
                            }`}>
                              {tab.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { label: "All Leads", count: countAll, icon: FaChartLine, color: "blue", bg: "from-blue-500 to-indigo-500" },
                        { label: "Follow Up", count: countFollowUp, icon: FaCommentAlt, color: "amber", bg: "from-amber-400 to-orange-500" },
                        { label: "Interested", count: countInterested, icon: FaFire, color: "emerald", bg: "from-emerald-500 to-teal-500" },
                        { label: "Connected", count: countConnected, icon: FaLink, color: "sky", bg: "from-sky-500 to-cyan-500" },
                        { label: "Not Connected", count: countNotConnected, icon: FaSnowflake, color: "slate", bg: "from-slate-400 to-slate-500" },
                      ].map(card => {
                        const Icon = card.icon;
                        return (
                          <div key={card.label} className="bg-white rounded-2xl border border-blue-50 shadow-sm p-4 relative overflow-hidden">
                            <div className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br ${card.bg} opacity-10 rounded-full`}></div>
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.bg} flex items-center justify-center mb-3 shadow-sm`}>
                              <Icon size={13} className="text-white" />
                            </div>
                            <div className="text-2xl font-extrabold text-slate-800">{card.count}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{card.label}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Filters Row */}
                    <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                          <input
                            type="text"
                            placeholder="Search by name, phone, or destination…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 text-slate-700 placeholder-slate-400"
                          />
                        </div>

                        {/* Status dropdown */}
                        <select
                          value={statusFilter}
                          onChange={e => setStatusFilter(e.target.value)}
                          className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 bg-white font-semibold"
                        >
                          <option value="">All Status</option>
                          {["Hot","Warm","Cold","Follow Up","Interested","Connected","Not Interested","Not Connected"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>

                        {/* Clear */}
                        {(searchQuery || statusFilter || subNavFilter !== "all") && (
                          <button
                            onClick={() => { setSearchQuery(""); setStatusFilter(""); setSubNavFilter("all"); }}
                            className="flex items-center gap-1.5 px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all"
                          >
                            <FaTimes size={10} /> Clear
                          </button>
                        )}

                        {/* Quick filter pills */}
                        <div className="flex flex-wrap gap-1">
                          {[
                            { id: "all", label: "All" },
                            { id: "follow-up", label: "Follow Up" },
                            { id: "interested", label: "Interested" },
                            { id: "connected", label: "Connected" },
                            { id: "not-interested", label: "Not Interested" },
                            { id: "not-connected", label: "Not Connected" },
                          ].map(f => (
                            <button
                              key={f.id}
                              onClick={() => setSubNavFilter(f.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                subNavFilter === f.id
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Leads Table */}
                    <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
                      {leadsLoading ? (
                        <div className="py-20 text-center">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <p className="text-slate-400 text-xs mt-3 font-medium">Loading leads…</p>
                        </div>
                      ) : filteredLeads.length === 0 ? (
                        <div className="py-20 text-center">
                          <BsPersonXFill size={36} className="text-slate-200 mx-auto mb-3" />
                          <p className="text-slate-400 font-semibold text-sm">No leads match the criteria.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-hidden">
                          {/* Desktop Table */}
                          <table className="hidden md:table w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-blue-50">
                                <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Contact</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Departure</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Destination</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Travel Date</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Status</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50/50">
                              {filteredLeads.map(lead => {
                                const status = lead.leadInterestStatus || lead.leadStatus || "Cold";
                                return (
                                  <tr key={lead._id} className="hover:bg-blue-50/20 transition-colors group">
                                    <td className="px-5 py-4">
                                      <div className="font-bold text-slate-800 text-sm">{lead.name || lead.companyName || "N/A"}</div>
                                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                        <FaPhoneAlt size={9} className="text-slate-300" />
                                        {lead.phone || lead.companyPhone || "—"}
                                      </div>
                                      {(lead.email || lead.companyEmail) && (
                                        <div className="text-[10px] text-slate-400 mt-0.5">{lead.email || lead.companyEmail}</div>
                                      )}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-600 font-medium">{lead.departureCity || "—"}</td>
                                    <td className="px-5 py-4">
                                      <div className="flex items-center gap-1.5 text-sm text-slate-700">
                                        <FaMapMarkerAlt size={11} className="text-blue-400 shrink-0" />
                                        <span className="font-semibold">{lead.destination || "—"}</span>
                                      </div>
                                    </td>
                                    <td className="px-5 py-4">
                                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                        <FaCalendarAlt size={10} className="text-slate-300 shrink-0" />
                                        {lead.expectedTravelDate ? new Date(lead.expectedTravelDate).toLocaleDateString() : "—"}
                                      </div>
                                    </td>
                                    <td className="px-5 py-4">
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(status)}`}>
                                        {status}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                      <button
                                        onClick={() => { setSelectedLead(lead); setShowLeadDetailsModal(true); }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-sm shadow-blue-100 group-hover:shadow-blue-200"
                                      >
                                        <FaEye size={10} /> View
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>

                          {/* Mobile Cards */}
                          <div className="md:hidden flex flex-col divide-y divide-blue-50/50">
                            {filteredLeads.map(lead => {
                              const status = lead.leadInterestStatus || lead.leadStatus || "Cold";
                              return (
                                <div key={lead._id} className="p-4 hover:bg-slate-50 transition-colors">
                                  <div className="flex justify-between items-start mb-2.5">
                                    <div>
                                      <div className="font-bold text-slate-800 text-[13px]">{lead.name || lead.companyName || "N/A"}</div>
                                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                                        <FaPhoneAlt size={9} className="text-slate-400" />
                                        {lead.phone || lead.companyPhone || "—"}
                                      </div>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold border uppercase tracking-wider ${getStatusBadge(status)}`}>
                                      {status}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3 text-xs mb-3.5 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/50">
                                    <div>
                                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-1">Destination</span>
                                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
                                        <FaMapMarkerAlt size={10} className="text-blue-400" />
                                        {lead.destination || "—"}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-1">Travel Date</span>
                                      <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-medium">
                                        <FaCalendarAlt size={10} className="text-slate-400" />
                                        {lead.expectedTravelDate ? new Date(lead.expectedTravelDate).toLocaleDateString() : "—"}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <button
                                    onClick={() => { setSelectedLead(lead); setShowLeadDetailsModal(true); }}
                                    className="w-full flex items-center justify-center gap-2 py-2 bg-white hover:bg-blue-50 text-blue-600 rounded-xl text-xs font-bold transition-all border border-slate-200 shadow-sm"
                                  >
                                    <FaEye size={12} /> View Lead Details
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── ATTENDANCE TAB ── */}
                {activeTab === "attendance" && (
                  <div className="space-y-5">
                    {/* Today's Summary */}
                    <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                              <TbCalendarStats className="text-blue-600" size={20} />
                              Today's Attendance
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">{new Date().toDateString()}</p>
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border ${
                            todayRecord?.status === "Present" || todayRecord?.status === "Grace Present"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : todayRecord?.status === "Late"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}>
                            {todayRecord?.status === "Present" || todayRecord?.status === "Grace Present"
                              ? <BsPersonCheckFill size={16} />
                              : <BsPersonXFill size={16} />}
                            {todayRecord?.status || "Absent"}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Clock In</div>
                            <div className="text-lg font-extrabold text-slate-800">
                              {todayRecord?.clockIn ? new Date(todayRecord.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                            </div>
                          </div>
                          <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50">
                            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Clock Out</div>
                            <div className="text-lg font-extrabold text-slate-800">
                              {todayRecord?.clockOut ? new Date(todayRecord.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Attendance History */}
                    <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-blue-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h4 className="font-bold text-slate-800 text-sm">Attendance History</h4>
                        <div className="flex items-center gap-2">
                          <select
                            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(Number(e.target.value))}
                          >
                            {monthsList.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                          </select>
                          <select
                            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={selectedYear}
                            onChange={e => setSelectedYear(Number(e.target.value))}
                          >
                            {[2024,2025,2026,2027,2028].map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </div>
                      </div>

                      {(() => {
                        const filtered = attendanceList.filter(r => {
                          if (!r.date) return false;
                          const d = new Date(r.date);
                          return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
                        });

                        const year = selectedYear;
                        const monthNum = selectedMonth;
                        const firstDay = new Date(year, monthNum, 1);
                        const lastDay = new Date(year, monthNum + 1, 0);
                        const daysInMonth = lastDay.getDate();

                        const attendanceMap = {};
                        attendanceList.forEach((record) => {
                          if (record?.date) {
                            const date = new Date(record.date);
                            if (date.getFullYear() === year && date.getMonth() === monthNum) {
                              const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                              if (!attendanceMap[dateKey]) {
                                attendanceMap[dateKey] = [];
                              }
                              attendanceMap[dateKey].push(record);
                            }
                          }
                        });

                        const getAttendanceStatus = (dayRecords) => {
                          if (!dayRecords || dayRecords.length === 0) return null;
                          return dayRecords[0]?.status || "Present";
                        };

                        const getStatusColor = (status) => {
                          switch (status?.toLowerCase()) {
                            case "present":
                              return "bg-gradient-to-br from-emerald-50/60 to-emerald-100/40 border-emerald-200 text-emerald-900";
                            case "grace present":
                            case "grace":
                              return "bg-gradient-to-br from-blue-50/60 to-blue-100/40 border-blue-200 text-blue-900";
                            case "late":
                              return "bg-gradient-to-br from-orange-50/60 to-orange-100/40 border-orange-200 text-orange-950";
                            case "half day":
                              return "bg-gradient-to-br from-yellow-50/60 to-yellow-100/40 border-yellow-200 text-yellow-950";
                            case "holiday":
                            case "holidays":
                              return "bg-gradient-to-br from-purple-50/60 to-purple-100/40 border-purple-200 text-purple-900";
                            case "sunday":
                              return "bg-gradient-to-br from-pink-50/60 to-pink-100/40 border-pink-200 text-pink-900";
                            case "sunday working":
                              return "bg-gradient-to-br from-red-50/60 to-red-100/40 border-red-300 text-red-950";
                            case "absent":
                              return "bg-gradient-to-br from-rose-50/60 to-rose-100/40 border-rose-200 text-rose-900";
                            case "cl":
                            case "casual leave":
                              return "bg-gradient-to-br from-slate-100/60 to-slate-200/40 border-slate-300 text-slate-900";
                            default:
                              return "bg-slate-50/40 border-slate-100/70 text-slate-400";
                          }
                        };

                        const getStatusBadgeColor = (status) => {
                          switch (status?.toLowerCase()) {
                            case "present":
                              return "bg-emerald-500 text-white";
                            case "grace present":
                            case "grace":
                              return "bg-blue-500 text-white";
                            case "late":
                              return "bg-orange-500 text-white";
                            case "half day":
                              return "bg-yellow-500 text-white";
                            case "holiday":
                            case "holidays":
                              return "bg-purple-500 text-white";
                            case "sunday":
                              return "bg-pink-500 text-white";
                            case "sunday working":
                              return "bg-red-700 text-white";
                            case "absent":
                              return "bg-rose-500 text-white";
                            case "cl":
                            case "casual leave":
                              return "bg-slate-800 text-white";
                            default:
                              return "bg-slate-400 text-white";
                          }
                        };

                        const days = [];
                        for (let i = 1; i <= daysInMonth; i++) {
                          const dateKey = `${year}-${monthNum}-${i}`;
                          const dayRecords = attendanceMap[dateKey];
                          const status = getAttendanceStatus(dayRecords);

                          const clockInTime = dayRecords && dayRecords.length > 0 && dayRecords[0]?.clockIn 
                            ? new Date(dayRecords[0].clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                            : "--:--";
                          const clockOutTime = dayRecords && dayRecords.length > 0 && dayRecords[0]?.clockOut 
                            ? new Date(dayRecords[0].clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                            : "--:--";

                          days.push(
                            <div
                              key={i}
                              className={`rounded-xl border p-4 text-center transition-all duration-300 hover:shadow-md hover:scale-[1.02] flex flex-col justify-between min-h-[108px] ${getStatusColor(status)}`}
                            >
                              <div className="flex items-center justify-between border-b border-slate-100/20 pb-1.5 mb-2">
                                <span className="text-sm font-extrabold text-slate-800">{i}</span>
                                <span className="text-[9px] font-bold text-slate-400">
                                  {new Date(year, monthNum, i).toLocaleDateString([], { weekday: 'short' })}
                                </span>
                              </div>

                              {dayRecords && dayRecords.length > 0 ? (
                                <div className="space-y-1 text-[10px] font-semibold text-slate-600">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-slate-400 text-[9px]">IN:</span>
                                    <span className={clockInTime === "--:--" ? "text-slate-300" : "text-slate-700 font-bold"}>
                                      {clockInTime}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-slate-400 text-[9px]">OUT:</span>
                                    <span className={clockOutTime === "--:--" ? "text-slate-300" : "text-slate-700 font-bold"}>
                                      {clockOutTime}
                                    </span>
                                  </div>
                                  <div className="mt-2 pt-1.5 border-t border-slate-100/10 flex justify-center">
                                    <span className={`inline-block px-1.5 py-0.5 rounded-full text-[8px] font-bold ${getStatusBadgeColor(status)}`}>
                                      {status}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="my-auto py-1 text-center">
                                  <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-400 border border-slate-200/50">
                                    No Data
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        }

                        return attendanceLoading ? (
                          <div className="py-16 text-center">
                            <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-xs text-slate-400 mt-3">Loading records…</p>
                          </div>
                        ) : (
                          <div className="p-6">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
                              {/* Day headers */}
                              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div
                                  key={day}
                                  className="hidden md:block rounded-xl bg-slate-50 border border-slate-100 py-2 text-center text-xs font-bold text-slate-500"
                                >
                                  {day}
                                </div>
                              ))}

                              {/* Empty offset cells */}
                              {Array.from({ length: firstDay.getDay() }).map((_, idx) => (
                                <div
                                  key={`empty-${idx}`}
                                  className="hidden md:block rounded-xl bg-slate-50/10 border border-dashed border-slate-100/50"
                                ></div>
                              ))}

                              {/* Calendar Days */}
                              {days}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* ── TASKS TAB ── */}
                {activeTab === "tasks" && (
                  <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    <div className="p-5 border-b border-blue-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                          <MdOutlineAssignmentTurnedIn className="text-blue-600" size={20} />
                          Tasks for {selectedMember.fullName}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{tasksList.length} tasks assigned</p>
                      </div>
                      <button
                        onClick={() => setShowAssignTaskModal(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-100 transition-all"
                      >
                        <FaPlus size={11} /> Assign Task
                      </button>
                    </div>

                    {tasksLoading ? (
                      <div className="py-20 text-center">
                        <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-xs text-slate-400 mt-3">Loading tasks…</p>
                      </div>
                    ) : tasksList.length === 0 ? (
                      <div className="py-20 text-center">
                        <FaTasks size={32} className="text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-semibold text-sm">No tasks assigned yet.</p>
                        <p className="text-slate-300 text-xs mt-1">Click "Assign Task" to get started.</p>
                      </div>
                    ) : (
                        <div className="overflow-x-hidden">
                          {/* Desktop Table */}
                          <table className="hidden md:table w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50/80 border-b border-blue-50">
                                <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Task</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Priority</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Due Date</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Status</th>
                                <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50/50">
                              {tasksList.map(task => (
                                <React.Fragment key={task._id}>
                                  <tr 
                                    onClick={() => setExpandedTaskId(prev => prev === task._id ? null : task._id)}
                                    className="hover:bg-blue-50/20 transition-colors group cursor-pointer"
                                  >
                                    <td className="px-5 py-4">
                                      <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                        {task.taskTitle}
                                        <span className="text-[9px] text-blue-500 font-extrabold uppercase bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                          {task.contentType === "numbers" ? "Numbers" : "Text"}
                                        </span>
                                      </div>
                                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{task.description || "No description"}</div>
                                    </td>
                                    <td className="px-5 py-4">
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${taskPriorityBadge(task.priority)}`}>
                                        {task.priority}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-600">
                                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-5 py-4">
                                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                                        task.taskStatus === "Completed" ? "text-emerald-600" :
                                        task.taskStatus === "In Progress" ? "text-blue-600" :
                                        "text-amber-600"
                                      }`}>
                                        {task.taskStatus === "Completed" && <FaCheckCircle size={11} />}
                                        {task.taskStatus === "In Progress" && <FaClock size={11} />}
                                        {task.taskStatus === "Pending" && <FaExclamationTriangle size={11} />}
                                        {task.taskStatus}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          onClick={() => setExpandedTaskId(prev => prev === task._id ? null : task._id)}
                                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                          title={expandedTaskId === task._id ? "Hide Details" : "View Details"}
                                        >
                                          <FaEye size={13} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                  {expandedTaskId === task._id && (
                                    <tr className="bg-slate-50/40">
                                      <td colSpan="5" className="px-5 py-4">
                                        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                                          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                                            <div>
                                              <h4 className="text-sm font-bold text-slate-800">Task Details</h4>
                                              <p className="text-[11px] text-slate-400 mt-0.5">
                                                {task.contentType === "numbers" ? "Numbers table progress" : "Full task description"}
                                              </p>
                                            </div>
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600 border border-blue-100/50">
                                              {task.contentType === "numbers" ? "Numbers Table" : "Text Description"}
                                            </span>
                                          </div>

                                          {task.contentType !== "numbers" ? (
                                            <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                                              {task.description || "No description provided."}
                                            </div>
                                          ) : (
                                            <div className="space-y-3">
                                              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                                                <table className="w-full text-left border-collapse min-w-[600px] bg-white">
                                                  <thead>
                                                    <tr className="bg-slate-50/80 border-b border-slate-200">
                                                      <th className="px-4 py-3 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Row</th>
                                                      <th className="px-4 py-3 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Column 1</th>
                                                      <th className="px-4 py-3 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Column 2</th>
                                                      <th className="px-4 py-3 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Column 3</th>
                                                      <th className="px-4 py-3 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Column 4</th>
                                                      <th className="px-4 py-3 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider min-w-[150px]">Call Status</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody className="divide-y divide-slate-100">
                                                    {getTaskNumberRows(task).map((row, rowIndex) => (
                                                      <tr key={rowIndex} className="hover:bg-slate-50/40 transition-colors">
                                                        <td className="px-4 py-2.5 text-xs text-slate-600 font-bold">{row.row || rowIndex + 1}</td>
                                                        {['col1','col2','col3','col4'].map((col) => {
                                                            const isPrefilled = isCellOriginallyPrefilled(task, rowIndex, col);
                                                            return (
                                                                <td key={col} className="px-4 py-2 text-sm border-l border-slate-100/50">
                                                                    <input
                                                                        type="text"
                                                                        value={row[col] || ""}
                                                                        onChange={(e) => {
                                                                            if (!isPrefilled) {
                                                                                handleNumberCellChange(task._id, rowIndex, col, e.target.value);
                                                                            }
                                                                        }}
                                                                        disabled={isPrefilled}
                                                                        className={`w-full px-2.5 py-1.5 text-[11px] font-medium rounded-lg outline-none transition-all ${isPrefilled ? 'bg-slate-50/70 text-slate-400 border border-transparent cursor-not-allowed' : 'bg-white text-slate-800 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'}`}
                                                                        placeholder={isPrefilled ? "Locked" : "Enter value"}
                                                                    />
                                                                </td>
                                                            );
                                                        })}
                                                        <td className="px-4 py-2 text-sm border-l border-slate-100/50">
                                                            <select
                                                                value={row.callStatus || ""}
                                                                onChange={(e) => handleNumberCellChange(task._id, rowIndex, "callStatus", e.target.value)}
                                                                disabled={row.callStatus === "Enquiry"}
                                                                className={`w-full px-2.5 py-1.5 text-[11px] font-bold rounded-lg outline-none transition-all ${
                                                                    row.callStatus === "Enquiry" ? "bg-amber-50 border border-amber-200 text-amber-700 cursor-not-allowed" : "bg-white text-slate-700 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                                }`}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <option value="">Select Status</option>
                                                                <option value="Connected">Connected</option>
                                                                <option value="Not Connected">Not Connected</option>
                                                                <option value="Interested">Interested</option>
                                                                <option value="Not Interested">Not Interested</option>
                                                                <option value="Busy">Busy</option>
                                                                <option value="Call Cut">Call Cut</option>
                                                                <option value="Call Back Later">Call Back Later</option>
                                                                <option value="Invalid Number">Invalid Number</option>
                                                                <option value="Language Issues">Language Issues</option>
                                                                <option value="Enquiry">Enquiry</option>
                                                                <option value="Connected on WhatsApp">Connected on WhatsApp</option>
                                                            </select>
                                                        </td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                                                  <button
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          saveTaskNumberData(task);
                                                      }}
                                                      disabled={savingTaskId === task._id}
                                                      className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                  >
                                                      {savingTaskId === task._id ? "Saving Data..." : "Save Table Data"}
                                                  </button>
                                                  <p className="text-[11px] text-slate-500 font-medium">Only empty cells are editable. Pre-filled values are locked.</p>
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

                          {/* Mobile Cards */}
                          <div className="md:hidden flex flex-col divide-y divide-blue-50/50">
                            {tasksList.map(task => (
                              <div key={task._id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div 
                                  onClick={() => setExpandedTaskId(prev => prev === task._id ? null : task._id)}
                                  className="cursor-pointer"
                                >
                                  <div className="flex justify-between items-start mb-2.5">
                                    <div className="flex-1 pr-3">
                                      <div className="font-bold text-slate-800 text-[13px] leading-tight mb-1">{task.taskTitle}</div>
                                      <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${taskPriorityBadge(task.priority)}`}>
                                          {task.priority} Priority
                                        </span>
                                        <span className="text-[9px] text-blue-500 font-extrabold uppercase bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                          {task.contentType === "numbers" ? "Numbers" : "Text"}
                                        </span>
                                      </div>
                                    </div>
                                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${
                                      task.taskStatus === "Completed" ? "bg-emerald-100 text-emerald-600" :
                                      task.taskStatus === "In Progress" ? "bg-blue-100 text-blue-600" :
                                      "bg-amber-100 text-amber-600"
                                    }`}>
                                      {task.taskStatus === "Completed" && <FaCheckCircle size={12} />}
                                      {task.taskStatus === "In Progress" && <FaClock size={12} />}
                                      {task.taskStatus === "Pending" && <FaExclamationTriangle size={12} />}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-3 text-xs">
                                    <div className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                                      <FaCalendarAlt size={10} className="text-slate-400" />
                                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] font-bold text-blue-600">{expandedTaskId === task._id ? "Hide Details" : "View Details"}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {expandedTaskId === task._id && (
                                  <div className="mt-3 pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-top-1">
                                    <div className="flex justify-between items-center mb-3">
                                      <span className="text-xs font-bold text-slate-700">Task Information</span>
                                    </div>
                                    {task.contentType !== "numbers" ? (
                                      <div className="text-[11px] text-slate-600 whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        {task.description || "No description provided."}
                                      </div>
                                    ) : (
                                      <div className="space-y-3">
                                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                                          <table className="w-full text-left border-collapse min-w-[800px] bg-white">
                                            <thead>
                                              <tr className="bg-slate-50/80 border-b border-slate-200">
                                                <th className="px-4 py-3 text-xs font-extrabold uppercase text-slate-500 tracking-wider w-16">Row</th>
                                                <th className="px-4 py-3 text-xs font-extrabold uppercase text-slate-500 tracking-wider">Column 1</th>
                                                <th className="px-4 py-3 text-xs font-extrabold uppercase text-slate-500 tracking-wider">Column 2</th>
                                                <th className="px-4 py-3 text-xs font-extrabold uppercase text-slate-500 tracking-wider">Column 3</th>
                                                <th className="px-4 py-3 text-xs font-extrabold uppercase text-slate-500 tracking-wider">Column 4</th>
                                                <th className="px-4 py-3 text-xs font-extrabold uppercase text-slate-500 tracking-wider min-w-[160px]">Call Status</th>
                                              </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                              {getTaskNumberRows(task).map((row, rowIndex) => (
                                                <tr key={rowIndex} className="hover:bg-slate-50/40 transition-colors">
                                                  <td className="px-4 py-3 text-sm text-slate-600 font-bold">{row.row || rowIndex + 1}</td>
                                                  {['col1','col2','col3','col4'].map((col) => {
                                                      const isPrefilled = isCellOriginallyPrefilled(task, rowIndex, col);
                                                      return (
                                                          <td key={col} className="px-4 py-2 border-l border-slate-100/50">
                                                              <input
                                                                  type="text"
                                                                  value={row[col] || ""}
                                                                  onChange={(e) => {
                                                                      if (!isPrefilled) {
                                                                          handleNumberCellChange(task._id, rowIndex, col, e.target.value);
                                                                      }
                                                                  }}
                                                                  disabled={isPrefilled}
                                                                  className={`w-full min-w-[130px] px-3 py-2 text-sm font-semibold rounded-lg outline-none transition-all ${isPrefilled ? 'bg-slate-50/70 text-slate-400 border border-transparent cursor-not-allowed' : 'bg-white text-slate-800 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'}`}
                                                                  placeholder={isPrefilled ? "Locked" : "Enter value"}
                                                              />
                                                          </td>
                                                      );
                                                  })}
                                                  <td className="px-4 py-2 border-l border-slate-100/50">
                                                      <select
                                                          value={row.callStatus || ""}
                                                          onChange={(e) => handleNumberCellChange(task._id, rowIndex, "callStatus", e.target.value)}
                                                          disabled={row.callStatus === "Enquiry"}
                                                          className={`w-full min-w-[160px] px-3 py-2 text-sm font-bold rounded-lg outline-none transition-all ${
                                                              row.callStatus === "Enquiry" ? "bg-amber-50 border border-amber-200 text-amber-700 cursor-not-allowed" : "bg-white text-slate-700 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                                          }`}
                                                          onClick={(e) => e.stopPropagation()}
                                                      >
                                                          <option value="">Select Status</option>
                                                          <option value="Connected">Connected</option>
                                                          <option value="Not Connected">Not Connected</option>
                                                          <option value="Interested">Interested</option>
                                                          <option value="Not Interested">Not Interested</option>
                                                          <option value="Busy">Busy</option>
                                                          <option value="Call Cut">Call Cut</option>
                                                          <option value="Call Back Later">Call Back Later</option>
                                                          <option value="Invalid Number">Invalid Number</option>
                                                          <option value="Language Issues">Language Issues</option>
                                                          <option value="Enquiry">Enquiry</option>
                                                          <option value="Connected on WhatsApp">Connected on WhatsApp</option>
                                                      </select>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    saveTaskNumberData(task);
                                                }}
                                                disabled={savingTaskId === task._id}
                                                className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-center"
                                            >
                                                {savingTaskId === task._id ? "Saving Data..." : "Save Table Data"}
                                            </button>
                                            <p className="text-[11px] text-slate-500 font-medium">Only empty cells are editable. Pre-filled values are locked.</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* No member selected */
              <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-8 sm:p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <HiUsers size={36} className="text-blue-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">Select a Team Member</h3>
                <p className="text-slate-400 text-sm mt-1.5 max-w-xs mx-auto">
                  Choose an employee from the members grid above to view their leads, attendance, and tasks.
                </p>
              </div>
            )}
          </div>
        </div>

      {/* ── MODAL: LEAD DETAILS ── */}
      {showLeadDetailsModal && selectedLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-blue-50 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-1">Lead Details</p>
                  <h3 className="text-xl font-extrabold text-white">{selectedLead.name || selectedLead.companyName || "Lead"}</h3>
                  <p className="text-xs text-blue-200 mt-1">{selectedLead.phone || selectedLead.companyPhone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(selectedLead.leadInterestStatus || selectedLead.leadStatus || "Cold")}`}>
                    {selectedLead.leadInterestStatus || selectedLead.leadStatus || "Cold"}
                  </span>
                  <button
                    onClick={() => setShowLeadDetailsModal(false)}
                    className="ml-2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">

              {/* Section helper */}
              {[
                {
                  title: "Contact Information", icon: <FaUserFriends className="text-blue-500" />,
                  fields: [
                    { label: "Full Name", value: selectedLead.name || selectedLead.companyName },
                    { label: "Phone", value: selectedLead.phone || selectedLead.companyPhone },
                    { label: "Email", value: selectedLead.email || selectedLead.companyEmail },
                    { label: "WhatsApp", value: selectedLead.whatsAppNo || selectedLead.companyWhatsApp },
                  ]
                },
                {
                  title: "Travel Information", icon: <FaMapMarkerAlt className="text-blue-500" />,
                  fields: [
                    { label: "Departure", value: selectedLead.departureCity },
                    { label: "Destination", value: selectedLead.destination },
                    { label: "Travel Date", value: selectedLead.expectedTravelDate ? new Date(selectedLead.expectedTravelDate).toLocaleDateString() : null },
                    { label: "No. of Days", value: selectedLead.noOfDays || selectedLead.customNoOfDays },
                    ...(selectedLead.placesToCover ? [{ label: "Places to Cover", value: selectedLead.placesToCover, full: true }] : [])
                  ]
                },
                {
                  title: "Passengers", icon: <FaUserFriends className="text-blue-500" />,
                  fields: [
                    { label: "Adults", value: selectedLead.noOfPerson || "0" },
                    { label: "Children", value: selectedLead.noOfChild || "0" },
                    { label: "Group No.", value: selectedLead.groupNumber || selectedLead.groupNo },
                  ]
                },
                {
                  title: "Lead Details", icon: <FaBriefcase className="text-blue-500" />,
                  fields: [
                    { label: "Source", value: selectedLead.leadSource },
                    { label: "Lead Type", value: selectedLead.leadType },
                    { label: "Trip Type", value: selectedLead.tripType },
                    { label: "Status", value: selectedLead.leadInterestStatus || selectedLead.leadStatus },
                    ...(selectedLead.notes ? [{ label: "Notes", value: selectedLead.notes, full: true }] : [])
                  ]
                }
              ].map(section => (
                <div key={section.title}>
                  <div className="flex items-center gap-2 mb-3">
                    {section.icon}
                    <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-widest">{section.title}</h4>
                  </div>
                  <div className="bg-slate-50/80 rounded-2xl border border-slate-100 p-4 grid grid-cols-2 gap-4">
                    {section.fields.map((f, i) => (
                      <div key={i} className={f.full ? "col-span-2" : ""}>
                        <div className="text-[9px] font-extrabold uppercase text-slate-400 tracking-widest">{f.label}</div>
                        <div className={`text-sm font-semibold text-slate-800 mt-0.5 ${f.full ? "text-xs whitespace-pre-wrap bg-white p-2.5 rounded-lg border border-slate-100 mt-1.5" : ""}`}>
                          {f.value || "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Messages */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FaCommentAlt className="text-blue-500" size={13} />
                  <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-widest">Activity & Messages</h4>
                </div>
                <div className="space-y-2 max-h-[180px] overflow-y-auto bg-slate-50 rounded-2xl border border-slate-100 p-3 mb-3">
                  {(!selectedLead.messages || selectedLead.messages.length === 0) ? (
                    <div className="text-center py-6 text-slate-300 text-xs font-medium">No messages yet.</div>
                  ) : selectedLead.messages.map((m, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-blue-600">{m.sender || "System"}</span>
                        <span className="text-[10px] text-slate-400">{new Date(m.sentAt).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-700">{m.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add feedback or instructions…"
                    className="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 bg-slate-50"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center transition-all shadow-sm shadow-blue-100"
                  >
                    <FaPaperPlane size={13} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ASSIGN TASK ── */}
      {showAssignTaskModal && selectedMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-blue-50">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">New Task</p>
                  <h3 className="text-lg font-extrabold text-white mt-0.5">Assign to {selectedMember.fullName}</h3>
                </div>
                <button
                  onClick={() => setShowAssignTaskModal(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            </div>

            <form onSubmit={handleAssignTask} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-1.5">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter task title…"
                  className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                  value={taskForm.taskTitle}
                  onChange={e => setTaskForm(prev => ({ ...prev, taskTitle: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-1.5">Description</label>
                <textarea
                  rows="3"
                  placeholder="Task details and instructions…"
                  className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 resize-none"
                  value={taskForm.description}
                  onChange={e => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-1.5">Priority</label>
                  <select
                    className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white font-semibold"
                    value={taskForm.priority}
                    onChange={e => setTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-1.5">Due Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={taskForm.dueDate}
                    onChange={e => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingTask}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-3.5 text-sm font-bold hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-100 transition-all disabled:opacity-50 mt-2"
              >
                {submittingTask ? "Assigning…" : "Assign Task"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyTeamDashboard;