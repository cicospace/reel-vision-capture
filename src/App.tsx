
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Admin from '@/pages/Admin';
import SubmissionDetail from '@/pages/SubmissionDetail';
import SubmissionForm from '@/components/form/SubmissionForm';
import { isAuthenticated } from '@/utils/authUtils';

function Protected({ children }: { children: JSX.Element }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <Protected>
              <Admin />
            </Protected>
          }
        />
        <Route
          path="/submission/:id"
          element={
            <Protected>
              <SubmissionDetail />
            </Protected>
          }
        />
        <Route path="/submit" element={<SubmissionForm />} />
      </Routes>
    </BrowserRouter>
  );
}
