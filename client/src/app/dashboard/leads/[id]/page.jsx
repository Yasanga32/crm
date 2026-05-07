'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLeadById, deleteLead as removeLead, updateLead } from '@/api/leads';
import LeadNotes from '@/components/LeadNotes';
import { ArrowLeft, Edit2, Trash2, Mail, Phone, Building2, Calendar, User, Info, TrendingUp } from 'lucide-react';

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
        setError('Failed to fetch lead details. It might have been deleted.');
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return 'bg-indigo-50 text-indigo-700 border-indigo-100 ring-indigo-500/10';
      case 'Contacted': return 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10';
      case 'Qualified': return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10';
      case 'Proposal Sent': return 'bg-violet-50 text-violet-700 border-violet-100 ring-violet-500/10';
      case 'Won': return 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/10';
      case 'Lost': return 'bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/10';
      default: return 'bg-slate-50 text-slate-700 border-slate-100 ring-slate-500/10';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Loading lead intelligence...</p>
    </div>
  );

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center space-y-6">
        <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Oops! Something went wrong</h2>
          <p className="text-rose-600 mt-2 font-medium">{error}</p>
        </div>
        <button 
          onClick={() => router.push('/dashboard/leads')} 
          className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all"
        >
          <ArrowLeft size={20} />
          Return to Leads List
        </button>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="space-y-8 animate-in">
      {/* Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard/leads')} 
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{lead.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ring-1 ${getStatusStyle(lead.status)}`}>
                {lead.status}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-sm text-slate-500 font-medium">{lead.company || 'Individual Client'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/dashboard/leads/${id}/edit`}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all shadow-sm active:scale-95"
          >
            <Edit2 size={18} />
            Edit
          </Link>
          <button
            onClick={deleteLead}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold transition-all active:scale-95 border border-rose-100"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-slate-900 font-bold">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Mail size={18} />
                </div>
                Contact Email
              </div>
              <p className="text-lg font-medium text-slate-700 break-all select-all">{lead.email}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-slate-900 font-bold">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Phone size={18} />
                </div>
                Phone Number
              </div>
              <p className="text-lg font-medium text-slate-700">{lead.phone || 'Not provided'}</p>
            </div>
          </div>

          {/* Lead Activity / Notes Section */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            <LeadNotes leadId={id} />
          </div>
        </div>

        {/* Sidebar / Metadata */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-600" />
                Pipeline Status
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update Progress</label>
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
                  className={`w-full text-sm font-bold rounded-xl px-4 py-3 border outline-none cursor-pointer appearance-none transition-all ${getStatusStyle(lead.status)}`}
                >
                  <option value="New">New Lead</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Deal Won</option>
                  <option value="Lost">Deal Lost</option>
                </select>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium flex items-center gap-2">
                    <Building2 size={16} /> Source
                  </span>
                  <span className="font-bold text-slate-900">{lead.source}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium flex items-center gap-2">
                    <Calendar size={16} /> Created
                  </span>
                  <span className="font-bold text-slate-900">{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
                {lead.owner && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <User size={16} /> Assignee
                    </span>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{lead.owner.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{lead.owner.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Stats or Tips Card */}
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <h4 className="font-bold text-lg mb-2">Sales Tip</h4>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Leads contacted within 24 hours are 7x more likely to convert. Make sure to log all communications in the notes section below!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
