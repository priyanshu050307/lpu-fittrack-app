import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import workoutReducer from './slices/workoutSlice';
import historyReducer from './slices/historySlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    workout: workoutReducer,
    history: historyReducer
  }
});
export default store;
