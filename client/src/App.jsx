import { useEffect, useMemo, useState } from 'react';
import AuthPanel from './components/AuthPanel';
import IssueForm from './components/IssueForm';
import IssuesMap from './components/IssuesMap';
import { useAuth } from './hooks/useAuth';

const ISSUES_KEY = 'eco_issues';

const starterIssues = [
  {
    id: 1,
    title: 'Garbage dumping near river bank',
    description: 'Plastic and mixed waste are accumulating near the water edge.',
    category: 'Waste',
    severity: 'High',
    latitude: 28.6139,
    longitude: 77.209,
    reportedBy: 'admin'
  },
  {
    id: 2,
    title: 'Open burning in residential lane',
    description: 'Smoke from open waste burning is affecting nearby homes.',
    category: 'Air Pollution',
    severity: 'Critical',
    latitude: 19.076,
    longitude: 72.8777,
    reportedBy: 'admin'
  }
];

function loadStoredIssues() {
  const raw = localStorage.getItem(ISSUES_KEY);
  if (!raw) {
    localStorage.setItem(ISSUES_KEY, JSON.stringify(starterIssues));
    return starterIssues;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : starterIssues;
  } catch {
    return starterIssues;
  }
}

export default function App() {
  const { user, isAuthenticated, saveSession, logout } = useAuth();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    setIssues(loadStoredIssues());
  }, []);

  const stats = useMemo(() => {
    const criticalCount = issues.filter((item) => item.severity === 'Critical').length;
    return {
      total: issues.length,
      critical: criticalCount,
      categories: new Set(issues.map((item) => item.category)).size
    };
  }, [issues]);

  function handleIssueCreate(newIssue) {
    const updated = [newIssue, ...issues];
    setIssues(updated);
    localStorage.setItem(ISSUES_KEY, JSON.stringify(updated));
  }

  return (
    <main>
      <header className="hero">
        <h1>EcoReport Community Platform</h1>
        <p>Frontend-only workspace for reporting and visualizing local environmental issues.</p>
        <div className="stats-grid">
          <article className="stat-card">
            <span>Total Reports</span>
            <strong>{stats.total}</strong>
          </article>
          <article className="stat-card">
            <span>Critical Alerts</span>
            <strong>{stats.critical}</strong>
          </article>
          <article className="stat-card">
            <span>Active Categories</span>
            <strong>{stats.categories}</strong>
          </article>
        </div>
      </header>

      {!isAuthenticated ? (
        <AuthPanel onAuthenticated={saveSession} />
      ) : (
        <section className="dashboard">
          <div className="card welcome-card">
            <h2>Welcome back, {user.username}</h2>
            <p>
              You are signed in with local frontend credentials. Submit new reports and preview markers
              instantly with no backend dependency.
            </p>
            <button className="switch-btn" onClick={logout}>
              Logout
            </button>
          </div>
          <IssueForm user={user} onCreated={handleIssueCreate} />
        </section>
      )}

      <section>
        <IssuesMap issues={issues} />
      </section>
    </main>
  );
}
