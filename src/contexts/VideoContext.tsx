import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Annotation {
  id: string;
  time: number;
  category: string;
  text: string;
  createdAt: number;
}

interface BoutVideo {
  id: string;
  name?: string;
  file: File;
  videoUrl: string;
  opponent: string;
  date: string;
  competition?: string;
  annotations: Annotation[];
  touches: Array<{
    time: number;
    scorer: 'you' | 'opponent';
    type: string;
  }>;
}

interface Touch {
  time: number;
  scorer: 'you' | 'opponent';
  type: string;
}

interface VideoContextType {
  videos: Record<string, BoutVideo>;
  customCompetitions: string[];
  addVideo: (file: File, opponent: string, name?: string, competition?: string) => string;
  getVideo: (id: string) => BoutVideo | undefined;
  getAllVideos: () => BoutVideo[];
  getAllCompetitions: () => string[];
  removeVideo: (id: string) => void;
  updateVideo: (id: string, updates: Partial<BoutVideo>) => void;
  addAnnotation: (videoId: string, annotation: Omit<Annotation, 'id' | 'createdAt'>) => void;
  updateAnnotation: (videoId: string, annotationId: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (videoId: string, annotationId: string) => void;
  addTouch: (videoId: string, touch: Touch) => void;
  updateTouch: (videoId: string, touchIndex: number, updates: Partial<Touch>) => void;
  deleteTouch: (videoId: string, touchIndex: number) => void;
  addCompetition: (name: string) => boolean;
  removeCompetition: (name: string) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

// Sample demo data for showcase
const createDemoVideos = (): Record<string, BoutVideo> => {
  const demoVideos: Record<string, BoutVideo> = {};

  const demoBouts = [
    {
      id: "demo-1",
      name: "Regional Finals - Strong Performance",
      opponent: "Marcus Chen",
      date: "Mar 15, 2025",
      competition: "Regional Championship",
      score: "15-12",
      duration: 504, // 8:24 in seconds
      touches: [
        { time: 45, scorer: 'you' as const, type: 'touché' },
        { time: 78, scorer: 'opponent' as const, type: 'touché' },
        { time: 123, scorer: 'you' as const, type: 'touché' },
        { time: 156, scorer: 'you' as const, type: 'touché' },
        { time: 189, scorer: 'opponent' as const, type: 'touché' },
        { time: 234, scorer: 'you' as const, type: 'touché' },
        { time: 267, scorer: 'opponent' as const, type: 'touché' },
        { time: 312, scorer: 'you' as const, type: 'touché' },
        { time: 345, scorer: 'opponent' as const, type: 'touché' },
        { time: 389, scorer: 'you' as const, type: 'touché' },
        { time: 423, scorer: 'you' as const, type: 'touché' },
        { time: 467, scorer: 'opponent' as const, type: 'touché' },
      ],
      annotations: [
        { id: 'a1', time: 45, category: 'offense', text: 'Good fleche timing - caught opponent off guard', createdAt: Date.now() - 1000000 },
        { id: 'a2', time: 78, category: 'error', text: 'Left shoulder exposed during lunge', createdAt: Date.now() - 900000 },
        { id: 'a3', time: 156, category: 'defense', text: 'Strong parry-riposte sequence', createdAt: Date.now() - 800000 },
        { id: 'a4', time: 234, category: 'timing', text: 'Perfect counter-attack on preparation', createdAt: Date.now() - 700000 },
      ]
    },
    {
      id: "demo-2",
      name: "Spring Open - Learning Experience",
      opponent: "David Rodriguez",
      date: "Mar 8, 2025",
      competition: "Spring Open",
      score: "12-15",
      duration: 478, // 7:58
      touches: [
        { time: 56, scorer: 'opponent' as const, type: 'touché' },
        { time: 98, scorer: 'you' as const, type: 'touché' },
        { time: 142, scorer: 'opponent' as const, type: 'touché' },
        { time: 187, scorer: 'you' as const, type: 'touché' },
        { time: 231, scorer: 'opponent' as const, type: 'touché' },
        { time: 276, scorer: 'you' as const, type: 'touché' },
        { time: 312, scorer: 'opponent' as const, type: 'touché' },
        { time: 367, scorer: 'opponent' as const, type: 'touché' },
        { time: 412, scorer: 'you' as const, type: 'touché' },
      ],
      annotations: [
        { id: 'b1', time: 56, category: 'distance', text: 'Need to maintain better distance - too close', createdAt: Date.now() - 600000 },
        { id: 'b2', time: 142, category: 'strategy', text: 'Opponent reading my feint pattern', createdAt: Date.now() - 500000 },
        { id: 'b3', time: 312, category: 'error', text: 'Dropped hand after attack - bad habit', createdAt: Date.now() - 400000 },
      ]
    },
    {
      id: "demo-3",
      name: "Winter Invitational - Dominant Win",
      opponent: "James Park",
      date: "Mar 1, 2025",
      competition: "Winter Invitational",
      score: "15-10",
      duration: 402, // 6:42
      touches: [
        { time: 34, scorer: 'you' as const, type: 'touché' },
        { time: 71, scorer: 'you' as const, type: 'touché' },
        { time: 109, scorer: 'opponent' as const, type: 'touché' },
        { time: 156, scorer: 'you' as const, type: 'touché' },
        { time: 198, scorer: 'you' as const, type: 'touché' },
        { time: 241, scorer: 'opponent' as const, type: 'touché' },
        { time: 287, scorer: 'you' as const, type: 'touché' },
        { time: 329, scorer: 'you' as const, type: 'touché' },
      ],
      annotations: [
        { id: 'c1', time: 34, category: 'offense', text: 'Excellent blade work - disengage to 4', createdAt: Date.now() - 300000 },
        { id: 'c2', time: 156, category: 'timing', text: 'Waited for opponent to extend, then attacked', createdAt: Date.now() - 200000 },
      ]
    }
  ];

  demoBouts.forEach(bout => {
    demoVideos[bout.id] = {
      id: bout.id,
      name: bout.name,
      file: new File([], `${bout.opponent}.mp4`, { type: 'video/mp4' }),
      videoUrl: '', // Will use placeholder for demo bouts
      opponent: bout.opponent,
      date: bout.date,
      competition: bout.competition,
      annotations: bout.annotations,
      touches: bout.touches,
    };
  });

  return demoVideos;
};

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideos] = useState<Record<string, BoutVideo>>(() => createDemoVideos());
  const [customCompetitions, setCustomCompetitions] = useState<string[]>([]);

  const addVideo = (file: File, opponent: string = 'Unknown Opponent', name?: string, competition?: string): string => {
    const id = Date.now().toString();
    const videoUrl = URL.createObjectURL(file);
    const newVideo: BoutVideo = {
      id,
      name,
      file,
      videoUrl,
      opponent,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      competition: competition || 'Uncategorized',
      annotations: [],
      touches: [],
    };

    setVideos(prev => ({ ...prev, [id]: newVideo }));
    return id;
  };

  const getVideo = (id: string): BoutVideo | undefined => {
    return videos[id];
  };

  const getAllVideos = (): BoutVideo[] => {
    return Object.values(videos);
  };

  const getAllCompetitions = (): string[] => {
    const predefined = [
      'Uncategorized',
      'Regional Championship',
      'Spring Open',
      'Winter Invitational',
    ];
    return [...predefined, ...customCompetitions];
  };

  const removeVideo = (id: string) => {
    setVideos(prev => {
      const video = prev[id];
      if (video && video.videoUrl) {
        // Clean up the Object URL to prevent memory leaks
        URL.revokeObjectURL(video.videoUrl);
      }

      const { [id]: removed, ...rest } = prev;
      return rest;
    });
  };

  const updateVideo = (id: string, updates: Partial<BoutVideo>) => {
    setVideos(prev => {
      const video = prev[id];
      if (!video) return prev;

      return {
        ...prev,
        [id]: {
          ...video,
          ...updates,
        },
      };
    });
  };

  // Cleanup all Object URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(videos).forEach(video => {
        if (video.videoUrl) {
          URL.revokeObjectURL(video.videoUrl);
        }
      });
    };
  }, []);

  const addAnnotation = (
    videoId: string,
    annotation: Omit<Annotation, 'id' | 'createdAt'>
  ) => {
    setVideos(prev => {
      const video = prev[videoId];
      if (!video) return prev;

      const newAnnotation: Annotation = {
        ...annotation,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };

      return {
        ...prev,
        [videoId]: {
          ...video,
          annotations: [...video.annotations, newAnnotation],
        },
      };
    });
  };

  const updateAnnotation = (
    videoId: string,
    annotationId: string,
    updates: Partial<Annotation>
  ) => {
    setVideos(prev => {
      const video = prev[videoId];
      if (!video) return prev;

      return {
        ...prev,
        [videoId]: {
          ...video,
          annotations: video.annotations.map(ann =>
            ann.id === annotationId ? { ...ann, ...updates } : ann
          ),
        },
      };
    });
  };

  const deleteAnnotation = (videoId: string, annotationId: string) => {
    setVideos(prev => {
      const video = prev[videoId];
      if (!video) return prev;

      return {
        ...prev,
        [videoId]: {
          ...video,
          annotations: video.annotations.filter(ann => ann.id !== annotationId),
        },
      };
    });
  };

  const addTouch = (videoId: string, touch: Touch) => {
    setVideos(prev => {
      const video = prev[videoId];
      if (!video) return prev;

      const newTouches = [...video.touches, touch].sort((a, b) => a.time - b.time);

      return {
        ...prev,
        [videoId]: {
          ...video,
          touches: newTouches,
        },
      };
    });
  };

  const updateTouch = (videoId: string, touchIndex: number, updates: Partial<Touch>) => {
    setVideos(prev => {
      const video = prev[videoId];
      if (!video || touchIndex < 0 || touchIndex >= video.touches.length) return prev;

      const newTouches = video.touches.map((touch, idx) =>
        idx === touchIndex ? { ...touch, ...updates } : touch
      );

      return {
        ...prev,
        [videoId]: {
          ...video,
          touches: newTouches,
        },
      };
    });
  };

  const deleteTouch = (videoId: string, touchIndex: number) => {
    setVideos(prev => {
      const video = prev[videoId];
      if (!video || touchIndex < 0 || touchIndex >= video.touches.length) return prev;

      return {
        ...prev,
        [videoId]: {
          ...video,
          touches: video.touches.filter((_, idx) => idx !== touchIndex),
        },
      };
    });
  };

  const addCompetition = (name: string): boolean => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;

    // Check if competition already exists (case-insensitive)
    const existingCompetitions = [
      'Uncategorized',
      'Regional Championship',
      'Spring Open',
      'Winter Invitational',
      ...customCompetitions
    ];

    if (existingCompetitions.some(c => c.toLowerCase() === trimmedName.toLowerCase())) {
      return false;
    }

    setCustomCompetitions(prev => [...prev, trimmedName]);
    return true;
  };

  const removeCompetition = (name: string) => {
    setCustomCompetitions(prev => prev.filter(c => c !== name));
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        customCompetitions,
        addVideo,
        getVideo,
        getAllVideos,
        getAllCompetitions,
        removeVideo,
        updateVideo,
        addAnnotation,
        updateAnnotation,
        deleteAnnotation,
        addTouch,
        updateTouch,
        deleteTouch,
        addCompetition,
        removeCompetition,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
