/**
 * Syllable Display Component
 * Visual rendering of syllables with color coding
 */

const SyllableDisplay = (() => {
  /**
   * Renders syllables with color coding
   * @param {Array<{text: string, weight: 'S'|'I'}>} syllables
   * @param {Object} options - { showLabels: true, showTooltip: true, size: 'normal' }
   * @returns {string} HTML string
   */
  function render(syllables, options = {}) {
    const { showLabels = true, showTooltip = true, size = 'normal' } = options;

    return syllables.map((s, i) => {
      const weightClass = s.weight === 'S' ? 'syllable-guru' : 'syllable-laghu';
      const weightLabel = s.weight === 'S' ? 'S' : 'I';
      const tooltip = showTooltip ? `title="${s.text}: ${s.weight === 'S' ? 'गुरु (Heavy)' : 'लघु (Light)'}"` : '';
      const sizeClass = size === 'small' ? 'text-sm' : size === 'large' ? 'text-xl' : '';

      return `<span class="syllable ${weightClass} ${sizeClass}" ${tooltip} data-index="${i}">
        ${s.text}${showLabels ? `<span class="syllable-label">${weightLabel}</span>` : ''}
      </span>`;
    }).join('');
  }

  /**
   * Renders syllables for a single line
   * @param {string} line - Text line
   * @param {Object} options
   * @returns {string} HTML string
   */
  function renderLine(line, options = {}) {
    const parsed = SyllableParser.parseSyllables(line);
    const classified = WeightClassifier.classifySyllables(parsed);
    return render(classified, options);
  }

  /**
   * Renders SISI code with color coding
   * @param {string} sisi
   * @returns {string} HTML string
   */
  function renderSISI(sisi) {
    return SISIGenerator.formatSISIForDisplay(sisi);
  }

  /**
   * Renders SISI code with line breaks
   * @param {string} sisi
   * @param {number} syllablesPerLine
   * @returns {string} HTML string
   */
  function renderSISIByLine(sisi, syllablesPerLine) {
    return SISIGenerator.formatSISIForDisplayByLine(sisi, syllablesPerLine);
  }

  /**
   * Renders a complete analysis view for a line
   * @param {string} line
   * @param {string} sisi
   * @returns {string} HTML string
   */
  function renderAnalysisLine(line, sisi) {
    const parsed = SyllableParser.parseSyllables(line);
    const classified = WeightClassifier.classifySyllables(parsed);

    return `
      <div class="analysis-line">
        <div class="analysis-text font-devanagari">${line}</div>
        <div class="analysis-syllables">${render(classified, { showLabels: true })}</div>
        <div class="analysis-sisi font-mono">${renderSISI(sisi)}</div>
      </div>
    `;
  }

  /**
   * Renders a rhythm visualization
   * @param {string} sisi
   * @param {Object} options
   * @returns {string} HTML string
   */
  function renderRhythm(sisi, options = {}) {
    const { width = 400, height = 60 } = options;
    const chars = Array.from(sisi.toUpperCase());
    const beatWidth = width / chars.length;

    let svgContent = '';
    chars.forEach((char, i) => {
      const x = i * beatWidth;
      const isGuru = char === 'S';
      const barHeight = isGuru ? height * 0.8 : height * 0.4;
      const y = height - barHeight;
      const color = isGuru ? '#dc2626' : '#16a34a';

      svgContent += `<rect x="${x + 2}" y="${y}" width="${beatWidth - 4}" height="${barHeight}" fill="${color}" rx="2"/>`;
      svgContent += `<text x="${x + beatWidth / 2}" y="${height - 5}" text-anchor="middle" font-size="10" fill="#666">${char}</text>`;
    });

    return `
      <svg class="rhythm-visualizer" viewBox="0 0 ${width} ${height}" style="width: 100%; max-width: ${width}px;">
        ${svgContent}
      </svg>
    `;
  }

  /**
   * Renders syllable statistics
   * @param {Array} syllables
   * @returns {string} HTML string
   */
  function renderStats(syllables) {
    const classified = WeightClassifier.classifySyllables(syllables);
    const guruCount = classified.filter(s => s.weight === 'S').length;
    const laghuCount = classified.filter(s => s.weight === 'I').length;
    const total = classified.length;
    const totalMatras = guruCount * 2 + laghuCount;

    return `
      <div class="syllable-stats flex gap-4">
        <div class="stat">
          <span class="stat-label text-muted text-sm">Total Syllables</span>
          <span class="stat-value font-bold text-lg">${total}</span>
        </div>
        <div class="stat">
          <span class="stat-label text-muted text-sm">Guru (S)</span>
          <span class="stat-value font-bold text-lg text-danger">${guruCount}</span>
        </div>
        <div class="stat">
          <span class="stat-label text-muted text-sm">Laghu (I)</span>
          <span class="stat-value font-bold text-lg text-success">${laghuCount}</span>
        </div>
        <div class="stat">
          <span class="stat-label text-muted text-sm">Total Mātrās</span>
          <span class="stat-value font-bold text-lg">${totalMatras}</span>
        </div>
      </div>
    `;
  }

  return {
    render,
    renderLine,
    renderSISI,
    renderSISIByLine,
    renderAnalysisLine,
    renderRhythm,
    renderStats,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.SyllableDisplay = SyllableDisplay;
}
