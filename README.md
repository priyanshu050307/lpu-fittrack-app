# Project 3: FitTrack Pro — Complete Syllabus Fitness & Workout Planner

A premium, interactive Single Page Web Application designed to manage customizable workout routines, calculate body mass indexes (BMI), estimate caloric needs, run active session countdown timers, and chart workout achievements. It compiles the entire course syllabus into a unified, state-of-the-art product.

## Syllabus Coverage Check

### 1. HTML5 Structures & Forms
- **Semantic Layouts**: Implemented structural elements like `<header>`, `<main>`, `<nav>`, `<section>` across multiple views.
- **Complex Form Configurations**: Built input forms for workout builders and BMR/BMI calculations.
- **Form Fields Validation**: Includes strict boundary rules (numeric weights/heights, age controls, text length thresholds) with real-time error messages.

### 2. Advanced CSS Styles & Layouts
- **CSS Flexbox & Grid Systems**: Employed to construct navigation headers, sidebars, dashboard grids, and custom forms.
- **Responsive Layout Design**: Used `@media` viewport definitions to support mobile, tablet, and desktop display interfaces.
- **Visual Identity Tokens**: Programmed variables for dark-mode custom background elements, fonts, colors, and layout borders.
- **Animations & Hover Triggers**: Customized `@keyframes` for fade-ins, scrolling, hover states, and dynamic status bars.

### 3. JavaScript & React core architecture
- **React.js Hooks**: Governs states using `useState`, `useEffect`, `useRef`, and selector handlers.
- **SPA Client Routing**: Set up client-side pathways (`/`, `/builder`, `/exercises`, `/calculator`, `/active`) using `react-router-dom` with active menu indicators.
- **Redux Global State Management**: Managed via Redux Toolkit (`@reduxjs/toolkit`):
  - `userSlice`: Stores username, weight, height, daily calorie targets, and BMR metrics.
  - `workoutSlice`: Handles custom workout routines and active sessions.
  - `historySlice`: Logs completed workout history.
- **Web API & LocalStorage integration**: Persists user profiles, custom routines, and logged workout history logs directly to browser sessions.
- **Interactive SVG Drawing**: Uses vanilla math to dynamically render a custom SVG calorie-burn chart in real-time, demonstrating raw JS-in-HTML rendering capability.

## Running Locally
From this folder (`fittrack-app`):
1. Install dependencies:
   ```bash
   npm install
   ```
2. Launch dev server:
   ```bash
   npm run dev
   ```
