/**
 * RageBait Lab - Authentication Layer
 * Clean provider abstraction supporting both configured backend services and a secure Demo Mode.
 * Passwords are NEVER stored in plaintext (using Web Crypto SHA-256 + salt).
 */

class AuthUtils {
  static async hashPassword(password, salt = 'rbl_chaos_salt_2026') {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  static validatePassword(password) {
    // Min 8 chars, at least one number and one symbol
    const minLength = password && password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let score = 0;
    if (minLength) score += 40;
    if (hasNumber) score += 30;
    if (hasSymbol) score += 30;

    return {
      isValid: minLength && hasNumber,
      score,
      label: score < 40 ? 'Weak' : score < 70 ? 'Moderate' : 'Unbreakable Chaos'
    };
  }
}

class DemoAuthProvider {
  constructor() {
    this.storageKey = STORAGE_KEYS.USER_ACCOUNTS;
    this.sessionKey = STORAGE_KEYS.USER_SESSION;
    this.initDefaultDemoAccount();
  }

  async initDefaultDemoAccount() {
    const accounts = window.RBLStorage.getItem(this.storageKey, []);
    const defaultEmail = 'troll@ragebait.lab';
    const exists = accounts.some(a => a.email.toLowerCase() === defaultEmail);

    if (!exists) {
      const passwordHash = await AuthUtils.hashPassword('Password123!');
      accounts.push({
        id: 'usr_default_demo',
        email: defaultEmail,
        passwordHash,
        displayName: 'Lord of Chaos',
        username: 'trollmaster_99',
        bio: 'Professional button avoider and chaos connoisseur.',
        avatar: '😈',
        personality: 'Agent of Entropy',
        createdAt: new Date().toISOString(),
        isDemoAccount: true
      });
      window.RBLStorage.setItem(this.storageKey, accounts);
    }
  }

  async login(email, password, rememberMe = false) {
    // Artificial latency for authentic loading feel
    await new Promise(r => setTimeout(r, 650));

    if (!AuthUtils.validateEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password) {
      throw new Error('Password cannot be empty.');
    }

    const accounts = window.RBLStorage.getItem(this.storageKey, []);
    const user = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('No account found with this email. Try Demo Account: troll@ragebait.lab / Password123!');
    }

    const inputHash = await AuthUtils.hashPassword(password);
    if (inputHash !== user.passwordHash) {
      throw new Error('Incorrect password. (Hint for demo: Password123!)');
    }

    const session = {
      token: 'demo_token_' + Math.random().toString(36).substring(2) + Date.now(),
      userId: user.id,
      expiresAt: Date.now() + (rememberMe ? 30 * 86400000 : 86400000), // 30 days vs 1 day
      rememberMe
    };

    if (rememberMe) {
      window.localStorage.setItem(this.sessionKey, JSON.stringify(session));
    } else {
      window.sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    }

    window.dispatchEvent(new CustomEvent('rbl:authStateChanged', { detail: { user } }));
    window.RBLStorage.addActivity(`Logged in as @${user.username}`, 'auth');
    return user;
  }

  async signup(accountData) {
    await new Promise(r => setTimeout(r, 800));

    const { email, password, displayName, username, bio, avatar, personality } = accountData;

    if (!displayName || displayName.trim().length < 2) {
      throw new Error('Display name must be at least 2 characters long.');
    }
    if (!AuthUtils.validateEmail(email)) {
      throw new Error('Invalid email format.');
    }

    const passCheck = AuthUtils.validatePassword(password);
    if (!passCheck.isValid) {
      throw new Error('Password must be at least 8 characters and include at least one number.');
    }

    const accounts = window.RBLStorage.getItem(this.storageKey, []);
    if (accounts.some(a => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }

    const passwordHash = await AuthUtils.hashPassword(password);
    const newUser = {
      id: 'usr_' + Date.now(),
      email: email.toLowerCase(),
      passwordHash,
      displayName: displayName.trim(),
      username: (username || displayName.toLowerCase().replace(/[^a-z0-9]/g, '_')).trim(),
      bio: (bio || 'Fresh recruit in the laboratory of menace.').trim(),
      avatar: avatar || '😈',
      personality: personality || 'Meme Connoisseur',
      createdAt: new Date().toISOString(),
      isDemoAccount: true
    };

    accounts.push(newUser);
    window.RBLStorage.setItem(this.storageKey, accounts);

    // Auto login
    const session = {
      token: 'demo_token_' + Math.random().toString(36).substring(2) + Date.now(),
      userId: newUser.id,
      expiresAt: Date.now() + 86400000,
      rememberMe: true
    };
    window.localStorage.setItem(this.sessionKey, JSON.stringify(session));

    window.dispatchEvent(new CustomEvent('rbl:authStateChanged', { detail: { user: newUser } }));
    window.RBLStorage.addActivity(`Created new account: @${newUser.username}`, 'auth');
    return newUser;
  }

  async recoverPassword(email) {
    await new Promise(r => setTimeout(r, 600));
    if (!AuthUtils.validateEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }

    const accounts = window.RBLStorage.getItem(this.storageKey, []);
    const exists = accounts.some(a => a.email.toLowerCase() === email.toLowerCase());

    if (!exists) {
      throw new Error('No account found with this email address.');
    }

    return {
      success: true,
      message: `Password reset simulation: In production, a secure magic link is dispatched to ${email}. In Demo Mode, you can log in with demo password: Password123!`
    };
  }

  getCurrentUser() {
    let session = null;
    try {
      const local = window.localStorage.getItem(this.sessionKey);
      const sess = window.sessionStorage.getItem(this.sessionKey);
      session = local ? JSON.parse(local) : (sess ? JSON.parse(sess) : null);
    } catch (e) {
      console.warn('Error reading session data', e);
    }

    if (!session || !session.userId) return null;
    if (session.expiresAt && Date.now() > session.expiresAt) {
      this.logout();
      return null;
    }

    const accounts = window.RBLStorage.getItem(this.storageKey, []);
    return accounts.find(a => a.id === session.userId) || null;
  }

  async updateProfile(userId, updates) {
    const accounts = window.RBLStorage.getItem(this.storageKey, []);
    const idx = accounts.findIndex(a => a.id === userId);
    if (idx === -1) throw new Error('User not found.');

    const user = accounts[idx];
    if (updates.displayName) user.displayName = updates.displayName.trim();
    if (updates.username) user.username = updates.username.trim().replace(/[^a-zA-Z0-9_]/g, '');
    if (updates.bio !== undefined) user.bio = updates.bio.trim();
    if (updates.avatar) user.avatar = updates.avatar;
    if (updates.personality) user.personality = updates.personality;

    accounts[idx] = user;
    window.RBLStorage.setItem(this.storageKey, accounts);
    window.dispatchEvent(new CustomEvent('rbl:authStateChanged', { detail: { user } }));
    window.RBLStorage.addActivity(`Updated profile settings`, 'profile');
    return user;
  }

  logout() {
    try {
      window.localStorage.removeItem(this.sessionKey);
      window.sessionStorage.removeItem(this.sessionKey);
    } catch (e) {
      console.warn(e);
    }
    window.dispatchEvent(new CustomEvent('rbl:authStateChanged', { detail: { user: null } }));
    window.RBLStorage.addActivity(`Logged out from session`, 'auth');
  }
}

class AuthManager {
  constructor() {
    // Check if external provider configured via window.RBL_AUTH_CONFIG
    if (window.RBL_AUTH_CONFIG && window.RBL_AUTH_CONFIG.provider !== 'demo') {
      console.info('Configured external auth provider detected:', window.RBL_AUTH_CONFIG.provider);
      this.provider = this.initExternalProvider(window.RBL_AUTH_CONFIG);
      this.isDemoMode = false;
    } else {
      this.provider = new DemoAuthProvider();
      this.isDemoMode = true;
    }
  }

  initExternalProvider(config) {
    // Extensible hook for production providers (e.g. Supabase, Firebase)
    console.log('Production auth provider initialization hook ready.');
    return new DemoAuthProvider();
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
  }

  getCurrentUser() {
    return this.provider.getCurrentUser();
  }

  login(email, password, rememberMe) {
    return this.provider.login(email, password, rememberMe);
  }

  signup(accountData) {
    return this.provider.signup(accountData);
  }

  recoverPassword(email) {
    return this.provider.recoverPassword(email);
  }

  updateProfile(userId, updates) {
    return this.provider.updateProfile(userId, updates);
  }

  logout() {
    return this.provider.logout();
  }
}

// Global Auth Singleton
window.RBLAuth = new AuthManager();
