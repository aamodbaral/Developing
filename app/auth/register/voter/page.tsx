"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Mail, Lock, User, IdCard, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function VoterRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    symbolNo: '',
    password: '',
    otp: ''
  });

  // FIXED: Higher contrast placeholder for visibility
  const inputStyle = "w-full pl-10 pr-10 py-3 border-b-2 border-gray-100 focus:border-blue-600 outline-none transition-all text-sm font-semibold bg-white text-gray-900 placeholder:text-gray-500 placeholder:opacity-100";

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Change this:
        body: JSON.stringify({ 
          name: formData.name, // Changed from username to name
          email: formData.email, 
          password: formData.password 
        }),
      });

      if (res.ok) {
        setStep(2);
      } else {
        const data = await res.json();
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Connection error to server");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: formData.otp 
        }),
      });

      if (res.ok) {
        alert("Registration successful!");
        router.push('/auth/login?role=voter');
      } else {
        const data = await res.json();
        alert(data.message || "Invalid OTP");
      }
    } catch (err) {
      alert("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-xs flex flex-col items-center text-center">
        
        <header className="mb-10">
          <GraduationCap size={42} className="text-blue-600 mx-auto mb-3" />
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Voter Join</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            {step === 1 ? "Create Student Account" : "Verify your Email"}
          </p>
        </header>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="w-full space-y-6">
            <div className="relative group">
              <User size={18} className="absolute left-0 bottom-3 text-gray-400 group-focus-within:text-blue-600 z-10" />
              <input 
                type="text" required placeholder="Full Name"
                className={inputStyle}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="relative group">
              <Mail size={18} className="absolute left-0 bottom-3 text-gray-400 group-focus-within:text-blue-600 z-10" />
              <input 
                type="email" required placeholder="College Email"
                className={inputStyle}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative group">
              <IdCard size={18} className="absolute left-0 bottom-3 text-gray-400 group-focus-within:text-blue-600 z-10" />
              <input 
                type="text" required placeholder="Symbol Number"
                className={inputStyle}
                onChange={(e) => setFormData({...formData, symbolNo: e.target.value})}
              />
            </div>

            <div className="relative group">
              <Lock size={18} className="absolute left-0 bottom-3 text-gray-400 group-focus-within:text-blue-600 z-10" />
              <input 
                type="password" required placeholder="Create Password"
                className={inputStyle}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-blue-100"
            >
              {loading ? 'Sending OTP...' : 'Get Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="w-full space-y-6 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">
              Code sent to {formData.email}
            </p>
            <div className="relative group">
              <ShieldCheck size={18} className="absolute left-0 bottom-3 text-gray-400 group-focus-within:text-blue-600 z-10" />
              <input 
                type="text" required placeholder="OTP Code"
                maxLength={6}
                className={`${inputStyle} text-center tracking-[0.5em]`}
                onChange={(e) => setFormData({...formData, otp: e.target.value})}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95"
            >
              {loading ? 'Verifying...' : 'Complete Registration'}
            </button>
            
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              Change Details
            </button>
          </form>
        )}

        <footer className="mt-12 w-full space-y-6">
          <div className="text-[10px] font-bold uppercase tracking-widest">
            <span className="text-gray-400">Already registered?</span>
            <Link href="/auth/login?role=voter" className="ml-2 text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>
          
          <div className="pt-6 border-t border-gray-50 flex justify-center">
            <Link href="/" className="text-[9px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2 hover:text-gray-500 transition-colors">
              <ArrowLeft size={10} /> Exit to Home
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}