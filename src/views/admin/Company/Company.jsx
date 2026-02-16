import React, { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import './Company.css'; // Assuming you have a CSS file for styling

function Company() {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'McEdey International Pvt. Ltd.',
      address: '214, 2nd Floor, Tower B, Ihum Tower, Electronic City, Sector 62, Noida',
      country: 'India',
      state: 'Uttar Pradesh',
      city: 'Noida',
      postalCode: '201301',
      website: 'kaspersoftech.com',
      email: 'hr@kaspersoftech.org',
      contactPerson: 'Kishor Kumar',
      contactNo: '8006236800',
      faxNo: 'N/A',
      panNo: 'AADCK3163K',
      gstNo: '07AADCK3163K1ZB',
      cinNo: 'U74990DL2015PTC286619'
    },
    {
      id: 2,
      name: 'TechNova Solutions',
      address: 'Plot 45, Sector 18, IT Park, Gurgaon',
      country: 'India',
      state: 'Haryana',
      city: 'Gurgaon',
      postalCode: '122001',
      website: 'technova.com',
      email: 'info@technova.com',
      contactPerson: 'Rajesh Sharma',
      contactNo: '9876543210',
      faxNo: 'N/A',
      panNo: 'AABCT1234D',
      gstNo: '06AABCT1234D1ZC',
      cinNo: 'U72900HR2010PTC041234'
    },
    {
      id: 3,
      name: 'GlobalSoft Technologies',
      address: '12th Floor, Infinity Tower, Salt Lake, Kolkata',
      country: 'India',
      state: 'West Bengal',
      city: 'Kolkata',
      postalCode: '700091',
      website: 'globalsofttech.com',
      email: 'contact@globalsofttech.com',
      contactPerson: 'Ananya Roy',
      contactNo: '9123456789',
      faxNo: 'N/A',
      panNo: 'AACCG5678H',
      gstNo: '19AACCG5678H1ZB',
      cinNo: 'U72200WB2005PTC104567'
    },
    {
      id: 4,
      name: 'NextGen Innovations',
      address: '5th Floor, Phoenix Mall, Viman Nagar, Pune',
      country: 'India',
      state: 'Maharashtra',
      city: 'Pune',
      postalCode: '411014',
      website: 'nextgen.com',
      email: 'support@nextgen.com',
      contactPerson: 'Vikram Patil',
      contactNo: '9988776655',
      faxNo: 'N/A',
      panNo: 'AAACN1234E',
      gstNo: '27AAACN1234E1ZC',
      cinNo: 'U74999MH2012PTC123456'
    },
    {
      id: 5,
      name: 'BrightFuture Pvt. Ltd.',
      address: '3rd Floor, Green Valley Complex, Banjara Hills, Hyderabad',
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      postalCode: '500034',
      website: 'brightfuture.com',
      email: 'careers@brightfuture.com',
      contactPerson: 'Suresh Reddy',
      contactNo: '9012345678',
      faxNo: 'N/A',
      panNo: 'AABCB1234F',
      gstNo: '36AABCB1234F1ZB',
      cinNo: 'U74140TG2018PTC098765'
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalResults = companies.length;

  const goToNextPage = () => {
    if (currentPage < Math.ceil(totalResults / 10)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="company-container">
      <div className="company-header">
        <div className="header-left">
          <h1>Company Details ({totalResults})</h1>
        </div>
        <div className="header-center">
          <p>You can see all Company list here</p>
        </div>
        <div className="header-right">
          <button className="create-btn">+ Create Company</button>
        </div>
      </div>

      <div className="table-container">
        <table className="company-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Address</th>
              <th>Country</th>
              <th>State</th>
              <th>City</th>
              <th>Postal Code</th>
              <th>Website</th>
              <th>Email</th>
              <th>Contact Person</th>
              <th>Contact No</th>
              <th>Fax No</th>
              <th>Pan No</th>
              <th>GST No</th>
              <th>CIN No</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.address}</td>
                <td>{company.country}</td>
                <td>{company.state}</td>
                <td>{company.city}</td>
                <td>{company.postalCode}</td>
                <td>{company.website}</td>
                <td>{company.email}</td>
                <td>{company.contactPerson}</td>
                <td>{company.contactNo}</td>
                <td>{company.faxNo}</td>
                <td>{company.panNo}</td>
                <td>{company.gstNo}</td>
                <td>{company.cinNo}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn">
                      <Edit2 size={16} />
                    </button>
                    <button className="delete-btn">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          <p>
            Showing <span className="page-number">1</span> to <span className="page-number">{Math.min(totalResults, 10)}</span> of{' '}
            <span className="page-number">{totalResults}</span> results
          </p>
        </div>
        <div className="pagination-controls">
          <button 
            className="pagination-btn prev-btn" 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          <button className="pagination-btn page-btn active">
            1
          </button>
          <button 
            className="pagination-btn next-btn" 
            onClick={goToNextPage} 
            disabled={currentPage === Math.ceil(totalResults / 10)}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Company;