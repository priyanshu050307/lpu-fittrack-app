import React, { useState } from 'react';

const EXERCISE_LIBRARY = [
  {
    id: 'lib-1',
    name: 'Barbell Squat',
    muscle: 'Quads / Glutes',
    category: 'Legs',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: 'Rest a barbell on your upper back. Stand with feet shoulder-width apart. Squat down by pushing your hips back and bending your knees until thighs are parallel to the floor, then drive back up.'
  },
  {
    id: 'lib-2',
    name: 'Dumbbell Bench Press',
    muscle: 'Chest',
    category: 'Chest',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: 'Lie flat on a bench holding dumbbells at chest level. Press the weights straight up over your chest until arms are extended, then slowly lower them back down to the start position.'
  },
  {
    id: 'lib-3',
    name: 'Bent Over Row',
    muscle: 'Lats / Upper Back',
    category: 'Back',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: 'Bend forward at the hips with knees slightly bent. Hold a barbell with palms facing down. Pull the barbell up towards your lower chest, squeezing shoulder blades, then lower slowly.'
  },
  {
    id: 'lib-4',
    name: 'Plank Hold',
    muscle: 'Core / Abs',
    category: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: 'Support your weight on forearms and toes. Keep your body in a straight line from head to heels. Contract your abdominal muscles and hold this position without letting hips sag.'
  },
  {
    id: 'lib-5',
    name: 'Overhead Shoulder Press',
    muscle: 'Deltoids',
    category: 'Shoulders',
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: 'Sit or stand holding dumbbells at shoulder height with palms facing forward. Press the weights straight overhead until your elbows lock, then slowly lower to shoulders.'
  },
  {
    id: 'lib-6',
    name: 'Romanian Deadlift',
    muscle: 'Hamstrings / Glutes',
    category: 'Legs',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: 'Stand holding a barbell at hip level. Keeping knees slightly bent and back straight, hinge at hips to lower the bar down the front of legs. Squeeze glutes to return upright.'
  },
  {
    id: 'lib-7',
    name: 'Push-Ups',
    muscle: 'Chest / Triceps',
    category: 'Chest',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: 'Place hands slightly wider than shoulders. Keep your body straight. Lower chest to the floor by bending elbows, then push back up to the starting plank position.'
  },
  {
    id: 'lib-8',
    name: 'Hanging Leg Raise',
    muscle: 'Lower Abs',
    category: 'Core',
    equipment: 'Pull-up Bar',
    difficulty: 'Advanced',
    instructions: 'Hang from a pull-up bar with arms straight. Keeping legs straight, lift them up until they are horizontal/parallel to the floor, then lower them slowly back to start.'
  },
  {
    id: 'lib-9',
    name: 'Pull-Ups',
    muscle: 'Lats / Biceps',
    category: 'Back',
    equipment: 'Pull-up Bar',
    difficulty: 'Advanced',
    instructions: 'Hang from a bar with a wide overhand grip. Pull your body upward until your chin clears the bar, then lower yourself slowly under control to full extension.'
  },
  {
    id: 'lib-10',
    name: 'Dumbbell Lateral Raise',
    muscle: 'Lateral Deltoids',
    category: 'Shoulders',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: 'Stand holding dumbbells at your sides. Keeping a slight bend in your elbows, raise the weights out to the sides until arms are parallel to the floor, then lower slowly.'
  }
];

export default function ExerciseSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [activeExercise, setActiveExercise] = useState(null);

  const filteredExercises = EXERCISE_LIBRARY.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.muscle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ex.equipment.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesCategory = selectedCategory === '' || ex.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === '' || ex.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = ['', 'Legs', 'Chest', 'Back', 'Core', 'Shoulders'];
  const difficulties = ['', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="exercise-search-page fade-in">
      <div className="page-header">
        <h1>Exercise <span>Library</span></h1>
        <p>Explore target muscles, required equipment, and standard instructions for key movements.</p>
      </div>

      <div className="exercise-search-layout">
        {/* Search Controls */}
        <div className="search-sidebar glass-panel">
          <h3>Filter Library</h3>
          
          <div className="form-group">
            <label htmlFor="lib-search">Keyword Search</label>
            <input
              type="text"
              id="lib-search"
              placeholder="Search muscle, gear, name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lib-cat">Muscle Group</label>
            <select
              id="lib-cat"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Muscles</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="lib-diff">Difficulty Level</label>
            <select
              id="lib-diff"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="">All Levels</option>
              {difficulties.slice(1).map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedCategory || selectedDifficulty) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedDifficulty('');
              }}
              className="clear-search-btn"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Exercises Grid */}
        <div className="exercise-list-area">
          <div className="list-meta">
            Showing {filteredExercises.length} movement{filteredExercises.length === 1 ? '' : 's'}
          </div>

          <div className="exercise-grid">
            {filteredExercises.map((ex) => (
              <div
                key={ex.id}
                className="exercise-card glass-panel"
                onClick={() => setActiveExercise(ex)}
              >
                <div className="card-top">
                  <span className={`diff-badge diff-${ex.difficulty.toLowerCase()}`}>
                    {ex.difficulty}
                  </span>
                  <span className="muscle-badge">{ex.category}</span>
                </div>
                <h4>{ex.name}</h4>
                <div className="card-details">
                  <p><strong>Primary Muscle:</strong> {ex.muscle}</p>
                  <p><strong>Equipment:</strong> {ex.equipment}</p>
                </div>
                <div className="view-instructions-action">
                  <span>View Form Guide</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Overlay Drawer */}
      {activeExercise && (
        <div className="exercise-detail-drawer-overlay" onClick={() => setActiveExercise(null)}>
          <div className="detail-drawer glass-panel" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveExercise(null)} className="close-drawer-btn" aria-label="Close panel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="drawer-header">
              <span className={`diff-badge diff-${activeExercise.difficulty.toLowerCase()}`}>
                {activeExercise.difficulty}
              </span>
              <h2>{activeExercise.name}</h2>
            </div>
            <div className="drawer-body">
              <div className="body-meta-grid">
                <div className="meta-box">
                  <span className="lbl">Muscle Target</span>
                  <span className="val">{activeExercise.muscle} ({activeExercise.category})</span>
                </div>
                <div className="meta-box">
                  <span className="lbl">Equipment Needed</span>
                  <span className="val">{activeExercise.equipment}</span>
                </div>
              </div>
              <div className="drawer-instructions">
                <h3>Movement Instructions</h3>
                <p>{activeExercise.instructions}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
