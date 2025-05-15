
// Type for submission response
export type SubmissionResponse = {
  success: boolean;
  submissionId?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  }
};
