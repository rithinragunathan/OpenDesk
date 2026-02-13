import { useState } from 'react';

const initial = {
  title: '',
  description: '',
  area: '',
  category: 'Waste',
  severity: 'Medium',
  latitude: '',
  longitude: ''
};

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation API is unavailable in this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export default function IssueForm({ user, onCreated, onRequireMap }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('Fill area manually or leave it blank to auto-capture location.');

  async function captureLocation() {
    setMessage('Capturing current location...');

    try {
      const position = await getCurrentPosition();
      const lat = Number(position.coords.latitude.toFixed(6));
      const lng = Number(position.coords.longitude.toFixed(6));

      setForm((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        area: prev.area || `Auto area near ${lat}, ${lng}`
      }));
      setMessage('Location captured. Area filled automatically.');
      onRequireMap();
    } catch {
      setMessage('Could not access your location. Please provide area and coordinates manually.');
    }
  }

  async function submitIssue(event) {
    event.preventDefault();

    let latitude = Number(form.latitude);
    let longitude = Number(form.longitude);
    let area = form.area.trim();

    if (!area) {
      try {
        const position = await getCurrentPosition();
        latitude = Number(position.coords.latitude.toFixed(6));
        longitude = Number(position.coords.longitude.toFixed(6));
        area = `Auto area near ${latitude}, ${longitude}`;
        onRequireMap();
      } catch {
        setMessage('Area is required. Allow location or provide area manually.');
        return;
      }
    }

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setMessage('Please provide valid coordinates or allow geolocation.');
      return;
    }

    const newIssue = {
      id: Date.now(),
      ...form,
      area,
      latitude,
      longitude,
      reportedBy: user.username,
      reportedByRole: user.role,
      status: 'Kept',
      supportNote: 'Request kept for staff review.',
      createdAt: new Date().toISOString()
    };

    onCreated(newIssue);
    setMessage('Request submitted and kept for staff review.');
    setForm(initial);
  }

  return (
    <div className="portal-card citizen-panel">
      <h3>Raise Environmental Request</h3>
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
        <input
          placeholder="Area / locality (optional if geolocation is allowed)"
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
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
            required={Boolean(form.area)}
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            required={Boolean(form.area)}
          />
        </div>
        <button type="button" className="ghost-btn" onClick={captureLocation}>
          Fetch my location + show map
        </button>
        <button type="submit">Submit Request</button>
      </form>
      <small>{message}</small>
    </div>
  );
}
