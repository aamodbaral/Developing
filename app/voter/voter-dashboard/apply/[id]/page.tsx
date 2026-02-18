"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, ShieldCheck, Info } from 'lucide-react';
import Link from 'next/link';

export default function CandidateApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [eventTitle, setEventTitle] = useState("Loading event...");
  
  const [formData, setFormData] = useState({
    position: '',
    manifesto: '',
    experience: ''
  });

  // Fetch event details to show what they are applying for
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/events/${params.id}`);
        const data = await res.json();
        setEventTitle(data.title);
      } catch (err) {
        setEventTitle("Application Event");
      }
    };
    fetchEvent();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/candidates/apply`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId: params.id,
          ...formData
        }),
      });

      if (res.ok) {
        alert("Application submitted successfully! Awaiting Admin review.");
        router.push('/voter-dashboard');
      } else {
        const data = await res.json();
        alert(data.message || "Submission failed");
      }
    } catch (err) {
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Link 
        href="/voter-dashboard" 
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors mb-8"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="text-red-600" size={24} />
          <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Official Nomination Form</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">{eventTitle}</h1>
        <p className="text-gray-400 text-xs mt-2 font-medium">Please fill out your candidacy details accurately. Your manifesto will be visible to all voters once approved.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-50">
        
        {/* Position Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            Target Position <Info size={12} />
          </label>
          <select 
            required
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-600 transition-all outline-none appearance-none"
            onChange={(e) => setFormData({...formData, position: e.target.value})}
          >
            <option value="">Select a Role</option>
            <option value="President">President</option>
            <option value="Vice President">Vice President</option>
            <option value="General Secretary">General Secretary</option>
            <option value="Treasurer">Treasurer</option>
            <option value="Executive Member">Executive Member</option>
          </select>
        </div>

        {/* Short Experience */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Past Experience / Background</label>
          <input 
            type="text"
            required
            placeholder="e.g. Previous Class Representative"
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none"
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
          />
        </div>

        {/* Manifesto Textarea */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Candidacy Manifesto</label>
          <textarea 
            required
            rows={6}
            placeholder="Describe your vision and why students should vote for you..."
            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none resize-none"
            onChange={(e) => setFormData({...formData, manifesto: e.target.value})}
          />
          <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest text-right">Maximum 500 words</p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Processing..." : (
            <>Submit Nomination <Send size={16} /></>
          )}
        </button>
      </form>

      <footer className="mt-8 text-center">
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
          By submitting, you agree to the Election Code of Conduct.
        </p>
      </footer>
    </div>
  );
}