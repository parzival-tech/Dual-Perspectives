// src/components/ProjectHealthDisplay.tsx
import React from 'react';
import { useGameStore } from '../store/gameStore';
import type { ProjectHealth } from '../types/gameTypes'; // Ensure this type is correctly defined/exported

const ProjectHealthDisplay: React.FC = () => {
  const projectHealth = useGameStore((state) => state.playerProgress.projectHealth);

  if (!projectHealth) {
    return <div>Loading project health...</div>;
  }

  // Helper to format stakeholder satisfaction
  const formatStakeholderSatisfaction = (satisfaction: ProjectHealth['stakeholderSatisfaction']) => {
    return Object.entries(satisfaction)
      .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}/100`)
      .join(' | ');
  };

  return (
    <div style={{ border: '1px solid #eee', padding: '10px', marginBottom: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <h4>Project Status</h4>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        <li><strong>Budget Remaining:</strong> ${projectHealth.budget.toLocaleString()}</li>
        <li><strong>Timeline Months Remaining:</strong> {projectHealth.timelineMonthsRemaining}</li>
        <li><strong>Team Morale:</strong> {projectHealth.teamMorale}/100</li>
        <li><strong>Scope Risk:</strong> {projectHealth.scopeRisk}/10 (lower is better)</li>
        <li><strong>Project Control:</strong> {projectHealth.projectControl}/10 (higher is better)</li>
        {Object.keys(projectHealth.stakeholderSatisfaction).length > 0 && (
             <li><strong>Stakeholder Sats.:</strong> {formatStakeholderSatisfaction(projectHealth.stakeholderSatisfaction)}</li>
        )}
        {projectHealth.timelineImpactPoints > 0 && (
            <li style={{color: 'orange'}}><strong>Timeline Impact Points:</strong> {projectHealth.timelineImpactPoints} (potential delay)</li>
        )}
      </ul>
    </div>
  );
};

export default ProjectHealthDisplay; 