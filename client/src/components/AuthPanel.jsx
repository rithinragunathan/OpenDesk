import { useState } from 'react';

const DEMO_USERS = {
  citizen: { username: 'citizen', password: 'Citizen@123', fullName: 'Community Citizen' },
  staff: { username: 'staff', password: 'Staff@123', fullName: 'Support Staff' },
  admin: { username: 'admin', password: 'Admin@123', fullName: 'Platform Admin' }
};

export default function AuthPanel({ onAuthenticated }) {
  const [form, setForm] = useState({ role: 'citizen', username: '', password: '' });
  const [status, setStatus] = useState('Select your portal role to continue.');

  function submitForm(event) {
    event.preventDefault();

    const selected = DEMO_USERS[form.role];
    const valid =
      selected && form.username.trim() === selected.username && form.password === selected.password;

    if (!valid) {
      setStatus('Invalid login for selected role. Use the demo credentials shown below.');
      return;
    }

    setStatus(`Welcome ${selected.fullName}. Loading ${form.role} portal...`);
    onAuthenticated({
      token: `frontend-only-${form.role}`,
      user: {
        username: selected.username,
        fullName: selected.fullName,
        role: form.role
      }
    });
  }

  return (
    <div className="portal-card auth-card">
      <h2>Elite Sign In</h2>
      <p>Choose your role and enter credentials to access your dedicated portal experience.</p>

      <form onSubmit={submitForm}>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          aria-label="Select role"
        >
          <option value="citizen">Citizen Portal</option>
          <option value="staff">Staff Portal</option>
          <option value="admin">Admin Control Center</option>
        </select>
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
        <button type="submit">Enter Portal</button>
      </form>

      <div className="demo-credentials">
        <strong>Demo Accounts</strong>
        <span>Citizen → citizen / Citizen@123</span>
        <span>Staff → staff / Staff@123</span>
        <span>Admin → admin / Admin@123</span>
      </div>
      <small>{status}</small>
    </div>
  );
}
