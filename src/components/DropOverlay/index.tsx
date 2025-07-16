import React from 'react';

interface DropOverlayProps {
  children?: React.ReactNode;
}

export const DropOverlay: React.FC<DropOverlayProps> = ({ children }) => (
  <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/30 text-3xl text-white select-none">
    {children || 'ファイルをここにドロップ'}
  </div>
);
