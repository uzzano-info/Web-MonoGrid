import React from 'react';
import VideoCard from './VideoCard';
import { useInView } from 'react-intersection-observer';

const VideoGrid = ({ videos, loading, hasNextPage, onLoadMore, selectedVideos, onToggleSelect, onDownload, onVideoClick }) => {
    const { ref } = useInView({
        threshold: 0,
        onChange: (inView) => {
            if (inView && hasNextPage && !loading) {
                onLoadMore();
            }
        },
    });

    return (
        <div className="w-full">
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {videos.map((video) => (
                    <div key={video.id} className="break-inside-avoid">
                        <VideoCard
                            video={video}
                            isSelected={selectedVideos.some(v => v.id === video.id)}
                            onToggleSelect={onToggleSelect}
                            onDownload={onDownload}
                            onVideoClick={onVideoClick}
                        />
                    </div>
                ))}
            </div>

            {/* Loading Sentinel */}
            <div ref={ref} className="h-40 flex justify-center items-center mt-8">
                {loading && (
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-4 border-designer-accent/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-designer-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoGrid;
