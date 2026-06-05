/**
 * Weight Classifier
 * Determines whether a syllable is Guru (S/Heavy) or Laghu (I/Light)
 * Based on classical Sanskrit prosody rules
 */

const WeightClassifier = (() => {
  const D = window.DewanagariUtils;

  // Short vowels - naturally Laghu
  const SHORT_VOWELS = ['\u0905', '\u0907', '\u0909', '\u090B', '\u090C']; // अ इ उ ऋ ऌ

  // Long vowels - naturally Guru
  const LONG_VOWELS = ['\u0906', '\u0908', '\u090A', '\u090F', '\u0910', '\u0913', '\u0914']; // आ ई ऊ ए ऐ ओ औ

  // Short vowel matras
  const SHORT_MATRAS = ['\u093F', '\u0941', '\u0943']; // ि ु ृ

  // Long vowel matras
  const LONG_MATRAS = ['\u093E', '\u0940', '\u0942', '\u0947', '\u0948', '\u094B', '\u094C']; // ा ी ू े ै ो ौ

  /**
   * Main classification function
   * Determines if a syllable is Guru (S) or Laghu (I)
   * 
   * @param {string} syllable - Single syllable in Devanagari
   * @returns {{weight: 'S'|'I', reason: string, details: Object}}
   * 
   * Examples:
   * classifyWeight("ना") → {weight: 'S', reason: 'long_vowel_आ'}
   * classifyWeight("म") → {weight: 'I', reason: 'short_vowel_inherent_अ'}
   * classifyWeight("अन्त") → {weight: 'S', reason: 'closed_syllable_halant'}
   */
  function classifyWeight(syllable) {
    if (!syllable || typeof syllable !== 'string') {
      return { weight: 'I', reason: 'empty_input', details: {} };
    }

    const chars = D.toCharArray(syllable);
    const analysis = {
      text: syllable,
      hasLongVowel: false,
      hasShortVowel: false,
      vowelType: null,
      hasHalant: false,
      hasAnusvara: false,
      hasVisarga: false,
      hasConjunct: false,
      isClosed: false,
    };

    // Step 1: Analyze the syllable structure
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      // Check for independent vowels
      if (D.isVowel(char)) {
        if (LONG_VOWELS.includes(char)) {
          analysis.hasLongVowel = true;
          analysis.vowelType = 'independent_long';
        } else if (SHORT_VOWELS.includes(char)) {
          analysis.hasShortVowel = true;
          analysis.vowelType = 'independent_short';
        }
      }

      // Check for vowel signs (matras)
      else if (D.isMatra(char)) {
        if (D.isHalant(char)) {
          analysis.hasHalant = true;
        } else if (LONG_MATRAS.includes(char)) {
          analysis.hasLongVowel = true;
          analysis.vowelType = 'matra_long';
        } else if (SHORT_MATRAS.includes(char)) {
          analysis.hasShortVowel = true;
          analysis.vowelType = 'matra_short';
        }
      }

      // Check for anusvāra
      else if (D.isAnusvara(char)) {
        analysis.hasAnusvara = true;
      }

      // Check for visarga
      else if (D.isVisarga(char)) {
        analysis.hasVisarga = true;
      }

      // Check for consonants (for conjunct detection)
      else if (D.isConsonant(char)) {
        // We'll check conjuncts separately
      }
    }

    // Check for conjunct consonants (consecutive consonants without halant between them)
    let consecutiveConsonants = 0;
    for (let i = 0; i < chars.length; i++) {
      if (D.isConsonant(chars[i])) {
        consecutiveConsonants++;
        if (consecutiveConsonants >= 2) {
          // Check if there's a halant between them
          let hasHalantBetween = false;
          for (let j = i - consecutiveConsonants + 1; j < i; j++) {
            if (D.isHalant(chars[j])) {
              hasHalantBetween = true;
              break;
            }
          }
          if (!hasHalantBetween) {
            analysis.hasConjunct = true;
            break;
          }
        }
      } else if (!D.isNukta(chars[i])) {
        consecutiveConsonants = 0;
      }
    }

    // Check if syllable is closed (ends with halant)
    if (analysis.hasHalant) {
      analysis.isClosed = true;
    }

    // Step 2: Apply classification rules (priority order)

    // Rule 1: Long vowel → Guru
    if (analysis.hasLongVowel) {
      return {
        weight: 'S',
        reason: `long_vowel_${analysis.vowelType}`,
        details: analysis,
      };
    }

    // Rule 2: Anusvāra → Guru
    if (analysis.hasAnusvara) {
      return {
        weight: 'S',
        reason: 'anusvara',
        details: analysis,
      };
    }

    // Rule 3: Visarga → Guru
    if (analysis.hasVisarga) {
      return {
        weight: 'S',
        reason: 'visarga',
        details: analysis,
      };
    }

    // Rule 4: Closed syllable (halant) → Guru
    if (analysis.isClosed) {
      return {
        weight: 'S',
        reason: 'closed_syllable_halant',
        details: analysis,
      };
    }

    // Rule 5: Conjunct consonant → Guru
    if (analysis.hasConjunct) {
      return {
        weight: 'S',
        reason: 'conjunct_consonant',
        details: analysis,
      };
    }

    // Rule 6: Short vowel (open syllable) → Laghu
    if (analysis.hasShortVowel) {
      return {
        weight: 'I',
        reason: `short_vowel_${analysis.vowelType}`,
        details: analysis,
      };
    }

    // Rule 7: Inherent vowel (consonant alone) → Laghu (short अ)
    // Check if syllable is just a consonant with no explicit vowel marking
    const hasAnyVowelMarking = analysis.hasLongVowel || analysis.hasShortVowel ||
                                analysis.hasHalant || analysis.hasAnusvara || analysis.hasVisarga;

    if (!hasAnyVowelMarking && chars.length > 0) {
      // Check if all characters are consonants (possibly with nukta)
      const allConsonants = chars.every(c => D.isConsonant(c) || D.isNukta(c));
      if (allConsonants) {
        // Inherent vowel अ (short) → Laghu
        return {
          weight: 'I',
          reason: 'inherent_short_vowel_अ',
          details: analysis,
        };
      }
    }

    // Default: Laghu (short vowel assumed)
    return {
      weight: 'I',
      reason: 'default_short',
      details: analysis,
    };
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
   * Gets detailed explanation for weight classification
   * @param {string} syllable
   * @returns {string} Human-readable explanation
   */
  function explainClassification(syllable) {
    const result = classifyWeight(syllable);
    const weightName = result.weight === 'S' ? 'गुरु (Guru/Heavy)' : 'लघु (Laghu/Light)';

    let explanation = `"${syllable}" is classified as ${weightName}.\n`;
    explanation += `Reason: ${result.reason}\n`;

    if (result.details.hasLongVowel) {
      explanation += `- Contains a long vowel\n`;
    }
    if (result.details.hasShortVowel) {
      explanation += `- Contains a short vowel\n`;
    }
    if (result.details.hasHalant) {
      explanation += `- Contains halant (closing consonant)\n`;
    }
    if (result.details.hasAnusvara) {
      explanation += `- Contains anusvāra\n`;
    }
    if (result.details.hasVisarga) {
      explanation += `- Contains visarga\n`;
    }
    if (result.details.hasConjunct) {
      explanation += `- Contains conjunct consonant\n`;
    }

    return explanation;
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
    explainClassification,
    isGuru,
    isLaghu,
    getMatraCount,
    totalMatras,
    SHORT_VOWELS,
    LONG_VOWELS,
    SHORT_MATRAS,
    LONG_MATRAS,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.WeightClassifier = WeightClassifier;
}
