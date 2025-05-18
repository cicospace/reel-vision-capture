
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, CardHeader, CardTitle, CardContent, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, User, Phone, Globe, FileText, Calendar,
  Award, Clock, Folder, Info, Link, Layout, LayoutDashboard
} from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  // Helper function for formatting dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'default';
      case 'approved': return 'secondary';
      case 'completed': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'default';
    }
  };

  // Helper function for external links
  const formatExternalLink = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="container max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/admin')}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-foreground flex items-center">
                <User className="h-5 w-5 mr-2 text-muted-foreground" />
                {submission.first_name} {submission.last_name}'s Submission
              </h1>
            </div>
            <Badge variant={getStatusBadgeVariant(submission.status)}>
              {submission.status}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-5xl mx-auto overflow-hidden">
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-card p-0">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none py-3"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="content" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none py-3"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Content Details
                </TabsTrigger>
                <TabsTrigger 
                  value="branding" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none py-3"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Branding
                </TabsTrigger>
                <TabsTrigger 
                  value="info" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none py-3"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Additional Info
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Contact Information Card */}
                  <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <User className="h-5 w-5 mr-2 text-primary" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Name</p>
                          <p className="text-foreground">{submission.first_name} {submission.last_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <p className="text-foreground">{submission.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Phone</p>
                          <p className="text-foreground">{submission.cell_phone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Website</p>
                          {submission.website ? (
                            <a 
                              href={formatExternalLink(submission.website)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center"
                            >
                              {submission.website}
                              <Link className="h-3 w-3 ml-1" />
                            </a>
                          ) : (
                            <p className="text-muted-foreground">Not provided</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground">Problem Solved</p>
                        <p className="text-foreground">{submission.problem_solved}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Project Preferences Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Layout className="h-5 w-5 mr-2 text-primary" />
                        Project Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Tone</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {submission.tone.map((item) => (
                              <Badge key={item} variant="secondary" className="mr-1 mb-1">
                                {item}
                              </Badge>
                            ))}
                            {submission.other_tone && (
                              <Badge variant="outline" className="mr-1 mb-1">
                                {submission.other_tone}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Duration</p>
                          <p className="text-foreground">
                            {submission.duration}
                            {submission.other_duration && ` (${submission.other_duration})`}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Status</p>
                          <Badge variant={getStatusBadgeVariant(submission.status)}>
                            {submission.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timeline Card */}
                  <Card className="lg:col-span-3">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Created</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(submission.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Last Updated</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(submission.updated_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Content Details Tab */}
              <TabsContent value="content" className="p-6 space-y-6">
                {/* Reel Examples */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Reel Examples
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {submission.reel_examples && submission.reel_examples.length > 0 ? (
                      <div className="space-y-3">
                        {submission.reel_examples.map((example, index) => (
                          <div key={example.id} className="bg-muted rounded-md p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <a 
                                  href={example.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center"
                                >
                                  <Link className="h-4 w-4 mr-1" />
                                  Example {index + 1}
                                </a>
                                {example.comment && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    "{example.comment}"
                                  </p>
                                )}
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      onClick={() => window.open(example.link, '_blank')}
                                    >
                                      View
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Open in new tab</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No reel examples provided.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Footage Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Folder className="h-5 w-5 mr-2 text-primary" />
                      Footage Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Footage Link</p>
                        {submission.footage_link ? (
                          <a 
                            href={formatExternalLink(submission.footage_link)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center"
                          >
                            {submission.footage_link}
                            <Link className="h-3 w-3 ml-1" />
                          </a>
                        ) : (
                          <p className="text-muted-foreground">Not provided</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Footage Types</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {submission.footage_types.map((type) => (
                            <Badge key={type} variant="secondary" className="mr-1 mb-1">
                              {type}
                            </Badge>
                          ))}
                          {submission.other_footage_type && (
                            <Badge variant="outline" className="mr-1 mb-1">
                              {submission.other_footage_type}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Creative Direction */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Layout className="h-5 w-5 mr-2 text-primary" />
                      Creative Direction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="script-structure">
                        <AccordionTrigger className="text-md font-medium">
                          Script Structure
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="whitespace-pre-wrap text-muted-foreground">
                            {submission.script_structure || "Not provided"}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="non-negotiable-clips">
                        <AccordionTrigger className="text-md font-medium">
                          Non-Negotiable Clips
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="whitespace-pre-wrap text-muted-foreground">
                            {submission.non_negotiable_clips || "Not provided"}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="testimonials">
                        <AccordionTrigger className="text-md font-medium">
                          Testimonials
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="whitespace-pre-wrap text-muted-foreground">
                            {submission.testimonials || "Not provided"}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Branding Tab */}
              <TabsContent value="branding" className="p-6">
                <div className="space-y-6">
                  {/* Logo and Branding */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Award className="h-5 w-5 mr-2 text-primary" />
                        Logo & Branding
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium text-muted-foreground">Logo Folder Link</p>
                      {submission.logo_folder_link ? (
                        <a 
                          href={formatExternalLink(submission.logo_folder_link)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center"
                        >
                          {submission.logo_folder_link}
                          <Link className="h-3 w-3 ml-1" />
                        </a>
                      ) : (
                        <p className="text-muted-foreground">Not provided</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Credibility Markers */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Award className="h-5 w-5 mr-2 text-primary" />
                        Credibility Markers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Selected Markers</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {submission.credibility_markers.map((marker) => (
                              <Badge key={marker} variant="secondary" className="mr-1 mb-1">
                                {marker}
                              </Badge>
                            ))}
                            {submission.other_credibility_marker && (
                              <Badge variant="outline" className="mr-1 mb-1">
                                {submission.other_credibility_marker}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Speaker Bio</p>
                          <div className="mt-2 p-4 bg-muted rounded-md">
                            <p className="whitespace-pre-wrap text-foreground">
                              {submission.speaker_bio || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Additional Info Tab */}
              <TabsContent value="info" className="p-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Info className="h-5 w-5 mr-2 text-primary" />
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="whitespace-pre-wrap text-foreground">
                        {submission.additional_info || "No additional information provided."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-center p-6 pt-0">
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
