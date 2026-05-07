'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createLead, updateLead } from '@/api/leads';
import { User, Mail, Phone, Building2, Tag, Share2, Save, X, ArrowLeft } from 'lucide-react';

const LeadForm = ({ leadId = null, initialData = null }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    source: 'Web',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (leadId) {
        await updateLead(leadId, formData);
      } else {
        await createLead(formData);
      }
      router.push('/dashboard/leads');
      router.refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while saving the lead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in">
      {/* Form Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {leadId ? 'Refine Lead Intelligence' : 'Register New Prospect'}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              {leadId ? 'Update lead profile and engagement parameters.' : 'Onboard a new lead into your sales ecosystem.'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
        {error && (
          <div className="p-4 bg-rose-50 border-b border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-2">
            <X size={16} className="bg-rose-100 rounded-full p-0.5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Identity Section */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Core Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <User size={14} className="text-indigo-500" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-300"
                  placeholder="e.g. Alexander Pierce"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Mail size={14} className="text-indigo-500" /> Professional Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-300"
                  placeholder="alex@company.com"
                />
              </div>
            </div>
          </div>

          {/* Contact & Professional Section */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Communication & Affiliation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Phone size={14} className="text-indigo-500" /> Direct Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-300"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Building2 size={14} className="text-indigo-500" /> Organization
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-300"
                  placeholder="Acme Intelligence Inc."
                />
              </div>
            </div>
          </div>

          {/* Classification Section */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Sales Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Tag size={14} className="text-indigo-500" /> Pipeline Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 font-bold appearance-none cursor-pointer"
                >
                  <option value="New">New Prospect</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified Lead</option>
                  <option value="Proposal Sent">Proposal Phase</option>
                  <option value="Won">Closed Won</option>
                  <option value="Lost">Closed Lost</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Share2 size={14} className="text-indigo-500" /> Lead Source
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 font-bold appearance-none cursor-pointer"
                >
                  <option value="Web">Website / Inbound</option>
                  <option value="Referral">Direct Referral</option>
                  <option value="LinkedIn">Social / LinkedIn</option>
                  <option value="Cold Call">Cold Outreach</option>
                  <option value="Email Campaign">Email Marketing</option>
                  <option value="Conference">Conference / Event</option>
                  <option value="Other">Miscellaneous</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 flex flex-col sm:flex-row items-center gap-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:flex-1 px-6 py-3.5 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95 border border-slate-200"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-[2] px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save size={18} />
              )}
              <span>{leadId ? 'Update Intelligence' : 'Initialize Lead'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
