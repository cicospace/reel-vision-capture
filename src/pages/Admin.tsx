
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { LogOut, Search, Filter, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('submissions')
        .select('id, first_name, last_name, email, status, created_at')
        .order('created_at', { ascending: false });
      
      if (filter !== "all") {
        query = query.eq('status', filter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setSubmissions(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch submissions", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error("Logout failed", {
        description: error.message
      });
    }
  };

  const viewSubmission = (id: string) => {
    navigate(`/submission/${id}`);
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'new':
        return { variant: "default" as const, label: "New" };
      case 'in-review':
        return { variant: "secondary" as const, label: "In Review" };
      case 'complete':
        return { variant: "outline" as const, label: "Complete" };
      default:
        return { variant: "default" as const, label: status };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow">
        <div className="container max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/a2a809e3-8770-41b2-bd3e-c4dc102d1aa9.png" 
                alt="Cicospace Logo" 
                className="h-8 mr-2"
              />
              <h1 className="text-xl font-semibold text-foreground">Demo Reel Submissions</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-card shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search submissions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2 w-full sm:w-auto">
              <div className="flex items-center space-x-2">
                <Filter className="text-muted-foreground h-4 w-4" />
                <select
                  className="form-select border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="in-review">In Review</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
              <Button size="sm" variant="outline" onClick={fetchSubmissions}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.first_name} {submission.last_name}
                      </TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(submission.status).variant}>
                          {getStatusBadgeVariant(submission.status).label}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(submission.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewSubmission(submission.id)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
