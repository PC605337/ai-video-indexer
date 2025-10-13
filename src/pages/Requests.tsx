import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Requests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("viewer_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("viewer_requests")
        .update({ status: "approved", reviewed_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Request approved");
      loadRequests();
    } catch (error) {
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("viewer_requests")
        .update({ status: "rejected", reviewed_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Request rejected");
      loadRequests();
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Access Requests</h1>
          <p className="text-muted-foreground">Review requests for restricted content</p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading requests...</p>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No access requests</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Asset ID: {request.asset_id}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Requested {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      request.status === "approved" ? "default" : 
                      request.status === "rejected" ? "destructive" : 
                      "secondary"
                    }>
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{request.purpose}</p>
                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(request.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Requests;
