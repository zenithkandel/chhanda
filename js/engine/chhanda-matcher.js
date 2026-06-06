/**
 * Chhanda Matcher
 * Matches SISI patterns against known chhandas
 */

const ChhandaMatcher = (() => {
  /**
   * Matches a SISI pattern against all known chhandas
   * Uses all lines for matching, not just one
   * @param {string} sisi - Generated SISI code from input
   * @param {number} syllablesPerPada - Detected syllables per line
   * @returns {Array<{chhandaId: string, confidence: number, matchedPadas: number, totalPadas: number, details: Object}>}
   */
  function matchChhanda(sisi, syllablesPerPada) {
    const chhandas = ChhandasData.getAll();
    const results = [];

    for (const chhanda of chhandas) {
      const pattern = ChhandasData.getSISIPattern(chhanda.id);
      if (!pattern) continue;

      // Check if syllable count matches
      if (pattern.perPada !== syllablesPerPada) continue;

      const matchResult = matchSpecific(sisi, chhanda.id);
      if (matchResult.confidence > 0) {
        results.push({
          chhandaId: chhanda.id,
          chhandaName: chhanda.name,
          confidence: matchResult.confidence,
          matchedPadas: matchResult.matchedPadas,
          totalPadas: matchResult.totalPadas,
          deviations: matchResult.deviations,
          details: matchResult,
        });
      }
    }

    // Sort by confidence (highest first)
    results.sort((a, b) => b.confidence - a.confidence);

    return results;
  }

  /**
   * Matches a multi-line poem against all known chhandas
   * Tries each line and returns the best overall match
   * @param {Array<{sisi: string, syllableCount: number}>} lineResults
   * @returns {Array<{chhandaId: string, confidence: number, ...}>}
   */
  function matchPoemLines(lineResults) {
    const chhandas = ChhandasData.getAll();
    const results = [];

    // Group lines by syllable count
    const byCount = {};
    lineResults.forEach(lr => {
      const count = lr.syllableCount;
      if (!byCount[count]) byCount[count] = [];
      byCount[count].push(lr.sisi);
    });

    for (const chhanda of chhandas) {
      const pattern = ChhandasData.getSISIPattern(chhanda.id);
      if (!pattern) continue;

      const linesForCount = byCount[pattern.perPada];
      if (!linesForCount || linesForCount.length === 0) continue;

      // Try each line's SISI and pick the best match
      let bestConfidence = 0;
      let bestResult = null;

      for (const sisi of linesForCount) {
        const matchResult = matchSpecific(sisi, chhanda.id);
        if (matchResult.confidence > bestConfidence) {
          bestConfidence = matchResult.confidence;
          bestResult = matchResult;
        }
      }

      if (bestResult && bestConfidence > 0) {
        // Calculate how many lines match overall
        let matchingLines = 0;
        let totalDeviations = 0;
        for (const sisi of linesForCount) {
          const r = matchSpecific(sisi, chhanda.id);
          if (r.deviations.length === 0) matchingLines++;
          totalDeviations += r.deviations.length;
        }

        results.push({
          chhandaId: chhanda.id,
          chhandaName: chhanda.name,
          confidence: bestConfidence,
          matchedPadas: bestResult.matchedPadas,
          totalPadas: bestResult.totalPadas,
          deviations: bestResult.deviations,
          matchingLines,
          totalLines: linesForCount.length,
          totalDeviations,
          details: bestResult,
        });
      }
    }

    // Sort by: most matching lines first, then by confidence
    results.sort((a, b) => {
      if (a.matchingLines !== b.matchingLines) return b.matchingLines - a.matchingLines;
      return b.confidence - a.confidence;
    });

    return results;
  }

  /**
   * Matches a SISI pattern against a specific chhanda
   * @param {string} sisi - Input SISI
   * @param {string} chhandaId - Target chhanda
   * @returns {{match: boolean, confidence: number, matchedPadas: number, totalPadas: number, deviations: Array}}
   */
  function matchSpecific(sisi, chhandaId) {
    const pattern = ChhandasData.getSISIPattern(chhandaId);
    if (!pattern) {
      return { match: false, confidence: 0, matchedPadas: 0, totalPadas: 0, deviations: [] };
    }

    const targetPatterns = pattern.patterns || [pattern.pattern];
    const sisiUpper = sisi.toUpperCase();
    const padas = SISIGenerator.splitIntoPadas(sisiUpper, pattern.perPada);

    let matchedPadas = 0;
    const allDeviations = [];

    for (let i = 0; i < padas.length; i++) {
      const pada = padas[i];
      let bestMatch = null;
      let bestDeviations = [];

      // Try each possible pattern for this pada
      for (const targetPattern of targetPatterns) {
        const comparison = SISIGenerator.compareSISI(pada, targetPattern.substring(0, pada.length));
        if (!bestMatch || comparison.differences.length < bestDeviations.length) {
          bestMatch = targetPattern;
          bestDeviations = comparison.differences;
        }
      }

      if (bestDeviations.length === 0) {
        matchedPadas++;
      } else {
        // Record deviations with position offset
        bestDeviations.forEach(dev => {
          allDeviations.push({
            pada: i,
            position: dev.position + (i * pattern.perPada),
            padaPosition: dev.position,
            expected: dev.inPattern2,
            actual: dev.inPattern1,
          });
        });
      }
    }

    const totalPadas = Math.max(padas.length, pattern.padas);
    const confidence = totalPadas > 0 ? (matchedPadas / totalPadas) * 100 : 0;

    return {
      match: matchedPadas === totalPadas,
      confidence,
      matchedPadas,
      totalPadas,
      deviations: allDeviations,
    };
  }

  /**
   * Calculates similarity score between two SISI patterns
   * @param {string} pattern1
   * @param {string} pattern2
   * @returns {number} - 0 to 100
   */
  function calculateSimilarity(pattern1, pattern2) {
    if (!pattern1 || !pattern2) return 0;

    const p1 = pattern1.toUpperCase();
    const p2 = pattern2.toUpperCase();

    if (p1 === p2) return 100;

    const maxLen = Math.max(p1.length, p2.length);
    const minLen = Math.min(p1.length, p2.length);

    let matches = 0;
    for (let i = 0; i < minLen; i++) {
      if (p1[i] === p2[i]) matches++;
    }

    // Penalize length difference
    const lengthPenalty = minLen / maxLen;
    return (matches / maxLen) * 100 * lengthPenalty;
  }

  /**
   * Finds the closest chhanda match even if no exact match
   * @param {string} sisi
   * @param {number} syllablesPerPada
   * @returns {Object|null}
   */
  function findClosestMatch(sisi, syllablesPerPada) {
    const chhandas = ChhandasData.getAll();
    let bestMatch = null;
    let bestScore = -1;

    for (const chhanda of chhandas) {
      const pattern = ChhandasData.getSISIPattern(chhanda.id);
      if (!pattern) continue;

      // Consider chhandas with similar syllable counts
      if (Math.abs(pattern.perPada - syllablesPerPada) > 2) continue;

      const targetPatterns = pattern.patterns || [pattern.pattern];
      const sisiUpper = sisi.toUpperCase();
      const padas = SISIGenerator.splitIntoPadas(sisiUpper, pattern.perPada);

      for (const targetPattern of targetPatterns) {
        let totalSimilarity = 0;
        let count = 0;

        for (const pada of padas) {
          const similarity = calculateSimilarity(pada, targetPattern.substring(0, pada.length));
          totalSimilarity += similarity;
          count++;
        }

        const avgSimilarity = count > 0 ? totalSimilarity / count : 0;

        // Bonus for matching syllable count
        const syllableBonus = pattern.perPada === syllablesPerPada ? 20 : 0;

        const totalScore = avgSimilarity + syllableBonus;

        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestMatch = {
            chhandaId: chhanda.id,
            chhandaName: chhanda.name,
            score: totalScore,
            syllablesPerPada: pattern.perPada,
          };
        }
      }
    }

    return bestMatch;
  }

  /**
   * Analyzes a complete poem and returns line-by-line analysis
   * @param {string} text - Multi-line poem text
   * @returns {Array<{line: string, lineIndex: number, sisi: string, syllableCount: number, matches: Array}>}
   */
  function analyzePoem(text) {
    const lines = SISIGenerator.generateFromTextByLine(text);

    return lines.map((lineData, index) => {
      const syllableCount = lineData.syllables.length;
      const matches = matchChhanda(lineData.sisi, syllableCount);

      return {
        line: lineData.line,
        lineIndex: index,
        sisi: lineData.sisi,
        syllableCount,
        syllables: lineData.syllables,
        matches: matches.slice(0, 3), // Top 3 matches
      };
    });
  }

  /**
   * Gets overall poem analysis
   * @param {string} text - Multi-line poem text
   * @returns {Object}
   */
  function analyzeCompletePoem(text) {
    const lineAnalyses = analyzePoem(text);

    // Count chhanda matches across lines
    const chhandaCounts = {};
    lineAnalyses.forEach(analysis => {
      analysis.matches.forEach(match => {
        if (!chhandaCounts[match.chhandaId]) {
          chhandaCounts[match.chhandaId] = {
            chhandaId: match.chhandaId,
            chhandaName: match.chhandaName,
            count: 0,
            totalConfidence: 0,
          };
        }
        chhandaCounts[match.chhandaId].count++;
        chhandaCounts[match.chhandaId].totalConfidence += match.confidence;
      });
    });

    // Find best overall chhanda
    let bestChhanda = null;
    let bestScore = 0;

    for (const id in chhandaCounts) {
      const entry = chhandaCounts[id];
      const avgConfidence = entry.totalConfidence / entry.count;
      const coverageScore = (entry.count / lineAnalyses.length) * 100;
      const score = (avgConfidence * 0.7) + (coverageScore * 0.3);

      if (score > bestScore) {
        bestScore = score;
        bestChhanda = {
          ...entry,
          avgConfidence,
          coverageScore,
          overallScore: score,
        };
      }
    }

    return {
      lineAnalyses,
      totalLines: lineAnalyses.length,
      bestChhanda,
      chhandaCounts: Object.values(chhandaCounts),
    };
  }

  /**
   * Validates if a poem follows a specific chhanda
   * @param {string} text - Poem text
   * @param {string} chhandaId - Target chhanda
   * @returns {{valid: boolean, confidence: number, deviations: Array, lineResults: Array}}
   */
  function validatePoem(text, chhandaId) {
    const pattern = ChhandasData.getSISIPattern(chhandaId);
    if (!pattern) {
      return { valid: false, confidence: 0, deviations: [], lineResults: [] };
    }

    const lines = SISIGenerator.generateFromTextByLine(text);
    const lineResults = [];
    let totalDeviations = 0;
    let totalMatches = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const result = matchSpecific(line.sisi, chhandaId);

      lineResults.push({
        line: line.line,
        lineIndex: i,
        sisi: line.sisi,
        match: result.match,
        confidence: result.confidence,
        deviations: result.deviations,
      });

      totalDeviations += result.deviations.length;
      if (result.match) totalMatches++;
    }

    const totalLines = lines.length;
    const overallConfidence = totalLines > 0
      ? lineResults.reduce((sum, lr) => sum + lr.confidence, 0) / totalLines
      : 0;

    return {
      valid: totalDeviations === 0,
      confidence: overallConfidence,
      totalLines,
      matchedLines: totalMatches,
      totalDeviations,
      lineResults,
    };
  }

  return {
    matchChhanda,
    matchPoemLines,
    matchSpecific,
    calculateSimilarity,
    findClosestMatch,
    analyzePoem,
    analyzeCompletePoem,
    validatePoem,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.ChhandaMatcher = ChhandaMatcher;
}
