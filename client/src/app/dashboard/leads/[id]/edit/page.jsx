'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LeadForm from '@/components/LeadForm';
import { getLeadById } from '@/api/leads';
import { Info, ArrowLeft } from 'lucide-react';

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

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Fetching lead history...</p>
    </div>
  );

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center space-y-6">
        <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Retrieval Error</h2>
          <p className="text-rose-600 mt-2 font-medium">{error}</p>
        </div>
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} />
          Return to Previous Page
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in">
      {initialData && <LeadForm leadId={id} initialData={initialData} />}
    </div>
  );
};

export default EditLeadPage;
