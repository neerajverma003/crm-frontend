import React, { useState, useCallback } from "react";
import LeadCards from "./LeadCards.jsx";
import SearchLead from "./SearchLead.jsx";
import SearchStatus from "./SearchStatus.jsx";
import AddLead from "./AddLead.jsx";
import LeadTable from "./LeadTable.jsx";
import EmployeeOwnLeads from "./EmployeeOwnLeads.jsx";


const MainLeadManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("all-leads");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(() => {
    try {
      return localStorage.getItem("selectedEmployeeId") || "";
    } catch (e) {
      return "";
    }
  });

  const handleSearchChange = useCallback((text) => {
    setSearchText(text);
  }, []);

  const handleStatusChange = useCallback((status) => {
    setSelectedStatus(status);
  }, []);

  const handleLeadAdded = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8fa] to-[#e9ecef] flex flex-col items-center py-4 sm:py-10 px-2 sm:px-8">
      <div className="w-full max-w-[77rem] bg-white/90 rounded-2xl sm:rounded-3xl shadow-2xl p-0 border border-slate-100 overflow-hidden">
        {/* Header */}
        <header className="relative z-10 flex flex-col px-4 sm:px-8 pt-6 sm:pt-10 pb-4 sm:pb-6 bg-gradient-to-r from-blue-50/80 to-slate-50/80 border-b border-slate-100">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2 leading-tight drop-shadow-sm">Lead Management</h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium">Monitor and qualify your incoming sales pipeline</p>
        </header>

        {/* Tab Navigation */}
        <section className="px-4 sm:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 bg-white/80 border-b border-slate-100 overflow-hidden w-full max-w-full">
          <div 
            className="flex flex-row overflow-x-auto whitespace-nowrap items-center gap-2 sm:gap-3 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => setActiveTab("all-leads")}
              className={`rounded px-4 py-2 font-medium transition-colors ${activeTab === "all-leads" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              All Leads
            </button>
            <button
              onClick={() => setActiveTab("employee-own")}
              className={`rounded px-4 py-2 font-medium transition-colors ${activeTab === "employee-own" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Employee Own Leads
            </button>
          </div>
        </section>
        <section className="relative z-0 mb-0 px-4 sm:px-8 pt-4 sm:pt-8 pb-2 sm:pb-4 bg-gradient-to-r from-white/80 to-blue-50/60">
          <div 
            className="flex flex-row overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 w-full pb-2 snap-x [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <LeadCards activeTab={activeTab} selectedEmployeeId={selectedEmployeeId} />
          </div>
        </section>

        {/* Content based on active tab */}
        {activeTab === "all-leads" && (
          <>
            {/* Search, Filters, and Add Lead */}
            <section className="px-4 sm:px-8 pt-2 pb-4 sm:pb-6 bg-white/80 border-b border-slate-100">
              <div className="flex flex-col gap-4">
                {/* Row 1: Search and Status */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex flex-1 flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-auto flex gap-3 items-end">
                      {/* Search Type Dropdown */}
                      <div className="flex-shrink-0 min-w-fit">
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Search By</label>
                        <select
                          value={searchType}
                          onChange={(e) => setSearchType(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all hover:border-gray-400"
                        >
                          <option value="name">Name</option>
                          <option value="phone">Phone/Contact Number</option>
                          <option value="groupNumber">Group Number</option>
                          <option value="email">Email</option>
                          <option value="destination">Destination</option>
                        </select>
                      </div>
                      {/* Search Bar */}
                      <div className="flex-1 min-w-0">
                        <SearchLead
                          onSearchChange={handleSearchChange}
                          placeholder={`Search leads by ${
                            searchType === "name" ? "name" :
                            searchType === "phone" ? "phone or contact number" :
                            searchType === "groupNumber" ? "group number" :
                            searchType === "email" ? "email" :
                            "destination"
                          }...`}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <SearchStatus
                        onStatusChange={handleStatusChange}
                        selectedStatus={selectedStatus}
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center">
                    <AddLead onLeadAdded={handleLeadAdded} />
                  </div>
                </div>

                {/* Row 2: Date Range Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Date Range:</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500 hidden sm:inline">to</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {(fromDate || toDate) && (
                    <button
                      onClick={() => {
                        setFromDate("");
                        setToDate("");
                      }}
                      className="px-3 py-2 text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors ml-auto sm:ml-2"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Lead Table */}
            <section className="px-3 sm:px-6 w-full py-4 sm:py-6 bg-white/95">
              <div className="overflow-hidden rounded-2xl shadow-lg border border-slate-100">
                <LeadTable
                  searchText={searchText}
                  searchType={searchType}
                  selectedStatus={selectedStatus}
                  refreshTrigger={refreshTrigger}
                  fromDate={fromDate}
                  toDate={toDate}
                />
              </div>
            </section>
          </>
        )}

        {activeTab === "employee-own" && (
          <section className="px-3 sm:px-6 w-full py-2 sm:py-4 bg-white/95">
              <div className="overflow-hidden rounded-2xl shadow-lg border border-slate-100">
              <EmployeeOwnLeads activeTab={activeTab} selectedEmployeeId={selectedEmployeeId} onEmployeeSelect={setSelectedEmployeeId} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MainLeadManagement;