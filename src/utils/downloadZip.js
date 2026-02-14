import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getImageUrlBySize, convertImageFormat } from './imageProcessor';

export const downloadPhotosAsZip = async (photos, filename = 'pexels-collection.zip', options = { size: 'Original', format: 'JPG' }) => {
    const zip = new JSZip();
    const folder = zip.folder('photos');

    // Helper to fetch blob
    const fetchBlob = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        return response.blob();
    };

    const promises = photos.map(async (photo) => {
        try {
            // 1. Get correct URL based on size
            const targetUrl = getImageUrlBySize(photo.src, options.size);

            // 2. Fetch Blob
            const originalBlob = await fetchBlob(targetUrl);

            // 3. Convert Format if needed
            // If fetching Original (which might be huge), converting on canvas might crash if too big.
            // But for this demo we assume it works.
            const convertedBlob = await convertImageFormat(originalBlob, options.format);

            // 4. Determine extension
            const extension = options.format.toLowerCase();
            const name = `${photo.id}-${photo.photographer.replace(/\s+/g, '-').toLowerCase()}.${extension}`;

            folder.file(name, convertedBlob);
        } catch (error) {
            console.error(`Error processing photo ${photo.id}:`, error);
        }
    });

    await Promise.all(promises);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, filename);
};
