import React, { useRef, useState, useEffect } from 'react';
import { Clock, HardDrive, FileVideo, Trash2 } from 'lucide-react';

const VideoPreview = ({ file, onClear }) => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    // Clean up memory
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatDuration = (seconds) => {
    if (seconds === null || isNaN(seconds)) return "Loading...";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white/45 backdrop-blur-md border border-sports-orange/15 rounded-3xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col md:flex-row gap-6 items-stretch">
      {/* Video Preview Player */}
      <div className="w-full md:w-3/5 aspect-video bg-sports-navy/5 rounded-2xl overflow-hidden border border-sports-orange/10 relative shadow-inner">
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            controls
            onLoadedMetadata={handleLoadedMetadata}
          />
        )}
      </div>

      {/* File Details & Remove Button */}
      <div className="w-full md:w-2/5 flex flex-col justify-between py-2 px-1">
        <div className="space-y-5">
          {/* File Name Header */}
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sports-deepOrange/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileVideo className="w-5 h-5 text-sports-deepOrange" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[10px] uppercase tracking-wider text-sports-navy/50 font-bold mb-0.5">
                File Name
              </h4>
              <p className="text-sm font-bold text-sports-navy break-all" title={file.name}>
                {file.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1 border-t border-sports-orange/10">
            {/* Duration */}
            <div className="flex items-start space-x-2.5">
              <Clock className="w-4 h-4 text-sports-orange mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-sports-navy/50 font-bold mb-0.5">
                  Duration
                </h4>
                <p className="text-sm font-extrabold text-sports-deepOrange">
                  {formatDuration(duration)}
                </p>
              </div>
            </div>

            {/* File Size */}
            <div className="flex items-start space-x-2.5">
              <HardDrive className="w-4 h-4 text-sports-orange mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-sports-navy/50 font-bold mb-0.5">
                  File Size
                </h4>
                <p className="text-sm font-bold text-sports-navy">
                  {formatSize(file.size)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <div className="mt-8">
          <button
            type="button"
            className="w-full py-3 px-4 border border-sports-red/30 hover:bg-sports-red/5 active:scale-[0.98] text-sports-red font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center space-x-2"
            onClick={onClear}
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove Video</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
