// import MainDashboard from "../newComponents/dashboard/MainDashboard";
// import SuperAdminDashboard from "../newComponents/dashboard/SuperAdminDashboard";

// const DashboardSwitcher = ({roles}) => {
// //   const role = localStorage.getItem("role");
//     console.log(role);
    
//   if (role === "superAdmin") return <SuperAdminDashboard />;
// //   if (role === "admin") return <AdminDashboard />;

//   return <MainDashboard/>;
// };

// export default DashboardSwitcher;
import MainDashboard from "../newComponents/dashboard/MainDashboard";
import SuperAdminDashboard from "../newComponents/dashboard/SuperAdminDashboard";

const DashboardSwitcher = () => {
  const role = localStorage.getItem("role"); // 👈 get actual user role

  console.log("Current role:", role);

  if (role === "superAdmin") {
    return <SuperAdminDashboard />;
  }

  return <MainDashboard />;
};

export default DashboardSwitcher;
