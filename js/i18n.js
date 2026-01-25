/**
 * Internationalization module for Ronald Klaus personal page
 * Handles language detection, switching, and persistence
 */
import translations from './translations.js';

const STORAGE_KEY = 'preferred-language';
const SUPPORTED_LANGUAGES = ['en', 'de'];
const DEFAULT_LANGUAGE = 'en';

/**
 * Detect user's preferred language from browser settings
 */
function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();
    return SUPPORTED_LANGUAGES.includes(langCode) ? langCode : DEFAULT_LANGUAGE;
}

/**
 * Get the current language (from storage, or detect from browser)
 */
function getCurrentLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
        return stored;
    }
    return detectBrowserLanguage();
}

/**
 * Save language preference to localStorage
 */
function saveLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.textContent = t[key];
        }
    });

    // Apply HTML translations (for elements that need formatting)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        if (t[key]) {
            element.innerHTML = t[key];
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update toggle button states
    updateToggleButtons(lang);
}

/**
 * Update the visual state of language toggle buttons
 */
function updateToggleButtons(lang) {
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
        const btnLang = btn.getAttribute('data-lang-toggle');
        if (btnLang === lang) {
            btn.classList.add('font-black', 'underline');
            btn.classList.remove('text-gray-500');
        } else {
            btn.classList.remove('font-black', 'underline');
            btn.classList.add('text-gray-500');
        }
    });
}

/**
 * Switch to a specific language
 */
function switchLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;
    saveLanguage(lang);
    applyTranslations(lang);
}

/**
 * Initialize i18n system
 */
function init() {
    const lang = getCurrentLanguage();
    applyTranslations(lang);

    // Set up click handlers for language toggle buttons
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetLang = btn.getAttribute('data-lang-toggle');
            switchLanguage(targetLang);
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export { switchLanguage, getCurrentLanguage };
