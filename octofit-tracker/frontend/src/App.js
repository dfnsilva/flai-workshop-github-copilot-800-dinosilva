import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const navLinks = [
  { to: '/users',       label: 'Users' },
  { to: '/teams',       label: 'Teams' },
  { to: '/activities',  label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts',    label: 'Workouts' },
];

const features = [
  { icon: '👤', title: 'User Profiles',     desc: 'Manage athlete profiles and credentials.' },
  { icon: '🏃', title: 'Activity Logging',  desc: 'Track workouts, runs, and exercise sessions.' },
  { icon: '🤝', title: 'Team Management',   desc: 'Create teams and collaborate with others.' },
  { icon: '🏆', title: 'Leaderboard',       desc: 'Compete and rank up against your teammates.' },
  { icon: '💪', title: 'Workout Plans',     desc: 'Get personalized workout suggestions.' },
];

function HomePage() {
  return (
    <div className="mt-4">
      {/* Hero */}
      <div className="octofit-hero mb-5">
        <h1>Welcome to OctoFit Tracker</h1>
        <p className="lead mb-4">
          Your all-in-one fitness companion — log activities, challenge teams, and climb the leaderboard.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className="btn btn-outline-light btn-sm px-3">
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div className="row g-3 mb-4">
        {features.map((f) => (
          <div key={f.title} className="col-12 col-sm-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex gap-3 align-items-start">
                <span style={{ fontSize: '2rem', lineHeight: 1 }}>{f.icon}</span>
                <div>
                  <h5 className="card-title mb-1">{f.title}</h5>
                  <p className="card-text text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="octofit-footer">
        OctoFit Tracker &copy; {new Date().getFullYear()} &mdash; Built with React &amp; Django
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* ── Navbar ── */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            🐙 OctoFit Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {navLinks.map((l) => (
                <li key={l.to} className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      'nav-link' + (isActive ? ' active' : '')
                    }
                    to={l.to}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* ── Page content ── */}
      <div className="container mb-5">
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/users"       element={<Users />} />
          <Route path="/teams"       element={<Teams />} />
          <Route path="/activities"  element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts"    element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
