import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Download, Grid, List, Settings, Trash2, ToggleRight, ToggleLeft, Monitor, Smartphone, Square, Maximize, FileImage, Image as ImageIcon, Check, X, Film, PlayCircle } from 'lucide-react';
import useCollectionStore from '../store/useCollectionStore';
import { downloadPhotosAsZip } from '../utils/downloadZip';
import { Helmet } from 'react-helmet-async';
import PhotoDetailModal from '../components/PhotoDetailModal';
import { saveAs } from 'file-saver';

const CollectionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type') || 'photos'; // 'photos' | 'videos'

    const { photoCollections, videoCollections } = useCollectionStore();
    const collections = type === 'videos' ? videoCollections : photoCollections;
    const collection = collections.find(c => c.id === id);

    const [selectedItems, setSelectedItems] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [selectedAssetForDetail, setSelectedAssetForDetail] = useState(null);
    const scrollRef = useRef(null);

    // Batch Config State
    const [format, setFormat] = useState(type === 'videos' ? 'MP4' : 'JPG');
    const [size, setSize] = useState('Original');

    const [itemsToShow, setItemsToShow] = useState(20);
    const [viewMode, setViewMode] = useState('grid');

    const isVideoMode = type === 'videos';

    if (!collection) return <div className="min-h-screen bg-designer-bg flex items-center justify-center text-white">Archive not found or indexing...</div>;

    const displayedItems = collection.items.slice(0, itemsToShow);

    const toggleSelect = (itemId, e) => {
        e?.stopPropagation();
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === collection.items.length && collection.items.length > 0) {
            setSelectedItems([]);
        } else {
            setSelectedItems(collection.items.map(p => p.id));
        }
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            if (itemsToShow < collection.items.length) {
                setItemsToShow(prev => prev + 20);
            }
        }
    };

    const getPayloadFilename = () => {
        const name = collection.name || 'collection';
        const baseName = name.replace(/\s+/g, '-').toLowerCase();
        return `${baseName}-${size}-${format}.zip`.toUpperCase();
    };

    const handleDownload = async () => {
        if (selectedItems.length === 0) return;
        setProcessing(true);
        const itemsToDownload = collection.items.filter(p => selectedItems.includes(p.id));
        const filename = getPayloadFilename().toLowerCase();

        await downloadPhotosAsZip(
            itemsToDownload,
            filename,
            { size, format }
        );

        setProcessing(false);
    };

    const handleSingleDownload = async (asset) => {
        try {
            const url = isVideoMode
                ? (asset.video_files?.find(f => f.quality === 'hd')?.link || asset.video_files?.[0]?.link)
                : asset.src?.original;

            if (url) {
                saveAs(url, `monogrid-${asset.id}.${isVideoMode ? 'mp4' : 'jpg'}`);
            }
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-designer-bg text-designer-text font-sans flex flex-col md:flex-row overflow-hidden fixed inset-0">
            <Helmet>
                <title>{collection.name} | MonoGrid Collection</title>
                <meta name="description" content={`View and batch download ${type} from the "${collection.name}" collection on MonoGrid.`} />
            </Helmet>
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative z-10">
                {/* Header */}
                <header className="bg-designer-bg border-b border-designer-border px-6 py-4 flex items-center justify-between shrink-0 h-16">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 text-designer-muted hover:text-designer-text transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-designer-text tracking-tight">{collection.name}</h1>
                        <span className="text-[10px] font-mono bg-designer-card text-designer-accent px-2 py-0.5 rounded border border-designer-border uppercase">
                            {type} BATCH #{id.slice(-4).toUpperCase()}
                        </span>
                    </div>
                </header>

                {/* Toolbar */}
                <div className="px-6 py-3 border-b border-designer-border flex items-center justify-between shrink-0 bg-designer-card/50">
                    <div className="flex items-center gap-6 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-designer-muted hover:text-designer-text transition-colors select-none">
                            <input
                                type="checkbox"
                                checked={selectedItems.length === collection.items.length && collection.items.length > 0}
                                onChange={toggleSelectAll}
                                className="rounded border-designer-border bg-transparent text-designer-accent focus:ring-offset-designer-bg focus:ring-designer-accent"
                            />
                            Select All ({collection.items.length})
                        </label>
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
                            {displayedItems.map(item => {
                                const isSelected = selectedItems.includes(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedAssetForDetail(item)}
                                        className={`aspect-square bg-designer-card rounded-xl border p-2 group relative cursor-pointer transition-all duration-300 ${isSelected ? 'border-designer-accent shadow-[0_0_20px_rgba(230,228,224,0.1)] ring-1 ring-designer-accent' : 'border-designer-border hover:border-designer-muted'}`}
                                    >
                                        <div className="w-full h-full rounded-lg overflow-hidden relative bg-[#0f0f0f]">
                                            <img
                                                src={isVideoMode ? item.image : item.src.large}
                                                alt={item.alt}
                                                className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-90 opacity-60' : 'group-hover:scale-110'}`}
                                            />

                                            {isVideoMode && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                    <div className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                                        <PlayCircle size={24} fill="white" className="text-transparent" />
                                                    </div>
                                                </div>
                                            )}

                                            <div className={`absolute inset-0 bg-designer-accent/5 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`}></div>

                                            {/* Checkbox Overlay - Clicking THIS toggles selection */}
                                            <div
                                                onClick={(e) => toggleSelect(item.id, e)}
                                                className={`absolute top-2 left-2 z-20 transition-all duration-300 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100'}`}
                                            >
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border shadow-lg ${isSelected ? 'bg-designer-accent text-designer-bg border-designer-accent' : 'bg-designer-bg/50 border-white/20 backdrop-blur-md hover:bg-designer-accent hover:border-designer-accent hover:text-designer-bg'}`}>
                                                    {isSelected && <Check size={14} strokeWidth={3} />}
                                                </div>
                                            </div>

                                            {isVideoMode && (
                                                <div className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-lg text-white/70 pointer-events-none">
                                                    <Film size={14} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {displayedItems.length < 10 && Array.from({ length: 10 - displayedItems.length }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square bg-designer-card/20 rounded-xl border border-designer-border opacity-20"></div>
                            ))}
                        </div>
                    ) : (
                        /* List View */
                        <div className="flex flex-col gap-2 pb-20">
                            {displayedItems.map(item => {
                                const isSelected = selectedItems.includes(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedAssetForDetail(item)}
                                        className={`flex items-center gap-4 bg-designer-card p-2 rounded-xl border transition-all cursor-pointer group ${isSelected ? 'border-designer-accent bg-designer-accent/5' : 'border-designer-border hover:border-designer-muted'}`}
                                    >
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/20 shrink-0 relative">
                                            <img src={isVideoMode ? item.image : item.src.tiny} alt={item.alt} className="w-full h-full object-cover" />
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-designer-accent/20 flex items-center justify-center">
                                                    <Check size={16} className="text-designer-bg drop-shadow-md" strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-designer-text truncate text-sm">{item.alt || 'Untitled Asset'}</h4>
                                            <p className="text-xs text-designer-muted">by {item.photographer || item.user?.name}</p>
                                        </div>

                                        <button
                                            onClick={(e) => toggleSelect(item.id, e)}
                                            className={`p-2 rounded-lg border transition-all mr-2 ${isSelected ? 'bg-designer-accent text-designer-bg border-designer-accent' : 'border-designer-border text-designer-muted hover:border-designer-text'}`}
                                        >
                                            <Check size={16} />
                                        </button>

                                        <div className="px-4 text-[10px] font-mono text-designer-muted">
                                            {isVideoMode ? `${item.duration}s` : `${item.width} x ${item.height}`}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {itemsToShow < collection.items.length && (
                        <div className="text-center py-10 text-designer-muted text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
                            Indexing assets // scanning archive...
                        </div>
                    )}
                </div>

                {/* Footer Status */}
                <div className="px-6 py-2 border-t border-designer-border text-[10px] text-designer-muted font-bold uppercase tracking-widest flex justify-between shrink-0 bg-designer-bg absolute bottom-0 left-0 right-0 z-20">
                    <span>System Status: Online // Mode: {type.toUpperCase()}</span>
                    <span>Rendered: {displayedItems.length} / Active: {selectedItems.length} / Global: {collection.items.length}</span>
                </div>
            </main>

            {/* Right Sidebar (Batch Configuration) */}
            <div className="w-[320px] bg-designer-card border-l border-designer-border h-full shrink-0 flex flex-col shadow-2xl relative z-20 hidden md:flex">
                <div className="p-5 border-b border-designer-border bg-designer-modal/50">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="font-bold text-designer-text text-xs uppercase tracking-[0.2em]">Batch Parameters</h2>
                        <span className="text-[10px] bg-designer-accent text-designer-bg px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Active</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">


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
                            {(isVideoMode ? ['MP4'] : ['JPG', 'PNG', 'WEBP']).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFormat(f)}
                                    className={`text-[10px] font-black py-2.5 rounded-xl border transition-all uppercase tracking-widest ${format === f || (isVideoMode && f === 'MP4') ? 'bg-designer-accent text-designer-bg border-designer-accent shadow-lg' : 'bg-transparent text-designer-muted border-designer-border hover:border-designer-muted hover:text-designer-text'}`}
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
                            {(isVideoMode ? [
                                { id: 'Original', label: 'Original', sub: 'Highest' },
                                { id: 'HD', label: 'HD', sub: '1080p' },
                            ] : [
                                { id: 'Original', label: 'Original', sub: '>2k px' },
                                { id: 'Large', label: 'Large', sub: '1k-2k px' },
                                { id: 'Medium', label: 'Med', sub: '0.5k-1k px' },
                                { id: 'Small', label: 'Small', sub: '<0.5k px' },
                            ]).map((opt) => (
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


                    <button
                        disabled={processing || selectedItems.length === 0}
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

            <PhotoDetailModal
                photo={selectedAssetForDetail}
                isOpen={!!selectedAssetForDetail}
                onClose={() => setSelectedAssetForDetail(null)}
                onDownload={handleSingleDownload}
                onAddToCollection={() => { }} // Disabled in archive view
                onSelectPhoto={setSelectedAssetForDetail}
            />
        </div >
    );
};

export default CollectionDetail;
