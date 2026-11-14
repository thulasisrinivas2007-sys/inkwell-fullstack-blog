export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  user_id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  featured_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogWithAuthor extends Blog {
  profiles?: { full_name: string; avatar_url?: string | null } | null;
}

export const CATEGORIES = [
  'Technology',
  'Education',
  'Programming',
  'Artificial Intelligence',
  'Lifestyle',
  'Travel',
  'Sports',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];
