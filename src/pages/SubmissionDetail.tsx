
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Film, Clipboard, User, Video, Clapperboard, Sparkles, Check, Download } from "lucide-react";
import AuthWrapper from "@/components/AuthWrapper";
import { toast } from "sonner";

type Submission = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  cell_phone: string;
  website: string;
  problem_solved: string;
  tone: string[];
  other_tone?: string;
  duration: string;
  other_duration?: string;
  footage_link: string;
  footage_types: string[];
  other_footage_type?: string;
  script_structure: string;
  non_negotiable_clips: string;
  testimonials: string;
  logo_folder_link: string;
  credibility_markers: string[];
  other_credibility_marker?: string;
  speaker_bio: string;
  additional_info: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type ReelExample = {
  id: string;
  link: string;
  comment: string;
};

type SubmissionFile = {
  id: string;
  file_type: string;
  file_path: string;
  file_name: string;
};

type Note = {
  id: string;
  note: string;
  created_by: string;
  created_at: string;
};

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [reelExamples, setReelExamples] = useState<ReelExample[]>([]);
  const [files, setFiles] = useState<SubmissionFile[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserEmail(data.user.email || "");
      }
    };

    fetchUserInfo();
    fetchSubmissionData();
  }, [id]);

  const fetchSubmissionData = async () => {
    if (!id) return;
    
    setLoading(true);
    
    try {
      // Fetch submission
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', id)
        .single();
        
      if (submissionError) throw submissionError;
      setSubmission(submissionData);
      
      // Fetch reel examples
      const { data: reelData, error: reelError } = await supabase
        .from('reel_examples')
        .select('*')
        .eq('submission_id', id);
      
      if (reelError) throw reelError;
      setReelExamples(reelData || []);
      
      // Fetch files
      const { data: fileData, error: fileError } = await supabase
        .from('submission_files')
        .select('*')
        .eq('submission_id', id);
      
      if (fileError) throw fileError;
      setFiles(fileData || []);
      
      // Fetch notes
      const { data: noteData, error: noteError } = await supabase
        .from('submission_notes')
        .select('*')
        .eq('submission_id', id)
        .order('created_at', { ascending: false });
      
      if (noteError) throw noteError;
      setNotes(noteData || []);
      
    } catch (error: any) {
      toast.error("Failed to fetch submission details", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!id) return;
    
    setUpdatingStatus(true);
    
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      if (submission) {
        setSubmission({ ...submission, status: newStatus });
      }
      
      toast.success("Status updated successfully");
    } catch (error: any) {
      toast.error("Failed to update status", {
        description: error.message
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const addNote = async () => {
    if (!id || !newNote.trim()) return;
    
    setAddingNote(true);
    
    try {
      const { data, error } = await supabase
        .from('submission_notes')
        .insert([
          {
            submission_id: id,
            note: newNote.trim(),
            created_by: userEmail
          }
        ])
        .select();
      
      if (error) throw error;
      
      if (data) {
        setNotes([data[0], ...notes]);
        setNewNote("");
      }
      
      toast.success("Note added successfully");
    } catch (error: any) {
      toast.error("Failed to add note", {
        description: error.message
      });
    } finally {
      setAddingNote(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AuthWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </AuthWrapper>
    );
  }

  if (!submission) {
    return (
      <AuthWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Submission not found</h2>
            <p className="text-gray-500 mt-2">The requested submission could not be found.</p>
            <Button className="mt-4" onClick={() => navigate('/admin')}>
              Go Back to Dashboard
            </Button>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
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
                <h1 className="text-xl font-semibold">
                  {submission.first_name} {submission.last_name}'s Submission
                </h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500 mr-2">Status:</div>
                <select
                  className="form-select border rounded-md px-3 py-1 text-sm"
                  value={submission.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  disabled={updatingStatus}
                >
                  <option value="new">New</option>
                  <option value="in-review">In Review</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        <main className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - submission details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-lg font-medium flex items-center mb-4">
                  <User className="h-5 w-5 mr-2 text-gray-600" />
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Name</div>
                    <div>{submission.first_name} {submission.last_name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Email</div>
                    <div>{submission.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Phone</div>
                    <div>{submission.cell_phone}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Website</div>
                    <div>{submission.website}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Problem Solved</div>
                  <div className="bg-gray-50 p-3 rounded-md">{submission.problem_solved}</div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-lg font-medium flex items-center mb-4">
                  <Clipboard className="h-5 w-5 mr-2 text-gray-600" />
                  Project Preferences
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Tone</div>
                    <div>
                      {submission.tone.map((t) => t === 'other' ? submission.other_tone : t).join(', ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Duration</div>
                    <div>
                      {submission.duration === 'other' ? submission.other_duration : submission.duration}
                    </div>
                  </div>
                </div>
                
                {reelExamples.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">Reel Examples</div>
                    <div className="space-y-3">
                      {reelExamples.map((example, index) => (
                        <div key={example.id} className="bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center">
                            <div className="font-medium">Example {index + 1}</div>
                            <a href={example.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-blue-500 hover:text-blue-700">
                              View Link
                            </a>
                          </div>
                          <div className="text-sm mt-1">{example.comment}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
              
              <Card className="p-6">
                <h2 className="text-lg font-medium flex items-center mb-4">
                  <Video className="h-5 w-5 mr-2 text-gray-600" />
                  Footage Submission
                </h2>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Footage Link</div>
                  <div className="flex items-center">
                    <a href={submission.footage_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                      {submission.footage_link}
                    </a>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Footage Types</div>
                  <div>
                    {submission.footage_types.map((t) => t === 'other' ? submission.other_footage_type : t).join(', ')}
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-lg font-medium flex items-center mb-4">
                  <Clapperboard className="h-5 w-5 mr-2 text-gray-600" />
                  Creative Direction
                </h2>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Script Structure</div>
                  <div className="bg-gray-50 p-3 rounded-md whitespace-pre-line">{submission.script_structure}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Non-Negotiable Clips</div>
                  <div className="bg-gray-50 p-3 rounded-md whitespace-pre-line">{submission.non_negotiable_clips}</div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-lg font-medium flex items-center mb-4">
                  <Sparkles className="h-5 w-5 mr-2 text-gray-600" />
                  Credibility & Social Proof
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Credibility Markers</div>
                    <div>
                      {submission.credibility_markers.map((t) => t === 'other' ? submission.other_credibility_marker : t).join(', ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Logo Folder Link</div>
                    <div>
                      <a href={submission.logo_folder_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                        {submission.logo_folder_link}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Testimonials</div>
                  <div className="bg-gray-50 p-3 rounded-md whitespace-pre-line">{submission.testimonials}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Speaker Bio</div>
                  <div className="bg-gray-50 p-3 rounded-md whitespace-pre-line">{submission.speaker_bio}</div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-lg font-medium flex items-center mb-4">
                  <Film className="h-5 w-5 mr-2 text-gray-600" />
                  Final Details
                </h2>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Additional Information</div>
                  <div className="bg-gray-50 p-3 rounded-md whitespace-pre-line">{submission.additional_info}</div>
                </div>
              </Card>
            </div>
            
            {/* Sidebar - notes and files */}
            <div className="space-y-6">
              {/* Files */}
              <Card className="p-6">
                <h2 className="text-lg font-medium mb-4">Uploaded Files</h2>
                
                {files.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No files uploaded
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center overflow-hidden">
                          <div className="min-w-0 truncate">{file.file_name}</div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
              
              {/* Notes */}
              <Card className="p-6">
                <h2 className="text-lg font-medium mb-4">Notes</h2>
                
                <div className="mb-4">
                  <Textarea
                    placeholder="Add a note about this submission..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                    className="mb-2"
                  />
                  <Button 
                    onClick={addNote} 
                    disabled={!newNote.trim() || addingNote}
                    className="w-full"
                  >
                    {addingNote ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Check className="mr-2 h-4 w-4" /> Add Note
                      </span>
                    )}
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                {notes.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No notes yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="text-sm font-medium">{note.created_by}</div>
                          <div className="text-xs text-gray-500">{formatDate(note.created_at)}</div>
                        </div>
                        <div className="mt-2 whitespace-pre-line">{note.note}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
              
              {/* Metadata */}
              <Card className="p-4">
                <div className="text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Submitted:</span>
                    <span>{formatDate(submission.created_at)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Last Updated:</span>
                    <span>{formatDate(submission.updated_at)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-mono text-xs">{submission.id}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthWrapper>
  );
};

export default SubmissionDetail;
