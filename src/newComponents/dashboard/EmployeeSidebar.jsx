import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaLock, FaBriefcase, FaChevronDown, FaChevronUp, FaThLarge, FaChartLine, FaBookOpen, FaClock, FaCheckSquare } from "react-icons/fa";

function EmployeeSidebar() {
    const location = useLocation();
    const [roles, setRoles] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState({});
    const [myTeam, setMyTeam] = useState(null);

    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role")?.trim()?.toLowerCase();

    useEffect(() => {
        if (!userId) return;
        const checkTeamLeader = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/teams`);
                const teams = await res.json();
                const foundTeam = teams.find(t => t.teamLeader?._id === userId);
                if (foundTeam) {
                    setMyTeam(foundTeam);
                }
            } catch (err) {
                console.error("Error checking team leader status:", err);
            }
        };
        checkTeamLeader();
    }, [userId]);

    useEffect(() => {
        const fetchEmployee = async () => {
            const storedEmployee = localStorage.getItem("selectedEmployee");
            if (!storedEmployee) return;

            const { id } = JSON.parse(storedEmployee);
            if (!id) return;

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/employee/${id}`);
                const data = await res.json();
                if (data.success && data.employee) {
                    setSelectedEmployee(data.employee);
                } else {
                    setSelectedEmployee({ id });
                }
            } catch (err) {
                console.error(err);
                setSelectedEmployee({ id });
            }
        };

        fetchEmployee();
    }, []);

    const fetchSubRoleName = async (subRoleId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/employee/getSubRoleName/${subRoleId}`);
            const data = await res.json();
            return data.success ? data.subRoleName : subRoleId;
        } catch (err) {
            console.error(err);
            return subRoleId;
        }
    };

    const toggleDropdown = (key) => {
        setOpenDropdowns((prev) => {
            const isCurrentlyOpen = prev[key];
            if (isCurrentlyOpen) {
                return { ...prev, [key]: false };
            }

            // Check if it's a top-level role (role-X) or a sub-role (sub-X-Y)
            if (key.startsWith("role-")) {
                // If opening a new role, close everything else
                return { [key]: true };
            }

            // If it's a sub-role, we want to close other sub-roles in the same parent role?
            // For now, let's just keep the parent role open.
            const newState = { ...prev };
            
            // Close other sub-roles of the SAME role
            const rolePrefix = key.split("-").slice(0, 2).join("-"); // e.g. "sub-0"
            Object.keys(newState).forEach(k => {
                if (k.startsWith("sub-") && k.includes(rolePrefix) && k !== key) {
                    newState[k] = false;
                }
            });
            
            newState[key] = true;
            return newState;
        });
    };

    const getPointRoute = (pointName) => {
        if (!pointName) return "/";
        const normalized = String(pointName).toLowerCase().trim();

        // Map point names to routes
        const pointRoutes = {
            "daily expenses": "/dailyexpenses",
            "expense": "/dailyexpenses",
            "expenses": "/dailyexpenses",
            "cheque": "/cheque",
            "cheque entry": "/cheque",
            "lead management": "/lead-management",
            "My Leads": "/addmylead",
            "My Lead": "/addmylead",
            "user management": "/user-management",
            "attendance": "/attendance",
            "attendence": "/attendance",
            "leaves": "/leaves",
            "leave management": "/leaves",
            "assign lead": "/assignlead",
            "todays leads": "/todaysleads",
            "followup leads": "/followupleads",
            "settings": "/settings",
            "assign role": "/assignrole",
            "add role": "/addrole",
            "assign company": "/assigncompany",
            "add state": "/createstate",
            "add destination": "/createdestination",
            "add hotel": "/createhotel",
            "add transport": "/createtransport",
            "customer creation": "/customer-creation",
            "invoice creation": "/createinvoice",
            "invoice list": "/invoicelist",
        };

        return pointRoutes[normalized] || `/${normalized.replace(/\s+/g, "-")}`;
    };

    useEffect(() => {
        if (!userId) return;

        const fetchRoles = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/employee/getAssignedRoles/${userId}`);
                const data = await res.json();
                // console.log(" Assigned Roles for Employee:", data);
                
                if (data.success && Array.isArray(data.assignedRoles)) {
                    // Backend returns enriched data with roleNames, subRoles, and points
                    setRoles(data.assignedRoles);
                } else {
                    setRoles([]);
                }
            } catch (err) {
                console.error(err);
                setRoles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, [userId]);
    // console.log(roles);
    
    useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

    const getSubRoleRoute = (name) => {
        if (!name) return "/";

        // Accept either a string or an object (e.g. { subRoleName, name })
        const text = typeof name === "string" ? name : name?.subRoleName || name?.name || String(name);
        const normalized = String(text).toLowerCase();

        // B2B routes
        // if (normalized === "create destination") return "/b2b-destination";
        if (normalized === "add company" || normalized === "b2b add company") return "/b2b-addcompany";

        // New fixed routes
        if (normalized === "all destination") return "/b2b-destination";
        if (normalized === "create destination") return "/createdestination";
        if (normalized === "create state") return "/createstate";
        if (normalized === "create hotel") return "/createhotel";
        if (normalized === "create transport") return "/createtransport";

        // Accounts
        if (normalized === "daily expense") return "/dailyexpenses";
        if (normalized === "cheque expense") return "/cheque";
        if (normalized === "salary management") return "/salary-list";

        // Invoice routes
        if (normalized === "invoice-creation" || normalized === "invoice creation") return "/createinvoice";
        if (normalized === "invoice-list" || normalized === "invoice list" || normalized === "invoicelist") return "/invoicelist";

        // Lead routes
        if (normalized === "my lead" || normalized === "My Lead") return "/addmylead";
        // if (normalized.includes("lead")) return "/lead-management";

        // Fallback: generate slug from name
        return `/${normalized.replace(/\s+/g, "-")}`;
    };

    if (userRole !== "employee") return null;

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="fixed left-4 top-4 z-50 rounded-lg p-2 text-white lg:hidden"
            >
                {isMobileMenuOpen ? (
                    <div className="ml-48 mt-4">X</div>
                ) : (
                    <div>
                        <div
                            className="flex flex-col justify-center gap-1.5 p-2"
                            aria-label="Open menu"
                        >
                            <span className="block h-1 w-7 bg-gray-800"></span>
                            <span className="block h-1 w-7 bg-gray-800"></span>
                            <span className="block h-1 w-7 bg-gray-800"></span>
                        </div>
                    </div>
                )}
            </button>

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed z-40 h-screen w-64 overflow-y-auto border-r border-gray-200 bg-white shadow-lg transition-transform lg:relative ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-gray-100 bg-white p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-xl font-black text-white shadow-md shadow-indigo-200">
                        {selectedEmployee?.name?.[0]?.toUpperCase() || selectedEmployee?.id?.[0] || "E"}
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-sm font-bold text-gray-900 truncate" title={selectedEmployee?.name || "Employee Dashboard"}>
                            {selectedEmployee?.name || "Employee Dashboard"}
                        </h2>
                        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-500">Employee Panel</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="space-y-1.5">
                        <Link
                            to="/dashboard"
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                                location.pathname === "/dashboard" 
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200/50" 
                                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                            }`}
                        >
                            <FaThLarge className={location.pathname === "/dashboard" ? "text-white" : "text-gray-400"} size={16} />
                            Dashboard
                        </Link>
                        <Link
                            to="/employee-company-overview"
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                                location.pathname === "/employee-company-overview" 
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200/50" 
                                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                            }`}
                        >
                            <FaChartLine className={location.pathname === "/employee-company-overview" ? "text-white" : "text-gray-400"} size={16} />
                            Company Overview
                        </Link>
                        <Link
                            to="/employee-training-material"
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                                location.pathname === "/employee-training-material" 
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200/50" 
                                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                            }`}
                        >
                            <FaBookOpen className={location.pathname === "/employee-training-material" ? "text-white" : "text-gray-400"} size={16} />
                            Training Materials
                        </Link>
                        <Link
                            to="/attendance"
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                                location.pathname === "/attendance" 
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200/50" 
                                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                            }`}
                        >
                            <FaClock className={location.pathname === "/attendance" ? "text-white" : "text-gray-400"} size={16} />
                            Attendance
                        </Link>
                        <Link
                            to="/employee-tasks"
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                                location.pathname === "/employee-tasks" 
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200/50" 
                                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                            }`}
                        >
                            <FaCheckSquare className={location.pathname === "/employee-tasks" ? "text-white" : "text-gray-400"} size={16} />
                            My Tasks
                        </Link>

                        {myTeam && (
                            <Link
                                to="/my-team-dashboard"
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                                    location.pathname === "/my-team-dashboard" 
                                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200/50" 
                                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                            >
                                <FaBriefcase className={location.pathname === "/my-team-dashboard" ? "text-white" : "text-gray-400"} size={16} />
                                My Team Dashboard
                            </Link>
                        )}

                        {loading ? (
                            <p className="mt-4 text-center text-sm text-gray-400">Loading...</p>
                        ) : roles.length > 0 ? (
                            <div className="space-y-2">
                                {roles.map((role, roleIndex) => {
                                    const roleKey = `role-${roleIndex}`;
                                    const isRoleOpen = openDropdowns[roleKey];
                                    const roleLabel = role.roleNames?.[0] || "Unknown Role";
                                    
                                    return (
                                        <div key={roleIndex}>
                                            {/* Role Button */}
                                            <button
                                                onClick={() => toggleDropdown(roleKey)}
                                                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                                                    isRoleOpen
                                                        ? "bg-indigo-50 text-indigo-700"
                                                        : "bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FaBriefcase size={16} className={isRoleOpen ? "text-indigo-600" : "text-gray-400"} />
                                                    {roleLabel}
                                                </div>
                                                <span className={`transition-transform duration-300 ${isRoleOpen ? "rotate-180" : ""}`}>
                                                    <FaChevronDown size={14} />
                                                </span>
                                            </button>

                                            {/* SubRoles Container */}
                                            {isRoleOpen && role.subRoles && role.subRoles.length > 0 && (
                                                <div className="ml-5 mt-1 space-y-1 border-l-2 border-indigo-100 pl-3">
                                                    {role.subRoles.map((sub, subIndex) => {
                                                        const subKey = `sub-${roleIndex}-${subIndex}`;
                                                        const isSubOpen = openDropdowns[subKey];
                                                        
                                                        // Compute filtered points for THIS subrole
                                                        const canonicalPoints = sub.points || [];
                                                        const assignedPointsForRole = role.points || [];
                                                        const filteredPoints = canonicalPoints.filter(p => assignedPointsForRole.includes(p));
                                                        const hasPoints = filteredPoints && filteredPoints.length > 0;

                                                        return (
                                                            <div key={subIndex} className="py-0.5">
                                                                {/* SubRole Button/Link */}
                                                                {hasPoints ? (
                                                                    <button
                                                                        onClick={() => toggleDropdown(subKey)}
                                                                        className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-[13px] font-bold transition-all ${
                                                                            isSubOpen
                                                                                ? "bg-indigo-50 text-indigo-700"
                                                                                : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center gap-2.5">
                                                                            <div className={`h-1.5 w-1.5 rounded-full ${isSubOpen ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                                                                            <span>{sub.subRoleName || "Unknown Sub-role"}</span>
                                                                        </div>
                                                                        <span className={`transition-transform duration-300 ${isSubOpen ? "rotate-180" : ""}`}>
                                                                            <FaChevronDown size={12} />
                                                                        </span>
                                                                    </button>
                                                                ) : (
                                                                    <Link
                                                                        to={getSubRoleRoute(sub.subRoleName)}
                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                        className={`flex items-center gap-2.5 w-full rounded-lg px-4 py-2.5 text-[13px] font-bold transition-all ${
                                                                            location.pathname === getSubRoleRoute(sub.subRoleName)
                                                                                ? "bg-indigo-50 text-indigo-700"
                                                                                : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                                                                        }`}
                                                                    >
                                                                        <div className={`h-1.5 w-1.5 rounded-full ${location.pathname === getSubRoleRoute(sub.subRoleName) ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                                                                        {sub.subRoleName || "Unknown Sub-role"}
                                                                    </Link>
                                                                )}

                                                                {/* Points Container */}
                                                                {isSubOpen && hasPoints && (
                                                                    <div className="ml-5 mt-1 space-y-1 border-l-2 border-indigo-50 pl-3">
                                                                        {(() => {
                                                                            return filteredPoints.map((point, pointIndex) => {
                                                                                const pointRoute = getPointRoute(point);
                                                                                const active = location.pathname === pointRoute;
                                                                                return (
                                                                                    <Link
                                                                                        key={pointIndex}
                                                                                        to={pointRoute}
                                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                                        className={`block rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                                                                                            active
                                                                                                ? "text-indigo-600 bg-indigo-50/50"
                                                                                                : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                                                                                        }`}
                                                                                    >
                                                                                        {point}
                                                                                    </Link>
                                                                                );
                                                                            });
                                                                        })()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="mt-4 text-center text-gray-400">No roles assigned yet.</p>
                        )}
                    </div>

                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Account settings</p>
                        <Link
                            to="/change-password"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                                location.pathname === "/change-password" 
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200/50" 
                                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                            }`}
                        >
                            <FaLock size={16} className={location.pathname === "/change-password" ? "text-white" : "text-gray-400"} />
                            Change Password
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default EmployeeSidebar;
