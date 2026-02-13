import { useState } from 'react';

const initial = {
  title: '',
  description: '',
  category: 'Waste',
  severity: 'Medium',
  latitude: '',
  longitude: ''
};

export default function IssueForm({ user, onCreated }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');

  function captureLocation() {
    if (!navigator.geolocation) {
      setMessage('Geolocation API is unavailable in this browser.');
      return;
    }

    setMessage('Capturing current location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6))
        }));
        setMessage('Current location attached.');
      },
      () => {
        setMessage('Could not access your location. Please enter coordinates manually.');
      }
    );
  }

  function submitIssue(event) {
    event.preventDefault();

    const newIssue = {
      id: Date.now(),
      ...form,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      reportedBy: user.username
    };

    if (Number.isNaN(newIssue.latitude) || Number.isNaN(newIssue.longitude)) {
      setMessage('Please provide valid coordinates.');
      return;
    }

    onCreated(newIssue);
    setMessage('Issue added locally and shown on map.');
    setForm(initial);
  }

  return (
    <div className="card floating-card">
      <h3>Report an Issue</h3>
      <form onSubmit={submitIssue} className="issue-form">
        <input
          placeholder="Issue title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Describe the environmental issue"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <div className="row">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option>Waste</option>
            <option>Water Pollution</option>
            <option>Air Pollution</option>
            <option>Deforestation</option>
            <option>Noise</option>
          </select>
          <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>
        <div className="row">
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            required
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            required
          />
        </div>
        <button type="button" className="ghost-btn" onClick={captureLocation}>
          Use my current location
        </button>
        <button type="submit">Save report locally</button>
      </form>
      <small>{message}</small>
    </div>
  );
}
