import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      "@supabase/supabase-js": path.resolve(__dirname, "src/lib/backend"),
    }
  }
});
