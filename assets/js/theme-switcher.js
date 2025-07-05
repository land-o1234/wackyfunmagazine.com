// Theme Switcher and Cookie Management
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
    const savedTheme = this.getCookie('theme') || 'light';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme !== 'light' ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
    
    this.setTheme(initialTheme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.setCookie('theme', theme, 365);
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

  // Cookie Management
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Cookie Banner Management
  setupCookieBanner() {
    const cookieConsent = this.getCookie('cookie-consent');
    if (!cookieConsent) {
      this.showCookieBanner();
    }
  }

  showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      setTimeout(() => {
        banner.classList.add('show');
      }, 1000); // Show after 1 second
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
    this.setCookie('cookie-consent', 'accepted', 365);
    this.hideCookieBanner();
  }

  declineCookies() {
    this.setCookie('cookie-consent', 'declined', 365);
    // Remove any non-essential cookies
    this.clearNonEssentialCookies();
    this.hideCookieBanner();
  }

  clearNonEssentialCookies() {
    // Clear theme cookie if user declines
    document.cookie = 'theme=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Reset theme to light mode
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

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getCookie('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ThemeSwitcher();
});