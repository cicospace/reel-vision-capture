
// Helper function to prepare submission data
export function prepareSubmissionData(formData: any) {
  // Ensure arrays are proper arrays and not empty
  const tones = Array.isArray(formData.tones) ? formData.tones : [];
  const footageTypes = Array.isArray(formData.footageTypes) ? formData.footageTypes : [];
  const credibilityMarkers = Array.isArray(formData.credibilityMarkers) ? formData.credibilityMarkers : [];
  
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
    credibility_markers: credibilityMarkers,
    other_credibility_marker: formData.otherCredibilityMarker || null,
    speaker_bio: formData.speakerBio || '',
    additional_info: formData.additionalInfo || '',
    status: 'new'
  };
}
