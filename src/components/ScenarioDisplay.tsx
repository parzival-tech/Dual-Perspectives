import React from 'react';
import { useGameStore, selectCurrentScenarioData } from '../store/gameStore';
import styles from './ScenarioDisplay.module.css';
import { motion } from 'framer-motion';

const ScenarioDisplay: React.FC = () => {
  const scenario = useGameStore(selectCurrentScenarioData);

  if (!scenario) {
    return null;
  }

  return (
    <motion.div 
      className={styles.scenarioCard}
      key={scenario.id}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h3 className={styles.title}>{scenario.title}</h3>
      <p className={styles.phase}>Phase: {scenario.projectPhase}</p>
      <p className={styles.description}>{scenario.description}</p>
    </motion.div>
  );
};

export default ScenarioDisplay; 