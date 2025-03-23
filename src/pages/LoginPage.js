// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail]  = useState('');
  const [password, setPassword]  = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    // ตัวอย่างใน LoginPage.js
try {
  const res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // สมมติ data = { token: 'xxxxx' }
  if (!data.token) {
    throw new Error('No token in response');
  }

  // บันทึก token ลง localStorage
  localStorage.setItem('token', data.token);

  // แทนที่จะ alert ชื่อ user, เปลี่ยนเป็น alert ธรรมดา
  alert('Login success!');
  navigate('/hotels');

} catch (err) {
  setError(err.message);
}

  };

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <div>
          <label>Email: </label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
