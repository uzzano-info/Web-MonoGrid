import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Download, FolderPlus, Loader2 } from 'lucide-react';
import { searchPhotos } from '../api/pexels';

const PhotoDetailModal = ({ photo, isOpen, onClose, onDownload, onAddToCollection }) => {
    const [relatedPhotos, setRelatedPhotos] = useState([]);
    const [loadingRelated, setLoadingRelated] = useState(false);

    useEffect(() => {
        if (photo && isOpen) {
            const fetchRelated = async () => {
                setLoadingRelated(true);
                try {
                    const query = photo.alt || photo.photographer;
                    const data = await searchPhotos(query, 6, 1);
                    setRelatedPhotos(data.photos.filter(p => p.id !== photo.id));
                } catch (error) {
                    console.error('Error fetching related photos:', error);
                } finally {
                    setLoadingRelated(false);
                }
            };
            fetchRelated();
        } else {
            setRelatedPhotos([]);
        }
    }, [photo, isOpen]);

    if (!photo || !isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-designer-modal border border-designer-border rounded-3xl w-full max-w-6xl h-full max-h-[95vh] overflow-hidden flex flex-col md:flex-row shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-[70] p-2 bg-designer-bg/50 text-designer-text rounded-full hover:bg-designer-bg transition-colors md:hidden border border-designer-border"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex-1 bg-[#0f0f0f] flex items-center justify-center p-4 md:p-0 overflow-hidden relative group">
                        <img
                            src={photo.src.large2x}
                            alt={photo.alt}
                            className="max-w-full max-h-full object-contain cursor-zoom-out shadow-2xl"
                            onClick={onClose}
                        />
                    </div>

                    <div className="w-full md:w-[450px] flex flex-col bg-designer-card overflow-hidden border-l border-designer-border">
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="flex justify-between items-start mb-8 hidden md:flex">
                                <h2 className="text-2xl font-bold text-designer-text tracking-tight uppercase tracking-widest text-xs opacity-50">Archive Detail</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-designer-muted hover:text-designer-text transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-designer-bg/30 border border-designer-border mb-8 group hover:border-designer-accent/30 transition-all">
                                <div className="w-12 h-12 rounded-full bg-designer-accent text-designer-bg flex items-center justify-center font-bold">
                                    {photo.photographer.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-designer-muted text-[10px] font-bold uppercase tracking-widest mb-1">Contributor</p>
                                    <p className="text-designer-text font-bold text-lg leading-tight">{photo.photographer}</p>
                                </div>
                                <a
                                    href={photo.photographer_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2.5 bg-designer-bg rounded-xl border border-designer-border text-designer-muted hover:text-designer-accent transition-all"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>

                            <div className="space-y-8 mb-12">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-designer-muted text-[10px] font-bold uppercase tracking-widest mb-2">Resolution</p>
                                        <p className="text-designer-secondary font-bold text-sm">{photo.width} × {photo.height} PX</p>
                                    </div>
                                    <div>
                                        <p className="text-designer-muted text-[10px] font-bold uppercase tracking-widest mb-2">Chroma ID</p>
                                        <div className="flex gap-2">
                                            <div className="w-5 h-5 rounded-md border border-designer-border shadow-sm" style={{ backgroundColor: photo.avg_color }}></div>
                                            <span className="text-designer-secondary font-mono text-xs self-center font-bold uppercase">{photo.avg_color}</span>
                                        </div>
                                    </div>
                                </div>

                                {photo.alt && (
                                    <div>
                                        <p className="text-designer-muted text-[10px] font-bold uppercase tracking-widest mb-2">Meta Tag</p>
                                        <p className="text-designer-secondary leading-relaxed text-sm font-medium">"{photo.alt}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-8 border-t border-designer-border">
                                <h3 className="text-[10px] font-bold text-designer-muted mb-5 uppercase tracking-widest opacity-50">Related Elements</h3>
                                {loadingRelated ? (
                                    <div className="flex justify-center py-6">
                                        <Loader2 size={24} className="text-designer-accent animate-spin" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2">
                                        {relatedPhotos.map(p => (
                                            <div key={p.id} className="aspect-square rounded-xl overflow-hidden border border-designer-border bg-designer-bg group/item relative">
                                                <img src={p.src.tiny} alt="" className="w-full h-full object-cover opacity-60 group-hover/item:opacity-100 transition-all cursor-pointer group-hover/item:scale-110" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-8 border-t border-designer-border bg-designer-card/80 flex flex-col gap-3">
                            <button
                                onClick={() => onDownload(photo)}
                                className="w-full flex items-center justify-center gap-3 bg-designer-accent text-designer-bg py-4 rounded-2xl font-bold hover:bg-designer-accent-hover transition-all shadow-xl active:scale-95"
                            >
                                <Download size={20} />
                                Download Master
                            </button>

                            <button
                                onClick={() => onAddToCollection(photo)}
                                className="w-full flex items-center justify-center gap-3 border border-designer-border bg-designer-bg/50 text-designer-text py-4 rounded-2xl font-bold hover:bg-designer-card transition-all hover:border-designer-muted active:scale-95"
                            >
                                <FolderPlus size={20} />
                                Archive to Collection
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PhotoDetailModal;
