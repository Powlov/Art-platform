import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Page() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Streams</h1>
      <p className="text-gray-600">User: {user?.name} ({user?.role})</p>
    </div>
  );
}
