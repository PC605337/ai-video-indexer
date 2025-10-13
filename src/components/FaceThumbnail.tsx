import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface FaceThumbnailProps {
  name: string;
  photoUrl?: string | null;
  role?: string;
  size?: "sm" | "md" | "lg";
}

export const FaceThumbnail = ({ name, photoUrl, role, size = "md" }: FaceThumbnailProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className={sizeClasses[size]}>
        {photoUrl ? (
          <AvatarImage src={photoUrl} alt={name} />
        ) : null}
        <AvatarFallback className="bg-primary/10 text-primary">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      {role && (
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{name}</div>
          <div className="text-xs text-muted-foreground truncate">{role}</div>
        </div>
      )}
    </div>
  );
};
