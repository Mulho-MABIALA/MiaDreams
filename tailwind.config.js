/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.js',
        './resources/js/**/*.jsx',
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
