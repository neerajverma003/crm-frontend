import React, { useState } from 'react';
import './city.css'; // Assuming you have a CSS file for styling

const city = () => {
  // Sample data for the states
  const [states, setStates] = useState([
    { id: 1, country: 'India', state: 'Uttar Pradesh', city: 'Lucknow' },
    { id: 2, country: 'India', state: 'Bihar', city: 'Patna' },
    { id: 3, country: 'India', state: 'Gujrat', city: 'Ahmedabad' }
  ]);

  return (
    <div className="state-container">
      <div className="state-header">
        <h2>City Details ({states.length})</h2>
        <button className="add-state-btn">
          <span className="plus-icon">+</span> Add State
        </button>
      </div>
      <p className="state-info">You can see all states list <a href="#">here</a>.</p>
      
      <div className="state-table-container">
        <table className="state-table">
          <thead>
            <tr>
              <th className="country-column">Country</th>
              <th className="state-column">State</th>
              <th className="city-column">City</th>
              <th className="action-column">Action</th>
            </tr>
          </thead>
          <tbody>
            {states.map((item) => (
              <tr key={item.id}>
                <td>{item.country}</td>
                <td>{item.state}</td>
                <td>{item.city}</td>
                <td className="action-buttons">
                  <button className="edit-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button className="delete-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <div className="pagination-info">
          Showing 1 to 3 of 3 results
        </div>
        <div className="pagination-controls">
          <button className="pagination-btn prev-btn" disabled>
            <span className="pagination-arrow">‹</span> Previous
          </button>
          <button className="pagination-btn page-btn active">1</button>
          <button className="pagination-btn next-btn" disabled>
            Next <span className="pagination-arrow">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};


export default city