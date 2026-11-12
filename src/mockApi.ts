import type { ContactMessage, Exhibition, Project, Settings, AdminUser } from './types';
import portraitImage from './assets/images/photographer_portrait_1794151404427.jpg';
import architectureImage from './assets/images/project_architecture_1794151404616.jpg';
import nordicImage from './assets/images/project_nordic_coast_1794151404581.jpg';
import streetImage from './assets/images/project_street_noir_1794151405926.jpg';

interface PreviewData {
  projects: Project[];
  settings: Settings;
  exhibitions: Exhibition[];
  messages: ContactMessage[];
}

const storageKey = 'kroma_preview_data_v1';

const defaultData: PreviewData = {
  settings: {
    id: 1,
    photographer_name: 'Elena Rostova',
    bio: 'Cinematic & fine-art photographer exploring silence, brutalist shadows, and raw human vulnerability across European and Nordic landscapes.',
    profile_image: portraitImage,
    theme_preference: 'dark',
    social_links: {
      instagram: 'https://instagram.com',
      vimeo: 'https://vimeo.com',
      behance: 'https://behance.net',
      x: 'https://x.com',
    },
    contact_email: 'yussefelshenawy@gmail.com',
    location: 'Berlin & Reykjavik',
  },
  projects: [
    {
      id: 1,
      title: 'Monoliths of Twilight',
      category: 'Architecture',
      main_image: architectureImage,
      description: 'A study on monumental brutalist architecture swallowed in evening mist. Concrete geometric silhouettes against cold twilight skies, emphasizing quiet geometry and solemn human scale.',
      featured: 1,
      exif_camera: 'Hasselblad X2D 100C',
      exif_lens: 'XCD 38mm f/2.5 V',
      exif_iso: 'ISO 100',
      exif_aperture: 'f/8.0',
      exif_shutter: '1/15s',
      display_order: 1,
    },
    {
      id: 2,
      title: 'Solitude in Obsidian',
      category: 'Street Noir',
      main_image: streetImage,
      description: 'Captured in the rain-slicked alleyways of Paris and Tokyo. Deep shadows, wet cobblestone reflections, and the anonymous solitude of night travelers under amber street lamps.',
      featured: 1,
      exif_camera: 'Leica M11 Monochrom',
      exif_lens: 'Summilux-M 50mm f/1.4 ASPH',
      exif_iso: 'ISO 1600',
      exif_aperture: 'f/1.4',
      exif_shutter: '1/125s',
      display_order: 2,
    },
    {
      id: 3,
      title: 'Echoes of the North',
      category: 'Landscape',
      main_image: nordicImage,
      description: 'The surge of the North Atlantic meeting volcanic black sand beaches in Vik, Iceland. Dramatic storm clouds framing ancient basalt sea stacks in heavy mist.',
      featured: 1,
      exif_camera: 'Fujifilm GFX 100 II',
      exif_lens: 'GF 45-100mm f/4 R LM OIS',
      exif_iso: 'ISO 200',
      exif_aperture: 'f/11',
      exif_shutter: '1/4s',
      display_order: 3,
    },
    {
      id: 4,
      title: 'Geometric Silence',
      category: 'Brutalist',
      main_image: architectureImage,
      description: 'Exploring the quiet poetry of cast raw concrete and dramatic angular shadows. A meditation on texture, light, and architectural permanence.',
      featured: 0,
      exif_camera: 'Leica SL2-S',
      exif_lens: 'APO-Summicron-SL 35mm f/2',
      exif_iso: 'ISO 400',
      exif_aperture: 'f/5.6',
      exif_shutter: '1/250s',
      display_order: 4,
    },
  ],
  exhibitions: [
    { id: 1, title: 'Monoliths in the Mist', location: 'Kulturforum, Berlin', year: '2025', description: 'Solo exhibition of 42 Archival Pigment Prints', display_order: 1 },
    { id: 2, title: 'Obsidian Shores: The North Atlantic Monologue', location: 'Reykjavik Museum of Photography', year: '2024', description: 'Curated by Sigurður Jónsson', display_order: 2 },
    { id: 3, title: 'Leica Oskar Barnack Finalist', location: 'Wetzlar, Germany', year: '2023', description: 'Documentary & Human Form category', display_order: 3 },
    { id: 4, title: 'Brutalist Shadows & Concrete Echoes', location: "Fondation Cartier Pour l'Art Contemporain, Paris", year: '2022', description: 'Architectural retrospective and monographs', display_order: 4 },
  ],
  messages: [],
};

function isPreviewData(value: unknown): value is PreviewData {
  if (typeof value !== 'object' || value === null) return false;
  const data = value as Record<string, unknown>;
  return Array.isArray(data.projects)
    && Array.isArray(data.exhibitions)
    && Array.isArray(data.messages)
    && typeof data.settings === 'object'
    && data.settings !== null;
}

function persistData(data: PreviewData): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('Browser storage is full. Remove some uploaded preview images and try again.');
    }
    throw new Error('Could not save preview data in this browser.');
  }
}

function readData(): PreviewData {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    const initialData = structuredClone(defaultData);
    persistData(initialData);
    return initialData;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(saved);
  } catch {
    throw new Error('Saved preview data is unreadable. Clear the kroma_preview_data_v1 browser storage entry to reset it.');
  }

  if (!isPreviewData(parsed)) {
    throw new Error('Saved preview data has an invalid format. Clear the kroma_preview_data_v1 browser storage entry to reset it.');
  }

  return parsed;
}

export function getPortfolioData(): Pick<PreviewData, 'projects' | 'settings' | 'exhibitions'> {
  const data = readData();
  return {
    projects: [...data.projects].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)),
    settings: data.settings,
    exhibitions: [...data.exhibitions].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)),
  };
}

export function getMessages(): ContactMessage[] {
  return [...readData().messages].sort((a, b) => b.id - a.id);
}

export function loginDemoAdmin(username: string, password: string): AdminUser | null {
  if (username !== 'admin' || password !== 'admin123') return null;
  return { id: 1, username: 'admin', token: 'local-preview-session' };
}

export function saveProject(input: Omit<Project, 'id'>, id?: number): void {
  const data = readData();
  const existing = id ? data.projects.find((project) => project.id === id) : undefined;
  const project: Project = {
    ...input,
    id: existing?.id ?? Math.max(0, ...data.projects.map((item) => item.id)) + 1,
    display_order: existing?.display_order ?? data.projects.length + 1,
    created_at: existing?.created_at ?? new Date().toISOString(),
  };
  data.projects = existing
    ? data.projects.map((item) => item.id === id ? project : item)
    : [...data.projects, project];
  persistData(data);
}

export function deleteProject(id: number): void {
  const data = readData();
  data.projects = data.projects.filter((project) => project.id !== id);
  persistData(data);
}

export function saveExhibition(input: Omit<Exhibition, 'id'>, id?: number): void {
  const data = readData();
  const existing = id ? data.exhibitions.find((item) => item.id === id) : undefined;
  const exhibition: Exhibition = {
    ...input,
    id: existing?.id ?? Math.max(0, ...data.exhibitions.map((item) => item.id)) + 1,
    display_order: existing?.display_order ?? data.exhibitions.length + 1,
    created_at: existing?.created_at ?? new Date().toISOString(),
  };
  data.exhibitions = existing
    ? data.exhibitions.map((item) => item.id === id ? exhibition : item)
    : [...data.exhibitions, exhibition];
  persistData(data);
}

export function deleteExhibition(id: number): void {
  const data = readData();
  data.exhibitions = data.exhibitions.filter((item) => item.id !== id);
  persistData(data);
}

export function saveSettings(settings: Omit<Settings, 'id'>): void {
  const data = readData();
  data.settings = { ...data.settings, ...settings, id: data.settings.id };
  persistData(data);
}

export function saveContactMessage(input: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>): void {
  const data = readData();
  const message: ContactMessage = {
    ...input,
    id: Math.max(0, ...data.messages.map((item) => item.id)) + 1,
    is_read: 0,
    created_at: new Date().toISOString(),
  };
  data.messages = [message, ...data.messages];
  persistData(data);
}

export function setMessageRead(id: number, isRead: boolean): void {
  const data = readData();
  data.messages = data.messages.map((message) => message.id === id ? { ...message, is_read: Number(isRead) } : message);
  persistData(data);
}

export function deleteMessage(id: number): void {
  const data = readData();
  data.messages = data.messages.filter((message) => message.id !== id);
  persistData(data);
}

export function encodeUploadedImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    return Promise.reject(new Error('Choose a valid image file.'));
  }
  if (file.size > 8 * 1024 * 1024) {
    return Promise.reject(new Error('Choose an image smaller than 8 MB.'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The image could not be read.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('The selected file is not a supported image.'));
      image.onload = () => {
        const maxDimension = 1400;
        const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Image processing is not available in this browser.'));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
