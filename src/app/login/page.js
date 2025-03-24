"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]  = useState('');
  const [password, setPassword]  = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // ถ้า login แล้ว ให้ไปหน้า hotels
      router.push('/hotels');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // เรียก API login
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // เก็บ token, user ลง localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // dispatch event เพื่อให้ Layout re-render
      window.dispatchEvent(new Event('authChange'));

      alert(`Welcome, ${data.user?.name || 'User'}!`);
      router.push('/hotels');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="m-8">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block">Email:</label>
          <input
            className="border p-1 rounded"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block">Password:</label>
          <input
            className="border p-1 rounded"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
