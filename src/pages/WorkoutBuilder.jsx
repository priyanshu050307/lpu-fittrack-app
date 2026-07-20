import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addRoutine } from '../store/slices/workoutSlice';

export default function WorkoutBuilder() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', sets: 3, reps: 10, rest: 60 }
  ]);
  
  // Validation State
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddExerciseRow = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 10, rest: 60 }]);
  };

  const handleRemoveExerciseRow = (index) => {
    if (exercises.length === 1) return; // Keep at least one
    setExercises(exercises.filter((_, idx) => idx !== index));
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Routine name is required.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Routine name must be at least 3 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters.';
    }

    const exerciseErrors = [];
    exercises.forEach((ex, idx) => {
      const exErr = {};
      if (!ex.name.trim()) {
        exErr.name = 'Exercise name is required.';
      }
      
      const setsVal = parseInt(ex.sets);
      if (isNaN(setsVal) || setsVal < 1 || setsVal > 15) {
        exErr.sets = 'Sets must be between 1 and 15.';
      }
      
      const repsVal = parseInt(ex.reps);
      if (isNaN(repsVal) || repsVal < 1 || repsVal > 100) {
        exErr.reps = 'Reps must be between 1 and 100.';
      }
      
      const restVal = parseInt(ex.rest);
      if (isNaN(restVal) || restVal < 5 || restVal > 300) {
        exErr.rest = 'Rest must be between 5 and 300 seconds.';
      }

      if (Object.keys(exErr).length > 0) {
        exerciseErrors[idx] = exErr;
      }
    });

    if (exerciseErrors.length > 0) {
      newErrors.exercises = exerciseErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newRoutine = {
      id: `routine-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      exercises: exercises.map((ex, index) => ({
        id: `ex-${Date.now()}-${index}`,
        name: ex.name.trim(),
        sets: parseInt(ex.sets),
        reps: parseInt(ex.reps),
        rest: parseInt(ex.rest)
      }))
    };

    dispatch(addRoutine(newRoutine));
    navigate('/');
  };

  return (
    <div className="builder-page fade-in">
      <div className="page-header">
        <h1>Create Custom <span>Routine</span></h1>
        <p>Design a customized workout routine fitted perfectly to your fitness goals.</p>
      </div>

      <form onSubmit={handleSubmit} className="builder-form glass-panel">
        <div className="form-group">
          <label htmlFor="routine-name">Routine Name</label>
          <input
            type="text"
            id="routine-name"
            placeholder="e.g. Upper Body Focus, Core Cruncher..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="routine-desc">Description</label>
          <textarea
            id="routine-desc"
            placeholder="Describe the main focus and goals of this routine..."
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={errors.description ? 'input-error' : ''}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="builder-exercises-section">
          <h3>Exercises</h3>
          
          <div className="exercises-rows-container">
            {exercises.map((ex, idx) => {
              const rowErr = errors.exercises ? errors.exercises[idx] : null;
              
              return (
                <div key={idx} className="exercise-builder-row">
                  <div className="row-number">#{idx + 1}</div>
                  
                  <div className="input-col ex-name-col">
                    <label>Exercise Name</label>
                    <input
                      type="text"
                      placeholder="Squats, Bench Press..."
                      value={ex.name}
                      onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                      className={rowErr?.name ? 'input-error' : ''}
                    />
                    {rowErr?.name && <span className="error-text">{rowErr.name}</span>}
                  </div>

                  <div className="input-col number-col">
                    <label>Sets</label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={ex.sets}
                      onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                      className={rowErr?.sets ? 'input-error' : ''}
                    />
                    {rowErr?.sets && <span className="error-text">{rowErr.sets}</span>}
                  </div>

                  <div className="input-col number-col">
                    <label>Reps</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={ex.reps}
                      onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                      className={rowErr?.reps ? 'input-error' : ''}
                    />
                    {rowErr?.reps && <span className="error-text">{rowErr.reps}</span>}
                  </div>

                  <div className="input-col number-col">
                    <label>Rest (s)</label>
                    <input
                      type="number"
                      min="5"
                      max="300"
                      step="5"
                      value={ex.rest}
                      onChange={(e) => handleExerciseChange(idx, 'rest', e.target.value)}
                      className={rowErr?.rest ? 'input-error' : ''}
                    />
                    {rowErr?.rest && <span className="error-text">{rowErr.rest}</span>}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveExerciseRow(idx)}
                    className="remove-row-btn"
                    disabled={exercises.length === 1}
                    aria-label="Remove exercise"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAddExerciseRow}
            className="add-exercise-row-btn"
          >
            + Add Another Exercise
          </button>
        </div>

        <div className="form-submit-actions">
          <button type="submit" className="save-routine-btn">
            Save Routine
          </button>
          <button type="button" onClick={() => navigate('/')} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
