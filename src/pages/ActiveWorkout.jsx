import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { tickActiveTimer, toggleExerciseStatus, clearActiveSession } from '../store/slices/workoutSlice';
import { logWorkout } from '../store/slices/historySlice';

export default function ActiveWorkout() {
  const activeSession = useSelector((state) => state.workout.activeSession);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle stopwatch interval ticks
  useEffect(() => {
    if (!activeSession) return;
    
    const interval = setInterval(() => {
      dispatch(tickActiveTimer());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, dispatch]);

  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;
    
    const pad = (num) => String(num).padStart(2, '0');
    
    if (hours > 0) {
      return `${pad(hours)}:${pad(mins)}:${pad(remainingSecs)}`;
    }
    return `${pad(mins)}:${pad(remainingSecs)}`;
  };

  const handleToggle = (id) => {
    dispatch(toggleExerciseStatus({ exerciseId: id }));
  };

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard this active session? None of your progress will be logged.')) {
      dispatch(clearActiveSession());
      navigate('/');
    }
  };

  const handleComplete = () => {
    if (!activeSession) return;

    const elapsed = activeSession.elapsedSeconds;
    const durationFormatted = elapsed >= 60 
      ? `${Math.round(elapsed / 60)} mins` 
      : `${elapsed} secs`;

    // Estimate calories: ~7.5 calories burned per minute of average resistance training
    const estimatedCals = Math.max(Math.round((elapsed / 60) * 7.5), 15);

    const logItem = {
      id: `log-${Date.now()}`,
      routineName: activeSession.name,
      duration: durationFormatted,
      date: new Date().toLocaleDateString(),
      caloriesBurned: estimatedCals,
      exercisesCount: activeSession.exercises.length
    };

    dispatch(logWorkout(logItem));
    dispatch(clearActiveSession());
    alert(`Great job! Workout logged. You burned approximately ${estimatedCals} calories.`);
    navigate('/');
  };

  if (!activeSession) {
    return (
      <div className="active-workout-empty-card glass-panel fade-in text-center">
        <h2>No Active Session</h2>
        <p>You have not initialized a workout yet. Return to the dashboard and press "Start Session" on any routine.</p>
        <button onClick={() => navigate('/')} className="return-dashboard-btn">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const completedCount = activeSession.exercises.filter(ex => ex.status === 'completed').length;
  const progressPercent = (completedCount / activeSession.exercises.length) * 100;

  return (
    <div className="active-workout-page fade-in">
      <div className="active-session-header glass-panel">
        <div className="session-left">
          <span className="session-status-badge">Workout in Progress</span>
          <h1>{activeSession.name}</h1>
        </div>
        
        {/* Stopwatch display */}
        <div className="session-timer-display">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="timer-svg-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className="time-val">{formatTime(activeSession.elapsedSeconds)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="session-progress-wrapper glass-panel">
        <div className="progress-meta">
          <span>Overall Progression</span>
          <span>{completedCount} of {activeSession.exercises.length} Exercises Completed</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Exercises Checklist */}
      <div className="active-exercises-list">
        <h3>Exercise Checklist</h3>
        <div className="exercises-check-grid">
          {activeSession.exercises.map((ex) => {
            const isDone = ex.status === 'completed';
            
            return (
              <div
                key={ex.id}
                className={`exercise-check-card glass-panel ${isDone ? 'checked-card' : ''}`}
                onClick={() => handleToggle(ex.id)}
              >
                <div className="check-checkbox-wrapper">
                  <div className={`custom-checkbox ${isDone ? 'checkbox-active' : ''}`}>
                    {isDone && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="check-info">
                  <h4>{ex.name}</h4>
                  <div className="check-targets">
                    <span>{ex.sets} Sets</span>
                    <span>&bull;</span>
                    <span>{ex.reps} Reps</span>
                    <span>&bull;</span>
                    <span>Rest: {ex.rest}s</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Workout Actions */}
      <div className="active-workout-actions">
        <button onClick={handleComplete} className="complete-workout-btn">
          Finish and Log Workout
        </button>
        <button onClick={handleDiscard} className="discard-workout-btn">
          Discard Session
        </button>
      </div>
    </div>
  );
}
