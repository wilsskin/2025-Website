// main.js
// Add any site-wide JavaScript here

const RESUME_URL = 'https://drive.google.com/file/d/1w8p4BH86tD6YP9aSXiOMEmUaSLX-bVNv/view?usp=sharing';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[data-resume-link]').forEach(a => {
    a.setAttribute('href', RESUME_URL);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
});

console.log('Site loaded');
