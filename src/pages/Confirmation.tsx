
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Confirmation = () => {
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
          <h1 className="text-2xl sm:text-3xl font-medium text-center max-w-2xl mx-auto">
            Submission Received!
          </h1>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4">
        <Card className="p-8 border-border bg-card text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} className="text-reel-gold" />
          </div>
          
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Your Demo Reel Request Has Been Submitted!
          </h2>
          
          <div className="space-y-4 text-muted-foreground mb-8">
            <p className="text-lg">
              Thank you for providing all the details we need to create your personalized keynote demo reel.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-reel-gold">
              <Mail size={18} />
              <span className="font-medium">The Cicospace team is now reviewing your submission</span>
            </div>
            
            <p>
              We'll carefully review all your materials, creative direction, and requirements. 
              Our team will be in touch soon to discuss next steps and timeline for your demo reel.
            </p>
            
            <div className="bg-muted p-4 rounded-lg mt-6">
              <p className="text-sm">
                <strong>What happens next:</strong><br />
                • Our team reviews your submission and materials<br />
                • We'll contact you within 1-2 business days<br />
                • We'll discuss timeline and any additional requirements<br />
                • Production begins once everything is confirmed
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              asChild 
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Submit Another Demo Reel Request
              </Link>
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Need to make changes to your submission? Please contact us directly.
            </p>
          </div>
        </Card>
      </main>

      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Cicospace. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Confirmation;
