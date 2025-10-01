// main.js
// Add any site-wide JavaScript here

const RESUME_URL = 'https://drive.google.com/file/d/1avMJAPTP1dMGGeeNkCuSqzUhfFsd7iza/view?usp=sharing';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[data-resume-link]').forEach(a => {
    a.setAttribute('href', RESUME_URL);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
});
