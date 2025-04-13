import React from "react";
import MockAdminLogin from "@/components/admin/MockAdminLogin";
import { Toaster } from "@/components/ui/toaster";

export default function MockAdminLoginStoryboard() {
  return (
    <div className="bg-white min-h-screen">
      <MockAdminLogin />
      <Toaster />
    </div>
  );
}
