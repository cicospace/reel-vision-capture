
import React from 'react';
import { User, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFormContext } from "@/context/FormContext";

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
          <Label className="input-label">Add any testimonials you'd like us to consider (Google Doc link preferred) *</Label>
          <Textarea
            value={formState.testimonials}
            onChange={(e) => updateForm('testimonials', e.target.value)}
            placeholder="Add a Google Doc link with testimonials that validate your expertise, or enter N/A if not applicable..."
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
        
        <div>
          <Label className="input-label">Paste the Google Drive or Dropbox link to your keynote slide deck or key visuals *</Label>
          <Input
            value={formState.deckFilesLink}
            onChange={(e) => updateForm('deckFilesLink', e.target.value)}
            placeholder="https://drive.google.com/... or enter N/A if not applicable"
            className="text-input"
            required
          />
          <p className="text-sm text-muted-foreground mt-1">Share your presentation materials to help us visualize your content.</p>
        </div>
        
        <div>
          <Label className="input-label">Paste the Google Drive or Dropbox link to your branding guidelines *</Label>
          <Input
            value={formState.brandingGuidelinesFilesLink}
            onChange={(e) => updateForm('brandingGuidelinesFilesLink', e.target.value)}
            placeholder="https://drive.google.com/... or enter N/A if not applicable"
            className="text-input"
            required
          />
          <p className="text-sm text-muted-foreground mt-1">Share your brand guidelines to ensure we maintain your brand consistency.</p>
        </div>
        
        <div>
          <Label className="input-label">List any achievements or proof points you want showcased—one per line.</Label>
          <Textarea
            value={formState.credibilityMarkers}
            onChange={(e) => updateForm('credibilityMarkers', e.target.value)}
            placeholder="Best-selling author: [Book Title]&#10;TEDx Speaker&#10;Featured in Forbes&#10;Worked with Fortune 500 companies&#10;Winner of [Award Name]&#10;[Your impressive stats/achievements]"
            className="text-input h-32"
          />
        </div>
        
        <div>
          <Label className="input-label">Your current speaker bio (Google Doc link preferred) *</Label>
          <Textarea
            value={formState.speakerBio}
            onChange={(e) => updateForm('speakerBio', e.target.value)}
            placeholder="Add a Google Doc link with your speaker bio, or paste it directly here..."
            className="text-input h-24 mb-3"
            required
          />
        </div>
        
        <div>
          <Label className="input-label">Paste the Google Drive or Dropbox link to your speaker bio files (optional)</Label>
          <Input
            value={formState.speakerBioFilesLink}
            onChange={(e) => updateForm('speakerBioFilesLink', e.target.value)}
            placeholder="https://drive.google.com/... or enter N/A if not applicable"
            className="text-input"
          />
          <p className="text-sm text-muted-foreground mt-1">Optional: Share any additional speaker bio documents.</p>
        </div>
      </div>
    </div>
  );
};

export default CredibilitySection;
