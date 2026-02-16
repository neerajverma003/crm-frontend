// import React, { useState, useEffect } from "react";
  // import Header from "./Header.jsx";
  // import Sidebar from "./Sidebar.jsx";
  // import { Outlet } from "react-router-dom";

  // const ScreenLayout = () => {
  //   const [isExpanded, setIsExpanded] = useState(true);
  //   const [isMobile, setIsMobile] = useState(false);

  //   // 📱 Detect mobile screen
  //   useEffect(() => {
  //     const handleResize = () => setIsMobile(window.innerWidth < 1024);
  //     handleResize();
  //     window.addEventListener("resize", handleResize);
  //     return () => window.removeEventListener("resize", handleResize);
  //   }, []);

  //   // 🧩 On desktop, always open sidebar
  //   useEffect(() => {
  //     if (!isMobile) setIsExpanded(true);
  //   }, [isMobile]);

  //   return (
  //     <div className="flex flex-col h-screen bg-gray-50 overflow-hidden lg:flex-row">
  //       {/* 📱 Mobile View */}
  //       {isMobile ? (
  //         <div className="flex flex-col w-full h-full">
  //           {/* Sidebar with its own mobile header - it handles everything */}
  //           <Sidebar
  //             isExpanded={isExpanded}
  //             setIsExpanded={setIsExpanded}
  //             isMobile={isMobile}
  //           />

  //           {/* Header below sidebar - add top padding to account for fixed mobile header */}
  //           <div className="flex-shrink-0 mt-[60px]">
  //             <Header />
  //           </div>

  //           {/* Main content - takes remaining space */}
  //           <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
  //             <Outlet />
  //           </main>
  //         </div>
  //       ) : (
  //         // 💻 Desktop View
  //         <div className="flex flex-row w-full h-full">
  //           {/* Sidebar fixed on left */}
  //           <div className="w-[250px] flex-shrink-0">
  //             <Sidebar
  //               isExpanded={isExpanded}
  //               setIsExpanded={setIsExpanded}
  //               isMobile={isMobile}
  //             />
  //           </div>

  //           {/* Header + Content */}
  //           <div className="flex flex-col flex-1 overflow-hidden">
  //             <Header />
  //             <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
  //               <Outlet />
  //             </main>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  // export default ScreenLayout;



  // import React, { useState, useEffect } from "react";
  // import Header from "./Header.jsx";
  // import Sidebar from "./Sidebar.jsx";
  // import { Outlet, useLocation } from "react-router-dom";

  // const ScreenLayout = () => {
  //   const [isExpanded, setIsExpanded] = useState(true);
  //   const [isMobile, setIsMobile] = useState(false);
  //   const location = useLocation();

  //   // Get user role from localStorage
  //   const userRole = localStorage.getItem("role")?.toLowerCase();

  //   // Check if current route is company dashboard
  //   const isCompanyDashboard = location.pathname.startsWith("/companydashboard");

  //   // Determine if sidebar should be shown
  //   const shouldShowSidebar = () => {
  //     if (userRole === "admin") {
  //       // Admin: only show sidebar on company dashboard routes
  //       return isCompanyDashboard;
  //     }
  //     // All other roles: always show sidebar
  //     return true;
  //   };

  //   // 📱 Detect mobile screen
  //   useEffect(() => {
  //     const handleResize = () => setIsMobile(window.innerWidth < 1024);
  //     handleResize();
  //     window.addEventListener("resize", handleResize);
  //     return () => window.removeEventListener("resize", handleResize);
  //   }, []);

  //   // 🧩 On desktop, always open sidebar
  //   useEffect(() => {
  //     if (!isMobile) setIsExpanded(true);
  //   }, [isMobile]);

  //   const showSidebar = shouldShowSidebar();

  //   return (
  //     <div className="flex flex-col h-screen bg-gray-50 overflow-hidden lg:flex-row">
  //       {/* 📱 Mobile View */}
  //       {isMobile ? (
  //         <div className="flex flex-col w-full h-full">
  //           {/* Conditionally render Sidebar */}
  //           {showSidebar && (
  //             <Sidebar
  //               isExpanded={isExpanded}
  //               setIsExpanded={setIsExpanded}
  //               isMobile={isMobile}
  //             />
  //           )}

  //           {/* Header - adjust margin based on sidebar visibility */}
  //           <div className={`flex-shrink-0 ${showSidebar ? 'mt-[60px]' : ''}`}>
  //             <Header />
  //           </div>

  //           {/* Main content */}
  //           <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
  //             <Outlet />
  //           </main>
  //         </div>
  //       ) : (
  //         // 💻 Desktop View
  //         <div className="flex flex-row w-full h-full">
  //           {/* Conditionally render Sidebar */}
  //           {showSidebar && (
  //             <div className="w-[250px] flex-shrink-0">
  //               <Sidebar
  //                 isExpanded={isExpanded}
  //                 setIsExpanded={setIsExpanded}
  //                 isMobile={isMobile}
  //               />
  //             </div>
  //           )}

  //           {/* Header + Content - takes full width when sidebar is hidden */}
  //           <div className="flex flex-col flex-1 overflow-hidden">
  //             <Header />
  //             <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
  //               <Outlet />
  //             </main>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  // export default ScreenLayout;



  

// import React, { useState, useEffect } from "react";
// import Header from "./Header.jsx";
// import Sidebar from "./Sidebar.jsx";
// import CompanySidebar from "./dashboard/CompanySidebar.jsx";
// import { Outlet, useLocation } from "react-router-dom";
// import axios from "axios";

// const ScreenLayout = () => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [companyRoles, setCompanyRoles] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState(null);

//   const location = useLocation();

//   const userRole = localStorage.getItem("role")?.toLowerCase();
//   const adminId = localStorage.getItem("userId");

//   // Detect company dashboard route
//   const isCompanyDashboard = location.pathname.startsWith("/companydashboard");
//   const isMainDashboard = location.pathname === "/dashboard";

//   // Extract company ID if on /companydashboard/:id
//   const companyId = isCompanyDashboard
//     ? location.pathname.split("/companydashboard/")[1]?.split("/")[0]
//     : null;

//   // ✅ Determine if in "company context"
//   const isCompanyContext =
//     !!selectedCompany || localStorage.getItem("selectedCompany");

//   // 🔍 Fetch company details if on company dashboard
//   useEffect(() => {
//     if (isCompanyDashboard && companyId) {
//       fetchCompanyDetails(companyId);
//     } else {
//       const stored = localStorage.getItem("selectedCompany");
//       if (stored) setSelectedCompany(JSON.parse(stored));
//     }
//   }, [isCompanyDashboard, companyId]);

//   const fetchCompanyDetails = async (companyId) => {
//     try {
//       const res = await axios.get(`http://localhost:4000/company/${companyId}`);
//       if (res.data && res.data.company) {
//         setSelectedCompany(res.data.company);
//         localStorage.setItem(
//           "selectedCompany",
//           JSON.stringify(res.data.company)
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching company details:", error);
//       setSelectedCompany(null);
//     }
//   };

//   // 🔍 Fetch company roles (for CompanySidebar)
//   useEffect(() => {
//     if (
//       (isCompanyDashboard || isCompanyContext) &&
//       adminId &&
//       (companyId || selectedCompany?._id)
//     ) {
//       const id = companyId || selectedCompany?._id;
//       fetchCompanyRoles(adminId, id);
//     }
//   }, [isCompanyDashboard, adminId, companyId, selectedCompany]);

//   const fetchCompanyRoles = async (adminId, companyId) => {
//     try {
//       const res = await axios.get(
//         `http://localhost:4000/getAssignedRoles/${adminId}/${companyId}`
//       );
//       if (res.data && res.data.assignedRoles) {
//         setCompanyRoles(res.data.assignedRoles);
//       } else {
//         setCompanyRoles([]);
//       }
//     } catch (error) {
//       console.error("Error fetching company roles:", error);
//       setCompanyRoles([]);
//     }
//   };

//   // 📱 Detect screen size
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 1024);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!isMobile) setIsExpanded(true);
//   }, [isMobile]);

//   // ✅ Sidebar selection logic
//   const SidebarComponent =
//     userRole === "admin" && isCompanyContext && !isMainDashboard
//       ? CompanySidebar
//       : Sidebar;

//   return (
//     <div className="flex flex-col h-screen bg-gray-50 overflow-hidden lg:flex-row">
//       {/* 📱 Mobile Layout */}
//       {isMobile ? (
//         <div className="flex flex-col w-full h-full">
//           <SidebarComponent
//             isExpanded={isExpanded}
//             setIsExpanded={setIsExpanded}
//             isMobile={isMobile}
//             roles={companyRoles}
//             company={selectedCompany}
//           />

//           <div
//             className={`flex-shrink-0 ${
//               isCompanyContext && !isMainDashboard ? "mt-[60px]" : ""
//             }`}
//           >
//             <Header />
//           </div>

//           <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
//             <Outlet />
//           </main>
//         </div>
//       ) : (
//         // 💻 Desktop Layout
//         <div className="flex flex-row w-full h-full">
//           {/* ✅ Show CompanySidebar if admin in company context (not /dashboard) */}
//           {!(isMainDashboard && userRole === "admin") && (
//             <div className="w-[250px] flex-shrink-0">
//               <SidebarComponent
//                 isExpanded={isExpanded}
//                 setIsExpanded={setIsExpanded}
//                 isMobile={isMobile}
//                 roles={companyRoles}
//                 company={selectedCompany}
//               />
//             </div>
//           )}

//           {/* Header + Main Content */}
//           <div className="flex flex-col flex-1 overflow-hidden">
//             <Header />
//             <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
//               <Outlet />
//             </main>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScreenLayout;





// import React, { useState, useEffect } from "react";
// import Header from "./Header.jsx";
// import Sidebar from "./Sidebar.jsx";
// import CompanySidebar from "./dashboard/CompanySidebar.jsx";
// import { Outlet, useLocation } from "react-router-dom";
// import axios from "axios";

// const ScreenLayout = () => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [companyRoles, setCompanyRoles] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState(null);

//   const location = useLocation();
//   const userRole = localStorage.getItem("role")?.toLowerCase();
//   const adminId = localStorage.getItem("userId");

//   const isCompanyDashboard = location.pathname.startsWith("/companydashboard");
//   const companyId = isCompanyDashboard
//     ? location.pathname.split("/companydashboard/")[1]?.split("/")[0]
//     : null;

//   // ✅ Load selected company (if admin)
//   useEffect(() => {
//     if (isCompanyDashboard && companyId) {
//       fetchCompanyDetails(companyId);
//     } else {
//       const stored = localStorage.getItem("selectedCompany");
//       if (stored) setSelectedCompany(JSON.parse(stored));
//     }
//   }, [isCompanyDashboard, companyId]);

//   const fetchCompanyDetails = async (companyId) => {
//     try {
//       const res = await axios.get(`http://localhost:4000/company/${companyId}`);
//       if (res.data && res.data.company) {
//         setSelectedCompany(res.data.company);
//         localStorage.setItem("selectedCompany", JSON.stringify(res.data.company));
//       }
//     } catch (error) {
//       console.error("Error fetching company details:", error);
//       setSelectedCompany(null);
//     }
//   };

//   // 🔍 Fetch company roles (for admin/company sidebar)
//   useEffect(() => {
//     if (userRole === "admin" && adminId && (companyId || selectedCompany?._id)) {
//       const id = companyId || selectedCompany?._id;
//       fetchCompanyRoles(adminId, id);
//     }
//   }, [userRole, adminId, companyId, selectedCompany]);

//   const fetchCompanyRoles = async (adminId, companyId) => {
//     try {
//       const res = await axios.get(
//         `http://localhost:4000/getAssignedRoles/${adminId}/${companyId}`
//       );
//       setCompanyRoles(res.data?.assignedRoles || []);
//     } catch (error) {
//       console.error("Error fetching company roles:", error);
//       setCompanyRoles([]);
//     }
//   };

//   // 📱 Responsive detection
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 1024);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // ✅ Sidebar selection based on role
//   const SidebarComponent =
//     userRole === "admin" ? CompanySidebar : Sidebar;

//   return (
//     <div className="flex flex-col h-screen bg-gray-50 overflow-hidden lg:flex-row">
//       {/* 📱 Mobile Layout */}
//       {isMobile ? (
//         <div className="flex flex-col w-full h-full">
//           <SidebarComponent
//             isExpanded={isExpanded}
//             setIsExpanded={setIsExpanded}
//             isMobile={isMobile}
//             roles={companyRoles}
//             company={selectedCompany}
//           />
//           <div className="flex-shrink-0 mt-[60px]">
//             <Header />
//           </div>
//           <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
//             <Outlet />
//           </main>
//         </div>
//       ) : (
//         // 💻 Desktop Layout
//         <div className="flex flex-row w-full h-full">
//           <div className="w-[250px] flex-shrink-0">
//             <SidebarComponent
//               isExpanded={isExpanded}
//               setIsExpanded={setIsExpanded}
//               isMobile={isMobile}
//               roles={companyRoles}
//               company={selectedCompany}
//             />
//           </div>
//           <div className="flex flex-col flex-1 overflow-hidden">
//             <Header />
//             <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
//               <Outlet />
//             </main>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScreenLayout;





// import React, { useState, useEffect } from "react";
// import Header from "./Header.jsx";
// import Sidebar from "./Sidebar.jsx";
// import CompanySidebar from "./dashboard/CompanySidebar.jsx";
// import { Outlet, useLocation } from "react-router-dom";
// import axios from "axios";

// const ScreenLayout = () => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [companyRoles, setCompanyRoles] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState(null);

//   const location = useLocation();
//   const userRole = localStorage.getItem("role")?.toLowerCase();
//   const adminId = localStorage.getItem("userId");

//   // Detect current route
//   const isCompanyDashboard = location.pathname.startsWith("/companydashboard");
//   const isMainDashboard = location.pathname === "/dashboard";

//   // Extract company ID if on /companydashboard/:id
//   const companyId = isCompanyDashboard
//     ? location.pathname.split("/companydashboard/")[1]?.split("/")[0]
//     : null;

//   // Determine company context
//   const isCompanyContext =
//     !!selectedCompany || localStorage.getItem("selectedCompany");

//   // Fetch company details if on company dashboard
//   useEffect(() => {
//     if (isCompanyDashboard && companyId) {
//       fetchCompanyDetails(companyId);
//     } else {
//       const stored = localStorage.getItem("selectedCompany");
//       if (stored) setSelectedCompany(JSON.parse(stored));
//     }
//   }, [isCompanyDashboard, companyId]);

//   const fetchCompanyDetails = async (companyId) => {
//     try {
//       const res = await axios.get(`http://localhost:4000/company/${companyId}`);
//       if (res.data?.company) {
//         setSelectedCompany(res.data.company);
//         localStorage.setItem("selectedCompany", JSON.stringify(res.data.company));
//       }
//     } catch (error) {
//       console.error("Error fetching company details:", error);
//       setSelectedCompany(null);
//     }
//   };

//   // Fetch company roles
//   useEffect(() => {
//     if (
//       (isCompanyDashboard || isCompanyContext) &&
//       adminId &&
//       (companyId || selectedCompany?._id)
//     ) {
//       const id = companyId || selectedCompany?._id;
//       fetchCompanyRoles(adminId, id);
//     }
//   }, [isCompanyDashboard, adminId, companyId, selectedCompany]);

//   const fetchCompanyRoles = async (adminId, companyId) => {
//     try {
//       const res = await axios.get(
//         `http://localhost:4000/getAssignedRoles/${adminId}/${companyId}`
//       );
//       setCompanyRoles(res.data?.assignedRoles || []);
//     } catch (error) {
//       console.error("Error fetching company roles:", error);
//       setCompanyRoles([]);
//     }
//   };

//   // Detect mobile
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 1024);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!isMobile) setIsExpanded(true);
//   }, [isMobile]);

//   // Clear selected company when admin visits main dashboard
//   useEffect(() => {
//     if (isMainDashboard && userRole === "admin") {
//       localStorage.removeItem("selectedCompany");
//       setSelectedCompany(null);
//     }
//   }, [isMainDashboard, userRole]);

//   // Determine which sidebar to render
//   let SidebarComponent = Sidebar;

//   if (userRole === "admin") {
//     if (isCompanyDashboard || isCompanyContext) {
//       SidebarComponent = CompanySidebar; // show only in company context
//     } else {
//       SidebarComponent = null; // hide on main /dashboard
//     }
//   }

//   return (
//     <div className="flex flex-col h-screen bg-gray-50 overflow-hidden lg:flex-row">
//       {/* Mobile Layout */}
//       {isMobile ? (
//         <div className="flex flex-col w-full h-full">
//           {SidebarComponent && (
//             <SidebarComponent
//               isExpanded={isExpanded}
//               setIsExpanded={setIsExpanded}
//               isMobile={isMobile}
//               roles={companyRoles}
//               company={selectedCompany}
//             />
//           )}

//           <div className={`flex-shrink-0 ${isCompanyContext && !isMainDashboard ? "mt-[60px]" : ""}`}>
//             <Header />
//           </div>

//           <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
//             <Outlet />
//           </main>
//         </div>
//       ) : (
//         // Desktop Layout
//         <div className="flex flex-row w-full h-full">
//           {SidebarComponent && (
//             <div className="w-[250px] flex-shrink-0">
//               <SidebarComponent
//                 isExpanded={isExpanded}
//                 setIsExpanded={setIsExpanded}
//                 isMobile={isMobile}
//                 roles={companyRoles}
//                 company={selectedCompany}
//               />
//             </div>
//           )}

//           {/* Header + Main Content */}
//           <div className="flex flex-col flex-1 overflow-hidden">
//             <Header />
//             <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
//               <Outlet />
//             </main>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScreenLayout;


// import React, { useState, useEffect } from "react";
// import Header from "./Header.jsx";
// import Sidebar from "./Sidebar.jsx";
// import CompanySidebar from "./dashboard/CompanySidebar.jsx";
// import EmployeeSidebar from "./dashboard/EmployeeSidebar.jsx"; // Import EmployeeSidebar
// import { Outlet, useLocation } from "react-router-dom";
// import axios from "axios";

// const ScreenLayout = () => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [companyRoles, setCompanyRoles] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState(null);

//   const location = useLocation();
//   const userRole = localStorage.getItem("role")?.toLowerCase();
//   const adminId = localStorage.getItem("userId");

//   const isCompanyDashboard = location.pathname.startsWith("/companydashboard");
//   const isMainDashboard = location.pathname === "/dashboard";
//   const companyId = isCompanyDashboard
//     ? location.pathname.split("/companydashboard/")[1]?.split("/")[0]
//     : null;

//   // Determine company context for admin
//   const isCompanyContext =
//     userRole === "admin" && (!!selectedCompany || !!localStorage.getItem("selectedCompany"));

//   // Fetch company details for admin
//   useEffect(() => {
//     if (isCompanyDashboard && companyId) {
//       fetchCompanyDetails(companyId);
//     } else if (userRole === "admin") {
//       const stored = localStorage.getItem("selectedCompany");
//       if (stored) setSelectedCompany(JSON.parse(stored));
//     }
//   }, [isCompanyDashboard, companyId, userRole]);

//   const fetchCompanyDetails = async (companyId) => {
//     try {
//       const res = await axios.get(`http://localhost:4000/company/${companyId}`);
//       if (res.data?.company) {
//         setSelectedCompany(res.data.company);
//         localStorage.setItem("selectedCompany", JSON.stringify(res.data.company));
//       }
//     } catch (error) {
//       console.error("Error fetching company details:", error);
//       setSelectedCompany(null);
//     }
//   };

//   // Fetch company roles for admin
//   useEffect(() => {
//     if (userRole === "admin" && (isCompanyDashboard || isCompanyContext) && adminId) {
//       const id = companyId || selectedCompany?._id;
//       if (id) fetchCompanyRoles(adminId, id);
//     }
//   }, [userRole, isCompanyDashboard, isCompanyContext, adminId, companyId, selectedCompany]);

//   const fetchCompanyRoles = async (adminId, companyId) => {
//     try {
//       const res = await axios.get(
//         `http://localhost:4000/getAssignedRoles/${adminId}/${companyId}`
//       );
//       setCompanyRoles(res.data?.assignedRoles || []);
//     } catch (error) {
//       console.error("Error fetching company roles:", error);
//       setCompanyRoles([]);
//     }
//   };

//   // Detect mobile
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 1024);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!isMobile) setIsExpanded(true);
//   }, [isMobile]);

//   // Clear selected company when admin visits main dashboard
//   useEffect(() => {
//     if (isMainDashboard && userRole === "admin") {
//       localStorage.removeItem("selectedCompany");
//       setSelectedCompany(null);
//     }
//   }, [isMainDashboard, userRole]);

//   // ------------------------------
//   // Sidebar logic
//   // ------------------------------
//   let SidebarComponent = null;

//   if (userRole === "employee") {
//     SidebarComponent = EmployeeSidebar; // Employee sees EmployeeSidebar only on /dashboard
//   } else if (userRole === "superadmin") {
//     SidebarComponent = Sidebar; // Superadmin always sees default Sidebar
//   } else if (userRole === "admin") {
//     if (isCompanyDashboard || isCompanyContext) {
//       SidebarComponent = CompanySidebar; // Admin sees CompanySidebar only in company context
//     } else {
//       SidebarComponent = null; // Admin on main /dashboard sees nothing
//     }
//   }

//   return (
//     <div className="flex flex-col h-screen bg-gray-50 overflow-hidden lg:flex-row">
//       {/* Mobile Layout */}
//       {isMobile ? (
//         <div className="flex flex-col w-full h-full">
//           {SidebarComponent && (
//             <SidebarComponent
//               isExpanded={isExpanded}
//               setIsExpanded={setIsExpanded}
//               isMobile={isMobile}
//               roles={companyRoles}
//               company={selectedCompany}
//             />
//           )}

//           <div className={`flex-shrink-0 ${isCompanyContext && !isMainDashboard ? "mt-[60px]" : ""}`}>
//             <Header />
//           </div>

//           <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
//             <Outlet />
//           </main>
//         </div>
//       ) : (
//         // Desktop Layout
//         <div className="flex flex-row w-full h-full">
//           {SidebarComponent && (
//             <div className="w-[250px] flex-shrink-0">
//               <SidebarComponent
//                 isExpanded={isExpanded}
//                 setIsExpanded={setIsExpanded}
//                 isMobile={isMobile}
//                 roles={companyRoles}
//                 company={selectedCompany}
//               />
//             </div>
//           )}

//           {/* Header + Main Content */}
//           <div className="flex flex-col flex-1 overflow-hidden">
//             <Header />
//             <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
//               <Outlet />
//             </main>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScreenLayout;

import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import axios from "axios";

import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx"; // Superadmin Sidebar
import CompanySidebar from "./dashboard/CompanySidebar.jsx"; // Admin Company Sidebar
import EmployeeSidebar from "./dashboard/EmployeeSidebar.jsx"; // Employee Sidebar
import EmployeeHeader from "./EmployeeHeader.jsx";
import AdminSidebar from "./AdminSidebar.jsx";

const ScreenLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [companyRoles, setCompanyRoles] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const location = useLocation();
  const userRole = localStorage.getItem("role")?.trim()?.toLowerCase();
  const adminId = localStorage.getItem("userId");

  const isCompanyDashboard = location.pathname.startsWith("/companydashboard");
  const isMainDashboard = location.pathname === "/dashboard";
  
  const companyId = isCompanyDashboard
    ? location.pathname.split("/companydashboard/")[1]?.split("/")[0]
    : null;

  // Determine company context for admin
  const isCompanyContext =
    userRole === "admin" && (!!selectedCompany || !!localStorage.getItem("selectedCompany"));

  // Fetch company details for admin
  useEffect(() => {
    if (isCompanyDashboard && companyId) {
      fetchCompanyDetails(companyId);
    } else if (userRole === "admin") {
      const stored = localStorage.getItem("selectedCompany");
      if (stored) setSelectedCompany(JSON.parse(stored));
    }
  }, [isCompanyDashboard, companyId, userRole]);

  const fetchCompanyDetails = async (companyId) => {
    try {
      const res = await axios.get(`http://localhost:4000/company/${companyId}`);
      if (res.data?.company) {
        setSelectedCompany(res.data.company);
        localStorage.setItem("selectedCompany", JSON.stringify(res.data.company));
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      setSelectedCompany(null);
    }
  };

  // Fetch company roles for admin
  useEffect(() => {
    if (userRole === "admin" && (isCompanyDashboard || isCompanyContext) && adminId) {
      const id = companyId || selectedCompany?._id;
      if (id) fetchCompanyRoles(adminId, id);
    }
  }, [userRole, isCompanyDashboard, isCompanyContext, adminId, companyId, selectedCompany]);

  const fetchCompanyRoles = async (adminId, companyId) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/getAssignedRoles/${adminId}/${companyId}`
      );
      setCompanyRoles(res.data?.assignedRoles || []);
    } catch (error) {
      console.error("Error fetching company roles:", error);
      setCompanyRoles([]);
    }
  };

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) setIsExpanded(true);
  }, [isMobile]);

  // Clear selected company when admin visits main dashboard
  useEffect(() => {
    if (isMainDashboard && userRole === "admin") {
      localStorage.removeItem("selectedCompany");
      setSelectedCompany(null);
    }
  }, [isMainDashboard, userRole]);

  // ------------------------------
  // Determine Sidebar component
  // ------------------------------
  let SidebarComponent = null;

  // Employee: Always show EmployeeSidebar (including /dashboard)
  if (userRole === "employee") {
    SidebarComponent = EmployeeSidebar;
    // console.log("✓ Employee sidebar selected"); 
  } 
  // Superadmin: Show Sidebar on all routes
  else if (userRole === "superadmin") {
    SidebarComponent = Sidebar;
    console.log("✓ Superadmin sidebar selected");
  } 
  // Admin: Show AdminSidebar on all routes (dashboard + other pages)
  else if (userRole === "admin") {
    // Always show AdminSidebar for admins on all pages
    SidebarComponent = AdminSidebar;
    console.log("✓ Admin sidebar selected");
  } else {
    console.warn("⚠ No sidebar selected - userRole:", userRole);
  }
  // console.log(userRole);
  
  // ------------------------------
  // Render Layout
  // ------------------------------
  return (
    <div className="flex flex-col h-screen bg-gray-50 lg:overflow-hidden lg:flex-row">
      {/* Mobile Layout */}
      {isMobile ? (
        <div className="flex flex-col w-full h-full">
          {SidebarComponent && (
            <SidebarComponent
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              isMobile={isMobile}
              roles={companyRoles}
              company={selectedCompany}
            />
          )}

          {/* <div className={`flex-shrink-0 ${isCompanyContext && !isMainDashboard ? "mt-[60px]" : ""}`}>
            <Header />
          </div> */}
          <div className={`flex-shrink-0 ${isCompanyContext && !isMainDashboard ? "mt-[60px]" : ""}`}>
  {userRole === "employee" ? <EmployeeHeader /> : <Header />}
</div>


          <main className="flex-1 overflow-y-auto bg-gray-50">
            <Outlet />
          </main>
        </div>
      ) : (
        // Desktop Layout
        <div className="flex flex-row w-full h-full">
          {/* Only render sidebar container if SidebarComponent exists */}
          {SidebarComponent && (
            <div className="w-[250px] flex-shrink-0">
              <SidebarComponent
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                isMobile={isMobile}
                roles={companyRoles}
                company={selectedCompany}
              />
            </div>
          )}

          {/* Header + Main Content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {userRole=="superadmin" || userRole=="admin"?(
              <Header />
            ):(<EmployeeHeader/>)}
            <main className="flex-1 overflow-y-auto bg-gray-50">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenLayout;  