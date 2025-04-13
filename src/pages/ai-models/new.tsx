import React, { useState } from "react";
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
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createAIModel } from "@/services/aiModelService";
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

type FormValues = z.infer<typeof formSchema>;

const NewAIModel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const { success, error, model } = await createAIModel(data);
      if (error) throw error;

      toast({
        title: "Success",
        description: "AI model created successfully.",
      });

      // Navigate to the model detail page or back to the list
      navigate(`/ai-models/${model?.id || ""}`);
    } catch (error) {
      console.error("Error creating AI model:", error);
      toast({
        title: "Error",
        description: "Failed to create AI model. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchProvider = form.watch("provider");

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
          <h1 className="text-3xl font-bold">Add AI Model</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New AI Model</CardTitle>
            <CardDescription>
              Configure a new AI model for your application.
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
                            <SelectItem value="anthropic">Anthropic</SelectItem>
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
                            placeholder={getModelIdPlaceholder(watchProvider)}
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
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="static">Static</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Set the initial status of this model
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
                          Controls randomness (0-2, lower is more deterministic)
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
                        Creating...
                      </>
                    ) : (
                      "Create Model"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
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

export default NewAIModel;
