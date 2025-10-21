import { useEffect, useState } from "react";
import { Shield, User, Mail, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("*");

      if (profilesData) {
        const usersWithRoles = profilesData.map(profile => {
          const userRoles = rolesData?.filter(r => r.user_id === profile.user_id) || [];
          return {
            ...profile,
            roles: userRoles.map(r => r.role)
          };
        });
        setUsers(usersWithRoles);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" => {
    if (role === "super_admin") return "default";
    if (role === "editor" || role === "admin") return "secondary";
    return "outline";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-1/4"></div>
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-secondary rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mockUsers = [
    {
      id: "1",
      name: "Super Admin",
      email: "admin@toyota.com",
      role: "Super Admin",
      avatar: "",
      initials: "SA",
    },
    {
      id: "2",
      name: "John Smith",
      email: "john.smith@toyota.com",
      role: "Admin",
      avatar: "",
      initials: "JS",
    },
    {
      id: "3",
      name: "Sarah Johnson",
      email: "sarah.j@toyota.com",
      role: "User",
      avatar: "",
      initials: "SJ",
    },
  ];

  const allUsers = users.length > 0 ? users : mockUsers;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Users</h1>
          <p className="text-muted-foreground">
            Manage user access and permissions ({allUsers.length} total users)
          </p>
        </div>

        <div className="grid gap-4">
          {allUsers.map((user) => (
            <Card key={user.id} className="p-4 glass hover:border-primary/50 transition-all">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.display_name ? getInitials(user.display_name) : user.initials || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{user.display_name || user.name || "Unknown User"}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{user.email || "No email"}</span>
                  </div>
                  {user.created_at && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>Joined {format(new Date(user.created_at), "PP")}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role: string) => (
                      <Badge key={role} variant={getRoleBadgeVariant(role)}>
                        {role === "super_admin" && <Shield className="h-3 w-3 mr-1" />}
                        {role.replace("_", " ")}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant={user.role === "Super Admin" ? "default" : "secondary"}>
                      {user.role === "Super Admin" ? (
                        <Shield className="h-3 w-3 mr-1" />
                      ) : (
                        <User className="h-3 w-3 mr-1" />
                      )}
                      {user.role}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
