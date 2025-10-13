import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, AlertCircle, Clock, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ApprovalStatus = "pending" | "approved" | "changes_requested" | "rejected";

interface ApprovalWorkflowProps {
  assetId: string;
  currentStatus?: ApprovalStatus;
  onStatusChange?: () => void;
}

export const ApprovalWorkflow = ({ assetId, currentStatus = "pending", onStatusChange }: ApprovalWorkflowProps) => {
  const [status, setStatus] = useState<ApprovalStatus>(currentStatus);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<ApprovalStatus | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (newStatus: ApprovalStatus, requiresComment: boolean) => {
    if (requiresComment) {
      setDialogType(newStatus);
      setShowDialog(true);
    } else {
      await updateStatus(newStatus, "");
    }
  };

  const updateStatus = async (newStatus: ApprovalStatus, statusComment: string) => {
    setIsSubmitting(true);
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      
      // Store approval status in a comment
      const { error } = await supabase.from("review_comments").insert([{
        asset_id: assetId,
        user_id: userData?.user?.id || '00000000-0000-0000-0000-000000000000',
        comment: `Approval ${newStatus}: ${statusComment || 'No comment provided'}`,
        status: newStatus === "approved" ? "resolved" : "open",
      }]);

      if (error) throw error;

      setStatus(newStatus);
      toast.success(`Status updated to ${newStatus}`);
      setShowDialog(false);
      setComment("");
      onStatusChange?.();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogSubmit = async () => {
    if (dialogType === "changes_requested" && !comment.trim()) {
      toast.error("Please provide details about requested changes");
      return;
    }
    if (dialogType) {
      await updateStatus(dialogType, comment);
    }
  };

  const statusConfig = {
    pending: {
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      label: "Pending Review",
    },
    approved: {
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-600 border-green-500/20",
      label: "Approved",
    },
    changes_requested: {
      icon: AlertCircle,
      color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      label: "Changes Requested",
    },
    rejected: {
      icon: XCircle,
      color: "bg-red-500/10 text-red-600 border-red-500/20",
      label: "Rejected",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Approval Status</h3>
            <Badge className={`${config.color} border`}>
              <Icon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="gap-2 hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/20"
              onClick={() => handleStatusChange("approved", false)}
              disabled={status === "approved"}
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </Button>

            <Button
              variant="outline"
              className="gap-2 hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-500/20"
              onClick={() => handleStatusChange("changes_requested", true)}
              disabled={status === "changes_requested"}
            >
              <AlertCircle className="h-4 w-4" />
              Request Changes
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full gap-2 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/20"
            onClick={() => handleStatusChange("rejected", true)}
            disabled={status === "rejected"}
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>

          {status !== "pending" && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                Status changed on {new Date().toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "changes_requested" ? "Request Changes" : "Reject Asset"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "changes_requested"
                ? "Provide specific feedback about what needs to be changed."
                : "Provide a reason for rejecting this asset."}
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            placeholder="Enter your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            className="resize-none"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDialogSubmit} disabled={isSubmitting}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
