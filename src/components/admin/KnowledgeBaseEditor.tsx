import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus, Trash2, Save, Upload, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createKnowledgeBase,
  updateKnowledgeBase,
  getKnowledgeBase,
} from "@/services/knowledgeBaseService";

interface KnowledgeBaseEditorProps {
  knowledgeBaseId?: string;
  isNew?: boolean;
}

interface Document {
  id?: string;
  title: string;
  content: string;
  source_url?: string;
  file_path?: string;
}

const KnowledgeBaseEditor: React.FC<KnowledgeBaseEditorProps> = ({
  knowledgeBaseId,
  isNew = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    { title: "", content: "" },
  ]);

  const [kbData, setKbData] = useState({
    name: "",
    description: "",
    status: "inactive",
    embedding_model: "text-embedding-ada-002",
    max_tokens_per_chunk: 1000,
    chunk_overlap: 200,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (knowledgeBaseId && !isNew) {
        setLoading(true);
        try {
          const { data, error } = await getKnowledgeBase(knowledgeBaseId);
          if (error) throw error;
          if (data) {
            setKbData({
              name: data.name || "",
              description: data.description || "",
              status: data.status || "inactive",
              embedding_model: data.embedding_model || "text-embedding-ada-002",
              max_tokens_per_chunk: data.max_tokens_per_chunk || 1000,
              chunk_overlap: data.chunk_overlap || 200,
            });

            if (data.documents && data.documents.length > 0) {
              setDocuments(data.documents);
            }
          }
        } catch (error) {
          console.error("Error fetching knowledge base:", error);
          toast({
            title: "Error",
            description:
              "Failed to load knowledge base data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [knowledgeBaseId, isNew, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setKbData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKbData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setKbData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (
    index: number,
    field: keyof Document,
    value: string,
  ) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
    setDocuments(updatedDocuments);
  };

  const addDocument = () => {
    setDocuments([...documents, { title: "", content: "" }]);
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    setDocuments(updatedDocuments);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty documents
      const filteredDocuments = documents.filter(
        (doc) => doc.title.trim() !== "" && doc.content.trim() !== "",
      );

      if (filteredDocuments.length === 0) {
        throw new Error(
          "At least one document with title and content is required",
        );
      }

      const submitData = {
        ...kbData,
        documents: filteredDocuments,
      };

      let result;
      if (isNew) {
        result = await createKnowledgeBase(submitData);
      } else if (knowledgeBaseId) {
        result = await updateKnowledgeBase(knowledgeBaseId, submitData);
      }

      if (result?.success) {
        toast({
          title: isNew ? "Knowledge Base Created" : "Knowledge Base Updated",
          description: isNew
            ? "New knowledge base has been created successfully."
            : "Knowledge base has been updated successfully.",
        });
        navigate("/admin/guest-session-management?tab=knowledge-base");
      } else {
        throw new Error(result?.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error saving knowledge base:", error);
      toast({
        title: "Error",
        description: `Failed to ${isNew ? "create" : "update"} knowledge base: ${error instanceof Error ? error.message : "Unknown error"}.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              navigate("/admin/guest-session-management?tab=knowledge-base")
            }
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">
            {isNew ? "Create New Knowledge Base" : "Edit Knowledge Base"}
          </h2>
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
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
              <Save className="mr-2 h-4 w-4" /> Save Knowledge Base
            </span>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Knowledge Base Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={kbData.name}
                  onChange={handleInputChange}
                  placeholder="Enter knowledge base name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={kbData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="static">Static</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={kbData.description}
                onChange={handleInputChange}
                placeholder="Enter a description for this knowledge base"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Embedding Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="embedding_model">Embedding Model</Label>
                <Select
                  value={kbData.embedding_model}
                  onValueChange={(value) =>
                    handleSelectChange("embedding_model", value)
                  }
                >
                  <SelectTrigger id="embedding_model">
                    <SelectValue placeholder="Select embedding model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-embedding-ada-002">
                      OpenAI Ada 002
                    </SelectItem>
                    <SelectItem value="text-embedding-3-small">
                      OpenAI Embedding 3 Small
                    </SelectItem>
                    <SelectItem value="text-embedding-3-large">
                      OpenAI Embedding 3 Large
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_tokens_per_chunk">
                  Max Tokens Per Chunk
                </Label>
                <Input
                  id="max_tokens_per_chunk"
                  name="max_tokens_per_chunk"
                  type="number"
                  value={kbData.max_tokens_per_chunk}
                  onChange={handleNumberInputChange}
                  min="100"
                  max="8000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chunk_overlap">Chunk Overlap</Label>
                <Input
                  id="chunk_overlap"
                  name="chunk_overlap"
                  type="number"
                  value={kbData.chunk_overlap}
                  onChange={handleNumberInputChange}
                  min="0"
                  max="1000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Documents</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDocument}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Document
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {documents.map((doc, index) => (
              <div key={index} className="p-4 border rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Document {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDocument(index)}
                    disabled={documents.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`doc-title-${index}`}>Title</Label>
                  <Input
                    id={`doc-title-${index}`}
                    value={doc.title}
                    onChange={(e) =>
                      handleDocumentChange(index, "title", e.target.value)
                    }
                    placeholder="Document title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`doc-content-${index}`}>Content</Label>
                  <Textarea
                    id={`doc-content-${index}`}
                    value={doc.content}
                    onChange={(e) =>
                      handleDocumentChange(index, "content", e.target.value)
                    }
                    placeholder="Document content"
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`doc-source-${index}`}>
                    Source URL (Optional)
                  </Label>
                  <Input
                    id={`doc-source-${index}`}
                    value={doc.source_url || ""}
                    onChange={(e) =>
                      handleDocumentChange(index, "source_url", e.target.value)
                    }
                    placeholder="https://example.com/source"
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-center p-4 border border-dashed rounded-md">
              <div className="text-center space-y-2">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Upload documents coming soon
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Support for PDF, DOCX, TXT, and more file formats
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" disabled>
                  <Upload className="h-4 w-4 mr-2" /> Upload Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate("/admin/guest-session-management?tab=knowledge-base")
            }
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
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
                <Save className="mr-2 h-4 w-4" /> Save Knowledge Base
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default KnowledgeBaseEditor;
