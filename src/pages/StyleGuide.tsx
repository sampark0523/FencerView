import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Home,
  Library,
  Upload,
  Play,
  ArrowLeft,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Trophy,
  Target,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StyleGuide = () => {
  const navigate = useNavigate();

  const colors = [
    {
      name: "Primary Blue",
      description: "Buttons, interactive elements, app logo, links, active states",
      hsl: "hsl(217, 91%, 60%)",
      cssVar: "--primary",
      textClass: "text-primary",
      bgClass: "bg-primary",
    },
    {
      name: "Dark Navy (11%)",
      description: "Background, main surface",
      hsl: "hsl(222, 47%, 11%)",
      cssVar: "--background",
      textClass: "text-background",
      bgClass: "bg-background",
    },
    {
      name: "Dark Navy (14%)",
      description: "Cards, elevated surfaces, layering",
      hsl: "hsl(222, 47%, 14%)",
      cssVar: "--card",
      textClass: "text-card",
      bgClass: "bg-card",
    },
    {
      name: "Cyan Accent",
      description: "Positive feedback, improvements, success states, progress",
      hsl: "hsl(188, 94%, 55%)",
      cssVar: "--accent",
      textClass: "text-accent",
      bgClass: "bg-accent",
    },
    {
      name: "Red Accent",
      description: "Errors, opponent touches, destructive actions, warnings",
      hsl: "hsl(0, 84%, 60%)",
      cssVar: "--destructive",
      textClass: "text-destructive",
      bgClass: "bg-destructive",
    },
  ];

  const annotationCategories = [
    { name: "Offense", color: "bg-primary", description: "Attacking actions" },
    { name: "Defense", color: "bg-accent", description: "Defensive moves" },
    { name: "Timing", color: "bg-yellow-500", description: "Timing issues" },
    { name: "Distance", color: "bg-orange-500", description: "Distance management" },
    { name: "Strategy", color: "bg-purple-500", description: "Strategic notes" },
    { name: "Error", color: "bg-destructive", description: "Mistakes to fix" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-3 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Style Guide</h1>
          <p className="text-xs text-muted-foreground">Design system reference</p>
        </div>
      </header>

      <div className="px-4 py-6 space-y-8">
        {/* Color Palette Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Color Palette</h2>
          <div className="space-y-4">
            {colors.map((color) => (
              <Card key={color.name} className="p-4 bg-card border-border/50">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 rounded-lg ${color.bgClass} flex-shrink-0 border border-border`}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{color.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {color.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs font-mono">
                      <Badge variant="outline">{color.hsl}</Badge>
                      <Badge variant="outline">var({color.cssVar})</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Typography</h2>
          <Card className="p-6 bg-card border-border/50 space-y-6">
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Font Family: Inter
              </p>
              <p className="text-muted-foreground text-sm">
                Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  H1 - Bold (700)
                </p>
                <h1 className="text-4xl font-bold">
                  The quick brown fox jumps
                </h1>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  H2 - Bold (700)
                </p>
                <h2 className="text-3xl font-bold">
                  The quick brown fox jumps
                </h2>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  H3 - Semibold (600)
                </p>
                <h3 className="text-2xl font-semibold">
                  The quick brown fox jumps
                </h3>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  H4 - Semibold (600)
                </p>
                <h4 className="text-xl font-semibold">
                  The quick brown fox jumps
                </h4>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Body - Regular (400)
                </p>
                <p className="text-base">
                  The quick brown fox jumps over the lazy dog. This is body text
                  used for descriptions, paragraphs, and general content.
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Small - Regular (400)
                </p>
                <p className="text-sm">
                  The quick brown fox jumps over the lazy dog. Small text for
                  captions and meta information.
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Button/Label - Medium (500)
                </p>
                <p className="text-base font-medium">
                  The quick brown fox jumps
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Icons Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Icons</h2>
          <Card className="p-6 bg-card border-border/50">
            <p className="text-sm text-muted-foreground mb-4">
              Lucide React - Sample icons used throughout the app
            </p>
            <div className="grid grid-cols-4 gap-6">
              {[
                { icon: Video, label: "Video" },
                { icon: Home, label: "Home" },
                { icon: Library, label: "Library" },
                { icon: Upload, label: "Upload" },
                { icon: Play, label: "Play" },
                { icon: User, label: "User" },
                { icon: Trophy, label: "Trophy" },
                { icon: Target, label: "Target" },
                { icon: MessageSquare, label: "Message" },
                { icon: AlertCircle, label: "Alert" },
                { icon: TrendingUp, label: "Trending" },
                { icon: ArrowLeft, label: "Arrow" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Annotation Legend Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Annotation Categories</h2>
          <Card className="p-6 bg-card border-border/50">
            <p className="text-sm text-muted-foreground mb-4">
              Color-coded categories for timestamped annotations
            </p>
            <div className="space-y-3">
              {annotationCategories.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                >
                  <div className={`w-4 h-4 rounded-full ${category.color}`} />
                  <div className="flex-1">
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Component Examples */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Components</h2>
          <Card className="p-6 bg-card border-border/50 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3">Buttons</p>
              <div className="flex flex-wrap gap-3">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-3">Badges</p>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default StyleGuide;
