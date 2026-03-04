"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit3, Trash2, Plus, Calendar, Clock, Search, ExternalLink, AlertCircle } from 'lucide-react';

interface Event {
  id: number; // Changed to match Prisma numeric IDs
  title: string;
  description: string;
  allowedDept: string;
  allowedBatch: string;
  votingStart: string;
  votingEnd: string;
  phase: string;
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const baseUrl = "http://localhost:5000";

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/events/admin`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setEvents(Array.isArray(data) ? data : data.events || []);
      } else {
        setError(data.message || "Failed to load events");
      }
    } catch (err) {
      setError("Network error: Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This will delete all candidate data for this event.")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${baseUrl}/events/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setEvents(events.filter(event => event.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Delete failed.");
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.allowedDept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* ADDED: Navigation Back to Dashboard */}
        <div className="mb-6">
          <Link href="/super/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold uppercase text-[10px] tracking-widest transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase">Event Monitor</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">Total: {events.length} Events</p>
          </div>
          <Link href="/super/create-event" className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold uppercase text-[10px]">
            <Plus size={16} className="inline mr-2"/> Add New Election
          </Link>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold uppercase"><AlertCircle size={18} className="inline mr-2"/>{error}</div>}

        <div className="grid grid-cols-1 gap-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-full">{event.phase}</span>
                <h3 className="text-lg font-black text-slate-900 mt-2">{event.title}</h3>
                <p className="text-slate-400 text-xs italic">{event.description}</p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Link href={`/super/events/edit/${event.id}`} className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                  <Edit3 size={18} />
                </Link>
                <button onClick={() => handleDelete(event.id)} className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl">
                  <Trash2 size={18} />
                </button>
                <Link href={`/super/events/view/${event.id}`} className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold uppercase text-[9px]">
                  Stats <ExternalLink size={12} className="inline ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}