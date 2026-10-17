/**
 * RageBait Lab - Storage & State Management
 * Handles persistent user progress, session statistics, preferences, and activity logs.
 */

const STORAGE_KEYS = {
  USER_SESSION: 'rbl_user_session',
  USER_ACCOUNTS: 'rbl_user_accounts',
  PREFERENCES: 'rbl_preferences',
  STATS: 'rbl_session_stats',
  ACHIEVEMENTS: 'rbl_achievements',
  DISCOVERIES: 'rbl_discoveries',
  ACTIVITY_LOG: 'rbl_activity_log',
  CHAOS_LEVEL: 'rbl_chaos_level'
};

const DEFAULT_PREFERENCES = {
  soundEnabled: false,
  volume: 0.7,
  animationIntensity: 'unhinged', // 'chill', 'unhinged', 'full-menace'
  theme: 'dark', // 'dark', 'light', 'cyber', 'cursed'
  reducedMotion: false
};

const DEFAULT_STATS = {
  chaosScore: 0,
  totalInteractions: 0,
  featuresUsed: [],
  bestReactionTime: null,
  cowardButtonCatches: 0,
  popupsSurvived: 0,
  lyingToggleClicks: 0,
  soundboardPlays: 0,
  cheatCodesEntered: 0,
  timeSpentSeconds: 0,
  terminalCommandsRun: 0,
  chaosChallengesWon: 0,
  lastActive: Date.now()
};

class StorageManager {
  constructor() {
    this.isStorageAvailable = this.checkStorageAvailability();
    this.memoryFallback = new Map();
  }

  checkStorageAvailability() {
    try {
      const testKey = '__rbl_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('LocalStorage is not available. Using in-memory fallback.', e);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    if (!this.isStorageAvailable) {
      return this.memoryFallback.has(key) ? this.memoryFallback.get(key) : defaultValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return defaultValue;
    }
  }

  setItem(key, value) {
    if (!this.isStorageAvailable) {
      this.memoryFallback.set(key, value);
      return true;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing ${key} to storage:`, e);
      return false;
    }
  }

  removeItem(key) {
    if (!this.isStorageAvailable) {
      this.memoryFallback.delete(key);
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing ${key} from storage:`, e);
    }
  }

  // Preferences
  getPreferences() {
    const saved = this.getItem(STORAGE_KEYS.PREFERENCES, {});
    return { ...DEFAULT_PREFERENCES, ...saved };
  }

  savePreferences(prefs) {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    this.setItem(STORAGE_KEYS.PREFERENCES, updated);
    return updated;
  }

  // Session Stats
  getStats() {
    const saved = this.getItem(STORAGE_KEYS.STATS, {});
    return { ...DEFAULT_STATS, ...saved };
  }

  updateStats(updaterFn) {
    const current = this.getStats();
    const updated = updaterFn(current);
    this.setItem(STORAGE_KEYS.STATS, updated);
    window.dispatchEvent(new CustomEvent('rbl:statsUpdated', { detail: updated }));
    return updated;
  }

  recordInteraction(featureId, chaosPoints = 10, activityNote = null) {
    const updated = this.updateStats(stats => {
      stats.totalInteractions += 1;
      stats.chaosScore += chaosPoints;
      if (featureId && !stats.featuresUsed.includes(featureId)) {
        stats.featuresUsed.push(featureId);
      }
      stats.lastActive = Date.now();
      return stats;
    });

    if (activityNote) {
      this.addActivity(activityNote);
    }

    return updated;
  }

  // Activity Log (capped at 50 items)
  getActivityLog() {
    return this.getItem(STORAGE_KEYS.ACTIVITY_LOG, [
      { id: 1, text: 'Landed in RageBait Lab', time: Date.now(), type: 'entry' }
    ]);
  }

  addActivity(text, type = 'action') {
    const logs = this.getActivityLog();
    const newEntry = {
      id: Date.now() + Math.random(),
      text,
      time: Date.now(),
      type
    };
    logs.unshift(newEntry);
    if (logs.length > 50) logs.pop();
    this.setItem(STORAGE_KEYS.ACTIVITY_LOG, logs);
    window.dispatchEvent(new CustomEvent('rbl:activityLogged', { detail: newEntry }));
  }

  // Achievements Progress
  getUnlockedAchievements() {
    return this.getItem(STORAGE_KEYS.ACHIEVEMENTS, []);
  }

  unlockAchievement(achievementId) {
    const current = this.getUnlockedAchievements();
    if (!current.includes(achievementId)) {
      current.push(achievementId);
      this.setItem(STORAGE_KEYS.ACHIEVEMENTS, current);
      this.recordInteraction('achievement_unlocked', 50, `Unlocked achievement: ${achievementId}`);
      window.dispatchEvent(new CustomEvent('rbl:achievementUnlocked', { detail: achievementId }));
      return true;
    }
    return false;
  }

  // Secret Discovery Tracker
  getDiscoveries() {
    return this.getItem(STORAGE_KEYS.DISCOVERIES, []);
  }

  recordDiscovery(secretKey) {
    const current = this.getDiscoveries();
    if (!current.includes(secretKey)) {
      current.push(secretKey);
      this.setItem(STORAGE_KEYS.DISCOVERIES, current);
      this.recordInteraction('secret_discovered', 75, `Discovered secret: ${secretKey}`);
      window.dispatchEvent(new CustomEvent('rbl:discoveryFound', { detail: secretKey }));
      return true;
    }
    return false;
  }

  // Chaos Intensity Level
  getChaosLevel() {
    return this.getItem(STORAGE_KEYS.CHAOS_LEVEL, 'unhinged');
  }

  setChaosLevel(level) {
    this.setItem(STORAGE_KEYS.CHAOS_LEVEL, level);
    window.dispatchEvent(new CustomEvent('rbl:chaosLevelChanged', { detail: level }));
  }

  // Reset all application gameplay data
  resetAllProgress() {
    this.setItem(STORAGE_KEYS.STATS, DEFAULT_STATS);
    this.setItem(STORAGE_KEYS.ACHIEVEMENTS, []);
    this.setItem(STORAGE_KEYS.DISCOVERIES, []);
    this.setItem(STORAGE_KEYS.ACTIVITY_LOG, [
      { id: Date.now(), text: 'Progress reset to zero. Total clean slate!', time: Date.now(), type: 'reset' }
    ]);
    window.dispatchEvent(new CustomEvent('rbl:statsUpdated', { detail: DEFAULT_STATS }));
  }
}

// Global singleton
window.RBLStorage = new StorageManager();
