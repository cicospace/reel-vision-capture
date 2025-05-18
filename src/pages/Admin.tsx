
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { Submission } from '@/types';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [data, setData] = useState<Submission[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    supabase.from('submissions').select('*').then(({ data: d }) => setData(d || []));
  }, []);

  const columns = [
    { header: 'Name', accessor: 'first_name' as keyof Submission },
    { header: 'Email', accessor: 'email' as keyof Submission },
    { header: 'Status', accessor: 'status' as keyof Submission }
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Submissions</h1>
      <Table columns={columns} data={data} />
      <div className="mt-4">
        <Button onClick={() => nav('/submit')}>New Submission</Button>
      </div>
    </div>
  );
}
