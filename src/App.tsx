import { useEffect } from 'react';
import { useGameStore, selectIsGameStarted, selectCurrentScenarioData, selectIsGameActive } from './store/gameStore';
import gameDataJson from './data/caseStudies.json'; // Import the JSON data directly
import type { GameData } from './types/gameTypes'; // Import the GameData type

// Placeholder components (we'll create these next)
import CaseStudySelectionScreen from './screens/CaseStudySelectionScreen';
import GameScreen from './screens/GameScreen';
import EndScreen from './screens/EndScreen'; // For when a scenario path ends

import './App.css'; // You can keep or remove default App.css styling

function App() {
  const loadGameData = useGameStore((state) => state.loadGameData);
  const isGameStarted = useGameStore(selectIsGameStarted);
  const isGameActive = useGameStore(selectIsGameActive); // Game is active if a scenario is loaded
  const error = useGameStore((state) => state.error);

  useEffect(() => {
    // Type assertion for the imported JSON
    loadGameData(gameDataJson as GameData);
  }, [loadGameData]);

  if (useGameStore((state) => state.isLoading)) {
    return <div>Loading game data...</div>;
  }

  if (error && !isGameActive) { // Show critical error if game can't start/proceed
    return <div style={{ color: 'red', padding: '20px' }}>Critical Error: {error} <br /> Please check console.</div>;
  }
  
  // Main game flow rendering
  let currentScreen = <CaseStudySelectionScreen />;

  if (isGameStarted) {
    if (isGameActive) {
      currentScreen = <GameScreen />;
    } else {
      // If game is started but no active scenario (e.g., end of path)
      currentScreen = <EndScreen />;
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{gameDataJson.gameTitle || "Dual Perspectives"}</h1>
      </header>
      <main className="app-main">
        {currentScreen}
      </main>
      <footer className="app-footer">
        <p>An Interactive Case Study Game</p>
        {error && isGameActive && <p style={{color: 'orange'}}>Notice: {error}</p>} {/* Non-critical errors */}
      </footer>
    </div>
  );
}

export default App;
