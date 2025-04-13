import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const QuickAdminLogin: React.FC = () => {
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

  return (
    <Button
      onClick={loginAsAdmin}
      className="fixed top-4 right-4 z-50"
      variant="destructive"
    >
      <ShieldCheck className="mr-2 h-4 w-4" /> Admin Login
    </Button>
  );
};

export default QuickAdminLogin;
