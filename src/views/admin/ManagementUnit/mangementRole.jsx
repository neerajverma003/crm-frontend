import React from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import './mangementRole.css';

const mangementRole = () => {
  const roles = [
    { id: 1, company: 'Medlay International Pvt. Ltd.', role: 'Digital Marketing Intern' },
    { id: 2, company: 'Medlay International Pvt. Ltd.', role: 'HR Manager' },
    { id: 3, company: 'Medlay International Pvt. Ltd.', role: 'Hr' },
    { id: 4, company: 'Medlay International Pvt. Ltd.', role: 'Software Enginner' },
    { id: 5, company: 'Medlay International Pvt. Ltd.', role: 'Office Assistant' },
    { id: 6, company: 'Medlay International Pvt. Ltd.', role: 'UI/UX' },
    { id: 7, company: 'Medlay International Pvt. Ltd.', role: 'W' },
  ];

  return (
    <div className="role-details-container">
      <div className="role-header">
        <div className="role-title">
          <h2>Role Details (7)</h2>
          <p>You can see all role's list here</p>
        </div>
        <button className="create-role-btn">
          <PlusCircle size={18} strokeWidth={2.5} />
          <span>Create Role</span>
        </button>
      </div>

      <div className="role-table-container">
        <table className="role-table">
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Company</th>
              <th>Role</th>
              <th className="action-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className={role.id % 2 === 0 ? 'even-row' : ''}>
                <td>{role.id}</td>
                <td className="company-cell">{role.company}</td>
                <td>{role.role}</td>
                <td className="action-cell">
                  <button className="action-btn edit-btn" title="Edit">
                    <Edit2 size={18} color="#4287f5" />
                  </button>
                  <button className="action-btn delete-btn" title="Delete">
                    <Trash2 size={18} color="#f54242" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="showing-results">
          Showing 1 to 7 of 7 results
        </div>
        <div className="pagination">
          <button className="pagination-btn prev-btn" disabled>
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          <button className="pagination-btn page-number active">1</button>
          <button className="pagination-btn next-btn" disabled>
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};


export default mangementRole;