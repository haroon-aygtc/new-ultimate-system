import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Check, Info, Save, Settings, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
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
  DialogTrigger,
} from "@/components/ui/dialog";

const AIModelSettings = () => {
  const [activeModel, setActiveModel] = useState("gpt-4");
  const [customPrompt, setCustomPrompt] = useState(
    "You are a helpful assistant for our company. Please provide accurate and concise information to our customers.",
  );
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [currentModelConfig, setCurrentModelConfig] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Model configurations
  const [models, setModels] = useState([
    {
      id: "gpt-4",
      name: "GPT-4",
      description: "Most powerful model for complex tasks",
      status: "Active",
      config: {
        temperature: 0.7,
        maxTokens: 2048,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      description: "Fast and cost-effective for most use cases",
      status: "Inactive",
      config: {
        temperature: 0.8,
        maxTokens: 1024,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
    },
    {
      id: "claude-2",
      name: "Claude 2",
      description: "Alternative model with different strengths",
      status: "Static",
      config: {
        temperature: 0.5,
        maxTokens: 1536,
        topP: 0.9,
        frequencyPenalty: 0.1,
        presencePenalty: 0.1,
      },
    },
  ]);

  // Update temperature and maxTokens when active model changes
  useEffect(() => {
    const model = models.find((m) => m.id === activeModel);
    if (model) {
      setTemperature(model.config.temperature);
      setMaxTokens(model.config.maxTokens);
    }
  }, [activeModel, models]);

  // Handle model status change
  const handleStatusChange = (modelId, newStatus) => {
    setModels(
      models.map((model) =>
        model.id === modelId ? { ...model, status: newStatus } : model,
      ),
    );
    setHasChanges(true);
    toast({
      title: "Model status updated",
      description: `${models.find((m) => m.id === modelId)?.name} is now ${newStatus}`,
    });
  };

  // Open configuration dialog for a model
  const openConfigDialog = (modelId) => {
    const model = models.find((m) => m.id === modelId);
    setCurrentModelConfig({ ...model });
    setShowConfigDialog(true);
  };

  // Save model configuration
  const saveModelConfig = () => {
    if (!currentModelConfig) return;

    setModels(
      models.map((model) =>
        model.id === currentModelConfig.id ? { ...currentModelConfig } : model,
      ),
    );

    if (currentModelConfig.id === activeModel) {
      setTemperature(currentModelConfig.config.temperature);
      setMaxTokens(currentModelConfig.config.maxTokens);
    }

    setShowConfigDialog(false);
    setHasChanges(true);
    toast({
      title: "Configuration saved",
      description: `${currentModelConfig.name} configuration has been updated`,
    });
  };

  // Save all changes
  const saveAllChanges = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setHasChanges(false);
      toast({
        title: "Changes saved successfully",
        description: "All AI model configurations have been updated",
      });
    }, 1000);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    // Implementation would reset to original values
    toast({
      title: "Reset to defaults",
      description: "All settings have been reset to their default values",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-brand-primary/10">
        <CardHeader>
          <CardTitle className="text-brand-secondary">
            AI Model Configuration
          </CardTitle>
          <CardDescription className="text-brand-muted">
            Select and configure the AI models used in your chat system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="models">
            <TabsList className="mb-4">
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: "gpt-4",
                    name: "GPT-4",
                    description: "Most powerful model for complex tasks",
                    status: "Active",
                  },
                  {
                    id: "gpt-3.5-turbo",
                    name: "GPT-3.5 Turbo",
                    description: "Fast and cost-effective for most use cases",
                    status: "Inactive",
                  },
                  {
                    id: "claude-2",
                    name: "Claude 2",
                    description: "Alternative model with different strengths",
                    status: "Static",
                  },
                ].map((model) => (
                  <Card
                    key={model.id}
                    className={`border transition-all duration-200 ${activeModel === model.id ? "border-brand-primary shadow-md" : "border-muted hover:border-brand-primary/50"}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base flex items-center">
                          {model.name}
                          {activeModel === model.id && (
                            <Badge className="ml-2 bg-brand-primary text-white text-xs">
                              Active
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={model.status}
                            onValueChange={(value) =>
                              handleStatusChange(model.id, value)
                            }
                          >
                            <SelectTrigger className="w-[110px] h-7 text-xs">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value="Active"
                                className="text-brand-accent"
                              >
                                <span className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-brand-accent mr-2"></span>
                                  Active
                                </span>
                              </SelectItem>
                              <SelectItem
                                value="Inactive"
                                className="text-brand-muted"
                              >
                                <span className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-brand-muted mr-2"></span>
                                  Inactive
                                </span>
                              </SelectItem>
                              <SelectItem
                                value="Static"
                                className="text-yellow-600"
                              >
                                <span className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></span>
                                  Static
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <CardDescription className="text-xs">
                        {model.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs">
                          <span className="text-brand-muted">Temperature:</span>{" "}
                          {model.config.temperature}
                        </div>
                        <div className="text-xs">
                          <span className="text-brand-muted">Max Tokens:</span>{" "}
                          {model.config.maxTokens}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${model.id}-switch`}
                            checked={activeModel === model.id}
                            onCheckedChange={() => {
                              setActiveModel(model.id);
                              setHasChanges(true);
                              toast({
                                title: "Model selected",
                                description: `${model.name} is now the active model`,
                              });
                            }}
                          />
                          <Label
                            htmlFor={`${model.id}-switch`}
                            className="text-xs"
                          >
                            {activeModel === model.id ? "Selected" : "Select"}
                          </Label>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 flex items-center"
                          onClick={() => openConfigDialog(model.id)}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Model Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="temperature">Temperature</Label>
                      <span className="text-sm font-medium bg-brand-light px-2 py-1 rounded">
                        {temperature}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="temperature"
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => {
                          setTemperature(parseFloat(e.target.value));
                          setHasChanges(true);
                        }}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-brand-muted">
                      <span>Precise (0)</span>
                      <span>Balanced (1)</span>
                      <span>Creative (2)</span>
                    </div>
                    <p className="text-xs text-brand-muted mt-1">
                      <Info className="inline h-3 w-3 mr-1" />
                      Controls randomness: Lower values are more deterministic,
                      higher values more creative
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="max-tokens">Max Tokens</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-brand-muted cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">
                              Tokens are pieces of words. 1,000 tokens is about
                              750 words.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="max-tokens"
                      type="number"
                      value={maxTokens}
                      onChange={(e) => {
                        setMaxTokens(parseInt(e.target.value));
                        setHasChanges(true);
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-brand-muted">
                        Maximum length of generated responses
                      </p>
                      <Badge variant="outline" className="text-xs">
                        ~{Math.round(maxTokens * 0.75)} words
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prompts" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="system-prompt"
                    className="text-sm font-medium"
                  >
                    System Prompt
                  </Label>
                  <Textarea
                    id="system-prompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[150px] mt-2"
                    placeholder="Enter a system prompt that defines how the AI should behave"
                  />
                  <p className="text-xs text-brand-muted mt-1">
                    This prompt sets the behavior and personality of the AI
                    assistant
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Prompt Templates
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
                      <Card key={index} className="border border-muted">
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm">
                              {template.name}
                            </CardTitle>
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
                          </div>
                          <CardDescription className="text-xs">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="py-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                          >
                            Use Template
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="knowledge" className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">
                    Knowledge Base Sources
                  </h3>
                  <Button size="sm" className="bg-brand-primary text-white">
                    Add Source
                  </Button>
                </div>

                <div className="border rounded-md divide-y">
                  {[
                    {
                      name: "Product Documentation",
                      type: "Website",
                      url: "https://docs.example.com",
                      status: "Active",
                    },
                    {
                      name: "FAQ Database",
                      type: "CSV",
                      url: "faq_database.csv",
                      status: "Active",
                    },
                    {
                      name: "Support Articles",
                      type: "PDF",
                      url: "support_articles.pdf",
                      status: "Inactive",
                    },
                    {
                      name: "Product Catalog",
                      type: "JSON",
                      url: "product_catalog.json",
                      status: "Active",
                    },
                  ].map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">{source.name}</div>
                        <div className="text-xs text-brand-muted flex items-center space-x-2">
                          <span className="bg-brand-light px-1.5 py-0.5 rounded text-brand-secondary">
                            {source.type}
                          </span>
                          <span>{source.url}</span>
                        </div>
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
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2">
                    Knowledge Base Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="retrieval-method">Retrieval Method</Label>
                      <Select defaultValue="semantic">
                        <SelectTrigger id="retrieval-method">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="semantic">
                            Semantic Search
                          </SelectItem>
                          <SelectItem value="keyword">
                            Keyword Matching
                          </SelectItem>
                          <SelectItem value="hybrid">
                            Hybrid Approach
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="context-length">Context Length</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="context-length">
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">
                            Small (1-2 documents)
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium (3-5 documents)
                          </SelectItem>
                          <SelectItem value="large">
                            Large (6-10 documents)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between space-x-2 border-t pt-4">
          <div>
            {hasChanges && (
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-800 border-yellow-300"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved changes
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button
              className="bg-brand-primary text-white"
              onClick={saveAllChanges}
              disabled={!hasChanges || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </span>
              )}
            </Button>
          </div>
        </CardFooter>

        {/* Model Configuration Dialog */}
        <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Configure {currentModelConfig?.name}</DialogTitle>
              <DialogDescription>
                Adjust the parameters for this AI model. These settings will
                affect how the model generates responses.
              </DialogDescription>
            </DialogHeader>

            {currentModelConfig && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="model-temperature">Temperature</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="model-temperature"
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={currentModelConfig.config.temperature}
                      onChange={(e) =>
                        setCurrentModelConfig({
                          ...currentModelConfig,
                          config: {
                            ...currentModelConfig.config,
                            temperature: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-sm w-8">
                      {currentModelConfig.config.temperature}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model-max-tokens">Max Tokens</Label>
                  <Input
                    id="model-max-tokens"
                    type="number"
                    value={currentModelConfig.config.maxTokens}
                    onChange={(e) =>
                      setCurrentModelConfig({
                        ...currentModelConfig,
                        config: {
                          ...currentModelConfig.config,
                          maxTokens: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model-top-p">Top P</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="model-top-p"
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={currentModelConfig.config.topP}
                      onChange={(e) =>
                        setCurrentModelConfig({
                          ...currentModelConfig,
                          config: {
                            ...currentModelConfig.config,
                            topP: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-sm w-8">
                      {currentModelConfig.config.topP}
                    </span>
                  </div>
                  <p className="text-xs text-brand-muted">
                    Controls diversity via nucleus sampling
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model-frequency-penalty">
                      Frequency Penalty
                    </Label>
                    <Input
                      id="model-frequency-penalty"
                      type="number"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={currentModelConfig.config.frequencyPenalty}
                      onChange={(e) =>
                        setCurrentModelConfig({
                          ...currentModelConfig,
                          config: {
                            ...currentModelConfig.config,
                            frequencyPenalty: parseFloat(e.target.value),
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model-presence-penalty">
                      Presence Penalty
                    </Label>
                    <Input
                      id="model-presence-penalty"
                      type="number"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={currentModelConfig.config.presencePenalty}
                      onChange={(e) =>
                        setCurrentModelConfig({
                          ...currentModelConfig,
                          config: {
                            ...currentModelConfig.config,
                            presencePenalty: parseFloat(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfigDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={saveModelConfig}
                className="bg-brand-primary text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default AIModelSettings;
