
import { toast } from "sonner";

type EmailData = {
  to: string;
  subject: string;
  body: string;
};

export const sendEmail = async (data: EmailData): Promise<boolean> => {
  // In a production environment, you would connect to a real email service
  // For this implementation, we'll use EmailJS as it's client-side friendly
  // You would need to replace the service_id, template_id, and user_id with your actual EmailJS credentials
  
  try {
    // For demo purposes, we'll simulate success but log to console
    console.log('Sending email to:', data.to);
    console.log('Subject:', data.subject);
    console.log('Body:', data.body);
    
    // In a real implementation with EmailJS, you would use code like:
    // await emailjs.send(
    //   "service_id",
    //   "template_id",
    //   { 
    //     to_email: data.to,
    //     subject: data.subject,
    //     message: data.body
    //   },
    //   "user_id"
    // );
    
    // For now, we'll simulate success with a 1-second delay
    await new Promise(resolve => setTimeout(resolve, 1000));
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
