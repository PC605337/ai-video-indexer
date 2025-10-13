import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Photos = () => {
  return (
    <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Photo Library</h1>
            <p className="text-muted-foreground">Browse and manage your AI-indexed photos</p>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search photos..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  No Photos Yet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Upload photos to get started with AI-powered image analysis
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
  );
};

export default Photos;
