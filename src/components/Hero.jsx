import { useEffect, useMemo, useState, Suspense } from 'react';

// Lightweight, responsive, and avoids loading heavy 3D on mobile or when reduced motion is requested.
export default function Hero() {
  const [SplineComp, setSplineComp] = useState(null);
  const [enabled3D, setEnabled3D] = useState(false);

  // Determine if we should render 3D: desktop and no reduced motion
  const canRender3D = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const isDesktop = window.innerWidth >= 1024;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return isDesktop && !reduceMotion;
  }, []);

  useEffect(() => {
    setEnabled3D(canRender3D);
  }, [canRender3D]);

  useEffect(() => {
    let mounted = true;
    if (enabled3D) {
      import('@splinetool/react-spline')
        .then((mod) => {
          if (mounted) setSplineComp(() => mod.default);
        })
        .catch(() => {
          if (mounted) setSplineComp(null);
        });
    }
    return () => {
      mounted = false;
    };
  }, [enabled3D]);

  return (
    <section className="relative h-[46vh] md:h-[64vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        {enabled3D && SplineComp ? (
          <Suspense fallback={<div className="h-full w-full bg-gradient-to-b from-neutral-900 via-neutral-950 to-black" />}>
            <SplineComp
              scene="https://prod.spline.design/Gt5HUob8aGDxOUep/scene.splinecode"
              style={{ width: '100%', height: '100%' }}
            />
          </Suspense>
        ) : (
          <div className="h-full w-full bg-[radial-gradient(60%_60%_at_50%_20%,rgba(16,185,129,0.25),transparent),linear-gradient(to_bottom,#0a0a0a,#0b0b0b_30%,#030303)]" />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/20 via-neutral-950/40 to-neutral-950" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-10 md:pb-16">
        <div>
          <h1 className="text-balance font-semibold tracking-tight text-white drop-shadow md:text-6xl text-3xl">
            Track habits with precision and style
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-300 md:text-lg text-sm">
            Build consistency, visualize progress, and stay motivated — now buttery-smooth on mobile.
          </p>
        </div>
      </div>
    </section>
  );
}
