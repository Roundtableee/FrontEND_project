"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail]  = useState('');
  const [password, setPassword]  = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/hotels');
    }
  }, [router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
          role: 'user'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Register failed');
      }
      alert('Register success! Please login.');
      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="m-8">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block">Name:</label>
          <input
            className="border p-1 rounded"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block">Phone:</label>
          <input
            className="border p-1 rounded"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block">Email:</label>
          <input
            className="border p-1 rounded"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div>
          <label className="block">Password:</label>
          <input
            className="border p-1 rounded"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            type="password"
            required
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
