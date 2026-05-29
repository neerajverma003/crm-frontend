import { BarChart3, Clock4, UserCheck, Users, TrendingUp, TrendingDown, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const getSourceBadgeColor = (source) => {
    const colors = {
      "LINKEDIN": "bg-blue-100 text-blue-700",
      "REFERRAL": "bg-green-100 text-green-700",
      "DIRECT SEARCH": "bg-purple-100 text-purple-700",
      "Website": "bg-indigo-100 text-indigo-700",
      "Cold Call": "bg-gray-100 text-gray-700",
      "Email Campaign": "bg-pink-100 text-pink-700",
    };
    return colors[source] || "bg-gray-100 text-gray-700";
};

const getEmployeeBadgeColor = (name) => {
    if (!name) return "bg-gray-100 text-gray-700";
    const colors = ["bg-blue-100 text-blue-700", "bg-green-100 text-green-700", "bg-cyan-100 text-cyan-700"];
    const index = name.length % colors.length;
    return colors[index];
};

const SuperAdminDashboard = () => {
    const navigate = useNavigate();

    const [lead, setLead] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(true);

    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loadingAttendance, setLoadingAttendance] = useState(true);

    const [employeeAttendance, setEmployeeAttendance] = useState([]);
    const [loadingEmployeeAttendance, setLoadingEmployeeAttendance] = useState(true);
    const [employeeAttendanceError, setEmployeeAttendanceError] = useState("");

    const [adminAttendance, setAdminAttendance] = useState([]);
    const [loadingAdminAttendance, setLoadingAdminAttendance] = useState(true);
    const [adminAttendanceError, setAdminAttendanceError] = useState("");

    const [companies, setCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [errorCompanies, setErrorCompanies] = useState("");

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const role = localStorage.getItem("role"); // Super admin | admin | employee

    // 🕒 Check Token Expiry
    const checkTokenExpiry = () => {
        const token = localStorage.getItem("token");
        const expiry = localStorage.getItem("tokenExpiry");

        if (!token || !expiry) return false;

        if (new Date().getTime() > Number(expiry)) {
            // Remove expired session data
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiry");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("role");
            localStorage.removeItem("companyId");
            return false;
        }
        return true;
    };

    // ------------------------------
    // Fetch Super Admin Attendance
    // ------------------------------
    useEffect(() => {
        const fetchAdminAttendance = async () => {
            setLoadingAdminAttendance(true);
            setAdminAttendanceError("");

            try {
                const dateParam = encodeURIComponent(selectedDate);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/adminAttendance/getAllAttendance?date=${dateParam}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch admin attendance");
                }

                setAdminAttendance(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching admin attendance:", error);
                setAdminAttendanceError(error.message || "Error fetching admin attendance");
                setAdminAttendance([]);
            } finally {
                setLoadingAdminAttendance(false);
            }
        };

        fetchAdminAttendance();
    }, [selectedDate]);

    // 🧩 Session Timeout Watcher
    useEffect(() => {
        if (!checkTokenExpiry()) {
            alert("Session expired. Please login again.");
            navigate("/");
        }

        const interval = setInterval(() => {
            if (!checkTokenExpiry()) {
                alert("Session expired. Please login again.");
                navigate("/");
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [navigate]);

    // 📊 Fetch All Employee Attendance (for list in widget)
    useEffect(() => {
        const fetchAttendance = async () => {
            setLoadingAttendance(true);
            setLoadingEmployeeAttendance(true);
            setEmployeeAttendanceError("");

            try {
                const dateParam = encodeURIComponent(selectedDate);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/attendance/getAllAttendance?date=${dateParam}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch employee attendance");
                }

                const attendance = Array.isArray(data) ? data : [];
                setAttendanceData(attendance);
                setEmployeeAttendance(attendance);
            } catch (err) {
                console.error("Error fetching attendance:", err);
                setEmployeeAttendanceError(err.message || "Error fetching employee attendance");
            } finally {
                setLoadingAttendance(false);
                setLoadingEmployeeAttendance(false);
            }
        };

        fetchAttendance();
    }, [selectedDate]);

    // 📈 Fetch Leads
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const [normalRes, empRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/leads/recentleads`),
                    fetch(`${import.meta.env.VITE_API_URL}/employeelead/all`)
                ]);
                const normalData = await normalRes.json();
                const empData = await empRes.json();

                const normalLeads = normalData.success ? normalData.data : [];
                const empLeads = empData.success ? empData.leads : [];

                const combinedLeads = [
                    ...normalLeads.map((l) => ({ ...l, type: "normal" })),
                    ...empLeads.map((l) => ({ ...l, type: "employee" })),
                ];

                combinedLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                // Keep only top 10 recent leads for the dashboard
                setLead(combinedLeads.slice(0, 10));
            } catch (err) {
                console.error("Error fetching leads:", err);
            } finally {
                setLoadingLeads(false);
            }
        };
        fetchLeads();
    }, []);

    // 🏢 Fetch Companies
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/company/all`);
                let allCompanies = response.data?.companies || [];

                // Filter by admin role
                if (role === "admin") {
                    const userId = localStorage.getItem("userId");
                    allCompanies = allCompanies.filter((company) => company.adminId === userId);
                }

                setCompanies(allCompanies);
            } catch (err) {
                console.error("Error fetching companies:", err);
                setErrorCompanies("Failed to load companies");
            } finally {
                setLoadingCompanies(false);
            }
        };
        fetchCompanies();
    }, [role]);

    // 🏢 Fetch Assigned Company for Admin
    useEffect(() => {
        const fetchAdminCompany = async () => {
            if (role === "admin") {
                try {
                    const adminId = localStorage.getItem("userId");
                    if (!adminId) return;

                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/getCompanyByAdminId/${adminId}`);
                    const data = res.data;
                    console.log(data)
                    if (data?.assignedCompanies?.length > 0) {
                        setCompanies(data.assignedCompanies);
                    } else {
                        setCompanies([]);
                    }
                } catch (err) {
                    console.error("Error fetching admin company:", err);
                    setErrorCompanies("Failed to load assigned company");
                } finally {
                    setLoadingCompanies(false);
                }
            }
        };

        fetchAdminCompany();
    }, [role]);


    // 📅 Filter Attendance by Selected Date
    useEffect(() => {
        const target = new Date(selectedDate);
        const filtered = attendanceData.filter((item) => {
            if (!item.date) return false;
            const itemDate = new Date(item.date);
            return (
                itemDate.getFullYear() === target.getFullYear() &&
                itemDate.getMonth() === target.getMonth() &&
                itemDate.getDate() === target.getDate()
            );
        });
        setFilteredData(filtered);
    }, [selectedDate, attendanceData]);

    // 🎨 Helper: Status Colors
    const getStatusColor = (status) => {
        if (!status) return "bg-gray-400";
        switch (status.toLowerCase()) {
            case "present":
            case "active":
                return "bg-green-500 hover:bg-green-600";
            case "absent":
                return "bg-red-500 hover:bg-red-600";
            case "late":
            case "warm":
                return "bg-yellow-500 hover:bg-yellow-600";
            case "hot":
                return "bg-red-500 hover:bg-red-600";
            case "cold":
            case "inactive":
                return "bg-gray-500 hover:bg-gray-600";
            default:
                return "bg-gray-500 hover:bg-gray-600";
        }
    };

    // 🕒 Helper: Format Time
    const formatTime = (isoString) => {
        if (!isoString) return "—";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const activeAdminAttendance = [...adminAttendance, ...employeeAttendance].filter((item) =>
        ["Present", "Grace Present", "Late", "Half Day"].includes(item.status)
    );

    // 📊 Dashboard Cards
    // const cards = [
    //     {
    //         title: "Total Leads",
    //         value: lead.length.toString(),
    //         percentage: "+12% from last month",
    //         icon: <Users className="h-5 w-5" />,
    //         trend: "up",
    //         color: "text-blue-600",
    //     },
    //     {
    //         title: "Total Users",
    //         value: "4",
    //         percentage: "+8% from last month",
    //         icon: <UserCheck className="h-5 w-5" />,
    //         trend: "up",
    //         color: "text-green-600",
    //     },
    //     {
    //         title: "Avg Time",
    //         value: "00:45",
    //         percentage: "-2% from last month",
    //         icon: <Clock4 className="h-5 w-5" />,
    //         trend: "down",
    //         color: "text-orange-600",
    //     },
    //     {
    //         title: "Conversions",
    //         value: "76",
    //         percentage: "+5% from last month",
    //         icon: <BarChart3 className="h-5 w-5" />,
    //         trend: "up",
    //         color: "text-purple-600",
    //     },
    // ];

  return (
      <div className="bg-[#f8fafc] min-h-dvh py-4 sm:px-6 lg:px-8">
          <div className="flex-1 bg-white px-4 py-6 md:px-8">
              {/* Dashboard Overview */}
              {/* <div className="mb-6">
                  <h2 className="text-sm px-3 font-semibold text-gray-500">Dashboard Overview</h2>
              </div> */}

              {/* Welcome Section */}
              <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Welcome back!</h1>
                  <p className="mt-1 text-gray-500">Here's an overview of your productivity today.</p>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Recent Leads */}
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
                      <div className="flex items-center justify-between border-b px-6 py-4">
                          <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                              <Users className="h-4 w-4 text-blue-600" />
                              Recent Leads
                          </h3>
                          <button
                              onClick={() => navigate("/lead-management")}
                              className="text-sm font-medium text-blue-600 hover:underline"
                          >
                              View All
                          </button>
                      </div>

                      <div className="max-h-[320px] overflow-y-auto overflow-x-auto p-0">
                          {loadingLeads ? (
                              <p className="text-center text-sm text-gray-500 py-6">Loading leads...</p>
                          ) : lead.length === 0 ? (
                              <p className="text-center text-sm text-gray-500 py-6">No leads found</p>
                          ) : (
                              <>
                                  {/* Desktop Table View */}
                                  <table className="hidden sm:table w-full min-w-[650px] divide-y divide-gray-200 text-sm">
                                      <thead className="bg-gray-50 sticky top-0 z-10">
                                          <tr>
                                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Contact Information</th>
                                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Group</th>
                                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Destination</th>
                                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Source</th>
                                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Employee</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100 bg-white">
                                          {lead.map((item) => {
                                              const leadName = item.name || "—";
                                              return (
                                                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                                                      <td className="px-4 py-3">
                                                          <div className="flex flex-col">
                                                              <span className="font-semibold text-gray-900">{leadName}</span>
                                                              <span className="text-xs text-gray-500">{item.email || "—"}</span>
                                                              <span className="text-xs text-gray-400">{item.phone || "—"}</span>
                                                          </div>
                                                      </td>
                                                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.groupNumber || "—"}</td>
                                                      <td className="px-4 py-3 text-sm text-gray-700">{item.destination || "—"}</td>
                                                      <td className="px-4 py-3">
                                                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getSourceBadgeColor(item.leadSource)}`}>
                                                              {item.leadSource || "—"}
                                                          </span>
                                                      </td>
                                                      <td className="px-4 py-3 text-sm text-gray-500">
                                                          {item.type === "employee" && item.employee?.fullName ? (
                                                              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getEmployeeBadgeColor(item.employee.fullName)}`}>
                                                                  {item.employee.fullName}
                                                              </span>
                                                          ) : (
                                                              "—"
                                                          )}
                                                      </td>
                                                  </tr>
                                              );
                                          })}
                                      </tbody>
                                  </table>

                                  {/* Mobile Card View */}
                                  <div className="sm:hidden flex flex-col gap-3 p-4">
                                      {lead.map((item) => {
                                          const leadName = item.name || "—";
                                          return (
                                              <div key={item._id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3">
                                                  <div className="flex justify-between items-start">
                                                      <div className="flex flex-col">
                                                          <span className="font-bold text-gray-900 text-base">{leadName}</span>
                                                          <span className="text-xs text-gray-500">{item.email || "—"}</span>
                                                          <span className="text-xs text-gray-400">{item.phone || "—"}</span>
                                                      </div>
                                                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getSourceBadgeColor(item.leadSource)}`}>
                                                          {item.leadSource || "—"}
                                                      </span>
                                                  </div>
                                                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-1 border-t border-gray-100 pt-3">
                                                      <div>
                                                          <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Group</span>
                                                          <span className="font-medium text-gray-800 text-sm">{item.groupNumber || "—"}</span>
                                                      </div>
                                                      <div>
                                                          <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Destination</span>
                                                          <span className="text-sm text-gray-700">{item.destination || "—"}</span>
                                                      </div>
                                                      <div className="col-span-2 mt-1">
                                                          <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Assigned Employee</span>
                                                          {item.type === "employee" && item.employee?.fullName ? (
                                                              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getEmployeeBadgeColor(item.employee.fullName)}`}>
                                                                  {item.employee.fullName}
                                                              </span>
                                                          ) : (
                                                              <span className="text-gray-700 text-sm">—</span>
                                                          )}
                                                      </div>
                                                  </div>
                                              </div>
                                          );
                                      })}
                                  </div>
                              </>
                          )}
                      </div>
                  </div>

                  {/* Attendance */}
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b px-6 py-4">
                      <div className="min-w-0">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                          <UserCheck className="h-6 w-6 text-green-600 shrink-0" />
                          <span className="truncate">Attendance</span>
                        </h3>
                        <p className="mt-1 text-sm font-medium text-gray-600 whitespace-nowrap">Record for {selectedDate}</p>
                      </div>
                      <div className="shrink-0">
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div className="p-4">
                      {loadingAdminAttendance || loadingEmployeeAttendance ? (
                        <div className="flex items-center justify-center p-8 text-sm text-gray-500">Loading attendance...</div>
                      ) : adminAttendanceError || employeeAttendanceError ? (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                          {adminAttendanceError || employeeAttendanceError}
                        </div>
                      ) : activeAdminAttendance.length === 0 ? (
                        <div className="text-center text-sm text-gray-500">No active attendance records found for {selectedDate}.</div>
                      ) : (
                        <div className="max-h-72 overflow-y-auto overflow-x-auto rounded-lg border border-gray-100 ring-1 ring-gray-50">
                          <>
                            {/* Desktop Table View */}
                            <table className="hidden sm:table w-full min-w-[450px] divide-y divide-gray-200 text-sm">
                              <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Name</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Check-in</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Check-out</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 bg-white">
                                {activeAdminAttendance.map((item) => {
                                  const name = item.admin?.fullName || item.employee?.fullName || "Unknown";

                                  const statusColor =
                                    item.status === "Present"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : item.status === "Late"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : item.status === "Absent"
                                          ? "bg-rose-100 text-rose-700"
                                          : "bg-gray-100 text-gray-700";

                                  return (
                                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                            {name.charAt(0)}
                                          </div>
                                          <span className="font-medium text-gray-900">{name}</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor}`}>
                                          {item.status || "—"}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-gray-600">{formatTime(item.clockIn)}</td>
                                      <td className="px-4 py-3 text-gray-600">{formatTime(item.clockOut)}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>

                            {/* Mobile Card View */}
                            <div className="sm:hidden flex flex-col gap-3 p-4">
                                {activeAdminAttendance.map((item) => {
                                  const name = item.admin?.fullName || item.employee?.fullName || "Unknown";

                                  const statusColor =
                                    item.status === "Present"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : item.status === "Late"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : item.status === "Absent"
                                          ? "bg-rose-100 text-rose-700"
                                          : "bg-gray-100 text-gray-700";

                                  return (
                                    <div key={item._id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3">
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                            {name.charAt(0)}
                                          </div>
                                          <span className="font-bold text-gray-900 text-base">{name}</span>
                                        </div>
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor}`}>
                                          {item.status || "—"}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 mt-2 border-t border-gray-100 pt-3">
                                        <div>
                                          <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Check-in</span>
                                          <span className="text-sm font-medium text-gray-800">{formatTime(item.clockIn)}</span>
                                        </div>
                                        <div>
                                          <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Check-out</span>
                                          <span className="text-sm font-medium text-gray-800">{formatTime(item.clockOut)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </>
                        </div>
                      )}
                    </div>
                  </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-10">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">⚡ Quick Actions</h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <button
                          onClick={() => navigate("/lead-management")}
                          className="flex h-24 flex-col items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow transition hover:scale-105"
                      >
                          <UserPlus className="mb-2" />
                          Add New Lead
                      </button>
                      {/* Clock In/Out */}
                      <button
                          onClick={() => navigate("/attendance")}
                          className="flex h-24 transform flex-col items-center justify-center rounded-lg border-2 border-gray-200 transition-all duration-200 hover:scale-105 hover:border-green-300 hover:bg-green-50"
                      >
                          <Clock4 className="mb-2 h-6 w-6 text-gray-600" />
                          <span className="font-semibold text-gray-700">Clock In/Out</span>
                      </button>

                      {/* Add User (Admin Only) */}
                      {(role === "admin" || role === "superAdmin") && (
                          <button
                              onClick={() => navigate("/user-management")}
                              className="flex h-24 transform flex-col items-center justify-center rounded-lg border-2 border-gray-200 transition-all duration-200 hover:scale-105 hover:border-indigo-300 hover:bg-indigo-50"
                          >
                              <UserPlus className="mb-2 h-6 w-6 text-gray-600" />
                              <span className="font-semibold text-gray-700">Add User</span>
                          </button>
                      )}
                  </div>
              </div>
          </div>
      </div>
  );

};

export default SuperAdminDashboard;