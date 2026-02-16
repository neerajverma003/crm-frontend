import React, { useState, useEffect } from "react";
import { ChartNoAxesCombined, Clock4, UserCheck, Users, LogIn, LogOut, Download, Calendar as CalendarIcon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Attendance from "../attendance/Attendence.jsx";
import EmployeeTable from "./EmployeeTable.jsx";
import SearchEmployes from "./SearchEmployes.jsx";
import { useNavigate } from "react-router-dom";

const MainAttendance = () => {
    const [userId, setUserId] = useState(null);
    const [companyId, setCompanyId] = useState(null);
    const [role, setRole] = useState("");
    const [loadingClock, setLoadingClock] = useState(false);
    const [todayRecord, setTodayRecord] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [time, setTime] = useState("00:00:00");
    const [elapsedTime, setElapsedTime] = useState("00:00:00");

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US");
    const navigate=useNavigate();

    /* -------------------------------------------------------------------------- */
    /* ✅ Load user data and role from localStorage */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedCompanyId = localStorage.getItem("companyId");
        const storedRole = localStorage.getItem("role");

        setUserId(storedUserId || null);
        setCompanyId(storedCompanyId || null);
        setRole(storedRole?.toLowerCase() || "");
    }, []);

    /* -------------------------------------------------------------------------- */
    /* ✅ Fetch Today’s Attendance */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
        if (!userId || !role) return;

        const fetchTodayAttendance = async () => {
            try {
                const url = role === "admin" ? `http://localhost:4000/adminAttendance/${userId}` : `http://localhost:4000/attendance/${userId}`;

                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch attendance");

                const data = await res.json();
                const records = data?.data || data;

                const todayRec = Array.isArray(records)
                    ? records.find((record) => {
                          const d = new Date(record.date);
                          return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
                      })
                    : null;

                setTodayRecord(todayRec || null);
            } catch (err) {
                console.error("Error fetching today's attendance:", err);
            }
        };

        fetchTodayAttendance();
    }, [userId, role, today]);

    /* -------------------------------------------------------------------------- */
    /* ✅ Handle Clock In / Clock Out */
    /* -------------------------------------------------------------------------- */
    const handleClockAction = async (type) => {
        if (loadingClock) return;

        // Get fresh values from localStorage in case they changed
        const freshUserId = userId || localStorage.getItem("userId");
        const freshCompanyId = companyId || localStorage.getItem("companyId");
        const freshRole = role || localStorage.getItem("role")?.toLowerCase();

        // Enhanced validation with detailed error messages
        if (!freshUserId) return toast.error("User ID not found. Please login again.");
        if (!freshCompanyId) return toast.error("Company ID not found. Please login again.");
        if (!freshRole) return toast.error("User role not found. Please login again.");

        const isAdmin = freshRole === "admin";
        const endpoint =
            type === "in"
                ? isAdmin
                    ? "adminAttendance/clockin"
                    : "attendance/clockin"
                : isAdmin
                  ? "adminAttendance/clockout"
                  : "attendance/clockout";

        // prevent duplicate actions
        if (type === "in" && todayRecord?.clockIn) return toast.warning("You have already clocked in today.");
        if (type === "out") {
            if (!todayRecord?.clockIn) return toast.warning("Clock in before clocking out.");
            if (todayRecord?.clockOut) return toast.warning("You have already clocked out today.");
        }

        try {
            setLoadingClock(true);
            const body = isAdmin ? { adminId: freshUserId, companyId: freshCompanyId } : { employeeId: freshUserId, companyId: freshCompanyId };

            // Debug logging for mobile issues
            console.log("📱 Clock Action Request:", {
                type,
                userId: freshUserId,
                companyId: freshCompanyId,
                isAdmin,
                body,
                endpoint,
                timestamp: new Date().toISOString(),
            });

            const res = await fetch(`http://localhost:4000/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            // Debug response
            console.log("📨 Clock Action Response:", {
                status: res.status,
                ok: res.ok,
                data,
            });

            if (!res.ok) {
                if (data.message?.includes("Sunday")) return toast.info("Today is Sunday — holiday, no attendance needed.");
                if (data.message?.includes("Already clocked")) return toast.warning("Already clocked for today.");
                if (data.message?.includes("not allowed before")) return toast.warning("Too early to clock in.");
                if (data.message?.includes("not allowed after")) return toast.error("Clock-in not allowed after.");

                return toast.error(data.message || "Clock action failed.");
            }

            toast.success(data.message || `Clock ${type === "in" ? "In" : "Out"} successful!`);

            const newRecord = data.record || data.attendance;
            setTodayRecord((prev) => ({
                ...prev,
                ...newRecord,
                [type === "in" ? "clockIn" : "clockOut"]: newRecord?.[type === "in" ? "clockIn" : "clockOut"] || new Date().toISOString(),
            }));
        } catch (err) {
            console.error("❌ Clock Action Error:", err);
            toast.error("Server error. Please try again.");
        } finally {
            setLoadingClock(false);
        }
    };

    /* -------------------------------------------------------------------------- */
    /* 🕒 Helper: Format Time */
    /* -------------------------------------------------------------------------- */
    const formatTime = (isoString) => {
        if (!isoString) return "--:--";
        const date = new Date(isoString);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    /* -------------------------------------------------------------------------- */
    /* ⏱ Current Time Timer (UI only) */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }),
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    /* -------------------------------------------------------------------------- */
    /* ⏱ Elapsed Time Timer (from Clock In until Clock Out or Current Time) */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
        if (!todayRecord?.clockIn) {
            setElapsedTime("00:00:00");
            return;
        }

        const interval = setInterval(() => {
            const clockInTime = new Date(todayRecord.clockIn).getTime();
            // If clocked out, calculate until clock out time, otherwise calculate until now
            const endTime = todayRecord?.clockOut ? new Date(todayRecord.clockOut).getTime() : new Date().getTime();
            const elapsed = Math.max(0, endTime - clockInTime);

            const hours = String(Math.floor(elapsed / 3600000)).padStart(2, "0");
            const minutes = String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, "0");
            const seconds = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, "0");

            setElapsedTime(`${hours}:${minutes}:${seconds}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [todayRecord?.clockIn, todayRecord?.clockOut]);

    /* -------------------------------------------------------------------------- */
    /* ✅ UI Layout */
    /* -------------------------------------------------------------------------- */
    return (
        <div className="flex w-full flex-col gap-6 rounded-xl bg-[#F9FAFB] px-3">
            <ToastContainer
                position="top-right"
                autoClose={3000}
            />

            {/* Stats Section + Attendance & Actions + Admin Overview - Combined White Card */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                {/* Stats Section */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { id: 1, title: "Total Employees", value: "89", subtitle: "Active employees", icon: <Users /> },
                        { id: 2, title: "Open Positions", value: "84", subtitle: "Positions to fill", icon: <UserCheck /> },
                        { id: 3, title: "On Leave", value: "5", subtitle: "Employees on leave", icon: <Clock4 /> },
                        { id: 4, title: "New Joins", value: "12", subtitle: "Joined this month", icon: <ChartNoAxesCombined /> },
                    ].map((item) => (
                        <div
                            key={item.id}
                            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                                <div className="h-7 w-7 text-gray-500">{item.icon}</div>
                            </div>
                            <div>
                                <div
                                    className={`text-left font-semibold ${
                                        item.value === "5" || item.value === "12"
                                            ? "text-red-500"
                                            : item.value === "84"
                                              ? "text-green-500"
                                              : "text-slate-700"
                                    }`}
                                >
                                    {item.value}
                                </div>
                                <div className="mt-1 text-left text-sm font-medium text-gray-500">{item.subtitle}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Attendance & Actions + Admin Overview Section */}
                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* LEFT CARD */}
                    <div className="w-full flex-shrink-0 rounded-2xl border bg-white p-4 shadow-sm sm:w-full sm:p-5 md:w-1/2 md:p-6 lg:w-80 xl:w-96">
                        {/* Header */}
                        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="mt-2 text-2xl font-bold sm:text-xl">Attendance</p>
                                <p className="mt-2 text-2xl text-gray-600 sm:text-base">Current Session</p>
                            </div>

                            {/* <input
                                type="date"
                                className="w-full rounded-md border px-3 py-2 text-base sm:w-auto"
                            /> */}
                        </div>

                        {/* Time Display */}
                        <div className="mb-2 flex flex-col gap-1">
                            <p className="text-xs font-medium text-gray-600">Time</p>
                            <p className="text-2xl font-bold text-gray-900">{time}</p>
                        </div>

                        {/* Elapsed Time Display */}
                        <div className="mb-4 flex flex-col gap-1">
                            <p className="text-xs font-medium text-gray-600">Elapsed Time</p>
                            <p className="text-lg font-bold text-blue-600">{elapsedTime}</p>
                        </div>

                        {/* Clock In/Out Times Display */}
                        <div className="mb-4 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-xs">
                                <span
                                    className={`rounded px-2 py-1 font-medium ${
                                        !todayRecord?.clockIn ? "bg-gray-50 text-gray-600" : "bg-blue-50 text-blue-700"
                                    }`}
                                >
                                    IN: {formatTime(todayRecord?.clockIn)}
                                </span>
                                <span
                                    className={`rounded px-2 py-1 font-medium ${
                                        !todayRecord?.clockOut ? "bg-gray-50 text-gray-600" : "bg-amber-50 text-amber-700"
                                    }`}
                                >
                                    OUT: {formatTime(todayRecord?.clockOut)}
                                </span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                            <button
                                onClick={() => handleClockAction("in")}
                                disabled={loadingClock}
                                className="w-full rounded-xl bg-gray-100 py-4 text-base font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50 sm:flex-1"
                            >
                                Clock In
                            </button>

                            <button
                                onClick={() => handleClockAction("out")}
                                disabled={loadingClock}
                                className="w-full rounded-xl bg-red-400 py-4 text-base font-semibold text-white hover:bg-red-500 disabled:opacity-50 sm:flex-1"
                            >
                                Clock Out
                            </button>
                            
                        </div>
                        <button
                                onClick={() => navigate('/leaves')}
                                className="w-full rounded-xl py-4 mt-4 text-base font-semibold text-black border-2 hover:bg-green-500 disabled:opacity-50 sm:flex-1"
                            >
                                Leave
                            </button>
                    </div>

                    {/* RIGHT SIDE (unchanged) */}
                    <div className="flex-1 rounded-lg border border-gray-200 bg-white p-6">
                        <Attendance />
                    </div>
                </div>

                {/* Admin only: Employee overview */}
                {role === "admin" && (
                    <div className="flex w-full flex-col gap-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                            <SearchEmployes setSearchText={setSearchText} />
                            <div className="flex items-center gap-2 text-gray-700">
                                <CalendarIcon
                                    size={20}
                                    className="text-gray-500"
                                />
                                <span className="text-sm">{formattedDate}</span>
                            </div>
                        </div>
                        <div className="w-full">
                            <EmployeeTable searchText={searchText} />
                        </div>
                    </div>
                )}
            </div>

            {/* Employee panel: personal attendance table - Separate White Card */}
            {role === "employee" && (
                <div className="rounded-xl border border-gray-100 bg-white bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">My Attendance</h3>
                        <div className="flex items-center gap-2 text-gray-700">
                            <CalendarIcon
                                size={20}
                                className="text-gray-500"
                            />
                            <span className="text-sm">{formattedDate}</span>
                        </div>
                    </div>
                    <div className="w-full">
                        <EmployeeTable isEmployeeView={true} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainAttendance;
