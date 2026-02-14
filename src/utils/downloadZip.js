import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getImageUrlBySize, convertImageFormat, removeBackgroundMock } from './imageProcessor';

export const downloadPhotosAsZip = async (photos, filename = 'pexels-collection.zip', options = { size: 'Original', format: 'JPG', bgRemoval: false }) => {
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
            let blob = await fetchBlob(targetUrl);

            // 3. Background Removal (Simulation)
            if (options.bgRemoval) {
                blob = await removeBackgroundMock(blob);
            }

            // 4. Convert Format if needed
            const convertedBlob = await convertImageFormat(blob, options.format);

            // 5. Determine extension
            const extension = options.format.toLowerCase();
            const name = `${photo.id}-${photo.photographer.replace(/\s+/g, '-').toLowerCase()}${options.bgRemoval ? '_bg_removed' : ''}.${extension}`;

            folder.file(name, convertedBlob);
        } catch (error) {
            console.error(`Error processing photo ${photo.id}:`, error);
        }
    });

    await Promise.all(promises);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, filename);
};
