// // src/components/ProtectedRoute.jsx
// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token"); // use the actual key you store
//   const location = useLocation();

//   // If not logged in, redirect to login (and prevent going "back")
//   if (!token) {
//     return <Navigate to="/" replace state={{ from: location }} />;
//   }

//   return children;
// };

// export default ProtectedRoute;


// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");       // check if logged in
  const role = localStorage.getItem("role");         // get user role
  const location = useLocation();

  // 1️⃣ Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // 2️⃣ Check role if allowedRoles is defined
  if (allowedRoles && !allowedRoles.includes(role?.toLowerCase())) {
    // Redirect unauthorized users to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // 3️⃣ If everything is fine, render the page
  return children;
};

export default ProtectedRoute;
