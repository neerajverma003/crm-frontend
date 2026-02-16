import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Filter, Check } from "lucide-react";

const statuses = [
  { value: "All Status", label: "All Status", count: null },
  { value: "Hot", label: "Hot", count: 3, color: "bg-red-500" },
  { value: "Warm", label: "Warm", count: 2, color: "bg-orange-500" }, 
  { value: "Cold", label: "Cold", count: 1, color: "bg-blue-500" }
];

const SearchStatus = ({ onStatusChange, selectedStatus = "All Status" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(selectedStatus);
  const dropdownRef = useRef(null);

  const handleSelect = useCallback((status) => {
    setCurrentStatus(status);
    setIsOpen(false);
    onStatusChange?.(status);
  }, [onStatusChange]);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event, status) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (status) {
        handleSelect(status);
      } else {
        toggleDropdown();
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectedStatusData = statuses.find(s => s.value === currentStatus) || statuses[0];

  return (
    <div className="relative w-full sm:w-auto min-w-[160px] max-w-[200px]" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={toggleDropdown}
        onKeyDown={(e) => handleKeyDown(e)}
        className={`
          flex items-center justify-between w-full bg-white border rounded-lg px-3 sm:px-4 py-2 sm:py-3 
          transition-all duration-200 shadow-sm hover:shadow-md group text-sm
          ${isOpen 
            ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Filter by status: ${currentStatus}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Filter className={`w-4 h-4 flex-shrink-0 transition-colors ${
            isOpen ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'
          }`} />
          
          <div className="flex items-center gap-2 min-w-0">
            {selectedStatusData.color && (
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedStatusData.color}`} />
            )}
            <span className="text-gray-900 font-medium truncate">{currentStatus}</span>
            {selectedStatusData.count && (
              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full flex-shrink-0">
                {selectedStatusData.count}
              </span>
            )}
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
          <div className="max-h-64 overflow-y-auto">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => handleSelect(status.value)}
                onKeyDown={(e) => handleKeyDown(e, status.value)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-left
                  transition-colors duration-150 hover:bg-gray-50
                  ${currentStatus === status.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                `}
                role="option"
                aria-selected={currentStatus === status.value}
              >
                <div className="flex items-center gap-3">
                  {status.color && (
                    <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  )}
                  <span className="font-medium">{status.label}</span>
                  {status.count && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {status.count}
                    </span>
                  )}
                </div>
                
                {currentStatus === status.value && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchStatus;