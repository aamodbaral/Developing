"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Check, 
  X, 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  AlertCircle,
  ExternalLink,
  Loader2,
  Clock,
  CalendarDays,
  ShieldAlert
} from 'lucide-react';

export default function ApprovalsPage() {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExtending, setIsExtending] = useState(false); // UI state for extension

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/candidates/{$eventID/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setApplications(data);
    } catch (err) {
      console.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/candidates/${candidateId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setApplications(prev => 
          prev.map(app => app._id === id ? { ...app, status: newStatus } : app)
        );
      }
    } catch (err) {
      alert("Error updating status");
    }
  };

  // NEW: Logic to transition the entire event phase
  const handleTransitionPhase = async (phase: 'verification' | 'active') => {
    if (confirm(`Confirm transition to ${phase} phase?`)) {
      // Backend call to update event status
      alert(`Election moved to ${phase}. Candidates can now be reviewed.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const filteredApps = applications.filter(app => app.status === filter);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <Link href="/super/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-6 transition text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* NEW: DEADLINE & PHASE CONTROL PANEL */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-10 text-white shadow-2xl shadow-slate-300">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-400">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Application Deadline Management</h2>
                <p className="text-slate-400 text-xs mt-1 uppercase font-bold tracking-widest">Election Phase: <span className="text-orange-400">Review Required</span></p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <button 
                onClick={() => setIsExtending(!isExtending)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition"
              >
                <CalendarDays size={16} /> {isExtending ? 'Cancel' : 'Extend Deadline'}
              </button>
              <button 
                onClick={() => handleTransitionPhase('verification')}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition shadow-lg shadow-blue-900"
              >
                Start Verification <Check size={16} />
              </button>
            </div>
          </div>

          {/* Inline Extension Form */}
          {isExtending && (
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
              <input 
                type="datetime-local" 
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Save New Date</button>
            </div>
          )}
        </div>

        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Candidate <span className="text-blue-600">Review</span></h1>
          
          <div className="flex bg-slate-200 p-1 rounded-2xl shadow-inner">
            {(['pending', 'approved', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="grid gap-6">
          {filteredApps.map((app) => (
            <div key={app._id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Profile Section */}
                <div className="flex flex-col items-center text-center lg:w-48">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 mb-4 border-2 border-dashed border-slate-200">
                    <ShieldCheck size={40} />
                  </div>
                  <h3 className="font-bold text-slate-900 leading-tight">{app.userId?.name || "Candidate"}</h3>
                  <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest">{app.userId?.rollNumber || "ID: " + app.userId}</p>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Event ID: {app.eventId?.title || app.eventId}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                      (app.userId?.gpa || 0) >= 2.5 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      GPA: {app.userId?.gpa || "3.2"} {(app.userId?.gpa || 3.2) < 2.5 && <AlertCircle size={10} />}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      <FileText size={14} /> Goal Assessment
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed italic">
                      "{app.visionStatement}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {app.status === 'pending' ? (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(app._id, 'approved')}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-700 transition active:scale-95"
                        >
                          <Check size={18} /> Approve
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(app._id, 'rejected')}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-red-600 px-8 py-3 rounded-2xl font-bold hover:bg-red-50 transition active:scale-95"
                        >
                          <X size={18} /> Reject
                        </button>
                      </>
                    ) : (
                      <div className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border ${
                        app.status === 'approved' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'
                      }`}>
                        Decision: {app.status}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}

          {filteredApps.length === 0 && (
            <div className="text-center py-20 bg-slate-100/50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No {filter} applications for review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


