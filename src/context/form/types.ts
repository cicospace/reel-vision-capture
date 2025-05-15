
export type ReelExample = {
  id: string;
  link: string;
  comment: string;
};

export type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  cellPhone: string;
  website: string;
  problemSolved: string;
  
  tones: string[];
  otherTone: string;
  duration: string;
  otherDuration: string;
  reelExamples: ReelExample[];
  footageLink: string;
  footageTypes: string[];
  otherFootageType: string;
  scriptStructure: string;
  nonNegotiableClips: string;
  testimonials: string;
  logoFolderLink: string;
  deckFilesLink: string;
  credibilityMarkers: string[];
  otherCredibilityMarker: string;
  speakerBio: string;
  speakerBioFilesLink: string;
  brandingGuidelinesFilesLink: string;
  additionalInfo: string;
  step: number;
};

export const initialFormState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  cellPhone: '',
  website: '',
  problemSolved: '',
  
  tones: [],
  otherTone: '',
  duration: '',
  otherDuration: '',
  reelExamples: [],
  footageLink: '',
  footageTypes: [],
  otherFootageType: '',
  scriptStructure: '',
  nonNegotiableClips: '',
  testimonials: '',
  logoFolderLink: '',
  deckFilesLink: '',
  credibilityMarkers: [],
  otherCredibilityMarker: '',
  speakerBio: '',
  speakerBioFilesLink: '',
  brandingGuidelinesFilesLink: '',
  additionalInfo: '',
  step: 1,
};

export interface FormContextType {
  formState: FormState;
  updateForm: (key: keyof FormState, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  validateEmail: (email: string) => boolean;
  validatePhoneNumber: (phone: string) => boolean;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
