import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Bot, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getAIModel,
  updateAIModel,
  testAIModel,
} from "@/services/aiModelService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/Layout";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  provider: z.enum(["openai", "anthropic", "google", "custom"]),
  model_id: z.string().min(1, "Model ID is required"),
  api_key: z.string().optional(),
  endpoint: z.string().optional(),
  status: z.enum(["active", "inactive", "static"]),
  description: z.string().optional(),
  max_tokens: z.coerce.number().int().positive().optional(),
  temperature: z.coerce
    .number()
    .min(0, "Temperature must be at least 0")
    .max(2, "Temperature must be at most 2")
    .optional(),
});

const testFormSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

type FormValues = z.infer<typeof formSchema>;
type TestFormValues = z.infer<typeof testFormSchema>;

const AIModelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      provider: "openai",
      model_id: "",
      api_key: "",
      endpoint: "",
      status: "inactive",
      description: "",
      max_tokens: 1024,
      temperature: 0.7,
    },
  });

  const testForm = useForm<TestFormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      prompt: "Explain what an AI model is in one paragraph.",
    },
  });

  useEffect(() => {
    const loadModel = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const { data, error } = await getAIModel(id);
        if (error) throw error;
        if (data) {
          // Reset form with model data
          form.reset({
            name: data.name,
            provider: data.provider as any,
            model_id: data.model_id,
            api_key: data.api_key || "",
            endpoint: data.endpoint || "",
            status: data.status as any,
            description: data.description || "",
            max_tokens: data.max_tokens || 1024,
            temperature: data.temperature || 0.7,
          });
        }
      } catch (error) {
        console.error("Error loading AI model:", error);
        toast({
          title: "Error",
          description: "Could not load AI model. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, [id, toast, form]);

  const onSubmit = async (data: FormValues) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const { success, error } = await updateAIModel(id, data);
      if (error) throw error;

      toast({
        title: "Success",
        description: "AI model updated successfully.",
      });
    } catch (error) {
      console.error("Error updating AI model:", error);
      toast({
        title: "Error",
        description: "Failed to update AI model. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onTestSubmit = async (data: TestFormValues) => {
    if (!id) return;

    setIsTesting(true);
    setTestResult(null);
    setTestError(null);

    try {
      const { data: responseData, error } = await testAIModel(id, data.prompt);
      if (error) throw error;

      setTestResult(responseData?.response || "No response received");
    } catch (error: any) {
      console.error("Error testing AI model:", error);
      setTestError(error.message || "Failed to test AI model");
    } finally {
      setIsTesting(false);
    }
  };

  const watchProvider = form.watch("provider");

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading model details...</p>
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
            onClick={() => navigate("/ai-models")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center">
            <Bot className="h-5 w-5 text-primary mr-2" />
            <h1 className="text-3xl font-bold">{form.getValues().name}</h1>
          </div>
          <Badge
            className={`ml-4 ${getStatusBadgeClass(form.getValues().status)}`}
          >
            {form.getValues().status.charAt(0).toUpperCase() +
              form.getValues().status.slice(1)}
          </Badge>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="test">Test Model</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Model Settings</CardTitle>
                <CardDescription>
                  Configure your AI model settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="GPT-4 Turbo"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormDescription>
                              A friendly name for this model
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="provider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provider</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a provider" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="openai">OpenAI</SelectItem>
                                <SelectItem value="anthropic">
                                  Anthropic
                                </SelectItem>
                                <SelectItem value="google">Google</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The AI provider for this model
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="model_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={getModelIdPlaceholder(
                                  watchProvider,
                                )}
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormDescription>
                              The specific model identifier
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
                              Set the status of this model
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {watchProvider === "custom" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="endpoint"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Endpoint</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://api.example.com/v1/completions"
                                  {...field}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormDescription>
                                The API endpoint for this custom model
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="api_key"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Key</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="sk_..."
                                  {...field}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormDescription>
                                Your API key for this model (stored securely)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="max_tokens"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Tokens</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum number of tokens to generate
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="temperature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temperature</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormDescription>
                              Controls randomness (0-2, lower is more
                              deterministic)
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
                              placeholder="Describe this model and its capabilities"
                              className="resize-none"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional description of this model
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/ai-models")}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Test Model</CardTitle>
                <CardDescription>
                  Test your AI model with a sample prompt.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...testForm}>
                  <form
                    onSubmit={testForm.handleSubmit(onTestSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={testForm.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Test Prompt</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter a prompt to test the model"
                              className="min-h-32"
                              {...field}
                              disabled={isTesting}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter a prompt to test how the model responds
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isTesting}>
                        {isTesting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          "Run Test"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>

                {testError && (
                  <Alert
                    variant="destructive"
                    className="mt-6 border-destructive/50"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>{testError}</AlertDescription>
                  </Alert>
                )}

                {testResult && (
                  <div className="mt-6 space-y-2">
                    <h3 className="text-lg font-medium">Model Response:</h3>
                    <div className="p-4 border rounded-md bg-muted/20 whitespace-pre-wrap">
                      {testResult}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

function getModelIdPlaceholder(provider: string): string {
  switch (provider) {
    case "openai":
      return "gpt-4-turbo";
    case "anthropic":
      return "claude-3-opus-20240229";
    case "google":
      return "gemini-pro";
    case "custom":
      return "custom-model-id";
    default:
      return "model-id";
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-amber-100 text-amber-800";
    case "static":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default AIModelDetail;
