import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity, Zap } from "lucide-react";

const performanceData = [
  { time: "00:00", faceAccuracy: 98.2, vehicleAccuracy: 95.8, languageAccuracy: 93.5 },
  { time: "04:00", faceAccuracy: 98.5, vehicleAccuracy: 96.1, languageAccuracy: 94.2 },
  { time: "08:00", faceAccuracy: 98.7, vehicleAccuracy: 96.3, languageAccuracy: 94.5 },
  { time: "12:00", faceAccuracy: 98.4, vehicleAccuracy: 96.0, languageAccuracy: 94.1 },
  { time: "16:00", faceAccuracy: 98.6, vehicleAccuracy: 96.2, languageAccuracy: 94.3 },
  { time: "20:00", faceAccuracy: 98.3, vehicleAccuracy: 95.9, languageAccuracy: 93.8 },
];

const throughputData = [
  { node: "M3 Ultra #1", throughput: 485, utilization: 95 },
  { node: "M3 Ultra #2", throughput: 468, utilization: 92 },
  { node: "M3 Ultra #3", throughput: 450, utilization: 88 },
  { node: "Mac Pro", throughput: 320, utilization: 68 },
];

const Analytics = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Overall Model Analytics</h1>
            <p className="text-muted-foreground">System-wide model performance, optimization, and operational intelligence</p>
          </div>

          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance Dashboard</TabsTrigger>
              <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
              <TabsTrigger value="throughput">Node Analysis</TabsTrigger>
              <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Face Recognition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">98.7%</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-accent" /> +0.3% from baseline
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Vehicle Detection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">96.3%</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-accent" /> +0.5% from baseline
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Language Transcription</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">94.5%</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-accent" /> +0.2% from baseline
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Avg Model Latency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">142ms</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-accent" /> -8ms improvement
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Model Accuracy Trends (24h)</CardTitle>
                  <CardDescription>Real-time accuracy monitoring across all AI models</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="time" className="text-xs" />
                        <YAxis domain={[90, 100]} className="text-xs" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="faceAccuracy" stroke="hsl(var(--accent))" name="Face Recognition" strokeWidth={2} />
                        <Line type="monotone" dataKey="vehicleAccuracy" stroke="hsl(var(--chart-3))" name="Vehicle Detection" strokeWidth={2} />
                        <Line type="monotone" dataKey="languageAccuracy" stroke="hsl(var(--chart-2))" name="Language" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <div className="grid gap-6">
                <Card className="glass border-accent/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-accent" />
                        <div>
                          <CardTitle>Optimal Performance Detected</CardTitle>
                          <CardDescription>All models operating within target parameters</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-accent text-accent">High Priority</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">M3 Ultra #3 showing peak efficiency at 95% GPU utilization with 485 MB/s throughput. Consider routing more face recognition tasks to this node.</p>
                  </CardContent>
                </Card>

                <Card className="glass border-chart-3/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Zap className="h-6 w-6 text-chart-3" />
                        <div>
                          <CardTitle>Retraining Recommended</CardTitle>
                          <CardDescription>Vehicle detection model</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-chart-3 text-chart-3">Medium Priority</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">42 new vehicle images detected this week. Retraining with expanded dataset could improve accuracy by estimated 0.8-1.2%.</p>
                  </CardContent>
                </Card>

                <Card className="glass border-muted">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <CardTitle>Load Balancing Optimization</CardTitle>
                          <CardDescription>Mac Pro node underutilized</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">Low Priority</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Mac Pro running at 68% capacity. Consider redistributing language transcription tasks from M3 nodes to improve overall throughput.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="throughput" className="space-y-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Node Throughput & Utilization</CardTitle>
                  <CardDescription>Processing rates and GPU load per node</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={throughputData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="node" className="text-xs" />
                        <YAxis yAxisId="left" className="text-xs" />
                        <YAxis yAxisId="right" orientation="right" className="text-xs" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="throughput" fill="hsl(var(--accent))" name="Throughput (MB/s)" />
                        <Bar yAxisId="right" dataKey="utilization" fill="hsl(var(--chart-3))" name="Utilization (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base">Bottleneck Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Network I/O</span>
                      <Badge variant="outline" className="border-accent text-accent">Normal</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Storage Read/Write</span>
                      <Badge variant="outline" className="border-accent text-accent">Normal</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">GPU Memory</span>
                      <Badge variant="outline" className="border-chart-3 text-chart-3">Monitor</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-base">Health Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent"></div>
                      <span className="text-sm">Mac Studio M3 Ultra #1, #2, #3</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-chart-3"></div>
                      <span className="text-sm">Mac Pro (2019)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-muted"></div>
                      <span className="text-sm">No Critical Issues</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="diagnostics" className="space-y-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Interactive Pipeline Diagnostics</CardTitle>
                  <CardDescription>Real-time AI pipeline visualization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { pipeline: "Face Recognition Pipeline", status: "normal", tasks: 12, avgTime: "1.2s" },
                      { pipeline: "Vehicle Detection Pipeline", status: "normal", tasks: 8, avgTime: "0.9s" },
                      { pipeline: "Language Transcription Pipeline", status: "congested", tasks: 24, avgTime: "3.1s" },
                      { pipeline: "Scene Classification Pipeline", status: "normal", tasks: 6, avgTime: "1.8s" },
                    ].map((pipeline) => (
                      <div key={pipeline.pipeline} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-4">
                          <div className={`h-3 w-3 rounded-full ${
                            pipeline.status === "normal" ? "bg-accent animate-pulse" : 
                            pipeline.status === "congested" ? "bg-chart-3" : "bg-destructive"
                          }`}></div>
                          <div>
                            <div className="font-semibold">{pipeline.pipeline}</div>
                            <div className="text-sm text-muted-foreground">{pipeline.tasks} active tasks</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{pipeline.avgTime}</div>
                          <div className="text-xs text-muted-foreground">avg processing time</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
