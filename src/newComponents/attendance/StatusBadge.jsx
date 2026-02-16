const StatusBadge = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case "Present":
        return "bg-green-500 text-white"; // On-time
      case "Grace Present":
        return "bg-black text-white"; // Grace period
      case "Late":
        return "bg-yellow-400 text-black"; // Late
      case "Half Day":
        return "bg-blue-500 text-white"; // Half day
      case "Absent":
        return "bg-red-500 text-white"; // Absent
      default:
        return "bg-gray-300 text-gray-800"; // Fallback
    }
  };

  // Display text — show “Present” for “Grace Present”
  const displayText = status === "Grace Present" ? "Present" : status;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${getColor()}`}
    >
      {displayText}
    </span>
  );
};

export default StatusBadge;