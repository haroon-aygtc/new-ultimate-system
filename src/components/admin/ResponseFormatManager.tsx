import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ResponseFormat } from "@/types";

interface ResponseFormatManagerProps {
  responseFormat: ResponseFormat;
  onChange: (responseFormat: ResponseFormat) => void;
  onSave?: () => Promise<void>;
}

const ResponseFormatManager: React.FC<ResponseFormatManagerProps> = ({
  responseFormat,
  onChange,
  onSave,
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] = useState({
    userName: "John Doe",
    userQuestion: "How do I reset my password?",
    aiResponse: "To reset your password, please click on the 'Forgot Password' link on the login page and follow the instructions sent to your email.",
  });

  const handleChange = (field: keyof ResponseFormat, value: string) => {
    onChange({
      ...responseFormat,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave();
      toast({
        title: "Success",
        description: "Response format saved successfully.",
      });
    } catch (error) {
      console.error("Error saving response format:", error);
      toast({
        title: "Error",
        description: "Could not save response format. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreview = () => {
    try {
      let preview = responseFormat.template;
      
      // Replace variables in the template
      preview = preview.replace(/\{\{userName\}\}/g, previewData.userName);
      preview = preview.replace(/\{\{userQuestion\}\}/g, previewData.userQuestion);
      preview = preview.replace(/\{\{aiResponse\}\}/g, previewData.aiResponse);
      
      return (
        <div 
          className="p-4 border rounded-md bg-white" 
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      );
    } catch (error) {
      return (
        <div className="p-4 border rounded-md bg-red-50 text-red-600">
          Error rendering preview. Please check your template format.
        </div>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Format</CardTitle>
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
              <label className="text-sm font-medium">Format Name</label>
              <Input
                placeholder="Default Response Format"
                value={responseFormat.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="A brief description of this format"
                value={responseFormat.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">HTML Template</label>
              <Textarea
                placeholder="<div class=\"response\">{{aiResponse}}</div>"
                value={responseFormat.template}
                onChange={(e) => handleChange("template", e.target.value)}
                className="mt-1 min-h-32 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use variables like {{userName}}, {{userQuestion}}, and {{aiResponse}} in your template.
              </p>
            </div>
            
            <div className="flex justify-end">
              {onSave && (
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Format"}
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">User Name</label>
                  <Input
                    value={previewData.userName}
                    onChange={(e) => setPreviewData({...previewData, userName: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">User Question</label>
                  <Input
                    value={previewData.userQuestion}
                    onChange={(e) => setPreviewData({...previewData, userQuestion: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">AI Response</label>
                  <Input
                    value={previewData.aiResponse}
                    onChange={(e) => setPreviewData({...previewData, aiResponse: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Preview</h3>
                {renderPreview()}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="variables">
            <div className="space-y-4">
              <p className="text-sm">You can use the following variables in your template:</p>
              
              <div className="rounded-md border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-2 text-sm font-medium">Variable</th>
                      <th className="text-left p-2 text-sm font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2 text-sm font-mono">{{userName}}</td>
                      <td className="p-2 text-sm">The name of the user</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2 text-sm font-mono">{{userQuestion}}</td>
                      <td className="p-2 text-sm">The question asked by the user</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2 text-sm font-mono">{{aiResponse}}</td>
                      <td className="p-2 text-sm">The response generated by the AI</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2 text-sm font-mono">{{timestamp}}</td>
                      <td className="p-2 text-sm">The current date and time</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2 text-sm font-mono">{{sessionId}}</td>
                      <td className="p-2 text-sm">The unique session identifier</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Example Template</h4>
                <pre className="text-xs overflow-x-auto p-2 bg-muted/30 rounded">
{`<div class="chat-response">
  <div class="user-info">
    <span class="user-name">{{userName}}</span>
    <span class="timestamp">{{timestamp}}</span>
  </div>
  <div class="question">{{userQuestion}}</div>
  <div class="answer">{{aiResponse}}</div>