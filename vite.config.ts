import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config = {
  plugins: [sveltekit()],
  kit: {
    // ...
    vite: {
      ssr: {
        noExternal: ['chart.js'],
      },
    },
  },
};

export default config;
