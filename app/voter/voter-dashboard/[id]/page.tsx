"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Vote, 
  AlertCircle, 
  CheckCircle2, 
  UserPlus, 
  ArrowRight, 
  ShieldCheck,
  Lock
} from 'lucide-react';

interface ElectionEvent {
  id: string;
  _id?: string;
  title: string;
  candidateDeadline: string;
  phase: string;
  hasVoted?: boolean;
}

export default function VoterDashboard() {
  const router = useRouter();
  const { id } = useParams(); // Student ID
  const [events, setEvents] = useState<ElectionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:5000/events/user", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError("Sync error with election server.");
    } finally {
      setLoading(false);
    }
  };

  const activeVotingEvent = events.find(e => e.phase?.toLowerCase() === 'voting');
  const applicationEvents = events.filter(e => e.phase?.toLowerCase() === 'application');

  if (loading) return <div className="p-10 text-center font-bold">Initializing...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 p-4">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Voter Hub</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Student ID: {id}</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
           <p className="text-blue-600 text-[9px] font-black uppercase tracking-widest">Live</p>
        </div>
      </header>

      {/* SECTION 1: VOTING TERMINAL */}
      <section className="mb-12">
        <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Electronic <span className="text-blue-600">Ballot</span></h2>
            <p className="text-slate-500 text-sm mb-8 max-w-md">
              {activeVotingEvent 
                ? `Voting for "${activeVotingEvent.title}" is open.` 
                : "The ballot box is currently locked."}
            </p>

            {activeVotingEvent ? (
              <button 
                onClick={() => router.push(`/voter/voter-dashboard/${id}/ballot/${activeVotingEvent.id || activeVotingEvent._id}`)}
                className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95"
              >
                Enter Voting Room <Vote size={18} className="inline ml-2"/>
              </button>
            ) : (
              <button disabled className="px-10 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest cursor-not-allowed">
                Ballot Locked <Lock size={16} className="inline ml-2"/>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: CANDIDACY BOX */}
      <section className="pt-10 border-t border-gray-100">
        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em] mb-6">Candidacy Applications</h3>
        {applicationEvents.length > 0 ? (
          <div className="space-y-4">
            {applicationEvents.map((appEvent) => (
              <div key={appEvent.id || appEvent._id} className="bg-gray-900 rounded-[2.5rem] p-8 text-white flex justify-between items-center group relative overflow-hidden">
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase rounded-full">Nomination Open</span>
                  <h4 className="text-xl font-bold mt-3">{appEvent.title}</h4>
                </div>
                <button 
                  onClick={() => router.push(`/voter/voter-dashboard/${id}/apply`)}
                  className="relative z-10 flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl"
                >
                  View Details <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-12 rounded-[2.5rem] text-center">
            <UserPlus className="mx-auto text-gray-200 mb-4" size={40} />
            <p className="text-gray-400 text-[10px] font-black uppercase">No active nomination windows.</p>
          </div>
        )}
      </section>
    </div>
  );
}