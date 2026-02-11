"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  CheckCircle2, 
  LogOut, 
  Fingerprint, 
  LayoutDashboard, 
  Settings,
  Menu,
  X,
  UserPlus,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Removed 'Approval' from the nav items
  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Election', href: '/admin/elections', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      
      {/* --- NAVIGATION BAR --- */}
      <nav className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white border-b border-slate-200 z-[100] px-4 md:px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-2">
          
          {/* LEFT: Branding */}
          <div className="flex-1 flex items-center">
            <div className="flex items-center gap-2 md:gap-2.5">
              <div className="bg-blue-600 p-1.5 md:p-2 rounded-xl text-white shadow-lg shadow-blue-100">
                <Fingerprint size={18} className="md:w-[22px] md:h-[22px]" />
              </div>
              <span className="font-black text-base md:text-xl tracking-tight uppercase">
                Vote.Core
              </span>
            </div>
          </div>

          {/* CENTER: Navigation Pill (Updated list) */}
          <div className="hidden md:flex flex-[2] justify-center items-center">
            <div className="bg-slate-200 p-1 rounded-2xl flex items-center shadow-inner">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name}
                    href={item.href} 
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <item.icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Admin & Static Red Logout */}
          <div className="flex-1 flex items-center justify-end gap-3 md:gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Admin</p>
              <p className="text-sm font-bold text-slate-900 leading-tight">Admin_01</p>
            </div>
            
            <Link 
              href="/login" 
              className="flex items-center gap-2 bg-red-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-black shadow-lg shadow-red-100 active:scale-95"
            >
              <LogOut size={16} />
              <span className="hidden xs:inline">Logout</span>
            </Link>

            <button className="md:hidden p-1 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 p-4 flex flex-col gap-2 shadow-xl animate-in slide-in-from-top duration-200">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsMenuOpen(false)}
                className={`font-bold flex items-center gap-4 p-4 rounded-xl ${pathname === item.href ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50'}`}
              >
                <item.icon size={20} /> {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="pt-24 md:pt-36 pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-8 md:mb-10 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm md:text-base font-bold mt-1">Welcome back, Admin_01</p>
          </div>

          {/* STATS SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
            {[
              { label: 'Total Voters', val: '1,240', icon: Users, color: 'blue' },
              { label: 'Votes Cast', val: '856', icon: CheckCircle2, color: 'green' },
              { label: 'Candidates', val: '24', icon: UserPlus, color: 'purple' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-4 md:gap-6">
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl md:rounded-[1.5rem] flex items-center justify-center shrink-0`}>
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5 md:mb-1">{stat.label}</p>
                  <h3 className="text-2xl md:text-4xl font-black text-slate-900">{stat.val}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* QUICK ACTION AREA */}
          <div className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2">Pending Approvals</h2>
              <p className="text-slate-500 text-sm md:text-base font-medium">
                There are <span className="text-blue-600 font-black">candidates</span> waiting for your review.
              </p>
            </div>
            <Link 
              href="/admin/approvals" 
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black shadow-lg shadow-slate-200 transition-transform active:scale-95"
            >
              Go to Approvals <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}