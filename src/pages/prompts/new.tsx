import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createPrompt } from "@/services/promptService";
import { getAIModels } from "@/services/aiModelService";
import { getKnowledgeBases } from "@/services/knowledgeBaseService";
import { AIModel, KnowledgeBase, FollowUpQuestion } from "@/types";
import Layout from "@/components/Layout";
import FollowUpQuestionManager from "@/components/admin/FollowUpQuestionManager";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Prompt content must be at least 10 characters"),
  model_id: z.string().min(1, "AI model is required"),
  status: z.enum(["active", "inactive", "static"]),
  description: z.string().optional(),
  system_prompt: z.string().optional(),
  knowledge_base_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewPrompt = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [models, setModels] = useState<AIModel[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<
    FollowUpQuestion[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      model_id: "",
      status: "inactive",
      description: "",
      system_prompt: "",
      knowledge_base_id: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load AI models
        const { data: modelsData, error: modelsError } = await getAIModels();
        if (modelsError) throw modelsError;
        if (modelsData) setModels(modelsData);

        // Load knowledge bases
        const { data: kbData, error: kbError } = await getKnowledgeBases();
        if (kbError) throw kbError;
        if (kbData) setKnowledgeBases(kbData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Could not load required data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const promptData = {
        ...data,
        follow_up_questions: followUpQuestions,
      };

      const { success, error, prompt } = await createPrompt(promptData);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Prompt created successfully.",
      });

      // Navigate to the prompt detail page
      navigate(`/prompts/${prompt?.id || ""}`);
    } catch (error) {
      console.error("Error creating prompt:", error);
      toast({
        title: "Error",
        description: "Failed to create prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-2"
            onClick={() => navigate("/prompts")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-primary mr-2" />
            <h1 className="text-3xl font-bold">Create New Prompt</h1>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            <TabsTrigger value="followup">Follow-up Questions</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Configure the basic settings for your prompt.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prompt Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Customer Support Assistant"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormDescription>
                              A descriptive name for this prompt
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                  Inactive
                                </SelectItem>
                                <SelectItem value="static">Static</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Set the initial status of this prompt
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="A brief description of what this prompt does"
                              className="resize-none"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional description of this prompt
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="model_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI Model</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an AI model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {models.length === 0 ? (
                                <SelectItem value="" disabled>
                                  No models available
                                </SelectItem>
                              ) : (
                                models.map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    {model.name} ({model.provider})
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the AI model to use for this prompt
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prompt Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your prompt content here..."
                              className="min-h-32"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormDescription>
                            The main content of your prompt that will be sent to
                            the AI model
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                    <CardDescription>
                      Configure advanced settings for your prompt.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="system_prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>System Prompt</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="You are a helpful assistant..."
                              className="min-h-32"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional system instructions for the AI model
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="knowledge_base_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Knowledge Base</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a knowledge base (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              {knowledgeBases.map((kb) => (
                                <SelectItem key={kb.id} value={kb.id}>
                                  {kb.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Optionally link this prompt to a knowledge base
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="followup">
                <FollowUpQuestionManager
                  questions={followUpQuestions}
                  onChange={setFollowUpQuestions}
                />
              </TabsContent>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/prompts")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Prompt"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NewPrompt;
