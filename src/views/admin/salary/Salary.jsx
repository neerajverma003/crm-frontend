import React, { useState } from 'react'; // Added useState import
import { FiSearch, FiEdit2 } from 'react-icons/fi';
import { MdAttachMoney } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import AddSalary from './add/AddSalary'; // Import the new component

const SalaryManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Sample data for salary details
  const salaryData = [
    {
      id: 1,
      employeeId: 'DEMO0002',
      name: 'Hr Manager',
      image: 'http://res.cloudinary.com/dv8c2pofx/image/upload/v1741721783/dhc7rhowf682tyfq6l0g.jpg',
      designation: 'HR Manager',
      basicSalary: '₹ 39,439.00',
      hra: '₹ 34,784.00',
      conveyance: '₹ 8,000.00',
      otherAllowances: '₹ 3,484.00',
      totalSalary: '₹ 85,707.00'
    },
    {
      id: 2,
      employeeId: 'DEMO0003',
      name: 'Demo Manager',
      image: 'http://res.cloudinary.com/dv8c2pofx/image/upload/v1741182655/yie0goj65hk9e9egp6tx.png',
      designation: 'Digital Marketing',
      basicSalary: '₹ 30,000.00',
      hra: '₹ 15,000.00',
      conveyance: '₹ 5,000.00',
      otherAllowances: '₹ 10,000.00',
      totalSalary: '₹ 60,000.00'
    },
    {
      id: 3,
      employeeId: 'DEMO0004',
      name: 'Demo Emp',
      image: 'http://res.cloudinary.com/dv8c2pofx/image/upload/v1742800046/jpjrtn9pv1omzi1wgsn1.png',
      designation: 'Digital Marketing',
      basicSalary: '₹ 45,000.00',
      hra: '₹ 1,230.00',
      conveyance: '₹ 4,850.00',
      otherAllowances: '₹ 14.00',
      totalSalary: '₹ 51,094.00'
    },
    {
      id: 4,
      employeeId: 'DEMO0005',
      name: 'Amar kumar',
      image: 'http://res.cloudinary.com/dv8c2pofx/image/upload/v1741589839/h1jguizgcalg0qg1jynz.png',
      designation: 'Digital Marketing',
      basicSalary: '₹ 16,000.00',
      hra: '₹ 10,000.00',
      conveyance: '₹ 2,000.00',
      otherAllowances: '₹ 2,000.00',
      totalSalary: '₹ 30,000.00'
    },
    {
      id: 5,
      employeeId: 'DEMO0006',
      name: 'AMAR demo',
      image: 'http://res.cloudinary.com/dv8c2pofx/image/upload/v1741366551/yr5vavqozjzjfkyxoko2.png',
      designation: 'Digital Marketing',
      basicSalary: '₹ 15,000.00',
      hra: '₹ 1,200.00',
      conveyance: '₹ 9,000.00',
      otherAllowances: '₹ 900.00',
      totalSalary: '₹ 26,100.00'
    },
    {
      id: 6,
      employeeId: 'DEMO0009',
      name: 'Akash Singh',
      image: 'http://res.cloudinary.com/dv8c2pofx/image/upload/v1741366575/wpgjjs0vevihly4ucahr.jpg',
      designation: 'Digital Marketing',
      basicSalary: '₹ 32,500.00',
      hra: '₹ 15,200.00',
      conveyance: '₹ 35,124.00',
      otherAllowances: '₹ 21,533.00',
      totalSalary: '₹ 1,04,357.00'
    }
  ];

  // Filter data based on search term
  const filteredData = salaryData.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle Add Salary form
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  return (
    <div className="mainbar-grid">
      {showAddForm ? (
        <AddSalary goBack={toggleAddForm} />
      ) : (
        <div className="pb-4" style={{ overflow: 'auto' }}>
          <div className="container-fluid">
            {/* Header Section */}
            <div className="row mb-3 py-1 mt-2" style={{ background: 'var(--secondaryDashMenuColor)', color: 'var(--secondaryDashColorDark)' }}>
              <div className="my-auto d-flex justify-content-between">
                <div className="my-auto mt-2">
                  <div className="d-flex align-items-center gap-2">
                    <h5 className="m-0 p-0 text-capitalize" style={{ fontWeight: 500, color: 'var(--PrimaryColorDark)' }}>Salary Details</h5>
                  </div>
                  <p className="m-0" style={{ color: 'var(--Subtittles)' }}>You can view or create employees salary here.</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="searchholder d-none d-md-flex d-flex my-auto position-relative">
                    <input
                      className="form-control ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder"
                      type="text"
                      placeholder="Search by name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ height: '100%', width: '100%', paddingLeft: '2.2rem' }}
                    />
                    <FiSearch style={{ color: 'black', position: 'absolute', top: '30%', left: '5%', opacity: 0.4 }} />
                  </div>
                  <span className="btn btn-success my-auto d-flex align-items-center" title="Export to Excel" style={{ cursor: 'pointer', color: 'white' }}>
                    Excel
                  </span>
                  <span className="btn btn-danger my-auto d-flex align-items-center" title="Export to PDF" style={{ cursor: 'pointer' , color: 'white' }}>
                    PDF
                  </span>
                  <span 
                    className="btn btn-primary my-auto d-flex align-items-center"
                    onClick={toggleAddForm}
                  >
                    + Add Salary
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="searchholder d-block d-md-none d-flex position-relative">
              <input
                className="form-control"
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ height: '100%', width: '100%', paddingLeft: '15%' }}
              />
              <FiSearch className="text-black" style={{ position: 'absolute', top: '30%', left: '5%' }} />
            </div>

            {/* Salary Table */}
            <div className="row">
              <div style={{ width: '100%' }}>
                <div style={{ height: 'fit-content', maxHeight: '75vh', overflow: 'auto', position: 'relative', border: 'var(--borderLight)' }} className="rounded-2">
                  <table className="table mb-0 table-hover">
                    <thead>
                      <tr style={{ position: 'sticky', top: '0px', zIndex: 3 }}>
                        <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '-0.5rem', zIndex: 2 }}>#</th>
                        <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '-0.5rem', zIndex: 2 }}>User Profile</th>
                        <th className="text-center" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '-0.5rem', zIndex: 2 }}>Designation</th>
                        <th className="text-center" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '-0.5rem', zIndex: 2 }}>
                          <MdAttachMoney /> Basic Salary
                        </th>
                        <th className="text-center" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '-0.5rem', zIndex: 2 }}>
                          <MdAttachMoney /> HRA
                        </th>
                        <th className="text-center" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '-0.5rem', zIndex: 2 }}>
                          <MdAttachMoney /> Conveyance
                        </th>
                        <th className="text-center" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '-0.5rem', zIndex: 2 }}>
                          <MdAttachMoney /> Other Allowances
                        </th>
                        <th className="text-center" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(211, 229, 248)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '-0.5rem', zIndex: 2 }}>
                          <MdAttachMoney /> Total Salary
                        </th>
                        <th className="py-2 fw-normal text-end border-0" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'rgb(238, 238, 238)', color: 'rgb(83, 88, 98)', border: 'none', position: 'sticky', top: '0rem', zIndex: 2 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((employee, index) => (
                        <tr key={employee.id} className="stickey-top">
                          <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>{index + 1}</td>
                          <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                            <div className="d-flex align-items-center gap-3 mx-2">
                              <div style={{ height: '30px', width: '30px', backgroundColor: 'rgb(204, 204, 204)', borderRadius: '50%', fontSize: '1rem', fontWeight: 'bold', color: 'rgb(255, 255, 255)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={employee.image} alt={employee.name} style={{ height: '100%', width: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="badge-primary" style={{ margin: '0px 0px 0px -0.2rem', width: 'fit-content', padding: '1px' }}>{employee.employeeId}</span>
                                <span className="text-capitalize" style={{ fontSize: '1rem', margin: '0px', color: 'black' }}>{employee.name}</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>{employee.designation}</td>
                          <td className="text-center" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>{employee.basicSalary}</td>
                          <td className="text-center" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>{employee.hra}</td>
                          <td className="text-center" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>{employee.conveyance}</td>
                          <td className="text-center" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>{employee.otherAllowances}</td>
                          <td className="text-center" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>{employee.totalSalary}</td>
                          <td className="border-0 text-end" style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: 'transparent', color: 'var(--secondaryDashColorDark)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                            <button className="btn" style={{ color: 'black' }}>
                              <FiEdit2 className="text-primary" />
                            </button>
                            <button className="btn" style={{ color: 'black' }}>
                              <RiDeleteBin6Line className="fs-5 text-danger" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="cntainer-fluid d-flex flex-column-reverse gap-4 py-2 px-2 rounded-2 gap-md-0 flex-md-row w-100 justify-content-between align-items-center my-2" style={{ background: 'var(--primaryDashMenuColor)' }}>
                  <div className="d-flex flex-column-reverse gap-4 py-1 px-2 rounded-2 gap-md-0 flex-md-row w-100 justify-content-between align-items-center" style={{ background: 'var(--secondaryDashMenuColor)' }}>
                    <div className="my-auto" style={{ color: 'black' }}>
                      Showing 1 to {filteredData.length} of {filteredData.length} results
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <button className="btn bg-light text-dark rounded-2 border shadow-sm mx-1 d-flex align-items-center gap-2" disabled>
                        <IoIosArrowBack className="my-auto" /> <span className="d-none d-md-flex">Previous</span>
                      </button>
                      <div className="pagination d-flex flex-nowrap gap-2">
                        <button className="bg-primary text-white border-0 rounded-2" style={{ border: 'none', height: '2.3rem', width: '2.3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>1</button>
                      </div>
                      <button className="btn bg-light text-dark rounded-2 border shadow-sm mx-1 d-flex align-items-center gap-2" disabled>
                        <span className="d-none d-md-flex">Next</span> <IoIosArrowForward className="my-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryManagement;