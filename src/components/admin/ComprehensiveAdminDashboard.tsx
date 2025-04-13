import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Settings,
  Paintbrush,
  Database,
  FileText,
  Bot,
  Globe,
  AlertCircle,
  MessageSquare,
  Edit,
  Check,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardOverview from "@/components/admin/DashboardOverview";
import AIModelSettings from "@/components/admin/AIModelSettings";
import UserManagement from "@/components/admin/UserManagement";
import AuditLogs from "@/components/admin/AuditLogs";
import { Button } from "@/components/ui/button";

const ComprehensiveAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto py-6 space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-secondary">
            {activeTab === "dashboard" && "Dashboard Overview"}
            {activeTab === "ai-models" && "AI Model Configuration"}
            {activeTab === "response-formats" && "Response Formats"}
            {activeTab === "widget-config" && "Widget Configuration"}
            {activeTab === "scraping" && "Web Scraping System"}
            {activeTab === "system-settings" && "System Settings"}
            {activeTab === "status-tracking" && "Status Tracking"}
            {activeTab === "user-management" && "User Management"}
            {activeTab === "audit-logs" && "Audit Logs"}
          </h1>
          <p className="text-brand-muted">
            {activeTab === "dashboard" &&
              "Key metrics and performance indicators"}
            {activeTab === "ai-models" &&
              "Configure AI models and knowledge base"}
            {activeTab === "response-formats" &&
              "Design and manage response templates"}
            {activeTab === "widget-config" &&
              "Customize appearance and messaging"}
            {activeTab === "scraping" && "Configure and run web scraping tasks"}
            {activeTab === "system-settings" &&
              "Configure global system settings"}
            {activeTab === "status-tracking" &&
              "Monitor and change component status"}
            {activeTab === "user-management" && "Manage users and their roles"}
            {activeTab === "audit-logs" && "View system activity logs"}
          </p>
        </div>
      </div>

      <Card className="bg-white rounded-lg shadow-sm border-brand-primary/10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <div className="container flex overflow-auto">
              <TabsList className="h-14 bg-transparent p-0">
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="ai-models"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  AI Models
                </TabsTrigger>
                <TabsTrigger
                  value="response-formats"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Response Formats
                </TabsTrigger>
                <TabsTrigger
                  value="widget-config"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <Paintbrush className="h-4 w-4 mr-2" />
                  Widget Config
                </TabsTrigger>
                <TabsTrigger
                  value="scraping"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Scraping System
                </TabsTrigger>
                <TabsTrigger
                  value="system-settings"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </TabsTrigger>
                <TabsTrigger
                  value="status-tracking"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Status Tracking
                </TabsTrigger>
                <TabsTrigger
                  value="user-management"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <Users className="h-4 w-4 mr-2" />
                  User Management
                </TabsTrigger>
                <TabsTrigger
                  value="audit-logs"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Audit Logs
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <CardContent className="p-6">
            <TabsContent value="dashboard" className="mt-0">
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardOverview />
              </motion.div>
            </TabsContent>

            <TabsContent value="ai-models" className="mt-0">
              <motion.div
                key="ai-models"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <AIModelSettings />
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="response-formats" className="mt-0">
              <motion.div
                key="response-formats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <Card className="bg-white border-brand-primary/10">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">
                        Response Format Templates
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            name: "Standard Response",
                            description:
                              "Basic response with greeting and answer",
                            template:
                              "Hello {{user.name}},\n\n{{response.content}}\n\nIs there anything else I can help with?",
                            isActive: true,
                          },
                          {
                            name: "Detailed Response",
                            description: "Comprehensive response with sources",
                            template:
                              "Hello {{user.name}},\n\n{{response.content}}\n\nSources: {{response.sources}}\n\nPlease let me know if you need more information.",
                            isActive: false,
                          },
                          {
                            name: "Concise Response",
                            description: "Brief, to-the-point answers",
                            template: "{{response.content}}",
                            isActive: false,
                          },
                          {
                            name: "Step-by-Step Guide",
                            description: "Instructions in numbered steps",
                            template:
                              "Here's how to {{query.topic}}:\n\n{{response.steps}}",
                            isActive: false,
                          },
                        ].map((template, index) => (
                          <Card key={index} className="border overflow-hidden">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <CardTitle className="text-base">
                                    {template.name}
                                  </CardTitle>
                                  <CardDescription>
                                    {template.description}
                                  </CardDescription>
                                </div>
                                <Badge
                                  variant={
                                    template.isActive ? "default" : "outline"
                                  }
                                  className={
                                    template.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {template.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="bg-gray-50 p-2 rounded text-sm font-mono whitespace-pre-line">
                                {template.template}
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-2 pt-2 border-t">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              {!template.isActive && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Set as Active
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="widget-config" className="mt-0">
              <motion.div
                key="widget-config"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center text-brand-muted py-8">
                  Widget Configuration content will be implemented here
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="scraping" className="mt-0">
              <motion.div
                key="scraping"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center text-brand-muted py-8">
                  Scraping System content will be implemented here
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="system-settings" className="mt-0">
              <motion.div
                key="system-settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center text-brand-muted py-8">
                  System Settings content will be implemented here
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="status-tracking" className="mt-0">
              <motion.div
                key="status-tracking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center text-brand-muted py-8">
                  Status Tracking content will be implemented here
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="user-management" className="mt-0">
              <motion.div
                key="user-management"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <UserManagement />
              </motion.div>
            </TabsContent>

            <TabsContent value="audit-logs" className="mt-0">
              <motion.div
                key="audit-logs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AuditLogs />
              </motion.div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default ComprehensiveAdminDashboard;
