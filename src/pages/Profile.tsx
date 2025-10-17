import { useState } from "react";
import { User, Camera, Shield } from "lucide-react";
import { useUserRole } from "@/lib/use-user-role";
import { Roles } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Profile() {
  const { role, setRole } = useUserRole();
  const [avatarUrl, setAvatarUrl] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=admin");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      // TODO: Implement actual image upload to backend
    }
  };

  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your profile information and role settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="picture"
                className="absolute bottom-0 right-0 rounded-full bg-primary p-2 cursor-pointer shadow-lg hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-4 w-4 text-primary-foreground" />
              </Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div className="text-center">
              <h3 className="font-medium">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">
                Click the camera icon to update your photo
              </p>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" defaultValue="Administrator" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="admin@toyota.com" />
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role
              </Label>
              <Select value={role} onValueChange={(value) => setRole(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Roles.VIEWER}>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Viewer</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={Roles.CONTRIBUTOR}>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Contributor</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={Roles.ADMIN}>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={Roles.SUPER_ADMIN}>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Super Admin</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                {role === Roles.VIEWER && "Can view and search content"}
                {role === Roles.CONTRIBUTOR && "Can upload, edit and manage content"}
                {role === Roles.ADMIN && "Can access analytics and manage content"}
                {role === Roles.SUPER_ADMIN && "Has full access to all features"}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Role Capabilities Card */}
      <Card>
        <CardHeader>
          <CardTitle>Role Capabilities</CardTitle>
          <CardDescription>
            Understanding what you can do with your current role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Content Access</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Search and view videos</li>
                  <li>Browse photo collections</li>
                  <li>Access shared content</li>
                </ul>
              </div>
              {(role === Roles.CONTRIBUTOR || role === Roles.ADMIN || role === Roles.SUPER_ADMIN) && (
                <div className="space-y-2">
                  <h4 className="font-medium">Content Management</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Upload media files</li>
                    <li>Manage processing jobs</li>
                    <li>Edit content metadata</li>
                  </ul>
                </div>
              )}
              {(role === Roles.ADMIN || role === Roles.SUPER_ADMIN) && (
                <div className="space-y-2">
                  <h4 className="font-medium">Analytics Access</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>View library analytics</li>
                    <li>Access model performance</li>
                    <li>Generate reports</li>
                  </ul>
                </div>
              )}
              {role === Roles.SUPER_ADMIN && (
                <div className="space-y-2">
                  <h4 className="font-medium">Administrative Control</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Manage user accounts</li>
                    <li>Configure system settings</li>
                    <li>Handle access requests</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}