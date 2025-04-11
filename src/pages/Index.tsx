
import { Button } from "@/components/ui/button";
import SubmissionForm from "@/components/SubmissionForm";
import { Mail } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen pb-10">
      <header className="bg-black text-white py-10 mb-8 relative overflow-hidden">
        <div 
          className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-reel-gold/20 rounded-full blur-3xl animate-spotlight"
          style={{ transform: 'translate(-50%, -50%)' }}
        ></div>
        <div className="container max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center mb-3">
            <img 
              src="/lovable-uploads/a2a809e3-8770-41b2-bd3e-c4dc102d1aa9.png" 
              alt="Cicospace Logo" 
              className="h-16 sm:h-20"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-medium text-center max-w-2xl mx-auto">
            Demo Reel Onboarding
          </h2>
          <p className="mt-4 text-center text-white/80 max-w-2xl mx-auto">
            Please fill out this form to submit all the creative direction and media we need to craft your personalized keynote demo reel. This will help us understand your vision and showcase your best moments.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-center text-white/80 text-sm">
            <Mail size={14} className="text-reel-gold" />
            <span>All submissions will be emailed to the Cicospace team.</span>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4">
        <SubmissionForm />
      </main>

      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Cicospace. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
