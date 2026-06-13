import { useEffect, useState, useRef } from "react";
import { FiLogOut, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const [userName, setUserName] = useState("Loading...");
    const [roleName, setRoleName] = useState("");
    const [showProfile, setShowProfile] = useState(false);

    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");

    /* Close dropdown on outside click */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowProfile(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* Fetch user */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!id || !role) return;

                const r = role.toLowerCase();
                let url = "";

                if (r === "superadmin") url = `${import.meta.env.VITE_API_URL}/AddSuperAdmin/super/${id}`;
                else if (r === "admin") url = `${import.meta.env.VITE_API_URL}/getAdmin/${id}`;
                else if (r === "employee") url = `${import.meta.env.VITE_API_URL}/employee/getEmployee/${id}`;

                const res = await fetch(url);
                const data = await res.json();
                // console.log(r);
                
                if (r === "superadmin" && data.SuperAdmin) {
                    setUserName(data.SuperAdmin.fullName);
                    setRoleName("Super Admin");
                } else if (r === "admin" && data.admin) {
                    setUserName(data.admin.fullName);
                    setRoleName("Admin");
                } else if (r === "employee" && data.employee) {
                    setUserName(data.employee.fullName);
                    setRoleName(data.employee.role);
                }
            } catch {
                setUserName("User");
                setRoleName(role);
            }
        };
        fetchUser();
    }, [id, role]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <>
            {role !== "employee" && (
                <header className="sticky top-0 z-30 h-[64px] w-full bg-white shadow-md">
                    <div className="flex h-full items-center justify-between px-3 sm:px-6">
                        {/* LEFT — Title */}

                        {/* LEFT */}
                        <div className="flex items-center gap-3">
                            {/* MOBILE — User avatar + name */}
                            <div className="flex items-center gap-3 sm:hidden">
                                <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold md:flex">
                                    {userName.charAt(0)?.toUpperCase() || "U"}
                                </div>

                                <span className="absolute text-sm font-medium text-gray-700 sm:left-0 left-20 sm:flex hidden">{userName}</span>
                            </div>

                            {/* DESKTOP — Title */}
                            <h1 className="hidden text-lg font-semibold text-gray-700 sm:block sm:text-2xl sm:ml-14 lg:ml-2">Dashboard Overview</h1>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-3 sm:gap-6">
                            {/* PROFILE DROPDOWN */}
                            <div
                                className="relative sm:right-0"
                                ref={dropdownRef}
                            >
                                <button
                                    onClick={() => setShowProfile((p) => !p)}
                                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm transition hover:bg-gray-100 sm:gap-3 sm:px-3"
                                >
                                    {/* Avatar */}
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">
                                        {userName.charAt(0)?.toUpperCase() || "U"}
                                    </div>

                                    {/* Name & Role — Hide on Mobile */}
                                    <div className="hidden flex-col text-left leading-tight sm:flex">
                                        <span className="text-sm font-medium text-gray-700">{userName}</span>
                                        <span className="text-xs capitalize text-gray-400">{roleName}</span>
                                    </div>

                                    {/* Arrow */}
                                    <FiChevronDown
                                        size={16}
                                        className={`hidden transition-transform sm:block ${showProfile ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {/* DROPDOWN */}
                                <AnimatePresence>
                                    {showProfile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 4 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 z-50 mt-2 w-56 rounded-xl border bg-white shadow-xl sm:w-64"
                                        >
                                            {/* User Info */}
                                            <div className="flex items-center gap-3 border-b bg-gray-50 px-4 py-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">
                                                    {userName.charAt(0)?.toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{userName}</p>
                                                    <p className="text-xs capitalize text-gray-500">{roleName}</p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <button
                                                onClick={() => {
                                                    setShowProfile(false);
                                                    navigate("/profile");
                                                }}
                                                className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                                            >
                                                Profile
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setShowProfile(false);
                                                    navigate("/settings");
                                                }}
                                                className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
                                            >
                                                Settings
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* LOGOUT */}
                            <button
                                onClick={handleLogout}
                                className="rounded-md p-2 hover:bg-red-100 active:bg-red-200"
                            >
                                <FiLogOut
                                    size={20}
                                    className="text-red-600"
                                />
                            </button>
                        </div>
                    </div>
                </header>
            )}
        </>
    );
};

export default Header;
