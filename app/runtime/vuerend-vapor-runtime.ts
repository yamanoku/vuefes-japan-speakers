// The published @vuerend/core@0.2.0 dist imports a bundled Vapor runtime chunk.
// Route that import back to this app's Vue 3.6 runtime so server prerender can resolve it.
export { vaporInteropPlugin as n, createVaporApp as t } from "@vue/runtime-vapor";
