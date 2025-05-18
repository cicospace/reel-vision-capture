
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface ReelExample { id?: string; link: string; comment: string; }
export interface Submission {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  cell_phone: string;
  website: string;
  problem_solved: string;
  tone: string[];
  other_tone: string;
  duration: string;
  other_duration: string;
  reel_examples: ReelExample[];
  footage_link: string;
  footage_types: string[];
  other_footage_type: string;
  script_structure: string;
  non_negotiable_clips: string;
  testimonials: string;
  logo_folder_link: string;
  deck_files?: Json[];
  credibility_markers: string[];
  other_credibility_marker: string;
  speaker_bio: string;
  speaker_bio_files?: Json[];
  branding_guidelines_files?: Json[];
  additional_info: string;
  status: 'new' | 'in_review' | 'completed';
  created_at?: string;
  updated_at?: string;
}
