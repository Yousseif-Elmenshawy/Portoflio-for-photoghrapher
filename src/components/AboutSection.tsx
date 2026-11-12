import React from 'react';
import { Award, BookOpen } from 'lucide-react';
import { Settings, Exhibition } from '../types';

interface AboutSectionProps {
  settings: Settings | null;
  exhibitions: Exhibition[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, exhibitions }) => {
  const photographerName = settings?.photographer_name || 'Elena Rostova';
  const bio = settings?.bio || 'Cinematic & fine-art photographer exploring silence, brutalist shadows, and raw human vulnerability.';
  const location = settings?.location || 'Berlin & Reykjavik';

  return (
    <section
      id="about"
      className="py-24 px-6 max-w-7xl mx-auto border-b border-neutral-200 dark:border-white/10 transition-colors duration-300"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Heading and Artistic Manifesto */}
        <div className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400 font-medium mb-3">
            03. The Vision
          </div>
          <h2 className="text-3xl md:text-5xl font-serif-luxury font-normal text-neutral-900 dark:text-white leading-tight mb-8">
            An Obsession with <br />
            <span className="italic font-light text-neutral-500 dark:text-neutral-400">Atmospheric Density</span>
          </h2>

          <div className="space-y-5 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
            <p>{bio}</p>
            <p>
              Working exclusively with monochrome digital sensors and large-format analogue film, the work interrogates the quiet tension between monumental structures and fleeting natural elements. Each print is treated as an architectural object with tactile grain and deep tonal density.
            </p>
          </div>

          {/* Clean metadata list */}
          <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-white/10 flex flex-col gap-3 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="text-neutral-900 dark:text-white font-medium w-28">Current Base:</span>
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-900 dark:text-white font-medium w-28">Primary Gear:</span>
              <span>Leica M11 Monochrom · Hasselblad X2D 100C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-900 dark:text-white font-medium w-28">Representation:</span>
              <span>Nordic Fine Art Agency (Reykjavik)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Exhibitions & Recognitions */}
        <div className="lg:col-span-7 space-y-10">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-500 mb-6 flex items-center gap-2">
              <Award size={16} /> Selected Solo Exhibitions &amp; Honors
            </h3>

            {exhibitions && exhibitions.length > 0 ? (
              <div className="divide-y divide-neutral-200 dark:divide-white/10 text-xs sm:text-sm">
                {exhibitions.map((exh) => (
                  <div key={exh.id} className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-white text-base font-serif-luxury">
                        {exh.title}
                      </span>
                      <div className="text-neutral-600 dark:text-neutral-400 font-light mt-0.5">
                        {exh.location} {exh.description ? `— ${exh.description}` : ''}
                      </div>
                    </div>
                    <span className="font-mono text-amber-600 dark:text-amber-400 shrink-0 font-medium">{exh.year}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 border border-neutral-200 dark:border-white/10 text-xs text-neutral-500">
                No exhibitions cataloged yet. Add honors and shows via the Admin Dashboard.
              </div>
            )}
          </div>

          {/* Curated Monographs */}
          <div className="pt-6 border-t border-neutral-200 dark:border-white/10">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-500 mb-6 flex items-center gap-2">
              <BookOpen size={16} /> Curated Publications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 rounded-sm">
                <div className="text-sm font-serif-luxury text-neutral-900 dark:text-white font-semibold mb-1">
                  "Silence in Concrete" (2024)
                </div>
                <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                  Published by Hatje Cantz. 180 duotone plates documenting mid-century brutalism across Europe.
                </div>
              </div>

              <div className="p-4 bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 rounded-sm">
                <div className="text-sm font-serif-luxury text-neutral-900 dark:text-white font-semibold mb-1">
                  "The Edge of the Atlantic" (2022)
                </div>
                <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                  Self-published monograph, limited edition of 500 numbered hand-bound cloth copies.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
