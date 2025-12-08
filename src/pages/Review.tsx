import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AnnotationLegend } from "@/components/AnnotationLegend";
import { AnnotationDialog } from "@/components/AnnotationDialog";
import { ArrowLeft, Plus, Trash2, Edit, Sword, Shield, Clock, Move, Target, AlertTriangle, Check, X, User, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useVideo } from "@/contexts/VideoContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Review = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getVideo, addAnnotation, updateAnnotation, deleteAnnotation, updateVideo, addTouch, updateTouch, deleteTouch } = useVideo();
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [showAnnotationDialog, setShowAnnotationDialog] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [videoName, setVideoName] = useState('');
  const [editingAnnotation, setEditingAnnotation] = useState<{
    id: string;
    time: number;
    category: string;
    text: string;
  } | null>(null);
  const seekRef = useRef<((time: number) => void) | null>(null);

  const video = getVideo(id || '');

  // Initialize video name
  useEffect(() => {
    if (video) {
      setVideoName(video.name || `vs ${video.opponent}`);
    }
  }, [video]);

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

  const handleSaveAnnotation = (annotation: { time: number; category: string; text: string }) => {
    if (editingAnnotation) {
      // Editing existing annotation
      updateAnnotation(video.id, editingAnnotation.id, annotation);
      setEditingAnnotation(null);
    } else {
      // Adding new annotation
      addAnnotation(video.id, annotation);
    }
  };

  const handleEditAnnotation = (annotation: { id: string; time: number; category: string; text: string }) => {
    setEditingAnnotation(annotation);
    setShowAnnotationDialog(true);
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    deleteAnnotation(video.id, annotationId);
  };

  const handleDialogClose = (open: boolean) => {
    setShowAnnotationDialog(open);
    if (!open) {
      setEditingAnnotation(null);
    }
  };

  const handleSaveName = () => {
    if (videoName.trim() && video) {
      updateVideo(video.id, { name: videoName.trim() });
      setIsEditingName(false);
    }
  };

  const handleCancelNameEdit = () => {
    setVideoName(video?.name || `vs ${video?.opponent}`);
    setIsEditingName(false);
  };

  const handleAddTouch = (scorer: 'you' | 'opponent') => {
    if (!video) return;
    addTouch(video.id, {
      time: currentTime,
      scorer,
      type: 'touché'
    });
    toast.success(`Point added for ${scorer === 'you' ? 'You' : 'Opponent'} at ${formatTimestamp(currentTime)}`);
  };

  const handleToggleScorer = (touchIndex: number) => {
    if (!video) return;
    const touch = video.touches[touchIndex];
    if (!touch) return;
    const newScorer = touch.scorer === 'you' ? 'opponent' : 'you';
    updateTouch(video.id, touchIndex, { scorer: newScorer });
  };

  const handleDeleteTouch = (touchIndex: number) => {
    if (!video) return;
    deleteTouch(video.id, touchIndex);
    toast.success('Point removed');
  };

  const handleSeekToTime = (time: number) => {
    if (seekRef.current) {
      seekRef.current(time);
    }
  };

  // color for annotation sidebar
  const categoryColors: Record<string, string> = {
    offense: 'bg-primary',
    defense: 'bg-accent',
    timing: 'bg-yellow-500',
    distance: 'bg-orange-500',
    strategy: 'bg-purple-500',
    error: 'bg-pink-600',
  };

  // icons for each category
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-4 py-3 flex items-center gap-3 border-b border-border/50">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') handleCancelNameEdit();
                }}
                className="h-8 text-sm"
                placeholder="Enter video name"
                autoFocus
              />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSaveName}>
                <Check className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancelNameEdit}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <h1 className="font-semibold truncate">{videoName}</h1>
                <p className="text-xs text-muted-foreground">vs {video.opponent} • {video.date}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => setIsEditingName(true)}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="px-4 py-6 space-y-4">
        <VideoPlayer
          touches={video.touches}
          annotations={video.annotations}
          videoUrl={video.videoUrl}
          onTimeUpdate={setCurrentTime}
          onDurationChange={setVideoDuration}
          seekRef={seekRef}
        />

        <AnnotationLegend compact />

        {/* Scoring Section */}
        <Card className="p-4 bg-card border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Score</h3>
            <div className="flex items-center gap-2">
              <Badge className="text-lg px-3 py-1 bg-green-600 hover:bg-green-600">
                {video.touches.filter(t => t.scorer === 'you').length}
              </Badge>
              <span className="text-muted-foreground">-</span>
              <Badge variant="destructive" className="text-lg px-3 py-1">
                {video.touches.filter(t => t.scorer === 'opponent').length}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleAddTouch('you')}
            >
              <User className="w-4 h-4 mr-2" />
              Your Point
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => handleAddTouch('opponent')}
            >
              <Users className="w-4 h-4 mr-2" />
              Opponent Point
            </Button>
          </div>

          {video.touches.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Tap a point to change who scored, or delete it
              </p>
              <div className="flex flex-wrap gap-2">
                {video.touches.map((touch, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleScorer(idx)}
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium transition-colors",
                        touch.scorer === 'you'
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-destructive text-destructive-foreground hover:bg-destructive/80"
                      )}
                      title={`${touch.scorer === 'you' ? 'Your' : "Opponent's"} point at ${formatTimestamp(touch.time)} - Click to switch`}
                    >
                      {formatTimestamp(touch.time)}
                    </button>
                    <button
                      onClick={() => handleDeleteTouch(idx)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                      title="Delete point"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

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
                  <Card
                    key={annotation.id}
                    className="p-4 bg-card border-border/50 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleSeekToTime(annotation.time)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-1 self-stretch rounded-full ${categoryColors[annotation.category.toLowerCase()] || 'bg-primary'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {formatTimestamp(annotation.time)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs capitalize flex items-center gap-1">
                            {categoryIcons[annotation.category.toLowerCase()]}
                            {annotation.category}
                          </Badge>
                        </div>
                        <p className="text-sm">{annotation.text}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAnnotation(annotation);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAnnotation(annotation.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
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
        onOpenChange={handleDialogClose}
        currentTime={currentTime}
        videoDuration={videoDuration}
        existingAnnotations={video.annotations.map(a => ({ time: a.time, id: a.id }))}
        onSave={handleSaveAnnotation}
        initialData={editingAnnotation || undefined}
      />
    </div>
  );
};

export default Review;
