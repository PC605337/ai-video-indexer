import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Video } from "lucide-react";
import { StatCard } from "@/components/StatCard";

const Analytics = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Analytics</h1>
            <p className="text-muted-foreground">Track your platform usage and insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Video}
              title="Total Videos"
              value="0"
              change="+0%"
              trend="neutral"
            />
            <StatCard
              icon={BarChart3}
              title="Processing Time"
              value="0h"
              change="+0%"
              trend="neutral"
            />
            <StatCard
              icon={TrendingUp}
              title="AI Insights"
              value="0"
              change="+0%"
              trend="neutral"
            />
            <StatCard
              icon={Users}
              title="Active Users"
              value="1"
              change="+0%"
              trend="neutral"
            />
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Usage Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analytics data will appear here as you use the platform
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
