import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getFeaturedCollections } from '../api/pexels';
import { ArrowLeft, Compass, LayoutGrid, ChevronRight, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

const Explore = () => {
    const navigate = useNavigate();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);

    const fetchCollections = async (isNew = false) => {
        setLoading(true);
        try {
            const currentPage = isNew ? 1 : page;
            const data = await getFeaturedCollections(20, currentPage);

            if (isNew) {
                setCollections(data.collections || []);
                setPage(2);
            } else {
                setCollections(prev => [...prev, ...(data.collections || [])]);
                setPage(prev => prev + 1);
            }
            setHasNextPage(!!data.next_page);
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections(true);
    }, []);

    return (
        <div className="min-h-screen bg-designer-bg text-designer-text selection:bg-designer-accent selection:text-designer-bg">
            <Helmet>
                <title>Explore Collections | MonoGrid Discovery</title>
                <meta name="description" content="Explore curated thematic collections from around the world. Discover nature, abstract, technology, and more on MonoGrid." />
            </Helmet>

            <header className="fixed top-0 left-0 right-0 z-[50] bg-designer-bg/80 backdrop-blur-md border-b border-designer-border px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center gap-6">
                    <button onClick={() => navigate('/')} className="p-2 text-designer-muted hover:text-designer-text transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <Compass className="text-designer-accent" size={24} />
                        <h1 className="text-xl font-bold tracking-tight">Curated Explorer</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-32">
                <header className="mb-12">
                    <p className="text-designer-muted uppercase font-bold tracking-[0.3em] text-[10px] mb-2">Discovery Phase</p>
                    <h2 className="text-4xl font-bold text-designer-text tracking-tighter sm:text-5xl">Thematic <span className="text-designer-accent">Archives</span></h2>
                    <p className="mt-4 text-designer-muted max-w-2xl text-lg font-medium">
                        Shift from search to discovery. Browse high-quality collections hand-picked by the Pexels community across various industrial and creative themes.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((col, idx) => (
                        <motion.div
                            key={col.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => navigate(`/explore/${col.id}?title=${encodeURIComponent(col.title)}`)}
                            className="group bg-designer-card border border-designer-border rounded-2xl overflow-hidden cursor-pointer hover:border-designer-accent/50 transition-all shadow-xl hover:shadow-designer-accent/5 active:scale-[0.98]"
                        >
                            <div className="aspect-[16/10] bg-designer-bg relative overflow-hidden flex items-center justify-center">
                                <Folder className="text-designer-muted opacity-20 group-hover:scale-110 transition-transform duration-500" size={64} />
                                <div className="absolute inset-0 bg-gradient-to-t from-designer-bg via-transparent to-transparent opacity-60"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-designer-accent/10 text-designer-accent text-[8px] font-black px-2 py-1 rounded uppercase tracking-[0.2em] border border-designer-accent/20">
                                        INDEXED // {col.media_count} ELEMENTS
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-designer-accent transition-colors">{col.title}</h3>
                                <p className="text-sm text-designer-muted line-clamp-2 mb-4 h-10 font-medium">{col.description || 'Curated thematic collection for high-end design inspiration.'}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-designer-border/50">
                                    <div className="flex gap-4">
                                        <div className="text-[10px] font-bold text-designer-muted uppercase tracking-tighter">
                                            <span className="text-designer-text">{col.photos_count}</span> Photos
                                        </div>
                                        <div className="text-[10px] font-bold text-designer-muted uppercase tracking-tighter">
                                            <span className="text-designer-text">{col.videos_count}</span> Videos
                                        </div>
                                    </div>
                                    <ChevronRight className="text-designer-muted group-hover:text-designer-accent group-hover:translate-x-1 transition-all" size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {loading && Array.from({ length: 6 }).map((_, i) => (
                        <div key={`loader-${i}`} className="bg-designer-card border border-designer-border rounded-2xl aspect-[16/10] animate-pulse"></div>
                    ))}
                </div>

                {!loading && hasNextPage && (
                    <div className="mt-16 flex justify-center">
                        <button
                            onClick={() => fetchCollections(false)}
                            className="px-8 py-3 bg-designer-accent text-designer-bg rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-designer-accent-hover transition-all shadow-xl active:scale-95"
                        >
                            Fetch More Archives
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Explore;
