import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ComprehensiveAdminDashboard from "@/components/admin/ComprehensiveAdminDashboard";
import { motion } from "framer-motion";

const GuestSessionManagement = () => {
  return (
    <Layout showSidebar={true}>
      <ComprehensiveAdminDashboard />
    </Layout>
  );
};

export default GuestSessionManagement;
