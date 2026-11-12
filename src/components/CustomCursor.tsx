import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Eye } from 'lucide-react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Check if device supports fine hover pointer (disable on touch devices)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use GSAP quickTo for zero-jank buttery smooth magnetic mouse tracking
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      xTo(e.clientX);
      yTo(e.clientY);

      // Check target element or closest parent for data-cursor attribute
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]');
      if (cursorTarget) {
        const type = cursorTarget.getAttribute('data-cursor');
        if (type === 'view') {
          setIsHovered(true);
          setCursorText('VIEW');
        } else if (type === 'explore') {
          setIsHovered(true);
          setCursorText('EXPLORE');
        } else {
          setIsHovered(true);
          setCursorText('');
        }
      } else {
        const isClickable = target.closest('button, a, input, textarea, select');
        if (isClickable) {
          setIsHovered(true);
          setCursorText('');
        } else {
          setIsHovered(false);
          setCursorText('');
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Don't render on mobile touch screens
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor-follower pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,background-color,border-color] duration-300 ease-out flex items-center justify-center ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${
        cursorText
          ? 'w-24 h-24 bg-white/90 text-black border border-white backdrop-blur-sm'
          : isHovered
          ? 'w-10 h-10 bg-white/20 border border-white/60 backdrop-blur-xs'
          : 'w-3 h-3 bg-white border border-transparent'
      }`}
      style={{
        zIndex: 99999,
        willChange: 'transform',
      }}
    >
      {cursorText && (
        <span className="text-[10px] font-semibold tracking-widest flex items-center gap-1 uppercase select-none">
          <Eye size={12} strokeWidth={2.5} />
          {cursorText}
        </span>
      )}
    </div>
  );
};
