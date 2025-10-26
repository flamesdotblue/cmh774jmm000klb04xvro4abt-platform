import { lazy, Suspense, useEffect, useMemo, useState } from 'react';

// Defer loading Spline for performance and only render on larger screens without reduced motion
// This prevents heavy GPU usage on mobile and keeps the site smooth.

function useMedia(query) {
  const [matches, setMatches] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    m.addEventListener?.('change', onChange);
    setMatches(m.matches);
    return () => m.removeEventListener?.('change', onChange);
  }, [query]);
  return matches;
}

function usePrefersReducedMotion() {
  return useMedia('(prefers-reduced-motion: reduce)');
}

const LazySpline = lazy(() => import('@splinetool/react-spline'));

export default function Hero() {
  const isDesktop = useMedia('(min-width: 1024px)');
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  // Only mount the heavy canvas when hero is in view on desktop and motion allowed
  useEffect(() => {
    if (!isDesktop || reduced) return;
    let obs;
    const el = document.getElementById('hero');
    if (!el) return;
    if ('IntersectionObserver' in window) {
      obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const run = () => setVisible(true);
            if ('requestIdleCallback' in window) {
              requestIdleCallback(run, { timeout: 1000 });
            } else {
              setTimeout(run, 200);
            }
            obs.disconnect();
          }
        });
      }, { rootMargin: '200px' });
      obs.observe(el);
    } else {
      setTimeout(() => setVisible(true), 300);
    }
    return () => obs?.disconnect();
  }, [isDesktop, reduced]);

  const showSpline = useMemo(() => isDesktop && !reduced && visible, [isDesktop, reduced, visible]);

  return (
    <section id="hero" className="relative h-[44vh] w-full overflow-hidden sm:h-[56vh] lg:h-[68vh]">
      {/* Lightweight decorative background for all devices */}
      <div className="absolute inset-0">
        <div className="absolute -inset-32 bg-[radial-gradient(45%_60%_at_20%_20%,rgba(16,185,129,0.20),transparent_60%),radial-gradient(35%_55%_at_80%_10%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(40%_60%_at_40%_90%,rgba(56,189,248,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/40 to-neutral-950" />
      </div>

      {/* Spline only on desktop and not reduced motion, loaded lazily */}
      {showSpline && (
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <LazySpline scene="https://prod.spline.design/Gt5HUob8aGDxOUep/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          </Suspense>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/10 via-neutral-950/40 to-neutral-950" />
        </div>
      )}

      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-12 sm:pb-16 lg:pb-20">
        <div className="w-full">
          <h1 className="text-pretty font-semibold tracking-tight text-white drop-shadow [text-shadow:0_2px_24px_rgba(16,185,129,0.18)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            Track habits with precision and style
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-300 text-sm sm:text-base md:text-lg">
            A sleek, modern habit tracker with a smooth, responsive experience across devices.
          </p>
        </div>
      </div>
    </section>
  );
}
