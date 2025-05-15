
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminHeaderProps {
  onLogout?: () => void;
}

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
      if (onLogout) onLogout();
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error("Logout failed", {
        description: error.message
      });
    }
  };

  return (
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
  );
};

export default AdminHeader;
