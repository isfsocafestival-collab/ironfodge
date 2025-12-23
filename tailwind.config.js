/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background Colors
        'bg-primary': '#000000',
        'bg-secondary': '#111827',
        'bg-tertiary': '#1F2937',
        'bg-hover': '#374151',
        // Text Colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#D1D5DB',
        'text-muted': '#9CA3AF',
        // Accent Colors
        'accent': '#DC2626',
        'accent-hover': '#B91C1C',
        'accent-border': '#7F1D1D',
        // Border Colors
        'border-primary': '#1F2937',
        'border-secondary': '#374151',
        // Semantic Colors
        'success': '#22C55E',
        'error': '#EF4444',
        'admin-badge': '#9333EA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom, #111827, #000000)',
        'gradient-overlay': 'linear-gradient(to bottom, #000000, rgba(0,0,0,0.8), transparent)',
      },
    },
  },
  plugins: [],
}

