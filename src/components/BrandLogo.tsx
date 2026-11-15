import React from 'react';

interface BrandLogoProps {
  compact?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#0E161C]">
        <svg
          viewBox="0 0 36 36"
          className="h-7 w-7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle
            cx="18"
            cy="18"
            r="9.5"
            stroke="#F2EDE4"
            strokeWidth="1.4"
            opacity="0.9"
          />
          <ellipse
            cx="18"
            cy="18"
            rx="15"
            ry="5.5"
            transform="rotate(-24 18 18)"
            stroke="#E5A94C"
            strokeWidth="1.5"
          />
          <circle cx="29" cy="13" r="1.8" fill="#E5A94C" />
        </svg>
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="text-[15px] font-semibold tracking-[0.14em] text-[#F2EDE4]">
            ANTHARIKSH
          </div>
          <div className="mt-1 text-[9px] font-medium tracking-[0.2em] text-[#8E9BA6]">
            EARTH INTELLIGENCE
          </div>
        </div>
      )}
    </div>
  );
};
