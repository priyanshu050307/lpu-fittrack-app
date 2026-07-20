import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import WorkoutBuilder from './pages/WorkoutBuilder';
import ExerciseSearch from './pages/ExerciseSearch';
import BMIPlanner from './pages/BMIPlanner';
import ActiveWorkout from './pages/ActiveWorkout';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="fittrack-layout">
          <div className="animated-blobs">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
          </div>
          
          <Navbar />
          
          <main className="main-content-wrapper">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/builder" element={<WorkoutBuilder />} />
              <Route path="/exercises" element={<ExerciseSearch />} />
              <Route path="/calculator" element={<BMIPlanner />} />
              <Route path="/active" element={<ActiveWorkout />} />
            </Routes>
          </main>

          <footer className="fittrack-footer">
            <p>&copy; 2026 FitTrack Pro. Dynamic Workout Planner and Health Metrics Tracker. Built with React, Redux, and React Router.</p>
          </footer>
        </div>
      </Router>
    </Provider>
  );
}
