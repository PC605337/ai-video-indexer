import { Lock, Unlock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CodeRedAccessProps {
  assetId: string;
  classification?: string;
}

export const CodeRedAccess = ({ assetId, classification }: CodeRedAccessProps) => {
  const isCodeRed = classification === "code_red";

  if (!isCodeRed) return null;

  return (
    <div className="w-full max-w-[960px] mt-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex items-center gap-3">
      <Lock className="h-5 w-5 text-destructive" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-destructive">Code Red Classification</h4>
          <Badge variant="destructive" className="text-xs">Restricted Access</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          This asset is classified as Code Red. Access is restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
};
