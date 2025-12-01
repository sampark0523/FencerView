import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipBack, SkipForward, Loader2, AlertTriangle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Touch {
  time: number;
  scorer: 'you' | 'opponent';
  type: string;
}

interface Annotation {
  time: number;
  category: string;
  text: string;
}

interface VideoPlayerProps {
  touches: Touch[];
  annotations?: Annotation[];
  videoUrl?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
}

export const VideoPlayer = ({
  touches,
  annotations = [],
  videoUrl,
  isUploading = false,
  uploadProgress = 0,
  onTimeUpdate,
  onDurationChange
}: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // colors for each annotation category
  const categoryColors: Record<string, string> = {
    offense: 'bg-primary',
    defense: 'bg-accent',
    timing: 'bg-yellow-500',
    distance: 'bg-orange-500',
    strategy: 'bg-purple-500',
    error: 'bg-destructive',
  };

  // hook up all the video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) {
        onTimeUpdate(time);
      }
    };
    const handleDurationChange = () => {
      setDuration(video.duration);
      if (onDurationChange) {
        onDurationChange(video.duration);
      }
    };
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handlePlaying = () => {
      setIsBuffering(false);
      setPlaying(true);
    };
    const handlePause = () => setPlaying(false);
    const handleEnded = () => {
      setPlaying(false);
      // Reset to beginning when video ends
      video.currentTime = 0;
    };
    const handleError = () => {
      setHasError(true);
      setIsBuffering(false);
      setPlaying(false);

      const error = video.error;
      if (error) {
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            setErrorMessage('Video loading was aborted');
            break;
          case error.MEDIA_ERR_NETWORK:
            setErrorMessage('Network error while loading video');
            break;
          case error.MEDIA_ERR_DECODE:
            setErrorMessage('Video file is corrupted or unsupported format');
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            setErrorMessage('Video format not supported by your browser');
            break;
          default:
            setErrorMessage('An unknown error occurred');
        }
      }
    };
    const handleLoadStart = () => {
      setHasError(false);
      setErrorMessage('');
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    // cleanup on unmount
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [onTimeUpdate, onDurationChange]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.error('Error playing video:', err);
        setPlaying(false);
      });
    }
    // State will be updated by event listeners
  };

  // skip back 5 seconds
  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime - 5);
  };

  // skip forward 5 seconds
  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(duration, video.currentTime + 5);
  };

  const seekToTime = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    // Clamp time to valid range [0, duration]
    const clampedTime = Math.max(0, Math.min(time, duration));
    video.currentTime = clampedTime;
  };

  // click anywhere on timeline to jump there
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasError || !videoUrl) return; // Don't allow seeking if there's an error or no video

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width)); // Clamp percentage to [0, 1]
    const time = percentage * duration;
    seekToTime(time);
  };

  // format seconds into mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // show different overlays based on video state
  const renderVideoContent = () => {
    if (hasError) {
      return (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
          <div className="text-center px-6 max-w-md">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <p className="text-lg font-semibold mb-2">Video Error</p>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        </div>
      );
    }

    if (isUploading) {
      return (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
            <p className="text-sm font-medium">Uploading video...</p>
            <div className="w-64 h-2 bg-secondary rounded-full">
              <div className="h-full bg-accent transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
          </div>
        </div>
      );
    }

    if (isBuffering) {
      return (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      );
    }

    if (!videoUrl) {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-background/80 flex items-center justify-center">
          <div className="text-center">
            <Play className="w-20 h-20 mx-auto mb-4 text-primary/50" />
            <p className="text-muted-foreground">No video loaded</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="p-0 overflow-hidden bg-gradient-card border-border/50">
      <div className="aspect-video bg-black relative">
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            onClick={togglePlayPause}
          />
        )}

        {renderVideoContent()}

        {videoUrl && !isUploading && (
          <div className="absolute bottom-4 right-4 bg-black/75 px-3 py-1 rounded-lg text-sm font-medium">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}
      </div>

      <div className="p-4 bg-card/50">
        <div className="relative h-8 mb-4">
          <div
            className="absolute top-1/2 -translate-y-1/2 h-2 w-full bg-secondary rounded-full cursor-pointer"
            onClick={handleTimelineClick}
          >
            <div
              className="absolute h-full bg-primary rounded-full transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {touches.map((touch, idx) => {
            // Calculate vertical offset to prevent overlap
            const position = (touch.time / duration) * 100;
            const overlappingTouches = touches.filter((t, i) => {
              const tPos = (t.time / duration) * 100;
              return i < idx && Math.abs(tPos - position) < 2; // Within 2% of timeline
            });
            const verticalOffset = overlappingTouches.length * 8; // 8px per overlapping marker

            return (
              <button
                key={`touch-${idx}`}
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-transform hover:scale-150 hover:z-10 ${
                  touch.scorer === 'you' ? 'bg-primary border-primary' : 'bg-destructive border-destructive'
                }`}
                style={{
                  left: `${position}%`,
                  transform: `translate(-50%, calc(-50% - ${verticalOffset}px))`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  seekToTime(touch.time);
                }}
                title={`${touch.scorer === 'you' ? 'Your' : "Opponent's"} touch at ${formatTime(touch.time)}`}
              />
            );
          })}

          {annotations.map((annotation, idx) => {
            // Calculate vertical offset to prevent overlap
            const position = (annotation.time / duration) * 100;
            const overlappingAnnotations = annotations.filter((a, i) => {
              const aPos = (a.time / duration) * 100;
              return i < idx && Math.abs(aPos - position) < 1.5; // Within 1.5% of timeline
            });
            const verticalOffset = overlappingAnnotations.length * 10; // 10px per overlapping marker

            return (
              <button
                key={`annotation-${idx}`}
                className={`absolute top-1/2 -translate-y-1/2 w-2 h-5 rounded-sm transition-all hover:scale-150 hover:z-10 ${
                  categoryColors[annotation.category.toLowerCase()] || 'bg-primary'
                }`}
                style={{
                  left: `${position}%`,
                  transform: `translate(-50%, calc(-50% + ${verticalOffset}px))`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  seekToTime(annotation.time);
                }}
                title={`${annotation.category}: ${annotation.text}`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={skipBackward} disabled={!videoUrl || hasError}>
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button size="icon" className="w-12 h-12" onClick={togglePlayPause} disabled={!videoUrl || isUploading || hasError}>
            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={skipForward} disabled={!videoUrl || hasError}>
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
