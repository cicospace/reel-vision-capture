
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, LogOut } from "lucide-react";
import { toast } from "sonner";
import { clearAuthenticatedState, isAuthenticated } from "@/utils/authUtils";

type Submission = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  created_at: string;
};

const Admin = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check authentication
    const checkAuthentication = async () => {
      const authed = await isAuthenticated();
      if (!authed) {
        navigate('/auth');
        return;
      }
      fetchSubmissions();
    };

    checkAuthentication();
  }, [navigate]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('submissions')
        .select('id, first_name, last_name, email, status, created_at')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearAuthenticatedState();
      toast.success("Logged out successfully");
      navigate('/auth');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-card shadow">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut size={16} />
                Logout
              </Button>
              <Button onClick={() => navigate('/submit')} className="flex items-center gap-2">
                <PlusCircle size={16} />
                New Submission
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No submissions found.</p>
                <Button 
                  onClick={() => navigate('/submit')} 
                  variant="outline" 
                  className="mt-4"
                >
                  Create your first submission
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-left">
                    <tr className="border-b">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr 
                        key={submission.id} 
                        className="border-b hover:bg-secondary/10"
                      >
                        <td className="py-3 px-4">
                          {submission.first_name} {submission.last_name}
                        </td>
                        <td className="py-3 px-4">{submission.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            submission.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            submission.status === 'in-review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {submission.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Link 
                            to={`/submission/${submission.id}`}
                            state={{ from: location.pathname }}
                            className="inline-flex h-8 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
