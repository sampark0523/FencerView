import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Annotation {
  id: string;
  time: number;
  category: string;
  text: string;
  createdAt: number;
}

interface BoutVideo {
  id: string;
  file: File;
  videoUrl: string;
  opponent: string;
  date: string;
  annotations: Annotation[];
  touches: Array<{
    time: number;
    scorer: 'you' | 'opponent';
    type: string;
  }>;
}

interface VideoContextType {
  videos: Record<string, BoutVideo>;
  addVideo: (file: File, opponent: string) => string;
  getVideo: (id: string) => BoutVideo | undefined;
  addAnnotation: (videoId: string, annotation: Omit<Annotation, 'id' | 'createdAt'>) => void;
  updateAnnotation: (videoId: string, annotationId: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (videoId: string, annotationId: string) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideos] = useState<Record<string, BoutVideo>>({});

  const addVideo = (file: File, opponent: string = 'Unknown Opponent'): string => {
    const id = Date.now().toString();
    const videoUrl = URL.createObjectURL(file);
    const newVideo: BoutVideo = {
      id,
      file,
      videoUrl,
      opponent,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      annotations: [],
      touches: [],
    };

    setVideos(prev => ({ ...prev, [id]: newVideo }));
    return id;
  };

  const getVideo = (id: string): BoutVideo | undefined => {
    return videos[id];
  };

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

  return (
    <VideoContext.Provider
      value={{
        videos,
        addVideo,
        getVideo,
        addAnnotation,
        updateAnnotation,
        deleteAnnotation,
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
