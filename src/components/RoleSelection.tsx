import React from 'react';
import { useGameStore } from '../store/gameStore';
import type { Role } from '../types/gameTypes';
import styles from './RoleSelection.module.css';
import { motion } from 'framer-motion';

const RoleSelection: React.FC = () => {
  const selectRole = useGameStore((state) => state.selectRole);

  const handleRoleSelect = (role: Role) => {
    selectRole(role);
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h4 className={styles.prompt}>How do you want to approach this situation?</h4>
      <div className={styles.buttonGroup}>
        <motion.button 
          className={`${styles.roleButton} ${styles.productManagerButton}`}
          onClick={() => handleRoleSelect('ProductManager')}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          As Product Manager
        </motion.button>
        <motion.button 
          className={`${styles.roleButton} ${styles.projectManagerButton}`}
          onClick={() => handleRoleSelect('ProjectManager')}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          As Project Manager
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RoleSelection; 