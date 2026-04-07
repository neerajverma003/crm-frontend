// import { BarChart3, Clock4, UserCheck, Users, TrendingUp, TrendingDown, UserPlus } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const SuperAdminDashboard = () => {
//     const navigate = useNavigate();

//     const [lead, setLead] = useState([]);
//     const [loadingLeads, setLoadingLeads] = useState(true);

//     const [attendanceData, setAttendanceData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [loadingAttendance, setLoadingAttendance] = useState(true);

//     const [companies, setCompanies] = useState([]);
//     const [loadingCompanies, setLoadingCompanies] = useState(true);
//     const [errorCompanies, setErrorCompanies] = useState("");

//     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

//     const role = localStorage.getItem("role"); // Super admin | admin | employee

//     // 🕒 Check Token Expiry
//     const checkTokenExpiry = () => {
//         const token = localStorage.getItem("token");
//         const expiry = localStorage.getItem("tokenExpiry");

//         if (!token || !expiry) return false;

//         if (new Date().getTime() > Number(expiry)) {
//             // Remove expired session data
//             localStorage.removeItem("token");
//             localStorage.removeItem("tokenExpiry");
//             localStorage.removeItem("userId");
//             localStorage.removeItem("userName");
//             localStorage.removeItem("role");
//             localStorage.removeItem("companyId");
//             return false;
//         }
//         return true;
//     };

//     // 🧩 Session Timeout Watcher
//     useEffect(() => {
//         if (!checkTokenExpiry()) {
//             alert("Session expired. Please login again.");
//             navigate("/");
//         }

//         const interval = setInterval(() => {
//             if (!checkTokenExpiry()) {
//                 alert("Session expired. Please login again.");
//                 navigate("/");
//             }
//         }, 5000);

//         return () => clearInterval(interval);
//     }, [navigate]);

//     // 📊 Fetch Attendance
//     useEffect(() => {
//         const fetchAttendance = async () => {
//             try {
//                 const res = await fetch("http://localhost:4000/attendance/getAllAttendance");
//                 const data = await res.json();
//                 console.log("Fetched attendance data:", data);

//                 const attendance = Array.isArray(data) ? data : data.data || [];
//                 const userId = localStorage.getItem("userId");

//                 // Filter by logged-in user
//                 const userAttendance = attendance.filter((item) => item.employee?._id === userId);

//                 setAttendanceData(userAttendance);
//             } catch (err) {
//                 console.error("Error fetching attendance:", err);
//             } finally {
//                 setLoadingAttendance(false);
//             }
//         };

//         fetchAttendance();
//     }, []);

//     // 📈 Fetch Leads
//     useEffect(() => {
//         const fetchLeads = async () => {
//             try {
//                 const res = await fetch("http://localhost:4000/leads/");
//                 const data = await res.json();
//                 const leadData = Array.isArray(data) ? data : data.data || [];
//                 setLead(leadData);
//             } catch (err) {
//                 console.error("Error fetching leads:", err);
//             } finally {
//                 setLoadingLeads(false);
//             }
//         };
//         fetchLeads();
//     }, []);

//     // 🏢 Fetch Companies
//     useEffect(() => {
//         const fetchCompanies = async () => {
//             try {
//                 const response = await axios.get("http://localhost:4000/company/all");
//                 let allCompanies = response.data?.companies || [];

//                 // Filter by admin role
//                 if (role === "admin") {
//                     const userId = localStorage.getItem("userId");
//                     allCompanies = allCompanies.filter((company) => company.adminId === userId);
//                 }

//                 setCompanies(allCompanies);
//             } catch (err) {
//                 console.error("Error fetching companies:", err);
//                 setErrorCompanies("Failed to load companies");
//             } finally {
//                 setLoadingCompanies(false);
//             }
//         };
//         fetchCompanies();
//     }, [role]);

//     // 🏢 Fetch Assigned Company for Admin
//     useEffect(() => {
//         const fetchAdminCompany = async () => {
//             if (role === "admin") {
//                 try {
//                     const adminId = localStorage.getItem("userId");
//                     if (!adminId) return;

//                     const res = await axios.get(`http://localhost:4000/getCompanyByAdminId/${adminId}`);
//                     const data = res.data;
//                     console.log(data)
//                     if (data?.assignedCompanies?.length > 0) {
//                         setCompanies(data.assignedCompanies);
//                     } else {
//                         setCompanies([]);
//                     }
//                 } catch (err) {
//                     console.error("Error fetching admin company:", err);
//                     setErrorCompanies("Failed to load assigned company");
//                 } finally {
//                     setLoadingCompanies(false);
//                 }
//             }
//         };

//         fetchAdminCompany();
//     }, [role]);


//     // 📅 Filter Attendance by Selected Date
//     useEffect(() => {
//         const target = new Date(selectedDate);
//         const filtered = attendanceData.filter((item) => {
//             if (!item.date) return false;
//             const itemDate = new Date(item.date);
//             return (
//                 itemDate.getFullYear() === target.getFullYear() &&
//                 itemDate.getMonth() === target.getMonth() &&
//                 itemDate.getDate() === target.getDate()
//             );
//         });
//         setFilteredData(filtered);
//     }, [selectedDate, attendanceData]);

//     // 🎨 Helper: Status Colors
//     const getStatusColor = (status) => {
//         if (!status) return "bg-gray-400";
//         switch (status.toLowerCase()) {
//             case "present":
//             case "active":
//                 return "bg-green-500 hover:bg-green-600";
//             case "absent":
//                 return "bg-red-500 hover:bg-red-600";
//             case "late":
//             case "warm":
//                 return "bg-yellow-500 hover:bg-yellow-600";
//             case "hot":
//                 return "bg-red-500 hover:bg-red-600";
//             case "cold":
//             case "inactive":
//                 return "bg-gray-500 hover:bg-gray-600";
//             default:
//                 return "bg-gray-500 hover:bg-gray-600";
//         }
//     };

//     // 🕒 Helper: Format Time
//     const formatTime = (isoString) => {
//         if (!isoString) return "—";
//         const date = new Date(isoString);
//         return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     };

//     // 📊 Dashboard Cards
//     // const cards = [
//     //     {
//     //         title: "Total Leads",
//     //         value: lead.length.toString(),
//     //         percentage: "+12% from last month",
//     //         icon: <Users className="h-5 w-5" />,
//     //         trend: "up",
//     //         color: "text-blue-600",
//     //     },
//     //     {
//     //         title: "Total Users",
//     //         value: "4",
//     //         percentage: "+8% from last month",
//     //         icon: <UserCheck className="h-5 w-5" />,
//     //         trend: "up",
//     //         color: "text-green-600",
//     //     },
//     //     {
//     //         title: "Avg Time",
//     //         value: "00:45",
//     //         percentage: "-2% from last month",
//     //         icon: <Clock4 className="h-5 w-5" />,
//     //         trend: "down",
//     //         color: "text-orange-600",
//     //     },
//     //     {
//     //         title: "Conversions",
//     //         value: "76",
//     //         percentage: "+5% from last month",
//     //         icon: <BarChart3 className="h-5 w-5" />,
//     //         trend: "up",
//     //         color: "text-purple-600",
//     //     },
//     // ];

//     return (
//   <div className="flex-1 bg-[#f8fafc] px-4 py-6 md:px-8">

//     {/* Dashboard Overview */}
//     <div className="mb-6">
//       <h2 className="text-sm font-semibold text-gray-500">
//         Dashboard Overview
//       </h2>
//     </div>

//     {/* Welcome Section */}
//     <div className="mb-8">
//       <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//         Welcome back!
//       </h1>
//       <p className="mt-1 text-gray-500">
//         Here's an overview of your productivity today.
//       </p>
//     </div>

//     {/* Main Content */}
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//       {/* Recent Leads */}
//       <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
//         <div className="flex items-center justify-between px-6 py-4 border-b">
//           <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//             <Users className="h-4 w-4 text-blue-600" />
//             Recent Leads
//           </h3>
//           <button
//             onClick={() => navigate("/lead-management")}
//             className="text-sm font-medium text-blue-600 hover:underline"
//           >
//             View All
//           </button>
//         </div>

//         <div className="p-6 space-y-4 max-h-[320px] overflow-y-auto">
//   {loadingLeads ? (
//     <p className="text-center text-sm text-gray-500">Loading leads...</p>
//   ) : lead.length === 0 ? (
//     <p className="text-center text-sm text-gray-500">No leads found</p>
//   ) : (
//     lead.map((item) => (
//       <div
//         key={item._id}
//         className="flex items-center justify-between"
//       >
//         <div className="flex items-center gap-4">
//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white">
//             {item.name?.[0]?.toUpperCase()}
//           </div>
//           <div>
//             <p className="text-sm font-semibold text-gray-900">{item.name}</p>
//             <p className="text-xs text-gray-500">
//               {item.leadType || "Lead"}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <p className="text-sm font-semibold text-gray-900">
//             ₹ {item.value || "0"}
//           </p>
//           <span
//             className={`rounded-full px-3 py-1 text-xs font-semibold ${
//               item.leadStatus === "Hot"
//                 ? "bg-red-100 text-red-600"
//                 : item.leadStatus === "Warm"
//                 ? "bg-yellow-100 text-yellow-600"
//                 : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             {item.leadStatus}
//           </span>
//         </div>
//       </div>
//     ))
//   )}
// </div>

//       </div>

//       {/* Attendance */}
//       <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
//         <div className="flex items-center justify-between px-6 py-4 border-b">
//           <div>
//             <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//               <UserCheck className="h-4 w-4 text-green-600" />
//               Attendance
//             </h3>
//             <p className="text-xs text-gray-500">
//               Record for {selectedDate}
//             </p>
//           </div>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="text-sm border rounded-md px-2 py-1"
//           />
//         </div>

//         <div className="p-6 flex flex-col items-center">
//           <div className="h-28 w-28 rounded-full bg-green-100 flex items-center justify-center mb-4">
//             <UserCheck className="h-10 w-10 text-green-600" />
//           </div>

//           <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
//             PRESENT
//           </span>

//           {filteredData.length > 0 && (
//             <div className="flex gap-6">
//               <div className="text-center">
//                 <p className="text-xs text-gray-500">TIME IN</p>
//                 <p className="font-semibold text-gray-900">
//                   {formatTime(filteredData[0]?.clockIn)}
//                 </p>
//               </div>
//               <div className="text-center">
//                 <p className="text-xs text-gray-500">TIME OUT</p>
//                 <p className="font-semibold text-gray-900">
//                   {formatTime(filteredData[0]?.clockOut)}
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* Quick Actions */}
//     <div className="mt-10">
//       <h3 className="mb-4 font-semibold text-gray-900 flex items-center gap-2">
//         ⚡ Quick Actions
//       </h3>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         <button
//           onClick={() => navigate("/lead-management")}
//           className="h-24 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col items-center justify-center shadow hover:scale-105 transition"
//         >
//           <UserPlus className="mb-2" />
//           Add New Lead
//         </button>
//         {/* Clock In/Out */}
//                             <button
//                                 onClick={() => navigate("/attendance")}
//                                 className="flex h-24 transform flex-col items-center justify-center rounded-lg border-2 border-gray-200 transition-all duration-200 hover:scale-105 hover:border-green-300 hover:bg-green-50"
//                             >
//                                 <Clock4 className="mb-2 h-6 w-6 text-gray-600" />
//                                 <span className="font-semibold text-gray-700">Clock In/Out</span>
//                             </button>

//                             {/* Add User (Admin Only) */}
//                             {(role === "admin" || role === "superAdmin") && (
//                                 <button
//                                     onClick={() => navigate("/user-management")}
//                                     className="flex h-24 transform flex-col items-center justify-center rounded-lg border-2 border-gray-200 transition-all duration-200 hover:scale-105 hover:border-indigo-300 hover:bg-indigo-50"
//                                 >
//                                     <UserPlus className="mb-2 h-6 w-6 text-gray-600" />
//                                     <span className="font-semibold text-gray-700">Add User</span>
//                                 </button>
//                             )}

//       </div>
//     </div>
//   </div>
// );

// };

// export default SuperAdminDashboard;


import { BarChart3, Clock4, UserCheck, Users, TrendingUp, TrendingDown, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
                const res = await fetch(`http://localhost:4000/adminAttendance/getAllAttendance?date=${dateParam}`);
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
                const res = await fetch(`http://localhost:4000/attendance/getAllAttendance?date=${dateParam}`);
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
                const res = await fetch("http://localhost:4000/leads/recentleads");
                const data = await res.json();
                const leadData = Array.isArray(data) ? data : data.data || [];
                setLead(leadData);
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
                const response = await axios.get("http://localhost:4000/company/all");
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

                    const res = await axios.get(`http://localhost:4000/getCompanyByAdminId/${adminId}`);
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

                      <div className="max-h-[320px] space-y-4 overflow-y-auto p-6">
                          {loadingLeads ? (
                              <p className="text-center text-sm text-gray-500">Loading leads...</p>
                          ) : lead.length === 0 ? (
                              <p className="text-center text-sm text-gray-500">No leads found</p>
                          ) : (
                              lead.map((item) => (
                                  <div
                                      key={item._id}
                                      className="flex items-center justify-between"
                                  >
                                      <div className="flex items-center gap-4">
                                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white">
                                              {item.name?.[0]?.toUpperCase()}
                                          </div>
                                          <div>
                                              <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                              <p className="text-xs text-gray-500">{item.leadType || "Lead"}</p>
                                          </div>
                                      </div>

                                      <div className="flex items-center gap-4">
                                          <p className="text-sm font-semibold text-gray-900">₹ {item.value || "0"}</p>
                                          <span
                                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                  item.leadStatus === "Hot"
                                                      ? "bg-red-100 text-red-600"
                                                      : item.leadStatus === "Warm"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-gray-100 text-gray-600"
                                              }`}
                                          >
                                              {item.leadStatus}
                                          </span>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>

                  {/* Attendance */}
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl">
                    <div className="flex flex-col gap-3 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                          <UserCheck className="h-6 w-6 text-green-600" />
                          Attendance
                        </h3>
                        <p className="text-sm font-medium text-gray-600">Record for {selectedDate}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
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
                        <div className="max-h-72 overflow-y-auto overflow-x-hidden rounded-lg border border-gray-100 ring-1 ring-gray-50">
                          <table className="w-full table-fixed divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="w-3/10 px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Name</th>
                                <th className="w-1/5 px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Status</th>
                                <th className="w-1/5 px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Check-in</th>
                                <th className="w-1/5 px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">Check-out</th>
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
                                      : item.status === "Grace Present"
                                        ? "bg-blue-100 text-blue-700"
                                        : item.status === "Half Day"
                                          ? "bg-orange-100 text-orange-700"
                                          : "bg-gray-100 text-gray-700";

                                return (
                                  <tr key={item._id} className="hover:bg-blue-50">
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap">{name}</td>
                                    <td className="px-4 py-3 text-sm">
                                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor}`}>
                                        {item.status || "—"}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{formatTime(item.clockIn)}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{formatTime(item.clockOut)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
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