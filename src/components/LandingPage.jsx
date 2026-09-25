import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Settings } from 'lucide-react';
import SettingsModal from './SettingsModal';
import './LandingPage.css';

const LandingPage = ({ onStart, highScore, settings, setSettings }) => {
  const [showSettings, setShowSettings] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    },
    exit: { 
      opacity: 0, 
      filter: "blur(20px)",
      transition: { duration: 0.8, ease: "easeInOut" } 
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <>
      <motion.div 
        className="landing-wrapper"
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        <button className="settings-btn-floating" onClick={() => setShowSettings(true)}>
          <Settings size={24} />
        </button>

        <div className="landing-content">
          <motion.h1 className="neon-title" variants={item}>
            PULSE
          </motion.h1>
          
          <motion.p className="neon-subtitle" variants={item}>
            Harmonize your memory.
          </motion.p>

          <motion.div className="zen-card" variants={item}>
            <div className="instructions-title">HOW TO PLAY</div>
            <p>Observe the light sequence. Repeat it flawlessly.</p>
            <p>You have 3 attempts before harmony is broken.</p>
          </motion.div>

          {highScore > 0 && (
            <motion.div className="high-score-minimal" variants={item}>
              Highest Harmony: <span>Level {highScore}</span>
            </motion.div>
          )}

          <motion.button 
            className="btn-zen"
            onClick={onStart}
            variants={item}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,1)", color: "#000" }}
            whileTap={{ scale: 0.98 }}
          >
            <Play size={18} fill="currentColor" />
            <span>BEGIN</span>
          </motion.button>
        </div>
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

export default LandingPage;
