import React, { useRef, useState, useEffect } from 'react';
import { Download, Plus, Check, Maximize2, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionArticle = motion.article;

const VideoCard = ({ video, isSelected, onToggleSelect, onDownload, onVideoClick }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    // Auto-play was prevented
                    console.error("Auto-play prevented:", error);
                });
            }
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    // Find the best quality video file for preview (usually SD or HD, not 4K for list)
    const videoFile = video.video_files.find(f => f.quality === 'hd') || video.video_files[0];

    return (
        <MotionArticle
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative group rounded-2xl overflow-hidden cursor-zoom-in border border-designer-border transition-all duration-500 ${isSelected ? 'ring-2 ring-designer-accent shadow-[0_0_30px_rgba(230,228,224,0.15)] bg-designer-card' : 'hover:shadow-2xl hover:border-designer-muted'}`}
            onClick={() => onVideoClick(video)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative aspect-[9/16] w-full h-full bg-black">
                <img
                    src={video.image}
                    alt=""
                    className={`w-full h-full object-cover transition-opacity duration-500 absolute inset-0 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
                    loading="lazy"
                />

                <video
                    ref={videoRef}
                    src={videoFile.link}
                    className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
                    muted
                    loop
                    playsInline
                />

                {/* Duration Badge */}
                <div className="absolute top-4 left-4 z-20">
                    <span className="bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1">
                        <Play size={10} fill="currentColor" />
                        {video.duration}s
                    </span>
                </div>
            </div>

            {/* Overlay */}
            <div className={`absolute inset-0 bg-designer-bg/40 transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <div className="absolute top-4 right-4 flex gap-2 z-30">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleSelect(video);
                        }}
                        className={`p-4 rounded-xl backdrop-blur-md transition-all border ${isSelected ? 'bg-designer-accent text-designer-bg border-designer-accent shadow-lg' : 'bg-designer-bg/30 text-designer-text border-white/10 hover:bg-designer-accent hover:text-designer-bg hover:border-designer-accent'}`}
                    >
                        {isSelected ? <Check size={24} strokeWidth={2} /> : <Plus size={24} strokeWidth={2} />}
                    </button>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Maximize2 size={24} className="text-designer-accent/50" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300 z-30">
                    <div className="text-designer-text drop-shadow-lg">
                        <p className="font-bold truncate text-sm tracking-tight">{video.user.name}</p>
                        <p className="text-[10px] text-designer-secondary uppercase font-black tracking-widest opacity-80">Video ID: {video.id.toString().slice(-4)}</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload(video);
                        }}
                        className="p-4 bg-designer-bg/30 hover:bg-designer-accent text-designer-text hover:text-designer-bg rounded-xl backdrop-blur-md transition-all border border-white/10 hover:border-designer-accent"
                        title="Download Asset"
                    >
                        <Download size={24} />
                    </button>
                </div>
            </div>
        </MotionArticle>
    );
};

export default VideoCard;
