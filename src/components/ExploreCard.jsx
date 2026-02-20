import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Folder, ChevronRight, Image as ImageIcon, Film } from 'lucide-react';
import { getCollectionMedia } from '../api/pexels';

const ExploreCard = ({ collection, index }) => {
    const navigate = useNavigate();
    const [coverImage, setCoverImage] = useState(null);
    const [loadingCover, setLoadingCover] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchCover = async () => {
            try {
                // Try to get 1 media item to use as cover
                // We prefer photos for covers usually, but video thumbnail is fine too
                const data = await getCollectionMedia(collection.id, 1);
                if (isMounted && data.media && data.media.length > 0) {
                    const item = data.media[0];
                    setCoverImage(item.src?.large || item.image || null);
                }
            } catch (error) {
                console.warn(`Failed to fetch cover for collection ${collection.id}`, error);
            } finally {
                if (isMounted) setLoadingCover(false);
            }
        };

        fetchCover();
        return () => { isMounted = false; };
    }, [collection.id]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/explore/${collection.id}?title=${encodeURIComponent(collection.title)}`)}
            className="group bg-designer-card border border-designer-border rounded-2xl overflow-hidden cursor-pointer hover:border-designer-accent/50 transition-all shadow-xl hover:shadow-designer-accent/5 active:scale-[0.98] flex flex-col h-full"
        >
            <div className="aspect-[16/10] bg-designer-bg relative overflow-hidden flex items-center justify-center">
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={collection.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                ) : (
                    <Folder className={`text-designer-muted opacity-20 group-hover:scale-110 transition-transform duration-500 ${loadingCover ? 'animate-pulse' : ''}`} size={64} />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-designer-card via-transparent to-transparent opacity-90"></div>

                <div className="absolute top-4 left-4">
                    <span className="bg-black/50 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-[0.2em] border border-white/10 shadow-sm">
                        {collection.media_count} ELEMENTS
                    </span>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 group-hover:text-designer-accent transition-colors line-clamp-1">{collection.title}</h3>
                <p className="text-sm text-designer-muted line-clamp-2 mb-4 font-medium flex-1">{collection.description || 'Curated thematic collection for high-end design inspiration.'}</p>

                <div className="flex items-center justify-between pt-4 border-t border-designer-border/50 mt-auto">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-designer-muted uppercase tracking-tighter">
                            <ImageIcon size={10} className="text-designer-accent" />
                            <span className="text-designer-text">{collection.photos_count}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-designer-muted uppercase tracking-tighter">
                            <Film size={10} className="text-designer-accent" />
                            <span className="text-designer-text">{collection.videos_count}</span>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-designer-bg border border-designer-border flex items-center justify-center group-hover:border-designer-accent group-hover:text-designer-accent transition-all">
                        <ChevronRight size={16} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ExploreCard;
