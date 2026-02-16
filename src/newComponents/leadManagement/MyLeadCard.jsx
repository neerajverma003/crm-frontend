import React, { useEffect, useState } from "react";
import { TrendingUp, Flame, ThermometerSun, Snowflake, MessageSquare } from "lucide-react";

const MyLeadCard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    followUp: 0,
    interested: 0,
    connected: 0,
    notConnected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");



  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all leads and filter by current user (assume userId is in localStorage or context)
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('role');
        if (!userId) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        let res;
        if (userRole && userRole.toLowerCase() === 'superadmin') {
          // Fetch stats from superadmin mylead endpoint
          res = await fetch(`http://localhost:4000/superadminmylead/stats/${userId}`);
          const data = await res.json();
          console.log('Superadmin stats:', data);

          if (data.success) {
            setStats(data.data);
          } else {
            setError('Failed to fetch stats');
          }
        } else {
          // Fetch stats from employee lead endpoint
          res = await fetch(`http://localhost:4000/employeelead/employee/${userId}`);
          const data = await res.json();
          console.log(data);
          console.log(Array.isArray(data.data), data.data);

          if (data.success && Array.isArray(data.leads)) {
            // Filter leads assigned to current user
            const myLeads = data.leads.filter(lead => lead.employee._id === userId || lead.employeeId === userId);
            const followUp = myLeads.filter(lead => (lead.leadInterestStatus || '').toLowerCase() === 'follow up').length;
            const interested = myLeads.filter(lead => (lead.leadInterestStatus || '').toLowerCase() === 'interested').length;
            const connected = myLeads.filter(lead => (lead.leadInterestStatus || '').toLowerCase() === 'connected').length;
            const notConnected = myLeads.filter(lead => (lead.leadInterestStatus || '').toLowerCase() === 'not connected').length;
            console.log(myLeads,followUp,interested,connected,notConnected);

            setStats({
              totalLeads: myLeads.length,
              followUp,
              interested,
              connected,
              notConnected,
            });
          } else {
            setError("Failed to fetch stats");
          }
        }
      } catch (err) {
        setError("Error fetching stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  console.log(stats);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-200"></div>
        ))}
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-500 mb-6">{error}</div>;
  }

  const cards = [
    {
      title: "ALL LEADS",
      value: stats.totalLeads,
      subtitle: "All leads assigned to you",
      gradient: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      icon: TrendingUp,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      title: "FOLLOW UP",
      value: stats.followUp,
      subtitle: "Leads needing follow up",
      gradient: "from-yellow-400 to-yellow-500",
      textColor: "text-white",
      icon: MessageSquare,
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "INTERESTED",
      value: stats.interested,
      subtitle: "Interested leads",
      gradient: "from-green-400 to-green-500",
      textColor: "text-white",
      icon: Flame,
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "CONNECTED",
      value: stats.connected,
      subtitle: "Leads you connected with",
      gradient: "from-blue-400 to-blue-500",
      textColor: "text-white",
      icon: ThermometerSun,
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "NOT CONNECTED",
      value: stats.notConnected,
      subtitle: "Leads not yet connected",
      gradient: "from-gray-400 to-gray-500",
      textColor: "text-white",
      icon: Snowflake,
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${card.border || ""}`}
          >
            {/* Icon */}
            <div className="mb-4 flex items-start justify-between">
              <div className={`rounded-xl ${card.iconBg} p-2.5`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
            {/* Content */}
            <div>
              <div className={`mb-1 text-xs font-medium tracking-wide ${card.textColor || "text-gray-600"}`}>
                {card.title}
              </div>
              <div className={`mb-2 text-3xl font-bold ${card.textColor || "text-gray-900"}`}>
                {card.value}
              </div>
              <div className={`text-xs ${card.textColor ? "text-white/80" : "text-gray-500"}`}>
                {card.subtitle}
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5"></div>
          </div>
        );
      })}
    </div>
  );
};

export default MyLeadCard;
