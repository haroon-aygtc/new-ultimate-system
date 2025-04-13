import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Settings, Trash2, Eye } from "lucide-react";

const ScrapingStoryboard = () => {
  // Mock data for scraping projects
  const mockProjects = [
    {
      id: "1",
      name: "E-commerce Product Scraper",
      target_url: "https://example-store.com/products",
      description: "Scrapes product details including prices and availability",
      status: "active",
      created_at: "2023-06-10T14:30:00Z",
      last_run: "2023-06-15T08:45:00Z",
    },
    {
      id: "2",
      name: "News Article Collector",
      target_url: "https://example-news.com/latest",
      description: "Collects news articles and their content",
      status: "inactive",
      created_at: "2023-06-08T11:20:00Z",
      last_run: "2023-06-12T09:30:00Z",
    },
    {
      id: "3",
      name: "Social Media Profile Analyzer",
      target_url: "https://example-social.com/profiles",
      description: "Analyzes public profile information",
      status: "static",
      created_at: "2023-06-05T16:15:00Z",
      last_run: "2023-06-05T16:45:00Z",
    },
  ];

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

  return (
    <div className="container mx-auto py-6 space-y-6 bg-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Web Scraping</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scraping Projects</CardTitle>
          <CardDescription>
            Configure and manage web scraping projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockProjects.map((project) => (
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
                        {new Date(project.created_at).toLocaleDateString()}
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
                        >
                          Deactivate
                        </Button>
                      )}
                  </div>

                  <div className="space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapingStoryboard;
