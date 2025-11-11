import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AnnotationLegend } from "@/components/AnnotationLegend";
import { AnnotationDialog } from "@/components/AnnotationDialog";
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useVideo } from "@/contexts/VideoContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Review = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getVideo, addAnnotation, deleteAnnotation } = useVideo();
  const [currentTime, setCurrentTime] = useState(0);
  const [showAnnotationDialog, setShowAnnotationDialog] = useState(false);

  const video = getVideo(id || '');

  // show error page if video doesn't exist
  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Video not found</h2>
          <p className="text-muted-foreground mb-4">
            This video doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleAddAnnotation = (annotation: { time: number; category: string; text: string }) => {
    addAnnotation(video.id, annotation);
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    deleteAnnotation(video.id, annotationId);
  };

  // color for annotation sidebar
  const categoryColors: Record<string, string> = {
    offense: 'bg-primary',
    defense: 'bg-accent',
    timing: 'bg-yellow-500',
    distance: 'bg-orange-500',
    strategy: 'bg-purple-500',
    error: 'bg-destructive',
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-4 py-3 flex items-center gap-3 border-b border-border/50">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold">vs {video.opponent}</h1>
          <p className="text-xs text-muted-foreground">{video.date}</p>
        </div>
      </header>

      <div className="px-4 py-6 space-y-4">
        <VideoPlayer
          touches={video.touches}
          annotations={video.annotations}
          videoUrl={video.videoUrl}
          onTimeUpdate={setCurrentTime}
        />

        <AnnotationLegend compact />

        <Button onClick={() => setShowAnnotationDialog(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Annotation at {formatTimestamp(currentTime)}
        </Button>

        {video.annotations.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Annotations ({video.annotations.length})
            </h3>
            <div className="space-y-3">
              {video.annotations
                .sort((a, b) => a.time - b.time)
                .map((annotation) => (
                  <Card key={annotation.id} className="p-4 bg-card border-border/50">
                    <div className="flex items-start gap-3">
                      <div className={`w-1 h-full rounded-full ${categoryColors[annotation.category.toLowerCase()] || 'bg-primary'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {formatTimestamp(annotation.time)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {annotation.category}
                          </Badge>
                        </div>
                        <p className="text-sm">{annotation.text}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAnnotation(annotation.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ) : (
          <Card className="p-8 bg-card border-border/50 text-center">
            <Plus className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No annotations yet</h3>
            <p className="text-sm text-muted-foreground">
              Start adding timestamped notes to analyze your performance
            </p>
          </Card>
        )}
      </div>

      <AnnotationDialog
        open={showAnnotationDialog}
        onOpenChange={setShowAnnotationDialog}
        currentTime={currentTime}
        onSave={handleAddAnnotation}
      />
    </div>
  );
};

export default Review;
