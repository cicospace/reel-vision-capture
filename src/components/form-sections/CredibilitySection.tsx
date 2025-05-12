
import React from 'react';
import { User, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FileUploadField from "@/components/FileUploadField";
import CheckboxGroup from "@/components/CheckboxGroup";
import { useFormContext } from "@/context/FormContext";

const credibilityOptions = [
  { id: 'author', label: 'Best-Selling Author' },
  { id: 'inc5000', label: 'Inc 5000 Honoree' },
  { id: 'tedx', label: 'TEDx Speaker' },
  { id: 'media', label: 'Featured in Major Media' },
];

const CredibilitySection: React.FC = () => {
  const { formState, updateForm } = useFormContext();

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
};

export default CredibilitySection;
