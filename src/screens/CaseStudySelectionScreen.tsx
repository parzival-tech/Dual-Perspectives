import React from 'react';
import { useGameStore } from '../store/gameStore';
import type { CaseStudy } from '../types/gameTypes';
// Remove useNavigate if no longer used directly for navigation after Framer Motion integration in App.tsx
// import { useNavigate } from 'react-router-dom'; 
import styles from './CaseStudySelectionScreen.module.css'; // Import CSS module

const CaseStudySelectionScreen: React.FC = () => {
  const gameData = useGameStore((state) => state.gameData);
  const startGame = useGameStore((state) => state.startGame);
  // const navigate = useNavigate(); // If App.tsx handles screen changes, this might not be needed here.

  if (!gameData || !gameData.caseStudies) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading case studies...</div>;
  }

  const handleStartCase = (caseStudyId: string) => {
    startGame(caseStudyId);
    // Navigation is now handled by App.tsx based on game state changes
    // navigate('/game'); 
  };

  return (
    <div className={styles.screenContainer}>
      <h2 className={styles.title}>Select a Case Study</h2>
      {gameData.caseStudies.map((cs: CaseStudy) => (
        <div key={cs.id} className={styles.caseStudyItem}>
          <h3 className={styles.caseStudyTitle}>{cs.title}</h3>
          <p className={styles.caseStudyDescription}>{cs.description.substring(0, 200)}...</p> {/* Slightly longer substring */}
          <div className={styles.buttonContainer}>
            <button 
              onClick={() => handleStartCase(cs.id)} 
              className="primary-button" /* Apply global button style */
            >
              Start Case: {cs.title}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CaseStudySelectionScreen; 