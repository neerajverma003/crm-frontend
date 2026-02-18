// import React, { useState, useCallback } from "react";
// import { cardData } from "./data.js";
// import MyCards from "../UserManagement/MyCards.jsx";
// import SearchLead from "./SearchLead.jsx";
// import SearchStatus from "./SearchStatus.jsx";
// import AddLead from "./AddLead.jsx";
// import LeadTable from "./LeadTable.jsx";
// import LeadCards from "./LeadCards.jsx";
// import MyAssignedLeads from "./MyAssignedLeads.jsx";

// const MainLeadManagement = () => {
//   const [searchText, setSearchText] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("All Status");
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const [activeTab, setActiveTab] = useState("all-leads");

//   // Handle search text change
//   const handleSearchChange = useCallback((text) => {
//     setSearchText(text);
//   }, []);

//   // Handle status filter change
//   const handleStatusChange = useCallback((status) => {
//     setSelectedStatus(status);
//   }, []);

//   // Handle successful lead addition
//   const handleLeadAdded = useCallback(() => {
//     setRefreshTrigger(prev => prev + 1);
//   }, []);

//   return (
//     <div className="max-h-[85vh] overflow-y-auto w-full max-w-full overflow-hidden">
//       <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 xl:p-6 overflow-y-auto overflow-x-hidden">
//         {/* Page Header */}
//         <div className="mb-4 xl:mb-6">
//           <h1 className="text-2xl xl:text-3xl font-bold text-gray-900 mb-1 xl:mb-2">Lead Management</h1>
//           <p className="text-sm xl:text-base text-gray-600">Track and manage your sales leads efficiently</p>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex items-center gap-3 mb-4">
//           <button
//             onClick={() => setActiveTab("all-leads")}
//             className={`px-4 py-2 rounded ${activeTab === 'all-leads' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
//           >
//             All Leads
//           </button>
//           <button
//             onClick={() => setActiveTab("assigned")}
//             className={`px-4 py-2 rounded ${activeTab === 'assigned' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
//           >
//             Assigned Leads
//           </button>
//         </div>

//         {activeTab === "all-leads" ? (
//           <>
//             {/* Stats Cards */}
//             {/* <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3 xl:gap-4 mb-4 xl:mb-6">
//               {cardData.map((card, index) => (
//                 <MyCards
//                   key={`lead-card-${index}-${card.title}`}
//                   title={card.title}
//                   value={card.value}
//                   icon={card.icon}
//                   description={card.description}
//                 />
//               ))}
//             </div> */}
//             <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3 xl:gap-4 mb-4 xl:mb-6">
//               <LeadCards/>
//             </div>
//             {/* Filters and Actions */}
//             <div className="mb-4 xl:mb-6 flex flex-col gap-3 xl:flex-row xl:gap-4 xl:justify-between xl:items-center">
//               <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full xl:w-auto min-w-0">
//                 <div className="flex-1 max-w-xs min-w-0">
//                   <SearchLead 
//                     onSearchChange={handleSearchChange}
//                     placeholder="Search leads..."
//                   />
//                 </div>
//                 <div className="flex-shrink-0">
//                   <SearchStatus 
//                     onStatusChange={handleStatusChange}
//                     selectedStatus={selectedStatus}
//                   />
//                 </div>
//               </div>
//               <div className="flex-shrink-0">
//                 <AddLead onLeadAdded={handleLeadAdded} />
//               </div>
//             </div>

//             {/* Lead Table */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] w-full overflow-hidden">
//               <LeadTable 
//                 searchText={searchText}
//                 selectedStatus={selectedStatus}
//                 refreshTrigger={refreshTrigger}
//               />
//             </div>
//           </>
//         ) : (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] w-full overflow-hidden">
//             <MyAssignedLeads />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainLeadManagement;


// import React, { useState, useCallback } from "react";
// import { cardData } from "./data.js";
// import MyCards from "../UserManagement/MyCards.jsx";
// import SearchLead from "./SearchLead.jsx";
// import SearchStatus from "./SearchStatus.jsx";
// import AddLead from "./AddLead.jsx";
// import LeadTable from "./LeadTable.jsx";
// import LeadCards from "./LeadCards.jsx";
// import MyAssignedLeads from "./MyAssignedLeads.jsx";

// const MainLeadManagement = () => {
//   const [searchText, setSearchText] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("All Status");
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const [activeTab, setActiveTab] = useState("all-leads");

//   // Handle search text change
//   const handleSearchChange = useCallback((text) => {
//     setSearchText(text);
//   }, []);

//   // Handle status filter change
//   const handleStatusChange = useCallback((status) => {
//     setSelectedStatus(status);
//   }, []);

//   // Handle successful lead addition
//   const handleLeadAdded = useCallback(() => {
//     setRefreshTrigger(prev => prev + 1);
//   }, []);

//   return (
//       <div className="min-h-dvh bg-[#f8fafc] py-4 sm:px-6 lg:px-8">
//           <div className="max-h-[85vh] w-full max-w-full overflow-hidden overflow-y-auto">
//               <div className="h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 xl:p-6">
//                   {/* Page Header */}
//                   <div className="mb-4 xl:mb-6">
//                       <h1 className="mb-1 text-2xl font-bold text-gray-900 xl:mb-2 xl:text-3xl">Lead Management</h1>
//                       <p className="text-sm text-gray-600 xl:text-base">Track and manage your sales leads efficiently</p>
//                   </div>

//                   {/* Tab Navigation */}
//                   <div className="mb-4 flex items-center gap-3">
//                       <button
//                           onClick={() => setActiveTab("all-leads")}
//                           className={`rounded px-4 py-2 ${activeTab === "all-leads" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
//                       >
//                           All Leads
//                       </button>
//                       <button
//                           onClick={() => setActiveTab("assigned")}
//                           className={`rounded px-4 py-2 ${activeTab === "assigned" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
//                       >
//                           Assigned Leads
//                       </button>
//                   </div>

//                   {activeTab === "all-leads" ? (
//                       <>
//                           {/* Stats Cards */}
//                           {/* <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3 xl:gap-4 mb-4 xl:mb-6">
//               {cardData.map((card, index) => (
//                 <MyCards
//                   key={`lead-card-${index}-${card.title}`}
//                   title={card.title}
//                   value={card.value}
//                   icon={card.icon}
//                   description={card.description}
//                 />
//               ))}
//             </div> */}
//                           <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-3 xl:mb-6 xl:grid-cols-4 xl:gap-4">
//                               <LeadCards />
//                           </div>
//                           {/* Filters and Actions */}
//                           <div className="mb-4 flex flex-col gap-3 xl:mb-6 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
//                               <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:gap-3 xl:w-auto">
//                                   <div className="min-w-0 max-w-xs flex-1">
//                                       <SearchLead
//                                           onSearchChange={handleSearchChange}
//                                           placeholder="Search leads..."
//                                       />
//                                   </div>
//                                   <div className="flex-shrink-0">
//                                       <SearchStatus
//                                           onStatusChange={handleStatusChange}
//                                           selectedStatus={selectedStatus}
//                                       />
//                                   </div>
//                               </div>
//                               <div className="flex-shrink-0">
//                                   <AddLead onLeadAdded={handleLeadAdded} />
//                               </div>
//                           </div>

//                           {/* Lead Table */}
//                           <div className="min-h-[400px] w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//                               <LeadTable
//                                   searchText={searchText}
//                                   selectedStatus={selectedStatus}
//                                   refreshTrigger={refreshTrigger}
//                               />
//                           </div>
//                       </>
//                   ) : (
//                       <div className="min-h-[400px] w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
//                           <MyAssignedLeads />
//                       </div>
//                   )}
//               </div>
//           </div>
//       </div>
//   );
// };

// export default MainLeadManagement;





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
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8fa] to-[#e9ecef] flex flex-col items-center py-10 px-2 sm:px-8">
      <div className="w-full max-w-[77rem] ml-5 mt-[-18px]  bg-white/90 rounded-3xl shadow-2xl p-0 border border-slate-100 overflow-hidden">
        {/* Header */}
        <header className="relative z-10 flex flex-col px-8 pt-10 pb-6 bg-gradient-to-r from-blue-50/80 to-slate-50/80 border-b border-slate-100">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 leading-tight drop-shadow-sm">Lead Management</h1>
          <p className="text-lg text-slate-600 font-medium">Monitor and qualify your incoming sales pipeline</p>
        </header>

        {/* Tab Navigation */}
        <section className="px-8 pt-6 pb-4 bg-white/80 border-b border-slate-100">
          <div className="flex items-center gap-3 flex-wrap">
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
        <section className="relative z-0 mb-0 px-8 pt-8 pb-4 bg-gradient-to-r from-white/80 to-blue-50/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <LeadCards activeTab={activeTab} selectedEmployeeId={selectedEmployeeId} />
          </div>
        </section>

        {/* Content based on active tab */}
        {activeTab === "all-leads" && (
          <>
            {/* Search, Filters, and Add Lead */}
            <section className="px-8 pt-2 pb-6 bg-white/80 border-b border-slate-100">
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
            <section className="px-6 w-full py-6 bg-white/95">
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
          <section className="px-6 w-full py-0 bg-white/95">
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