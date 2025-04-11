
import { toast } from "sonner";
import emailjs from 'emailjs-com';

type EmailData = {
  to: string;
  subject: string;
  body: string;
};

// Initialize EmailJS with your User ID (should be done in a component that loads early)
export const initializeEmailJS = () => {
  // Replace with your actual EmailJS user ID
  emailjs.init("YOUR_USER_ID_HERE");
};

export const sendEmail = async (data: EmailData): Promise<boolean> => {
  try {
    console.log('Sending email to:', data.to);
    console.log('Subject:', data.subject);
    console.log('Body:', data.body);
    
    // Send the email using EmailJS
    const templateParams = {
      to_email: data.to,
      subject: data.subject,
      message: data.body
    };
    
    // Replace with your actual service ID and template ID
    await emailjs.send(
      "service_id",  // Replace with your EmailJS service ID
      "template_id", // Replace with your EmailJS template ID
      templateParams
    );
    
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
