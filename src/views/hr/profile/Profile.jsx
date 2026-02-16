import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({});
  
  // Initialize state with your existing data
  const [profileState, setProfileState] = useState({
    personalInfo: {
      basicDetails: {
        fullName: "Abc Xyz",
        dob: "15 Jan 1990",
        gender: "Male",
        bloodGroup: "O+",
        maritalStatus: "Married"
      },
      identification: {
        aadhar: "XXXX-XXXX-7890",
        pan: "ABCDE1234F",
        passport: "P12345678 (Exp: 2025)"
      },
      contact: {
        phone: "+91 98765 43210",
        email: "abc.tyagi@company.com",
        address: "123 Sector 15, Noida, Uttar Pradesh 201301"
      },
      bank: {
        accountNumber: "XXXXXX7890",
        bankName: "HDFC Bank",
        ifsc: "HDFC0001234",
        accountType: "Salary Account"
      }
    },
    companyInfo: {
      employment: {
        employeeId: "EMP-2023-001",
        joiningDate: "15 March 2023",
        department: "Engineering",
        designation: "Senior Software Developer",
        reportingTo: "Jane Smith (CTO)"
      },
      workDetails: {
        employmentType: "Full-time",
        workLocation: "Noida Office",
        workSchedule: "Flexible (9am-5pm core hours)",
        status: "Active"
      },
      compensation: {
        baseSalary: "₹1,200,000/year",
        bonus: "Up to 15%",
        stockOptions: "500 shares"
      }
    },
    educationInfo: {
      degrees: [
        {
          degree: "Master of Computer Science",
          institution: "Delhi University",
          year: "2012 - 2014",
          grade: "GPA: 3.8/4.0"
        },
        {
          degree: "Bachelor of Computer Engineering",
          institution: "IP University",
          year: "2008 - 2012",
          grade: "GPA: 3.6/4.0"
        },
        {
          degree: "Higher Secondary (12th)",
          institution: "CBSE Board",
          year: "2008",
          grade: "92%"
        },
        {
          degree: "Secondary (10th)",
          institution: "CBSE Board",
          year: "2006",
          grade: "90%"
        }
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          year: "2021",
          status: "Valid until 2024"
        },
        {
          name: "Google Professional Data Engineer",
          issuer: "Google Cloud",
          year: "2020",
          status: "Expired"
        },
        {
          name: "Certified Scrum Master",
          issuer: "Scrum Alliance",
          year: "2019",
          status: "Valid until 2024"
        }
      ]
    },
    documents: [
      {
        id: 1,
        type: "Resume",
        name: "Resume_Harshit_Tyagi.pdf",
        date: "15 Jan 2023",
        status: "Verified"
      },
      {
        id: 2,
        type: "Degree",
        name: "Degree_Certificate.pdf",
        date: "10 Mar 2023",
        status: "Verified"
      },
      {
        id: 3,
        type: "ID Proof",
        name: "Aadhar_Card.jpg",
        date: "5 Mar 2023",
        status: "Verified"
      },
      {
        id: 4,
        type: "Employment",
        name: "Employment_Contract.pdf",
        date: "10 Mar 2023",
        status: "Verified"
      },
      {
        id: 5,
        type: "NDA",
        name: "NDA_Agreement.pdf",
        date: "10 Mar 2023",
        status: "Pending"
      }
    ],
    familyMembers: [
      {
        id: 1,
        name: "Priya Tyagi",
        relationship: "Spouse",
        dob: "20 May 1992",
        contact: "+91 98765 12340",
        dependent: "Yes"
      },
      {
        id: 2,
        name: "Rahul Tyagi",
        relationship: "Father",
        dob: "15 Aug 1965",
        contact: "+91 98765 43211",
        dependent: "No"
      },
      {
        id: 3,
        name: "Sunita Tyagi",
        relationship: "Mother",
        dob: "10 Jan 1968",
        contact: "+91 98765 43212",
        dependent: "No"
      },
      {
        id: 4,
        name: "Arjun Tyagi",
        relationship: "Son",
        dob: "5 Dec 2018",
        contact: "N/A",
        dependent: "Yes"
      }
    ],
    experiences: [
      {
        id: 1,
        designation: "Senior Software Developer",
        company: "Tech Solutions Inc.",
        duration: "2018 - 2023 (5 years)",
        responsibilities: [
          "Led cross-functional team of 5 developers",
          "Architected microservices using Node.js and React",
          "Implemented CI/CD pipeline"
        ]
      },
      {
        id: 2,
        designation: "Software Developer",
        company: "Digital Innovations",
        duration: "2014 - 2018 (4 years)",
        responsibilities: [
          "Developed responsive web applications",
          "Built RESTful APIs with Node.js",
          "Implemented automated testing"
        ]
      },
      {
        id: 3,
        designation: "Junior Developer (Intern)",
        company: "WebCraft Studios",
        duration: "Summer 2013",
        responsibilities: [
          "Assisted in developing client websites",
          "Implemented responsive designs",
          "Fixed bugs in existing codebase"
        ]
      }
    ]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    const newDocument = {
      id: Math.max(...profileState.documents.map(d => d.id)) + 1,
      type: formData.docType,
      name: formData.docName,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: "Pending"
    };
    setProfileState(prev => ({
      ...prev,
      documents: [...prev.documents, newDocument]
    }));
    setShowAddForm(false);
    setFormData({});
  };

  const handleAddFamilyMember = (e) => {
    e.preventDefault();
    const newMember = {
      id: Math.max(...profileState.familyMembers.map(m => m.id)) + 1,
      name: formData.memberName,
      relationship: formData.relationship,
      dob: formData.dob,
      contact: formData.contact || "N/A",
      dependent: formData.dependent
    };
    setProfileState(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, newMember]
    }));
    setShowAddForm(false);
    setFormData({});
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    const newExperience = {
      id: Math.max(...profileState.experiences.map(e => e.id)) + 1,
      designation: formData.designation,
      company: formData.company,
      duration: formData.duration,
      responsibilities: formData.responsibilities.split('\n').filter(r => r.trim() !== '')
    };
    setProfileState(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExperience]
    }));
    setShowAddForm(false);
    setFormData({});
  };

  const handleDelete = (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      setProfileState(prev => ({
        ...prev,
        [type]: prev[type].filter(item => item.id !== id)
      }));
    }
  };

  const renderAddForm = () => {
    switch(activeTab) {
      case 'documents':
        return (
          <form onSubmit={handleAddDocument} className="mb-4 p-3 border rounded">
            <h4>Upload New Document</h4>
            <div className="mb-3">
              <label className="form-label">Document Type</label>
              <select 
                name="docType" 
                className="form-control" 
                required
                onChange={handleInputChange}
                value={formData.docType || ''}
              >
                <option value="">Select Type</option>
                <option value="Resume">Resume</option>
                <option value="Degree">Degree</option>
                <option value="ID Proof">ID Proof</option>
                <option value="Employment">Employment</option>
                <option value="NDA">NDA</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Document Name</label>
              <input 
                type="text" 
                name="docName" 
                className="form-control" 
                required
                onChange={handleInputChange}
                value={formData.docName || ''}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Upload File</label>
              <input 
                type="file" 
                className="form-control" 
                required
              />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Upload</button>
            </div>
          </form>
        );
      case 'family':
        return (
          <form onSubmit={handleAddFamilyMember} className="mb-4 p-3 border rounded">
            <h4>Add Family Member</h4>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input 
                type="text" 
                name="memberName" 
                className="form-control" 
                required
                onChange={handleInputChange}
                value={formData.memberName || ''}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Relationship</label>
              <select 
                name="relationship" 
                className="form-control" 
                required
                onChange={handleInputChange}
                value={formData.relationship || ''}
              >
                <option value="">Select Relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <input 
                type="date" 
                name="dob" 
                className="form-control" 
                required
                onChange={handleInputChange}
                value={formData.dob || ''}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contact Number</label>
              <input 
                type="tel" 
                name="contact" 
                className="form-control" 
                onChange={handleInputChange}
                value={formData.contact || ''}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Dependent</label>
              <select 
                name="dependent" 
                className="form-control" 
                required
                onChange={handleInputChange}
                value={formData.dependent || 'Yes'}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Add Member</button>
            </div>
          </form>
        );
      case 'experience':
        return (
          <form onSubmit={handleAddExperience} className="mb-4 p-3 border rounded">
            <h4>Add Experience</h4>
            <div className="mb-3">
              <label className="form-label">Designation</label>
              <input 
                type="text" 
                name="designation" 
                className="form-control" 
                required
                onChange={handleInputChange}
                value={formData.designation || ''}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Company</label>
              <input 
                type="text" 
                name="company" 
                className="form-control" 
                required
                onChange={handleInputChange}
                value={formData.company || ''}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Duration</label>
              <input 
                type="text" 
                name="duration" 
                className="form-control" 
                placeholder="e.g. 2018 - 2023 (5 years)"
                required
                onChange={handleInputChange}
                value={formData.duration || ''}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Key Responsibilities (one per line)</label>
              <textarea 
                name="responsibilities" 
                className="form-control" 
                rows="4"
                required
                onChange={handleInputChange}
                value={formData.responsibilities || ''}
              ></textarea>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Add Experience</button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  const profileData = {
    personal: {
      title: "Personal Information",
      content: (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th colSpan="2">Basic Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">Full Name</td>
                <td>{profileState.personalInfo.basicDetails.fullName}</td>
              </tr>
              <tr>
                <td>Date of Birth</td>
                <td>{profileState.personalInfo.basicDetails.dob}</td>
              </tr>
              <tr>
                <td>Gender</td>
                <td>{profileState.personalInfo.basicDetails.gender}</td>
              </tr>
              <tr>
                <td>Blood Group</td>
                <td>{profileState.personalInfo.basicDetails.bloodGroup}</td>
              </tr>
              <tr>
                <td>Marital Status</td>
                <td>{profileState.personalInfo.basicDetails.maritalStatus}</td>
              </tr>
            </tbody>
            
            <thead className="table-dark">
              <tr>
                <th colSpan="2">Identification Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Aadhar Number</td>
                <td>{profileState.personalInfo.identification.aadhar}</td>
              </tr>
              <tr>
                <td>PAN Number</td>
                <td>{profileState.personalInfo.identification.pan}</td>
              </tr>
              <tr>
                <td>Passport Number</td>
                <td>{profileState.personalInfo.identification.passport}</td>
              </tr>
            </tbody>
            
            <thead className="table-dark">
              <tr>
                <th colSpan="2">Contact Information</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Phone</td>
                <td>{profileState.personalInfo.contact.phone}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{profileState.personalInfo.contact.email}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>{profileState.personalInfo.contact.address}</td>
              </tr>
            </tbody>
            
            <thead className="table-dark">
              <tr>
                <th colSpan="2">Bank Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Account Number</td>
                <td>{profileState.personalInfo.bank.accountNumber}</td>
              </tr>
              <tr>
                <td>Bank Name</td>
                <td>{profileState.personalInfo.bank.bankName}</td>
              </tr>
              <tr>
                <td>IFSC Code</td>
                <td>{profileState.personalInfo.bank.ifsc}</td>
              </tr>
              <tr>
                <td>Account Type</td>
                <td>{profileState.personalInfo.bank.accountType}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    company: {
      title: "Company Information",
      content: (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th colSpan="2">Employment Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="30%">Employee ID</td>
                <td>{profileState.companyInfo.employment.employeeId}</td>
              </tr>
              <tr>
                <td>Joining Date</td>
                <td>{profileState.companyInfo.employment.joiningDate}</td>
              </tr>
              <tr>
                <td>Department</td>
                <td>{profileState.companyInfo.employment.department}</td>
              </tr>
              <tr>
                <td>Designation</td>
                <td>{profileState.companyInfo.employment.designation}</td>
              </tr>
              <tr>
                <td>Reporting To</td>
                <td>{profileState.companyInfo.employment.reportingTo}</td>
              </tr>
            </tbody>
            
            <thead className="table-dark">
              <tr>
                <th colSpan="2">Work Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Employment Type</td>
                <td>{profileState.companyInfo.workDetails.employmentType}</td>
              </tr>
              <tr>
                <td>Work Location</td>
                <td>{profileState.companyInfo.workDetails.workLocation}</td>
              </tr>
              <tr>
                <td>Work Schedule</td>
                <td>{profileState.companyInfo.workDetails.workSchedule}</td>
              </tr>
              <tr>
                <td>Employee Status</td>
                <td><span className="badge bg-success">{profileState.companyInfo.workDetails.status}</span></td>
              </tr>
            </tbody>
            
            <thead className="table-dark">
              <tr>
                <th colSpan="2">Compensation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Base Salary</td>
                <td>{profileState.companyInfo.compensation.baseSalary}</td>
              </tr>
              <tr>
                <td>Bonus</td>
                <td>{profileState.companyInfo.compensation.bonus}</td>
              </tr>
              <tr>
                <td>Stock Options</td>
                <td>{profileState.companyInfo.compensation.stockOptions}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    education: {
      title: "Education",
      content: (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Degree</th>
                <th>Institution</th>
                <th>Year</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {profileState.educationInfo.degrees.map((degree, index) => (
                <tr key={index}>
                  <td>{degree.degree}</td>
                  <td>{degree.institution}</td>
                  <td>{degree.year}</td>
                  <td>{degree.grade}</td>
                </tr>
              ))}
            </tbody>
            
            <thead className="table-dark">
              <tr>
                <th colSpan="4">Certifications</th>
              </tr>
            </thead>
            <tbody>
              {profileState.educationInfo.certifications.map((cert, index) => (
                <tr key={index}>
                  <td>{cert.name}</td>
                  <td>{cert.issuer}</td>
                  <td>{cert.year}</td>
                  <td>
                    <span className={`badge ${
                      cert.status.includes("Valid") ? "bg-success" : "bg-warning text-dark"
                    }`}>
                      {cert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
    documents: {
      title: "Documents",
      content: (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>My Documents</h4>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              <i className="fas fa-plus me-1"></i> Upload Document
            </button>
          </div>
          
          {showAddForm && renderAddForm()}
          
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Document Type</th>
                  <th>Document Name</th>
                  <th>Upload Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profileState.documents.map(doc => (
                  <tr key={doc.id}>
                    <td>{doc.type}</td>
                    <td>{doc.name}</td>
                    <td>{doc.date}</td>
                    <td>
                      <span className={`badge ${
                        doc.status === "Verified" ? "bg-success" : 
                        doc.status === "Pending" ? "bg-warning text-dark" : "bg-secondary"
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td>
  <button className="btn btn-sm btn-outline-primary me-1" title="Download">
    <i className="fas fa-download me-1"></i> Download
  </button>
  <button className="btn btn-sm btn-outline-secondary me-1" title="View Document">
    <i className="fas fa-eye me-1"></i> View
  </button>
  <button 
    className="btn btn-sm btn-outline-danger"
    onClick={() => handleDelete(doc.id, 'documents')}
    title="Delete Document"
  >
    <i className="fas fa-trash me-1"></i> Delete
  </button>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )
    },
    experience: {
      title: "Experience",
      content: (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Work Experience</h4>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              <i className="fas fa-plus me-1"></i> Add Experience
            </button>
          </div>
          
          {showAddForm && renderAddForm()}
          
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Designation</th>
                  <th>Company</th>
                  <th>Duration</th>
                  <th>Key Responsibilities</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profileState.experiences.map(exp => (
                  <tr key={exp.id}>
                    <td>{exp.designation}</td>
                    <td>{exp.company}</td>
                    <td>{exp.duration}</td>
                    <td>
                      <ul className="mb-0">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
  <button 
    className="btn btn-sm btn-outline-danger"
    onClick={() => handleDelete(exp.id, 'experiences')}
    title="Delete Experience"
  >
    <i className="fas fa-trash me-1"></i> Delete
  </button>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )
    },
    family: {
      title: "Family Details",
      content: (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Family Members</h4>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              <i className="fas fa-plus me-1"></i> Add Member
            </button>
          </div>
          
          {showAddForm && renderAddForm()}
          
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Relationship</th>
                  <th>Date of Birth</th>
                  <th>Contact Number</th>
                  <th>Dependent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profileState.familyMembers.map(member => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.relationship}</td>
                    <td>{member.dob}</td>
                    <td>{member.contact}</td>
                    <td>
                      <span className={`badge ${
                        member.dependent === "Yes" ? "bg-success" : "bg-secondary"
                      }`}>
                        {member.dependent}
                      </span>
                    </td>
                    <td>
  <button 
    className="btn btn-sm btn-outline-danger"
    onClick={() => handleDelete(member.id, 'familyMembers')}
    title="Delete Family Member"
  >
    <i className="fas fa-trash me-1"></i> Delete
  </button>
</td>

                  </tr>
                ))}
              </tbody>
              
              <thead className="table-dark">
                <tr>
                  <th colSpan="6">Emergency Contacts</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Priya Tyagi</td>
                  <td>Spouse</td>
                  <td>-</td>
                  <td>+91 98765 12340</td>
                  <td>Primary Contact</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Rahul Tyagi</td>
                  <td>Father</td>
                  <td>-</td>
                  <td>+91 98765 43211</td>
                  <td>Secondary Contact</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )
    }
  };

  return (
    <div className="profile-page container py-4">
      <div className="profile-header-container">
        <div className="profile-header">
          <div className="profile-image-container">
            <img
              src="http://localhost:3000/src/assets/images/avatars/8.jpg"
              alt="ABC XYZ"
              className="profile-img"
            />
            <button className="edit-profile-btn">
              <i className="fas fa-camera"></i>
            </button>
          </div>
          <div className="profile-info">
            <h1>ABC XYZ</h1>
            <p className="profile-title">Senior Software Developer</p>
            <div className="profile-meta">
              <span className="meta-item">
                <i className="fas fa-id-badge me-2"></i>EMP-2023-001
              </span>
              <span className="meta-item">
                <i className="fas fa-building me-2"></i>Engineering Department
              </span>
              <span className="meta-item">
                <i className="fas fa-map-marker-alt me-2"></i>Noida
              </span>
            </div>
            <div className="profile-status">
              <span className="badge bg-success">
                <i className="fas fa-circle me-1"></i> Active
              </span>
              <span className="badge bg-primary ms-2">
                Full-time Employee
              </span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn btn-primary me-2">
              <i className="fas fa-download me-1"></i> Export Profile
            </button>
            <button className="btn btn-outline-primary">
              <i className="fas fa-edit me-1"></i> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="profile-nav-container">
        <nav className="profile-nav">
          <div className="nav nav-tabs" id="profile-tab" role="tablist">
            {Object.keys(profileData).map((key) => (
              <button
                key={key}
                className={`nav-link ${activeTab === key ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(key);
                  setShowAddForm(false);
                }}
              >
                <i className={`fas ${getTabIcon(key)} me-2`}></i>
                {profileData[key].title}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="profile-content-container">
        <div className="profile-content">
          {profileData[activeTab].content}
        </div>
      </div>
    </div>
  );
};

const getTabIcon = (tabKey) => {
  switch(tabKey) {
    case 'personal': return 'fa-user';
    case 'company': return 'fa-briefcase';
    case 'education': return 'fa-graduation-cap';
    case 'documents': return 'fa-file-alt';
    case 'experience': return 'fa-history';
    case 'family': return 'fa-users';
    default: return 'fa-info-circle';
  }
};

export default Profile;