/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './backend/resources/views/**/*.blade.php',
        './frontend/js/**/*.js',
        './frontend/js/**/*.jsx',
    ],
    theme: {
        extend: {
            colors: {
                gold: '#C4A267',
                'gold-light': '#d4b97a',
                'dark-mia': '#0d0d0d',
            },
            fontFamily: {
                glacial: ['GlacialIndifference', 'sans-serif'],
                lastica: ['Lastica', 'serif'],
            },
        },
    },
    plugins: [],
}
