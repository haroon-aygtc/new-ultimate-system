import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Paintbrush,
  MessageSquare,
  Code,
  Settings,
  LayoutDashboard,
  FileText,
  Database,
  Upload,
  Palette,
  Layout as LayoutIcon,
  Save,
  AlertCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WidgetConfiguratorStoryboard() {
  // State for unsaved changes and saving status (for demo purposes)
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Brand appearance settings
  const [primaryColor, setPrimaryColor] = React.useState("#4A6FA5");
  const [secondaryColor, setSecondaryColor] = React.useState("#2C3E50");
  const [accentColor, setAccentColor] = React.useState("#16A085");
  const [logoUrl, setLogoUrl] = React.useState(
    "https://api.dicebear.com/7.x/initials/svg?seed=GA&backgroundColor=4A6FA5&textColor=ffffff",
  );
  const [brandName, setBrandName] = React.useState("GuestApp");
  const [tagline, setTagline] = React.useState(
    "Modern Guest Session Management",
  );

  // Widget settings
  const [widgetTitle, setWidgetTitle] = React.useState("Chat with us");
  const [welcomeMessage, setWelcomeMessage] = React.useState(
    "Hello! How can we assist you today?",
  );
  const [inputPlaceholder, setInputPlaceholder] = React.useState(
    "Type your message...",
  );
  const [widgetPosition, setWidgetPosition] = React.useState("bottom-right");
  const [cornerRadius, setCornerRadius] = React.useState(8);
  const [headerOpacity, setHeaderOpacity] = React.useState(100);
  const [showAvatar, setShowAvatar] = React.useState(true);

  // Track changes to update the unsaved changes state
  React.useEffect(() => {
    setHasUnsavedChanges(true);
  }, [
    primaryColor,
    secondaryColor,
    accentColor,
    logoUrl,
    brandName,
    tagline,
    widgetTitle,
    welcomeMessage,
    inputPlaceholder,
    widgetPosition,
    cornerRadius,
    headerOpacity,
    showAvatar,
  ]);

  const handleSaveChanges = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setHasUnsavedChanges(false);
      setIsSaving(false);
    }, 1000);
  };

  const handleLogoUpload = () => {
    // In a real implementation, this would open a file picker
    // For demo purposes, we'll just update with a new random avatar
    const randomSeed = Math.random().toString(36).substring(2, 8);
    setLogoUrl(
      `https://api.dicebear.com/7.x/initials/svg?seed=${randomSeed}&backgroundColor=${primaryColor.substring(1)}&textColor=ffffff`,
    );
  };

  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-secondary">
              Admin Dashboard
            </h1>
            <p className="text-brand-muted">
              Customize the appearance and behavior of your chat widget
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
            className="flex items-center justify-center min-w-[120px] bg-white border border-brand-primary rounded-md px-4 py-2 text-brand-primary"
          >
            <Paintbrush className="h-4 w-4 mr-2" />
            Widget Config
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-center min-w-[120px] bg-white border rounded-md px-4 py-2"
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
            className="bg-white/20 text-white flex items-center justify-center"
          >
            <Paintbrush className="h-4 w-4 mr-2" />
            Widget Config
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 flex items-center justify-center"
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

        <div className="space-y-6">
          <Card className="bg-white border-brand-primary/10">
            <CardHeader>
              <CardTitle className="text-brand-secondary">
                Branding Settings
              </CardTitle>
              <CardDescription className="text-brand-muted">
                Customize the appearance of your chat widget and admin interface
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
                            onClick={handleLogoUpload}
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

                      <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                          id="tagline"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
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
                              <Label htmlFor="accent-color" className="text-xs">
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
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="w-full h-8"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Label className="text-sm font-medium">Preview</Label>
                        <div className="mt-2 p-4 border rounded-md bg-brand-light">
                          <div className="flex items-center space-x-2 mb-4">
                            <div
                              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: primaryColor }}
                            >
                              {brandName.substring(0, 2).toUpperCase()}
                            </div>
                            <div
                              className="font-medium"
                              style={{ color: secondaryColor }}
                            >
                              {brandName}
                            </div>
                          </div>
                          <div
                            className="px-4 py-2 rounded-md text-white text-sm mb-2"
                            style={{ backgroundColor: primaryColor }}
                          >
                            Primary Button
                          </div>
                          <div
                            className="px-4 py-2 rounded-md text-white text-sm mb-2"
                            style={{ backgroundColor: secondaryColor }}
                          >
                            Secondary Button
                          </div>
                          <div
                            className="px-4 py-2 rounded-md text-white text-sm"
                            style={{ backgroundColor: accentColor }}
                          >
                            Accent Button
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
                        <Label htmlFor="welcome-message">Welcome Message</Label>
                        <Textarea
                          id="welcome-message"
                          value={welcomeMessage}
                          onChange={(e) => setWelcomeMessage(e.target.value)}
                          className="min-h-[80px] max-w-md"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="placeholder-text">
                          Input Placeholder
                        </Label>
                        <Input
                          id="placeholder-text"
                          value={inputPlaceholder}
                          onChange={(e) => setInputPlaceholder(e.target.value)}
                          className="max-w-md"
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="widget-position">
                            Widget Position
                          </Label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className={`flex items-center justify-center py-6 ${widgetPosition === "bottom-right" ? "border-brand-primary/30" : ""}`}
                            onClick={() => setWidgetPosition("bottom-right")}
                          >
                            <div className="relative h-full w-full">
                              <div
                                className={`absolute bottom-0 right-0 h-6 w-6 rounded-full ${widgetPosition === "bottom-right" ? "bg-brand-primary" : "bg-brand-muted/50"}`}
                              ></div>
                              <span className="text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                Bottom Right
                              </span>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            className={`flex items-center justify-center py-6 ${widgetPosition === "bottom-left" ? "border-brand-primary/30" : ""}`}
                            onClick={() => setWidgetPosition("bottom-left")}
                          >
                            <div className="relative h-full w-full">
                              <div
                                className={`absolute bottom-0 left-0 h-6 w-6 rounded-full ${widgetPosition === "bottom-left" ? "bg-brand-primary" : "bg-brand-muted/50"}`}
                              ></div>
                              <span className="text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                Bottom Left
                              </span>
                            </div>
                          </Button>
                        </div>
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
                              <Palette className="h-4 w-4 text-brand-muted" />
                              <span className="text-sm">Header Opacity</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="range"
                                min="0"
                                max="100"
                                value={headerOpacity}
                                onChange={(e) =>
                                  setHeaderOpacity(parseInt(e.target.value))
                                }
                                className="w-24"
                              />
                              <span className="text-xs w-6 text-brand-muted">
                                {headerOpacity}%
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
                              opacity: headerOpacity / 100,
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
                                placeholder={inputPlaceholder}
                                className="text-sm"
                                disabled
                              />
                              <Button
                                size="icon"
                                className="h-8 w-8"
                                style={{ backgroundColor: primaryColor }}
                                disabled
                              >
                                <Send className="h-4 w-4 text-white" />
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
            <CardFooter className="flex justify-between space-x-2 border-t pt-4">
              <div>
                {hasUnsavedChanges && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-amber-500 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span>Unsaved changes</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          You have unsaved changes that will be lost if you
                          navigate away.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button
                  className="bg-brand-primary text-white flex items-center"
                  onClick={handleSaveChanges}
                  disabled={!hasUnsavedChanges || isSaving}
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
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

// Helper component for the Send icon
const Send = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

// Helper component for the X icon
const X = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
