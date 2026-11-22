import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';

export default defineConfig(({mode})=>({
  plugins:[react()],
  define:{'process.env.NODE_ENV':JSON.stringify('production')},
  base: mode==='streamlit' ? './' : '/',
  build: mode==='streamlit'
    ? {outDir:'dist_streamlit',emptyOutDir:true,lib:{entry:resolve('src/streamlit.jsx'),formats:['es'],fileName:'finance_architecture'},cssCodeSplit:false}
    : {outDir:'dist',emptyOutDir:true}
}));
