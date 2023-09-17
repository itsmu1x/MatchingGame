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
      }
    },
  },
  plugins: [],
}

