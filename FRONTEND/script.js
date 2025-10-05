// Dark Mode Toggle Function
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const btn = document.querySelector('.dark-toggle');
  btn.textContent = document.body.classList.contains('dark-mode') ? '☀' : '🌙';
}

// Menu Toggle Function
function toggleMenu() {
  const menu = document.getElementById("slideMenu");
  const menuBtn = document.querySelector('.menu-btn');
  
  menu.classList.toggle("active");
  menuBtn.classList.toggle("active");
}

// Sign In Function
function signIn() {
  alert("Sign In clicked! Redirect to login page or open modal.");
}

// Sign Out Function
function signOut() {
  const confirmLogout = confirm("Are you sure you want to sign out?");
  if (confirmLogout) {
    alert("Successfully signed out!");
  }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
  const menu = document.getElementById('slideMenu');
  const menuBtn = document.querySelector('.menu-btn');
  
  if (menu.classList.contains('active') && 
      !menu.contains(event.target) && 
      !menuBtn.contains(event.target)) {
    menu.classList.remove('active');
    menuBtn.classList.remove('active');
  }
});

// Close menu on ESC key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const menu = document.getElementById('slideMenu');
    const menuBtn = document.querySelector('.menu-btn');
    
    if (menu.classList.contains('active')) {
      menu.classList.remove('active');
      menuBtn.classList.remove('active');
    }
  }
});

// Add click event to sidebar items

// i marked
// document.querySelectorAll('.slide-menu ul li').forEach(item => {
//   item.addEventListener('click', function() {
//    alert(`Opening: ${this.textContent}`);
//   });
// });
//i added 

document.querySelectorAll('.slide-menu ul li:not(:has(a))').forEach(item => {
  item.addEventListener('click', function() {
    alert(`Opening: ${this.textContent}`);
  });
});

document.querySelectorAll('.slide-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('slideMenu').classList.remove('active');
    document.querySelector('.menu-btn').classList.remove('active');
  });
});
// Smooth scroll for anchor links (if any)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Console log on page load
console.log('%c🚀 LingoLift loaded successfully!', 'color: #3366cc; font-size: 20px; font-weight: bold;');
console.log('%c📋 Keyboard Shortcuts:', 'color: #3366cc; font-weight: bold;');
console.log('  • Press ESC to close the sidebar menu');
console.log('  • Click outside the sidebar to close it');
console.log('%c✨ Features:', 'color: #3366cc; font-weight: bold;');
console.log('  • Animated menu button with smooth transitions');
console.log('  • Dark mode toggle (🌙 ↔ ☀)');
console.log('  • Responsive design for all screen sizes');












const wordList = [
  {
    word: "Eloquent",
    meaning: "Fluent or persuasive in speaking or writing",
    synonyms: ["Articulate", "Expressive"],
    antonyms: ["Inarticulate", "Mute"]
  },
  {
    word: "Resilient",
    meaning: "Able to recover quickly from difficulties",
    synonyms: ["Tough", "Adaptable"],
    antonyms: ["Fragile", "Vulnerable"]
  },
  {
    word: "Innovate",
    meaning: "To introduce new ideas or methods",
    synonyms: ["Invent", "Pioneer"],
    antonyms: ["Imitate", "Stagnate"]
  }
];

function getWordOfTheDay() {
  const today = new Date().getDate();
  const index = today % wordList.length;
  return wordList[index];
}

function openWordPopup() {
  const wordData = getWordOfTheDay();
  document.getElementById("popupWord").textContent = wordData.word;
  document.getElementById("popupMeaning").textContent = wordData.meaning;
  document.getElementById("popupSynonyms").textContent = wordData.synonyms.join(", ");
  document.getElementById("popupAntonyms").textContent = wordData.antonyms.join(", ");
  document.getElementById("wordPopup").style.display = "flex";
}

function closeWordPopup() {
  document.getElementById("wordPopup").style.display = "none";
}
