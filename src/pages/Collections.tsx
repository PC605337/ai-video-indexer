import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Car, Building2, FileText, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const collections = [
  {
    icon: Users,
    title: "People",
    description: "Executives, employees, and identified individuals",
    count: "1,247 faces",
    color: "text-accent",
  },
  {
    icon: Calendar,
    title: "Events",
    description: "Product launches, press conferences, and corporate events",
    count: "156 events",
    color: "text-chart-2",
  },
  {
    icon: Car,
    title: "Vehicles",
    description: "Toyota and Lexus models (1960-present)",
    count: "342 models",
    color: "text-chart-3",
  },
  {
    icon: Building2,
    title: "Toyota Plants",
    description: "Manufacturing facilities worldwide",
    count: "47 locations",
    color: "text-destructive",
  },
  {
    icon: FileText,
    title: "Executive Biographies",
    description: "Leadership profiles and career history",
    count: "89 executives",
    color: "text-primary",
  },
  {
    icon: Globe,
    title: "Languages / Regions",
    description: "Multi-language content and regional assets",
    count: "12 languages",
    color: "text-chart-1",
  },
];

const Collections = () => {
  const navigate = useNavigate();

  return (
    <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Collections</h1>
            <p className="text-muted-foreground">Organized categories of your media assets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Card
                key={collection.title}
                className="glass cursor-pointer transition-smooth hover:border-primary/50 hover:scale-105"
                onClick={() => navigate(`/collections/${collection.title.toLowerCase().replace(/ /g, '-')}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <collection.icon className={`h-10 w-10 ${collection.color}`} />
                    <span className="text-2xl font-bold text-muted-foreground">{collection.count}</span>
                  </div>
                  <CardTitle className="mt-4">{collection.title}</CardTitle>
                  <CardDescription>{collection.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
};

export default Collections;
