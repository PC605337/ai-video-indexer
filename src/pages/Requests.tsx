import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, Download, Eye, Edit3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Requests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

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

  const getRequestIcon = (type: string) => {
    switch (type) {
      case "download":
        return <Download className="h-4 w-4" />;
      case "edit":
        return <Edit3 className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getRequestTypeLabel = (type: string) => {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : "View";
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedRequests = requests.filter((r) => r.status === "approved");
  const rejectedRequests = requests.filter((r) => r.status === "rejected");

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Access Requests</h1>
          <p className="text-muted-foreground">
            Review and manage requests for asset access, downloads, and editing rights
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">
              Pending <Badge variant="secondary" className="ml-2">{pendingRequests.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved <Badge variant="secondary" className="ml-2">{approvedRequests.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected <Badge variant="secondary" className="ml-2">{rejectedRequests.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No pending requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {getRequestIcon(request.request_type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {getRequestTypeLabel(request.request_type)} Request
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Asset ID: {request.asset_id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Requested {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{request.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4 bg-muted/50 p-3 rounded-lg">{request.purpose}</p>
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
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4 mt-6">
            {approvedRequests.map((request) => (
              <Card key={request.id} className="border-green-500/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        {getRequestIcon(request.request_type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {getRequestTypeLabel(request.request_type)} Request
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Asset ID: {request.asset_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Approved {new Date(request.reviewed_at || request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-500">Approved</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{request.purpose}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4 mt-6">
            {rejectedRequests.map((request) => (
              <Card key={request.id} className="border-destructive/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-destructive/10">
                        {getRequestIcon(request.request_type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {getRequestTypeLabel(request.request_type)} Request
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Asset ID: {request.asset_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rejected {new Date(request.reviewed_at || request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="destructive">Rejected</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{request.purpose}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Requests;
