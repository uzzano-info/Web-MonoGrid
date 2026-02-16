/**
 * Maps the selected size option to the appropriate Pexels API image URL.
 * @param {Object} src - The src object from a Pexels photo.
 * @param {string} size - The selected size ('Original', 'Large', 'Medium', 'Small').
 * @returns {string} The URL of the image to fetch.
 */
export const getImageUrlBySize = (src, size) => {
    switch (size) {
        case 'Original':
            return src.original;
        case 'Large':
            return src.large2x; // ~1880px width
        case 'Medium':
            return src.large;   // ~940px width
        case 'Small':
            return src.medium;  // ~350px height
        default:
            return src.original;
    }
};

/**
 * Converts an image blob to a specified format (JPG, PNG, WEBP).
 * @param {Blob} blob - The original image blob.
 * @param {string} format - The target format ('JPG', 'PNG', 'WEBP').
 * @returns {Promise<Blob>} A promise that resolves to the converted blob.
 */
export const convertImageFormat = async (blob, format) => {
    if (format === 'JPG' || format === 'JPEG') {
        // Pexels images are already JPEGs usually, but if we need to enforce:
        // Actually, if it's already the right MIME type, we might skip.
        // However, Pexels src.original can be PNG sometimes? Usually JPEG.
        // Let's assume input is manageable.
        // If target is JPG and blob is JPG, just return.
        if (blob.type === 'image/jpeg') return blob;
    }

    const mimeType = `image/${format.toLowerCase()}`;
    if (blob.type === mimeType) return blob;

    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((newBlob) => {
                URL.revokeObjectURL(url);
                if (newBlob) {
                    resolve(newBlob);
                } else {
                    reject(new Error(`Failed to convert image to ${format}`));
                }
            }, mimeType, 0.9); // 0.9 quality
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image for conversion'));
        };

        img.src = url;
    });
};

/**
 * Mocks background removal by adding a processing delay and returning the blob.
 * In a real app, this would use a library like @imgly/background-removal or an API.
 * @param {Blob} blob - The image blob.
 * @returns {Promise<Blob>} A promise that resolves to the processed blob.
 */
export const removeBackgroundMock = async (blob) => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 800));

    // For now, we just return the original blob. 
    // In a "real" mock, we could draw it on canvas and clear corners, but this is enough for the UI demo.
    return blob;
};
