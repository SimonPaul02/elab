'use client';
// Setzt den Scrollfortschritt der Fluss-Section als CSS-Variable --p (von -0,3 beim Hereinscrollen bis 1 am Ende).
import { useEffect, useRef, type ReactNode } from 'react';

export default function FlussScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const kopf = 68, r = el.getBoundingClientRect();
      const weg = el.offsetHeight - (window.innerHeight - kopf);
      const p = Math.min(1, Math.max(-0.3, (kopf - r.top) / Math.max(1, weg)));
      el.style.setProperty('--p', p.toFixed(4));
    };
    const plan = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', plan, { passive: true });
    window.addEventListener('resize', plan);
    return () => { window.removeEventListener('scroll', plan); window.removeEventListener('resize', plan); cancelAnimationFrame(raf); };
  }, []);
  return <section ref={ref} className="fluss" id="fluss" aria-label="Vom Modell zum LV">{children}</section>;
}
