import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import GuestSessionTable from "@/components/admin/GuestSessionTable";
import SessionAnalytics from "@/components/admin/SessionAnalytics";
import DashboardOverview from "@/components/admin/DashboardOverview";
import BrandingSettings from "@/components/admin/BrandingSettings";
import AIModelSettings from "@/components/admin/AIModelSettings";
import ScrapingSystem from "@/components/admin/ScrapingSystem";
import AuditLogs from "@/components/admin/AuditLogs";

const GuestSessionManagement = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [timeRange, setTimeRange] = useState("week");

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-secondary">
              Admin Dashboard
            </h1>
            <p className="text-brand-muted">
              Manage guest sessions and system settings
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b">
              <div className="container flex overflow-auto">
                <TabsList className="h-12 bg-transparent p-0">
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

            <div className="p-4 md:p-6">
              <TabsContent value="dashboard" className="mt-0">
                <DashboardOverview />
              </TabsContent>

              <TabsContent value="sessions" className="mt-0">
                <GuestSessionTable />
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <SessionAnalytics
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                />
              </TabsContent>

              <TabsContent value="ai-settings" className="mt-0">
                <AIModelSettings />
              </TabsContent>

              <TabsContent value="branding" className="mt-0">
                <BrandingSettings />
              </TabsContent>

              <TabsContent value="scraping" className="mt-0">
                <ScrapingSystem />
              </TabsContent>

              <TabsContent value="logs" className="mt-0">
                <AuditLogs />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default GuestSessionManagement;
