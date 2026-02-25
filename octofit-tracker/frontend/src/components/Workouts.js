import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

// exercises arrives as a JSON-encoded string from the backend TextField
function parseExercises(exercises) {
  if (Array.isArray(exercises)) return exercises;
  try {
    const parsed = JSON.parse(exercises);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function exerciseLabel(e) {
  let detail = e.name;
  if (e.sets)             detail += ` · ${e.sets} sets`;
  if (e.reps)             detail += ` × ${e.reps} reps`;
  if (e.duration_seconds) detail += ` · ${e.duration_seconds}s`;
  if (e.duration_minutes) detail += ` · ${e.duration_minutes} min`;
  return detail;
}

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

const ENDPOINT = `${API_BASE}/api/workouts/`;

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    console.log('Workouts: fetching from', ENDPOINT);
    fetch(ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Workouts: fetched data', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (error)   return <div className="alert alert-danger">Error: {error}</div>;
  if (loading) return <LoadingSpinner label="Loading workouts…" />;

  return (
    <div className="container mt-4">
      <div className="octo-page-header">
        <h2 style={{ margin: 0 }}>Workouts</h2>
        <span className="octo-metric-chip">💪 {workouts.length} plans</span>
      </div>
      <div className="row g-4">
        {workouts.map((w) => {
          const exercises = parseExercises(w.exercises);
          return (
            <div className="col-12 col-md-6" key={w.id}>
              <div className="octo-workout-card">
                <div className="octo-workout-header">
                  <div className="octo-workout-icon">💪</div>
                  <div>
                    <h5 className="octo-workout-title">{w.name}</h5>
                    <span className="octo-badge octo-badge-purple">
                      {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <p className="octo-workout-desc">{w.description}</p>
                <ul className="octo-exercise-list">
                  {exercises.map((e, i) => (
                    <li key={i} className="octo-exercise-item">
                      <span className="octo-exercise-dot" />
                      {exerciseLabel(e)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Workouts;
