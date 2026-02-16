import { useState, useRef, useEffect } from 'react';
import './DailyReport.css';

function DailyReport() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Recent');
  const dropdownRef = useRef(null);
  const [reports, setReports] = useState([
    {
      id: 1,
      date: 'Tuesday, 04/03/2025',
      createdBy: 'Demo Emp',
      manager: 'demo.manager@munc.in',
      taskTitle: 'JFAPOJF',
      taskDescription: 'ASDFSDFSD',
      complication: 'REAERAW',
      link: 'Click to view Link',
      remarks: 'FASDFASDF'
    },
    {
      id: 2,
      date: 'Wednesday, 05/03/2025',
      createdBy: 'Demo Emp',
      manager: 'demo.manager@munc.in',
      taskTitle: 'sv',
      taskDescription: 'czgs',
      complication: 'vss',
      link: 'Click to view Link',
      remarks: 'svs'
    },
    {
      id: 3,
      date: 'Tuesday, 04/03/2025',
      createdBy: 'Admin Admin',
      manager: '',
      taskTitle: 'How do I communicate with someone at Cash App ((Tabbu))][657',
      taskDescription: 'mjrij sdf slfkryo ksttog',
      complication: 'wfwtjt youthoi hlkokgm',
      link: 'Click to view Link',
      remarks: 'kmsadi'
    },
    {
      id: 4,
      date: 'Wednesday, 05/03/2025',
      createdBy: 'Amar kumar',
      manager: 'demo.manager@munc.in',
      taskTitle: 'cccc',
      taskDescription: 'cccc',
      complication: '',
      link: 'Click to view Link',
      remarks: 'ccccc'
    },
    {
      id: 5,
      date: 'Wednesday, 05/03/2025',
      createdBy: 'Admin Admin',
      manager: '',
      taskTitle: 'Hi There',
      taskDescription: 'To design and develop a',
      complication: 'To design and develop a',
      link: 'Click to view Link',
      remarks: '89'
    },
    {
      id: 6,
      date: 'Monday, 10/03/2025',
      createdBy: 'Admin Admin',
      manager: '',
      taskTitle: 'classified munc',
      taskDescription: '10 classified post',
      complication: 'not getting websites',
      link: 'No Link attached',
      remarks: ''
    },
    {
      id: 7,
      date: 'Monday, 10/03/2025',
      createdBy: 'Admin Admin',
      manager: '',
      taskTitle: 'dfew',
      taskDescription: 'wfwef',
      complication: 'dfwerw',
      link: 'No Link attached',
      remarks: 'ef'
    },
    {
      id: 8,
      date: 'Wednesday, 12/03/2025',
      createdBy: 'Demo Emp',
      manager: 'demo.manager@munc.in',
      taskTitle: 'chat',
      taskDescription: 'Improve the chat section',
      complication: 'solve issues',
      link: 'No Link attached',
      remarks: 'all good'
    },
    {
      id: 9,
      date: 'Wednesday, 12/03/2025',
      createdBy: 'Demo Emp',
      manager: 'demo.manager@munc.in',
      taskTitle: 'Leave',
      taskDescription: 'approved leave problems',
      complication: '',
      link: 'No Link attached',
      remarks: 'ok'
    },
    {
      id: 10,
      date: 'Wednesday, 12/03/2025',
      createdBy: 'Demo Emp',
      manager: 'demo.manager@munc.in',
      taskTitle: 'UI',
      taskDescription: 'Improve UI of emp',
      complication: 'Routing issue solve.',
      link: 'No Link attached',
      remarks: 'fix all routes'
    },
    {
      id: 11,
      date: 'Monday, 17/03/2025',
      createdBy: 'Admin Admin',
      manager: '',
      taskTitle: 'erey',
      taskDescription: 'frge',
      complication: 'rfyger',
      link: 'No Link attached',
      remarks: 'etw'
    },
    {
      id: 12,
      date: 'Monday, 17/03/2025',
      createdBy: 'Admin Admin',
      manager: '',
      taskTitle: 'Sey6ert b hrth',
      taskDescription: 'srtery',
      complication: 'ytior8',
      link: 'No Link attached',
      remarks: 'rytet'
    },
    {
      id: 13,
      date: 'Monday, 17/03/2025',
      createdBy: 'Admin Admin',
      manager: '',
      taskTitle: 'uyu',
      taskDescription: 'wer',
      complication: 'uyuu',
      link: 'No Link attached',
      remarks: 'ery'
    },
    {
      id: 14,
      date: 'Monday, 17/03/2025',
      createdBy: 'Demo Emp',
      manager: 'demo.manager@munc.in',
      taskTitle: 'sfrr',
      taskDescription: 'drf',
      complication: 'edr',
      link: 'No Link attached',
      remarks: 'sfsfr'
    },
    {
      id: 15,
      date: 'Monday, 17/03/2025',
      createdBy: 'Demo Manager',
      manager: 'demo.admin@munc.in',
      taskTitle: 'sdhgshdghjg',
      taskDescription: 'asjgsjgsjgsjg',
      complication: 'gshjgsv',
      link: 'Click to view Link',
      remarks: 'sdsda'
    }
  ]);

  const handleEditCell = (id, field, value) => {
    // Logic to handle cell editing if needed
    console.log(`Editing cell: ${id}, ${field}, ${value}`);
  };
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="daily-report-container">
      <div className="header">
        <div className="title-section">
          <h1>Daily Report</h1>
          <p>You can view and generate your daily report here.</p>
        </div>
        <div className="action-section">
          <div className="dropdown-container" ref={dropdownRef}>
            <div className="dropdown-select" onClick={toggleDropdown}>
              {selectedOption}
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div 
                  className={`dropdown-item ${selectedOption === 'Recent' ? 'active' : ''}`}
                  onClick={() => handleOptionSelect('Recent')}
                >
                  Recent
                </div>
                <div 
                  className={`dropdown-item ${selectedOption === 'Today' ? 'active' : ''}`}
                  onClick={() => handleOptionSelect('Today')}
                >
                  Today
                </div>
                <div 
                  className={`dropdown-item ${selectedOption === 'This Week (Mon-Sun)' ? 'active' : ''}`}
                  onClick={() => handleOptionSelect('This Week (Mon-Sun)')}
                >
                  This Week (Mon-Sun)
                </div>
                <div 
                  className={`dropdown-item ${selectedOption === 'This Month' ? 'active' : ''}`}
                  onClick={() => handleOptionSelect('This Month')}
                >
                  This Month
                </div>
                <div 
                  className={`dropdown-item ${selectedOption === 'This Quarter' ? 'active' : ''}`}
                  onClick={() => handleOptionSelect('This Quarter')}
                >
                  This Quarter
                </div>
                <div 
                  className={`dropdown-item ${selectedOption === 'This Half Year' ? 'active' : ''}`}
                  onClick={() => handleOptionSelect('This Half Year')}
                >
                  This Half Year
                </div>
                <div 
                  className={`dropdown-item ${selectedOption === 'This Year' ? 'active' : ''}`}
                  onClick={() => handleOptionSelect('This Year')}
                >
                  This Year
                </div>
              </div>
            )}
          </div>
          <button className="add-report-btn">Add Report</button>
          <button className="alt-r-btn">Alt + R</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Created By</th>
              <th>Manager</th>
              <th>Task Title</th>
              <th>Task Description</th>
              <th>Complication</th>
              <th>Link</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.date}</td>
                <td>{report.createdBy}</td>
                <td>{report.manager}</td>
                <td>{report.taskTitle}</td>
                <td className="editable-cell">
                  <div className="cell-content">
                    <span>{report.taskDescription}</span>
                    <button className="edit-btn">✎</button>
                  </div>
                </td>
                <td className="editable-cell">
                  <div className="cell-content">
                    <span>{report.complication}</span>
                    <button className="edit-btn">✎</button>
                  </div>
                </td>
                <td>
                  {report.link === 'Click to view Link' ? (
                    <a href="#" className="view-link">
                      <span className="link-icon">🔗</span> Click to view Link
                    </a>
                  ) : (
                    <span className="no-link">{report.link}</span>
                  )}
                </td>
                <td className="editable-cell">
                  <div className="cell-content">
                    <span>{report.remarks}</span>
                    <button className="edit-btn">✎</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DailyReport;