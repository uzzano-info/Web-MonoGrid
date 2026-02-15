import React from 'react';
import { Download, Plus, Check, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PhotoCard = ({ photo, isSelected, onToggleSelect, onDownload, onPhotoClick }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative group rounded-2xl overflow-hidden cursor-zoom-in border border-designer-border transition-all duration-500 ${isSelected ? 'ring-2 ring-designer-accent shadow-[0_0_30px_rgba(230,228,224,0.15)] bg-designer-card' : 'hover:shadow-2xl hover:border-designer-muted'}`}
            onClick={() => onPhotoClick(photo)}
        >
            <img
                src={photo.src.large}
                alt={photo.alt}
                className={`w-full h-auto object-cover transform transition-all duration-700 group-hover:scale-105 ${isSelected ? 'scale-95 opacity-50' : ''}`}
                loading="lazy"
            />

            {/* Overlay */}
            <div className={`absolute inset-0 bg-designer-bg/40 transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleSelect(photo);
                        }}
                        className={`p-4 rounded-xl backdrop-blur-md transition-all border ${isSelected ? 'bg-designer-accent text-designer-bg border-designer-accent shadow-lg' : 'bg-designer-bg/30 text-designer-text border-white/10 hover:bg-designer-accent hover:text-designer-bg hover:border-designer-accent'}`}
                    >
                        {isSelected ? <Check size={24} strokeWidth={2} /> : <Plus size={24} strokeWidth={2} />}
                    </button>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Maximize2 size={24} className="text-designer-accent/50" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-designer-text drop-shadow-lg">
                        <p className="font-bold truncate text-sm tracking-tight">{photo.photographer}</p>
                        <p className="text-[10px] text-designer-secondary uppercase font-black tracking-widest opacity-80">Archive ID: {photo.id.toString().slice(-4)}</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload(photo);
                        }}
                        className="p-4 bg-designer-bg/30 hover:bg-designer-accent text-designer-text hover:text-designer-bg rounded-xl backdrop-blur-md transition-all border border-white/10 hover:border-designer-accent"
                        title="Download Asset"
                    >
                        <Download size={24} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default PhotoCard;
