import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';
  const usersUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  useEffect(() => {
    Promise.all([
      fetch(apiUrl).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
      fetch(usersUrl).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
    ])
      .then(([lData, uData]) => {
        setEntries(Array.isArray(lData) ? lData : lData.results || []);
        const users = Array.isArray(uData) ? uData : uData.results || [];
        const map = {};
        users.forEach((u) => {
          map[u.username] = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username;
        });
        setUsersMap(map);
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [apiUrl, usersUrl]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="octofit-loading">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-muted">Loading leaderboard&hellip;</span>
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

  const rankClass = (rank) => {
    if (rank === 1) return 'rank-badge rank-1';
    if (rank === 2) return 'rank-badge rank-2';
    if (rank === 3) return 'rank-badge rank-3';
    return 'rank-badge rank-other';
  };

  return (
    <div className="container mt-4">
      <div className="card octofit-card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h2>&#127942; Leaderboard</h2>
          <span className="badge bg-light text-dark">{entries.length} athlete{entries.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-body">
          {entries.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">No leaderboard data found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered mb-0">
                <thead>
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">User</th>
                    <th scope="col">Score</th>
                    <th scope="col">Calories Burned</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => {
                    const rank = index + 1;
                    return (
                      <tr key={entry.id} className={rank <= 3 ? 'fw-semibold' : ''}>
                        <td>
                          <span className={rankClass(rank)}>{rank}</span>
                        </td>
                        <td>{usersMap[entry.user] || entry.user}</td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2">
                            {entry.score} pts
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 rounded-pill px-2">
                            🔥 {entry.calories != null ? entry.calories.toLocaleString() : '—'} kcal
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
