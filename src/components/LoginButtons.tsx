import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, User, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LoginButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onClick?: () => void;
}

export const UserLoginButton: React.FC<LoginButtonProps> = ({
  variant = "outline",
  size = "sm",
  className = "",
  onClick,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLoginClick = () => {
    // Store mock user info in localStorage
    localStorage.setItem(
      "mockUser",
      JSON.stringify({
        username: "user@example.com",
        name: "Regular User",
        isLoggedIn: true,
      }),
    );

    toast({
      title: "User Login Successful",
      description: "Welcome back, Regular User!",
    });

    if (onClick) onClick();
    navigate("/");
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLoginClick}
    >
      <User className="h-4 w-4 mr-2" />
      User Login
    </Button>
  );
};

export const AdminLoginButton: React.FC<LoginButtonProps> = ({
  variant = "default",
  size = "sm",
  className = "",
  onClick,
}) => {
  const navigate = useNavigate();

  const handleAdminLoginClick = () => {
    if (onClick) onClick();
    navigate("/admin/login");
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleAdminLoginClick}
    >
      <ShieldCheck className="h-4 w-4 mr-2" />
      Admin Login
    </Button>
  );
};

export const QuickLoginButtons: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginAsAdmin = () => {
    localStorage.setItem(
      "mockAdminUser",
      JSON.stringify({
        username: "admin",
        role: "admin",
        name: "Admin User",
        isLoggedIn: true,
      }),
    );

    toast({
      title: "Admin Login Successful",
      description: "Welcome back, Admin User!",
    });

    navigate("/admin/guest-session-management");
  };

  const loginAsManager = () => {
    localStorage.setItem(
      "mockAdminUser",
      JSON.stringify({
        username: "manager",
        role: "manager",
        name: "Manager User",
        isLoggedIn: true,
      }),
    );

    toast({
      title: "Manager Login Successful",
      description: "Welcome back, Manager User!",
    });

    navigate("/admin/guest-session-management");
  };

  const loginAsViewer = () => {
    localStorage.setItem(
      "mockAdminUser",
      JSON.stringify({
        username: "viewer",
        role: "viewer",
        name: "Viewer User",
        isLoggedIn: true,
      }),
    );

    toast({
      title: "Viewer Login Successful",
      description: "Welcome back, Viewer User!",
    });

    navigate("/admin/guest-session-management");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Quick Login Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">User Login</h3>
          <p className="text-sm text-gray-500 mb-4">
            Login as a regular user to access the main application
          </p>
          <UserLoginButton className="w-full" />
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Admin Access</h3>
          <p className="text-sm text-gray-500 mb-4">
            Login to the admin dashboard with different roles
          </p>
          <div className="space-y-2">
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={loginAsAdmin}
            >
              <ShieldCheck className="h-4 w-4 mr-2" /> Login as Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={loginAsManager}
            >
              <ShieldCheck className="h-4 w-4 mr-2" /> Login as Manager
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={loginAsViewer}
            >
              <ShieldCheck className="h-4 w-4 mr-2" /> Login as Viewer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
