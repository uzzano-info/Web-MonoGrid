import React, { useState } from 'react';
import { Search, Monitor, Smartphone, Square, Check, X } from 'lucide-react';

const COLORS = [
    { name: 'Red', hex: 'e91e63' },
    { name: 'Orange', hex: 'fb8c00' },
    { name: 'Yellow', hex: 'fdd835' },
    { name: 'Green', hex: '43a047' },
    { name: 'Turquoise', hex: '00acc1' },
    { name: 'Blue', hex: '1e88e5' },
    { name: 'Purple', hex: '8e24aa' },
    { name: 'Pink', hex: 'd81b60' },
    { name: 'Brown', hex: '795548' },
    { name: 'Black', hex: '000000' },
    { name: 'Gray', hex: '9e9e9e' },
    { name: 'White', hex: 'ffffff' },
];

const RECOMMENDED_KEYWORDS = [
    'Modern', 'Abstract', 'Minimalist', 'Nature', 'Industrial', 'Workspace', 'Texture', 'Skyline'
];

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({
        orientation: '',
        size: '',
        color: ''
    });

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        onSearch(query, filters);
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onSearch(query, newFilters);
    };

    const handleKeywordClick = (keyword) => {
        setQuery(keyword);
        onSearch(keyword, filters);
    };

    const clearFilters = () => {
        const reset = { orientation: '', size: '', color: '' };
        setFilters(reset);
        onSearch(query, reset);
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-12 relative z-10 space-y-6">
            {/* Recommended Keywords Chips - Moved Above Search */}
            <div className="flex flex-wrap items-center gap-2 px-1">
                <span className="text-[10px] font-bold text-designer-muted uppercase tracking-widest mr-2">Trending:</span>
                {RECOMMENDED_KEYWORDS.map(kw => (
                    <button
                        key={kw}
                        onClick={() => handleKeywordClick(kw)}
                        className={`text-[10px] px-3 py-1.5 rounded-full border transition-all font-bold uppercase ${query === kw ? 'bg-designer-accent text-designer-bg border-designer-accent' : 'bg-designer-card text-designer-muted border-designer-border hover:bg-designer-modal hover:text-designer-text'}`}
                    >
                        {kw}
                    </button>
                ))}
            </div>

            {/* Search Input Area */}
            <form onSubmit={handleSubmit} className="relative">
                <div className="flex bg-designer-card rounded-2xl shadow-2xl border border-designer-border overflow-hidden backdrop-blur-xl group focus-within:ring-2 focus-within:ring-designer-accent/50 transition-all p-1">
                    <div className="pl-4 flex items-center text-designer-muted">
                        <Search size={22} />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search high-resolution assets..."
                        className="flex-1 bg-transparent p-4 text-designer-text outline-none placeholder-designer-muted font-medium text-lg"
                    />
                    <button
                        type="submit"
                        className="bg-designer-accent hover:bg-designer-accent-hover text-designer-bg px-8 rounded-xl font-bold transition-all shadow-lg active:scale-95 m-1"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Always Visible Visual Filters */}
            <div className="bg-designer-card/50 border border-designer-border rounded-2xl p-6 shadow-xl backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-bold text-designer-muted flex items-center gap-2 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-designer-accent"></div>
                        Asset Parameters
                    </h3>
                    {Object.values(filters).some(Boolean) && (
                        <button onClick={clearFilters} className="text-[10px] font-bold text-designer-error hover:opacity-80 flex items-center gap-1 uppercase tracking-tighter transition-opacity">
                            <X size={12} /> Clear all
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Orientation Visualization */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-designer-muted uppercase tracking-wider">Orientation</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'landscape', icon: Monitor, label: 'Wide' },
                                { id: 'portrait', icon: Smartphone, label: 'Tall' },
                                { id: 'square', icon: Square, label: 'Square' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleFilterChange('orientation', filters.orientation === opt.id ? '' : opt.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group ${filters.orientation === opt.id ? 'bg-designer-accent text-designer-bg border-designer-accent' : 'bg-transparent border-designer-border text-designer-muted hover:border-designer-muted hover:text-designer-secondary'}`}
                                >
                                    <opt.icon size={20} className={filters.orientation === opt.id ? 'text-designer-bg' : 'group-hover:scale-110 transition-transform'} />
                                    <span className="text-[10px] mt-2 font-bold uppercase">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Visualization */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-designer-muted uppercase tracking-wider">Scale</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'large', label: 'Large', scale: 'scale-110' },
                                { id: 'medium', label: 'Med', scale: 'scale-90' },
                                { id: 'small', label: 'Small', scale: 'scale-75' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleFilterChange('size', filters.size === opt.id ? '' : opt.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group ${filters.size === opt.id ? 'bg-designer-accent text-designer-bg border-designer-accent' : 'bg-transparent border-designer-border text-designer-muted hover:border-designer-muted hover:text-designer-secondary'}`}
                                >
                                    <div className={`w-5 h-5 border-2 rounded-sm ${filters.size === opt.id ? 'border-designer-bg bg-designer-bg/20' : 'border-current'} ${opt.scale} transition-transform`}></div>
                                    <span className="text-[10px] mt-2 font-bold uppercase">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Visualization */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-designer-muted uppercase tracking-wider">Chroma</label>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {COLORS.map(c => (
                                <button
                                    key={c.name}
                                    onClick={() => handleFilterChange('color', filters.color === c.hex ? '' : c.hex)}
                                    className={`w-7 h-7 rounded-lg border border-designer-border transition-all flex items-center justify-center relative ${filters.color === c.hex ? 'ring-2 ring-designer-accent scale-110' : 'hover:scale-110'}`}
                                    style={{ backgroundColor: `#${c.hex}` }}
                                    title={c.name}
                                >
                                    {filters.color === c.hex && <Check size={14} className={c.hex === 'ffffff' ? 'text-black' : 'text-white'} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
