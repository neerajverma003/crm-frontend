import React, { useState } from 'react';
import {
  CCard, CCardBody, CFormSelect, CFormInput, CButton,
  CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow,
  CTableDataCell, CModal, CModalHeader, CModalTitle, CModalBody,
  CModalFooter, CBadge
} from '@coreui/react';
 
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
 
const YEARS = ['2023', '2024', '2025', '2026'];
 
const HolidayList = () => {
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [searchTerm, setSearchTerm] = useState('');
 
  const [holidays, setHolidays] = useState([
    {
      date: '01/05/2025',
      name: "International Workers' Day",
      type: 'National Holiday',
      month: 'May',
      year: '2025'
    }
  ]);
 
  const [visible, setVisible] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('National Holiday');
 
  const handleAddHoliday = () => {
    if (!newDate || !newName.trim()) {
      alert('Please fill in all fields.');
      return;
    }
 
    const dateObj = new Date(newDate);
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const year = dateObj.getFullYear().toString();
    const formattedDate = newDate.split('-').reverse().join('/');
 
    const isDuplicate = holidays.some(
      (h) => h.date === formattedDate && h.name.toLowerCase() === newName.toLowerCase()
    );
 
    if (isDuplicate) {
      alert('Holiday already exists.');
      return;
    }
 
    const newHoliday = {
      date: formattedDate,
      name: newName,
      type: newType,
      month,
      year
    };
 
    setHolidays([...holidays, newHoliday]);
    setVisible(false);
    setNewDate('');
    setNewName('');
    setNewType('National Holiday');
  };
 
  const filteredHolidays = holidays
    .filter((holiday) =>
      holiday.month === selectedMonth &&
      holiday.year === selectedYear &&
      holiday.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-'))
    );
 
  return (
    <>
      <CCard className="p-4">
        <CCardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>
              Holiday List <CBadge color="primary">{filteredHolidays.length}</CBadge>
            </h5>
          </div>
 
          <p>You can create and view holidays here</p>
 
          <div className="d-flex flex-wrap gap-3 align-items-end mb-3">
            <div>
              <label htmlFor="month-select">Month</label>
              <CFormSelect
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {MONTHS.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </CFormSelect>
            </div>
 
            <div>
              <label htmlFor="year-select">Year</label>
              <CFormSelect
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </CFormSelect>
            </div>
 
            <CFormInput
              type="text"
              placeholder="Search Holiday"
              className="ms-auto"
              style={{ maxWidth: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
 
            <CButton color="primary" onClick={() => setVisible(true)}>
              Add Holiday
            </CButton>
          </div>
 
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Type</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredHolidays.map((holiday, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{holiday.date}</CTableDataCell>
                  <CTableDataCell>{holiday.name}</CTableDataCell>
                  <CTableDataCell>{holiday.type}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
 
      {/* Add Holiday Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add Holiday</CModalTitle>
          <CButton color="link" onClick={() => setVisible(false)}></CButton>
        </CModalHeader>
        <CModalBody className="d-flex flex-column gap-3">
          <label htmlFor="date-input">Date</label>
          <CFormInput
            id="date-input"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
 
          <label htmlFor="name-input">Holiday Name</label>
          <CFormInput
            id="name-input"
            type="text"
            placeholder="Holiday Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
 
          <label htmlFor="type-select">Holiday Type</label>
          <CFormSelect
            id="type-select"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
          >
            <option>National Holiday</option>
            <option>Optional Holiday</option>
            <option>Religious Holiday</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleAddHoliday}>
            Add Holiday
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};
 
export default HolidayList;