"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AdminRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // FIXED: Higher contrast placeholder and z-index compatibility
  const inputStyle = "w-full pl-10 pr-10 py-3 border-b-2 border-gray-100 focus:border-red-600 outline-none transition-all text-sm font-semibold bg-white text-gray-900 placeholder:text-gray-500 placeholder:opacity-100";

  const handleRegisterRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/admins/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          isApproved: false 
        }),
      });

      if (res.ok) {
        alert("Registration request sent! Please wait for Super Admin approval.");
        router.push('/auth/login?role=admin');
      } else {
        const data = await res.json();
        alert(data.message || "Request failed");
      }
    } catch (err) {
      alert("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white p-6 text-center">
      <div className="w-full max-w-xs flex flex-col items-center">
        <header className="mb-10">
          <GraduationCap size={42} className="text-red-600 mx-auto mb-3" />
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Admin Access</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Request Enrollment</p>
        </header>

        <form onSubmit={handleRegisterRequest} className="w-full space-y-6">
          <div className="relative group">
            <ShieldCheck size={18} className="absolute left-0 bottom-3 text-gray-400 group-focus-within:text-red-600 z-10" />
            <input 
              type="text" required placeholder="Desired Username"
              className={inputStyle}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Lock size={18} className="absolute left-0 bottom-3 text-gray-400 group-focus-within:text-red-600 z-10" />
            <input 
              type="password" required placeholder="Password"
              className={inputStyle}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-4 bg-red-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-red-100"
          >
            {loading ? 'Submitting...' : 'Request Approval'}
          </button>
        </form>

        <footer className="mt-12 w-full space-y-6">
          <Link href="/auth/login?role=admin" className="text-[10px] font-bold uppercase text-gray-400 hover:text-red-600 transition-colors">
            Back to Sign In
          </Link>
          <div className="pt-6 border-t border-gray-50">
            <Link href="/" className="text-[9px] font-bold text-gray-300 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-gray-500 transition-colors">
              <ArrowLeft size={10} /> Exit
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}