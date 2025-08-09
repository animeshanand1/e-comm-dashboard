import React from "react";
import { useSelector } from "react-redux";
import Login from "../pages/auth/Login";


const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Login onLogin={() => {}} />;
  }
  return children;
};

export default ProtectedRoute;
