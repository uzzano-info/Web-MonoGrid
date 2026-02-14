import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <div className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden mb-12">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-designer-bg/50 to-designer-bg z-10" />
                <img
                    src="https://images.pexels.com/photos/1743387/pexels-photo-1743387.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow"
                />
            </div>

            {/* Content */}
            <div className="relative z-20 text-center px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-designer-card text-designer-muted text-sm font-semibold mb-6 backdrop-blur-md border border-designer-border shadow-sm">
                        Powered by Pexels API
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-designer-text mb-6 tracking-tight">
                        Mono<span className="text-designer-accent">Grid</span>
                    </h1>
                    <p className="text-xl text-designer-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
                        Free multi-image collection board.
                        Search, curate, and bulk download high-resolution assets for your creative projects.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
