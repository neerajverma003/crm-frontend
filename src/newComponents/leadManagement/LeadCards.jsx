// import React, { useEffect, useState } from "react";

// const LeadCards = () => {
//     const [leads, setLeads] = useState([]);

//     // Fetch leads from API
//     const fetchLeadData = async () => {
//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/leads/`);
//             const result = await response.json();
//             console.log(result);
//             if (result.success) {
//                 setLeads(result.data || result); // Adjust if API returns data array inside 'data'
//             } else {
//                 setLeads([]);
//             }
//         } catch (error) {
//             console.error("Error fetching lead data:", error);
//             setLeads([]);
//         }
//     };

//     useEffect(() => {
//         fetchLeadData();
//     }, []);
//   const hotLeads = leads.filter(
//     (lead) =>
//       (lead.status && lead.status.trim().toLowerCase() === "hot") ||
//       (lead.leadStatus && lead.leadStatus.trim().toLowerCase() === "hot")
//   ); 
//     const totalValue = leads.reduce((acc, lead) => {
//     const val = parseFloat(lead.value); // convert to number
//     return acc + (isNaN(val) ? 0 : val);
//   }, 0);   return (
//         <>
//             <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
//                 <div className="mb-6 flex w-full justify-between gap-6">
//                     <div className="text-xl font-semibold text-black">Total Leads</div>
//                 </div>
//                 <div className="text-2xl font-semibold text-black">{leads.length}</div>
//             </div>
//             <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
//                 <div className="mb-6 flex w-full justify-between gap-6">
//                     <div className="text-xl font-semibold text-black">Hot Leads</div>
//                 </div>
//                 <div className="text-2xl font-semibold text-black">{hotLeads.length}</div>
//             </div>

//                         <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
//                 <div className="mb-6 flex w-full justify-between gap-6">
//                     <div className="text-xl font-semibold text-black">Total Value</div>
//                 </div>
//                 <div className="text-2xl font-semibold text-black">{totalValue}</div>
//             </div>
//         </>
//     );
// };

// export default LeadCards;

// import React, { useEffect, useState } from "react";

// const LeadCards = () => {
//   const [stats, setStats] = useState({
//     totalLeads: 0,
//     hotLeads: 0,
//     warmLeads: 0,
//     coldLeads: 0,
//     convertedLeads: 0,
//     lostLeads: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch stats from both endpoints
//   const fetchLeadStats = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [normalRes, empRes] = await Promise.all([
//         fetch(`${import.meta.env.VITE_API_URL}/leads/stats`),
//         fetch(`${import.meta.env.VITE_API_URL}/employeelead/stats`),
//       ]);

//       const normalStats = await normalRes.json();
//       const empStats = await empRes.json();

//       if (normalStats.success && empStats.success) {
//         const normalData = normalStats.data || {};
//         const empData = empStats.data || {};

//         // Combine stats from both sources
//         setStats({
//           totalLeads:
//             (normalData.totalLeads || 0) + (empData.totalLeads || 0),
//           hotLeads: (normalData.hotLeads || 0) + (empData.hotLeads || 0),
//           warmLeads:
//             (normalData.warmLeads || 0) + (empData.warmLeads || 0),
//           coldLeads: (normalData.coldLeads || 0) + (empData.coldLeads || 0),
//           convertedLeads:
//             (normalData.convertedLeads || 0) +
//             (empData.convertedLeads || 0),
//           lostLeads: (normalData.lostLeads || 0) + (empData.lostLeads || 0),
//         });
//       } else {
//         setError("Failed to fetch stats");
//       }
//     } catch (error) {
//       console.error("Error fetching lead stats:", error);
//       setError("Error fetching stats");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeadStats();
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center text-gray-500">Loading statistics...</div>
//     );
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   return (
//     <>
//       {/* Total Leads */}
//       <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
//         <div className="mb-6 flex w-full justify-between gap-6">
//           <div className="text-xl font-semibold text-black">Total Leads</div>
//         </div>
//         <div className="text-2xl font-semibold text-black">
//           {stats.totalLeads}
//         </div>
//       </div>

//       {/* Hot Leads */}
//       <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
//         <div className="mb-6 flex w-full justify-between gap-6">
//           <div className="text-xl font-semibold text-black">Hot Leads</div>
//         </div>
//         <div className="text-2xl font-semibold text-black">
//           {stats.hotLeads}
//         </div>
//       </div>

//       {/* Warm Leads */}
//       <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
//         <div className="mb-6 flex w-full justify-between gap-6">
//           <div className="text-xl font-semibold text-black">Warm Leads</div>
//         </div>
//         <div className="text-2xl font-semibold text-black">
//           {stats.warmLeads}
//         </div>
//       </div>

//       {/* Cold Leads */}
//       <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
//         <div className="mb-6 flex w-full justify-between gap-6">
//           <div className="text-xl font-semibold text-black">Cold Leads</div>
//         </div>
//         <div className="text-2xl font-semibold text-black">
//           {stats.coldLeads}
//         </div>
//       </div>
//     </>
//   );
// };

// export default LeadCards;
 



import React, { useEffect, useState } from "react";
import { TrendingUp, Flame, ThermometerSun, Snowflake, MessageSquare } from "lucide-react";

const LeadCards = ({ activeTab, selectedEmployeeId }) => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    convertedLeads: 0,
    lostLeads: 0,
    followUp: 0,
    interested: 0,
    connected: 0,
    notConnected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [todaysLead,setTodaysLead] = useState([]);

  const fetchTodaysLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/leads/gettodaysleads`);
      const json = await res.json();  
      if (json.success) {
        setTodaysLead(json.data || []);
      } else {
        setError("Failed to fetch stats");
      }
    } catch (error) {
      console.error("Error fetching lead stats:", error);
      setError("Error fetching stats");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    fetchTodaysLeads();
  }, [activeTab, selectedEmployeeId]);
// gbja
  const fetchLeadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // If employee-specific view, fetch that employee's leads and compute counts
      if (activeTab === "employee-own" && selectedEmployeeId) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/employeelead/employee/${selectedEmployeeId}`);
        const json = await res.json();
        let leadsArr = [];
        if (json && Array.isArray(json.leads)) leadsArr = json.leads;
        else if (json && Array.isArray(json.data)) leadsArr = json.data;
        else if (Array.isArray(json)) leadsArr = json;

        const totalLeads = leadsArr.length;
        const todaysLeads= leadsArr.filter(lead => {
          const createdAt = new Date(lead.createdAt);
          const today = new Date();
          return createdAt.getDate() === today.getDate() && createdAt.getMonth() === today.getMonth() && createdAt.getFullYear() === today.getFullYear();
        });
        setTodaysLead(todaysLeads);

        const normalize = (v) => (v || "").toString().toLowerCase().replace(/[_\-\s]/g, "").replace(/[^a-z]/g, "");
        let followUp = 0, interested = 0, connected = 0, notConnected = 0;
        for (const l of leadsArr) {
          const s = normalize(l.leadInterestStatus || l.status || l.leadStatus || l.interestStatus || "");
          if (s === "followup") followUp++;
          else if (s === "interested") interested++;
          else if (s === "connected") connected++;
          else if (s === "notconnected") notConnected++;
        }

        setStats(prev => ({ ...prev, totalLeads, followUp, interested, connected, notConnected }));
      }
      else if (activeTab === "employee-own" && !selectedEmployeeId) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/employeelead/getAllEmployeeLead`);
        const json = await res.json();

        let leadsArr = [];
        if (json && Array.isArray(json.leads)) leadsArr = json.leads;
        else if (json && Array.isArray(json.data)) leadsArr = json.data;
        else if (Array.isArray(json)) leadsArr = json;

        const totalLeads = leadsArr.length;
        const normalize = (v) => (v || "").toString().toLowerCase().replace(/[_\-\s]/g, "").replace(/[^a-z]/g, "");
        let followUp = 0, interested = 0, connected = 0, notConnected = 0;
        for (const l of leadsArr) {
          const s = normalize(l.leadInterestStatus || l.status || l.leadStatus || l.interestStatus || "");
          if (s === "followup") followUp++;
          else if (s === "interested") interested++;
          else if (s === "connected") connected++;
          else if (s === "notconnected") notConnected++;
        }

        setStats(prev => ({ ...prev, totalLeads, followUp, interested, connected, notConnected }));
      }
      else {
        const [normalRes, empRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/leads/stats`),
          fetch(`${import.meta.env.VITE_API_URL}/employeelead/stats`),
        ]);

        const normalStats = await normalRes.json();
        const empStats = await empRes.json();

        if (normalStats.success && empStats.success) {
          const normalData = normalStats.data || {};
          const empData = empStats.data || {};

          setStats({
            totalLeads: (normalData.totalLeads || 0) + (empData.totalLeads || 0),
            hotLeads: (normalData.hotLeads || 0) + (empData.hotLeads || 0),
            warmLeads: (normalData.warmLeads || 0) + (empData.warmLeads || 0),
            coldLeads: (normalData.coldLeads || 0) + (empData.coldLeads || 0),
            convertedLeads: (normalData.convertedLeads || 0) + (empData.convertedLeads || 0),
            lostLeads: (normalData.lostLeads || 0) + (empData.lostLeads || 0),
          });
        } else {
          setError("Failed to fetch stats");
        }
      }
    } catch (error) {
      console.error("Error fetching lead stats:", error);
      setError("Error fetching stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedEmployeeId]);

  if (loading) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-200"></div>
        ))}
      </>
    );
  }

  if (error) {
    return <div className="col-span-4 text-center text-red-500">{error}</div>;
  }
  let cards =[];

  const SuperAdminCards = [
    {
      title: "TOTAL LEADS",
      value: stats.totalLeads.toLocaleString(),
      subtitle: "+14% from last month",
      gradient: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      icon: TrendingUp,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",                                                                           
    },
    {
      title: "Today's LEADS",
      value: todaysLead.length,
      subtitle: "+14% from last month",
      gradient: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      icon: TrendingUp,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600", 
    },
    {
      title: "HOT LEADS",
      value: stats.hotLeads,
      subtitle: "Ready for immediate conversion",
      gradient: "from-red-400 to-red-500",
      textColor: "text-white",
      icon: Flame,
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "WARM LEADS",
      value: stats.warmLeads,
      subtitle: "Regularly engaged prospects",
      gradient: "from-orange-400 to-orange-500",
      textColor: "text-white",
      icon: ThermometerSun,
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "COLD LEADS",
      value: stats.coldLeads,
      subtitle: "Drip campaign active",
      gradient: "from-cyan-400 to-cyan-500",
      textColor: "text-white",
      icon: Snowflake,
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
  ];

  const employeeCards = [
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
      title: "Today's LEADS",
      value: todaysLead.length,
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

  if(activeTab === "all-leads"){
    cards = SuperAdminCards;
  } else {
    cards = employeeCards;
  }

  return (
    <>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`flex-none w-[150px] md:w-auto snap-start group relative overflow-hidden rounded-xl p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-gradient-to-br ${card.gradient} ${card.border || ""}`}
          >
            <div className="relative z-10 flex flex-col items-start h-full">
              <div className={`rounded-lg sm:rounded-xl ${card.iconBg} p-1.5 sm:p-2 mb-2 sm:mb-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-inner`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${card.iconColor}`} />
              </div>
              
              <div className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-0.5 sm:mb-1 leading-tight line-clamp-1 ${card.textColor || "text-gray-700"}`}>
                {card.title}
              </div>
              
              <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-1 sm:mb-2 ${card.textColor || "text-gray-900"}`}>
                {card.value}
              </div>
              
              <div className={`text-[10px] sm:text-xs mt-auto font-medium leading-tight line-clamp-2 ${card.textColor ? "text-white/90" : "text-gray-600"}`}>
                {card.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default LeadCards;