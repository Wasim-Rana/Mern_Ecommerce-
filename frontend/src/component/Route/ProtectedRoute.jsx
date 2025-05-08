import React, { Fregment } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (isAdmin === true && user.role !== "admin") {
    return <Navigate to="/login" />; // or redirect to home
  }
  return loading === false ? <Component {...rest} /> : null;
};

export default ProtectedRoute;
