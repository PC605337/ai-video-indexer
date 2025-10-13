import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, MessageSquare, Clock, User, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReviewComment {
  id: string;
  user_id: string;
  comment: string;
  timeframe_start?: number;
  timeframe_end?: number;
  position_x?: number;
  position_y?: number;
  status: string;
  created_at: string;
  resolved_at?: string;
}

interface ReviewPanelProps {
  assetId: string;
  assetType: "video" | "image";
  comments: ReviewComment[];
  onCommentAdded: () => void;
  onTimeframeClick?: (time: number) => void;
}

export const ReviewPanel = ({ assetId, assetType, comments, onCommentAdded, onTimeframeClick }: ReviewPanelProps) => {
  const [showAddComment, setShowAddComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [timeframeStart, setTimeframeStart] = useState<string>("");
  const [timeframeEnd, setTimeframeEnd] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const commentData: any = {
        asset_id: assetId,
        comment: newComment,
        status: "open",
      };

      if (assetType === "video" && timeframeStart) {
        commentData.timeframe_start = parseFloat(timeframeStart);
        if (timeframeEnd) {
          commentData.timeframe_end = parseFloat(timeframeEnd);
        }
      }

      const { error } = await supabase.from("review_comments").insert(commentData);

      if (error) throw error;

      toast.success("Review comment added");
      setNewComment("");
      setTimeframeStart("");
      setTimeframeEnd("");
      setShowAddComment(false);
      onCommentAdded();
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("review_comments")
        .update({ status: "resolved", resolved_at: new Date().toISOString() })
        .eq("id", commentId);

      if (error) throw error;

      toast.success("Comment marked as resolved");
      onCommentAdded();
    } catch (error) {
      toast.error("Failed to resolve comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase.from("review_comments").delete().eq("id", commentId);

      if (error) throw error;

      toast.success("Comment deleted");
      onCommentAdded();
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const formatTimeframe = (start?: number, end?: number) => {
    if (!start) return null;
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };
    return end ? `${formatTime(start)} - ${formatTime(end)}` : formatTime(start);
  };

  const openComments = comments.filter((c) => c.status === "open");
  const resolvedComments = comments.filter((c) => c.status === "resolved");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Review Comments</h3>
          <Badge variant="secondary">{openComments.length} open</Badge>
        </div>
        <Button onClick={() => setShowAddComment(true)} size="sm">
          Add Comment
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {/* Open Comments */}
          {openComments.map((comment) => (
            <Card key={comment.id} className="p-4 border-l-4 border-l-primary">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      {assetType === "video" && (comment.timeframe_start || comment.timeframe_end) && (
                        <Badge
                          variant="outline"
                          className="mb-2 cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => onTimeframeClick?.(comment.timeframe_start || 0)}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeframe(comment.timeframe_start, comment.timeframe_end)}
                        </Badge>
                      )}
                      <p className="text-sm">{comment.comment}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="default">Open</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleResolveComment(comment.id)}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Resolved Comments */}
          {resolvedComments.length > 0 && (
            <>
              <div className="text-sm font-medium text-muted-foreground mt-4 mb-2">
                Resolved ({resolvedComments.length})
              </div>
              {resolvedComments.map((comment) => (
                <Card key={comment.id} className="p-4 opacity-60">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-muted">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      {assetType === "video" && (comment.timeframe_start || comment.timeframe_end) && (
                        <Badge variant="outline" className="mb-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeframe(comment.timeframe_start, comment.timeframe_end)}
                        </Badge>
                      )}
                      <p className="text-sm">{comment.comment}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Resolved {new Date(comment.resolved_at || comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}

          {comments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No review comments yet</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Add Comment Dialog */}
      <Dialog open={showAddComment} onOpenChange={setShowAddComment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Review Comment</DialogTitle>
            <DialogDescription>
              Provide feedback for this {assetType}. {assetType === "video" && "You can specify a timeframe."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {assetType === "video" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Time (seconds)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={timeframeStart}
                    onChange={(e) => setTimeframeStart(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">End Time (seconds)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={timeframeEnd}
                    onChange={(e) => setTimeframeEnd(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    step="0.1"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Comment</label>
              <Textarea
                placeholder="Enter your review comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddComment(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddComment} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Comment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
