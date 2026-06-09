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
          res = await fetch(`${import.meta.env.VITE_API_URL}/superadminmylead/stats/${userId}`);
          const data = await res.json();
          console.log('Superadmin stats:', data);

          if (data.success) {
            setStats(data.data);
          } else {
            setError('Failed to fetch stats');
          }
        } else {
          // Fetch stats from employee lead endpoint
          res = await fetch(`${import.meta.env.VITE_API_URL}/employeelead/employee/${userId}`);
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
      title: "All Leads",
      value: stats.totalLeads,
      subtitle: "All leads assigned to you",
      bgClass: "bg-[#eaf2ff]",
      textClass: "text-[#3a4b6b]",
      valueClass: "text-[#1a2333]",
      subtitleClass: "text-[#6b7b9e]",
      icon: TrendingUp,
      iconBg: "bg-[#d4e4ff]",
      iconColor: "text-[#3b82f6]",
    },
    {
      title: "Follow Up",
      value: stats.followUp,
      subtitle: "Leads needing follow up",
      bgClass: "bg-[#fbbc05]",
      textClass: "text-white",
      valueClass: "text-white",
      subtitleClass: "text-white/80",
      icon: MessageSquare,
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "Interested",
      value: stats.interested,
      subtitle: "Interested leads",
      bgClass: "bg-[#2ed668]",
      textClass: "text-white",
      valueClass: "text-white",
      subtitleClass: "text-white/80",
      icon: Flame,
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "Connected",
      value: stats.connected,
      subtitle: "Leads you connected with",
      bgClass: "bg-[#4285f4]",
      textClass: "text-white",
      valueClass: "text-white",
      subtitleClass: "text-white/80",
      icon: ThermometerSun,
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "Not Connected",
      value: stats.notConnected,
      subtitle: "Leads not yet connected",
      bgClass: "bg-[#808694]",
      textClass: "text-white",
      valueClass: "text-white",
      subtitleClass: "text-white/80",
      icon: Snowflake,
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
  ];

  return (
    <div 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full mb-3 pb-2"
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`w-full group relative overflow-hidden rounded-xl p-3 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${card.bgClass} ${card.textClass}`}
          >
            <div className="relative z-10 flex flex-col items-start h-full">
              <div className={`rounded-lg sm:rounded-xl ${card.iconBg} p-1.5 sm:p-2 mb-2 sm:mb-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-inner`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${card.iconColor}`} />
              </div>
              
              <div className={`text-[9px] sm:text-[11px] font-bold tracking-wider uppercase mb-0.5 sm:mb-1 leading-tight line-clamp-1`}>
                {card.title}
              </div>
              
              <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 sm:mb-2 ${card.valueClass}`}>
                {card.value}
              </div>
              
              <div className={`text-[9px] sm:text-[11px] mt-auto font-medium leading-tight ${card.subtitleClass} line-clamp-2`}>
                {card.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyLeadCard;
