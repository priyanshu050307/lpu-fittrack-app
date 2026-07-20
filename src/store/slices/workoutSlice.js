import { createSlice } from '@reduxjs/toolkit';

const defaultRoutines = [
  {
    id: 'routine-1',
    name: 'Full Body Sculpt',
    description: 'A complete full body strength routine focusing on compound movements.',
    exercises: [
      { id: 'ex-1', name: 'Barbell Squat', sets: 4, reps: 10, rest: 90 },
      { id: 'ex-2', name: 'Dumbbell Bench Press', sets: 3, reps: 12, rest: 60 },
      { id: 'ex-3', name: 'Bent Over Row', sets: 3, reps: 12, rest: 60 },
      { id: 'ex-4', name: 'Plank Hold', sets: 3, reps: 60, rest: 45 }
    ]
  },
  {
    id: 'routine-2',
    name: 'Core & Cardio Blast',
    description: 'High intensity interval training targeting core stability and cardio endurance.',
    exercises: [
      { id: 'ex-5', name: 'Mountain Climbers', sets: 4, reps: 30, rest: 30 },
      { id: 'ex-6', name: 'Hanging Leg Raise', sets: 3, reps: 15, rest: 45 },
      { id: 'ex-7', name: 'Bicycle Crunches', sets: 3, reps: 20, rest: 30 },
      { id: 'ex-8', name: 'Burpees', sets: 4, reps: 12, rest: 45 }
    ]
  }
];

const getStoredRoutines = () => {
  const data = localStorage.getItem('fittrack_routines');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
  return defaultRoutines;
};

const initialState = {
  routines: getStoredRoutines(),
  activeSession: null // { routineId, name, exercises: [...], startTime, elapsedSeconds, completedExercises: {} }
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    addRoutine: (state, action) => {
      state.routines.push(action.payload);
      localStorage.setItem('fittrack_routines', JSON.stringify(state.routines));
    },
    deleteRoutine: (state, action) => {
      state.routines = state.routines.filter(r => r.id !== action.payload);
      localStorage.setItem('fittrack_routines', JSON.stringify(state.routines));
    },
    startWorkoutSession: (state, action) => {
      const routine = state.routines.find(r => r.id === action.payload);
      if (routine) {
        state.activeSession = {
          routineId: routine.id,
          name: routine.name,
          exercises: routine.exercises.map(ex => ({ ...ex, status: 'pending' })),
          startTime: Date.now(),
          elapsedSeconds: 0
        };
      }
    },
    tickActiveTimer: (state) => {
      if (state.activeSession) {
        state.activeSession.elapsedSeconds += 1;
      }
    },
    toggleExerciseStatus: (state, action) => {
      const { exerciseId } = action.payload;
      if (state.activeSession) {
        const exercise = state.activeSession.exercises.find(ex => ex.id === exerciseId);
        if (exercise) {
          exercise.status = exercise.status === 'completed' ? 'pending' : 'completed';
        }
      }
    },
    clearActiveSession: (state) => {
      state.activeSession = null;
    }
  }
});

export const {
  addRoutine,
  deleteRoutine,
  startWorkoutSession,
  tickActiveTimer,
  toggleExerciseStatus,
  clearActiveSession
} = workoutSlice.actions;

export default workoutSlice.reducer;
