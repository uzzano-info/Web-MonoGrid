import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Download, Grid, List, Settings, Trash2, ToggleRight, ToggleLeft, Monitor, Smartphone, Square, Maximize, FileImage, Image as ImageIcon, Check } from 'lucide-react';
import useCollectionStore from '../store/useCollectionStore';
import { downloadPhotosAsZip } from '../utils/downloadZip';

const CollectionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { collections } = useCollectionStore();
    const [collection, setCollection] = useState(null);
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [processing, setProcessing] = useState(false);
    const scrollRef = useRef(null);

    // Batch Config State
    const [format, setFormat] = useState('JPG');
    const [size, setSize] = useState('Original');
    const [orientation, setOrientation] = useState('');
    const [itemsToShow, setItemsToShow] = useState(20);
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        const found = collections.find(c => c.id === id);
        if (found) {
            setCollection(found);
        }
    }, [id, collections]);

    if (!collection) return <div className="min-h-screen bg-designer-bg flex items-center justify-center text-white">Loading...</div>;

    // Filter Logic
    const filteredPhotos = collection.photos.filter(p => {
        if (!orientation) return true;
        const ratio = p.width / p.height;
        if (orientation === 'landscape') return ratio > 1.2;
        if (orientation === 'portrait') return ratio < 0.8;
        if (orientation === 'square') return ratio >= 0.8 && ratio <= 1.2;
        return true;
    });

    const displayedPhotos = filteredPhotos.slice(0, itemsToShow);

    const toggleSelect = (photoId) => {
        if (selectedPhotos.includes(photoId)) {
            setSelectedPhotos(selectedPhotos.filter(id => id !== photoId));
        } else {
            setSelectedPhotos([...selectedPhotos, photoId]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedPhotos.length === filteredPhotos.length && filteredPhotos.length > 0) {
            setSelectedPhotos([]);
        } else {
            setSelectedPhotos(filteredPhotos.map(p => p.id));
        }
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            if (itemsToShow < filteredPhotos.length) {
                setItemsToShow(prev => prev + 20);
            }
        }
    };

    const handleDownload = async () => {
        if (selectedPhotos.length === 0) return;
        setProcessing(true);
        const photosToDownload = collection.photos.filter(p => selectedPhotos.includes(p.id));

        await downloadPhotosAsZip(
            photosToDownload,
            `${collection.name.replace(/\s+/g, '-').toLowerCase()}-${size}-${format}.zip`,
            { size, format }
        );

        setProcessing(false);
    };

    return (
        <div className="min-h-screen bg-designer-bg text-designer-text font-sans flex flex-col md:flex-row overflow-hidden fixed inset-0">

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative z-10">
                {/* Header */}
                <header className="bg-designer-bg border-b border-designer-border px-6 py-4 flex items-center justify-between shrink-0 h-16">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 text-designer-muted hover:text-designer-text transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-designer-text tracking-tight">{collection.name}</h1>
                        <span className="text-[10px] font-mono bg-designer-card text-designer-accent px-2 py-0.5 rounded border border-designer-border">
                            BATCH #{id.slice(-4).toUpperCase()} // PROCESSING
                        </span>
                    </div>
                </header>

                {/* Toolbar */}
                <div className="px-6 py-3 border-b border-designer-border flex items-center justify-between shrink-0 bg-designer-card/50">
                    <div className="flex items-center gap-6 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-designer-muted hover:text-designer-text transition-colors select-none">
                            <input
                                type="checkbox"
                                checked={selectedPhotos.length === filteredPhotos.length && filteredPhotos.length > 0}
                                onChange={toggleSelectAll}
                                className="rounded border-designer-border bg-transparent text-designer-accent focus:ring-offset-designer-bg focus:ring-designer-accent"
                            />
                            Select All ({filteredPhotos.length})
                        </label>
                        <div className="flex items-center gap-2 ml-4">
                            <span className="text-[10px] font-bold text-designer-muted uppercase tracking-widest">Filters:</span>
                            {orientation && (
                                <span className="bg-designer-accent text-designer-bg text-[10px] px-2 py-0.5 rounded border border-designer-accent flex items-center gap-1 font-bold uppercase animate-in fade-in zoom-in-50 shadow-sm">
                                    {orientation} <X size={10} className="cursor-pointer" onClick={() => setOrientation('')} />
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-designer-muted uppercase mr-2 tracking-tighter">View Context:</span>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-designer-card border border-designer-border text-designer-accent' : 'text-designer-muted hover:text-designer-text hover:bg-designer-modal'}`}
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-designer-card border border-designer-border text-designer-accent' : 'text-designer-muted hover:text-designer-text hover:bg-designer-modal'}`}
                        >
                            <Grid size={16} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 bg-designer-bg custom-scrollbar"
                >
                    {viewMode === 'grid' ? (
                        /* Grid View */
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
                            {displayedPhotos.map(photo => {
                                const isSelected = selectedPhotos.includes(photo.id);
                                return (
                                    <div
                                        key={photo.id}
                                        onClick={() => toggleSelect(photo.id)}
                                        className={`aspect-square bg-designer-card rounded-xl border p-2 group relative cursor-pointer transition-all duration-300 ${isSelected ? 'border-designer-accent shadow-[0_0_20px_rgba(230,228,224,0.1)] ring-1 ring-designer-accent' : 'border-designer-border hover:border-designer-muted'}`}
                                    >
                                        <div className="w-full h-full rounded-lg overflow-hidden relative bg-[#0f0f0f]">
                                            <img src={photo.src.large} alt={photo.alt} className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-90 opacity-60' : 'group-hover:scale-110'}`} />

                                            <div className={`absolute inset-0 bg-designer-accent/5 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`}></div>

                                            {/* Checkbox Overlay */}
                                            <div className={`absolute top-2 left-2 transition-all duration-300 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100'}`}>
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border shadow-lg ${isSelected ? 'bg-designer-accent text-designer-bg border-designer-accent' : 'bg-designer-bg/50 border-white/20 backdrop-blur-md'}`}>
                                                    {isSelected && <Check size={14} strokeWidth={3} />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {displayedPhotos.length < 10 && Array.from({ length: 10 - displayedPhotos.length }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square bg-designer-card/20 rounded-xl border border-designer-border opacity-20"></div>
                            ))}
                        </div>
                    ) : (
                        /* List View */
                        <div className="flex flex-col gap-2 pb-20">
                            {displayedPhotos.map(photo => {
                                const isSelected = selectedPhotos.includes(photo.id);
                                return (
                                    <div
                                        key={photo.id}
                                        onClick={() => toggleSelect(photo.id)}
                                        className={`flex items-center gap-4 bg-designer-card p-2 rounded-xl border transition-all cursor-pointer group ${isSelected ? 'border-designer-accent bg-designer-accent/5' : 'border-designer-border hover:border-designer-muted'}`}
                                    >
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/20 shrink-0 relative">
                                            <img src={photo.src.tiny} alt={photo.alt} className="w-full h-full object-cover" />
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-designer-accent/20 flex items-center justify-center">
                                                    <Check size={16} className="text-designer-bg drop-shadow-md" strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-designer-text truncate text-sm">{photo.alt || 'Untitled Asset'}</h4>
                                            <p className="text-xs text-designer-muted">by {photo.photographer}</p>
                                        </div>
                                        <div className="px-4 text-[10px] font-mono text-designer-muted">
                                            {photo.width} x {photo.height}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {itemsToShow < filteredPhotos.length && (
                        <div className="text-center py-10 text-designer-muted text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
                            Indexing assets // scanning archive...
                        </div>
                    )}
                </div>

                {/* Footer Status */}
                <div className="px-6 py-2 border-t border-designer-border text-[10px] text-designer-muted font-bold uppercase tracking-widest flex justify-between shrink-0 bg-designer-bg absolute bottom-0 left-0 right-0 z-20">
                    <span>System Status: Online // Mode: Minimalist</span>
                    <span>Rendered: {displayedPhotos.length} / Active: {selectedPhotos.length} / Global: {filteredPhotos.length}</span>
                </div>
            </div>

            {/* Right Sidebar (Batch Configuration) */}
            <div className="w-[320px] bg-designer-card border-l border-designer-border h-full shrink-0 flex flex-col shadow-2xl relative z-20">
                <div className="p-5 border-b border-designer-border bg-designer-modal/50">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="font-bold text-designer-text text-xs uppercase tracking-[0.2em]">Batch Parameters</h2>
                        <span className="text-[10px] bg-designer-accent text-designer-bg px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Active</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                    {/* Orientation Visualization */}
                    <div className="bg-designer-bg/50 rounded-2xl p-5 border border-designer-border">
                        <label className="text-[10px] font-black text-designer-muted uppercase tracking-[0.2em] mb-4 block">Frame Orientation</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'landscape', icon: Monitor, label: 'Wide' },
                                { id: 'portrait', icon: Smartphone, label: 'Tall' },
                                { id: 'square', icon: Square, label: 'Square' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setOrientation(orientation === opt.id ? '' : opt.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${orientation === opt.id ? 'bg-designer-accent text-designer-bg border-designer-accent shadow-lg' : 'bg-transparent border-designer-border text-designer-muted hover:border-designer-muted hover:text-designer-text'}`}
                                >
                                    <opt.icon size={18} className={orientation === opt.id ? 'text-designer-bg' : ''} />
                                    <span className="text-[10px] mt-2 font-bold uppercase">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Format Section */}
                    <div className="bg-designer-bg/50 rounded-2xl p-5 border border-designer-border">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-designer-muted text-[10px] font-bold uppercase tracking-[0.2em]">
                                <FileImage size={14} />
                                Export Format
                            </div>
                            <ToggleRight className="text-designer-accent" size={20} />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {['JPG', 'PNG', 'WEBP'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFormat(f)}
                                    className={`text-[10px] font-black py-2.5 rounded-xl border transition-all uppercase tracking-widest ${format === f ? 'bg-designer-accent text-designer-bg border-designer-accent shadow-lg' : 'bg-transparent text-designer-muted border-designer-border hover:border-designer-muted hover:text-designer-text'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Structure / Size Visualization */}
                    <div className="bg-designer-bg/50 rounded-2xl p-5 border border-designer-border">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-designer-muted text-[10px] font-bold uppercase tracking-[0.2em]">
                                <ImageIcon size={14} />
                                Asset Scale
                            </div>
                            <ToggleRight className="text-designer-accent" size={20} />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'Original', label: 'Original', sub: '>2k px' },
                                { id: 'Large', label: 'Large', sub: '1k-2k px' },
                                { id: 'Medium', label: 'Med', sub: '0.5k-1k px' },
                                { id: 'Small', label: 'Small', sub: '<0.5k px' },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setSize(opt.id)}
                                    className={`flex flex-col items-start p-3 rounded-xl border transition-all relative ${size === opt.id ? 'bg-designer-accent text-designer-bg border-designer-accent shadow-md' : 'bg-transparent border-designer-border text-designer-muted hover:border-designer-muted hover:text-designer-text'}`}
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">{opt.label}</span>
                                    <span className="text-[8px] opacity-60 font-bold">{opt.sub}</span>
                                    {size === opt.id && <Check size={12} className="absolute top-2 right-2 text-designer-bg" strokeWidth={4} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Action */}
                <div className="p-5 border-t border-designer-border bg-designer-card/50 mt-auto">
                    <div className="bg-designer-bg rounded-2xl p-5 border border-designer-border mb-4 shadow-inner">
                        <p className="text-[10px] text-designer-muted font-bold mb-2 uppercase tracking-widest text-center opacity-70">Projected Payload</p>
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black text-designer-text tracking-tighter">~48.2 MB</h3>
                            <div className="text-right">
                                <p className="text-xs text-designer-accent font-black uppercase">{selectedPhotos.length} Units</p>
                                <p className="text-[10px] text-designer-muted font-bold tracking-tighter">ARCHIVE.ZIP</p>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={processing || selectedPhotos.length === 0}
                        onClick={handleDownload}
                        className="w-full bg-designer-accent hover:bg-designer-accent-hover text-designer-bg font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group active:scale-95 uppercase text-xs tracking-[0.2em]"
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-[3px] border-designer-bg/30 border-t-designer-bg rounded-full animate-spin"></div>
                                Compiling...
                            </>
                        ) : (
                            <>
                                <Download size={20} className="group-hover:translate-y-1 transition-transform" strokeWidth={3} />
                                Initiate Export
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-designer-muted mt-4 cursor-pointer hover:text-designer-text font-black uppercase tracking-[0.2em] transition-colors" onClick={() => navigate('/')}>Return to Hub</p>
                </div>
            </div>
        </div >
    );
};

export default CollectionDetail;
