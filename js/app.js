/**
 * RageBait Lab - Main Application Controller
 * Coordinates page initialization, global HUD, navigation, session time tracking, and panic buttons.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Apply initial theme and animation preferences
  const prefs = window.RBLStorage.getPreferences();
  document.documentElement.setAttribute('data-theme', prefs.theme);
  document.documentElement.setAttribute('data-animation-intensity', prefs.animationIntensity);

  // Initialize features if on main experience page
  if (window.RBLFeatures && document.getElementById('tilt-volume-slider')) {
    window.RBLFeatures.initAll();
  }

  // Initialize achievements showcase if present
  if (document.getElementById('home-trophy-showcase')) {
    window.RBLAchievements.renderShowcase('home-trophy-showcase');
  }

  // Setup Global HUD Sync
  setupGlobalHUD();

  // Setup Navigation Bar controls
  setupNavigation();

  // Session Time Tracker (every 5 seconds)
  setInterval(() => {
    window.RBLStorage.updateStats(stats => {
      stats.timeSpentSeconds = (stats.timeSpentSeconds || 0) + 5;
      return stats;
    });
  }, 5000);

  // Global Panic / Stop Effects Button
  const globalStopBtn = document.getElementById('global-stop-effects-btn');
  if (globalStopBtn) {
    globalStopBtn.addEventListener('click', () => {
      document.body.classList.remove('cursed-mode', 'screen-tremor', 'super-saiyan-glow', 'disco-party-mode');
      const panicOverlay = document.getElementById('chaos-panic-overlay');
      if (panicOverlay) panicOverlay.classList.remove('is-active');
      window.RBLAudio.playPop();
    });
  }
});

function setupGlobalHUD() {
  const chaosScoreEls = document.querySelectorAll('.hud-chaos-score');
  const featuresCountEls = document.querySelectorAll('.hud-features-count');
  const achievementsCountEls = document.querySelectorAll('.hud-achievements-count');
  const userAvatarBadge = document.getElementById('nav-user-avatar-badge');
  const userLoginText = document.getElementById('nav-login-btn-text');

  const syncHUD = () => {
    const stats = window.RBLStorage.getStats();
    const unlocked = window.RBLStorage.getUnlockedAchievements();
    const user = window.RBLAuth.getCurrentUser();

    chaosScoreEls.forEach(el => el.textContent = (stats.chaosScore || 0).toLocaleString());
    featuresCountEls.forEach(el => el.textContent = `${(stats.featuresUsed || []).length} / 30`);
    achievementsCountEls.forEach(el => el.textContent = `${unlocked.length} / ${window.RBLAchievements.getTotalCount()}`);

    if (userAvatarBadge && userLoginText) {
      if (user) {
        userAvatarBadge.textContent = user.avatar || '😈';
        userLoginText.textContent = user.displayName || `@${user.username}`;
      } else {
        userAvatarBadge.textContent = '👤';
        userLoginText.textContent = 'Login / Signup';
      }
    }
  };

  syncHUD();
  window.addEventListener('rbl:statsUpdated', syncHUD);
  window.addEventListener('rbl:achievementUnlocked', syncHUD);
  window.addEventListener('rbl:authStateChanged', syncHUD);
}

function setupNavigation() {
  // Master Sound Mute Toggle in Nav
  const navMuteBtn = document.getElementById('nav-audio-toggle');
  if (navMuteBtn) {
    const prefs = window.RBLStorage.getPreferences();
    navMuteBtn.innerHTML = prefs.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
    navMuteBtn.setAttribute('aria-pressed', prefs.soundEnabled ? 'true' : 'false');

    navMuteBtn.addEventListener('click', () => {
      const isMuted = window.RBLAudio.toggleMute();
      navMuteBtn.innerHTML = !isMuted ? '🔊 Sound: ON' : '🔇 Sound: OFF';
      navMuteBtn.setAttribute('aria-pressed', !isMuted ? 'true' : 'false');
    });

    window.addEventListener('rbl:audioMuteToggled', (e) => {
      const muted = e.detail.isMuted;
      navMuteBtn.innerHTML = !muted ? '🔊 Sound: ON' : '🔇 Sound: OFF';
      navMuteBtn.setAttribute('aria-pressed', !muted ? 'true' : 'false');
    });
  }

  // Theme Toggle in Nav
  const navThemeBtn = document.getElementById('nav-theme-toggle');
  if (navThemeBtn) {
    navThemeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      window.RBLStorage.savePreferences({ theme: next });
      window.RBLAudio.playPop();
    });
  }

  // Mobile menu hamburger
  const hamburger = document.getElementById('nav-hamburger-btn');
  const mobileMenu = document.getElementById('nav-mobile-drawer');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
}
