import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, CheckCircle, AlertCircle } from "lucide-react";

const jobs = [
  {
    id: "1",
    name: "Toyota Camry 2024 Launch - Face Recognition",
    status: "processing",
    progress: 67,
    eta: "4m 23s",
    node: "Mac Studio M3 Ultra #1",
  },
  {
    id: "2",
    name: "Executive Interviews Batch - Transcription",
    status: "processing",
    progress: 42,
    eta: "8m 15s",
    node: "Mac Studio M3 Ultra #2",
  },
  {
    id: "3",
    name: "Vehicle Library Training - Object Detection",
    status: "queued",
    progress: 0,
    eta: "Pending",
    node: "Mac Pro (2019)",
  },
  {
    id: "4",
    name: "Manufacturing Plant Tour - Scene Analysis",
    status: "completed",
    progress: 100,
    eta: "Completed",
    node: "Mac Studio M3 Ultra #3",
  },
];

const Jobs = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Jobs</h1>
            <p className="text-muted-foreground">Active and queued processing tasks</p>
          </div>

          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="glass">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg">{job.name}</CardTitle>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            job.status === "completed"
                              ? "default"
                              : job.status === "processing"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {job.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {job.status === "processing" && <Play className="h-3 w-3 mr-1" />}
                          {job.status === "queued" && <Pause className="h-3 w-3 mr-1" />}
                          {job.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{job.node}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{job.progress}%</div>
                      <div className="text-sm text-muted-foreground">ETA: {job.eta}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={job.progress} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Jobs;
