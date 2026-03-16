module.exports = {
  content: ["./src/**/*.{html,ts}"],
  corePlugins: {
    preflight: false,  // ← no pisa tus estilos custom
  },
  theme: { extend: {} },
  plugins: [],
}
