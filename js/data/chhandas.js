/**
 * Chhandas Data Module
 * Loads and provides access to chhanda definitions
 */

const ChhandasData = (() => {
  let data = null;

  // Default chhanda patterns (SISI templates)
  // These are the standard patterns for matching
  const SISI_PATTERNS = {
    gayatri: {
      padas: 3,
      perPada: 8,
      pattern: "IISSISII",
      // Note: Gayatri typically uses variations, but this is the base pattern
    },
    anushtubh: {
      padas: 4,
      perPada: 8,
      pattern: "IISSISII",
      // Anushtubh (Chandashtubh) base pattern
    },
    indravajra: {
      padas: 4,
      perPada: 11,
      pattern: "SISIISIISII",
    },
    upendravajra: {
      padas: 4,
      perPada: 11,
      pattern: "ISIISIISIIS",
    },
    upajati: {
      padas: 4,
      perPada: 11,
      // Upajati is a mix of Indravajra and Upendravajra
      // Each line can be either pattern
      patterns: ["SISIISIISII", "ISIISIISIIS"],
    },
    bhujangaprayata: {
      padas: 4,
      perPada: 12,
      pattern: "IIISIISSIIIS",
    },
    totaka: {
      padas: 4,
      perPada: 12,
      pattern: "SSSSIIIIISSS",
    },
    vamshastha: {
      padas: 4,
      perPada: 12,
      pattern: "IISIISIISIIS",
    },
    vasantatilaka: {
      padas: 4,
      perPada: 14,
      pattern: "SISIISIISIISII",
    },
    malini: {
      padas: 4,
      perPada: 15,
      pattern: "ISIISIISIISIII",
    },
    panchachamara: {
      padas: 4,
      perPada: 16,
      pattern: "SISIISIISIISIIII",
    },
    shikhari: {
      padas: 4,
      perPada: 17,
      pattern: "SSSSIIIISSSSIIIII",
    },
    mandakranta: {
      padas: 4,
      perPada: 17,
      pattern: "SSSSIIIIISSSSIIII",
    },
    shardulavikridita: {
      padas: 4,
      perPada: 19,
      pattern: "SSSIISIISIISSSIISII",
    },
    sragdhara: {
      padas: 4,
      perPada: 21,
      pattern: "SSSIISSIISSIIISSIISSS",
    },
  };

  // Traditional gana patterns for each chhanda
  const GANA_PATTERNS = {
    gayatri: "ययट् ययट् ययट्",
    anushtubh: "ययट् ययट् ययट् ययट्",
    indravajra: "रभनय",
    upendravajra: "नरभय",
    upajati: "रभनय/नरभय (mixed)",
    bhujangaprayata: "यययय",
    totaka: "सससस",
    vamshastha: "नसरभ",
    vasantatilaka: "यनतर",
    malini: "जरभन",
    panchachamara: "जरजरजग",
    shikhari: "मसजसतत",
    mandakranta: "मन्दक्रान्ता",
    shardulavikridita: "मसजसततग",
    sragdhara: "मरभनययय",
  };

  // Moods for each chhanda (English)
  const MOODS = {
    sacred: { en: "Sacred", np: "पवित्र" },
    luminous: { en: "Luminous", np: "दीप्त" },
    meditative: { en: "Meditative", np: "ध्यानात्मक" },
    narrative: { en: "Narrative", np: "वर्णनात्मक" },
    conversational: { en: "Conversational", np: "संवादात्मक" },
    universal: { en: "Universal", np: "सार्वभौमिक" },
    heroic: { en: "Heroic", np: "वीरत्वपूर्ण" },
    strong: { en: "Strong", np: "बलियो" },
    dynamic: { en: "Dynamic", np: "गतिशील" },
    elegant: { en: "Elegant", np: "सुन्दर" },
    flowing: { en: "Flowing", np: "प्रवाहित" },
    noble: { en: "Noble", np: "प्रतिष्ठित" },
    philosophical: { en: "Philosophical", np: "दार्शनिक" },
    grand: { en: "Grand", np: "भव्य" },
    balanced: { en: "Balanced", np: "सन्तुलित" },
    devotional: { en: "Devotional", np: "भक्तिपूर्ण" },
    musical: { en: "Musical", np: "संगीतमय" },
    energetic: { en: "Energetic", np: "ऊर्जावान" },
    "chant-like": { en: "Chant-like", np: "मन्त्रजस्तो" },
    romantic: { en: "Romantic", np: "प्रेमात्मक" },
    refined: { en: "Refined", np: "परिष्कृत" },
    beautiful: { en: "Beautiful", np: "सुन्दर" },
    graceful: { en: "Graceful", np: "कृपालु" },
    royal: { en: "Royal", np: "राजसी" },
    ceremonial: { en: "Ceremonial", np: "औपचारिक" },
    majestic: { en: "Majestic", np: "गरिमापूर्ण" },
    elevated: { en: "Elevated", np: "उन्नत" },
    longing: { en: "Longing", np: "तड्पन" },
    separation: { en: "Separation", np: "विछोभ" },
    beauty: { en: "Beauty", np: "सुन्दरता" },
    powerful: { en: "Powerful", np: "शक्तिशाली" },
    epic: { en: "Epic", np: "महाकाव्यात्मक" },
    expansive: { en: "Expansive", np: "विस्तृत" },
    magnificent: { en: "Magnificent", np: "भव्य" },
  };

  // Difficulty levels
  const DIFFICULTY = {
    beginner: { en: "Beginner", np: "शुरुवाती", color: "success" },
    intermediate: { en: "Intermediate", np: "मध्यम", color: "warning" },
    advanced: { en: "Advanced", np: "उन्नत", color: "danger" },
  };

  /**
   * Load chhanda data
   * @returns {Promise<Object>}
   */
  async function loadData() {
    if (data) return data;

    try {
      const response = await fetch('/data/chhandas.json');
      const json = await response.json();
      data = json.chhandas;
      return data;
    } catch (error) {
      console.error('Failed to load chhandas data:', error);
      // Return embedded data as fallback
      data = getEmbeddedData();
      return data;
    }
  }

  /**
   * Get all chhandas
   * @returns {Array<Object>}
   */
  function getAll() {
    return data || getEmbeddedData();
  }

  /**
   * Get chhanda by ID
   * @param {string} id
   * @returns {Object|null}
   */
  function getById(id) {
    const all = getAll();
    return all.find(ch => ch.id === id) || null;
  }

  /**
   * Get SISI pattern for a chhanda
   * @param {string} id
   * @returns {Object|null}
   */
  function getSISIPattern(id) {
    return SISI_PATTERNS[id] || null;
  }

  /**
   * Get gana pattern for a chhanda
   * @param {string} id
   * @returns {string|null}
   */
  function getGanaPattern(id) {
    return GANA_PATTERNS[id] || null;
  }

  /**
   * Get mood information
   * @param {string} moodId
   * @returns {Object|null}
   */
  function getMood(moodId) {
    return MOODS[moodId] || null;
  }

  /**
   * Get difficulty information
   * @param {string} level
   * @returns {Object|null}
   */
  function getDifficulty(level) {
    return DIFFICULTY[level] || null;
  }

  /**
   * Filter chhandas by criteria
   * @param {Object} criteria - { syllablesPerPada, mood, difficulty, search }
   * @returns {Array<Object>}
   */
  function filter(criteria = {}) {
    let results = getAll();

    if (criteria.syllablesPerPada) {
      results = results.filter(ch => ch.syllablesPerPada === criteria.syllablesPerPada);
    }

    if (criteria.mood) {
      results = results.filter(ch => ch.mood.includes(criteria.mood));
    }

    if (criteria.difficulty) {
      results = results.filter(ch => ch.difficulty === criteria.difficulty);
    }

    if (criteria.search) {
      const search = criteria.search.toLowerCase();
      results = results.filter(ch =>
        ch.name.en.toLowerCase().includes(search) ||
        ch.name.np.includes(search) ||
        ch.description.en.toLowerCase().includes(search) ||
        ch.description.np.includes(search)
      );
    }

    return results;
  }

  /**
   * Get unique syllable counts
   * @returns {number[]}
   */
  function getUniqueSyllableCounts() {
    const all = getAll();
    const counts = new Set(all.map(ch => ch.syllablesPerPada));
    return Array.from(counts).sort((a, b) => a - b);
  }

  /**
   * Get unique moods
   * @returns {string[]}
   */
  function getUniqueMoods() {
    const all = getAll();
    const moods = new Set();
    all.forEach(ch => ch.mood.forEach(m => moods.add(m)));
    return Array.from(moods).sort();
  }

  /**
   * Sort chhandas by different criteria
   * @param {string} sortBy - 'name', 'syllables', 'popularity'
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array<Object>}
   */
  function sort(sortBy = 'syllables', order = 'asc') {
    const all = getAll();
    const sorted = [...all];

    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.en.localeCompare(b.name.en);
          break;
        case 'syllables':
          comparison = a.syllablesPerPada - b.syllablesPerPada;
          break;
        case 'popularity':
          comparison = a.popularity - b.popularity;
          break;
        default:
          comparison = 0;
      }
      return order === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }

  /**
   * Embedded data fallback
   */
  function getEmbeddedData() {
    return [
      { id: "gayatri", name: { en: "Gayatri", np: "गायत्री" }, syllablesPerPada: 8, totalSyllables: 24, padas: 3, difficulty: "beginner", popularity: 95, mood: ["sacred", "luminous", "meditative"] },
      { id: "anushtubh", name: { en: "Anushtubh", np: "अनुष्टुप्" }, syllablesPerPada: 8, totalSyllables: 32, padas: 4, difficulty: "beginner", popularity: 98, mood: ["narrative", "conversational", "universal"] },
      { id: "indravajra", name: { en: "Indravajra", np: "इन्द्रवज्रा" }, syllablesPerPada: 11, totalSyllables: 44, padas: 4, difficulty: "intermediate", popularity: 80, mood: ["heroic", "strong", "dynamic"] },
      { id: "upendravajra", name: { en: "Upendravajra", np: "उपेन्द्रवज्रा" }, syllablesPerPada: 11, totalSyllables: 44, padas: 4, difficulty: "intermediate", popularity: 78, mood: ["elegant", "flowing", "noble"] },
      { id: "upajati", name: { en: "Upajāti", np: "उपजाति" }, syllablesPerPada: 11, totalSyllables: 44, padas: 4, difficulty: "intermediate", popularity: 88, mood: ["philosophical", "grand", "balanced"] },
      { id: "bhujangaprayata", name: { en: "Bhujanga-prayāta", np: "भुजङ्गप्रयात" }, syllablesPerPada: 12, totalSyllables: 48, padas: 4, difficulty: "intermediate", popularity: 75, mood: ["devotional", "flowing", "musical"] },
      { id: "totaka", name: { en: "Toṭaka", np: "तोटक" }, syllablesPerPada: 12, totalSyllables: 48, padas: 4, difficulty: "intermediate", popularity: 72, mood: ["energetic", "rhythmic", "chant-like"] },
      { id: "vamshastha", name: { en: "Vaṃśastha", np: "वंशस्थ" }, syllablesPerPada: 12, totalSyllables: 48, padas: 4, difficulty: "intermediate", popularity: 70, mood: ["balanced", "narrative"] },
      { id: "vasantatilaka", name: { en: "Vasantatilakā", np: "वसन्ततिलका" }, syllablesPerPada: 14, totalSyllables: 56, padas: 4, difficulty: "advanced", popularity: 82, mood: ["romantic", "refined", "beautiful"] },
      { id: "malini", name: { en: "Mālinī", np: "मालिनी" }, syllablesPerPada: 15, totalSyllables: 60, padas: 4, difficulty: "advanced", popularity: 76, mood: ["graceful", "devotional"] },
      { id: "panchachamara", name: { en: "Pañcacāmara", np: "पञ्चचामर" }, syllablesPerPada: 16, totalSyllables: 64, padas: 4, difficulty: "advanced", popularity: 68, mood: ["royal", "ceremonial", "majestic"] },
      { id: "shikhari", name: { en: "Śikhariṇī", np: "शिखरिणी" }, syllablesPerPada: 17, totalSyllables: 68, padas: 4, difficulty: "advanced", popularity: 74, mood: ["elevated", "noble", "grand"] },
      { id: "mandakranta", name: { en: "Mandākrāntā", np: "मन्दाक्रान्ता" }, syllablesPerPada: 17, totalSyllables: 68, padas: 4, difficulty: "advanced", popularity: 92, mood: ["longing", "separation", "beauty", "romance"] },
      { id: "shardulavikridita", name: { en: "Śārdūlavikrīḍita", np: "शार्दूलविक्रीडित" }, syllablesPerPada: 19, totalSyllables: 76, padas: 4, difficulty: "advanced", popularity: 85, mood: ["heroic", "majestic", "philosophical", "powerful"] },
      { id: "sragdhara", name: { en: "Sragdharā", np: "स्रग्धरा" }, syllablesPerPada: 21, totalSyllables: 84, padas: 4, difficulty: "advanced", popularity: 70, mood: ["epic", "expansive", "magnificent"] },
    ];
  }

  return {
    loadData,
    getAll,
    getById,
    getSISIPattern,
    getGanaPattern,
    getMood,
    getDifficulty,
    filter,
    sort,
    getUniqueSyllableCounts,
    getUniqueMoods,
    SISI_PATTERNS,
    GANA_PATTERNS,
    MOODS,
    DIFFICULTY,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.ChhandasData = ChhandasData;
}
