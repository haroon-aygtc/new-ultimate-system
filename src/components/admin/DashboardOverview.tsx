import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-brand-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-secondary">
              Session Activity (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full flex items-center justify-center bg-brand-light/50 rounded-md">
              <LineChart className="h-16 w-16 text-brand-muted" />
              <span className="sr-only">
                Line chart showing session activity
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-secondary">
              Conversion Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full flex items-center justify-center bg-brand-light/50 rounded-md">
              <PieChart className="h-16 w-16 text-brand-muted" />
              <span className="sr-only">
                Pie chart showing conversion metrics
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-brand-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-brand-secondary">
            Guest Engagement Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="messages">
            <TabsList className="mb-4">
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="duration">Duration</TabsTrigger>
              <TabsTrigger value="frequency">Frequency</TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="pt-2">
              <div className="h-[250px] w-full flex items-center justify-center bg-brand-light/50 rounded-md">
                <BarChart className="h-16 w-16 text-brand-muted" />
                <span className="sr-only">
                  Bar chart showing message metrics
                </span>
              </div>
            </TabsContent>

            <TabsContent value="duration" className="pt-2">
              <div className="h-[250px] w-full flex items-center justify-center bg-brand-light/50 rounded-md">
                <LineChart className="h-16 w-16 text-brand-muted" />
                <span className="sr-only">
                  Line chart showing duration metrics
                </span>
              </div>
            </TabsContent>

            <TabsContent value="frequency" className="pt-2">
              <div className="h-[250px] w-full flex items-center justify-center bg-brand-light/50 rounded-md">
                <BarChart className="h-16 w-16 text-brand-muted" />
                <span className="sr-only">
                  Bar chart showing frequency metrics
                </span>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-brand-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-secondary">
              Top Performing Prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {[
                "Welcome message",
                "Product inquiry",
                "Support request",
                "Pricing information",
                "Booking assistance",
              ].map((prompt, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-sm">{prompt}</span>
                  <span className="text-sm font-medium text-brand-primary">
                    {90 - index * 5}%
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-secondary">
              Common User Queries
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {[
                "How do I reset my password?",
                "What are your business hours?",
                "Do you offer refunds?",
                "How can I track my order?",
                "Where is your nearest location?",
              ].map((query, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-sm truncate">{query}</span>
                  <span className="text-sm font-medium text-brand-accent">
                    {120 - index * 15}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-secondary">
              User Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-5xl font-bold text-brand-primary mb-2">
                4.8
              </div>
              <div className="flex items-center mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? "text-yellow-400" : "text-brand-muted/30"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
              </div>
              <p className="text-sm text-brand-muted">
                Based on 1,248 sessions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
