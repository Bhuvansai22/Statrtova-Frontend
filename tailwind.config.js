/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'brand-bg': '#E1E1E1',
                'brand-border': '#CDCDCF', // Keeping border as is unless requested otherwise
                'brand-surface': '#FFFFFF',
            },
        },
    },
};
