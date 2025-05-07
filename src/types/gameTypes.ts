// --- Type Definitions for Dual Perspectives Game ---

export interface EffectValues {
  [key: string]: number; // e.g., stakeholderSatisfaction_VP: 5, budget: -1000, timelineImpactPoints: 1
}

export interface Choice {
  id: string;
  text: string;
  immediateConsequences: string;
  longTermImpacts: string;
  learningInsight: string;
  effects?: EffectValues;
  nextScenarioId?: string;
}

export type Role = 'ProductManager' | 'ProjectManager';

export interface Scenario {
  id: string;
  projectPhase: string;
  title: string;
  description: string;
  defaultNextScenarioId: string; // Fallback if a choice doesn't specify one
  choices: {
    [key in Role]: Choice[]; // Ensures choices exist for both roles
  };
  alternativePerspective: {
    [key in Role]: string; // Ensures alternative perspectives for both roles
  };
}

export interface CaseStudyInitialInfoConstraints {
    budget: number;
    currency: string;
    timelineMonths: number;
    teamSize: number;
    teamSkills: string[];
}

export interface CaseStudyInitialInfo {
    projectGoals: string[];
    targetUsers: Array<{ persona: string; needs: string }>;
    constraints: CaseStudyInitialInfoConstraints;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  initialInfo: CaseStudyInitialInfo;
  scenarios: Scenario[];
}

export interface GameData {
  gameTitle: string;
  caseStudies: CaseStudy[];
}

export interface PlayerChoiceRecord {
    caseStudyId: string;
    scenarioId: string;
    choiceId: string;
    role: Role;
}

export interface ProjectHealth {
  budget: number;
  timelineMonthsRemaining: number;
  teamMorale: number; // 0-100
  stakeholderSatisfaction: { [key: string]: number }; // e.g., VP: 70 (0-100 scale)
  scopeRisk: number; // 0-10 (higher is worse)
  projectControl: number; // 0-10 (higher is better)
  timelineImpactPoints: number; // Accumulative points, can be converted to delay
  // ... any other metrics you want to track
}

export interface PlayerProgress {
  choicesMade: PlayerChoiceRecord[];
  projectHealth: ProjectHealth;
  currentScore?: number; // Optional
}

export interface CurrentFeedback {
  choice: Choice;
  alternativePerspectiveText: string; // Just the text for the chosen role's alternative
}

// GameState interface is NOT here, it will be in gameStore.ts 