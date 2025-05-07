import { useEffect } from 'react';
import { useGameStore, selectIsGameStarted, selectIsGameActive } from './store/gameStore';
import gameDataJson from './data/caseStudies.json';
import type { GameData } from './types/gameTypes';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

import CaseStudySelectionScreen from './screens/CaseStudySelectionScreen';
import GameScreen from './screens/GameScreen';
import EndScreen from './screens/EndScreen';

import './App.css';

// Animation variants for screen transitions
const screenVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeInOut" } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.3, ease: "easeInOut" } },
};

function App() {
  const loadGameData = useGameStore((state) => state.loadGameData);
  const isGameStarted = useGameStore(selectIsGameStarted);
  const isGameActive = useGameStore(selectIsGameActive);
  const error = useGameStore((state) => state.error);
  const gameTitle = useGameStore((state) => state.gameData?.gameTitle); // Get title from store

  useEffect(() => {
    loadGameData(gameDataJson as GameData);
  }, [loadGameData]);

  if (useGameStore((state) => state.isLoading)) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Loading game data...</div>;
  }

  if (error && !isGameActive) {
    return <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>Critical Error: {error} <br /> Please check console.</div>;
  }
  
  let screenKey = "selection";
  let CurrentScreenComponent = CaseStudySelectionScreen;

  if (isGameStarted) {
    if (isGameActive) {
      screenKey = "game";
      CurrentScreenComponent = GameScreen;
    } else {
      screenKey = "end";
      CurrentScreenComponent = EndScreen;
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{gameTitle || "Dual Perspectives"}</h1>
      </header>
      <main className="app-main">
        <AnimatePresence mode="wait"> {/* mode="wait" ensures one screen exits before next enters */}
          <motion.div
            key={screenKey} // Important for AnimatePresence to detect changes
            className="screen-section"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <CurrentScreenComponent />
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="app-footer">
        <p>An Interactive Case Study Game</p>
        {error && isGameActive && <p style={{color: 'orange'}}>Notice: {error}</p>}
      </footer>
    </div>
  );
}

export default App;
