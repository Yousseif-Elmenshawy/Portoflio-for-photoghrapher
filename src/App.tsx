import React, { useState, useEffect, useCallback } from 'react';
import { Project, Settings, Exhibition } from './types';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HorizontalScrollGallery } from './components/HorizontalScrollGallery';
import { ProjectsGrid } from './components/ProjectsGrid';
import { ProjectLightbox } from './components/ProjectLightbox';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { getPortfolioData } from './mockApi';

export default function App() {
  // Theme state: dark / light mode with localStorage persistence
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('kroma_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Dark Cinematic Minimalist default
  });

  // Portfolio data is loaded from this browser's preview storage.
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('kroma_theme', theme);
  }, [theme]);

  // Check stored admin credentials
  useEffect(() => {
    const savedAdmin = localStorage.getItem('kroma_admin_user');
    setIsAdminLoggedIn(!!savedAdmin);
  }, [isAdminOpen]);

  // Load the local preview data saved in this browser.
  const loadInitialData = useCallback(() => {
    try {
      const data = getPortfolioData();
      setProjects(data.projects);
      setSettings(data.settings);
      setExhibitions(data.exhibitions);
      setDataError(null);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Could not load preview data from this browser.');
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Lightbox Next/Prev navigation
  const handleNextProject = () => {
    if (!selectedProject || projects.length === 0) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % projects.length;
    setSelectedProject(projects[nextIndex]);
  };

  const handlePrevProject = () => {
    if (!selectedProject || projects.length === 0) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id);
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    setSelectedProject(projects[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-[#f6f6f4] dark:bg-[#0D0D0D] text-neutral-900 dark:text-[#E5E5E5] transition-colors duration-300 relative selection:bg-amber-500 selection:text-black">
      {/* 1. Custom Magnetic Cursor (GSAP quickTo) */}
      <CustomCursor />

      {/* 2. Top Navigation Bar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        openAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        settings={settings}
      />

      {/* Main Content Area */}
      <main className="relative z-10">
        {dataError && (
          <div role="alert" className="fixed bottom-4 left-4 right-4 z-[100000] border border-rose-500/40 bg-[#171111] px-4 py-3 text-xs text-rose-200 shadow-xl sm:left-auto sm:max-w-xl">
            <div className="flex items-center justify-between gap-4">
              <span>{dataError}</span>
              <button type="button" onClick={() => void loadInitialData()} className="shrink-0 underline">
                Retry
              </button>
            </div>
          </div>
        )}
        {/* 3. Hero Section with GSAP Stagger Reveal & Image Clip-Path Reveal */}
        <Hero settings={settings} />

        {/* 4. Horizontal Scroll Section (Curated Monographs with ScrollTrigger Pin & Scrub) */}
        <HorizontalScrollGallery
          projects={projects}
          onSelectProject={(project) => setSelectedProject(project)}
        />

        {/* 5. Projects Archival Grid with ScrollTrigger Parallax & Text Split Reveal */}
        <ProjectsGrid
          projects={projects}
          onSelectProject={(project) => setSelectedProject(project)}
        />

        {/* 6. The Artist / About Section with Dynamic Exhibitions */}
        <AboutSection settings={settings} exhibitions={exhibitions} />

        {/* 7. Contact Section (Inquiries saved in this browser) */}
        <ContactSection
          settings={settings}
          onMessageSent={loadInitialData}
        />
      </main>

      {/* 8. Minimalist Footer with Creator Credit */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 9. Fullscreen Lightbox Modal */}
      <ProjectLightbox
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
      />

      {/* 10. CMS Admin Dashboard Overlay */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          projects={projects}
          settings={settings}
          exhibitions={exhibitions}
          onRefreshData={loadInitialData}
        />
      )}
    </div>
  );
}
