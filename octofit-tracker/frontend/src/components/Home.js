import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../octofitapp-small.png';
import LoadingSpinner from './LoadingSpinner';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

const CARDS = [
  { path: '/users',       label: 'Users',       icon: '👤', description: 'View all registered OctoFit members and their profiles.',     color: '#388bfd' },
  { path: '/teams',       label: 'Teams',       icon: '🏆', description: 'Browse teams and see who is competing together.',             color: '#2da44e' },
  { path: '/activities',  label: 'Activities',  icon: '🏃', description: 'Explore logged fitness activities across all members.',       color: '#f78166' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '📊', description: 'Check the current rankings and top performers.',              color: '#e3b341' },
  { path: '/workouts',    label: 'Workouts',    icon: '💪', description: 'Discover personalized workout plans and exercises.',          color: '#bc8cff' },
];

const STAT_ENDPOINTS = [
  { label: 'Members',     icon: '👤', url: `${API_BASE}/api/users/` },
  { label: 'Teams',       icon: '🏆', url: `${API_BASE}/api/teams/` },
  { label: 'Activities',  icon: '🏃', url: `${API_BASE}/api/activities/` },
  { label: 'Workouts',    icon: '💪', url: `${API_BASE}/api/workouts/` },
];

function Home() {
  const navigate = useNavigate();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      STAT_ENDPOINTS.map(({ url }) =>
        fetch(url)
          .then((r) => r.json())
          .then((d) => (Array.isArray(d) ? d.length : (d.results || []).length))
          .catch(() => '—')
      )
    ).then((counts) => {
      setStats(STAT_ENDPOINTS.map((s, i) => ({ ...s, count: counts[i] })));
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="octo-hero">
        <div className="octo-hero-inner">
          <img src={logo} alt="OctoFit logo" className="octo-hero-logo" />
          <div>
            <h1 className="octo-home-title">OctoFit Tracker</h1>
            <p className="octo-home-subtitle">
              Track activities, compete with teammates, and crush your fitness goals.
            </p>
          </div>
        </div>
      </div>

      {/* Live stats bar */}
      <div className="octo-stats-bar">
        {loading ? (
          <LoadingSpinner label="Loading stats…" />
        ) : (
          stats.map(({ label, icon, count }) => (
            <div className="octo-stat" key={label}>
              <span className="octo-stat-icon">{icon}</span>
              <span className="octo-stat-count">{count}</span>
              <span className="octo-stat-label">{label}</span>
            </div>
          ))
        )}
      </div>

      {/* Navigation cards */}
      <div className="octo-cards-grid">
        {CARDS.map(({ path, label, icon, description, color }) => (
          <div
            key={path}
            className="octo-card"
            style={{ '--card-accent': `${color}`, '--card-glow': `${color}20`, '--card-border': `${color}50` }}
            onClick={() => navigate(path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(path)}
          >
            <div className="octo-card-icon">{icon}</div>
            <h5 className="octo-card-title">{label}</h5>
            <p className="octo-card-desc">{description}</p>
            <span className="octo-card-arrow">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
