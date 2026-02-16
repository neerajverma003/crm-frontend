// import { useEffect, useState } from "react";
// import { FiLogOut } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// const Header = () => {
//   const navigate = useNavigate();
//   const [userName, setUserName] = useState("Loading...");
//   const [roleName, setRoleName] = useState("");
//   const [showProfile, setShowProfile] = useState(false);

//   const role = localStorage.getItem("role") || "";
//   const id = localStorage.getItem("userId") || "";

//   useEffect(() => {
//   const handleClickOutside = () => setShowProfile(false);
//   if (showProfile) {
//     window.addEventListener("click", handleClickOutside);
//   }
//   return () => window.removeEventListener("click", handleClickOutside);
// }, [showProfile]);

//   // 🧩 Fetch user details from API
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (!id || !role) return;

//         let url = "";

//         // Choose correct endpoint based on role
//         if (role.toLowerCase() === "superadmin") {
//           url = `http://localhost:4000/AddSuperAdmin/super/${id}`;
//         } else if (role.toLowerCase() === "admin") {
//           url = `http://localhost:4000/getAdmin/${id}`;
//         } else if (role.toLowerCase() === "employee") {
//           url = `http://localhost:4000/employee/getEmployee/${id}`;
//         } else {
//           console.warn("Unknown role:", role);
//           setUserName("Unknown");
//           setRoleName(role);
//           return;
//         }

//         const res = await fetch(url);
//         if (!res.ok) throw new Error("Failed to fetch user data");

//         const data = await res.json();
//         console.log(data)

//         // ✅ Set name & role based on response structure
//         if (role.toLowerCase() === "superadmin" && data.SuperAdmin) {
//           setUserName(data.SuperAdmin.fullName || "Super Admin");
//           setRoleName("Super Admin");
//         } else if (role.toLowerCase() === "admin" && data.admin) {
//           setUserName(data.admin.fullName || "Admin");
//           setRoleName("Admin");
//         } else if (role.toLowerCase() === "employee" && data.employee) {
//           setUserName(data.employee.fullName || "Employee");
//           setRoleName(data.employee.role || "Employee");
//         } else {
//           setUserName("User");
//           setRoleName(role);
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         setUserName("Unknown");
//         setRoleName(role);
//       }
//     };

//     fetchUser();
//   }, [id, role]);

//   // 🧭 Logout
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <header className="flex items-center justify-between bg-white shadow-md px-4 sm:px-6 py-3 h-[10vh] sticky top-0 z-30">
//       {/* Mobile: Show user logo + name | Desktop: Show heading */}
//       <div className="flex items-center gap-3">
//         {/* User Logo + Name - Visible only on mobile */}
//         <div className="flex md:hidden items-center gap-3">
//           <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-200 text-[18px] font-semibold text-black">
//             {userName.charAt(0)?.toUpperCase() || "U"}
//           </div>
//           <span className="text-[16px] font-medium text-gray-700">
//             {userName}
//           </span>
//         </div>

//         {/* Dashboard Overview - Visible only on desktop */}
//         <h1 className="hidden md:block text-2xl md:text-[28px] font-semibold text-gray-700">
//           Dashboard Overview
//         </h1>
//       </div>

//       {/* Right side */}
//       <div className="flex items-center gap-4 sm:gap-6">
//   {/* 👤 User Dropdown */}
//   <div className="hidden md:block">
//     <div className="w-max rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

//       {/* 🔒 Fixed Header (never moves) */}
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           setShowProfile((prev) => !prev);
//         }}
//         className="flex items-center gap-3 px-3 py-1 w-full hover:bg-gray-100 transition"
//       >
//         {/* Avatar */}
//         <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-200 text-[18px] font-semibold text-black">
//           {userName.charAt(0)?.toUpperCase() || "U"}
//         </div>

//         {/* Name + Role */}
//         <div className="flex flex-col text-left">
//           <span className="text-[16px] font-medium text-gray-700">
//             {userName}
//           </span>
//           <span className="text-sm text-gray-400 capitalize">
//             {roleName}
//           </span>
//         </div>
//       </button>

//       {/* ⬇️ Expanding Section (only this grows) */}
//       <AnimatePresence>
//         {showProfile && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.25, ease: "easeInOut" }}
//             className="overflow-hidden border-t border-gray-200"
//           >
//             <button
//               className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
//               onClick={() => {
//                 setShowProfile(false);
//                 navigate("/profile");
//               }}
//             >
//               Profile
//             </button>

//             <button
//               className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100"
//               onClick={() => {
//                 setShowProfile(false);
//                 navigate("/settings");
//               }}
//             >
//               Settings
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   </div>

//   {/* 🚪 Logout */}
//   <button
//     onClick={handleLogout}
//     className="rounded-md p-2 transition-colors hover:bg-red-100 active:bg-red-200"
//   >
//     <FiLogOut size={22} className="text-red-600" />
//   </button>
// </div>
//     </header>
//   );
// };

// export default Header;

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

                if (r === "superadmin") url = `http://localhost:4000/AddSuperAdmin/super/${id}`;
                else if (r === "admin") url = `http://localhost:4000/getAdmin/${id}`;
                else if (r === "employee") url = `http://localhost:4000/employee/getEmployee/${id}`;

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
        // <>
        // {role!=="employee" &&(
        //   <header className="flex items-center justify-between bg-white shadow-md px-4 sm:px-6 py-3 h-[10vh] sticky top-0 z-30">
        //   {/* LEFT */}
        //   <h1 className="hidden md:block text-2xl font-semibold text-gray-700">
        //     Dashboard Overview
        //   </h1>

        //   {/* RIGHT */}
        //   <div className="flex items-center gap-4 sm:gap-6">
        //     {/* USER DROPDOWN */}
        //     <div className="hidden md:block relative" ref={dropdownRef}>
        //       {/* Header button */}
        //       <button
        //         onClick={() => setShowProfile((p) => !p)}
        //         className="flex items-center gap-3 px-3 h-[64px] w-[230px]
        //                    rounded-full border border-gray-200 bg-white shadow-sm
        //                    hover:bg-gray-100 transition"
        //       >
        //         {/* Avatar */}
        //         <div className="flex h-[45px] w-[45px] items-center justify-center
        //                         rounded-full bg-gray-200 text-[18px]
        //                         font-semibold text-black">
        //           {userName.charAt(0)?.toUpperCase() || "U"}
        //         </div>

        //         {/* Name + Role */}
        //         <div className="flex flex-col justify-center text-left leading-tight flex-1">
        //           <span className="text-[16px] font-medium text-gray-700">
        //             {userName}
        //           </span>
        //           <span className="text-sm text-gray-400 capitalize">
        //             {roleName}
        //           </span>
        //         </div>

        //         {/* Arrow */}
        //         <FiChevronDown
        //           size={18}
        //           className={`text-gray-500 transition-transform duration-200 ${
        //             showProfile ? "rotate-180" : ""
        //           }`}
        //         />
        //       </button>

        //       {/* CAPSULE DROPDOWN */}
        //       <AnimatePresence>
        //         {showProfile && (
        //           <motion.div
        //             initial={{ opacity: 0, y: -6, scale: 0.98 }}
        //             animate={{ opacity: 1, y: 4, scale: 1 }} // reduced gap here
        //             exit={{ opacity: 0, y: -6, scale: 0.98 }}
        //             transition={{ duration: 0.2 }}
        //             className="absolute left-0 top-full mt-1 w-full
        //                        rounded-[28px] border border-gray-200 bg-white
        //                        shadow-[0_16px_40px_rgba(0,0,0,0.14)]
        //                        overflow-hidden z-50"
        //           >
        //             {/* User Info */}
        //             <div className="flex items-center gap-3 px-5 py-4
        //                             bg-gray-50 border-b
        //                             rounded-t-[28px]">
        //               <div className="flex h-[42px] w-[42px] items-center justify-center
        //                               rounded-full bg-gray-200 text-[16px]
        //                               font-semibold text-black">
        //                 {userName.charAt(0)?.toUpperCase() || "U"}
        //               </div>

        //               <div className="flex flex-col leading-tight">
        //                 <span className="text-sm font-medium text-gray-800">
        //                   {userName}
        //                 </span>
        //                 <span className="text-xs text-gray-500 capitalize">
        //                   {roleName}
        //                 </span>
        //               </div>
        //             </div>

        //             {/* Actions */}
        //             <div className="px-2 py-2">
        //               <button
        //                 className="w-full px-4 py-3 rounded-full
        //                            text-left text-sm hover:bg-gray-100 transition"
        //                 onClick={() => {
        //                   setShowProfile(false);
        //                   navigate("/profile");
        //                 }}
        //               >
        //                 Profile
        //               </button>

        //               <button
        //                 className="w-full px-4 py-3 rounded-full
        //                            text-left text-sm hover:bg-gray-100 transition"
        //                 onClick={() => {
        //                   setShowProfile(false);
        //                   navigate("/settings");
        //                 }}
        //               >
        //                 Settings
        //               </button>
        //             </div>
        //           </motion.div>
        //         )}
        //       </AnimatePresence>
        //     </div>

        //     {/* LOGOUT */}
        //     <button
        //       onClick={handleLogout}
        //       className="rounded-md p-2 hover:bg-red-100 active:bg-red-200"
        //     >
        //       <FiLogOut size={22} className="text-red-600" />
        //     </button>
        //   </div>
        // </header>
        // )}
        // </>
        <>
            {role !== "employee" && (
                <header className="sticky top-0 z-30 h-[64px] w-full bg-white shadow-md">
                    <div className="flex h-full items-center justify-between px-3 sm:px-6">
                        {/* LEFT — Title */}

                        {/* LEFT */}
                        <div className="flex items-center gap-3">
                            {/* MOBILE — User avatar + name */}
                            <div className="flex items-center gap-3 sm:hidden">
                                {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">
                                    {userName.charAt(0)?.toUpperCase() || "U"}
                                </div> */}
                                <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold md:flex">
                                    {userName.charAt(0)?.toUpperCase() || "U"}
                                </div>

                                <span className="absolute text-sm font-medium text-gray-700 sm:left-0 left-20 sm:flex hidden">{userName}</span>
                            </div>

                            {/* DESKTOP — Title */}
                            <h1 className="hidden text-lg font-semibold text-gray-700 sm:block sm:text-2xl sm:ml-5">Dashboard Overview</h1>
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
