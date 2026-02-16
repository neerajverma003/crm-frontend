import React from "react";
import { Users, CheckCircle, Clock, AlertCircle } from "lucide-react";

const EmployeeOwnLeadCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-200"></div>
        ))}
      </>
    );
  }

  const cards = [
    {
      title: "MY LEADS",
      value: stats.totalLeads || 0,
      subtitle: "Total leads assigned",
      gradient: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      icon: Users,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      title: "CONVERTED",
      value: stats.convertedLeads || 0,
      subtitle: "Successfully converted",
      gradient: "from-green-50 to-green-100",
      border: "border-green-200",
      icon: CheckCircle,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
    },
    {
      title: "IN PROGRESS",
      value: stats.inProgressLeads || 0,
      subtitle: "Currently working on",
      gradient: "from-yellow-50 to-yellow-100",
      border: "border-yellow-200",
      icon: Clock,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-600",
    },
    {
      title: "PENDING",
      value: stats.pendingLeads || 0,
      subtitle: "Awaiting action",
      gradient: "from-orange-50 to-orange-100",
      border: "border-orange-200",
      icon: AlertCircle,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 shadow-sm transition-all duration-300 hover:shadow-lg border ${card.border}`}
          >
            {/* Icon */}
            <div className="mb-4 flex items-start justify-between">
              <div className={`rounded-xl ${card.iconBg} p-2.5`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="mb-1 text-xs font-medium tracking-wide text-gray-600">
                {card.title}
              </div>
              <div className="mb-2 text-3xl font-bold text-gray-900">
                {card.value}
              </div>
              <div className="text-xs text-gray-500">
                {card.subtitle}
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5"></div>
          </div>
        );
      })}
    </>
  );
};

export default EmployeeOwnLeadCards;
