/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      backgroundColor: {
        body: "#0f172a",
        main: "#1e293b"
      },
      fontFamily: {
        poppins: "'Poppins', sans-serif"
      },
      keyframes: {
        shake: {
          '25%': {
            "transform": "translateX(6px)"
          },
          '50%': {
            'transform': 'translateX(-6px)'
          },
          '75%': {
            'transform': 'translateX(12px)'
          }
        }
      },
      animation: {
        'shake': 'shake 0.4s'
      }
    },
  },
  plugins: [],
}
