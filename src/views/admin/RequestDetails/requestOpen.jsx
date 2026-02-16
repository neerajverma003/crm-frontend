import React, { useState } from 'react';
import { Clock, X, User, Mail, Phone } from 'lucide-react';
import './requestOpen.css'; // Assuming you have a CSS file for styles
const RequestOpen = () => {
  // Sample data for open requests
  const requests = [
    {
      id: 'TKT0020',
      timestamp: '18 days ago',
      lastUpdated: '18 days ago',
      email: 'demo.hr@munc.in',
      to: 'demo.admin@munc.in',
      cc: 'demoemp2@munc.in',
      isYou: true,
      subject: 'Request For Office Supply Replenishment',
      status: 'Pending',
      priority: 'Medium',
      body: 'Kindly arrange for the replenishment of basic office supplies such as pens, notepads, and printer paper for the HR department. Current stock is running low, and we\'d appreciate if the items could be delivered by end of the week. Thank you!'
    },
    {
      id: 'TKT0018',
      timestamp: '17 Mar 2025, 10:00',
      lastUpdated: '17 Mar 2025, 10:00',
      email: 'demo.manager@munc.in',
      to: 'demo.admin@munc.in',
      cc: 'demoemp2@munc.in',
      isYou: true,
      subject: 'Leave Application',
      status: 'Pending',
      priority: 'Medium',
      body: 'I would like to apply for leave from March 20 to March 25 due to personal reasons. Please approve.'
    },
    {
      id: 'TKT0013',
      timestamp: '10 Mar 2025, 12:12',
      lastUpdated: '10 Mar 2025, 12:12',
      email: 'demo.manager@munc.in',
      to: 'demo.admin@munc.in',
      cc: 'demoemp2@munc.in',
      isYou: true,
      subject: 'Concern Regarding Office Equipment',
      status: 'Open',
      priority: 'Urgent',
      body: 'The printer on the second floor has been malfunctioning for several days now. This is causing significant delays in our work. Please arrange for immediate repair or replacement.'
    },
    {
      id: 'TKT0012',
      timestamp: '10 Mar 2025, 10:45',
      lastUpdated: '10 Mar 2025, 10:45',
      email: 'demo.hr@munc.in',
      to: 'demo.admin@munc.in',
      cc: 'demoemp2@munc.in',
      isYou: true,
      subject: 'Request for Training Materials',
      status: 'Pending',
      priority: 'High',
      body: 'We need the training materials for the upcoming onboarding session next week. Please provide the necessary documents by Friday.'
    }
    
  ];

  // State to track which ticket is being viewed
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Function to determine priority class
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Urgent':
        return 'priority-urgent';
      default:
        return '';
    }
  };

  // Function to determine status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Open':
        return 'status-open';
      default:
        return '';
    }
  };

  // Handle card click
  const handleCardClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  // Close ticket detail view
  const closeTicketDetail = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="request-container">
      {!selectedTicket ? (
        <>
          <div className="header">
            <h1 className="title">Open Request's <span className="count">{requests.length}</span></h1>
            <p className="subtitle">You can view all your pending Request's here</p>
          </div>
          
          <div className="request-grid">
            {requests.map((request) => (
              <div 
                key={request.id} 
                className="request-card"
                onClick={() => handleCardClick(request)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-header">
                  <div className="ticket-id">{request.id}</div>
                  <div className="timestamp">
                    <Clock size={16} className="clock-icon" />
                    <span>{request.timestamp}</span>
                  </div>
                </div>
                
                <div className="email-info">
                  <div className="user-icon">
                    <img src="/api/placeholder/24/24" alt="User" />
                  </div>
                  <div className="email-text">
                    {request.email} {request.isYou && <span className="you-label">( You )</span>}
                  </div>
                </div>
                
                <div className="subject-line">
                  <div className="subject-label">Subject :</div>
                  <div className="subject-text">{request.subject}</div>
                </div>
                
                <div className="request-footer">
                  <div className={`status-badge ${getStatusClass(request.status)}`}>
                    {request.status}
                  </div>
                  <div className={`priority-badge ${getPriorityClass(request.priority)}`}>
                    {request.priority}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="ticket-detail-view">
          <div className="ticket-detail-header">
            <div className="ticket-badges">
              <span className="ticket-id">{selectedTicket.id}</span>
              <span className={`status-badge ${getStatusClass(selectedTicket.status)}`}>
                {selectedTicket.status}
              </span>
              <span className={`priority-badge ${getPriorityClass(selectedTicket.priority)}`}>
                {selectedTicket.priority}
              </span>
            </div>
            <div className="detail-timestamps">
              <div className="timestamp">
                <Clock size={16} className="clock-icon" />
                <span>Created At: {selectedTicket.timestamp}</span>
              </div>
              <div className="timestamp">
                <Clock size={16} className="clock-icon" />
                <span>Last Updated At: {selectedTicket.lastUpdated}</span>
              </div>
            </div>
            <button 
              className="close-button"
              onClick={closeTicketDetail}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#333",
                fontSize: "16px",
                display: "flex",
                alignItems: "center"
              }}
            >
              Close <X size={18} style={{marginLeft: "4px"}} />
            </button>
          </div>
          
          <div className="ticket-detail-content">
            <div className="subject-section">
              <h3>Subject:</h3>
              <p>{selectedTicket.subject}</p>
            </div>
            
            <div className="email-section">
              <div className="email-field">
                <div className="email-info">
                  <div className="user-icon">
                    <img src="/api/placeholder/24/24" alt="User" />
                  </div>
                  <div className="email-text">
                    {selectedTicket.email} {selectedTicket.isYou && <span className="you-label">( You )</span>}
                  </div>
                </div>
                <span className="email-timestamp">{selectedTicket.timestamp}</span>
              </div>
              
              <div className="email-address-fields">
                <div className="address-field">
                  <span className="field-label">To:</span>
                  <span className="field-value">{selectedTicket.to}</span>
                </div>
                
                <div className="address-field">
                  <span className="field-label">CC:</span>
                  <span className="field-value">{selectedTicket.cc}</span>
                </div>
              </div>
            </div>
            
            <div className="request-body">
              <h3>Request:</h3>
              <p>{selectedTicket.body}</p>
            </div>
            
            <div className="remark-section">
              <h3>Remark:</h3>
              <textarea 
                placeholder="Please enter your message here"
                rows={4}
                className="remark-textarea"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  resize: "vertical"
                }}
              />
              
              <button
                className="save-button"
                style={{
                  backgroundColor: "#0d6efd",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: "600",
                  marginTop: "10px"
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestOpen;