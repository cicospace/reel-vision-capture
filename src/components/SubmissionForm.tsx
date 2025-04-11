
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Film, Clipboard, User, Video, Clapperboard, Sparkles } from "lucide-react";
import ProgressTracker from "./ProgressTracker";
import CheckboxGroup from "./CheckboxGroup";
import RadioGroupCustom from "./RadioGroupCustom";
import RepeatableField from "./RepeatableField";
import FileUploadField from "./FileUploadField";

type ReelExample = {
  id: string;
  link: string;
  comment: string;
};

type FormState = {
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
  logoFiles: File[];
  deckFiles: File[];
  credibilityMarkers: string[];
  otherCredibilityMarker: string;
  speakerBio: string;
  speakerBioFiles: File[];
  additionalInfo: string;
  step: number;
};

const initialFormState: FormState = {
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
  logoFiles: [],
  deckFiles: [],
  credibilityMarkers: [],
  otherCredibilityMarker: '',
  speakerBio: '',
  speakerBioFiles: [],
  additionalInfo: '',
  step: 1,
};

const toneOptions = [
  { id: 'inspirational', label: 'Inspirational' },
  { id: 'energetic', label: 'Energetic' },
  { id: 'authoritative', label: 'Authoritative' },
  { id: 'relatable', label: 'Relatable' },
  { id: 'thoughtProvoking', label: 'Thought-provoking' },
];

const durationOptions = [
  { id: 'under60', label: 'Under 60 seconds' },
  { id: '1-2min', label: '1–2 minutes' },
  { id: '2-3min', label: '2–3 minutes' },
];

const footageTypeOptions = [
  { id: 'keynote', label: 'Keynote footage' },
  { id: 'media', label: 'Media clips (TV, podcasts, etc.)' },
  { id: 'documentary', label: 'Documentaries' },
  { id: 'social', label: 'Social media videos' },
];

const credibilityOptions = [
  { id: 'author', label: 'Best-Selling Author' },
  { id: 'inc5000', label: 'Inc 5000 Honoree' },
  { id: 'tedx', label: 'TEDx Speaker' },
  { id: 'media', label: 'Featured in Major Media' },
];

const SubmissionForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const totalSteps = 5;

  const updateForm = (key: keyof FormState, value: any) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would send the data to a server here
    console.log('Form submitted:', formState);
    toast.success("Form submitted successfully!", {
      description: "We'll be in touch with you soon about your demo reel!",
    });
    
    // Reset form
    setFormState(initialFormState);
  };

  const renderStepContent = () => {
    switch (formState.step) {
      case 1:
        return (
          <div className="form-section border border-gray-200">
            <h2 className="section-title">
              <Clipboard size={20} className="text-reel-accent" />
              Project Preferences
            </h2>
            <div className="space-y-6">
              <CheckboxGroup
                label="Which tones best represent your brand?"
                options={toneOptions}
                selectedOptions={formState.tones}
                onChange={(value) => updateForm('tones', value)}
                otherOption={true}
                otherValue={formState.otherTone}
                onOtherChange={(value) => updateForm('otherTone', value)}
              />
              
              <RadioGroupCustom
                label="How long should the final demo reel be?"
                options={durationOptions}
                value={formState.duration}
                onChange={(value) => updateForm('duration', value)}
                otherOption={true}
                otherValue={formState.otherDuration}
                onOtherChange={(value) => updateForm('otherDuration', value)}
              />
              
              <RepeatableField
                label="Reels You Like (Add up to 3 examples)"
                items={formState.reelExamples}
                onChange={(items) => updateForm('reelExamples', items)}
                maxItems={3}
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="form-section border border-gray-200">
            <h2 className="section-title">
              <Video size={20} className="text-reel-accent" />
              Footage Submission
            </h2>
            <div className="space-y-6">
              <div>
                <Label className="input-label">Paste the Google Drive or Dropbox link with all your raw media</Label>
                <Input
                  value={formState.footageLink}
                  onChange={(e) => updateForm('footageLink', e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="text-input"
                />
              </div>
              
              <CheckboxGroup
                label="Check everything included in your footage folder:"
                options={footageTypeOptions}
                selectedOptions={formState.footageTypes}
                onChange={(value) => updateForm('footageTypes', value)}
                otherOption={true}
                otherValue={formState.otherFootageType}
                onOtherChange={(value) => updateForm('otherFootageType', value)}
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="form-section border border-gray-200">
            <h2 className="section-title">
              <Clapperboard size={20} className="text-reel-accent" />
              Creative Direction
            </h2>
            <div className="space-y-6">
              <div>
                <Label className="input-label">Share any general script or flow you'd like the reel to follow</Label>
                <Textarea
                  value={formState.scriptStructure}
                  onChange={(e) => updateForm('scriptStructure', e.target.value)}
                  placeholder="Describe your vision for the reel structure and flow..."
                  className="text-input h-32"
                />
              </div>
              
              <div>
                <Label className="input-label">List the clips (with timestamps if possible) that MUST be included</Label>
                <Textarea
                  value={formState.nonNegotiableClips}
                  onChange={(e) => updateForm('nonNegotiableClips', e.target.value)}
                  placeholder="e.g., 'Main_Stage_Talk.mp4' at 14:35 - audience standing ovation..."
                  className="text-input h-32"
                />
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="form-section border border-gray-200">
            <h2 className="section-title">
              <User size={20} className="text-reel-accent" />
              Credibility & Social Proof
            </h2>
            <div className="space-y-6">
              <div>
                <Label className="input-label">Paste any written testimonials or links to video testimonials</Label>
                <Textarea
                  value={formState.testimonials}
                  onChange={(e) => updateForm('testimonials', e.target.value)}
                  placeholder="Add testimonials that validate your expertise..."
                  className="text-input h-24"
                />
              </div>
              
              <FileUploadField
                label="Upload logos you'd like us to feature on your logo wall (PNG preferred)"
                accept="image/*"
                multiple={true}
                files={formState.logoFiles}
                onChange={(files) => updateForm('logoFiles', files)}
              />
              
              <FileUploadField
                label="Upload your keynote slide deck or key visuals you want us to use"
                description="Optional: Share your presentation materials"
                accept=".pdf,.ppt,.pptx,.key"
                multiple={false}
                files={formState.deckFiles}
                onChange={(files) => updateForm('deckFiles', files)}
              />
              
              <CheckboxGroup
                label="Which credibility markers apply to you?"
                options={credibilityOptions}
                selectedOptions={formState.credibilityMarkers}
                onChange={(value) => updateForm('credibilityMarkers', value)}
                otherOption={true}
                otherValue={formState.otherCredibilityMarker}
                onOtherChange={(value) => updateForm('otherCredibilityMarker', value)}
              />
              
              <div>
                <Label className="input-label">Upload or paste your most current speaker bio</Label>
                <Textarea
                  value={formState.speakerBio}
                  onChange={(e) => updateForm('speakerBio', e.target.value)}
                  placeholder="Paste your speaker bio here or upload a file below..."
                  className="text-input h-24 mb-3"
                />
                <FileUploadField
                  label=""
                  description="Optional: Upload your bio as a document"
                  accept=".pdf,.doc,.docx,.txt"
                  multiple={false}
                  files={formState.speakerBioFiles}
                  onChange={(files) => updateForm('speakerBioFiles', files)}
                />
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <div className="form-section border border-gray-200">
              <h2 className="section-title">
                <Film size={20} className="text-reel-accent" />
                Final Details
              </h2>
              <div>
                <Label className="input-label">Anything else you'd like us to know?</Label>
                <Textarea
                  value={formState.additionalInfo}
                  onChange={(e) => updateForm('additionalInfo', e.target.value)}
                  placeholder="Share any additional information that might help us create your perfect demo reel..."
                  className="text-input h-32"
                />
              </div>
            </div>
            
            <Card className="p-6 border-black/10 bg-gradient-to-b from-white to-gray-50">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-reel-accent" />
                Review Your Submission
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Once we receive all items, we'll review and confirm everything's good to go. If anything's missing, we'll reach out. Let's make something extraordinary.
              </p>
              <Button 
                onClick={handleSubmit}
                className="w-full bg-black hover:bg-gray-800 text-white"
              >
                Submit Demo Reel Request
              </Button>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

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
