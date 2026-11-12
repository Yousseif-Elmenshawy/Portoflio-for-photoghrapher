import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Eye } from 'lucide-react';
import { Project } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollGalleryProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const HorizontalScrollGallery: React.FC<HorizontalScrollGalleryProps> = ({
  projects,
  onSelectProject,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = gsap.matchMedia();

    const addHorizontalScroll = (isDesktop: boolean) => () => {
      const pinContainer = sectionRef.current;
      const scrollTriggerElem = triggerRef.current;
      if (!pinContainer || !scrollTriggerElem) return;

      const totalScrollWidth = () =>
        Math.max(0, pinContainer.scrollWidth - window.innerWidth + (isDesktop ? 120 : 0));
      if (totalScrollWidth() === 0) return;

      gsap.to(pinContainer, {
        x: () => -totalScrollWidth(),
        ease: 'none',
        scrollTrigger: {
          trigger: isDesktop ? scrollTriggerElem : pinContainer,
          start: 'top top',
          end: () => `+=${totalScrollWidth()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    };

    media.add('(min-width: 1024px)', addHorizontalScroll(true));
    media.add('(max-width: 1023px)', addHorizontalScroll(false));

    return () => media.revert();
  }, [projects]);

  const featuredProjects = projects;

  return (
    <section
      id="monographs"
      ref={triggerRef}
      className="relative overflow-hidden bg-neutral-100 dark:bg-[#0A0A0A] border-b border-neutral-200 dark:border-white/10 py-16 lg:py-0 transition-colors duration-300"
    >
      {/* Mobile & Tablet Section Title */}
      <div className="max-w-7xl mx-auto px-6 mb-8 lg:hidden">
        <div className="text-xs uppercase tracking-[0.25em] text-amber-500 font-medium">Featured Series</div>
        <h2 className="text-3xl font-serif-luxury text-neutral-900 dark:text-white mt-1">Monographs &amp; Studies</h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
          Curated collection of architectural minimalism and solitary landscapes. Scroll down to move sideways through the studies.
        </p>
      </div>

      <div
        ref={sectionRef}
        role="region"
        aria-label="Monographs and studies"
        tabIndex={0}
        className="flex flex-row items-stretch lg:items-center gap-6 lg:gap-12 px-6 lg:px-16 lg:h-screen w-max"
      >
        {/* Intro Slide on Desktop */}
        <div className="hidden lg:flex flex-col justify-center w-[360px] shrink-0 pr-8">
          <div className="text-xs uppercase tracking-[0.25em] text-amber-500 font-medium mb-3">
            01. Curated Monographs
          </div>
          <h2 className="text-4xl lg:text-5xl font-serif-luxury text-neutral-900 dark:text-white leading-tight mb-4">
            Horizontal <br />
            <span className="italic font-light text-neutral-500 dark:text-neutral-400">Chronology</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6">
            A continuous spatial journey through brutalist concrete structures, midnight rainscapes, and volcanic shores. Scroll vertically to explore the horizontal reel.
          </p>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            <span>Scroll Down to Pan</span>
            <ArrowRight size={14} className="text-amber-500 animate-pulse" />
          </div>
        </div>

        {/* Featured Projects Cards */}
        {featuredProjects.map((project, idx) => (
          <div
            key={project.id}
            data-cursor="view"
            onClick={() => onSelectProject(project)}
            className="group relative w-[82vw] max-w-[610px] lg:w-[680px] xl:w-[740px] h-[360px] sm:h-[460px] lg:h-[72vh] shrink-0 bg-neutral-200 dark:bg-neutral-900 overflow-hidden cursor-pointer border border-neutral-300 dark:border-white/10 transition-all duration-500 hover:border-neutral-500 dark:hover:border-white/30"
          >
            {/* Image with subtle hover zoom */}
            <img
              src={project.main_image}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale contrast-[1.15] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            />
            
            {/* Cinematic Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

            {/* Slide Top Badge */}
            <div className="absolute top-5 left-5 right-5 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between text-xs text-white/90 pointer-events-none">
              <span className="font-mono text-[11px] text-amber-400">0{idx + 1} // MONOGRAPH</span>
              <span className="text-[11px] uppercase tracking-widest text-neutral-300">
                {project.category}
              </span>
            </div>

            {/* Slide Bottom Metadata */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 text-white flex flex-col justify-end">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif-luxury font-normal tracking-wide mb-2 group-hover:text-amber-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-xs text-neutral-300 line-clamp-2 max-w-lg mb-4 font-light">
                {project.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/20 text-[11px] text-neutral-300">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span>{project.exif_camera || 'Leica M11'}</span>
                  <span>·</span>
                  <span>{project.exif_lens || '35mm Summilux'}</span>
                </div>
                <div className="flex items-center gap-1 text-white font-medium group-hover:translate-x-1 transition-transform">
                  <span>Inspect Print</span>
                  <Eye size={12} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
