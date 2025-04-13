import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import {
  LayoutDashboard,
  Settings,
  Paintbrush,
  Database,
  FileText,
  Bot,
  Globe,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Save,
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  Code,
  FileText as FileTextIcon,
  Eye,
  Play,
  Info,
  Clock,
  Shield,
  Repeat,
  ArrowRight,
  MessageSquare,
  Users,
  Palette,
  Layout as LayoutIcon,
} from "lucide-react";

export default function ComprehensiveAdminDashboard() {
  // State for active tab
  const [activeTab, setActiveTab] = React.useState("dashboard");

  // State for branding settings
  const [primaryColor, setPrimaryColor] = React.useState("#4A6FA5");
  const [secondaryColor, setSecondaryColor] = React.useState("#2C3E50");
  const [accentColor, setAccentColor] = React.useState("#16A085");
  const [logoUrl, setLogoUrl] = React.useState(
    "https://api.dicebear.com/7.x/initials/svg?seed=GA&backgroundColor=4A6FA5&textColor=ffffff",
  );
  const [brandName, setBrandName] = React.useState("GuestApp");

  // State for widget settings
  const [widgetTitle, setWidgetTitle] = React.useState("Chat with us");
  const [welcomeMessage, setWelcomeMessage] = React.useState(
    "Hello! How can we assist you today?",
  );
  const [cornerRadius, setCornerRadius] = React.useState(8);
  const [showAvatar, setShowAvatar] = React.useState(true);

  // State for AI model settings
  const [selectedModel, setSelectedModel] = React.useState("gpt-4");

  // State for scraping settings
  const [selectorType, setSelectorType] = React.useState("css");
  const [rateLimit, setRateLimit] = React.useState(500);
  const [maxRetries, setMaxRetries] = React.useState(3);
  const [skipHeaders, setSkipHeaders] = React.useState(true);
  const [skipFooters, setSkipFooters] = React.useState(true);
  const [skipImages, setSkipImages] = React.useState(true);
  const [exportFormat, setExportFormat] = React.useState("json");

  // State for unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Handle save changes
  const handleSaveChanges = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setHasUnsavedChanges(false);
      setIsSaving(false);
    }, 1000);
  };

  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-secondary">
              Admin Dashboard
            </h1>
            <p className="text-brand-muted">
              Manage all aspects of your guest session system
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
            <div className="flex items-center space-x-2 ml-2">
              <div className="h-8 w-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
                AU
              </div>
              <span className="text-sm font-medium">Admin User</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b aspect-square aspect-auto">
            <div className="flex overflow-auto">
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
              </TabsList>
            </div>
          </div>

          {/* Dashboard Overview Tab */}
          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Guest Sessions</CardTitle>
                  <CardDescription>Active user sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-brand-primary">
                    247
                  </div>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    <span>12% increase</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    View Sessions
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">AI Interactions</CardTitle>
                  <CardDescription>Total AI responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-brand-primary">
                    1,842
                  </div>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    <span>8% increase</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    <Bot className="h-4 w-4 mr-2" />
                    View Interactions
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">System Status</CardTitle>
                  <CardDescription>All systems operational</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">
                      AI Models: Active
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">
                      Knowledge Base: Active
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm font-medium">
                      Scraping System: Static
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    View Status
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Sessions</CardTitle>
                  <CardDescription>Latest guest interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "John Doe",
                        email: "john@example.com",
                        time: "10 minutes ago",
                        status: "Active",
                      },
                      {
                        name: "Jane Smith",
                        email: "jane@example.com",
                        time: "25 minutes ago",
                        status: "Active",
                      },
                      {
                        name: "Robert Johnson",
                        email: "robert@example.com",
                        time: "1 hour ago",
                        status: "Inactive",
                      },
                      {
                        name: "Emily Davis",
                        email: "emily@example.com",
                        time: "2 hours ago",
                        status: "Inactive",
                      },
                    ].map((session, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-md"
                      >
                        <div>
                          <p className="font-medium">{session.name}</p>
                          <p className="text-sm text-brand-muted">
                            {session.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="outline"
                            className={
                              session.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {session.status}
                          </Badge>
                          <p className="text-xs text-brand-muted mt-1">
                            {session.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Sessions
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="flex flex-col items-center justify-center h-24 bg-brand-light text-brand-primary hover:bg-brand-light/80">
                      <Bot className="h-8 w-8 mb-2" />
                      <span>Configure AI</span>
                    </Button>
                    <Button className="flex flex-col items-center justify-center h-24 bg-brand-light text-brand-primary hover:bg-brand-light/80">
                      <Paintbrush className="h-8 w-8 mb-2" />
                      <span>Edit Widget</span>
                    </Button>
                    <Button className="flex flex-col items-center justify-center h-24 bg-brand-light text-brand-primary hover:bg-brand-light/80">
                      <Globe className="h-8 w-8 mb-2" />
                      <span>Run Scraper</span>
                    </Button>
                    <Button className="flex flex-col items-center justify-center h-24 bg-brand-light text-brand-primary hover:bg-brand-light/80">
                      <Database className="h-8 w-8 mb-2" />
                      <span>Knowledge Base</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Models Tab */}
          <TabsContent value="ai-models" className="mt-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Manage AI Models</h2>
              <Button className="bg-brand-primary text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add New Model
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Model Card 1 */}
              <Card className="border border-brand-primary shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base flex items-center">
                      GPT-4
                      <Badge className="ml-2 bg-brand-accent text-white text-xs">
                        Active
                      </Badge>
                    </CardTitle>
                    <Select defaultValue="Active">
                      <SelectTrigger className="w-[110px] h-7 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="Active"
                          className="text-brand-accent"
                        >
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-brand-accent mr-2"></span>
                            Active
                          </span>
                        </SelectItem>
                        <SelectItem
                          value="Inactive"
                          className="text-brand-muted"
                        >
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-brand-muted mr-2"></span>
                            Inactive
                          </span>
                        </SelectItem>
                        <SelectItem value="Static" className="text-yellow-600">
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></span>
                            Static
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <CardDescription className="text-xs">
                    Most powerful model for complex tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-xs">
                      <span className="text-brand-muted">Temperature:</span> 0.7
                    </div>
                    <div className="text-xs">
                      <span className="text-brand-muted">Max Tokens:</span> 2048
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-2">
                      <Switch id="gpt4-switch" checked={true} />
                      <Label htmlFor="gpt4-switch" className="text-xs">
                        Selected
                      </Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 flex items-center"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Model Card 2 */}
              <Card className="border hover:border-brand-primary/50">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">GPT-3.5 Turbo</CardTitle>
                    <Select defaultValue="Inactive">
                      <SelectTrigger className="w-[110px] h-7 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="Active"
                          className="text-brand-accent"
                        >
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-brand-accent mr-2"></span>
                            Active
                          </span>
                        </SelectItem>
                        <SelectItem
                          value="Inactive"
                          className="text-brand-muted"
                        >
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-brand-muted mr-2"></span>
                            Inactive
                          </span>
                        </SelectItem>
                        <SelectItem value="Static" className="text-yellow-600">
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></span>
                            Static
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <CardDescription className="text-xs">
                    Fast and cost-effective for most use cases
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-xs">
                      <span className="text-brand-muted">Temperature:</span> 0.8
                    </div>
                    <div className="text-xs">
                      <span className="text-brand-muted">Max Tokens:</span> 1024
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-2">
                      <Switch id="gpt35-switch" checked={false} />
                      <Label htmlFor="gpt35-switch" className="text-xs">
                        Select
                      </Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 flex items-center"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Add New Model Card */}
              <Card className="border border-dashed border-brand-muted/50 flex flex-col items-center justify-center p-6 hover:border-brand-primary/50 cursor-pointer">
                <Plus className="h-12 w-12 text-brand-muted/50 mb-2" />
                <p className="text-brand-muted text-sm font-medium">
                  Add New AI Model
                </p>
                <p className="text-xs text-brand-muted text-center mt-1">
                  Configure a new AI model for your chat system
                </p>
              </Card>
            </div>

            {/* Model Configuration Form */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Add New AI Model</CardTitle>
                <CardDescription>
                  Configure the parameters for a new AI model
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model-name">Model Name</Label>
                    <Input
                      id="model-name"
                      placeholder="e.g., GPT-4, Claude, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model-id">Model ID</Label>
                    <Input
                      id="model-id"
                      placeholder="e.g., gpt-4, claude-2, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model-description">Description</Label>
                  <Textarea
                    id="model-description"
                    placeholder="Brief description of the model's capabilities and use cases"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model-temperature">Temperature</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="model-temperature"
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value="0.7"
                        className="w-full"
                      />
                      <span className="text-sm w-8">0.7</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model-max-tokens">Max Tokens</Label>
                    <Input id="model-max-tokens" type="number" value="1024" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model-status">Status</Label>
                    <Select defaultValue="Active">
                      <SelectTrigger id="model-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Static">Static</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-brand-primary text-white">
                  <Save className="mr-2 h-4 w-4" />
                  Save Model
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Response Formats Tab */}
          <TabsContent value="response-formats" className="mt-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Design Response Formats</h2>
              <Button className="bg-brand-primary text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Response Templates */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Response Templates</h3>
                <div className="border rounded-md divide-y">
                  {[
                    {
                      name: "Customer Support",
                      description: "Helpful and friendly support agent",
                      status: "Active",
                    },
                    {
                      name: "Sales Assistant",
                      description: "Persuasive product expert",
                      status: "Inactive",
                    },
                    {
                      name: "Technical Support",
                      description: "Detailed technical problem solver",
                      status: "Inactive",
                    },
                    {
                      name: "Onboarding Guide",
                      description: "Step-by-step guidance for new users",
                      status: "Active",
                    },
                  ].map((template, index) => (
                    <div key={index} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-brand-muted">
                            {template.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className={
                              template.status === "Active"
                                ? "bg-brand-accent/20 text-brand-accent"
                                : "bg-brand-muted/20 text-brand-muted"
                            }
                          >
                            {template.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Editor */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Edit Response Format</h3>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">
                        Customer Support
                      </CardTitle>
                      <Select defaultValue="Active">
                        <SelectTrigger className="w-[110px] h-7 text-xs">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Static">Static</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input id="template-name" value="Customer Support" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template-description">Description</Label>
                      <Input
                        id="template-description"
                        value="Helpful and friendly support agent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template-content">Template Content</Label>
                      <Textarea
                        id="template-content"
                        className="min-h-[200px] font-mono text-sm"
                        value={`Hello {{user.name}},\n\nThank you for reaching out to our support team. I'm here to help you with your question about {{topic}}.\n\n{{response_content}}\n\nIs there anything else I can assist you with today?\n\nBest regards,\nThe {{company_name}} Support Team`}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                    <Button className="bg-brand-primary text-white">
                      <Save className="mr-2 h-4 w-4" />
                      Save Template
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Preview Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Preview Response</CardTitle>
                <CardDescription>
                  See how your template will look with sample data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 bg-brand-light/20">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <p className="font-medium mb-2">Hello John Doe,</p>
                      <p className="mb-2">
                        Thank you for reaching out to our support team. I'm here
                        to help you with your question about account settings.
                      </p>
                      <p className="mb-2">
                        To update your account settings, please follow these
                        steps:
                      </p>
                      <ol className="list-decimal pl-5 mb-2">
                        <li>Log in to your account</li>
                        <li>
                          Click on your profile icon in the top right corner
                        </li>
                        <li>Select "Settings" from the dropdown menu</li>
                        <li>Make your desired changes</li>
                        <li>Click "Save" to apply the changes</li>
                      </ol>
                      <p className="mb-2">
                        Is there anything else I can assist you with today?
                      </p>
                      <p>
                        Best regards,
                        <br />
                        The GuestApp Support Team
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Widget Config Tab */}
          <TabsContent value="widget-config" className="mt-6 space-y-6">
            <Card className="bg-white border-brand-primary/10">
              <CardHeader>
                <CardTitle className="text-brand-secondary">
                  Widget Configuration
                </CardTitle>
                <CardDescription className="text-brand-muted">
                  Customize the appearance and behavior of your chat widget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="appearance">
                  <TabsList className="mb-4">
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="widget">Widget</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                  </TabsList>

                  <TabsContent value="appearance" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Logo</Label>
                          <div className="mt-2 flex items-center space-x-4">
                            <div className="h-20 w-20 rounded-md border flex items-center justify-center overflow-hidden bg-white">
                              <img
                                src={logoUrl}
                                alt="Brand logo"
                                className="max-h-full max-w-full"
                              />
                            </div>
                            <Button
                              variant="outline"
                              className="flex items-center"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Logo
                            </Button>
                          </div>
                          <p className="text-xs text-brand-muted mt-1">
                            Recommended size: 512x512px, PNG or SVG format
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="brand-name">Brand Name</Label>
                          <Input
                            id="brand-name"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="max-w-md"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">
                            Color Scheme
                          </Label>
                          <div className="grid grid-cols-1 gap-4 mt-2">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label
                                  htmlFor="primary-color"
                                  className="text-xs"
                                >
                                  Primary Color
                                </Label>
                                <span className="text-xs text-brand-muted">
                                  {primaryColor}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div
                                  className="h-6 w-6 rounded-md border"
                                  style={{ backgroundColor: primaryColor }}
                                ></div>
                                <Input
                                  id="primary-color"
                                  type="color"
                                  value={primaryColor}
                                  onChange={(e) =>
                                    setPrimaryColor(e.target.value)
                                  }
                                  className="w-full h-8"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label
                                  htmlFor="secondary-color"
                                  className="text-xs"
                                >
                                  Secondary Color
                                </Label>
                                <span className="text-xs text-brand-muted">
                                  {secondaryColor}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div
                                  className="h-6 w-6 rounded-md border"
                                  style={{ backgroundColor: secondaryColor }}
                                ></div>
                                <Input
                                  id="secondary-color"
                                  type="color"
                                  value={secondaryColor}
                                  onChange={(e) =>
                                    setSecondaryColor(e.target.value)
                                  }
                                  className="w-full h-8"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label
                                  htmlFor="accent-color"
                                  className="text-xs"
                                >
                                  Accent Color
                                </Label>
                                <span className="text-xs text-brand-muted">
                                  {accentColor}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div
                                  className="h-6 w-6 rounded-md border"
                                  style={{ backgroundColor: accentColor }}
                                ></div>
                                <Input
                                  id="accent-color"
                                  type="color"
                                  value={accentColor}
                                  onChange={(e) =>
                                    setAccentColor(e.target.value)
                                  }
                                  className="w-full h-8"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="widget" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="widget-title">Widget Title</Label>
                          <Input
                            id="widget-title"
                            value={widgetTitle}
                            onChange={(e) => setWidgetTitle(e.target.value)}
                            className="max-w-md"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="welcome-message">
                            Welcome Message
                          </Label>
                          <Textarea
                            id="welcome-message"
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
                            className="min-h-[80px] max-w-md"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Widget Appearance
                          </Label>
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <LayoutIcon className="h-4 w-4 text-brand-muted" />
                                <span className="text-sm">Rounded Corners</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="range"
                                  min="0"
                                  max="20"
                                  value={cornerRadius}
                                  onChange={(e) =>
                                    setCornerRadius(parseInt(e.target.value))
                                  }
                                  className="w-24"
                                />
                                <span className="text-xs w-6 text-brand-muted">
                                  {cornerRadius}px
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4 text-brand-muted" />
                                <span className="text-sm">Show Avatar</span>
                              </div>
                              <Switch
                                checked={showAvatar}
                                onCheckedChange={setShowAvatar}
                                id="show-avatar"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <Label className="text-sm font-medium">
                            Widget Preview
                          </Label>
                          <div className="mt-2 border rounded-lg overflow-hidden shadow-md">
                            <div
                              className="p-3 flex items-center justify-between"
                              style={{
                                backgroundColor: primaryColor,
                                borderTopLeftRadius: `${cornerRadius}px`,
                                borderTopRightRadius: `${cornerRadius}px`,
                              }}
                            >
                              <div className="flex items-center space-x-2">
                                {showAvatar && (
                                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">
                                    {brandName.substring(0, 2).toUpperCase()}
                                  </div>
                                )}
                                <span className="text-white font-medium">
                                  {widgetTitle}
                                </span>
                              </div>
                              <button className="text-white/80 hover:text-white">
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                            <div
                              className="bg-white p-3 h-40 flex flex-col justify-end"
                              style={{
                                borderBottomLeftRadius: `${cornerRadius}px`,
                                borderBottomRightRadius: `${cornerRadius}px`,
                              }}
                            >
                              <div
                                className="ml-1 mb-2 p-2 rounded-lg max-w-[80%] text-sm"
                                style={{
                                  backgroundColor: "#f0f0f0",
                                  color: secondaryColor,
                                }}
                              >
                                {welcomeMessage}
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                <Input
                                  placeholder="Type your message..."
                                  className="text-sm"
                                  disabled
                                />
                                <Button
                                  size="icon"
                                  className="h-8 w-8"
                                  style={{ backgroundColor: primaryColor }}
                                  disabled
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4 text-white"
                                  >
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="messages" className="space-y-4">
                    <div className="text-center text-brand-muted py-8">
                      Message settings would be displayed here
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                <Button variant="outline">Cancel</Button>
                <Button
                  className="bg-brand-primary text-white flex items-center"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Scraping System Tab */}
          <TabsContent value="scraping" className="mt-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Web Scraping System</h2>
              <Button className="bg-brand-primary text-white">
                <Play className="mr-2 h-4 w-4" />
                Run Scraper
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Scraping Configuration
                  </CardTitle>
                  <CardDescription>
                    Set up your web scraping parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url-input">Target URL</Label>
                    <Input id="url-input" placeholder="https://example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="selector-type">Selector Type</Label>
                    <Select
                      value={selectorType}
                      onValueChange={setSelectorType}
                    >
                      <SelectTrigger id="selector-type">
                        <SelectValue placeholder="Select selector type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="css">CSS</SelectItem>
                        <SelectItem value="xpath">XPath</SelectItem>
                        <SelectItem value="regex">RegEx</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="selector-input">Selector</Label>
                    <Input
                      id="selector-input"
                      placeholder=".article-content, //div[@class='content'], etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rate-limit">Rate Limit (ms)</Label>
                      <Input
                        id="rate-limit"
                        type="number"
                        value={rateLimit}
                        onChange={(e) => setRateLimit(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-retries">Max Retries</Label>
                      <Input
                        id="max-retries"
                        type="number"
                        value={maxRetries}
                        onChange={(e) => setMaxRetries(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export Options</CardTitle>
                  <CardDescription>
                    Configure how scraped data is exported
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Export Format</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "json", name: "JSON", icon: FileJson },
                        { id: "csv", name: "CSV", icon: FileSpreadsheet },
                        { id: "html", name: "HTML", icon: Code },
                        { id: "text", name: "Text", icon: FileTextIcon },
                      ].map((format) => {
                        const Icon = format.icon;
                        return (
                          <div
                            key={format.id}
                            className={`border rounded-md p-3 flex items-center space-x-2 cursor-pointer ${exportFormat === format.id ? "border-brand-primary bg-brand-light/30" : "hover:border-brand-muted/50"}`}
                            onClick={() => setExportFormat(format.id)}
                          >
                            <Icon
                              className={`h-5 w-5 ${exportFormat === format.id ? "text-brand-primary" : "text-brand-muted"}`}
                            />
                            <span
                              className={`${exportFormat === format.id ? "text-brand-primary" : ""}`}
                            >
                              {format.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filename">Filename</Label>
                    <Input id="filename" value="scrape-result" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">
                            Skip Headers & Footers
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-brand-muted cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">
                                  Automatically skip navigation, headers, and
                                  footers when scraping content
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Switch
                          checked={skipHeaders && skipFooters}
                          onCheckedChange={(checked) => {
                            setSkipHeaders(checked);
                            setSkipFooters(checked);
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Skip Images & Media</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-brand-muted cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">
                                  Exclude images, videos, and other media from
                                  scraping results
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Switch
                          checked={skipImages}
                          onCheckedChange={setSkipImages}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Visualization</CardTitle>
                <CardDescription>
                  Preview the data before exporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 bg-brand-light/20 h-[300px] overflow-auto">
                  <pre className="text-xs font-mono">{`{
  "results": {
    "title": "Example Domain",
    "description": "This domain is for use in illustrative examples in documents.",
    "content": [
      "This domain is for use in illustrative examples in documents.",
      "You may use this domain in literature without prior coordination or asking for permission."
    ]
  },
  "metadata": {
    "url": "https://example.com",
    "scrapedAt": "2023-10-15T14:30:45.123Z",
    "totalUrls": 15,
    "successful": 12,
    "failed": 3,
    "totalTime": "2.5s"
  }
}`}</pre>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button className="bg-brand-primary text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="system-settings" className="mt-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">System Settings</h2>
              <Button className="bg-brand-primary text-white">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Management</CardTitle>
                  <CardDescription>
                    Manage admin users and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-md divide-y">
                    {[
                      {
                        name: "Admin User",
                        email: "admin@example.com",
                        role: "Admin",
                      },
                      {
                        name: "Support Agent",
                        email: "support@example.com",
                        role: "Agent",
                      },
                      {
                        name: "Content Manager",
                        email: "content@example.com",
                        role: "Editor",
                      },
                    ].map((user, index) => (
                      <div
                        key={index}
                        className="p-3 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-brand-muted">
                            {user.email}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{user.role}</Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </CardContent>
              </Card>

              {/* System Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Preferences</CardTitle>
                  <CardDescription>
                    Configure global system settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Session Timeout</p>
                        <p className="text-sm text-brand-muted">
                          Inactive session expiry time
                        </p>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 min</SelectItem>
                          <SelectItem value="30">30 min</SelectItem>
                          <SelectItem value="60">60 min</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Debug Mode</p>
                        <p className="text-sm text-brand-muted">
                          Enable detailed logging
                        </p>
                      </div>
                      <Switch id="debug-mode" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Maintenance Mode</p>
                        <p className="text-sm text-brand-muted">
                          Temporarily disable public access
                        </p>
                      </div>
                      <Switch id="maintenance-mode" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-Archive</p>
                        <p className="text-sm text-brand-muted">
                          Archive inactive sessions
                        </p>
                      </div>
                      <Switch id="auto-archive" checked={true} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Integration Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Integration Settings
                  </CardTitle>
                  <CardDescription>
                    Configure third-party integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mr-2">
                            <Database className="h-4 w-4" />
                          </div>
                          <p className="font-medium">CRM Integration</p>
                        </div>
                        <Switch id="crm-integration" checked={true} />
                      </div>
                      <p className="text-sm text-brand-muted">
                        Connect to your CRM system to sync customer data
                      </p>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center text-green-600 mr-2">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                          <p className="font-medium">Slack Notifications</p>
                        </div>
                        <Switch id="slack-integration" />
                      </div>
                      <p className="text-sm text-brand-muted">
                        Receive notifications in your Slack workspace
                      </p>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-purple-100 rounded-md flex items-center justify-center text-purple-600 mr-2">
                            <FileText className="h-4 w-4" />
                          </div>
                          <p className="font-medium">Analytics Integration</p>
                        </div>
                        <Switch id="analytics-integration" checked={true} />
                      </div>
                      <p className="text-sm text-brand-muted">
                        Connect to analytics platform for tracking
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Status Tracking Tab */}
          <TabsContent value="status-tracking" className="mt-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">System Status Tracking</h2>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                  All Systems Operational
                </Badge>
                <Button variant="outline" size="sm">
                  <Clock className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">AI Models</CardTitle>
                  <CardDescription>Status of AI model services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "GPT-4", status: "Active", uptime: "99.8%" },
                      {
                        name: "GPT-3.5 Turbo",
                        status: "Inactive",
                        uptime: "--",
                      },
                      { name: "Claude 2", status: "Static", uptime: "100%" },
                    ].map((model, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full mr-2 ${model.status === "Active" ? "bg-green-500" : model.status === "Inactive" ? "bg-gray-400" : "bg-yellow-500"}`}
                          ></div>
                          <span>{model.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className={`${model.status === "Active" ? "text-green-600 bg-green-50" : model.status === "Inactive" ? "text-gray-600 bg-gray-50" : "text-yellow-600 bg-yellow-50"}`}
                          >
                            {model.status}
                          </Badge>
                          <span className="text-xs text-brand-muted">
                            {model.uptime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Knowledge Base</CardTitle>
                  <CardDescription>Status of knowledge sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Product Documentation",
                        status: "Active",
                        lastSync: "10m ago",
                      },
                      {
                        name: "FAQ Database",
                        status: "Active",
                        lastSync: "1h ago",
                      },
                      {
                        name: "Support Articles",
                        status: "Inactive",
                        lastSync: "1d ago",
                      },
                    ].map((source, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full mr-2 ${source.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
                          ></div>
                          <span>{source.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className={`${source.status === "Active" ? "text-green-600 bg-green-50" : "text-gray-600 bg-gray-50"}`}
                          >
                            {source.status}
                          </Badge>
                          <span className="text-xs text-brand-muted">
                            {source.lastSync}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Integrations</CardTitle>
                  <CardDescription>
                    Status of third-party integrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        name: "CRM Integration",
                        status: "Active",
                        lastSync: "5m ago",
                      },
                      {
                        name: "Slack Notifications",
                        status: "Inactive",
                        lastSync: "--",
                      },
                      {
                        name: "Analytics Integration",
                        status: "Active",
                        lastSync: "30m ago",
                      },
                    ].map((integration, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full mr-2 ${integration.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
                          ></div>
                          <span>{integration.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className={`${integration.status === "Active" ? "text-green-600 bg-green-50" : "text-gray-600 bg-gray-50"}`}
                          >
                            {integration.status}
                          </Badge>
                          <span className="text-xs text-brand-muted">
                            {integration.lastSync}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Module Status Dashboard
                </CardTitle>
                <CardDescription>
                  Monitor and change component status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md divide-y">
                  {[
                    {
                      name: "Chat Widget",
                      description: "Frontend chat interface",
                      status: "Active",
                      lastUpdated: "10m ago",
                    },
                    {
                      name: "AI Processing",
                      description: "Backend AI processing service",
                      status: "Active",
                      lastUpdated: "15m ago",
                    },
                    {
                      name: "Knowledge Base",
                      description: "Information retrieval system",
                      status: "Active",
                      lastUpdated: "1h ago",
                    },
                    {
                      name: "Scraping System",
                      description: "Web data collection service",
                      status: "Static",
                      lastUpdated: "2h ago",
                    },
                    {
                      name: "Analytics Engine",
                      description: "Data analysis service",
                      status: "Inactive",
                      lastUpdated: "1d ago",
                    },
                  ].map((module, index) => (
                    <div key={index} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <div
                              className={`h-3 w-3 rounded-full mr-2 ${module.status === "Active" ? "bg-green-500" : module.status === "Inactive" ? "bg-gray-400" : "bg-yellow-500"}`}
                            ></div>
                            <h3 className="font-medium">{module.name}</h3>
                          </div>
                          <p className="text-sm text-brand-muted mt-1">
                            {module.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-xs text-brand-muted">
                              Last Updated
                            </p>
                            <p className="text-sm">{module.lastUpdated}</p>
                          </div>
                          <Select defaultValue={module.status}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">
                                <span className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                  Active
                                </span>
                              </SelectItem>
                              <SelectItem value="Inactive">
                                <span className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span>
                                  Inactive
                                </span>
                              </SelectItem>
                              <SelectItem value="Static">
                                <span className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                                  Static
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Logs</CardTitle>
                <CardDescription>
                  Recent status changes and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md divide-y">
                  {[
                    {
                      time: "10:15 AM",
                      event: "AI Model GPT-4 status changed to Active",
                      user: "admin@example.com",
                      type: "status",
                    },
                    {
                      time: "09:45 AM",
                      event: "Knowledge Base updated with new documentation",
                      user: "content@example.com",
                      type: "update",
                    },
                    {
                      time: "09:30 AM",
                      event: "Scraping System status changed to Static",
                      user: "admin@example.com",
                      type: "status",
                    },
                    {
                      time: "Yesterday",
                      event: "Analytics Engine status changed to Inactive",
                      user: "admin@example.com",
                      type: "status",
                    },
                    {
                      time: "Yesterday",
                      event: "New AI Model Claude 2 added to the system",
                      user: "admin@example.com",
                      type: "create",
                    },
                  ].map((log, index) => (
                    <div key={index} className="p-3 flex items-center">
                      <div className="w-24 text-xs text-brand-muted">
                        {log.time}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{log.event}</p>
                        <p className="text-xs text-brand-muted">{log.user}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${log.type === "status" ? "bg-blue-50 text-blue-700" : log.type === "update" ? "bg-green-50 text-green-700" : "bg-purple-50 text-purple-700"}`}
                      >
                        {log.type === "status"
                          ? "Status Change"
                          : log.type === "update"
                            ? "Update"
                            : "Creation"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
