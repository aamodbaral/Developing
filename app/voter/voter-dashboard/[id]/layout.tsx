"use client";

import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { GraduationCap, LogOut, User, LayoutDashboard, ShieldCheck } from 'lucide-react';

export default function VoterLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams(); // Captures the Student ID from the URL
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Clear all session data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    
    // Redirect to login
    router.push('/auth/login');
  };

  // Define dynamic paths based on the ID
  const dashboardPath = `/voter/voter-dashboard/${id}`;
  const profilePath = `/voter/voter-dashboard/${id}/profile`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* NAVBAR */}
      <nav className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-100">
            <GraduationCap className="text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-black uppercase tracking-tighter text-sm text-slate-900 leading-none">
              Voter Portal
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Khwopa Union 2026
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-2 md:gap-8">
          <div className="hidden md:flex items-center gap-6 mr-6 pr-6 border-r border-slate-100">
             <Link 
              href={dashboardPath} 
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${pathname === dashboardPath ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link 
              href={profilePath} 
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${pathname === profilePath ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <User size={16} /> Profile
            </Link>
          </div>

          {/* MOBILE / ICON NAVIGATION */}
          <div className="flex items-center gap-4">
             <Link 
              href={profilePath} 
              className={`md:hidden p-2 rounded-lg transition-colors ${pathname === profilePath ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <User size={20}/>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-2 p-2 md:px-4 md:py-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
              title="Logout"
            >
              <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Sign Out</span>
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-8">
        {children}
      </main>

      {/* FOOTER BAR */}
      <footer className="h-12 bg-white border-t border-slate-100 flex items-center justify-center px-8">
        <div className="flex items-center gap-2 opacity-30">
          <ShieldCheck size={14} />
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">End-to-End Encrypted Voting Environment</span>
        </div>
      </footer>
    </div>
  );
}