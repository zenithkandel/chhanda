/**
 * Syllable Parser
 * Breaks Devanagari text into individual syllables for prosodic analysis
 * 
 * KEY RULE: A halant (्) closes the PRECEDING consonant, making it part of the
 * same syllable. It does NOT start a new syllable.
 * 
 * Example: "दिन्" = द + इ + न् = ONE syllable (Guru), NOT two syllables.
 */

const SyllableParser = (() => {
  const D = window.DewanagariUtils;

  /**
   * Parses Devanagari text into syllables
   * @param {string} text - Devanagari text input
   * @returns {Array<{text: string, index: number}>}
   * 
   * Examples:
   * "दिन्" → [{text:"दिन्"}]  (ONE syllable, not two)
   * "एक्" → [{text:"एक्"}]    (ONE syllable)
   * "नारद" → [{text:"ना"}, {text:"र"}, {text:"द"}]
   */
  function parseSyllables(text) {
    if (!text || typeof text !== 'string') return [];

    const chars = D.toCharArray(text);
    const syllables = [];
    let currentSyllable = '';
    let syllableIndex = 0;

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      // Skip spaces and punctuation - they are word boundaries
      if (isSpace(char) || isPunctuation(char)) {
        if (currentSyllable) {
          syllables.push({ text: currentSyllable, index: syllableIndex });
          syllableIndex++;
          currentSyllable = '';
        }
        continue;
      }

      // Independent vowel (अ, आ, इ, ई, etc.)
      // Always starts a new syllable
      if (D.isVowel(char)) {
        if (currentSyllable) {
          syllables.push({ text: currentSyllable, index: syllableIndex });
          syllableIndex++;
        }
        currentSyllable = char;
        continue;
      }

      // Consonant (क, ख, ग, etc.)
      if (D.isConsonant(char)) {
        // Check if this consonant is followed by halant (making it a closing consonant)
        if (i + 1 < chars.length && D.isHalant(chars[i + 1])) {
          // Consonant + halant = closing consonant (coda)
          // This attaches to the CURRENT syllable
          currentSyllable += char + chars[i + 1];
          i++; // Skip the halant
          continue;
        }

        // Check if current syllable already has a vowel
        // If yes, this consonant starts a NEW syllable
        if (currentSyllable && hasVowelSound(currentSyllable)) {
          syllables.push({ text: currentSyllable, index: syllableIndex });
          syllableIndex++;
          currentSyllable = char;
          continue;
        }

        // Current syllable doesn't have a vowel yet (we're in the onset)
        // Or current syllable is empty - just add this consonant
        currentSyllable += char;
        continue;
      }

      // Matra (vowel sign: ा, ि, ू, े, ै, ो, ौ, etc.)
      // Belongs to current syllable
      if (D.isMatra(char)) {
        currentSyllable += char;
        continue;
      }

      // Anusvāra (ं) - belongs to current syllable
      if (D.isAnusvara(char)) {
        currentSyllable += char;
        continue;
      }

      // Visarga (ः) - belongs to current syllable
      if (D.isVisarga(char)) {
        currentSyllable += char;
        continue;
      }

      // Nukta (़) - belongs to current syllable
      if (D.isNukta(char)) {
        currentSyllable += char;
        continue;
      }

      // Halant (्) that wasn't consumed by a consonant
      // This shouldn't happen in well-formed text, but handle it
      if (D.isHalant(char)) {
        currentSyllable += char;
        continue;
      }

      // Any other character - add to current syllable
      currentSyllable += char;
    }

    // Don't forget the last syllable
    if (currentSyllable) {
      syllables.push({ text: currentSyllable, index: syllableIndex });
    }

    return syllables;
  }

  /**
   * Checks if a syllable has a vowel sound
   * This is used to determine syllable boundaries
   * 
   * A syllable has a vowel sound if it contains:
   * - An independent vowel (अ, आ, इ, etc.)
   * - A matra (ा, ि, ू, े, ै, ो, ौ)
   * - A consonant with inherent vowel (consonant without halant or matra)
   */
  function hasVowelSound(syllable) {
    if (!syllable) return false;

    const chars = D.toCharArray(syllable);
    let hasExplicitVowel = false;
    let lastConsonantHasInherentVowel = false;

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      // Independent vowel
      if (D.isVowel(char)) {
        return true;
      }

      // Matra (but not halant)
      if (D.isMatra(char) && !D.isHalant(char)) {
        return true;
      }
    }

    // Check for consonant with inherent vowel
    // A consonant has inherent vowel if:
    // - It's a consonant
    // - It's NOT followed by halant
    // - It's NOT followed by a matra
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      if (D.isConsonant(char)) {
        // Check what follows this consonant
        let hasFollowingHalant = false;
        let hasFollowingMatra = false;

        // Look ahead for halant or matra
        for (let j = i + 1; j < chars.length; j++) {
          const next = chars[j];
          if (D.isHalant(next)) {
            hasFollowingHalant = true;
            break;
          }
          if (D.isMatra(next)) {
            hasFollowingMatra = true;
            break;
          }
          if (D.isConsonant(next)) {
            // Another consonant - check if it's part of a conjunct
            // If the next consonant is followed by halant, it's a half consonant
            // and the current consonant has inherent vowel
            break;
          }
          break;
        }

        // If this consonant is NOT followed by halant or matra,
        // it has inherent vowel (unless it's a half consonant)
        if (!hasFollowingHalant && !hasFollowingMatra) {
          // Check if this consonant itself is a half consonant (preceded by halant)
          let isHalfConsonant = false;
          if (i > 0 && D.isHalant(chars[i - 1])) {
            isHalfConsonant = true;
          }

          if (!isHalfConsonant) {
            return true; // Has inherent vowel
          }
        }
      }
    }

    return false;
  }

  /**
   * Parses text into lines first, then syllables within each line
   * @param {string} text - Multi-line Devanagari text
   * @returns {Array<{line: string, lineIndex: number, syllables: Array}>}
   */
  function parseLines(text) {
    if (!text || typeof text !== 'string') return [];

    const lines = text.split(/\n/).filter(line => line.trim().length > 0);

    return lines.map((line, index) => ({
      line: line.trim(),
      lineIndex: index,
      syllables: parseSyllables(line.trim()),
    }));
  }

  /**
   * Counts total syllables in text
   * @param {string} text
   * @returns {number}
   */
  function countSyllables(text) {
    return parseSyllables(text).length;
  }

  /**
   * Counts syllables per line in multi-line text
   * @param {string} text
   * @returns {number[]}
   */
  function countSyllablesPerLine(text) {
    return parseLines(text).map(line => line.syllables.length);
  }

  /**
   * Checks if a character is a space
   * @param {string} char
   * @returns {boolean}
   */
  function isSpace(char) {
    return /\s/.test(char);
  }

  /**
   * Checks if a character is punctuation
   * @param {string} char
   * @returns {boolean}
   */
  function isPunctuation(char) {
    // Common punctuation in Devanagari text
    const punctuation = '।॥,;:!?.\'"()-[]{}…—–\n\r';
    return punctuation.includes(char);
  }

  /**
   * Gets detailed syllable information
   * @param {string} syllable - Single syllable text
   * @returns {Object} Detailed syllable analysis
   */
  function analyzeSyllable(syllable) {
    const chars = D.toCharArray(syllable);
    const analysis = {
      text: syllable,
      characters: chars,
      hasVowel: false,
      vowelType: null,
      vowelIsLong: false,
      hasHalant: false,
      hasAnusvara: false,
      hasVisarga: false,
      hasConjunct: false,
      hasNukta: false,
      isClosed: false,
      consonantCount: 0,
    };

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      if (D.isVowel(char)) {
        analysis.hasVowel = true;
        analysis.vowelType = 'independent';
        const info = D.getVowelInfo(char);
        if (info) analysis.vowelIsLong = info.long;
      }
      else if (D.isMatra(char)) {
        if (D.isHalant(char)) {
          analysis.hasHalant = true;
        } else {
          analysis.hasVowel = true;
          analysis.vowelType = 'matra';
          const info = D.getMatraInfo(char);
          if (info) analysis.vowelIsLong = info.long;
        }
      }
      else if (D.isAnusvara(char)) {
        analysis.hasAnusvara = true;
      }
      else if (D.isVisarga(char)) {
        analysis.hasVisarga = true;
      }
      else if (D.isNukta(char)) {
        analysis.hasNukta = true;
      }
      else if (D.isConsonant(char)) {
        analysis.consonantCount++;
        // Check for conjunct (consecutive consonants)
        if (i > 0) {
          const prev = chars[i - 1];
          if (D.isConsonant(prev) && !D.isHalant(prev)) {
            analysis.hasConjunct = true;
          }
        }
      }
    }

    // Check if syllable is closed (ends with halant)
    if (analysis.hasHalant) {
      analysis.isClosed = true;
    }

    // Check for inherent vowel (consonant without explicit vowel)
    if (!analysis.hasVowel && analysis.consonantCount > 0 && !analysis.hasHalant) {
      // Check if any consonant is NOT a half consonant
      let hasFullConsonant = false;
      for (let i = 0; i < chars.length; i++) {
        if (D.isConsonant(chars[i])) {
          let isHalf = false;
          if (i > 0 && D.isHalant(chars[i - 1])) {
            isHalf = true;
          }
          if (!isHalf) {
            hasFullConsonant = true;
            break;
          }
        }
      }
      if (hasFullConsonant) {
        analysis.hasVowel = true;
        analysis.vowelType = 'inherent';
        analysis.vowelIsLong = false;
      }
    }

    return analysis;
  }

  /**
   * Splits text into words (space-separated)
   * @param {string} text
   * @returns {Array<{word: string, syllables: Array}>}
   */
  function parseWords(text) {
    if (!text || typeof text !== 'string') return [];

    const words = text.split(/\s+/).filter(w => w.length > 0);

    return words.map(word => ({
      word: word,
      syllables: parseSyllables(word),
    }));
  }

  return {
    parseSyllables,
    parseLines,
    countSyllables,
    countSyllablesPerLine,
    analyzeSyllable,
    parseWords,
    isSpace,
    isPunctuation,
    hasVowelSound,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.SyllableParser = SyllableParser;
}
