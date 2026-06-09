import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const SuperAdminAttendanceCard = ({ statsData }) => {
    const defaultStats = { total: 0, present: 0, absent: 0, late: 0 };
    const data = statsData || defaultStats;
    
    const stats = [
        { value: data.total, label: "Total Employees", change: "+0%", trend: "up", icon: <FaUsers className="w-8 h-8 text-indigo-600" /> },
        { value: data.present, label: "Present", change: "+0%", trend: "up", icon: <FaCheckCircle className="w-8 h-8 text-emerald-600" /> },
        { value: data.absent, label: "Absent", change: "+0%", trend: "up", icon: <FaTimesCircle className="w-8 h-8 text-rose-600" /> },
        { value: data.late, label: "Late Check-ins", change: "+0%", trend: "down", icon: <FaClock className="w-8 h-8 text-amber-600" /> },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-white p-4 md:p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-500 hover:shadow-2xl hover:ring-2 hover:ring-indigo-100"
                >
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${
                            index === 0
                                ? "from-indigo-500 to-purple-600"
                                : index === 1
                                  ? "from-emerald-500 to-teal-600"
                                  : index === 2
                                    ? "from-rose-500 to-red-600"
                                    : "from-amber-500 to-orange-600"
                        } opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-5`}
                    />

                    <div
                        className={`relative z-10 mb-3 md:mb-4 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl p-2 md:p-3 text-xl md:text-2xl font-bold transition-transform duration-300 group-hover:scale-110 ${
                            index === 0 ? "bg-indigo-100" : index === 1 ? "bg-emerald-100" : index === 2 ? "bg-rose-100" : "bg-amber-100"
                        }`}
                    >
                        {stat.icon}
                    </div>

                    <p className="mb-0.5 md:mb-1 text-2xl md:text-3xl font-bold leading-tight text-gray-900">{stat.value}</p>
                    <p className="mb-2 md:mb-3 text-[10px] md:text-xs font-medium uppercase tracking-wide text-gray-500 transition-colors group-hover:text-gray-700">
                        {stat.label}
                    </p>
                    <div className="flex items-center gap-1">
                        <span className={`text-xs font-semibold ${stat.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>{stat.change}</span>
                        <span className={`h-2 w-2 rounded-full ${stat.trend === "up" ? "bg-emerald-500" : "bg-rose-500"}`} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SuperAdminAttendanceCard;