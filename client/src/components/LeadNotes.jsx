'use client';
import React, { useState, useEffect } from 'react';
import { getLeadNotes, addLeadNote } from '@/api/leads';
import { MessageSquare, Send, Clock, User, AlertCircle, Sparkles } from 'lucide-react';

const LeadNotes = ({ leadId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [leadId]);

  const fetchNotes = async () => {
    try {
      const data = await getLeadNotes(leadId);
      setNotes(data);
    } catch (err) {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      const addedNote = await addLeadNote(leadId, newNote);
      setNotes([addedNote, ...notes]);
      setNewNote('');
    } catch (err) {
      alert('Failed to add note');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="p-8 space-y-4 animate-pulse">
      <div className="h-4 w-32 bg-slate-100 rounded"></div>
      <div className="h-24 bg-slate-50 rounded-2xl"></div>
      <div className="space-y-3 pt-4">
        <div className="h-20 bg-slate-50 rounded-xl"></div>
        <div className="h-20 bg-slate-50 rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare size={16} className="text-indigo-600" />
          Lead Activity & Notes
        </h3>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {notes.length} Total
        </span>
      </div>
      
      <div className="p-6">
        {/* Input Section */}
        <form onSubmit={handleSubmit} className="mb-8 group">
          <div className="relative">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 placeholder:text-slate-400 resize-none min-h-[120px] shadow-sm"
              placeholder="Record an interaction or leave a note..."
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                type="submit"
                disabled={submitting || !newNote.trim()}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-50 disabled:grayscale shadow-md shadow-indigo-200 active:scale-95"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send size={16} />
                )}
                <span>Post Note</span>
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-8 relative before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
          {notes.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Sparkles size={24} />
              </div>
              <p className="text-slate-400 text-sm font-medium italic">Start the conversation. No activity logged yet.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="relative pl-12 group">
                {/* Timeline Marker */}
                <div className="absolute left-0 top-1 w-10 h-10 bg-white rounded-full border-2 border-slate-100 flex items-center justify-center z-10 shadow-sm group-hover:border-indigo-200 transition-colors">
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)]"></div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 hover:border-indigo-100 hover:shadow-lg hover:shadow-slate-200/20 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">
                          {note.createdBy ? note.createdBy.name : 'Unknown User'}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">
                          {note.createdBy?.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                      <Clock size={12} />
                      {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-slate-600 text-sm whitespace-pre-wrap font-medium leading-relaxed">
                    {note.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadNotes;
