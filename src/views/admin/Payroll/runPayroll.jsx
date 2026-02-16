import React from 'react';
import { Search } from 'lucide-react';
import './runPayroll.css'; // Assuming you have a CSS file for styles

const RunPayroll = () => {
  const payrollData = [
    {
      name: 'Payroll Mar',
      employees: 13,
      paid: 0,
      inProcess: 13,
      onHold: 0,
      period: 'March 2025',
      status: 'inprogress',
      totalAmount: '₹ 60,285.00',
      dateCreated: '07/03/2025, 11:11:10 PM',
      processedDate: '23/03/2025, 10:45:15 AM'
    },
    {
      name: 'Payroll Apr',
      employees: 15,
      paid: 0,
      inProcess: 15,
      onHold: 0,
      period: 'April 2025',
      status: 'inprogress',
      totalAmount: '₹ 78,062.00',
      dateCreated: '08/04/2025, 12:55:09 PM',
      processedDate: '30/04/2025, 03:50:18 PM'
    },
    {
      name: 'Payroll May',
      employees: 16,
      paid: 0,
      inProcess: 16,
      onHold: 0,
      period: 'May 2025',
      status: 'inprogress',
      totalAmount: '₹ 6,77,99,589.00',
      dateCreated: '01/05/2025, 01:35:53 PM',
      processedDate: '02/05/2025, 11:25:37 AM'
    },
    {
      name: 'Payroll Apr',
      employees: '01',
      paid: 0,
      inProcess: 1,
      onHold: 0,
      period: 'April 2025',
      status: 'inprogress',
      totalAmount: '₹ 0.00',
      dateCreated: '01/05/2025, 02:58:10 PM',
      processedDate: '01/05/2025, 02:58:10 PM'
    }
  ];

  return (
    <div className="run-payroll-container">
      <div className="header">
        <h1 className="title">Run Payroll</h1>
        <p className="subtitle">Review your employee's</p>
      </div>

      <div className="tabs">
        <div className="tab active">
          <span className="tab-icon">≡</span>
          <span>Payroll List</span>
        </div>
        <div className="tab">
          <span className="tab-icon">⚙</span>
          <span>Payroll Setting</span>
        </div>
      </div>

      <div className="content">
        <div className="content-header">
          <span className="total-text">01 Total Payroll</span>
          <div className="content-actions">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search by Payroll Name.." 
                className="search-input" 
              />
              <Search className="search-icon" size={18} />
            </div>
            <button className="export-button">Export</button>
          </div>
        </div>

        <div className="table-container">
          <table className="payroll-table">
            <thead>
              <tr>
                <th>Payroll Name</th>
                <th>No's of Employee</th>
                <th>Paid</th>
                <th>In Process</th>
                <th>On Hold</th>
                <th>Period</th>
                <th>Status</th>
                <th>Total Amount</th>
                <th>Date Created</th>
                <th>Processed Date</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((payroll, index) => (
                <tr key={index}>
                  <td className="payroll-name">{payroll.name}</td>
                  <td>{payroll.employees}</td>
                  <td>{payroll.paid}</td>
                  <td>{payroll.inProcess}</td>
                  <td>{payroll.onHold}</td>
                  <td>{payroll.period}</td>
                  <td>
                    <span className={`status ${payroll.status}`}>
                      {payroll.status}
                    </span>
                  </td>
                  <td>{payroll.totalAmount}</td>
                  <td>{payroll.dateCreated}</td>
                  <td>{payroll.processedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RunPayroll;