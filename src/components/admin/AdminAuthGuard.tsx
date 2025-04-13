import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

interface MockUser {
  username: string;
  role: string;
  name: string;
  isLoggedIn: boolean;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
  children,
  requiredRole = ["admin", "manager", "viewer"],
}) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const userJson = localStorage.getItem("mockAdminUser");

      if (!userJson) {
        setAuthenticated(false);
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userJson) as MockUser;

        if (user && user.isLoggedIn) {
          setAuthenticated(true);

          // Check if user has required role
          if (requiredRole.includes(user.role)) {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        } else {
          setAuthenticated(false);
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setAuthenticated(false);
        setAuthorized(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  if (!authenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!authorized) {
    // Redirect to unauthorized page if not authorized
    return (
      <Navigate to="/admin/unauthorized" state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
