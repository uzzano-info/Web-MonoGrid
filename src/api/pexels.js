import axios from 'axios';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

const client = axios.create({
    baseURL: 'https://api.pexels.com/v1',
    headers: {
        Authorization: PEXELS_API_KEY,
    },
});

export const searchPhotos = async (query, perPage = 30, page = 1, filters = {}) => {
    try {
        const params = {
            query,
            per_page: perPage,
            page,
            ...filters
        };
        const response = await client.get('/search', { params });
        return response.data;
    } catch (error) {
        console.error('Error searching photos:', error);
        throw error;
    }
};

export const getCuratedPhotos = async (perPage = 30, page = 1) => {
    try {
        const response = await client.get('/curated', {
            params: { per_page: perPage, page },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching curated photos:', error);
        throw error;
    }
};

export const getRelatedPhotos = async (photo, perPage = 15) => {
    try {
        // Strategy 1: Search by photographer
        const photographerPromise = client.get('/search', {
            params: { query: photo.photographer, per_page: perPage }
        });

        // Strategy 2: Search by alt text key terms (simple heuristic: first 3 words or full alt if short)
        // Check if alt is defined and invalid/empty, if so use a fallback or skip
        let altQuery = 'abstract';
        if (photo.alt) {
            const words = photo.alt.split(' ');
            altQuery = words.length > 4 ? words.slice(0, 4).join(' ') : photo.alt;
        }

        const visualPromise = client.get('/search', {
            params: { query: altQuery, per_page: perPage }
        });

        const [photographerRes, visualRes] = await Promise.all([photographerPromise, visualPromise]);

        return {
            artist: photographerRes.data.photos.filter(p => p.id !== photo.id),
            visual: visualRes.data.photos.filter(p => p.id !== photo.id)
        };
    } catch (error) {
        console.error('Error fetching related photos:', error);
        return { artist: [], visual: [] };
    }
};

export const searchVideos = async (query, perPage = 30, page = 1, filters = {}) => {
    try {
        const params = {
            query,
            per_page: perPage,
            page,
            ...filters
        };
        const response = await client.get('/videos/search', { params });
        return response.data;
    } catch (error) {
        console.error('Error searching videos:', error);
        throw error;
    }
};

export const getPopularVideos = async (perPage = 30, page = 1) => {
    try {
        const response = await client.get('/videos/popular', {
            params: { per_page: perPage, page },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching popular videos:', error);
        throw error;
    }
};
