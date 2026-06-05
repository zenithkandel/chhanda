/**
 * Weight Classifier
 * Determines whether a syllable is Guru (S/Heavy) or Laghu (I/Light)
 * Based on classical Sanskrit prosody rules
 * 
 * KEY RULES:
 * 1. Long vowel → Guru
 * 2. Anusvāra (ं) → Guru
 * 3. Visarga (ः) → Guru
 * 4. Closed syllable (ends with halant ्) → Guru
 * 5. Conjunct consonants → Guru
 * 6. Short vowel (open syllable) → Laghu
 */

const WeightClassifier = (() => {
  const D = window.DewanagariUtils;

  // Long vowel matras
  const LONG_MATRAS = new Set([
    '\u093E', // ा (aa)
    '\u0940', // ी (ii)
    '\u0942', // ू (uu)
    '\u0947', // े (e)
    '\u0948', // ै (ai)
    '\u094B', // ो (o)
    '\u094C', // ौ (au)
  ]);

  // Short vowel matras
  const SHORT_MATRAS = new Set([
    '\u093F', // ि (i)
    '\u0941', // ु (u)
    '\u0943', // ृ (ri)
  ]);

  // Long vowels
  const LONG_VOWELS = new Set([
    '\u0906', // आ
    '\u0908', // ई
    '\u090A', // ऊ
    '\u090F', // ए
    '\u0910', // ऐ
    '\u0913', // ओ
    '\u0914', // औ
  ]);

  // Short vowels
  const SHORT_VOWELS = new Set([
    '\u0905', // अ
    '\u0907', // इ
    '\u0909', // उ
    '\u090B', // ऋ
    '\u090C', // ऌ
  ]);

  /**
   * Main classification function
   * Determines if a syllable is Guru (S) or Laghu (I)
   * 
   * @param {string} syllable - Single syllable in Devanagari
   * @returns {{weight: 'S'|'I', reason: string}}
   * 
   * Examples:
   * classifyWeight("दिन्") → {weight: 'S', reason: 'closed_syllable'}
   * classifyWeight("ना") → {weight: 'S', reason: 'long_vowel'}
   * classifyWeight("म") → {weight: 'I', reason: 'short_vowel_inherent'}
   */
  function classifyWeight(syllable) {
    if (!syllable || typeof syllable !== 'string') {
      return { weight: 'I', reason: 'empty_input' };
    }

    const chars = D.toCharArray(syllable);

    // Track what we find in this syllable
    let hasLongVowel = false;
    let hasShortVowel = false;
    let hasAnusvara = false;
    let hasVisarga = false;
    let hasHalant = false;
    let hasConjunct = false;
    let lastConsonantIndex = -1;

    // Analyze each character
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      // Independent vowel
      if (D.isVowel(char)) {
        if (LONG_VOWELS.has(char)) {
          hasLongVowel = true;
        } else if (SHORT_VOWELS.has(char)) {
          hasShortVowel = true;
        }
      }
      // Matra (vowel sign)
      else if (D.isMatra(char)) {
        if (D.isHalant(char)) {
          hasHalant = true;
        } else if (LONG_MATRAS.has(char)) {
          hasLongVowel = true;
        } else if (SHORT_MATRAS.has(char)) {
          hasShortVowel = true;
        }
      }
      // Anusvāra
      else if (D.isAnusvara(char)) {
        hasAnusvara = true;
      }
      // Visarga
      else if (D.isVisarga(char)) {
        hasVisarga = true;
      }
      // Consonant
      else if (D.isConsonant(char)) {
        lastConsonantIndex = i;
        // Check for conjunct (consecutive consonants without halant between)
        if (i > 0) {
          const prev = chars[i - 1];
          if (D.isConsonant(prev) && !D.isHalant(prev)) {
            hasConjunct = true;
          }
        }
      }
    }

    // Check if syllable ends with halant (closed syllable)
    // A syllable ending with halant + consonant means the last consonant is a half consonant
    // This makes the syllable closed and therefore Guru
    if (hasHalant) {
      return { weight: 'S', reason: 'closed_syllable_halant' };
    }

    // Check for anusvāra → Guru
    if (hasAnusvara) {
      return { weight: 'S', reason: 'anusvara' };
    }

    // Check for visarga → Guru
    if (hasVisarga) {
      return { weight: 'S', reason: 'visarga' };
    }

    // Check for long vowel → Guru
    if (hasLongVowel) {
      return { weight: 'S', reason: 'long_vowel' };
    }

    // Check for conjunct consonant → Guru
    if (hasConjunct) {
      return { weight: 'S', reason: 'conjunct_consonant' };
    }

    // Check for short vowel → Laghu
    if (hasShortVowel) {
      return { weight: 'I', reason: 'short_vowel' };
    }

    // Check for inherent vowel (consonant without explicit vowel)
    // If we have consonants but no explicit vowel mark, it's inherent अ (short)
    if (chars.length > 0) {
      let hasInherentVowel = false;
      for (let i = 0; i < chars.length; i++) {
        if (D.isConsonant(chars[i])) {
          // Check if this consonant is a half consonant (preceded by halant)
          let isHalfConsonant = false;
          if (i > 0 && D.isHalant(chars[i - 1])) {
            isHalfConsonant = true;
          }
          // Check if this consonant is followed by halant
          let followedByHalant = false;
          if (i + 1 < chars.length && D.isHalant(chars[i + 1])) {
            followedByHalant = true;
          }
          // Check if this consonant is followed by a matra
          let followedByMatra = false;
          if (i + 1 < chars.length && D.isMatra(chars[i + 1]) && !D.isHalant(chars[i + 1])) {
            followedByMatra = true;
          }

          // A consonant has inherent vowel if:
          // - It's NOT a half consonant
          // - It's NOT followed by halant
          // - It's NOT followed by a matra
          if (!isHalfConsonant && !followedByHalant && !followedByMatra) {
            hasInherentVowel = true;
            break;
          }
        }
      }

      if (hasInherentVowel) {
        return { weight: 'I', reason: 'short_vowel_inherent' };
      }
    }

    // Default: Laghu
    return { weight: 'I', reason: 'default' };
  }

  /**
   * Classifies multiple syllables
   * @param {Array<{text: string, index: number}>} syllables
   * @returns {Array<{text: string, index: number, weight: 'S'|'I', reason: string}>}
   */
  function classifySyllables(syllables) {
    return syllables.map(syllable => {
      const result = classifyWeight(syllable.text);
      return {
        ...syllable,
        weight: result.weight,
        reason: result.reason,
      };
    });
  }

  /**
   * Quick check: Is this syllable Guru?
   * @param {string} syllable
   * @returns {boolean}
   */
  function isGuru(syllable) {
    return classifyWeight(syllable).weight === 'S';
  }

  /**
   * Quick check: Is this syllable Laghu?
   * @param {string} syllable
   * @returns {boolean}
   */
  function isLaghu(syllable) {
    return classifyWeight(syllable).weight === 'I';
  }

  /**
   * Gets the weight ratio (mātrā count)
   * Laghu = 1, Guru = 2
   * @param {string} syllable
   * @returns {number}
   */
  function getMatraCount(syllable) {
    return classifyWeight(syllable).weight === 'S' ? 2 : 1;
  }

  /**
   * Calculates total mātrā count for text
   * @param {string} text
   * @returns {number}
   */
  function totalMatras(text) {
    const syllables = SyllableParser.parseSyllables(text);
    return syllables.reduce((total, s) => total + getMatraCount(s.text), 0);
  }

  return {
    classifyWeight,
    classifySyllables,
    isGuru,
    isLaghu,
    getMatraCount,
    totalMatras,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.WeightClassifier = WeightClassifier;
}
