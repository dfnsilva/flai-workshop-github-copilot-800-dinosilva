import React, { useState, useEffect } from 'react';

const emptyForm = { username: '', first_name: '', last_name: '', email: '', password: '' };

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [addError, setAddError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  const fetchUsers = () => {
    setLoading(true);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : data.results || [];
        setUsers(items);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchUsers, [apiUrl]);

  const openAdd = () => { setAddForm(emptyForm); setAddError(''); setShowAdd(true); };
  const closeAdd = () => setShowAdd(false);

  const fullName = (user) => {
    const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return name || user.username;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.username.trim() || !addForm.first_name.trim() || !addForm.last_name.trim() ||
        !addForm.email.trim() || !addForm.password.trim()) {
      setAddError('All fields are required.');
      return;
    }
    setSaving(true);
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addForm),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => { throw new Error(JSON.stringify(d)); });
        return res.json();
      })
      .then(() => { setSaving(false); setShowAdd(false); fetchUsers(); })
      .catch((err) => { setSaving(false); setAddError(`Failed to add user: ${err.message}`); });
  };

  const confirmDelete = (user) => setDeleteTarget(user);
  const cancelDelete = () => setDeleteTarget(null);

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    fetch(`${apiUrl}${deleteTarget.id}/`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
        setDeleting(false);
        setDeleteTarget(null);
        fetchUsers();
      })
      .catch((err) => {
        setDeleting(false);
        setError(`Delete failed: ${err.message}`);
        setDeleteTarget(null);
      });
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="octofit-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-muted">Loading users&hellip;</span>
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
          <h2>&#128100; Users</h2>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-dark">
              {users.length} record{users.length !== 1 ? 's' : ''}
            </span>
            <button className="btn btn-success btn-sm" onClick={openAdd}>
              &#43; Add User
            </button>
          </div>
        </div>
        <div className="card-body">
          {users.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">No users found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Full Name</th>
                    <th scope="col">Email</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td>
                        <strong>{fullName(user)}</strong>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>@{user.username}</div>
                      </td>
                      <td>
                        <a href={`mailto:${user.email}`} className="text-decoration-none">
                          {user.email}
                        </a>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => confirmDelete(user)}
                        >
                          &#128465; Delete
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

      {/* Add User Modal */}
      {showAdd && (
        <>
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title">Add New User</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={closeAdd} />
                </div>
                <form onSubmit={handleAddSubmit}>
                  <div className="modal-body">
                    {addError && <div className="alert alert-danger py-2">{addError}</div>}
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Peter"
                          value={addForm.first_name}
                          onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })}
                          autoFocus
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Parker"
                          value={addForm.last_name}
                          onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. spiderman"
                        value={addForm.username}
                        onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="e.g. user@example.com"
                        value={addForm.email}
                        onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={addForm.password}
                        onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeAdd} disabled={saving}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success" disabled={saving}>
                      {saving
                        ? <><span className="spinner-border spinner-border-sm me-1" />Saving&hellip;</>
                        : 'Add User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" onClick={closeAdd} />
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <>
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={cancelDelete} />
                </div>
                <div className="modal-body">
                  Are you sure you want to delete{' '}
                  <strong>{fullName(deleteTarget)}</strong>? This cannot be undone.
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={cancelDelete} disabled={deleting}>
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                    {deleting
                      ? <><span className="spinner-border spinner-border-sm me-1" />Deleting&hellip;</>
                      : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" onClick={cancelDelete} />
        </>
      )}
    </div>
  );
}

export default Users;
