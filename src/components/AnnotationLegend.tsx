import { Card } from "@/components/ui/card";
import { Sword, Shield, Clock, Move, Target, AlertTriangle, LucideIcon } from "lucide-react";

interface AnnotationCategory {
  name: string;
  color: string;
  description: string;
  icon: LucideIcon;
}

interface AnnotationLegendProps {
  compact?: boolean;
}

export const AnnotationLegend = ({ compact = false }: AnnotationLegendProps) => {
  const categories: AnnotationCategory[] = [
    {
      name: "Offense",
      color: "bg-primary",
      description: "Attacking actions and touches",
      icon: Sword,
    },
    {
      name: "Defense",
      color: "bg-accent",
      description: "Defensive moves and parries",
      icon: Shield,
    },
    {
      name: "Timing",
      color: "bg-yellow-500",
      description: "Timing-related issues",
      icon: Clock,
    },
    {
      name: "Distance",
      color: "bg-orange-500",
      description: "Distance management",
      icon: Move,
    },
    {
      name: "Strategy",
      color: "bg-purple-500",
      description: "Strategic decisions",
      icon: Target,
    },
    {
      name: "Error",
      color: "bg-pink-600",
      description: "Mistakes to address",
      icon: AlertTriangle,
    },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.name} className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <div className={`w-3 h-3 rounded-sm ${category.color}`} />
              <span className="text-xs font-medium">{category.name}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card className="p-4 bg-gradient-card border-border/50">
      <h3 className="font-semibold mb-3 text-sm">Annotation Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.name}
              className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className={`w-3 h-3 rounded-sm ${category.color} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{category.name}</p>
                <p className="text-xs text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
