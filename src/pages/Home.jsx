import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { getCuratedPhotos, searchPhotos } from '../api/pexels';
import SearchBar from '../components/SearchBar';
import PhotoGrid from '../components/PhotoGrid';
import ActionDock from '../components/ActionDock';
import CollectionModal from '../components/CollectionModal';
import PhotoDetailModal from '../components/PhotoDetailModal';
import Hero from '../components/Hero';
import { downloadPhotosAsZip } from '../utils/downloadZip';
import { FolderPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({});
    const [hasNextPage, setHasNextPage] = useState(true);
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [processing, setProcessing] = useState(false);

    // Modals State
    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
    const [photosToAdd, setPhotosToAdd] = useState([]);
    const [selectedPhotoForDetail, setSelectedPhotoForDetail] = useState(null);

    const fetchPhotos = useCallback(async (isNewSearch = false) => {
        setLoading(true);
        try {
            const currentPage = isNewSearch ? 1 : page;
            let data;

            if (query) {
                data = await searchPhotos(query, 30, currentPage, filters);
            } else {
                data = await getCuratedPhotos(30, currentPage);
            }

            if (isNewSearch) {
                setPhotos(data.photos);
                setPage(2);
            } else {
                setPhotos(prev => [...prev, ...data.photos]);
                setPage(prev => prev + 1);
            }

            setHasNextPage(data.photos.length > 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [query, filters, page]);

    useEffect(() => {
        fetchPhotos(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (newQuery, newFilters) => {
        setQuery(newQuery);
        setFilters(newFilters);
        setPage(1);
    };

    useEffect(() => {
        fetchPhotos(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, filters]);

    const handleLoadMore = () => {
        if (!loading && hasNextPage) {
            fetchPhotos(false);
        }
    };

    const toggleSelect = (photo) => {
        setSelectedPhotos(prev => {
            const exists = prev.find(p => p.id === photo.id);
            if (exists) {
                return prev.filter(p => p.id !== photo.id);
            }
            return [...prev, photo];
        });
    };

    const clearSelection = () => {
        setSelectedPhotos([]);
    };

    const handleDownload = async (photo) => {
        try {
            const response = await fetch(photo.src.original);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `pexels-${photo.id}-${photo.photographer.replace(/\s+/g, '-').toLowerCase()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to opening in new tab if fetch fails (e.g. CORS)
            window.open(photo.src.original, '_blank');
        }
    };

    const handleBulkDownload = async () => {
        if (selectedPhotos.length === 0) return;
        setProcessing(true);
        await downloadPhotosAsZip(selectedPhotos);
        setProcessing(false);
        clearSelection();
    };

    const openCollectionModal = (photos) => {
        setPhotosToAdd(Array.isArray(photos) ? photos : [photos]);
        setIsCollectionModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-designer-bg text-designer-text selection:bg-designer-accent selection:text-designer-bg">
            <Helmet>
                <title>MonoGrid | Developer Asset Hub</title>
                <meta name="description" content="A minimalist, high-performance asset discovery platform for developers and designers. Discover, collection, and download millions of professional photos." />
                <meta property="og:title" content="MonoGrid | Developer Asset Hub" />
                <meta property="og:description" content="A minimalist, high-performance asset discovery platform for developers and designers." />
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
                            <span className="text-designer-accent font-bold">{selectedPhotos.length}</span> selected
                        </div>
                    </div>
                </div>
            </header>

            <Hero />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
                <SearchBar onSearch={handleSearch} />

                <PhotoGrid
                    photos={photos}
                    loading={loading}
                    hasNextPage={hasNextPage}
                    onLoadMore={handleLoadMore}
                    selectedPhotos={selectedPhotos}
                    onToggleSelect={toggleSelect}
                    onDownload={handleDownload}
                    onPhotoClick={(photo) => setSelectedPhotoForDetail(photo)}
                />

                {!loading && photos.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No photos found. Try adjusting your search or filters.
                    </div>
                )}
            </main>

            <ActionDock
                selectedCount={selectedPhotos.length}
                onClear={clearSelection}
                onDownload={handleBulkDownload}
                onAddToCollection={() => openCollectionModal(selectedPhotos)}
                processing={processing}
            />

            <CollectionModal
                isOpen={isCollectionModalOpen}
                onClose={() => setIsCollectionModalOpen(false)}
                photosToAdd={photosToAdd}
            />

            <PhotoDetailModal
                photo={selectedPhotoForDetail}
                isOpen={!!selectedPhotoForDetail}
                onClose={() => setSelectedPhotoForDetail(null)}
                onDownload={handleDownload}
                onAddToCollection={(p) => openCollectionModal([p])}
                onSelectPhoto={setSelectedPhotoForDetail}
            />
        </div>
    );
}

export default Home;
