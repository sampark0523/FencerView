import { Play, Clock, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BoutCardProps {
  id: string;
  opponent: string;
  date: string;
  score: string;
  duration: string;
  touches: number;
  onClick: () => void;
}

export const BoutCard = ({ opponent, date, score, duration, touches, onClick }: BoutCardProps) => {
  return (
    <Card 
      className="p-5 hover:shadow-glow transition-all cursor-pointer bg-gradient-card border-border/50 active:scale-[0.98]"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">vs {opponent}</h3>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="text-primary border-primary text-base px-3 py-1">
            {score}
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          <span>{touches} touches</span>
        </div>
      </div>
      
      <div className="pt-4 border-t border-border/50 flex items-center justify-center gap-2 text-primary">
        <Play className="w-5 h-5" />
        <span className="font-medium">Review Bout</span>
      </div>
    </Card>
  );
};
