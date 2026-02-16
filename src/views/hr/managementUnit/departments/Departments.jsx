import React, { useState, useEffect } from 'react';
import './Departments.css';

const Departments = () => {
  // Initial department data
  const [departments, setDepartments] = useState([
    { id: 1, company: 'Medlay International Pvt. Ltd.', department: 'Marketing' },
    { id: 2, company: 'Medlay International Pvt. Ltd.', department: 'Human Resource' },
    { id: 3, company: 'Medlay International Pvt. Ltd.', department: 'Software' },
    { id: 4, company: 'Medlay International Pvt. Ltd.', department: 'Sales' },
    { id: 5, company: 'Medlay International Pvt. Ltd.', department: 'Research and Development' }
  ]);

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState({ id: null, company: '', department: '' });
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // State for date and time
  const [dateTime, setDateTime] = useState('');

  // Update date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      };
      setDateTime(now.toLocaleString('en-US', options));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate total pages
  useEffect(() => {
    setTotalPages(Math.ceil(departments.length / itemsPerPage));
  }, [departments, itemsPerPage]);

  // Get current departments for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = departments.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open create modal
  const openCreateModal = () => {
    setIsEdit(false);
    setCurrentDepartment({ id: null, company: 'Medlay International Pvt. Ltd.', department: '' });
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (department) => {
    setIsEdit(true);
    setCurrentDepartment({ ...department });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDepartment({ ...currentDepartment, [name]: value });
  };

  // Save department (create or update)
  const saveDepartment = () => {
    if (!currentDepartment.department.trim()) {
      alert('Department name is required!');
      return;
    }

    if (isEdit) {
      setDepartments(
        departments.map((dept) =>
          dept.id === currentDepartment.id ? currentDepartment : dept
        )
      );
    } else {
      const newId = departments.length > 0 ? Math.max(...departments.map(dept => dept.id)) + 1 : 1;
      setDepartments([...departments, { ...currentDepartment, id: newId }]);
    }
    closeModal();
  };

  // Delete department
  const deleteDepartment = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter((dept) => dept.id !== id));
    }
  };

  // Render page numbers
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={i === currentPage ? 'active-page' : ''}
          onClick={() => paginate(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="mainbar-grid">
      <div className="department-container">
        <div className="container-fluid mb-3">
          <div className="d-flex justify-content-between py-2">
            <div className="department-header">
              <h5 className="m-0">Department Details ({departments.length})</h5>
              <p className="m-0">You can see all department's list here</p>
            </div>
            <button className="btn btn-primary create-btn" onClick={openCreateModal}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="plus-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
              </svg>
              <span className="create-text">Create Department</span>
            </button>
          </div>
          
          <div className="table-container">
            <div className="scroller rounded-2">
              <table className="table mb-0 table-hover">
                <thead>
                  <tr>
                    <th>S. No.</th>
                    <th>Company</th>
                    <th>Department</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDepartments.map((dept, index) => (
                    <tr key={dept.id}>
                      <td className="text-capitalize">{indexOfFirstItem + index + 1}</td>
                      <td className="text-capitalize">{dept.company}</td>
                      <td className="text-capitalize">{dept.department}</td>
                      <td className="text-capitalize text-end">
                        <button className="btn" onClick={() => openEditModal(dept)}>
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-primary" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </button>
                        <button className="btn" onClick={() => deleteDepartment(dept.id)}>
                          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="fs-5 text-danger" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="pagination-container">
            <div className="pagination-inner">
              <div className="results-info">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, departments.length)} of {departments.length} results
              </div>
              <div className="pagination-controls">
                <button 
                  className="btn pagination-btn prev-btn" 
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="my-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <polyline fill="none" strokeWidth="2" points="9 6 15 12 9 18" transform="matrix(-1 0 0 1 24 0)"></polyline>
                  </svg>
                  <span className="btn-text">Previous</span>
                </button>
                
                <div className="pagination">
                  {renderPageNumbers()}
                </div>
                
                <button 
                  className="btn pagination-btn next-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => paginate(currentPage + 1)}
                >
                  <span className="btn-text">Next</span>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="my-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <polyline fill="none" strokeWidth="2" points="9 6 15 12 9 18"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
   
      
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h5>{isEdit ? 'Edit Department' : 'Create Department'}</h5>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  className="form-control"
                  value={currentDepartment.company}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Department Name</label>
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  value={currentDepartment.department}
                  onChange={handleInputChange}
                  placeholder="Enter department name"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={saveDepartment}>
                {isEdit ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;