'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LeadForm from '@/components/LeadForm';
import { getLeadById } from '@/api/leads';

const EditLeadPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const data = await getLeadById(id);
        setInitialData(data);
      } catch (err) {
        setError('Failed to fetch lead details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLead();
    }
  }, [id]);

  if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">{error}</div>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Lead</h1>
        <p className="text-gray-500 mt-1">Update information for {initialData?.name}</p>
      </div>
      {initialData && <LeadForm leadId={id} initialData={initialData} />}
    </div>
  );
};

export default EditLeadPage;
