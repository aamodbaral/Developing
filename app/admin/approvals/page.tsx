"use client";
import { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  X, 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';

const APPLICATIONS = [
  { 
    id: 1, 
    name: "Alice Johnson", 
    position: "Student Union President", 
    roll: "2023/CS/45", 
    gpa: 3.8, 
    status: "pending",
    statement: "I aim to bridge the gap between students and administration through digital transparency."
  },
  { 
    id: 2, 
    name: "Mark Thompson", 
    position: "Sports Secretary", 
    roll: "2022/ME/12", 
    gpa: 2.4, // Highlight this as it's below the usual 2.5 requirement
    status: "pending",
    statement: "More inter-college tournaments and better equipment for the gym."
  }
];

export default function ApprovalsPage() {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-2 transition">
              <ArrowLeft size={18} /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-slate-900">Candidate Approvals</h1>
          </div>

          <div className="flex bg-slate-200 p-1 rounded-2xl shadow-inner">
            {(['pending', 'approved', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
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
          {APPLICATIONS.filter(app => app.status === filter).map((app) => (
            <div key={app.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Profile/ID Section */}
                <div className="flex flex-col items-center text-center lg:w-48">
                  <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 mb-4 border-2 border-dashed border-slate-200">
                    <ShieldCheck size={40} />
                  </div>
                  <h3 className="font-bold text-slate-900 leading-tight">{app.name}</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">{app.roll}</p>
                </div>

                {/* Details Section */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Target: {app.position}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                      app.gpa >= 2.5 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      GPA: {app.gpa} {app.gpa < 2.5 && <AlertCircle size={10} />}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                      <FileText size={14} /> Candidate Statement
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed italic">
                      "{app.statement}"
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100 active:scale-95">
                      <Check size={18} /> Approve Candidate
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-red-600 px-8 py-3 rounded-2xl font-bold hover:bg-red-50 transition active:scale-95">
                      <X size={18} /> Reject
                    </button>
                    <button className="w-full md:w-auto flex items-center justify-center gap-2 text-slate-400 font-bold text-sm px-4 py-3 hover:text-slate-600 transition">
                      <ExternalLink size={16} /> View Profile
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {APPLICATIONS.filter(app => app.status === filter).length === 0 && (
            <div className="text-center py-20 bg-slate-100/50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest">No {filter} applications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}