
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

type ReelExample = {
  id: string;
  link: string;
  comment: string;
};

type Submission = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  cell_phone: string;
  website: string;
  problem_solved: string;
  tone: string[];
  other_tone: string | null;
  duration: string;
  other_duration: string | null;
  reel_examples: ReelExample[];
  footage_link: string;
  footage_types: string[];
  other_footage_type: string | null;
  script_structure: string;
  non_negotiable_clips: string;
  testimonials: string;
  logo_folder_link: string;
  credibility_markers: string[];
  other_credibility_marker: string | null;
  speaker_bio: string;
  status: string;
  additional_info: string;
  created_at: string;
  updated_at: string;
};

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select(`
            *,
            reel_examples (
              id,
              link,
              comment
            )
          `)
          .eq('id', id)
          .maybeSingle();
          
        if (error) {
          throw error;
        }
        
        if (!data) {
          setError('Submission not found');
        } else {
          setSubmission(data);
        }
      } catch (err) {
        console.error('Error fetching submission:', err);
        setError('Failed to load submission details');
        toast({
          title: "Error",
          description: "Failed to load submission details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissionDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            {error || "Submission not found"}
          </h2>
          <p className="text-muted-foreground mt-2">
            The requested submission could not be found or loaded.
          </p>
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
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <strong>Website:</strong> {" "}
                  {submission.website && (
                    <a 
                      href={submission.website.startsWith('http') ? submission.website : `https://${submission.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {submission.website}
                    </a>
                  )}
                </p>
                <p>
                  <strong>Problem Solved:</strong> {submission.problem_solved}
                </p>
                <p>
                  <strong>Status:</strong> {" "}
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary">
                    {submission.status}
                  </span>
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium">Project Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>
                  <strong>Tone:</strong> {submission.tone.join(', ')}
                  {submission.other_tone && ` (${submission.other_tone})`}
                </p>
                <p>
                  <strong>Duration:</strong> {submission.duration}
                  {submission.other_duration && ` (${submission.other_duration})`}
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium">Reel Examples</h3>
              {submission.reel_examples && submission.reel_examples.length > 0 ? (
                <ul className="space-y-2">
                  {submission.reel_examples.map(example => (
                    <li key={example.id} className="p-3 bg-muted rounded-md">
                      <a 
                        href={example.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {example.link}
                      </a>
                      {example.comment && (
                        <p className="text-sm text-muted-foreground mt-1">
                          "{example.comment}"
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No reel examples provided.</p>
              )}
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium">Footage Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <p>
                  <strong>Footage Link:</strong>{" "}
                  {submission.footage_link && (
                    <a 
                      href={submission.footage_link.startsWith('http') ? submission.footage_link : `https://${submission.footage_link}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {submission.footage_link}
                    </a>
                  )}
                </p>
                <p>
                  <strong>Footage Types:</strong> {submission.footage_types.join(', ')}
                  {submission.other_footage_type && ` (${submission.other_footage_type})`}
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium">Creative Direction</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <strong>Script Structure:</strong>
                  <p className="mt-1 text-muted-foreground">{submission.script_structure}</p>
                </div>
                <div>
                  <strong>Non-Negotiable Clips:</strong>
                  <p className="mt-1 text-muted-foreground">{submission.non_negotiable_clips}</p>
                </div>
                <div>
                  <strong>Testimonials:</strong>
                  <p className="mt-1 text-muted-foreground">{submission.testimonials}</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium">Credibility & Branding</h3>
              <div className="grid grid-cols-1 gap-4">
                <p>
                  <strong>Logo Folder Link:</strong>{" "}
                  {submission.logo_folder_link && (
                    <a 
                      href={submission.logo_folder_link.startsWith('http') ? submission.logo_folder_link : `https://${submission.logo_folder_link}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {submission.logo_folder_link}
                    </a>
                  )}
                </p>
                <p>
                  <strong>Credibility Markers:</strong> {submission.credibility_markers.join(', ')}
                  {submission.other_credibility_marker && ` (${submission.other_credibility_marker})`}
                </p>
                <div>
                  <strong>Speaker Bio:</strong>
                  <p className="mt-1 text-muted-foreground">{submission.speaker_bio}</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <div>
                <p className="text-muted-foreground">{submission.additional_info}</p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium">Submission Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(submission.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Updated At:</strong>{" "}
                  {new Date(submission.updated_at).toLocaleString()}
                </p>
              </div>
            </section>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default SubmissionDetail;
