import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Pause, Play, Home, Award, Clock, Star, Settings } from 'lucide-react';
import { playTone, playErrorTone } from '../utils/sound';
import SettingsModal from './SettingsModal';
import './Game.css';

const PADS = [
  { id: 0, color: '#66FCF1' },
  { id: 1, color: '#FF758F' },
  { id: 2, color: '#FEE440' },
  { id: 3, color: '#9D4EDD' }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const Game = ({ onGameOver, onQuit, settings, setSettings }) => {
  const [sequence, setSequence] = useState([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [isSystemPlaying, setIsSystemPlaying] = useState(false);
  const [activePad, setActivePad] = useState(null);
  const [gameState, setGameState] = useState('waiting_to_start'); 
  const [lives, setLives] = useState(3);
  const [showSettings, setShowSettings] = useState(false);
  
  // Scoring & Stats
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timePlayed, setTimePlayed] = useState(0); // in seconds
  const [rank, setRank] = useState('Novice');
  
  const level = Math.max(1, sequence.length);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (gameState === 'playing' || gameState === 'waiting_to_start' || gameState === 'wrong') {
      interval = setInterval(() => {
        if (startTime) {
          setTimePlayed(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameState, startTime]);

  const generateNextSequence = useCallback((currentSeq) => {
    const nextPad = Math.floor(Math.random() * 4);
    setSequence([...currentSeq, nextPad]);
  }, []);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    generateNextSequence([]);
    setStartTime(Date.now());
  }, [generateNextSequence]);

  const playSequence = async () => {
    setIsSystemPlaying(true);
    setGameState('playing');
    setPlayerStep(0);
    
    await sleep(500); 
    
    for (let i = 0; i < sequence.length; i++) {
      if (gameState === 'paused') break;
      setActivePad(sequence[i]);
      playTone(sequence[i], settings.sound);
      await sleep(600);
      setActivePad(null);
      await sleep(300);
    }
    
    if (gameState !== 'paused') {
      setIsSystemPlaying(false);
    }
  };

  const determineRank = (finalLevel) => {
    if (finalLevel < 5) return 'Initiate';
    if (finalLevel < 10) return 'Adept';
    if (finalLevel < 15) return 'Master';
    return 'Ascendant';
  };

  const handlePadClick = async (padId) => {
    if (isSystemPlaying || gameState !== 'playing') return;

    setActivePad(padId);
    playTone(padId, settings.sound);
    if (settings.vibration && navigator.vibrate) navigator.vibrate(20);
    
    setTimeout(() => setActivePad(null), 300);

    if (padId === sequence[playerStep]) {
      const nextStep = playerStep + 1;
      setPlayerStep(nextStep);
      
      // Add points for correct tap
      setScore(s => s + 10);
      
      if (nextStep === sequence.length) {
        // Level complete bonus
        setScore(s => s + (level * 100));
        setIsSystemPlaying(true); 
        setGameState('level_up');
      }
    } else {
      // Wrong tap
      setIsSystemPlaying(true);
      playErrorTone(settings.sound);
      if (settings.vibration && navigator.vibrate) navigator.vibrate([50, 50, 50]);
      
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives > 0) {
        setGameState('wrong');
        await sleep(1500);
        setGameState('waiting_to_start'); 
      } else {
        setRank(determineRank(level - 1));
        setGameState('game_over');
      }
    }
  };

  const handleNextLevel = () => {
    generateNextSequence(sequence);
    setGameState('waiting_to_start');
  };

  const handlePause = () => setGameState('paused');
  const handleResume = () => setGameState('waiting_to_start');
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <>
      <motion.div 
        className={`game-container ${gameState === 'paused' || gameState === 'game_over' ? 'blurred-bg' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="game-header-zen">
          <div className="stats-box">
            <Star size={16} color="#FEE440" /> {score}
          </div>
          <div className="info-pill">LEVEL {level}</div>
          <div className="lives-container">
            {[1, 2, 3].map(heartIdx => (
              <Heart 
                key={heartIdx} 
                size={20} 
                className={`heart-icon ${heartIdx <= lives ? 'alive' : 'dead'}`} 
                fill={heartIdx <= lives ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <button className="control-btn" onClick={() => setShowSettings(true)}>
            <Settings size={20} />
          </button>
          <button className="control-btn" onClick={handlePause}>
            <Pause size={20} />
          </button>
        </div>

        <div className="status-zen">
          <AnimatePresence mode="wait">
            {gameState === 'playing' && (
              <motion.div 
                key={isSystemPlaying ? 'system' : 'player'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`zen-text ${isSystemPlaying ? 'text-system' : 'text-player'}`}
              >
                {isSystemPlaying ? 'Observe Harmony' : 'Restore Harmony'}
              </motion.div>
            )}
            {gameState === 'waiting_to_start' && (
              <motion.button
                key="start-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="action-btn"
                onClick={playSequence}
              >
                <Play size={18} fill="currentColor" />
                PLAY PATTERN
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          className={`pads-grid-zen ${gameState === 'wrong' || gameState === 'game_over' ? 'shake-soft' : ''}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2, duration: 1 }}
        >
          {PADS.map((pad) => {
            const isActive = activePad === pad.id;
            return (
              <motion.div
                key={pad.id}
                className={`zen-pad ${isActive ? 'active' : ''} ${(gameState !== 'playing') ? 'dimmed' : ''}`}
                style={{ '--pad-color': pad.color }}
                onClick={() => handlePadClick(pad.id)}
                whileHover={!isSystemPlaying && gameState === 'playing' ? { scale: 1.02 } : {}}
                whileTap={!isSystemPlaying && gameState === 'playing' ? { scale: 0.98 } : {}}
              />
            );
          })}
        </motion.div>

        <AnimatePresence>
          {gameState === 'level_up' && (
            <motion.div 
              className="zen-overlay success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1>HARMONY RESTORED</h1>
              <p>+ {level * 100} Points</p>
              <button className="action-btn-large" onClick={handleNextLevel} style={{marginTop: '20px'}}>
                PROCEED TO LEVEL {level + 1}
              </button>
            </motion.div>
          )}

          {gameState === 'wrong' && (
            <motion.div 
              className="zen-overlay error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1>DISSONANCE DETECTED</h1>
              <p>Life Lost.</p>
            </motion.div>
          )}

          {gameState === 'game_over' && (
            <motion.div 
              className="zen-overlay fatal scorecard-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="scorecard-container">
                <h2>HARMONY LOST</h2>
                
                <div className="scorecard-grid">
                  <div className="score-item">
                    <Award size={24} className="score-icon" />
                    <span className="score-label">RANK</span>
                    <span className="score-value highlight">{rank}</span>
                  </div>
                  <div className="score-item">
                    <Star size={24} className="score-icon" />
                    <span className="score-label">SCORE</span>
                    <span className="score-value">{score}</span>
                  </div>
                  <div className="score-item">
                    <Home size={24} className="score-icon" />
                    <span className="score-label">LEVEL REACHED</span>
                    <span className="score-value">{level - 1}</span>
                  </div>
                  <div className="score-item">
                    <Clock size={24} className="score-icon" />
                    <span className="score-label">TIME PLAYED</span>
                    <span className="score-value">{formatTime(timePlayed)}</span>
                  </div>
                </div>

                <button className="action-btn-large" onClick={() => onGameOver(level - 1)}>
                  CONTINUE TO MENU
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'paused' && (
            <motion.div 
              className="zen-overlay paused-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2>PAUSED</h2>
              <div className="pause-actions">
                <button className="pause-btn" onClick={handleResume}>
                  <Play size={20} /> RESUME
                </button>
                <button className="pause-btn" onClick={() => setShowSettings(true)}>
                  SETTINGS
                </button>
                <button className="pause-btn quit" onClick={onQuit}>
                  <Home size={20} /> QUIT TO MENU
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showSettings && (
          <SettingsModal 
            onClose={() => setShowSettings(false)} 
            settings={settings}
            setSettings={setSettings}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Game;
