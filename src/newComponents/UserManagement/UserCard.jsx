import React, { useEffect, useState } from "react";
import { FiUsers, FiBriefcase, FiShield, FiCheckCircle, FiXCircle } from "react-icons/fi";

const UserCard = () => {
    const [employees, setEmployees] = useState([]);
    const [admins, setAdmins] = useState([]);

    const fetchData = async () => {
        try {
            const [employeeRes, adminRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/employee/allEmployee`),
                fetch(`${import.meta.env.VITE_API_URL}/getAdmins`),
            ]);

            const employeeData = await employeeRes.json();
            const adminData = await adminRes.json();

            setEmployees(employeeData.employees || employeeData.data || employeeData);
            setAdmins(adminData.admins || adminData.data || adminData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setEmployees([]);
            setAdmins([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalUsers = employees.length + admins.length;
    const activeEmployees = employees.filter(e => e.accountActive !== false).length;
    const inactiveEmployees = employees.length - activeEmployees;

    const activeAdmins = admins.filter(a => a.accountActive !== false).length;
    const inactiveAdmins = admins.length - activeAdmins;

    const totalActive = activeEmployees + activeAdmins;
    const totalInactive = inactiveEmployees + inactiveAdmins;

    const cards = [
        {
            title: "Total Users",
            active: totalActive,
            inactive: totalInactive,
            totalLabel: "TOTAL USERS",
            totalValue: totalUsers,
            icon: <FiUsers size={20} className="text-white" />,
            theme: "blue",
            wrapperClass: "bg-gradient-to-br from-blue-600 to-purple-400 text-white ",
            iconBg: "bg-white/20 border border-white/30 backdrop-blur-md",
        },
        {
            title: "Employees",
            active: activeEmployees,
            inactive: inactiveEmployees,
            totalLabel: "TOTAL EMPLOYEES",
            totalValue: employees.length,
            icon: <FiBriefcase size={20} className="text-gray-700" />,
            theme: "white",
            wrapperClass: "bg-white text-gray-900 shadow-gray-200 border border-gray-100",
            iconBg: "bg-gray-50 border border-gray-200 shadow-sm",
        },
        {
            title: "Admins",
            active: activeAdmins,
            inactive: inactiveAdmins,
            totalLabel: "TOTAL ADMINS",
            totalValue: admins.length,
            icon: <FiShield size={20} className="text-gray-700" />,
            theme: "white",
            wrapperClass: "bg-white text-gray-900 shadow-gray-200 border border-gray-100",
            iconBg: "bg-gray-50 border border-gray-200 shadow-sm",
        },
    ];

    return (
        <div className="py-2">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`group relative flex w-full h-[240px] flex-col overflow-hidden rounded-[2.5rem] p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] ${card.wrapperClass} shadow-xl`}
                    >
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner transition-transform duration-500 group-hover:scale-110 ${card.iconBg}`}>
                                {React.cloneElement(card.icon, { size: 24 })}
                            </div>
                            <div className={`rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase backdrop-blur-md ${
                                card.theme === "blue" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500 border border-gray-100"
                            }`}>
                                {card.totalLabel}: {card.totalValue}
                            </div>
                        </div>

                        {/* Split Stats Area */}
                        <div className="flex items-center mt-auto">
                            {/* Active Side */}
                            <div className="flex-1">
                                <p className={`text-[11px] font-black tracking-widest uppercase mb-1.5 ${
                                    card.theme === "blue" ? "text-blue-100/80" : "text-gray-400"
                                }`}>
                                    Active
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <h4 className="text-4xl font-black tracking-tighter sm:text-5xl">{card.active}</h4>
                                    <span className={`flex items-center text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                                        card.theme === "blue" ? "bg-white/20 text-emerald-300" : "bg-emerald-50 text-emerald-600"
                                    }`}>
                                        ↑ {Math.round((card.active / (card.totalValue || 1)) * 100)}%
                                    </span>
                                </div>
                            </div>

                            {/* Vertical Divider */}
                            <div className={`h-14 w-[1.5px] mx-5 rounded-full transition-all duration-500 group-hover:h-16 ${
                                card.theme === "blue" ? "bg-white/30" : "bg-gray-200"
                            }`} />

                            {/* Inactive Side */}
                            <div className="flex-1">
                                <p className={`text-[11px] font-black tracking-widest uppercase mb-1.5 ${
                                    card.theme === "blue" ? "text-blue-100/80" : "text-gray-400"
                                }`}>
                                    Inactive
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <h4 className="text-4xl font-black tracking-tighter opacity-90 sm:text-5xl">{card.inactive}</h4>
                                    <span className={`flex items-center text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                                        card.theme === "blue" ? "bg-white/20 text-rose-300" : "bg-rose-50 text-rose-500"
                                    }`}>
                                        ↓ {Math.round((card.inactive / (card.totalValue || 1)) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Background Decorative Elements */}
                        {card.theme === "blue" && (
                            <>
                                <div className="pointer-events-none absolute -bottom-14 -right-14 h-40 w-40 rounded-full bg-indigo-500/40 blur-[70px] transition-all duration-700 group-hover:scale-150" />
                                <div className="pointer-events-none absolute -left-14 -top-14 h-28 w-28 rounded-full bg-blue-400/30 blur-[50px] transition-all duration-700 group-hover:scale-150" />
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserCard;