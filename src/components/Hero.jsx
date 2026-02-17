import heroBg from '../assets/hero-bg.jpg';

const Hero = () => {
    return (
        <div className="relative h-[45vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden mb-12">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-designer-bg/50 to-designer-bg z-10" />
                <img
                    src={heroBg}
                    alt="MonoGrid Hero Background"
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
                    <h1 className="text-5xl md:text-7xl font-bold text-designer-text mb-6 tracking-tight">
                        Mono<span className="text-designer-accent">Grid</span>
                    </h1>
                    <div className="flex flex-col gap-4">
                        <p className="text-xl text-designer-secondary mb-2 max-w-2xl mx-auto leading-relaxed">
                            Free multi-image collection board.
                            Search, curate, and bulk download high-resolution assets for your creative projects.
                        </p>
                        <div className="mt-8">
                            <span className="inline-block bg-black/50 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-medium text-white/70 uppercase tracking-widest hover:bg-black/70 transition-colors cursor-default">
                                Powered by Pexels API
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
