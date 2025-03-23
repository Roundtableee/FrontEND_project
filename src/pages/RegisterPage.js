// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail]  = useState('');
  const [password, setPassword]  = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // ส่ง role: "user" ไปพร้อมกับข้อมูลอื่น
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
          role: 'user' // << ส่ง role user โดยอัตโนมัติ
        })
      });

      const data = await res.json();
      if (!res.ok) {
        // ถ้า status code ไม่ 2xx ให้โยน error
        throw new Error(data.message || 'Register failed');
      }

      alert('Register success! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleRegister}>
        <div>
          <label>Name: </label>
          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Phone: </label>
          <input
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email: </label>
          <input
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            type="email"
            required
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            type="password"
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
