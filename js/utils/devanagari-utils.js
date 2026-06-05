/**
 * Devanagari Unicode Utilities
 * Helper functions for working with Devanagari script
 */

const DevanagariUtils = (() => {
  // Unicode ranges for Devanagari
  const RANGES = {
    DEVANAGARI: [0x0900, 0x097F],       // Main Devanagari block
    DEVANAGARI_EXT_A: [0xA8E0, 0xA8FF], // Devanagari Extended-A
    DEVANAGARI_EXT_B: [0x11E00, 0x11FFF], // Devanagari Extended-B (rare)
  };

  // Vowel characters (independent forms)
  const VOWELS = {
    // Short vowels (Laghu)
    '\u0905': { name: 'अ', roman: 'a', long: false },    // अ
    '\u0907': { name: 'इ', roman: 'i', long: false },    // इ
    '\u0909': { name: 'उ', roman: 'u', long: false },    // उ
    '\u090B': { name: 'ऋ', roman: 'ri', long: false },   // ऋ
    '\u090C': { name: 'ऌ', roman: 'li', long: false },   // ऌ

    // Long vowels (Guru)
    '\u0906': { name: 'आ', roman: 'aa', long: true },    // आ
    '\u0908': { name: 'ई', roman: 'ii', long: true },    // ई
    '\u090A': { name: 'ऊ', roman: 'uu', long: true },    // ऊ
    '\u090F': { name: 'ए', roman: 'e', long: true },     // ए
    '\u0910': { name: 'ऐ', roman: 'ai', long: true },    // ऐ
    '\u0913': { name: 'ओ', roman: 'o', long: true },     // ओ
    '\u0914': { name: 'औ', roman: 'au', long: true },    // औ
  };

  // Vowel signs (matras) - attached to consonants
  const MATRAS = {
    // Short vowel signs (Laghu)
    '\u093E': { name: 'ा', roman: 'aa', long: true },    // ा (long!)
    '\u093F': { name: 'ि', roman: 'i', long: false },    // ि
    '\u0941': { name: 'ु', roman: 'u', long: false },    // ु
    '\u0943': { name: 'ृ', roman: 'ri', long: false },   // ृ
    '\u0944': { name: 'ॄ', roman: 'rii', long: true },   // ॄ

    // Long vowel signs (Guru)
    '\u0940': { name: 'ी', roman: 'ii', long: true },    // ी
    '\u0942': { name: 'ू', roman: 'uu', long: true },    // ू
    '\u0947': { name: 'े', roman: 'e', long: true },     // े
    '\u0948': { name: 'ै', roman: 'ai', long: true },    // ै
    '\u094B': { name: 'ो', roman: 'o', long: true },     // ो
    '\u094C': { name: 'ौ', roman: 'au', long: true },    // ौ

    // Other diacritics
    '\u094D': { name: '्', roman: '', long: false },     // halant (virama)
    '\u0902': { name: 'ं', roman: 'n', long: true },     // anusvāra (makes Guru)
    '\u0903': { name: 'ः', roman: 'h', long: true },     // visarga (makes Guru)
    '\u093C': { name: '़', roman: '', long: false },     // nukta
  };

  // Halant (virama) - removes inherent vowel
  const HALANT = '\u094D';

  // Anusvāra
  const ANUSVARA = '\u0902';

  // Visarga
  const VISARGA = '\u0903';

  // Nukta
  const NUKTA = '\u093C';

  // Consonant range (क to ह)
  const CONSONANT_START = 0x0915; // क
  const CONSONANT_END = 0x0939;   // ह

  // Numbers
  const NUMBER_START = 0x0966; // ०
  const NUMBER_END = 0x096F;   // ९

  /**
   * Checks if a character is in the Devanagari Unicode block
   * @param {string} char - Single character
   * @returns {boolean}
   */
  function isDevanagari(char) {
    const code = char.charCodeAt(0);
    return (code >= RANGES.DEVANAGARI[0] && code <= RANGES.DEVANAGARI[1]) ||
           (code >= RANGES.DEVANAGARI_EXT_A[0] && code <= RANGES.DEVANAGARI_EXT_A[1]);
  }

  /**
   * Checks if a character is a Devanagari vowel (independent form)
   * @param {string} char
   * @returns {boolean}
   */
  function isVowel(char) {
    return char in VOWELS;
  }

  /**
   * Checks if a character is a vowel sign (matra)
   * @param {string} char
   * @returns {boolean}
   */
  function isMatra(char) {
    return char in MATRAS;
  }

  /**
   * Checks if a character is a Devanagari consonant
   * @param {string} char
   * @returns {boolean}
   */
  function isConsonant(char) {
    const code = char.charCodeAt(0);
    return code >= CONSONANT_START && code <= CONSONANT_END;
  }

  /**
   * Checks if a character is the halant (virama)
   * @param {string} char
   * @returns {boolean}
   */
  function isHalant(char) {
    return char === HALANT;
  }

  /**
   * Checks if a character is anusvāra
   * @param {string} char
   * @returns {boolean}
   */
  function isAnusvara(char) {
    return char === ANUSVARA;
  }

  /**
   * Checks if a character is visarga
   * @param {string} char
   * @returns {boolean}
   */
  function isVisarga(char) {
    return char === VISARGA;
  }

  /**
   * Checks if a character is nukta
   * @param {string} char
   * @returns {boolean}
   */
  function isNukta(char) {
    return char === NUKTA;
  }

  /**
   * Checks if a character is a Devanagari number
   * @param {string} char
   * @returns {boolean}
   */
  function isNumber(char) {
    const code = char.charCodeAt(0);
    return code >= NUMBER_START && code <= NUMBER_END;
  }

  /**
   * Checks if a character is a dependent vowel sign that makes the syllable long
   * @param {string} char - A matra character
   * @returns {boolean}
   */
  function isLongMatra(char) {
    return char in MATRAS && MATRAS[char].long === true;
  }

  /**
   * Gets vowel information from a matra character
   * @param {string} matraChar
   * @returns {{name: string, roman: string, long: boolean} | null}
   */
  function getMatraInfo(matraChar) {
    return MATRAS[matraChar] || null;
  }

  /**
   * Gets vowel information from an independent vowel character
   * @param {string} vowelChar
   * @returns {{name: string, roman: string, long: boolean} | null}
   */
  function getVowelInfo(vowelChar) {
    return VOWELS[vowelChar] || null;
  }

  /**
   * Splits a Devanagari string into individual characters
   * @param {string} text
   * @returns {string[]}
   */
  function toCharArray(text) {
    return Array.from(text);
  }

  /**
   * Checks if a character is a combining mark (matra, nukta, etc.)
   * @param {string} char
   * @returns {boolean}
   */
  function isCombiningMark(char) {
    return isMatra(char) || isHalant(char) || isAnusvara(char) || isVisarga(char) || isNukta(char);
  }

  /**
   * Gets the Unicode code point of a character
   * @param {string} char
   * @returns {number}
   */
  function codePoint(char) {
    return char.charCodeAt(0);
  }

  /**
   * Converts a Devanagari number character to its integer value
   * @param {string} char - Devanagari digit (०-९)
   * @returns {number}
   */
  function devanagariToNumber(char) {
    return char.charCodeAt(0) - NUMBER_START;
  }

  /**
   * Converts an integer to Devanagari number character
   * @param {number} num - 0-9
   * @returns {string}
   */
  function numberToDevanagari(num) {
    return String.fromCharCode(NUMBER_START + num);
  }

  return {
    RANGES,
    VOWELS,
    MATRAS,
    HALANT,
    ANUSVARA,
    VISARGA,
    NUKTA,
    CONSONANT_START,
    CONSONANT_END,
    isDevanagari,
    isVowel,
    isMatra,
    isConsonant,
    isHalant,
    isAnusvara,
    isVisarga,
    isNukta,
    isNumber,
    isLongMatra,
    getMatraInfo,
    getVowelInfo,
    toCharArray,
    isCombiningMark,
    codePoint,
    devanagariToNumber,
    numberToDevanagari,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.DewanagariUtils = DevanagariUtils;
}
