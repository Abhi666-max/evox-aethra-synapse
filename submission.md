# PULSE

**PULSE** is an ultra-premium, ethereal re-imagining of the classic visual memory sequence game. The premise is universally understood: the system generates a sequence of lights, and the player must replicate it to restore "harmony." As the game progresses through levels, the sequence grows longer. 

The player is given 3 "Lives" (Hearts). Making a mistake breaks the harmony, costing a life, but allowing the player to retry the current level until their lives run out. It is a perfect blend of cognitive challenge and serene aesthetic execution.

## How to Play
1. **Launch:** The player is greeted with an incredibly elegant, minimalist landing page featuring a slow, breathing background of blurred orbs, establishing a state of "Zen." 
2. **Observe:** Once started, the game enters the "Observe Harmony" phase. Four frosted glass pads are displayed. The system will flash a sequence of pads, each emitting a soft, diffused pastel color (Cyan, Pink, Yellow, Purple) and a beautiful synthesized musical tone.
3. **Repeat:** The player must click the pads in the exact sequence they just observed.
4. **Progression & Scoring:** If correct, the player earns points and advances to the next level. If a mistake is made, a gentle "shake" animation triggers, a life is visually lost from the HUD, and the sequence can be retried. 
5. **Scorecard:** If all 3 lives are lost, the game ends, presenting a beautiful frosted-glass scorecard detailing the player's Rank (Novice -> Adept -> Master -> Ascendant), Score, Level Reached, and Time Played.

## Technical Highlights
* **Aesthetic Superiority:** PULSE takes inspiration from high-end corporate design (Apple, Vercel). It uses extreme minimalism, slow `framer-motion` spring animations, pastel glows, and frosted glass (`backdrop-filter`) to create a mature, professional experience.
* **Flawless State Management:** The React state machine perfectly manages game pauses, manual level triggers, life tracking, scoring, and elapsed time.
* **Web Audio Synthesis:** Custom built using the Web Audio API, producing soothing, delay-enveloped sine wave tones for interactions, removing the need for external MP3 assets.
* **Haptics Integration:** Uses `navigator.vibrate` to provide tactile feedback to mobile users (soft taps for correct moves, dissonance stutters for mistakes).
* **Local Persistence:** High scores and user settings (Sound/Vibration toggles) are persisted seamlessly in the browser's Local Storage.

## Running Locally
1. Ensure Node.js is installed.
2. Clone the repository and run `npm install`.
3. Run `npm run dev` to start the Vite development server.

---
*Developed & Designed by Abhijeet Kangane*
