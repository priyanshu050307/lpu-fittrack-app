import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startWorkoutSession, deleteRoutine } from '../store/slices/workoutSlice';
import { clearHistory } from '../store/slices/historySlice';

export default function Dashboard() {
  const profile = useSelector((state) => state.user);
  const routines = useSelector((state) => state.workout.routines);
  const history = useSelector((state) => state.history.history);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleStart = (id) => {
    dispatch(startWorkoutSession(id));
    navigate('/active');
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'bmi-under' };
    if (bmi < 25) return { text: 'Healthy Weight', color: 'bmi-healthy' };
    if (bmi < 30) return { text: 'Overweight', color: 'bmi-over' };
    return { text: 'Obese', color: 'bmi-obese' };
  };

  const bmiDetails = getBMICategory(profile.bmi);

  // Compute stats
  const totalWorkouts = history.length;
  const totalCalories = history.reduce((sum, item) => sum + item.caloriesBurned, 0);
  
  // Custom SVG Bar Chart Details
  // We'll graph caloriesBurned for the last 5 workouts
  const chartWidth = 500;
  const chartHeight = 180;
  const barPadding = 20;
  const chartData = [...history].slice(0, 5).reverse(); // Oldest of the 5 first for left-to-right timeline
  const maxCal = Math.max(...chartData.map((d) => d.caloriesBurned), 400);

  return (
    <div className="dashboard-page fade-in">
      <div className="page-header">
        <h1>Welcome Back, <span>{profile.name}</span></h1>
        <p>Track your health progress and routines in one unified space.</p>
      </div>

      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="stat-card glass-panel profile-summary-card">
          <div className="stat-card-header">
            <h3>Health Profile</h3>
          </div>
          <div className="profile-details-grid">
            <div className="profile-detail">
              <span className="label">Height</span>
              <span className="val">{profile.height} cm</span>
            </div>
            <div className="profile-detail">
              <span className="label">Weight</span>
              <span className="val">{profile.weight} kg</span>
            </div>
            <div className="profile-detail">
              <span className="label">Target Calories</span>
              <span className="val">{profile.dailyCalorieTarget} kcal</span>
            </div>
            <div className="profile-detail bmi-detail-container">
              <span className="label">BMI Score</span>
              <span className="val">{profile.bmi}</span>
              <span className={`bmi-tag ${bmiDetails.color}`}>{bmiDetails.text}</span>
            </div>
          </div>
        </div>

        {/* Global Summary Statistics */}
        <div className="stat-card glass-panel stats-totals-card">
          <div className="stat-card-header">
            <h3>Overall Accomplishments</h3>
          </div>
          <div className="stats-metric-wrapper">
            <div className="metric-box">
              <span className="metric-number">{totalWorkouts}</span>
              <span className="metric-label">Completed Sessions</span>
            </div>
            <div className="metric-box">
              <span className="metric-number">{totalCalories}</span>
              <span className="metric-label">Calories Melted (kcal)</span>
            </div>
          </div>
        </div>

        {/* Custom SVG Graph */}
        <div className="stat-card glass-panel chart-card full-row">
          <div className="stat-card-header">
            <h3>Calorie Burn Timeline (Last 5 Sessions)</h3>
          </div>
          {chartData.length === 0 ? (
            <div className="empty-chart-msg">Log some workouts to view your burn metrics.</div>
          ) : (
            <div className="svg-chart-container">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="svg-chart">
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                  <line
                    key={i}
                    x1="40"
                    y1={10 + r * (chartHeight - 40)}
                    x2={chartWidth - 10}
                    y2={10 + r * (chartHeight - 40)}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="1"
                  />
                ))}

                {/* Y-axis label */}
                <text x="5" y="15" fill="#6b7280" fontSize="10">kcal</text>

                {/* Bars */}
                {chartData.map((d, index) => {
                  const barCount = chartData.length;
                  const sectionWidth = (chartWidth - 60) / barCount;
                  const x = 50 + index * sectionWidth + barPadding;
                  const barWidth = sectionWidth - barPadding * 2;
                  const barHeight = (d.caloriesBurned / maxCal) * (chartHeight - 50);
                  const y = chartHeight - 30 - barHeight;

                  return (
                    <g key={d.id} className="chart-bar-group">
                      {/* Bar Fill */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx="4"
                        fill="url(#barGradient)"
                        className="chart-bar"
                      />
                      
                      {/* Value label on hover / static */}
                      <text
                        x={x + barWidth / 2}
                        y={y - 6}
                        fill="#f3f4f6"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {d.caloriesBurned}
                      </text>

                      {/* Date label */}
                      <text
                        x={x + barWidth / 2}
                        y={chartHeight - 12}
                        fill="#9ca3af"
                        fontSize="9"
                        textAnchor="middle"
                      >
                        {d.date.split('/')[0] + '/' + d.date.split('/')[1]}
                      </text>
                    </g>
                  );
                })}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}
        </div>

        {/* Routines Card */}
        <div className="stat-card glass-panel routines-dashboard-card full-row">
          <div className="stat-card-header">
            <h3>My Workout Routines</h3>
            <button onClick={() => navigate('/builder')} className="header-action-btn">
              + New Routine
            </button>
          </div>
          <div className="routines-grid">
            {routines.map((routine) => (
              <div key={routine.id} className="routine-card glass-panel">
                <div className="routine-header">
                  <h4>{routine.name}</h4>
                  <span className="ex-count">{routine.exercises.length} Exercises</span>
                </div>
                <p className="routine-desc">{routine.description}</p>
                <div className="routine-actions">
                  <button onClick={() => handleStart(routine.id)} className="start-session-btn">
                    Start Session
                  </button>
                  <button onClick={() => dispatch(deleteRoutine(routine.id))} className="delete-routine-btn" aria-label="Delete routine">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed History List */}
        <div className="stat-card glass-panel history-list-card full-row">
          <div className="stat-card-header">
            <h3>Workout Log History</h3>
            {history.length > 0 && (
              <button onClick={() => dispatch(clearHistory())} className="clear-history-btn">
                Clear All Logs
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <div className="empty-history-msg">No logs recorded yet. Complete a workout to populate your history log.</div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-main">
                    <h5>{item.routineName}</h5>
                    <span className="history-date">{item.date}</span>
                  </div>
                  <div className="history-metrics">
                    <span className="metric"><span className="lbl">Duration:</span> {item.duration}</span>
                    <span className="metric"><span className="lbl">Exercises:</span> {item.exercisesCount}</span>
                    <span className="metric cal-metric"><span className="lbl">Burned:</span> {item.caloriesBurned} kcal</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
