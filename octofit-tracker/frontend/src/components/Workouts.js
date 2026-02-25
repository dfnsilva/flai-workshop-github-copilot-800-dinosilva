import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  useEffect(() => {
    console.log('Workouts: fetching from', apiUrl);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Workouts: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setWorkouts(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="octofit-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-muted">Loading workouts&hellip;</span>
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

  const renderExercises = (exercises) => {
    const list = Array.isArray(exercises)
      ? exercises
      : String(exercises).split(',').map((e) => e.trim()).filter(Boolean);
    return list.map((ex, i) => (
      <span key={i} className="exercise-badge">{ex}</span>
    ));
  };

  return (
    <div className="container mt-4">
      <div className="card octofit-card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h2>&#128170; Workouts</h2>
          <span className="badge bg-light text-dark">{workouts.length} plan{workouts.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-body">
          {workouts.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">No workouts found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Exercises</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout, index) => (
                    <tr key={workout.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td><strong>{workout.name}</strong></td>
                      <td className="text-muted">{workout.description}</td>
                      <td>{renderExercises(workout.exercises)}</td>
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

export default Workouts;
