import React from 'react';
import { Settings } from '../types';
import { Lock, ArrowUp, Heart } from 'lucide-react';

interface FooterProps {
  settings: Settings | null;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  const photographerName = settings?.photographer_name || 'Elena Rostova';
  const socialLinks = settings?.social_links || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-200 dark:border-white/10 py-12 px-6 bg-neutral-100 dark:bg-[#080808] transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand, Copyright & Creator Credit */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-xs text-neutral-600 dark:text-neutral-400 text-center sm:text-left">
          <span className="hidden sm:inline text-neutral-400 dark:text-neutral-600">·</span>
          <span>© {new Date().getFullYear()} {photographerName}. All rights reserved.</span>
          <span className="hidden sm:inline text-neutral-400 dark:text-neutral-600">·</span>
          
          {/* Creator Credit requested by user */}
          <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center gap-1.5">
            Created by <span className="font-semibold text-amber-600 dark:text-amber-400">Youssef Elshenawy</span>
          </span>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-6 text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
          <a
            href={socialLinks.instagram || 'https://instagram.com'}
            target="_blank"
            rel="noreferrer"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a
            href={socialLinks.vimeo || 'https://vimeo.com'}
            target="_blank"
            rel="noreferrer"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Vimeo
          </a>
          <a
            href={socialLinks.behance || 'https://behance.net'}
            target="_blank"
            rel="noreferrer"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Behance
          </a>
        </div>

        {/* Actions: Admin Portal & Back To Top */}
        <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
          >
            <Lock size={12} />
            <span>Admin Portal</span>
          </button>
          <span className="text-neutral-400 dark:text-neutral-600">·</span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp size={12} />
          </button>
        </div>

      </div>
    </footer>
  );
};
