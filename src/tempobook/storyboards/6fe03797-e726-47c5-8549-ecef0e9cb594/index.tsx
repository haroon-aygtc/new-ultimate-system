import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Database,
  LayoutDashboard,
  MessageSquare,
  Code,
  Settings,
  Paintbrush,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContextRulesStoryboard() {
  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-secondary">
              Admin Dashboard
            </h1>
            <p className="text-brand-muted">
              Define and manage context rules to control AI responses
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Input placeholder="Search..." className="w-64 pl-8" />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Button variant="outline" className="flex items-center">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </Button>
            <Button variant="outline" className="flex items-center">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Button>
            <div className="flex items-center space-x-2 ml-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                AU
              </div>
              <span className="text-sm font-medium">Admin User</span>
            </div>
          </div>
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
            Settings
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-brand-secondary">
              Context Rules
            </h2>
            <p className="text-brand-muted">
              Define and manage context rules to control AI responses
            </p>
          </div>
          <Button className="bg-brand-primary text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Rule
          </Button>
        </div>

        <Tabs defaultValue="rules-list">
          <TabsList className="mb-4">
            <TabsTrigger value="rules-list">Rules List</TabsTrigger>
            <TabsTrigger value="create-rule">Create Rule</TabsTrigger>
          </TabsList>

          <TabsContent value="create-rule" className="space-y-4">
            <Card className="bg-white border-brand-primary/10">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-brand-secondary">
                  Create Context Rule
                </CardTitle>
                <CardDescription className="text-brand-muted">
                  Define a new context rule to control AI responses
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rule Name</label>
                    <Input placeholder="E.g., UAE Government Information" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Context Type</label>
                    <Select defaultValue="business">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe the purpose of this context rule"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Keywords</label>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <Input placeholder="Add keywords that trigger this rule" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["product", "pricing", "features", "specifications"].map(
                      (keyword, i) => (
                        <div
                          key={i}
                          className="bg-brand-light text-brand-secondary px-2 py-1 rounded-full text-xs flex items-center"
                        >
                          {keyword}
                          <button className="ml-1 text-brand-muted hover:text-brand-secondary">
                            ×
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Excluded Topics
                    </label>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <Input placeholder="Topics to exclude from responses" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Response Filters
                    </label>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <Input placeholder="Add filters for responses" />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="kb-integration" />
                  <label
                    htmlFor="kb-integration"
                    className="text-sm font-medium flex items-center"
                  >
                    <Database className="h-4 w-4 mr-2 text-brand-muted" />
                    Knowledge Base Integration
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="rule-active" defaultChecked />
                  <label htmlFor="rule-active" className="text-sm font-medium">
                    Active
                  </label>
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-brand-primary text-white">Save</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules-list" className="space-y-4">
            <div className="border rounded-md divide-y">
              {[
                {
                  name: "Product Information",
                  description:
                    "Provides accurate product details and specifications",
                  type: "Business",
                  status: "Active",
                },
                {
                  name: "Support Queries",
                  description: "Handles customer support and troubleshooting",
                  type: "Support",
                  status: "Active",
                },
                {
                  name: "Pricing Information",
                  description:
                    "Provides pricing details and discount information",
                  type: "Business",
                  status: "Inactive",
                },
              ].map((rule, index) => (
                <div
                  key={index}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{rule.name}</h3>
                    <p className="text-sm text-brand-muted">
                      {rule.description}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs bg-brand-light px-2 py-0.5 rounded">
                        {rule.type}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${rule.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {rule.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
