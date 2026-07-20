import { createSlice } from '@reduxjs/toolkit';

const getStoredHistory = () => {
  const data = localStorage.getItem('fittrack_history');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
  // Default mock history for visualization on load
  return [
    {
      id: 'log-1',
      routineName: 'Full Body Sculpt',
      duration: '45 mins',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      caloriesBurned: 350,
      exercisesCount: 4
    },
    {
      id: 'log-2',
      routineName: 'Core & Cardio Blast',
      duration: '32 mins',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      caloriesBurned: 290,
      exercisesCount: 4
    },
    {
      id: 'log-3',
      routineName: 'Full Body Sculpt',
      duration: '42 mins',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      caloriesBurned: 330,
      exercisesCount: 4
    }
  ];
};

const initialState = {
  history: getStoredHistory()
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    logWorkout: (state, action) => {
      state.history.unshift(action.payload); // Most recent first
      localStorage.setItem('fittrack_history', JSON.stringify(state.history));
    },
    clearHistory: (state) => {
      state.history = [];
      localStorage.setItem('fittrack_history', JSON.stringify([]));
    }
  }
});

export const { logWorkout, clearHistory } = historySlice.actions;
export default historySlice.reducer;
