import { useState } from 'react';

const initialForm = {
  fullName: '',
  email: '',
  password: ''
};

export default function AuthPanel({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');

  async function submitForm(event) {
    event.preventDefault();
    setStatus('Authenticating...');

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

    const payload =
      mode === 'login'
        ? { email: form.email, password: form.password }
        : { fullName: form.fullName, email: form.email, password: form.password };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.message || 'Authentication failed.');
      return;
    }

    setStatus('Authenticated successfully.');
    onAuthenticated(data);
  }

  async function handleGoogle() {
    const idToken = window.prompt('Paste Google ID token here (from Google Sign-In flow):');
    if (!idToken) return;

    setStatus('Verifying Google account...');
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus(data.message || 'Google Sign-In failed.');
      return;
    }

    onAuthenticated(data);
  }

  return (
    <div className="card auth-card">
      <h2>Community Access</h2>
      <p>Sign in to report local environmental concerns and monitor status updates.</p>
      <form onSubmit={submitForm}>
        {mode === 'register' && (
          <input
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          minLength={8}
        />
        <button type="submit">{mode === 'login' ? 'Login' : 'Create account'}</button>
      </form>
      <button className="ghost-btn" onClick={handleGoogle} type="button">
        Continue with Google
      </button>
      <button
        className="switch-btn"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        type="button"
      >
        {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
      <small>{status}</small>
    </div>
  );
}
