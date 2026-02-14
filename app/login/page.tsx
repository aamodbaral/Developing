"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Importing Lucide icons for high-visibility and reliability
import { GraduationCap, User, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  const [role, setRole] = useState<'voter' | 'admin'>('voter');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });

  const inputStyle = "w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all text-black placeholder:text-gray-400 font-bold bg-white";

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
        credentials: 'include', 
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to OTP verification after login
        router.push(`/login/otp?id=${formData.identifier}&role=${role}`);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Connection error. Is your backend running on port 3000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={36} strokeWidth={2.5} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Union Election</h2>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mt-2">Official Secure Portal 2026</p>
        </div>

        {/* Role Toggle */}
        <div className="flex mb-8 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button type="button" onClick={() => setRole('voter')}
            className={`w-1/2 py-3 rounded-xl font-black transition-all duration-200 uppercase text-xs tracking-widest ${role === 'voter' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>
            Student
          </button>
          <button type="button" onClick={() => setRole('admin')}
            className={`w-1/2 py-3 rounded-xl font-black transition-all duration-200 uppercase text-xs tracking-widest ${role === 'admin' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>
            Admin
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Identifier Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-2 ml-1">
              {role === 'admin' ? 'Admin Username' : 'University Email'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                {role === 'admin' ? <ShieldCheck size={20} strokeWidth={3} /> : <Mail size={20} strokeWidth={3} />}
              </span>
              <input 
                type={role === 'admin' ? 'text' : 'email'} 
                required
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                className={inputStyle}
                placeholder={role === 'admin' ? 'admin_user' : 'symbolno@khwopa.edu.np'} 
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-tighter">Password</label>
              <Link href="/forgot-password" size="sm" className="text-[10px] font-black text-blue-600 uppercase tracking-tighter hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Lock size={20} strokeWidth={3} />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputStyle}
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition"
              >
                {showPassword ? <EyeOff size={22} strokeWidth={3} /> : <Eye size={22} strokeWidth={3} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className={`w-full text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 transform mt-2 ${loading ? 'bg-slate-400 cursor-not-allowed' : role === 'voter' ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200' : 'bg-red-600 hover:bg-red-700 hover:shadow-red-200'}`}>
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        {/* REGISTER SECTION */}
        <div className="mt-10 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">
            {role === 'admin' ? "Need admin access?" : "First time voting?"}{" "}
            <Link 
              href={role === 'admin' ? "/admin/register" : "/register"} 
              className={`font-black uppercase text-xs tracking-wider hover:underline transition ml-1 ${role === 'admin' ? 'text-red-600' : 'text-blue-600'}`}
            >
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}