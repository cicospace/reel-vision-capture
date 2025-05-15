
import React from 'react';
import { Film, Info, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useFormContext } from "@/context/FormContext";

const FinalDetailsSection: React.FC = () => {
  const { formState, updateForm, handleSubmit, isSubmitting } = useFormContext();

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
          onClick={(e) => {
            e.preventDefault();
            console.log("Submit button clicked");
            handleSubmit(e);
          }}
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
};

export default FinalDetailsSection;
