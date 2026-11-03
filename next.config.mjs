import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** Statischer Export: `npm run build` legt die fertige Seite in ./out ab (läuft auf jedem Webspace, Vercel, Netlify). */
export default function nextConfig(phase) {
  const config = {
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
  };

  // Nur `next dev`: Andere lokale Projekte mit Sprachpräfix (/en, /de) bleiben im
  // Browser-Verlauf von localhost hängen und landen hier sonst auf einer 404.
  // Im statischen Export gibt es keine Redirects, daher nicht im Build.
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    config.redirects = async () => [
      { source: '/:locale(en|de)', destination: '/', permanent: false },
      { source: '/:locale(en|de)/:path+', destination: '/:path+', permanent: false },
    ];
  }

  return config;
}
