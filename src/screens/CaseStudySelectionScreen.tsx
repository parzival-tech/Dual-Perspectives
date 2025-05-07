import React from 'react';
import { useGameStore } from '../store/gameStore';
import type { CaseStudy } from '../types/gameTypes';
import { useNavigate } from 'react-router-dom';

const CaseStudySelectionScreen: React.FC = () => {
  const gameData = useGameStore((state) => state.gameData);
  const startGame = useGameStore((state) => state.startGame);
  const navigate = useNavigate();

  if (!gameData || !gameData.caseStudies) {
    return <div>Loading case studies...</div>;
  }

  const handleStartCase = (caseStudyId: string) => {
    startGame(caseStudyId);
    navigate('/game');
  };

  return (
    <div>
      <h2>Select a Case Study</h2>
      {gameData.caseStudies.map((cs: CaseStudy) => (
        <div key={cs.id} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>{cs.title}</h3>
          <p>{cs.description.substring(0, 150)}...</p>
          <button onClick={() => handleStartCase(cs.id)}>Start Case: {cs.title}</button>
        </div>
      ))}
    </div>
  );
};

export default CaseStudySelectionScreen; 