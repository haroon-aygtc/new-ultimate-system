import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

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
}

const LoginButton: React.FC<LoginButtonProps> = ({
  variant = "outline",
  size = "sm",
  className = "",
}) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLoginClick}
    >
      <LogIn className="h-4 w-4 mr-2" />
      Login
    </Button>
  );
};

export default LoginButton;
