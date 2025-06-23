import { defineConfig } from 'vite';

export default defineConfig(() => { // Removed mode parameter
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
