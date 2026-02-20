import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCollectionMedia } from '../api/pexels';
import PhotoGrid from '../components/PhotoGrid';
import VideoGrid from '../components/VideoGrid';
import PhotoDetailModal from '../components/PhotoDetailModal';
import { ArrowLeft, LayoutGrid, Image as ImageIcon, Film } from 'lucide-react';

const ExploreDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get('title') || 'Collection Detail';

    const [activeTab, setActiveTab] = useState('photos');
    const [photos, setPhotos] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [selectedAssetForDetail, setSelectedAssetForDetail] = useState(null);

    const fetchMedia = useCallback(async (isNew = false) => {
        setLoading(true);
        try {
            const currentPage = isNew ? 1 : page;
            const data = await getCollectionMedia(id, 30, currentPage);

            // Pexels /collections/:id returns a mix of media. 
            // We need to filter based on type or just show all. 
            // The query parameter could filter, but let's just split them for our UI.
            const newMedia = data.media || [];
            const newPhotos = newMedia.filter(m => m.type === 'Photo');
            const newVideos = newMedia.filter(m => m.type === 'Video');

            if (isNew) {
                setPhotos(newPhotos);
                setVideos(newVideos);

                // Smart Tab Selection: Default to Videos if no photos are present
                if (newPhotos.length === 0 && newVideos.length > 0) {
                    setActiveTab('videos');
                } else {
                    setActiveTab('photos');
                }

                setPage(2);
            } else {
                setPhotos(prev => [...prev, ...newPhotos]);
                setVideos(prev => [...prev, ...newVideos]);
                setPage(prev => prev + 1);
            }
            setHasNextPage(!!data.next_page);
        } catch (error) {
            console.error('Failed to fetch collection media:', error);
        } finally {
            setLoading(false);
        }
    }, [id, page]);

    useEffect(() => {
        fetchMedia(true);
    }, [id]);

    const handleLoadMore = () => {
        if (!loading && hasNextPage) {
            fetchMedia(false);
        }
    };

    return (
        <div className="min-h-screen bg-designer-bg text-designer-text">
            <Helmet>
                <title>{title} | MonoGrid Explore</title>
            </Helmet>

            <header className="fixed top-0 left-0 right-0 z-[50] bg-designer-bg/80 backdrop-blur-md border-b border-designer-border px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/explore')} className="p-2 text-designer-muted hover:text-designer-text transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="flex justify-center mb-12">
                    <div className="bg-designer-card border border-designer-border p-1 rounded-xl flex gap-1 shadow-lg">
                        <button
                            onClick={() => setActiveTab('photos')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'photos' ? 'bg-designer-accent text-designer-bg shadow-md' : 'text-designer-muted hover:text-designer-text hover:bg-designer-bg'}`}
                        >
                            <ImageIcon size={16} />
                            Photos ({photos.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'videos' ? 'bg-designer-accent text-designer-bg shadow-md' : 'text-designer-muted hover:text-designer-text hover:bg-designer-bg'}`}
                        >
                            <Film size={16} />
                            Videos ({videos.length})
                        </button>
                    </div>
                </div>

                {activeTab === 'photos' ? (
                    <PhotoGrid
                        photos={photos}
                        loading={loading}
                        hasNextPage={hasNextPage}
                        onLoadMore={handleLoadMore}
                        selectedPhotos={[]}
                        onToggleSelect={() => { }} // Simplified for exploration
                        onDownload={() => { }}
                        onPhotoClick={(photo) => setSelectedAssetForDetail(photo)}
                    />
                ) : (
                    <VideoGrid
                        videos={videos}
                        loading={loading}
                        hasNextPage={hasNextPage}
                        onLoadMore={handleLoadMore}
                        selectedVideos={[]}
                        onToggleSelect={() => { }}
                        onDownload={() => { }}
                        onVideoClick={(video) => setSelectedAssetForDetail(video)}
                    />
                )}
            </main>

            <PhotoDetailModal
                photo={selectedAssetForDetail}
                isOpen={!!selectedAssetForDetail}
                onClose={() => setSelectedAssetForDetail(null)}
                // Re-wire these if needed, or leave as simple view
                onDownload={() => { }}
                onAddToCollection={() => { }}
                onSelectPhoto={setSelectedAssetForDetail}
            />
        </div>
    );
};

export default ExploreDetail;
