
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logNavigation } from "@/utils/loggingUtils";

// Import refactored components
import AdminHeader from "@/components/admin/AdminHeader";
import SearchAndFilter from "@/components/admin/SearchAndFilter";
import SubmissionsTable from "@/components/admin/SubmissionsTable";
import LoadingState from "@/components/admin/LoadingState";
import EmptyState from "@/components/admin/EmptyState";

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
    console.log("Admin page mounted");
    fetchSubmissions();
  }, [filter]);

  const viewSubmission = (id: string) => {
    console.log(`Navigating to submission detail: ${id}`);
    logNavigation("/admin", `/submission/${id}`, { id });
    navigate(`/submission/${id}`);
  };

  const handleSubmissionDeleted = (id: string) => {
    setSubmissions(submissions.filter(sub => sub.id !== id));
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-card shadow rounded-lg p-6">
          <SearchAndFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filter={filter}
            setFilter={setFilter}
            onRefresh={fetchSubmissions}
          />

          {loading ? (
            <LoadingState />
          ) : filteredSubmissions.length === 0 ? (
            <EmptyState />
          ) : (
            <SubmissionsTable 
              submissions={filteredSubmissions} 
              onViewSubmission={viewSubmission}
              onSubmissionDeleted={handleSubmissionDeleted}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
