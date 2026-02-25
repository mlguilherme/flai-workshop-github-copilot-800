import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import logo from './octofitapp-small.png';
import Home from './components/Home';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const NAV_ITEMS = [
  { path: '/users',       label: 'Users',       icon: '👤' },
  { path: '/teams',       label: 'Teams',       icon: '🏆' },
  { path: '/activities',  label: 'Activities',  icon: '🏃' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '📊' },
  { path: '/workouts',    label: 'Workouts',    icon: '💪' },
];

function closeNavbar() {
  const el = document.getElementById('octoNav');
  if (el && el.classList.contains('show')) {
    // Use Bootstrap's Collapse API if available, otherwise toggle class directly
    if (window.bootstrap && window.bootstrap.Collapse) {
      window.bootstrap.Collapse.getInstance(el)?.hide();
    } else {
      el.classList.remove('show');
    }
  }
}

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg octo-navbar">
        <div className="container-fluid">
          {/* Logo + brand – left-justified */}
          <NavLink className="navbar-brand" to="/" onClick={closeNavbar}>
            <img src={logo} alt="OctoFit logo" />
            OctoFit <span className="brand-accent">Tracker</span>
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#octoNav"
            aria-controls="octoNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="octoNav">
            <ul className="navbar-nav ms-3">
              {NAV_ITEMS.map(({ path, label, icon }) => (
                <li className="nav-item" key={path}>
                  <NavLink
                    className={({ isActive }) =>
                      'nav-link' + (isActive ? ' active' : '')
                    }
                    to={path}
                    onClick={closeNavbar}
                  >
                    <span className="nav-icon">{icon}</span>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <main className="container octo-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
