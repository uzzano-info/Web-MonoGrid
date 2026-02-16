import React, { useState } from 'react';
import { X, Plus, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCollectionStore from '../store/useCollectionStore';

const CollectionModal = ({ isOpen, onClose, photosToAdd }) => {
    const navigate = useNavigate();
    const { collections, addCollection, addToCollection } = useCollectionStore();
    const [newCollectionName, setNewCollectionName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    if (!isOpen) return null;

    const handleCreate = (e) => {
        e.preventDefault();
        if (newCollectionName.trim()) {
            addCollection(newCollectionName);
            setNewCollectionName('');
            setIsCreating(false);
        }
    };

    const handleAddToCollection = (collectionId) => {
        addToCollection(collectionId, photosToAdd);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={onClose}
        >
            <div
                className="bg-designer-modal border border-designer-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-5 border-b border-designer-border bg-designer-card/50">
                    <h3 className="text-lg font-bold text-designer-text tracking-tight uppercase tracking-widest text-xs opacity-70">Archive Management</h3>
                    <button onClick={onClose} className="text-designer-muted hover:text-designer-text transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2 custom-scrollbar">
                    {collections.map((col) => (
                        <div
                            key={col.id}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-designer-card border border-transparent hover:border-designer-border transition-all text-left group cursor-pointer"
                            onClick={(e) => {
                                if (e.target.closest('button')) return;
                                if (photosToAdd.length > 0) {
                                    handleAddToCollection(col.id);
                                } else {
                                    navigate(`/collections/${col.id}`);
                                    onClose(); // Close modal after navigation
                                }
                            }}
                        >
                            <div className="w-12 h-12 bg-designer-bg rounded-lg flex items-center justify-center text-designer-muted group-hover:text-designer-accent shrink-0 border border-designer-border overflow-hidden">
                                {col.photos.length > 0 ? (
                                    <img src={col.photos[0].src.tiny} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                ) : (
                                    <Folder size={20} />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-designer-text text-sm">{col.name}</p>
                                <p className="text-[10px] text-designer-muted uppercase font-bold tracking-tighter">{col.photos.length} elements</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (photosToAdd.length > 0) {
                                        handleAddToCollection(col.id);
                                    } else {
                                        navigate(`/collections/${col.id}`);
                                        onClose();
                                    }
                                }}
                                className="bg-designer-accent text-designer-bg px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-designer-accent-hover transition-colors shadow-lg active:scale-95"
                            >
                                {photosToAdd.length > 0 ? 'Archive' : 'Detail'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-5 border-t border-designer-border bg-designer-card">
                    {isCreating ? (
                        <form onSubmit={handleCreate} className="flex gap-2">
                            <input
                                type="text"
                                value={newCollectionName}
                                onChange={(e) => setNewCollectionName(e.target.value)}
                                placeholder="COLLECTION_NAME_UNDEFINED"
                                className="flex-1 bg-designer-bg border border-designer-border rounded-xl px-4 py-2.5 text-sm text-designer-text focus:outline-none focus:border-designer-accent placeholder:text-designer-muted placeholder:uppercase placeholder:text-[10px] placeholder:font-bold"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="bg-designer-accent text-designer-bg px-5 rounded-xl text-sm font-bold hover:bg-designer-accent-hover transition-all shadow-lg active:scale-95"
                            >
                                Init
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full flex items-center justify-center gap-2 py-3 text-designer-accent border border-designer-accent/20 hover:bg-designer-accent/5 rounded-xl transition-all text-xs font-bold uppercase tracking-widest"
                        >
                            <Plus size={16} /> New Collection
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectionModal;
