import React, { useState, useCallback } from "react";
import { Search, X } from "lucide-react";

const SearchLead = ({ onSearchChange, placeholder = "Search leads..." }) => {
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearchChange?.(value);
  }, [onSearchChange]);

  const clearSearch = useCallback(() => {
    setSearchText("");
    onSearchChange?.("");
  }, [onSearchChange]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      clearSearch();
    }
  };

  return (
    <div className="relative w-full min-w-0">
      <div 
        className={`
          flex items-center gap-3 bg-white border rounded-lg px-3 sm:px-4 py-2 sm:py-3 
          transition-all duration-200 shadow-sm w-full
          ${isFocused 
            ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <Search 
          className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-colors ${
            isFocused ? 'text-blue-500' : 'text-gray-400'
          }`} 
        />
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none min-w-0 text-sm sm:text-base"
          aria-label="Search leads"
        />
        {searchText && (
          <button
            onClick={clearSearch}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label="Clear search"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      {/* Search suggestions or results count could go here */}
      {searchText && (
        <div className="absolute top-full mt-1 w-full text-xs text-gray-500 px-2 z-10 bg-white rounded border shadow-sm">
          Searching for "{searchText.length > 20 ? searchText.substring(0, 20) + '...' : searchText}"
        </div>
      )}
    </div>
  );
};

export default SearchLead;