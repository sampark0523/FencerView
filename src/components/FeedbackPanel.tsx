import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertCircle, TrendingUp } from "lucide-react";

interface Feedback {
  time: number;
  type: 'error' | 'improvement' | 'note';
  text: string;
  tag?: string;
}

interface FeedbackPanelProps {
  feedbacks: Feedback[];
  onJumpToTime: (time: number) => void;
}

export const FeedbackPanel = ({ feedbacks, onJumpToTime }: FeedbackPanelProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'improvement':
        return <TrendingUp className="w-4 h-4 text-accent" />;
      default:
        return <MessageSquare className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Coach Feedback
      </h3>
      
      <div className="space-y-3">
        {feedbacks.map((feedback, idx) => (
          <button
            key={idx}
            className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all"
            onClick={() => onJumpToTime(feedback.time)}
          >
            <div className="flex items-start gap-3">
              {getIcon(feedback.type)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">
                    {Math.floor(feedback.time / 60)}:{(feedback.time % 60).toString().padStart(2, '0')}
                  </span>
                  {feedback.tag && (
                    <Badge variant="outline" className="text-xs">
                      {feedback.tag}
                    </Badge>
                  )}
                </div>
                <p className="text-sm">{feedback.text}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};
