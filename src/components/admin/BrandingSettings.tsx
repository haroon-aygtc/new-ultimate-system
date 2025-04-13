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
  Loader2,
  Check,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getBrandingSettings,
  saveBrandingSettings,
  BrandingSettings as BrandingSettingsType,
  getResponseTemplates,
  saveResponseTemplate,
  deleteResponseTemplate,
  setTemplateActive,
  ResponseTemplate,
} from "@/services/brandingService";

const BrandingSettings = () => {
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settingsId, setSettingsId] = useState<string | undefined>(undefined);
  
  // Response templates state
  const [responseTemplates, setResponseTemplates] = useState<ResponseTemplate[]>([]);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<ResponseTemplate | null>(null);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);

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
  
  // AI Persona settings
  const [aiPersona, setAiPersona] = useState("A helpful AI assistant representing our brand");
  const [aiTone, setAiTone] = useState("friendly");
  const [aiKnowledgeLevel, setAiKnowledgeLevel] = useState("expert");
  const [aiResponseLength, setAiResponseLength] = useState("balanced");
  const [aiCustomInstructions, setAiCustomInstructions] = useState("");

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await getBrandingSettings();

        if (error) {
          throw error;
        }

        if (data) {
          setSettingsId(data.id);
          setPrimaryColor(data.primary_color);
          setSecondaryColor(data.secondary_color);
          setAccentColor(data.accent_color);
          setLogoUrl(data.logo_url);
          setBrandName(data.brand_name);
          setTagline(data.tagline);
          setWidgetTitle(data.widget_title);
          setWelcomeMessage(data.welcome_message);
          setInputPlaceholder(data.input_placeholder);
          setWidgetPosition(data.widget_position);
          setCornerRadius(data.corner_radius);
          setHeaderOpacity(data.header_opacity);
          setShowAvatar(data.show_avatar);
          setOfflineMessage(data.offline_message);
          setTimeoutMessage(data.timeout_message);
          setErrorMessage(data.error_message);
          setEnableMarkdown(data.enable_markdown);
          setEnableCodeHighlighting(data.enable_code_highlighting);
          setEnableEmojis(data.enable_emojis);
          setEnableLinkPreview(data.enable_link_preview);
          
          // Load AI persona settings if they exist
          if (data.ai_persona) setAiPersona(data.ai_persona);
          if (data.ai_tone) setAiTone(data.ai_tone);
          if (data.ai_knowledge_level) setAiKnowledgeLevel(data.ai_knowledge_level);
          if (data.ai_response_length) setAiResponseLength(data.ai_response_length);
          if (data.ai_custom_instructions) setAiCustomInstructions(data.ai_custom_instructions);

          // Reset unsaved changes flag after loading
          setHasUnsavedChanges(false);
        }
      } catch (error) {
        console.error("Error loading branding settings:", error);
        toast({
          title: "Error loading settings",
          description: "Could not load branding settings. Using defaults.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
    loadResponseTemplates();
  }, [toast]);
  
  // Load response templates
  const loadResponseTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getResponseTemplates();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setResponseTemplates(data);
      }
    } catch (error) {
      console.error("Error loading response templates:", error);
      toast({
        title: "Error loading templates",
        description: "Could not load response templates.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    aiPersona,
    aiTone,
    aiKnowledgeLevel,
    aiResponseLength,
    aiCustomInstructions
  ]);

  const handleSaveChanges = async () => {
    setIsSaving(true);

    try {
      const settings: BrandingSettingsType = {
        id: settingsId,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: accentColor,
        logo_url: logoUrl,
        brand_name: brandName,
        tagline: tagline,
        widget_title: widgetTitle,
        welcome_message: welcomeMessage,
        input_placeholder: inputPlaceholder,
        widget_position: widgetPosition as "bottom-right" | "bottom-left",
        corner_radius: cornerRadius,
        header_opacity: headerOpacity,
        show_avatar: showAvatar,
        offline_message: offlineMessage,
        timeout_message: timeoutMessage,
        error_message: errorMessage,
        enable_markdown: enableMarkdown,
        enable_code_highlighting: enableCodeHighlighting,
        enable_emojis: enableEmojis,
        enable_link_preview: enableLinkPreview,
        ai_persona: aiPersona,
        ai_tone: aiTone as "formal" | "casual" | "friendly" | "professional",
        ai_knowledge_level: aiKnowledgeLevel as "basic" | "intermediate" | "expert",
        ai_response_length: aiResponseLength as "concise" | "balanced" | "detailed",
        ai_custom_instructions: aiCustomInstructions
      };

      const { success, error } = await saveBrandingSettings(settings);

      if (!success) {
        throw error;
      }

      toast({
        title: "Settings saved",
        description: "Your branding settings have been updated successfully.",
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving branding settings:", error);
      toast({
        title: "Error saving settings",
        description: "Could not save branding settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
  const handleMessageFormattingChange = (option: string, value: boolean) => {
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

  // Template management functions
  const handleAddTemplate = () => {
    setCurrentTemplate({
      name: "",
      description: "",
      template: "",
      is_active: false
    });
    setIsTemplateDialogOpen(true);
  };
  
  const handleEditTemplate = (template: ResponseTemplate) => {
    setCurrentTemplate(template);
    setIsTemplateDialogOpen(true);
  };
  
  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }
    
    setIsTemplateLoading(true);
    try {
      const { success, error } = await deleteResponseTemplate(id);
      
      if (!success) {
        throw error;
      }
      
      toast({
        title: "Template deleted",
        description: "Response template has been deleted successfully."
      });
      
      // Refresh templates
      await loadResponseTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error deleting template",
        description: "Could not delete the template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTemplateLoading(false);
    }
  };
  
  const handleSetActiveTemplate = async (id: string) => {
    setIsTemplateLoading(true);
    try {
      const { success, error } = await setTemplateActive(id);
      
      if (!success) {
        throw error;
      }
      
      toast({
        title: "Template activated",
        description: "Response template has been set as active."
      });
      
      // Refresh templates
      await loadResponseTemplates();
    } catch (error) {
      console.error("Error activating template:", error);
      toast({
        title: "Error activating template",
        description: "Could not set the template as active. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTemplateLoading(false);
    }
  };
  
  const handleSaveTemplate = async (template: ResponseTemplate) => {
    setIsTemplateLoading(true);
    try {
      const { success, error } = await saveResponseTemplate(template);
      
      if (!success) {
        throw error;
      }
      
      toast({
        title: "Template saved",
        description: "Response template has been saved successfully."
      });
      
      setIsTemplateDialogOpen(false);
      setCurrentTemplate(null);
      
      // Refresh templates
      await loadResponseTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error saving template",
        description: "Could not save the template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTemplateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          <span className="ml-2 text-brand-muted">Loading settings...</span>
        </div>
      )}
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
              <TabsTrigger value="ai-persona">AI Persona</TabsTrigger>
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
                      Response Format Templates
                    </Label>
                    <div className="mt-2 border rounded-md divide-y">
                      {isLoading ? (
                        <div className="p-6 flex justify-center items-center">
                          <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
                          <span className="ml-2 text-brand-muted">Loading templates...</span>
                        </div>
                      ) : responseTemplates.length === 0 ? (
                        <div className="p-6 text-center text-brand-muted">
                          No response templates found. Add your first template below.
                        </div>
                      ) : (
                        responseTemplates.map((template) => (
                          <div key={template.id} className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">
                                  {template.name}
                                </span>
                                {template.is_active && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    Active
                                  </Badge>
                                )}
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => handleEditTemplate(template)}
                                >
                                  Edit
                                </Button>
                                {!template.is_active && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-green-600"
                                    onClick={() => handleSetActiveTemplate(template.id!)}
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Set Active
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs text-red-600"
                                  onClick={() => handleDeleteTemplate(template.id!)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-brand-muted mt-1">
                              {template.description}
                            </p>
                            <div className="mt-2 bg-gray-50 p-2 rounded text-xs font-mono whitespace-pre-line line-clamp-2">
                              {template.template}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleAddTemplate()}
                    >
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
            
            <TabsContent value="ai-persona" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-persona">AI Persona Description</Label>
                    <Textarea
                      id="ai-persona"
                      value={aiPersona}
                      onChange={(e) => setAiPersona(e.target.value)}
                      placeholder="Describe how the AI should present itself"
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-brand-muted">
                      Define how the AI should identify itself and act when interacting with users.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ai-tone">Communication Tone</Label>
                    <Select 
                      value={aiTone} 
                      onValueChange={setAiTone}
                    >
                      <SelectTrigger id="ai-tone">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-brand-muted">
                      The tone of voice the AI should use when communicating with users.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ai-knowledge">Knowledge Level</Label>
                    <Select 
                      value={aiKnowledgeLevel} 
                      onValueChange={setAiKnowledgeLevel}
                    >
                      <SelectTrigger id="ai-knowledge">
                        <SelectValue placeholder="Select knowledge level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-brand-muted">
                      How detailed and technical the AI's responses should be.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ai-length">Response Length</Label>
                    <Select 
                      value={aiResponseLength} 
                      onValueChange={setAiResponseLength}
                    >
                      <SelectTrigger id="ai-length">
                        <SelectValue placeholder="Select response length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concise">Concise</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-brand-muted">
                      How verbose the AI should be in its responses.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-custom-instructions">Custom AI Instructions</Label>
                    <Textarea
                      id="ai-custom-instructions"
                      value={aiCustomInstructions}
                      onChange={(e) => setAiCustomInstructions(e.target.value)}
                      placeholder="Add any specific instructions for how the AI should behave"
                      className="min-h-[250px]"
                    />
                    <p className="text-xs text-brand-muted">
                      Additional instructions for the AI that will be included in every conversation. 
                      Use this to provide specific guidance on how the AI should represent your brand.
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mt-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">AI Persona Tips</p>
                        <ul className="mt-2 text-sm text-amber-700 space-y-1 list-disc pl-4">
                          <li>Be specific about how the AI should represent your brand's values</li>
                          <li>Include key phrases or terminology the AI should use</li>
                          <li>Specify topics the AI should avoid or emphasize</li>
                          <li>Define how the AI should handle difficult questions</li>
                          <li>Consider including examples of ideal responses</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md border mt-4">
                    <h4 className="font-medium text-sm mb-2">Preview: How your AI will introduce itself</h4>
                    <div className="p-3 bg-white rounded border text-sm">
                      <p className="italic text-gray-600">"Hello! I'm {brandName}'s virtual assistant. {aiPersona.split('.')[0]}. How can I help you today?"</p>
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
      
      {/* Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentTemplate?.id ? "Edit Response Template" : "Add Response Template"}
            </DialogTitle>
            <DialogDescription>
              Create or edit a response template for AI-generated messages.
            </DialogDescription>
          </DialogHeader>
          
          {currentTemplate && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={currentTemplate.name}
                  onChange={(e) => setCurrentTemplate({
                    ...currentTemplate,
                    name: e.target.value
                  })}
                  placeholder="e.g., Standard Response"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Input
                  id="template-description"
                  value={currentTemplate.description}
                  onChange={(e) => setCurrentTemplate({
                    ...currentTemplate,
                    description: e.target.value
                  })}
                  placeholder="e.g., Basic response with greeting and answer"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-content">Template Content</Label>
                <div className="flex items-center space-x-2 text-xs text-brand-muted mb-1">
                  <span>Available variables:</span>
                  <Badge variant="outline" className="font-mono">{{user.name}}</Badge>
                  <Badge variant="outline" className="font-mono">{{response.content}}</Badge>
                  <Badge variant="outline" className="font-mono">{{response.sources}}</Badge>
                </div>
                <Textarea
                  id="template-content"
                  value={currentTemplate.template}
                  onChange={(e) => setCurrentTemplate({
                    ...currentTemplate,
                    template: e.target.value
                  })}
                  placeholder="Hello {{user.name}},\n\n{{response.content}}\n\nIs there anything else I can help with?"
                  className="min-h-[150px] font-mono text-sm"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={currentTemplate.is_active}
                  onCheckedChange={(checked) => setCurrentTemplate({
                    ...currentTemplate,
                    is_active: checked
                  })}
                />
                <Label htmlFor="is-active">Set as active template</Label>
              </div>
              
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-sm text-amber-800">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Important Note</p>
                    <p className="mt-1">Only one template can be active at a time. Setting this template as active will deactivate all other templates.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTemplateDialogOpen(false)}
              disabled={isTemplateLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => currentTemplate && handleSaveTemplate(currentTemplate)}
              disabled={isTemplateLoading || !currentTemplate?.name || !currentTemplate?.template}
              className="bg-brand-primary text-white"
            >
              {isTemplateLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Template"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandingSettings;

// Helper component for the Send icon
const Send = ({ className }: { className?: string }) => (
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
const X = ({ className }: { className?: string }) => (
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
