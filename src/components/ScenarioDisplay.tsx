import React from 'react';
import { useGameStore, selectCurrentScenarioData } from '../store/gameStore';

const ScenarioDisplay: React.FC = () => {
  const scenario = useGameStore(selectCurrentScenarioData);

  if (!scenario) {
    return <div>No active scenario.</div>;
  }

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#eef' }}>
      <h3>{scenario.title}</h3>
      <p><strong>Phase:</strong> {scenario.projectPhase}</p>
      <p>{scenario.description}</p>
    </div>
  );
};

export default ScenarioDisplay; 