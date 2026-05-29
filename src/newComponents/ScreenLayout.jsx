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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/company/${companyId}`);
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
        `${import.meta.env.VITE_API_URL}/getAssignedRoles/${adminId}/${companyId}`
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