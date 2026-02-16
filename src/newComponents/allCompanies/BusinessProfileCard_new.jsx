import axios from "axios";
import { useState } from "react";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";

const BusinessProfileCard = ({
  _id,
  companyName,
  industry,
  email,
  phoneNumber,
  website,
  logo,
  numberOfEmployees,
  deals = 0,
  value = "$0",
  status,
  onDelete,
  onEdit,
}) => {
  const displayName = companyName || "N/A";
  const displayStatus = status?.toLowerCase() === "active" ? "Active" : "Pending";
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = async () => {
    if (!_id) return;
    if (!window.confirm(`Are you sure you want to delete ${displayName}?`)) return;

    try {
      const res = await axios.delete(`http://localhost:4000/company/delete/${_id}`);
      if (res.status === 200) {
        alert("Company deleted successfully ✅");
        if (onDelete) onDelete(_id);
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      alert("Failed to delete company ❌");
    }
  };

  const handleView = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div 
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 border-2 border-gray-300 rounded-2xl shadow-md hover:shadow-xl hover:border-blue-400 bg-white transition-all duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Section - Company Info */}
        <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center font-bold text-xl flex-shrink-0 border-2 border-blue-700 overflow-hidden shadow-lg">
            {logo ? (
              <img src={logo} alt={`${displayName} logo`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white">{displayName[0] || "?"}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate text-lg">{displayName}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <p className="text-base font-semibold text-gray-700 truncate">{industry || "Not specified"}</p>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full flex-shrink-0 ${
                  displayStatus === "Active" ? "bg-green-400 text-white" : "bg-yellow-400 text-gray-900"
                }`}
              >
                {displayStatus}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium mt-1">{email || "No email"}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-8 px-4 flex-shrink-0 border-l-2 border-gray-200 pl-6 hidden md:flex">
          <div className="text-center">
            <p className="font-bold text-gray-900 text-2xl">{deals}</p>
            <p className="text-xs text-gray-600 font-bold mt-1 uppercase">Deals</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-green-600 text-2xl">{value}</p>
            <p className="text-xs text-gray-600 font-bold mt-1 uppercase">Value</p>
          </div>
        </div>

        {/* Actions Section */}
        <div className={`flex items-center gap-3 transition-all duration-300 ${
          isHovered ? "opacity-100" : "opacity-90"
        }`}>
          <button
            onClick={handleView}
            title="View details"
            className="p-3 rounded-lg bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white transition-all duration-200 flex-shrink-0 group/btn shadow-md hover:shadow-lg"
          >
            <MdVisibility size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button
            onClick={() =>
              onEdit &&
              onEdit({ _id, companyName, industry, status, email, phoneNumber, website, numberOfEmployees, deals, value })
            }
            title="Edit company"
            className="p-3 rounded-lg bg-amber-100 hover:bg-amber-600 text-amber-600 hover:text-white transition-all duration-200 flex-shrink-0 group/btn shadow-md hover:shadow-lg"
          >
            <MdEdit size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleDelete}
            title="Delete company"
            className="p-3 rounded-lg bg-red-100 hover:bg-red-600 text-red-600 hover:text-white transition-all duration-200 flex-shrink-0 group/btn shadow-md hover:shadow-lg"
          >
            <MdDelete size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 border-b-4 border-blue-800 p-8 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-white">Company Details</h2>
                <p className="text-blue-100 text-base font-semibold mt-2">{displayStatus} Company Status</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-2xl leading-none transition-all font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              {/* Company Header */}
              <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border-2 border-blue-200">
                <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center font-bold text-3xl border-3 border-blue-600 overflow-hidden flex-shrink-0 shadow-lg">
                  {logo ? (
                    <img src={logo} alt={`${displayName} logo`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-blue-600">{displayName[0] || "?"}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{displayName}</h3>
                  <p className="text-base font-semibold text-gray-700 mt-2">{industry || "Not specified"}</p>
                  <span className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-bold ${
                    displayStatus === "Active"
                      ? "bg-green-400 text-white"
                      : "bg-yellow-400 text-gray-900"
                  }`}>
                    {displayStatus}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 shadow-sm">
                  <p className="text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">Email Address</p>
                  <p className="text-gray-900 font-bold text-base break-all">{email || "N/A"}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 shadow-sm">
                  <p className="text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">Phone Number</p>
                  <p className="text-gray-900 font-bold text-base">{phoneNumber || "N/A"}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 shadow-sm md:col-span-2">
                  <p className="text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">Website</p>
                  <p className="text-blue-700 font-bold text-base truncate">{website || "N/A"}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 shadow-sm">
                  <p className="text-gray-700 text-sm font-bold mb-3 uppercase tracking-wide">Total Employees</p>
                  <p className="text-gray-900 font-bold text-base">{numberOfEmployees || 0}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-100 rounded-2xl p-6 border-3 border-blue-600 text-center shadow-md">
                  <p className="text-blue-700 text-sm font-bold mb-2 uppercase tracking-wide">Total Deals</p>
                  <p className="text-4xl font-bold text-blue-600">{deals}</p>
                </div>
                <div className="bg-green-100 rounded-2xl p-6 border-3 border-green-600 text-center shadow-md">
                  <p className="text-green-700 text-sm font-bold mb-2 uppercase tracking-wide">Total Value</p>
                  <p className="text-4xl font-bold text-green-600">{value}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-slate-100 to-blue-50 border-t-2 border-gray-300 p-8 flex justify-end gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-base"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessProfileCard;