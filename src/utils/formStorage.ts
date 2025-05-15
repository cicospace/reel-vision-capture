
import { toast } from "sonner";

// Add a type for form data persistence
export type StoredFormData = {
  timestamp: string;
  data: any;
  status: 'draft' | 'failed';
};

// Function to save form data to localStorage
export const saveFormToStorage = (formData: any) => {
  try {
    const storedData: StoredFormData = {
      timestamp: new Date().toISOString(),
      data: formData,
      status: 'draft'
    };
    localStorage.setItem('demoReelFormData', JSON.stringify(storedData));
    console.log('Form data saved to localStorage');
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

// Function to load form data from localStorage
export const loadFormFromStorage = (): StoredFormData | null => {
  try {
    const savedData = localStorage.getItem('demoReelFormData');
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Error loading form data:', error);
    return null;
  }
};

// Function to clear form data from localStorage
export const clearStoredFormData = () => {
  try {
    localStorage.removeItem('demoReelFormData');
    console.log('Form data cleared from localStorage');
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
};
