import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Upload,
  Camera,
  Award,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Project, Settings, ContactMessage, AdminUser, Exhibition } from '../types';
import {
  deleteExhibition,
  deleteMessage,
  deleteProject,
  encodeUploadedImage,
  getMessages,
  loginDemoAdmin,
  saveExhibition,
  saveProject,
  saveSettings,
  setMessageRead,
} from '../mockApi';
import portraitFallback from '../assets/images/photographer_portrait_1794151404427.jpg';

interface AdminDashboardProps {
  onClose: () => void;
  projects: Project[];
  settings: Settings | null;
  exhibitions: Exhibition[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  projects,
  settings,
  exhibitions,
  onRefreshData,
}) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('kroma_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab: User-friendly, strictly non-technical
  const [activeTab, setActiveTab] = useState<'projects' | 'exhibitions' | 'settings' | 'messages'>('projects');

  // Messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Project Modal state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Architecture',
    main_image: '',
    description: '',
    featured: 0,
    exif_camera: 'Leica M11 Monochrom',
    exif_lens: 'Summilux-M 35mm f/1.4',
    exif_iso: 'ISO 400',
    exif_aperture: 'f/2.8',
    exif_shutter: '1/500s',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Exhibition Modal state
  const [isExhibitionModalOpen, setIsExhibitionModalOpen] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);
  const [exhibitionForm, setExhibitionForm] = useState({
    title: '',
    location: '',
    year: new Date().getFullYear().toString(),
    description: '',
  });

  // Settings Form state
  const [settingsForm, setSettingsForm] = useState({
    photographer_name: settings?.photographer_name || '',
    bio: settings?.bio || '',
    profile_image: settings?.profile_image || '',
    contact_email: settings?.contact_email || '',
    location: settings?.location || '',
    instagram: settings?.social_links?.instagram || '',
    vimeo: settings?.social_links?.vimeo || '',
    behance: settings?.social_links?.behance || '',
  });

  // Load locally saved inquiries on login.
  useEffect(() => {
    if (currentUser) {
      fetchMessages();
    }
  }, [currentUser]);

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        photographer_name: settings.photographer_name || '',
        bio: settings.bio || '',
        profile_image: settings.profile_image || '',
        contact_email: settings.contact_email || '',
        location: settings.location || '',
        instagram: settings.social_links?.instagram || '',
        vimeo: settings.social_links?.vimeo || '',
        behance: settings.social_links?.behance || '',
      });
    }
  }, [settings]);

  const fetchMessages = () => {
    try {
      setMessages(getMessages());
    } catch (error) {
      setActionFeedback(error instanceof Error ? error.message : 'Could not load saved inquiries.');
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const user = loginDemoAdmin(loginUsername, loginPassword);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('kroma_admin_user', JSON.stringify(user));
      } else {
        setLoginError('Sign-in failed. Please check your details and try again.');
      }
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Could not start the local preview session.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kroma_admin_user');
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isAvatar = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageData = await encodeUploadedImage(file);
      if (isAvatar) {
        setSettingsForm((prev) => ({ ...prev, profile_image: imageData }));
      } else {
        setProjectForm((prev) => ({ ...prev, main_image: imageData }));
      }
      setActionFeedback('Photo saved in this browser preview');
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (error) {
      setActionFeedback(error instanceof Error ? error.message : 'Could not process this image.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.main_image) {
      alert('Title and Image are required');
      return;
    }

    try {
      saveProject(projectForm, editingProject?.id);
      setIsProjectModalOpen(false);
      setEditingProject(null);
      onRefreshData();
      setActionFeedback(editingProject ? 'Project updated successfully' : 'New project added to portfolio');
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (error) {
      setActionFeedback(error instanceof Error ? error.message : 'Could not save this project.');
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      deleteProject(id);
      onRefreshData();
      setActionFeedback('Project deleted successfully');
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (error) {
      setActionFeedback(error instanceof Error ? error.message : 'Could not delete this project.');
    }
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setProjectForm({
      title: p.title,
      category: p.category,
      main_image: p.main_image,
      description: p.description || '',
      featured: p.featured || 0,
      exif_camera: p.exif_camera || 'Leica M11',
      exif_lens: p.exif_lens || '35mm Summilux',
      exif_iso: p.exif_iso || 'ISO 400',
      exif_aperture: p.exif_aperture || 'f/2.8',
      exif_shutter: p.exif_shutter || '1/500s',
    });
    setIsProjectModalOpen(true);
  };

  // Save Exhibition / Honor
  const handleSaveExhibition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exhibitionForm.title || !exhibitionForm.location || !exhibitionForm.year) {
      alert('Title, Location, and Year are required');
      return;
    }

    try {
      saveExhibition(exhibitionForm, editingExhibition?.id);
      setIsExhibitionModalOpen(false);
      setEditingExhibition(null);
      onRefreshData();
      setActionFeedback(editingExhibition ? 'Exhibition updated' : 'New exhibition added to your portfolio');
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (error) {
      setActionFeedback(error instanceof Error ? error.message : 'Could not save this exhibition.');
    }
  };

  // Delete Exhibition
  const handleDeleteExhibition = async (id: number) => {
    if (!confirm('Are you sure you want to remove this exhibition or honor?')) return;

    try {
      deleteExhibition(id);
      onRefreshData();
      setActionFeedback('Exhibition removed');
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (error) {
      setActionFeedback(error instanceof Error ? error.message : 'Could not remove this exhibition.');
    }
  };

  const openEditExhibitionModal = (exh: Exhibition) => {
    setEditingExhibition(exh);
    setExhibitionForm({
      title: exh.title,
      location: exh.location,
      year: exh.year,
      description: exh.description || '',
    });
    setIsExhibitionModalOpen(true);
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Omit<Settings, 'id'> = {
        photographer_name: settingsForm.photographer_name,
        bio: settingsForm.bio,
        profile_image: settingsForm.profile_image,
        theme_preference: settings?.theme_preference || 'dark',
        contact_email: settingsForm.contact_email,
        location: settingsForm.location,
        social_links: {
          instagram: settingsForm.instagram,
          vimeo: settingsForm.vimeo,
          behance: settingsForm.behance,
        },
      };

      saveSettings(payload);
      onRefreshData();
      setActionFeedback('Profile and studio information updated');
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (error) {
      setActionFeedback(error instanceof Error ? error.message : 'Could not save profile settings.');
    }
  };

  // Toggle Message Read
  const handleToggleMessageRead = async (msg: ContactMessage) => {
    try {
      const newStatus = msg.is_read ? 0 : 1;
      setMessageRead(msg.id, Boolean(newStatus));
      fetchMessages();
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...msg, is_read: newStatus });
      }
    } catch (error) {
      setActionFeedback(error instanceof Error ? error.message : 'Could not update this inquiry.');
    }
  };

  // Delete Message
  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      deleteMessage(id);
      fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      setActionFeedback(error instanceof Error ? error.message : 'Could not delete this inquiry.');
    }
  };

  // If Not Logged In, Render User-Friendly Login Screen
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-[99999] bg-[#0D0D0D] flex items-center justify-center p-6 text-white overflow-y-auto">
        <div className="w-full max-w-md bg-[#161616] border border-white/10 p-8 shadow-2xl rounded-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-amber-500" />
              <span className="font-serif-luxury text-xl tracking-wider">Studio Control Panel</span>
            </div>
            <button
              onClick={onClose}
              className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white"
            >
              Back to Site
            </button>
          </div>

          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            Please log in with your credentials to manage your portfolio, exhibitions, and inquiries.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 rounded-sm"
              />
            </div>

            {loginError && (
              <div className="p-3 text-xs bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-white text-black text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-colors rounded-sm"
            >
              {isLoggingIn ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#0A0A0A] text-white flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between bg-[#111111] shrink-0">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Back to Portfolio</span>
          </button>
          <span className="text-neutral-700 hidden sm:inline">|</span>
          <div className="font-serif-luxury text-lg tracking-wider text-white">
            Studio Dashboard
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-neutral-400 hidden md:inline">
            Logged in as <strong className="text-white">{currentUser.username}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-white border border-white/15 hover:border-white/40 transition-colors rounded-sm"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className="bg-amber-500/20 text-amber-300 text-xs px-6 py-2 border-b border-amber-500/30 flex items-center gap-2">
          <CheckCircle size={14} />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Main Layout: Responsive Tabs Bar & Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar (or top tabs on mobile) */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-[#0F0F0F] p-3 sm:p-4 flex md:flex-col justify-between shrink-0 overflow-x-auto">
          <nav className="flex md:flex-col gap-1 w-full">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-between px-3 py-2.5 text-xs font-medium uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Camera size={14} />
                <span>Projects ({projects.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('exhibitions')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-between px-3 py-2.5 text-xs font-medium uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${
                activeTab === 'exhibitions'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Award size={14} />
                <span>Exhibitions ({exhibitions.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-between px-3 py-2.5 text-xs font-medium uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>Profile</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-between px-3 py-2.5 text-xs font-medium uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${
                activeTab === 'messages'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>Inquiries</span>
              </div>
              {unreadCount > 0 && (
                <span className="font-mono text-[10px] bg-amber-500 text-black px-1.5 py-0.2 rounded-full font-bold ml-1.5">
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          
          {/* TAB 1: PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-serif-luxury font-normal">Portfolio Projects</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Add new photography series, manage descriptions, and camera details.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm({
                      title: '',
                      category: 'Architecture',
                      main_image: '',
                      description: '',
                      featured: 0,
                      exif_camera: 'Leica M11 Monochrom',
                      exif_lens: 'Summilux-M 35mm f/1.4',
                      exif_iso: 'ISO 400',
                      exif_aperture: 'f/2.8',
                      exif_shutter: '1/500s',
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors rounded-sm"
                >
                  <Plus size={14} />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects Grid Table */}
              <div className="bg-[#121212] border border-white/10 overflow-x-auto rounded-sm">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="bg-[#181818] text-neutral-400 uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Photo</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Camera &amp; Lens</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4">
                          <img
                            src={p.main_image}
                            alt={p.title}
                            className="w-16 h-11 object-cover bg-neutral-800 rounded-xs"
                          />
                        </td>
                        <td className="py-3 px-4 font-medium text-white font-serif-luxury text-sm">
                          {p.title}
                        </td>
                        <td className="py-3 px-4 text-neutral-400">{p.category}</td>
                        <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                          {p.exif_camera}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors rounded-xs"
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors rounded-xs"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: EXHIBITIONS & HONORS (Requested by user) */}
          {activeTab === 'exhibitions' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-serif-luxury font-normal">Exhibitions, Awards &amp; Honors</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage your solo exhibitions, museum retrospectives, and awards shown in the "About" section.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingExhibition(null);
                    setExhibitionForm({
                      title: '',
                      location: '',
                      year: new Date().getFullYear().toString(),
                      description: '',
                    });
                    setIsExhibitionModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors rounded-sm"
                >
                  <Plus size={14} />
                  <span>Add Exhibition / Honor</span>
                </button>
              </div>

              {exhibitions.length === 0 ? (
                <div className="p-8 text-center border border-white/10 bg-[#121212] text-neutral-400 text-xs">
                  No exhibitions or awards listed yet. Click "Add Exhibition / Honor" to create your first entry.
                </div>
              ) : (
                <div className="bg-[#121212] border border-white/10 overflow-hidden divide-y divide-white/5 rounded-sm">
                  {exhibitions.map((exh) => (
                    <div
                      key={exh.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02]"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-serif-luxury text-base sm:text-lg font-medium text-white">
                            {exh.title}
                          </span>
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-mono text-[11px] rounded-xs font-semibold">
                            {exh.year}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400">
                          {exh.location} {exh.description ? `· ${exh.description}` : ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => openEditExhibitionModal(exh)}
                          className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors rounded-xs"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteExhibition(exh.id)}
                          className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors rounded-xs"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE & STUDIO */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <div className="mb-8 pb-4 border-b border-white/10">
                <h2 className="text-2xl font-serif-luxury font-normal">Photographer Profile</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Update your public name, portrait photo, studio locations, and notification email.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 bg-[#141414] border border-white/10 rounded-sm">
                  <img
                    src={settingsForm.profile_image || portraitFallback}
                    alt="Photographer Avatar"
                    className="w-20 h-24 object-cover bg-neutral-800 rounded-xs"
                  />
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                      Upload Profile Portrait
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="text-xs text-neutral-400 file:mr-4 file:py-1.5 file:px-3 file:border-0 file:text-xs file:bg-white file:text-black hover:file:bg-neutral-200 cursor-pointer rounded-xs"
                    />
                    <div className="text-[11px] text-neutral-500 mt-1">
                      {uploadingImage ? 'Uploading image...' : 'JPG, PNG, or WebP'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                      Photographer Name
                    </label>
                    <input
                      type="text"
                      value={settingsForm.photographer_name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, photographer_name: e.target.value })}
                      className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                      Studio Location
                    </label>
                    <input
                      type="text"
                      value={settingsForm.location}
                      onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                      className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                    Notification Recipient Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.contact_email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                    className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 rounded-sm"
                  />
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Preview inquiries are stored only in this browser; no email is sent.
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                    Artist Statement / Bio
                  </label>
                  <textarea
                    rows={4}
                    value={settingsForm.bio}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                    className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 resize-none rounded-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="text"
                      value={settingsForm.instagram}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                      className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                      Vimeo URL
                    </label>
                    <input
                      type="text"
                      value={settingsForm.vimeo}
                      onChange={(e) => setSettingsForm({ ...settingsForm, vimeo: e.target.value })}
                      className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                      Behance URL
                    </label>
                    <input
                      type="text"
                      value={settingsForm.behance}
                      onChange={(e) => setSettingsForm({ ...settingsForm, behance: e.target.value })}
                      className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 rounded-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-colors rounded-sm"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: CLIENT INQUIRIES */}
          {activeTab === 'messages' && (
            <div>
              <div className="mb-8 pb-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif-luxury font-normal">Client Inquiries</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Messages received through the contact form on your portfolio.
                  </p>
                </div>
                <button
                  onClick={fetchMessages}
                  className="px-3 py-1.5 border border-white/15 text-xs text-neutral-300 hover:text-white rounded-sm"
                >
                  Refresh
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="p-8 text-center border border-white/10 bg-[#121212] text-neutral-400 text-xs rounded-sm">
                  No inquiries received yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Messages List */}
                  <div className="lg:col-span-5 space-y-2.5">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMessage(m)}
                        className={`p-4 border cursor-pointer transition-all rounded-sm ${
                          selectedMessage?.id === m.id
                            ? 'bg-[#1e1e1e] border-amber-500'
                            : m.is_read
                            ? 'bg-[#121212] border-white/10 hover:border-white/20'
                            : 'bg-[#181818] border-amber-500/40 hover:border-amber-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-white">{m.sender_name}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(m.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-amber-400 font-medium truncate mb-1">
                          {m.subject || 'Portfolio Inquiry'}
                        </div>
                        <div className="text-xs text-neutral-400 line-clamp-1">{m.message}</div>
                      </div>
                    ))}
                  </div>

                  {/* Message Detail View */}
                  <div className="lg:col-span-7 bg-[#141414] border border-white/10 p-6 flex flex-col justify-between rounded-sm">
                    {selectedMessage ? (
                      <div>
                        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6 gap-4">
                          <div>
                            <div className="text-base font-serif-luxury font-semibold text-white">
                              {selectedMessage.subject}
                            </div>
                            <div className="text-xs text-neutral-400 mt-1">
                              From: <strong className="text-neutral-200">{selectedMessage.sender_name}</strong> &lt;
                              <a href={`mailto:${selectedMessage.sender_email}`} className="text-amber-400 hover:underline">
                                {selectedMessage.sender_email}
                              </a>
                              &gt;
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleToggleMessageRead(selectedMessage)}
                              className="px-2.5 py-1 text-xs border border-white/20 text-neutral-300 hover:text-white rounded-xs"
                            >
                              {selectedMessage.is_read ? 'Mark Unread' : 'Mark Read'}
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(selectedMessage.id)}
                              className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-xs"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="p-4 bg-[#0D0D0D] border border-white/5 text-sm text-neutral-200 leading-relaxed font-light whitespace-pre-wrap rounded-sm">
                          {selectedMessage.message}
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-xs text-neutral-500">
                        Select a message from the list to view its contents.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Add / Edit Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#141414] border border-white/15 p-6 shadow-2xl my-8 rounded-sm">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-xl font-serif-luxury font-normal text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Monoliths in Twilight"
                  className="w-full bg-[#0D0D0D] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 rounded-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 rounded-sm"
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="Street Noir">Street Noir</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Editorial">Editorial</option>
                    <option value="Brutalist">Brutalist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Featured in Monographs?
                  </label>
                  <select
                    value={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: Number(e.target.value) })}
                    className="w-full bg-[#0D0D0D] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 rounded-sm"
                  >
                    <option value={1}>Yes (Featured in Horizontal Scroll)</option>
                    <option value={0}>No (Standard Grid)</option>
                  </select>
                </div>
              </div>

              {/* Upload image or enter URL */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Project Photo *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={projectForm.main_image}
                    onChange={(e) => setProjectForm({ ...projectForm, main_image: e.target.value })}
                    placeholder="https://... or a local image path"
                    className="flex-1 bg-[#0D0D0D] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono rounded-sm"
                  />
                  <label className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer flex items-center gap-1 shrink-0 rounded-sm">
                    <Upload size={13} />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploadingImage && <div className="text-[11px] text-amber-400 mt-1">Uploading photo...</div>}
              </div>

              {/* Camera metadata */}
              <div className="p-3 bg-[#0D0D0D] border border-white/10 space-y-3 rounded-sm">
                <div className="text-[11px] uppercase tracking-wider text-amber-500 font-medium">
                  Camera &amp; Lens Specifications
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-400">Camera:</span>
                    <input
                      type="text"
                      value={projectForm.exif_camera}
                      onChange={(e) => setProjectForm({ ...projectForm, exif_camera: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 px-2 py-1 text-white text-xs mt-0.5 rounded-xs"
                    />
                  </div>
                  <div>
                    <span className="text-neutral-400">Lens:</span>
                    <input
                      type="text"
                      value={projectForm.exif_lens}
                      onChange={(e) => setProjectForm({ ...projectForm, exif_lens: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 px-2 py-1 text-white text-xs mt-0.5 rounded-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Description / Story
                </label>
                <textarea
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Context, location, print edition notes..."
                  className="w-full bg-[#0D0D0D] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none rounded-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 border border-white/15 text-xs text-neutral-400 hover:text-white rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 rounded-sm"
                >
                  {editingProject ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Exhibition Modal */}
      {isExhibitionModalOpen && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-md bg-[#141414] border border-white/15 p-6 shadow-2xl my-8 rounded-sm">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-xl font-serif-luxury font-normal text-white">
                {editingExhibition ? 'Edit Exhibition / Honor' : 'Add Exhibition or Honor'}
              </h3>
              <button
                onClick={() => setIsExhibitionModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExhibition} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Exhibition or Award Title *
                </label>
                <input
                  type="text"
                  required
                  value={exhibitionForm.title}
                  onChange={(e) => setExhibitionForm({ ...exhibitionForm, title: e.target.value })}
                  placeholder="e.g. Monoliths in the Mist"
                  className="w-full bg-[#0D0D0D] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={exhibitionForm.year}
                    onChange={(e) => setExhibitionForm({ ...exhibitionForm, year: e.target.value })}
                    placeholder="e.g. 2025"
                    className="w-full bg-[#0D0D0D] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Location / Gallery *
                  </label>
                  <input
                    type="text"
                    required
                    value={exhibitionForm.location}
                    onChange={(e) => setExhibitionForm({ ...exhibitionForm, location: e.target.value })}
                    placeholder="e.g. Kulturforum, Berlin"
                    className="w-full bg-[#0D0D0D] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Description / Curator Details
                </label>
                <textarea
                  rows={3}
                  value={exhibitionForm.description}
                  onChange={(e) => setExhibitionForm({ ...exhibitionForm, description: e.target.value })}
                  placeholder="e.g. Solo exhibition of 42 Archival Pigment Prints"
                  className="w-full bg-[#0D0D0D] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none rounded-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsExhibitionModalOpen(false)}
                  className="px-4 py-2 border border-white/15 text-xs text-neutral-400 hover:text-white rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 rounded-sm"
                >
                  {editingExhibition ? 'Save Changes' : 'Add to Exhibitions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
