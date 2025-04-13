import React, { useState, useEffect } from "react";
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
  Loader2,
  CheckCircle,
  XCircle,
  LayoutGrid,
  Layers,
} from "lucide-react";
import AdvancedScrapingOptions from "./AdvancedScrapingOptions";
import { substituteTemplateVariables } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ScrapingSystem = () => {
  // Basic configuration state
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
  const [activeTab, setActiveTab] = useState("configure");

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

  // Live visualization state
  const [resultsView, setResultsView] = useState("table"); // table, json, preview
  const [scrapingResults, setScrapingResults] = useState([]);

  // History tracking state
  const [scrapingHistory, setScrapingHistory] = useState([]);
  const [selectedHistoryTask, setSelectedHistoryTask] = useState(null);

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

      // Generate simulated results for live visualization
      const simulatedResults = [];
      selectors.forEach((selector, index) => {
        // Generate 1-5 results per selector
        const resultCount = 1 + Math.floor(Math.random() * 5);
        for (let i = 0; i < resultCount; i++) {
          simulatedResults.push({
            id: `result-${Date.now()}-${index}-${i}`,
            groupId: `selector-${index}`,
            selectorName: selector.name,
            text:
              selector.name === "Title"
                ? "Example Domain"
                : selector.name === "Description"
                  ? "This domain is for use in illustrative examples in documents."
                  : `Sample content for ${selector.name} #${i + 1}`,
            attributes: {
              ...(selector.attribute === "src"
                ? { src: "https://example.com/image.jpg" }
                : {}),
              ...(selector.attribute === "href"
                ? { href: "https://example.com/link" }
                : {}),
              ...(selector.attribute === "alt"
                ? { alt: `${selector.name} alt text` }
                : {}),
            },
            html: `<div class="${selector.name.toLowerCase()}">${
              selector.name === "Title"
                ? "Example Domain"
                : selector.name === "Description"
                  ? "This domain is for use in illustrative examples in documents."
                  : `Sample content for ${selector.name} #${i + 1}`
            }</div>`,
          });
        }
      });

      // Update the results state
      setScrapingResults(simulatedResults);

      // Add to history
      const historyEntry = {
        id: `task-${Date.now()}`,
        url,
        timestamp: new Date().toLocaleString(),
        status: "completed",
        resultsCount: simulatedResults.length,
        exportFormat,
        duration: `${timeDiff.toFixed(2)}s`,
        config: scrapingConfig,
        results: simulatedResults,
      };
      setScrapingHistory([historyEntry, ...scrapingHistory]);

      setIsLoading(false);
      setActiveTab("results");
    }, 1500);
  };

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
    if (scrapingResults.length === 0) return;

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

    // Format the export content based on the selected format
    switch (exportFormat) {
      case "json":
        exportData = {
          results: scrapingResults,
          metadata: includeMetadata
            ? {
                url,
                scrapedAt: new Date().toISOString(),
                totalResults: scrapingResults.length,
                exportConfig,
              }
            : undefined,
        };
        exportContent = JSON.stringify(exportData, null, prettyPrint ? 2 : 0);
        break;
      case "csv":
        // Simple CSV conversion
        const csvRows = ["selector,text,attributes"];
        scrapingResults.forEach((result) => {
          csvRows.push(
            `"${result.selectorName}","${result.text.replace(/"/g, '""')}","${JSON.stringify(result.attributes).replace(/"/g, '""')}"`,
          );
        });
        exportContent = csvRows.join("\n");
        break;
      case "text":
        exportContent = scrapingResults
          .map((result) => `${result.selectorName}: ${result.text}`)
          .join("\n\n");
        break;
      case "html":
        exportContent = `<!DOCTYPE html>
<html>
<head>
  <title>Scraping Results</title>
  <meta charset="${encoding}">
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .result { margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; }
    .selector-name { font-weight: bold; margin-bottom: 5px; }
    .attributes { color: #666; font-size: 0.9em; margin-top: 5px; }
  </style>
</head>
<body>
  <h1>Scraping Results</h1>
  ${scrapingResults
    .map(
      (result) => `
  <div class="result">
    <div class="selector-name">${result.selectorName}</div>
    <div class="content">${result.text}</div>
    ${
      Object.keys(result.attributes).length > 0
        ? `
    <div class="attributes">
      Attributes: ${Object.entries(result.attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(", ")}
    </div>`
        : ""
    }
  </div>`,
    )
    .join("")}
</body>
</html>`;
        break;
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

  // Function to load a historical task
  const loadHistoricalTask = (taskId) => {
    const task = scrapingHistory.find((t) => t.id === taskId);
    if (task) {
      setSelectedHistoryTask(taskId);
      setScrapingResults(task.results);
      setActiveTab("results");
    }
  };

  // Function to get selector color based on index
  const getSelectorColor = (index) => {
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
    ];
    return colors[index % colors.length];
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
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
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

                <div className="pt-4">
                  <Button
                    className="w-full bg-brand-primary text-white"
                    onClick={runScraper}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running Scraper...
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
                    <Badge variant="outline">
                      {scrapingResults.length} items
                    </Badge>
                  </div>

                  <div className="h-[400px] overflow-auto bg-white border rounded-md p-4">
                    {scrapingResults.length > 0 ? (
                      <div className="space-y-4">
                        {selectors.map((selector, index) => {
                          const selectorResults = scrapingResults.filter(
                            (result) => result.selectorName === selector.name,
                          );
                          if (selectorResults.length === 0) return null;

                          return (
                            <div key={index} className="space-y-2">
                              <h3
                                className="text-sm font-medium flex items-center"
                                style={{ color: getSelectorColor(index) }}
                              >
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{
                                    backgroundColor: getSelectorColor(index),
                                  }}
                                ></div>
                                {selector.name} ({selectorResults.length})
                              </h3>
                              <div className="border rounded-md divide-y">
                                {selectorResults.map((result) => (
                                  <div key={result.id} className="p-3 text-sm">
                                    <div className="space-y-2">
                                      <div>
                                        <p>{result.text}</p>
                                      </div>

                                      {Object.keys(result.attributes).length >
                                        0 && (
                                        <div className="text-xs text-brand-muted">
                                          <p className="font-medium">
                                            Attributes:
                                          </p>
                                          <div className="space-y-1">
                                            {Object.entries(
                                              result.attributes,
                                            ).map(([key, value]) => (
                                              <div key={key}>
                                                <span className="font-medium">
                                                  {key}:
                                                </span>{" "}
                                                {value}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-brand-muted">
                        <Globe className="h-12 w-12 mb-2 opacity-20" />
                        <p className="text-sm">No data available</p>
                        <p className="text-xs mt-1">
                          Configure your selectors and run the scraper to see
                          results
                        </p>
                      </div>
                    )}
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
                    disabled={scrapingResults.length === 0 || isLoading}
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
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Scraping Results</h3>
                    <p className="text-sm text-brand-muted">
                      View and analyze the data extracted from the target
                      website
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              resultsView === "table" ? "default" : "outline"
                            }
                            size="icon"
                            onClick={() => setResultsView("table")}
                          >
                            <LayoutGrid className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Table View</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              resultsView === "json" ? "default" : "outline"
                            }
                            size="icon"
                            onClick={() => setResultsView("json")}
                          >
                            <Code className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>JSON View</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              resultsView === "preview" ? "default" : "outline"
                            }
                            size="icon"
                            onClick={() => setResultsView("preview")}
                          >
                            <Layers className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Visual Preview</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {scrapingResults.length === 0 ? (
                  <div className="border rounded-md p-8 bg-muted/50 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Globe className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Run a scraping task to see results here
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("configure")}
                      >
                        Go to Configuration
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resultsView === "table" && (
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[150px]">
                                Selector
                              </TableHead>
                              <TableHead>Content</TableHead>
                              <TableHead className="w-[200px]">
                                Attributes
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {scrapingResults.map((result) => (
                              <TableRow key={result.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{
                                        backgroundColor: getSelectorColor(
                                          selectors.findIndex(
                                            (s) =>
                                              s.name === result.selectorName,
                                          ),
                                        ),
                                      }}
                                    ></div>
                                    <span>{result.selectorName}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="max-h-20 overflow-auto">
                                    <p className="whitespace-pre-wrap text-sm">
                                      {result.text}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {Object.keys(result.attributes).length > 0 ? (
                                    <div className="max-h-20 overflow-auto">
                                      {Object.entries(result.attributes).map(
                                        ([key, value]) => (
                                          <div key={key} className="text-sm">
                                            <span className="font-medium">
                                              {key}:
                                            </span>{" "}
                                            {value}
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">
                                      No attributes
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {resultsView === "json" && (
                      <div className="border rounded-md p-4 bg-muted/50 overflow-auto max-h-[500px]">
                        <pre className="text-xs">
                          {JSON.stringify(scrapingResults, null, 2)}
                        </pre>
                      </div>
                    )}

                    {resultsView === "preview" && (
                      <div className="space-y-4">
                        {selectors.map((selector, index) => {
                          const selectorResults = scrapingResults.filter(
                            (result) => result.selectorName === selector.name,
                          );
                          if (selectorResults.length === 0) return null;

                          return (
                            <div key={index} className="space-y-2">
                              <h3
                                className="text-sm font-medium flex items-center"
                                style={{ color: getSelectorColor(index) }}
                              >
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{
                                    backgroundColor: getSelectorColor(index),
                                  }}
                                ></div>
                                {selector.name} ({selectorResults.length})
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {selectorResults.map((result) => (
                                  <div
                                    key={result.id}
                                    className="border rounded-md p-3 text-sm"
                                    style={{
                                      borderLeftColor: getSelectorColor(index),
                                      borderLeftWidth: "3px",
                                    }}
                                  >
                                    <div className="space-y-2">
                                      <div className="max-h-24 overflow-auto">
                                        <p className="whitespace-pre-wrap">
                                          {result.text}
                                        </p>
                                      </div>

                                      {Object.keys(result.attributes).length >
                                        0 && (
                                        <div>
                                          <p className="text-xs font-medium text-muted-foreground mb-1">
                                            Attributes:
                                          </p>
                                          <div className="space-y-1">
                                            {Object.entries(
                                              result.attributes,
                                            ).map(([key, value]) => (
                                              <div
                                                key={key}
                                                className="text-xs"
                                              >
                                                <span className="font-medium">
                                                  {key}:
                                                </span>{" "}
                                                {value}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-sm text-muted-foreground">
                        {scrapingResults.length} results found
                      </div>
                      <Button onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" /> Export as{" "}
                        {exportFormat.toUpperCase()}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapingSystem;
