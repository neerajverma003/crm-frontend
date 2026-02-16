import React, { useEffect, useState } from "react";
import { Eye, Edit2, Trash2, X, Users, CheckCircle, XCircle, Download } from "lucide-react";
import axios from "axios";

const SalaryList = () => {
    const [data, setData] = useState({ active: [], inactive: [] });
    const [activeTab, setActiveTab] = useState("active");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("All");
    const [filterCompany, setFilterCompany] = useState("All");
    const [filterDepartment, setFilterDepartment] = useState("All");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [viewModal, setViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userSalaryData, setUserSalaryData] = useState(null);
    const [monthlyAttendance, setMonthlyAttendance] = useState({});
    const [monthSalaryData, setMonthSalaryData] = useState({});
    const [monthlyPaidSalaries, setMonthlyPaidSalaries] = useState([]);
    const [error, setError] = useState(null);
    const [editingSalaryId, setEditingSalaryId] = useState(null);
    const [editingStatus, setEditingStatus] = useState(null);
    const token = localStorage.getItem("token");

    console.log("🔍 SalaryList Component Mounted");

    /* -------------------------------------------------------------------------- */
    /* 🛠️ Helper Functions */
    /* -------------------------------------------------------------------------- */
    const getDepartmentName = (user) => {
        if (typeof user?.department === "string") {
            return user.department;
        }
        return user?.department?.dep || "N/A";
    };

    const getCompanyName = (user) => {
        if (typeof user?.company === "string") {
            return user.company;
        }
        return user?.company?.companyName || "N/A";
    };

    const formatCurrency = (amount) => {
        if (!amount) return "₹0.00";
        return `₹${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    /* -------------------------------------------------------------------------- */
    /* 📦 Fetch Employee & Admin Data (User Details) */
    /* -------------------------------------------------------------------------- */
    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("📡 Fetching admins and employees...");
            
            const [adminRes, employeeRes] = await Promise.all([
                axios.get("http://localhost:4000/getAdmins"),
                axios.get("http://localhost:4000/employee/allEmployee"),
            ]);

            console.log("✅ Admin Response:", adminRes?.data);
            console.log("✅ Employee Response:", employeeRes?.data);

            const adminData = adminRes?.data?.admins || adminRes?.data || [];
            const employeeData = employeeRes?.data?.employees || employeeRes?.data || [];

            console.log("📊 Parsed Data - Admins:", adminData.length, "Employees:", employeeData.length);

            // Enrich with type for easy identification
            const enrichedAdmins = adminData.map((admin) => ({
                ...admin,
                userType: "Admin",
                role: "Admin",
            }));

            const enrichedEmployees = employeeData.map((emp) => ({
                ...emp,
                userType: "Employee",
                role: emp?.designation || "Employee",
            }));

            // Combine all users
            const allUsers = [...enrichedAdmins, ...enrichedEmployees];

            // Separate active and inactive based on accountActive field
            const activeUsers = allUsers.filter((user) => user?.accountActive === true || user?.accountActive === "true");

            const inactiveUsers = allUsers.filter((user) => user?.accountActive === false || user?.accountActive === "false" || !user?.accountActive);

            console.log("✅ Active Users:", activeUsers.length, "Inactive Users:", inactiveUsers.length);

            setData({
                active: activeUsers,
                inactive: inactiveUsers,
            });

            // Fetch current month's working days only for ACTIVE users (lazy load)
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            
            const workingDaysMap = {};
            const monthSalaryMap = {};
            
            // Only fetch working days for active users
            for (const user of activeUsers) {
                try {
                    const res = await axios.get(`http://localhost:4000/salary/history?employeeId=${user._id}`);
                    const salaryData = res?.data?.data || res?.data || [];
                    
                    if (Array.isArray(salaryData) && salaryData.length > 0) {
                        const currentMonthSalary = salaryData.find(s => s.month === currentMonth && s.year === currentYear);
                        workingDaysMap[user._id] = currentMonthSalary?.workingDays || 0;
                        monthSalaryMap[user._id] = currentMonthSalary?.totalPayable || 0;
                    } else {
                        workingDaysMap[user._id] = 0;
                        monthSalaryMap[user._id] = 0;
                    }
                } catch (err) {
                    console.warn(`Could not fetch working days for user ${user._id}:`, err);
                    workingDaysMap[user._id] = 0;
                    monthSalaryMap[user._id] = 0;
                }
            }
            
            setMonthlyAttendance(workingDaysMap);
            setMonthSalaryData(monthSalaryMap);
            console.log("✅ Working Days Map:", workingDaysMap);
            console.log("✅ Month Salary Map:", monthSalaryMap);
        } catch (error) {
            console.error("⚠️ Error fetching data:", error);
            setError(error.message || "Failed to fetch data. Please check if the backend server is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    /* -------------------------------------------------------------------------- */
    /* 🔄 Refetch data when month/year filter changes */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
        if (data.active.length > 0) {
            refetchMonthlyData();
        }
    }, [selectedMonth, selectedYear]);

    /* -------------------------------------------------------------------------- */
    /* 🔄 Refetch Monthly Data for Selected Month/Year */
    /* -------------------------------------------------------------------------- */
    const refetchMonthlyData = async () => {
        try {
            console.log(`📡 Fetching data for ${selectedMonth} / ${selectedYear}...`);
            const activeUsers = data.active;
            
            const workingDaysMap = {};
            const monthSalaryMap = {};
            
            // Fetch salary data for selected month/year
            for (const user of activeUsers) {
                try {
                    const res = await axios.get(`http://localhost:4000/salary/history?employeeId=${user._id}`);
                    const salaryData = res?.data?.data || res?.data || [];
                    
                    if (Array.isArray(salaryData) && salaryData.length > 0) {
                        // Find data for selected month/year
                        const selectedMonthSalary = salaryData.find(s => s.month === selectedMonth && s.year === selectedYear);
                        workingDaysMap[user._id] = selectedMonthSalary?.workingDays || 0;
                        monthSalaryMap[user._id] = selectedMonthSalary?.totalPayable || 0;
                    } else {
                        workingDaysMap[user._id] = 0;
                        monthSalaryMap[user._id] = 0;
                    }
                } catch (err) {
                    console.warn(`Could not fetch data for user ${user._id}:`, err);
                    workingDaysMap[user._id] = 0;
                    monthSalaryMap[user._id] = 0;
                }
            }
            
            setMonthlyAttendance(workingDaysMap);
            setMonthSalaryData(monthSalaryMap);
            console.log("✅ Updated Working Days Map:", workingDaysMap);
            console.log("✅ Updated Month Salary Map:", monthSalaryMap);
        } catch (error) {
            console.error("⚠️ Error refetching monthly data:", error);
        }
    };

    /* -------------------------------------------------------------------------- */
    /* 🔍 Filter & Search Data */
    /* -------------------------------------------------------------------------- */
    const getFilteredData = () => {
        const dataToFilter = activeTab === "active" ? data.active : data.inactive;

        const filtered = dataToFilter
            .filter((user) => {
                const name = user?.fullName?.toLowerCase() || "";
                const email = user?.email?.toLowerCase() || "";
                const phone = user?.phone?.toLowerCase() || "";
                const q = searchQuery.toLowerCase();
                return name.includes(q) || email.includes(q) || phone.includes(q);
            })
            .filter((user) => filterRole === "All" || user?.userType === filterRole || user?.role === filterRole)
            .filter((user) => filterCompany === "All" || getCompanyName(user) === filterCompany)
            .filter((user) => filterDepartment === "All" || getDepartmentName(user) === filterDepartment);

        // Sort by role first (Admin on top), then by department in ascending order
        return filtered.sort((a, b) => {
            // First, sort by role: Admin comes first
            if (a.userType !== b.userType) {
                if (a.userType === "Admin") return -1;
                if (b.userType === "Admin") return 1;
            }
            // Then, sort by department in ascending order
            const deptA = getDepartmentName(a).toLowerCase();
            const deptB = getDepartmentName(b).toLowerCase();
            return deptA.localeCompare(deptB);
        });
    };

    // Extract unique companies and departments from data
    const getUniqueCompanies = () => {
        const companies = new Set();
        [...data.active, ...data.inactive].forEach((user) => {
            const company = getCompanyName(user);
            if (company && company !== "N/A") {
                companies.add(company);
            }
        });
        return Array.from(companies).sort();
    };

    const getUniqueDepartments = () => {
        const departments = new Set();
        [...data.active, ...data.inactive].forEach((user) => {
            const dept = getDepartmentName(user);
            if (dept && dept !== "N/A") {
                departments.add(dept);
            }
        });
        return Array.from(departments).sort();
    };

    const filteredData = getFilteredData();
    const totalActive = data.active.length;
    const totalInactive = data.inactive.length;

    /* -------------------------------------------------------------------------- */
    /* 👁️ View User Details Modal */
    /* -------------------------------------------------------------------------- */
    const handleViewClick = async (user) => {
        setSelectedUser(user);
        setMonthlyPaidSalaries([]);
        setUserSalaryData(null);
        
        try {
            // Fetch all salary history for this user using the correct endpoint
            const res = await axios.get(`http://localhost:4000/salary/history?employeeId=${user._id}`);
            console.log("📊 Full API Response:", res?.data);
            
            // The API returns { success: true, data: [...] }
            const salaryData = res?.data?.data || res?.data || [];
            console.log("📊 Extracted Salary Data:", salaryData);
            
            if (Array.isArray(salaryData)) {
                // Filter for "Paid", "Approved", and "Pending" salaries for display
                const filteredSalaries = salaryData.filter(s => {
                    console.log("🔍 Checking salary:", { id: s._id, status: s.status, month: s.month, year: s.year });
                    return ["Paid", "Approved", "Pending"].includes(s.status);
                });
                console.log("✅ Filtered Salaries Count:", filteredSalaries.length);
                console.log("✅ Filtered Salaries:", filteredSalaries);
                setMonthlyPaidSalaries(filteredSalaries);
                
                // Get latest/current salary data (can be any status)
                const latestSalary = salaryData[0] || null;
                console.log("💰 Latest Salary Data:", latestSalary);
                setUserSalaryData(latestSalary);
            } else if (salaryData) {
                // Single salary object returned
                console.log("💰 Single Salary Data:", salaryData);
                if (["Paid", "Approved", "Pending"].includes(salaryData.status)) {
                    setMonthlyPaidSalaries([salaryData]);
                }
                setUserSalaryData(salaryData);
            }
        } catch (error) {
            console.error("❌ Error fetching salary data:", error);
            setMonthlyPaidSalaries([]);
            setUserSalaryData(null);
        }
        setViewModal(true);
    };

    /* -------------------------------------------------------------------------- */
    /* 📥 Export Salary Data to CSV */
    /* -------------------------------------------------------------------------- */
    const handleExportData = () => {
        try {
            const dataToExport = getFilteredData();
            
            if (dataToExport.length === 0) {
                alert("No data to export");
                return;
            }

            // Get month name
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthName = monthNames[selectedMonth];

            // Prepare CSV headers
            const headers = ["#", "Full Name", "Email", "Phone", "Role", "Department", "Company", "Salary", "Current Month Salary", "Working Days"];
            
            // Prepare CSV rows
            const rows = dataToExport.map((user, index) => [
                index + 1,
                user?.fullName || "N/A",
                user?.email || "N/A",
                user?.phone || "N/A",
                user?.userType || "N/A",
                getDepartmentName(user),
                getCompanyName(user),
                user?.salary || 0,
                monthSalaryData[user._id] || 0,
                monthlyAttendance[user._id] || 0,
            ]);

            // Create CSV content with summary
            const csvContent = [
                `Salary Report - ${monthName} ${selectedYear}`,
                `Generated on: ${new Date().toLocaleString()}`,
                `Tab: ${activeTab === "active" ? "Active Users" : "Inactive Users"}`,
                "",
                headers.join(","),
                ...rows.map(row => 
                    row.map(cell => {
                        if (typeof cell === "string" && (cell.includes(",") || cell.includes('"'))) {
                            return `"${cell.replace(/"/g, '""')}"`;
                        }
                        return cell;
                    }).join(",")
                ),
                "",
                `Total Records: ${dataToExport.length}`,
            ].join("\n");

            // Create blob and download
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            
            const tabName = activeTab === "active" ? "Active" : "Inactive";
            link.setAttribute("href", url);
            link.setAttribute("download", `Salary_${monthName}_${selectedYear}_${tabName}_${new Date().toISOString().split("T")[0]}.csv`);
            link.style.visibility = "hidden";
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log("✅ Data exported successfully!");
        } catch (error) {
            console.error("❌ Error exporting data:", error);
            alert("Failed to export data");
        }
    };

    /* -------------------------------------------------------------------------- */
    /* 📊 Update Salary Status */
    /* -------------------------------------------------------------------------- */
    const handleStatusChange = async (salary, newStatus) => {
        try {
            console.log(`🔄 Updating salary ${salary._id} status from ${salary.status} to ${newStatus}`);
            
            // Call API to update on backend using the correct endpoint
            const res = await axios.patch(
                `http://localhost:4000/salary/${salary._id}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            
            console.log("✅ API Response:", res?.data);
            
            if (res?.data?.success) {
                // Update the salary in the list with the API response data
                const updatedSalaries = monthlyPaidSalaries.map(s =>
                    s._id === salary._id ? { ...s, status: newStatus, ...res?.data?.data } : s
                );
                setMonthlyPaidSalaries(updatedSalaries);
                
                // Also update the userSalaryData if it's the same salary
                if (userSalaryData?._id === salary._id) {
                    setUserSalaryData({ ...userSalaryData, status: newStatus, ...res?.data?.data });
                }
                
                console.log("✅ Salary status updated successfully in UI and database");
            }
            
            setEditingSalaryId(null);
            setEditingStatus(null);
        } catch (error) {
            console.error("❌ Error updating salary status:", error?.response?.data || error?.message);
            alert(`Error: ${error?.response?.data?.message || error?.message || "Failed to update salary status"}`);
            setEditingSalaryId(null);
            setEditingStatus(null);
        }
    };

    /* -------------------------------------------------------------------------- */
    /* 🧾 Table Row Component */
    /* -------------------------------------------------------------------------- */
    const TableRow = ({ user, index }) => {
        const name = user?.fullName || "N/A";
        const email = user?.email || "-";
        const phone = user?.phone || "-";
        const role = user?.userType || "Unknown";
        const department = getDepartmentName(user);
        const company = getCompanyName(user);
        const salary = user?.salary || 0;

        const roleColor = role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700";
        const statusColor = activeTab === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

        return (
            <tr
                key={user._id || index}
                className="border-b border-gray-200 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent"
            >
                <td className="px-4 py-3 font-medium text-gray-600">{index + 1}</td>

                {/* User Avatar + Name */}
                <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-sm font-semibold text-white">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{name}</p>
                            <p className="text-xs text-gray-500">{email}</p>
                        </div>
                    </div>
                </td>

                {/* Role Badge */}
                <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleColor}`}>{role}</span>
                </td>

                {/* Department */}
                <td className="px-4 py-3 text-sm text-gray-700">{department}</td>

                {/* Company */}
                <td className="px-4 py-3 text-sm font-medium text-gray-700">{company}</td>

                {/* Salary */}
                <td className="px-4 py-3 text-sm font-bold text-indigo-600">{formatCurrency(salary)}</td>

                {/* Current Month Salary */}
                <td className="px-4 py-3 text-sm font-bold text-green-600">{formatCurrency(monthSalaryData[user._id] || 0)}</td>

                {/* Working Days */}
                <td className="px-4 py-3">
                    <div className="flex items-center justify-center rounded-full bg-amber-100 px-4 py-2">
                        <span className="text-sm font-bold text-amber-700">{monthlyAttendance[user._id] || 0} days</span>
                    </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                    <button
                        onClick={() => handleViewClick(user)}
                        className="rounded-full bg-blue-100 p-2 text-blue-600 shadow-sm transition-colors duration-200 hover:bg-blue-200 hover:shadow-md"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                </td>
            </tr>
        );
    };

    /* -------------------------------------------------------------------------- */
    /* 🧾 Render */
    /* -------------------------------------------------------------------------- */
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
            {/* Header Section */}
            <div className="mb-8">
                <div className="mb-2 flex items-center gap-3">
                    <Users
                        size={32}
                        className="text-blue-600"
                    />
                    <h1 className="text-3xl font-bold text-gray-900">Salary Management</h1>
                </div>
                <p className="text-sm text-gray-600">Manage salaries for employees and administrators</p>
            </div>

            {/* Search & Filter Bar */}
            <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-md">
                <div className="flex flex-col gap-4">
                    {/* Search Row */}
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="w-full flex-1 sm:w-auto">
                            <input
                                type="search"
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setFilterRole("All");
                                setFilterCompany("All");
                                setFilterDepartment("All");
                            }}
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800"
                        >
                            Clear All
                        </button>
                    </div>
                    
                    {/* Filter Row */}
                    <div className="flex w-full flex-wrap gap-2">
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All">All Roles</option>
                            <option value="Admin">Admins</option>
                            <option value="Employee">Employees</option>
                        </select>
                        
                        <select
                            value={filterCompany}
                            onChange={(e) => setFilterCompany(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All">All Companies</option>
                            {getUniqueCompanies().map((company) => (
                                <option key={company} value={company}>{company}</option>
                            ))}
                        </select>
                        
                        <select
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All">All Departments</option>
                            {getUniqueDepartments().map((department) => (
                                <option key={department} value={department}>{department}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Modern Tab Navigation */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Tabs */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setActiveTab("active")}
                        className={`relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                            activeTab === "active"
                                ? "bg-emerald-50 text-emerald-600 shadow-md"
                                : "bg-white text-gray-600 hover:bg-gray-50 hover:shadow-sm"
                        }`}
                    >
                        <CheckCircle size={18} />
                        Active ({totalActive})
                        {activeTab === "active" && <span className="absolute -bottom-2 left-4 right-4 h-1 animate-pulse rounded-full bg-emerald-600" />}
                    </button>

                    <button
                        onClick={() => setActiveTab("inactive")}
                        className={`relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                            activeTab === "inactive" ? "bg-rose-50 text-rose-600 shadow-md" : "bg-white text-gray-600 hover:bg-gray-50 hover:shadow-sm"
                        }`}
                    >
                        <XCircle size={18} />
                        Inactive ({totalInactive})
                        {activeTab === "inactive" && <span className="absolute -bottom-2 left-4 right-4 h-1 animate-pulse rounded-full bg-rose-600" />}
                    </button>
                </div>

                {/* Right: Month, Year Filters & Export Button */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Month Dropdown */}
                    <div className="relative">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="appearance-none rounded-xl border-2 border-blue-400 bg-white px-5 py-2.5 pr-10 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="0">January</option>
                            <option value="1">February</option>
                            <option value="2">March</option>
                            <option value="3">April</option>
                            <option value="4">May</option>
                            <option value="5">June</option>
                            <option value="6">July</option>
                            <option value="7">August</option>
                            <option value="8">September</option>
                            <option value="9">October</option>
                            <option value="10">November</option>
                            <option value="11">December</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>

                    {/* Year Dropdown */}
                    <div className="relative">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="appearance-none rounded-xl border-2 border-blue-400 bg-white px-5 py-2.5 pr-10 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-blue-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            {[2024, 2025, 2026, 2027].map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>

                    {/* Export Button */}
                    <button
                        onClick={handleExportData}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95"
                        title={`Export ${activeTab} users for selected month/year`}
                    >
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Statistics Card */}
            <div className="mb-6">
                {activeTab === "active" ? (
                    <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-700">Total Active</p>
                                <p className="text-3xl font-bold text-emerald-600">{totalActive}</p>
                            </div>
                            <CheckCircle
                                size={40}
                                className="text-emerald-600 opacity-20"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-rose-700">Total Inactive</p>
                                <p className="text-3xl font-bold text-rose-600">{totalInactive}</p>
                            </div>
                            <XCircle
                                size={40}
                                className="text-rose-600 opacity-20"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Data Table */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        <p className="text-gray-600">Loading salary data...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-md">
                    <p className="text-lg font-semibold text-red-600">Error Loading Data</p>
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                    <button
                        onClick={() => fetchAllData()}
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-md">
                    <p className="text-lg text-gray-600">
                        No {activeTab} {filterRole !== "All" ? filterRole.toLowerCase() : ""} records found.
                    </p>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Desktop Table View */}
                    <div className="hidden overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg md:block">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-gray-700">
                                <thead className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <tr>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">#</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">User</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">Role</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">Department</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">Company</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">Salary</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">Current Month Salary</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">Working Days</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((user, index) => (
                                        <TableRow
                                            key={user._id || index}
                                            user={user}
                                            index={index + 1}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="space-y-3 md:hidden">
                        {filteredData.map((user, index) => {
                            const name = user?.fullName || "N/A";
                            const role = user?.userType || "Unknown";
                            const department = getDepartmentName(user);
                            const company = getCompanyName(user);
                            const salary = user?.salary || 0;

                            return (
                                <div
                                    key={user._id || index}
                                    className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                                >
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-3">
                                        <div className="flex min-w-0 flex-1 items-center gap-2">
                                            <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                {index + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
                                                <p className="truncate text-xs text-gray-600">{user?.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleViewClick(user)}
                                            className="flex-shrink-0 rounded-full bg-blue-100 p-1.5 text-blue-600 transition-colors hover:bg-blue-200"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </div>

                                    {/* Card Body */}
                                    <div className="space-y-2 p-3 text-xs">
                                        {/* Role & Status */}
                                        <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                                            <div>
                                                <p className="text-gray-600">Role</p>
                                                <p className="font-semibold text-gray-800">{role}</p>
                                            </div>
                                            <div
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                                            >
                                                {role}
                                            </div>
                                        </div>

                                        {/* Department & Company */}
                                        <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
                                            <div>
                                                <p className="text-gray-600">Department</p>
                                                <p className="truncate font-semibold text-gray-800">{department}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Company</p>
                                                <p className="truncate text-right font-semibold text-gray-800">{company}</p>
                                            </div>
                                        </div>

                                        {/* Salary & Working Days */}
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                            <div>
                                                <p className="text-gray-600">Salary</p>
                                                <p className="font-bold text-indigo-600">{formatCurrency(salary)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Working Days</p>
                                                <p className="rounded-full bg-amber-100 px-2 py-1 text-center text-xs font-semibold text-amber-700">
                                                    {monthlyAttendance[user._id] || 0} days
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewModal && selectedUser && (
                <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm duration-300 p-4 sm:p-6">
                    <div className="animate-in zoom-in relative w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl duration-300 md:max-w-4xl lg:max-w-5xl">
                        {/* Fixed Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-4 sm:px-6">
                            <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">💰 Salary Details</h2>
                            <button
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:bg-gray-200 hover:text-gray-600"
                                onClick={() => setViewModal(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="space-y-6 overflow-y-auto p-4 sm:p-6" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                            {/* User Information */}
                            <div>
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-700">
                                    <span className="inline-block h-1 w-4 rounded-full bg-blue-600"></span>
                                    User Information
                                </h3>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-xs font-semibold uppercase text-blue-600">Full Name</p>
                                        <p className="mt-2 truncate text-sm font-bold text-gray-900">{selectedUser?.fullName}</p>
                                    </div>
                                    <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-xs font-semibold uppercase text-purple-600">Email</p>
                                        <p className="mt-2 truncate text-sm font-bold text-gray-900">{selectedUser?.email}</p>
                                    </div>
                                    <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-xs font-semibold uppercase text-indigo-600">Role</p>
                                        <p className="mt-2 text-sm font-bold text-gray-900">{selectedUser?.userType}</p>
                                    </div>
                                    <div className="rounded-xl border border-pink-100 bg-gradient-to-br from-pink-50 to-pink-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-xs font-semibold uppercase text-pink-600">Department</p>
                                        <p className="mt-2 truncate text-sm font-bold text-gray-900">{getDepartmentName(selectedUser)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Salary Information */}
                            <div>
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-700">
                                    <span className="inline-block h-1 w-4 rounded-full bg-green-600"></span>
                                    Salary Information
                                </h3>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                                        <p className="text-xs font-semibold uppercase text-indigo-600">Base Salary</p>
                                        <p className="mt-2 text-lg font-bold text-indigo-700">{formatCurrency(selectedUser?.salary)}</p>
                                    </div>
                                    {userSalaryData && (
                                        <>
                                            <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4 shadow-sm hover:shadow-md hover:border-green-300 transition-all">
                                                <p className="text-xs font-semibold uppercase text-green-600">Total Payable</p>
                                                <p className="mt-2 text-lg font-bold text-green-700">{formatCurrency(userSalaryData?.totalPayable)}</p>
                                            </div>
                                            <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                                                <p className="text-xs font-semibold uppercase text-blue-600">Status</p>
                                                <p className="mt-2 text-lg font-bold text-blue-700 capitalize">{userSalaryData?.status || "Pending"}</p>
                                            </div>
                                            <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4 shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
                                                <p className="text-xs font-semibold uppercase text-purple-600">Working Days</p>
                                                <p className="mt-2 text-lg font-bold text-purple-700">{userSalaryData?.workingDays || 0} days</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Month-wise Paid Salary History */}
                            <div>
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-700">
                                    <span className="inline-block h-1 w-4 rounded-full bg-amber-600"></span>
                                    Salary History (Paid, Approved & Pending)
                                </h3>
                                {monthlyPaidSalaries && monthlyPaidSalaries.length > 0 ? (
                                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <div className="max-h-80 overflow-x-auto">
                                            <table className="w-full text-xs sm:text-sm">
                                                <thead className="sticky top-0 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-b-2 border-amber-200">
                                                    <tr>
                                                        <th className="px-3 py-3 text-left font-bold text-gray-700 sm:px-4">Month</th>
                                                        <th className="px-3 py-3 text-left font-bold text-gray-700 sm:px-4">Year</th>
                                                        <th className="px-3 py-3 text-center font-bold text-gray-700 sm:px-4">Working Days</th>
                                                        <th className="px-3 py-3 text-center font-bold text-gray-700 sm:px-4">Status</th>
                                                        <th className="px-3 py-3 text-right font-bold text-gray-700 sm:px-4">Paid Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {monthlyPaidSalaries.map((salary, idx) => (
                                                        <tr key={idx} className="transition-colors hover:bg-amber-50">
                                                            <td className="px-3 py-3 font-medium text-gray-800 sm:px-4">
                                                                {new Date(salary.year, salary.month, 1).toLocaleDateString("en-IN", { month: "short" })}
                                                            </td>
                                                            <td className="px-3 py-3 text-gray-700 font-bold sm:px-4">{salary.year}</td>
                                                            <td className="px-3 py-3 text-center sm:px-4">
                                                                <span className="inline-flex items-center justify-center rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                                                                    {salary.workingDays || 0} days
                                                                </span>
                                                            </td>
                                                            <td 
                                                                className="px-3 py-3 text-center sm:px-4 cursor-pointer relative"
                                                                onDoubleClick={() => {
                                                                    setEditingSalaryId(salary._id);
                                                                    setEditingStatus(salary.status);
                                                                }}
                                                            >
                                                                {editingSalaryId === salary._id ? (
                                                                    <div className="relative inline-block">
                                                                        <select
                                                                            value={editingStatus}
                                                                            onChange={(e) => {
                                                                                const newStatus = e.target.value;
                                                                                setEditingStatus(newStatus);
                                                                                handleStatusChange(salary, newStatus);
                                                                            }}
                                                                            onBlur={() => {
                                                                                setEditingSalaryId(null);
                                                                                setEditingStatus(null);
                                                                            }}
                                                                            className="rounded-lg border-2 border-blue-500 px-2 py-1 text-xs font-bold bg-white cursor-pointer focus:outline-none"
                                                                            autoFocus
                                                                        >
                                                                            <option value="Paid">Paid</option>
                                                                            <option value="Pending">Pending</option>
                                                                            <option value="Approved">Approved</option>
                                                                        </select>
                                                                    </div>
                                                                ) : (
                                                                    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold ${
                                                                        salary.status === "Paid" 
                                                                            ? "bg-green-100 text-green-700" 
                                                                            : salary.status === "Pending"
                                                                            ? "bg-yellow-100 text-yellow-700"
                                                                            : "bg-blue-100 text-blue-700"
                                                                    }`}>
                                                                        {salary.status || "Paid"}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-3 text-right sm:px-4">
                                                                <span className="inline-flex items-center justify-center rounded-lg bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                                                    {formatCurrency(salary.totalPayable)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 sm:px-4 text-xs text-gray-600 font-semibold">
                                            Total Records: {monthlyPaidSalaries.length}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                                        <p className="text-sm font-medium text-gray-600">📋 No salary history available yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 pt-4 sm:flex-row sm:justify-end">
                                <button
                                    onClick={() => setViewModal(false)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm active:scale-95 sm:w-auto"
                                >
                                    Close
                                </button>
                                <button
                                    className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 active:scale-95 sm:w-auto"
                                >
                                    ✏️ Edit Salary
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalaryList;