// Database Models
export interface Hero {
  id: string;
  name: string;
  title: string;
  tagline: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface About {
  id: string;
  bio: string;
  image_url: string | null;
  location: string | null;
  email: string | null;
  years_experience: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'fullStack' | 'tools' | 'other';
  proficiency: number;
  icon: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  image_url: string | null;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  is_featured: boolean;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  company_url: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  long_description?: string;
  image_url?: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  is_featured: boolean;
  is_visible: boolean;
}

export interface SkillFormData {
  name: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'tools' | 'other';
  proficiency: number;
  icon?: string;
  is_visible: boolean;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';
