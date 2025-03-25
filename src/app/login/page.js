"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import style from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]  = useState('');
  const [password, setPassword]  = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If already logged in, redirect to hotels page
      router.push('/hotels');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Call the login API
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Trigger a re-render in the Layout
      window.dispatchEvent(new Event('authChange'));

      alert(`Welcome, ${data.user?.name || 'User'}!`);
      router.push('/hotels');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        <h2 className={style.header}>Login</h2>
        {error && <p className={style.error}>{error}</p>}

        <form onSubmit={handleLogin} className={style.form}>
          <div className={style.inputGroup}>
            <label className={style.label}>Email:</label>
            <input
              className={style.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={style.inputGroup}>
            <label className={style.label}>Password:</label>
            <input
              className={style.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={style.submitButton}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
