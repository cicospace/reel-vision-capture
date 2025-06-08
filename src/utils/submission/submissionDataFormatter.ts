
// Helper function to prepare submission data
export function prepareSubmissionData(formData: any) {
  // Ensure arrays are proper arrays and not empty
  const tones = Array.isArray(formData.tones) ? formData.tones : [];
  const footageTypes = Array.isArray(formData.footageTypes) ? formData.footageTypes : [];
  
  // Handle credibilityMarkers - convert from string (textarea) to array
  let credibilityMarkers: string[] = [];
  if (typeof formData.credibilityMarkers === 'string' && formData.credibilityMarkers.trim()) {
    // Split by newlines, trim each line, and filter out empty lines
    credibilityMarkers = formData.credibilityMarkers
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }
  
  // If no credibility markers or only contains variations of "N/A", provide a default
  if (credibilityMarkers.length === 0 || 
      (credibilityMarkers.length === 1 && credibilityMarkers[0].toLowerCase().includes('n/a'))) {
    credibilityMarkers = ['N/A'];
  }
  
  // Create a clean submission object with only the fields expected by the database
  // Always provide fallback values for required fields to prevent null/undefined issues
  return {
    // Required contact fields
    first_name: formData.firstName || '',
    last_name: formData.lastName || '',
    email: formData.email || '',
    cell_phone: formData.cellPhone || '',
    website: formData.website || '',
    problem_solved: formData.problemSolved || '',
    
    // Required preference fields
    tone: tones,
    other_tone: formData.otherTone || null,
    duration: formData.duration || '',
    other_duration: formData.otherDuration || null,
    footage_link: formData.footageLink || '',
    footage_types: footageTypes,
    other_footage_type: formData.otherFootageType || null,
    script_structure: formData.scriptStructure || '',
    non_negotiable_clips: formData.nonNegotiableClips || '',
    testimonials: formData.testimonials || '',
    logo_folder_link: formData.logoFolderLink || '',
    deck_files_link: formData.deckFilesLink || '',
    branding_guidelines_files_link: formData.brandingGuidelinesFilesLink || '',
    speaker_bio_files_link: formData.speakerBioFilesLink || '',
    credibility_markers: credibilityMarkers,
    other_credibility_marker: formData.otherCredibilityMarker || null,
    speaker_bio: formData.speakerBio || '',
    additional_info: formData.additionalInfo || '',
    status: 'new'
  };
}
