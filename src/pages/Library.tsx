import { BoutCard } from "@/components/BoutCard";
import { Video, ChevronRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useVideo } from "@/contexts/VideoContext";
import { Input } from "@/components/ui/input";

interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  boutCount: number;
  bouts: Array<{
    id: string;
    opponent: string;
    date: string;
    score: string;
    duration: string;
    touches: number;
  }>;
}

const Library = () => {
  const navigate = useNavigate();
  const [expandedCompetition, setExpandedCompetition] = useState<string | null>(null);
  const [draggedVideoId, setDraggedVideoId] = useState<string | null>(null);
  const [dropTargetCompetition, setDropTargetCompetition] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { getAllVideos, updateVideo } = useVideo();

  const allVideos = getAllVideos();

  // Predefined competitions to always show
  const predefinedCompetitions = [
    'Uncategorized',
    'Regional Championship',
    'Spring Open',
    'Winter Invitational'
  ];

  // Group videos by competition
  const videosByCompetition = allVideos.reduce((acc, video) => {
    const compName = video.competition || 'Uncategorized';
    if (!acc[compName]) {
      acc[compName] = [];
    }
    acc[compName].push(video);
    return acc;
  }, {} as Record<string, typeof allVideos>);

  // Ensure predefined competitions always exist, even if empty
  predefinedCompetitions.forEach(compName => {
    if (!videosByCompetition[compName]) {
      videosByCompetition[compName] = [];
    }
  });

  // Convert to Competition format
  const allCompetitions: Competition[] = Object.entries(videosByCompetition).map(([name, videos], idx) => {
    const mostRecentDate = videos[0]?.date || '';

    return {
      id: `comp-${idx}`,
      name,
      date: mostRecentDate,
      location: '', // Can be added later if needed
      boutCount: videos.length,
      bouts: videos.map(video => {
        const durationMins = Math.floor((video.touches[video.touches.length - 1]?.time || 0) / 60);
        const durationSecs = Math.floor((video.touches[video.touches.length - 1]?.time || 0) % 60);
        const yourTouches = video.touches.filter(t => t.scorer === 'you').length;
        const opponentTouches = video.touches.filter(t => t.scorer === 'opponent').length;

        return {
          id: video.id,
          name: video.name,
          opponent: video.opponent,
          date: video.date,
          score: `${yourTouches}-${opponentTouches}`,
          duration: `${durationMins}:${durationSecs.toString().padStart(2, '0')}`,
          touches: video.touches.length,
        };
      }),
    };
  }).sort((a, b) => {
    // Sort predefined competitions to the top in order, then others by date
    const aIndex = predefinedCompetitions.indexOf(a.name);
    const bIndex = predefinedCompetitions.indexOf(b.name);

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex; // Both are predefined, sort by predefined order
    }
    if (aIndex !== -1) return -1; // a is predefined, put it first
    if (bIndex !== -1) return 1; // b is predefined, put it first

    // Neither is predefined, sort by date
    return b.date.localeCompare(a.date);
  });

  // Filter competitions and bouts based on search query
  const competitions = allCompetitions.map(comp => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return comp; // No search, return all
    }

    // Check if competition name matches
    const compNameMatches = comp.name.toLowerCase().includes(query);

    // Filter bouts that match the search query
    const filteredBouts = comp.bouts.filter(bout => {
      const nameMatch = bout.name?.toLowerCase().includes(query);
      const opponentMatch = bout.opponent.toLowerCase().includes(query);
      const dateMatch = bout.date.toLowerCase().includes(query);
      return nameMatch || opponentMatch || dateMatch;
    });

    // Return competition with filtered bouts
    return {
      ...comp,
      bouts: filteredBouts,
      boutCount: filteredBouts.length,
      // Include competition if name matches OR has matching bouts
      _shouldShow: compNameMatches || filteredBouts.length > 0,
    };
  }).filter((comp: any) => !searchQuery || comp._shouldShow); // Only show competitions with matches

  const toggleCompetition = (competitionId: string) => {
    setExpandedCompetition(
      expandedCompetition === competitionId ? null : competitionId
    );
  };

  const handleDragStart = (videoId: string, e: React.DragEvent) => {
    setDraggedVideoId(videoId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', videoId);

    // Add visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.cursor = 'grabbing';
  };

  const handleDragEnd = () => {
    setDraggedVideoId(null);
    setDropTargetCompetition(null);
  };

  const handleDragOver = (competitionName: string, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetCompetition(competitionName);
  };

  const handleDragLeave = () => {
    setDropTargetCompetition(null);
  };

  const handleDrop = (competitionName: string, e: React.DragEvent) => {
    e.preventDefault();
    const videoId = e.dataTransfer.getData('text/plain');

    if (videoId && draggedVideoId) {
      // Update the video's competition
      updateVideo(videoId, { competition: competitionName });

      // Auto-expand the target competition to show the moved video
      setExpandedCompetition(competitions.find(c => c.name === competitionName)?.id || null);
    }

    setDraggedVideoId(null);
    setDropTargetCompetition(null);
  };

  const totalBouts = competitions.reduce((acc, comp) => acc + comp.boutCount, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-4 py-3 sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Video className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Library</h1>
            <p className="text-xs text-muted-foreground">
              {totalBouts} bouts across {competitions.length} competitions
            </p>
          </div>
        </div>

        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, opponent, competition, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <div className="bg-accent/10 border border-accent/20 rounded-lg px-3 py-2">
          <p className="text-xs text-muted-foreground">
            💡 <span className="font-medium">Tip:</span> Drag and drop bouts to organize them into competitions
          </p>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {competitions.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          competitions.map((competition) => {
            const isExpanded = searchQuery ? true : expandedCompetition === competition.id;
            const isDropTarget = dropTargetCompetition === competition.name;

          return (
            <div
              key={competition.id}
              className={cn(
                "bg-card border rounded-lg overflow-hidden transition-all",
                isDropTarget ? "border-primary border-2 shadow-glow" : "border-border"
              )}
              onDragOver={(e) => handleDragOver(competition.name, e)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(competition.name, e)}
            >
              <button
                onClick={() => toggleCompetition(competition.id)}
                className="w-full px-4 py-4 flex items-start justify-between hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-base mb-1">{competition.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{competition.date}</span>
                    {competition.location && <span>{competition.location}</span>}
                    <span>{competition.boutCount} {competition.boutCount === 1 ? 'bout' : 'bouts'}</span>
                  </div>
                </div>
                <ChevronRight
                  className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 mt-1",
                    isExpanded && "rotate-90"
                  )}
                />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {competition.boutCount === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      <p>No bouts in this competition</p>
                      <p className="text-xs mt-1">Drag bouts here to organize them</p>
                    </div>
                  ) : (
                    competition.bouts.map((bout) => (
                      <div
                        key={bout.id}
                        draggable
                        onDragStart={(e) => handleDragStart(bout.id, e)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "transition-opacity cursor-grab active:cursor-grabbing",
                          draggedVideoId === bout.id && "opacity-50"
                        )}
                        onClick={(e) => {
                          // Prevent click if we just finished dragging
                          if (draggedVideoId) {
                            e.stopPropagation();
                          } else {
                            navigate(`/review/${bout.id}`);
                          }
                        }}
                      >
                        <BoutCard
                          {...bout}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/review/${bout.id}`);
                          }}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        }))}
      </div>
    </div>
  );
};

export default Library;
