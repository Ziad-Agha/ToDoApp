import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />; // redirect to login if no token

  return <Outlet />; // render the child route if token exists
}
