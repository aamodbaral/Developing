import Link from 'next/link';
import { GraduationCap, LogOut, User } from 'lucide-react';

export default function VoterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-blue-600" size={24} />
          <span className="font-black uppercase tracking-tighter text-sm text-black">Voter Portal</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/profile" className="text-gray-400 hover:text-blue-600 transition-colors"><User size={20}/></Link>
          <button className="text-gray-400 hover:text-red-500 transition-colors"><LogOut size={20}/></button>
        </div>
      </nav>
      <main className="p-8 flex-1">{children}</main>
    </div>
  );
}