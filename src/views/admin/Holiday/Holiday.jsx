import React, { useState } from 'react';
import './Holiday.css'; // Assuming you have a CSS file for styling
const HolidayList = () => {
  const [month, setMonth] = useState('May');
  const [year, setYear] = useState('2025');
  
  // Mock data for the holiday
  const holidays = [
    {
      date: '01/05/2025',
      name: 'International Workers\' Day',
      type: 'National Holiday'
    }
  ];

  return (
    <div className="holiday-list-container">
      <div className="header">
        <div className="title-section">
          <h2 className="title">Holiday List</h2>
          <span className="badge">1</span>
        </div>
        <div className="subtitle">You can create and view holiday here</div>
      </div>
      
      <div className="filters">
        <div className="filter-group">
          <label>Month</label>
          <select 
            className="select-dropdown"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Year</label>
          <select 
            className="select-dropdown"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2026">2026</option>
          </select>
        </div>

        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search holiday" 
            className="search-input"
          />
        </div>
      </div>

      <div className="holiday-table">
        <div className="table-header">
          <div className="header-cell date-cell">Date</div>
          <div className="header-cell name-cell">Name</div>
          <div className="header-cell type-cell">Type</div>
        </div>
        
        {holidays.map((holiday, index) => (
          <div className="table-row" key={index}>
            <div className="cell date-cell">{holiday.date}</div>
            <div className="cell name-cell">{holiday.name}</div>
            <div className="cell type-cell">{holiday.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidayList;