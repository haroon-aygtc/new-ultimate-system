import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { User, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const LoginPage: React.FC = () => {
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

  const loginAsUser = () => {
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

    navigate("/");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            Login to Guest Session Management System
          </CardTitle>
          <CardDescription>
            Click any button below to instantly log in with different roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">User Login</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Login as a regular user to access the main application
                </p>
                <Button
                  onClick={loginAsUser}
                  className="w-full flex items-center justify-center"
                  variant="outline"
                >
                  <User className="mr-2 h-4 w-4" /> Login as User
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Admin Access</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Login to the admin dashboard with different roles
                </p>
                <div className="space-y-3">
                  <Button
                    variant="default"
                    className="w-full flex items-center justify-center"
                    onClick={loginAsAdmin}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" /> Login as Admin
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    onClick={loginAsManager}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" /> Login as Manager
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center"
                    onClick={loginAsViewer}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" /> Login as Viewer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
