export interface Project {
  id: number;
  title: string;
  category: string;
  main_image: string;
  description: string;
  featured: number;
  exif_camera?: string;
  exif_lens?: string;
  exif_iso?: string;
  exif_aperture?: string;
  exif_shutter?: string;
  display_order?: number;
  created_at?: string;
}

export interface Settings {
  id: number;
  photographer_name: string;
  bio: string;
  profile_image: string;
  theme_preference: 'dark' | 'light';
  social_links: {
    instagram?: string;
    vimeo?: string;
    behance?: string;
    x?: string;
  };
  contact_email: string;
  location: string;
  updated_at?: string;
}

export interface Exhibition {
  id: number;
  title: string;
  location: string;
  year: string;
  description?: string;
  display_order?: number;
  created_at?: string;
}

export interface ContactMessage {
  id: number;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  is_read: number;
  created_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  token?: string;
}
