'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  Html,
  useProgress,
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface Props {
  modelUrl: string;
  modelFormat?: string;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-48 h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{Math.round(progress)}%</span>
      </div>
    </Html>
  );
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  // Center and normalize the model regardless of source dimensions
  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2 / maxDim;

  scene.position.sub(center.multiplyScalar(scale));

  return <primitive object={scene} scale={scale} />;
}

export function Product3DViewer({ modelUrl }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="relative">
      <div
        className={`rounded-2xl overflow-hidden bg-gradient-to-b from-muted/50 to-background border border-border transition-all duration-300 ${
          isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : 'h-[500px]'
        }`}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          dpr={[1, 2]}
        >
          <Suspense fallback={<Loader />}>
            <Model url={modelUrl} />
            <Environment preset="city" />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={8} blur={2} />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={0.5}
          />

          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        </Canvas>

        {/* Controls overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">Drag to rotate · Scroll to zoom</p>
          <button
            onClick={() => setIsFullscreen((v) => !v)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border bg-background/80 backdrop-blur-sm"
          >
            {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsFullscreen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
