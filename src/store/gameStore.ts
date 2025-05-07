import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  // GameState is defined locally below
  EffectValues,
  Choice,
  Role,
  Scenario,
  CaseStudyInitialInfoConstraints, // Used by CaseStudyInitialInfo
  CaseStudyInitialInfo, // Used by CaseStudy
  CaseStudy, // Used by GameData and selectors
  GameData, // Used by GameState
  PlayerChoiceRecord, // Used by PlayerProgress
  ProjectHealth, // Used by PlayerProgress
  PlayerProgress, // Used by GameState
  CurrentFeedback // Used by GameState
} from '../types/gameTypes';

// GameState interface defined locally as per user instruction
export interface GameState {
  gameData: GameData | null;
  currentCaseStudyId: string | null;
  currentScenarioId: string | null;
  selectedRole: Role | null;
  playerProgress: PlayerProgress;
  isLoading: boolean;
  error: string | null;
  currentFeedback: CurrentFeedback | null;
  isFeedbackMode: boolean;

  // Actions
  loadGameData: (data: GameData) => Promise<void>;
  startGame: (caseStudyId: string) => void;
  startScenario: (scenarioId: string) => void;
  selectRole: (role: Role) => void;
  processPlayerChoice: (choiceId: string) => void;
  proceedToNextScenario: () => void;
  resetGame: () => void;
}

const initialPlayerProgress: PlayerProgress = {
  choicesMade: [],
  projectHealth: {
    budget: 0,
    timelineMonthsRemaining: 0,
    teamMorale: 75,
    stakeholderSatisfaction: {},
    scopeRisk: 0,
    projectControl: 5,
    timelineImpactPoints: 0,
  },
};

export const useGameStore = create<GameState>()(
  immer((set, get) => ({
    gameData: null,
    currentCaseStudyId: null,
    currentScenarioId: null,
    selectedRole: null,
    playerProgress: JSON.parse(JSON.stringify(initialPlayerProgress)),
    isLoading: false,
    error: null,
    currentFeedback: null,
    isFeedbackMode: false,

    loadGameData: async (data) => {
      set((state) => {
        state.gameData = data;
        state.isLoading = false;
      });
    },

    startGame: (caseStudyId) => {
      const caseStudy = get().gameData?.caseStudies.find(cs => cs.id === caseStudyId);
      if (caseStudy && caseStudy.scenarios.length > 0) {
        set((state) => {
          state.currentCaseStudyId = caseStudyId;
          state.playerProgress = {
            ...JSON.parse(JSON.stringify(initialPlayerProgress)),
            projectHealth: {
              ...initialPlayerProgress.projectHealth,
              budget: caseStudy.initialInfo.constraints.budget || 0,
              timelineMonthsRemaining: caseStudy.initialInfo.constraints.timelineMonths || 0,
              stakeholderSatisfaction: {},
            }
          };
          state.currentScenarioId = caseStudy.scenarios[0].id;
          state.selectedRole = null;
          state.currentFeedback = null;
          state.isFeedbackMode = false;
          state.error = null;
        });
      } else {
        set((state) => {
          state.error = `Case study "${caseStudyId}" not found or has no scenarios.`;
        });
      }
    },

    startScenario: (scenarioId) => {
      const currentCaseStudy = get().gameData?.caseStudies.find(cs => cs.id === get().currentCaseStudyId);
      const scenario = currentCaseStudy?.scenarios.find(s => s.id === scenarioId);
      if (scenario) {
        set((state) => {
          state.currentScenarioId = scenarioId;
          state.selectedRole = null;
          state.currentFeedback = null;
          state.isFeedbackMode = false;
        });
      } else {
        set((state) => {
          state.error = `Scenario "${scenarioId}" not found in case study "${get().currentCaseStudyId}". Consider this an end state or add a summary screen.`;
          state.currentScenarioId = null;
        });
      }
    },

    selectRole: (role) => {
      set((state) => {
        state.selectedRole = role;
      });
    },

    processPlayerChoice: (choiceId) => {
      const { gameData, currentCaseStudyId, currentScenarioId, selectedRole } = get();
      if (!gameData || !currentCaseStudyId || !currentScenarioId || !selectedRole) {
        set(state => { state.error = "Cannot process choice: Game state incomplete."; });
        return;
      }

      const caseStudy = gameData.caseStudies.find(cs => cs.id === currentCaseStudyId);
      const scenario = caseStudy?.scenarios.find(s => s.id === currentScenarioId);
      if (!scenario) {
        set(state => { state.error = "Cannot process choice: Current scenario not found."; });
        return;
      }

      const choicesForRole = scenario.choices[selectedRole];
      const chosenOption = choicesForRole?.find(c => c.id === choiceId);

      if (chosenOption) {
        set((state) => {
          state.playerProgress.choicesMade.push({
            caseStudyId: currentCaseStudyId,
            scenarioId: currentScenarioId,
            choiceId: choiceId,
            role: selectedRole
          });

          if (chosenOption.effects) {
            for (const key in chosenOption.effects) {
              const effectValue = chosenOption.effects[key];
              const numericEffectValue = effectValue || 0;

              if (key in state.playerProgress.projectHealth) {
                (state.playerProgress.projectHealth as any)[key] =
                  ((state.playerProgress.projectHealth as any)[key] || 0) + numericEffectValue;
              } else if (key.startsWith('stakeholderSatisfaction_')) {
                  const stakeholderKey = key.replace('stakeholderSatisfaction_', '');
                  state.playerProgress.projectHealth.stakeholderSatisfaction[stakeholderKey] =
                    (state.playerProgress.projectHealth.stakeholderSatisfaction[stakeholderKey] || 50) + numericEffectValue;
                  state.playerProgress.projectHealth.stakeholderSatisfaction[stakeholderKey] = Math.max(0, Math.min(100, state.playerProgress.projectHealth.stakeholderSatisfaction[stakeholderKey]));
              }
            }
            if (state.playerProgress.projectHealth.teamMorale) {
                state.playerProgress.projectHealth.teamMorale = Math.max(0, Math.min(100, state.playerProgress.projectHealth.teamMorale));
            }
          }

          const alternativePerspectiveText = scenario.alternativePerspective[selectedRole === 'ProductManager' ? 'ProjectManager' : 'ProductManager'];
          state.currentFeedback = {
            choice: chosenOption,
            alternativePerspectiveText: alternativePerspectiveText,
          };
          state.isFeedbackMode = true;
        });
      } else {
        set(state => { state.error = `Choice "${choiceId}" not found for role "${selectedRole}" in scenario "${currentScenarioId}".`; });
      }
    },

    proceedToNextScenario: () => {
      const { currentFeedback } = get();
      const scenario = selectCurrentScenarioData(get());

      if (!currentFeedback || !currentFeedback.choice || !scenario) {
          set(state => { state.error = "Cannot proceed: No current feedback or scenario data."; });
          return;
      }
      const nextScenarioId = currentFeedback.choice.nextScenarioId || scenario.defaultNextScenarioId;
      
      set(state => { state.isFeedbackMode = false; state.currentFeedback = null; });

      if (nextScenarioId) {
          get().startScenario(nextScenarioId);
      } else {
          set(state => {
              state.currentScenarioId = null;
              state.error = "End of scenario path. Implement summary screen.";
          });
      }
    },

    resetGame: () => {
      set((state) => {
        state.currentCaseStudyId = null;
        state.currentScenarioId = null;
        state.selectedRole = null;
        state.playerProgress = JSON.parse(JSON.stringify(initialPlayerProgress));
        state.currentFeedback = null;
        state.isFeedbackMode = false;
        state.error = null;
      });
    },
  }))
);

// --- Selectors ---
// These functions help derive state or get specific parts of it easily in components.
export const selectCurrentCaseStudy = (state: GameState): CaseStudy | undefined => {
  if (!state.gameData || !state.currentCaseStudyId) return undefined;
  return state.gameData.caseStudies.find(cs => cs.id === state.currentCaseStudyId);
};

export const selectCurrentScenarioData = (state: GameState): Scenario | undefined => {
  const caseStudy = selectCurrentCaseStudy(state);
  if (!caseStudy || !state.currentScenarioId) return undefined;
  return caseStudy.scenarios.find(s => s.id === state.currentScenarioId);
};

export const selectAvailableChoicesForRole = (state: GameState): Choice[] | undefined => {
  const scenario = selectCurrentScenarioData(state);
  if (!scenario || !state.selectedRole) return undefined;
  return scenario.choices[state.selectedRole];
};

export const selectIsGameActive = (state: GameState): boolean => {
    return !!state.currentCaseStudyId && !!state.currentScenarioId;
};

export const selectIsGameStarted = (state: GameState): boolean => {
    return !!state.currentCaseStudyId;
}; 