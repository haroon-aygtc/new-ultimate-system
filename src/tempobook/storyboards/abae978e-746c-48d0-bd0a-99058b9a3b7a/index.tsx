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
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  LayoutDashboard,
  Settings,
  PaintBucket,
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
  LogIn,
  User,
  ShieldCheck,
} from "lucide-react";

export default function AdminDashboardFeaturesStoryboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginAsAdmin = () => {
    localStorage.setItem(
      "mockAdminUser",
      JSON.stringify({
        username: "admin",
        role: "admin",
        name: "Admin User",
        isLoggedIn: true,
      }),
    );

    toast({
      title: "Admin Login Successful",
      description: "Welcome back, Admin User!",
    });

    navigate("/admin/guest-session-management");
  };

  const loginAsManager = () => {
    localStorage.setItem(
      "mockAdminUser",
      JSON.stringify({
        username: "manager",
        role: "manager",
        name: "Manager User",
        isLoggedIn: true,
      }),
    );

    toast({
      title: "Manager Login Successful",
      description: "Welcome back, Manager User!",
    });

    navigate("/admin/guest-session-management");
  };

  const loginAsViewer = () => {
    localStorage.setItem(
      "mockAdminUser",
      JSON.stringify({
        username: "viewer",
        role: "viewer",
        name: "Viewer User",
        isLoggedIn: true,
      }),
    );

    toast({
      title: "Viewer Login Successful",
      description: "Welcome back, Viewer User!",
    });

    navigate("/admin/guest-session-management");
  };

  const loginAsUser = () => {
    localStorage.setItem(
      "mockUser",
      JSON.stringify({
        username: "user@example.com",
        name: "Regular User",
        isLoggedIn: true,
      }),
    );

    toast({
      title: "User Login Successful",
      description: "Welcome back, Regular User!",
    });

    navigate("/");
  };
  return (
    <div className="bg-white min-h-screen p-6">
      {/* Mock Login Buttons */}
      <Card className="mb-6 border-2 border-brand-primary">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-brand-primary">
            Quick Mock Login
          </CardTitle>
          <CardDescription>
            Click to instantly log in with different roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={loginAsAdmin}
              className="flex items-center justify-center"
            >
              <ShieldCheck className="mr-2 h-4 w-4" /> Admin Login
            </Button>
            <Button
              onClick={loginAsManager}
              variant="outline"
              className="flex items-center justify-center"
            >
              <ShieldCheck className="mr-2 h-4 w-4" /> Manager Login
            </Button>
            <Button
              onClick={loginAsViewer}
              variant="secondary"
              className="flex items-center justify-center"
            >
              <ShieldCheck className="mr-2 h-4 w-4" /> Viewer Login
            </Button>
            <Button
              onClick={loginAsUser}
              variant="ghost"
              className="flex items-center justify-center"
            >
              <User className="mr-2 h-4 w-4" /> User Login
            </Button>
          </div>
        </CardContent>
      </Card>
      <h1 className="text-3xl font-bold text-brand-secondary mb-6">
        Admin Dashboard UI Features
      </h1>

      <Tabs defaultValue="ai-models">
        <TabsList className="mb-4">
          <TabsTrigger value="ai-models">AI Models</TabsTrigger>
          <TabsTrigger value="response-formats">Response Formats</TabsTrigger>
          <TabsTrigger value="system-settings">System Settings</TabsTrigger>
          <TabsTrigger value="export-options">Export Options</TabsTrigger>
          <TabsTrigger value="ai-integration">AI Integration</TabsTrigger>
          <TabsTrigger value="status-tracking">Status Tracking</TabsTrigger>
        </TabsList>

        {/* AI Models Tab */}
        <TabsContent value="ai-models" className="space-y-6">
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
                      <SelectItem value="Active" className="text-brand-accent">
                        <span className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-brand-accent mr-2"></span>
                          Active
                        </span>
                      </SelectItem>
                      <SelectItem value="Inactive" className="text-brand-muted">
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
                      <SelectItem value="Active" className="text-brand-accent">
                        <span className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-brand-accent mr-2"></span>
                          Active
                        </span>
                      </SelectItem>
                      <SelectItem value="Inactive" className="text-brand-muted">
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
        <TabsContent value="response-formats" className="space-y-6">
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

        {/* System Settings Tab */}
        <TabsContent value="system-settings" className="space-y-6">
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
                        <p className="text-sm text-brand-muted">{user.email}</p>
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
                <CardTitle className="text-lg">Integration Settings</CardTitle>
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

        {/* Export Options Tab */}
        <TabsContent value="export-options" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Export Options</h2>
            <Button className="bg-brand-primary text-white">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    id: "json",
                    name: "JSON",
                    icon: FileJson,
                    description: "Structured data format",
                  },
                  {
                    id: "csv",
                    name: "CSV",
                    icon: FileSpreadsheet,
                    description: "Spreadsheet compatible",
                  },
                  {
                    id: "html",
                    name: "HTML",
                    icon: Code,
                    description: "Web-ready format",
                  },
                  {
                    id: "text",
                    name: "Text",
                    icon: FileTextIcon,
                    description: "Plain text format",
                  },
                ].map((format) => {
                  const Icon = format.icon;
                  return (
                    <div
                      key={format.id}
                      className={`border rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${format.id === "json" ? "border-brand-primary bg-brand-light/30" : "hover:border-brand-muted/50"}`}
                    >
                      <Icon
                        className={`h-8 w-8 mb-2 ${format.id === "json" ? "text-brand-primary" : "text-brand-muted"}`}
                      />
                      <span
                        className={`text-sm font-medium ${format.id === "json" ? "text-brand-primary" : ""}`}
                      >
                        {format.name}
                      </span>
                      <span className="text-xs text-brand-muted mt-1">
                        {format.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filename">Filename</Label>
                <Input id="filename" value="scrape-result-2023-10-15" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="encoding">Encoding</Label>
                <Select defaultValue="utf8">
                  <SelectTrigger id="encoding">
                    <SelectValue placeholder="Select encoding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utf8">UTF-8</SelectItem>
                    <SelectItem value="ascii">ASCII</SelectItem>
                    <SelectItem value="iso88591">ISO-8859-1</SelectItem>
                    <SelectItem value="windows1252">Windows-1252</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Export Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Pretty Print</span>
                  </div>
                  <Switch id="pretty-print" checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Include Metadata</span>
                  </div>
                  <Switch id="include-metadata" checked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Compress Output</span>
                  </div>
                  <Switch id="compress-output" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Auto-Download</span>
                  </div>
                  <Switch id="auto-download" checked={true} />
                </div>
              </div>
            </div>

            {/* Live Visualization */}
            <Card className="mt-4">
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
            </Card>
          </div>
        </TabsContent>

        {/* AI Integration Tab */}
        <TabsContent value="ai-integration" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">AI Integration Flow</h2>
            <Button className="bg-brand-primary text-white">
              <Check className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Configuration Steps */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-brand-primary text-white flex items-center justify-center mr-2">
                      1
                    </div>
                    <CardTitle className="text-lg">Select AI Model</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-3 bg-brand-light/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">GPT-4</p>
                          <p className="text-sm text-brand-muted">
                            Most powerful model for complex tasks
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-brand-accent text-white">
                            Active
                          </Badge>
                          <Switch id="select-gpt4" checked={true} />
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">GPT-3.5 Turbo</p>
                          <p className="text-sm text-brand-muted">
                            Fast and cost-effective for most use cases
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-brand-muted">
                            Inactive
                          </Badge>
                          <Switch id="select-gpt35" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-brand-primary text-white flex items-center justify-center mr-2">
                      2
                    </div>
                    <CardTitle className="text-lg">
                      Configure Knowledge Base
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md divide-y">
                      {[
                        {
                          name: "Product Documentation",
                          type: "Website",
                          status: "Active",
                        },
                        { name: "FAQ Database", type: "CSV", status: "Active" },
                        {
                          name: "Support Articles",
                          type: "PDF",
                          status: "Inactive",
                        },
                      ].map((source, index) => (
                        <div
                          key={index}
                          className="p-3 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">{source.name}</p>
                            <p className="text-xs text-brand-muted">
                              {source.type}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className={
                                source.status === "Active"
                                  ? "bg-brand-accent/20 text-brand-accent"
                                  : "bg-brand-muted/20 text-brand-muted"
                              }
                            >
                              {source.status}
                            </Badge>
                            <Switch checked={source.status === "Active"} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Knowledge Source
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-brand-primary text-white flex items-center justify-center mr-2">
                      3
                    </div>
                    <CardTitle className="text-lg">
                      Set Custom Prompts
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="system-prompt">System Prompt</Label>
                      <Textarea
                        id="system-prompt"
                        className="min-h-[100px]"
                        value="You are a helpful assistant for our company. Please provide accurate and concise information to our customers."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="greeting-prompt">Greeting Prompt</Label>
                      <Input
                        id="greeting-prompt"
                        value="Hello! How can I assist you today?"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-brand-primary text-white flex items-center justify-center mr-2">
                      4
                    </div>
                    <CardTitle className="text-lg">
                      Define Response Format
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="response-format">Format Template</Label>
                      <Select defaultValue="customer-support">
                        <SelectTrigger id="response-format">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer-support">
                            Customer Support
                          </SelectItem>
                          <SelectItem value="sales-assistant">
                            Sales Assistant
                          </SelectItem>
                          <SelectItem value="technical-support">
                            Technical Support
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="response-style">Response Style</Label>
                      <Select defaultValue="friendly">
                        <SelectTrigger id="response-style">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">
                            Friendly & Conversational
                          </SelectItem>
                          <SelectItem value="professional">
                            Professional & Formal
                          </SelectItem>
                          <SelectItem value="concise">
                            Concise & Direct
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Include Branding</p>
                        <p className="text-xs text-brand-muted">
                          Add company name and logo to responses
                        </p>
                      </div>
                      <Switch id="include-branding" checked={true} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-brand-primary text-white flex items-center justify-center mr-2">
                      5
                    </div>
                    <CardTitle className="text-lg">Test AI Response</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="test-query">Test Query</Label>
                      <Input
                        id="test-query"
                        value="What are your business hours?"
                      />
                    </div>
                    <Button className="w-full bg-brand-primary text-white">
                      <Play className="mr-2 h-4 w-4" />
                      Generate Response
                    </Button>
                    <div className="border rounded-md p-4 bg-brand-light/20">
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="mb-2">
                          Our business hours are Monday through Friday from 9:00
                          AM to 6:00 PM Eastern Time. We are closed on weekends
                          and major holidays.
                        </p>
                        <p className="mb-2">
                          If you need assistance outside of these hours, you can
                          leave a message and we'll get back to you on the next
                          business day.
                        </p>
                        <p>Is there anything else I can help you with today?</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Configuration Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-brand-muted">
                          Selected Model
                        </p>
                        <p className="font-medium">GPT-4</p>
                      </div>
                      <div>
                        <p className="text-sm text-brand-muted">
                          Knowledge Sources
                        </p>
                        <p className="font-medium">3 sources (2 active)</p>
                      </div>
                      <div>
                        <p className="text-sm text-brand-muted">
                          Response Format
                        </p>
                        <p className="font-medium">Customer Support</p>
                      </div>
                      <div>
                        <p className="text-sm text-brand-muted">
                          Response Style
                        </p>
                        <p className="font-medium">Friendly & Conversational</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-brand-primary text-white">
                        <Check className="mr-2 h-4 w-4" />
                        Apply Configuration
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Status Tracking Tab */}
        <TabsContent value="status-tracking" className="space-y-6">
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
                    { name: "GPT-3.5 Turbo", status: "Inactive", uptime: "--" },
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
              <CardTitle className="text-lg">Module Status Dashboard</CardTitle>
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
  );
}
