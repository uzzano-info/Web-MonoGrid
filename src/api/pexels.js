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
