// src/components/ProjectHealthDisplay.tsx
import React from 'react';
import { useGameStore } from '../store/gameStore';
import styles from './ProjectHealthDisplay.module.css'; // Import CSS module
import { motion } from 'framer-motion'; // For potential animations on cards/values
import AnimatedNumber from './AnimatedNumber'; // Import the new component

// --- SVG Icon Components ---
const IconBudget: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const IconTimeline: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconTeamMorale: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const IconScopeRisk: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
// --- End SVG Icon Components ---

// Helper to create a simple progress bar
const ProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className={styles.progressBarContainer}>
      <motion.div
        className={styles.progressBarFill}
        // Animate width changes smoothly
        initial={{ width: `${percentage}%` }} // Set initial width to prevent jump on first load if value is not 0
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
          <div className={styles.metricTitleContainer}>
            <IconBudget className={styles.metricIcon} />
            <span>Budget Remaining</span>
          </div>
          <AnimatedNumber
            value={projectHealth.budget}
            formatValue={(val) => `$${Math.round(val).toLocaleString()}`}
            className={styles.metricValue}
          />
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className={styles.metricTitleContainer}>
            <IconTimeline className={styles.metricIcon} />
            <span>Timeline</span>
          </div>
          <AnimatedNumber
            value={projectHealth.timelineMonthsRemaining}
            className={styles.metricValue}
          />
          <p className={styles.metricDetail}>Months Remaining</p>
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className={styles.metricTitleContainer}>
            <IconTeamMorale className={styles.metricIcon} />
            <span>Team Morale</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}> 
            <AnimatedNumber
              value={projectHealth.teamMorale}
              className={styles.metricValue}
            />
            <span className={styles.metricValueSuffix}>/100</span>
          </div>
          <ProgressBar value={projectHealth.teamMorale} max={100} />
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className={styles.metricTitleContainer}>
            <IconScopeRisk className={styles.metricIcon} />
            <span>Scope Risk</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <AnimatedNumber
              value={projectHealth.scopeRisk}
              className={`${styles.metricValue} ${getScopeRiskClass(projectHealth.scopeRisk)}`}
            />
            <span className={`${styles.metricValueSuffix} ${getScopeRiskClass(projectHealth.scopeRisk)}`}>/10</span>
          </div>
          <p className={styles.metricDetail}>(Lower is better)</p>
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className={styles.metricTitleContainer}>
            <span>Project Control</span>
          </div>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <AnimatedNumber
              value={projectHealth.projectControl}
              className={styles.metricValue}
            />
             <span className={styles.metricValueSuffix}>/10</span>
          </div>
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
            <div className={styles.metricTitleContainer}>
                <span>{key.replace(/_/g, ' ')} Sat.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <AnimatedNumber
                value={value}
                className={styles.metricValue}
              />
              <span className={styles.metricValueSuffix}>/100</span>
            </div>
            <ProgressBar value={value} max={100} />
          </motion.div>
        ))}

        {projectHealth.timelineImpactPoints > 0 && (
          <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <div className={styles.metricTitleContainer}>
                <span>Timeline Impact</span>
            </div>
            <AnimatedNumber
              value={projectHealth.timelineImpactPoints}
              className={`${styles.metricValue} ${styles.mediumRisk}`} 
            />
            <p className={styles.metricDetail}>Points (Potential Delay)</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectHealthDisplay; 