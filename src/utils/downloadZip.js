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
            let blob;
            let extension;

            if (photo.video_files) {
                // Handle Video
                const quality = options.size === 'HD' ? 'hd' : 'sd';
                const videoFile = photo.video_files.find(f => f.quality === quality) || photo.video_files[0];
                blob = await fetchBlob(videoFile.link);
                extension = 'mp4';
            } else {
                // Handle Photo
                const targetUrl = getImageUrlBySize(photo.src, options.size);
                blob = await fetchBlob(targetUrl);
                const processedBlob = await convertImageFormat(blob, options.format);
                blob = processedBlob;
                extension = options.format.toLowerCase();
                if (extension === 'jpg') extension = 'jpeg'; // Normalize for mime/consistency if needed, though 'jpg' is fine for extension
            }

            const name = `${photo.id}-${(photo.photographer || 'pexels').replace(/\s+/g, '-').toLowerCase()}.${extension}`;
            folder.file(name, blob);
        } catch (error) {
            console.error(`Error processing asset ${photo.id}:`, error);
        }
    });

    await Promise.all(promises);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, filename);
};
