import { useAppSelector } from "@/hooks/reduxHooks";
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const userInfo = useAppSelector((state) => state.auth.userInfo);

  console.log(userInfo);

  // If not authenticated, redirect to /signin
  return userInfo?.accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
