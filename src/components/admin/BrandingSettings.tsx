import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Palette,
  Layout,
  MessageSquare,
  Save,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BrandingSettings = () => {
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Brand appearance settings
  const [primaryColor, setPrimaryColor] = useState("#4A6FA5");
  const [secondaryColor, setSecondaryColor] = useState("#2C3E50");
  const [accentColor, setAccentColor] = useState("#16A085");
  const [logoUrl, setLogoUrl] = useState(
    "https://api.dicebear.com/7.x/initials/svg?seed=GA&backgroundColor=4A6FA5&textColor=ffffff",
  );
  const [brandName, setBrandName] = useState("GuestApp");
  const [tagline, setTagline] = useState("Modern Guest Session Management");

  // Widget settings
  const [widgetTitle, setWidgetTitle] = useState("Chat with us");
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hello! How can we assist you today?",
  );
  const [inputPlaceholder, setInputPlaceholder] = useState(
    "Type your message...",
  );
  const [widgetPosition, setWidgetPosition] = useState("bottom-right");
  const [cornerRadius, setCornerRadius] = useState(8);
  const [headerOpacity, setHeaderOpacity] = useState(100);
  const [showAvatar, setShowAvatar] = useState(true);

  // Message settings
  const [offlineMessage, setOfflineMessage] = useState(
    "We're currently offline. Please leave a message and we'll get back to you as soon as possible.",
  );
  const [timeoutMessage, setTimeoutMessage] = useState(
    "Your session has been inactive for a while. Do you need further assistance?",
  );
  const [errorMessage, setErrorMessage] = useState(
    "Sorry, we encountered an error. Please try again or contact support if the issue persists.",
  );

  // Message formatting settings
  const [enableMarkdown, setEnableMarkdown] = useState(true);
  const [enableCodeHighlighting, setEnableCodeHighlighting] = useState(true);
  const [enableEmojis, setEnableEmojis] = useState(true);
  const [enableLinkPreview, setEnableLinkPreview] = useState(false);

  // Track changes to update the unsaved changes state
  useEffect(() => {
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
    offlineMessage,
    timeoutMessage,
    errorMessage,
    enableMarkdown,
    enableCodeHighlighting,
    enableEmojis,
    enableLinkPreview,
  ]);

  const handleSaveChanges = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your branding settings have been updated successfully.",
      });
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

  // Handle message formatting option changes
  const handleMessageFormattingChange = (option, value) => {
    switch (option) {
      case "markdown":
        setEnableMarkdown(value);
        break;
      case "codeHighlighting":
        setEnableCodeHighlighting(value);
        break;
      case "emojis":
        setEnableEmojis(value);
        break;
      case "linkPreview":
        setEnableLinkPreview(value);
        break;
      default:
        break;
    }
  };

  return (
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
                    <Label className="text-sm font-medium">Color Scheme</Label>
                    <div className="grid grid-cols-1 gap-4 mt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="primary-color" className="text-xs">
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
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-full h-8"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="secondary-color" className="text-xs">
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
                            onChange={(e) => setSecondaryColor(e.target.value)}
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
                    <Label htmlFor="placeholder-text">Input Placeholder</Label>
                    <Input
                      id="placeholder-text"
                      value={inputPlaceholder}
                      onChange={(e) => setInputPlaceholder(e.target.value)}
                      className="max-w-md"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="widget-position">Widget Position</Label>
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
                          <Layout className="h-4 w-4 text-brand-muted" />
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

            <TabsContent value="messages" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="offline-message">Offline Message</Label>
                    <Textarea
                      id="offline-message"
                      value={offlineMessage}
                      onChange={(e) => setOfflineMessage(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeout-message">Timeout Message</Label>
                    <Textarea
                      id="timeout-message"
                      value={timeoutMessage}
                      onChange={(e) => setTimeoutMessage(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="error-message">Error Message</Label>
                    <Textarea
                      id="error-message"
                      value={errorMessage}
                      onChange={(e) => setErrorMessage(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Response Templates
                    </Label>
                    <div className="mt-2 border rounded-md divide-y">
                      {[
                        {
                          name: "Greeting",
                          content: "Hello {{name}}, how can I help you today?",
                        },
                        {
                          name: "Thank You",
                          content:
                            "Thank you for contacting us. Is there anything else you need help with?",
                        },
                        {
                          name: "Closing",
                          content:
                            "Thank you for chatting with us. Have a great day!",
                        },
                        {
                          name: "Transfer",
                          content:
                            "I'll transfer you to a specialist who can better assist with your question.",
                        },
                      ].map((template, index) => (
                        <div key={index} className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              {template.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                            >
                              Edit
                            </Button>
                          </div>
                          <p className="text-xs text-brand-muted mt-1 line-clamp-1">
                            {template.content}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Add Template
                    </Button>
                  </div>

                  <div className="pt-4">
                    <Label className="text-sm font-medium">
                      Message Formatting
                    </Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Enable Markdown</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertCircle className="h-4 w-4 text-brand-muted cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-60 text-xs">
                                  Allow formatting with markdown syntax like
                                  **bold**, *italic*, and `code`
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Switch
                          checked={enableMarkdown}
                          onCheckedChange={(checked) =>
                            handleMessageFormattingChange("markdown", checked)
                          }
                          id="enable-markdown"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">
                            Enable Code Highlighting
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertCircle className="h-4 w-4 text-brand-muted cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-60 text-xs">
                                  Syntax highlighting for code blocks in
                                  messages
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Switch
                          checked={enableCodeHighlighting}
                          onCheckedChange={(checked) =>
                            handleMessageFormattingChange(
                              "codeHighlighting",
                              checked,
                            )
                          }
                          id="enable-code-highlight"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Enable Emojis</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertCircle className="h-4 w-4 text-brand-muted cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-60 text-xs">
                                  Convert emoji shortcodes like :smile: to emoji
                                  characters
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Switch
                          checked={enableEmojis}
                          onCheckedChange={(checked) =>
                            handleMessageFormattingChange("emojis", checked)
                          }
                          id="enable-emojis"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Enable Link Preview</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertCircle className="h-4 w-4 text-brand-muted cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-60 text-xs">
                                  Show rich previews for links shared in
                                  messages
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Switch
                          checked={enableLinkPreview}
                          onCheckedChange={(checked) =>
                            handleMessageFormattingChange(
                              "linkPreview",
                              checked,
                            )
                          }
                          id="enable-link-preview"
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
                      You have unsaved changes that will be lost if you navigate
                      away.
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
  );
};

export default BrandingSettings;

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
