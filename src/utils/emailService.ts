import { toast } from "sonner";

type EmailData = {
  to: string;
  subject: string;
  body: string;
};

// This function is no longer needed with our alternative approach
export const initializeEmailJS = () => {
  // This is kept as a no-op to avoid breaking existing code
  console.log("Using alternative email submission method");
};

export const sendEmail = async (data: EmailData): Promise<boolean> => {
  try {
    console.log('Sending email to:', data.to);
    console.log('Subject:', data.subject);
    console.log('Body:', data.body);
    
    // Using Formspree - a built-in email notification service
    // This approach doesn't require API keys in your frontend code
    const response = await fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: data.to,
        subject: data.subject,
        message: data.body,
        _subject: `Demo Reel Submission - ${new Date().toLocaleDateString()}`,
        _replyto: "no-reply@cicospace.com",
      })
    });
    
    if (!response.ok) {
      throw new Error("Form submission failed");
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Format submission data into an email body
export const formatEmailBody = (formData: any): string => {
  let body = `Demo Reel Submission\n\n`;
  
  // Project Preferences
  body += `== PROJECT PREFERENCES ==\n`;
  body += `Tones: ${formData.tones.join(', ')}\n`;
  if (formData.tones.includes('other')) {
    body += `Other tone: ${formData.otherTone}\n`;
  }
  body += `Duration: ${formData.duration}\n`;
  if (formData.duration === 'other') {
    body += `Other duration: ${formData.otherDuration}\n`;
  }
  
  // Reel Examples
  body += `\nReel Examples:\n`;
  formData.reelExamples.forEach((example: any, index: number) => {
    body += `Example ${index + 1}: ${example.link} - ${example.comment}\n`;
  });
  
  // Footage Submission
  body += `\n== FOOTAGE SUBMISSION ==\n`;
  body += `Footage Link: ${formData.footageLink}\n`;
  body += `Footage Types: ${formData.footageTypes.join(', ')}\n`;
  if (formData.footageTypes.includes('other')) {
    body += `Other footage type: ${formData.otherFootageType}\n`;
  }
  
  // Creative Direction
  body += `\n== CREATIVE DIRECTION ==\n`;
  body += `Script Structure: ${formData.scriptStructure}\n\n`;
  body += `Non-Negotiable Clips: ${formData.nonNegotiableClips}\n`;
  
  // Credibility & Social Proof
  body += `\n== CREDIBILITY & SOCIAL PROOF ==\n`;
  body += `Testimonials: ${formData.testimonials}\n`;
  body += `Logo Folder Link: ${formData.logoFolderLink}\n`;
  body += `Credibility Markers: ${formData.credibilityMarkers.join(', ')}\n`;
  if (formData.credibilityMarkers.includes('other')) {
    body += `Other credibility marker: ${formData.otherCredibilityMarker}\n`;
  }
  body += `Speaker Bio: ${formData.speakerBio}\n`;
  
  // Additional Info
  body += `\n== ADDITIONAL INFORMATION ==\n`;
  body += `${formData.additionalInfo}\n`;
  
  // Files note
  body += `\nNote: Any uploaded files were not included in this email. Please check the form system for attached files.\n`;
  
  return body;
};
