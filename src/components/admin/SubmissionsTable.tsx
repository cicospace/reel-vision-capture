
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteSubmission } from "@/utils/submission/deleteSubmission";
import { toast } from "sonner";

interface Submission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  created_at: string;
}

interface SubmissionsTableProps {
  submissions: Submission[];
  onViewSubmission: (id: string) => void;
  onSubmissionDeleted: (id: string) => void;
}

const SubmissionsTable = ({ 
  submissions, 
  onViewSubmission, 
  onSubmissionDeleted 
}: SubmissionsTableProps) => {
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteSubmission = async () => {
    if (!submissionToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteSubmission(submissionToDelete);
      if (success) {
        toast.success("Submission deleted successfully");
        onSubmissionDeleted(submissionToDelete);
      }
    } finally {
      setIsDeleting(false);
      setSubmissionToDelete(null);
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
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
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
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewSubmission(submission.id)}
                  >
                    View
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setSubmissionToDelete(submission.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this submission from {submission.first_name} {submission.last_name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSubmissionToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteSubmission}
                          className="bg-red-500 hover:bg-red-600"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubmissionsTable;
