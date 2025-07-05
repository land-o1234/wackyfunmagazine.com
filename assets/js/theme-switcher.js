// Theme Switcher and Consent Management
class ThemeSwitcher {
  constructor() {
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupCookieBanner();
    this.bindEvents();
  }

  // Theme Management
  setupTheme() {
    const savedTheme = this.getStorage('theme');
    let initialTheme = savedTheme ? savedTheme : 'light'; // Always default to light
    this.setTheme(initialTheme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.setStorage('theme', theme);
    this.updateThemeIcon(theme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  updateThemeIcon(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeIcon.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  // Storage Management (localStorage only)
  setStorage(name, value) {
    localStorage.setItem(name, value);
  }

  getStorage(name) {
    return localStorage.getItem(name);
  }

  // Cookie Banner Management
  setupCookieBanner() {
    const cookieConsent = this.getStorage('cookie-consent');
    if (!cookieConsent) {
      this.showCookieBanner();
    }
  }

  showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      setTimeout(() => {
        banner.classList.add('show');
      }, 500);
    }
  }

  hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  }

  acceptCookies() {
    this.setStorage('cookie-consent', 'accepted');
    this.hideCookieBanner();
  }

  declineCookies() {
    this.setStorage('cookie-consent', 'declined');
    this.clearNonEssentialStorage();
    this.hideCookieBanner();
  }

  clearNonEssentialStorage() {
    localStorage.removeItem('theme');
    this.setTheme('light');
  }

  // Event Binding
  bindEvents() {
    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Cookie banner buttons
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => this.acceptCookies());
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', () => this.declineCookies());
    }

    // Listen for system theme changes only if no theme is set
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStorage('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ThemeSwitcher();
});