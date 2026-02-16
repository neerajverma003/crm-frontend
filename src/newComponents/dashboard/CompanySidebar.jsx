import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiBriefcase, FiMenu, FiX, FiChevronDown, FiChevronUp, FiLock } from "react-icons/fi";

function CompanySidebar({ roles }) {
    const location = useLocation();
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState({});

    useEffect(() => {
        const storedCompany = localStorage.getItem("selectedCompany");
        if (storedCompany) setSelectedCompany(JSON.parse(storedCompany));
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const toggleDropdown = (index) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // Map specific subroles to custom routes
    //   const customSubRoutes = {
    //     "my leads": "/addmylead",
    //   };

    // const routeMap = {
    //   "lead management": "/lead-management",
    //   "user management": "/user-management",
    //   "employee list": "/user-management",
    //   attendance: "/attendance",
    //   attendence: "/attendance",
    //   settings: "/settings",
    //   "assign lead": "/assignlead",
    //   "todays leads": "/todaysleads",
    //   "followup leads": "/followupleads",
    //   leaves: "/leaves",
    //   "leave management": "/leaves",
    //   "daily expenses": "/dailyexpenses",
    //   expense: "/dailyexpenses",
    //   expenses: "/dailyexpenses",
    //   cheque: "/cheque",              // keep this
    //   "cheque entry": "/cheque",      // <-- add this
    //   "assign role": "/assignrole",
    //   "add role": "/addrole",
    //   "assign company": "/assigncompany",
    //   "add admin": "/add-admin",
    //   "add user": "/add-user",
    //   department: "/department",
    //   designation: "/designation",
    //   "Add state": "/createstate",
    //   "Add destination": "/createdestination",
    //   "Add hotel": "/createhotel",
    // };

    //   const generateRoutePath = (subRoleName) => {
    //     if (!subRoleName) return "/";
    //     const normalized = subRoleName.trim().toLowerCase();
    //     return customSubRoutes[normalized] || routeMap[normalized] || `/${normalized.replace(/\s+/g, "-")}`;
    //   };

    const generateRoutePath = (subRoleName) => {
        if (!subRoleName) return "/";
        const normalized = subRoleName.trim().toLowerCase(); // case-insensitive match

        // Map lowercased subRole names to URLs
        const lowerCaseRouteMap = {
            "lead management": "/lead-management",
            "user management": "/user-management",
            "employee list": "/user-management",
            attendance: "/attendance",
            attendence: "/attendance",
            settings: "/settings",
            "assign lead": "/assignlead",
            "todays leads": "/todaysleads",
            "followup leads": "/followupleads",
            leaves: "/leaves",
            "leave management": "/leaves",
            "daily expenses": "/dailyexpenses",
            expense: "/dailyexpenses",
            expenses: "/dailyexpenses",
            cheque: "/cheque",
            "cheque entry": "/cheque",
            "assign role": "/assignrole",
            "add role": "/addrole",
            "assign company": "/assigncompany",
            "add admin": "/add-admin",
            "add user": "/add-user",
            department: "/department",
            designation: "/designation",
            "add state": "/createstate",
            "add destination": "/createdestination",
            "add hotel": "/createhotel",
            "add transport": "/createtransport",
            "customer creation": "/customer-creation",
            "customer data": "/customer-data",
        };

        // Custom subroutes
        const customSubRoutes = {
            "my leads": "/addmylead",
        };

        return customSubRoutes[normalized] || lowerCaseRouteMap[normalized] || `/${normalized.replace(/\s+/g, "-")}`;
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="fixed left-4 top-4 z-50 rounded-lg bg-black p-2 text-white shadow-lg transition-colors hover:bg-gray-800 lg:hidden"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed z-40 h-screen w-64 overflow-y-auto border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 lg:relative ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-gray-200 bg-black p-6 text-white">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-xl font-bold text-black shadow-md">
                        {selectedCompany?.companyName?.[0]?.toUpperCase() || "C"}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">{selectedCompany?.companyName || "Company Dashboard"}</h2>
                        <p className="mt-1 text-xs text-gray-300">Company Management</p>
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="p-4">
                    {/* Dashboard Link */}
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/dashboard"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium transition-all ${
                                    location.pathname === "/dashboard" ? "bg-black text-white shadow-md" : "text-gray-800 hover:bg-gray-100"
                                }`}
                            >
                                <FiHome size={18} />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                    </ul>

                    {/* Roles with dropdowns */}
                    {roles && roles.length > 0 ? (
                        <ul className="mt-6 space-y-3">
                            {roles.map((role, index) => {
                                const isOpen = openDropdowns[index];
                                return (
                                    <li key={index}>
                                        <button
                                            onClick={() => toggleDropdown(index)}
                                            className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                                                isOpen
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <FiBriefcase size={18} />
                                                {role.roleName || role.name || "Unknown Role"}
                                            </div>
                                            <span>{isOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
                                        </button>

                                        {/* SubRoles Dropdown */}
                                        {isOpen && role.subRoles?.length > 0 && (
                                            <ul className="ml-4 mt-2 space-y-1 border-l border-gray-300 pl-3">
                                                {role.subRoles.map((sub, i) => {
                                                    const subRoute = generateRoutePath(sub.subRoleName);
                                                    return (
                                                        <li key={i}>
                                                            <Link
                                                                to={subRoute}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className={`block rounded-md px-3 py-2 text-sm transition ${
                                                                    location.pathname.startsWith(subRoute)
                                                                        ? "bg-gray-900 text-white"
                                                                        : "text-gray-700 hover:bg-gray-100"
                                                                }`}
                                                            >
                                                                {sub.subRoleName}
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="py-10 text-center text-gray-400">
                            <p className="text-sm">No roles assigned yet.</p>
                        </div>
                    )}

                    {/* Account actions */}
                    <div className="mt-8 border-t border-gray-200 pt-4">
                        <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Account</p>
                        <Link
                            to="/change-password"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition ${
                                location.pathname === "/change-password" ? "bg-black text-white shadow-sm" : "text-gray-800 hover:bg-gray-100"
                            }`}
                        >
                            <FiLock size={18} />
                            Change Password
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default CompanySidebar;
