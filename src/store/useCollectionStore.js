import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCollectionStore = create(
    persist(
        (set) => ({
            photoCollections: [
                { id: 'p1', name: 'Photo Favorites', items: [] },
                { id: 'p2', name: 'Design Inspiration', items: [] },
            ],
            videoCollections: [
                { id: 'v1', name: 'Motion Moodboard', items: [] },
            ],
            addCollection: (name, type = 'photos') =>
                set((state) => {
                    const key = type === 'photos' ? 'photoCollections' : 'videoCollections';
                    return {
                        [key]: [
                            ...state[key],
                            { id: `${type === 'photos' ? 'p' : 'v'}${Date.now()}`, name, items: [] },
                        ],
                    };
                }),
            deleteCollection: (id, type = 'photos') =>
                set((state) => {
                    const key = type === 'photos' ? 'photoCollections' : 'videoCollections';
                    return {
                        [key]: state[key].filter((c) => c.id !== id),
                    };
                }),
            addToCollection: (collectionId, newItems, type = 'photos') =>
                set((state) => {
                    const key = type === 'photos' ? 'photoCollections' : 'videoCollections';
                    return {
                        [key]: state[key].map((col) => {
                            if (col.id === collectionId) {
                                const existingIds = new Set(col.items.map((p) => p.id));
                                const uniqueItems = newItems.filter((p) => !existingIds.has(p.id));
                                return { ...col, items: [...col.items, ...uniqueItems] };
                            }
                            return col;
                        }),
                    };
                }),
            removeFromCollection: (collectionId, itemId, type = 'photos') =>
                set((state) => {
                    const key = type === 'photos' ? 'photoCollections' : 'videoCollections';
                    return {
                        [key]: state[key].map((col) => {
                            if (col.id === collectionId) {
                                return { ...col, items: col.items.filter((p) => p.id !== itemId) };
                            }
                            return col;
                        }),
                    };
                }),
        }),
        {
            name: 'monogrid-dual-collections-storage',
        }
    )
);

export default useCollectionStore;
