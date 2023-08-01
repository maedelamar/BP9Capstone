const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const writeStoryBtn = document.getElementById('make-story-btn');

loginBtn.addEventListener('click', () => location.href = '/login');
signupBtn.addEventListener('click', () => location.href = '/signup');
writeStoryBtn.addEventListener('click', () => location.href = '/write');