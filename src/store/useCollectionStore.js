import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCollectionStore = create(
    persist(
        (set) => ({
            collections: [
                { id: '1', name: 'Favorites', photos: [] },
                { id: '2', name: 'Inspiration', photos: [] },
            ],
            addCollection: (name) =>
                set((state) => ({
                    collections: [
                        ...state.collections,
                        { id: Date.now().toString(), name, photos: [] },
                    ],
                })),
            deleteCollection: (id) =>
                set((state) => ({
                    collections: state.collections.filter((c) => c.id !== id),
                })),
            addToCollection: (collectionId, newPhotos) =>
                set((state) => ({
                    collections: state.collections.map((col) => {
                        if (col.id === collectionId) {
                            // Avoid duplicates
                            const existingIds = new Set(col.photos.map((p) => p.id));
                            const uniquePhotos = newPhotos.filter((p) => !existingIds.has(p.id));
                            return { ...col, photos: [...col.photos, ...uniquePhotos] };
                        }
                        return col;
                    }),
                })),
            removeFromCollection: (collectionId, photoId) =>
                set((state) => ({
                    collections: state.collections.map((col) => {
                        if (col.id === collectionId) {
                            return { ...col, photos: col.photos.filter((p) => p.id !== photoId) };
                        }
                        return col;
                    }),
                })),
        }),
        {
            name: 'pexels-collections-storage',
        }
    )
);

export default useCollectionStore;
