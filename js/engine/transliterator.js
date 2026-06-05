/**
 * Transliterator
 * Wraps a transliteration library for Roman → Devanagari conversion
 * Falls back to a simple mapping if library is not available
 */

const Transliterator = (() => {
  let libraryAvailable = false;
  let transliterateFn = null;

  // Simple fallback mapping for common Sanskrit/Nepali transliterations
  const SIMPLE_MAP = {
    'a': 'अ', 'A': 'आ', 'aa': 'आ',
    'i': 'इ', 'I': 'ई', 'ii': 'ई',
    'u': 'उ', 'U': 'ऊ', 'uu': 'ऊ',
    'e': 'ए', 'E': 'ए',
    'ai': 'ऐ', 'AU': 'औ', 'au': 'औ',
    'o': 'ओ', 'O': 'ओ',

    'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ', 'G': 'ङ',
    'c': 'च', 'ch': 'छ', 'j': 'ज', 'jh': 'झ', 'J': 'ञ',
    'T': 'ट', 'Th': 'ठ', 'D': 'ड', 'Dh': 'ढ', 'N': 'ण',
    't': 'त', 'th': 'थ', 'd': 'द', 'dh': 'ध', 'n': 'न',
    'p': 'प', 'f': 'फ', 'ph': 'फ', 'b': 'ब', 'bh': 'भ', 'm': 'म',
    'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व',
    'sh': 'श', 'Sh': 'ष', 's': 'स', 'h': 'ह',

    'M': 'ं', 'H': 'ः', 'Nq': 'ँ',

    '.': '।', '..': '॥',
  };

  /**
   * Initialize the transliterator
   * Tries to load external library, falls back to simple mapping
   */
  function init() {
    // Check if indic-transliteration or similar library is loaded
    if (typeof window.TransliterationModule !== 'undefined') {
      transliterateFn = window.TransliterationModule.transliterate;
      libraryAvailable = true;
    } else if (typeof window.google !== 'undefined' && typeof window.google.inputtools !== 'undefined') {
      // Google Input Tools
      libraryAvailable = true;
    } else {
      // Use simple fallback
      libraryAvailable = false;
    }
  }

  /**
   * Transliterates Roman text to Devanagari
   * @param {string} romanText
   * @returns {string} Devanagari text
   */
  function transliterateToDevanagari(romanText) {
    if (!romanText) return '';

    if (libraryAvailable && transliterateFn) {
      try {
        return transliterateFn(romanText, 'devanagari');
      } catch (e) {
        console.warn('Transliteration library failed, using fallback:', e);
      }
    }

    // Simple fallback transliteration
    return simpleTransliterate(romanText);
  }

  /**
   * Transliterates Devanagari to Roman (for display)
   * @param {string} devanagariText
   * @returns {string} Roman text
   */
  function transliterateToRoman(devanagariText) {
    if (!devanagariText) return '';

    // Simple reverse mapping
    let result = '';
    const chars = Array.from(devanagariText);

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const code = char.charCodeAt(0);

      // Devanagari range
      if (code >= 0x0900 && code <= 0x097F) {
        // Find in reverse map
        for (const [roman, dev] of Object.entries(SIMPLE_MAP)) {
          if (dev === char) {
            result += roman;
            break;
          }
        }

        // If not found, use Unicode name
        if (result.length === 0 || result[result.length - 1] === char) {
          result += `[${code.toString(16)}]`;
        }
      } else {
        result += char;
      }
    }

    return result;
  }

  /**
   * Simple character-by-character transliteration
   * @param {string} text
   * @returns {string}
   */
  function simpleTransliterate(text) {
    let result = '';
    let i = 0;

    while (i < text.length) {
      // Check for two-character sequences first
      if (i + 1 < text.length) {
        const twoChar = text.substring(i, i + 2).toLowerCase();
        if (SIMPLE_MAP[twoChar]) {
          result += SIMPLE_MAP[twoChar];
          i += 2;
          continue;
        }

        // Check for uppercase + lowercase (like 'Th', 'Dh')
        const mixedChar = text[i] + text[i + 1];
        if (SIMPLE_MAP[mixedChar]) {
          result += SIMPLE_MAP[mixedChar];
          i += 2;
          continue;
        }
      }

      // Single character
      const singleChar = text[i];
      if (SIMPLE_MAP[singleChar]) {
        result += SIMPLE_MAP[singleChar];
      } else {
        result += singleChar;
      }
      i++;
    }

    return result;
  }

  /**
   * Checks if transliteration library is available
   * @returns {boolean}
   */
  function isLibraryAvailable() {
    return libraryAvailable;
  }

  /**
   * Gets available transliteration schemes
   * @returns {string[]}
   */
  function getSchemes() {
    return ['simple'];
  }

  // Initialize on load
  init();

  return {
    transliterateToDevanagari,
    transliterateToRoman,
    isLibraryAvailable,
    getSchemes,
    init,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.Transliterator = Transliterator;
}
