import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import GuestSessionTable from "@/components/admin/GuestSessionTable";
import SessionAnalytics from "@/components/admin/SessionAnalytics";
import ComprehensiveAdminDashboard from "@/components/admin/ComprehensiveAdminDashboard";
import UserManagement from "@/components/admin/UserManagement";
import EmbedCodeGenerator from "@/components/admin/EmbedCodeGenerator";
import BrandingSettings from "@/components/admin/BrandingSettings";
import ScrapingSystem from "@/components/admin/ScrapingSystem";
import AIModelSettings from "@/components/admin/AIModelSettings";
import KnowledgeBaseManager from "@/components/admin/KnowledgeBaseManager";
import PromptManager from "@/components/admin/PromptManager";
import AuditLogs from "@/components/admin/AuditLogs";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

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
    <AdminAuthGuard>
      <Layout showSidebar={true}>
        <div className="min-h-screen bg-gray-50">
          <div className="p-8">
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
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="ai-settings">AI Models</TabsTrigger>
                <TabsTrigger value="prompts">Prompts & Follow-ups</TabsTrigger>
                <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
                <TabsTrigger value="branding">
                  Branding & Response Format
                </TabsTrigger>
                <TabsTrigger value="user-management">
                  User Management
                </TabsTrigger>
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
                    <AIModelSettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prompts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Prompt Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PromptManager />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="knowledge-base" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Knowledge Base</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <KnowledgeBaseManager />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scraping" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Web Scraping System</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrapingSystem />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="branding" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Branding Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BrandingSettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="user-management" className="space-y-4">
                <UserManagement />
              </TabsContent>

              <TabsContent value="embed-code" className="space-y-4">
                <EmbedCodeGenerator />
              </TabsContent>

              <TabsContent value="audit-logs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Audit Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AuditLogs />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="system-settings" className="space-y-4">
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
    </AdminAuthGuard>
  );
};

export default GuestSessionManagement;
