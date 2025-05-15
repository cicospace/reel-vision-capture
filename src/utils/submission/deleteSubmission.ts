
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function deleteSubmission(submissionId: string): Promise<boolean> {
  try {
    console.log(`Attempting to delete submission with ID: ${submissionId}`);
    
    // First delete any reel examples associated with this submission
    const { error: reelExamplesError } = await supabase
      .from('reel_examples')
      .delete()
      .eq('submission_id', submissionId);
    
    if (reelExamplesError) {
      console.error('Error deleting reel examples:', reelExamplesError);
      // Continue with deletion of main record even if reel examples deletion fails
    }
    
    // Delete any notes associated with this submission
    const { error: notesError } = await supabase
      .from('submission_notes')
      .delete()
      .eq('submission_id', submissionId);
    
    if (notesError) {
      console.error('Error deleting submission notes:', notesError);
      // Continue with deletion of main record even if notes deletion fails
    }
    
    // Delete any files associated with this submission
    const { error: filesError } = await supabase
      .from('submission_files')
      .delete()
      .eq('submission_id', submissionId);
    
    if (filesError) {
      console.error('Error deleting submission files:', filesError);
      // Continue with deletion of main record even if files deletion fails
    }
    
    // Finally delete the submission record itself
    const { error: submissionError } = await supabase
      .from('submissions')
      .delete()
      .eq('id', submissionId);
    
    if (submissionError) {
      console.error('Error deleting submission:', submissionError);
      toast.error("Failed to delete submission", {
        description: submissionError.message
      });
      return false;
    }
    
    console.log(`Successfully deleted submission with ID: ${submissionId}`);
    return true;
  } catch (error: any) {
    console.error('Unexpected error during submission deletion:', error);
    toast.error("Unexpected error during deletion", {
      description: error.message || "Please try again later"
    });
    return false;
  }
}
