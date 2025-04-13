import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  Info,
  Clock,
  Shield,
  Repeat,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

interface AdvancedScrapingOptionsProps {
  selectorType: string;
  setSelectorType: (value: string) => void;
  rateLimit: number;
  setRateLimit: (value: number) => void;
  maxRetries: number;
  setMaxRetries: (value: number) => void;
  skipHeaders: boolean;
  setSkipHeaders: (value: boolean) => void;
  skipFooters: boolean;
  setSkipFooters: (value: boolean) => void;
  skipImages: boolean;
  setSkipImages: (value: boolean) => void;
  waitForDynamicContent: boolean;
  setWaitForDynamicContent: (value: boolean) => void;
  respectRobotsTxt: boolean;
  setRespectRobotsTxt: (value: boolean) => void;
  handlePagination: boolean;
  setHandlePagination: (value: boolean) => void;
  stealthMode: boolean;
  setStealthMode: (value: boolean) => void;
  enableProxy: boolean;
  setEnableProxy: (value: boolean) => void;
  followRedirects: boolean;
  setFollowRedirects: (value: boolean) => void;
  enableTextProcessing: boolean;
  setEnableTextProcessing: (value: boolean) => void;
  cleaningLevel: string;
  setCleaningLevel: (value: string) => void;
  outputFormat: string;
  setOutputFormat: (value: string) => void;
  preserveDocumentStructure: boolean;
  setPreserveDocumentStructure: (value: boolean) => void;
}

const AdvancedScrapingOptions: React.FC<AdvancedScrapingOptionsProps> = ({
  selectorType,
  setSelectorType,
  rateLimit,
  setRateLimit,
  maxRetries,
  setMaxRetries,
  skipHeaders,
  setSkipHeaders,
  skipFooters,
  setSkipFooters,
  skipImages,
  setSkipImages,
  waitForDynamicContent,
  setWaitForDynamicContent,
  respectRobotsTxt,
  setRespectRobotsTxt,
  handlePagination,
  setHandlePagination,
  stealthMode,
  setStealthMode,
  enableProxy,
  setEnableProxy,
  followRedirects,
  setFollowRedirects,
  enableTextProcessing,
  setEnableTextProcessing,
  cleaningLevel,
  setCleaningLevel,
  outputFormat,
  setOutputFormat,
  preserveDocumentStructure,
  setPreserveDocumentStructure,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Advanced Configuration</h3>
        <p className="text-sm text-brand-muted mb-4">
          Configure scraping options
        </p>
      </div>

      <div className="border rounded-md p-4 space-y-4">
        <h4 className="text-md font-medium">Scraping Options</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="selector-type">Selector Type</Label>
            <Select value={selectorType} onValueChange={setSelectorType}>
              <SelectTrigger id="selector-type">
                <SelectValue placeholder="Select selector type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="xpath">XPath</SelectItem>
                <SelectItem value="regex">RegEx</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate-limit">Rate Limit Delay (ms)</Label>
            <Input
              id="rate-limit"
              type="number"
              value={rateLimit}
              onChange={(e) => setRateLimit(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="max-retries">Max Retries</Label>
            <Input
              id="max-retries"
              type="number"
              value={maxRetries}
              onChange={(e) => setMaxRetries(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <TooltipProvider>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Skip Headers & Footers</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-brand-muted cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Automatically skip navigation, headers, and footers when
                      scraping content
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                checked={skipHeaders && skipFooters}
                onCheckedChange={(checked) => {
                  setSkipHeaders(checked);
                  setSkipFooters(checked);
                }}
              />
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Skip Images & Media</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-brand-muted cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Exclude images, videos, and other media from scraping
                      results
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch checked={skipImages} onCheckedChange={setSkipImages} />
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Wait for Dynamic Content</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Clock className="h-4 w-4 text-brand-muted cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Wait for JavaScript-rendered content to load before
                      scraping (Disabled in this environment)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                checked={waitForDynamicContent}
                onCheckedChange={setWaitForDynamicContent}
                disabled={true}
              />
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Respect robots.txt</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Shield className="h-4 w-4 text-brand-muted cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Follow website crawling rules defined in robots.txt
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                checked={respectRobotsTxt}
                onCheckedChange={setRespectRobotsTxt}
              />
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Handle Pagination</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ArrowRight className="h-4 w-4 text-brand-muted cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Automatically detect and follow pagination links
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                checked={handlePagination}
                onCheckedChange={setHandlePagination}
              />
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Stealth Mode</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-4 w-4 text-brand-muted cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Use techniques to avoid detection as a scraper
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch checked={stealthMode} onCheckedChange={setStealthMode} />
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Enable Proxy</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Shield className="h-4 w-4 text-brand-muted cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Route requests through proxy servers (Disabled in this
                      environment)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                checked={enableProxy}
                onCheckedChange={setEnableProxy}
                disabled={true}
              />
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Follow Redirects</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Repeat className="h-4 w-4 text-brand-muted cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">Automatically follow HTTP redirects</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                checked={followRedirects}
                onCheckedChange={setFollowRedirects}
              />
            </div>
          </TooltipProvider>
        </div>
      </div>

      <div className="border rounded-md p-4 space-y-4">
        <h4 className="text-md font-medium">Text Processing Options</h4>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Enable Text Processing</span>
          </div>
          <Switch
            checked={enableTextProcessing}
            onCheckedChange={setEnableTextProcessing}
          />
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          style={{ opacity: enableTextProcessing ? 1 : 0.5 }}
        >
          <div className="space-y-2">
            <Label htmlFor="cleaning-level">Cleaning Level</Label>
            <Select
              value={cleaningLevel}
              onValueChange={setCleaningLevel}
              disabled={!enableTextProcessing}
            >
              <SelectTrigger id="cleaning-level">
                <SelectValue placeholder="Select cleaning level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">
                  Basic (Remove HTML tags only)
                </SelectItem>
                <SelectItem value="thorough">
                  Thorough (Clean formatting and structure paragraphs)
                </SelectItem>
                <SelectItem value="semantic">
                  Semantic (Extract structured data based on content)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="output-format">Output Format</Label>
            <Select
              value={outputFormat}
              onValueChange={setOutputFormat}
              disabled={!enableTextProcessing}
            >
              <SelectTrigger id="output-format">
                <SelectValue placeholder="Select output format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div style={{ opacity: enableTextProcessing ? 1 : 0.5 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Preserve Document Structure</span>
            </div>
            <Switch
              checked={preserveDocumentStructure}
              onCheckedChange={setPreserveDocumentStructure}
              disabled={!enableTextProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedScrapingOptions;
