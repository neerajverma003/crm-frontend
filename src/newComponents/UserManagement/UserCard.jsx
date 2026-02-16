

// import React, { useEffect, useState } from "react";
// import { FiUsers, FiBriefcase, FiShield } from "react-icons/fi";

// const UserCard = () => {
//     const [employees, setEmployees] = useState([]);
//     const [admins, setAdmins] = useState([]);

//     const fetchData = async () => {
//         try {
//             const [employeeRes, adminRes] = await Promise.all([
//                 fetch("http://localhost:4000/employee/allEmployee"),
//                 fetch("http://localhost:4000/getAdmins"),
//             ]);

//             const employeeData = await employeeRes.json();
//             const adminData = await adminRes.json();

//             setEmployees(employeeData.employees || employeeData.data || employeeData);
//             setAdmins(adminData.admins || adminData.data || adminData);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             setEmployees([]);
//             setAdmins([]);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const totalUsers = employees.length + admins.length;

//     const cards = [
//         {
//             title: "Total Users",
//             value: totalUsers.toLocaleString(),
//             subtitle: "+12% from last month",
//             subtitleClass: "text-white/80",
//             icon: (
//                 <FiUsers
//                     size={22}
//                     className="text-white"
//                 />
//             ),
//             wrapperClass: "bg-gradient-to-br from-blue-600 to-purple-400 text-white",
//             iconBg: "bg-white/20",
//         },
//         {
//             title: "Employees",
//             value: employees.length.toLocaleString(),
//             subtitle: "97% ACTIVE",
//             subtitleClass: "text-emerald-500 font-semibold",
//             icon: (
//                 <FiBriefcase
//                     size={22}
//                     className="text-indigo-600"
//                 />
//             ),
//             wrapperClass: "bg-white text-gray-900 shadow-lg",
//             iconBg: "bg-indigo-50",
//         },
//         {
//             title: "Admins",
//             value: admins.length.toLocaleString(),
//             subtitle: "PRIVILEGED ACCESS",
//             subtitleClass: "text-orange-500 font-semibold",
//             icon: (
//                 <FiShield
//                     size={22}
//                     className="text-indigo-600"
//                 />
//             ),
//             wrapperClass: "bg-white text-gray-900 shadow-lg",
//             iconBg: "bg-indigo-50",
//         },
//     ];

//     // return (
//     //     <div className="px-4 py-6">
//     //         <div className="flex flex-col gap-6 md:flex-row">
//     //             {cards.map((card, index) => (
//     //                 <div
//     //                     key={index}
//     //                     className={`relative h-[150px] w-full flex-shrink-0 overflow-hidden rounded-3xl md:w-[280px] ${card.wrapperClass}`}
//     //                 >
//     //                     <div className="flex h-full w-full flex-col justify-between px-6 py-5">
//     //                         <div className="flex items-start justify-between">
//     //                             <div>
//     //                                 <h3 className="text-sm font-medium opacity-90">{card.title}</h3>
//     //                                 <p className={`mt-1 text-xs tracking-wide ${card.subtitleClass}`}>{card.subtitle}</p>
//     //                             </div>
//     //                             <div className={`flex h-9 w-9 items-center justify-center rounded-full ${card.iconBg}`}>{card.icon}</div>
//     //                         </div>
//     //                         <p className="text-3xl font-bold leading-tight md:text-4xl">{card.value}</p>
//     //                         {/* Decorative Blur */}
//     //                         <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/20 blur-3xl"></div>
//     //                         <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
//     //                     </div>
//     //                 </div>
//     //             ))}
//     //         </div>
//     //     </div>
//   // );

//   return (
//       <div className="px-4 py-6">
//           <div className="flex flex-col gap-6 md:flex-row">
//               {cards.map((card, index) => (
//                   <div
//                       key={index}
//                       className={`relative h-[240px] w-full flex-shrink-0 overflow-hidden rounded-3xl md:w-[400px] lg:w-[420px] ${card.wrapperClass}`}
//                   >
//                       <div className="flex h-full w-full flex-col justify-between px-8 py-8">
//                           <div className="flex items-start justify-between">
//                               <div>
//                                   <h3 className="text-lg font-semibold opacity-90">{card.title}</h3>
//                                   <p className={`mt-2 text-base tracking-wide ${card.subtitleClass}`}>{card.subtitle}</p>
//                               </div>
//                               <div className={`flex h-14 w-14 items-center justify-center rounded-full ${card.iconBg}`}>{card.icon}</div>
//                           </div>
//                           <p className="text-6xl font-bold leading-tight md:text-7xl">{card.value}</p>
//                           {/* Decorative Blur - perfectly scaled */}
//                           <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-white/20 blur-3xl"></div>
//                           <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-white/10 blur-2xl"></div>
//                       </div>
//                   </div>
//               ))}
//           </div>
//       </div>
//   );


// };

// export default UserCard;


import React, { useEffect, useState } from "react";
import { FiUsers, FiBriefcase, FiShield } from "react-icons/fi";

const UserCard = () => {
    const [employees, setEmployees] = useState([]);
    const [admins, setAdmins] = useState([]);

    const fetchData = async () => {
        try {
            const [employeeRes, adminRes] = await Promise.all([
                fetch("http://localhost:4000/employee/allEmployee"),
                fetch("http://localhost:4000/getAdmins"),
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

    const cards = [
        {
            title: "Total Users",
            value: totalUsers.toLocaleString(),
            subtitle: "+12% from last month",
            subtitleClass: "text-white/80",
            icon: (
                <FiUsers
                    size={22}
                    className="text-white"
                />
            ),
            wrapperClass: "bg-gradient-to-br from-blue-600 to-purple-400 text-white",
            iconBg: "bg-white/20",
        },
        {
            title: "Employees",
            value: employees.length.toLocaleString(),
            subtitle: "97% ACTIVE",
            subtitleClass: "text-emerald-500 font-semibold",
            icon: (
                <FiBriefcase
                    size={22}
                    className="text-indigo-600"
                />
            ),
            wrapperClass: "bg-white text-gray-900 shadow-lg",
            iconBg: "bg-indigo-50",
        },
        {
            title: "Admins",
            value: admins.length.toLocaleString(),
            subtitle: "PRIVILEGED ACCESS",
            subtitleClass: "text-orange-500 font-semibold",
            icon: (
                <FiShield
                    size={22}
                    className="text-indigo-600"
                />
            ),
            wrapperClass: "bg-white text-gray-900 shadow-lg",
            iconBg: "bg-indigo-50",
        },
    ];

    return (
        <div className="px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
            {/* responsive layout: stack on mobile, 2 columns on md, 3 on lg */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`relative flex w-full flex-col overflow-hidden rounded-3xl ${card.wrapperClass} min-h-[180px] sm:min-h-[200px] lg:min-h-[220px]`}
                    >
                        <div className="flex h-full w-full flex-col justify-between px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="truncate text-base font-semibold opacity-90 sm:text-lg">{card.title}</h3>
                                    <p className={`mt-1 text-xs tracking-wide sm:text-sm ${card.subtitleClass}`}>{card.subtitle}</p>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14 ${card.iconBg}`}>
                                    {card.icon}
                                </div>
                            </div>

                            <p className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl xl:text-7xl">{card.value}</p>

                            {/* Decorative Blur - responsive size/position */}
                            <div className="pointer-events-none absolute -bottom-24 -right-24 h-40 w-40 rounded-full bg-white/20 blur-3xl sm:h-48 sm:w-48 lg:h-56 lg:w-56" />
                            <div className="pointer-events-none absolute -left-24 -top-24 h-32 w-32 rounded-full bg-white/10 blur-2xl sm:h-40 sm:w-40 lg:h-56 lg:w-56" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserCard;