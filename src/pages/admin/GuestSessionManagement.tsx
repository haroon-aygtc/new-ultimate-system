import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import GuestSessionTable from "@/components/admin/GuestSessionTable";
import SessionAnalytics from "@/components/admin/SessionAnalytics";
import DashboardOverview from "@/components/admin/DashboardOverview";
import BrandingSettings from "@/components/admin/BrandingSettings";
import AIModelSettings from "@/components/admin/AIModelSettings";
import ScrapingSystem from "@/components/admin/ScrapingSystem";
import AuditLogs from "@/components/admin/AuditLogs";
import { motion } from "framer-motion";

const GuestSessionManagement = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [timeRange, setTimeRange] = useState("week");

  return (
    <Layout showSidebar={true}>
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
              {activeTab === "sessions" && "Guest Sessions"}
              {activeTab === "analytics" && "Analytics & Reporting"}
              {activeTab === "ai-settings" && "AI Model Configuration"}
              {activeTab === "branding" && "Branding & Customization"}
              {activeTab === "scraping" && "Web Scraping System"}
              {activeTab === "logs" && "Audit Logs & Security"}
            </h1>
            <p className="text-brand-muted">
              {activeTab === "dashboard" &&
                "Key metrics and performance indicators"}
              {activeTab === "sessions" &&
                "Manage and monitor guest interactions"}
              {activeTab === "analytics" &&
                "Detailed insights and data visualization"}
              {activeTab === "ai-settings" &&
                "Configure AI models and knowledge base"}
              {activeTab === "branding" && "Customize appearance and messaging"}
              {activeTab === "scraping" &&
                "Configure and run web scraping tasks"}
              {activeTab === "logs" &&
                "System activity and security monitoring"}
            </p>
          </div>
        </div>

        <Card className="bg-white rounded-lg shadow-sm border-brand-primary/10">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b">
              <div className="container flex overflow-auto">
                <TabsList className="h-14 bg-transparent p-0">
                  <TabsTrigger
                    value="dashboard"
                    className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                  >
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger
                    value="sessions"
                    className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                  >
                    Guest Sessions
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                  >
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai-settings"
                    className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                  >
                    AI Settings
                  </TabsTrigger>
                  <TabsTrigger
                    value="branding"
                    className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                  >
                    Branding
                  </TabsTrigger>
                  <TabsTrigger
                    value="scraping"
                    className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                  >
                    Scraping
                  </TabsTrigger>
                  <TabsTrigger
                    value="logs"
                    className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                  >
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

              <TabsContent value="sessions" className="mt-0">
                <motion.div
                  key="sessions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GuestSessionTable />
                </motion.div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SessionAnalytics
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="ai-settings" className="mt-0">
                <motion.div
                  key="ai-settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AIModelSettings />
                </motion.div>
              </TabsContent>

              <TabsContent value="branding" className="mt-0">
                <motion.div
                  key="branding"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BrandingSettings />
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
                  <ScrapingSystem />
                </motion.div>
              </TabsContent>

              <TabsContent value="logs" className="mt-0">
                <motion.div
                  key="logs"
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
    </Layout>
  );
};

export default GuestSessionManagement;
