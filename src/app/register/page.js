"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import style from './page.module.css';

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
      const res = await fetch('http://localhost:5000/auth/register', {
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
    <div className={style.container}>
      <div className={style.card}>
        <h2 className={style.header}>Register</h2>
        {error && <p className={style.error}>{error}</p>}

        <form onSubmit={handleRegister} className={style.form}>
          <div className={style.inputGroup}>
            <label className={style.label}>Name:</label>
            <input
              className={style.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={style.inputGroup}>
            <label className={style.label}>Phone:</label>
            <input
              className={style.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className={style.inputGroup}>
            <label className={style.label}>Email:</label>
            <input
              className={style.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div className={style.inputGroup}>
            <label className={style.label}>Password:</label>
            <input
              className={style.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          <button type="submit" className={style.submitButton}>Register</button>
        </form>
      </div>
    </div>
  );
}
