import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Fix for some packages that require node polyfills in browser (react-quill, buffer, process)
// Install with: npm install process buffer --save
export default defineConfig({
    plugins: [react()],
    define: {
        "process.env": {},
    },
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            process: "process/browser",
            buffer: "buffer",
        },
    },
    optimizeDeps: {
        include: ["react-quill", "quill", "process", "buffer"],
    },
});
