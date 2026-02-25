import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';
  const usersUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  useEffect(() => {
    Promise.all([
      fetch(apiUrl).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
      fetch(usersUrl).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
    ])
      .then(([aData, uData]) => {
        setActivities(Array.isArray(aData) ? aData : aData.results || []);
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
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-muted">Loading activities&hellip;</span>
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <div className="container mt-4">
      <div className="card octofit-card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h2>&#127939; Activities</h2>
          <span className="badge bg-light text-dark">{activities.length} record{activities.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-body">
          {activities.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">No activities found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Athlete</th>
                    <th scope="col">Activity Type</th>
                    <th scope="col">Duration (min)</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={activity.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td><strong>{usersMap[activity.user] || activity.user}</strong></td>
                      <td>
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-2">
                          {activity.activity_type}
                        </span>
                      </td>
                      <td>{activity.duration}</td>
                      <td>{formatDate(activity.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Activities;
