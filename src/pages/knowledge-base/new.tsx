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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, Book, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createKnowledgeBase } from "@/services/knowledgeBaseService";
import { KnowledgeBaseDocument } from "@/types";
import Layout from "@/components/Layout";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "static"]),
});

const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  source_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;
type DocumentFormValues = z.infer<typeof documentSchema>;

const NewKnowledgeBase = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<Partial<KnowledgeBaseDocument>[]>(
    [],
  );
  const [currentDocument, setCurrentDocument] = useState<
    Partial<DocumentFormValues>
  >({
    title: "",
    content: "",
    source_url: "",
  });
  const [documentError, setDocumentError] = useState<Record<string, string>>(
    {},
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "inactive",
    },
  });

  const validateDocument = () => {
    const result = documentSchema.safeParse(currentDocument);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        errors[error.path[0]] = error.message;
      });
      setDocumentError(errors);
      return false;
    }
    setDocumentError({});
    return true;
  };

  const handleAddDocument = () => {
    if (!validateDocument()) return;

    setDocuments([...documents, { ...currentDocument }]);
    setCurrentDocument({ title: "", content: "", source_url: "" });
  };

  const handleRemoveDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const kbData = {
        ...data,
        documents,
      };

      const { success, error, knowledgeBase } =
        await createKnowledgeBase(kbData);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Knowledge base created successfully.",
      });

      // Navigate to the knowledge base detail page
      navigate(`/knowledge-base/${knowledgeBase?.id || ""}`);
    } catch (error) {
      console.error("Error creating knowledge base:", error);
      toast({
        title: "Error",
        description: "Failed to create knowledge base. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-2"
            onClick={() => navigate("/knowledge-base")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center">
            <Book className="h-5 w-5 text-primary mr-2" />
            <h1 className="text-3xl font-bold">Create Knowledge Base</h1>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Configure the basic settings for your knowledge base.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Product Documentation"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormDescription>
                              A descriptive name for this knowledge base
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
                              Set the initial status of this knowledge base
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
                              placeholder="A brief description of this knowledge base"
                              className="resize-none"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional description of this knowledge base
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>
                      Add documents to your knowledge base.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Document Title
                          </label>
                          <Input
                            placeholder="Getting Started Guide"
                            value={currentDocument.title}
                            onChange={(e) =>
                              setCurrentDocument({
                                ...currentDocument,
                                title: e.target.value,
                              })
                            }
                            className={
                              documentError.title ? "border-red-500" : ""
                            }
                          />
                          {documentError.title && (
                            <p className="text-sm text-red-500 mt-1">
                              {documentError.title}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Source URL (Optional)
                          </label>
                          <Input
                            placeholder="https://example.com/docs"
                            value={currentDocument.source_url}
                            onChange={(e) =>
                              setCurrentDocument({
                                ...currentDocument,
                                source_url: e.target.value,
                              })
                            }
                            className={
                              documentError.source_url ? "border-red-500" : ""
                            }
                          />
                          {documentError.source_url && (
                            <p className="text-sm text-red-500 mt-1">
                              {documentError.source_url}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Document Content
                        </label>
                        <Textarea
                          placeholder="Enter the document content here..."
                          className={`min-h-32 ${documentError.content ? "border-red-500" : ""}`}
                          value={currentDocument.content}
                          onChange={(e) =>
                            setCurrentDocument({
                              ...currentDocument,
                              content: e.target.value,
                            })
                          }
                        />
                        {documentError.content && (
                          <p className="text-sm text-red-500 mt-1">
                            {documentError.content}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={handleAddDocument}
                          disabled={isSubmitting}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Document
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">
                        Added Documents ({documents.length})
                      </h3>
                      {documents.length === 0 ? (
                        <div className="text-center py-6 border rounded-md bg-muted/10">
                          <p className="text-muted-foreground">
                            No documents added yet.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {documents.map((doc, index) => (
                            <div
                              key={index}
                              className="border rounded-md p-4 relative"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveDocument(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <h4 className="font-medium">{doc.title}</h4>
                              {doc.source_url && (
                                <p className="text-sm text-blue-500 hover:underline">
                                  <a
                                    href={doc.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {doc.source_url}
                                  </a>
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground mt-2">
                                {doc.content && doc.content.length > 100
                                  ? `${doc.content.substring(0, 100)}...`
                                  : doc.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/knowledge-base")}
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
                    "Create Knowledge Base"
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

export default NewKnowledgeBase;
