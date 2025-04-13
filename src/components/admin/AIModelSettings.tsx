import React, { useState } from "react";
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

const AIModelSettings = () => {
  const [activeModel, setActiveModel] = useState("gpt-4");
  const [customPrompt, setCustomPrompt] = useState(
    "You are a helpful assistant for our company. Please provide accurate and concise information to our customers.",
  );

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
                    className={`border ${activeModel === model.id ? "border-brand-primary" : "border-muted"}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">
                          {model.name}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={
                            model.status === "Active"
                              ? "bg-brand-accent/20 text-brand-accent"
                              : model.status === "Inactive"
                                ? "bg-brand-muted/20 text-brand-muted"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {model.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {model.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${model.id}-switch`}
                            checked={activeModel === model.id}
                            onCheckedChange={() => setActiveModel(model.id)}
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
                          className="text-xs h-7"
                        >
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
                    <Label htmlFor="temperature">Temperature</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="temperature"
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        defaultValue="0.7"
                        className="w-full"
                      />
                      <span className="text-sm w-8">0.7</span>
                    </div>
                    <p className="text-xs text-brand-muted">
                      Controls randomness: Lower values are more deterministic,
                      higher values more creative
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-tokens">Max Tokens</Label>
                    <Input id="max-tokens" type="number" defaultValue="1024" />
                    <p className="text-xs text-brand-muted">
                      Maximum number of tokens to generate in the response
                    </p>
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
        <CardFooter className="flex justify-end space-x-2 border-t pt-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button className="bg-brand-primary text-white">
            Save Configuration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIModelSettings;
