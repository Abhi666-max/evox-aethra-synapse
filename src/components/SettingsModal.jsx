import { motion } from 'framer-motion';
import { X, Volume2, VolumeX, Vibrate, VibrateOff } from 'lucide-react';
import './SettingsModal.css';

const SettingsModal = ({ onClose, settings, setSettings }) => {
  const toggleSound = () => setSettings(s => ({ ...s, sound: !s.sound }));
  const toggleVibration = () => {
    const newVal = !settings.vibration;
    setSettings(s => ({ ...s, vibration: newVal }));
    if (newVal && navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <motion.div 
      className="settings-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="settings-card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <h2>SETTINGS</h2>

        <div className="settings-options">
          <div className="setting-row" onClick={toggleSound}>
            <div className="setting-info">
              {settings.sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
              <span>Sound Effects</span>
            </div>
            <div className={`toggle-switch ${settings.sound ? 'on' : 'off'}`}>
              <div className="toggle-knob" />
            </div>
          </div>

          <div className="setting-row" onClick={toggleVibration}>
            <div className="setting-info">
              {settings.vibration ? <Vibrate size={20} /> : <VibrateOff size={20} />}
              <span>Haptic Feedback</span>
            </div>
            <div className={`toggle-switch ${settings.vibration ? 'on' : 'off'}`}>
              <div className="toggle-knob" />
            </div>
          </div>
        </div>

        <div className="credits-section">
          <h3>CREDITS</h3>
          <p>Developed & Designed by</p>
          <div className="developer-name">Abhijeet Kangane</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsModal;
