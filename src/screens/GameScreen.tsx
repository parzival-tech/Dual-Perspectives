import React, { useState } from 'react';
// We will import more specific components (ScenarioDisplay, ChoiceList, etc.) here later
import { useGameStore, selectCurrentScenarioData, selectCurrentCaseStudy } from '../store/gameStore';
import styles from './GameScreen.module.css'; // Import new CSS module

import ProjectHealthDisplay from '../components/ProjectHealthDisplay';
import ScenarioDisplay from '../components/ScenarioDisplay';
import RoleSelection from '../components/RoleSelection';
import ChoiceList from '../components/ChoiceList';
import FeedbackPanel from '../components/FeedbackPanel';
import CaseStudyChatbox from '../components/CaseStudyChatbox';
// Ensure motion is imported if we add animations directly here,
// but child components already have their own.
// import { motion } from 'framer-motion'; 

const GameScreen: React.FC = () => {
  const currentScenario = useGameStore(selectCurrentScenarioData);
  const currentCaseStudy = useGameStore(selectCurrentCaseStudy);
  const selectedRole = useGameStore((state) => state.selectedRole);
  const isFeedbackMode = useGameStore((state) => state.isFeedbackMode);
  const proceedToNextScenario = useGameStore((state) => state.proceedToNextScenario);
  const error = useGameStore((state) => state.error);

  const [isChatVisible, setIsChatVisible] = useState(false);

  if (!currentCaseStudy || !currentScenario) {
    // This case should ideally be handled by App.tsx routing to EndScreen
    // but as a fallback:
    return <div>Loading scenario or end of case study... If this persists, there might be an issue.</div>;
  }

  return (
    <>
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

      <button 
        onClick={() => setIsChatVisible(!isChatVisible)}
        className={styles.chatToggleButton}
      >
        {isChatVisible ? 'Close' : 'Ask Me!'}
      </button>

      <CaseStudyChatbox 
        caseTitle={currentCaseStudy.title}
        caseDescription={currentCaseStudy.description}
        currentScenarioTitle={currentScenario.title}
        currentScenarioDescription={currentScenario.description}
        isVisible={isChatVisible}
      />
    </>
  );
};

export default GameScreen; 