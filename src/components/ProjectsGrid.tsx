import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project } from '../types';
import { Eye, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProjectsGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Extract categories dynamically
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Smooth Parallax Effect on project card images with scrub: true
      const parallaxImages = document.querySelectorAll('.project-parallax-img');
      parallaxImages.forEach((img) => {
        gsap.fromTo(
          img,
          { y: -25, scale: 1.12 },
          {
            y: 25,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.project-card-wrapper'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });

      // 2. Text Split Reveal on titles and categories during scroll
      const textItems = document.querySelectorAll('.scroll-reveal-text');
      textItems.forEach((item) => {
        gsap.fromTo(
          item,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, gridContainerRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <section
      id="portfolio"
      ref={gridContainerRef}
      className="py-24 px-6 max-w-7xl mx-auto border-b border-neutral-200 dark:border-white/10 transition-colors duration-300"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400 font-medium mb-3">
            02. Archival Portfolio
          </div>
          <h2 className="text-3xl md:text-5xl font-serif-luxury font-normal text-neutral-900 dark:text-white">
            Selected Works &amp; Monographs
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 dark:border-white/10 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'text-neutral-900 dark:text-white font-semibold border-b-2 border-amber-500'
                  : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bento / Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {filteredProjects.map((project, index) => {
          const isLarge = index % 3 === 0;
          const colSpan = isLarge ? 'md:col-span-8' : 'md:col-span-4';
          const heightClass = isLarge ? 'h-[440px] md:h-[520px]' : 'h-[360px] md:h-[520px]';

          return (
            <div
              key={project.id}
              className={`${colSpan} project-card-wrapper group cursor-pointer`}
              data-cursor="view"
              onClick={() => onSelectProject(project)}
            >
              {/* Image Frame with Overflow Hidden for Parallax */}
              <div
                className={`relative w-full ${heightClass} overflow-hidden bg-neutral-200 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all duration-500 group-hover:border-neutral-400 dark:group-hover:border-white/30`}
              >
                <img
                  src={project.main_image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="project-parallax-img w-full h-[120%] object-cover grayscale contrast-[1.15] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out will-change-transform"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-85 group-hover:opacity-70 transition-opacity" />

                {/* Hover Quick Action Indicator */}
                <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight size={15} />
                </div>

                {/* Overlay Metadata */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="scroll-reveal-text flex items-center gap-2 text-[11px] uppercase tracking-widest text-neutral-300 mb-2">
                    <span className="text-amber-400 font-mono">0{index + 1}</span>
                    <span>·</span>
                    <span>{project.category}</span>
                    {project.exif_iso && (
                      <>
                        <span>·</span>
                        <span className="font-mono text-neutral-300">{project.exif_iso}</span>
                      </>
                    )}
                  </div>

                  <h3 className="scroll-reveal-text text-2xl md:text-3xl font-serif-luxury font-normal text-white group-hover:text-amber-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs text-neutral-200 line-clamp-2 max-w-md mt-2 font-light opacity-90">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Bottom Card Caption */}
              <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-mono text-[11px]">
                  {project.exif_camera || 'Leica M11'} — {project.exif_lens || '35mm Summilux'}
                </span>
                <span className="group-hover:text-black dark:group-hover:text-white transition-colors flex items-center gap-1 font-medium">
                  View Study <Eye size={11} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
