
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Submission } from '@/types';

export default function SubmissionForm() {
  const [form, setForm] = useState<Submission>({
    first_name: '', last_name: '', email: '', cell_phone: '', website: '',
    problem_solved: '', tone: [], other_tone: '', duration: '', other_duration: '',
    reel_examples: [{ link: '', comment: '' }], footage_link: '', footage_types: [], other_footage_type: '',
    script_structure: '', non_negotiable_clips: '', testimonials: '', logo_folder_link: '',
    deck_files: [], credibility_markers: [], other_credibility_marker: '', speaker_bio: '',
    speaker_bio_files: [], branding_guidelines_files: [], additional_info: '', status: 'new'
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('submissions').insert(form);
    if (error) console.error('Insert error:', error);
    else window.alert('Submitted!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="first_name" placeholder="First name" value={form.first_name} onChange={handleChange} />
      {/* TODO: Add other inputs similarly */}
      <button type="submit">Submit</button>
    </form>
  );
}
