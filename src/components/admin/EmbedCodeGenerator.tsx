import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Check, Copy, Code, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EmbedCodeGeneratorProps {
  brandingSettings?: {
    primary_color: string;
    widget_position: string;
    widget_title: string;
  };
}

const EmbedCodeGenerator: React.FC<EmbedCodeGeneratorProps> = ({
  brandingSettings = {
    primary_color: "#4A6FA5",
    widget_position: "bottom-right",
    widget_title: "Chat with us",
  },
}) => {
  const { toast } = useToast();
  const [embedType, setEmbedType] = useState<string>("script");
  const [copied, setCopied] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [config, setConfig] = useState({
    position: brandingSettings.widget_position,
    primaryColor: brandingSettings.primary_color,
    title: brandingSettings.widget_title,
    autoOpen: false,
    hideOnMobile: false,
    loadDelay: 1000,
    domain: window.location.origin,
    welcomeMessage: "Hello! How can I help you today?",
    offlineMessage:
      "We're currently offline. Please leave a message and we'll get back to you.",
    inputPlaceholder: "Type your message...",
    showBranding: true,
    allowAttachments: false,
    enableHistory: true,
    requireRegistration: true,
    registrationFields: ["name", "phone"],
    enableAnalytics: true,
    sessionTimeout: 30,
  });

  const codeRef = useRef<HTMLTextAreaElement>(null);

  const handleCopyCode = () => {
    if (codeRef.current) {
      codeRef.current.select();
      document.execCommand("copy");
      setCopied(true);
      toast({
        title: "Code copied to clipboard",
        description: "You can now paste it into your website.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const generateScriptCode = () => {
    const scriptUrl = `${config.domain}/widget/chat-widget.js`;
    return `<!-- GuestApp Chat Widget -->
<script>
  (function(w, d, s, o) {
    w.GuestAppChat = o;
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(o.id)) return;
    js = d.createElement(s); js.id = o.id;
    js.src = "${scriptUrl}";
    js.async = 1;
    js.defer = 1;
    fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', {
    id: 'guestapp-chat-widget',
    position: '${config.position}',
    primaryColor: '${config.primaryColor}',
    title: '${config.title}',
    autoOpen: ${config.autoOpen},
    hideOnMobile: ${config.hideOnMobile},
    loadDelay: ${config.loadDelay},
    welcomeMessage: '${config.welcomeMessage.replace(/'/g, "\\'")}',,
    offlineMessage: '${config.offlineMessage.replace(/'/g, "\\'")}',,
    inputPlaceholder: '${config.inputPlaceholder.replace(/'/g, "\\'")}',,
    showBranding: ${config.showBranding},
    allowAttachments: ${config.allowAttachments},
    enableHistory: ${config.enableHistory},
    apiEndpoint: '${config.domain}/api/chat',
    sessionTimeout: ${config.sessionTimeout},
    requireRegistration: ${config.requireRegistration},
    registrationFields: ${JSON.stringify(config.registrationFields)},
    enableAnalytics: ${config.enableAnalytics}
  }));
</script>`;
  };

  const generateIframeCode = () => {
    const iframeSrc = `${config.domain}/widget/chat?primaryColor=${encodeURIComponent(
      config.primaryColor,
    )}&position=${encodeURIComponent(config.position)}&title=${encodeURIComponent(
      config.title,
    )}`;

    return `<!-- GuestApp Chat Widget (iframe) -->
<div id="guestapp-chat-container" style="position: fixed; ${
      config.position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"
    }; ${config.position.includes("right") ? "right: 20px;" : "left: 20px;"}; z-index: 9999;">
  <iframe
    src="${iframeSrc}"
    width="350"
    height="500"
    frameborder="0"
    style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); display: none;"
    id="guestapp-chat-iframe"
  ></iframe>
  <button 
    id="guestapp-chat-toggle"
    style="width: 60px; height: 60px; border-radius: 50%; background-color: ${config.primaryColor}; color: white; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); display: flex; align-items: center; justify-content: center;"
    onclick="toggleChatWidget()"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
  </button>
</div>

<script>
  function toggleChatWidget() {
    const iframe = document.getElementById('guestapp-chat-iframe');
    const button = document.getElementById('guestapp-chat-toggle');
    if (iframe.style.display === 'none') {
      iframe.style.display = 'block';
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    } else {
      iframe.style.display = 'none';
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    }
  }
  ${config.autoOpen ? "window.onload = function() { setTimeout(toggleChatWidget, " + config.loadDelay + "); };" : ""}
  ${config.hideOnMobile ? "if (window.innerWidth < 768) { document.getElementById('guestapp-chat-container').style.display = 'none'; }" : ""}
</script>`;
  };

  const generateWebComponentCode = () => {
    return `<!-- GuestApp Chat Widget (Web Component) -->
<script type="module" src="${config.domain}/widget/chat-component.js"></script>

<guestapp-chat
  position="${config.position}"
  primary-color="${config.primaryColor}"
  title="${config.title}"
  ${config.autoOpen ? "auto-open" : ""}
  ${config.hideOnMobile ? "hide-on-mobile" : ""}
  load-delay="${config.loadDelay}"
  welcome-message="${config.welcomeMessage.replace(/"/g, "&quot;")}"
  offline-message="${config.offlineMessage.replace(/"/g, "&quot;")}"
  input-placeholder="${config.inputPlaceholder.replace(/"/g, "&quot;")}"
  ${config.showBranding ? "show-branding" : ""}
  ${config.allowAttachments ? "allow-attachments" : ""}
  ${config.enableHistory ? "enable-history" : ""}
></guestapp-chat>`;
  };

  const generateNPMCode = () => {
    return `// Install the package
npm install guestapp-chat-widget

// Import in your React/Vue/Angular app
import { GuestAppChat } from 'guestapp-chat-widget';

// Use in your component
<GuestAppChat 
  position="${config.position}"
  primaryColor="${config.primaryColor}"
  title="${config.title}"
  autoOpen={${config.autoOpen}}
  hideOnMobile={${config.hideOnMobile}}
  loadDelay={${config.loadDelay}}
  welcomeMessage="${config.welcomeMessage.replace(/"/g, '"')}"
  offlineMessage="${config.offlineMessage.replace(/"/g, '"')}"
  inputPlaceholder="${config.inputPlaceholder.replace(/"/g, '"')}"
  showBranding={${config.showBranding}}
  allowAttachments={${config.allowAttachments}}
  enableHistory={${config.enableHistory}}
  requireRegistration={${config.requireRegistration}}
  registrationFields={${JSON.stringify(config.registrationFields)}}
  enableAnalytics={${config.enableAnalytics}}
  sessionTimeout={${config.sessionTimeout}}
/>`;
  };

  const getGeneratedCode = () => {
    switch (embedType) {
      case "script":
        return generateScriptCode();
      case "iframe":
        return generateIframeCode();
      case "webcomponent":
        return generateWebComponentCode();
      case "npm":
        return generateNPMCode();
      default:
        return generateScriptCode();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Chat Widget Embed Code Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Tabs
            defaultValue="script"
            value={embedType}
            onValueChange={setEmbedType}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="script">Script Tag</TabsTrigger>
              <TabsTrigger value="iframe">iFrame</TabsTrigger>
              <TabsTrigger value="webcomponent">Web Component</TabsTrigger>
              <TabsTrigger value="npm">NPM Package</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Widget Position</Label>
                  <Select
                    value={config.position}
                    onValueChange={(value) =>
                      handleConfigChange("position", value)
                    }
                  >
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) =>
                        handleConfigChange("primaryColor", e.target.value)
                      }
                    />
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) =>
                        handleConfigChange("primaryColor", e.target.value)
                      }
                      className="w-10 h-10 p-1 rounded border"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Widget Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={config.title}
                  onChange={(e) => handleConfigChange("title", e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-advanced"
                  checked={showAdvanced}
                  onCheckedChange={setShowAdvanced}
                />
                <Label htmlFor="show-advanced">Show Advanced Options</Label>
              </div>

              {showAdvanced && (
                <div className="space-y-4 pt-4 border-t">
                  <Tabs defaultValue="behavior" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="behavior">Behavior</TabsTrigger>
                      <TabsTrigger value="messages">Messages</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="behavior" className="space-y-4 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="autoOpen">Auto Open Widget</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically open the chat widget when the page
                            loads
                          </p>
                        </div>
                        <Switch
                          id="autoOpen"
                          checked={config.autoOpen}
                          onCheckedChange={(checked) =>
                            handleConfigChange("autoOpen", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="hideOnMobile">Hide on Mobile</Label>
                          <p className="text-sm text-muted-foreground">
                            Hide the chat widget on mobile devices
                          </p>
                        </div>
                        <Switch
                          id="hideOnMobile"
                          checked={config.hideOnMobile}
                          onCheckedChange={(checked) =>
                            handleConfigChange("hideOnMobile", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="showBranding">Show Branding</Label>
                          <p className="text-sm text-muted-foreground">
                            Display "Powered by GuestApp" in the widget
                          </p>
                        </div>
                        <Switch
                          id="showBranding"
                          checked={config.showBranding}
                          onCheckedChange={(checked) =>
                            handleConfigChange("showBranding", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="allowAttachments">
                            Allow Attachments
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Enable file uploads in the chat widget
                          </p>
                        </div>
                        <Switch
                          id="allowAttachments"
                          checked={config.allowAttachments}
                          onCheckedChange={(checked) =>
                            handleConfigChange("allowAttachments", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enableHistory">
                            Enable Chat History
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Preserve chat history between page refreshes
                          </p>
                        </div>
                        <Switch
                          id="enableHistory"
                          checked={config.enableHistory}
                          onCheckedChange={(checked) =>
                            handleConfigChange("enableHistory", checked)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="loadDelay">Load Delay (ms)</Label>
                        <Input
                          id="loadDelay"
                          type="number"
                          value={config.loadDelay}
                          onChange={(e) =>
                            handleConfigChange(
                              "loadDelay",
                              parseInt(e.target.value) || 0,
                            )
                          }
                        />
                        <p className="text-sm text-muted-foreground">
                          Delay in milliseconds before loading the widget
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="messages" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="welcomeMessage">Welcome Message</Label>
                        <Textarea
                          id="welcomeMessage"
                          value={config.welcomeMessage}
                          onChange={(e) =>
                            handleConfigChange("welcomeMessage", e.target.value)
                          }
                          placeholder="Enter welcome message"
                          className="min-h-[80px]"
                        />
                        <p className="text-sm text-muted-foreground">
                          First message shown when chat is opened
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="offlineMessage">Offline Message</Label>
                        <Textarea
                          id="offlineMessage"
                          value={config.offlineMessage}
                          onChange={(e) =>
                            handleConfigChange("offlineMessage", e.target.value)
                          }
                          placeholder="Enter offline message"
                          className="min-h-[80px]"
                        />
                        <p className="text-sm text-muted-foreground">
                          Message shown when no agents are available
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="inputPlaceholder">
                          Input Placeholder
                        </Label>
                        <Input
                          id="inputPlaceholder"
                          type="text"
                          value={config.inputPlaceholder}
                          onChange={(e) =>
                            handleConfigChange(
                              "inputPlaceholder",
                              e.target.value,
                            )
                          }
                        />
                        <p className="text-sm text-muted-foreground">
                          Placeholder text for the message input field
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="domain">Domain</Label>
                        <Input
                          id="domain"
                          type="text"
                          value={config.domain}
                          onChange={(e) =>
                            handleConfigChange("domain", e.target.value)
                          }
                        />
                        <p className="text-sm text-muted-foreground">
                          The domain where your chat widget is hosted
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="requireRegistration">
                            Require Registration
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Require users to register before chatting
                          </p>
                        </div>
                        <Switch
                          id="requireRegistration"
                          checked={config.requireRegistration}
                          onCheckedChange={(checked) =>
                            handleConfigChange("requireRegistration", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enableAnalytics">
                            Enable Analytics
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Track user interactions and chat metrics
                          </p>
                        </div>
                        <Switch
                          id="enableAnalytics"
                          checked={config.enableAnalytics}
                          onCheckedChange={(checked) =>
                            handleConfigChange("enableAnalytics", checked)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">
                          Session Timeout (minutes)
                        </Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={config.sessionTimeout}
                          onChange={(e) =>
                            handleConfigChange(
                              "sessionTimeout",
                              parseInt(e.target.value) || 30,
                            )
                          }
                        />
                        <p className="text-sm text-muted-foreground">
                          Time in minutes before an inactive session expires
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </Tabs>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Generated Code</Label>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleCopyCode}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy Code"}
              </Button>
            </div>
            <Textarea
              ref={codeRef}
              readOnly
              className="font-mono text-sm h-64 bg-muted"
              value={getGeneratedCode()}
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Code className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium">
                  Implementation Instructions
                </h4>
                <p className="text-sm text-muted-foreground">
                  Copy the generated code and paste it into your website's HTML,
                  just before the closing{" "}
                  <code className="bg-muted-foreground/20 px-1 rounded">
                    &lt;/body&gt;
                  </code>{" "}
                  tag.
                  {embedType === "npm" && (
                    <span>
                      {" "}
                      For the NPM package, install it in your project and import
                      it as shown in the code.
                    </span>
                  )}
                </p>
                <div className="pt-2">
                  <Button variant="link" className="h-auto p-0 text-sm" asChild>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      View detailed documentation
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmbedCodeGenerator;
