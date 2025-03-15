/**
 * File: inovacademico/frontend/tailwind.config.js
 * Tailwind CSS configuration
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          green: {
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
          },
          purple: {
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
          },
          pink: {
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
          }
        },
        boxShadow: {
          glow: '0 0 15px -3px rgba(159, 122, 234, 0.4)',
        },
      },
    },
    plugins: [],
  }