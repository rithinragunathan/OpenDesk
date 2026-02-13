import { useState } from 'react';

const CREDENTIALS = {
  username: 'admin',
  password: 'Admin@123'
};

export default function AuthPanel({ onAuthenticated }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [status, setStatus] = useState('Use demo credentials to continue.');

  function submitForm(event) {
    event.preventDefault();

    const isValid =
      form.username.trim() === CREDENTIALS.username && form.password === CREDENTIALS.password;

    if (!isValid) {
      setStatus('Invalid credentials. Username: admin | Password: Admin@123');
      return;
    }

    setStatus('Signed in successfully. Redirecting to dashboard...');
    onAuthenticated({
      token: 'frontend-only-session',
      user: {
        username: CREDENTIALS.username,
        fullName: 'Platform Admin'
      }
    });
  }

  return (
    <div className="card auth-card">
      <div className="auth-glow" />
      <h2>Secure Sign In</h2>
      <p>Backend is disconnected. This login is fully local for UI development.</p>
      <form onSubmit={submitForm}>
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <div className="demo-credentials">
        <strong>Demo Access</strong>
        <span>Username: admin</span>
        <span>Password: Admin@123</span>
      </div>
      <small>{status}</small>
    </div>
  );
}
