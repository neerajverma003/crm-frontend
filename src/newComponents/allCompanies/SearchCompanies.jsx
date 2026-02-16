import React, { useState, useCallback, useRef } from "react";

const SearchCompanies = ({ onSearch, placeholder = "Search companies..." }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setText(value);

      // Debounce search
      if (onSearch) {
        clearTimeout(handleChange.timeoutId);
        handleChange.timeoutId = setTimeout(() => {
          onSearch(value);
        }, 300);
      }
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setText("");
    if (onSearch) {
      onSearch("");
    }
    inputRef.current?.focus();
  }, [onSearch]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        handleClear();
      }
    },
    [handleClear]
  );

  return (
    <div
      className={`relative bg-gray-50 rounded-md transition-all duration-200 ${
        isFocused ? "ring-2 ring-blue-500 bg-white" : "hover:bg-gray-100"
      }`}
      role="search"
      aria-label="Search companies"
    >
      <div className="flex items-center px-3 py-2 gap-2">
        {/* Search Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-colors ${
            isFocused ? "text-blue-500" : "text-gray-500"
          }`}
          aria-hidden="true"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>

        {/* Search Input */}
        <input
          ref={inputRef}
          id="company-search"
          type="search"
          value={text}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete="off"
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 min-w-0"
        />

        {/* Clear Button */}
        {text && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Clear search"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchCompanies;
