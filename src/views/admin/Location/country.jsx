import React, { useState } from 'react';
import './country.css'; // Assuming you have a CSS file for styling

function Country() {
  const [countries, setCountries] = useState([
    { id: 1, name: 'India' }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleEditCountry = (id) => {
    console.log(`Edit country with id: ${id}`);
  };

  const handleDeleteCountry = (id) => {
    console.log(`Delete country with id: ${id}`);
    setCountries(countries.filter(country => country.id !== id));
  };

  const handleAddCountry = () => {
    console.log('Add new country');
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="country-container">
      <div className="country-header">
        <div>
          <h1 className="country-title">Country Details ({countries.length})</h1>
          <p className="country-subtitle">You can see all country list here.</p>
        </div>
        <button 
          onClick={handleAddCountry}
          className="add-button"
        >
          <span>+</span> Add Country
        </button>
      </div>

      <div className="table-container">
        <table className="country-table">
          <thead>
            <tr>
              <th className="column-header">Country</th>
              <th className="column-header action-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {countries.map(country => (
              <tr key={country.id} className="table-row">
                <td className="table-cell">{country.name}</td>
                <td className="table-cell action-cell">
                  <button 
                    onClick={() => handleEditCountry(country.id)}
                    className="edit-button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                      <path d="m15 5 4 4"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteCountry(country.id)}
                    className="delete-button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      <line x1="10" x2="10" y1="11" y2="17"></line>
                      <line x1="14" x2="14" y1="11" y2="17"></line>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Showing {countries.length > 0 ? 1 : 0} to {countries.length} of {countries.length} results
        </div>
        <div className="pagination-controls">
          <button 
            onClick={goToPreviousPage}
            className="page-button prev-button"
            disabled={currentPage === 1}
          >
            <span>‹</span> Previous
          </button>
          <button className="page-button current-page">
            {currentPage}
          </button>
          <button 
            onClick={goToNextPage}
            className="page-button next-button"
            disabled={currentPage === totalPages}
          >
            Next <span>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Country;