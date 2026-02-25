import React, { useEffect, useState, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';
import EditUserModal from './EditUserModal';

const CODESPACE = process.env.REACT_APP_CODESPACE_NAME;
const USERS_ENDPOINT = CODESPACE
  ? `https://${CODESPACE}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/';
const TEAMS_ENDPOINT = CODESPACE
  ? `https://${CODESPACE}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';

function parseMembers(members) {
  if (Array.isArray(members)) return members;
  try {
    const parsed = JSON.parse(members);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function Users() {
  const [users, setUsers]       = useState([]);
  const [teams, setTeams]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [editing, setEditing]   = useState(null); // user being edited

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(USERS_ENDPOINT).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
      fetch(TEAMS_ENDPOINT).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
    ])
      .then(([usersData, teamsData]) => {
        setUsers(Array.isArray(usersData) ? usersData : usersData.results || []);
        setTeams(Array.isArray(teamsData) ? teamsData : teamsData.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Find the team name for a given user email
  function teamForUser(email) {
    const found = teams.find((t) => parseMembers(t.members).includes(email));
    return found ? found.name : '—';
  }

  function handleSave(updatedUser) {
    // Refresh both users and teams to reflect membership changes
    setEditing(null);
    loadData();
  }

  if (error)   return <div className="alert alert-danger">Error: {error}</div>;
  if (loading) return <LoadingSpinner label="Loading users…" />;

  return (
    <div className="container mt-4">
      <div className="octo-page-header">
        <h2 style={{ margin: 0 }}>Users</h2>
        <span className="octo-metric-chip">👤 {users.length} members</span>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Team</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email ? user.email.split('@')[0] : ''}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>{teamForUser(user.email)}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setEditing(user)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <EditUserModal
          user={editing}
          teams={teams}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

export default Users;
