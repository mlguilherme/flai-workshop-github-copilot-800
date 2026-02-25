import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  const m = parseInt(month, 10);
  return `${MONTHS[m - 1] || month} ${parseInt(day, 10)}, ${year}`;
}

function activityMeta(type = '') {
  const t = type.toLowerCase();
  if (t.includes('run') || t.includes('jog'))                            return { icon: '🏃', cls: 'run' };
  if (t.includes('cycl') || t.includes('bike'))                         return { icon: '🚴', cls: 'cycle' };
  if (t.includes('swim'))                                               return { icon: '🏊', cls: 'swim' };
  if (t.includes('gym') || t.includes('weight') || t.includes('strength')) return { icon: '🏋️', cls: 'gym' };
  if (t.includes('yoga') || t.includes('stretch'))                      return { icon: '🧘', cls: 'gym' };
  if (t.includes('walk') || t.includes('hike'))                         return { icon: '🥾', cls: 'run' };
  return { icon: '⚡', cls: 'other' };
}

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [emailToName, setEmailToName] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/activities/`).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
      fetch(`${API_BASE}/api/users/`).then((r)      => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
    ])
      .then(([actData, userData]) => {
        const acts  = Array.isArray(actData)  ? actData  : actData.results  || [];
        const users = Array.isArray(userData) ? userData : userData.results || [];
        const map = {};
        users.forEach((u) => { map[u.email] = u.name; });
        setActivities(acts);
        setEmailToName(map);
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  if (error)   return <div className="alert alert-danger">Error: {error}</div>;
  if (loading) return <LoadingSpinner label="Loading activities…" />;

  const totalCalories = activities.reduce((sum, a) => sum + (a.duration || 0) * 10, 0);
  const totalMinutes  = activities.reduce((sum, a) => sum + (a.duration || 0), 0);

  return (
    <div className="container mt-4">
      <div className="octo-page-header">
        <h2 style={{ margin: 0 }}>Activities</h2>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span className="octo-metric-chip">🏃 {activities.length} logged</span>
          <span className="octo-metric-chip">🔥 {totalCalories.toLocaleString()} kcal</span>
          <span className="octo-metric-chip">⏱ {totalMinutes} min total</span>
        </div>
      </div>

      <div className="octo-activity-feed">
        {activities.map((a) => {
          const { icon, cls } = activityMeta(a.activity_type);
          const name = emailToName[a.user] || a.user;
          const calories = Math.round((a.duration || 0) * 10);
          return (
            <div className="octo-activity-row" key={a.id}>
              <div className={`octo-activity-type-icon ${cls}`}>{icon}</div>
              <div className="octo-activity-info">
                <p className="octo-activity-name">{name}</p>
                <p className="octo-activity-sub">
                  <span className="octo-badge octo-badge-green" style={{ fontSize: '0.7rem', padding: '0.15em 0.55em' }}>
                    {a.activity_type}
                  </span>
                </p>
              </div>
              <div className="octo-activity-stats">
                <div className="octo-activity-stat-item">
                  <span className="octo-activity-stat-value">{a.duration}</span>
                  <span className="octo-activity-stat-label">min</span>
                </div>
                <div className="octo-activity-stat-item">
                  <span className="octo-activity-stat-value" style={{ color: 'var(--f-orange)' }}>{calories}</span>
                  <span className="octo-activity-stat-label">kcal</span>
                </div>
              </div>
              <div className="octo-activity-date">{formatDate(a.date)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Activities;
