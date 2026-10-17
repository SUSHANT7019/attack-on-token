/**
 * RageBait Lab - 30 Crazy Interactive Features Engine
 * Complete implementation of all 30 features with clean event handlers, physics, and safety cleanup.
 */

class FeaturesEngine {
  constructor() {
    this.initialized = false;
    this.tiltHandler = null;
    this.cowardDodges = 0;
    this.idleTimer = null;
    this.lastActivityTime = Date.now();
    this.confettiCanvas = null;
    this.reactionState = 'idle'; // 'idle', 'waiting', 'ready', 'ended'
    this.reactionStartTime = 0;
    this.reactionTimeout = null;
    this.secretClicksOnLogo = 0;
    this.wheelRotation = 0;
    this.isSpinning = false;
  }

  initAll() {
    if (this.initialized) return;
    this.initFeature1_TiltVolume();
    this.initFeature2_CowardButton();
    this.initFeature3_MagneticCursor();
    this.initFeature4_CursorPersonality();
    this.initFeature5_IdleMascot();
    this.initFeature6_GravityMode();
    this.initFeature7_ScrollSurprises();
    this.initFeature8_GlitchText();
    this.initFeature9_CursedTheme();
    this.initFeature10_DramaticTheme();
    this.initFeature11_LyingToggle();
    this.initFeature12_InfiniteLoading();
    this.initFeature13_PopupBossFight();
    this.initFeature14_FakeTerminal();
    this.initFeature15_AuraMeter();
    this.initFeature16_EmojiGrenade();
    this.initFeature17_ButtonPersonality();
    this.initFeature18_RoastGenerator();
    this.initFeature19_FakeCaptcha();
    this.initFeature20_ChaosIntensity();
    this.initFeature21_Soundboard();
    this.initFeature22_ReactionGame();
    this.initFeature23_LuckyWheel();
    this.initFeature24_Confetti();
    this.initFeature25_SoundReactionVisualizer();
    this.initFeature26_KeyboardCheatCodes();
    this.initFeature27_MiniChaosChallenge();
    this.initFeature28_SecretDiscoverySystem();
    this.initFeature29_FinalChaosButton();
    this.initFeature30_FinalReportGenerator();
    this.initialized = true;
  }

  // Helper: Trigger confetti
  fireConfetti(particleCount = 50) {
    const canvas = document.getElementById('global-confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00f0ff', '#ff007f', '#ffe600', '#7928ca', '#00ff66', '#ffffff'];
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() * 200 - 100),
        y: canvas.height / 2 + (Math.random() * 100 - 50),
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 1.2) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let animationId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.98; // drag
        p.rotation += p.rotSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationId);
      }
    };
    render();
  }

  // --- 1. TILT-TO-CONTROL VOLUME ---
  initFeature1_TiltVolume() {
    const slider = document.getElementById('tilt-volume-slider');
    const valueDisplay = document.getElementById('tilt-volume-value');
    const meterFill = document.getElementById('tilt-volume-meter');
    const permBtn = document.getElementById('tilt-perm-btn');

    if (!slider) return;

    const updateVolumeUI = (val) => {
      const clamped = Math.max(0, Math.min(100, Math.round(val)));
      slider.value = clamped;
      if (valueDisplay) valueDisplay.textContent = `${clamped}%`;
      if (meterFill) meterFill.style.width = `${clamped}%`;
      window.RBLAudio.setVolume(clamped / 100);
      window.RBLStorage.recordInteraction('tilt_volume', 2);
    };

    slider.addEventListener('input', (e) => {
      updateVolumeUI(e.target.value);
    });

    if (permBtn) {
      permBtn.addEventListener('click', async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          try {
            const resp = await DeviceOrientationEvent.requestPermission();
            if (resp === 'granted') {
              permBtn.textContent = 'Tilt Active!';
              permBtn.disabled = true;
              window.addEventListener('deviceorientation', (e) => {
                if (e.gamma !== null) {
                  // gamma: -90 to 90
                  const mapped = ((e.gamma + 45) / 90) * 100;
                  updateVolumeUI(mapped);
                }
              });
            }
          } catch (err) {
            permBtn.textContent = 'Permission Denied';
          }
        } else if (window.DeviceOrientationEvent) {
          permBtn.textContent = 'Listening to Tilt...';
          window.addEventListener('deviceorientation', (e) => {
            if (e.gamma !== null) {
              const mapped = ((e.gamma + 45) / 90) * 100;
              updateVolumeUI(mapped);
            }
          });
        } else {
          permBtn.textContent = 'Tilt not supported on device';
        }
      });
    }
  }

  // --- 2. COWARD BUTTON ---
  initFeature2_CowardButton() {
    const btn = document.getElementById('coward-btn');
    const arena = document.getElementById('coward-arena');
    const message = document.getElementById('coward-message');
    if (!btn || !arena) return;

    const insults = [
      'Too slow, human!',
      'Nice try, slowpoke!',
      'Did you really think it would be that easy?',
      'My grandma clicks faster than that!',
      'Nope! Not today!'
    ];

    const moveButton = (e) => {
      const arenaRect = arena.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();

      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const dist = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);

      if (dist < 110) {
        this.cowardDodges += 1;
        window.RBLAudio.playQuack();

        // Calculate random coordinates inside arena
        const maxX = arenaRect.width - btnRect.width - 20;
        const maxY = arenaRect.height - btnRect.height - 20;

        const newX = Math.max(10, Math.floor(Math.random() * maxX));
        const newY = Math.max(10, Math.floor(Math.random() * maxY));

        btn.style.position = 'absolute';
        btn.style.left = `${newX}px`;
        btn.style.top = `${newY}px`;

        if (message) {
          message.textContent = insults[Math.floor(Math.random() * insults.length)];
          message.classList.add('pop-shake');
          setTimeout(() => message.classList.remove('pop-shake'), 300);
        }

        // After 4 dodges, spawn decoys
        if (this.cowardDodges >= 4 && !arena.querySelector('.decoy-btn')) {
          for (let i = 0; i < 3; i++) {
            const decoy = document.createElement('button');
            decoy.className = 'btn btn-secondary decoy-btn';
            decoy.textContent = 'Click me!';
            decoy.style.position = 'absolute';
            decoy.style.left = `${Math.floor(Math.random() * maxX)}px`;
            decoy.style.top = `${Math.floor(Math.random() * maxY)}px`;
            decoy.addEventListener('click', () => {
              window.RBLAudio.playBuzzer();
              if (message) message.textContent = 'FOOL! That was an illusion!';
            });
            arena.appendChild(decoy);
          }
        }
      }
    };

    arena.addEventListener('mousemove', moveButton);

    btn.addEventListener('click', () => {
      window.RBLAudio.playVictory();
      this.fireConfetti(60);
      if (message) message.textContent = 'NOOO! You caught me! I have failed my ancestors! 💀';
      btn.textContent = 'DEFEATED! 🏆';
      btn.disabled = true;

      window.RBLStorage.updateStats(stats => {
        stats.cowardButtonCatches = (stats.cowardButtonCatches || 0) + 1;
        return stats;
      });
      window.RBLStorage.recordInteraction('coward_button', 50, 'Captured the Coward Button!');
      window.RBLAchievements.evaluateAll();

      // Clean up decoys
      arena.querySelectorAll('.decoy-btn').forEach(d => d.remove());

      setTimeout(() => {
        btn.textContent = 'Catch Me If You Can!';
        btn.disabled = false;
        btn.style.position = 'static';
        if (message) message.textContent = 'Want to test your reflexes again?';
        this.cowardDodges = 0;
      }, 5000);
    });
  }

  // --- 3. MAGNETIC CURSOR ---
  initFeature3_MagneticCursor() {
    const magneticItems = document.querySelectorAll('.magnetic-target');
    if (!magneticItems.length) return;

    magneticItems.forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.35;
        const deltaY = (e.clientY - centerY) * 0.35;

        item.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translate3d(0, 0, 0)';
        item.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        setTimeout(() => {
          item.style.transition = '';
        }, 400);
      });
    });
  }

  // --- 4. CURSOR PERSONALITY DETECTOR ---
  initFeature4_CursorPersonality() {
    const leftPupil = document.getElementById('mascot-pupil-left');
    const rightPupil = document.getElementById('mascot-pupil-right');
    const mascotCard = document.getElementById('cursor-detector-card');
    const statusText = document.getElementById('cursor-personality-status');
    const expression = document.getElementById('cursor-mascot-face');

    if (!mascotCard) return;

    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();
    let dizzyTimeout = null;

    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      const dt = now - lastTime || 1;
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      const speed = (dist / dt) * 1000; // px/sec

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;

      // Eye tracking
      if (leftPupil && rightPupil) {
        const rect = mascotCard.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        const eyeRadius = 7;
        const px = Math.cos(angle) * eyeRadius;
        const py = Math.sin(angle) * eyeRadius;

        leftPupil.style.transform = `translate(${px}px, ${py}px)`;
        rightPupil.style.transform = `translate(${px}px, ${py}px)`;
      }

      // Speed detection
      if (speed > 2500) {
        if (expression) expression.textContent = '😵‍💫';
        if (statusText) statusText.textContent = 'SPEED OVERLOAD! Mascot is dizzy!';
        clearTimeout(dizzyTimeout);
        dizzyTimeout = setTimeout(() => {
          if (expression) expression.textContent = '👀';
          if (statusText) statusText.textContent = 'Tracking your moves...';
        }, 1500);
      } else if (speed > 1200) {
        if (statusText) statusText.textContent = 'Aggressive movement detected!';
      }
    });
  }

  // --- 5. IDLE MASCOT ---
  initFeature5_IdleMascot() {
    const idleCard = document.getElementById('idle-mascot-card');
    const idleEmoji = document.getElementById('idle-mascot-emoji');
    const idleStatus = document.getElementById('idle-mascot-status');
    const snoreZzz = document.getElementById('idle-snore-bubble');

    let isAsleep = false;

    const wakeUp = () => {
      this.lastActivityTime = Date.now();
      if (isAsleep) {
        isAsleep = false;
        if (idleEmoji) idleEmoji.textContent = '😳';
        if (idleStatus) idleStatus.textContent = 'W-WHAT?! WHO DARES WAKE THE CHAOS MASTER?!';
        if (snoreZzz) snoreZzz.classList.add('hidden');
        window.RBLAudio.playPop();

        setTimeout(() => {
          if (idleEmoji) idleEmoji.textContent = '😈';
          if (idleStatus) idleStatus.textContent = 'Awake and plotting mischief.';
        }, 2000);
      }
    };

    ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'].forEach(evt => {
      window.addEventListener(evt, wakeUp, { passive: true });
    });

    setInterval(() => {
      const idleTime = Date.now() - this.lastActivityTime;
      if (idleTime > 12000 && !isAsleep) {
        isAsleep = true;
        if (idleEmoji) idleEmoji.textContent = '😴';
        if (idleStatus) idleStatus.textContent = 'Zzz... The lab mascot fell asleep from your lack of chaos...';
        if (snoreZzz) snoreZzz.classList.remove('hidden');
      }
    }, 2000);
  }

  // --- 6. GRAVITY MODE ---
  initFeature6_GravityMode() {
    const toggleBtn = document.getElementById('gravity-mode-toggle');
    const gravityZone = document.getElementById('gravity-playground');
    if (!toggleBtn || !gravityZone) return;

    let isGravityActive = false;

    toggleBtn.addEventListener('click', () => {
      isGravityActive = !isGravityActive;
      const floaters = gravityZone.querySelectorAll('.gravity-item');

      if (isGravityActive) {
        toggleBtn.textContent = 'Restore Normal Physics 🪐';
        toggleBtn.classList.add('btn-danger');
        window.RBLAudio.playVineBoom();
        window.RBLStorage.recordInteraction('gravity_mode', 25, 'Turned off gravity');

        floaters.forEach((el, idx) => {
          const dropHeight = gravityZone.clientHeight - 80 - (Math.random() * 40);
          const bounceRot = (Math.random() - 0.5) * 45;
          el.style.transition = `transform ${0.6 + idx * 0.1}s cubic-bezier(0.5, 0, 0.75, 0)`;
          el.style.transform = `translateY(${dropHeight}px) rotate(${bounceRot}deg)`;
        });
      } else {
        toggleBtn.textContent = 'Disrupt Gravity ☄️';
        toggleBtn.classList.remove('btn-danger');
        window.RBLAudio.playVictory();

        floaters.forEach(el => {
          el.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          el.style.transform = 'translateY(0) rotate(0deg)';
        });
      }
    });
  }

  // --- 7. SCROLL SURPRISES ---
  initFeature7_ScrollSurprises() {
    const banner = document.getElementById('scroll-surprise-banner');
    const trigger = document.getElementById('scroll-surprise-trigger');
    if (!banner || !trigger) return;

    let shown = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !shown) {
          shown = true;
          banner.classList.add('is-visible');
          window.RBLAudio.playPop();
          window.RBLStorage.recordInteraction('scroll_surprise', 15);

          const closeBtn = banner.querySelector('.surprise-close-btn');
          if (closeBtn) {
            closeBtn.onclick = () => {
              banner.classList.remove('is-visible');
            };
          }

          setTimeout(() => {
            banner.classList.remove('is-visible');
          }, 6000);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(trigger);
  }

  // --- 8. GLITCH TEXT GENERATOR ---
  initFeature8_GlitchText() {
    const input = document.getElementById('glitch-input');
    const output = document.getElementById('glitch-output');
    const intensity = document.getElementById('glitch-intensity');
    const copyBtn = document.getElementById('glitch-copy-btn');
    const purgeBtn = document.getElementById('glitch-purge-btn');

    if (!input || !output) return;

    const zalgoUp = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357'];
    const zalgoDown = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u0320', '\u0324', '\u0325', '\u0326'];

    const corrupt = (text, level) => {
      if (!text) return 'Enter something above to corrupt...';
      let res = '';
      for (let i = 0; i < text.length; i++) {
        res += text[i];
        const count = Math.floor(Math.random() * level);
        for (let j = 0; j < count; j++) {
          res += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
          res += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
        }
      }
      return res;
    };

    const update = () => {
      const lvl = intensity ? parseInt(intensity.value, 10) : 3;
      const text = input.value;
      output.textContent = corrupt(text, lvl);
      output.className = `glitch-display-text level-${lvl}`;
    };

    input.addEventListener('input', update);
    if (intensity) intensity.addEventListener('input', update);

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(output.textContent).then(() => {
          copyBtn.textContent = 'Copied to Void! 📋';
          window.RBLAudio.playPop();
          setTimeout(() => copyBtn.textContent = 'Copy Corrupted Text', 2000);
        });
      });
    }

    if (purgeBtn) {
      purgeBtn.addEventListener('click', () => {
        input.value = 'RageBait Lab is totally normal';
        update();
        window.RBLAudio.playLaser();
      });
    }
  }

  // --- 9. CURSED THEME ---
  initFeature9_CursedTheme() {
    const btn = document.getElementById('cursed-theme-btn');
    if (!btn) return;

    let isCursed = false;

    btn.addEventListener('click', () => {
      isCursed = !isCursed;
      if (isCursed) {
        document.body.classList.add('cursed-mode');
        btn.textContent = 'Cleanse Curse 🧼';
        window.RBLAudio.playSadTrombone();
        window.RBLStorage.recordInteraction('cursed_theme', 30, 'Invoked Cursed Theme');
      } else {
        document.body.classList.remove('cursed-mode');
        btn.textContent = 'Summon Cursed Theme 🤡';
        window.RBLAudio.playVictory();
      }
    });
  }

  // --- 10. DRAMATIC THEME SWITCH ---
  initFeature10_DramaticTheme() {
    const btn = document.getElementById('dramatic-theme-toggle');
    const curtain = document.getElementById('theatrical-curtain');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';

      window.RBLAudio.playAirhorn();

      if (curtain) {
        curtain.classList.add('theatrical-flash');
        setTimeout(() => {
          document.documentElement.setAttribute('data-theme', next);
          window.RBLStorage.savePreferences({ theme: next });
          btn.textContent = next === 'dark' ? '🌙 Switch to Light' : '☀️ Switch to Dark';
        }, 200);

        setTimeout(() => {
          curtain.classList.remove('theatrical-flash');
        }, 600);
      } else {
        document.documentElement.setAttribute('data-theme', next);
        window.RBLStorage.savePreferences({ theme: next });
      }

      window.RBLStorage.recordInteraction('dramatic_theme', 20);
    });
  }

  // --- 11. LYING TOGGLE ---
  initFeature11_LyingToggle() {
    const checkbox = document.getElementById('lying-toggle-checkbox');
    const msgDisplay = document.getElementById('lying-toggle-msg');
    if (!checkbox) return;

    const lies = [
      'I was never toggled.',
      'You are hallucinating.',
      'That switch is decorative.',
      'Stop touching me, human.',
      'No power in the universe will keep me on.',
      'I am legally obligated to remain off.'
    ];

    checkbox.addEventListener('change', () => {
      window.RBLAudio.playBuzzer();
      window.RBLStorage.updateStats(stats => {
        stats.lyingToggleClicks = (stats.lyingToggleClicks || 0) + 1;
        return stats;
      });
      window.RBLStorage.recordInteraction('lying_toggle', 15);

      setTimeout(() => {
        checkbox.checked = false;
        if (msgDisplay) {
          msgDisplay.textContent = lies[Math.floor(Math.random() * lies.length)];
          msgDisplay.classList.add('pop-shake');
          setTimeout(() => msgDisplay.classList.remove('pop-shake'), 300);
        }
      }, 400);
    });
  }

  // --- 12. INFINITE LOADING BAR ---
  initFeature12_InfiniteLoading() {
    const btn = document.getElementById('start-loading-btn');
    const skipBtn = document.getElementById('skip-loading-btn');
    const bar = document.getElementById('infinite-progress-fill');
    const pct = document.getElementById('infinite-progress-pct');
    const text = document.getElementById('infinite-progress-text');

    if (!btn || !bar) return;

    let timer = null;
    let progress = 0;

    const reasons = [
      'Downloading more RAM...',
      'Defragmenting the internet...',
      'Bribing the algorithm...',
      'Reversing entropy...',
      'Recalibrating flux capacitor...',
      'Asking AI for permission...',
      'Spinning unnecessary wheels...'
    ];

    const step = () => {
      if (progress < 85) {
        progress += Math.random() * 8 + 3;
      } else if (progress < 99) {
        progress += (100 - progress) * 0.05;
      } else {
        // Troll reverse!
        window.RBLAudio.playSadTrombone();
        progress = 42;
        if (text) text.textContent = 'Error 418: RAM leaked into coffee cup. Reversing progress...';
      }

      const clamped = Math.min(99.9, progress).toFixed(1);
      bar.style.width = `${clamped}%`;
      if (pct) pct.textContent = `${clamped}%`;
      if (text && Math.random() > 0.7) {
        text.textContent = reasons[Math.floor(Math.random() * reasons.length)];
      }

      timer = setTimeout(step, 300);
    };

    btn.addEventListener('click', () => {
      clearTimeout(timer);
      progress = 0;
      btn.disabled = true;
      if (skipBtn) skipBtn.classList.remove('hidden');
      window.RBLAudio.playPop();
      step();
      window.RBLStorage.recordInteraction('infinite_loading', 20);
    });

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        clearTimeout(timer);
        bar.style.width = '100%';
        if (pct) pct.textContent = '100%';
        if (text) text.textContent = 'Done! Nothing actually changed, but you feel accomplished.';
        btn.disabled = false;
        skipBtn.classList.add('hidden');
        window.RBLAudio.playVictory();
      });
    }
  }

  // --- 13. POPUP BOSS FIGHT ---
  initFeature13_PopupBossFight() {
    const startBtn = document.getElementById('start-popup-boss-btn');
    const modal = document.getElementById('popup-boss-modal');
    const phaseTitle = document.getElementById('popup-boss-phase');
    const bodyContent = document.getElementById('popup-boss-body');
    const actionArea = document.getElementById('popup-boss-actions');

    if (!startBtn || !modal) return;

    let currentPhase = 1;

    const renderPhase = (phase) => {
      currentPhase = phase;
      window.RBLAudio.playVineBoom();

      if (phase === 1) {
        phaseTitle.textContent = 'BOSS PHASE 1: The Confirmation';
        bodyContent.innerHTML = `<p>Are you <em>absolutely</em> confident you wish to exist on this website?</p>`;
        actionArea.innerHTML = `
          <button class="btn btn-secondary" id="boss-cancel">No, take me back</button>
          <button class="btn btn-primary" id="boss-next">Yes, obviously</button>
        `;
        document.getElementById('boss-next').onclick = () => renderPhase(2);
        document.getElementById('boss-cancel').onclick = closeModal;
      } else if (phase === 2) {
        phaseTitle.textContent = 'BOSS PHASE 2: The Moral Dilemma';
        bodyContent.innerHTML = `
          <p>Check the box that aligns with truth to proceed:</p>
          <label class="boss-checkbox-label">
            <input type="checkbox" id="boss-chk-pineapple"> Pineapple belongs on hot pizza 🍍🍕
          </label>
        `;
        actionArea.innerHTML = `
          <button class="btn btn-primary" id="boss-next-2" disabled>Accept & Proceed</button>
        `;
        const chk = document.getElementById('boss-chk-pineapple');
        const next2 = document.getElementById('boss-next-2');
        chk.onchange = () => {
          next2.disabled = !chk.checked;
        };
        next2.onclick = () => renderPhase(3);
      } else if (phase === 3) {
        phaseTitle.textContent = 'FINAL BOSS: Defeat The OK Button (HP: 3)';
        let hp = 3;
        bodyContent.innerHTML = `<p>The OK button refuses to cooperate. Deplete its health bar!</p>`;
        actionArea.innerHTML = `
          <button class="btn btn-danger boss-ok-btn" id="boss-hp-btn">OK (HP: 3)</button>
        `;
        const okBtn = document.getElementById('boss-hp-btn');
        okBtn.onclick = () => {
          hp -= 1;
          window.RBLAudio.playLaser();
          okBtn.style.transform = `scale(${1 + (3 - hp) * 0.2}) rotate(${(Math.random() - 0.5) * 20}deg)`;
          okBtn.textContent = `OK (HP: ${hp})`;

          if (hp <= 0) {
            window.RBLAudio.playVictory();
            this.fireConfetti(70);
            phaseTitle.textContent = 'VICTORY ACHIEVED! 🏆';
            bodyContent.innerHTML = `<p class="text-success">You vanquished the Popup Boss! The laboratory salutes your tenacity.</p>`;
            actionArea.innerHTML = `<button class="btn btn-primary" id="boss-finish">Claim Glory & Close</button>`;
            document.getElementById('boss-finish').onclick = closeModal;

            window.RBLStorage.updateStats(stats => {
              stats.popupsSurvived = (stats.popupsSurvived || 0) + 3;
              return stats;
            });
            window.RBLStorage.recordInteraction('popup_boss', 75, 'Vanquished the Popup Boss');
            window.RBLAchievements.evaluateAll();
          }
        };
      }
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
    };

    startBtn.onclick = () => {
      modal.classList.add('is-open');
      renderPhase(1);
    };

    // Close on escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  // --- 14. FAKE TERMINAL ---
  initFeature14_FakeTerminal() {
    const terminalOutput = document.getElementById('fake-terminal-output');
    const input = document.getElementById('fake-terminal-input');
    const runBtn = document.getElementById('fake-terminal-run');
    if (!terminalOutput || !input) return;

    const log = (text, type = 'info') => {
      const line = document.createElement('div');
      line.className = `terminal-line line-${type}`;
      line.textContent = `> ${text}`;
      terminalOutput.appendChild(line);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const execute = (cmd) => {
      const clean = cmd.trim().toLowerCase();
      window.RBLAudio.playPop();

      log(cmd, 'cmd');
      window.RBLStorage.updateStats(stats => {
        stats.terminalCommandsRun = (stats.terminalCommandsRun || 0) + 1;
        return stats;
      });
      window.RBLStorage.recordInteraction('fake_terminal', 20);

      switch (clean) {
        case 'help':
          log('Available commands: help, matrix, nuke, roast, aura, clear, secret');
          break;
        case 'matrix':
          log('Waking up Neo... Reality is a CSS animation.', 'success');
          break;
        case 'nuke':
          log('WARNING: Tactical sarcasm warhead primed!', 'danger');
          window.RBLAudio.playSiren(1.5);
          break;
        case 'roast':
          log('Your typing latency suggests you are using dial-up in 2026.', 'warn');
          break;
        case 'aura':
          log(`Current Chaos Aura: ${window.RBLStorage.getStats().chaosScore}`, 'info');
          break;
        case 'secret':
          log('Easter Egg Clue: Try entering the Konami code on your keyboard!', 'success');
          break;
        case 'clear':
          terminalOutput.innerHTML = '';
          break;
        default:
          log(`Command not recognized: "${clean}". Type 'help' for syntax.`, 'error');
          break;
      }
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        execute(input.value);
        input.value = '';
      }
    });

    if (runBtn) {
      runBtn.onclick = () => {
        execute(input.value);
        input.value = '';
      };
    }
  }

  // --- 15. AURA METER ---
  initFeature15_AuraMeter() {
    const auraVal = document.getElementById('aura-score-val');
    const auraRank = document.getElementById('aura-rank-title');
    const checkBtn = document.getElementById('aura-check-btn');

    const updateAura = () => {
      const stats = window.RBLStorage.getStats();
      const score = (stats.chaosScore * 12) + (stats.totalInteractions * 7) - 200;

      let rank = 'NPC Energy';
      if (score < 0) rank = 'Bro Is Cooked 💀';
      else if (score < 500) rank = 'Slightly Sus 👀';
      else if (score < 2000) rank = 'Certified Menace 🔥';
      else if (score < 6000) rank = 'Rizz Architect 👑';
      else rank = 'Gigachad Deity 🗿';

      if (auraVal) auraVal.textContent = score.toLocaleString();
      if (auraRank) auraRank.textContent = rank;
    };

    updateAura();
    window.addEventListener('rbl:statsUpdated', updateAura);

    if (checkBtn) {
      checkBtn.onclick = () => {
        window.RBLAudio.playVineBoom();
        updateAura();
        this.fireConfetti(25);
      };
    }
  }

  // --- 16. EMOJI GRENADE ---
  initFeature16_EmojiGrenade() {
    const grenadeBtn = document.getElementById('emoji-grenade-btn');
    if (!grenadeBtn) return;

    grenadeBtn.addEventListener('click', (e) => {
      grenadeBtn.disabled = true;
      grenadeBtn.textContent = 'Pin Pulled! 💣💥';
      window.RBLAudio.playPop();

      setTimeout(() => {
        window.RBLAudio.playVineBoom();
        const emojis = ['💣', '💥', '🤡', '🔥', '💀', '🍌', '👀', '💩', '✨'];
        const rect = grenadeBtn.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        for (let i = 0; i < 28; i++) {
          const el = document.createElement('div');
          el.className = 'floating-emoji-particle';
          el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          el.style.left = `${startX}px`;
          el.style.top = `${startY}px`;

          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 220 + 60;
          const destX = Math.cos(angle) * dist;
          const destY = Math.sin(angle) * dist;

          document.body.appendChild(el);

          el.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${destX}px, ${destY}px) scale(${Math.random() * 1.5 + 0.8})`, opacity: 0 }
          ], {
            duration: 1200 + Math.random() * 400,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
          }).onfinish = () => el.remove();
        }

        grenadeBtn.disabled = false;
        grenadeBtn.textContent = 'Pull The Pin! 💣';
        window.RBLStorage.recordInteraction('emoji_grenade', 25);
      }, 400);
    });
  }

  // --- 17. BUTTON PERSONALITY GENERATOR ---
  initFeature17_ButtonPersonality() {
    const select = document.getElementById('button-personality-select');
    const targetBtn = document.getElementById('personality-target-btn');
    const bubble = document.getElementById('personality-speech-bubble');

    if (!select || !targetBtn) return;

    const personalities = {
      shy: {
        label: 'p-please dont click me...',
        speech: 'Eek! You invaded my personal space!',
        sound: () => window.RBLAudio.playQuack()
      },
      dramatic: {
        label: 'DO NOT RISK EVERYTHING',
        speech: 'THE AGONY! WHY WOULD YOU DO THIS TO ME?!',
        sound: () => window.RBLAudio.playSadTrombone()
      },
      sleepy: {
        label: 'zzzz... wake me up later',
        speech: 'Five more minutes, mom...',
        sound: () => window.RBLAudio.playPop()
      },
      chaotic: {
        label: 'CLICK ME OR REGRET IT',
        speech: 'HA! You activated my trap card!',
        sound: () => window.RBLAudio.playAirhorn()
      },
      overconfident: {
        label: 'I am invincible',
        speech: 'Is that all you got? Barely tickled!',
        sound: () => window.RBLAudio.playVineBoom()
      }
    };

    const updatePersonality = () => {
      const mode = select.value;
      const cfg = personalities[mode] || personalities.shy;
      targetBtn.textContent = cfg.label;
      if (bubble) bubble.textContent = 'Choose my attitude and click!';
    };

    select.addEventListener('change', updatePersonality);

    targetBtn.addEventListener('click', () => {
      const mode = select.value;
      const cfg = personalities[mode] || personalities.shy;
      cfg.sound();
      if (bubble) {
        bubble.textContent = cfg.speech;
        bubble.classList.add('pop-shake');
        setTimeout(() => bubble.classList.remove('pop-shake'), 400);
      }
      window.RBLStorage.recordInteraction('button_personality', 15);
    });
  }

  // --- 18. ROAST GENERATOR ---
  initFeature18_RoastGenerator() {
    const display = document.getElementById('roast-display-text');
    const btn = document.getElementById('generate-roast-btn');
    const copyBtn = document.getElementById('copy-roast-btn');
    if (!btn || !display) return;

    const roasts = [
      'Your code looks like it was written during a hurricane on 2% battery.',
      'You look like the type of person who reboots their Wi-Fi router when Spotify pauses.',
      'Your attention span is shorter than a microwave minute.',
      'You probably write `git push origin main --force` with your eyes closed.',
      'You bring "Ctrl+Z" energy to every conversation.',
      'You are the reason software error dialogs have to state "An unexpected error occurred".',
      'If you were an algorithm, your time complexity would be O(never).'
    ];

    const rollRoast = () => {
      window.RBLAudio.playPop();
      const chosen = roasts[Math.floor(Math.random() * roasts.length)];
      display.textContent = `"${chosen}"`;
      window.RBLStorage.recordInteraction('roast_generator', 15);
      window.RBLAchievements.evaluateAll();
    };

    btn.onclick = rollRoast;

    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(display.textContent).then(() => {
          copyBtn.textContent = 'Roast Copied! 🔥';
          setTimeout(() => copyBtn.textContent = 'Copy Roast', 2000);
        });
      };
    }
  }

  // --- 19. FAKE CAPTCHA ---
  initFeature19_FakeCaptcha() {
    const options = document.querySelectorAll('.captcha-option-btn');
    const resultMsg = document.getElementById('captcha-result-msg');
    if (!options.length) return;

    options.forEach(btn => {
      btn.addEventListener('click', () => {
        const emo = btn.getAttribute('data-emoji');
        window.RBLAudio.playVictory();
        this.fireConfetti(30);

        if (resultMsg) {
          resultMsg.innerHTML = `<span class="text-success">Verification Complete! You are diagnosed as 85% ${emo} and 15% chaotic caffeine.</span>`;
        }
        window.RBLStorage.recordInteraction('fake_captcha', 25);
      });
    });
  }

  // --- 20. CHAOS INTENSITY SELECTOR ---
  initFeature20_ChaosIntensity() {
    const radios = document.querySelectorAll('input[name="chaos-intensity-radio"]');
    if (!radios.length) return;

    const currentLevel = window.RBLStorage.getChaosLevel();
    radios.forEach(r => {
      if (r.value === currentLevel) r.checked = true;
      r.addEventListener('change', (e) => {
        const val = e.target.value;
        window.RBLStorage.setChaosLevel(val);
        window.RBLStorage.savePreferences({ animationIntensity: val });
        document.documentElement.setAttribute('data-animation-intensity', val);
        window.RBLAudio.playVineBoom();
        window.RBLStorage.recordInteraction('chaos_intensity', 30);
      });
    });
  }

  // --- 21. SOUNDBOARD ---
  initFeature21_Soundboard() {
    const pads = document.querySelectorAll('.soundboard-pad');
    pads.forEach(pad => {
      pad.addEventListener('click', () => {
        const soundKey = pad.getAttribute('data-sound');
        switch (soundKey) {
          case 'vine_boom': window.RBLAudio.playVineBoom(); break;
          case 'airhorn': window.RBLAudio.playAirhorn(); break;
          case 'sad_trombone': window.RBLAudio.playSadTrombone(); break;
          case 'quack': window.RBLAudio.playQuack(); break;
          case 'laser': window.RBLAudio.playLaser(); break;
          case 'buzzer': window.RBLAudio.playBuzzer(); break;
        }

        pad.classList.add('pad-pulse');
        setTimeout(() => pad.classList.remove('pad-pulse'), 300);
        window.RBLStorage.recordInteraction('soundboard', 10);
      });
    });
  }

  // --- 22. REACTION-TIME GAME ---
  initFeature22_ReactionGame() {
    const box = document.getElementById('reaction-box');
    const text = document.getElementById('reaction-instruction');
    const result = document.getElementById('reaction-result-display');
    if (!box) return;

    box.addEventListener('click', () => {
      if (this.reactionState === 'idle' || this.reactionState === 'ended') {
        this.reactionState = 'waiting';
        box.className = 'reaction-arena state-waiting';
        if (text) text.textContent = 'Wait for green...';
        if (result) result.textContent = '';

        const delay = Math.random() * 2500 + 1500;
        this.reactionTimeout = setTimeout(() => {
          this.reactionState = 'ready';
          this.reactionStartTime = Date.now();
          box.className = 'reaction-arena state-ready';
          if (text) text.textContent = 'CLICK NOW!!';
          window.RBLAudio.playPop();
        }, delay);

      } else if (this.reactionState === 'waiting') {
        // Clicked too early
        clearTimeout(this.reactionTimeout);
        this.reactionState = 'ended';
        box.className = 'reaction-arena state-early';
        if (text) text.textContent = 'Too early! You jumped the gun!';
        if (result) result.textContent = 'Penalty: Try again!';
        window.RBLAudio.playBuzzer();

      } else if (this.reactionState === 'ready') {
        // Success
        const diff = Date.now() - this.reactionStartTime;
        this.reactionState = 'ended';
        box.className = 'reaction-arena state-success';
        if (text) text.textContent = `${diff} ms!`;

        let rank = 'Human';
        if (diff < 200) rank = 'AimBot Hacker 🤖';
        else if (diff < 250) rank = 'Caffeinated Squirrel ⚡';
        else if (diff < 350) rank = 'Sharp Reflexes 🎯';
        else rank = 'Sleepy Sloth 🦥';

        if (result) result.textContent = `Rank: ${rank} (Click to retry)`;
        window.RBLAudio.playVictory();

        window.RBLStorage.updateStats(stats => {
          if (stats.bestReactionTime === null || diff < stats.bestReactionTime) {
            stats.bestReactionTime = diff;
          }
          return stats;
        });
        window.RBLStorage.recordInteraction('reaction_game', 40, `Reaction trial: ${diff}ms`);
      }
    });
  }

  // --- 23. LUCKY WHEEL ---
  initFeature23_LuckyWheel() {
    const wheelCanvas = document.getElementById('wheel-canvas');
    const spinBtn = document.getElementById('spin-wheel-btn');
    const outcomeText = document.getElementById('wheel-outcome-text');
    if (!wheelCanvas || !spinBtn) return;

    const ctx = wheelCanvas.getContext('2d');
    const slices = [
      { text: '+500 Aura', color: '#ff007f' },
      { text: 'Fake WiFi', color: '#7928ca' },
      { text: 'High-Five', color: '#00f0ff' },
      { text: 'Emotional Dmg', color: '#ff4d4d' },
      { text: 'Confetti Rain', color: '#ffe600' },
      { text: 'Spin Again', color: '#00ff66' },
      { text: 'Loss of Pride', color: '#ff9900' },
      { text: 'Secret Clue', color: '#b800ff' }
    ];

    const numSlices = slices.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    const drawWheel = (angle) => {
      ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
      const centerX = wheelCanvas.width / 2;
      const centerY = wheelCanvas.height / 2;
      const radius = centerX - 10;

      slices.forEach((slice, i) => {
        const start = angle + i * sliceAngle;
        const end = start + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, start, end);
        ctx.fillStyle = slice.color;
        ctx.fill();
        ctx.strokeStyle = '#05070f';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(start + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#05070f';
        ctx.font = 'bold 12px "Space Grotesk", sans-serif';
        ctx.fillText(slice.text, radius - 15, 4);
        ctx.restore();
      });

      // Center peg
      ctx.beginPath();
      ctx.arc(centerX, centerY, 16, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.stroke();
    };

    drawWheel(this.wheelRotation);

    spinBtn.addEventListener('click', () => {
      if (this.isSpinning) return;
      this.isSpinning = true;
      spinBtn.disabled = true;
      if (outcomeText) outcomeText.textContent = 'Spinning into the unknown...';

      const spinRounds = 4 + Math.random() * 4;
      const extraAngle = Math.random() * Math.PI * 2;
      const targetAngle = this.wheelRotation + spinRounds * Math.PI * 2 + extraAngle;
      const startTime = performance.now();
      const duration = 3800;

      const animateWheel = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        // Ease-out cubic
        const ease = 1 - Math.pow(1 - t, 3);
        const currentAngle = this.wheelRotation + (targetAngle - this.wheelRotation) * ease;

        drawWheel(currentAngle);

        if (t < 1) {
          requestAnimationFrame(animateWheel);
        } else {
          this.wheelRotation = targetAngle % (Math.PI * 2);
          this.isSpinning = false;
          spinBtn.disabled = false;

          // Pointer is at the top (3 * PI / 2 or -PI / 2)
          const normalized = (2 * Math.PI - (this.wheelRotation % (2 * Math.PI)) + (3 * Math.PI / 2)) % (2 * Math.PI);
          const winningIdx = Math.floor(normalized / sliceAngle) % numSlices;
          const winner = slices[winningIdx];

          if (outcomeText) {
            outcomeText.textContent = `Result: ${winner.text}! 🎡`;
          }

          if (winner.text === 'Confetti Rain') {
            this.fireConfetti(60);
          }
          window.RBLAudio.playVictory();
          window.RBLStorage.recordInteraction('lucky_wheel', 30);
        }
      };

      requestAnimationFrame(animateWheel);
    });
  }

  // --- 24. CONFETTI CELEBRATION ---
  initFeature24_Confetti() {
    const btn = document.getElementById('manual-confetti-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        this.fireConfetti(50);
        window.RBLAudio.playVictory();
        window.RBLStorage.recordInteraction('confetti_button', 10);
      });
    }
  }

  // --- 25. SOUND REACTION VISUALIZER ---
  initFeature25_SoundReactionVisualizer() {
    const bars = document.querySelectorAll('.sound-eq-bar');
    window.addEventListener('rbl:soundPlayed', () => {
      bars.forEach(bar => {
        const h = Math.floor(Math.random() * 70 + 30);
        bar.style.height = `${h}%`;
        setTimeout(() => {
          bar.style.height = '15%';
        }, 350);
      });
    });
  }

  // --- 26. KEYBOARD CHEAT CODES ---
  initFeature26_KeyboardCheatCodes() {
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIdx = 0;
    let keyBuffer = '';

    window.addEventListener('keydown', (e) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      // Konami Check
      if (e.key === konamiSequence[konamiIdx]) {
        konamiIdx += 1;
        if (konamiIdx === konamiSequence.length) {
          konamiIdx = 0;
          this.triggerKonamiEasterEgg();
        }
      } else {
        konamiIdx = 0;
      }

      // Rage sequence check
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 10) keyBuffer = keyBuffer.slice(-10);
      if (keyBuffer.endsWith('rage')) {
        this.triggerRageDisco();
      }
    });
  }

  triggerKonamiEasterEgg() {
    window.RBLAudio.playAirhorn();
    this.fireConfetti(100);
    document.body.classList.add('super-saiyan-glow');

    window.RBLStorage.updateStats(stats => {
      stats.cheatCodesEntered = (stats.cheatCodesEntered || 0) + 1;
      return stats;
    });
    window.RBLStorage.recordDiscovery('konami_code');
    window.RBLStorage.recordInteraction('cheat_code', 100, 'Unlocked Konami Code!');

    setTimeout(() => {
      document.body.classList.remove('super-saiyan-glow');
    }, 4500);
  }

  triggerRageDisco() {
    window.RBLAudio.playVineBoom();
    document.body.classList.add('disco-party-mode');
    setTimeout(() => {
      document.body.classList.remove('disco-party-mode');
    }, 4000);
  }

  // --- 27. MINI CHAOS CHALLENGE ---
  initFeature27_MiniChaosChallenge() {
    const startBtn = document.getElementById('start-challenge-btn');
    const arena = document.getElementById('challenge-arena');
    const scoreVal = document.getElementById('challenge-score');
    const timerVal = document.getElementById('challenge-timer');

    if (!startBtn || !arena) return;

    let score = 0;
    let timeLeft = 15;
    let gameInterval = null;

    startBtn.onclick = () => {
      score = 0;
      timeLeft = 15;
      scoreVal.textContent = '0';
      timerVal.textContent = '15s';
      startBtn.disabled = true;
      arena.innerHTML = '';
      window.RBLAudio.playPop();

      const spawnTarget = () => {
        if (timeLeft <= 0) return;
        const target = document.createElement('div');
        target.className = 'challenge-target';
        target.textContent = ['😈', '💣', '🔥', '🤡', '⚡'][Math.floor(Math.random() * 5)];

        const x = Math.random() * (arena.clientWidth - 50);
        const y = Math.random() * (arena.clientHeight - 50);
        target.style.left = `${x}px`;
        target.style.top = `${y}px`;

        target.onclick = () => {
          score += 10;
          scoreVal.textContent = score;
          window.RBLAudio.playPop();
          target.remove();
          spawnTarget();
        };

        arena.appendChild(target);
        setTimeout(() => {
          if (arena.contains(target)) target.remove();
        }, 1600);
      };

      spawnTarget();
      spawnTarget();

      gameInterval = setInterval(() => {
        timeLeft -= 1;
        timerVal.textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
          clearInterval(gameInterval);
          startBtn.disabled = false;
          arena.innerHTML = `<div class="challenge-game-over">Time's Up! Final Score: ${score} 🏆</div>`;
          window.RBLAudio.playVictory();
          window.RBLStorage.updateStats(stats => {
            stats.chaosChallengesWon = (stats.chaosChallengesWon || 0) + 1;
            return stats;
          });
          window.RBLStorage.recordInteraction('chaos_challenge', score, `Mini Chaos Challenge score: ${score}`);
        }
      }, 1000);
    };
  }

  // --- 28. SECRET DISCOVERY SYSTEM ---
  initFeature28_SecretDiscoverySystem() {
    const counter = document.getElementById('secrets-found-counter');
    const brandLogo = document.getElementById('brand-logo-trigger');
    const tinyTroll = document.getElementById('hidden-footer-troll');

    const updateDisplay = () => {
      const disc = window.RBLStorage.getDiscoveries();
      if (counter) counter.textContent = `${disc.length} / 6 Discovered`;
    };

    updateDisplay();
    window.addEventListener('rbl:discoveryFound', updateDisplay);

    if (brandLogo) {
      brandLogo.onclick = () => {
        this.secretClicksOnLogo += 1;
        if (this.secretClicksOnLogo >= 5) {
          window.RBLStorage.recordDiscovery('logo_spam');
          window.RBLAudio.playVictory();
          this.fireConfetti(35);
        }
      };
    }

    if (tinyTroll) {
      tinyTroll.onclick = () => {
        window.RBLStorage.recordDiscovery('footer_troll');
        window.RBLAudio.playAirhorn();
      };
    }
  }

  // --- 29. FINAL CHAOS BUTTON ---
  initFeature29_FinalChaosButton() {
    const nukeBtn = document.getElementById('nuke-chaos-btn');
    const abortBtn = document.getElementById('abort-chaos-btn');
    const overlay = document.getElementById('chaos-panic-overlay');

    if (!nukeBtn) return;
    let panicTimer = null;

    nukeBtn.onclick = () => {
      window.RBLAudio.playSiren(3.5);
      if (overlay) overlay.classList.add('is-active');
      document.body.classList.add('screen-tremor');

      window.RBLStorage.recordInteraction('final_chaos_nuke', 150, 'TRIGGERED NUCLEAR CHAOS MODE!');

      panicTimer = setTimeout(() => {
        if (overlay) overlay.classList.remove('is-active');
        document.body.classList.remove('screen-tremor');
        this.fireConfetti(80);
      }, 3800);
    };

    if (abortBtn) {
      abortBtn.onclick = () => {
        clearTimeout(panicTimer);
        if (overlay) overlay.classList.remove('is-active');
        document.body.classList.remove('screen-tremor');
        window.RBLAudio.playPop();
      };
    }
  }

  // --- 30. FINAL REPORT GENERATOR ---
  initFeature30_FinalReportGenerator() {
    const btn = document.getElementById('generate-report-btn');
    const modal = document.getElementById('final-report-modal');
    const closeBtn = document.getElementById('close-report-modal-btn');
    const copyBtn = document.getElementById('copy-report-btn');

    if (!btn || !modal) return;

    btn.onclick = () => {
      const stats = window.RBLStorage.getStats();
      const unlocked = window.RBLStorage.getUnlockedAchievements();
      const discoveries = window.RBLStorage.getDiscoveries();

      document.getElementById('report-stat-chaos').textContent = stats.chaosScore;
      document.getElementById('report-stat-interactions').textContent = stats.totalInteractions;
      document.getElementById('report-stat-achievements').textContent = `${unlocked.length} / ${window.RBLAchievements.getTotalCount()}`;
      document.getElementById('report-stat-features').textContent = `${stats.featuresUsed.length} / 30`;
      document.getElementById('report-stat-reaction').textContent = stats.bestReactionTime ? `${stats.bestReactionTime} ms` : 'N/A';

      modal.classList.add('is-open');
      window.RBLAudio.playVictory();
      this.fireConfetti(50);
      window.RBLStorage.recordInteraction('final_report', 50, 'Generated Final Chaos Diagnostic Report');
    };

    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('is-open');

    if (copyBtn) {
      copyBtn.onclick = () => {
        const stats = window.RBLStorage.getStats();
        const unlocked = window.RBLStorage.getUnlockedAchievements();
        const text = `🏆 RAGEBAIT LAB - CHAOS DIAGNOSTIC REPORT
Chaos Score: ${stats.chaosScore}
Total Interactions: ${stats.totalInteractions}
Features Tested: ${stats.featuresUsed.length} / 30
Achievements: ${unlocked.length} / ${window.RBLAchievements.getTotalCount()}
Best Reflex Time: ${stats.bestReactionTime || 'N/A'} ms
Aura Verdict: Certified Digital Menace`;

        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = 'Report Copied to Clipboard! 📋';
          setTimeout(() => copyBtn.textContent = 'Copy Report Summary', 2000);
        });
      };
    }
  }
}

// Global features singleton
window.RBLFeatures = new FeaturesEngine();
