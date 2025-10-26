import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-[72vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/Gt5HUob8aGDxOUep/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/20 via-neutral-950/40 to-neutral-950" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-20">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-balance font-semibold tracking-tight text-white drop-shadow [text-shadow:0_2px_24px_rgba(16,185,129,0.2)] md:text-6xl text-4xl"
          >
            Track habits with precision and style
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="mt-4 max-w-2xl text-neutral-300 md:text-lg"
          >
            A sleek, modern habit tracker with dynamic 3D ambience. Build consistency, visualize progress, and stay motivated.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
