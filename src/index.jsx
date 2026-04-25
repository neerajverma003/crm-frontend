// import React from "react";
// import { createRoot } from "react-dom/client";
// import "@coreui/coreui/dist/css/coreui.min.css";
// import "./index.css";
// import App from "./App.jsx";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // 🧩 Layouts & Components
// import ScreenLayout from "./newComponents/ScreenLayout.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

// // 🧭 Pages
// // import MainDashboard from "./newComponents/dashboard/MainDashboard.jsx";
// import MainLeadManagement from "./newComponents/leadManagement/MainLeadManagement.jsx";
// import MainUserManagement from "./newComponents/UserManagement/MainUserManagement.jsx";
// import MainAttendance from "./newComponents/attendance/MainAttendance.jsx";
// import SuperAdminAttendance from "./newComponents/attendance/SuperAdminAttendance.jsx"; // 🆕
// import MainAllCompanies from "./newComponents/allCompanies/MainAllCompanies.jsx";
// import MainSettings from "./newComponents/Settings/MainSettings.jsx";
// import AddLeadShortcut from "./newComponents/dashboard/AddLeadShortcut.jsx";
// import AddUserShortcut from "./newComponents/dashboard/AddUserShortcut.jsx";
// import ClockInOutShortcut from "./newComponents/dashboard/ClockInOutShortcut.jsx";
// import ViewReportsShortcut from "./newComponents/dashboard/ViewReportsShortcut.jsx";
// import ForgotPassword from "./newComponents/loginSection/ForgotPassword.jsx";
// import ResetLink from "./newComponents/loginSection/ResetLink.jsx";
// import ChangePassword from "./newComponents/loginSection/ChangePassword.jsx";
// import EditUser from "./newComponents/UserManagement/EditUser.jsx";
// import { LeaveAdmin } from "./views/admin/leaveManagement/LeaveAdmin.jsx";
// import { LeaveSuperAdmin } from "./views/admin/leaveManagement/LeaveSuperAdmin.jsx";

// import { LeavePage } from "./views/employee/LeaveSection/LeavePage.jsx";
// import ChequeExpense from "./newComponents/expense/ChequeExpense.jsx";
// import DailyExpense from "./newComponents/expense/DailyExpense.jsx";
// import Department from "./newComponents/department/Department.jsx";
// import Designation from "./newComponents/designation/Designation.jsx";
// import AddMyLead from "./newComponents/leadManagement/AddMyLead.jsx"
// import AddAdmin from "./newComponents/UserManagement/AddAdmin.jsx"
// import AssignCompany from "./newComponents/UserManagement/AssignCompany.jsx";
// import AssignLead from "./newComponents/leadManagement/AssignLead.jsx";
// import TodaysLead from "./newComponents/leadManagement/TodaysLead.jsx";
// import FollowLead from "./newComponents/leadManagement/FollowLead.jsx";
// import AssignRole from "./newComponents/UserManagement/AssignRole.jsx";
// import AddRole from "./newComponents/allCompanies/AddRole.jsx";
// import CreateDestination from "./newComponents/Operations/CreateDestination.jsx";
// import CreateHotel from "./newComponents/Operations/CreateHotel.jsx";
// import CreateState from "./newComponents/Operations/CreateState.jsx";
// import AssignedRoles from "./newComponents/UserManagement/AssignedRoles.jsx";
// import CompanyDashboard from "./newComponents/dashboard/CompanyDashboard.jsx";
// import AddReport from "./newComponents/AddReport.jsx";
// import AssignEmployeeCompany from "./newComponents/employee/AssignEmployeeCompany.jsx";
// import AssignEmployeeRole from "./newComponents/employee/AssignEmployeeRole.jsx"
// import CreateTransport from "./newComponents/Operations/CreateTransport.jsx";
// import CreateInvoice from "./newComponents/Operations/CreateInvoice.jsx";
// import InvoiceList from "./newComponents/Operations/InvoiceList.jsx";
// import B2bAddCompany from "./newComponents/B2b/B2bAddCompany.jsx";
// import B2bDestination from "./newComponents/B2b/B2bDestination.jsx";
// import B2bCompanyLeads from "./newComponents/B2b/B2bCompanyLeads.jsx";
// import CreateCustomer from "./newComponents/Operations/CreateCustomer.jsx";
// import CustomerData from "./newComponents/Operations/CustomerData.jsx";
// import UploadMaterial from "./newComponents/Tutorials/UploadMaterial.jsx";
// import TrainingMaterial from "./newComponents/Tutorials/TrainingMaterial.jsx";
// import DisputeClients from "./newComponents/dispute/DisputeClients.jsx";
// import CreateDestinationEmployee from "./newComponents/employee/CreateDestinationEmployee.jsx";
// import AssignDestinationEmployee from "./newComponents/employee/AssignDestinationEmployee.jsx";
// // import AssignEmployeeCompany from "./newComponents/employee/AssignEmployeeCompany.jsx"
// import CreateTeam from "./newComponents/Teams/CreateTeam.jsx";
// import AllTeam from "./newComponents/Teams/AllTeam.jsx";
// import LeadReport from "./newComponents/leadManagement/LeadReport.jsx";
// import AddItinerary from "./newComponents/Itinerary/AddItinerary.jsx";
// import AllItinerary from "./newComponents/Itinerary/AllItinerary.jsx";
// import DashboardSwitcher from "./utils/DashBoardSwitcher.jsx";
// import AdminProfile from "./newComponents/profile/AdminProfile.jsx";
// import EmployeeProfile from "./newComponents/profile/EmployeeProfile.jsx";
// import CompanyOverview from "./newComponents/company/CompanyOverview.jsx";
// import EmployeeLeave from "./views/admin/dashboard/EmployeeLeave.jsx";

// // ✅ Role groups
// const roles = {
//   all: ["admin", "employee", "superadmin"],
//   adminOnly: ["admin", "superadmin"],
//   employeeOnly: ["employee"],
//   superAdminOnly: ["superadmin"],
// };

// // ✅ Role-based Attendance Wrapper
// const AttendanceRoute = () => {
//   const role = localStorage.getItem("role")?.toLowerCase();
//   console.log(role);

//   if (role === "superadmin") return <SuperAdminAttendance />;
//   return <MainAttendance />;
// };

// const ProfileRoute = () => {
//   const role = localStorage.getItem("role")?.toLowerCase();
//   // console.log(role);

//   if (role === "admin") return <AdminProfile />;
//   return <EmployeeProfile />;
// }; 

// const LeaveRoute = () => {
//   const role = localStorage.getItem("role")?.toLowerCase();
//   // console.log(role);

//   if (role === "admin") return <LeaveAdmin />
//   else if(role==="superadmin") return <LeaveSuperAdmin />;
//   return <LeavePage />;
// }; 

// // ✅ ROUTER CONFIGURATION
// const router = createBrowserRouter([
//   // 🟢 Public Routes
//   { path: "/", element: <App /> }, // Login
//   { path: "/forgot-password", element: <ForgotPassword /> },
//   { path: "/reset-password", element: <ResetLink /> },

//   // 🔒 Protected Routes (inside ScreenLayout)
//   {
//     element: (
//       <ProtectedRoute>
//         <ScreenLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       // ✅ Common (Admin, Employee, SuperAdmin)
//       {
//         path: "/dashboard",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <DashboardSwitcher/>
//           </ProtectedRoute>
//         ),
//       },

//       {
//         path: "/lead-management",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <MainLeadManagement />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/assignlead",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <AssignLead />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/todaysleads",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <TodaysLead />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/followupleads",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <FollowLead />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/add-itinerary",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <AddItinerary />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/attendance",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <AttendanceRoute /> {/* 👈 Dynamic Attendance Loader */}
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/profile",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <ProfileRoute /> {/* 👈 Dynamic Profile Loader */}
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/settings",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <MainSettings />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/change-password",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <ChangePassword />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/clock-in-out",
//         element: (
//           <ProtectedRoute allowedRoles={roles.employeeOnly}>
//             <ClockInOutShortcut />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/view-reports",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <ViewReportsShortcut />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/leadreports",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <LeadReport />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/all-itinerary",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <AllItinerary />
//           </ProtectedRoute>
//         ),
//       },

//       // ✅ Admin + SuperAdmin
//       {
//         path: "/user-management",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <MainUserManagement />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/assigned-roles",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <AssignedRoles />
//           </ProtectedRoute>
//         ),
//       },
//        {
//         path: "/assignrole",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <AssignRole />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/assignemployeeRole",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <AssignEmployeeRole />
//           </ProtectedRoute>
//         ),
//       },
//       // {
//       //   path: "/assignemployeeRole",
//       //   element: (
//       //     <ProtectedRoute allowedRoles={roles.adminOnly}>
//       //       <AssignEmployeeRole />
//       //     </ProtectedRoute>
//       //   ),
//       // },
//       {
//         path: "/companies",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <MainAllCompanies />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/company-overview",
//         element: (
//           <ProtectedRoute allowedRoles={roles.superAdminOnly}>
//             <CompanyOverview />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/createdestinationemployee",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <CreateDestinationEmployee />
//           </ProtectedRoute>
//         ),
//       },
//          {
//         path: "/assigndestination",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <AssignDestinationEmployee />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path:"/companydashboard/:id",
//         element:(
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <CompanyDashboard/>
//           </ProtectedRoute>
//         )
//       },
//       {
//         path: "/edit/:role/:id",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <EditUser />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/add-user",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <AddUserShortcut />
//           </ProtectedRoute>
//         ),
//       },
//           {
//         path: "/add-admin",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <AddAdmin />
//           </ProtectedRoute>
//         ),
//       },
//         {
//         path: "/assigncompany",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <AssignCompany />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/addrole",
//         element: (
//           <ProtectedRoute allowedRoles={roles.superAdminOnly}>
//             <AddRole />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/assignemployeecompany",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <AssignEmployeeCompany />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path:"/assignemployeerole",
//         element:(
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <AssignEmployeeRole />
//           </ProtectedRoute>
//         )
//       },
//       {
//         path: "/leaves",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <LeaveRoute />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/dailyexpenses",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <DailyExpense />
//           </ProtectedRoute>
//         ),
//       },
//    {
//         path: "/createstate",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <CreateState />
//           </ProtectedRoute>
//         ),
//       },
//         {
//         path: "/createdestination",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <CreateDestination />
//           </ProtectedRoute>
//         ),
//       },

//        {
//         path: "/createhotel",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <CreateHotel />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/createtransport",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <CreateTransport />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/createinvoice",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <CreateInvoice />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/invoicelist",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <InvoiceList />
//           </ProtectedRoute>
//         ),
//       },
//       ,

//       // ✅ Employee only
//       {
//         path: "/department",
//         element: (
//           <ProtectedRoute allowedRoles={roles.superAdminOnly}>
//             <Department />
//           </ProtectedRoute>
//         ),
//       },
//        {
//         path: "/designation",
//         element: (
//           <ProtectedRoute allowedRoles={roles.superAdminOnly}>
//             <Designation />s
//           </ProtectedRoute>
//         ),
//       },

//       {
//         path: "/cheque",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <ChequeExpense />
//           </ProtectedRoute>
//         ),
//       },

//       // ✅ Employee only
//       {
//         path: "/leave-apply",
//         element: (
//           <ProtectedRoute allowedRoles={roles.employeeOnly}>
//             <LeavePage />
//           </ProtectedRoute>
//         ),
//       },
//        {
//         path: "/addmylead",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <AddMyLead />
//           </ProtectedRoute>
//         ),
//       },

//         {
//         path: "/add-report",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <AddReport />
//           </ProtectedRoute>
//         ),
//       },

//       {
//         path: "/b2b-addcompany",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <B2bAddCompany />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/b2b-destination",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <B2bDestination />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/b2b-company-leads",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <B2bCompanyLeads />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/customer-creation",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <CreateCustomer />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/customer-data",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <CustomerData />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/dispute-clients",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <DisputeClients />
//           </ProtectedRoute>
//         ),
//       },
//   {
//         path: "/training-material",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <TrainingMaterial />
//           </ProtectedRoute>
//         ),
//       },
//         {
//         path: "/upload-material",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <UploadMaterial />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/create-team",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <CreateTeam/>
//           </ProtectedRoute>
//         ),
//       },

//         {
//         path: "/all-team",
//         element: (
//           <ProtectedRoute allowedRoles={roles.adminOnly}>
//             <AllTeam/>
//           </ProtectedRoute>
//         ),
//       },

//       // ✅ Dashboard shortcuts
//       {
//         path: "/add-lead",
//         element: (
//           <ProtectedRoute allowedRoles={roles.all}>
//             <AddLeadShortcut />
//           </ProtectedRoute>
//         ),
//       },
//     ],
//   },
// ]);

// // ✅ ROOT RENDER
// createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <>
//       <RouterProvider router={router} />
//       <ToastContainer position="top-right" autoClose={3000} />
//     </>
//   </React.StrictMode>
// );



import React from "react";
import { createRoot } from "react-dom/client";
import "@coreui/coreui/dist/css/coreui.min.css";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🧩 Layouts & Components
import ScreenLayout from "./newComponents/ScreenLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// 🧭 Pages
// import MainDashboard from "./newComponents/dashboard/MainDashboard.jsx";
import MainLeadManagement from "./newComponents/leadManagement/MainLeadManagement.jsx";
import MainUserManagement from "./newComponents/UserManagement/MainUserManagement.jsx";
import MainAttendance from "./newComponents/attendance/MainAttendance.jsx";
import SuperAdminAttendance from "./newComponents/attendance/SuperAdminAttendance.jsx"; // 
import MainAllCompanies from "./newComponents/allCompanies/MainAllCompanies.jsx";
import MainSettings from "./newComponents/Settings/MainSettings.jsx";
import AddLeadShortcut from "./newComponents/dashboard/AddLeadShortcut.jsx";
import AddUserShortcut from "./newComponents/dashboard/AddUserShortcut.jsx";
import ClockInOutShortcut from "./newComponents/dashboard/ClockInOutShortcut.jsx";
import ViewReportsShortcut from "./newComponents/dashboard/ViewReportsShortcut.jsx";
import ForgotPassword from "./newComponents/loginSection/ForgotPassword.jsx";
import ResetLink from "./newComponents/loginSection/ResetLink.jsx";
import ChangePassword from "./newComponents/loginSection/ChangePassword.jsx";
import EditUser from "./newComponents/UserManagement/EditUser.jsx";
import { LeaveAdmin } from "./views/admin/leaveManagement/LeaveAdmin.jsx";
import { LeaveSuperAdmin } from "./views/admin/leaveManagement/LeaveSuperAdmin.jsx";

import { LeavePage } from "./views/employee/LeaveSection/LeavePage.jsx";
import ChequeExpense from "./newComponents/expense/ChequeExpense.jsx";
import DailyExpense from "./newComponents/expense/DailyExpense.jsx";
import Ledger from "./newComponents/expense/Ledger.jsx";
import Department from "./newComponents/department/Department.jsx";
import Designation from "./newComponents/designation/Designation.jsx";
import AddMyLead from "./newComponents/leadManagement/AddMyLead.jsx"
// import SuperadminMylead from "./newComponents/leadManagement/SuperadminMylead.jsx"
import SuperadminMylead from "./newComponents/leadManagement/SuperAdminMyLead.jsx"
import AddAdmin from "./newComponents/UserManagement/AddAdmin.jsx"
import AssignCompany from "./newComponents/UserManagement/AssignCompany.jsx";
import AssignLead from "./newComponents/leadManagement/AssignLead.jsx";
import TodaysLead from "./newComponents/leadManagement/TodaysLead.jsx";
import FollowLead from "./newComponents/leadManagement/FollowLead.jsx";
import AssignRole from "./newComponents/UserManagement/AssignRole.jsx";
import AddRole from "./newComponents/allCompanies/AddRole.jsx";
import CreateDestination from "./newComponents/Operations/CreateDestination.jsx";
import CreateHotel from "./newComponents/Operations/CreateHotel.jsx";
import CreateState from "./newComponents/Operations/CreateState.jsx";
import CreateBank from "./newComponents/Operations/CreateBank.jsx";
import AssignedRoles from "./newComponents/UserManagement/AssignedRoles.jsx";
import CompanyDashboard from "./newComponents/dashboard/CompanyDashboard.jsx";
import AddReport from "./newComponents/AddReport.jsx";
import AssignEmployeeCompany from "./newComponents/employee/AssignEmployeeCompany.jsx";
import AssignEmployeeRole from "./newComponents/employee/AssignEmployeeRole.jsx"
import CreateTransport from "./newComponents/Operations/CreateTransport.jsx";
import CreateInvoice from "./newComponents/Operations/CreateInvoice.jsx";
import InvoiceList from "./newComponents/Operations/InvoiceList.jsx";
import B2bAddCompany from "./newComponents/B2b/B2bAddCompany.jsx";
import B2bDestination from "./newComponents/B2b/B2bDestination.jsx";
import B2bCompanyLeads from "./newComponents/B2b/B2bCompanyLeads.jsx";
import CreateCustomer from "./newComponents/Operations/CreateCustomer.jsx";
import CustomerData from "./newComponents/Operations/CustomerData.jsx";
import UploadMaterial from "./newComponents/Tutorials/UploadMaterial.jsx";
import TrainingMaterial from "./newComponents/Tutorials/TrainingMaterial.jsx";
import DisputeClients from "./newComponents/dispute/DisputeClients.jsx";
import CreateDestinationEmployee from "./newComponents/employee/CreateDestinationEmployee.jsx";
import AssignDestinationEmployee from "./newComponents/employee/AssignDestinationEmployee.jsx";
// import AssignEmployeeCompany from "./newComponents/employee/AssignEmployeeCompany.jsx"
import CreateTeam from "./newComponents/Teams/CreateTeam.jsx";
import AllTeam from "./newComponents/Teams/AllTeam.jsx";
import LeadReport from "./newComponents/leadManagement/LeadReport.jsx";
import AddItinerary from "./newComponents/Itinerary/AddItinerary.jsx";
import AllItinerary from "./newComponents/Itinerary/AllItinerary.jsx";
import DashboardSwitcher from "./utils/DashBoardSwitcher.jsx";
import AdminProfile from "./newComponents/profile/AdminProfile.jsx";
import EmployeeProfile from "./newComponents/profile/EmployeeProfile.jsx";
import AddProfile from "./newComponents/profile/AddProfile.jsx";
import AddCandidate from "./newComponents/candidate/AddCandidate.jsx";
import OfferLetter from "./newComponents/offerLetter/OfferLetter.jsx";
import OfferLetterFormat from "./newComponents/offerLetter/OfferLetterFormat.jsx";
import CompanyOverview from "./newComponents/company/CompanyOverview.jsx";
import EmployeeLeave from "./views/admin/dashboard/EmployeeLeave.jsx";
import SalaryList from "./newComponents/payroll/SalaryList.jsx";
import MainEmployeeData from "./newComponents/employeeData/MainEmployeeData.jsx";
import EmployeeCompanyOverview from "./newComponents/company/EmployeeCompanyOverview.jsx";
import EmployeeTrainingMaterial from "./newComponents/Tutorials/EmployeeTrainingMaterial.jsx";
import SimManagement from "./newComponents/inventory/SimManagement.jsx";
import EmailManagement from "./newComponents/inventory/EmailManagement.jsx";
import TaskAssign from "./newComponents/TaskManagement/TaskAssign.jsx";
import TaskReport from "./newComponents/TaskManagement/TaskReport.jsx";
import EmployeeTasks from "./newComponents/dashboard/EmployeeTasks.jsx";

// ✅ Role groups
const roles = {
  all: ["admin", "employee", "superadmin"],
  adminOnly: ["admin", "superadmin"],
  employeeOnly: ["employee"],
  superAdminOnly: ["superadmin"],
};

// ✅ Role-based Attendance Wrapper
const AttendanceRoute = () => {
  const role = localStorage.getItem("role")?.toLowerCase();
  console.log(role);

  if (role === "superadmin") return <SuperAdminAttendance />;
  return <MainAttendance />;
};

const ProfileRoute = () => {
  const role = localStorage.getItem("role")?.toLowerCase();
  // console.log(role);

  if (role === "admin") return <AdminProfile />;
  return <EmployeeProfile />;
};

const LeaveRoute = () => {
  const role = localStorage.getItem("role")?.toLowerCase();
  // console.log(role);

  if (role === "admin") return <LeaveAdmin />
  else if (role === "superadmin") return <LeaveSuperAdmin />;
  return <LeavePage />;
};

// ✅ ROUTER CONFIGURATION
const router = createBrowserRouter([
  // 🟢 Public Routes
  { path: "/", element: <App /> }, // Login
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetLink /> },

  // 🔒 Protected Routes (inside ScreenLayout)
  {
    element: (
      <ProtectedRoute>
        <ScreenLayout />
      </ProtectedRoute>
    ),
    children: [
      // ✅ Common (Admin, Employee, SuperAdmin)
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <DashboardSwitcher />
          </ProtectedRoute>
        ),
      },

      {
        path: "/lead-management",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <MainLeadManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/assignlead",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <AssignLead />
          </ProtectedRoute>
        ),
      },
      {
        path: "/todaysleads",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <TodaysLead />
          </ProtectedRoute>
        ),
      },
      {
        path: "/followupleads",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <FollowLead />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-itinerary",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <AddItinerary />
          </ProtectedRoute>
        ),
      },
      {
        path: "/attendance",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <AttendanceRoute /> {/* 👈 Dynamic Attendance Loader */}
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <ProfileRoute /> {/* 👈 Dynamic Profile Loader */}
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-profile",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AddProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-candidate",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AddCandidate />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <MainSettings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/change-password",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "/clock-in-out",
        element: (
          <ProtectedRoute allowedRoles={roles.employeeOnly}>
            <ClockInOutShortcut />
          </ProtectedRoute>
        ),
      },
      {
        path: "/view-reports",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <ViewReportsShortcut />
          </ProtectedRoute>
        ),
      },
      {
        path: "/leadreports",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <LeadReport />
          </ProtectedRoute>
        ),
      },
      {
        path: "/all-itinerary",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <AllItinerary />
          </ProtectedRoute>
        ),
      },

      // Inventory pages
      {
        path: "/sim-management",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <SimManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/email-management",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <EmailManagement />
          </ProtectedRoute>
        ),
      },

      // ✅ Admin + SuperAdmin
      {
        path: "/user-management",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <MainUserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/assigned-roles",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AssignedRoles />
          </ProtectedRoute>
        ),
      },
      {
        path: "/assignrole",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AssignRole />
          </ProtectedRoute>
        ),
      },
      {
        path: "/assignemployeeRole",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AssignEmployeeRole />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "/assignemployeeRole",
      //   element: (
      //     <ProtectedRoute allowedRoles={roles.adminOnly}>
      //       <AssignEmployeeRole />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: "/companies",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <MainAllCompanies />
          </ProtectedRoute>
        ),
      },
      {
        path: "/company-overview",
        element: (
          <ProtectedRoute allowedRoles={roles.superAdminOnly}>
            <CompanyOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: "/employee-company-overview",
        element: (
          <ProtectedRoute allowedRoles={roles.employeeOnly}>
            <EmployeeCompanyOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: "/createdestinationemployee",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <CreateDestinationEmployee />
          </ProtectedRoute>
        ),
      },
      {
        path: "/assigndestination",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AssignDestinationEmployee />
          </ProtectedRoute>
        ),
      },
      {
        path: "/companydashboard/:id",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <CompanyDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "/edit/:role/:id",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <EditUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-user",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AddUserShortcut />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-admin",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AddAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/assigncompany",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AssignCompany />
          </ProtectedRoute>
        ),
      },
      {
        path: "/addrole",
        element: (
          <ProtectedRoute allowedRoles={roles.superAdminOnly}>
            <AddRole />
          </ProtectedRoute>
        ),
      },
      {
        path: "/assignemployeecompany",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AssignEmployeeCompany />
          </ProtectedRoute>
        ),
      },
      {
        path: "/assignemployeerole",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AssignEmployeeRole />
          </ProtectedRoute>
        )
      },
      {
        path: "/leaves",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <LeaveRoute />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dailyexpenses",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <DailyExpense />
          </ProtectedRoute>
        ),
      },
      {
        path: "/createstate",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <CreateState />
          </ProtectedRoute>
        ),
      },
      {
        path: "/createdestination",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <CreateDestination />
          </ProtectedRoute>
        ),
      },

      {
        path: "/createhotel",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <CreateHotel />
          </ProtectedRoute>
        ),
      },
      {
        path: "/createtransport",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <CreateTransport />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-bank",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <CreateBank />
          </ProtectedRoute>
        ),
      },
      {
        path: "/createinvoice",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <CreateInvoice />
          </ProtectedRoute>
        ),
      },
      {
        path: "/invoicelist",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <InvoiceList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/salary-list",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <SalaryList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/offer-letter",
        element: (
          <ProtectedRoute allowedRoles={roles.superAdminOnly}>
            <OfferLetter />
          </ProtectedRoute>
        ),
      },
      {
        path: "/offer-letter-format",
        element: (
          <ProtectedRoute allowedRoles={roles.superAdminOnly}>
            <OfferLetterFormat />
          </ProtectedRoute>
        ),
      },
      {
        path: "/employee-data",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <MainEmployeeData />
          </ProtectedRoute>
        ),
      },
      ,

      // ✅ Employee only
      {
        path: "/department",
        element: (
          <ProtectedRoute allowedRoles={roles.superAdminOnly}>
            <Department />
          </ProtectedRoute>
        ),
      },
      {
        path: "/designation",
        element: (
          <ProtectedRoute allowedRoles={roles.superAdminOnly}>
            <Designation />s
          </ProtectedRoute>
        ),
      },

      {
        path: "/cheque",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <ChequeExpense />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ledger",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <Ledger />
          </ProtectedRoute>
        ),
      },

      // ✅ Employee only
      {
        path: "/leave-apply",
        element: (
          <ProtectedRoute allowedRoles={roles.employeeOnly}>
            <LeavePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/addmylead",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <AddMyLead />
          </ProtectedRoute>
        ),
      },
      {
        path: "/superadmin-mylead",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <SuperadminMylead />
          </ProtectedRoute>
        ),
      },

      {
        path: "/add-report",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AddReport />
          </ProtectedRoute>
        ),
      },

      {
        path: "/b2b-addcompany",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <B2bAddCompany />
          </ProtectedRoute>
        ),
      },
      {
        path: "/b2b-destination",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <B2bDestination />
          </ProtectedRoute>
        ),
      },
      {
        path: "/b2b-company-leads",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <B2bCompanyLeads />
          </ProtectedRoute>
        ),
      },
      {
        path: "/customer-creation",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <CreateCustomer />
          </ProtectedRoute>
        ),
      },
      {
        path: "/customer-data",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <CustomerData />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dispute-clients",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <DisputeClients />
          </ProtectedRoute>
        ),
      },
      {
        path: "/training-material",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <TrainingMaterial />
          </ProtectedRoute>
        ),
      },
      {
        path: "/employee-training-material",
        element: (
          <ProtectedRoute allowedRoles={roles.employeeOnly}>
            <EmployeeTrainingMaterial />
          </ProtectedRoute>
        ),
      },
      {
        path: "/upload-material",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <UploadMaterial />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-team",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <CreateTeam />
          </ProtectedRoute>
        ),
      },

      {
        path: "/all-team",
        element: (
          <ProtectedRoute allowedRoles={roles.adminOnly}>
            <AllTeam />
          </ProtectedRoute>
        ),
      },

      // ✅ Task Management
      {
        path: "/task-assign",
        element: (
          <ProtectedRoute allowedRoles={roles.superAdminOnly}>
            <TaskAssign />
          </ProtectedRoute>
        ),
      },
      {
        path: "/task-report",
        element: (
          <ProtectedRoute allowedRoles={roles.superAdminOnly}>
            <TaskReport />
          </ProtectedRoute>
        ),
      },
      {
        path: "/employee-tasks",
        element: (
          <ProtectedRoute allowedRoles={roles.employeeOnly}>
            <EmployeeTasks />
          </ProtectedRoute>
        ),
      },

      // ✅ Dashboard shortcuts
      {
        path: "/add-lead",
        element: (
          <ProtectedRoute allowedRoles={roles.all}>
            <AddLeadShortcut />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

// ✅ ROOT RENDER
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  </React.StrictMode>
);
