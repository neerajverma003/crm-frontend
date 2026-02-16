import { useState, useEffect } from 'react';
import './Task.css'; // Import your CSS file for styling
const Task = () => {
  // Sample task data
  const [tasks] = useState([
    {
      id: 'TASK-101',
      title: 'Develop user authentication module',
      priority: 'high',
      status: 'in-progress',
      startDate: '15th, Mar 2025',
      endDate: '25th, Mar 2025',
      assignee: 'John Doe',
      progress: 65,
      description: 'Implement JWT authentication for the API endpoints'
    },
    {
      id: 'TASK-102',
      title: 'Design dashboard UI',
      priority: 'medium',
      status: 'new',
      startDate: '18th, Mar 2025',
      endDate: '22nd, Mar 2025',
      assignee: 'Jane Smith',
      progress: 0,
      description: 'Create wireframes and mockups for the admin dashboard'
    },
    {
      id: 'TASK-103',
      title: 'Database schema design',
      priority: 'high',
      status: 'completed',
      startDate: '10th, Mar 2025',
      endDate: '15th, Mar 2025',
      assignee: 'Mike Johnson',
      progress: 100,
      description: 'Design and implement the database schema for the application'
    },
    {
      id: 'TASK-104',
      title: 'API documentation',
      priority: 'low',
      status: 'in-progress',
      startDate: '20th, Mar 2025',
      endDate: '30th, Mar 2025',
      assignee: 'Sarah Williams',
      progress: 30,
      description: 'Write comprehensive documentation for all API endpoints'
    },
    {
      id: 'TASK-105',
      title: 'Mobile app prototype',
      priority: 'medium',
      status: 'new',
      startDate: '22nd, Mar 2025',
      endDate: '5th, Apr 2025',
      assignee: 'Alex Brown',
      progress: 0,
      description: 'Create clickable prototype for the mobile application'
    },
    {
      id: 'TASK-106',
      title: 'Performance optimization',
      priority: 'high',
      status: 'in-progress',
      startDate: '12th, Mar 2025',
      endDate: '28th, Mar 2025',
      assignee: 'John Doe',
      progress: 45,
      description: 'Identify and fix performance bottlenecks in the application'
    },
    {
      id: 'TASK-107',
      title: 'User testing session',
      priority: 'low',
      status: 'completed',
      startDate: '5th, Mar 2025',
      endDate: '10th, Mar 2025',
      assignee: 'Jane Smith',
      progress: 100,
      description: 'Conduct user testing sessions and gather feedback'
    },
    {
      id: 'TASK-108',
      title: 'Bug fixes',
      priority: 'medium',
      status: 'rejected',
      startDate: '1st, Mar 2025',
      endDate: '15th, Mar 2025',
      assignee: 'Mike Johnson',
      progress: 80,
      description: 'Address critical bugs reported by QA team'
    },
    {
      id: 'TASK-109',
      title: 'Deployment pipeline setup',
      priority: 'high',
      status: 'in-progress',
      startDate: '18th, Mar 2025',
      endDate: '25th, Mar 2025',
      assignee: 'Sarah Williams',
      progress: 60,
      description: 'Configure CI/CD pipeline for automated deployments'
    },
    {
      id: 'TASK-110',
      title: 'Marketing materials',
      priority: 'low',
      status: 'new',
      startDate: '25th, Mar 2025',
      endDate: '5th, Apr 2025',
      assignee: 'Alex Brown',
      progress: 0,
      description: 'Create promotional materials for product launch'
    }
  ]);

  const [currentFilter, setCurrentFilter] = useState('all');
  const [isTableView, setIsTableView] = useState(false);
  const [taskCounts, setTaskCounts] = useState({
    all: 0,
    new: 0,
    'in-progress': 0,
    completed: 0,
    rejected: 0
  });

  // Calculate task counts
  useEffect(() => {
    setTaskCounts({
      all: tasks.length,
      new: tasks.filter(task => task.status === 'new').length,
      'in-progress': tasks.filter(task => task.status === 'in-progress').length,
      completed: tasks.filter(task => task.status === 'completed').length,
      rejected: tasks.filter(task => task.status === 'rejected').length
    });
  }, [tasks]);

  // Filter tasks based on current filter
  const filteredTasks = currentFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === currentFilter);

  // Calculate duration between dates (simplified)
  const calculateDuration = (startDateStr, endDateStr) => {
    const startDay = parseInt(startDateStr.split(' ')[0]);
    const endDay = parseInt(endDateStr.split(' ')[0]);
    return Math.max(1, endDay - startDay + 1);
  };

  // Open blank page
  const openBlankPage = () => {
    window.open('about:blank', '_blank');
  };

  // Get status class and text
  const getStatusInfo = (status) => {
    switch (status) {
      case 'new':
        return { class: 'status-new', text: 'New' };
      case 'in-progress':
        return { class: 'status-in-progress', text: 'In Progress' };
      case 'completed':
        return { class: 'status-completed', text: 'Completed' };
      case 'rejected':
        return { class: 'status-rejected', text: 'Rejected' };
      default:
        return { class: '', text: '' };
    }
  };

  // Get priority class
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  // Create avatar initials
  const getAvatarInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="task-dashboard">
      <div className="header">
        <div className="status-tabs">
          <div 
            className={`tab ${currentFilter === 'all' ? 'active' : ''}`} 
            onClick={() => setCurrentFilter('all')}
          >
            All Tasks <span className="tab-counter">{taskCounts.all}</span>
          </div>
          <div 
            className={`tab ${currentFilter === 'new' ? 'active' : ''}`} 
            onClick={() => setCurrentFilter('new')}
          >
            New <span className="tab-counter">{taskCounts.new}</span>
          </div>
          <div 
            className={`tab ${currentFilter === 'in-progress' ? 'active' : ''}`} 
            onClick={() => setCurrentFilter('in-progress')}
          >
            In Progress <span className="tab-counter">{taskCounts['in-progress']}</span>
          </div>
          <div 
            className={`tab ${currentFilter === 'completed' ? 'active' : ''}`} 
            onClick={() => setCurrentFilter('completed')}
          >
            Completed <span className="tab-counter">{taskCounts.completed}</span>
          </div>
          <div 
            className={`tab ${currentFilter === 'rejected' ? 'active' : ''}`} 
            onClick={() => setCurrentFilter('rejected')}
          >
            Rejected <span className="tab-counter">{taskCounts.rejected}</span>
          </div>
        </div>
        <div className="action-buttons">
          <button 
            className="btn" 
            onClick={() => setIsTableView(!isTableView)}
          >
            {isTableView ? 'Switch to Card View' : 'Switch to Table View'}
          </button>
          <button className="btn btn-primary" onClick={openBlankPage}>
            Create Task
          </button>
        </div>
      </div>

      {/* Task Grid (Card View) */}
      {!isTableView && (
        <div className="task-grid">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div>📭</div>
              <h3>No tasks found</h3>
              <p>There are no tasks matching your current filter</p>
            </div>
          ) : (
            filteredTasks.map(task => {
              const statusInfo = getStatusInfo(task.status);
              const priorityClass = getPriorityClass(task.priority);
              const initials = getAvatarInitials(task.assignee);

              return (
                <div className="task-card" key={task.id}>
                  <div className="task-header">
                    <div className="task-id">{task.id}</div>
                    <div className={`priority ${priorityClass}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </div>
                  </div>
                  <div className="task-title">{task.title}</div>
                  <div className="task-details">
                    <div className="detail-column">
                      <div className="detail-label">Status</div>
                      <div className="detail-value">
                        <span className={`status-badge ${statusInfo.class}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>
                    <div className="detail-column">
                      <div className="detail-label">Start Date</div>
                      <div className="detail-value">{task.startDate}</div>
                    </div>
                    <div className="detail-column">
                      <div className="detail-label">End Date</div>
                      <div className="detail-value">{task.endDate}</div>
                    </div>
                    <div className="detail-column">
                      <div className="detail-label">Assignee</div>
                      <div className="detail-value project-lead">
                        <div className="avatar">{initials}</div>
                        <span>{task.assignee}</span>
                      </div>
                    </div>
                  </div>
                  <div className="duration">
                    ⏱️ Duration: {calculateDuration(task.startDate, task.endDate)} days
                  </div>
                  <div className="progress-container">
                    <div className="progress-text">{task.progress}% Completed</div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Task Table (Table View) */}
      {isTableView && (
        <table className="task-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Assignee</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
                  No tasks matching your current filter
                </td>
              </tr>
            ) : (
              filteredTasks.map(task => {
                const statusInfo = getStatusInfo(task.status);
                const priorityClass = getPriorityClass(task.priority);

                return (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.title}</td>
                    <td>
                      <span className={`priority ${priorityClass}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${statusInfo.class}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td>{task.startDate}</td>
                    <td>{task.endDate}</td>
                    <td>{task.assignee}</td>
                    <td>
                      <div className="progress-container">
                        <div className="progress-text">{task.progress}%</div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Task;