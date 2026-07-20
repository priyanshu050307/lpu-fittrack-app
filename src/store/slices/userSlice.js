import { createSlice } from '@reduxjs/toolkit';

const getStoredProfile = () => {
  const data = localStorage.getItem('fittrack_profile');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
  return {
    name: 'Fitness Champion',
    weight: 70, // in kg
    height: 175, // in cm
    dailyCalorieTarget: 2200,
    bmi: 22.86
  };
};

const calculateBMIValue = (weight, height) => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
};

const initialState = getStoredProfile();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      const { name, weight, height, dailyCalorieTarget } = action.payload;
      state.name = name;
      state.weight = parseFloat(weight);
      state.height = parseFloat(height);
      state.dailyCalorieTarget = parseInt(dailyCalorieTarget);
      state.bmi = calculateBMIValue(state.weight, state.height);
      
      localStorage.setItem('fittrack_profile', JSON.stringify(state));
    }
  }
});

export const { updateProfile } = userSlice.actions;
export default userSlice.reducer;
