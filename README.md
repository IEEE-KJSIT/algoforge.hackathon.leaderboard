# AlgoForge Standalone Leaderboard

This is a standalone leaderboard application for displaying hackathon results with a beautiful cyberpunk-themed UI.

## How to Use

### Adding Your Team Data

1. Open `src/components/Leaderboard.tsx`
2. Locate the `TEAMS` array near the top of the file (around line 35)
3. Replace the example data with your actual team data

Example of the team data format:

```tsx
const TEAMS = [
  { id: "1", teamName: "Team Name", rank: 1 },
  { id: "2", teamName: "Another Team", rank: 2 },
  // Add more teams here
];
```

The fields are:

- `id` - A unique identifier for each team (can be any string)
- `teamName` - The name of the team
- `rank` - The position in the leaderboard (1 for first place, etc.)

### Running the Application

1. Ensure you have Node.js installed
2. In the project directory, run:
   ```
   npm install
   npm run dev
   ```
3. Open your browser to the URL shown in the terminal (usually http://localhost:5175)

## Customization

- To change the title, edit the text inside the `<h1>` and `<h2>` tags in the Leaderboard component
- To change colors, you can modify the CSS variables in `src/styles/index.css`
- For deeper customization, you can edit the styles in `src/styles/leaderboard.css`

## Features

- Beautiful cyberpunk-themed UI with Three.js background effects
- Responsive design that works on all screen sizes
- Special visual treatment for top 3 positions
- Smooth animations for a polished feel

## Example Display

The leaderboard displays teams in ranked order with special styling for the top three positions:

- 1st place: Gold trophy icon and border
- 2nd place: Silver trophy icon and border
- 3rd place: Bronze trophy icon and border
- Other positions: Standard styling with numerical rank
