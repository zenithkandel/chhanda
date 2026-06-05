/**
 * Language System
 * Handles Nepali/English translation toggle
 */

const Language = (() => {
  let currentLang = 'np'; // Default to Nepali
  const listeners = [];

  // Translation dictionary
  const translations = {
    // Navigation
    'nav.home': { en: 'Home', np: 'मुख्य पृष्ठ' },
    'nav.catalog': { en: 'Catalog', np: 'छन्द सूची' },
    'nav.checker': { en: 'Checker', np: 'छन्द जाँच' },
    'nav.learning': { en: 'Learning', np: 'सिक्नुहोस्' },
    'nav.examples': { en: 'Examples', np: 'उदाहरणहरू' },
    'nav.reference': { en: 'Reference', np: 'सन्दर्भ' },

    // Home Page
    'home.title': { en: 'Chhanda Kavita Guide', np: 'छन्द कविता मार्गदर्शक' },
    'home.subtitle': { en: 'A Complete Guide to Classical Indic Prosody', np: 'शास्त्रीय भारतीय छन्दशास्त्रको सम्पूर्ण मार्गदर्शिका' },
    'home.startChecker': { en: 'Start Analyzing', np: 'विश्लेषण सुरु गर्नुहोस्' },
    'home.learnBasics': { en: 'Learn the Basics', np: 'आधारभूत कुरा सिक्नुहोस्' },
    'home.feature1Title': { en: 'Chhanda Catalog', np: 'छन्द सूची' },
    'home.feature1Desc': { en: 'Explore all 15 classical metres', np: '१५ वटा शास्त्रीय छन्दहरू अन्वेषण गर्नुहोस्' },
    'home.feature2Title': { en: 'Chhanda Checker', np: 'छन्द जाँच' },
    'home.feature2Desc': { en: 'Analyze your poems for metre accuracy', np: 'छन्द शुद्धताका लागि आफ्नो कविता विश्लेषण गर्नुहोस्' },
    'home.feature3Title': { en: 'Mistake Detection', np: 'गलती पत्ता लगाउने' },
    'home.feature3Desc': { en: 'Identify and correct prosodic errors', np: 'छन्दशास्त्रीय गल्तीहरू पत्ता लगाउनुहोस् र सच्याउनुहोस्' },
    'home.feature4Title': { en: 'Learning Center', np: 'सिक्ने केन्द्र' },
    'home.feature4Desc': { en: 'Interactive tutorials for beginners', np: 'शुरुवातीहरूका लागि अन्तरक्रियात्मक पाठ्यक्रम' },
    'home.feature5Title': { en: 'Example Library', np: 'उदाहरण पुस्तकालय' },
    'home.feature5Desc': { en: 'Famous poems with analysis', np: 'विश्लेषणसहितका प्रसिद्ध कविताहरू' },
    'home.feature6Title': { en: 'Reference Tools', np: 'सन्दर्भ उपकरणहरू' },
    'home.feature6Desc': { en: 'Quick guides and cheat sheets', np: 'छिटो मार्गदर्शक र चिट्ठीपत्रिका' },
    'home.stats.chhandas': { en: '15 Classical Chhandas', np: '१५ शास्त्रीय छन्दहरू' },
    'home.stats.examples': { en: '100+ Famous Examples', np: '१००+ प्रसिद्ध उदाहरणहरू' },
    'home.stats.lessons': { en: 'Interactive Lessons', np: 'अन्तरक्रियात्मक पाठहरू' },

    // Checker Page
    'checker.title': { en: 'Chhanda Checker', np: 'छन्द जाँच' },
    'checker.subtitle': { en: 'Analyze your poem for metre accuracy', np: 'छन्द शुद्धताका लागि आफ्नो कविता विश्लेषण गर्नुहोस्' },
    'checker.inputLabel': { en: 'Enter your poem', np: 'आफ्नो कविता प्रविष्ट गर्नुहोस्' },
    'checker.inputPlaceholder': { en: 'Type or paste your Devanagari text here...', np: 'यहाँ आफ्नो देवनागरी पाठ टाइप वा पेस्ट गर्नुहोस्...' },
    'checker.analyze': { en: 'Analyze', np: 'विश्लेषण गर्नुहोस्' },
    'checker.clear': { en: 'Clear', np: 'सफा गर्नुहोस्' },
    'checker.targetChhanda': { en: 'Target Chhanda (optional)', np: 'लक्ष्य छन्द (वैकल्पिक)' },
    'checker.results': { en: 'Analysis Results', np: 'विश्लेषण नतिजाहरू' },
    'checker.syllableBreakdown': { en: 'Syllable Breakdown', np: 'अक्षर विभाजन' },
    'checker.sisiCode': { en: 'SISI Code', np: 'SISI कोड' },
    'checker.matchedChhanda': { en: 'Matched Chhanda', np: 'मिलेको छन्द' },
    'checker.noMatch': { en: 'No exact match found', np: 'कुनै सटीक मिलान फेला भएन' },
    'checker.mistakes': { en: 'Deviations Found', np: 'भिन्नताहरू फेला भए' },
    'checker.corrections': { en: 'Suggested Corrections', np: 'सुझाइएका सच्याइहरू' },

    // Catalog Page
    'catalog.title': { en: 'Chhanda Catalog', np: 'छन्द सूची' },
    'catalog.subtitle': { en: 'Explore all 15 classical metres', np: '१५ शास्त्रीय छन्दहरू अन्वेषण गर्नुहोस्' },
    'catalog.search': { en: 'Search chhandas...', np: 'छन्दहरू खोज्नुहोस्...' },
    'catalog.filterSyllables': { en: 'Syllables per line', np: 'प्रति पंक्ति अक्षर' },
    'catalog.filterMood': { en: 'Mood', np: 'भाव' },
    'catalog.filterDifficulty': { en: 'Difficulty', np: 'कठिनाई' },
    'catalog.sortBy': { en: 'Sort by', np: 'क्रमबद्ध गर्नुहोस्' },

    // Learning Page
    'learning.title': { en: 'Learning Center', np: 'सिक्ने केन्द्र' },
    'learning.subtitle': { en: 'Master the art of classical prosody', np: 'शास्त्रीय छन्दशास्त्रको कला सिक्नुहोस्' },
    'learning.progress': { en: 'Your Progress', np: 'तपाईंको प्रगति' },

    // Reference Page
    'reference.title': { en: 'Reference Tools', np: 'सन्दर्भ उपकरणहरू' },
    'reference.subtitle': { en: 'Quick guides and cheat sheets', np: 'छिटो मार्गदर्शक र चिट्ठीपत्रिका' },
    'reference.guruLaghu': { en: 'Guru-Laghu Rules', np: 'गुरु-लघु नियमहरू' },
    'reference.ganaTable': { en: 'Gana Table', np: 'गण तालिका' },
    'reference.chhandaComparison': { en: 'Chhanda Comparison', np: 'छन्द तुलना' },

    // Common
    'common.loading': { en: 'Loading...', np: 'लोड हुँदैछ...' },
    'common.error': { en: 'Error', np: 'त्रुटि' },
    'common.success': { en: 'Success', np: 'सफल' },
    'common.tryInChecker': { en: 'Try in Checker', np: 'जाँचमा प्रयोग गर्नुहोस्' },
    'common.viewDetails': { en: 'View Details', np: 'विवरण हेर्नुहोस्' },
    'common.difficulty.beginner': { en: 'Beginner', np: 'शुरुवाती' },
    'common.difficulty.intermediate': { en: 'Intermediate', np: 'मध्यम' },
    'common.difficulty.advanced': { en: 'Advanced', np: 'उन्नत' },
  };

  /**
   * Gets translation for a key
   * @param {string} key
   * @returns {string}
   */
  function t(key) {
    const entry = translations[key];
    if (!entry) return key;
    return entry[currentLang] || entry.en || key;
  }

  /**
   * Sets the current language
   * @param {string} lang - 'en' or 'np'
   */
  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'np') return;
    currentLang = lang;
    localStorage.setItem('chhanda-lang', lang);
    document.documentElement.lang = lang === 'np' ? 'ne' : 'en';
    notifyListeners();
  }

  /**
   * Gets current language
   * @returns {string}
   */
  function getLanguage() {
    return currentLang;
  }

  /**
   * Toggles between languages
   */
  function toggleLanguage() {
    setLanguage(currentLang === 'en' ? 'np' : 'en');
  }

  /**
   * Adds a listener for language changes
   * @param {Function} callback
   */
  function onLanguageChange(callback) {
    listeners.push(callback);
  }

  /**
   * Notifies all listeners of language change
   */
  function notifyListeners() {
    listeners.forEach(cb => cb(currentLang));
  }

  /**
   * Initializes language from localStorage
   */
  function init() {
    const saved = localStorage.getItem('chhanda-lang');
    if (saved && (saved === 'en' || saved === 'np')) {
      currentLang = saved;
    }
    document.documentElement.lang = currentLang === 'np' ? 'ne' : 'en';
  }

  /**
   * Applies translations to all elements with data-i18n attribute
   */
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });
  }

  // Initialize
  init();

  return {
    t,
    setLanguage,
    getLanguage,
    toggleLanguage,
    onLanguageChange,
    applyTranslations,
    translations,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.Language = Language;
}
