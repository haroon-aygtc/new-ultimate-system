import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

function ResponseFormatEditor() {
  const [template, setTemplate] = useState(`<div class="chat-response">
  <div class="user-info">
    <span class="user-name">{{userName}}</span>
    <span class="timestamp">{{timestamp}}</span>
  </div>
  <div class="question">{{userQuestion}}</div>
  <div class="answer">{{aiResponse}}</div>
</div>`);

  const [previewData, setPreviewData] = useState({
    userName: "John Doe",
    timestamp: new Date().toLocaleString(),
    userQuestion: "How do I reset my password?",
    aiResponse:
      "To reset your password, please click on the 'Forgot Password' link on the login page and follow the instructions sent to your email.",
  });

  const handleTemplateChange = (e) => {
    setTemplate(e.target.value);
  };

  const handlePreviewDataChange = (field, value) => {
    setPreviewData({
      ...previewData,
      [field]: value,
    });
  };

  const renderPreview = () => {
    let preview = template;
    Object.entries(previewData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, "g"), value);
    });
    return preview;
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Response Format Editor</h1>

      <Card>
        <CardHeader>
          <CardTitle>Edit Response Format</CardTitle>
          <CardDescription>
            Customize how AI responses are formatted and presented to users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="editor">
            <TabsList className="mb-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <div>
                <Label htmlFor="template">HTML Template</Label>
                <Textarea
                  id="template"
                  value={template}
                  onChange={handleTemplateChange}
                  className="mt-1 min-h-32 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use variables like {"{{userName}}"}, {"{{userQuestion}}"}, and{" "}
                  {"{{aiResponse}}"} in your template.
                </p>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Format
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>User Name</Label>
                    <Input
                      value={previewData.userName}
                      onChange={(e) =>
                        handlePreviewDataChange("userName", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>User Question</Label>
                    <Input
                      value={previewData.userQuestion}
                      onChange={(e) =>
                        handlePreviewDataChange("userQuestion", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>AI Response</Label>
                    <Textarea
                      value={previewData.aiResponse}
                      onChange={(e) =>
                        handlePreviewDataChange("aiResponse", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Preview</h3>
                  <div className="p-4 border rounded-md bg-white">
                    <div
                      dangerouslySetInnerHTML={{ __html: renderPreview() }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="variables">
              <div className="space-y-4">
                <p className="text-sm">
                  You can use the following variables in your template:
                </p>

                <div className="rounded-md border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-2 text-sm font-medium">
                          Variable
                        </th>
                        <th className="text-left p-2 text-sm font-medium">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-2 text-sm font-mono">
                          {"{{userName}}"}
                        </td>
                        <td className="p-2 text-sm">The name of the user</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 text-sm font-mono">
                          {"{{userQuestion}}"}
                        </td>
                        <td className="p-2 text-sm">
                          The question asked by the user
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 text-sm font-mono">
                          {"{{aiResponse}}"}
                        </td>
                        <td className="p-2 text-sm">
                          The response generated by the AI
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 text-sm font-mono">
                          {"{{timestamp}}"}
                        </td>
                        <td className="p-2 text-sm">
                          The current date and time
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResponseFormatEditor;
