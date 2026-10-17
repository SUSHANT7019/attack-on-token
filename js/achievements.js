/**
 * RageBait Lab - Achievements System
 * Tracks unlock conditions, renders trophy showcases, and fires celebratory toasts.
 */

const ACHIEVEMENTS_LIST = [
  {
    id: 'certified_menace',
    title: 'Certified Menace',
    desc: 'Amass at least 500 Chaos Score in the laboratory.',
    icon: '🔥',
    category: 'Chaos',
    points: 100,
    check: (stats) => (stats.chaosScore || 0) >= 500
  },
  {
    id: 'button_predator',
    title: 'Button Predator',
    desc: 'Chase down and successfully click the evasive Coward Button.',
    icon: '🎯',
    category: 'Agility',
    points: 75,
    check: (stats) => (stats.cowardButtonCatches || 0) >= 1
  },
  {
    id: 'trust_issues',
    title: 'Trust Issues',
    desc: 'Flick the contradictory Lying Toggle at least 5 times.',
    icon: '🤥',
    category: 'Patience',
    points: 50,
    check: (stats) => (stats.lyingToggleClicks || 0) >= 5
  },
  {
    id: 'secret_hunter',
    title: 'Secret Hunter',
    desc: 'Uncover at least 2 hidden Easter eggs in the Secret Discovery System.',
    icon: '🕵️',
    category: 'Exploration',
    points: 80,
    check: (stats, discoveries) => (discoveries || []).length >= 2
  },
  {
    id: 'soundboard_addict',
    title: 'Soundboard Addict',
    desc: 'Blast 10 comedic sound effects from the meme soundboard.',
    icon: '🔊',
    category: 'Audio',
    points: 40,
    check: (stats) => (stats.soundboardPlays || 0) >= 10
  },
  {
    id: 'chaos_enthusiast',
    title: 'Chaos Enthusiast',
    desc: 'Dial the laboratory chaos intensity selector all the way to Full Menace.',
    icon: '⚡',
    category: 'Chaos',
    points: 50,
    check: () => window.RBLStorage.getChaosLevel() === 'full-menace'
  },
  {
    id: 'reaction_master',
    title: 'Reaction Master',
    desc: 'Achieve a reaction time under 250 milliseconds in the reflex trial.',
    icon: '⚡',
    category: 'Reflexes',
    points: 90,
    check: (stats) => stats.bestReactionTime !== null && stats.bestReactionTime < 250
  },
  {
    id: 'gravity_breaker',
    title: 'Gravity Breaker',
    desc: 'Disrupt physics by activating Gravity Mode.',
    icon: '🪐',
    category: 'Physics',
    points: 40,
    check: (stats) => (stats.featuresUsed || []).includes('gravity_mode')
  },
  {
    id: 'popup_survivor',
    title: 'Popup Survivor',
    desc: 'Survive all 3 relentless phases of the in-page Popup Boss Fight.',
    icon: '🛡️',
    category: 'Endurance',
    points: 100,
    check: (stats) => (stats.popupsSurvived || 0) >= 3
  },
  {
    id: 'theme_jumper',
    title: 'Theme Jumper',
    desc: 'Switch between Cursed Theme and Dramatic Theme.',
    icon: '🎭',
    category: 'Aesthetic',
    points: 60,
    check: (stats) => (stats.featuresUsed || []).includes('cursed_theme') && (stats.featuresUsed || []).includes('dramatic_theme')
  },
  {
    id: 'terminal_hacker',
    title: 'Terminal Hacker',
    desc: 'Execute commands or trigger diagnostic sequences in the Fake Terminal.',
    icon: '💻',
    category: 'Tech',
    points: 50,
    check: (stats) => (stats.terminalCommandsRun || 0) >= 2
  },
  {
    id: 'chaos_legend',
    title: 'Chaos Legend',
    desc: 'Unlock at least 8 achievements and generate your official Chaos Report.',
    icon: '👑',
    category: 'Mastery',
    points: 250,
    check: (stats, discoveries, unlockedList) => (unlockedList || []).length >= 8 && (stats.featuresUsed || []).includes('final_report')
  },
  {
    id: 'konami_coder',
    title: 'Old School Hacker',
    desc: 'Enter the legendary Konami cheat code on your keyboard.',
    icon: '🎮',
    category: 'Secret',
    points: 80,
    check: (stats) => (stats.cheatCodesEntered || 0) >= 1
  },
  {
    id: 'roast_aficionado',
    title: 'Self-Deprecation Pro',
    desc: 'Generate 3 harmless roasts from the Roast Generator.',
    icon: '🍗',
    category: 'Humor',
    points: 35,
    check: (stats) => (stats.featuresUsed || []).filter(f => f === 'roast_generator').length >= 1 && (stats.totalInteractions || 0) >= 15
  }
];

class AchievementManager {
  constructor() {
    this.achievements = ACHIEVEMENTS_LIST;
    this.toastContainer = null;
    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('rbl:statsUpdated', () => this.evaluateAll());
    window.addEventListener('rbl:discoveryFound', () => this.evaluateAll());
    window.addEventListener('rbl:chaosLevelChanged', () => this.evaluateAll());
    window.addEventListener('rbl:achievementUnlocked', (e) => {
      const ach = this.getById(e.detail);
      if (ach) {
        this.showAchievementToast(ach);
      }
    });
  }

  getById(id) {
    return this.achievements.find(a => a.id === id);
  }

  getAll() {
    const unlocked = window.RBLStorage.getUnlockedAchievements();
    return this.achievements.map(a => ({
      ...a,
      unlocked: unlocked.includes(a.id)
    }));
  }

  getUnlockedCount() {
    return window.RBLStorage.getUnlockedAchievements().length;
  }

  getTotalCount() {
    return this.achievements.length;
  }

  evaluateAll() {
    const stats = window.RBLStorage.getStats();
    const discoveries = window.RBLStorage.getDiscoveries();
    const unlocked = window.RBLStorage.getUnlockedAchievements();

    this.achievements.forEach(ach => {
      if (!unlocked.includes(ach.id)) {
        try {
          if (ach.check(stats, discoveries, unlocked)) {
            window.RBLStorage.unlockAchievement(ach.id);
          }
        } catch (e) {
          console.error(`Error evaluating achievement ${ach.id}:`, e);
        }
      }
    });
  }

  createToastContainer() {
    if (this.toastContainer && document.body.contains(this.toastContainer)) return;
    this.toastContainer = document.createElement('div');
    this.toastContainer.id = 'rbl-toast-container';
    this.toastContainer.className = 'rbl-toast-container';
    this.toastContainer.setAttribute('role', 'region');
    this.toastContainer.setAttribute('aria-label', 'Achievement notifications');
    document.body.appendChild(this.toastContainer);
  }

  showAchievementToast(ach) {
    this.createToastContainer();

    // Play victory sound if sound is on
    if (window.RBLAudio) {
      window.RBLAudio.playVictory();
    }

    const toast = document.createElement('div');
    toast.className = 'rbl-achievement-toast';
    toast.innerHTML = `
      <div class="toast-glow"></div>
      <div class="toast-icon-badge">${ach.icon}</div>
      <div class="toast-content">
        <span class="toast-tag">ACHIEVEMENT UNLOCKED!</span>
        <h4 class="toast-title">${ach.title}</h4>
        <p class="toast-desc">${ach.desc}</p>
        <span class="toast-points">+${ach.points} Chaos Pts</span>
      </div>
      <button class="toast-close-btn" aria-label="Dismiss notification">&times;</button>
    `;

    toast.querySelector('.toast-close-btn').addEventListener('click', () => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    });

    this.toastContainer.appendChild(toast);

    // Auto dismiss after 5.5s
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
      }
    }, 5500);
  }

  renderShowcase(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const list = this.getAll();
    const unlockedCount = list.filter(a => a.unlocked).length;

    container.innerHTML = `
      <div class="trophy-summary-bar">
        <div class="trophy-count-pill">
          <span class="trophy-star">🏆</span>
          <span><strong>${unlockedCount}</strong> / ${list.length} Unlocked</span>
        </div>
        <div class="trophy-progress-track">
          <div class="trophy-progress-fill" style="width: ${(unlockedCount / list.length) * 100}%"></div>
        </div>
      </div>
      <div class="trophy-grid">
        ${list.map(a => `
          <div class="trophy-card ${a.unlocked ? 'is-unlocked' : 'is-locked'}" data-id="${a.id}">
            <div class="trophy-icon-wrap">
              <span class="trophy-icon">${a.icon}</span>
              ${a.unlocked ? '<span class="trophy-status-badge">UNLOCKED</span>' : '<span class="trophy-status-badge locked">LOCKED</span>'}
            </div>
            <div class="trophy-info">
              <div class="trophy-header-row">
                <h4 class="trophy-title">${a.title}</h4>
                <span class="trophy-pts">${a.points} pts</span>
              </div>
              <p class="trophy-desc">${a.desc}</p>
              <div class="trophy-cat-tag">${a.category}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// Global singleton
window.RBLAchievements = new AchievementManager();
