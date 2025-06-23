import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // const env = loadEnv(mode, '.', ''); // loadEnv is not strictly necessary if only relying on VITE_ prefixes
    return {
      // define: {
      //   'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY) // Removed this line
      // },
      resolve: {
        alias: {
          '@': '.',
        }
      }
    };
});
