import { ExternalLink, HardDrive, Database, FileBox, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FilePathTraceabilityProps {
  nasPath?: string;
  s3Path?: string;
  proxyPath?: string;
  finalPath?: string;
  versionLineage?: any[];
}

export const FilePathTraceability = ({
  nasPath,
  s3Path,
  proxyPath,
  finalPath,
  versionLineage = []
}: FilePathTraceabilityProps) => {
  const paths = [
    { 
      label: "NAS", 
      path: nasPath, 
      icon: HardDrive, 
      color: "text-blue-500",
      format: "NAS://<Server>/<Share>/<Project>/<Folder>/<FileName>"
    },
    { 
      label: "S3 Glacier", 
      path: s3Path, 
      icon: Database, 
      color: "text-purple-500",
      format: "S3://<Bucket>/<Prefix>/<Project>/<Folder>/<FileName>"
    },
    { 
      label: "Proxy", 
      path: proxyPath, 
      icon: FileBox, 
      color: "text-orange-500",
      format: "Proxy://<Node>/<Project>/<Folder>/<FileName>"
    },
    { 
      label: "Final", 
      path: finalPath, 
      icon: CheckCircle, 
      color: "text-green-500",
      format: "Final://<Project>/<Folder>/<FileName>"
    }
  ];

  const handlePathClick = (path: string) => {
    // In production, this would open the actual file location
    window.open(path, '_blank');
  };

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-sm mb-1">Source File Path Traceability</h3>
        <p className="text-xs text-muted-foreground">
          Full path lineage maintained across all storage locations
        </p>
      </div>

      <Separator />

      <div className="space-y-3">
        {paths.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1.5">
                <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                {item.label}
              </Label>
              {item.path ? (
                <button
                  onClick={() => handlePathClick(item.path)}
                  className="w-full text-left p-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <code className="text-xs font-mono text-foreground break-all">
                      {item.path}
                    </code>
                    <ExternalLink className="h-3 w-3 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ) : (
                <div className="p-2 rounded-md bg-muted/30">
                  <code className="text-xs text-muted-foreground italic">
                    {item.format}
                  </code>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {versionLineage && versionLineage.length > 0 && (
        <>
          <Separator />
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Version History</Label>
            <div className="space-y-1">
              {versionLineage.map((version: any, idx: number) => (
                <div key={idx} className="text-xs p-2 rounded bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      v{version.version || idx + 1}
                    </Badge>
                    <span className="text-muted-foreground">
                      {new Date(version.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  {version.path && (
                    <code className="text-xs text-muted-foreground mt-1 block">
                      {version.path}
                    </code>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
