import React, { useEffect, useState } from 'react';

const CODESPACE = process.env.REACT_APP_CODESPACE_NAME;
const TEAMS_ENDPOINT = CODESPACE
  ? `https://${CODESPACE}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';
const USERS_ENDPOINT = CODESPACE
  ? `https://${CODESPACE}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/';

// members arrives as a JSON-encoded string from the backend TextField
function parseMembers(members) {
  if (Array.isArray(members)) return members;
  try {
    const parsed = JSON.parse(members);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return members ? [members] : [];
  }
}

function Teams() {
  const [teams, setTeams]       = useState([]);
  const [emailToName, setEmailToName] = useState({});
  const [error, setError]       = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(TEAMS_ENDPOINT).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
      fetch(USERS_ENDPOINT).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
    ])
      .then(([teamsData, usersData]) => {
        setTeams(Array.isArray(teamsData) ? teamsData : teamsData.results || []);
        // Build email → name lookup map
        const users = Array.isArray(usersData) ? usersData : usersData.results || [];
        const map = {};
        users.forEach((u) => { map[u.email] = u.name; });
        setEmailToName(map);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <div className="octo-page-header">
        <h2 style={{ margin: 0 }}>Teams</h2>
        <span className="octo-metric-chip">🏆 {teams.length} teams</span>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Team Name</th>
            <th># Members</th>
            <th>Members</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => {
            const memberList = parseMembers(team.members);
            return (
              <tr key={team.id}>
                <td>{team.name}</td>
                <td>{memberList.length}</td>
                <td>
                  {memberList
                    .map((email) => emailToName[email] || email)
                    .join(', ')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Teams;
