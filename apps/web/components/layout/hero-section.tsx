'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

// ── GLSL ──────────────────────────────────────────────────────────────────────
const VERT = `
  attribute float aSize;
  attribute float aBrightness;
  uniform float uDpr;
  varying float vBrightness;
  void main() {
    vBrightness = aBrightness;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uDpr * (95.0 / -mv.z);
  }
`;
const FRAG = `
  varying float vBrightness;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = pow(max(0.0, 1.0 - d * 2.0), 1.4);
    float glow = pow(max(0.0, 1.0 - d * 1.4), 0.6) * 0.35;
    float a = (core + glow) * vBrightness;
    vec3 col = mix(vec3(0.35, 0.62, 1.0), vec3(1.0, 1.0, 1.0), pow(1.0 - d * 2.0, 2.0));
    gl_FragColor = vec4(col, a);
  }
`;

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const N           = 4500;   // particle count
const WW          = 210;    // world width
const WH          = 118;    // world height
const MOUSE_R     = 22;     // repulsion radius (world units)
const MOUSE_F     = 0.22;   // repulsion force
const CLICK_R     = 35;     // click-burst radius
const CLICK_F     = 0.55;   // click-burst force
const DAMPING     = 0.955;
const MAX_SPEED   = 1.1;
const RISE_BASE   = 0.012;  // base upward velocity

export function HeroSection() {
  const mountRef  = useRef<HTMLDivElement>(null);
  const mouseRef  = useRef({ x: 0, y: 0, worldX: 0, worldY: 0 });
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let disposed = false;
    let rafId    = -1;

    (async () => {
      const THREE = await import('three');
      if (disposed) return;
      // @ts-ignore
      const { EffectComposer }  = await import('three/examples/jsm/postprocessing/EffectComposer.js');
      if (disposed) return;
      // @ts-ignore
      const { RenderPass }      = await import('three/examples/jsm/postprocessing/RenderPass.js');
      if (disposed) return;
      // @ts-ignore
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');
      if (disposed) return;

      // ── Renderer ──────────────────────────────────────────────────────────
      const cW  = container.clientWidth  || window.innerWidth;
      const cH  = container.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
      renderer.setPixelRatio(dpr);
      renderer.setSize(cW, cH);
      renderer.setClearColor(new THREE.Color('#04040a'), 1);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      Object.assign(renderer.domElement.style, {
        position: 'absolute', inset: '0', width: '100%', height: '100%',
      });
      container.appendChild(renderer.domElement);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(65, cW / cH, 0.1, 1000);
      camera.position.z = 80;

      // ── CPU Physics buffers ───────────────────────────────────────────────
      const px = new Float32Array(N);  // x pos
      const py = new Float32Array(N);  // y pos
      const pz = new Float32Array(N);  // z pos (static)
      const vx = new Float32Array(N);  // x vel
      const vy = new Float32Array(N);  // y vel
      const brightness = new Float32Array(N);
      const sizes      = new Float32Array(N);
      // per-particle turbulence personality
      const tPhase  = new Float32Array(N);
      const tFreqX  = new Float32Array(N);
      const tFreqY  = new Float32Array(N);

      for (let i = 0; i < N; i++) {
        px[i]      = (Math.random() - 0.5) * WW;
        py[i]      = (Math.random() - 0.5) * WH;
        pz[i]      = (Math.random() - 0.5) * 50;
        vx[i]      = (Math.random() - 0.5) * 0.06;
        vy[i]      = Math.random() * RISE_BASE * 2 + RISE_BASE;
        sizes[i]   = Math.random() * 2.0 + 0.8;
        brightness[i] = Math.random() * 0.35 + 0.55;
        tPhase[i]  = Math.random() * Math.PI * 2;
        tFreqX[i]  = Math.random() * 0.7 + 0.2;
        tFreqY[i]  = Math.random() * 0.5 + 0.15;
      }

      // GPU position buffer (updated each frame)
      const posArr = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        posArr[i * 3]     = px[i];
        posArr[i * 3 + 1] = py[i];
        posArr[i * 3 + 2] = pz[i];
      }

      const geo = new THREE.BufferGeometry();
      const posAttr = new THREE.BufferAttribute(posArr, 3);
      posAttr.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute('position',    posAttr);
      geo.setAttribute('aSize',       new THREE.BufferAttribute(sizes, 1));
      geo.setAttribute('aBrightness', new THREE.BufferAttribute(brightness, 1));

      const mat = new THREE.ShaderMaterial({
        uniforms: { uDpr: { value: dpr } },
        vertexShader:   VERT,
        fragmentShader: FRAG,
        transparent: true,
        blending:    THREE.AdditiveBlending,
        depthWrite:  false,
      });
      scene.add(new THREE.Points(geo, mat));

      // ── Post-processing ───────────────────────────────────────────────────
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(cW, cH), 1.55, 0.5, 0.03));

      // ── NDC → world converter (used for both mouse and click) ─────────────
      function ndcToWorld(ndcX: number, ndcY: number) {
        const aspect  = camera.aspect;
        const halfH   = Math.tan((65 / 2) * (Math.PI / 180)) * 80;
        return { wx: ndcX * halfH * aspect, wy: ndcY * halfH };
      }

      // ── Event listeners ───────────────────────────────────────────────────
      const onMouseMove = (e: MouseEvent) => {
        const r     = container.getBoundingClientRect();
        const ndcX  =  (e.clientX - r.left) / r.width  * 2 - 1;
        const ndcY  = -((e.clientY - r.top)  / r.height * 2 - 1);
        const { wx, wy } = ndcToWorld(ndcX, ndcY);
        mouseRef.current.worldX = wx;
        mouseRef.current.worldY = wy;
      };

      const onClick = (e: MouseEvent) => {
        const r    = container.getBoundingClientRect();
        const ndcX =  (e.clientX - r.left) / r.width  * 2 - 1;
        const ndcY = -((e.clientY - r.top)  / r.height * 2 - 1);
        const { wx, wy } = ndcToWorld(ndcX, ndcY);
        // explosive burst
        for (let i = 0; i < N; i++) {
          const dx   = px[i] - wx;
          const dy   = py[i] - wy;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
          if (dist < CLICK_R) {
            const f = (1 - dist / CLICK_R) * CLICK_F;
            vx[i] += (dx / dist) * f;
            vy[i] += (dy / dist) * f;
          }
        }
      };

      const onResize = () => {
        if (disposed) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
      };

      window.addEventListener('mousemove', onMouseMove);
      container.addEventListener('click', onClick);
      window.addEventListener('resize', onResize);

      // ── Tick ──────────────────────────────────────────────────────────────
      const HW = WW / 2;
      const HH = WH / 2;
      let t = 0;

      function tick() {
        if (disposed) return;
        rafId = requestAnimationFrame(tick);
        t += 0.016;

        const mx = mouseRef.current.worldX;
        const my = mouseRef.current.worldY;

        for (let i = 0; i < N; i++) {
          // 1. Per-particle sine turbulence (cheap noise substitute)
          vx[i] += Math.sin(tPhase[i] + t * tFreqX[i] * 0.35) * 0.007;
          vy[i] += Math.cos(tPhase[i] * 1.4 + t * tFreqY[i] * 0.25) * 0.004;

          // 2. Upward buoyancy (antigravity)
          vy[i] += 0.0006;

          // 3. Mouse repulsion
          const dx   = px[i] - mx;
          const dy   = py[i] - my;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          if (dist < MOUSE_R) {
            const f = (1 - dist / MOUSE_R) * MOUSE_F;
            vx[i] += (dx / dist) * f;
            vy[i] += (dy / dist) * f;
          }

          // 4. Damping + speed cap
          vx[i] *= DAMPING;
          vy[i] *= DAMPING;
          const spd = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i]);
          if (spd > MAX_SPEED) { const s = MAX_SPEED / spd; vx[i] *= s; vy[i] *= s; }

          // 5. Integrate
          px[i] += vx[i];
          py[i] += vy[i];

          // 6. Boundary — wrap X, respawn at bottom when escaping top
          if (px[i] >  HW) px[i] -= WW;
          if (px[i] < -HW) px[i] += WW;
          if (py[i] >  HH) {
            py[i]  = -HH + Math.random() * 8;
            px[i]  = (Math.random() - 0.5) * WW;
            vx[i]  = (Math.random() - 0.5) * 0.06;
            vy[i]  = Math.random() * RISE_BASE * 2 + RISE_BASE;
          }
          if (py[i] < -HH) py[i] = HH;

          // 7. Write to GPU buffer
          posArr[i * 3]     = px[i];
          posArr[i * 3 + 1] = py[i];
          // z is static, no need to write
        }

        posAttr.needsUpdate = true;

        // Slow camera breathe
        camera.position.x = Math.sin(t * 0.04) * 2.5;
        camera.position.y = Math.cos(t * 0.025) * 1.5;
        camera.lookAt(0, 0, 0);

        composer.render();
      }
      tick();

      cleanupRef.current = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        container.removeEventListener('click', onClick);
        cancelAnimationFrame(rafId);
        if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#04040a]">
      {/* WebGL mount — fills the whole section */}
      <div
        ref={mountRef}
        className="absolute inset-0 cursor-crosshair"
        aria-hidden
      />

      {/* Radial vignette so text stays readable */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_45%_at_28%_50%,transparent_40%,rgba(4,4,10,0.82)_85%)]" />
      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none bg-gradient-to-t from-[#04040a] to-transparent" />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs text-blue-300 font-medium tracking-wide">
              G1 &amp; H1 — Disponibles à la commande
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.04]">
            Robots{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
              humanoïdes
            </span>
            <br />
            pour l&apos;industrie.
          </h1>

          <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Systèmes autonomes de nouvelle génération pour la recherche,
            l&apos;industrie et l&apos;exploration. Livraison en France, support technique inclus.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/robots"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-[1.02]"
            >
              Voir le catalogue <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/12 text-zinc-300 font-semibold text-sm hover:bg-white/[0.06] hover:border-white/22 transition-all backdrop-blur-sm"
            >
              Demander un devis
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-14 flex gap-10 border-t border-white/8 pt-10"
          >
            {[
              { value: '500+',  label: 'Unités déployées' },
              { value: '30+',   label: 'Pays clients' },
              { value: '99.6%', label: 'Fiabilité opérationnelle' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.07 }}
              >
                <div className="text-2xl font-bold font-display text-white">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-700 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
