import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import Game from './components/Game';
import './App.css'; 

function App() {
  const [gameState, setGameState] = useState('landing'); // 'landing' | 'playing'
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('pulse_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pulse_settings');
    return saved ? JSON.parse(saved) : { sound: true, vibration: true };
  });

  useEffect(() => {
    localStorage.setItem('pulse_settings', JSON.stringify(settings));
  }, [settings]);

  const handleGameOver = (score) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('pulse_highscore', score.toString());
    }
    setGameState('landing');
  };

  return (
    <div className="app-container">
      {/* Zen Orbs Background */}
      <div className="orb-1" />
      <div className="orb-2" />
      
      <AnimatePresence mode="wait">
        {gameState === 'landing' && (
          <LandingPage 
            key="landing" 
            onStart={() => setGameState('playing')} 
            highScore={highScore} 
            settings={settings}
            setSettings={setSettings}
          />
        )}
        
        {gameState === 'playing' && (
          <Game 
            key="game" 
            onGameOver={handleGameOver} 
            onQuit={() => setGameState('landing')}
            settings={settings}
            setSettings={setSettings}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
