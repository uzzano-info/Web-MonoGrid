import React from 'react';
import PhotoCard from './PhotoCard';
import { useInView } from 'react-intersection-observer';

const PhotoGrid = ({ photos, loading, hasNextPage, onLoadMore, selectedPhotos, onToggleSelect, onDownload, onPhotoClick }) => {
    const { ref, inView } = useInView({
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
                {photos.map((photo) => (
                    <div key={photo.id} className="break-inside-avoid">
                        <PhotoCard
                            photo={photo}
                            isSelected={selectedPhotos.some(p => p.id === photo.id)}
                            onToggleSelect={onToggleSelect}
                            onDownload={onDownload}
                            onPhotoClick={onPhotoClick}
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

export default PhotoGrid;
