import React, { useState } from 'react';
import './payrollDashboard.css'; // Assuming you have a CSS file for styling
const PayrollDashboard = () => {
  // Mock data
  const employees = [
    { id: 1, name: "Adrian William", role: "Admin", status: "Processed" },
    { id: 2, name: "TJ Salvatore", role: "Designer", status: "Processed" },
    { id: 3, name: "Danai Manager", role: "Team Manager", status: "Processed" },
    { id: 4, name: "Mishal Sharma", role: "Writer", status: "Processed" },
    { id: 5, name: "Anish Sharma", role: "Social Accounts", status: "Processed" },
    { id: 6, name: "Rashid", role: "Support Manager", status: "Processed" },
    { id: 7, name: "Pavel Ganich", role: "Visual Designer", status: "Processed" },
    { id: 8, name: "Tahad Sabri", role: "Content Writer", status: "Processed" },
    { id: 9, name: "Dawa", role: "Test Support", status: "Processed" },
    { id: 10, name: "Stephen Spates", role: "Frontend Developer", status: "Processed" },
    { id: 11, name: "Amdin Sheikh", role: "Quality Analyst", status: "Processed" },
    { id: 12, name: "Samuel Jordan", role: "Frontend Developer", status: "Processed" },
    { id: 13, name: "Clark Skupie", role: "UI/UX Designer", status: "Processed" },
    { id: 14, name: "Saulter Delfaro", role: "UI/UX Designer", status: "Processed" },
    { id: 15, name: "Mark Toria", role: "Full Stack Developer", status: "Processed" },
    { id: 16, name: "Abbot Craig", role: "Cyber Security", status: "Processed" }
  ];

  return (
    <div className="payroll-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="title">
          <h1>Payroll Dashboard</h1>
          <p>You have never processed payroll.</p>
        </div>
        <div className="actions">
          <div className="dropdown">
            <span>Rajiv Nayak</span>
            <select className="select-dropdown">
              <option value="current">2023</option>
            </select>
          </div>
          <button className="help-btn">Help</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Process Payroll Section */}
        <section className="process-payroll">
          <div className="section-header">
            <div className="title-container">
              <h2>Process Payroll for: May 2025</h2>
              <span className="approved-tag">Approved</span>
            </div>
            <div className="date-range">
              <span>From: 01 May To: 31 May 2025</span>
            </div>
          </div>

          <div className="tabs">
            <button className="tab active">Overview</button>
            <button className="tab">Earnings</button>
          </div>

          <div className="dashboard-cards">
            <div className="card net-pay">
              <h3>Net Pay</h3>
              <p className="amount">₹ 0</p>
              <div className="footnote">No balance to be paid.</div>
            </div>

            <div className="card">
              <h3>Earnings</h3>
              <p className="amount">₹ 26,790.00</p>
            </div>

            <div className="card">
              <h3>Deductions + Contributions</h3>
              <div className="amount-row">
                <span>₹ 0.00</span>
              </div>
              <div className="amount-row">
                <span>₹ 0.00</span>
              </div>
            </div>

            <div className="card">
              <h3>Employee Statutory Deductions</h3>
              <div className="amount-row">
                <span>₹ 0.00</span>
              </div>
              <div className="date-info">
                <span>Last Date to Deposit</span>
                <span>15th June, 2025</span>
              </div>
            </div>

            <div className="card">
              <h3>Employer Statutory Fund (CTC)</h3>
              <div className="amount-row">
                <span>₹ 0.00</span>
              </div>
              <div className="date-info">
                <span>Last Date to Deposit</span>
                <span>15th June, 2025</span>
              </div>
            </div>

            <div className="card">
              <h3>Tax Deducted at Source (TDS)</h3>
              <div className="amount-row">
                <span>₹ 0.00</span>
              </div>
              <div className="date-info">
                <span>Last Date to Deposit</span>
                <span>7th June, 2025</span>
              </div>
            </div>
          </div>

          <div className="summary-section">
            <div className="employee-summary">
              <div className="summary-header">
                <h3>16 Nos.</h3>
                <p>Active Employee on Payroll</p>
              </div>
              <button className="process-payroll-btn">Process Payroll</button>
            </div>
          </div>
        </section>

        {/* Employees Section */}
        <section className="employees-section">
          <div className="section-header">
            <h3>Employees</h3>
          </div>
          <div className="employees-table">
            <div className="table-header">
              <div className="column id">#</div>
              <div className="column name">Name</div>
              <div className="column role">Role</div>
              <div className="column status">Status</div>
            </div>
            <div className="table-body">
              {employees.map(employee => (
                <div key={employee.id} className="table-row">
                  <div className="column id">
                    <div className="avatar">{employee.name.charAt(0)}</div>
                  </div>
                  <div className="column name">{employee.name}</div>
                  <div className="column role">{employee.role}</div>
                  <div className="column status">{employee.status}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="overview-section">
          <div className="section-header">
            <h3>Overview</h3>
            <button className="expand-btn">
              <i className="icon-expand">⤢</i>
            </button>
          </div>
          <div className="spending-overview">
            <h4>Spending over the year</h4>
            <p className="total-spending">₹ 40,233.00</p>
            <div className="change-indicators">
              <span className="positive">+14.55%</span>
              <span>vs Last Year</span>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart">
              {/* Visual representation of the chart */}
              <div className="chart-bars">
                <div className="month">Jan 2025</div>
                <div className="month">Feb 2025</div>
                <div className="month">Mar 2025</div>
                <div className="month">Apr 2025</div>
                <div className="month current">May 2025</div>
                <div className="month">Jun 2025</div>
                <div className="month">Jul 2025</div>
                <div className="month">Aug 2025</div>
                <div className="month">Sep 2025</div>
                <div className="month">Oct 2025</div>
                <div className="month">Nov 2025</div>
                <div className="month">Dec 2025</div>
                <div className="bar-container">
                  <div className="bar" style={{ height: '0%' }}></div>
                  <div className="bar" style={{ height: '0%' }}></div>
                  <div className="bar" style={{ height: '0%' }}></div>
                  <div className="bar" style={{ height: '0%' }}></div>
                  <div className="bar active" style={{ height: '80%' }}></div>
                  <div className="bar" style={{ height: '0%' }}></div>
                  <div className="bar" style={{ height: '0%' }}></div>
                  <div className="bar" style={{ height: '0%' }}></div>
                  <div className="bar" style={{ height: '0%' }}></div>
                  <div className="bar" style={{ height: '0%' }}></div>
                  <div className="bar" style={{ height: '0%' }}></div>
                  <div className="bar" style={{ height: '0%' }}></div>
                </div>
              </div>
            </div>
            <div className="time-filters">
              <button className="time-filter active">Current Year</button>
              <button className="time-filter">Previous Year</button>
              <button className="time-filter">Current Month</button>
            </div>
          </div>
        </section>

        {/* Activity Section */}
        <section className="activity-section">
          <div className="section-header">
            <h3>Activity</h3>
            <button className="refresh-btn">
              <i className="icon-refresh">↻</i>
            </button>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon salary"></div>
              <div className="activity-content">
                <p>Attendance & Salaries Checked</p>
              </div>
              <div className="activity-status completed"></div>
            </div>
            <div className="activity-item">
              <div className="activity-icon taxes"></div>
              <div className="activity-content">
                <p>Salary Checked</p>
              </div>
              <div className="activity-status completed"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PayrollDashboard;