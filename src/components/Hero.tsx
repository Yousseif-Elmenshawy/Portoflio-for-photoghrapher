import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown, Aperture, MapPin, Camera } from 'lucide-react';
import { Settings } from '../types';
import portraitFallback from '../assets/images/photographer_portrait_1794151404427.jpg';

interface HeroProps {
  settings: Settings | null;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Stagger Reveal for texts & titles: gsap.from with y: 40, opacity: 0, duration: 1.2, ease: "power4.out"
      gsap.from('.hero-stagger-item', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.12,
        delay: 0.2,
      });

      // 2. Image Clip-Path Reveal animation expanding smoothly from center on load
      if (imageContainerRef.current) {
        gsap.fromTo(
          imageContainerRef.current,
          {
            clipPath: 'polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)',
            opacity: 0,
            scale: 1.08,
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            opacity: 1,
            scale: 1,
            duration: 1.6,
            ease: 'power3.inOut',
            delay: 0.35,
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const photographerName = settings?.photographer_name || 'Elena Rostova';
  const photographerBio = settings?.bio || 'Cinematic & fine-art photographer exploring silence, brutalist shadows, and raw human vulnerability across European and Nordic landscapes.';
  const portraitImage = settings?.profile_image || portraitFallback;
  const location = settings?.location || 'Berlin & Reykjavik';

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] pt-28 pb-16 flex flex-col justify-between overflow-hidden border-b border-neutral-200 dark:border-white/10 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-center">
        {/* Split Screen 2-Column Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center my-auto">
          
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Editorial Kicker */}
            <div className="hero-stagger-item flex flex-wrap items-center gap-3 text-xs tracking-[0.25em] uppercase text-neutral-500 dark:text-neutral-400 font-medium mb-6">
              <span className="w-8 h-[1px] bg-amber-500" />
              <span>Fine Art &amp; Cinematic Direction</span>
              <span className="text-neutral-400 dark:text-neutral-600">·</span>
              <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                <MapPin size={11} className="text-amber-500" /> {location}
              </span>
            </div>

            {/* Oversized Headline with balance */}
            <h1
              ref={titleRef}
              className="hero-stagger-item text-4xl sm:text-6xl xl:text-7xl font-serif-luxury font-normal tracking-tight text-neutral-900 dark:text-white leading-[1.08] mb-8"
              style={{ textWrap: 'balance' }}
            >
              The Architecture <br />
              <span className="italic font-light text-neutral-500 dark:text-neutral-400">of Raw Silence</span> &amp; Shadow.
            </h1>

            {/* Photographer Bio */}
            <p className="hero-stagger-item text-neutral-700 dark:text-neutral-300 text-base sm:text-lg leading-relaxed max-w-xl mb-10 font-light">
              {photographerBio}
            </p>

            {/* CTAs and Artist Credit */}
            <div className="hero-stagger-item flex flex-wrap items-center gap-4 sm:gap-5">
              <a
                href="#portfolio"
                className="w-full sm:w-auto text-center px-6 py-3.5 bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
              >
                Explore Archive
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto text-center px-6 py-3.5 border border-neutral-300 dark:border-white/20 text-neutral-800 dark:text-neutral-200 text-xs font-semibold uppercase tracking-widest hover:border-neutral-900 dark:hover:border-white transition-colors"
              >
                Inquire for Print / Assignment
              </a>
            </div>

            {/* Signature & Role */}
            <div className="hero-stagger-item mt-10 sm:mt-12 pt-6 border-t border-neutral-200 dark:border-white/10 flex flex-wrap items-center gap-4">
              <div className="text-sm font-serif-luxury text-neutral-700 dark:text-neutral-300">
                Studio of <span className="font-semibold text-neutral-900 dark:text-white">{photographerName}</span>
              </div>
              <span className="text-neutral-300 dark:text-neutral-600">/</span>
              <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-sans flex items-center gap-1.5">
                <Camera size={13} className="text-amber-500" /> Medium Format &amp; 35mm
              </div>
            </div>
          </div>

          {/* Right Column: Hero Portrait with Soft Mask Reveal */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end w-full">
            <div
              ref={imageContainerRef}
              className="relative w-full max-w-sm sm:max-w-md aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 overflow-hidden shadow-2xl border border-neutral-200 dark:border-white/10"
              data-cursor="explore"
            >
              <img
                src={portraitImage}
                alt={photographerName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale contrast-[1.1] hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs flex justify-between items-end">
                <div>
                  <div className="text-[10px] tracking-widest uppercase text-neutral-300">Subject</div>
                  <div className="font-serif-luxury text-base">{photographerName}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] tracking-widest uppercase text-neutral-300">Format</div>
                  <div className="font-mono text-[11px] text-amber-400">Leica M Monochrom</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Full-width Metrics Row Below Split (Rule 2.B) */}
      <div className="max-w-7xl mx-auto px-6 w-full mt-12 pt-8 border-t border-neutral-200 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        <div>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-normal text-neutral-900 dark:text-white tabular-nums">
            14<span className="text-amber-500 font-light">+</span>
          </div>
          <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-1">Years Field Practice</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-normal text-neutral-900 dark:text-white tabular-nums">
            48
          </div>
          <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-1">Exhibitions Worldwide</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-normal text-neutral-900 dark:text-white tabular-nums">
            100%
          </div>
          <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-1">Archival Pigment Prints</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-normal text-neutral-900 dark:text-white tabular-nums">
            03
          </div>
          <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-1">Monograph Publications</div>
        </div>
      </div>
    </section>
  );
};
