"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  // Get data from the URL passed by the RegisterPage
  const email = searchParams.get('id');

  const handleVerifyRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fullOtp = otp.join('');
    const baseUrl = "http://localhost:5000";

    try {
      // 1. Verify the code with the backend
      const verifyRes = await fetch(`${baseUrl}otp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, otp: fullOtp }),
      });

      if (verifyRes.ok) {
        // 2. If code is good, call the final Register endpoint using data from URL
        const registerRes = await fetch(`${baseUrl}/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: searchParams.get('name'), 
            email: email, 
            password: searchParams.get('pw') 
          }),
        });

        if (registerRes.ok) {
          alert("Registration Successful!");
          router.push('/login');
        } else {
          const data = await registerRes.json();
          alert(data.message);
        }
      } else {
        alert("Invalid OTP code!");
      }
    } catch (err) {
      alert("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your OTP Input UI goes here */}
      <form onSubmit={handleVerifyRegistration}>
         {/* Mapping over otp state to create 6 inputs... */}
         <button type="submit" disabled={loading}>Verify & Register</button>
      </form>
    </div>
  );
}