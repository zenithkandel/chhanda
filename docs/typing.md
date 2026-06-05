# How to Identify Guru (S) and Laghu (I) in Nepali Unicode Text

# नेपाली युनिकोडमा गुरु (S) र लघु (I) छुट्याउने सम्पूर्ण मार्गदर्शिका

---

# Introduction

Most beginners make one mistake:

They look at letters.

Classical prosody does **NOT** count letters.

It counts **syllables (अक्षर)**.

For example:

मेरो

contains four Unicode characters:

म े र ो

but only **two syllables**:

मे + रो

Therefore:

Prosody analyzes:

मे | रो

NOT

म | े | र | ो

---

# The Golden Rule

## English

Never count characters.

Always count syllables.

## नेपाली

कहिल्यै पनि अक्षरगणना (characters) नगर्नुहोस्।

सधैं उच्चारणका एकाइ (syllables) गणना गर्नुहोस्।

---

# What is a Syllable?

A syllable is a unit of pronunciation containing a vowel.

Examples:

| Word     | Syllables         |
| -------- | ----------------- |
| मेरो     | मे + रो           |
| नाम      | ना + म            |
| घर       | घ + र             |
| कविता    | क + वि + ता       |
| विद्यालय | वि + द्या + ल + य |

---

# Why Are Vowels So Important?

Without a vowel, a sound cannot form a complete syllable.

Examples:

क = syllable

कि = syllable

के = syllable

क् = NOT a syllable

---

# Why is "न्" Not Counted?

Consider:

न्

Unicode representation:

न + ्

The sign "्" (Halant/Virama) removes the vowel.

Normal consonant:

न = na

Contains vowel "अ"

Can be pronounced alone.

Therefore:

न = syllable

---

Half consonant:

न्

Pronounced only as:

n

No vowel.

Cannot stand as an independent syllable.

Therefore:

न् = NOT a syllable

---

# The Halant (्)

The symbol:

्

is called:

- Halant
- Virama

Purpose:

Remove the inherent vowel.

Examples:

| Full | Half |
| ---- | ---- |
| क    | क्   |
| न    | न्   |
| म    | म्   |
| र    | र्   |

---

# Why Half-Consonants Matter

Look at:

अन्त

Breakdown:

अन् + त

The syllable:

अ

is immediately followed by:

न्

A closing consonant makes the syllable heavier.

Therefore:

अन् = Guru (S)

---

# The Core Principle

Every syllable belongs to exactly one class.

| Symbol | Meaning       |
| ------ | ------------- |
| I      | Laghu (Light) |
| S      | Guru (Heavy)  |

---

# Step 1: Find the Syllables

Example:

मेरो नाम जेनिथ हो।

Break into pronunciation units:

मे | रो | ना | म | जे | नि | थ | हो

Now classify them.

---

# Step 2: Determine Vowel Length

## Short Vowels

| Vowel |
| ----- |
| अ     |
| इ     |
| उ     |
| ऋ     |
| ऌ     |

Usually Laghu (I)

---

## Long Vowels

| Vowel |
| ----- |
| आ     |
| ई     |
| ऊ     |
| ए     |
| ऐ     |
| ओ     |
| औ     |

Usually Guru (S)

---

# Step 3: Check Each Syllable

Example:

मे

Contains:

ए

Long vowel

Therefore:

मे = S

---

रो

Contains:

ओ

Long vowel

Therefore:

रो = S

---

ना

Contains:

आ

Long vowel

Therefore:

ना = S

---

म

Contains:

short inherent vowel अ

Therefore:

म = I

---

जे

Contains ए

Therefore:

S

---

नि

Contains इ

Therefore:

I

---

थ

Contains inherent अ

Therefore:

I

---

हो

Contains ओ

Therefore:

S

---

# Final Analysis

Sentence:

मेरो नाम जेनिथ हो।

Syllables:

मे | रो | ना | म | जे | नि | थ | हो

Pattern:

S | S | S | I | S | I | I | S

SISI code:

SSSISIIS

---

# Another Example

Sentence:

म घर जान्छु।

Break:

म | घ | र | जान् | छु

---

म

short

I

---

घ

short

I

---

र

short

I

---

जान्

Contains:

जा + न्

Long vowel आ

Also closed by half consonant

Guru

S

---

छु

Short उ

I

---

Pattern

I I I S I

---

# Understanding Closed Syllables

A syllable ending in a consonant is called a closed syllable.

Examples:

अन्त

मन्त्र

शक्त

वक्त्र

भक्त

---

Example:

भक्त

Break:

भक् + त

The syllable "भक्" ends with consonant closure.

Therefore:

Guru

S

---

# Understanding Open Syllables

A syllable ending in a vowel is called an open syllable.

Examples:

क

कि

कु

के

को

---

Open syllables may be Laghu or Guru depending on vowel length.

---

# The Complete Laghu List

Normally Laghu:

अ

इ

उ

ऋ

ऌ

क

ग

त

प

म

कि

गि

ति

पि

कु

गु

तु

पु

कृ

गृ

---

Examples

कवि

क = I

वि = I

Pattern:

II

---

# The Complete Guru List

Always Guru:

आ

ई

ऊ

ए

ऐ

ओ

औ

अं

अः

का

की

कू

के

कै

को

कौ

---

Examples

कौशल

कौ = S

शल = I

Pattern:

SI

---

# The Anusvara Rule

Examples:

कं

वं

शं

सं

हं

The dot:

ं

creates a heavy ending.

Therefore:

Guru

---

# The Visarga Rule

Examples:

कः

नमः

रामः

Visarga:

ः

makes syllable Guru.

---

# Conjunct Consonants

Examples:

क्त

त्र

ज्ञ

क्ष

द्य

द्ध

द्भ

ष्ट

ष्ट्र

---

Word:

शक्ति

Break:

शक् + ति

शक् = Guru

ति = Laghu

Pattern:

SI

---

# Why Does This Happen?

A syllable takes longer to pronounce when blocked by consonants.

Compare:

क

versus

क्त

The second requires more articulation.

Therefore classical prosody treats it as heavier.

---

# The Weight Theory

Laghu = 1 unit

Guru = 2 units

This is fundamentally a timing system.

---

# Think Like Music

Laghu:

Ta

Guru:

Taa

or

Tak

Longer duration.

Therefore heavier.

---

# Unicode Does Not Matter

Important:

Prosody follows pronunciation.

Not Unicode count.

Not byte count.

Not character count.

Not keyboard strokes.

Only pronunciation.

---

# Practical Algorithm

Whenever you see Nepali text:

Step 1

Split into syllables.

Step 2

Find the vowel.

Step 3

Check whether vowel is short or long.

Step 4

Check:

- half consonant
- conjunct consonant
- anusvara
- visarga

Step 5

Assign:

I = Laghu

S = Guru

---

# Quick Reference Card

Laghu (I)

- Short vowel
- Open syllable
- No closing consonant

Examples:

क
कि
कु
कृ
वि
ति

---

Guru (S)

- Long vowel
- Anusvara
- Visarga
- Closed syllable
- Conjunct consonant

Examples:

का
की
कू
के
को
कं
कः
अन्त
मन्त्र
भक्त
शक्ति

---

# Final Mental Model

Do NOT ask:

"How many letters are there?"

Ask:

"How many syllables are there, and how heavy is each one?"

That single question is the foundation of:

- Guru
- Laghu
- Gana
- SISI codes
- Sanskrit prosody
- Nepali prosody
- Shardul Vikridit
- Every classical Indic meter
