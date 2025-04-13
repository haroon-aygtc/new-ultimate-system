import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, Search, FileText } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  ai_model_id: string;
  is_active: boolean;
}

interface KnowledgeBaseManagerProps {
  activeModelId: string;
}

const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({
  activeModelId,
}) => {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<
    KnowledgeBaseArticle[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<KnowledgeBaseArticle>({
    id: "",
    title: "",
    content: "",
    ai_model_id: activeModelId,
    is_active: true,
  });

  // Fetch knowledge base articles for the active model
  useEffect(() => {
    if (activeModelId) {
      fetchKnowledgeBaseArticles();
    }
  }, [activeModelId]);

  // Filter articles based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredArticles(
        articles.filter(
          (article) =>
            article.title.toLowerCase().includes(query) ||
            article.content.toLowerCase().includes(query),
        ),
      );
    }
  }, [searchQuery, articles]);

  const fetchKnowledgeBaseArticles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("knowledge_base_articles")
        .select("*")
        .eq("ai_model_id", activeModelId);

      if (error) throw error;
      setArticles(data || []);
      setFilteredArticles(data || []);
    } catch (error) {
      console.error("Error fetching knowledge base articles:", error);
      toast({
        title: "Error",
        description: "Failed to load knowledge base articles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveArticle = async () => {
    // Validate inputs
    if (!currentArticle.title.trim()) {
      toast({
        title: "Error",
        description: "Article title is required",
        variant: "destructive",
      });
      return;
    }

    if (!currentArticle.content.trim()) {
      toast({
        title: "Error",
        description: "Article content is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (isEditing) {
        // Update existing article
        result = await supabase
          .from("knowledge_base_articles")
          .update({
            title: currentArticle.title,
            content: currentArticle.content,
            is_active: currentArticle.is_active,
          })
          .eq("id", currentArticle.id);
      } else {
        // Create new article
        result = await supabase.from("knowledge_base_articles").insert([
          {
            title: currentArticle.title,
            content: currentArticle.content,
            ai_model_id: activeModelId,
            is_active: currentArticle.is_active,
          },
        ]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: isEditing
          ? "Knowledge base article updated successfully"
          : "Knowledge base article created successfully",
      });

      // Reset form and refresh articles
      setCurrentArticle({
        id: "",
        title: "",
        content: "",
        ai_model_id: activeModelId,
        is_active: true,
      });
      setIsEditing(false);
      setShowDialog(false);
      fetchKnowledgeBaseArticles();
    } catch (error) {
      console.error("Error saving knowledge base article:", error);
      toast({
        title: "Error",
        description: "Failed to save knowledge base article",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditArticle = (article: KnowledgeBaseArticle) => {
    setCurrentArticle(article);
    setIsEditing(true);
    setShowDialog(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (
      !confirm("Are you sure you want to delete this knowledge base article?")
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("knowledge_base_articles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Knowledge base article deleted successfully",
      });

      fetchKnowledgeBaseArticles();
    } catch (error) {
      console.error("Error deleting knowledge base article:", error);
      toast({
        title: "Error",
        description: "Failed to delete knowledge base article",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("knowledge_base_articles")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Knowledge base article ${!isActive ? "activated" : "deactivated"} successfully`,
      });

      fetchKnowledgeBaseArticles();
    } catch (error) {
      console.error("Error toggling knowledge base article status:", error);
      toast({
        title: "Error",
        description: "Failed to update knowledge base article status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Knowledge Base</h3>
        <Button
          onClick={() => {
            setCurrentArticle({
              id: "",
              title: "",
              content: "",
              ai_model_id: activeModelId,
              is_active: true,
            });
            setIsEditing(false);
            setShowDialog(true);
          }}
          className="bg-brand-primary text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search knowledge base..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && articles.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-brand-muted">
            Loading knowledge base articles...
          </p>
        </div>
      ) : articles.length === 0 ? (
        <Card className="border-dashed border-2 bg-brand-light/10">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-brand-muted text-center mb-4">
              No knowledge base articles defined for this AI model yet.
            </p>
            <Button
              onClick={() => {
                setCurrentArticle({
                  id: "",
                  title: "",
                  content: "",
                  ai_model_id: activeModelId,
                  is_active: true,
                });
                setIsEditing(false);
                setShowDialog(true);
              }}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Article
            </Button>
          </CardContent>
        </Card>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-8 text-brand-muted">
          No articles match your search query.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="border overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-brand-muted" />
                      <CardTitle className="text-base">
                        {article.title}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge
                    variant={article.is_active ? "default" : "outline"}
                    className={
                      article.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {article.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-brand-muted line-clamp-2">
                  {article.content}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-2 border-t">
                <Switch
                  checked={article.is_active}
                  onCheckedChange={() =>
                    handleToggleActive(article.id, article.is_active)
                  }
                  id={`active-${article.id}`}
                />
                <Label htmlFor={`active-${article.id}`} className="text-sm">
                  {article.is_active ? "Active" : "Inactive"}
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditArticle(article)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteArticle(article.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? "Edit Knowledge Base Article"
                : "Add Knowledge Base Article"}
            </DialogTitle>
            <DialogDescription>
              Add information to your AI's knowledge base to improve responses.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="article-title">Article Title</Label>
              <Input
                id="article-title"
                placeholder="Enter article title"
                value={currentArticle.title}
                onChange={(e) =>
                  setCurrentArticle({
                    ...currentArticle,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="article-content">Article Content</Label>
              <Textarea
                id="article-content"
                placeholder="Enter the knowledge base article content"
                value={currentArticle.content}
                onChange={(e) =>
                  setCurrentArticle({
                    ...currentArticle,
                    content: e.target.value,
                  })
                }
                className="min-h-[200px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is-active"
                checked={currentArticle.is_active}
                onCheckedChange={(checked) =>
                  setCurrentArticle({
                    ...currentArticle,
                    is_active: checked,
                  })
                }
              />
              <Label htmlFor="is-active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveArticle}
              className="bg-brand-primary text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Article
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgeBaseManager;
