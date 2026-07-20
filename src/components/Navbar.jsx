import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="app-nav-header">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="logo-svg">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
          Fit<span>Track</span>
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Dashboard
          </NavLink>
          <NavLink to="/builder" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Workout Builder
          </NavLink>
          <NavLink to="/exercises" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Exercises
          </NavLink>
          <NavLink to="/calculator" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            BMI Calculator
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
