import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Save,
  Trash2,
  FileText,
  Upload,
  Plus,
  Book,
  Link,
  ExternalLink,
  Search,
} from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/lib/supabaseClient";

const KnowledgeBaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState({
    id: "",
    name: "",
    description: "",
    status: "inactive",
    created_at: "",
    updated_at: "",
  });
  const [documents, setDocuments] = useState([]);
  const [newDocument, setNewDocument] = useState({
    title: "",
    content: "",
    source_url: "",
  });

  useEffect(() => {
    if (id) {
      fetchKnowledgeBase();
      fetchDocuments();
    }
  }, [id]);

  const fetchKnowledgeBase = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("knowledge_bases")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) setKnowledgeBase(data);
    } catch (error) {
      console.error("Error fetching knowledge base:", error);
      toast({
        title: "Error",
        description: "Could not load knowledge base. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("knowledge_base_documents")
        .select("*")
        .eq("knowledge_base_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Could not load documents. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKnowledgeBase((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (status) => {
    try {
      const { error } = await supabase
        .from("knowledge_bases")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setKnowledgeBase((prev) => ({ ...prev, status }));
      toast({
        title: "Status Updated",
        description: `Knowledge base status changed to ${status}.`,
      });
    } catch (error) {
      console.error("Error updating knowledge base status:", error);
      toast({
        title: "Error",
        description: "Could not update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    // Validate inputs
    if (!knowledgeBase.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("knowledge_bases")
        .update({
          name: knowledgeBase.name,
          description: knowledgeBase.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Knowledge base updated successfully.",
      });
    } catch (error) {
      console.error("Error updating knowledge base:", error);
      toast({
        title: "Error",
        description: "Could not update knowledge base. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this knowledge base? This will also delete all associated documents. This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("knowledge_bases")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Knowledge base deleted successfully.",
      });
      navigate("/knowledge-base");
    } catch (error) {
      console.error("Error deleting knowledge base:", error);
      toast({
        title: "Error",
        description: "Could not delete knowledge base. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleAddDocument = async () => {
    // Validate inputs
    if (!newDocument.title.trim()) {
      toast({
        title: "Error",
        description: "Document title is required.",
        variant: "destructive",
      });
      return;
    }

    if (!newDocument.content.trim()) {
      toast({
        title: "Error",
        description: "Document content is required.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { error } = await supabase.from("knowledge_base_documents").insert([
        {
          knowledge_base_id: id,
          title: newDocument.title,
          content: newDocument.content,
          source_url: newDocument.source_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document added successfully.",
      });

      // Reset form and refresh documents
      setNewDocument({
        title: "",
        content: "",
        source_url: "",
      });
      fetchDocuments();
    } catch (error) {
      console.error("Error adding document:", error);
      toast({
        title: "Error",
        description: "Could not add document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (
      !confirm(
        "Are you sure you want to delete this document? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("knowledge_base_documents")
        .delete()
        .eq("id", documentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully.",
      });

      // Refresh documents
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Could not delete document. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  const filteredDocuments = documents.filter((doc) => {
    if (!searchQuery) return true;
    return (
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/knowledge-base")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">
              {isLoading ? "Loading..." : knowledgeBase.name}
            </h1>
            {!isLoading && getStatusBadge(knowledgeBase.status)}
          </div>

          <div className="flex items-center space-x-2">
            {knowledgeBase.status !== "active" && (
              <Button
                variant="outline"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleStatusChange("active")}
                disabled={isLoading || isSaving}
              >
                Activate
              </Button>
            )}
            {knowledgeBase.status === "active" && (
              <Button
                variant="outline"
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                onClick={() => handleStatusChange("inactive")}
                disabled={isLoading || isSaving}
              >
                Deactivate
              </Button>
            )}
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
              disabled={isLoading || isSaving}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button onClick={handleSave} disabled={isLoading || isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-2 text-muted-foreground">
              Loading knowledge base...
            </span>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="general">
                <Book className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="add-document">
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base Details</CardTitle>
                  <CardDescription>
                    Configure the basic information for this knowledge base.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={knowledgeBase.name}
                      onChange={handleInputChange}
                      placeholder="Enter a descriptive name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={knowledgeBase.description || ""}
                      onChange={handleInputChange}
                      placeholder="Enter a brief description of this knowledge base's purpose"
                      rows={4}
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {documents.length} document
                        {documents.length !== 1 && "s"} in this knowledge base
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Manage documents in this knowledge base.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search documents..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={() => setActiveTab("add-document")}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Document
                    </Button>
                  </div>

                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-8 border rounded-md bg-muted/10">
                      {searchQuery ? (
                        <p className="text-muted-foreground">
                          No documents found matching your search.
                        </p>
                      ) : (
                        <>
                          <p className="text-muted-foreground">
                            No documents in this knowledge base yet.
                          </p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setActiveTab("add-document")}
                          >
                            Add your first document
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredDocuments.map((doc) => (
                        <Card key={doc.id} className="overflow-hidden">
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <h3 className="font-medium">{doc.title}</h3>
                                {doc.source_url && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Link className="h-3 w-3 mr-1" />
                                    <a
                                      href={doc.source_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline flex items-center"
                                    >
                                      Source
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteDocument(doc.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {doc.content}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="add-document" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Document</CardTitle>
                  <CardDescription>
                    Add a new document to this knowledge base.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Document Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newDocument.title}
                      onChange={handleDocumentInputChange}
                      placeholder="Enter a descriptive title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Document Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={newDocument.content}
                      onChange={handleDocumentInputChange}
                      placeholder="Enter the document content"
                      rows={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source_url">Source URL (Optional)</Label>
                    <Input
                      id="source_url"
                      name="source_url"
                      value={newDocument.source_url}
                      onChange={handleDocumentInputChange}
                      placeholder="https://example.com/source"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleAddDocument}
                      disabled={isUploading}
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                          Adding Document...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Add Document
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default KnowledgeBaseDetail;
