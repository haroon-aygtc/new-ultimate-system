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
import { Bot, Book, MessageSquare, Settings, Trash2 } from "lucide-react";

export default function AIIntegrationDashboardStoryboard() {
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

      <Tabs defaultValue="models">
        <TabsList className="mb-4">
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Bases</TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>AI Models</CardTitle>
                <Button size="sm">Add Model</Button>
              </div>
              <CardDescription>
                Configure and manage AI models for your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {model.provider} / {model.model_id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(model.status)}
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Prompts</CardTitle>
                <Button size="sm">Create Prompt</Button>
              </div>
              <CardDescription>
                Design and manage prompts for different use cases.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{prompt.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {prompt.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(prompt.status)}
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Knowledge Bases</CardTitle>
                <Button size="sm">Add Knowledge Base</Button>
              </div>
              <CardDescription>
                Manage knowledge bases to enhance AI responses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {knowledgeBases.map((kb) => (
                  <div
                    key={kb.id}
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Book className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{kb.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {kb.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {kb.documents.length} documents
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(kb.status)}
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
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
