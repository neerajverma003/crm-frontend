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
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8fa] to-[#e9ecef] flex flex-col items-center py-10 px-2 sm:px-8">
      <div className="w-full max-w-7xl bg-white/90 rounded-3xl shadow-2xl p-0 border border-slate-100 overflow-hidden">
        {/* Header */}
        <header className="relative z-10 flex flex-col px-8 pt-10 pb-6 bg-gradient-to-r from-blue-50/80 to-slate-50/80 border-b border-slate-100">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 leading-tight drop-shadow-sm">
            Employee Data Management
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Manage employee information and details
          </p>
        </header>

        {/* Controls */}
        <section className="px-8 pt-6 pb-6 bg-white/80 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              + Add Employee
            </button>
          </div>
        </section>

        {/* Table */}
        <section className="px-6 py-6 bg-white/95">
          <div className="overflow-hidden rounded-2xl shadow-lg border border-slate-100">
            <EmployeeDataTable
              searchText={searchText}
              refreshTrigger={refreshTrigger}
              onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </div>
        </section>
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
