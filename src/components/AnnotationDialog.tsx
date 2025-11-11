import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface AnnotationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTime: number;
  onSave: (annotation: { time: number; category: string; text: string }) => void;
  initialData?: {
    time: number;
    category: string;
    text: string;
  };
}

export const AnnotationDialog = ({
  open,
  onOpenChange,
  currentTime,
  onSave,
  initialData,
}: AnnotationDialogProps) => {
  const [time, setTime] = useState(currentTime);
  const [timeInput, setTimeInput] = useState('');
  const [category, setCategory] = useState('offense');
  const [text, setText] = useState('');

  useEffect(() => {
    if (open) {
      if (initialData) {
        setTime(initialData.time);
        setTimeInput(formatTime(initialData.time));
        setCategory(initialData.category);
        setText(initialData.text);
      } else {
        setTime(currentTime);
        setTimeInput(formatTime(currentTime));
        setCategory('offense');
        setText('');
      }
    }
  }, [open, currentTime, initialData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // convert mm:ss string to seconds
  const parseTimeInput = (input: string): number | null => {
    const parts = input.split(':');
    if (parts.length !== 2) return null;

    const mins = parseInt(parts[0], 10);
    const secs = parseInt(parts[1], 10);

    if (isNaN(mins) || isNaN(secs) || mins < 0 || secs < 0 || secs >= 60) {
      return null;
    }

    return mins * 60 + secs;
  };

  const handleTimeInputChange = (value: string) => {
    setTimeInput(value);
    const parsedTime = parseTimeInput(value);
    if (parsedTime !== null) {
      setTime(parsedTime);
    }
  };

  const handleSave = () => {
    if (!text.trim()) {
      return;
    }
    // double check the time format before saving
    const parsedTime = parseTimeInput(timeInput);
    const finalTime = parsedTime !== null ? parsedTime : time;

    onSave({ time: finalTime, category, text: text.trim() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Annotation' : 'Add Annotation'}
          </DialogTitle>
          <DialogDescription>
            Add a timestamped note to help analyze your bout performance.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="time">Timestamp</Label>
            <Input
              id="time"
              value={timeInput}
              onChange={(e) => handleTimeInputChange(e.target.value)}
              placeholder="0:00"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Format: MM:SS (e.g., 1:30 for 1 minute 30 seconds)
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="offense">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-primary" />
                    <span>Offense</span>
                  </div>
                </SelectItem>
                <SelectItem value="defense">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-accent" />
                    <span>Defense</span>
                  </div>
                </SelectItem>
                <SelectItem value="timing">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-yellow-500" />
                    <span>Timing</span>
                  </div>
                </SelectItem>
                <SelectItem value="distance">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-orange-500" />
                    <span>Distance</span>
                  </div>
                </SelectItem>
                <SelectItem value="strategy">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-purple-500" />
                    <span>Strategy</span>
                  </div>
                </SelectItem>
                <SelectItem value="error">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-destructive" />
                    <span>Error</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="text">Note</Label>
            <Textarea
              id="text"
              placeholder="What happened at this moment? What can be improved?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!text.trim()}>
            {initialData ? 'Update' : 'Add'} Annotation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
