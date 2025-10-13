import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Eye, Car, Languages, RefreshCw } from "lucide-react";

const models = [
  {
    icon: Eye,
    name: "Face Recognition Model",
    version: "v2.4.1",
    status: "active",
    accuracy: "98.7%",
    lastTrained: "2024-01-15",
    dataset: "1,247 faces",
  },
  {
    icon: Car,
    name: "Vehicle Detection Model",
    version: "v3.1.0",
    status: "active",
    accuracy: "96.3%",
    lastTrained: "2024-01-10",
    dataset: "342 models",
  },
  {
    icon: Languages,
    name: "Language Transcription",
    version: "v1.8.2",
    status: "active",
    accuracy: "94.5%",
    lastTrained: "2024-01-12",
    dataset: "12 languages",
  },
  {
    icon: Brain,
    name: "Scene Classification",
    version: "v2.0.5",
    status: "training",
    accuracy: "92.1%",
    lastTrained: "In Progress",
    dataset: "8,543 scenes",
  },
];

const Models = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Models</h1>
              <p className="text-muted-foreground">AI models powering the indexer</p>
            </div>
            <Button className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retrain All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models.map((model) => (
              <Card key={model.name} className="glass">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <model.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{model.name}</CardTitle>
                        <CardDescription>{model.version}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={model.status === "active" ? "default" : "secondary"}>
                      {model.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Accuracy</div>
                      <div className="text-2xl font-bold text-accent">{model.accuracy}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Dataset</div>
                      <div className="text-lg font-semibold">{model.dataset}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Last Trained</div>
                    <div className="font-medium">{model.lastTrained}</div>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Retrain Model
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Models;
