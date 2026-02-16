import React, { useState } from 'react';
import { Clock, X, User } from 'lucide-react';
import './requestClose.css'; // Import your CSS file for styling

const ClosedRequest = () => {
  // Sample data for closed requests
  const closedRequests = [
    {
      id: 'TKT0019',
      timestamp: '24 Mar 2025, 13:25',
      lastUpdated: '24 Mar 2025, 13:27',
      email: 'demo.emp@munc.in',
      isYou: true,
      subject: 'Solve Bugs',
      status: 'Close',
      priority: 'High',
      to: 'demo.manager@munc.in',
      cc: 'demo.admin@munc.in, demo.hr@munc.in, demoemp2@munc.in, deepak@gmail.com',
      body: 'yyuiioo',
      updates: [
        {
          message: 'hellloooo',
          from: 'demo.emp@munc.in',
          timestamp: '24 Mar 2025, 13:27'
        }
      ]
    },
    {
      id: 'TKT0011',
      timestamp: '10 Mar 2025, 09:50',
      lastUpdated: '10 Mar 2025, 10:05',
      email: 'demo.emp@munc.in',
      isYou: true,
      subject: 'Leave of Absence Request',
      status: 'Close',
      priority: 'Urgent',
      to: 'demo.manager@munc.in',
      cc: 'demo.hr@munc.in',
      body: 'I need to take a leave of absence for personal reasons.',
      updates: []
    },
    {
      id: 'TKT0010',
      timestamp: '05 Mar 2025, 14:58',
      lastUpdated: '06 Mar 2025, 09:30',
      email: 'demo.hr@munc.in',
      isYou: true,
      subject: 'Pending Leave Application',
      status: 'Close',
      priority: 'Medium',
      to: 'demo.manager@munc.in',
      cc: 'demo.admin@munc.in',
      body: 'Please review the attached leave application.',
      updates: []
    },
    {
      id: 'TKT0009',
      timestamp: '05 Mar 2025, 14:55',
      lastUpdated: '05 Mar 2025, 15:30',
      email: 'demo.emp@munc.in',
      isYou: true,
      subject: 'efesfds',
      status: 'Close',
      priority: 'Medium',
      to: 'demo.hr@munc.in',
      cc: '',
      body: 'Test message',
      updates: []
    },
    {
      id: 'TKT0008',
      timestamp: '05 Mar 2025, 14:25',
      lastUpdated: '05 Mar 2025, 15:00',
      email: 'amar@gmail.com',
      isYou: true,
      subject: 'ddd',
      status: 'Close',
      priority: 'Urgent',
      to: 'demo.manager@munc.in',
      cc: 'demo.hr@munc.in',
      body: 'Test message',
      updates: []
    },
    {
      id: 'TKT0007',
      timestamp: '05 Mar 2025, 12:55',
      lastUpdated: '05 Mar 2025, 13:15',
      email: 'demo.emp@munc.in',
      isYou: true,
      subject: 'fdsgsdgf',
      status: 'Close',
      priority: 'Medium',
      to: 'demo.manager@munc.in',
      cc: '',
      body: 'Test message',
      updates: []
    },
    {
      id: 'TKT0006',
      timestamp: '05 Mar 2025, 10:50',
      lastUpdated: '05 Mar 2025, 11:30',
      email: 'demo.hr@munc.in',
      isYou: true,
      subject: '687587',
      status: 'Close',
      priority: 'Urgent',
      to: 'demo.manager@munc.in',
      cc: '',
      body: 'Test message',
      updates: []
    },
    {
      id: 'TKT0005',
      timestamp: '05 Mar 2025, 10:29',
      lastUpdated: '05 Mar 2025, 11:00',
      email: 'demo.hr@munc.in',
      isYou: true,
      subject: 'issues with munc',
      status: 'Close',
      priority: 'Medium',
      to: 'demo.manager@munc.in',
      cc: 'demo.admin@munc.in',
      body: 'Having issues with the system',
      updates: []
    },
    {
      id: 'TKT0004',
      timestamp: '05 Mar 2025, 10:26',
      lastUpdated: '05 Mar 2025, 11:00',
      email: 'demo.emp@munc.in',
      isYou: true,
      subject: 'logout time not marked',
      status: 'Close',
      priority: 'Medium',
      to: 'demo.hr@munc.in',
      cc: '',
      body: 'My logout time was not marked correctly yesterday',
      updates: []
    },
    {
      id: 'TKT0003',
      timestamp: '05 Mar 2025, 10:16',
      lastUpdated: '05 Mar 2025, 10:45',
      email: 'demo.manager@munc.in',
      isYou: true,
      subject: 'vhfgj',
      status: 'Close',
      priority: 'Urgent',
      to: 'demo.admin@munc.in',
      cc: '',
      body: 'Test message',
      updates: []
    },
    {
      id: 'TKT0002',
      timestamp: '04 Mar 2025, 19:05',
      lastUpdated: '05 Mar 2025, 09:00',
      email: 'demo.emp@munc.in',
      isYou: true,
      subject: 'Network Issue again',
      status: 'Close',
      priority: 'Medium',
      to: 'demo.manager@munc.in',
      cc: 'demo.admin@munc.in',
      body: 'The network issue has occurred again',
      updates: []
    },
    {
      id: 'TKT0001',
      timestamp: '04 Mar 2025, 19:02',
      lastUpdated: '05 Mar 2025, 09:00',
      email: 'demo.emp@munc.in',
      isYou: true,
      subject: 'Network Issue',
      status: 'Close',
      priority: 'High',
      to: 'demo.manager@munc.in',
      cc: 'demo.admin@munc.in',
      body: 'There is a network issue in our department',
      updates: []
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
      case 'Close':
        return 'status-close';
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
            <h1 className="title">Closed Request's <span className="count">{closedRequests.length}</span></h1>
            <p className="subtitle">You can view all your team's closed Request's here</p>
          </div>
          
          <div className="closed-request-grid">
            {closedRequests.map((request) => (
              <div 
                key={request.id} 
                className="closed-request-card"
                onClick={() => handleCardClick(request)}
              >
                <div className="card-top">
                  <div className="ticket-id">{request.id}</div>
                  <div className="timestamp-container">
                    <Clock size={16} className="clock-icon" />
                    <span className="timestamp-text">{request.timestamp}</span>
                  </div>
                </div>
                
                <div className="card-user">
                  <div className="user-avatar">
                    <img src="/api/placeholder/24/24" alt="User" />
                  </div>
                  <div className="user-email">
                    {request.email} {request.isYou && <span className="you-tag">( You )</span>}
                  </div>
                </div>
                
                <div className="card-subject">
                  <div className="subject-label">Subject :</div>
                  <div className="subject-content">{request.subject}</div>
                </div>
                
                <div className="card-footer">
                  <div className={`status-tag ${getStatusClass(request.status)}`}>
                    {request.status}
                  </div>
                  <div className={`priority-tag ${getPriorityClass(request.priority)}`}>
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
            <div className="ticket-id-container">
              <span className="ticket-id">{selectedTicket.id}</span>
              <span className={`status-tag ${getStatusClass(selectedTicket.status)}`}>
                {selectedTicket.status}
              </span>
              <span className={`priority-tag ${getPriorityClass(selectedTicket.priority)}`}>
                {selectedTicket.priority}
              </span>
            </div>

            <div className="ticket-timestamps">
              <div className="timestamp-info">
                <Clock size={16} className="clock-icon" />
                <span>Created At: {selectedTicket.timestamp}</span>
              </div>
              <div className="timestamp-info">
                <Clock size={16} className="clock-icon" />
                <span>Last Updated At: {selectedTicket.lastUpdated}</span>
              </div>
            </div>
            
            <button 
              className="close-btn"
              onClick={closeTicketDetail}
            >
              Close ( X )
            </button>
          </div>
          
          <div className="ticket-content">
            <div className="ticket-subject">
              <div className="subject-label">Subject :</div>
              <div className="subject-text">{selectedTicket.subject}</div>
            </div>
            
            <div className="ticket-sender">
              <div className="sender-avatar">
                <img src="/api/placeholder/24/24" alt="User" />
              </div>
              <div className="sender-details">
                <div className="sender-email">{selectedTicket.email}</div>
                <div className="sender-time">{selectedTicket.timestamp}</div>
              </div>
            </div>
            
            <div className="ticket-recipients">
              <div className="recipient-row">
                <div className="recipient-label">To</div>
                <div className="recipient-value">{selectedTicket.to}</div>
              </div>
              
              <div className="recipient-row">
                <div className="recipient-label">CC</div>
                <div className="recipient-value">{selectedTicket.cc}</div>
              </div>
            </div>
            
            <div className="ticket-body">
              <h3>Request</h3>
              <p>{selectedTicket.body}</p>
            </div>
            
            {selectedTicket.updates.length > 0 && (
              <div className="ticket-updates">
                <h3>Request Updates</h3>
                {selectedTicket.updates.map((update, index) => (
                  <div key={index} className="update-item">
                    <div className="update-avatar">
                      <img src="/api/placeholder/24/24" alt="User" />
                    </div>
                    <div className="update-content">
                      <div className="update-message">{update.message}</div>
                      <div className="update-info">
                        <span className="update-sender">{update.from}</span>
                        <span className="update-time">{update.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="ticket-remark">
              <h3>Remark</h3>
              <div className="remark-text">This request is closed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClosedRequest;