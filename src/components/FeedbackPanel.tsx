import React from 'react';
import { useGameStore } from '../store/gameStore';

const FeedbackPanel: React.FC = () => {
  const feedback = useGameStore((state) => state.currentFeedback);

  if (!feedback || !feedback.choice) {
    return null; // Don't render if no feedback
  }

  const { choice, alternativePerspectiveText } = feedback;

  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '2px solid #4CAF50', borderRadius: '5px', backgroundColor: '#f0fff0' }}>
      <h4>Decision Outcome:</h4>
      <p><strong>Your Action ({useGameStore.getState().selectedRole}):</strong> {choice.text}</p>
      
      <h5>Immediate Consequences:</h5>
      <p>{choice.immediateConsequences}</p>

      <h5>Potential Longer-Term Impacts:</h5>
      <p>{choice.longTermImpacts}</p>

      <h5>Role-Specific Insight:</h5>
      <p>{choice.learningInsight}</p>

      <h5>Alternative Perspective:</h5>
      <p><em>{alternativePerspectiveText}</em></p>
    </div>
  );
};

export default FeedbackPanel; 