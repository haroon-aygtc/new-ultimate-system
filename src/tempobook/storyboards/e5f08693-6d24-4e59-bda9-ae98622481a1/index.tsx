import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Book, FileText, Plus, Search } from "lucide-react";

export default function KnowledgeBaseStoryboard() {
  // Sample knowledge base data
  const knowledgeBases = [
    {
      id: "1",
      name: "Product Documentation",
      description: "Official documentation for our product features and usage",
      status: "active",
      documents: [{ id: "1" }, { id: "2" }, { id: "3" }],
    },
    {
      id: "2",
      name: "FAQ Knowledge Base",
      description: "Frequently asked questions and answers",
      status: "active",
      documents: [{ id: "4" }, { id: "5" }],
    },
    {
      id: "3",
      name: "Support Articles",
      description: "Troubleshooting guides and support information",
      status: "inactive",
      documents: [{ id: "6" }],
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
    <div className="bg-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Knowledge Bases</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Knowledge Base
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Knowledge Bases</CardTitle>
          <CardDescription>
            Configure and manage knowledge bases for your AI models.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or description..."
                className="pl-8"
              />
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Knowledge Bases</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="static">Static</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {knowledgeBases.map((kb) => (
                  <Card key={kb.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <Book className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{kb.name}</h3>
                        </div>
                        {getStatusBadge(kb.status)}
                      </div>

                      <div className="mt-2 space-y-1">
                        {kb.description && (
                          <p className="text-sm text-muted-foreground">
                            {kb.description}
                          </p>
                        )}
                        <div className="flex items-center text-xs text-muted-foreground">
                          <FileText className="h-3 w-3 mr-1" />
                          {kb.documents ? kb.documents.length : 0} documents
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/20 p-3 flex justify-between items-center">
                      <div className="space-x-1">
                        {kb.status !== "active" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            Activate
                          </Button>
                        )}
                        {kb.status === "active" && (
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
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
