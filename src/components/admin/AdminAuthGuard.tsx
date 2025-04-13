import React from "react";

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  // No auth checks - admin always has full access
  return <>{children}</>;
};

export default AdminAuthGuard;
