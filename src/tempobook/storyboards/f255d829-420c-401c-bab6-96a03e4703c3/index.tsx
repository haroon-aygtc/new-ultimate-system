import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Palette, Upload } from "lucide-react";

export default function BrandingSettingsStoryboard() {
  return (
    <div className="bg-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Branding Settings</h1>
        <Button>
          <Check className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="appearance">
        <TabsList className="mb-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="chat-widget">Chat Widget</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="logo">Logo</Label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="h-16 w-16 overflow-hidden rounded-md border">
                    <img
                      src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80"
                      alt="Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="relative"
                      type="button"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Recommended size: 512x512px. Max size: 2MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{ backgroundColor: "#3b82f6" }}
                    />
                    <Input
                      id="primary_color"
                      type="text"
                      defaultValue="#3b82f6"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{ backgroundColor: "#1e3a8a" }}
                    />
                    <Input
                      id="secondary_color"
                      type="text"
                      defaultValue="#1e3a8a"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accent_color">Accent Color</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{ backgroundColor: "#f97316" }}
                    />
                    <Input
                      id="accent_color"
                      type="text"
                      defaultValue="#f97316"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="font_family">Font Family</Label>
                  <Input
                    id="font_family"
                    type="text"
                    className="mt-1"
                    defaultValue="Inter, sans-serif"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat-widget">
          <Card>
            <CardHeader>
              <CardTitle>Chat Widget Settings</CardTitle>
              <CardDescription>
                Customize the appearance and behavior of the chat widget.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="chat_widget_title">Widget Title</Label>
                  <Input
                    id="chat_widget_title"
                    type="text"
                    className="mt-1"
                    defaultValue="Chat with us"
                  />
                </div>

                <div>
                  <Label htmlFor="chat_widget_subtitle">Widget Subtitle</Label>
                  <Input
                    id="chat_widget_subtitle"
                    type="text"
                    className="mt-1"
                    defaultValue="Ask us anything"
                  />
                </div>

                <div>
                  <Label htmlFor="chat_widget_position">Widget Position</Label>
                  <select
                    id="chat_widget_position"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    defaultValue="right"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="chat_widget_theme">Widget Theme</Label>
                  <select
                    id="chat_widget_theme"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    defaultValue="light"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 flex justify-between">
              <div className="text-sm text-muted-foreground">
                These settings affect how the chat widget appears on your
                website.
              </div>
              <Button variant="outline" size="sm">
                Preview Widget
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
