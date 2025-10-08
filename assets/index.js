// main.js
// Add any site-wide JavaScript here

const RESUME_URL = 'https://drive.google.com/file/d/1ZYduGvOW4dvp_hMde4dZ60u6a7ca0nid/view?usp=sharing';

// 1) Global: hydrate resume links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[data-resume-link]').forEach(a => {
    a.setAttribute('href', RESUME_URL);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
});

// 2) Global: mobile menu controls (referenced by inline onclick handlers)
window.toggleMobileMenu = function toggleMobileMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  const hamburger = document.querySelector('.hamburger');
  if (!overlay || !hamburger) return;
  overlay.classList.toggle('active');
  hamburger.classList.toggle('active');
  document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
};

window.closeMobileMenu = function closeMobileMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  const hamburger = document.querySelector('.hamburger');
  if (!overlay || !hamburger) return;
  overlay.classList.remove('active');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
};

// 3) Global: non-breaking listeners (guarded to avoid duplicates while inline scripts still exist)
document.addEventListener('DOMContentLoaded', () => {
  // Guard to prevent duplicate attachment while inline scripts still run
  if (!window.__globalMenuInit) {
    window.__globalMenuInit = true;

    const overlay = document.getElementById('mobileMenuOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) window.closeMobileMenu();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') window.closeMobileMenu();
    });
  }

  // Logo hover (desktop only). Guard against duplicate listeners
  if (!window.__logoHoverInit) {
    window.__logoHoverInit = true;
    const logo = document.querySelector('.site-header .logo img');
    if (logo && window.innerWidth > 480) {
      logo.addEventListener('mouseenter', () => {
        logo.style.transform = 'rotate(10deg)';
      });
      logo.addEventListener('mouseleave', () => {
        logo.style.transform = 'rotate(0deg)';
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth <= 480) logo.style.transform = 'rotate(0deg)';
      });
    }
  }
});
