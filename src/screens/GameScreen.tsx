import React from 'react';
// We will import more specific components (ScenarioDisplay, ChoiceList, etc.) here later
import { useGameStore, selectCurrentScenarioData } from '../store/gameStore';
import styles from './GameScreen.module.css'; // Import new CSS module

import ProjectHealthDisplay from '../components/ProjectHealthDisplay';
import ScenarioDisplay from '../components/ScenarioDisplay';
import RoleSelection from '../components/RoleSelection';
import ChoiceList from '../components/ChoiceList';
import FeedbackPanel from '../components/FeedbackPanel';
// Ensure motion is imported if we add animations directly here,
// but child components already have their own.
// import { motion } from 'framer-motion'; 

const GameScreen: React.FC = () => {
  const currentScenario = useGameStore(selectCurrentScenarioData);
  const selectedRole = useGameStore((state) => state.selectedRole);
  const isFeedbackMode = useGameStore((state) => state.isFeedbackMode);
  const proceedToNextScenario = useGameStore((state) => state.proceedToNextScenario);
  const error = useGameStore((state) => state.error);

  if (!currentScenario) {
    // This case should ideally be handled by App.tsx routing to EndScreen
    // but as a fallback:
    return <div>Loading scenario or end of case study... If this persists, there might be an issue.</div>;
  }

  return (
    // Removed the outer div, assuming .screen-section from App.tsx and .app-container provides padding
    // If GameScreen itself needs to be white on a gray page, it would need styles.gameScreenContainer here.
    // For now, fitting within the .screen-section from App.tsx.
    // The .app-container in App.css has the white background and shadow.
    // GameScreen will now use CSS grid for its internal layout.

    <div className={styles.gameLayout}> {/* Main grid for two columns */}
      <div className={styles.leftPanel}>
        <ProjectHealthDisplay />
      </div>

      <div className={styles.rightPanel}>
        <ScenarioDisplay />
        
        {error && isFeedbackMode && <p style={{color: 'orange', textAlign: 'center'}}>Notice while processing choice: {error}</p>}

        {isFeedbackMode ? (
          <>
            <FeedbackPanel />
            <div style={{ textAlign: 'center', marginTop: 'var(--spacing-md)'}}> {/* Centering the continue button */}
              <button 
                onClick={proceedToNextScenario} 
                className="primary-button" // Use global primary button style
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            {!selectedRole ? (
              <RoleSelection />
            ) : (
              <ChoiceList />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GameScreen; 