import { MessageSquare, Sword, Shield, Clock, Move, Target, AlertTriangle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useVideo } from "@/contexts/VideoContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const Annotations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { getAllVideos } = useVideo();

  const allVideos = getAllVideos();

  // Gather all annotations from all videos
  const allAnnotations = allVideos.flatMap(video =>
    video.annotations.map(annotation => ({
      ...annotation,
      videoId: video.id,
      videoName: video.name || `vs ${video.opponent}`,
      opponent: video.opponent,
      date: video.date,
      competition: video.competition || 'Uncategorized',
    }))
  ).sort((a, b) => b.createdAt - a.createdAt); // Sort by most recent first

  // Filter annotations based on search
  const filteredAnnotations = allAnnotations.filter(annotation => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      annotation.text.toLowerCase().includes(query) ||
      annotation.category.toLowerCase().includes(query) ||
      annotation.videoName.toLowerCase().includes(query) ||
      annotation.opponent.toLowerCase().includes(query) ||
      annotation.competition.toLowerCase().includes(query)
    );
  });

  // Category colors and icons
  const categoryColors: Record<string, string> = {
    offense: 'bg-primary',
    defense: 'bg-accent',
    timing: 'bg-yellow-500',
    distance: 'bg-orange-500',
    strategy: 'bg-purple-500',
    error: 'bg-pink-600',
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    offense: <Sword className="w-4 h-4" />,
    defense: <Shield className="w-4 h-4" />,
    timing: <Clock className="w-4 h-4" />,
    distance: <Move className="w-4 h-4" />,
    strategy: <Target className="w-4 h-4" />,
    error: <AlertTriangle className="w-4 h-4" />,
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Group annotations by category for stats
  const categoryStats = allAnnotations.reduce((acc, ann) => {
    const cat = ann.category.toLowerCase();
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-4 py-3 sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Annotations</h1>
            <p className="text-xs text-muted-foreground">
              {allAnnotations.length} annotations across {allVideos.filter(v => v.annotations.length > 0).length} bouts
            </p>
          </div>
        </div>

        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search annotations, categories, bouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Category breakdown */}
        {allAnnotations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryStats).map(([category, count]) => (
              <button
                key={category}
                onClick={() => setSearchQuery(category)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${categoryColors[category]}`} />
                <span className="text-xs font-medium capitalize">{category}</span>
                <span className="text-xs text-muted-foreground">({count})</span>
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="px-4 py-4 space-y-3">
        {filteredAnnotations.length === 0 ? (
          <div className="text-center py-12">
            {allAnnotations.length === 0 ? (
              <>
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <h3 className="font-semibold mb-2">No annotations yet</h3>
                <p className="text-sm text-muted-foreground">
                  Add annotations to your bouts to track your progress
                </p>
              </>
            ) : (
              <>
                <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <h3 className="font-semibold mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try searching with different keywords
                </p>
              </>
            )}
          </div>
        ) : (
          filteredAnnotations.map((annotation) => (
            <Card
              key={`${annotation.videoId}-${annotation.id}`}
              className="p-4 bg-card border-border/50 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate(`/review/${annotation.videoId}`)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-1 self-stretch rounded-full ${categoryColors[annotation.category.toLowerCase()] || 'bg-primary'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {formatTimestamp(annotation.time)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs capitalize flex items-center gap-1">
                      {categoryIcons[annotation.category.toLowerCase()]}
                      {annotation.category}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{annotation.text}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{annotation.videoName}</span>
                    <span>•</span>
                    <span>{annotation.competition}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Annotations;
