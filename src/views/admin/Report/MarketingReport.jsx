import React, { useState, useRef, useEffect } from 'react';
import './MarketingReport.css'; // Assuming you have a CSS file for styles

const MarketingReport = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Recent');
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="header">
        <div className="title-section">
          <h1>Marketing Report</h1>
          <p>You can view and generate your Marketing Report here.</p>
        </div>
        <div className="action-section">
          <div className="dropdown-container" ref={dropdownRef}>
            <div className="dropdown-select" onClick={toggleDropdown}>
              {selectedOption}
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {[
                  'Recent',
                  'Today',
                  'This Week (Mon-Sun)',
                  'This Month',
                  'This Quarter',
                  'This Half Year',
                  'This Year',
                ].map((option) => (
                  <div
                    key={option}
                    className={`dropdown-item ${
                      selectedOption === option ? 'active' : ''
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="add-report-btn">Add Report</button>
          <button className="alt-r-btn">Alt + R</button>
        </div>
      </div>
    </>
  );
};

export default MarketingReport;
