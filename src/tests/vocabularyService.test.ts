/**
 * vocabularyService.test.ts
 *
 * Pure logic tests — no React, no DOM, no RTL.
 * Run with: npx vitest run src/tests/vocabularyService.test.ts
 *
 * Covers:
 *  1. getBucket — valid A1 bucket
 *  2. getBucket — word shape (required fields)
 *  3. getBucket — word ID coordinate format
 *  4. getBucket — A2 index offsets (centurionNumber 11 lives at index 0)
 *  5. getBucket — invalid coordinates throw / return nullish
 *  6. getDistractors — always 4 options (correct + 3 distractors)
 *  7. getDistractors — correct answer is among the 4
 *  8. getDistractors — no duplicate options
 *  9. Language toggle — initial language is 'en'
 * 10. Language toggle — toggleLanguage switches to 'ar'
 * 11. Language toggle — toggleLanguage again switches back to 'en'
 * 12. Language toggle — isRTL derived correctly from displayLanguage
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { vocabularyService } from '../services/vocabularyService'
import { useGameStore } from '../store/useGameStore'

vi.mock('../services/profileService', () => ({
  saveProfile: vi.fn(),
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build the 4 quiz options (correct word + 3 distractors), as the quiz engine does. */
function buildOptions(wordIndex: number, centurionIdx: number, bucketIdx: number, level: 'A1' | 'A2') {
  const bucket = vocabularyService.getBucket(level, centurionIdx, bucketIdx)
  const correctWord = bucket.words[wordIndex]
  const distractors = vocabularyService.getDistractors(correctWord, bucket)
  return { correctWord, options: [correctWord, ...distractors] }
}

// ---------------------------------------------------------------------------
// 1–5. getBucket
// ---------------------------------------------------------------------------

describe('vocabularyService — getBucket', () => {

  it('returns exactly 10 words for a valid A1 bucket', () => {
    const bucket = vocabularyService.getBucket('A1', 0, 0)
    expect(bucket.words).toHaveLength(10)
  })

  it('each word has all required fields: id, de, en, ar, sentence, category', () => {
    const bucket = vocabularyService.getBucket('A1', 0, 0)
    for (const word of bucket.words) {
      expect(word).toHaveProperty('id')
      expect(word).toHaveProperty('de')
      expect(word).toHaveProperty('en')
      expect(word).toHaveProperty('ar')
      expect(word).toHaveProperty('sentence')
      expect(word).toHaveProperty('category')
      // All fields should be non-empty strings
      expect(typeof word.id).toBe('string')
      expect(word.id.length).toBeGreaterThan(0)
      expect(typeof word.de).toBe('string')
      expect(word.de.length).toBeGreaterThan(0)
      expect(typeof word.en).toBe('string')
      expect(word.en.length).toBeGreaterThan(0)
      expect(typeof word.ar).toBe('string')
      expect(word.ar.length).toBeGreaterThan(0)
    }
  })

  it('A1 bucket words have IDs starting with "A1-"', () => {
    const bucket = vocabularyService.getBucket('A1', 0, 0)
    for (const word of bucket.words) {
      expect(word.id).toMatch(/^A1-/)
    }
  })

  it('A1 first bucket word IDs follow the coordinate format A1-{centurion}-{bucket}-{position}', () => {
    const bucket = vocabularyService.getBucket('A1', 0, 0)
    // centurionNumber 1, bucketNumber 1, positions 1–10
    for (const word of bucket.words) {
      expect(word.id).toMatch(/^A1-\d+-\d+-\d+$/)
    }
    expect(bucket.words[0].id).toBe('A1-1-1-1')
    expect(bucket.words[9].id).toBe('A1-1-1-10')
  })

  it('A2 centurions start at index 0 (centurionNumber 11): getBucket("A2", 0, 0) returns A2-11-101-* words', () => {
    // The a2 array starts at centurionNumber 11, but it lives at index 0.
    const bucket = vocabularyService.getBucket('A2', 0, 0)
    expect(bucket.words).toHaveLength(10)
    for (const word of bucket.words) {
      // IDs must be A2 words, NOT A1
      expect(word.id).toMatch(/^A2-/)
      expect(word.id).not.toMatch(/^A1-/)
    }
    // The first word of bucket 101 is A2-11-101-1
    expect(bucket.words[0].id).toBe('A2-11-101-1')
  })

  it('A2 second centurion at index 1 (centurionNumber 12) returns A2-12-* words', () => {
    const bucket = vocabularyService.getBucket('A2', 1, 0)
    expect(bucket.words[0].id).toMatch(/^A2-12-/)
  })

  it('throws or returns nullish for a completely invalid centurion index', () => {
    // Index 9999 does not exist in any level
    expect(() => {
      vocabularyService.getBucket('A1', 9999, 0)
    }).toThrow()
  })

  it('throws or returns nullish for a completely invalid bucket index', () => {
    expect(() => {
      vocabularyService.getBucket('A1', 0, 9999)
    }).toThrow()
  })

  it('throws for an invalid level', () => {
    expect(() => {
      // @ts-expect-error intentionally invalid
      vocabularyService.getBucket('C9', 0, 0)
    }).toThrow()
  })

})

// ---------------------------------------------------------------------------
// 6–8. getDistractors / quiz option generation
// ---------------------------------------------------------------------------

describe('Quiz distractor generation (getDistractors)', () => {

  it('always returns exactly 4 options (correct + 3 distractors)', () => {
    // Test across multiple words and buckets
    const testCases = [
      { level: 'A1' as const, c: 0, b: 0, wi: 0 },
      { level: 'A1' as const, c: 0, b: 0, wi: 5 },
      { level: 'A1' as const, c: 0, b: 1, wi: 3 },
      { level: 'A2' as const, c: 0, b: 0, wi: 0 },
      { level: 'A2' as const, c: 1, b: 0, wi: 7 },
    ]
    for (const { level, c, b, wi } of testCases) {
      const { options } = buildOptions(wi, c, b, level)
      expect(options).toHaveLength(4)
    }
  })

  it('the correct answer is always among the 4 options', () => {
    const testCases = [
      { level: 'A1' as const, c: 0, b: 0, wi: 0 },
      { level: 'A1' as const, c: 0, b: 3, wi: 4 },
      { level: 'A2' as const, c: 0, b: 0, wi: 2 },
    ]
    for (const { level, c, b, wi } of testCases) {
      const { correctWord, options } = buildOptions(wi, c, b, level)
      const ids = options.map((o) => o.id)
      expect(ids).toContain(correctWord.id)
    }
  })

  it('no option is a duplicate of another (all 4 IDs are unique)', () => {
    // Run several times to account for randomness in getDistractors
    for (let i = 0; i < 10; i++) {
      const { options } = buildOptions(0, 0, 0, 'A1')
      const ids = options.map((o) => o.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(4)
    }
  })

  it('getDistractors returns exactly 3 words', () => {
    const bucket = vocabularyService.getBucket('A1', 0, 0)
    const correctWord = bucket.words[0]
    const distractors = vocabularyService.getDistractors(correctWord, bucket)
    expect(distractors).toHaveLength(3)
  })

  it('distractors never include the correct word', () => {
    const bucket = vocabularyService.getBucket('A1', 0, 0)
    for (const word of bucket.words) {
      const distractors = vocabularyService.getDistractors(word, bucket)
      const distractorIds = distractors.map((d) => d.id)
      expect(distractorIds).not.toContain(word.id)
    }
  })

})

// ---------------------------------------------------------------------------
// 9–12. Language toggle (Zustand store)
// ---------------------------------------------------------------------------

describe('Language toggle (useGameStore)', () => {

  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.getState().resetSession()
  })

  it('initial displayLanguage is "en"', () => {
    const { displayLanguage } = useGameStore.getState()
    expect(displayLanguage).toBe('en')
  })

  it('toggleLanguage switches from "en" to "ar"', () => {
    useGameStore.getState().toggleLanguage()
    const { displayLanguage } = useGameStore.getState()
    expect(displayLanguage).toBe('ar')
  })

  it('toggleLanguage again switches back from "ar" to "en"', () => {
    useGameStore.getState().toggleLanguage() // en → ar
    useGameStore.getState().toggleLanguage() // ar → en
    const { displayLanguage } = useGameStore.getState()
    expect(displayLanguage).toBe('en')
  })

  it('isRTL is true only when displayLanguage is "ar"', () => {
    // isRTL is derived — not a store field — matching the app's subscription pattern
    const isRTL = (lang: string) => lang === 'ar'

    expect(isRTL(useGameStore.getState().displayLanguage)).toBe(false) // starts 'en'

    useGameStore.getState().toggleLanguage()
    expect(isRTL(useGameStore.getState().displayLanguage)).toBe(true)  // now 'ar'

    useGameStore.getState().toggleLanguage()
    expect(isRTL(useGameStore.getState().displayLanguage)).toBe(false) // back to 'en'
  })

})