// قائمة التنقل على الجوال + تبديل الوضع الليلي
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('primary-menu');
const themeToggle = document.getElementById('themeToggle');
const yearSpan = document.getElementById('year');

// سنة تلقائية في الفوتر
yearSpan.textContent = new Date().getFullYear();

menuToggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

// حفظ تفضيل الوضع
const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  document.documentElement.dataset.theme = storedTheme;
  if (storedTheme === 'dark') document.documentElement.classList.add('dark');
}

// تبديل الوضع
themeToggle?.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  const theme = isDark ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
});
