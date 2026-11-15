import React from 'react';
import { BrandLogo } from '../components/BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-[#070B0E] px-6 py-4 no-print">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <BrandLogo compact />
          <span className="text-xs font-semibold tracking-[0.14em] text-[#F2EDE4]">
            ANTHARIKSH
          </span>
        </div>

        <p className="text-xs text-[#8E9BA6] text-center">
          Exploring Earth. Understanding Change.
        </p>

        <div className="text-xs text-[#6C7883] whitespace-nowrap">
          Earth Observation &amp; SAR Intelligence
        </div>
      </div>
    </footer>
  );
};
