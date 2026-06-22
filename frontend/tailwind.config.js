/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        dash: {
          bg: '#0F1B33',          // deep navy base
          panel: '#16243F',       // card background
          panel2: '#1C2D4D',      // slightly lighter panel
          border: '#28395C',
          accent: '#F5B544',      // sun amber, our signature accent
          text: '#E8EDF7',
          muted: '#8C9BC2',
        }
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.92' },
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(8px)' },
        },
        fall: {
          '0%': { transform: 'translateY(-4px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        }
      },
      animation: {
        breathe: 'breathe 4s ease-in-out infinite',
        drift: 'drift 3s ease-in-out infinite alternate',
        fall: 'fall 1.2s ease-in infinite',
      }
    },
  },
  plugins: [],
}
