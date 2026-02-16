import React, { useState } from 'react';
import './projectBidding.css'; // Assuming you have a CSS file for styles
import { Pencil, Trash2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const ProjectBidding = () => {
  // Initial data for the bidding table
  const initialBidData = [
    {
      id: '01',
      title: 'kasper',
      portal: 'kasper',
      url: 'fg',
      estimatedTime: '800 Days',
      estimatedCost: '₹67',
      remark: 'tdffh'
    },
    {
      id: '02',
      title: '68iygua',
      portal: 'kasper',
      url: 'kml.l',
      estimatedTime: '1 Weeks',
      estimatedCost: '€8645',
      remark: ',sd.c'
    },
    {
      id: '03',
      title: 'Cars24',
      portal: 'kasper',
      url: 'cars24.com',
      estimatedTime: '12 Days',
      estimatedCost: '₹15000',
      remark: 'complete this'
    },
    {
      id: '04',
      title: 'inventory management',
      portal: 'kasper',
      url: 'https://munc.in/inventory',
      estimatedTime: '90 Days',
      estimatedCost: '₹50000',
      remark: 'To helps small to large businesses'
    }
  ];

  const [bidData, setBidData] = useState(initialBidData);
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalResults = bidData.length;

  const handleEdit = (id) => {
    console.log(`Edit bid with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete bid with id: ${id}`);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    // Assuming we have more pages (this is just for UI demonstration)
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="bidding-container">
      <div className="bidding-header">
        <div className="bidding-title">
          <h2>Bidding Details</h2>
          <span className="bid-count">4</span>
        </div>
        <p className="bidding-subtitle">You can view all bids here.</p>
        <button className="add-bid-button">
          <Plus size={20} />
          Add Bid
        </button>
      </div>

      <div className="bidding-table-container">
        <table className="bidding-table">
          <thead>
            <tr>
              <th>S. No</th>
              <th>Project Title</th>
              <th>Portal</th>
              <th>Project URL</th>
              <th>Estimated Time</th>
              <th>Estimated Cost</th>
              <th>Remark</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bidData.map((bid) => (
              <tr key={bid.id}>
                <td>{bid.id}</td>
                <td>{bid.title}</td>
                <td>{bid.portal}</td>
                <td>
                  <a href={bid.url.startsWith('http') ? bid.url : `http://${bid.url}`} className="url-link">
                    {bid.url}
                  </a>
                </td>
                <td>{bid.estimatedTime}</td>
                <td>{bid.estimatedCost}</td>
                <td className="remark-cell">
                  <span className="remark-text">{bid.remark}</span>
                </td>
                <td className="action-cell">
                  <button className="action-button edit" onClick={() => handleEdit(bid.id)}>
                    <Pencil size={18} />
                  </button>
                  <button className="action-button delete" onClick={() => handleDelete(bid.id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">Showing 1 to 4 of 4 results</div>
        <div className="pagination-controls">
          <button className="pagination-button" onClick={handlePrevious} disabled={currentPage === 1}>
            <ChevronLeft size={16} />
            Previous
          </button>
          <button className="pagination-button active">{currentPage}</button>
          <button className="pagination-button" onClick={handleNext}>
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectBidding;