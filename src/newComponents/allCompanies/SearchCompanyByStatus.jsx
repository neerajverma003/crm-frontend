import React, { useState, useEffect, useRef, useCallback } from "react";

const STATUSES = ["All Status", "Active", "Pending", "Inactive"];

const SearchCompanyByStatus = ({ onStatusChange, defaultStatus = "All Status" }) => {
  const [status, setStatus] = useState(defaultStatus);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleSelect = useCallback(
    (selectedStatus) => {
      setStatus(selectedStatus);
      setIsOpen(false);
      if (onStatusChange) {
        onStatusChange(selectedStatus);
      }
    },
    [onStatusChange]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation for button
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      } else if (e.key === "ArrowDown" && isOpen) {
        e.preventDefault();
        const firstOption = dropdownRef.current?.querySelector('[role="option"]');
        firstOption?.focus();
      }
    },
    [isOpen]
  );

  // Handle keyboard navigation for options
  const handleOptionKeyDown = useCallback(
    (e, selectedStatus) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect(selectedStatus);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextSibling = e.target.nextElementSibling;
        nextSibling?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevSibling = e.target.previousElementSibling;
        if (prevSibling) {
          prevSibling.focus();
        } else {
          buttonRef.current?.focus();
          setIsOpen(false);
        }
      }
    },
    [handleSelect]
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        ref={buttonRef}
        type="button"
        className={`flex items-center justify-between bg-gray-50 rounded-md px-3 py-2 cursor-pointer min-w-[160px] transition-all duration-200 ${
          isOpen ? "ring-2 ring-blue-500 bg-white" : "hover:bg-gray-100"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Filter companies by status"
      >
        <div className="flex items-center gap-2 text-gray-700">
          {/* Funnel Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
            aria-hidden="true"
          >
            <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
          </svg>
          <span className="font-medium">{status}</span>
        </div>

        {/* Chevron Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1">
          {STATUSES.map((statusOption) => (
            <button
              key={statusOption}
              type="button"
              role="option"
              aria-selected={status === statusOption}
              onClick={() => handleSelect(statusOption)}
              onKeyDown={(e) => handleOptionKeyDown(e, statusOption)}
              className={`w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors ${
                status === statusOption
                  ? "bg-blue-100 text-blue-900 font-medium"
                  : "text-gray-700"
              }`}
              tabIndex={-1}
            >
              {statusOption}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCompanyByStatus ;
