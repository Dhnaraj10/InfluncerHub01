/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a78bfa', // Light purple
          DEFAULT: '#8b5cf6', // Purple
          dark: '#7c3aed', // Dark purple
        },
        secondary: {
          light: '#c4b5fd', // Light lavender
          DEFAULT: '#5b21b6', // Dark violet
          dark: '#4c1d95', // Deeper violet
        },
        background: {
          light: '#f5f3ff', // Very light purple
          dark: '#2e1065', // Very dark violet
        },
        accent: {
          DEFAULT: '#ec4899', // Pink for accents
          hover: '#db2777', // Darker pink for hover states
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(139, 92, 246, 0.5)',
        'inner-glow': 'inset 0 0 15px rgba(139, 92, 246, 0.5)',
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
    fontFamily: {
      'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      'display': ['Poppins', 'ui-sans-serif', 'system-ui'],
    },
  },
  plugins: [],
  darkMode: 'class',
}