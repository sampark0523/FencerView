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
  const { addVideo } = useVideo();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // make sure they picked a video file
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }

      // show upload progress
      setIsUploading(true);
      toast.loading(`Uploading: ${file.name}`);

      // simulate upload with a delay
      setTimeout(() => {
        // save video and get the id back
        const videoId = addVideo(file, 'New Opponent');

        setIsUploading(false);
        toast.dismiss();
        toast.success(`Uploaded: ${file.name}`);

        // send them to the review page
        navigate(`/review/${videoId}`);
      }, 1500);
    }
  };

  const recentBouts = [
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
      opponent: "David Rodriguez",
      date: "Mar 8, 2025",
      score: "12-15",
      duration: "7:58",
      touches: 27,
    },
    {
      id: "3",
      opponent: "James Park",
      date: "Mar 1, 2025",
      score: "15-10",
      duration: "6:42",
      touches: 25,
    },
  ];

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
