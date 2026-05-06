'use client';
import React, { useState, useEffect } from 'react';
import { getLeadNotes, addLeadNote } from '@/api/leads';

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

  if (loading) return <div className="p-4 text-gray-500 italic">Loading notes...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Lead Notes</h3>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 resize-none min-h-[100px]"
            placeholder="Add a new note about this lead..."
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={submitting || !newNote.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-sm"
            >
              {submitting ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </form>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

        <div className="space-y-6 relative before:content-[''] before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
          {notes.length === 0 ? (
            <p className="text-center text-gray-500 py-4 italic">No notes found for this lead.</p>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="relative pl-10">
                <div className="absolute left-0 top-1 w-9 h-9 bg-blue-50 rounded-full border-4 border-white flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-gray-900">
                      {note.createdBy?.name || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
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
