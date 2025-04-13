import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Lock, User, LogIn } from "lucide-react";

interface MockUser {
  username: string;
  password: string;
  role: string;
  name: string;
}

const mockUsers: MockUser[] = [
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Admin User",
  },
  {
    username: "manager",
    password: "manager123",
    role: "manager",
    name: "Manager User",
  },
  {
    username: "viewer",
    password: "viewer123",
    role: "viewer",
    name: "Viewer User",
  },
];

const MockAdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password,
      );

      if (user) {
        // Store user info in localStorage
        localStorage.setItem(
          "mockAdminUser",
          JSON.stringify({
            username: user.username,
            role: user.role,
            name: user.name,
            isLoggedIn: true,
          }),
        );

        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
          variant: "default",
        });

        // Redirect to admin dashboard
        navigate("/admin/guest-session-management");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 border-t pt-4">
            <p className="text-sm text-gray-500 text-center">Test Accounts:</p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500">
              {mockUsers.map((user) => (
                <div key={user.username} className="text-center">
                  <p className="font-semibold">{user.role}</p>
                  <p>{user.username}</p>
                  <p>{user.password}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-gray-500">
            This is a mock login for testing purposes only
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MockAdminLogin;
