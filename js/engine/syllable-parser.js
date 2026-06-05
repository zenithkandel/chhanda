/**
 * Syllable Parser
 * Breaks Devanagari text into individual syllables for prosodic analysis
 */

const SyllableParser = (() => {
  const D = window.DewanagariUtils;

  /**
   * Parses Devanagari text into syllables
   * @param {string} text - Devanagari text input
   * @returns {Array<{text: string, index: number, start: number, end: number}>}
   * 
   * Example: "मेरो नाम" → [{text:"मे"}, {text:"रो"}, {text:"ना"}, {text:"म"}]
   */
  function parseSyllables(text) {
    if (!text || typeof text !== 'string') return [];

    const chars = D.toCharArray(text);
    const syllables = [];
    let currentSyllable = '';
    let syllableIndex = 0;
    let charPosition = 0;

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const code = D.codePoint(char);

      // Skip spaces and punctuation - they are word/syllable boundaries
      if (isSpace(char) || isPunctuation(char)) {
        if (currentSyllable) {
          syllables.push({
            text: currentSyllable,
            index: syllableIndex,
            start: charPosition,
            end: charPosition + currentSyllable.length,
          });
          syllableIndex++;
          currentSyllable = '';
          charPosition = i + 1;
        }
        continue;
      }

      // If we have a current syllable and encounter a new vowel (independent form)
      // that's a syllable boundary
      if (currentSyllable && D.isVowel(char)) {
        // Check if previous syllable ended properly
        syllables.push({
          text: currentSyllable,
          index: syllableIndex,
          start: charPosition,
          end: charPosition + currentSyllable.length,
        });
        syllableIndex++;
        currentSyllable = char;
        charPosition = i;
        continue;
      }

      // If we have a current syllable and encounter a new consonant
      if (currentSyllable && D.isConsonant(char)) {
        // Check if previous character was a halant
        // If so, this consonant starts a new syllable (it has inherent vowel)
        const prevChar = currentSyllable[currentSyllable.length - 1];
        if (D.isHalant(prevChar)) {
          syllables.push({
            text: currentSyllable,
            index: syllableIndex,
            start: charPosition,
            end: charPosition + currentSyllable.length,
          });
          syllableIndex++;
          currentSyllable = char;
          charPosition = i;
          continue;
        }
        // Otherwise, this consonant might be part of a conjunct or just the next syllable
        // We need to check if this is the start of a new syllable
        // Simple heuristic: if we have a vowel/consonant+vowel, and this is a fresh consonant
        if (currentSyllable.length > 0 && hasCompleteVowel(currentSyllable)) {
          syllables.push({
            text: currentSyllable,
            index: syllableIndex,
            start: charPosition,
            end: charPosition + currentSyllable.length,
          });
          syllableIndex++;
          currentSyllable = char;
          charPosition = i;
          continue;
        }
      }

      // Default: add character to current syllable
      currentSyllable += char;
    }

    // Don't forget the last syllable
    if (currentSyllable) {
      syllables.push({
        text: currentSyllable,
        index: syllableIndex,
        start: charPosition,
        end: charPosition + currentSyllable.length,
      });
    }

    return syllables;
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
   * Checks if a syllable string has a complete vowel (open syllable)
   * Used to determine syllable boundaries
   * @param {string} syllable
   * @returns {boolean}
   */
  function hasCompleteVowel(syllable) {
    if (!syllable) return false;

    const chars = D.toCharArray(syllable);

    for (const char of chars) {
      // Independent vowel = complete vowel
      if (D.isVowel(char)) return true;

      // Matra = complete vowel
      if (D.isMatra(char) && !D.isHalant(char)) return true;
    }

    // Consonant with inherent vowel (no halant, no matra after it)
    // Check if last char is consonant without halant
    if (chars.length > 0) {
      const lastChar = chars[chars.length - 1];
      if (D.isConsonant(lastChar)) {
        // Check if there's a halant anywhere
        const hasHalant = chars.some(c => D.isHalant(c));
        if (!hasHalant) return true; // Inherent vowel
      }
    }

    return false;
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
      vowelType: null,      // 'independent', 'matra', 'inherent', or null
      vowelIsLong: false,
      hasHalant: false,
      hasAnusvara: false,
      hasVisarga: false,
      hasConjunct: false,
      hasNukta: false,
      isClosed: false,       // Ends with consonant closure
      consonantCount: 0,
    };

    let lastWasConsonant = false;

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      if (D.isVowel(char)) {
        analysis.hasVowel = true;
        analysis.vowelType = 'independent';
        const info = D.getVowelInfo(char);
        if (info) analysis.vowelIsLong = info.long;
        lastWasConsonant = false;
      }
      else if (D.isMatra(char)) {
        if (D.isHalant(char)) {
          analysis.hasHalant = true;
          lastWasConsonant = false;
        } else {
          analysis.hasVowel = true;
          analysis.vowelType = 'matra';
          const info = D.getMatraInfo(char);
          if (info) analysis.vowelIsLong = info.long;
          lastWasConsonant = false;
        }
      }
      else if (D.isAnusvara(char)) {
        analysis.hasAnusvara = true;
        lastWasConsonant = false;
      }
      else if (D.isVisarga(char)) {
        analysis.hasVisarga = true;
        lastWasConsonant = false;
      }
      else if (D.isNukta(char)) {
        analysis.hasNukta = true;
        lastWasConsonant = false;
      }
      else if (D.isConsonant(char)) {
        analysis.consonantCount++;
        if (lastWasConsonant) {
          analysis.hasConjunct = true;
        }
        lastWasConsonant = true;
      }
      else {
        lastWasConsonant = false;
      }
    }

    // Check if syllable is closed (ends with halant or after halant)
    if (analysis.hasHalant) {
      analysis.isClosed = true;
    }

    // Check for inherent vowel (consonant without halant or matra)
    if (!analysis.hasVowel && analysis.consonantCount > 0 && !analysis.hasHalant) {
      analysis.hasVowel = true;
      analysis.vowelType = 'inherent';
      analysis.vowelIsLong = false; // Inherent 'अ' is short
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
    hasCompleteVowel,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.SyllableParser = SyllableParser;
}
