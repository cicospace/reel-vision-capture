
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type Submission = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  cell_phone: string;
  website: string;
  problem_solved: string;
  status: string;
  // Add other fields as needed
  created_at: string;
  updated_at: string;
};

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    
    supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching submission:', error);
        } else {
          setSubmission(data);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">Submission not found</h2>
          <p className="text-muted-foreground mt-2">The requested submission could not be found.</p>
          <Button className="mt-4" onClick={() => navigate('/admin')}>
            Go Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow">
        <div className="container max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/admin')}
                className="mr-2"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-foreground">
                {submission.first_name} {submission.last_name}'s Submission
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>Name:</strong> {submission.first_name} {submission.last_name}
            </p>
            <p>
              <strong>Email:</strong> {submission.email}
            </p>
            <p>
              <strong>Phone:</strong> {submission.cell_phone}
            </p>
            <p>
              <strong>Website:</strong> {submission.website}
            </p>
            <p>
              <strong>Problem Solved:</strong> {submission.problem_solved}
            </p>
            <p>
              <strong>Status:</strong> {submission.status}
            </p>
            <p>
              <strong>Created At:</strong> {new Date(submission.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong> {new Date(submission.updated_at).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SubmissionDetail;
