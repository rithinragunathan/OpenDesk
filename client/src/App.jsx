import { useEffect, useState } from 'react';
import AuthPanel from './components/AuthPanel';
import IssueForm from './components/IssueForm';
import IssuesMap from './components/IssuesMap';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { token, user, isAuthenticated, saveSession, logout } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadIssues() {
    setLoading(true);
    try {
      const response = await fetch('/api/issues');
      const data = await response.json();
      setIssues(Array.isArray(data) ? data : []);
    } catch (error) {
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIssues();
  }, []);

  return (
    <main>
      <header>
        <h1>EcoReport Community Platform</h1>
        <p>Report environmental problems, map hotspots, and empower local action with data.</p>
      </header>

      {!isAuthenticated ? (
        <AuthPanel onAuthenticated={({ token: nextToken, user: nextUser }) => saveSession(nextToken, nextUser)} />
      ) : (
        <section className="dashboard">
          <div className="card welcome-card">
            <h2>Welcome, {user.fullName}</h2>
            <p>Track and report issues in your community with secure JWT-based access.</p>
            <button className="switch-btn" onClick={logout}>
              Logout
            </button>
          </div>
          <IssueForm token={token} onCreated={loadIssues} />
        </section>
      )}

      <section>
        {loading ? <p>Loading mapped issues...</p> : <IssuesMap issues={issues} />}
      </section>
    </main>
  );
}
