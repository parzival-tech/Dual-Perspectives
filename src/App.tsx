import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useGameStore, selectIsGameStarted, selectIsGameActive } from './store/gameStore';
import gameDataJson from './data/caseStudies.json'; // Import the JSON data directly
import type { GameData } from './types/gameTypes'; // Import the GameData type

// Using explicit paths to try and resolve linter issue
import CaseStudySelectionScreen from './screens/CaseStudySelectionScreen';
import GameScreen from './screens/GameScreen'; // This one wasn't erroring, keep relative
import EndScreen from './screens/EndScreen';

import './App.css'; // You can keep or remove default App.css styling

function App() {
  const loadGameData = useGameStore((state) => state.loadGameData);
  const isGameStarted = useGameStore(selectIsGameStarted);
  const isGameActive = useGameStore(selectIsGameActive); // Game is active if a scenario is loaded
  const currentScenarioId = useGameStore((state) => state.currentScenarioId); // Using direct state for dependency array
  const isLoading = useGameStore((state) => state.isLoading);
  const error = useGameStore((state) => state.error);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Type assertion for the imported JSON
    loadGameData(gameDataJson as GameData);
  }, [loadGameData]);

  useEffect(() => {
    if (isLoading) return; // Don't navigate while loading

    const currentPath = location.pathname;

    if (!isGameStarted) {
      if (currentPath !== '/') navigate('/');
    } else {
      if (isGameActive) {
        if (currentPath !== '/game') navigate('/game');
      } else {
        // Game started, but not active (implies end of path or an error state)
        if (currentPath !== '/end') navigate('/end');
      }
    }
  }, [isGameStarted, isGameActive, currentScenarioId, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return <div>Loading game data...</div>;
  }

  // Main game flow rendering
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{gameDataJson.gameTitle || "Dual Perspectives"}</h1>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<CaseStudySelectionScreen />} />
          <Route path="/game" element={<GameScreen />} />
          <Route path="/end" element={<EndScreen />} />
          {/* Optionally, add a catch-all route for 404 or redirect to '/' */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>An Interactive Case Study Game</p>
        {error && <p style={{color: 'orange'}}>Notice: {error}</p>}
      </footer>
    </div>
  );
}

export default App;
