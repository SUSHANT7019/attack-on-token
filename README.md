# RageBait Lab — A Chaotic, Interactive Web Experience

A complete, visually stunning, fully interactive web laboratory engineered using strictly **HTML5**, **CSS3**, and modern **Vanilla JavaScript (ES6+)**. No frameworks (React/Vue/Angular), no TypeScript, and no mandatory build system.

---

## 🏛️ Architecture & File Structure

Strictly conforms to the **Two-Page Limit**:

```text
├── index.html            # Main laboratory experience (Hero, Navigation, 30 Features, Soundboard, Trophies, HUD, Footer)
├── account.html          # Dynamic Auth & Profile (Login, Multi-Step Signup Wizard, Profile Dashboard, Telemetry)
├── css/
│   ├── style.css         # Universal cyber-chaos design system, animations, cards, modals, toast system
│   └── account.css       # Authentication forms, wizard progress, profile layout, avatar grid
├── js/
│   ├── storage.js        # Persistent state manager (Stats, Achievements, Activity Log, Preferences, Safeties)
│   ├── audio.js          # 100% self-contained procedural Web Audio API synthesizers (No broken external audio links)
│   ├── achievements.js   # 14 achievements logic, evaluation triggers, and animated toast notifications
│   ├── auth.js           # Auth abstraction layer with salted SHA-256 hashing via Web Crypto API & Demo Mode
│   ├── profile.js        # Profile controller, live telemetry charts, avatar customizer, edit modal
│   ├── features.js       # Full implementation of all 30 crazy interactive features with safety cleanup
│   └── app.js            # Main coordinator, session timer, global HUD sync, keyboard shortcuts, panic controls
└── README.md             # Complete documentation and verification report
```

---

## 🧪 The 30 Interactive Features Checklist

All 30 features are actively wired up, genuinely interactive, and present on `index.html`:

| # | Feature Name | Category | Interactive Behavior |
|---|---|---|---|
| **01** | **Tilt-to-Control Volume** | Motion & Audio | Reads device accelerometer on mobile (`DeviceOrientationEvent`) with drag/touch & keyboard fallback; alters Web Audio master gain. |
| **02** | **The Coward Button** | Agility Trap | Bounded evasion away from cursor; spawns deceptive decoys after 4 dodges; rewards catching with victory confetti. |
| **03** | **Magnetic Elements** | Physics | Badges pull gravitationally toward cursor with spring physics and dampening snap-back on mouse leave. |
| **04** | **Cursor Velocity Profiler** | Motion Tracking | Real-time trigonometric eye tracking (`Math.atan2`); gets dizzy (😵‍💫) at >2500px/s velocity; yawns when idle. |
| **05** | **The Idle Mascot** | AI Mood | Detects 12s of user inactivity; falls asleep with floating "Zzz..." bubbles; wakes with a startle on interaction. |
| **06** | **Gravity Toggle** | Physics | Toggles physics disruption causing badges to drop with realistic bounce and rotate; clean restore button. |
| **07** | **Scroll Surprises** | Surprises | Non-intrusive `IntersectionObserver` trigger that slides a mischievous peek-a-boo banner without hijacking scroll. |
| **08** | **Glitch Text Generator** | Corrupter | Live text corruption with Zalgo unicode diacritics, adjustable corruption slider (1-10), copy & purge controls. |
| **09** | **Cursed Theme** | Aesthetic | Applies Comic Sans, 160° hue-rotation, and jitter filter overrides with an instant "Cleanse Curse" button. |
| **10** | **Dramatic Theme Switch** | Theatrical | Full light/dark mode switch accompanied by an over-the-top theatrical blackout curtain flash and airhorn. |
| **11** | **The Lying Toggle** | Troll Switch | Toggle labeled "DO NOT TURN ON" that violently snaps itself off after 400ms and asserts it was never clicked. |
| **12** | **Infinite Loading Bar** | Fake Progress | Creeps to 99%, pauses, reverses to 42% citing absurd errors ("Downloading RAM..."), with a working Skip control. |
| **13** | **Popup Boss Fight** | Boss Fight | 3 escalating in-page modals ("Existential Confirmation", "Pizza Dilemma", and a 3-HP interactive OK button). |
| **14** | **Retro CLI Terminal** | Cyber Hacker | Interactive terminal typing diagnostic logs; runs commands: `help`, `matrix`, `nuke`, `roast`, `aura`, `secret`. |
| **15** | **Real-Time Aura Meter** | Telemetry | Calculates dynamic aura rank from actual session clicks, troll interactions, and coward button catches. |
| **16** | **Emoji Grenade** | Particle Burst | Animated pin-pull delay followed by 28 radially launched emoji particles with physics and DOM cleanup. |
| **17** | **Button Personality Generator** | Behavior Matrix | Button behavior switches between Shy, Dramatic, Sleepy, Chaotic, and Overconfident with custom voicelines. |
| **18** | **Harmless Roast Generator** | Comedy | 20+ tech/gamer roasts with reroll and clipboard copy functionality. |
| **19** | **Fictional CAPTCHA** | Verification | Solvable mini-test: "Select the emoji representing your existential crisis" with witty diagnosis. |
| **20** | **Chaos Intensity Selector** | Global Tuning | 3-state setting (Chill, Unhinged, Full Menace) altering animation speeds, shake intensity, and audio cues. |
| **21** | **Meme Soundboard** | Procedural Audio | 6 Web Audio synthesizers: Vine Boom, Airhorn, Sad Trombone, Quack, Laser Pew, and Buzzer with visual pulses. |
| **22** | **Reaction-Time Trial** | Reflex Trial | Millisecond reflex test with randomized 1.5–4s wait delays, false-start penalties, and persistent best scores. |
| **23** | **The Unlucky Wheel** | Random Chance | HTML5 Canvas spinning wheel with 8 sectors, realistic deceleration physics, and accurate outcome mapping. |
| **24** | **Confetti Cannon** | Visual Joy | High-performance HTML5 Canvas particle system with gravity, air resistance, and automatic memory cleanup. |
| **25** | **Sound Reaction Visualizer** | Audio Reactive | Real-time 8-bar frequency equalizer that dances in response to soundboard triggers and audio events. |
| **26** | **Keyboard Cheat Codes** | Easter Egg | Konami Code (`↑↑↓↓←→←→BA`) unlocks Golden Super Saiyan mode; typing `RAGE` triggers rainbow disco mode. |
| **27** | **15s Chaos Frenzy** | Timed Mini-Game | 15-second arena game clicking fleeing emoji targets with real-time score tracking and sound effects. |
| **28** | **Secret Discovery System** | Exploration | Tracks 6 secrets (logo clicks, footer troll, cheat codes, wheel spins) with hint counter. |
| **29** | **The Nuclear Panic Button** | Doomsday Trap | 4-second emergency siren, hazard strobe, and screen tremor sequence with immediate "Abort" override. |
| **30** | **Chaos Diagnostic Certificate** | Certification | Generates an official certificate modal summarizing real visitor metrics with one-click clipboard copying. |

---

## 🏆 Unlocked Trophies & Milestones (14 Total)

1. **Certified Menace** — Amass at least 500 Chaos Score in the laboratory.
2. **Button Predator** — Chase down and click the evasive Coward Button.
3. **Trust Issues** — Flick the contradictory Lying Toggle 5 times.
4. **Secret Hunter** — Uncover at least 2 hidden Easter eggs in the Secret Discovery System.
5. **Soundboard Addict** — Blast 10 comedic sound effects from the soundboard.
6. **Chaos Enthusiast** — Dial the laboratory chaos intensity selector to Full Menace.
7. **Reaction Master** — Achieve a reaction time under 250ms in the reflex trial.
8. **Gravity Breaker** — Disrupt physics by activating Gravity Mode.
9. **Popup Survivor** — Survive all 3 phases of the in-page Popup Boss Fight.
10. **Theme Jumper** — Switch between Cursed Theme and Dramatic Theme.
11. **Terminal Hacker** — Execute commands or diagnostics in the Fake Terminal.
12. **Chaos Legend** — Unlock at least 8 trophies and generate your official Chaos Report.
13. **Old School Hacker** — Enter the legendary Konami cheat code on your keyboard.
14. **Self-Deprecation Pro** — Generate multiple roasts from the Roast Generator.

---

## 🔐 Authentication & Profile Architecture

### Demo Mode vs. Production Backend
- **Security First**: Passwords are **never stored in plaintext**. The application uses the browser's native `window.crypto.subtle.digest('SHA-256')` with unique cryptographic salting.
- **Demo Credentials**: One-click fill button on `account.html`:
  - **Email**: `troll@ragebait.lab`
  - **Password**: `Password123!`
- **Extensible Architecture**: `js/auth.js` provides an extensible `AuthManager` with support for external providers (e.g. Supabase, Firebase) via `window.RBL_AUTH_CONFIG`.
- **Multi-Step Signup Flow**:
  1. *Account*: Display name, email, password strength meter, confirm password.
  2. *Personality*: Troll avatar selector (10 options), chaos class, manifesto bio.
  3. *Preferences*: Sound toggle, animation intensity, theme selection.
  4. *Confirmation*: Live summary card & validation.
- **Editable Profile Dashboard**:
  - Edit Profile modal with Save, Cancel, and Reset controls.
  - Live session telemetry: Chaos Score, Clicks, Features Explored, Reflex Records, Trophies.
  - Real-time chronological activity feed.
  - Shareable profile markdown summary card.
  - Danger Zone: One-click complete progress purge with confirmation.

---

## 🔊 Procedural Web Audio API Sound Engine

No missing MP3s or failed audio fetches. All sounds are procedurally generated via the browser's native `AudioContext`:
- **Vine Boom**: Sine sub-bass drop (140Hz ➔ 32Hz) with low-pass saturation.
- **Airhorn**: 3-note microtonal Bb chord sawtooth waves with rapid pitch ramp.
- **Sad Trombone**: 4 descending sliding glissando tones with LFO vibrato.
- **Laser Pew**: Exponential downwards frequency sweep from 1100Hz to 80Hz.
- **Quack / Squeak**: Frequency-modulated triangle bounce.
- **Buzzer / Bruh**: Dissonant sawtooth and square wave collision.
- **Victory Chime**: Rapid C-E-G-C celebratory arpeggio.
- **Siren**: Wailing dual-frequency LFO emergency sweep.
- **Muted by Default**: Strictly respects browser audio policies and user safety preferences.

---

## ♿ Performance, Safety & Accessibility

- **Responsive Viewports**: Tested at 360px (mobile), 768px (tablet), 1024px (laptop), and 1440px+ (desktop).
- **Reduced Motion Support**: Respects `@media (prefers-reduced-motion: reduce)`.
- **Global Emergency Stop**: Top navigation bar includes a `"🛑 Stop Effects"` button that terminates screen shakes, disco strobes, and cursed filters immediately.
- **Keyboard Operability**: Modals trap focus and can be dismissed with `Escape`. Form controls maintain visible `:focus-visible` rings.

---

## 🚀 How to Run Locally

Because this project is built entirely on vanilla standards, no installation or npm build is required:

```bash
# Option 1: Double click index.html or open directly in any modern browser
open index.html

# Option 2: Using python's built-in static server
python -m http.server 8000

# Option 3: Using Node npx serve
npx -y serve .
```
Navigate to `http://localhost:8000` to experience RageBait Lab!
