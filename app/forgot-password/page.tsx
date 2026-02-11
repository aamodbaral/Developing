"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [submitted, setSubmitted] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Consistent input styling: Black text when typing, light gray placeholders
  const inputStyle = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-black placeholder:text-gray-400 placeholder:font-normal font-medium";

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-blue-600">
        
        {/* Header Section */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Account Recovery</h2>
          <p className="text-gray-500 text-sm">Choose how you want to reset your password.</p>
        </div>

        {!submitted ? (
          <>
            {/* Method Toggle Tabs */}
            <div className="flex mb-6 bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setMethod('email')}
                className={`w-1/2 py-2 rounded-lg font-bold transition-all ${
                  method === 'email' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Email
              </button>
              <button 
                onClick={() => setMethod('phone')}
                className={`w-1/2 py-2 rounded-lg font-bold transition-all ${
                  method === 'phone' ? 'bg-red-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Phone (Admin)
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ID Confirmation Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Roll No / Employee ID</label>
                <input 
                  type="text" 
                  required 
                  className={inputStyle} 
                  placeholder="Enter ID (e.g. 2023/CS/01)" 
                />
              </div>

              {/* Dynamic Recovery Input Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {method === 'email' ? 'College Email' : 'Registered Phone Number'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                    <i className={`fa-solid ${method === 'email' ? 'fa-envelope' : 'fa-phone'}`}></i>
                  </span>
                  <input 
                    type={method === 'email' ? 'email' : 'tel'} 
                    required 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className={`${inputStyle} pl-10`} 
                    placeholder={method === 'email' ? "student@college.edu" : "+91 XXXXX XXXXX"} 
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100">
                Send Recovery Code
              </button>
            </form>
          </>
        ) : (
          /* Success Message Section */
          <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-[2rem] text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-paper-plane text-xl"></i>
            </div>
            <p className="text-green-800 text-sm font-bold mb-1">Recovery Sent!</p>
            <p className="text-green-700 text-xs mb-4">
              {method === 'email' 
                ? `A reset link has been sent to ${inputValue}` 
                : `An OTP has been sent to your phone ending in ${inputValue.slice(-4)}`}
            </p>
            <Link href="/login" className="inline-block bg-white border border-green-200 text-green-600 text-xs px-6 py-2 rounded-xl font-bold hover:bg-green-100 transition">
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}