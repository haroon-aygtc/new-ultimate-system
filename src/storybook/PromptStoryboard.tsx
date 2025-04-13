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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, Plus, Settings, Trash2 } from "lucide-react";

export default function PromptStoryboard() {
  // Sample prompts data
  const prompts = [
    {
      id: "1",
      title: "Customer Support Assistant",
      description:
        "Handles common customer inquiries and provides helpful responses",
      status: "active",
      follow_up_questions: [{ id: "1" }, { id: "2" }],
    },
    {
      id: "2",
      title: "Product Recommendation",
      description:
        "Suggests products based on user preferences and browsing history",
      status: "active",
      follow_up_questions: [{ id: "3" }],
    },
    {
      id: "3",
      title: "Technical Support",
      description:
        "Provides technical troubleshooting and guides users through common issues",
      status: "inactive",
      follow_up_questions: [],
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Prompts</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Prompt
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Prompts</CardTitle>
          <CardDescription>
            Configure and manage prompts for your AI models.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title or description..."
                className="pl-8"
              />
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Prompts</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="static">Static</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
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
                        {prompt.description && (
                          <p className="text-sm text-muted-foreground">
                            {prompt.description}
                          </p>
                        )}
                        <div className="flex items-center text-xs text-muted-foreground">
                          {prompt.follow_up_questions.length > 0 ? (
                            <span>
                              {prompt.follow_up_questions.length} follow-up
                              questions
                            </span>
                          ) : (
                            <span>No follow-up questions</span>
                          )}
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
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
