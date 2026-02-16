import React from 'react';
import { FiCopy, FiChevronRight, FiChevronLeft, FiWifi, FiMonitor } from 'react-icons/fi';
import { FaChrome } from 'react-icons/fa';

const Company = () => {
  // Sample company data
  const companyData = {
    name: "Medlay International Pvt. Ltd.",
    address: "214, 2nd Floor, Tower-B, Ithum Tower, Electronic City, Sector-62, Noida,",
    country: "India",
    state: "Uttar Pradesh",
    city: "Noida",
    postalCode: "201301",
    website: "kasperinfotech.com",
    email: "hr@kasperinfotech.org",
    contactPerson: "Kishor Kumar",
    contactNo: "8006236800",
    faxNo: "N/A",
    panNo: "AAGCK3165K",
    gstNo: "07AAGCK3165K1ZB",
    cinNo: "U74999DL2016PTC306619"
  };

  // Current date and time
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString();

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <div className="mainbar-grid">
        <div className="pb-4" style={{ overflow: 'auto' }}>
          <div className="container-fluid py-2">
            {/* Header */}
            <div className="d-flex justify-content-between py-2">
              <div className="my-auto">
                <h5 className="m-0" style={{ color: 'var(--secondaryDashColorDark)', fontWeight: 600 }}>
                  Company Details (1)
                </h5>
                <p className="m-0" style={{ color: 'var(--secondaryDashColorDark)' }}>
                  You can see all Company list here
                </p>
              </div>
            </div>

            {/* Table Section */}
            <div style={{ 
              color: 'var(--secondaryDashColorDark)', 
              overflow: 'auto', 
              maxHeight: '80vh', 
              minHeight: '80vh', 
              position: 'relative' 
            }}>
              <div>
                <div className="rounded-2" style={{ 
                  height: 'fit-content', 
                  maxHeight: '70vh', 
                  overflow: 'auto', 
                  position: 'relative', 
                  paddingBottom: '1rem', 
                  cursor: 'ew-resize', 
                  border: 'var(--borderLight)' 
                }}>
                  <table className="table mb-0 table-hover">
                    <thead>
                      <tr>
                        <th style={tableHeaderStyle}>Company Name</th>
                        <th style={tableHeaderStyle}>Address</th>
                        <th style={tableHeaderStyle}>Country</th>
                        <th style={tableHeaderStyle}>State</th>
                        <th style={tableHeaderStyle}>City</th>
                        <th style={tableHeaderStyle}>Postal Code</th>
                        <th style={tableHeaderStyle}>Website</th>
                        <th style={tableHeaderStyle}>Email</th>
                        <th style={tableHeaderStyle}>Contact Person</th>
                        <th style={tableHeaderStyle}>Contact No</th>
                        <th style={tableHeaderStyle}>Fax No</th>
                        <th style={tableHeaderStyle}>Pan No</th>
                        <th style={tableHeaderStyle}>GST No</th>
                        <th style={tableHeaderStyle}>CIN No</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <TableCell value={companyData.name} />
                        <TableCell value={companyData.address} />
                        <TableCell value={companyData.country} />
                        <TableCell value={companyData.state} />
                        <TableCell value={companyData.city} />
                        <TableCell value={companyData.postalCode} />
                        <TableCell value={companyData.website} />
                        <TableCell value={companyData.email} />
                        <TableCell value={companyData.contactPerson} />
                        <TableCell value={companyData.contactNo} />
                        <TableCell value={companyData.faxNo} />
                        <TableCell value={companyData.panNo} />
                        <TableCell value={companyData.gstNo} />
                        <TableCell value={companyData.cinNo} />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="container-fluid d-flex flex-column-reverse gap-4 py-2 px-2 rounded-2 gap-md-0 flex-md-row w-100 justify-content-between align-items-center my-2" 
              style={{ background: 'var(--primaryDashMenuColor)' }}>
              <div className="d-flex flex-column-reverse gap-4 py-1 px-2 rounded-2 gap-md-0 flex-md-row w-100 justify-content-between align-items-center" 
                style={{ background: 'var(--secondaryDashMenuColor)' }}>
                <div className="my-auto" style={{ color: 'black' }}>
                  Showing 1 to 1 of 1 results
                </div>
                <div className="d-flex align-items-center gap-1">
                  <button className="btn bg-light text-dark rounded-2 border shadow-sm mx-1 d-flex align-items-center gap-2" disabled>
                    <FiChevronLeft className="my-auto" /> 
                    <span className="d-none d-md-flex">Previous</span>
                  </button>
                  <div className="pagination d-flex flex-nowrap gap-2">
                    <button className="bg-primary text-white border-0 rounded-2" style={paginationButtonStyle}>1</button>
                  </div>
                  <button className="btn bg-light text-dark rounded-2 border shadow-sm mx-1 d-flex align-items-center gap-2" disabled>
                    <span className="d-none d-md-flex">Next</span> 
                    <FiChevronRight className="my-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="HrPannelFooter bg-dark w-100 text-white" style={{ zIndex: 50, position: 'absolute', bottom: 0 }}>
        <div className="d-flex justify-content-center align-items-center gap-5 p-2" 
          style={{ backgroundColor: 'var(--primaryDashMenuColor)', color: 'var(--primaryDashColorDark)' }}>
          <span className="d-none d-md-flex">
            <span className="text-capitalize">{currentDate}, {currentTime}</span>
          </span>
          <span className="d-flex align-items-center gap-2">
            <FiWifi /> <span className="d-none d-md-flex">Connected</span>
          </span>
          <span>
            <FaChrome /> Chrome
          </span>
          <span title="IP Address" className="d-flex align-items-center gap-1">
            <FiMonitor /> 122.161.52.228
          </span>
          <div>Unable to retrieve your location.</div>
        </div>
      </div>
    </div>
  );
};

// Reusable table cell component with copy functionality
const TableCell = ({ value }) => (
  <td className="hover-copy-container py-3 pr-4" style={tableCellStyle}>
    <div className="d-flex align-items-center gap-2">
      {value}
      {value !== "N/A" && (
        <span className="copy-button">
          <FiCopy />
        </span>
      )}
    </div>
  </td>
);

// Style objects
const tableHeaderStyle = {
  verticalAlign: 'middle',
  whiteSpace: 'pre',
  background: 'rgb(238, 238, 238)',
  color: 'rgb(83, 88, 98)',
  border: 'none',
  position: 'sticky',
  top: '0rem',
  zIndex: 2
};

const tableCellStyle = {
  verticalAlign: 'middle',
  whiteSpace: 'pre',
  background: 'transparent',
  color: 'var(--secondaryDashColorDark)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
};

const paginationButtonStyle = {
  border: 'none',
  height: '2.3rem',
  width: '2.3rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

export default Company;