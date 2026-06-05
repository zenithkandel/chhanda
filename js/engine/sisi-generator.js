/**
 * SISI Generator
 * Generates SISI (Guru-Laghu) codes from syllable weight analysis
 */

const SISIGenerator = (() => {
  /**
   * Generates SISI code from syllable weights
   * @param {Array<{text: string, weight: 'S'|'I'}>} syllables
   * @returns {string} e.g., "SSISIIS"
   * 
   * Example:
   * generateSISI([{text:"मे", weight:"S"}, {text:"रो", weight:"S"}]) → "SS"
   */
  function generateSISI(syllables) {
    if (!syllables || !Array.isArray(syllables)) return '';

    return syllables.map(s => s.weight || 'I').join('');
  }

  /**
   * Generates SISI code from raw text (full pipeline)
   * @param {string} text - Devanagari text
   * @returns {{sisi: string, syllables: Array}}
   * 
   * Example:
   * generateFromText("मेरो नाम") → {sisi: "SSSS", syllables: [...]}
   */
  function generateFromText(text) {
    const parsed = SyllableParser.parseSyllables(text);
    const classified = WeightClassifier.classifySyllables(parsed);
    const sisi = generateSISI(classified);

    return {
      sisi,
      syllables: classified,
    };
  }

  /**
   * Generates SISI code line by line
   * @param {string} text - Multi-line Devanagari text
   * @returns {Array<{line: string, lineIndex: number, sisi: string, syllables: Array}>}
   */
  function generateFromTextByLine(text) {
    const parsedLines = SyllableParser.parseLines(text);

    return parsedLines.map((lineData, index) => {
      const classified = WeightClassifier.classifySyllables(lineData.syllables);
      const sisi = generateSISI(classified);

      return {
        line: lineData.line,
        lineIndex: index,
        sisi,
        syllables: classified,
      };
    });
  }

  /**
   * Parses a SISI string into structured format
   * @param {string} sisi - e.g., "SSISIIS"
   * @returns {Array<{position: number, weight: 'S'|'I'}>}
   */
  function parseSISI(sisi) {
    if (!sisi || typeof sisi !== 'string') return [];

    return Array.from(sisi).map((char, index) => ({
      position: index,
      weight: char.toUpperCase() === 'S' ? 'S' : 'I',
    }));
  }

  /**
   * Splits SISI into padas (lines/quarters)
   * @param {string} sisi - Full SISI code
   * @param {number} syllablesPerPada - e.g., 8 for Gayatri
   * @returns {Array<string>} Array of per-pada SISI strings
   * 
   * Example:
   * splitIntoPadas("SSSSSSSSIIIIIIII", 8) → ["SSSSSSSS", "IIIIIIII"]
   */
  function splitIntoPadas(sisi, syllablesPerPada) {
    if (!sisi || !syllablesPerPada) return [sisi];

    const padas = [];
    for (let i = 0; i < sisi.length; i += syllablesPerPada) {
      padas.push(sisi.substring(i, i + syllablesPerPada));
    }
    return padas;
  }

  /**
   * Splits SISI code by line breaks (for multi-line poems)
   * @param {Array<{sisi: string}>} lines
   * @returns {string[]} Array of SISI per line
   */
  function splitByLines(lines) {
    if (!lines || !Array.isArray(lines)) return [];
    return lines.map(l => l.sisi);
  }

  /**
   * Validates SISI format
   * @param {string} sisi
   * @returns {{valid: boolean, errors: string[]}}
   */
  function validateSISI(sisi) {
    const errors = [];

    if (!sisi || typeof sisi !== 'string') {
      errors.push('SISI code is empty or invalid');
      return { valid: false, errors };
    }

    for (let i = 0; i < sisi.length; i++) {
      const char = sisi[i].toUpperCase();
      if (char !== 'S' && char !== 'I') {
        errors.push(`Invalid character '${sisi[i]}' at position ${i + 1}. Only S and I are allowed.`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Formats SISI code for display with color coding
   * @param {string} sisi
   * @returns {string} HTML string with spans for coloring
   */
  function formatSISIForDisplay(sisi) {
    if (!sisi) return '';

    return Array.from(sisi).map(char => {
      if (char.toUpperCase() === 'S') {
        return `<span class="s">S</span>`;
      } else {
        return `<span class="i">I</span>`;
      }
    }).join('');
  }

  /**
   * Formats SISI code with line breaks for display
   * @param {string} sisi
   * @param {number} syllablesPerLine
   * @returns {string} HTML string with line breaks
   */
  function formatSISIForDisplayByLine(sisi, syllablesPerLine) {
    if (!sisi) return '';

    const padas = splitIntoPadas(sisi, syllablesPerLine);
    return padas.map(pada => formatSISIForDisplay(pada)).join('<br>');
  }

  /**
   * Gets SISI statistics
   * @param {string} sisi
   * @returns {{total: number, guruCount: number, laghuCount: number, guruRatio: number, laghuRatio: number, totalMatras: number}}
   */
  function getSISIStats(sisi) {
    if (!sisi) return { total: 0, guruCount: 0, laghuCount: 0, guruRatio: 0, laghuRatio: 0, totalMatras: 0 };

    const chars = Array.from(sisi.toUpperCase());
    const guruCount = chars.filter(c => c === 'S').length;
    const laghuCount = chars.filter(c => c === 'I').length;
    const total = chars.length;

    return {
      total,
      guruCount,
      laghuCount,
      guruRatio: total > 0 ? guruCount / total : 0,
      laghuRatio: total > 0 ? laghuCount / total : 0,
      totalMatras: guruCount * 2 + laghuCount * 1,
    };
  }

  /**
   * Compares two SISI patterns and finds differences
   * @param {string} pattern1
   * @param {string} pattern2
   * @returns {{match: boolean, differences: Array<{position: number, inPattern1: string, inPattern2: string}>}}
   */
  function compareSISI(pattern1, pattern2) {
    const p1 = (pattern1 || '').toUpperCase();
    const p2 = (pattern2 || '').toUpperCase();

    const differences = [];
    const maxLen = Math.max(p1.length, p2.length);

    for (let i = 0; i < maxLen; i++) {
      const c1 = p1[i] || '';
      const c2 = p2[i] || '';

      if (c1 !== c2) {
        differences.push({
          position: i,
          inPattern1: c1,
          inPattern2: c2,
        });
      }
    }

    return {
      match: differences.length === 0 && p1.length === p2.length,
      differences,
    };
  }

  /**
   * Creates a template SISI pattern with placeholders
   * @param {number} length
   * @param {string} pattern - e.g., "SSI" to repeat
   * @returns {string}
   */
  function createTemplate(length, pattern) {
    if (!pattern) pattern = 'I';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += pattern[i % pattern.length];
    }
    return result;
  }

  return {
    generateSISI,
    generateFromText,
    generateFromTextByLine,
    parseSISI,
    splitIntoPadas,
    splitByLines,
    validateSISI,
    formatSISIForDisplay,
    formatSISIForDisplayByLine,
    getSISIStats,
    compareSISI,
    createTemplate,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.SISIGenerator = SISIGenerator;
}
