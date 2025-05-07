// src/components/ProjectHealthDisplay.tsx
import React from 'react';
import { useGameStore } from '../store/gameStore';
import styles from './ProjectHealthDisplay.module.css'; // Import CSS module
import { motion } from 'framer-motion'; // For potential animations on cards/values

// Helper to create a simple progress bar
const ProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className={styles.progressBarContainer}>
      <motion.div
        className={styles.progressBarFill}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
};

const ProjectHealthDisplay: React.FC = () => {
  const projectHealth = useGameStore((state) => state.playerProgress.projectHealth);

  if (!projectHealth) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading project health...</div>;
  }

  const getScopeRiskClass = (risk: number) => {
    if (risk >= 7) return styles.highRisk;
    if (risk >= 4) return styles.mediumRisk;
    return '';
  };
  
  // Filter out stakeholders with 0 satisfaction for a cleaner display if needed
  // const activeStakeholders = Object.entries(projectHealth.stakeholderSatisfaction)
  //   .filter(([_, value]) => value > 0); // Or some other threshold

  return (
    <div> {/* Optional: Add a title for the whole dashboard if needed outside this component */}
      {/* This h4 can be styled or removed if GameScreen provides the section title */}
      {/* <h4 className={styles.dashboardTitle}>Project Status</h4> */}
      <div className={styles.dashboardGrid}>
        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h5>Budget Remaining</h5>
          <p className={styles.metricValue}>${projectHealth.budget.toLocaleString()}</p>
          {/* <p className={styles.metricDetail}>Target: $200,000</p> */}
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h5>Timeline</h5>
          <p className={styles.metricValue}>{projectHealth.timelineMonthsRemaining}</p>
          <p className={styles.metricDetail}>Months Remaining</p>
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h5>Team Morale</h5>
          <p className={styles.metricValue}>{projectHealth.teamMorale}/100</p>
          <ProgressBar value={projectHealth.teamMorale} max={100} />
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h5>Scope Risk</h5>
          <p className={`${styles.metricValue} ${getScopeRiskClass(projectHealth.scopeRisk)}`}>
            {projectHealth.scopeRisk}/10
          </p>
          <p className={styles.metricDetail}>(Lower is better)</p>
          {/* Optionally, an inverted progress bar or color scale for risk */}
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h5>Project Control</h5>
          <p className={styles.metricValue}>{projectHealth.projectControl}/10</p>
          <p className={styles.metricDetail}>(Higher is better)</p>
          <ProgressBar value={projectHealth.projectControl} max={10} />
        </motion.div>

        {Object.entries(projectHealth.stakeholderSatisfaction).map(([key, value], index) => (
          <motion.div 
            key={key} 
            className={styles.metricCard}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <h5>{key.replace(/_/g, ' ')} Sat.</h5>
            <p className={styles.metricValue}>{value}/100</p>
            <ProgressBar value={value} max={100} />
          </motion.div>
        ))}

        {projectHealth.timelineImpactPoints > 0 && (
          <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <h5>Timeline Impact</h5>
            <p className={`${styles.metricValue} ${styles.mediumRisk}`}>{projectHealth.timelineImpactPoints}</p>
            <p className={styles.metricDetail}>Points (Potential Delay)</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectHealthDisplay; 