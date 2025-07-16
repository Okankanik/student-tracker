import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173, // Buraya sabit port numarasını yazıyorsun
    strictPort: true, // Eğer 5173 kullanılıyorsa, başka porta geçmez, hata verir
  },
});
