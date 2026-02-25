import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function parseMembers(members) {
  if (Array.isArray(members)) return members;
  try { const p = JSON.parse(members); return Array.isArray(p) ? p : []; }
  catch { return []; }
}

function getInitials(name = '') {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/leaderboard/`).then((r) => r.json()),
      fetch(`${API_BASE}/api/users/`).then((r) => r.json()),
      fetch(`${API_BASE}/api/teams/`).then((r) => r.json()),
      fetch(`${API_BASE}/api/activities/`).then((r) => r.json()),
    ])
      .then(([lbData, usersData, teamsData, actData]) => {
        const users      = Array.isArray(usersData) ? usersData : usersData.results || [];
        const teams      = Array.isArray(teamsData) ? teamsData : teamsData.results || [];
        const activities = Array.isArray(actData)   ? actData   : actData.results   || [];
        const lb         = Array.isArray(lbData)    ? lbData    : lbData.results    || [];

        const emailToName = {};
        users.forEach((u) => { emailToName[u.email] = u.name; });

        const emailToTeam = {};
        teams.forEach((t) => {
          parseMembers(t.members).forEach((email) => { emailToTeam[email] = t.name; });
        });

        const emailToCalories = {};
        activities.forEach((a) => {
          emailToCalories[a.user] = (emailToCalories[a.user] || 0) + (a.duration || 0) * 10;
        });

        const enriched = lb
          .map((entry) => ({
            ...entry,
            displayName: emailToName[entry.user] || entry.user,
            team:        emailToTeam[entry.user]  || null,
            calories:    Math.round(emailToCalories[entry.user] || 0),
          }))
          .sort((a, b) => b.score - a.score);

        setEntries(enriched);
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  if (error)   return <div className="alert alert-danger">Error: {error}</div>;
  if (loading) return <LoadingSpinner label="Loading leaderboard…" />;

  const top3 = entries.slice(0, 3);
  const rest  = entries.slice(3);

  // Podium order: 2nd | 1st | 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div className="container mt-4">
      <div className="octo-page-header">
        <h2 style={{ margin: 0 }}>Leaderboard</h2>
        <span className="octo-metric-chip">🏆 {entries.length} athletes</span>
      </div>

      {/* Podium – top 3 */}
      {top3.length > 0 && (
        <div className="octo-podium">
          {podiumOrder.map((entry) => {
            const rank = entries.indexOf(entry) + 1;
            const medals = ['', '🥇', '🥈', '🥉'];
            const rankClass = `rank-${rank}`;
            return (
              <div key={entry.user} className={`octo-podium-slot ${rankClass}`}>
                <span className="octo-podium-medal">{medals[rank]}</span>
                <div className="octo-podium-name">{entry.displayName}</div>
                <div className="octo-podium-team">{entry.team || 'No team'}</div>
                <div className="octo-podium-score">{entry.score}</div>
                <div className="octo-podium-score-label">pts</div>
                {entry.calories > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className="octo-badge octo-badge-orange" style={{ fontSize: '0.7rem' }}>
                      🔥 {entry.calories} kcal
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Remaining rows */}
      {rest.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {rest.map((entry, i) => {
            const rank = i + 4;
            return (
              <div key={entry.user} className="octo-lb-row">
                <span className="octo-lb-rank">#{rank}</span>
                <div className="octo-lb-avatar">{getInitials(entry.displayName)}</div>
                <div className="octo-lb-info">
                  <p className="octo-lb-name">{entry.displayName}</p>
                  <p className="octo-lb-sub">
                    {entry.team
                      ? <span className="octo-badge octo-badge-green" style={{ fontSize: '0.7rem', padding: '0.1em 0.5em' }}>{entry.team}</span>
                      : <span style={{ color: 'var(--f-muted)', fontSize: '0.75rem' }}>No team</span>
                    }
                  </p>
                </div>
                <div className="octo-lb-stats">
                  {entry.calories > 0 && (
                    <span className="octo-badge octo-badge-orange" style={{ fontSize: '0.7rem' }}>🔥 {entry.calories}</span>
                  )}
                  <span className="octo-lb-score">{entry.score}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {entries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--f-muted)' }}>
          No leaderboard data yet.
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
