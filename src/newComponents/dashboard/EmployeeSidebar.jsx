import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLock, FiBriefcase, FiChevronDown, FiChevronUp } from "react-icons/fi";

function EmployeeSidebar() {
    const location = useLocation();
    const [roles, setRoles] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState({});

    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role")?.trim()?.toLowerCase();

    useEffect(() => {
        const fetchEmployee = async () => {
            const storedEmployee = localStorage.getItem("selectedEmployee");
            if (!storedEmployee) return;

            const { id } = JSON.parse(storedEmployee);
            if (!id) return;

            try {
                const res = await fetch(`http://localhost:4000/employee/${id}`);
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
            const res = await fetch(`http://localhost:4000/employee/getSubRoleName/${subRoleId}`);
            const data = await res.json();
            return data.success ? data.subRoleName : subRoleId;
        } catch (err) {
            console.error(err);
            return subRoleId;
        }
    };

    const toggleDropdown = (key) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
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
                const res = await fetch(`http://localhost:4000/employee/getAssignedRoles/${userId}`);
                const data = await res.json();
                console.log("📥 Assigned Roles for Employee:", data);
                
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
                <div className="flex items-center gap-3 border-b border-gray-200 bg-black p-6 text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl font-bold text-black">
                        {selectedEmployee?.name?.[0]?.toUpperCase() || selectedEmployee?.id?.[0] || "E"}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">{selectedEmployee?.name || "Employee Dashboard"}</h2>
                        <p className="mt-1 text-xs text-gray-300">Employee Panel</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="space-y-2">
                        <Link
                            to="/dashboard"
                            className={`block rounded-lg px-4 py-2 font-medium ${
                                location.pathname === "/dashboard" ? "bg-black text-white" : "text-gray-800 hover:bg-gray-100"
                            }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/employee-company-overview"
                            className={`block rounded-lg px-4 py-2 font-medium ${
                                location.pathname === "/employee-company-overview" ? "bg-black text-white" : "text-gray-800 hover:bg-gray-100"
                            }`}
                        >
                            Company Overview
                        </Link>
                        <Link
                            to="/employee-training-material"
                            className={`block rounded-lg px-4 py-2 font-medium ${
                                location.pathname === "/employee-training-material" ? "bg-black text-white" : "text-gray-800 hover:bg-gray-100"
                            }`}
                        >
                            Training Materials
                        </Link>
                        <Link
                            to="/attendance"
                            className={`block rounded-lg px-4 py-2 font-medium ${
                                location.pathname === "/attendance" ? "bg-black text-white" : "text-gray-800 hover:bg-gray-100"
                            }`}
                        >
                            Attendance
                        </Link>

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
                                                className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                                                    isRoleOpen
                                                        ? "border-black bg-black text-white"
                                                        : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FiBriefcase size={16} />
                                                    {roleLabel}
                                                </div>
                                                <span>{isRoleOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}</span>
                                            </button>

                                            {/* SubRoles Container */}
                                            {isRoleOpen && role.subRoles && role.subRoles.length > 0 && (
                                                <div className="ml-2 mt-2 space-y-1 border-l border-gray-300 pl-2">
                                                    {role.subRoles.map((sub, subIndex) => {
                                                        const subKey = `sub-${roleIndex}-${subIndex}`;
                                                        const isSubOpen = openDropdowns[subKey];
                                                        
                                                        // Compute filtered points for THIS subrole
                                                        const canonicalPoints = sub.points || [];
                                                        const assignedPointsForRole = role.points || [];
                                                        const filteredPoints = canonicalPoints.filter(p => assignedPointsForRole.includes(p));
                                                        const hasPoints = filteredPoints && filteredPoints.length > 0;

                                                        return (
                                                            <div key={subIndex}>
                                                                {/* SubRole Button/Link */}
                                                                {hasPoints ? (
                                                                    <button
                                                                        onClick={() => toggleDropdown(subKey)}
                                                                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition ${
                                                                            isSubOpen
                                                                                ? "bg-gray-200 text-gray-900"
                                                                                : "text-gray-700 hover:bg-gray-100"
                                                                        }`}
                                                                    >
                                                                        <span>• {sub.subRoleName || "Unknown Sub-role"}</span>
                                                                        <span>{isSubOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}</span>
                                                                    </button>
                                                                ) : (
                                                                    <Link
                                                                        to={getSubRoleRoute(sub.subRoleName)}
                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                        className={`block rounded-md px-3 py-2 text-xs font-medium transition ${
                                                                            location.pathname === getSubRoleRoute(sub.subRoleName)
                                                                                ? "bg-gray-900 text-white"
                                                                                : "text-gray-700 hover:bg-gray-100"
                                                                        }`}
                                                                    >
                                                                        • {sub.subRoleName || "Unknown Sub-role"}
                                                                    </Link>
                                                                )}

                                                                {/* Points Container */}
                                                                {isSubOpen && hasPoints && (
                                                                    <div className="ml-2 mt-1 space-y-1 border-l border-gray-300 pl-2">
                                                                        {(() => {
                                                                            return filteredPoints.map((point, pointIndex) => {
                                                                                const pointRoute = getPointRoute(point);
                                                                                const active = location.pathname === pointRoute;
                                                                                return (
                                                                                    <Link
                                                                                        key={pointIndex}
                                                                                        to={pointRoute}
                                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                                        className={`block rounded-md px-2 py-1.5 text-xs font-medium transition ${
                                                                                            active
                                                                                                ? "bg-gray-900 text-white"
                                                                                                : "text-gray-700 hover:bg-gray-100"
                                                                                        }`}
                                                                                    >
                                                                                        ◆ {point}
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

                    <div className="mt-8 border-t border-gray-200 pt-4">
                        <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Account</p>
                        <Link
                            to="/change-password"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium ${
                                location.pathname === "/change-password" ? "bg-black text-white" : "text-gray-800 hover:bg-gray-100"
                            }`}
                        >
                            <FiLock className="text-lg" />
                            Change Password
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default EmployeeSidebar;
