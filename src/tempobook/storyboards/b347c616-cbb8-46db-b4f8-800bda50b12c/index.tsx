import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  MessageSquare,
  Code,
  Settings,
  Paintbrush,
  FileText,
  Database,
  Users,
  Bot,
} from "lucide-react";

export default function AdminDashboardStoryboard() {
  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-secondary">
            Admin Dashboard
          </h1>
          <p className="text-brand-muted">
            Key metrics and performance indicators
          </p>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <Button
            variant="ghost"
            className="flex items-center justify-center min-w-[120px] bg-white border rounded-md px-4 py-2"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-center min-w-[120px] bg-white border rounded-md px-4 py-2"
          >
            <Paintbrush className="h-4 w-4 mr-2" />
            Widget Config
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-center min-w-[120px] bg-white border border-brand-primary rounded-md px-4 py-2 text-brand-primary"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Context Rules
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-center min-w-[120px] bg-white border rounded-md px-4 py-2"
          >
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-center min-w-[120px] bg-white border rounded-md px-4 py-2"
          >
            <Settings className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        {/* Secondary Navigation */}
        <div className="bg-gray-900 text-white p-2 rounded-md flex space-x-2 overflow-x-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 flex items-center justify-center"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 flex items-center justify-center"
          >
            <Paintbrush className="h-4 w-4 mr-2" />
            Widget Config
          </Button>
          <Button
            variant="ghost"
            className="bg-white/20 text-white flex items-center justify-center"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Context Rules
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 flex items-center justify-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 flex items-center justify-center"
          >
            <Database className="h-4 w-4 mr-2" />
            Knowledge Base
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 flex items-center justify-center"
          >
            <Code className="h-4 w-4 mr-2" />
            Embed Code
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 flex items-center justify-center"
          >
            <Settings className="h-4 w-4 mr-2" />
            AI Logs
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 flex items-center justify-center"
          >
            <Settings className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 flex items-center justify-center"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 flex items-center justify-center"
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 flex items-center justify-center"
          >
            <Bot className="h-4 w-4 mr-2" />
            AI Configuration
          </Button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="text-sm text-brand-muted">
                Total Conversations
              </div>
              <div className="text-3xl font-bold mt-2 text-brand-secondary">
                Loading...
              </div>
              <div className="text-xs mt-1 text-green-600">
                Fetching data...
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="text-sm text-brand-muted">Active Users</div>
              <div className="text-3xl font-bold mt-2 text-brand-secondary">
                Loading...
              </div>
              <div className="text-xs mt-1 text-green-600">
                Fetching data...
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="text-sm text-brand-muted">Response Rate</div>
              <div className="text-3xl font-bold mt-2 text-brand-secondary">
                Loading...
              </div>
              <div className="text-xs mt-1 text-green-600">
                Fetching data...
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="text-sm text-brand-muted">Avg. Response Time</div>
              <div className="text-3xl font-bold mt-2 text-brand-secondary">
                Loading...
              </div>
              <div className="text-xs mt-1 text-green-600">
                Fetching data...
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-brand-light/20 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-brand-light/50 flex items-center justify-center mb-2 text-brand-primary">
                    <Paintbrush className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-medium">Configure Widget</div>
                </div>
                <div className="border rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-brand-light/20 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-brand-light/50 flex items-center justify-center mb-2 text-brand-primary">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-medium">Edit Context Rules</div>
                </div>
                <div className="border rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-brand-light/20 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-brand-light/50 flex items-center justify-center mb-2 text-brand-primary">
                    <Code className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-medium">Get Embed Code</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-sm">API Status</div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-gray-300 mr-2"></div>
                    <div className="text-sm text-gray-500">Checking...</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">Gemini API</div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-gray-300 mr-2"></div>
                    <div className="text-sm text-gray-500">Checking...</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">Hugging Face API</div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-gray-300 mr-2"></div>
                    <div className="text-sm text-gray-500">Checking...</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">Database</div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-gray-300 mr-2"></div>
                    <div className="text-sm text-gray-500">Checking...</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
