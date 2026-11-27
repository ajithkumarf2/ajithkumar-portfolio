/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#F8FAFC',
          dark: '#0B0F17'
        },
        surface: {
          light: '#FFFFFF',
          dark: '#111827',
          darker: '#0D131F'
        },
        border: {
          light: '#E2E8F0',
          dark: 'rgba(255, 255, 255, 0.08)'
        },
        accent: {
          DEFAULT: '#10B981', // Emerald precision accent
          hover: '#059669',
          light: '#34D399',
          dark: '#047857',
          subtle: 'rgba(16, 185, 129, 0.12)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
