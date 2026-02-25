import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function parseMembers(members) {
  if (Array.isArray(members)) return members;
  try {
    const parsed = JSON.parse(members);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Modal for editing a user's personal details and team membership.
 * Props:
 *   user     – the user object being edited
 *   teams    – full list of team objects  
 *   onSave   – callback(updatedUser) called after a successful save
 *   onClose  – callback to close the modal without saving
 */
function EditUserModal({ user, teams, onSave, onClose }) {
  const [form, setForm] = useState({
    name:  user.name  || '',
    email: user.email || '',
    age:   user.age   || '',
  });
  const [teamId, setTeamId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  // Pre-select the team that currently contains this user's email
  useEffect(() => {
    const current = teams.find((t) =>
      parseMembers(t.members).includes(user.email)
    );
    setTeamId(current ? current.id : '');
  }, [user.email, teams]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // 1. PATCH user fields
      const userRes = await fetch(`${API_BASE}/api/users/${user.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:  form.name,
          email: form.email,
          age:   parseInt(form.age, 10),
        }),
      });
      if (!userRes.ok) throw new Error(`User update failed (HTTP ${userRes.status})`);
      const updatedUser = await userRes.json();

      // 2. Update team membership
      const oldEmail = user.email;
      const newEmail = form.email;

      // Find the team the user currently belongs to
      const oldTeam = teams.find((t) =>
        parseMembers(t.members).includes(oldEmail)
      );
      const oldTeamId = oldTeam ? oldTeam.id : '';

      if (oldTeamId !== teamId) {
        // Remove from old team
        if (oldTeam) {
          const updatedMembers = parseMembers(oldTeam.members).filter(
            (m) => m !== oldEmail
          );
          await fetch(`${API_BASE}/api/teams/${oldTeam.id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ members: JSON.stringify(updatedMembers) }),
          });
        }

        // Add to new team
        if (teamId) {
          const newTeam = teams.find((t) => t.id === teamId);
          if (newTeam) {
            const updatedMembers = [
              ...parseMembers(newTeam.members).filter((m) => m !== oldEmail),
              newEmail,
            ];
            await fetch(`${API_BASE}/api/teams/${newTeam.id}/`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ members: JSON.stringify(updatedMembers) }),
            });
          }
        }
      } else if (oldTeamId === teamId && oldEmail !== newEmail && teamId) {
        // Email changed but same team — update email in members list
        const sameTeam = teams.find((t) => t.id === teamId);
        if (sameTeam) {
          const updatedMembers = parseMembers(sameTeam.members).map((m) =>
            m === oldEmail ? newEmail : m
          );
          await fetch(`${API_BASE}/api/teams/${sameTeam.id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ members: JSON.stringify(updatedMembers) }),
          });
        }
      }

      onSave(updatedUser);
    } catch (err) {
      console.error('EditUserModal: save error', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal d-block"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content octo-modal">

          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <form onSubmit={handleSave}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2">{error}</div>
              )}

              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  className="form-control octo-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control octo-input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Age</label>
                <input
                  className="form-control octo-input"
                  name="age"
                  type="number"
                  min="1"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Team</label>
                <select
                  className="form-select octo-input"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                >
                  <option value="">— No team —</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default EditUserModal;
