"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Hash, 
  ShieldCheck, 
  ArrowLeft, 
  LogOut, 
  GraduationCap,
  BadgeCheck
} from 'lucide-react';
import Link from 'next/link';

export default function VoterProfile() {
  const { id } = useParams(); // This is the Student ID (e.g., KCE080BCT025)
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  if (!user) return <div className="p-10 text-center font-bold animate-pulse">Loading Identity...</div>;

  return (
    <div className="max-w-2xl mx-auto pb-20 p-4">
      {/* HEADER NAV */}
      <nav className="mb-10 flex justify-between items-center">
        <Link 
          href={`/voter/voter-dashboard/${id}`} 
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-[10px] uppercase tracking-widest transition group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-600 font-bold text-[10px] uppercase tracking-widest transition"
        >
          Terminate Session <LogOut size={14} />
        </button>
      </nav>

      {/* IDENTITY CARD */}
      <div className="bg-white border-2 border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50">
        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mb-6 border-4 border-slate-800 shadow-xl">
              <User size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight uppercase">{user.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-blue-400">
              <BadgeCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Voter Account</span>
            </div>
          </div>
          {/* Decorative Elements */}
          <ShieldCheck className="absolute -right-10 -bottom-10 opacity-10" size={150} />
          <GraduationCap className="absolute -left-10 -top-10 opacity-10" size={120} />
        </div>

        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student ID (Dynamic ID) */}
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Hash size={12} className="text-blue-600" /> System Identifier
              </p>
              <p className="text-sm font-bold text-slate-900">{id}</p>
            </div>

            {/* Department/Batch */}
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <GraduationCap size={12} className="text-blue-600" /> Academic Unit
              </p>
              <p className="text-sm font-bold text-slate-900">
                {user.department} — Batch {user.batch}
              </p>
            </div>

            {/* Email Address */}
            <div className="space-y-1 md:col-span-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Mail size={12} className="text-blue-600" /> College Email
              </p>
              <p className="text-sm font-bold text-slate-900">{user.email}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50">
            <div className="bg-blue-50 rounded-2xl p-6 flex items-start gap-4 border border-blue-100">
              <ShieldCheck className="text-blue-600 shrink-0" size={20} />
              <div>
                <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Privacy & Security</h4>
                <p className="text-[11px] text-blue-700/70 leading-relaxed">
                  Your academic data is synced with the college registrar. If you notice any discrepancy in your department or batch, please contact the administration office before the next election cycle begins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center mt-10 text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
        Last Sync: {new Date().toLocaleDateString()} — Server 2026.1
      </p>
    </div>
  );
}