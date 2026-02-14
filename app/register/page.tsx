"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Mail, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  
  const [role, setRole] = useState<'voter' | 'admin'>('voter');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const inputStyle = "w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-black bg-white font-medium";

  // --- REPLACE YOUR OLD handleSubmit WITH THIS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation before hitting the backend
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    const baseUrl = "http://localhost:5000";

    if (role === 'voter') {
      // PATH A: VOTER (Needs OTP first)
      try {
        const res = await fetch(`${baseUrl}otp/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });

        const data = await res.json();

        if (res.ok) {
          // Success: Move to OTP page and pass data so the OTP page can finish the registration
          // Use encodeURIComponent for safety with email strings
          const params = new URLSearchParams({
            id: formData.email,
            role: 'voter',
            name: formData.name,
            pw: formData.password
          });
          router.push(`/register/otp?${params.toString()}`);
        } else {
          alert(data.message || "Failed to send OTP");
        }
      } catch (err) {
        alert("Backend is not running!");
      }
    } else {
      // PATH B: ADMIN (Direct registration, then pending approval)
      try {
        const res = await fetch(`${baseUrl}/admins/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username: formData.username, 
            password: formData.password 
          }),
        });
        const data = await res.json();
        
        if (res.ok) {
          alert(data.message); // "Admin request submitted. Wait for approval..."
          router.push('/login');
        } else {
          alert(data.message || "Admin registration failed");
        }
      } catch (err) {
        alert("Error connecting to backend");
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
      {/* ... Your existing JSX remains exactly the same ... */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Create Account</h2>
          <p className="text-slate-500 font-bold text-xs mt-2 uppercase tracking-widest">Union Election 2026</p>
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

        <form className="space-y-5" onSubmit={handleSubmit}>
          {role === 'voter' ? (
            <>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                    <User size={18} strokeWidth={3} />
                  </span>
                  <input type="text" required className={inputStyle} placeholder="John Doe"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1.5 ml-1">University Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                    <Mail size={18} strokeWidth={3} />
                  </span>
                  <input type="email" required className={inputStyle} placeholder="symbolno@khwopa.edu.np"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1.5 ml-1">Admin Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <ShieldCheck size={18} strokeWidth={3} />
                </span>
                <input type="text" required className={inputStyle} placeholder="admin_kce"
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
              </div>
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1.5 ml-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Lock size={18} strokeWidth={3} />
              </span>
              <input type={showPassword ? "text" : "password"} required className={inputStyle} placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400">
                {showPassword ? <EyeOff size={20} strokeWidth={3} /> : <Eye size={20} strokeWidth={3} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1.5 ml-1">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <CheckCircle2 size={18} strokeWidth={3} />
              </span>
              <input type={showConfirmPassword ? "text" : "password"} required className={inputStyle} placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400">
                {showConfirmPassword ? <EyeOff size={20} strokeWidth={3} /> : <Eye size={20} strokeWidth={3} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className={`w-full text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 transform mt-4 ${loading ? 'bg-slate-400 cursor-not-allowed' : role === 'voter' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}>
            {loading ? (role === 'voter' ? 'Sending OTP...' : 'Processing...') : 'Register Account'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">
            Already have an account? <Link href="/login" className="text-blue-600 font-black hover:underline ml-1">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}