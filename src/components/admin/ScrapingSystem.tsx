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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Settings,
  AlertCircle,
  Info,
  Clock,
  Shield,
  Repeat,
  ArrowRight,
} from "lucide-react";
import AdvancedScrapingOptions from "./AdvancedScrapingOptions";

const ScrapingSystem = () => {
  // Function to process text based on selected options
  const processText = (text) => {
    if (!enableTextProcessing) return text;

    let processedText = text;

    // Apply cleaning based on selected level
    switch (cleaningLevel) {
      case "basic":
        // Basic cleaning - just remove HTML tags
        processedText = processedText.replace(/<[^>]*>/g, "");
        break;
      case "thorough":
        // Thorough cleaning - remove HTML tags, extra whitespace, and structure paragraphs
        processedText = processedText.replace(/<[^>]*>/g, "");
        processedText = processedText.replace(/\s+/g, " ").trim();
        // Structure paragraphs by adding line breaks after sentences
        processedText = processedText.replace(/\.\s/g, ".\n");
        break;
      case "semantic":
        // Semantic cleaning - extract structured data based on content
        // This would be more complex in a real implementation
        // Here we'll simulate by creating a simple structure
        const title = processedText.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1] || "";
        const paragraphs = [];
        const paragraphMatches =
          processedText.matchAll(/<p[^>]*>([^<]+)<\/p>/gi);
        for (const match of paragraphMatches) {
          paragraphs.push(match[1]);
        }

        if (outputFormat === "json") {
          processedText = JSON.stringify(
            {
              title,
              content: paragraphs,
              metadata: {
                processed: true,
                timestamp: new Date().toISOString(),
              },
            },
            null,
            prettyPrint ? 2 : 0,
          );
        } else {
          processedText = `Title: ${title}\n\nContent:\n${paragraphs.join("\n\n")}`;
        }
        return processedText; // Return early for semantic processing
    }

    // Format the output based on selected format
    if (outputFormat === "json" && cleaningLevel !== "semantic") {
      const lines = processedText.split("\n").filter((line) => line.trim());
      processedText = JSON.stringify(
        {
          content: lines,
          metadata: {
            processed: true,
            preserveStructure: preserveDocumentStructure,
            timestamp: new Date().toISOString(),
          },
        },
        null,
        prettyPrint ? 2 : 0,
      );
    } else if (outputFormat === "csv" && cleaningLevel !== "semantic") {
      // Simple CSV conversion - in a real app this would be more sophisticated
      const lines = processedText.split("\n").filter((line) => line.trim());
      processedText = lines
        .map((line) => `"${line.replace(/"/g, '""')}"`)
        .join("\n");
    }

    return processedText;
  };

  // Function to run the scraper
  const runScraper = () => {
    // Simulate scraping process
    const startTime = new Date();
    setIsLoading(true);

    // Prepare scraping configuration
    const scrapingConfig = {
      url,
      depth: parseInt(scrapingDepth),
      selectors,
      selectorType,
      skipHeaders,
      skipFooters,
      skipImages,
      waitForDynamicContent,
      respectRobotsTxt,
      handlePagination,
      stealthMode,
      enableProxy,
      rateLimit,
      maxRetries,
      followRedirects,
      customHeaders: JSON.parse(customHeaders),
      textProcessing: {
        enabled: enableTextProcessing,
        cleaningLevel,
        outputFormat,
        preserveDocumentStructure,
      },
    };

    console.log("Starting scraping with config:", scrapingConfig);

    // Simulate scraping process with different results based on configuration
    setTimeout(() => {
      const endTime = new Date();
      const timeDiff = (endTime.getTime() - startTime.getTime()) / 1000;

      // Simulate different results based on configuration
      const totalUrls = 10 + parseInt(scrapingDepth) * 5;
      const successful = Math.floor(totalUrls * (followRedirects ? 0.7 : 0.5));
      const failed = totalUrls - successful;

      // Simulate status distribution with more detailed data
      const statusDistribution = {
        "200": Math.floor(successful * 0.8),
        "301": Math.floor(successful * 0.15),
        "302": Math.floor(successful * 0.05),
        "404": Math.floor(failed * 0.6),
        "403": Math.floor(failed * 0.1),
        "500": Math.floor(failed * 0.2),
        "503": Math.floor(failed * 0.1),
      };

      // Simulate removed elements based on configuration
      const removedElements = {
        images: skipImages ? 12 + Math.floor(Math.random() * 8) : 0,
        headers: skipHeaders ? 5 + Math.floor(Math.random() * 3) : 0,
        footers: skipFooters ? 5 + Math.floor(Math.random() * 3) : 0,
        ads: 8 + Math.floor(Math.random() * 5),
      };

      // Sample HTML content that would be scraped
      const sampleHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>Example Domain</title>
    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div>
      <h1>Example Domain</h1>
      <p>This domain is for use in illustrative examples in documents.</p>
      <p>You may use this domain in literature without prior coordination or asking for permission.</p>
    </div>
  </body>
</html>`;

      // Process the text based on the selected options
      const processedText = processText(sampleHtml);

      setScrapingResults({
        totalUrls,
        successful,
        failed,
        totalTime: `${timeDiff}s`,
        statusDistribution,
        removedElements,
        rawHtml: sampleHtml,
        processedText: processedText,
      });

      setIsLoading(false);
    }, 1500);
  };
  const [url, setUrl] = useState("https://example.com");
  const [exportFormat, setExportFormat] = useState("json");
  const [selectors, setSelectors] = useState([
    { name: "Title", selector: "h1", attribute: "text" },
    { name: "Description", selector: ".description", attribute: "text" },
    { name: "Image", selector: ".main-image", attribute: "src" },
  ]);
  const [scrapingDepth, setScrapingDepth] = useState("1");
  const [customHeaders, setCustomHeaders] = useState(
    '{"User-Agent": "Mozilla/5.0", "Accept-Language": "en-US,en;q=0.9"}',
  );
  const [filename, setFilename] = useState(
    `scrape-result-${new Date().toISOString().split("T")[0]}`,
  );
  const [encoding, setEncoding] = useState("utf8");
  const [prettyPrint, setPrettyPrint] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [compressOutput, setCompressOutput] = useState(false);
  const [autoDownload, setAutoDownload] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Advanced scraping options
  const [selectorType, setSelectorType] = useState("css");
  const [skipHeaders, setSkipHeaders] = useState(true);
  const [skipFooters, setSkipFooters] = useState(true);
  const [skipImages, setSkipImages] = useState(false);
  const [waitForDynamicContent, setWaitForDynamicContent] = useState(false);
  const [respectRobotsTxt, setRespectRobotsTxt] = useState(true);
  const [handlePagination, setHandlePagination] = useState(false);
  const [stealthMode, setStealthMode] = useState(false);
  const [enableProxy, setEnableProxy] = useState(false);
  const [rateLimit, setRateLimit] = useState(1000);
  const [maxRetries, setMaxRetries] = useState(3);
  const [followRedirects, setFollowRedirects] = useState(true);

  // Text processing options
  const [enableTextProcessing, setEnableTextProcessing] = useState(false);
  const [cleaningLevel, setCleaningLevel] = useState("basic");
  const [outputFormat, setOutputFormat] = useState("text");
  const [preserveDocumentStructure, setPreserveDocumentStructure] =
    useState(true);

  // Scraping results summary
  const [scrapingResults, setScrapingResults] = useState({
    totalUrls: 0,
    successful: 0,
    failed: 0,
    totalTime: "0s",
    statusDistribution: {},
    removedElements: {
      images: 0,
      headers: 0,
      footers: 0,
      ads: 0,
    },
    rawHtml: "",
    processedText: "",
  });

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

  // Function to handle exporting data
  const handleExport = () => {
    if (scrapingResults.totalUrls === 0) return;

    console.log(`Exporting data in ${exportFormat} format`);

    // Prepare export configuration
    const exportConfig = {
      format: exportFormat,
      filename,
      encoding,
      prettyPrint,
      includeMetadata,
      compressOutput,
      autoDownload,
    };

    console.log("Export configuration:", exportConfig);

    // Prepare export data based on the selected format and processing options
    let exportData;
    let exportContent;

    if (enableTextProcessing && scrapingResults.processedText) {
      // Use the processed text if text processing is enabled
      if (outputFormat === "json") {
        try {
          exportData = JSON.parse(scrapingResults.processedText);
          if (includeMetadata) {
            exportData.metadata = {
              ...exportData.metadata,
              url,
              scrapedAt: new Date().toISOString(),
              totalUrls: scrapingResults.totalUrls,
              successful: scrapingResults.successful,
              failed: scrapingResults.failed,
              totalTime: scrapingResults.totalTime,
              exportConfig,
            };
          }
          exportContent = JSON.stringify(exportData, null, prettyPrint ? 2 : 0);
        } catch (e) {
          // Fallback if the processed text is not valid JSON
          exportContent = scrapingResults.processedText;
        }
      } else {
        // For non-JSON formats, use the processed text directly
        exportContent = scrapingResults.processedText;
      }
    } else {
      // Default export data if text processing is not enabled
      exportData = {
        results: {
          title: "Example Domain",
          description:
            "This domain is for use in illustrative examples in documents.",
          content: [
            "This domain is for use in illustrative examples in documents.",
            "You may use this domain in literature without prior coordination or asking for permission.",
          ],
        },
      };

      if (includeMetadata) {
        exportData.metadata = {
          url,
          scrapedAt: new Date().toISOString(),
          totalUrls: scrapingResults.totalUrls,
          successful: scrapingResults.successful,
          failed: scrapingResults.failed,
          totalTime: scrapingResults.totalTime,
        };
      }

      // Format the export content based on the selected format
      switch (exportFormat) {
        case "json":
          exportContent = JSON.stringify(exportData, null, prettyPrint ? 2 : 0);
          break;
        case "csv":
          // Simple CSV conversion
          const csvRows = [];
          if (exportData.results.title)
            csvRows.push(`"Title","${exportData.results.title}"`);
          if (exportData.results.description)
            csvRows.push(`"Description","${exportData.results.description}"`);
          exportData.results.content.forEach((item, index) => {
            csvRows.push(
              `"Content ${index + 1}","${item.replace(/"/g, '""')}"`,
            );
          });
          exportContent = csvRows.join("\n");
          break;
        case "text":
          exportContent = `${exportData.results.title}\n\n${exportData.results.description}\n\n${exportData.results.content.join("\n\n")}`;
          break;
        case "html":
          exportContent = `<!DOCTYPE html>
<html>
<head>
  <title>${exportData.results.title}</title>
  <meta charset="${encoding}">
</head>
<body>
  <h1>${exportData.results.title}</h1>
  <p>${exportData.results.description}</p>
  ${exportData.results.content.map((item) => `<p>${item}</p>`).join("\n  ")}
</body>
</html>`;
          break;
      }
    }

    // Apply compression if enabled
    if (compressOutput && typeof exportContent === "string") {
      // In a real app, this would use actual compression
      // Here we'll just simulate by removing whitespace for JSON
      if (exportFormat === "json") {
        try {
          const parsed = JSON.parse(exportContent);
          exportContent = JSON.stringify(parsed);
        } catch (e) {
          console.error("Failed to compress JSON:", e);
        }
      }
    }

    // In a real application, this would trigger a download
    console.log("Data to export:", exportContent);

    // Simulate download
    if (autoDownload) {
      alert(`Data would be downloaded as ${filename}.${exportFormat}`);
    }
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
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
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
                    <Select
                      defaultValue="1"
                      onValueChange={(value) => setScrapingDepth(value)}
                    >
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
                      value={rateLimit.toString()}
                      onChange={(e) => setRateLimit(Number(e.target.value))}
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
                      <Switch
                        checked={followRedirects}
                        onCheckedChange={setFollowRedirects}
                        id="follow-redirects"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Respect robots.txt</span>
                      </div>
                      <Switch
                        checked={respectRobotsTxt}
                        onCheckedChange={setRespectRobotsTxt}
                        id="respect-robots"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">JavaScript Rendering</span>
                      </div>
                      <Switch
                        checked={waitForDynamicContent}
                        onCheckedChange={setWaitForDynamicContent}
                        id="js-rendering"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Handle Pagination</span>
                      </div>
                      <Switch
                        checked={handlePagination}
                        onCheckedChange={setHandlePagination}
                        id="handle-pagination"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-headers">Custom Headers (JSON)</Label>
                  <Textarea
                    id="custom-headers"
                    value={customHeaders}
                    onChange={(e) => setCustomHeaders(e.target.value)}
                    placeholder='{"User-Agent": "Mozilla/5.0", "Accept-Language": "en-US,en;q=0.9"}'
                    className="font-mono text-sm"
                    disabled={stealthMode}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <AdvancedScrapingOptions
                selectorType={selectorType}
                setSelectorType={setSelectorType}
                rateLimit={rateLimit}
                setRateLimit={setRateLimit}
                maxRetries={maxRetries}
                setMaxRetries={setMaxRetries}
                skipHeaders={skipHeaders}
                setSkipHeaders={setSkipHeaders}
                skipFooters={skipFooters}
                setSkipFooters={setSkipFooters}
                skipImages={skipImages}
                setSkipImages={setSkipImages}
                waitForDynamicContent={waitForDynamicContent}
                setWaitForDynamicContent={setWaitForDynamicContent}
                respectRobotsTxt={respectRobotsTxt}
                setRespectRobotsTxt={setRespectRobotsTxt}
                handlePagination={handlePagination}
                setHandlePagination={setHandlePagination}
                stealthMode={stealthMode}
                setStealthMode={setStealthMode}
                enableProxy={enableProxy}
                setEnableProxy={setEnableProxy}
                followRedirects={followRedirects}
                setFollowRedirects={setFollowRedirects}
                enableTextProcessing={enableTextProcessing}
                setEnableTextProcessing={setEnableTextProcessing}
                cleaningLevel={cleaningLevel}
                setCleaningLevel={setCleaningLevel}
                outputFormat={outputFormat}
                setOutputFormat={setOutputFormat}
                preserveDocumentStructure={preserveDocumentStructure}
                setPreserveDocumentStructure={setPreserveDocumentStructure}
              />
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
                    <Button
                      className="bg-brand-primary text-white"
                      size="sm"
                      onClick={() => runScraper()}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Repeat className="mr-2 h-4 w-4 animate-spin" />
                          Scraping...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Run Scraper
                        </>
                      )}
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
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="encoding">Encoding</Label>
                    <Select value={encoding} onValueChange={setEncoding}>
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
                      <Switch
                        checked={prettyPrint}
                        onCheckedChange={setPrettyPrint}
                        id="pretty-print"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Include Metadata</span>
                      </div>
                      <Switch
                        checked={includeMetadata}
                        onCheckedChange={setIncludeMetadata}
                        id="include-metadata"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Compress Output</span>
                      </div>
                      <Switch
                        checked={compressOutput}
                        onCheckedChange={setCompressOutput}
                        id="compress-output"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Auto-Download</span>
                      </div>
                      <Switch
                        checked={autoDownload}
                        onCheckedChange={setAutoDownload}
                        id="auto-download"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    className="bg-brand-primary text-white"
                    disabled={scrapingResults.totalUrls === 0 || isLoading}
                    onClick={() => handleExport()}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Scraping Results</h3>
                  <p className="text-sm text-brand-muted mb-4">
                    View the results of your scraping operation
                  </p>
                </div>

                <div className="border rounded-md p-4 space-y-4">
                  <h4 className="text-md font-medium">Summary</h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-brand-light/20 p-3 rounded-md">
                      <div className="text-sm text-brand-muted">Total URLs</div>
                      <div className="text-2xl font-semibold">
                        {scrapingResults.totalUrls}
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-md">
                      <div className="text-sm text-green-600">Successful</div>
                      <div className="text-2xl font-semibold text-green-700">
                        {scrapingResults.successful}
                      </div>
                    </div>

                    <div className="bg-red-50 p-3 rounded-md">
                      <div className="text-sm text-red-600">Failed</div>
                      <div className="text-2xl font-semibold text-red-700">
                        {scrapingResults.failed}
                      </div>
                    </div>

                    <div className="bg-brand-light/20 p-3 rounded-md">
                      <div className="text-sm text-brand-muted">Total Time</div>
                      <div className="text-2xl font-semibold">
                        {scrapingResults.totalTime}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">
                      Status Distribution
                    </h5>
                    <div className="h-8 bg-gray-100 rounded-md overflow-hidden flex">
                      {/* Calculate percentages based on actual data */}
                      {Object.entries(scrapingResults.statusDistribution)
                        .length > 0 ? (
                        <>
                          {/* 2xx Success */}
                          {Object.entries(scrapingResults.statusDistribution)
                            .filter(([code]) => code.startsWith("2"))
                            .reduce((sum, [_, count]) => sum + count, 0) >
                            0 && (
                            <div
                              className="bg-green-500 h-full"
                              style={{
                                width: `${
                                  (Object.entries(
                                    scrapingResults.statusDistribution,
                                  )
                                    .filter(([code]) => code.startsWith("2"))
                                    .reduce(
                                      (sum, [_, count]) => sum + count,
                                      0,
                                    ) /
                                    scrapingResults.totalUrls) *
                                  100
                                }%`,
                              }}
                            ></div>
                          )}

                          {/* 3xx Redirect */}
                          {Object.entries(scrapingResults.statusDistribution)
                            .filter(([code]) => code.startsWith("3"))
                            .reduce((sum, [_, count]) => sum + count, 0) >
                            0 && (
                            <div
                              className="bg-yellow-500 h-full"
                              style={{
                                width: `${
                                  (Object.entries(
                                    scrapingResults.statusDistribution,
                                  )
                                    .filter(([code]) => code.startsWith("3"))
                                    .reduce(
                                      (sum, [_, count]) => sum + count,
                                      0,
                                    ) /
                                    scrapingResults.totalUrls) *
                                  100
                                }%`,
                              }}
                            ></div>
                          )}

                          {/* 4xx Client Error */}
                          {Object.entries(scrapingResults.statusDistribution)
                            .filter(([code]) => code.startsWith("4"))
                            .reduce((sum, [_, count]) => sum + count, 0) >
                            0 && (
                            <div
                              className="bg-orange-500 h-full"
                              style={{
                                width: `${
                                  (Object.entries(
                                    scrapingResults.statusDistribution,
                                  )
                                    .filter(([code]) => code.startsWith("4"))
                                    .reduce(
                                      (sum, [_, count]) => sum + count,
                                      0,
                                    ) /
                                    scrapingResults.totalUrls) *
                                  100
                                }%`,
                              }}
                            ></div>
                          )}

                          {/* 5xx Server Error */}
                          {Object.entries(scrapingResults.statusDistribution)
                            .filter(([code]) => code.startsWith("5"))
                            .reduce((sum, [_, count]) => sum + count, 0) >
                            0 && (
                            <div
                              className="bg-red-500 h-full"
                              style={{
                                width: `${
                                  (Object.entries(
                                    scrapingResults.statusDistribution,
                                  )
                                    .filter(([code]) => code.startsWith("5"))
                                    .reduce(
                                      (sum, [_, count]) => sum + count,
                                      0,
                                    ) /
                                    scrapingResults.totalUrls) *
                                  100
                                }%`,
                              }}
                            ></div>
                          )}
                        </>
                      ) : (
                        <>
                          <div
                            className="bg-green-500 h-full"
                            style={{ width: "70%" }}
                          ></div>
                          <div
                            className="bg-yellow-500 h-full"
                            style={{ width: "20%" }}
                          ></div>
                          <div
                            className="bg-red-500 h-full"
                            style={{ width: "10%" }}
                          ></div>
                        </>
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-brand-muted mt-1">
                      {scrapingResults.totalUrls > 0 ? (
                        <>
                          <div>
                            2xx Success:
                            {Math.round(
                              (Object.entries(
                                scrapingResults.statusDistribution,
                              )
                                .filter(([code]) => code.startsWith("2"))
                                .reduce((sum, [_, count]) => sum + count, 0) /
                                scrapingResults.totalUrls) *
                                100,
                            )}
                            %
                          </div>
                          <div>
                            3xx Redirect:
                            {Math.round(
                              (Object.entries(
                                scrapingResults.statusDistribution,
                              )
                                .filter(([code]) => code.startsWith("3"))
                                .reduce((sum, [_, count]) => sum + count, 0) /
                                scrapingResults.totalUrls) *
                                100,
                            )}
                            %
                          </div>
                          <div>
                            4xx/5xx Error:
                            {Math.round(
                              (Object.entries(
                                scrapingResults.statusDistribution,
                              )
                                .filter(
                                  ([code]) =>
                                    code.startsWith("4") ||
                                    code.startsWith("5"),
                                )
                                .reduce((sum, [_, count]) => sum + count, 0) /
                                scrapingResults.totalUrls) *
                                100,
                            )}
                            %
                          </div>
                        </>
                      ) : (
                        <>
                          <div>200 OK: 70%</div>
                          <div>30x Redirect: 20%</div>
                          <div>40x/50x Error: 10%</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 space-y-4">
                  <h4 className="text-md font-medium">Removed Elements</h4>
                  <p className="text-sm text-brand-muted">
                    Images, headers, footers, and ads removed
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-brand-light/20 p-3 rounded-md">
                      <div className="text-sm text-brand-muted">Images</div>
                      <div className="text-2xl font-semibold">
                        {scrapingResults.removedElements.images}
                      </div>
                    </div>

                    <div className="bg-brand-light/20 p-3 rounded-md">
                      <div className="text-sm text-brand-muted">Headers</div>
                      <div className="text-2xl font-semibold">
                        {scrapingResults.removedElements.headers}
                      </div>
                    </div>

                    <div className="bg-brand-light/20 p-3 rounded-md">
                      <div className="text-sm text-brand-muted">Footers</div>
                      <div className="text-2xl font-semibold">
                        {scrapingResults.removedElements.footers}
                      </div>
                    </div>

                    <div className="bg-brand-light/20 p-3 rounded-md">
                      <div className="text-sm text-brand-muted">Ads</div>
                      <div className="text-2xl font-semibold">
                        {scrapingResults.removedElements.ads}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 space-y-4">
                  <h4 className="text-md font-medium">Details</h4>

                  <div className="space-y-4">
                    <Tabs defaultValue="raw">
                      <TabsList>
                        <TabsTrigger value="raw">Raw HTML</TabsTrigger>
                        <TabsTrigger value="cleaned">Cleaned Text</TabsTrigger>
                        <TabsTrigger value="structured">
                          Structured Data
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="raw" className="mt-4">
                        <div className="bg-gray-50 p-4 rounded-md h-60 overflow-auto font-mono text-xs">
                          <pre>
                            {scrapingResults.rawHtml ||
                              `<!DOCTYPE html>
<html>
  <head>
    <title>Example Domain</title>
    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div>
      <h1>Example Domain</h1>
      <p>This domain is for use in illustrative examples in documents.</p>
      <p>You may use this domain in literature without prior coordination or asking for permission.</p>
    </div>
  </body>
</html>`}
                          </pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="cleaned" className="mt-4">
                        <div className="bg-gray-50 p-4 rounded-md h-60 overflow-auto text-xs">
                          {cleaningLevel === "basic" &&
                          scrapingResults.processedText ? (
                            <div>
                              {scrapingResults.processedText
                                .split("\n")
                                .map((line, i) => (
                                  <p
                                    key={i}
                                    className={
                                      i === 0
                                        ? "font-bold text-lg mb-2"
                                        : "mb-2"
                                    }
                                  >
                                    {line}
                                  </p>
                                ))}
                            </div>
                          ) : (
                            <div>
                              <p className="font-bold text-lg mb-2">
                                Example Domain
                              </p>
                              <p className="mb-2">
                                This domain is for use in illustrative examples
                                in documents.
                              </p>
                              <p>
                                You may use this domain in literature without
                                prior coordination or asking for permission.
                              </p>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="structured" className="mt-4">
                        <div className="bg-gray-50 p-4 rounded-md h-60 overflow-auto font-mono text-xs">
                          <pre>
                            {outputFormat === "json" &&
                            scrapingResults.processedText
                              ? scrapingResults.processedText
                              : `{
  "title": "Example Domain",
  "content": [
    "This domain is for use in illustrative examples in documents.",
    "You may use this domain in literature without prior coordination or asking for permission."
  ],
  "metadata": {
    "url": "${url}",
    "scrapedAt": "${new Date().toISOString()}"
  }
}`}
                          </pre>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
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
