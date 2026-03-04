"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, FileText, Send, Users, Clock } from 'lucide-react';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // FIXED: Keys now match the backend controller (allowedDept instead of allowedDepartment)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    allowedDept: '', 
    allowedBatch: '',
    candidateDeadline: '',
    votingStart: '',
    votingEnd: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      // Endpoint matches router.use("/events", eventRouter)
      const res = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Election event created successfully!");
        router.push('/super/dashboard');
      } else {
        // This will now show the specific error from your catch block if it fails
        alert(data.message || "Failed to create event");
      }
    } catch (err) {
      alert("Server connection error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none rounded-2xl transition-all text-sm font-semibold text-slate-900 placeholder:text-slate-400";
  const labelStyle = "text-[9px] text-slate-400 font-bold uppercase mt-2 ml-2 tracking-wider";

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl py-10">
        <Link href="/super/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold uppercase text-[10px] tracking-widest mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/60 border border-slate-100">
          <header className="mb-10 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Initialize Event</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Configure Detailed Election Parameters</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <FileText size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" required placeholder="Election Title" className={inputStyle}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <textarea 
              required placeholder="Event Description" rows={3}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none rounded-2xl transition-all text-sm font-semibold text-slate-900 placeholder:text-slate-400"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <Users size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600" />
                <input 
                  type="text" placeholder="Allowed Department (e.g. CS)" className={inputStyle}
                  // FIXED: Matches backend key allowedDept
                  onChange={(e) => setFormData({...formData, allowedDept: e.target.value})}
                />
              </div>
              <div className="relative group">
                <Users size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600" />
                <input 
                  type="text" placeholder="Allowed Batch (e.g. 2022)" className={inputStyle}
                  onChange={(e) => setFormData({...formData, allowedBatch: e.target.value})}
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} /> Schedule & Deadlines
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input type="datetime-local" required className={inputStyle} 
                    onChange={(e) => setFormData({...formData, candidateDeadline: e.target.value})} />
                  <p className={labelStyle}>Candidate Deadline</p>
                </div>
                <div>
                  <input type="datetime-local" required className={inputStyle} 
                    onChange={(e) => setFormData({...formData, votingStart: e.target.value})} />
                  <p className={labelStyle}>Voting Starts</p>
                </div>
                <div>
                  <input type="datetime-local" required className={inputStyle} 
                    onChange={(e) => setFormData({...formData, votingEnd: e.target.value})} />
                  <p className={labelStyle}>Voting Ends</p>
                </div>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold uppercase text-xs tracking-[0.2em] transition-all hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-100 flex items-center justify-center gap-3"
            >
              {loading ? 'Publishing...' : <><Send size={16} /> Create Election Event</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}