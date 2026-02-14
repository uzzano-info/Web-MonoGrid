export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                designer: {
                    bg: '#1C1B1A',      // Main Background
                    card: '#262523',    // Warm Graphite (Elevated)
                    modal: '#302E2C',   // Soft Charcoal (Highest)
                    text: '#F4F2EF',    // Crisp Pearl (Primary)
                    secondary: '#9E9B96', // Warm Dust
                    muted: '#6B6864',   // Muted Clay
                    border: '#363432',  // Deep Taupe
                    accent: '#E6E4E0',  // Bone White (Primary Action)
                    'accent-hover': '#CFCBC5',
                    success: '#5A6B5D', // Muted Olive
                    error: '#825353',   // Dusty Brick
                }
            }
        },
    },
    plugins: [],
}
