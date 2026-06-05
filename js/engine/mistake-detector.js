/**
 * Mistake Detector
 * Identifies deviations from expected chhanda pattern and suggests corrections
 */

const MistakeDetector = (() => {
  const D = window.DewanagariUtils;

  // Alternative syllables for common corrections
  const ALTERNATIVES = {
    // Short → Long alternatives
    'क': ['का'],
    'ख': ['खा'],
    'ग': ['गा'],
    'घ': ['घा'],
    'ङ': ['ङा'],
    'च': ['चा'],
    'छ': ['छा'],
    'ज': ['जा'],
    'झ': ['झा'],
    'ञ': ['ञा'],
    'ट': ['टा'],
    'ठ': ['ठा'],
    'ड': ['डा'],
    'ढ': ['ढा'],
    'ण': ['णा'],
    'त': ['ता'],
    'थ': ['था'],
    'द': ['दा'],
    'ध': ['धा'],
    'न': ['ना'],
    'प': ['पा'],
    'फ': ['फा'],
    'ब': ['बा'],
    'भ': ['भा'],
    'म': ['मा'],
    'य': ['या'],
    'र': ['रा'],
    'ल': ['ला'],
    'व': ['वा'],
    'श': ['शा'],
    'ष': ['षा'],
    'स': ['सा'],
    'ह': ['हा'],

    // Long → Short alternatives (using halant)
    'का': ['क्'],
    'खा': ['ख्'],
    'गा': ['ग्'],
    'घा': ['घ्'],
    'चा': ['च्'],
    'जा': ['ज्'],
    'टा': ['ट्'],
    'डा': ['ड्'],
    'ता': ['त्'],
    'दा': ['द्'],
    'पा': ['प्'],
    'बा': ['ब्'],
    'मा': ['म्'],
    'या': ['य्'],
    'रा': ['र्'],
    'ला': ['ल्'],
    'वा': ['व्'],
    'शा': ['श्'],
    'सा': ['स्'],
    'हा': ['ह्'],

    // With vowel signs
    'कि': ['की'],
    'कु': ['कू'],
    'के': ['कै'],
    'को': ['कौ'],
    'कै': ['को'],
    'कौ': ['को'],
  };

  /**
   * Identifies mistakes in a poem relative to a target chhanda
   * @param {Array<{line: string, sisi: string, syllables: Array}>} lines
   * @param {string} targetChhandaId
   * @returns {Array<{lineIndex: number, position: number, syllable: string, expected: 'S'|'I', actual: 'S'|'I', suggestion: string, reason: string}>}
   */
  function detectMistakes(lines, targetChhandaId) {
    const pattern = ChhandasData.getSISIPattern(targetChhandaId);
    if (!pattern) return [];

    const mistakes = [];
    const targetPatterns = pattern.patterns || [pattern.pattern];

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      const sisi = line.sisi.toUpperCase();
      const syllables = line.syllables || SyllableParser.parseSyllables(line.line);
      const classified = line.classified || WeightClassifier.classifySyllables(syllables);

      // Get best matching target pattern for this line
      let bestTarget = targetPatterns[0];
      let bestDeviations = Infinity;

      for (const target of targetPatterns) {
        const comparison = SISIGenerator.compareSISI(sisi, target.substring(0, sisi.length));
        if (comparison.differences.length < bestDeviations) {
          bestDeviations = comparison.differences.length;
          bestTarget = target;
        }
      }

      // Check each syllable against target
      for (let pos = 0; pos < classified.length; pos++) {
        const syllable = classified[pos];
        const targetWeight = bestTarget[pos % bestTarget.length];

        if (syllable.weight !== targetWeight) {
          const suggestion = suggestCorrection(syllable.text, targetWeight);

          mistakes.push({
            lineIndex: lineIdx,
            position: pos,
            globalPosition: lineIdx * pattern.perPada + pos,
            syllable: syllable.text,
            expected: targetWeight,
            actual: syllable.weight,
            suggestion: suggestion.alternative,
            reason: suggestion.reason,
            syllableDetails: syllable,
          });
        }
      }
    }

    return mistakes;
  }

  /**
   * Suggests minimal corrections to fit a target weight
   * @param {string} syllable - The problematic syllable
   * @param {'S'|'I'} targetWeight - What weight is needed
   * @returns {{alternative: string, weight: 'S'|'I', reason: string, difficulty: 'easy'|'medium'|'hard'}}
   */
  function suggestCorrection(syllable, targetWeight) {
    const current = WeightClassifier.classifyWeight(syllable);

    // Already correct
    if (current.weight === targetWeight) {
      return {
        alternative: syllable,
        weight: current.weight,
        reason: 'Already correct',
        difficulty: 'easy',
      };
    }

    // Need to change weight
    const chars = D.toCharArray(syllable);
    const lastChar = chars[chars.length - 1];

    if (targetWeight === 'S') {
      // Need Guru: Add length or closure
      return suggestMakeGuru(syllable, chars, lastChar);
    } else {
      // Need Laghu: Remove length or closure
      return suggestMakeLaghu(syllable, chars, lastChar);
    }
  }

  /**
   * Suggests how to make a syllable Guru
   */
  function suggestMakeGuru(syllable, chars, lastChar) {
    // If last char is a consonant with inherent vowel, add ā matra
    if (D.isConsonant(lastChar)) {
      const hasHalant = chars.some(c => D.isHalant(c));
      const hasMatra = chars.some(c => D.isMatra(c) && !D.isHalant(c));

      if (!hasHalant && !hasMatra) {
        // Add ā matra to make it long
        return {
          alternative: syllable + 'ा',
          weight: 'S',
          reason: 'Add ा (long ā) to make syllable heavy',
          difficulty: 'easy',
        };
      }

      // If has halant, remove it to get inherent vowel, then check
      if (hasHalant) {
        return {
          alternative: syllable.replace('्', ''),
          weight: 'S',
          reason: 'Remove halant to restore inherent vowel',
          difficulty: 'easy',
        };
      }
    }

    // If last char is a vowel sign (short), replace with long version
    if (D.isMatra(lastChar) && !D.isLongMatra(lastChar)) {
      const matraInfo = D.getMatraInfo(lastChar);
      if (matraInfo) {
        // Try to find long alternative
        const longAlternatives = {
          '\u093F': '\u0940', // ि → ी
          '\u0941': '\u0942', // ु → ू
        };
        if (longAlternatives[lastChar]) {
          const newSyllable = syllable.slice(0, -1) + longAlternatives[lastChar];
          return {
            alternative: newSyllable,
            weight: 'S',
            reason: 'Replace short vowel with long vowel',
            difficulty: 'medium',
          };
        }
      }
    }

    // If has anusvāra or visarga, it's already Guru
    if (chars.some(c => D.isAnusvara(c) || D.isVisarga(c))) {
      return {
        alternative: syllable,
        weight: 'S',
        reason: 'Already Guru (has anusvāra/visarga)',
        difficulty: 'easy',
      };
    }

    // Add anusvāra as last resort
    return {
      alternative: syllable + 'ं',
      weight: 'S',
      reason: 'Add anusvāra to make syllable heavy',
      difficulty: 'medium',
    };
  }

  /**
   * Suggests how to make a syllable Laghu
   */
  function suggestMakeLaghu(syllable, chars, lastChar) {
    // If has anusvāra, remove it
    if (D.isAnusvara(lastChar)) {
      return {
        alternative: syllable.slice(0, -1),
        weight: 'I',
        reason: 'Remove anusvāra',
        difficulty: 'easy',
      };
    }

    // If has visarga, remove it
    if (D.isVisarga(lastChar)) {
      return {
        alternative: syllable.slice(0, -1),
        weight: 'I',
        reason: 'Remove visarga',
        difficulty: 'easy',
      };
    }

    // If has long vowel matra, replace with short
    if (D.isMatra(lastChar) && D.isLongMatra(lastChar)) {
      const longToShort = {
        '\u093E': null,  // ा → remove (inherent short)
        '\u0940': '\u093F', // ी → ि
        '\u0942': '\u0941', // ू → ु
        '\u0947': null,  // े → remove
        '\u0948': null,  // ै → remove
        '\u094B': null,  // ो → remove
        '\u094C': null,  // ौ → remove
      };

      if (longToShort[lastChar] === null) {
        return {
          alternative: syllable.slice(0, -1),
          weight: 'I',
          reason: 'Remove long vowel sign to get short inherent vowel',
          difficulty: 'easy',
        };
      } else if (longToShort[lastChar]) {
        return {
          alternative: syllable.slice(0, -1) + longToShort[lastChar],
          weight: 'I',
          reason: 'Replace long vowel with short vowel',
          difficulty: 'medium',
        };
      }
    }

    // If has halant (closed syllable), remove it
    if (D.isHalant(lastChar)) {
      return {
        alternative: syllable.slice(0, -1),
        weight: 'I',
        reason: 'Remove halant to open the syllable',
        difficulty: 'easy',
      };
    }

    // If has independent long vowel, use short version
    for (const [code, info] of Object.entries(D.VOWELS)) {
      if (syllable === info.name && info.long) {
        // Find short counterpart
        const shortVowels = {
          '\u0906': '\u0905', // आ → अ
          '\u0908': '\u0907', // ई → इ
          '\u090A': '\u0909', // ऊ → उ
          '\u090F': '\u0905', // ए → अ (approximate)
          '\u0910': '\u0905', // ऐ → अ (approximate)
          '\u0913': '\u0905', // ओ → अ (approximate)
          '\u0914': '\u0905', // औ → अ (approximate)
        };
        if (shortVowels[code]) {
          return {
            alternative: shortVowels[code],
            weight: 'I',
            reason: 'Replace long vowel with short vowel',
            difficulty: 'easy',
          };
        }
      }
    }

    return {
      alternative: syllable,
      weight: 'I',
      reason: 'Consider using a shorter vowel',
      difficulty: 'hard',
    };
  }

  /**
   * Generates a mistake report for display
   * @param {Array} mistakes
   * @returns {Object} Formatted report
   */
  function generateReport(mistakes) {
    if (!mistakes || mistakes.length === 0) {
      return {
        total: 0,
        byLine: {},
        byType: {},
        summary: 'No mistakes found!',
      };
    }

    const byLine = {};
    const byType = { guru_needed: 0, laghu_needed: 0 };

    mistakes.forEach(m => {
      if (!byLine[m.lineIndex]) {
        byLine[m.lineIndex] = [];
      }
      byLine[m.lineIndex].push(m);

      if (m.expected === 'S') {
        byType.guru_needed++;
      } else {
        byType.laghu_needed++;
      }
    });

    return {
      total: mistakes.length,
      byLine,
      byType,
      summary: `Found ${mistakes.length} deviation(s): ${byType.guru_needed} need Guru, ${byType.laghu_needed} need Laghu`,
    };
  }

  /**
   * Gets correction suggestions grouped by line
   * @param {Array} mistakes
   * @returns {Array<{lineIndex: number, corrections: Array}>}
   */
  function getCorrectionsByLine(mistakes) {
    const grouped = {};

    mistakes.forEach(m => {
      if (!grouped[m.lineIndex]) {
        grouped[m.lineIndex] = {
          lineIndex: m.lineIndex,
          corrections: [],
        };
      }
      grouped[m.lineIndex].corrections.push({
        position: m.position,
        syllable: m.syllable,
        expected: m.expected,
        actual: m.actual,
        suggestion: m.suggestion,
        reason: m.reason,
      });
    });

    return Object.values(grouped);
  }

  return {
    detectMistakes,
    suggestCorrection,
    generateReport,
    getCorrectionsByLine,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.MistakeDetector = MistakeDetector;
}
