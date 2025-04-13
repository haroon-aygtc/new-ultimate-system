import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Settings, Trash2 } from "lucide-react";

const AIModelStoryboard = () => {
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
    {
      id: "3",
      name: "Gemini Pro",
      provider: "google",
      model_id: "gemini-pro",
      description: "Google's multimodal AI model",
      status: "static",
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
      case "google":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Google
          </Badge>
        );
      case "custom":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Custom
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6 bg-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Models</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage AI Models</CardTitle>
          <CardDescription>
            Configure and manage AI models for your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <span className="text-muted-foreground">Model ID:</span>{" "}
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
                    {model.status !== "inactive" &&
                      model.status !== "static" && (
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModelStoryboard;
