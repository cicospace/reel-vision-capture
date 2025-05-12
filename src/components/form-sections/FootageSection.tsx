
import React from 'react';
import { Video, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CheckboxGroup from "@/components/CheckboxGroup";
import { useFormContext } from "@/context/FormContext";

const footageTypeOptions = [
  { id: 'keynote', label: 'Keynote footage' },
  { id: 'media', label: 'Media clips (TV, podcasts, etc.)' },
  { id: 'documentary', label: 'Documentaries' },
];

const FootageSection: React.FC = () => {
  const { formState, updateForm } = useFormContext();

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
};

export default FootageSection;
