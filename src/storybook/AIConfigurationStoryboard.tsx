import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  MessageSquare,
  Book,
  FileText,
  Settings,
  Paintbrush,
  ArrowRight,
  Check,
  Edit,
  Plus,
} from "lucide-react";

const AIConfigurationStoryboard = () => {
  const [activeTab, setActiveTab] = useState("models");

  // Mock data for AI models
  const mockModels = [
    {
      id: "1",
      name: "GPT-4 Turbo",
      provider: "openai",
      model_id: "gpt-4-turbo",
      description: "Latest GPT-4 model with improved performance",
      status: "active",
    },
    {
      id: "2",
      name: "Claude 3 Opus",
      provider: "anthropic",
      model_id: "claude-3-opus-20240229",
      description: "Most powerful Claude model for complex tasks",
      status: "inactive",
    },
  ];

  // Mock data for prompts
  const mockPrompts = [
    {
      id: "1",
      title: "Customer Support Assistant",
      description:
        "Handles common customer inquiries and provides helpful responses",
      model_id: "1",
      status: "active",
      follow_up_questions: 3,
    },
    {
      id: "2",
      title: "Product Recommendation",
      description: "Suggests products based on user preferences",
      model_id: "1",
      status: "active",
      follow_up_questions: 2,
    },
  ];

  // Mock data for knowledge bases
  const mockKnowledgeBases = [
    {
      id: "1",
      name: "Product Documentation",
      description: "Official documentation for our product features and usage",
      status: "active",
      documents: 5,
    },
    {
      id: "2",
      name: "FAQ Knowledge Base",
      description: "Frequently asked questions and answers",
      status: "active",
      documents: 12,
    },
  ];

  // Mock data for response formats
  const mockResponseFormats = [
    {
      id: "1",
      name: "Standard Response",
      description: "Basic response with greeting and answer",
      template:
        "Hello {{user.name}},\n\n{{response.content}}\n\nIs there anything else I can help with?",
      isActive: true,
    },
    {
      id: "2",
      name: "Detailed Response",
      description: "Comprehensive response with sources",
      template:
        "Hello {{user.name}},\n\n{{response.content}}\n\nSources: {{response.sources}}\n\nPlease let me know if you need more information.",
      isActive: false,
    },
  ];

  // Mock data for branding settings
  const mockBranding = {
    primary_color: "#4A6FA5",
    secondary_color: "#2D3748",
    accent_color: "#38B2AC",
    logo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=GuestApp",
    brand_name: "GuestApp",
    tagline: "Intelligent Customer Support",
    widget_title: "Chat with us",
    welcome_message: "Hello! How can we assist you today?",
    widget_position: "bottom-right",
  };

  // Helper function for status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-amber-100 text-amber-800">Inactive</Badge>;
      case "static":
        return <Badge className="bg-blue-100 text-blue-800">Static</Badge>;
      default:
        return null;
    }
  };

  // Helper function for provider badges
  const getProviderBadge = (provider) => {
    switch (provider) {
      case "openai":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200"
          >
            OpenAI
          </Badge>
        );
      case "anthropic":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Anthropic
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6 bg-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Configuration System</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Configuration
        </Button>
      </div>

      <Card className="bg-white rounded-lg shadow-sm border-brand-primary/10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <div className="container flex overflow-auto">
              <TabsList className="h-14 bg-transparent p-0">
                <TabsTrigger
                  value="models"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  AI Models
                </TabsTrigger>
                <TabsTrigger
                  value="prompts"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Prompts
                </TabsTrigger>
                <TabsTrigger
                  value="knowledge"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <Book className="h-4 w-4 mr-2" />
                  Knowledge Base
                </TabsTrigger>
                <TabsTrigger
                  value="responses"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Response Formats
                </TabsTrigger>
                <TabsTrigger
                  value="branding"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <Paintbrush className="h-4 w-4 mr-2" />
                  Branding
                </TabsTrigger>
                <TabsTrigger
                  value="flow"
                  className="data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none border-b-2 border-transparent px-4 py-3 font-medium"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configuration Flow
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <CardContent className="p-6">
            {/* AI Models Tab */}
            <TabsContent value="models" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockModels.map((model) => (
                  <Card key={model.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{model.name}</h3>
                        </div>
                        {getStatusBadge(model.status)}
                      </div>

                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            Provider:
                          </span>
                          {getProviderBadge(model.provider)}
                        </div>
                        <p className="text-sm">
                          <span className="text-muted-foreground">
                            Model ID:
                          </span>{" "}
                          {model.model_id}
                        </p>
                        {model.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {model.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-muted/20 p-3 flex justify-between items-center">
                      <div className="space-x-1">
                        {model.status !== "active" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            Activate
                          </Button>
                        )}
                        {model.status === "active" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          >
                            Deactivate
                          </Button>
                        )}
                      </div>

                      <div className="space-x-1">
                        <Button size="sm" variant="ghost">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Prompts Tab */}
            <TabsContent value="prompts" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPrompts.map((prompt) => (
                  <Card key={prompt.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{prompt.title}</h3>
                        </div>
                        {getStatusBadge(prompt.status)}
                      </div>

                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {prompt.description}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span className="flex items-center">
                            <Bot className="h-3 w-3 mr-1" />
                            Model:{" "}
                            {
                              mockModels.find((m) => m.id === prompt.model_id)
                                ?.name
                            }
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            {prompt.follow_up_questions} follow-up questions
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/20 p-3 flex justify-between items-center">
                      <div className="space-x-1">
                        {prompt.status !== "active" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            Activate
                          </Button>
                        )}
                        {prompt.status === "active" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          >
                            Deactivate
                          </Button>
                        )}
                      </div>

                      <div className="space-x-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Knowledge Base Tab */}
            <TabsContent value="knowledge" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockKnowledgeBases.map((kb) => (
                  <Card key={kb.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <Book className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{kb.name}</h3>
                        </div>
                        {getStatusBadge(kb.status)}
                      </div>

                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {kb.description}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <FileText className="h-3 w-3 mr-1" />
                          {kb.documents} documents
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/20 p-3 flex justify-between items-center">
                      <div className="space-x-1">
                        {kb.status !== "active" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            Activate
                          </Button>
                        )}
                        {kb.status === "active" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          >
                            Deactivate
                          </Button>
                        )}
                      </div>

                      <div className="space-x-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Response Formats Tab */}
            <TabsContent value="responses" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockResponseFormats.map((template, index) => (
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
                          variant={template.isActive ? "default" : "outline"}
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
            </TabsContent>

            {/* Branding Tab */}
            <TabsContent value="branding" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Branding Preview</CardTitle>
                    <CardDescription>
                      How your chat widget will appear to users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                        <img
                          src={mockBranding.logo_url}
                          alt="Brand Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <h3
                          className="font-bold text-lg"
                          style={{ color: mockBranding.primary_color }}
                        >
                          {mockBranding.brand_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {mockBranding.tagline}
                        </p>
                      </div>
                      <div
                        className="w-full max-w-xs rounded-lg p-4 text-white"
                        style={{ backgroundColor: mockBranding.primary_color }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            {mockBranding.widget_title}
                          </span>
                        </div>
                        <p className="text-sm opacity-90">
                          {mockBranding.welcome_message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Branding Settings</CardTitle>
                    <CardDescription>
                      Customize the appearance of your chat widget
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Colors</h4>
                        <div className="flex space-x-2">
                          <div className="flex flex-col items-center">
                            <div
                              className="w-8 h-8 rounded-full"
                              style={{
                                backgroundColor: mockBranding.primary_color,
                              }}
                            ></div>
                            <span className="text-xs mt-1">Primary</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-8 h-8 rounded-full"
                              style={{
                                backgroundColor: mockBranding.secondary_color,
                              }}
                            ></div>
                            <span className="text-xs mt-1">Secondary</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-8 h-8 rounded-full"
                              style={{
                                backgroundColor: mockBranding.accent_color,
                              }}
                            ></div>
                            <span className="text-xs mt-1">Accent</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Widget Position
                        </h4>
                        <Badge variant="outline">
                          {mockBranding.widget_position === "bottom-right"
                            ? "Bottom Right"
                            : "Bottom Left"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="ml-auto">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Branding
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Configuration Flow Tab */}
            <TabsContent value="flow" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>AI Configuration Flow</CardTitle>
                  <CardDescription>
                    How the different components work together to generate
                    responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                          <Bot className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-medium">AI Model</h3>
                        <p className="text-xs text-muted-foreground">
                          Processes user input
                        </p>
                      </div>

                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                      </div>

                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                          <MessageSquare className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="font-medium">Prompt</h3>
                        <p className="text-xs text-muted-foreground">
                          Guides the AI response
                        </p>
                      </div>

                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                      </div>

                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <Book className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-medium">Knowledge Base</h3>
                        <p className="text-xs text-muted-foreground">
                          Provides context
                        </p>
                      </div>
                    </div>

                    <div className="h-8 border-l-2 border-dashed border-muted-foreground/30"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                          <FileText className="h-8 w-8 text-amber-600" />
                        </div>
                        <h3 className="font-medium">Response Format</h3>
                        <p className="text-xs text-muted-foreground">
                          Structures the response
                        </p>
                      </div>

                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                      </div>

                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                          <Paintbrush className="h-8 w-8 text-pink-600" />
                        </div>
                        <h3 className="font-medium">Branding</h3>
                        <p className="text-xs text-muted-foreground">
                          Applies visual styling
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AIConfigurationStoryboard;
