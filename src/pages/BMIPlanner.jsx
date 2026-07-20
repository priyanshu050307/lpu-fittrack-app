import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../store/slices/userSlice';

export default function BMIPlanner() {
  const profile = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // BMI Form state
  const [weight, setWeight] = useState(profile.weight);
  const [height, setHeight] = useState(profile.height);
  const [bmiResult, setBmiResult] = useState(profile.bmi);
  const [bmiCategory, setBmiCategory] = useState(getBmiCat(profile.bmi));
  const [bmiErrors, setBmiErrors] = useState({});

  // Calorie Form state
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('1.55'); // Moderately active multiplier
  const [goal, setGoal] = useState('maintain'); // lose, maintain, gain
  const [calResult, setCalResult] = useState(null);
  const [calErrors, setCalErrors] = useState({});

  function getBmiCat(bmi) {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: 'Underweight', text: 'You may need to focus on nutritional mass gaining routines.', color: 'bmi-under' };
    if (bmi < 25) return { label: 'Healthy Weight', text: 'Excellent! Keep maintaining your strength splits.', color: 'bmi-healthy' };
    if (bmi < 30) return { label: 'Overweight', text: 'Consider balancing resistance splits with calorie deficit plans.', color: 'bmi-over' };
    return { label: 'Obese', text: 'We suggest incorporating calorie deficit programs and aerobic exercises.', color: 'bmi-obese' };
  }

  // Validate and submit BMI Form
  const handleBMISubmit = (e) => {
    e.preventDefault();
    const errs = {};
    const wtNum = parseFloat(weight);
    const htNum = parseFloat(height);

    if (isNaN(wtNum) || wtNum < 30 || wtNum > 250) {
      errs.weight = 'Weight must be between 30 and 250 kg.';
    }
    if (isNaN(htNum) || htNum < 100 || htNum > 250) {
      errs.height = 'Height must be between 100 and 250 cm.';
    }

    if (Object.keys(errs).length > 0) {
      setBmiErrors(errs);
      return;
    }

    setBmiErrors({});
    const hInMeters = htNum / 100;
    const computedBMI = parseFloat((wtNum / (hInMeters * hInMeters)).toFixed(2));
    setBmiResult(computedBMI);
    setBmiCategory(getBmiCat(computedBMI));

    // Update global store
    dispatch(updateProfile({
      name: profile.name,
      weight: wtNum,
      height: htNum,
      dailyCalorieTarget: profile.dailyCalorieTarget
    }));
  };

  // Validate and submit Calorie Form
  const handleCalSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    const ageNum = parseInt(age);

    if (isNaN(ageNum) || ageNum < 15 || ageNum > 80) {
      errs.age = 'Age must be between 15 and 80.';
    }

    if (Object.keys(errs).length > 0) {
      setCalErrors(errs);
      return;
    }

    setCalErrors({});
    
    // Harris-Benedict BMR equation
    let bmr = 0;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * parseFloat(weight)) + (4.799 * parseFloat(height)) - (5.677 * ageNum);
    } else {
      bmr = 447.593 + (9.247 * parseFloat(weight)) + (3.098 * parseFloat(height)) - (4.330 * ageNum);
    }

    // Multiply BMR by activity multiplier
    let maintenanceCals = bmr * parseFloat(activity);
    
    // Adjust by Goal
    let targetCals = Math.round(maintenanceCals);
    if (goal === 'lose') {
      targetCals = Math.round(maintenanceCals - 500); // 500 kcal deficit
    } else if (goal === 'gain') {
      targetCals = Math.round(maintenanceCals + 400); // 400 kcal surplus
    }

    setCalResult(targetCals);
  };

  const handleApplyCalTarget = () => {
    if (!calResult) return;
    dispatch(updateProfile({
      name: profile.name,
      weight: parseFloat(weight),
      height: parseFloat(height),
      dailyCalorieTarget: calResult
    }));
    alert(`Applied new Calorie target of ${calResult} kcal directly to your profile.`);
  };

  return (
    <div className="planner-page fade-in">
      <div className="page-header">
        <h1>Health <span>Calculators</span></h1>
        <p>Assess your BMI body metrics and customize your daily caloric guidelines.</p>
      </div>

      <div className="planner-grid">
        {/* BMI Calculator */}
        <div className="planner-card glass-panel">
          <div className="card-header-accent"></div>
          <h2>BMI Calculator</h2>
          <p className="card-sub-info">Find out your Body Mass Index score based on height and weight inputs.</p>
          
          <form onSubmit={handleBMISubmit} className="planner-form">
            <div className="form-group">
              <label htmlFor="bmi-height">Height (cm)</label>
              <input
                type="number"
                id="bmi-height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 175"
                className={bmiErrors.height ? 'input-error' : ''}
              />
              {bmiErrors.height && <span className="error-text">{bmiErrors.height}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="bmi-weight">Weight (kg)</label>
              <input
                type="number"
                id="bmi-weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 70"
                className={bmiErrors.weight ? 'input-error' : ''}
              />
              {bmiErrors.weight && <span className="error-text">{bmiErrors.weight}</span>}
            </div>

            <button type="submit" className="calculate-btn">Compute BMI</button>
          </form>

          {bmiResult && (
            <div className="calculator-results fade-in">
              <div className="result-metric-display">
                <span className="result-val">{bmiResult}</span>
                <span className="result-lbl">Your BMI Score</span>
              </div>
              {bmiCategory && (
                <div className="result-suggestion">
                  <span className={`bmi-tag ${bmiCategory.color}`}>{bmiCategory.label}</span>
                  <p>{bmiCategory.text}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Calorie Calculator */}
        <div className="planner-card glass-panel">
          <div className="card-header-accent"></div>
          <h2>Calorie Estimator</h2>
          <p className="card-sub-info">Estimate your daily energy needs based on your stats and weekly goal.</p>
          
          <form onSubmit={handleCalSubmit} className="planner-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="cal-age">Age (15-80)</label>
                <input
                  type="number"
                  id="cal-age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 25"
                  className={calErrors.age ? 'input-error' : ''}
                />
                {calErrors.age && <span className="error-text">{calErrors.age}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cal-gender">Gender</label>
                <select id="cal-gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cal-activity">Activity Level</label>
              <select id="cal-activity" value={activity} onChange={(e) => setActivity(e.target.value)}>
                <option value="1.2">Sedentary (No exercise)</option>
                <option value="1.375">Lightly Active (1-3 days/week)</option>
                <option value="1.55">Moderately Active (3-5 days/week)</option>
                <option value="1.725">Very Active (6-7 days/week)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cal-goal">Target Goal</label>
              <select id="cal-goal" value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="lose">Weight Loss Deficit (-500 kcal)</option>
                <option value="maintain">Maintain Weight Guidelines</option>
                <option value="gain">Muscle Gain Surplus (+400 kcal)</option>
              </select>
            </div>

            <button type="submit" className="calculate-btn">Estimate Target</button>
          </form>

          {calResult && (
            <div className="calculator-results fade-in">
              <div className="result-metric-display">
                <span className="result-val highlight-pink">{calResult}</span>
                <span className="result-lbl">kcal / Day Target</span>
              </div>
              <div className="result-suggestion">
                <p>Applying this target will replace your current goal of {profile.dailyCalorieTarget} kcal.</p>
                <button onClick={handleApplyCalTarget} className="apply-target-btn">
                  Apply to Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
