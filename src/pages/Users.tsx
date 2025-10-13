import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, User } from "lucide-react";

const users = [
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

const Users = () => {
  return (
    <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Users</h1>
            <p className="text-muted-foreground">Manage platform users and permissions</p>
          </div>

          <div className="grid gap-6">
            {users.map((user) => (
              <Card key={user.id} className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge
                      variant={user.role === "Super Admin" ? "default" : "secondary"}
                      className="gap-1"
                    >
                      {user.role === "Super Admin" && <Shield className="h-3 w-3" />}
                      {user.role !== "Super Admin" && <User className="h-3 w-3" />}
                      {user.role}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
};

export default Users;
