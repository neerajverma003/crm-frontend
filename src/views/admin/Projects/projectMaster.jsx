import React, { useState } from 'react';
import './projectMaster.css'; // Import your CSS file for styling

const ProjectMaster = () => {
  // Sample data for the portal details
  const [portalData, setPortalData] = useState([
    { id: '01', portal: 'kasper', status: 'Enabled' },
    { id: '02', portal: 'uyhtfd', status: 'Enabled' },
    { id: '03', portal: 'rtury', status: 'Enabled' }
  ]);

  // Current page state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(portalData.length / itemsPerPage);
  
  // Calculate items to display based on current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = portalData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle item actions
  const handleEdit = (id) => {
    console.log("Edit item:", id);
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    console.log("Delete item:", id);
    // Add your delete logic here
  };

  return (
    <div className="portal-container">
      <div className="portal-header">
        <div className="portal-title">
          <h2>Portal Details</h2>
          <div className="portal-count">{portalData.length}</div>
        </div>
        <p className="portal-subtitle">You can view all portals here.</p>
        <button className="add-button">
          <span className="plus-icon">+</span> Add new Details
        </button>
      </div>

      <div className="portal-table">
        <table>
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Portal</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.portal}</td>
                <td>
                  <span className="status-badge">{item.status}</span>
                </td>
                <td className="action-buttons">
                  <button className="edit-button" onClick={() => handleEdit(item.id)}>
                    <span className="edit-icon">✏️</span>
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(item.id)}>
                    <span className="delete-icon">🗑️</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="showing-text">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, portalData.length)} of {portalData.length} results
        </div>
        <div className="pagination-controls">
          <button 
            className="prev-button" 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1}
          >
            ‹ Previous
          </button>
          <button className="page-button active">{currentPage}</button>
          <button 
            className="next-button" 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectMaster;