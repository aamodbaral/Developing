//voter/voter-dashboad/[id]/ballot

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  CheckCircle2, 
  User, 
  ShieldCheck, 
  Info, 
  ArrowLeft, 
  Loader2,
  Lock
} from "lucide-react";
import Link from "next/link";

export default function BallotPage() {
  const { id } = useParams();
  const router = useRouter();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    fetchBallotData();
  }, [id]);

  const fetchBallotData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/events/${id}/ballot`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        setCandidates(data.candidates);
        setHasVoted(data.hasVoted);
      } else {
        // Redirect back if the event isn't valid or accessible
        router.replace("/voter/voter-dashboard");
      }
    } catch (err) {
      console.error("Ballot sync error");
    } finally {
      setLoading(false);
    }
  };

  const handleCastVote = async (candidateId: string) => {
    if (!confirm("Are you sure? Your vote is final and cannot be changed.")) return;

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/votes/cast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: id, candidateId }),
      });

      if (res.ok) {
        setHasVoted(true);
        // Automatically redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/voter/voter-dashboard");
        }, 3000);
      } else {
        alert("Transaction failed. Please try again.");
      }
    } catch (err) {
      alert("Network error during voting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  // Success State
  if (hasVoted) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-xl shadow-slate-200 border border-green-100 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 leading-tight">Vote Confirmed</h2>
        <p className="text-slate-500 mt-4 text-sm leading-relaxed">
          Your digital signature has been recorded. You are being redirected to the dashboard...
        </p>
        <button 
          onClick={() => router.push("/voter/voter-dashboard")}
          className="mt-8 text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline"
        >
          Return Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* BACK BUTTON UPDATED PATH */}
        <Link 
          href="/voter/voter-dashboard" 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest mb-10 transition group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Cancel & Return to Dashboard
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">Official Ballot</span>
            <span className="text-slate-300 font-bold text-[9px] uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={12} /> Secure Session
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Select your <span className="text-blue-600">Candidate</span></h1>
          <p className="text-slate-500 mt-2 text-sm">Review the vision statements below before making your selection.</p>
        </header>

        <div className="grid gap-6">
          {candidates.map((candidate: any) => (
            <div key={candidate._id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all group border-b-4 hover:border-blue-600">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                
                <div className="flex flex-col items-center text-center md:w-40">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-3 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-200 transition-colors">
                    <User size={32} />
                  </div>
                  <h3 className="font-bold text-slate-900">{candidate.userId?.name || "Anonymous Candidate"}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">ID: {candidate.userId?.rollNumber || "0000"}</p>
                </div>

                <div className="flex-1">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6 group-hover:bg-white transition-colors">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Lock size={12} /> Candidate Vision
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed italic">
                      "{candidate.visionStatement}"
                    </p>
                  </div>

                  <button 
                    onClick={() => handleCastVote(candidate._id)}
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Cast Vote for Candidate"}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
        
        {/* Footnote with Info */}
        <footer className="mt-12 p-8 bg-blue-900 rounded-[2.5rem] text-white overflow-hidden relative">
          <div className="relative z-10 flex items-start gap-4">
            <Info className="text-blue-400 shrink-0" size={24} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Voting Integrity Note</p>
              <p className="text-[11px] leading-relaxed opacity-80 max-w-2xl">
                This system uses high-integrity tallying. Your identity is stripped from the vote before it reaches the results server to ensure total anonymity.
              </p>
            </div>
          </div>
          <ShieldCheck className="absolute -right-10 -bottom-10 opacity-10" size={180} />
        </footer>
      </div>
    </div>
  );
}