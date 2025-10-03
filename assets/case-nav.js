// case-nav.js
// Sidebar navigation: smooth scroll + active link tracking for case study pages

(function initCaseNavOnce() {
  if (window.__caseNavInit) return; // guard against duplicate init
  window.__caseNavInit = true;

  function initSidebarNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    if (!navLinks.length || !sections.length) return;

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Update active section based on scroll position
    function updateActiveSection() {
      const scrollPosition = window.scrollY + 100;
      const isAtBottom = scrollPosition + window.innerHeight >= document.documentElement.scrollHeight - 50;


      // Near top → Hero active
      if (scrollPosition < 200) {
        navLinks.forEach(link => link.classList.remove('active'));
        const heroLink = document.querySelector('[href="#hero"]');
        if (heroLink) heroLink.classList.add('active');
        return;
      }

      // Find current section by boundaries
      let currentSection = null;
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const sectionBottom = i < sections.length - 1
          ? sections[i + 1].offsetTop
          : sectionTop + section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSection = section;
          break;
        }
      }

      navLinks.forEach(link => link.classList.remove('active'));
      if (currentSection) {
        const active = document.querySelector(`[href="#${currentSection.id}"]`);
        if (active) active.classList.add('active');
      }
    }

    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection();

    // Default hero active if none
    const activeLink = document.querySelector('.nav-link.active');
    if (!activeLink) {
      const heroLink = document.querySelector('[href="#hero"]');
      if (heroLink) heroLink.classList.add('active');
    }

    // Ensure Process link exists if a #process section is present
    const processSection = document.getElementById('process');
    if (processSection) {
      const processInNav = document.querySelector('.page-nav [href="#process"]');
      if (!processInNav) {
        const pageNavList = document.querySelector('.page-nav ul');
        if (pageNavList) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = '#process';
          a.className = 'nav-link';
          a.setAttribute('data-section', 'process');
          a.textContent = 'Process';
          li.appendChild(a);
          // append at end (no takeaways section)
          pageNavList.appendChild(li);

          // attach smooth scroll to the newly inserted link
          a.addEventListener('click', (e) => {
            e.preventDefault();
            processSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebarNav);
  } else {
    initSidebarNav();
  }
})();


