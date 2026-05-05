/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                gold: '#C4A267',
                'gold-light': '#D4B57A',
                'dark-mia': '#0d0d0d',
            },
            fontFamily: {
                glacial: ['GlacialIndifference', 'sans-serif'],
                lastica: ['Lastica', 'serif'],
            },
        },
    },
    plugins: [],
};
