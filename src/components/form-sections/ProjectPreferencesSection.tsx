
import React from 'react';
import { Clipboard, Info } from "lucide-react";
import RadioGroupCustom from "@/components/RadioGroupCustom";
import RepeatableField from "@/components/RepeatableField";
import { useFormContext } from "@/context/FormContext";

const toneOptions = [
  { id: 'inspirational', label: 'Inspirational' },
  { id: 'energetic', label: 'Energetic' },
  { id: 'authoritative', label: 'Authoritative' },
];

const durationOptions = [
  { id: '2-3min', label: '2–3 minutes' },
  { id: '3-4min', label: '3–4 minutes (recommended)' },
];

const ProjectPreferencesSection: React.FC = () => {
  const { formState, updateForm } = useFormContext();

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
};

export default ProjectPreferencesSection;
