'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLeads, deleteLead as removeLead, updateLead } from '@/api/leads';
import { Search, Filter, Plus, Mail, Building2, User as UserIcon, Trash2, Edit3, Eye, RotateCcw, DollarSign } from 'lucide-react';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [salespersonFilter, setSalespersonFilter] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLeads();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, sourceFilter, salespersonFilter]);

  const fetchUsers = async () => {
    try {
      const { getUsers } = await import('@/api/users');
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (sourceFilter) params.source = sourceFilter;
      if (salespersonFilter) params.salesperson = salespersonFilter;

      const data = await getLeads(params);
      setLeads(data);
    } catch (err) {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await removeLead(id);
        setLeads(leads.filter((lead) => lead._id !== id));
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

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await updateLead(leadId, { status: newStatus });
      setLeads(leads.map(lead => lead._id === leadId ? { ...lead, status: newStatus } : lead));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const SkeletonRow = () => (
    <div className="bg-white p-4 rounded-xl mb-3 border border-slate-100 animate-pulse flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-100 rounded"></div>
          <div className="h-3 w-48 bg-slate-50 rounded"></div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="h-8 w-24 bg-slate-100 rounded-full"></div>
        <div className="h-8 w-24 bg-slate-100 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Leads Management</h1>
          <p className="text-slate-500 mt-1">Track and nurture your customer relationships.</p>
        </div>
        <Link 
          href="/dashboard/leads/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>New Lead</span>
        </Link>
      </div>
      
      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-semibold mb-2">
          <Filter size={18} className="text-indigo-600" />
          <span>Filter Leads</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm appearance-none cursor-pointer text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm appearance-none cursor-pointer text-slate-700"
          >
            <option value="">All Sources</option>
            <option value="Web">Web</option>
            <option value="Referral">Referral</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Email Campaign">Email Campaign</option>
            <option value="Conference">Conference</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={salespersonFilter}
            onChange={(e) => setSalespersonFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm appearance-none cursor-pointer text-slate-700"
          >
            <option value="">All Assignees</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>

        {(search || statusFilter || sourceFilter || salespersonFilter) && (
          <div className="flex justify-end pt-2">
            <button
              onClick={() => { setSearch(''); setStatusFilter(''); setSourceFilter(''); setSalespersonFilter(''); }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw size={14} />
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl flex items-center gap-3 animate-in">
          <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
          {error}
        </div>
      )}

      {/* Leads List */}
      <div className="space-y-4">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No leads found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-1">Try adjusting your filters or search terms to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {leads.map((lead) => (
              <div 
                key={lead._id} 
                className="group bg-white rounded-2xl border border-slate-200/60 p-4 md:p-5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 animate-in"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Lead Info - Left */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100 shadow-sm shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <Link href={`/dashboard/leads/${lead._id}`} className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                        {lead.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1">
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Mail size={14} className="text-slate-400" />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Building2 size={14} className="text-slate-400" />
                          {lead.company || 'Private'}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                          <DollarSign size={12} />
                          Rs. {lead.value || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pipeline Status - Center */}
                  <div className="flex items-center justify-center flex-shrink-0">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      className={`text-xs font-bold rounded-full px-4 py-1.5 border ring-1 outline-none cursor-pointer appearance-none transition-all ${getStatusStyle(lead.status)}`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>

                  {/* Actions - Right */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link 
                      href={`/dashboard/leads/${lead._id}`} 
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link 
                      href={`/dashboard/leads/${lead._id}/edit`} 
                      className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                      title="Edit Lead"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <button 
                      onClick={() => deleteLead(lead._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Delete Lead"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
