import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Search,
  Plus,
  Globe,
  Settings,
  Trash2,
  Download,
  Eye,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getScrapingProjects,
  updateScrapingProjectStatus,
  deleteScrapingProject,
} from "@/services/scrapingService";
import { ScrapingProject } from "@/types";

const ScrapingProjects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<ScrapingProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await getScrapingProjects();
        if (error) throw error;
        if (data) setProjects(data);
      } catch (error) {
        console.error("Error loading scraping projects:", error);
        toast({
          title: "Error",
          description: "Could not load scraping projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [toast]);

  const filteredProjects = projects.filter((project) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.target_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && project.status === "active") ||
      (activeTab === "inactive" && project.status === "inactive") ||
      (activeTab === "static" && project.status === "static");

    return matchesSearch && matchesTab;
  });

  const handleStatusChange = async (
    id: string,
    status: "static" | "active" | "inactive",
  ) => {
    try {
      const { success, error } = await updateScrapingProjectStatus(id, status);
      if (error) throw error;
      if (success) {
        setProjects(
          projects.map((project) =>
            project.id === id ? { ...project, status } : project,
          ),
        );
        toast({
          title: "Status Updated",
          description: `Project status changed to ${status}.`,
        });
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      toast({
        title: "Error",
        description: "Could not update project status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This will also delete all scraping results.",
      )
    ) {
      return;
    }

    try {
      const { success, error } = await deleteScrapingProject(id);
      if (error) throw error;
      if (success) {
        setProjects(projects.filter((project) => project.id !== id));
        toast({
          title: "Project Deleted",
          description: "The scraping project has been deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Could not delete the project. Please try again.",
        variant: "destructive",
      });
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Web Scraping</h1>
        <Button onClick={() => navigate("/scraping/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scraping Projects</CardTitle>
          <CardDescription>
            Configure and manage web scraping projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, URL or description..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="static">Static</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    Loading projects...
                  </span>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-12 border rounded-md bg-muted/10">
                  <p className="text-muted-foreground">
                    No scraping projects found.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate("/scraping/new")}
                  >
                    Create your first project
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">{project.name}</h3>
                          </div>
                          {getStatusBadge(project.status)}
                        </div>

                        <div className="mt-2 space-y-2">
                          <p className="text-sm break-all">
                            <span className="text-muted-foreground">URL:</span>{" "}
                            {project.target_url}
                          </p>
                          {project.description && (
                            <p className="text-sm text-muted-foreground">
                              {project.description}
                            </p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            <p>
                              Created:{" "}
                              {new Date(
                                project.created_at,
                              ).toLocaleDateString()}
                            </p>
                            {project.last_run && (
                              <p>
                                Last run:{" "}
                                {new Date(project.last_run).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/20 p-3 flex justify-between items-center">
                        <div className="space-x-1">
                          {project.status !== "active" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() =>
                                handleStatusChange(project.id, "active")
                              }
                            >
                              Activate
                            </Button>
                          )}
                          {project.status !== "inactive" &&
                            project.status !== "static" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                onClick={() =>
                                  handleStatusChange(project.id, "inactive")
                                }
                              >
                                Deactivate
                              </Button>
                            )}
                        </div>

                        <div className="space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              navigate(`/scraping/results/${project.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/scraping/${project.id}`)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapingProjects;
