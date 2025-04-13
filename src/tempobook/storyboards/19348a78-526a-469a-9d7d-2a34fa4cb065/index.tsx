import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Book, MessageSquare, Settings, Trash2, Plus } from "lucide-react";

export default function AIIntegrationDashboard() {
  // Sample data
  const aiModels = [
    {
      id: "1",
      name: "GPT-4",
      provider: "openai",
      model_id: "gpt-4",
      status: "active",
    },
    {
      id: "2",
      name: "Claude 3 Opus",
      provider: "anthropic",
      model_id: "claude-3-opus-20240229",
      status: "inactive",
    },
    {
      id: "3",
      name: "Gemini Pro",
      provider: "google",
      model_id: "gemini-pro",
      status: "static",
    },
  ];

  const prompts = [
    {
      id: "1",
      title: "Customer Support Assistant",
      description: "Handles common customer inquiries",
      status: "active",
    },
    {
      id: "2",
      title: "Product Recommendation",
      description: "Suggests products based on user preferences",
      status: "active",
    },
    {
      id: "3",
      title: "Technical Support",
      description: "Provides technical troubleshooting",
      status: "inactive",
    },
  ];

  const knowledgeBases = [
    {
      id: "1",
      name: "Product Documentation",
      description: "Official documentation for our products",
      status: "active",
      documents: [{ id: "1" }, { id: "2" }],
    },
    {
      id: "2",
      name: "FAQ Knowledge Base",
      description: "Frequently asked questions",
      status: "active",
      documents: [{ id: "3" }],
    },
  ];

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

  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">AI Integration Dashboard</h1>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">AI Models</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Model
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiModels.map((model) => (
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
                    <p className="text-sm text-muted-foreground">
                      Provider: {model.provider}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Model ID: {model.model_id}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/20 p-3 flex justify-between items-center">
                  <div className="space-x-1">
                    {model.status !== "active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-600"
                      >
                        Activate
                      </Button>
                    )}
                    {model.status === "active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-amber-600"
                      >
                        Deactivate
                      </Button>
                    )}
                  </div>

                  <div className="space-x-1">
                    <Button size="sm" variant="ghost">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prompts">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Prompts</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Prompt
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompts.map((prompt) => (
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
                  </div>
                </div>

                <div className="bg-muted/20 p-3 flex justify-between items-center">
                  <div className="space-x-1">
                    {prompt.status !== "active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-600"
                      >
                        Activate
                      </Button>
                    )}
                    {prompt.status === "active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-amber-600"
                      >
                        Deactivate
                      </Button>
                    )}
                  </div>

                  <div className="space-x-1">
                    <Button size="sm" variant="ghost">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="knowledge">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Knowledge Bases</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledge Base
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {knowledgeBases.map((kb) => (
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
                    <p className="text-xs text-muted-foreground">
                      {kb.documents.length} documents
                    </p>
                  </div>
                </div>

                <div className="bg-muted/20 p-3 flex justify-between items-center">
                  <div className="space-x-1">
                    {kb.status !== "active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-600"
                      >
                        Activate
                      </Button>
                    )}
                    {kb.status === "active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-amber-600"
                      >
                        Deactivate
                      </Button>
                    )}
                  </div>

                  <div className="space-x-1">
                    <Button size="sm" variant="ghost">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
