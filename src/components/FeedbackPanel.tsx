import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import styles from './FeedbackPanel.module.css';

const FeedbackPanel: React.FC = () => {
  const feedback = useGameStore((state) => state.currentFeedback);
  const selectedRole = useGameStore((state) => state.selectedRole); // Get selected role

  if (!feedback || !feedback.choice) {
    return null; // Don't render if no feedback
  }

  const { choice, alternativePerspectiveText } = feedback;

  return (
    <motion.div 
      className={styles.feedbackPanelContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }}
    >
      <h3 className={styles.title}>Decision Outcome</h3>
      <div className={styles.section}>
        <p><strong>Your Action ({selectedRole}):</strong> {choice.text}</p>
      </div>
      
      <div className={styles.section}>
        <h5 className={styles.subheading}>Immediate Consequences:</h5>
        <p>{choice.immediateConsequences}</p>
      </div>

      <div className={styles.section}>
        <h5 className={styles.subheading}>Potential Longer-Term Impacts:</h5>
        <p>{choice.longTermImpacts}</p>
      </div>

      <div className={styles.section}>
        <h5 className={styles.subheading}>Role-Specific Insight:</h5>
        <p>{choice.learningInsight}</p>
      </div>

      <div className={styles.section}>
        <h5 className={styles.subheading}>Alternative Perspective:</h5>
        <p><em>{alternativePerspectiveText}</em></p>
      </div>
    </motion.div>
  );
};

export default FeedbackPanel; 