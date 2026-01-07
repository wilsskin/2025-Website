// main.js
// Add any site-wide JavaScript here

// First paint gate - reveal page after images load
(function() {
  if (document.readyState === 'complete') {
    // Already fully loaded
    document.documentElement.classList.add('ready');
  } else {
    // Wait for all resources (including images) to load
    window.addEventListener('load', function() {
      document.documentElement.classList.add('ready');
    });
    
    // Safety timeout - show page even if some images are slow
    setTimeout(function() {
      document.documentElement.classList.add('ready');
    }, 300);
  }
})();

const RESUME_URL = 'https://drive.google.com/file/d/1qisEWYhZrLp_L30_ZaD-qxJgdMQtfmPE/view?usp=sharing';

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

  // About interests photo captions - tap to reveal on mobile
  if (!window.__interestsCaptionsInit) {
    window.__interestsCaptionsInit = true;
    document.querySelectorAll('.about-interests-photo').forEach(photo => {
      photo.addEventListener('click', function() {
        if (window.innerWidth <= 481) {
          const isActive = this.classList.contains('active');
          document.querySelectorAll('.about-interests-photo').forEach(p => p.classList.remove('active'));
          if (!isActive) this.classList.add('active');
        }
      });
    });
  }
});
