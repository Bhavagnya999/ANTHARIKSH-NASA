import React, { useCallback, useRef, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  beforeFilter?: string;
  afterFilter?: string;
  initialPosition?: number;
  aspectClass?: string;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  beforeFilter,
  afterFilter,
  initialPosition = 50,
  aspectClass = 'aspect-[16/10]',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(96, Math.max(4, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={(e) => {
        setDragging(true);
        updateFromClientX(e.clientX);
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (dragging) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      role="slider"
      aria-label="Satellite imagery before and after comparison slider"
      aria-valuemin={4}
      aria-valuemax={96}
      aria-valuenow={Math.round(position)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setPosition((p) => Math.max(4, p - 4));
        if (e.key === 'ArrowRight') setPosition((p) => Math.min(96, p + 4));
      }}
      className={`relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0A1015] select-none cursor-ew-resize ${aspectClass}`}
    >
      {/* After Image (Full layer underneath) */}
      <img
        src={afterImage}
        alt={`Satellite view: ${afterLabel}`}
        referrerPolicy="no-referrer"
        style={afterFilter ? { filter: afterFilter } : undefined}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Before Image (Clipped on left) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={`Satellite view: ${beforeLabel}`}
          referrerPolicy="no-referrer"
          style={beforeFilter ? { filter: beforeFilter } : undefined}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* Divider Line & Circular Handle */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-[#E8DCC4]/90 shadow-[0_0_14px_rgba(0,0,0,0.9)]"
        style={{ left: `${position}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5A94C]/50 bg-[#0D151B]/95 text-[#F2EDE4] shadow-lg">
          <ArrowLeftRight className="h-4 w-4 text-[#E5A94C]" />
        </div>
      </div>

      {/* Date Labels */}
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-white/15 bg-[#090F14]/85 px-2.5 py-1 text-xs font-mono-tabular text-[#F2EDE4] backdrop-blur-xs">
        {beforeLabel}
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-md border border-white/15 bg-[#090F14]/85 px-2.5 py-1 text-xs font-mono-tabular text-[#E5A94C] backdrop-blur-xs">
        {afterLabel}
      </div>
    </div>
  );
};
