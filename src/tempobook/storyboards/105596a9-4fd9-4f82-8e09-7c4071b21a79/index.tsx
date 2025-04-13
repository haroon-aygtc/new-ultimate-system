import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResponseFormatsStoryboard() {
  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Response Format Manager</h1>
      <Card>
        <CardHeader>
          <CardTitle>Response Format</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a simplified version of the response format manager.</p>
          <p>
            The previous version had syntax errors that were causing build
            failures.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
