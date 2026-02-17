import React from 'react';
import { Download, X, FolderPlus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const MotionDiv = motion.div;

const ActionDock = ({ selectedCount, onClear, onDownload, processing, onAddToCollection }) => {
    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <MotionDiv
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-lg"
                >
                    <div className="bg-designer-card border border-designer-border rounded-2xl shadow-2xl px-4 py-3 flex flex-col gap-3 backdrop-blur-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="bg-designer-accent text-designer-bg w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg shadow-designer-accent/10">
                                    {selectedCount}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-designer-text font-bold text-xs">
                                        Selection
                                    </span>
                                    <button
                                        onClick={onClear}
                                        className="text-designer-error text-[9px] font-bold uppercase tracking-widest text-left hover:opacity-80 transition-opacity"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 w-full">
                            <button
                                onClick={onAddToCollection}
                                className="col-span-1 bg-designer-bg text-designer-accent border-2 border-designer-accent/20 hover:border-designer-accent hover:bg-designer-accent/5 rounded-lg font-bold text-[10px] flex flex-col items-center justify-center gap-0.5 py-1.5 transition-all shadow-sm active:scale-95 uppercase tracking-wider"
                                title="Add to Collection"
                            >
                                <FolderPlus size={14} />
                                <span>Add</span>
                            </button>

                            <button
                                onClick={onDownload}
                                disabled={processing}
                                className="col-span-2 bg-designer-accent text-designer-bg rounded-lg font-bold text-xs hover:bg-designer-accent-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 py-2"
                            >
                                {processing ? (
                                    <span className="animate-pulse">Processing...</span>
                                ) : (
                                    <>
                                        <Download size={14} />
                                        <span>Download</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
};

export default ActionDock;
