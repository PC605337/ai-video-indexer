import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Clock, CheckCircle, XCircle, AlertCircle, User, FileText } from "lucide-react";
import { format } from "date-fns";

export default function ActivityLog() {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [processingJobs, setProcessingJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [auditRes, jobsRes] = await Promise.all([
        supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("processing_jobs").select("*").order("created_at", { ascending: false }).limit(50)
      ]);

      if (auditRes.data) setAuditLogs(auditRes.data);
      if (jobsRes.data) setProcessingJobs(jobsRes.data);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      in_progress: "secondary",
      failed: "destructive",
      queued: "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-secondary rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Activity Log</h1>
          <p className="text-muted-foreground">
            Monitor system activities, job queues, and user actions
          </p>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jobs">Processing Jobs</TabsTrigger>
            <TabsTrigger value="audit">User Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            {processingJobs.map((job) => (
              <Card key={job.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getStatusIcon(job.status)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{job.job_type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {job.created_at && format(new Date(job.created_at), "PPpp")}
                        </p>
                      </div>
                      {getStatusBadge(job.status)}
                    </div>
                    
                    {job.progress > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{job.progress}%</span>
                      </div>
                    )}

                    {job.node_id && (
                      <p className="text-sm text-muted-foreground">
                        Node: <span className="font-mono">{job.node_id}</span>
                      </p>
                    )}

                    {job.error_message && (
                      <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                        {job.error_message}
                      </div>
                    )}

                    <div className="flex gap-2 text-xs text-muted-foreground">
                      {job.started_at && (
                        <span>Started: {format(new Date(job.started_at), "pp")}</span>
                      )}
                      {job.completed_at && (
                        <span>• Completed: {format(new Date(job.completed_at), "pp")}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            {auditLogs.map((log) => (
              <Card key={log.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {log.action.includes("download") || log.action.includes("view") ? (
                      <FileText className="h-5 w-5 text-primary" />
                    ) : (
                      <User className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{log.action}</h3>
                        <p className="text-sm text-muted-foreground">
                          {log.created_at && format(new Date(log.created_at), "PPpp")}
                        </p>
                      </div>
                    </div>

                    {log.metadata && (
                      <div className="bg-secondary/50 p-3 rounded-lg">
                        <pre className="text-xs overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    )}

                    <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                      {log.ip_address && (
                        <span>IP: {log.ip_address}</span>
                      )}
                      {log.user_agent && (
                        <span>• User Agent: {log.user_agent.substring(0, 50)}...</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
