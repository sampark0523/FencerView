import { BoutCard } from "@/components/BoutCard";
import { Video, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

  const competitions: Competition[] = [
    {
      id: "1",
      name: "Regional Championship",
      date: "Mar 15, 2025",
      location: "Boston, MA",
      boutCount: 4,
      bouts: [
        {
          id: "1",
          opponent: "Marcus Chen",
          date: "Mar 15, 2025",
          score: "15-12",
          duration: "8:24",
          touches: 27,
        },
        {
          id: "2",
          opponent: "Sarah Johnson",
          date: "Mar 15, 2025",
          score: "15-8",
          duration: "6:12",
          touches: 23,
        },
        {
          id: "3",
          opponent: "Alex Rivera",
          date: "Mar 15, 2025",
          score: "12-15",
          duration: "9:03",
          touches: 27,
        },
        {
          id: "4",
          opponent: "Emily Davis",
          date: "Mar 15, 2025",
          score: "15-11",
          duration: "7:45",
          touches: 26,
        },
      ],
    },
    {
      id: "2",
      name: "Spring Open",
      date: "Mar 8, 2025",
      location: "New York, NY",
      boutCount: 3,
      bouts: [
        {
          id: "5",
          opponent: "David Rodriguez",
          date: "Mar 8, 2025",
          score: "12-15",
          duration: "7:58",
          touches: 27,
        },
        {
          id: "6",
          opponent: "Michael Lee",
          date: "Mar 8, 2025",
          score: "15-9",
          duration: "6:35",
          touches: 24,
        },
        {
          id: "7",
          opponent: "Sophie Martin",
          date: "Mar 8, 2025",
          score: "15-13",
          duration: "8:17",
          touches: 28,
        },
      ],
    },
    {
      id: "3",
      name: "Winter Invitational",
      date: "Mar 1, 2025",
      location: "Philadelphia, PA",
      boutCount: 5,
      bouts: [
        {
          id: "8",
          opponent: "James Park",
          date: "Mar 1, 2025",
          score: "15-10",
          duration: "6:42",
          touches: 25,
        },
        {
          id: "9",
          opponent: "Chris Anderson",
          date: "Mar 1, 2025",
          score: "15-7",
          duration: "5:58",
          touches: 22,
        },
        {
          id: "10",
          opponent: "Taylor Swift",
          date: "Mar 1, 2025",
          score: "10-15",
          duration: "7:24",
          touches: 25,
        },
        {
          id: "11",
          opponent: "Jordan Kim",
          date: "Mar 1, 2025",
          score: "15-12",
          duration: "8:05",
          touches: 27,
        },
        {
          id: "12",
          opponent: "Morgan Blake",
          date: "Mar 1, 2025",
          score: "13-15",
          duration: "8:42",
          touches: 28,
        },
      ],
    },
  ];

  const toggleCompetition = (competitionId: string) => {
    setExpandedCompetition(
      expandedCompetition === competitionId ? null : competitionId
    );
  };

  const totalBouts = competitions.reduce((acc, comp) => acc + comp.boutCount, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-4 py-3 flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Video className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Library</h1>
          <p className="text-xs text-muted-foreground">
            {totalBouts} bouts across {competitions.length} competitions
          </p>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {competitions.map((competition) => {
          const isExpanded = expandedCompetition === competition.id;

          return (
            <div key={competition.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCompetition(competition.id)}
                className="w-full px-4 py-4 flex items-start justify-between hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-base mb-1">{competition.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{competition.date}</span>
                    <span>{competition.location}</span>
                    <span>{competition.boutCount} bouts</span>
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
                  {competition.bouts.map((bout) => (
                    <BoutCard
                      key={bout.id}
                      {...bout}
                      onClick={() => navigate(`/review/${bout.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Library;
