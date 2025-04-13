import React from "react";
import LoginPage from "@/pages/LoginPage";
import { Toaster } from "@/components/ui/toaster";

export default function LoginPageStoryboard() {
  return (
    <div className="bg-white min-h-screen">
      <LoginPage />
      <Toaster />
    </div>
  );
}
