# शार्दूलविक्रीडित, गुरु-लघु (SISI) प्रणाली तथा भारतीय छन्दशास्त्रको सम्पूर्ण मार्गदर्शिका

# Complete Guide to Shardul Vikridit, Guru-Laghu (SISI) System and Classical Indic Prosody

---

# Table of Contents

1. Introduction
2. What is Prosody?
3. History of Indic Prosody
4. Pingala and the Birth of Binary Logic
5. What is a Syllable?
6. Guru and Laghu
7. The SISI System
8. Vowels and Syllable Weight
9. Consonants and Syllable Weight
10. Half-Consonant Rules
11. Conjunct Consonants
12. Anusvāra and Visarga
13. Optional Cases
14. Gana System
15. Binary Representation of Ganas
16. Prastāra
17. Nashta
18. Uddishta
19. Meru (Pascal Triangle)
20. Varna Chhanda
21. Matra Chhanda
22. Shardul Vikridit
23. Complete Shardul Vikridit Analysis
24. Computational Implementation
25. Exercises
26. Reference Tables

---

# 1. Introduction

## English

Classical Indic poetry uses a precise mathematical rhythm system called Chhanda (Prosody). Every syllable is measured and classified according to weight.

The entire system can be reduced into a binary sequence:

- I = Laghu (Light)
- S = Guru (Heavy)

This document refers to this as the SISI system.

## नेपाली

भारतीय छन्दशास्त्र ध्वनि, मात्रा र अक्षरको गणितीय संरचनामा आधारित प्रणाली हो। प्रत्येक अक्षरको तौल नापिन्छ र त्यसलाई दुई वर्गमा राखिन्छ:

- I = लघु
- S = गुरु

यही दुई चिन्हको आधारमा सम्पूर्ण छन्दको संरचना विश्लेषण गर्न सकिन्छ।

---

# 2. What is Prosody? (छन्दशास्त्र)

## English

Prosody is the science of poetic rhythm.

It studies:

- Syllables
- Weight
- Stress
- Rhythm
- Meter

## नेपाली

छन्दशास्त्र कविता वा श्लोकको लय, गति र अक्षरको तौल अध्ययन गर्ने शास्त्र हो।

---

# 3. Historical Background

## English

The oldest known systematic work on prosody is traditionally attributed to Pingala.

Major concepts:

- Guru
- Laghu
- Gana
- Prastāra
- Meru

Many historians regard Pingala's combinatorial methods as an early precursor to binary mathematics.

## नेपाली

छन्दशास्त्रको सबैभन्दा पुरानो व्यवस्थित ग्रन्थ पिङ्गलाचार्यसँग सम्बन्धित मानिन्छ।

उनले:

- गुरु
- लघु
- गण
- प्रस्तार
- मेरु

जस्ता अवधारणाहरू विकसित गरे।

---

# 4. Guru and Laghu

## Fundamental Principle

Every syllable belongs to one of two categories.

| Symbol | Sanskrit | Nepali | English |
| ------ | -------- | ------ | ------- |
| I      | Laghu    | लघु    | Light   |
| S      | Guru     | गुरु   | Heavy   |

---

# 5. Complete Classification of Laghu (I)

## Naturally Laghu

### Independent Vowels

| Sound |
| ----- |
| अ     |
| इ     |
| उ     |
| ऋ     |
| ऌ     |

### Examples

| Word | Syllable |
| ---- | -------- |
| क    |          |
| कि   |          |
| कु   |          |
| कृ   |          |

---

# 6. Complete Classification of Guru (S)

## Long Vowels

| Sound |
| ----- |
| आ     |
| ई     |
| ऊ     |
| ए     |
| ऐ     |
| ओ     |
| औ     |

Examples:

का
की
कू
के
कै
को
कौ

---

# 7. Guru by Position

A short vowel becomes Guru when followed by:

- Half consonant
- Conjunct consonant
- Anusvāra
- Visarga

Examples:

अन्त

अन् = Guru

because न् is a half consonant.

---

# 8. Half-Consonant Rule

## Definition

Any syllable immediately preceding a halant consonant becomes Guru.

Examples:

अर्क
अन्त
वक्त्र
मन्त्र

Breakdown:

अन् → Guru

because it is followed by न्.

---

# 9. Anusvāra Rule

Examples:

कं
शं
वं

All become Guru.

---

# 10. Visarga Rule

Examples:

नमः
कः

Previous syllable becomes Guru.

---

# 11. Conjunct Consonants

Examples:

क्त
त्र
ज्ञ
द्य
द्ध
द्भ
क्ष

The preceding syllable becomes Guru.

---

# 12. Binary SISI Encoding

| Type  | Symbol |
| ----- | ------ |
| Laghu | I      |
| Guru  | S      |

Example:

कवि

क = I

वि = I

Pattern:

II

---

# 13. Gana System

Three syllables form one Gana.

Mnemonic:

यमाताराजभानसलगा

---

## Gana Table

| Gana | Pattern |
| ---- | ------- |
| य    | ISS     |
| म    | SSS     |
| त    | SSI     |
| र    | SIS     |
| ज    | ISI     |
| भ    | SII     |
| न    | III     |
| स    | IIS     |

---

# 14. Binary Interpretation

Laghu = 0

Guru = 1

Example:

ISS

↓

011

This creates a direct mapping between Chhanda and binary mathematics.

---

# 15. Prastāra

Prastāra is the exhaustive enumeration of all Guru-Laghu combinations.

For n syllables:

Total patterns:

2^n

Examples:

n = 3

Total = 8 patterns

III
IIS
ISI
ISS
SII
SIS
SSI
SSS

---

# 16. Meru

Meru is the combinatorial triangle used in Chhanda analysis.

It is mathematically equivalent to Pascal's Triangle.

---

# 17. Varna Chhanda

Based on syllable count.

Examples:

- Anushtubh
- Vasantatilaka
- Mandakranta
- Shikharini
- Shardul Vikridit

---

# 18. Matra Chhanda

Based on mora count.

Laghu = 1 matra

Guru = 2 matras

---

# 19. Shardul Vikridit

## Meaning

Shardula = Tiger

Vikridita = Playing / Leaping

Often translated as:

"The Play of the Tiger"
"The Bounding Tiger Meter"

---

## Characteristics

- 19 syllables per line
- Highly majestic rhythm
- Frequently used in classical Sanskrit poetry

---

## Traditional Pattern

म स ज स त त गुरु

Expanded Guru-Laghu pattern:

SSS | IIS | ISI | IIS | SSI | SSI | S

---

# 20. Beat Mapping Example

1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19

S S S I I S I S I I I S S S I S S I S

---

# 21. Computational Algorithm

Pseudo-code:

1. Split into syllables
2. Determine vowel length
3. Check anusvāra
4. Check visarga
5. Check conjuncts
6. Apply Guru/Laghu rules
7. Convert to SISI code
8. Compare against target meter

---

# 22. Quick Reference

## Laghu (I)

- अ
- इ
- उ
- ऋ
- ऌ
- कि
- कु
- कृ

## Guru (S)

- आ
- ई
- ऊ
- ए
- ऐ
- ओ
- औ
- कं
- कः
- अन्त
- वक्त्र
- मन्त्र

---

# 23. Final Summary

Everything in classical Indic prosody ultimately reduces to one question:

"Is this syllable light or heavy?"

If light:

I

If heavy:

S

From these two symbols emerge:

- Ganas
- Meters
- Prastāra
- Meru
- Shardul Vikridit
- The entire architecture of classical Sanskrit and related poetic traditions.

This makes the Guru-Laghu system one of the oldest known binary classification systems in human intellectual history.
