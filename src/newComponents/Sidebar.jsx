import React, { useEffect, useState, useMemo, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiSettings,
  FiMenu,
  FiX,
  FiDollarSign,
  FiChevronDown,
} from "react-icons/fi";

// ============================================
// HELPER COMPONENTS (Defined outside to prevent remounting)
// ============================================

const NavMenuItem = ({ item, setIsOpen }) => (
  <li className="group relative">
    <NavLink
      to={item.url}
      onClick={() => setIsOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-[9px] nav-link-transition relative ${
          isActive
            ? "bg-blue-100/60 text-blue-800 shadow-sm border border-blue-200/50 font-bold"
            : "text-gray-800 hover:text-blue-700 hover:bg-blue-100/40"
        }`
      }
    >
      <span className="text-lg transition-all duration-200">{item.icon}</span>
      <span className="text-sm font-bold">{item.label}</span>
      {/* Active Indicator Bar */}
      <NavLink
        to={item.url}
        className={({ isActive }) =>
            `active-indicator absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-blue-600 rounded-r-full transition-all duration-300 ${
                isActive ? "h-6 opacity-100" : "h-0 opacity-0"
            }`
        }
      />
    </NavLink>
  </li>
);

const NestedDropdownItem = ({ item, openDropdowns, toggleDropdown, setIsOpen, siblings = [] }) => {
  const isOpen = openDropdowns[item.label];
  const siblingLabels = siblings.filter(s => s !== item.label);

  return (
    <li className="group">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleDropdown(item.label, siblingLabels);
        }}
        className="w-full flex items-center justify-between px-3.5 py-2 rounded-[7px] text-xs text-gray-700 hover:text-blue-700 hover:bg-blue-100/30 nav-link-transition"
      >
        <span className="font-bold truncate text-gray-800">{item.label}</span>
        <span className={`text-gray-500 hover:text-blue-600 transition-all duration-300 transform ${isOpen ? "rotate-180" : ""}`}>
          <FiChevronDown size={13} />
        </span>
      </button>

      {/* Nested Children */}
      <div className={`dropdown-wrapper ${isOpen ? "is-open" : ""}`}>
        <div className="dropdown-content">
          <ul className="mt-0.5 ml-3 pl-3 border-l border-blue-300/50 space-y-0">
            {item.children.map((grandchild) => (
              <li key={grandchild.id}>
                <NavLink
                  to={grandchild.url}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                      `block px-3.5 py-2 rounded-[7px] text-[10px] font-bold nav-link-transition ${
                          isActive
                              ? "bg-blue-200/50 text-blue-800 border border-blue-400/60 shadow-sm"
                              : "text-gray-700 hover:text-gray-900 hover:bg-blue-100/30"
                      }`
                  }
                >
                  ◆ {grandchild.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
};

const NavDropdownItem = ({ item, openDropdowns, toggleDropdown, setIsOpen, siblings = [] }) => {
  const location = useLocation();
  const isOpen = openDropdowns[item.label];
  const siblingLabels = siblings.filter(s => s !== item.label);

  const isChildActive = (children) => {
    if (!children) return false;
    return children.some(child => {
      if (child.url && location.pathname === child.url) return true;
      if (child.children) return isChildActive(child.children);
      return false;
    });
  };

  const isActive = isChildActive(item.children);

  return (
    <li className="group">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleDropdown(item.label, siblingLabels);
        }}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-[9px] nav-link-transition relative ${
          isActive 
            ? "bg-blue-100/60 text-blue-800 shadow-sm border border-blue-200/50" 
            : "text-gray-800 hover:text-blue-700 bg-transparent hover:bg-blue-100/40"
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className={`flex items-center justify-center min-w-max transition-colors duration-200 ${
            isActive ? "text-blue-700" : "text-blue-600 group-hover:text-blue-700"
          }`}>
            {item.icon}
          </span>
          <span className={`text-sm font-bold truncate transition-colors ${
            isActive ? "text-blue-800" : "text-gray-800 group-hover:text-blue-700"
          }`}>{item.label}</span>
        </div>
        <span className={`ml-2 transition-all duration-300 transform ${
          isActive ? "text-blue-700" : "text-gray-500 group-hover:text-blue-600"
        } ${isOpen ? "rotate-180" : ""}`}>
          <FiChevronDown size={16} />
        </span>
        <NavLink
            to="#"
            className={({ isActive: linkActive }) =>
                `active-indicator absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-blue-600 rounded-r-full transition-all duration-300 ${
                    isActive ? "h-6 opacity-100" : "h-0 opacity-0"
                }`
            }
        />
      </button>

      {/* Dropdown Children */}
      <div className={`dropdown-wrapper ${isOpen ? "is-open" : ""}`}>
        <div className="dropdown-content">
          <ul className="mt-1 ml-3 pl-4 border-l-2 border-blue-300/60 space-y-0">
            {item.children.map((child) => (
              <React.Fragment key={child.id}>
                {child.type === "dropdown" ? (
                  <NestedDropdownItem
                    item={child}
                    openDropdowns={openDropdowns}
                    toggleDropdown={toggleDropdown}
                    setIsOpen={setIsOpen}
                    siblings={item.children.filter(c => c.type === "dropdown").map(c => c.label)}
                  />
                ) : (
                  <li>
                    <NavLink
                      to={child.url}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive: subActive }) =>
                        `block px-3.5 py-2 rounded-[7px] text-xs font-semibold nav-link-transition ${
                          subActive
                            ? "bg-blue-200/50 text-blue-800 border border-blue-400/60 shadow-sm"
                            : "text-gray-700 hover:text-gray-900 hover:bg-blue-100/30"
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const Sidebar = () => {
  const location = useLocation();
  const [role] = useState(() => localStorage.getItem("role")?.toLowerCase() || "");
  const [isOpen, setIsOpen] = useState(false);
  const [department, setDepartment] = useState("");
  const [openDropdowns, setOpenDropdowns] = useState({});

  const navRef = useRef(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && role) fetchDepartment(userId, role);
  }, [role]);

  const fetchDepartment = async (userId, role) => {
    if (role === "superadmin") setDepartment("Super Admin");
    else setDepartment("N/A");
  };

  // Memoize allItems
  const allItems = useMemo(() => [
    { id: 1, label: "Dashboard", icon: <FiGrid size={20} />, url: "/dashboard" },
    { id: 3, label: "Company Overview", icon: <FiBriefcase size={20} />, url: "/company-overview" },
    {
      id: 4,
      label: "Companies",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: [
        { id: "4-1", label: "All Companies", url: "/companies" },
        { id: "4-2", label: "Department", url: "/department" },
        { id: "4-3", label: "Designation", url: "/designation" },
        { id: "4-4", label: "Add Role", url: "/addrole" },
      ],
    },
    {
      id: 5,
      label: "Tutorials",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: [
        { id: "5-1", label: "Upload Material", url: "/upload-material" },
        { id: "5-2", label: "Training Material", url: "/training-material" },
      ],
    },
    {
      id: 6,
      label: "Admin Management",
      icon: <FiUsers size={20} />,
      type: "dropdown",
      url: "/admin-management",
      children: [
        { id: "6-1", label: "Add Admin", url: "/add-admin" },
        { id: "6-2", label: "Assign Role", url: "/assignrole" },
        { id: "6-3", label: "Assign Company", url: "/assigncompany" },
        { id: "6-4", label: "Assigned Roles", url: "/assigned-roles" },
      ],
    },
    {
      id: 7,
      label: "HRMS",
      icon: <FiUsers size={20} />,
      type: "dropdown",
      children: [
        { id: "hrms-1", label: "User Management", url: "/user-management" },
        { id: "hrms-2", label: "Attendance", url: "/attendance" },
        { 
          id: "hrms-3", 
          label: "Employee Management", 
          url: "/employee-management", 
          type: "dropdown", 
          children: [
            { id: "hrms-3-1", label: "Add Employee", url: "/user-management" },
            { id: "hrms-3-2", label: "Assign Company", url: "/employeecompany" },
            { id: "hrms-3-3", label: "Assign Role", url: "/assignemployeerole" },
            { id: "hrms-3-4", label: "Create Destination", url: "/createdestinationemployee" },
            { id: "hrms-3-5", label: "Employee Data", url: "/employee-data" },
          ] 
        },
        { id: "hrms-4", label: "Leave Management", url: "/leaves" },
        { 
          id: "hrms-5", 
          label: "Data Management", 
          url: "/data-management", 
          type: "dropdown",
          children: [
            { id: "hrms-5-1", label: "Import Data", url: "/import-data" },
            { id: "hrms-5-2", label: "Export Data", url: "/export-data" },
            { id: "hrms-5-3", label: "Add Profile", url: "/add-profile" },
            { id: "hrms-5-4", label: "Add Candidate", url: "/add-candidate" },
          ]
        },
        { 
          id: "hrms-6", 
          label: "Pay Roll", 
          url: "/payroll", 
          type: "dropdown",
          children: [
             { id: "hrms-6-1", label: "Salary List", url: "/salary-list" },
             { id: "hrms-6-2", label: "Salary Management", url: "/salary-management" },
             { id: "hrms-6-3", label: "Generate Payslip", url: "/generate-payslip" },
           ]
        },
        {
          id: "hrms-8-inv",
          label: "Inventory",
          url: "/inventory",
          type: "dropdown",
          children: [
            { id: "hrms-8-1", label: "SIM management", url: "/sim-management" },
            { id: "hrms-8-2", label: "Email management", url: "/email-management" },
          ],
        },
        { 
          id: "hrms-7", 
          label: "Report", 
          url: "/report", 
          type: "dropdown",
          children: [
            { id: "hrms-7-1", label: "Attendance Report", url: "/attendance-report" },
            { id: "hrms-7-2", label: "Employee Report", url: "/employee-report" },
            { id: "hrms-7-3", label: "Leave Report", url: "/leave-report" },
          ]
        },
        {
          id: "hrms-8-comp",
          label: "Compliances",
          type: "dropdown",
          children: [
            { id: "hrms-8-1", label: "Offer Letter", url: "/offer-letter" },
            { id: "hrms-8-2", label: "Termination", url: "/termination" },
            { id: "hrms-8-3", label: "Warning", url: "/warning" },
            { id: "hrms-8-4", label: "Relieving", url: "/relieving" },
            { id: "hrms-8-5", label: "Experience Letter", url: "/experience-letter" },
            { id: "hrms-8-6", label: "Other", url: "/other-compliance" },
            { id: "hrms-8-7", label: "Report List", url: "/compliance-report-list" },
          ]
        },
      ],
    },
    {
      id: 2,
      label: "Lead Dashboard",
      icon: <FiUsers size={20} />,
      type: "dropdown",
      url: "/lead-management",
      children: [
        { id: "2-1", label: "Lead Management", url: "/lead-management" },
        { id: "2-2", label: "Assign Lead", url: "/assignlead" },
        { id: "2-3", label: "My Leads", url: "/addmylead" },
        { id: "2-8", label: "Superadmin My Leads", url: "/superadmin-mylead" },
        { id: "2-4", label: "Today's Leads", url: "/todaysleads" },
        { id: "2-5", label: "Follow-Up Leads", url: "/followupleads" },
        { id: "2-6", label: "Lead Reports", url: "/leadreports" },
        { id: "2-7", label: "Assign Destination", url: "/assigndestination" },
      ],
    },
    {
      id: 8.5,
      label: "B2B",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: [
        { id: "b2b-1", label: "Destination", url: "/b2b-destination" },
        { id: "b2b-2", label: "Add Company", url: "/b2b-addcompany" },
        { id: "b2b-3", label: "Company Leads", url: "/b2b-company-leads" },
      ],
    },
    {
      id: 8.1,
      label: "Itianary",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: [
        { id: "8-1", label: "Add Itinerary", url: "/add-itinerary" },
        { id: "8-2", label: "All Itinerary", url: "/all-itinerary" },
      ],
    },
    {
      id: 10,
      label: "Operations",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: [
        { id: "10-1", label: "Create State", url: "/createstate" },
        { id: "10-2", label: "Create Destination", url: "/createdestination" },
        { id: "10-3", label: "Create Hotel", url: "/createhotel" },
        { id: "10-4", label: "Create Transport", url: "/createtransport" },
        { id: "10-5", label: "Create Bank", url: "/create-bank" },
        { id: "10-6", label: "Customer Creation", url: "/customer-creation" },
        { id: "10-7", label: "Customer Data", url: "/customer-data" },
        { id: "10-8", label: "Invoice Creation", url: "/createinvoice" },
        { id: "10-9", label: "Invoice List", url: "/invoicelist" },
      ],
    },
    {
      id: 9,
      label: "Accounts",
      icon: <FiDollarSign size={20} />,
      type: "dropdown",
      children: [
        { id: "9-1", label: "Daily Expense", url: "/dailyexpenses" },
        { id: "9-2", label: "Cheque Expense", url: "/cheque" },
        { id: "9-3", label: "Ledger", url: "/ledger" },
      ],
    },
    {
      id: 9.5,
      label: "All User Report",
      icon: <FiUsers size={20} />,
      type: "dropdown",
      children: [
        { id: "9-5-1", label: "User Data Reports", url: "/user-data-reports" },
      ],
    },
    {
      id: 8.2,
      label: "Teams",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: [
        { id: "team-1", label: "All Team", url: "/all-team" },
        { id: "team-2", label: "Create Team", url: "/create-team" },
      ],
    },
    {
      id: 10.5,
      label: "Task Management",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: [
        { id: "task-1", label: "Task Assign", url: "/task-assign" },
        { id: "task-2", label: "Task Report", url: "/task-report" },
      ],
    },
    { id: 11, label: "Settings", icon: <FiSettings size={20} />, url: "/settings" },
  ], []);

  // Auto-open logic
  useEffect(() => {
    const initialOpenDropdowns = {};
    const checkAndOpen = (navItems) => {
      navItems.forEach(item => {
        if (item.type === "dropdown" && item.children) {
          const isChildActive = (children) => children.some(child => {
            if (child.url && location.pathname === child.url) return true;
            if (child.children) return isChildActive(child.children);
            return false;
          });
          if (isChildActive(item.children)) {
            initialOpenDropdowns[item.label] = true;
            checkAndOpen(item.children);
          }
        }
      });
    };
    checkAndOpen(allItems);
    setOpenDropdowns(prev => {
        const keys = Object.keys(initialOpenDropdowns);
        if (keys.length > 0 && !keys.every(k => prev[k])) return initialOpenDropdowns;
        return prev;
    });
  }, [location.pathname, allItems]);

  const toggleDropdown = (label, siblings = []) => {
    if (navRef.current) scrollPositionRef.current = navRef.current.scrollTop;
    setOpenDropdowns((prev) => {
      if (prev[label]) return { ...prev, [label]: false };
      
      const newState = { ...prev };
      siblings.forEach(sibling => {
        newState[sibling] = false;
      });
      newState[label] = true;
      return newState;
    });
    setTimeout(() => { if (navRef.current) navRef.current.scrollTop = scrollPositionRef.current; }, 0);
  };

  if (role !== "superadmin") return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 z-[9999] p-2 text-black transition-all lg:hidden ${isOpen ? "left-1/2" : "left-4"}`}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {isOpen && <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)}></div>}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-[280px] bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-xl transition-all duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-[270px]"
        }`}
      >
        <div className="px-6 py-8 border-b border-blue-200/60">
            <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-[12px] bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg shadow-lg">C</div>
                <div>
                    <h2 className="text-sm font-bold text-gray-900">CRM PRO</h2>
                    <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Management</p>
                </div>
            </div>
        </div>

        <nav ref={navRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-hide">
          <ul className="space-y-0.5">
            {allItems.map((item) => (
              <React.Fragment key={item.id}>
                {item.type === "dropdown" ? (
                  <NavDropdownItem
                    item={item}
                    openDropdowns={openDropdowns}
                    toggleDropdown={toggleDropdown}
                    setIsOpen={setIsOpen}
                    siblings={allItems.filter(i => i.type === "dropdown").map(i => i.label)}
                  />
                ) : (
                  <NavMenuItem item={item} setIsOpen={setIsOpen} />
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </aside>

      <style>{`
        /* Smooth Height Transition */
        .dropdown-wrapper {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .dropdown-wrapper.is-open { grid-template-rows: 1fr; }
        .dropdown-content { min-height: 0; }

        /* Custom Scrollbar */
        .scrollbar-hide::-webkit-scrollbar { width: 5px; }
        .scrollbar-hide::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-hide::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.15); border-radius: 10px; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: thin; }

        /* Animations */
        .active-indicator { transition: height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease; }
        .nav-link-transition { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </>
  );
};

export default Sidebar;