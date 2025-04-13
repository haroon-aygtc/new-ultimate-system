import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Code,
  FileJson,
  FileSpreadsheet,
  FileText,
  Download,
  Play,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";

const ScrapingSystem = () => {
  const [url, setUrl] = useState("https://example.com");
  const [exportFormat, setExportFormat] = useState("json");
  const [selectors, setSelectors] = useState([
    { name: "Title", selector: "h1", attribute: "text" },
    { name: "Description", selector: ".description", attribute: "text" },
    { name: "Image", selector: ".main-image", attribute: "src" },
  ]);

  const addSelector = () => {
    setSelectors([
      ...selectors,
      {
        name: `Selector ${selectors.length + 1}`,
        selector: "",
        attribute: "text",
      },
    ]);
  };

  const removeSelector = (index) => {
    const newSelectors = [...selectors];
    newSelectors.splice(index, 1);
    setSelectors(newSelectors);
  };

  const updateSelector = (index, field, value) => {
    const newSelectors = [...selectors];
    newSelectors[index] = { ...newSelectors[index], [field]: value };
    setSelectors(newSelectors);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-brand-primary/10">
        <CardHeader>
          <CardTitle className="text-brand-secondary">
            Web Scraping System
          </CardTitle>
          <CardDescription className="text-brand-muted">
            Configure and run web scraping tasks to collect data from websites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="configure">
            <TabsList className="mb-4">
              <TabsTrigger value="configure">Configure</TabsTrigger>
              <TabsTrigger value="selectors">Selectors</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="configure" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Target URL</Label>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    <Button className="bg-brand-primary text-white">
                      <Globe className="mr-2 h-4 w-4" />
                      Fetch
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scraping-depth">Scraping Depth</Label>
                    <Select defaultValue="1">
                      <SelectTrigger id="scraping-depth">
                        <SelectValue placeholder="Select depth" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Single page only</SelectItem>
                        <SelectItem value="1">
                          Follow direct links (depth 1)
                        </SelectItem>
                        <SelectItem value="2">
                          Follow links of links (depth 2)
                        </SelectItem>
                        <SelectItem value="3">Deep crawl (depth 3+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="request-delay">Request Delay (ms)</Label>
                    <Input
                      id="request-delay"
                      type="number"
                      defaultValue="1000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Advanced Options
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Follow Redirects</span>
                      </div>
                      <Switch defaultChecked id="follow-redirects" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Respect robots.txt</span>
                      </div>
                      <Switch defaultChecked id="respect-robots" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">JavaScript Rendering</span>
                      </div>
                      <Switch id="js-rendering" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Handle Pagination</span>
                      </div>
                      <Switch id="handle-pagination" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-headers">Custom Headers (JSON)</Label>
                  <Textarea
                    id="custom-headers"
                    placeholder='{"User-Agent": "Mozilla/5.0", "Accept-Language": "en-US,en;q=0.9"}'
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="selectors" className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Selector Groups</Label>
                  <Button
                    onClick={addSelector}
                    size="sm"
                    className="bg-brand-primary text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Selector
                  </Button>
                </div>

                <div className="border rounded-md divide-y">
                  {selectors.map((selector, index) => (
                    <div key={index} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                          <Label htmlFor={`selector-name-${index}`}>Name</Label>
                          <Input
                            id={`selector-name-${index}`}
                            value={selector.name}
                            onChange={(e) =>
                              updateSelector(index, "name", e.target.value)
                            }
                            className="max-w-xs"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSelector(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor={`selector-css-${index}`}>
                            CSS Selector
                          </Label>
                          <div className="flex space-x-2">
                            <Input
                              id={`selector-css-${index}`}
                              value={selector.selector}
                              onChange={(e) =>
                                updateSelector(
                                  index,
                                  "selector",
                                  e.target.value,
                                )
                              }
                              placeholder=".class-name or #id"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="shrink-0"
                            >
                              <Code className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`selector-attr-${index}`}>
                            Attribute
                          </Label>
                          <Select
                            value={selector.attribute}
                            onValueChange={(value) =>
                              updateSelector(index, "attribute", value)
                            }
                          >
                            <SelectTrigger id={`selector-attr-${index}`}>
                              <SelectValue placeholder="Select attribute" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text Content</SelectItem>
                              <SelectItem value="html">HTML</SelectItem>
                              <SelectItem value="href">href</SelectItem>
                              <SelectItem value="src">src</SelectItem>
                              <SelectItem value="alt">alt</SelectItem>
                              <SelectItem value="title">title</SelectItem>
                              <SelectItem value="data-*">
                                data-* attribute
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Preview</Label>
                          <Badge
                            variant="outline"
                            className="text-xs bg-brand-light/50"
                          >
                            0 matches
                          </Badge>
                        </div>
                        <div className="mt-1 p-2 bg-brand-light/30 rounded-md h-10 text-xs text-brand-muted flex items-center justify-center">
                          No preview available. Run the scraper to see results.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Live Visualization</h3>
                    <p className="text-xs text-brand-muted mt-1">
                      Preview the data extracted from the target website
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Source
                    </Button>
                    <Button className="bg-brand-primary text-white" size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Run Scraper
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md p-4 bg-brand-light/20">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium">Results</h4>
                    <Badge variant="outline">0 items</Badge>
                  </div>

                  <div className="h-[400px] overflow-auto bg-white border rounded-md p-4">
                    <div className="flex flex-col items-center justify-center h-full text-brand-muted">
                      <Globe className="h-12 w-12 mb-2 opacity-20" />
                      <p className="text-sm">No data available</p>
                      <p className="text-xs mt-1">
                        Configure your selectors and run the scraper to see
                        results
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="export-format">Export Format</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: "json", name: "JSON", icon: FileJson },
                      { id: "csv", name: "CSV", icon: FileSpreadsheet },
                      { id: "html", name: "HTML", icon: Code },
                      { id: "text", name: "Text", icon: FileText },
                    ].map((format) => {
                      const Icon = format.icon;
                      return (
                        <div
                          key={format.id}
                          className={`border rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${exportFormat === format.id ? "border-brand-primary bg-brand-light/30" : "hover:border-brand-muted/50"}`}
                          onClick={() => setExportFormat(format.id)}
                        >
                          <Icon
                            className={`h-8 w-8 mb-2 ${exportFormat === format.id ? "text-brand-primary" : "text-brand-muted"}`}
                          />
                          <span
                            className={`text-sm ${exportFormat === format.id ? "font-medium text-brand-primary" : ""}`}
                          >
                            {format.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="filename">Filename</Label>
                    <Input
                      id="filename"
                      defaultValue={`scrape-result-${new Date().toISOString().split("T")[0]}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="encoding">Encoding</Label>
                    <Select defaultValue="utf8">
                      <SelectTrigger id="encoding">
                        <SelectValue placeholder="Select encoding" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utf8">UTF-8</SelectItem>
                        <SelectItem value="ascii">ASCII</SelectItem>
                        <SelectItem value="iso88591">ISO-8859-1</SelectItem>
                        <SelectItem value="windows1252">
                          Windows-1252
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Export Options</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Pretty Print</span>
                      </div>
                      <Switch defaultChecked id="pretty-print" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Include Metadata</span>
                      </div>
                      <Switch defaultChecked id="include-metadata" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Compress Output</span>
                      </div>
                      <Switch id="compress-output" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Auto-Download</span>
                      </div>
                      <Switch defaultChecked id="auto-download" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button className="bg-brand-primary text-white">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapingSystem;
