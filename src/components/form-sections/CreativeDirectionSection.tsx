
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
};

export default CreativeDirectionSection;
