import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import type { Submission } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export default function SubmissionDetail() {
  const { id } = useParams<{id:string}>();
  const [sub, setSub] = useState<Submission | null>(null);
  
  useEffect(() => { 
    if (id) {
      supabase.from('submissions')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching submission:', error);
            return;
          }
          setSub(data as Submission);
        });
    }
  }, [id]);
  
  if (!sub) return <div>Loading...</div>;
  
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader><CardTitle>Submission Detail</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p><strong>Name:</strong> {sub.first_name} {sub.last_name}</p>
        <p><strong>Email:</strong> {sub.email}</p>
        <p><strong>Status:</strong> {sub.status}</p>
        {/* Render other fields similarly */}
      </CardContent>
    </Card>
  );
}
