import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';

const EndScreen: React.FC = () => {
    const resetGame = useGameStore((state) => state.resetGame);
    const error = useGameStore((state) => state.error); // To show why we ended up here if it's an error
    const navigate = useNavigate();

    const handlePlayAgain = () => {
        resetGame();
        navigate('/');
    };

    return (
        <div>
            <h2>End of Current Path</h2>
            {error && <p style={{color: 'orange'}}>Message: {error}</p>}
            <p>You have reached the end of this scenario sequence.</p>
            <p>In a full game, this screen would show a summary of your decisions and their impact, or offer to play other case studies.</p>
            <button onClick={handlePlayAgain}>Play Again / Select Another Case Study</button>
        </div>
    );
};

export default EndScreen; 