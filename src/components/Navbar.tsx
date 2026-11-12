import React, { useState } from 'react';
import { Sun, Moon, Lock, ArrowUpRight, Menu, X } from 'lucide-react';
import { Settings } from '../types';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  openAdmin: () => void;
  isAdminLoggedIn: boolean;
  settings: Settings | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  openAdmin,
  isAdminLoggedIn,
  settings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const photographerName = settings?.photographer_name || 'Elena Rostova';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f6f6f4]/90 dark:bg-[#0D0D0D]/90 backdrop-blur-md border-b border-neutral-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="text-xl md:text-2xl font-serif-luxury tracking-[0.2em] uppercase font-semibold text-neutral-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
        >
          {photographerName}
        </a>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em] font-medium text-neutral-600 dark:text-neutral-400">
          <a
            href="#portfolio"
            className="hover:text-black dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Archive
          </a>
          <a
            href="#monographs"
            className="hover:text-black dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Monographs
          </a>
          <a
            href="#about"
            className="hover:text-black dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            The Artist
          </a>
          <a
            href="#contact"
            className="hover:text-black dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Inquiries
          </a>
        </nav>

        {/* Zone 3: Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme Mode"
            className="p-2.5 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={18} strokeWidth={2} className="text-amber-400" />
            ) : (
              <Moon size={18} strokeWidth={2} className="text-neutral-700" />
            )}
          </button>

          {/* Admin CMS Access Button */}
          <button
            type="button"
            onClick={openAdmin}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-white/15 hover:border-black dark:hover:border-white/40 rounded transition-colors whitespace-nowrap shrink-0"
          >
            <Lock size={12} strokeWidth={2} />
            <span>{isAdminLoggedIn ? 'CMS Portal' : 'Admin'}</span>
          </button>

          {/* Book Commission CTA Button */}
          <a
            href="#contact"
            className="hidden sm:flex items-center gap-1 px-4 py-2 text-xs font-semibold tracking-wider uppercase bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded transition-colors whitespace-nowrap shrink-0"
          >
            <span>Commission</span>
            <ArrowUpRight size={13} strokeWidth={2.2} />
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white rounded transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-white/10 bg-[#f6f6f4] dark:bg-[#0D0D0D] px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-xs uppercase tracking-[0.2em] font-medium text-neutral-700 dark:text-neutral-300">
            <a
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black dark:hover:text-white"
            >
              Archive
            </a>
            <a
              href="#monographs"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black dark:hover:text-white"
            >
              Monographs
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black dark:hover:text-white"
            >
              The Artist
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black dark:hover:text-white"
            >
              Inquiries
            </a>
          </nav>

          <div className="pt-4 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAdmin();
              }}
              className="flex items-center gap-1.5 text-xs uppercase font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
            >
              <Lock size={12} />
              <span>Admin Dashboard</span>
            </button>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 text-xs font-semibold uppercase bg-neutral-900 text-white dark:bg-white dark:text-black rounded"
            >
              Inquire
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
