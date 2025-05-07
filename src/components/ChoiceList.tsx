import React from 'react';
import { useGameStore, selectAvailableChoicesForRole } from '../store/gameStore';
import type { Choice } from '../types/gameTypes';

const ChoiceList: React.FC = () => {
  const selectedRole = useGameStore((state) => state.selectedRole);
  const choices = useGameStore(selectAvailableChoicesForRole);
  const processPlayerChoice = useGameStore((state) => state.processPlayerChoice);

  if (!selectedRole) {
    return <p>Select a role to see choices.</p>;
  }

  if (!choices || choices.length === 0) {
    return <p>No choices available for the selected role in this scenario.</p>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h4>You are acting as: <strong>{selectedRole}</strong></h4>
      <p>Choose your action:</p>
      {choices.map((choice: Choice) => (
        <button
          key={choice.id}
          onClick={() => processPlayerChoice(choice.id)}
          style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: '10px', padding: '12px' }}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
};

export default ChoiceList; 