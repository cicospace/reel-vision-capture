
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, Info } from "lucide-react";
import { useFormContext } from "@/context/FormContext";

const ContactInfoSection: React.FC = () => {
  const { formState, updateForm } = useFormContext();

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
};

export default ContactInfoSection;
