import React from 'react';
import { useGameStore } from '../store/gameStore';
import styles from './EndScreen.module.css';

const EndScreen: React.FC = () => {
    const resetGame = useGameStore((state) => state.resetGame);
    const error = useGameStore((state) => state.error);

    return (
        <div className={styles.endScreenContainer}>
            <h2>Path Completed</h2>
            {error && <p className={styles.errorMessage}>Notice: {error}</p>}
            <p>You've reached the end of this particular scenario sequence.</p>
            <p className={styles.futureEnhancement}>
                (In a future version, this screen could display a summary of your key decisions,
                their cumulative impact on project health, and overall learning takeaways.)
            </p>
            <button className="primary-button" onClick={() => resetGame()}>
                Play Another Case / Restart
            </button>
        </div>
    );
};

export default EndScreen; 