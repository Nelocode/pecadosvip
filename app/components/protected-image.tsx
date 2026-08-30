'use client';

import React from 'react';

export type ProtectedImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

/**
 * Image Component with built-in anti-scraping & anti-download protection:
 * - Disables context menu (right-click)
 * - Disables image drag start
 * - Overlays transparent canvas buffer to prevent direct save-as
 */
export function ProtectedImage({ src, alt, className = '', width, height }: ProtectedImageProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={`relative inline-block overflow-hidden select-none ${className}`}
      onContextMenu={handleContextMenu}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onDragStart={handleDragStart}
        className="pointer-events-none w-full h-full object-cover select-none"
        loading="lazy"
      />
      {/* Transparent overlay canvas to block mouse right click and drag */}
      <div
        aria-hidden="true"
        aria-label={alt}
        className="absolute inset-0 z-10 bg-transparent select-none"
        onContextMenu={handleContextMenu}
      />
    </div>
  );
}
