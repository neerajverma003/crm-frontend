import React, { useEffect, useState, useMemo, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiSettings,
  FiMenu,
  FiX,
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
        `flex items-center gap-3 px-4 py-2.5 rounded-[9px] transition-all duration-200 relative ${
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

const NestedDropdownItem = ({ item, openDropdowns, toggleDropdown, setIsOpen, navigate, setSelectedSubRole, selectedSubRole, siblings = [] }) => {
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
        className="w-full flex items-center justify-between px-3.5 py-2 rounded-[7px] text-xs text-gray-700 hover:text-blue-700 hover:bg-blue-100/30 transition-all duration-200"
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
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const subRoleData = {
                      subRoleId: grandchild.id,
                      subRoleName: grandchild.label,
                      roleName: item.label
                    };
                    setSelectedSubRole(subRoleData);
                    localStorage.setItem("selectedSubRole", JSON.stringify(subRoleData));
                    
                    // Routing Logic
                    const routes = {
                      "Expenses": "/dailyexpenses",
                      "All Itinerary": "/all-itinerary",
                      "Add Itinerary": "/add-itinerary",
                      "Cheque Entry": "/cheque",
                      "Add Company": "/b2b-addcompany",
                      "Create Destination": "/b2b-destination",
                      "Attendance": "/attendance",
                      "User Management": "/user-management",
                      "Leave Management": "/leaves",
                      "Customer Creation": "/customer-creation",
                      "Add Destination": "/createdestination",
                      "Add Hotel": "/createhotel",
                      "Invoice Creation": "/createinvoice",
                      "Add State": "/createstate",
                      "Add Transport": "/createtransport",
                      "Customer Data": "/customer-data",
                      "Invoice List": "/invoicelist",
                      "dispute clients": "/dispute-clients"
                    };

                    const route = routes[subRoleData.subRoleName] || `/${subRoleData.subRoleName}`;
                    navigate(route, { state: { subRole: subRoleData } });
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-[10px] font-bold nav-link-transition ${
                    selectedSubRole?.subRoleId === grandchild.id
                      ? "bg-blue-200/50 text-blue-800 border border-blue-400/50 uppercase shadow-sm"
                      : "text-gray-700 hover:text-gray-900 hover:bg-blue-100/25"
                  }`}
                >
                  ◆ {grandchild.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
};

const NavDropdownItem = ({ item, openDropdowns, toggleDropdown, setIsOpen, navigate, setSelectedSubRole, selectedSubRole, siblings = [] }) => {
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
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-[9px] transition-all duration-200 relative ${
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
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full"></div>
        )}
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
                    navigate={navigate}
                    setSelectedSubRole={setSelectedSubRole}
                    selectedSubRole={selectedSubRole}
                    siblings={item.children.filter(c => c.type === "dropdown").map(c => c.label)}
                  />
                ) : (
                  <li>
                    <NavLink
                      to={child.url}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `block px-3.5 py-2 rounded-[7px] text-xs font-semibold nav-link-transition ${
                          isActive
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

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role] = useState(() => localStorage.getItem("role")?.toLowerCase() || "");
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [adminData, setAdminData] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [selectedSubRole, setSelectedSubRole] = useState(() => {
    const saved = localStorage.getItem("selectedSubRole");
    return saved ? JSON.parse(saved) : null;
  });

  const navRef = useRef(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && role === "admin") {
      fetchAdminRolesAndCompanies(userId);
    }

    // Event Listeners
    const handleRefreshRoles = () => userId && fetchAdminRolesAndCompanies(userId);
    const handleVisibilityChange = () => !document.hidden && userId && fetchAdminRolesAndCompanies(userId);

    window.addEventListener("refreshAdminRoles", handleRefreshRoles);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("refreshAdminRoles", handleRefreshRoles);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [role]);

  // Auto-open active dropdowns
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
    if (allItems) checkAndOpen(allItems);
    setOpenDropdowns(prev => {
        const keys = Object.keys(initialOpenDropdowns);
        if (keys.length > 0 && !keys.every(k => prev[k])) return initialOpenDropdowns;
        return prev;
    });
  }, [location.pathname, loadingCompanies, adminData]);

  const fetchAdminRolesAndCompanies = async (userId) => {
    setLoadingCompanies(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getassignedroles/${userId}`, { cache: "no-store" });
      const data = await response.json();
      if (data.admin) setAdminData(data.admin);
    } catch (error) {
      console.error("Error fetching admin roles:", error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const buildCompanyDropdowns = () => {
    if (!adminData?.assignedRoles) return [];
    const companyMap = {};

    adminData.assignedRoles.forEach((roleAssignment) => {
      if (roleAssignment.companyIds) {
        roleAssignment.companyIds.forEach((company) => {
          const companyId = company._id || company;
          const companyName = company.companyName || "Unknown Company";

          if (!companyMap[companyId]) {
            companyMap[companyId] = { id: companyId, name: companyName, rolesMap: {} };
          }

          if (roleAssignment.roleId) {
            const roleId = roleAssignment.roleId._id;
            const roleLabel = roleAssignment.roleId.role || "Unknown Role";

            if (!companyMap[companyId].rolesMap[roleId]) {
              companyMap[companyId].rolesMap[roleId] = { id: roleId, label: roleLabel, subroles: [], roleObj: roleAssignment.roleId };
            }

            if (roleAssignment.subRoles) {
              roleAssignment.subRoles.forEach((subRoleId) => {
                let subRoleName = "Unknown SubRole";
                if (roleAssignment.roleId.subRole) {
                  const found = roleAssignment.roleId.subRole.find(sr => sr._id === subRoleId || sr._id.toString() === subRoleId.toString());
                  if (found) subRoleName = found.subRoleName;
                }

                if (!companyMap[companyId].rolesMap[roleId].subroles.some(sr => sr.id === subRoleId)) {
                  companyMap[companyId].rolesMap[roleId].subroles.push({
                    id: subRoleId,
                    label: subRoleName,
                    points: (roleAssignment.roleId.subRole?.find(sr => sr._id === subRoleId)?.points) || []
                  });
                }
              });
            }
          }
        });
      }
    });

    return Object.values(companyMap).map((company) => ({
      id: `company-${company.id}`,
      label: company.name,
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: Object.values(company.rolesMap).map((role) => ({
        id: `role-${role.id}`,
        label: role.label,
        type: role.subroles.length > 0 ? "dropdown" : undefined,
        children: role.subroles.length > 0 ? role.subroles.map((subrole) => ({
          ...subrole,
          type: (subrole.points?.length > 0) ? "dropdown" : undefined,
          children: (subrole.points?.length > 0) ? subrole.points.map((p, i) => ({ id: `p-${subrole.id}-${i}`, label: p, url: null })) : undefined
        })) : undefined
      }))
    }));
  };

  const allItems = useMemo(() => {
    if (loadingCompanies) return [{ id: "loading", label: "Loading Companies...", icon: <FiBriefcase size={20} />, url: "#" }];
    return [
      { id: "dashboard", label: "Dashboard", icon: <FiGrid size={20} />, url: "/dashboard" },
      ...buildCompanyDropdowns(),
      { id: 3, label: "Company Overview", icon: <FiBriefcase size={20} />, url: "/company-overview" },
    ];
  }, [loadingCompanies, adminData]);

  const toggleDropdown = (label, siblings = []) => {
    if (navRef.current) scrollPositionRef.current = navRef.current.scrollTop;
    setOpenDropdowns((prev) => {
      if (prev[label]) return { ...prev, [label]: false };
      
      // Create a clean state for siblings
      const newState = { ...prev };
      siblings.forEach(sibling => {
        newState[sibling] = false;
      });
      newState[label] = true;
      return newState;
    });
    setTimeout(() => { if (navRef.current) navRef.current.scrollTop = scrollPositionRef.current; }, 0);
  };

  if (role !== "admin") return null;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-[env(safe-area-inset-top)] z-[9999] mt-2 p-2 text-black-600 transition-all duration-300 active:scale-95 md:hidden ${isOpen ? "left-1/2 -translate-x-[-130%]" : "left-4"}`}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)}></div>}

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-[280px] bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-xl transition-all duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-[270px]"
        }`}
      >
        {/* Header */}
        <div className="relative px-6 py-8 border-b border-blue-200/60">
          <div className="flex items-center gap-3 select-none group">
            <div className="flex size-12 items-center justify-center rounded-[12px] bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-blue-500/35">C</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-900 leading-tight">CRM PRO</h2>
              <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
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
                    navigate={navigate}
                    setSelectedSubRole={setSelectedSubRole}
                    selectedSubRole={selectedSubRole}
                    siblings={allItems.filter(i => i.type === "dropdown").map(i => i.label)}
                  />
                ) : (
                  <NavMenuItem item={item} setIsOpen={setIsOpen} />
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-blue-200/60 bg-gradient-to-t from-blue-50/60 to-transparent"></div>
      </aside>

      <style>{`
        /* Smooth Height Transition Trick */
        .dropdown-wrapper {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        
        .dropdown-wrapper.is-open {
          grid-template-rows: 1fr;
        }
        
        .dropdown-content {
          min-height: 0;
        }

        /* Hardware Acceleration */
        .sidebar-item {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* Custom scrollbar with blue accent */
        .scrollbar-hide::-webkit-scrollbar {
          width: 5px;
        }

        .scrollbar-hide::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-hide::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.15);
          border-radius: 10px;
        }

        .scrollbar-hide::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.3);
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.15) transparent;
        }

        /* Micro-animations */
        .active-indicator {
          transition: height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease;
        }

        .nav-link-transition {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;