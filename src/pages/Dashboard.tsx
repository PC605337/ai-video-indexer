import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import {
  Database,
  HardDrive,
  TrendingUp,
  Clock,
  Film,
  Image,
  Users,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const indexingData = [
  { time: "00:00", processed: 1.2, queued: 0.8 },
  { time: "04:00", processed: 2.5, queued: 1.2 },
  { time: "08:00", processed: 4.8, queued: 2.1 },
  { time: "12:00", processed: 7.2, queued: 1.5 },
  { time: "16:00", processed: 9.5, queued: 0.9 },
  { time: "20:00", processed: 11.8, queued: 0.4 },
  { time: "Now", processed: 13.2, queued: 0.2 },
];

const storageData = [
  { month: "Jan", usage: 1850 },
  { month: "Feb", usage: 1920 },
  { month: "Mar", usage: 1980 },
  { month: "Apr", usage: 2050 },
  { month: "May", usage: 2150 },
  { month: "Jun", usage: 2200 },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-bold mb-2">Mission Control</h1>
              <p className="text-muted-foreground">
                Real-time insights into your AI indexing platform
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Assets"
                value="2.2M"
                change="+12.5% this week"
                icon={Database}
                trend="up"
                delay={0}
              />
              <StatCard
                title="Storage Used"
                value="2.2 PB"
                change="87% capacity"
                icon={HardDrive}
                trend="neutral"
                delay={0.1}
              />
              <StatCard
                title="Indexing Rate"
                value="13.2 TB"
                change="This week"
                icon={TrendingUp}
                trend="up"
                delay={0.2}
              />
              <StatCard
                title="Queue Status"
                value="0.2 TB"
                change="Processing"
                icon={Clock}
                trend="down"
                delay={0.3}
              />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Indexing Progress */}
              <Card className="p-6 glass animate-fade-in">
                <h3 className="text-lg font-semibold mb-4">
                  Indexing Progress (24h)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={indexingData}>
                    <defs>
                      <linearGradient
                        id="processedGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="hsl(355 92% 48%)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(355 92% 48%)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="queuedGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="hsl(180 100% 50%)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(180 100% 50%)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 7% 20%)" />
                    <XAxis dataKey="time" stroke="hsl(0 2% 71%)" />
                    <YAxis stroke="hsl(0 2% 71%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(240 7% 8%)",
                        border: "1px solid hsl(240 7% 20%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="processed"
                      stroke="hsl(355 92% 48%)"
                      fill="url(#processedGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="queued"
                      stroke="hsl(180 100% 50%)"
                      fill="url(#queuedGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Storage Trend */}
              <Card className="p-6 glass animate-fade-in">
                <h3 className="text-lg font-semibold mb-4">Storage Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={storageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 7% 20%)" />
                    <XAxis dataKey="month" stroke="hsl(0 2% 71%)" />
                    <YAxis stroke="hsl(0 2% 71%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(240 7% 8%)",
                        border: "1px solid hsl(240 7% 20%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="hsl(355 92% 48%)"
                      strokeWidth={3}
                      dot={{ fill: "hsl(355 92% 48%)", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Active Jobs */}
            <Card className="p-6 glass animate-fade-in">
              <h3 className="text-lg font-semibold mb-4">Active Indexing Jobs</h3>
              <div className="space-y-4">
                {[
                  {
                    name: "Lexus ES 2025 Campaign - RAW Footage",
                    type: "video",
                    progress: 78,
                    eta: "12 min",
                  },
                  {
                    name: "Toyota Manufacturing Plant - Texas",
                    type: "photo",
                    progress: 92,
                    eta: "3 min",
                  },
                  {
                    name: "Executive Interviews - Q1 2025",
                    type: "video",
                    progress: 45,
                    eta: "28 min",
                  },
                ].map((job, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {job.type === "video" ? (
                        <Film className="h-5 w-5 text-primary" />
                      ) : (
                        <Image className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">{job.name}</p>
                      <div className="flex items-center gap-3">
                        <Progress value={job.progress} className="h-2" />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {job.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ETA: {job.eta}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Film, label: "Videos", value: "842K" },
                { icon: Image, label: "Photos", value: "1.4M" },
                { icon: Users, label: "People Tagged", value: "12.5K" },
                { icon: Activity, label: "AI Accuracy", value: "99.3%" },
              ].map((stat, index) => (
                <Card
                  key={stat.label}
                  className="p-4 glass text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
