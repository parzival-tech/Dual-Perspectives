import React from 'react';
import { useGameStore, selectAvailableChoicesForRole } from '../store/gameStore';
import type { Choice } from '../types/gameTypes';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ChoiceList.module.css';

const choiceButtonVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.3, ease: "easeOut" }
  }),
  exit: { opacity: 0, x: 30, transition: { duration: 0.2 } }
};

const ChoiceList: React.FC = () => {
  const selectedRole = useGameStore((state) => state.selectedRole);
  const choices = useGameStore(selectAvailableChoicesForRole);
  const processPlayerChoice = useGameStore((state) => state.processPlayerChoice);

  if (!selectedRole) return null; // Should not happen if logic in GameScreen is correct

  if (!choices || choices.length === 0) {
    return <p className={styles.noChoices}>No choices available for this path.</p>;
  }

  return (
    <motion.div 
      className={styles.choiceListContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
    >
      <h4 className={styles.actingAs}>You are acting as: <strong>{selectedRole}</strong></h4>
      <p className={styles.prompt}>Choose your action:</p>
      <AnimatePresence> {/* Optional: if choices themselves can change dynamically and animate out */}
        {choices.map((choice: Choice, index: number) => (
          <motion.button
            key={choice.id}
            className="choice-button" // Use global style from App.css
            custom={index}
            variants={choiceButtonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ backgroundColor: "#005ecb", scale: 1.02 }} // More specific hover
            whileTap={{ scale: 0.98 }}
            onClick={() => processPlayerChoice(choice.id)}
          >
            {choice.text}
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChoiceList; 