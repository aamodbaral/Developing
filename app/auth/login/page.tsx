"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'voter';
  const [role, setRole] = useState<'voter' | 'admin'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });

  const registerPath = role === 'admin' ? '/auth/register/admin' : '/auth/register/voter';

  // UPDATED STYLE: Increased placeholder contrast and added focus rings
  const inputStyle = "w-full pl-10 pr-10 py-3 border-b-2 border-gray-100 focus:border-blue-600 outline-none transition-all text-sm font-semibold bg-white text-gray-900 placeholder:text-gray-500 placeholder:opacity-100";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = role === 'admin' ? '/admins/login' : '/users/login';
    const baseUrl = "http://localhost:5000"; 

    const payload = role === 'admin' 
      ? { username: formData.identifier, password: formData.password }
      : { email: formData.identifier, password: formData.password };

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        const isSuperAdmin = role === 'admin' && formData.identifier === 'superadmin' && formData.password === 'superadmin123';
        localStorage.setItem('token', data.token || 'session-active'); 
        localStorage.setItem('userRole', isSuperAdmin ? 'superadmin' : role);
        router.push(isSuperAdmin ? '/superadmin/dashboard' : role === 'admin' ? '/admin/dashboard' : '/voter-dashboard');
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white p-6">
      
      <div className="w-full max-w-xs flex flex-col items-center">
        <header className="mb-10 text-center">
          <GraduationCap size={40} className="text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Union Election</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Authorized Access 2026</p>
        </header>

        <div className="flex gap-8 mb-10 w-full justify-center border-b border-gray-50">
          <button 
            type="button"
            onClick={() => setRole('voter')} 
            className={`pb-3 text-[11px] font-black uppercase tracking-widest transition-all ${role === 'voter' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-300'}`}
          >
            Voter
          </button>
          <button 
            type="button"
            onClick={() => setRole('admin')} 
            className={`pb-3 text-[11px] font-black uppercase tracking-widest transition-all ${role === 'admin' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-300'}`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-7">
          <div className="relative group">
            <span className={`absolute left-0 bottom-3 z-20 text-gray-400 transition-colors ${role === 'voter' ? 'group-focus-within:text-blue-600' : 'group-focus-within:text-red-600'}`}>
              {role === 'admin' ? <ShieldCheck size={18} /> : <Mail size={18} />}
            </span>
            <input 
              type={role === 'admin' ? 'text' : 'email'} 
              required
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              className={`${inputStyle} ${role === 'admin' ? 'focus:border-red-600' : 'focus:border-blue-600'}`}
              placeholder={role === 'admin' ? 'Admin Username' : 'College Email'} 
            />
          </div>

          <div className="relative group">
            <span className={`absolute left-0 bottom-3 z-20 text-gray-400 transition-colors ${role === 'voter' ? 'group-focus-within:text-blue-600' : 'group-focus-within:text-red-600'}`}>
              <Lock size={18} />
            </span>
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`${inputStyle} ${role === 'admin' ? 'focus:border-red-600' : 'focus:border-blue-600'}`}
              placeholder="Password" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-0 bottom-3 z-20 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] text-white transition-all transform active:scale-95 ${loading ? 'bg-gray-200' : role === 'voter' ? 'bg-blue-600 hover:shadow-lg hover:shadow-blue-100' : 'bg-red-600 hover:shadow-lg hover:shadow-red-100'}`}
          >
            {loading ? 'Processing...' : 'Secure Sign In'}
          </button>
        </form>

        <footer className="mt-12 w-full text-center space-y-6">
          <div className="text-[10px] font-bold uppercase tracking-widest">
            <span className="text-gray-400">First time here?</span>
            <Link 
              href={registerPath} 
              className={`ml-2 font-black transition-colors ${role === 'voter' ? 'text-blue-600 hover:text-blue-800' : 'text-red-600 hover:text-red-800 underline'}`}
            >
              {role === 'admin' ? 'Request Admin Access' : 'Register Now'}
            </Link>
          </div>
          
          <div className="pt-6 border-t border-gray-50 flex flex-col gap-3">
            <Link href="/forgot-password" size="sm" className="text-[9px] font-bold text-gray-300 uppercase tracking-widest hover:text-gray-500">
              Forgot Password?
            </Link>
            <Link href="/" className="text-[9px] font-bold text-gray-300 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-gray-500">
              <ArrowLeft size={10} /> Back to Landing
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}