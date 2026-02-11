"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [role, setRole] = useState<'voter' | 'admin'>('voter');
  const [showPassword, setShowPassword] = useState(false);

  // Updated inputStyle with light placeholder text
  const inputStyle = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-black placeholder:text-gray-400 placeholder:font-normal font-medium bg-white";

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-blue-600 transition-all duration-300">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <i className="fa-solid fa-graduation-cap text-4xl text-blue-600 mb-2"></i>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Union Election 2026</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Official Portal</p>
        </div>

        {/* Role Toggle Switch */}
        <div className="flex mb-8 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
          <button 
            type="button"
            onClick={() => setRole('voter')}
            className={`w-1/2 py-2.5 rounded-lg font-bold transition-all duration-200 ${
              role === 'voter' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Student
          </button>
          <button 
            type="button"
            onClick={() => setRole('admin')}
            className={`w-1/2 py-2.5 rounded-lg font-bold transition-all duration-200 ${
              role === 'admin' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Admin
          </button>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          {/* Combined Username / CRN Field */}
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
              {role === 'voter' ? 'Username / CRN' : 'Admin Username'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <i className="fa-solid fa-user-shield"></i>
              </span>
              <input 
                type="text" 
                required
                className={inputStyle}
                placeholder={role === 'voter' ? "e.g. 2023CS45" : "admin_id"} 
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Password</label>
              <Link href="/forgot-password" size="sm" className="text-[10px] font-black text-blue-600 uppercase tracking-tighter hover:underline">
                Reset?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                className={`${inputStyle} pr-12`}
                placeholder="••••••••" 
              />
              
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition focus:outline-none"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className={`w-full text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 transform ${
              role === 'voter' 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' 
                : 'bg-red-600 hover:bg-red-700 shadow-red-200'
            }`}
          >
            Verify & Enter
          </button>
        </form>

        </div>
    </div>
  );
}