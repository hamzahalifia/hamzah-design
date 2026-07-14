import React, { useRef, useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

const CustomVideoPlayer = ({ src, chapters = [] }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef(null);

  // Auto-play on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Autoplay was blocked:", err);
      });
    }
  }, [src]);

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle loaded metadata to get duration
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Play/Pause toggle
  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Format time (mm:ss)
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Seek video progress
  const handleSeekChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Jump to chapter
  const handleChapterClick = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Error attempting to enable full-screen:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Controls visibility management (hide after idle)
  const triggerShowControls = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  const handleMouseMove = () => {
    triggerShowControls();
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  const handleContainerClick = () => {
    triggerShowControls();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleContainerClick}
      className="group relative w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center cursor-pointer select-none"
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="w-full h-full object-contain pointer-events-none"
      />

      {/* Floating Control Bar */}
      <div
        className={`absolute bottom-4 left-4 right-4 bg-black/85 dark:bg-zinc-950/95 backdrop-blur-md border border-neutral-800/80 rounded-xl p-3 px-4 flex items-center gap-3.5 transition-all duration-300 shadow-xl z-30 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="text-white hover:text-neutral-300 transition-colors p-1 flex items-center justify-center cursor-pointer"
        >
          <Icon
            icon={isPlaying ? "lucide:pause" : "lucide:play"}
            className="w-4 h-4 shrink-0"
          />
        </button>

        {/* Current Time */}
        <span className="text-xs font-mono text-neutral-400 min-w-[35px] text-right">
          {formatTime(currentTime)}
        </span>

        {/* Custom Progress / Timeline Input */}
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.05}
            value={currentTime}
            onChange={handleSeekChange}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
            style={{
              background: `linear-gradient(to right, #ffffff ${((currentTime / (duration || 1)) * 100)}%, #27272a ${((currentTime / (duration || 1)) * 100)}%)`
            }}
          />
        </div>

        {/* Duration */}
        <span className="text-xs font-mono text-neutral-400 min-w-[35px]">
          {formatTime(duration)}
        </span>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="text-white hover:text-neutral-300 transition-colors p-1 flex items-center justify-center cursor-pointer"
        >
          <Icon
            icon={isFullscreen ? "lucide:minimize" : "lucide:maximize"}
            className="w-4 h-4 shrink-0"
          />
        </button>
      </div>

      {/* Chapters Overlay */}
      {chapters.length > 0 && (
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
          {chapters.map((chapter, index) => (
            <button
              key={index}
              onClick={() => handleChapterClick(chapter.time)}
              className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white hover:bg-black/80 transition-colors"
            >
              {chapter.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
