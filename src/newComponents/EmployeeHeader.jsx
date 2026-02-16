import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
    import { motion, AnimatePresence } from "framer-motion";

const EmployeeHeader = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("Loading...");
    const [roleName, setRoleName] = useState("");
    const [showProfile, setShowProfile] = useState(false);


    const role = localStorage.getItem("role"); // Super admin | admin | employee
    const id = localStorage.getItem("userId");


    /* Close dropdown on outside click */
    useEffect(() => {
        const handleClickOutside = (e) => {
            // if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            //     setShowProfile(false);
            // }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!id || !role) return;

                const r = role.toLowerCase();
                let url = "";

                if (r === "superadmin") url = `http://localhost:4000/AddSuperAdmin/super/${id}`;
                else if (r === "admin") url = `http://localhost:4000/getAdmin/${id}`;
                else if (r === "employee") url = `http://localhost:4000/employee/getEmployee/${id}`;

                const res = await fetch(url);
                const data = await res.json();

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
        // <div>
        //     {/* <div className="sticky top-0 z-50 mb-6 flex flex-wrap items-center justify-between rounded-2xl bg-white p-6 shadow-sm"> */}
        //     <div className="sticky top-0 z-50 mt-2 mb-0 mx-auto flex max-w-[98%] flex-wrap items-center justify-between rounded-2xl bg-white p-6 shadow-sm">

        //         <div className="flex items-center gap-4">
        //             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-xl font-bold text-white">
        //                 {userName[0]}
        //             </div>

        //             <div>
        //                 <h2 className="text-lg font-semibold text-gray-900">{userName}</h2>
        //                 <p className="text-sm text-gray-500">{role}</p>
        //                 <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
        //                     <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">Active Now</span>
        //                 </div>
        //             </div>
        //         </div>

        //         <div className="mt-4 flex gap-3 sm:mt-0">
        //             <button className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">Edit Profile</button>
        //             <button
        //                 onClick={handleLogout}
        //                 className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        //             >
        //                 Logout
        //             </button>
        //         </div>
        //     </div>
        // </div>
        // <div>
        //     <div className="sticky top-0 z-20 mx-auto mb-0 mt-2 flex max-w-[98%] flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        //         {/* LEFT — User Info */}
        //         <div className="flex items-center gap-4">
        //             {/* Avatar */}
        //             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-lg font-bold text-white sm:h-16 sm:w-16 sm:text-xl">
        //                 {userName?.[0]?.toUpperCase()}
        //             </div>

        //             {/* Name & Role */}
        //             <div>
        //                 <h2 className="text-base font-semibold text-gray-900 sm:text-lg">{userName}</h2>
        //                 <p className="text-xs capitalize text-gray-500 sm:text-sm">{role}</p>

        //                 <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
        //                     <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">Active Now</span>
        //                 </div>
        //             </div>
        //         </div>

        //         {/* RIGHT — Actions */}
        //         <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
        //             <button className="w-full rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 sm:w-auto">
        //                 Edit Profile
        //             </button>

        //             <button
        //                 onClick={handleLogout}
        //                 className="w-full rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:w-auto"
        //             >
        //                 Logout
        //             </button>
        //         </div>
        //     </div>
        // </div>
        <div className="sticky top-0 z-20 mx-auto mt-2 w-full max-w-[98%]">

            {/* 🔹 MOBILE VIEW */}
            <div className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm sm:hidden">
                {/* Avatar */}
                <div className="flex h-12 w-12 items-center justify-center ml-24 rounded-full bg-indigo-500 text-lg font-bold text-white">
                    {userName?.[0]?.toUpperCase()}
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                    Logout
                </button>
            </div>

            {/* 🔹 DESKTOP VIEW */}
            <div className="hidden flex-col gap-4 rounded-2xl w-full bg-white p-6 shadow-sm sm:flex sm:flex-row sm:items-center sm:justify-between">
                {/* LEFT — User Info */}
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-xl font-bold text-white">
                        {userName?.[0]?.toUpperCase()}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{userName}</h2>
                        <p className="text-sm capitalize text-gray-500">{role}</p>

                        <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                            Active Now
                        </span>
                    </div>

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

                {/* RIGHT — Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setShowProfile(false);
                            navigate("/profile");
                        }}
                        className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                        Edit Profile
                    </button>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>

    );
};

export default EmployeeHeader;
