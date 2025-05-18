
import React from 'react';
import { useParams } from 'react-router-dom';
export default function SubmissionDetail() {
  const { id } = useParams<{ id: string }>();
  return <div>Detail view for submission {id}</div>;
}
