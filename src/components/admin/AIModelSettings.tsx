import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Bot, Settings, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getAIModels,
  updateAIModelStatus,
  deleteAIModel,
} from "@/services/aiModelService";
import { AIModel } from "@/types";

const AIModelSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [models, setModels] = useState<AIModel[]>([]);

  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await getAIModels();
        if (error) throw error;
        if (data) setModels(data);
      } catch (error) {
        console.error("Error loading AI models:", error);
        toast({
          title: "Error",
          description: "Could not load AI models. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, [toast]);

  const handleStatusChange = async (
    id: string,
    status: "static" | "active" | "inactive",
  ) => {
    try {
      const { success, error } = await updateAIModelStatus(id, status);
      if (error) throw error;
      if (success) {
        setModels(
          models.map((model) =>
            model.id === id ? { ...model, status } : model,
          ),
        );
        toast({
          title: "Status Updated",
          description: `Model status changed to ${status}.`,
        });
      }
    } catch (error) {
      console.error("Error updating model status:", error);
      toast({
        title: "Error",
        description: "Could not update model status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteModel = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this model? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const { success, error } = await deleteAIModel(id);
      if (error) throw error;
      if (success) {
        setModels(models.filter((model) => model.id !== id));
        toast({
          title: "Model Deleted",
          description: "The AI model has been deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting model:", error);
      toast({
        title: "Error",
        description: "Could not delete the model. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case "openai":
        return "OpenAI";
      case "anthropic":
        return "Anthropic";
      case "google":
        return "Google";
      case "custom":
        return "Custom";
      default:
        return provider;
    }
  };

  const getStatusBadge = (status: string) => {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">AI Models</h2>
        <Button onClick={() => navigate("/ai-models/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Model
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Models</CardTitle>
          <CardDescription>
            Configure and manage AI models for your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading models...
              </span>
            </div>
          ) : models.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">No models found.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/ai-models/new")}
              >
                Add your first model
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Model ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4 text-primary" />
                          <span className="font-medium">{model.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getProviderLabel(model.provider)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {model.model_id}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(model.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/ai-models/${model.id}`)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteModel(model.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModelSettings;
