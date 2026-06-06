/**
 * Mistake Detector
 * Identifies deviations from expected chhanda pattern
 * 
 * Instead of suggesting random word mutations, it reports:
 * - Position X expected Guru, found Laghu
 * - Position X expected Laghu, found Guru
 */

const MistakeDetector = (() => {
  /**
   * Identifies mistakes in a poem relative to a target chhanda
   * @param {Array<{line: string, sisi: string, syllables: Array}>} lines
   * @param {string} targetChhandaId
   * @returns {Array<{lineIndex: number, position: number, syllable: string, expected: 'S'|'I', actual: 'S'|'I', reason: string}>}
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
          // Generate a descriptive reason
          const reason = generateDeviationReason(syllable, targetWeight);

          mistakes.push({
            lineIndex: lineIdx,
            position: pos,
            globalPosition: lineIdx * pattern.perPada + pos,
            syllable: syllable.text,
            expected: targetWeight,
            actual: syllable.weight,
            reason: reason,
            syllableDetails: syllable,
          });
        }
      }
    }

    return mistakes;
  }

  /**
   * Generates a descriptive reason for a deviation
   * @param {Object} syllable - Syllable details
   * @param {string} expected - Expected weight ('S' or 'I')
   * @returns {string} Human-readable reason
   */
  function generateDeviationReason(syllable, expected) {
    if (expected === 'S') {
      // Expected Guru but found Laghu
      return `अक्षर "${syllable.text}" मा गुरु चाहिन्छ (${syllable.reason || 'लघु छ'})`;
    } else {
      // Expected Laghu but found Guru
      // Explain why the syllable is Guru
      const reasonMap = {
        'long_vowel': 'दीर्घ स्वर भएकाले गुरु छ',
        'anusvara': 'अनुस्वार भएकाले गुरु छ',
        'visarga': 'विसर्ग भएकाले गुरु छ',
        'closed_syllable_halant': 'हलन्त भएकाले गुरु छ',
        'conjunct_consonant': 'संयुक्ताक्षर भएकाले गुरु छ',
      };
      const detail = reasonMap[syllable.reason] || syllable.reason || 'गुरु छ';
      return `अक्षर "${syllable.text}" मा लघु चाहिन्छ (${detail})`;
    }
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
      summary: mistakes.length === 0
        ? 'कविता छन्द अनुसार छ!'
        : `${mistakes.length} स्थानमा भिन्नता: ${byType.guru_needed} मा गुरु चाहिन्छ, ${byType.laghu_needed} मा लघु चाहिन्छ`,
    };
  }

  /**
   * Gets deviation summary grouped by line
   * @param {Array} mistakes
   * @returns {Array<{lineIndex: number, deviations: Array}>}
   */
  function getDeviationsByLine(mistakes) {
    const grouped = {};

    mistakes.forEach(m => {
      if (!grouped[m.lineIndex]) {
        grouped[m.lineIndex] = {
          lineIndex: m.lineIndex,
          deviations: [],
        };
      }
      grouped[m.lineIndex].deviations.push({
        position: m.position,
        syllable: m.syllable,
        expected: m.expected,
        actual: m.actual,
        reason: m.reason,
      });
    });

    return Object.values(grouped);
  }

  return {
    detectMistakes,
    generateReport,
    getDeviationsByLine,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.MistakeDetector = MistakeDetector;
}
