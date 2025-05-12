
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Film, Clipboard, User, Video, Clapperboard, Sparkles, Info, Mail, Globe, FileText, Phone } from "lucide-react";
import ProgressTracker from "./ProgressTracker";
import CheckboxGroup from "./CheckboxGroup";
import RadioGroupCustom from "./RadioGroupCustom";
import RepeatableField from "./RepeatableField";
import FileUploadField from "./FileUploadField";
import { 
  sendEmail, 
  formatEmailBody, 
  loadFormFromStorage, 
  saveFormToStorage, 
  clearStoredFormData,
  saveFormToSupabase
} from "@/utils/emailService";

type ReelExample = {
  id: string;
  link: string;
  comment: string;
};

type FormState = {
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
  deckFiles: File[];
  credibilityMarkers: string[];
  otherCredibilityMarker: string;
  speakerBio: string;
  speakerBioFiles: File[];
  brandingGuidelinesFiles: File[];
  additionalInfo: string;
  step: number;
};

const initialFormState: FormState = {
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
  deckFiles: [],
  credibilityMarkers: [],
  otherCredibilityMarker: '',
  speakerBio: '',
  speakerBioFiles: [],
  brandingGuidelinesFiles: [],
  additionalInfo: '',
  step: 1,
};

const toneOptions = [
  { id: 'inspirational', label: 'Inspirational' },
  { id: 'energetic', label: 'Energetic' },
  { id: 'authoritative', label: 'Authoritative' },
];

const durationOptions = [
  { id: '2-3min', label: '2–3 minutes' },
  { id: '3-4min', label: '3–4 minutes (recommended)' },
];

const footageTypeOptions = [
  { id: 'keynote', label: 'Keynote footage' },
  { id: 'media', label: 'Media clips (TV, podcasts, etc.)' },
  { id: 'documentary', label: 'Documentaries' },
];

const credibilityOptions = [
  { id: 'author', label: 'Best-Selling Author' },
  { id: 'inc5000', label: 'Inc 5000 Honoree' },
  { id: 'tedx', label: 'TEDx Speaker' },
  { id: 'media', label: 'Featured in Major Media' },
];

const SubmissionForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 6;

  const updateForm = (key: keyof FormState, value: any) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhoneNumber = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  };

  const nextStep = () => {
    let isValid = true;
    let errorMessage = '';

    switch (formState.step) {
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
    }

    if (!isValid) {
      toast.error("Required Field Missing", {
        description: errorMessage,
      });
      return;
    }

    if (formState.step < totalSteps) {
      updateForm('step', formState.step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (formState.step > 1) {
      updateForm('step', formState.step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.additionalInfo.trim()) {
      toast.error("Required Field Missing", {
        description: "Please provide additional information or enter N/A if not applicable.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First save to Supabase
      const { success, submissionId } = await saveFormToSupabase(formState);
      
      if (!success) {
        throw new Error("Failed to save submission to database");
      }
      
      // Then send email notification
      const emailBody = formatEmailBody(formState);
      
      const emailSent = await sendEmail({
        to: "cico@cicospace.com",
        subject: `New Demo Reel Submission - ${formState.firstName} ${formState.lastName}`,
        body: emailBody,
      });
      
      if (emailSent) {
        toast.success("Form submitted successfully!", {
          description: "We'll be in touch with you soon about your demo reel!",
        });
        
        clearStoredFormData();
        setFormState(initialFormState);
        updateForm('step', 1);
      } else {
        toast.error("Error sending email notification", {
          description: "Your submission was saved but we couldn't send the notification email. Our team will still review your submission.",
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Error submitting form", {
        description: "Your data has been saved locally. You can try submitting again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (formState.step) {
      case 1:
        return (
          <div className="form-section border border-border">
            <h2 className="section-title">
              <User size={20} className="text-reel-accent" />
              Contact Information
            </h2>
            <div className="mt-2 mb-6 bg-muted p-3 rounded-md flex items-start">
              <Info size={16} className="text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">All fields are required. Enter "N/A" if a text field is not applicable to you.</p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="input-label">First Name *</Label>
                  <Input
                    value={formState.firstName}
                    onChange={(e) => updateForm('firstName', e.target.value)}
                    placeholder="Your first name"
                    className="text-input"
                    required
                  />
                </div>
                <div>
                  <Label className="input-label">Last Name *</Label>
                  <Input
                    value={formState.lastName}
                    onChange={(e) => updateForm('lastName', e.target.value)}
                    placeholder="Your last name"
                    className="text-input"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="input-label">Email Address *</Label>
                  <Input
                    type="email"
                    value={formState.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="text-input"
                    required
                  />
                </div>
                <div>
                  <Label className="input-label">Cell Phone *</Label>
                  <Input
                    type="tel"
                    value={formState.cellPhone}
                    onChange={(e) => updateForm('cellPhone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="text-input"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label className="input-label">Your Website *</Label>
                <Input
                  value={formState.website}
                  onChange={(e) => updateForm('website', e.target.value)}
                  placeholder="https://yourwebsite.com or N/A"
                  className="text-input"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">Enter your website URL or N/A if you don't have one.</p>
              </div>
              
              <div>
                <Label className="input-label">What Problem Do You Solve? *</Label>
                <Textarea
                  value={formState.problemSolved}
                  onChange={(e) => updateForm('problemSolved', e.target.value)}
                  placeholder="Describe the core problem your business/speaking solves for your audience..."
                  className="text-input h-24"
                  required
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="form-section border border-border">
            <h2 className="section-title">
              <Clipboard size={20} className="text-reel-accent" />
              Project Preferences
            </h2>
            <div className="mt-2 mb-6 bg-muted p-3 rounded-md flex items-start">
              <Info size={16} className="text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">All fields are required. Enter "N/A" if a text field is not applicable to you.</p>
            </div>
            
            <div className="space-y-6">
              <RadioGroupCustom
                label="Which tones best represent your brand? *"
                options={toneOptions}
                value={formState.tones.length > 0 ? formState.tones[0] : ''}
                onChange={(value) => updateForm('tones', [value])}
                otherOption={true}
                otherValue={formState.otherTone}
                onOtherChange={(value) => updateForm('otherTone', value)}
                required={true}
              />
              
              <RadioGroupCustom
                label="How long should the final demo reel be? *"
                options={durationOptions}
                value={formState.duration}
                onChange={(value) => updateForm('duration', value)}
                otherOption={true}
                otherValue={formState.otherDuration}
                onOtherChange={(value) => updateForm('otherDuration', value)}
                required={true}
              />
              
              <RepeatableField
                label="Reels You Like (Add up to 3 examples) *"
                items={formState.reelExamples}
                onChange={(items) => updateForm('reelExamples', items)}
                maxItems={3}
                required={true}
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="form-section border border-border">
            <h2 className="section-title">
              <Video size={20} className="text-reel-accent" />
              Footage Submission
            </h2>
            <div className="mt-2 mb-6 bg-muted p-3 rounded-md flex items-start">
              <Info size={16} className="text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">All fields are required. Enter "N/A" if a text field is not applicable to you.</p>
            </div>
            <div className="space-y-6">
              <div>
                <Label className="input-label">Paste the Google Drive or Dropbox link with all your raw media *</Label>
                <Input
                  value={formState.footageLink}
                  onChange={(e) => updateForm('footageLink', e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="text-input"
                  required
                />
              </div>
              
              <CheckboxGroup
                label="Check everything included in your footage folder: *"
                options={footageTypeOptions}
                selectedOptions={formState.footageTypes}
                onChange={(value) => updateForm('footageTypes', value)}
                otherOption={true}
                otherValue={formState.otherFootageType}
                onOtherChange={(value) => updateForm('otherFootageType', value)}
                required={true}
              />
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="form-section border border-border">
            <h2 className="section-title">
              <Clapperboard size={20} className="text-reel-accent" />
              Creative Direction
            </h2>
            <div className="mt-2 mb-6 bg-muted p-3 rounded-md flex items-start">
              <Info size={16} className="text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">All fields are required. Enter "N/A" if a text field is not applicable to you.</p>
            </div>
            <div className="space-y-6">
              <div>
                <Label className="input-label">Share any general script or flow you'd like the reel to follow *</Label>
                <Textarea
                  value={formState.scriptStructure}
                  onChange={(e) => updateForm('scriptStructure', e.target.value)}
                  placeholder="Describe your vision for the reel structure and flow, or enter N/A if not applicable..."
                  className="text-input h-32"
                  required
                />
              </div>
              
              <div>
                <Label className="input-label">List the clips (with timestamps if possible) that MUST be included *</Label>
                <Textarea
                  value={formState.nonNegotiableClips}
                  onChange={(e) => updateForm('nonNegotiableClips', e.target.value)}
                  placeholder="e.g., 'Main_Stage_Talk.mp4' at 14:35 - audience standing ovation, or enter N/A if not applicable..."
                  className="text-input h-32"
                  required
                />
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="form-section border border-border">
            <h2 className="section-title">
              <User size={20} className="text-reel-accent" />
              Credibility & Social Proof
            </h2>
            <div className="mt-2 mb-6 bg-muted p-3 rounded-md flex items-start">
              <Info size={16} className="text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">All fields are required. Enter "N/A" if a text field is not applicable to you.</p>
            </div>
            <div className="space-y-6">
              <div>
                <Label className="input-label">Add any testimonials you'd like us to consider *</Label>
                <Textarea
                  value={formState.testimonials}
                  onChange={(e) => updateForm('testimonials', e.target.value)}
                  placeholder="Add testimonials that validate your expertise, or enter N/A if not applicable..."
                  className="text-input h-24"
                  required
                />
              </div>
              
              <div>
                <Label className="input-label">Paste the Google Drive or Dropbox link with all your logo files (PNG preferred) *</Label>
                <Input
                  value={formState.logoFolderLink}
                  onChange={(e) => updateForm('logoFolderLink', e.target.value)}
                  placeholder="https://drive.google.com/... or enter N/A if not applicable"
                  className="text-input"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">Upload all logos you'd like us to feature on your logo wall to a drive folder and share the link.</p>
              </div>
              
              <FileUploadField
                label="Upload your keynote slide deck or key visuals of your framework (highly recommended) *"
                description="Share your presentation materials to help us visualize your content"
                accept=".pdf,.ppt,.pptx,.key"
                multiple={false}
                files={formState.deckFiles}
                onChange={(files) => updateForm('deckFiles', files)}
                required={true}
              />
              
              <FileUploadField
                label="Upload any branding guidelines *"
                description="Share your brand guidelines to ensure we maintain your brand consistency"
                accept=".pdf,.doc,.docx,.jpg,.png"
                multiple={true}
                files={formState.brandingGuidelinesFiles}
                onChange={(files) => updateForm('brandingGuidelinesFiles', files)}
                required={false}
              />
              
              <CheckboxGroup
                label="Which credibility markers apply to you? *"
                options={credibilityOptions}
                selectedOptions={formState.credibilityMarkers}
                onChange={(value) => updateForm('credibilityMarkers', value)}
                otherOption={true}
                otherValue={formState.otherCredibilityMarker}
                onOtherChange={(value) => updateForm('otherCredibilityMarker', value)}
                required={true}
              />
              
              <div>
                <Label className="input-label">Your current speaker bio *</Label>
                <Textarea
                  value={formState.speakerBio}
                  onChange={(e) => updateForm('speakerBio', e.target.value)}
                  placeholder="Paste your speaker bio here or upload a file below..."
                  className="text-input h-24 mb-3"
                  required
                />
                <FileUploadField
                  label=""
                  description="Optional: Upload your bio as a document instead of typing it above"
                  accept=".pdf,.doc,.docx,.txt"
                  multiple={false}
                  files={formState.speakerBioFiles}
                  onChange={(files) => updateForm('speakerBioFiles', files)}
                  required={false}
                />
              </div>
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-6">
            <div className="form-section border border-border">
              <h2 className="section-title">
                <Film size={20} className="text-reel-accent" />
                Final Details
              </h2>
              <div className="mt-2 mb-6 bg-muted p-3 rounded-md flex items-start">
                <Info size={16} className="text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">All fields are required. Enter "N/A" if a text field is not applicable to you.</p>
              </div>
              <div>
                <Label className="input-label">Anything else you'd like us to know? *</Label>
                <Textarea
                  value={formState.additionalInfo}
                  onChange={(e) => updateForm('additionalInfo', e.target.value)}
                  placeholder="Share any additional information that might help us create your perfect demo reel, or enter N/A if not applicable..."
                  className="text-input h-32"
                  required
                />
              </div>
            </div>
            
            <Card className="p-6 border-border bg-card">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-reel-accent" />
                Review Your Submission
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Once we receive all items, we'll review and confirm everything's good to go. If anything's missing, we'll reach out. Let's make something extraordinary.
              </p>
              <Button 
                onClick={handleSubmit}
                className="w-full bg-black hover:bg-gray-800 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Submitting...</span>
                    <Mail className="h-4 w-4 animate-pulse" />
                  </>
                ) : (
                  "Submit Demo Reel Request"
                )}
              </Button>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

  React.useEffect(() => {
    const savedData = loadFormFromStorage();
    if (savedData) {
      toast.info("Found saved form data", {
        description: "Your previous form data has been restored.",
        action: {
          label: "Clear",
          onClick: () => {
            clearStoredFormData();
            setFormState(initialFormState);
          }
        }
      });
      setFormState(prev => ({ ...prev, ...savedData.data }));
    }
  }, []);

  React.useEffect(() => {
    if (JSON.stringify(formState) !== JSON.stringify(initialFormState)) {
      saveFormToStorage(formState);
    }
  }, [formState]);

  return (
    <div>
      <ProgressTracker currentStep={formState.step} totalSteps={totalSteps} />
      
      <form onSubmit={(e) => e.preventDefault()}>
        {renderStepContent()}
        
        <div className="flex justify-between mt-6">
          {formState.step > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous
            </Button>
          ) : (
            <div></div>
          )}
          
          {formState.step < totalSteps ? (
            <Button type="button" onClick={nextStep} className="bg-black hover:bg-gray-800">
              Continue
            </Button>
          ) : (
            <div></div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;
