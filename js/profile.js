/**
 * RageBait Lab - Profile Controller
 * Manages the user profile dashboard, avatar customization, stats visualization,
 * preference adjustments, and edit modals on account.html.
 */

const AVATAR_OPTIONS = ['😈', '🤡', '🤖', '👾', '🔥', '💀', '🗿', '🐱‍👤', '👀', '🧙‍♂️'];
const PERSONALITY_CLASSES = [
  'Agent of Entropy',
  'Keyboard Smasher',
  'Meme Connoisseur',
  'Troll Architect',
  'Pop-up Survivor',
  'Absolute Menace'
];

class ProfileController {
  constructor() {
    this.currentUser = null;
    this.stats = null;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('rbl:authStateChanged', (e) => {
      this.currentUser = e.detail.user;
      this.render();
    });

    window.addEventListener('rbl:statsUpdated', () => {
      if (this.currentUser) {
        this.renderStats();
      }
    });

    window.addEventListener('rbl:activityLogged', () => {
      if (this.currentUser) {
        this.renderActivityLog();
      }
    });
  }

  calculateProfileCompletion(user) {
    let score = 0;
    if (user.displayName) score += 20;
    if (user.username) score += 20;
    if (user.bio && user.bio.length > 5) score += 20;
    if (user.avatar) score += 20;
    if (user.personality) score += 20;
    return score;
  }

  render() {
    const profileView = document.getElementById('account-profile-view');
    const authView = document.getElementById('account-auth-view');

    if (!profileView || !authView) return;

    this.currentUser = window.RBLAuth.getCurrentUser();

    if (!this.currentUser) {
      profileView.classList.add('hidden');
      authView.classList.remove('hidden');
      return;
    }

    authView.classList.add('hidden');
    profileView.classList.remove('hidden');

    this.renderHeader();
    this.renderStats();
    this.renderPreferences();
    this.renderTrophies();
    this.renderActivityLog();
    this.setupEditModal();
  }

  renderHeader() {
    const user = this.currentUser;
    const completion = this.calculateProfileCompletion(user);

    const avatarEl = document.getElementById('profile-avatar-display');
    const nameEl = document.getElementById('profile-name-display');
    const userEl = document.getElementById('profile-username-display');
    const bioEl = document.getElementById('profile-bio-display');
    const classEl = document.getElementById('profile-class-display');
    const compBar = document.getElementById('profile-completion-bar');
    const compText = document.getElementById('profile-completion-text');

    if (avatarEl) avatarEl.textContent = user.avatar || '😈';
    if (nameEl) nameEl.textContent = user.displayName || 'Anonymous Menace';
    if (userEl) userEl.textContent = `@${user.username || 'user'}`;
    if (bioEl) bioEl.textContent = user.bio || 'No bio provided. Living in chaos.';
    if (classEl) classEl.textContent = user.personality || 'Agent of Entropy';
    if (compBar) compBar.style.width = `${completion}%`;
    if (compText) compText.textContent = `${completion}% Completed`;
  }

  renderStats() {
    const stats = window.RBLStorage.getStats();
    const unlocked = window.RBLStorage.getUnlockedAchievements();
    const discoveries = window.RBLStorage.getDiscoveries();

    const scoreEl = document.getElementById('stat-chaos-score');
    const interactEl = document.getElementById('stat-interactions');
    const featuresEl = document.getElementById('stat-features');
    const achieveEl = document.getElementById('stat-achievements');
    const reactionEl = document.getElementById('stat-reaction-time');
    const secretsEl = document.getElementById('stat-secrets');

    if (scoreEl) scoreEl.textContent = stats.chaosScore.toLocaleString();
    if (interactEl) interactEl.textContent = stats.totalInteractions.toLocaleString();
    if (featuresEl) featuresEl.textContent = `${stats.featuresUsed.length} / 30`;
    if (achieveEl) achieveEl.textContent = `${unlocked.length} / ${window.RBLAchievements.getTotalCount()}`;
    if (reactionEl) {
      reactionEl.textContent = stats.bestReactionTime !== null ? `${stats.bestReactionTime} ms` : 'Unranked';
    }
    if (secretsEl) secretsEl.textContent = `${discoveries.length} / 6`;
  }

  renderPreferences() {
    const prefs = window.RBLStorage.getPreferences();

    const soundToggle = document.getElementById('pref-sound-toggle');
    const volumeSlider = document.getElementById('pref-volume-slider');
    const animSelect = document.getElementById('pref-anim-intensity');
    const themeSelect = document.getElementById('pref-theme-select');

    if (soundToggle) {
      soundToggle.checked = prefs.soundEnabled;
      soundToggle.onchange = (e) => {
        window.RBLAudio.setMuted(!e.target.checked);
      };
    }

    if (volumeSlider) {
      volumeSlider.value = prefs.volume;
      volumeSlider.oninput = (e) => {
        window.RBLAudio.setVolume(e.target.value);
      };
    }

    if (animSelect) {
      animSelect.value = prefs.animationIntensity;
      animSelect.onchange = (e) => {
        window.RBLStorage.savePreferences({ animationIntensity: e.target.value });
        window.RBLStorage.setChaosLevel(e.target.value);
        document.documentElement.setAttribute('data-animation-intensity', e.target.value);
      };
    }

    if (themeSelect) {
      themeSelect.value = prefs.theme;
      themeSelect.onchange = (e) => {
        window.RBLStorage.savePreferences({ theme: e.target.value });
        document.documentElement.setAttribute('data-theme', e.target.value);
      };
    }
  }

  renderTrophies() {
    window.RBLAchievements.renderShowcase('profile-trophy-showcase');
  }

  renderActivityLog() {
    const logList = document.getElementById('profile-activity-list');
    if (!logList) return;

    const activities = window.RBLStorage.getActivityLog();
    if (!activities || activities.length === 0) {
      logList.innerHTML = `<li class="activity-empty-state">No recent activity detected. Explore the lab!</li>`;
      return;
    }

    logList.innerHTML = activities.slice(0, 8).map(act => {
      const timeStr = new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `
        <li class="activity-item activity-type-${act.type}">
          <span class="activity-time">${timeStr}</span>
          <span class="activity-text">${this.escapeHTML(act.text)}</span>
        </li>
      `;
    }).join('');
  }

  setupEditModal() {
    const modal = document.getElementById('edit-profile-modal');
    const openBtn = document.getElementById('open-edit-profile-btn');
    const closeBtn = document.getElementById('close-edit-modal-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const form = document.getElementById('edit-profile-form');
    const avatarGrid = document.getElementById('edit-avatar-grid');
    const resetBtn = document.getElementById('reset-edit-btn');

    if (!modal || !openBtn || !form) return;

    let selectedAvatar = this.currentUser.avatar || '😈';

    const renderAvatarGrid = () => {
      if (!avatarGrid) return;
      avatarGrid.innerHTML = AVATAR_OPTIONS.map(av => `
        <button type="button" class="avatar-option-btn ${av === selectedAvatar ? 'is-selected' : ''}" data-avatar="${av}">
          ${av}
        </button>
      `).join('');

      avatarGrid.querySelectorAll('.avatar-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedAvatar = btn.getAttribute('data-avatar');
          renderAvatarGrid();
        });
      });
    };

    const populateForm = () => {
      const nameInput = document.getElementById('edit-display-name');
      const userInput = document.getElementById('edit-username');
      const bioInput = document.getElementById('edit-bio');
      const classSelect = document.getElementById('edit-personality-class');

      if (nameInput) nameInput.value = this.currentUser.displayName || '';
      if (userInput) userInput.value = this.currentUser.username || '';
      if (bioInput) bioInput.value = this.currentUser.bio || '';
      if (classSelect) classSelect.value = this.currentUser.personality || PERSONALITY_CLASSES[0];
      selectedAvatar = this.currentUser.avatar || '😈';
      renderAvatarGrid();
    };

    openBtn.onclick = () => {
      populateForm();
      modal.classList.add('is-open');
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
    };

    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;

    if (resetBtn) {
      resetBtn.onclick = () => {
        populateForm();
      };
    }

    form.onsubmit = async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('edit-display-name').value;
      const userInput = document.getElementById('edit-username').value;
      const bioInput = document.getElementById('edit-bio').value;
      const classSelect = document.getElementById('edit-personality-class').value;

      try {
        const updated = await window.RBLAuth.updateProfile(this.currentUser.id, {
          displayName: nameInput,
          username: userInput,
          bio: bioInput,
          personality: classSelect,
          avatar: selectedAvatar
        });

        this.currentUser = updated;
        closeModal();
        this.render();

        if (window.RBLAudio) window.RBLAudio.playVictory();
      } catch (err) {
        alert(err.message);
      }
    };
  }

  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

// Global profile controller singleton
window.RBLProfile = new ProfileController();
