import React from 'react';
// We will import more specific components (ScenarioDisplay, ChoiceList, etc.) here later
import { useGameStore, selectCurrentScenarioData } from '../store/gameStore';

const GameScreen: React.FC = () => {
  const currentScenario = useGameStore(selectCurrentScenarioData);
  // More state and actions will be used here

  if (!currentScenario) {
    return <div>Loading scenario... If this persists, there might be an issue.</div>;
  }

  return (
    <div>
      <h2>Game Screen</h2>
      <p>Current Scenario: {currentScenario.title}</p>
      {/* 
        Placeholder for where other components will go:
        <ProjectHealthDisplay />
        <ScenarioDisplay />
        
        IF isFeedbackMode:
          <FeedbackPanel />
          <button onClick={proceedToNextScenario}>Continue</button>
        ELSE:
          IF !selectedRole:
            <RoleSelection />
          ELSE:
            <ChoiceList />
      */}
      <p style={{marginTop: '20px', fontStyle: 'italic'}}>
        (Scenario Display, Role Selection / Choices, and Feedback Panel will appear here)
      </p>
    </div>
  );
};

export default GameScreen; 