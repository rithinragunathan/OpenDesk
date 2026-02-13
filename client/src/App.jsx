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
    area: 'North River Ward',
    category: 'Waste',
    severity: 'High',
    latitude: 28.6139,
    longitude: 77.209,
    reportedBy: 'citizen',
    reportedByRole: 'citizen',
    status: 'In Review',
    supportNote: 'Field team assigned.',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Open burning in residential lane',
    description: 'Smoke from open waste burning is affecting nearby homes.',
    area: 'Central Market Block',
    category: 'Air Pollution',
    severity: 'Critical',
    latitude: 19.076,
    longitude: 72.8777,
    reportedBy: 'citizen_two',
    reportedByRole: 'citizen',
    status: 'Kept',
    supportNote: 'Request kept for staff review.',
    createdAt: new Date().toISOString()
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

function PortalHeader({ user, onLogout, onToggleMap, showMap }) {
  return (
    <div className={`portal-card role-banner role-${user.role}`}>
      <h2>
        {user.fullName} <span className="pill">{user.role}</span>
      </h2>
      <p>
        {user.role === 'citizen' && 'Submit requests and track your complaint status.'}
        {user.role === 'staff' && 'Review requests from citizens and resolve or decline issues.'}
        {user.role === 'admin' && 'Monitor platform health, requests, and resolution performance.'}
      </p>
      <div className="action-row">
        <button className="ghost-btn" onClick={onToggleMap}>
          {showMap ? 'Hide map' : 'Show map'}
        </button>
        <button className="switch-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

function CitizenBoard({ user, issues, onCreated, onShowMap }) {
  const own = issues.filter((issue) => issue.reportedBy === user.username);

  return (
    <>
      <IssueForm user={user} onCreated={onCreated} onRequireMap={onShowMap} />
      <div className="portal-card citizen-history">
        <h3>My Submitted Requests</h3>
        <div className="ticket-grid">
          {own.length === 0 ? (
            <p>No requests yet.</p>
          ) : (
            own.map((issue) => (
              <article key={issue.id} className="ticket">
                <strong>{issue.title}</strong>
                <span>{issue.area}</span>
                <span className={`status-badge status-${issue.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {issue.status}
                </span>
                <small>{issue.supportNote || 'Awaiting update from staff/admin.'}</small>
              </article>
            ))
          )}
        </div>
      </div>
    </>
  );
}

function StaffConsole({ issues, onDecision }) {
  const citizenIssues = issues.filter((item) => item.reportedByRole === 'citizen');

  return (
    <div className="portal-card staff-panel">
      <h3>Staff Operations Portal</h3>
      <p>See incoming requests from various citizens and update triage decisions.</p>
      <div className="ticket-grid">
        {citizenIssues.map((issue) => (
          <article className="ticket staff-ticket" key={issue.id}>
            <strong>{issue.title}</strong>
            <span>
              {issue.area} · {issue.category} · {issue.severity}
            </span>
            <small>Raised by: {issue.reportedBy}</small>
            <div className="action-row">
              <button onClick={() => onDecision(issue.id, 'Resolved', 'Resolved by staff team.')}>Resolve</button>
              <button
                className="danger-btn"
                onClick={() => onDecision(issue.id, 'Declined', 'Declined after verification.')}
              >
                Decline
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function AdminConsole({ issues, onSupportUpdate }) {
  const today = new Date().toDateString();
  const requestsToday = issues.filter((item) => new Date(item.createdAt).toDateString() === today).length;
  const resolved = issues.filter((item) => item.status === 'Resolved').length;
  const declined = issues.filter((item) => item.status === 'Declined').length;
  const uptime = '99.93%';

  return (
    <div className="portal-card admin-panel">
      <h3>Admin Control Center</h3>
      <div className="metric-grid">
        <article>
          <span>System Health</span>
          <strong>{uptime}</strong>
        </article>
        <article>
          <span>Requests Today</span>
          <strong>{requestsToday}</strong>
        </article>
        <article>
          <span>Resolved</span>
          <strong>{resolved}</strong>
        </article>
        <article>
          <span>Declined</span>
          <strong>{declined}</strong>
        </article>
      </div>

      <div className="admin-grid">
        {issues.map((issue) => (
          <article className="admin-issue" key={issue.id}>
            <strong>{issue.title}</strong>
            <small>
              {issue.area} · {issue.reportedBy} ({issue.reportedByRole})
            </small>
            <select
              value={issue.status}
              onChange={(e) => onSupportUpdate(issue.id, { status: e.target.value })}
            >
              <option>Kept</option>
              <option>In Review</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Declined</option>
            </select>
            <textarea
              rows={2}
              placeholder="Add support note"
              value={issue.supportNote || ''}
              onChange={(e) => onSupportUpdate(issue.id, { supportNote: e.target.value })}
            />
          </article>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const { user, isAuthenticated, saveSession, logout } = useAuth();
  const [issues, setIssues] = useState([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setIssues(loadStoredIssues());
  }, []);

  const stats = useMemo(() => {
    const criticalCount = issues.filter((item) => item.severity === 'Critical').length;
    const openCount = issues.filter((item) => !['Resolved', 'Declined'].includes(item.status)).length;
    return {
      total: issues.length,
      critical: criticalCount,
      open: openCount
    };
  }, [issues]);

  function persist(updated) {
    setIssues(updated);
    localStorage.setItem(ISSUES_KEY, JSON.stringify(updated));
  }

  function handleIssueCreate(newIssue) {
    persist([newIssue, ...issues]);
  }

  function handleSupportUpdate(id, patch) {
    const updated = issues.map((issue) => (issue.id === id ? { ...issue, ...patch } : issue));
    persist(updated);
  }

  function handleStaffDecision(id, status, supportNote) {
    handleSupportUpdate(id, { status, supportNote });
  }

  return (
    <main className={`app-shell role-${user?.role || 'guest'}`}>
      <header className="hero elite-hero">
        <h1>EcoReport Elite Console</h1>
        <p>Role-first workflow with premium UX for citizen, staff, and admin operations.</p>
        <div className="stats-grid">
          <article className="stat-card">
            <span>Total Requests</span>
            <strong>{stats.total}</strong>
          </article>
          <article className="stat-card">
            <span>Critical Alerts</span>
            <strong>{stats.critical}</strong>
          </article>
          <article className="stat-card">
            <span>Active Queue</span>
            <strong>{stats.open}</strong>
          </article>
        </div>
      </header>

      {!isAuthenticated ? (
        <AuthPanel onAuthenticated={saveSession} />
      ) : (
        <section className="dashboard">
          <PortalHeader
            user={user}
            onLogout={logout}
            showMap={showMap}
            onToggleMap={() => setShowMap((prev) => !prev)}
          />

          {user.role === 'citizen' && (
            <CitizenBoard
              user={user}
              issues={issues}
              onCreated={handleIssueCreate}
              onShowMap={() => setShowMap(true)}
            />
          )}
          {user.role === 'staff' && <StaffConsole issues={issues} onDecision={handleStaffDecision} />}
          {user.role === 'admin' && (
            <AdminConsole issues={issues} onSupportUpdate={handleSupportUpdate} />
          )}
        </section>
      )}

      {showMap && (
        <section className="map-section enter-up">
          <IssuesMap issues={issues} />
        </section>
      )}
    </main>
  );
}
