import React, { useState } from 'react';
import './Roles.css';

const Roles = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', description: 'Full access to all features', users: 5, status: 'Active' },
    { id: 2, name: 'Manager', description: 'Can manage team members', users: 12, status: 'Active' },
    { id: 3, name: 'Editor', description: 'Can edit content', users: 8, status: 'Active' },
    { id: 4, name: 'Viewer', description: 'Read-only access', users: 25, status: 'Active' },
  ]);

  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole({ ...newRole, [name]: value });
  };

  const addRole = () => {
    if (newRole.name.trim() === '') return;
    
    const role = {
      id: roles.length + 1,
      name: newRole.name,
      description: newRole.description,
      users: 0,
      status: 'Active'
    };
    
    setRoles([...roles, role]);
    setNewRole({ name: '', description: '' });
  };

  const editRole = (role) => {
    setIsEditing(true);
    setCurrentRole({ ...role });
  };

  const updateRole = () => {
    setRoles(roles.map(role => 
      role.id === currentRole.id ? currentRole : role
    ));
    setIsEditing(false);
    setCurrentRole(null);
  };

  const deleteRole = (id) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const toggleStatus = (id) => {
    setRoles(roles.map(role => 
      role.id === id ? { ...role, status: role.status === 'Active' ? 'Inactive' : 'Active' } : role
    ));
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="roles-container">
      <div className="roles-header">
        <div>
          <h2>Roles</h2>
          <p>Manage user roles and permissions</p>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="search-icon" viewBox="0 0 20 20">
            <path d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"></path>
          </svg>
        </div>
      </div>

      <div className="roles-content">
        <div className="roles-form">
          <h3>{isEditing ? 'Edit Role' : 'Add New Role'}</h3>
          <div className="form-group">
            <label>Role Name</label>
            <input
              type="text"
              name="name"
              value={isEditing ? currentRole?.name : newRole.name}
              onChange={isEditing ? 
                (e) => setCurrentRole({...currentRole, name: e.target.value}) : 
                handleInputChange
              }
              placeholder="Enter role name"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={isEditing ? currentRole?.description : newRole.description}
              onChange={isEditing ? 
                (e) => setCurrentRole({...currentRole, description: e.target.value}) : 
                handleInputChange
              }
              placeholder="Enter role description"
              rows="3"
            ></textarea>
          </div>
          <div className="form-actions">
            {isEditing ? (
              <>
                <button className="btn btn-primary" onClick={updateRole}>Update Role</button>
                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={addRole}>Add Role</button>
            )}
          </div>
        </div>

        <div className="roles-table-container">
          <table className="roles-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Description</th>
                <th>Users</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.length > 0 ? (
                filteredRoles.map(role => (
                  <tr key={role.id}>
                    <td>{role.name}</td>
                    <td>{role.description}</td>
                    <td>{role.users}</td>
                    <td>
                      <span className={`status-badge ${role.status.toLowerCase()}`}>
                        {role.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon edit" 
                          onClick={() => editRole(role)}
                          title="Edit"
                        >
                          <svg viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => deleteRole(role.id)}
                          title="Delete"
                        >
                          <svg viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                        <button 
                          className="btn-icon status" 
                          onClick={() => toggleStatus(role.id)}
                          title={role.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          <svg viewBox="0 0 24 24">
                            {role.status === 'Active' ? (
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            ) : (
                              <path d="M19 13H5v-2h14v2z"/>
                            )}
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">No roles found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Roles;