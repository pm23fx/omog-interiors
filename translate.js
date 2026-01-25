// Language Switcher
let currentLang = localStorage.getItem('language') || 'en';

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('language', currentLang);
    applyLanguage(currentLang);
}

function applyLanguage(lang) {
    const html = document.documentElement;
    const langBtn = document.getElementById('langBtn');
    
    // Update HTML attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update all translatable elements
    document.querySelectorAll('[data-en][data-ar]').forEach(element => {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = element.getAttribute(`data-${lang}`);
        } else {
            element.textContent = element.getAttribute(`data-${lang}`);
        }
    });
    
    // Update language button
    if (langBtn) {
        if (lang === 'ar') {
            langBtn.innerHTML = '<span class="flag">🇬🇧</span><span class="lang-text">English</span>';
        } else {
            langBtn.innerHTML = '<span class="flag">🇶🇦</span><span class="lang-text">العربية</span>';
        }
    }
    
    // Update body class for potential CSS adjustments
    document.body.classList.remove('lang-en', 'lang-ar');
    document.body.classList.add(`lang-${lang}`);
}

// Apply saved language on page load
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
});