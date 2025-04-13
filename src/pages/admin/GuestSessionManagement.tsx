import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import Sidebar from "@/components/admin/Sidebar";
import GuestSessionTable from "@/components/admin/GuestSessionTable";
import SessionAnalytics from "@/components/admin/SessionAnalytics";
import ComprehensiveAdminDashboard from "@/components/admin/ComprehensiveAdminDashboard";
import UserManagement from "@/components/admin/UserManagement";
import EmbedCodeGenerator from "@/components/admin/EmbedCodeGenerator";

const GuestSessionManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/guest-session-management?tab=${value}`);
  };

  return (
    <Layout showSidebar={true}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage guest sessions, AI models, and system settings
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>

          <Tabs
            defaultValue="dashboard"
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="sessions">Guest Sessions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="ai-settings">AI Settings</TabsTrigger>
              <TabsTrigger value="user-management">Users</TabsTrigger>
              <TabsTrigger value="embed-code">Embed Code</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <ComprehensiveAdminDashboard />
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Guest Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <GuestSessionTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <SessionAnalytics />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Configure AI models, prompts, and knowledge base.</p>
                  <Separator className="my-4" />
                  <p className="text-sm text-muted-foreground">
                    This section is under development.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="user-management" className="space-y-4">
              <UserManagement />
            </TabsContent>

            <TabsContent value="embed-code" className="space-y-4">
              <EmbedCodeGenerator />
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Configure system settings, branding, and user permissions.
                  </p>
                  <Separator className="my-4" />
                  <p className="text-sm text-muted-foreground">
                    This section is under development.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default GuestSessionManagement;
