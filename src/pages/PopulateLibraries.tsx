import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Database } from "lucide-react";

const PopulateLibraries = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePopulate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/populate-libraries`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Libraries populated successfully!");
      } else {
        toast.error(data.error || "Failed to populate libraries");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while populating libraries");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Populate Libraries
          </CardTitle>
          <CardDescription>
            Import Toyota executives and vehicle data into the face and vehicle libraries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">This will populate:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>5 Toyota executives with photos and roles</li>
              <li>14 Toyota vehicles (2024 models)</li>
              <li>12 Lexus vehicles (2024 models)</li>
            </ul>
          </div>
          
          <Button 
            onClick={handlePopulate} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Populating Libraries...
              </>
            ) : (
              "Populate Libraries"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PopulateLibraries;
