import React, { useState } from 'react';

const Positions = () => {
  // Sample data for positions
  const [positions, setPositions] = useState([
    { id: 1, company: 'Medlay International Pvt. Ltd.', position: 'Digital Marketing' },
    { id: 2, company: 'Medlay International Pvt. Ltd.', position: 'HR Manager' },
    { id: 3, company: 'Medlay International Pvt. Ltd.', position: 'HR' },
    { id: 4, company: 'Medlay International Pvt. Ltd.', position: 'Employee' },
    { id: 5, company: 'Medlay International Pvt. Ltd.', position: 'Admin' },
    { id: 6, company: 'Medlay International Pvt. Ltd.', position: 'Office Assistant' },
    { id: 7, company: 'Medlay International Pvt. Ltd.', position: 'Business Manager' },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPosition, setNewPosition] = useState({
    company: 'Medlay International Pvt. Ltd.',
    position: ''
  });
  const [editingPosition, setEditingPosition] = useState(null);

  // Handle create new position
  const handleCreate = () => {
    const newId = positions.length > 0 ? Math.max(...positions.map(p => p.id)) + 1 : 1;
    setPositions([...positions, { ...newPosition, id: newId }]);
    setNewPosition({ company: 'Medlay International Pvt. Ltd.', position: '' });
    setShowCreateModal(false);
  };

  // Handle edit position
  const handleEdit = (position) => {
    setEditingPosition(position);
  };

  // Handle save edited position
  const handleSaveEdit = () => {
    setPositions(positions.map(p => 
      p.id === editingPosition.id ? editingPosition : p
    ));
    setEditingPosition(null);
  };

  // Handle delete position
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      setPositions(positions.filter(p => p.id !== id));
    }
  };

  // Get current date and time
  const currentDate = new Date();
  const options = { 
    weekday: 'long', 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);

  return (
    <div className="mainbar-grid">
      <div className="pb-4" style={{ overflow: 'auto' }}>
        <div className="container-fluid mb-3">
          <div className="d-flex justify-content-between py-2">
            <div className="my-auto">
              <h5 className="m-0" style={{ color: 'var(--secondaryDashColorDark)', fontWeight: 600 }}>
                Position Details ({positions.length})
              </h5>
              <p className="m-0" style={{ color: 'var(--secondaryDashColorDark)' }}>
                You can see all position's list here
              </p>
            </div>
            <button 
              className="btn btn-primary gap-1 d-flex my-auto align-items-center justify-content-center"
              onClick={() => setShowCreateModal(true)}
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="fs-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
              </svg>
              <span className="d-none d-md-flex">Create Position</span>
            </button>
          </div>
          <div id="clear-both"></div>
          <div style={{ color: 'var(--secondaryDashColorDark)', overflow: 'auto', maxHeight: '80vh', position: 'relative' }}>
            <div>
              <div className="scroller mb-2 rounded-2" style={{ height: 'fit-content', maxHeight: '70vh', overflow: 'auto', position: 'relative', border: 'var(--borderLight)' }}>
                <table className="table mb-0 table-hover">
                  <thead>
                    <tr>
                      <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>S. No.</th>
                      <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>Company</th>
                      <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>Position</th>
                      <th className="text-end" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos, index) => (
                      <tr key={pos.id}>
                        <td className="text-capitalize" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                          {index + 1}
                        </td>
                        <td className="text-capitalize" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                          {editingPosition?.id === pos.id ? (
                            <input
                              type="text"
                              className="form-control"
                              value={editingPosition.company}
                              onChange={(e) => setEditingPosition({...editingPosition, company: e.target.value})}
                            />
                          ) : (
                            pos.company
                          )}
                        </td>
                        <td className="text-capitalize" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                          {editingPosition?.id === pos.id ? (
                            <input
                              type="text"
                              className="form-control"
                              value={editingPosition.position}
                              onChange={(e) => setEditingPosition({...editingPosition, position: e.target.value})}
                            />
                          ) : (
                            pos.position
                          )}
                        </td>
                        <td className="text-capitalize text-end" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                          {editingPosition?.id === pos.id ? (
                            <>
                              <button 
                                className="btn btn-success me-2"
                                onClick={handleSaveEdit}
                              >
                                Save
                              </button>
                              <button 
                                className="btn btn-secondary"
                                onClick={() => setEditingPosition(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                className="btn" 
                                style={{ color: 'black' }}
                                onClick={() => handleEdit(pos)}
                              >
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-primary" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                </svg>
                              </button>
                              <button 
                                className="btn" 
                                style={{ color: 'black' }}
                                onClick={() => handleDelete(pos.id)}
                              >
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="fs-5 text-danger" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                                </svg>
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="cntainer-fluid d-flex flex-column-reverse gap-4 py-2 px-2 rounded-2 gap-md-0 flex-md-row w-100 justify-content-between align-items-center my-2" style={{ background: 'var(--primaryDashMenuColor)' }}>
              <div className="d-flex flex-column-reverse gap-4 py-1 px-2 rounded-2 gap-md-0 flex-md-row w-100 justify-content-between align-items-center" style={{ background: 'var( --secondaryDashMenuColor)' }}>
                <div className="my-auto" style={{ color: 'black' }}>
                  Showing 1 to {positions.length} of {positions.length} results
                </div>
                <div className="d-flex align-items-center gap-1">
                  <button className="btn bg-light text-dark rounded-2 border shadow-sm mx-1 d-flex align-items-center gap-2" disabled>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="my-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <polyline fill="none" strokeWidth="2" points="9 6 15 12 9 18" transform="matrix(-1 0 0 1 24 0)"></polyline>
                    </svg> 
                    <span className="d-none d-md-flex">Previous</span>
                  </button>
                  <div className="pagination d-flex flex-nowrap gap-2">
                    <button className="bg-primary text-white border-0 rounded-2" style={{ border: 'none', height: '2.3rem', width: '2.3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      1
                    </button>
                  </div>
                  <button className="btn bg-light text-dark rounded-2 border shadow-sm mx-1 d-flex align-items-center gap-2" disabled>
                    <span className="d-none d-md-flex">Next</span> 
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="my-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <polyline fill="none" strokeWidth="2" points="9 6 15 12 9 18"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Position Modal */}
      {showCreateModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Position</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Company</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newPosition.company}
                    onChange={(e) => setNewPosition({...newPosition, company: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Position</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newPosition.position}
                    onChange={(e) => setNewPosition({...newPosition, position: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCreate}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="HrPannelFooter bg-dark w-100 text-white" style={{ zIndex: 50, position: 'absolute', bottom: '0px' }}>
        <div className="d-flex justify-content-center align-items-center gap-5 p-2" style={{ backgroundColor: 'var(--primaryDashMenuColor)', color: 'var(--primaryDashColorDark)' }}>
          <span className="d-none d-md-flex">
            <span className="text-capitalize">{formattedDate}</span>
          </span>
          <span className="d-flex align-items-center gap-2">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
              <line x1="12" y1="20" x2="12.01" y2="20"></line>
            </svg> 
            <span className="d-none d-md-flex">Connected</span>
          </span>
          <span>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M131.5 217.5L55.1 100.1c47.6-59.2 119-91.8 192-92.1 42.3-.3 85.5 10.5 124.8 33.2 43.4 25.2 76.4 61.4 97.4 103L264 133.4c-58.1-3.4-113.4 29.3-132.5 84.1zm32.9 38.5c0 46.2 37.4 83.6 83.6 83.6s83.6-37.4 83.6-83.6-37.4-83.6-83.6-83.6-83.6 37.3-83.6 83.6zm314.9-89.2L339.6 174c37.9 44.3 38.5 108.2 6.6 157.2L234.1 503.6c46.5 2.5 94.4-7.7 137.8-32.9 107.4-62 150.9-192 107.4-303.9zM133.7 303.6L40.4 120.1C14.9 159.1 0 205.9 0 256c0 124 90.8 226.7 209.5 244.9l63.7-124.8c-57.6 10.8-113.2-20.8-139.5-72.5z"></path>
            </svg> Chrome
          </span>
          <span title="IP Address" className="d-flex align-items-center gap-1">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M16 2a3 3 0 0 1 2.995 2.824l.005 .176v14a3 3 0 0 1 -2.824 2.995l-.176 .005h-8a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h8zm-4 14a1 1 0 0 0 -.993 .883l-.007 .117l.007 .127a1 1 0 0 0 1.986 0l.007 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm1 -12h-2l-.117 .007a1 1 0 0 0 0 1.986l.117 .007h2l.117 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" strokeWidth="0" fill="currentColor"></path>
            </svg> 122.161.52.228
          </span>
          <div>Unable to retrieve your location.</div>
        </div>
      </div>
    </div>
  );
};

export default Positions;