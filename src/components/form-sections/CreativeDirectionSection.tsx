import React from 'react';
import { Clapperboard, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFormContext } from "@/context/FormContext";

const CreativeDirectionSection: React.FC = () => {
  const { formState, updateForm } = useFormContext();

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
          <Label className="input-label">Already have a specific structure in mind? Upload or paste your outline here so we can match your vision. If you'd rather we craft the narrative from scratch, just leave this blank — we've got you.</Label>
          <Textarea
            value={formState.scriptStructure}
            onChange={(e) => updateForm('scriptStructure', e.target.value)}
            placeholder="Add a Google Doc link with your vision for the reel structure and flow, or leave blank if you'd like us to create the narrative..."
            className="text-input h-32"
          />
        </div>
        
        <div>
          <Label className="input-label">List the clips that MUST be included (Google Doc link preferred) *</Label>
          <Textarea
            value={formState.nonNegotiableClips}
            onChange={(e) => updateForm('nonNegotiableClips', e.target.value)}
            placeholder="Add a Google Doc link with your required clips and timestamps, or enter N/A if not applicable..."
            className="text-input h-32"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CreativeDirectionSection;
