import React, { useState, useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";

/**
 * DestinationSearchBox - Reusable autocomplete search component for destinations
 * Fetches destinations from employee destination API and provides autocomplete suggestions
 * 
 * Props:
 *   - value: Current selected destination value
 *   - onChange: Callback when destination is selected
 *   - name: Field name attribute
 *   - placeholder: Placeholder text
 *   - required: If true, shows required indicator
 *   - error: Error message to display
 */
const DestinationSearchBox = ({
  value = "",
  onChange,
  name = "destination",
  placeholder = "Search and select destination",
  required = false,
  error = "",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch all destinations on mount
  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:4000/employeedestination/");
        const data = await res.json();

        if (Array.isArray(data.destinations)) {
          const destinationsList = data.destinations.map((d) => ({
            id: d._id,
            name: d.destination,
          }));
          setDestinations(destinationsList);
        }
      } catch (err) {
        console.error("Error fetching destinations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter destinations based on input
  useEffect(() => {
    const searchTerm = inputValue.toLowerCase().trim();
    if (searchTerm === "") {
      setFilteredDestinations([]);
      setActiveIndex(-1);
    } else {
      const filtered = destinations.filter((dest) =>
        dest.name.toLowerCase().includes(searchTerm)
      );
      setFilteredDestinations(filtered);
      setActiveIndex(-1);
    }
  }, [inputValue, destinations]);

  // Handle input change
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);
  };

  // Handle destination selection
  const handleSelectDestination = (destination) => {
    setInputValue(destination.name);
    onChange({
      target: {
        name: name,
        value: destination.name,
      },
    });
    setIsOpen(false);
    setActiveIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredDestinations.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && filteredDestinations[activeIndex]) {
          handleSelectDestination(filteredDestinations[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && dropdownRef.current) {
      const activeElement = dropdownRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  return (
    <div className="h-auto">
      <label className="block text-xs font-medium text-gray-700 mb-0.5">
        {name.charAt(0).toUpperCase() + name.slice(1)}{" "}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
            error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        />

        {/* Loading indicator */}
        {isLoading && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            Loading...
          </span>
        )}

        {/* Dropdown suggestions */}
        {isOpen && filteredDestinations && filteredDestinations.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
          >
            {filteredDestinations.map((destination, index) => (
              <div
                key={destination.id}
                onClick={() => handleSelectDestination(destination)}
                className={`px-3 py-2 cursor-pointer text-sm ${
                  index === activeIndex
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-50"
                }`}
              >
                {destination.name}
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {isOpen && inputValue && filteredDestinations.length === 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 px-3 py-2 text-sm text-gray-500">
            No destinations found
          </div>
        )}

        {/* Suggestions list when dropdown open and no search term */}
        {isOpen && !inputValue && destinations.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
          >
            {destinations.map((destination, index) => (
              <div
                key={destination.id}
                onClick={() => handleSelectDestination(destination)}
                className={`px-3 py-2 cursor-pointer text-sm ${
                  index === activeIndex
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-50"
                }`}
              >
                {destination.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
};

export default DestinationSearchBox;
