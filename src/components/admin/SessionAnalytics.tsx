import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, PieChart, Download } from "lucide-react";

interface SessionAnalyticsProps {
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

const SessionAnalytics: React.FC<SessionAnalyticsProps> = ({
  timeRange = "week",
  onTimeRangeChange = () => {},
}) => {
  return (
    <div className="w-full bg-brand-light">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-brand-secondary">
              Session Analytics
            </CardTitle>
            <CardDescription className="text-brand-muted">
              Overview of guest session metrics and trends
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 90 Days</SelectItem>
                <SelectItem value="year">Last 365 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sessions">
            <TabsList className="mb-4">
              <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
              <TabsTrigger value="duration">Session Duration</TabsTrigger>
              <TabsTrigger value="queries">User Queries</TabsTrigger>
              <TabsTrigger value="conversion">Conversion Rates</TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="space-y-4">
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Daily Active Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                      <LineChart className="h-16 w-16 text-muted-foreground/70" />
                      <span className="sr-only">
                        Line chart showing daily active sessions
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Sessions by Time of Day
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                      <BarChart className="h-16 w-16 text-muted-foreground/70" />
                      <span className="sr-only">
                        Bar chart showing sessions by time of day
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="duration" className="space-y-4">
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Session Duration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                      <LineChart className="h-16 w-16 text-muted-foreground/70" />
                      <span className="sr-only">
                        Line chart showing average session duration
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Duration Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                      <BarChart className="h-16 w-16 text-muted-foreground/70" />
                      <span className="sr-only">
                        Bar chart showing duration distribution
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="queries" className="space-y-4">
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Most Common Queries
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                      <BarChart className="h-16 w-16 text-muted-foreground/70" />
                      <span className="sr-only">
                        Bar chart showing most common queries
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Query Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                      <PieChart className="h-16 w-16 text-muted-foreground/70" />
                      <span className="sr-only">
                        Pie chart showing query categories
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="conversion" className="space-y-4">
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Registration Conversion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                      <LineChart className="h-16 w-16 text-muted-foreground/70" />
                      <span className="sr-only">
                        Line chart showing registration conversion rate
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Session Completion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                      <LineChart className="h-16 w-16 text-muted-foreground/70" />
                      <span className="sr-only">
                        Line chart showing session completion rate
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionAnalytics;
