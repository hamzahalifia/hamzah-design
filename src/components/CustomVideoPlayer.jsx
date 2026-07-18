import React, { useRef, useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

const CustomVideoPlayer = ({ src, chapters = [] }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef(null);
  const timelineRef = useRef(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);
  const [hoverTitle, setHoverTitle] = useState('');

  // Load and sync video autoplay preference from localStorage
  const [autoPlayPref, setAutoPlayPref] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('videoAutoPlay') !== 'false';
    }
    return true;
  });

  useEffect(() => {
    const handlePrefChange = () => {
      if (typeof window !== 'undefined') {
        setAutoPlayPref(localStorage.getItem('videoAutoPlay') !== 'false');
      }
    };
    window.addEventListener('videoAutoPlayChange', handlePrefChange);
    return () => {
      window.removeEventListener('videoAutoPlayChange', handlePrefChange);
    };
  }, []);

  // Intersection Observer for autoplay/pause based on visibility and preference
  useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (autoPlayPref) {
          if (entry.isIntersecting) {
            video.play().then(() => {
              setIsPlaying(true);
            }).catch(err => {
              console.log("Autoplay was blocked:", err);
            });
          } else {
            video.pause();
            setIsPlaying(false);
          }
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the video container is visible
      }
    );

    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
  }, [autoPlayPref, src]);

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

  // Get segment definitions for chapter blocks
  const getSegments = () => {
    const sorted = [...chapters].sort((a, b) => a.time - b.time);
    const total = duration || 100;
    
    if (sorted.length === 0) {
      return [{ start: 0, end: total, title: 'Video' }];
    }

    const list = [];
    let lastTime = 0;

    // If the first chapter doesn't start at 0, add an intro segment
    if (sorted[0].time > 0) {
      list.push({ start: 0, end: sorted[0].time, title: 'Intro' });
      lastTime = sorted[0].time;
    }

    for (let i = 0; i < sorted.length; i++) {
      const start = sorted[i].time;
      const end = (i < sorted.length - 1) ? sorted[i + 1].time : total;
      list.push({ start, end, title: sorted[i].title });
      lastTime = end;
    }

    if (lastTime < total) {
      list[list.length - 1].end = total;
    }

    return list;
  };

  const handleTimelineInteraction = (clientX) => {
    if (!timelineRef.current || !duration) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const pos = (clientX - rect.left) / rect.width;
    const boundedPos = Math.max(0, Math.min(1, pos));
    const newTime = boundedPos * duration;
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsScrubbing(true);
    handleTimelineInteraction(e.clientX);
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    setIsScrubbing(true);
    if (e.touches && e.touches[0]) {
      handleTimelineInteraction(e.touches[0].clientX);
    }
  };

  // Scrubbing drag listeners (mouse)
  useEffect(() => {
    const handleMouseMoveGlobal = (e) => {
      if (isScrubbing) {
        handleTimelineInteraction(e.clientX);
      }
    };

    const handleMouseUpGlobal = () => {
      if (isScrubbing) {
        setIsScrubbing(false);
      }
    };

    if (isScrubbing) {
      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleMouseUpGlobal);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveGlobal);
      document.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isScrubbing, duration]);

  // Scrubbing drag listeners (touch)
  useEffect(() => {
    const handleTouchMoveGlobal = (e) => {
      if (isScrubbing && e.touches && e.touches[0]) {
        handleTimelineInteraction(e.touches[0].clientX);
      }
    };

    const handleTouchEndGlobal = () => {
      if (isScrubbing) {
        setIsScrubbing(false);
      }
    };

    if (isScrubbing) {
      document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: true });
      document.addEventListener('touchend', handleTouchEndGlobal);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMoveGlobal);
      document.removeEventListener('touchend', handleTouchEndGlobal);
    };
  }, [isScrubbing, duration]);

  const handleMouseMoveTimeline = (e) => {
    if (!timelineRef.current || !duration) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const boundedPos = Math.max(0, Math.min(1, pos));
    const calculatedTime = boundedPos * duration;
    setHoverTime(calculatedTime);
    setHoverX(e.clientX - rect.left);

    const currentSegments = getSegments();
    const matchedSegment = currentSegments.find(
      seg => calculatedTime >= seg.start && calculatedTime <= seg.end
    );
    setHoverTitle(matchedSegment ? matchedSegment.title : '');
  };

  const handleMouseLeaveTimeline = () => {
    setHoverTime(null);
    setHoverTitle('');
  };


  // Toggle mute
  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
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
      className="group relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center cursor-pointer select-none"
    >
      {/* Debug: log src to console to verify resolution */}
      {console.log("CustomVideoPlayer: rendering with src =", src)}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted={isMuted}
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

        {/* Custom Progress / Timeline Input with YouTube-style Chapter Blocks */}
        <div className="relative flex-1 flex items-center">
          {/* Tooltip for Hover / Scrubbing */}
          {hoverTime !== null && (
            <div
              className="absolute bottom-full mb-3 bg-black/95 dark:bg-zinc-950/98 border border-neutral-800/80 text-white text-xs px-2.5 py-1.5 rounded-lg pointer-events-none flex flex-col items-center gap-0.5 shadow-xl transition-all duration-75 select-none"
              style={{
                left: `${hoverX}px`,
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                zIndex: 50
              }}
            >
              {hoverTitle && <span className="font-semibold text-neutral-100 max-w-[240px] truncate">{hoverTitle}</span>}
              <span className="font-mono text-neutral-400 text-[10px]">{formatTime(hoverTime)}</span>
            </div>
          )}

          <div
            ref={timelineRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseMove={handleMouseMoveTimeline}
            onMouseLeave={handleMouseLeaveTimeline}
            className="relative w-full flex items-center h-5 cursor-pointer group/timeline"
          >
            {/* Segment Blocks Container */}
            <div className="w-full flex items-center gap-[2.5px] h-1 group-hover/timeline:h-2 transition-all duration-150">
              {getSegments().map((seg, idx) => {
                const total = duration || 100;
                const widthPct = ((seg.end - seg.start) / total) * 100;

                // Calculate fill percentage of this segment
                let fillPct = 0;
                if (currentTime >= seg.end) {
                  fillPct = 100;
                } else if (currentTime >= seg.start) {
                  fillPct = ((currentTime - seg.start) / (seg.end - seg.start)) * 100;
                }

                return (
                  <div
                    key={idx}
                    className="h-full bg-neutral-800/85 relative rounded-sm overflow-hidden flex-1"
                    style={{ flexGrow: widthPct, flexBasis: 0 }}
                  >
                    <div
                      className="absolute top-0 left-0 bottom-0 bg-white"
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Interactive Scrub Handle (Circle Knob) */}
            <div
              className={`absolute w-3.5 h-3.5 bg-white rounded-full transition-opacity duration-150 pointer-events-none shadow-md ${
                isScrubbing ? 'opacity-100 scale-110' : 'opacity-0 group-hover/timeline:opacity-100'
              }`}
              style={{
                left: `${((currentTime / (duration || 1)) * 100)}%`,
                transform: 'translateX(-50%)'
              }}
            />
          </div>
        </div>

        {/* Duration */}
        <span className="text-xs font-mono text-neutral-400 min-w-[35px]">
          {formatTime(duration)}
        </span>

        {/* Volume Button */}
        <button
          type="button"
          onClick={toggleMute}
          className="text-white hover:text-neutral-300 transition-colors p-1 flex items-center justify-center cursor-pointer"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <Icon
            icon={isMuted ? "lucide:volume-x" : "lucide:volume-2"}
            className="w-4 h-4 shrink-0"
          />
        </button>

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
    </div>
  );
};

export default CustomVideoPlayer;
