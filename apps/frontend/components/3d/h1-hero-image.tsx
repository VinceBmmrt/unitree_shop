'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export function H1HeroImage() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className="absolute w-96 h-96 rounded-full border border-blue-500/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-72 h-72 rounded-full border border-blue-400/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      />

      {/* Glow blob */}
      <div className="absolute w-80 h-80 rounded-full bg-blue-600/10 blur-[80px]" />

      {/* Floating robot image */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10"
      >
        <Image
          src="https://www.unitree.com/images/fdff7695f62b42b89b2459a3a4405118_400x400.png"
          alt="Unitree H1 — Robot humanoïde industriel"
          width={420}
          height={420}
          className="object-contain drop-shadow-2xl"
          priority
        />
      </motion.div>

      {/* Subtle scan-line sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(59,130,246,0.04) 50%, transparent 100%)',
        }}
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
      />
    </div>
  );
}
