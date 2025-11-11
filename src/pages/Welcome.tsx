import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        {/* App Logo */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-[var(--shadow-glow)]">
            <Video className="w-14 h-14 text-primary-foreground" />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold">Hello, FencerView</h1>
          <p className="text-lg text-muted-foreground">
            Your personal fencing analysis companion
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          Upload your bout videos, add timestamped notes, and track your progress
          across competitions. Let's elevate your game together.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            className="w-full"
            size="lg"
            onClick={() => navigate("/")}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => navigate("/styles")}
          >
            View Style Guide
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
