import React from 'react';
// We will import more specific components (ScenarioDisplay, ChoiceList, etc.) here later
import { useGameStore, selectCurrentScenarioData } from '../store/gameStore';

import ProjectHealthDisplay from '../components/ProjectHealthDisplay';
import ScenarioDisplay from '../components/ScenarioDisplay';
import RoleSelection from '../components/RoleSelection';
import ChoiceList from '../components/ChoiceList';
import FeedbackPanel from '../components/FeedbackPanel';

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
    <div>
      <ProjectHealthDisplay />
      <ScenarioDisplay />

      {error && isFeedbackMode && <p style={{color: 'orange'}}>Notice while processing choice: {error}</p>}


      {isFeedbackMode ? (
        <>
          <FeedbackPanel />
          <button 
            onClick={proceedToNextScenario} 
            style={{ marginTop: '20px', padding: '10px 20px', fontSize: '1.1em' }}
          >
            Continue
          </button>
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
  );
};

export default GameScreen; 