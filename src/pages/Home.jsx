import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { getCuratedPhotos, searchPhotos, getPopularVideos, searchVideos } from '../api/pexels';
import SearchBar from '../components/SearchBar';
import PhotoGrid from '../components/PhotoGrid';
import VideoGrid from '../components/VideoGrid';
import ActionDock from '../components/ActionDock';
import CollectionModal from '../components/CollectionModal';
import PhotoDetailModal from '../components/PhotoDetailModal';
import Hero from '../components/Hero';
import { downloadPhotosAsZip } from '../utils/downloadZip';
import { FolderPlus, Image as ImageIcon, Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'videos'

    // Photos State
    const [photos, setPhotos] = useState([]);
    // Videos State
    const [videos, setVideos] = useState([]);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({});
    const [hasNextPage, setHasNextPage] = useState(true);
    const [selectedAssets, setSelectedAssets] = useState([]); // Unified selection
    const [processing, setProcessing] = useState(false);

    // Modals State
    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
    const [assetsToAdd, setAssetsToAdd] = useState([]);
    const [selectedAssetForDetail, setSelectedAssetForDetail] = useState(null);

    const fetchAssets = useCallback(async (isNewSearch = false) => {
        setLoading(true);
        try {
            const currentPage = isNewSearch ? 1 : page;
            let data;

            if (activeTab === 'photos') {
                if (query) {
                    data = await searchPhotos(query, 30, currentPage, filters);
                } else {
                    data = await getCuratedPhotos(30, currentPage);
                }
            } else {
                // Video Mode
                if (query) {
                    data = await searchVideos(query, 30, currentPage, filters);
                } else {
                    data = await getPopularVideos(30, currentPage);
                }
            }

            if (isNewSearch) {
                if (activeTab === 'photos') setPhotos(data.photos || []);
                else setVideos(data.videos || []);
                setPage(2);
            } else {
                if (activeTab === 'photos') {
                    setPhotos(prev => [...prev, ...(data.photos || [])]);
                } else {
                    setVideos(prev => [...prev, ...(data.videos || [])]);
                }
                setPage(prev => prev + 1);
            }

            const results = activeTab === 'photos' ? data.photos : data.videos;
            setHasNextPage(results && results.length > 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [query, filters, page, activeTab]);

    useEffect(() => {
        fetchAssets(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]); // Refetch when tab changes

    const handleSearch = (newQuery, newFilters) => {
        setQuery(newQuery);
        setFilters(newFilters);
        setPage(1);
    };

    useEffect(() => {
        fetchAssets(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, filters]);

    const handleLoadMore = () => {
        if (!loading && hasNextPage) {
            fetchAssets(false);
        }
    };

    const toggleSelect = (asset) => {
        setSelectedAssets(prev => {
            const exists = prev.find(item => item.id === asset.id);
            if (exists) {
                return prev.filter(item => item.id !== asset.id);
            }
            return [...prev, asset];
        });
    };

    const clearSelection = () => {
        setSelectedAssets([]);
    };

    const handleDownload = async (asset) => {
        try {
            let downloadUrl;
            let filename;

            if (asset.video_files) {
                // Video Logic
                const videoFile = asset.video_files.find(f => f.quality === 'hd') || asset.video_files[0];
                downloadUrl = videoFile.link;
                filename = `pexels-video-${asset.id}.mp4`;
            } else {
                // Photo Logic
                downloadUrl = asset.src.original;
                filename = `pexels-${asset.id}-${asset.photographer.replace(/\s+/g, '-').toLowerCase()}.jpg`;
            }

            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            const fallbackUrl = asset.video_files ? asset.video_files[0].link : asset.src.original;
            window.open(fallbackUrl, '_blank');
        }
    };

    const handleBulkDownload = async () => {
        if (selectedAssets.length === 0) return;
        setProcessing(true);
        await downloadPhotosAsZip(selectedAssets);
        setProcessing(false);
        clearSelection();
    };

    const openCollectionModal = (assets) => {
        setAssetsToAdd(Array.isArray(assets) ? assets : [assets]);
        setIsCollectionModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-designer-bg text-designer-text selection:bg-designer-accent selection:text-designer-bg">
            <Helmet>
                <title>MonoGrid | Developer Asset Hub</title>
                <meta name="description" content="A minimalist, high-performance asset discovery platform for developers and designers. Discover, collection, and download millions of professional photos and videos." />
            </Helmet>

            <header className="fixed top-0 left-0 right-0 z-[50] bg-designer-bg/80 backdrop-blur-md border-b border-designer-border px-8 py-3 translate-z-0">
                <div className="max-w-7xl mx-auto flex justify-between items-center text-sm md:text-base">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="w-8 h-8 bg-designer-accent rounded-lg flex items-center justify-center font-bold text-designer-bg shadow-[0_0_15px_rgba(230,228,224,0.3)]">M</div>
                        <h1 className="text-xl font-bold tracking-tight text-designer-text hidden sm:block">
                            <span className="text-designer-accent">Mono</span>Grid
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/community')}
                            className="text-designer-muted hover:text-designer-text transition-colors text-sm font-bold flex items-center gap-2"
                        >
                            <span>Community</span>
                        </button>
                        <div className="h-4 w-px bg-designer-border"></div>
                        <button
                            onClick={() => openCollectionModal([])}
                            className="bg-designer-accent text-designer-bg px-4 py-2 rounded-lg text-sm font-bold hover:bg-designer-accent-hover transition-all flex items-center gap-2 shadow-lg active:scale-95"
                        >
                            <FolderPlus size={18} />
                            <span>Collections</span>
                        </button>
                        <div className="h-4 w-px bg-designer-border"></div>
                        <div className="text-sm font-medium text-designer-muted bg-designer-card px-3 py-1 rounded-full border border-designer-border">
                            <span className="text-designer-accent font-bold">{selectedAssets.length}</span> selected
                        </div>
                    </div>
                </div>
            </header>

            <Hero />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
                {/* Media Type Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-designer-card border border-designer-border p-1 rounded-xl flex gap-1 shadow-lg">
                        <button
                            onClick={() => { setActiveTab('photos'); setPage(1); }}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'photos' ? 'bg-designer-accent text-designer-bg shadow-md' : 'text-designer-muted hover:text-designer-text hover:bg-designer-bg'}`}
                        >
                            <ImageIcon size={16} />
                            Photos
                        </button>
                        <button
                            onClick={() => { setActiveTab('videos'); setPage(1); }}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'videos' ? 'bg-designer-accent text-designer-bg shadow-md' : 'text-designer-muted hover:text-designer-text hover:bg-designer-bg'}`}
                        >
                            <Film size={16} />
                            Videos
                        </button>
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {activeTab === 'photos' ? (
                    <PhotoGrid
                        photos={photos}
                        loading={loading}
                        hasNextPage={hasNextPage}
                        onLoadMore={handleLoadMore}
                        selectedPhotos={selectedAssets}
                        onToggleSelect={toggleSelect}
                        onDownload={handleDownload}
                        onPhotoClick={(photo) => setSelectedAssetForDetail(photo)}
                    />
                ) : (
                    <VideoGrid
                        videos={videos}
                        loading={loading}
                        hasNextPage={hasNextPage}
                        onLoadMore={handleLoadMore}
                        selectedVideos={selectedAssets}
                        onToggleSelect={toggleSelect}
                        onDownload={handleDownload}
                        onVideoClick={(video) => setSelectedAssetForDetail(video)}
                    />
                )}

                {!loading && ((activeTab === 'photos' && photos.length === 0) || (activeTab === 'videos' && videos.length === 0)) && (
                    <div className="text-center py-20 text-gray-500">
                        No {activeTab} found. Try adjusting your search or filters.
                    </div>
                )}
            </main>

            <ActionDock
                selectedCount={selectedAssets.length}
                onClear={clearSelection}
                onDownload={handleBulkDownload}
                onAddToCollection={() => openCollectionModal(selectedAssets)}
                processing={processing}
            />

            <CollectionModal
                isOpen={isCollectionModalOpen}
                onClose={() => setIsCollectionModalOpen(false)}
                photosToAdd={assetsToAdd}
            />

            <PhotoDetailModal
                photo={selectedAssetForDetail}
                isOpen={!!selectedAssetForDetail}
                onClose={() => setSelectedAssetForDetail(null)}
                onDownload={handleDownload}
                onAddToCollection={(p) => openCollectionModal([p])}
                onSelectPhoto={setSelectedAssetForDetail}
            />
        </div>
    );
}

export default Home;
