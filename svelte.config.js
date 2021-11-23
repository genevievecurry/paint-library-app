import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    vite: {
      base: "https://paint-library-app.herokuapp.com"
      // build: { target: 'esnext'},
      // optimizeDeps: {
      //   include: [],
      // },
    },
    adapter: adapter({
      // default options are shown
      out: 'build',
      precompress: false,
    }),
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
  },
};

export default config;
