import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const gpuData = [
  { time: "00:00", node1: 65, node2: 78, node3: 82, macPro: 45 },
  { time: "04:00", node1: 72, node2: 85, node3: 88, macPro: 52 },
  { time: "08:00", node1: 88, node2: 92, node3: 95, macPro: 68 },
  { time: "12:00", node1: 78, node2: 88, node3: 90, macPro: 58 },
  { time: "16:00", node1: 85, node2: 90, node3: 93, macPro: 65 },
  { time: "20:00", node1: 70, node2: 82, node3: 85, macPro: 48 },
];

const ModelPerformance = () => {
  return (
    <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Model Performance & Library Training</h1>
            <p className="text-muted-foreground">Training status, dataset composition, and real-time metrics</p>
          </div>

          <Tabs defaultValue="gpu" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="gpu">GPU/CPU Utilization</TabsTrigger>
              <TabsTrigger value="face">Face Library</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle Library</TabsTrigger>
              <TabsTrigger value="language">Language Models</TabsTrigger>
            </TabsList>

            <TabsContent value="gpu" className="space-y-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Real-Time Node Utilization</CardTitle>
                  <CardDescription>GPU load across all processing nodes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={gpuData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="time" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Area type="monotone" dataKey="node1" stackId="1" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="node2" stackId="2" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="node3" stackId="3" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="macPro" stackId="4" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Mac Studio M3 Ultra #1", gpu: 88, cpu: 65, throughput: "450 MB/s" },
                  { name: "Mac Studio M3 Ultra #2", gpu: 92, cpu: 72, throughput: "468 MB/s" },
                  { name: "Mac Studio M3 Ultra #3", gpu: 95, cpu: 78, throughput: "485 MB/s" },
                  { name: "Mac Pro (2019)", gpu: 68, cpu: 55, throughput: "320 MB/s" },
                ].map((node) => (
                  <Card key={node.name} className="glass">
                    <CardHeader>
                      <CardTitle className="text-base">{node.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>GPU</span>
                          <span className="font-bold">{node.gpu}%</span>
                        </div>
                        <Progress value={node.gpu} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>CPU</span>
                          <span className="font-bold">{node.cpu}%</span>
                        </div>
                        <Progress value={node.cpu} className="h-2" />
                      </div>
                      <div className="text-center pt-2 border-t">
                        <div className="text-xs text-muted-foreground">Throughput</div>
                        <div className="text-lg font-bold text-accent">{node.throughput}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="face" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Total Faces</CardTitle>
                    <CardDescription>Auto-generated library</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-accent">1,247</div>
                    <p className="text-sm text-muted-foreground mt-2">Executives + Employees</p>
                  </CardContent>
                </Card>
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Model Accuracy</CardTitle>
                    <CardDescription>Face recognition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-accent">98.7%</div>
                    <p className="text-sm text-muted-foreground mt-2">Last trained: Jan 15, 2024</p>
                  </CardContent>
                </Card>
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>New Faces</CardTitle>
                    <CardDescription>This week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-accent">42</div>
                    <p className="text-sm text-muted-foreground mt-2">Pending review</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="vehicle" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Vehicle Models</CardTitle>
                    <CardDescription>Toyota + Lexus (1960-present)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-accent">342</div>
                    <p className="text-sm text-muted-foreground mt-2">North America catalog</p>
                  </CardContent>
                </Card>
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Detection Accuracy</CardTitle>
                    <CardDescription>Vehicle recognition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-accent">96.3%</div>
                    <p className="text-sm text-muted-foreground mt-2">Last trained: Jan 10, 2024</p>
                  </CardContent>
                </Card>
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>New Detections</CardTitle>
                    <CardDescription>This week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-accent">18</div>
                    <p className="text-sm text-muted-foreground mt-2">Auto-classified</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="language" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                    <CardDescription>Supported languages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-accent">12</div>
                    <p className="text-sm text-muted-foreground mt-2">EN, JP, ES, FR, DE, ZH...</p>
                  </CardContent>
                </Card>
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Transcription Accuracy</CardTitle>
                    <CardDescription>Speech-to-text</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-accent">94.5%</div>
                    <p className="text-sm text-muted-foreground mt-2">Last trained: Jan 12, 2024</p>
                  </CardContent>
                </Card>
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Hours Processed</CardTitle>
                    <CardDescription>This month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-accent">1,842</div>
                    <p className="text-sm text-muted-foreground mt-2">Audio transcribed</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
  );
};

export default ModelPerformance;
