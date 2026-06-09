import React, { useState, useCallback } from "react";
import EmployeeDataTable from "./EmployeeDataTable";
import AddEmployeeDataModal from "./AddEmployeeDataModal";

const MainEmployeeData = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchText, setSearchText] = useState("");

  const handleAddEmployeeData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setIsAddModalOpen(false);
  }, []);

  const handleSearchChange = useCallback((text) => {
    setSearchText(text);
  }, []);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pb-12">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 px-5 pt-6 pb-16 md:px-12 md:pt-8 md:pb-20">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-72 h-24 rounded-full bg-indigo-400/20 blur-2xl" />
        <div className="pointer-events-none absolute top-4 left-1/2 w-40 h-40 rounded-full bg-blue-400/10 blur-xl" />

        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Employee Data
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Employee Data Management
            </h1>
            <p className="text-blue-200 text-xs md:text-sm mt-1.5 max-w-sm">
              Manage employee information, contact details, and records.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content (pulled up) ── */}
      <div className="px-4 md:px-12 -mt-8 flex flex-col gap-4">
        
        {/* Controls Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-50 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 min-w-0 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all whitespace-nowrap shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Employee
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="md:bg-white md:rounded-2xl md:shadow-sm md:border md:border-blue-50 overflow-hidden">
          <div className="p-0 md:p-4">
            <EmployeeDataTable
              searchText={searchText}
              refreshTrigger={refreshTrigger}
              onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddEmployeeDataModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddEmployeeData}
        />
      )}
    </div>
  );
};

export default MainEmployeeData;
