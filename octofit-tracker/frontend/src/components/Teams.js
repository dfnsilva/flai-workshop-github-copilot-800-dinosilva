import React, { useState, useEffect, useCallback } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Manage-members modal
  const [managingTeam, setManagingTeam] = useState(null); // full team object
  const [memberSaving, setMemberSaving] = useState(false);
  const [memberError, setMemberError] = useState('');

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const teamsUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';
  const usersUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(teamsUrl).then((r) => { if (!r.ok) throw new Error(`Teams: HTTP ${r.status}`); return r.json(); }),
      fetch(usersUrl).then((r) => { if (!r.ok) throw new Error(`Users: HTTP ${r.status}`); return r.json(); }),
    ])
      .then(([tData, uData]) => {
        setTeams(Array.isArray(tData) ? tData : tData.results || []);
        setAllUsers(Array.isArray(uData) ? uData : uData.results || []);
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [teamsUrl, usersUrl]);

  useEffect(fetchData, [fetchData]);

  // ── Manage members ────────────────────────────────────────────
  const openManage = (team) => {
    setManagingTeam({ ...team, members: Array.isArray(team.members) ? [...team.members] : [] });
    setMemberError('');
  };
  const closeManage = () => setManagingTeam(null);

  const removeMember = (username) => {
    setManagingTeam((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m !== username),
    }));
  };

  const addMember = (username) => {
    setManagingTeam((prev) => {
      if (prev.members.includes(username)) return prev;
      return { ...prev, members: [...prev.members, username] };
    });
  };

  const saveMembers = () => {
    if (!managingTeam) return;
    setMemberSaving(true);
    fetch(`${teamsUrl}${managingTeam.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ members: managingTeam.members }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => { throw new Error(JSON.stringify(d)); });
        return res.json();
      })
      .then(() => { setMemberSaving(false); closeManage(); fetchData(); })
      .catch((err) => { setMemberSaving(false); setMemberError(`Save failed: ${err.message}`); });
  };

  // ── Helpers ───────────────────────────────────────────────────
  const userFullName = (username) => {
    const u = allUsers.find((x) => x.username === username);
    if (!u) return username;
    return `${u.first_name || ''} ${u.last_name || ''}`.trim() || username;
  };

  const renderMembers = (members) => {
    const list = Array.isArray(members) ? members : String(members).split(',').map((m) => m.trim()).filter(Boolean);
    if (list.length === 0) return <span className="text-muted fst-italic">No members</span>;
    return list.map((m, i) => <span key={i} className="member-badge">{userFullName(m)}</span>);
  };

  const availableToAdd = allUsers.filter(
    (u) => managingTeam && !managingTeam.members.includes(u.username)
  );

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="octofit-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-muted">Loading teams&hellip;</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2" style={{ fontSize: '1.2rem' }}>&#9888;</span>
          <span><strong>Error:</strong> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card octofit-card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h2>&#129309; Teams</h2>
          <span className="badge bg-light text-dark">
            {teams.length} team{teams.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="card-body">
          {teams.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">No teams found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Team Name</th>
                    <th scope="col">Members</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => (
                    <tr key={team.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td><strong>{team.name}</strong></td>
                      <td>{renderMembers(team.members)}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openManage(team)}
                        >
                          &#9998; Manage Members
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Manage Members Modal */}
      {managingTeam && (
        <>
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title">
                    Manage Members &mdash; <em>{managingTeam.name}</em>
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={closeManage} />
                </div>
                <div className="modal-body">
                  {memberError && <div className="alert alert-danger py-2">{memberError}</div>}

                  {/* Current members */}
                  <h6 className="fw-bold mb-2">Current Members</h6>
                  {managingTeam.members.length === 0 ? (
                    <p className="text-muted fst-italic mb-3">No members yet.</p>
                  ) : (
                    <div className="d-flex flex-wrap gap-2 mb-3 p-2 border rounded bg-light">
                      {managingTeam.members.map((m) => (
                        <span key={m} className="d-inline-flex align-items-center member-badge gap-1">
                          {userFullName(m)}
                          <button
                            type="button"
                            className="btn-close btn-close-sm ms-1"
                            style={{ fontSize: '0.6rem' }}
                            aria-label={`Remove ${m}`}
                            onClick={() => removeMember(m)}
                          />
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Available users to add */}
                  <h6 className="fw-bold mb-2">Add Members</h6>
                  {availableToAdd.length === 0 ? (
                    <p className="text-muted fst-italic mb-0">All users are already members.</p>
                  ) : (
                    <div className="d-flex flex-wrap gap-2 p-2 border rounded">
                      {availableToAdd.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          className="btn btn-outline-success btn-sm"
                          onClick={() => addMember(u.username)}
                        >
                          &#43; {`${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeManage} disabled={memberSaving}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={saveMembers} disabled={memberSaving}>
                    {memberSaving
                      ? <><span className="spinner-border spinner-border-sm me-1" />Saving&hellip;</>
                      : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" onClick={closeManage} />
        </>
      )}
    </div>
  );
}

export default Teams;
