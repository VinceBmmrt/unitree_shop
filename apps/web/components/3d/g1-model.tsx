'use client';

interface G1ModelViewerProps {
  className?: string;
}

export function G1ModelViewer({ className = '' }: G1ModelViewerProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#07071a] ${className}`}>
      <iframe
        title="Unitree G1 — Modèle 3D interactif"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        src="https://sketchfab.com/models/02c74f40e20544ef8466acfed1aee240/embed?autostart=1&ui_infos=0&ui_stop=0&ui_help=0&ui_settings=0&ui_vr=0&ui_annotations=0&ui_watermark=0&dnt=1"
        style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
      />

      {/* Cover Sketchfab attribution bar at the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-9 bg-[#07071a] pointer-events-none"
        aria-hidden
      />

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
        <span className="bg-black/50 backdrop-blur-sm text-white/60 text-xs px-3 py-1.5 rounded-full whitespace-nowrap">
          Glisser pour pivoter · Scroll pour zoomer
        </span>
      </div>
    </div>
  );
}
