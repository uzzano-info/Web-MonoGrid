import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, ThumbsUp, Send, Coffee, MessageCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCommunityStore from '../store/useCommunityStore';
import { AnimatePresence } from 'framer-motion';

const Community = () => {
    const navigate = useNavigate();
    const { posts, addPost, likePost } = useCommunityStore();
    const [newPost, setNewPost] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        setIsSubmitting(true);
        // Simulate network delay
        setTimeout(() => {
            addPost(newPost);
            setNewPost('');
            setIsSubmitting(false);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-designer-bg text-designer-text font-sans pb-20">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-[50] bg-designer-bg/80 backdrop-blur-md border-b border-designer-border px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="p-2 text-designer-muted hover:text-designer-text transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold tracking-tight text-designer-text">Community Hub</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-24 space-y-12">

                {/* 1. Support / Coffee Chat Section */}
                <section className="grid md:grid-cols-2 gap-6">
                    <div className="bg-designer-card border border-designer-border rounded-2xl p-6 flex flex-col items-center text-center hover:border-designer-accent/30 transition-all shadow-lg group">
                        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform border border-designer-border">
                            <Coffee size={32} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-lg font-bold text-designer-text mb-2">Buy me a Coffee</h2>
                        <p className="text-sm text-designer-muted mb-6 px-4">Support the development of MonoGrid. Your contribution helps keep the servers running!</p>
                        <a
                            href="https://buymeacoffee.com/uzzano"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-3 bg-black hover:bg-[#1a1a1a] text-white font-bold rounded-xl transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 border border-designer-border"
                        >
                            <Heart size={18} fill="currentColor" />
                            Support Creator
                        </a>
                    </div>

                    <div className="bg-designer-card border border-designer-border rounded-2xl p-6 flex flex-col items-center text-center hover:border-designer-accent/30 transition-all shadow-lg group">
                        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform border border-designer-border">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </div>
                        <h2 className="text-lg font-bold text-designer-text mb-2">Connect on X</h2>
                        <p className="text-sm text-designer-muted mb-6 px-4">Have a feature request or just want to chat? Connect directly via X (Twitter).</p>
                        <a
                            href="https://x.com/uzzano_dev"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-3 bg-black hover:bg-[#1a1a1a] text-white font-bold rounded-xl transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 border border-designer-border"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            Connect on X
                        </a>
                    </div>
                </section>

                {/* 2. Feedback Board Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <MessageSquare size={24} className="text-designer-accent" />
                        <h2 className="text-2xl font-bold text-designer-text tracking-tight">Feedback Board</h2>
                    </div>

                    {/* Input Area */}
                    <div className="bg-designer-card border border-designer-border rounded-2xl p-5 mb-8 focus-within:ring-1 focus-within:ring-designer-accent transition-all">
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="Share your thoughts, report bugs, or suggest features..."
                                className="w-full bg-transparent border-none focus:ring-0 text-designer-text placeholder:text-designer-muted resize-none h-24 text-sm"
                            />
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-designer-border">
                                <span className="text-[10px] text-designer-muted font-bold uppercase tracking-widest">
                                    Local Storage Mode
                                </span>
                                <button
                                    type="submit"
                                    disabled={!newPost.trim() || isSubmitting}
                                    className="bg-designer-accent text-designer-bg px-5 py-2 rounded-lg text-sm font-bold hover:bg-designer-accent-hover transition-all flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
                                >
                                    {isSubmitting ? 'Posting...' : (
                                        <>
                                            <span>Post</span>
                                            <Send size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Post List */}
                    <div className="space-y-4">
                        <AnimatePresence>
                            {posts.map((post) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    layout
                                    className={`bg-designer-card border ${post.isOfficial ? 'border-designer-accent/50 bg-designer-accent/5' : 'border-designer-border'} rounded-2xl p-5`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${post.isOfficial ? 'bg-designer-accent text-designer-bg' : 'bg-designer-bg text-designer-muted border border-designer-border'}`}>
                                                {post.author.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-bold ${post.isOfficial ? 'text-designer-accent' : 'text-designer-text'}`}>
                                                        {post.author}
                                                    </span>
                                                    {post.isOfficial && (
                                                        <span className="text-[9px] bg-designer-accent text-designer-bg px-1.5 py-0.5 rounded font-bold uppercase">Official</span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-designer-muted">{new Date(post.timestamp).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-designer-secondary text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => likePost(post.id)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-designer-bg border border-designer-border hover:border-designer-accent/50 hover:text-designer-accent transition-all text-xs font-bold text-designer-muted group"
                                        >
                                            <ThumbsUp size={14} className="group-hover:scale-110 transition-transform" />
                                            {post.likes}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {posts.length === 0 && (
                            <div className="text-center py-10 text-designer-muted text-sm">
                                No posts yet. Be the first to share!
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Community;
