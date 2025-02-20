import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // ✅ Remove the extra dot
    port: 5173, // ✅ Ensure the port is set
    strictPort: true, // ✅ Ensures Vite doesn't switch ports
    open: true, // ✅ Opens browser automatically
    fs: {
      strict: false,
    },
  },
  plugins: [react()],
});
