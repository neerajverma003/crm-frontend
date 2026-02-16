const SuperAdminAttendanceCard = () => {
    const stats = [
        { value: "450", label: "Total Employees", change: "+4%", trend: "up", icon: "👥" },
        { value: "380", label: "Present", change: "+12%", trend: "up", icon: "✅" },
        { value: "40", label: "Absent", change: "+2%", trend: "up", icon: "❌" },
        { value: "30", label: "Late Check-ins", change: "-1%", trend: "down", icon: "🕒" },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-500 hover:shadow-2xl hover:ring-2 hover:ring-indigo-100"
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
                        className={`relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl p-3 text-2xl font-bold transition-transform duration-300 group-hover:scale-110 ${
                            index === 0 ? "bg-indigo-100" : index === 1 ? "bg-emerald-100" : index === 2 ? "bg-rose-100" : "bg-amber-100"
                        }`}
                    >
                        {stat.icon}
                    </div>

                    <p className="mb-1 text-3xl font-bold leading-tight text-gray-900">{stat.value}</p>
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500 transition-colors group-hover:text-gray-700">
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