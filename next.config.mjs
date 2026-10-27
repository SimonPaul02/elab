/** Statischer Export: `npm run build` legt die fertige Seite in ./out ab (läuft auf jedem Webspace, Vercel, Netlify). */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
