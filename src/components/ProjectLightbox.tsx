import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Aperture, Clock, Sliders, MapPin } from 'lucide-react';
import { Project } from '../types';

interface ProjectLightboxProps {
  project: Project | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const ProjectLightbox: React.FC<ProjectLightboxProps> = ({
  project,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, onNext, onPrev]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-300 select-none"
    >
      {/* Top Bar: Title & Close Button */}
      <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-mono">
            ARCHIVE // {project.category}
          </span>
          <span className="text-neutral-600">·</span>
          <h2 className="text-lg font-serif-luxury font-normal">{project.title}</h2>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full border border-white/20 text-neutral-300 hover:text-white hover:border-white transition-colors"
          title="Close (Esc)"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Image Viewport with Nav buttons */}
      <div className="relative flex-1 flex items-center justify-center my-6 overflow-hidden">
        {onPrev && (
          <button
            onClick={onPrev}
            className="absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white hover:text-black transition-all"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <img
          src={project.main_image}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="max-h-[70vh] max-w-full object-contain shadow-2xl transition-transform duration-500"
        />

        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white hover:text-black transition-all"
            title="Next (Right Arrow)"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* Bottom Technical EXIF Bar & Narrative */}
      <div className="border-t border-white/10 pt-4 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 text-white text-xs">
        {/* Narrative Description */}
        <div className="md:col-span-6 flex flex-col justify-center">
          <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
            Curatorial Statement
          </div>
          <p className="text-neutral-300 leading-relaxed font-light">
            {project.description || 'Captured on location with natural light. Archival fine-art exhibition print available in limited numbered edition of 12.'}
          </p>
        </div>

        {/* Technical EXIF Specifications */}
        <div className="md:col-span-6 flex flex-wrap items-center justify-start md:justify-end gap-6 text-neutral-300 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <Camera size={14} className="text-amber-500" />
            <span>{project.exif_camera || 'Leica M11 Monochrom'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Aperture size={14} className="text-amber-500" />
            <span>{project.exif_lens || 'Summilux-M 35mm f/1.4'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Sliders size={14} className="text-amber-500" />
            <span>{project.exif_aperture || 'f/2.8'}</span>
            <span>·</span>
            <span>{project.exif_iso || 'ISO 400'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={14} className="text-amber-500" />
            <span>{project.exif_shutter || '1/500s'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
