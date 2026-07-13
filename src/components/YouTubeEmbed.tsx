import React from 'react';

type YouTubeEmbedProps = {
  url: string;
  caption?: string;
  aspectRatio?: '16:9' | '9:16' | '4:3' | '1:1';
};

const getYouTubeID = (url: string) => {
  if (!url) return null;
  // Handle URLs without protocol
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
  try {
    const urlObj = new URL(normalizedUrl);
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }
    return null;
  } catch {
    return null;
  }
};

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ url, caption }) => {
  const videoId = getYouTubeID(url);

  if (!videoId) {
    return <p className="text-red-500">Invalid YouTube URL provided.</p>;
  }

  return (
    <div className="my-8 w-full max-w-4xl mx-auto">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded YouTube Video"
        className="w-full aspect-video rounded-lg shadow-lg"
      />
      {caption && <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">{caption}</p>}
    </div>
  );
};

export default YouTubeEmbed;
