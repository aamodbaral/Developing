"use client";

import { useEffect, useState } from 'react';
import { Timer, Vote, AlertCircle, CheckCircle2, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';

interface ElectionEvent {
  _id: string;
  title: string;
  endDate: string;
  type: 'voting' | 'application'; // Backend field to distinguish event type
  status: 'active' | 'completed';
  hasVoted?: boolean;
  hasApplied?: boolean;
}

export default function VoterDashboard() {
  const [events, setEvents] = useState<ElectionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetches all active events (both voting and application types)
        const res = await fetch("http://localhost:5000/events/active", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Failed to load dashboard data");
        
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError("Could not sync with the election server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter events by type
  const votingEvents = events.filter(e => e.type === 'voting');
  const applicationEvents = events.filter(e => e.type === 'application');

  if (loading) return <VoterSkeleton />;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Voter Hub</h1>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Authorized Access 2026</p>
      </header>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-8 bg-red-50 text-red-600 rounded-2xl border border-red-100">
          <AlertCircle size={18} />
          <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
        </div>
      )}

      {/* SECTION 1: VOTING BOX */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-1 w-6 bg-blue-600 rounded-full"></div>
          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">Active Ballots</h3>
        </div>
        
        <div className="grid gap-6">
          {votingEvents.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
              <Vote className="mx-auto text-gray-200 mb-2" size={32} />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">No active elections to vote in.</p>
            </div>
          ) : (
            votingEvents.map((event) => (
              <div key={event._id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase">
                    <Timer size={14} className="text-blue-600" />
                    Ends {new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {event.hasVoted ? (
                  <div className="w-full py-4 bg-green-50 text-green-600 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> Vote Recorded
                  </div>
                ) : (
                  <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-gray-900 transition-all">
                    Cast Your Vote
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* SECTION 2: CANDIDACY BOX (ONLY VISIBLE IF ADMIN CREATED AN EVENT) */}
      <section className="pt-10 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-1 w-6 bg-red-600 rounded-full"></div>
          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">Candidacy Applications</h3>
        </div>

        {applicationEvents.length > 0 ? (
          <div className="space-y-4">
            {applicationEvents.map((appEvent) => (
              <div key={appEvent._id} className="bg-gray-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShieldCheck size={120} />
                </div>
                
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Nomination Open</span>
                  <h4 className="text-xl font-bold mt-3 tracking-tight">{appEvent.title}</h4>
                  <p className="text-gray-400 text-xs mt-1 italic">Submission Deadline: {new Date(appEvent.endDate).toLocaleDateString()}</p>
                </div>

                <button 
                  onClick={() => window.location.href = `/voter-dashboard/apply/${appEvent._id}`}
                  className="relative z-10 group flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-2xl shadow-black"
                >
                  Apply as Candidate <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-10 rounded-3xl text-center border border-gray-100">
            <UserPlus className="mx-auto text-gray-200 mb-4" size={40} />
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Nominations are currently closed.</p>
            <p className="text-gray-300 text-[9px] mt-1">Wait for an administrator to open application events.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function VoterSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse p-6">
      <div className="h-10 w-48 bg-gray-200 rounded-lg mb-12" />
      <div className="space-y-6">
        <div className="h-48 bg-gray-50 rounded-3xl" />
        <div className="h-48 bg-gray-100 rounded-3xl" />
      </div>
    </div>
  );
}