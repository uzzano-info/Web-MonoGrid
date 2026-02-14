import React from 'react';
import { Download, X, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActionDock = ({ selectedCount, onClear, onDownload, processing, onAddToCollection }) => {
    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-lg"
                >
                    <div className="bg-designer-card border border-designer-border rounded-2xl shadow-2xl px-6 py-4 flex items-center justify-between backdrop-blur-lg">
                        <div className="flex items-center gap-4">
                            <span className="bg-designer-accent text-designer-bg w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg shadow-designer-accent/10">
                                {selectedCount}
                            </span>
                            <div className="flex flex-col">
                                <span className="text-designer-text font-bold text-sm">
                                    Selection
                                </span>
                                <button
                                    onClick={onClear}
                                    className="text-designer-error text-[10px] font-bold uppercase tracking-widest text-left hover:opacity-80 transition-opacity"
                                >
                                    Clear all
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={onAddToCollection}
                                className="text-designer-muted hover:text-designer-text transition-colors p-2.5 bg-designer-bg/50 rounded-xl border border-designer-border hover:border-designer-muted"
                                title="Add to Collection"
                            >
                                <FolderPlus size={20} />
                            </button>

                            <button
                                onClick={onDownload}
                                disabled={processing}
                                className="bg-designer-accent text-designer-bg px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-designer-accent-hover transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95"
                            >
                                {processing ? (
                                    <span className="animate-pulse">Processing...</span>
                                ) : (
                                    <>
                                        <Download size={18} />
                                        <span>Download Archive</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ActionDock;
