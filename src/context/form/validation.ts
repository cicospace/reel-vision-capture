
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
};

export const validateStep = (
  step: number, 
  formState: any, 
  validateEmail: (email: string) => boolean, 
  validatePhoneNumber: (phone: string) => boolean
): { isValid: boolean; errorMessage: string } => {
  let isValid = true;
  let errorMessage = '';

  switch (step) {
    case 1:
      if (!formState.firstName.trim()) {
        isValid = false;
        errorMessage = 'Please enter your first name.';
      } else if (!formState.lastName.trim()) {
        isValid = false;
        errorMessage = 'Please enter your last name.';
      } else if (!formState.email.trim()) {
        isValid = false;
        errorMessage = 'Please enter your email address.';
      } else if (!validateEmail(formState.email)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      } else if (!formState.cellPhone.trim()) {
        isValid = false;
        errorMessage = 'Please enter your cell phone number.';
      } else if (!validatePhoneNumber(formState.cellPhone)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number (at least 10 digits).';
      } else if (!formState.website.trim()) {
        isValid = false;
        errorMessage = 'Please enter your website or enter N/A if not applicable.';
      } else if (!formState.problemSolved.trim()) {
        isValid = false;
        errorMessage = 'Please describe what problem you solve.';
      }
      break;
    case 2:
      if (formState.tones.length === 0) {
        isValid = false;
        errorMessage = 'Please select at least one tone.';
      } else if (formState.tones.includes('other') && !formState.otherTone.trim()) {
        isValid = false;
        errorMessage = 'Please specify the other tone.';
      } else if (!formState.duration) {
        isValid = false;
        errorMessage = 'Please select a duration.';
      } else if (formState.duration === 'other' && !formState.otherDuration.trim()) {
        isValid = false;
        errorMessage = 'Please specify the other duration.';
      } else if (formState.reelExamples.length === 0) {
        isValid = false;
        errorMessage = 'Please add at least one reel example.';
      } else {
        for (const example of formState.reelExamples) {
          if (!example.link.trim() || !example.comment.trim()) {
            isValid = false;
            errorMessage = 'Please complete all fields for each reel example.';
            break;
          }
        }
      }
      break;
    case 3:
      if (!formState.footageLink.trim()) {
        isValid = false;
        errorMessage = 'Please provide a link to your footage.';
      } else if (formState.footageTypes.length === 0) {
        isValid = false;
        errorMessage = 'Please select at least one footage type.';
      } else if (formState.footageTypes.includes('other') && !formState.otherFootageType.trim()) {
        isValid = false;
        errorMessage = 'Please specify the other footage type.';
      }
      break;
    case 4:
      if (!formState.scriptStructure.trim()) {
        isValid = false;
        errorMessage = 'Please provide a script structure.';
      } else if (!formState.nonNegotiableClips.trim()) {
        isValid = false;
        errorMessage = 'Please provide non-negotiable clips.';
      }
      break;
    case 5:
      if (!formState.testimonials.trim()) {
        isValid = false;
        errorMessage = 'Please provide testimonials or enter N/A if not applicable.';
      } else if (!formState.logoFolderLink.trim()) {
        isValid = false;
        errorMessage = 'Please provide a link to your logos or enter N/A if not applicable.';
      } else if (!formState.deckFilesLink.trim()) {
        isValid = false;
        errorMessage = 'Please provide a link to your slide deck or enter N/A if not applicable.';
      } else if (!formState.brandingGuidelinesFilesLink.trim()) {
        isValid = false;
        errorMessage = 'Please provide a link to your branding guidelines or enter N/A if not applicable.';
      } else if (formState.credibilityMarkers.length === 0) {
        isValid = false;
        errorMessage = 'Please select at least one credibility marker.';
      } else if (formState.credibilityMarkers.includes('other') && !formState.otherCredibilityMarker.trim()) {
        isValid = false;
        errorMessage = 'Please specify the other credibility marker.';
      } else if (!formState.speakerBio.trim()) {
        isValid = false;
        errorMessage = 'Please provide your speaker bio.';
      }
      break;
    case 6:
      if (!formState.additionalInfo.trim()) {
        isValid = false;
        errorMessage = 'Please provide additional information or enter N/A if not applicable.';
      }
      break;
  }

  return { isValid, errorMessage };
};
