'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLeadById, deleteLead as removeLead, updateLead } from '@/api/leads';

const LeadDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const data = await getLeadById(id);
        setLead(data);
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

  const deleteLead = async () => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      try {
        await removeLead(id);
        router.push('/dashboard/leads');
      } catch (err) {
        alert('Failed to delete lead');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Qualified': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Proposal Sent': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Won': return 'bg-green-100 text-green-800 border-green-200';
      case 'Lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">{error}</div>
        <button onClick={() => router.push('/dashboard/leads')} className="text-blue-600 hover:underline">Back to Leads</button>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard/leads')} className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Lead Details</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/dashboard/leads/${id}/edit`}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={deleteLead}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-base text-gray-900">{lead.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                  <dd className="mt-1 text-base text-gray-900">
                    <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">{lead.email}</a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                  <dd className="mt-1 text-base text-gray-900">
                    {lead.phone ? <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">{lead.phone}</a> : '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="mt-1 text-base text-gray-900">{lead.company || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Status & Source</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Current Status</dt>
                <dd className="mt-1">
                  <select
                    value={lead.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      try {
                        await updateLead(id, { status: newStatus });
                        setLead({ ...lead, status: newStatus });
                      } catch (err) {
                        alert('Failed to update status');
                      }
                    }}
                    className={`text-sm font-semibold rounded-full px-3 py-1 border outline-none cursor-pointer appearance-none ${getStatusColor(lead.status)}`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </dd>
              </div>
              <hr className="border-gray-100" />
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Lead Source</dt>
                <dd className="text-base text-gray-900">{lead.source}</dd>
              </div>
              <hr className="border-gray-100" />
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Created At</dt>
                <dd className="text-sm text-gray-900">{new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString()}</dd>
              </div>
              {lead.owner && (
                <>
                  <hr className="border-gray-100" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Owner</dt>
                    <dd className="text-sm text-gray-900">{lead.owner.name} ({lead.owner.email})</dd>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
