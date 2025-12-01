import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BoutCard } from "@/components/BoutCard";
import { Upload, Video, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { useVideo } from "@/contexts/VideoContext";

const Index = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addVideo, getAllVideos } = useVideo();
  const allVideos = getAllVideos();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset the input so the same file can be selected again
    e.target.value = '';

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file', {
        description: `Selected file type: ${file.type || 'unknown'}`
      });
      return;
    }

    // Validate file size (500MB limit)
    const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File too large', {
        description: `Maximum file size is 500MB. Your file is ${Math.round(file.size / 1024 / 1024)}MB.`
      });
      return;
    }

    // Check for empty file
    if (file.size === 0) {
      toast.error('Invalid video file', {
        description: 'The selected file is empty.'
      });
      return;
    }

    // Show upload progress
    setIsUploading(true);
    const toastId = toast.loading(`Uploading: ${file.name}`, {
      description: 'Processing video...'
    });

    // Simulate upload with a delay
    setTimeout(() => {
      try {
        // Save video and get the id back
        const videoId = addVideo(file, 'New Opponent');

        setIsUploading(false);
        toast.dismiss(toastId);
        toast.success(`Uploaded: ${file.name}`, {
          description: 'Video ready for analysis'
        });

        // Send them to the review page
        navigate(`/review/${videoId}`);
      } catch (error) {
        setIsUploading(false);
        toast.dismiss(toastId);
        toast.error('Upload failed', {
          description: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
      }
    }, 1500);
  };

  // Get 3 most recent bouts (sorted by ID, which is timestamp for user uploads)
  const recentBouts = allVideos
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 3)
    .map(video => {
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
    });

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-4 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Video className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">FencerView</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/welcome")}>
          About
        </Button>
      </header>

      <div className="px-4 pt-6 space-y-6">
        <Card
          className={`p-6 bg-gradient-card border-border/50 transition-all ${
            isUploading ? "opacity-75" : "cursor-pointer hover:bg-accent/50"
          }`}
          onClick={isUploading ? undefined : handleUploadClick}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">
                {isUploading ? "Uploading..." : "Upload New Bout"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isUploading
                  ? "Please wait while we process your video"
                  : "Tap to select a video from your device"}
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Bouts</h2>
          <div className="space-y-4">
            {recentBouts.map((bout) => (
              <BoutCard
                key={bout.id}
                {...bout}
                onClick={() => navigate(`/review/${bout.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
